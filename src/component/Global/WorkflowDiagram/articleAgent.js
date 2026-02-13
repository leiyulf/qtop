import * as z from "zod";
import { SystemMessage, AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { StateGraph, START, END, Annotation, MessagesAnnotation } from "@langchain/langgraph";
import { sendIoState, sendIoLog, sendIoConfirmation } from "../../tool/socket.js";
import dayjs from "dayjs";
import { calculateTextSimilarity } from "../../tool/textUtils.js";
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 阿里云百炼API配置
const DASHSCOPE_API_KEY = 'sk-be7a04ab6a5b42718ee31e4812b95503';
// wan2.6-t2i 新模型使用同步调用端点
const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

// 任务管理器 - 存储运行中的任务
const runningTasks = new Map();

/**
 * 检查任务是否已取消
 */
function checkTaskCancelled(taskId) {
  const task = runningTasks.get(taskId);
  if (task && task.cancelled) {
    throw new Error('TASK_CANCELLED');
  }
}

/**
 * 停止智能体
 * @param {string} taskId - 任务ID
 * @returns {Object} 停止结果
 */
function stopAgent(taskId) {
  if (!taskId) {
    // 如果没有提供taskId，停止所有任务
    if (runningTasks.size === 0) {
      return { success: false, message: '没有运行中的任务' };
    }
    for (const [id, task] of runningTasks) {
      task.cancelled = true;
    }
    return { success: true, message: `已停止所有 ${runningTasks.size} 个任务` };
  }

  const task = runningTasks.get(taskId);
  if (!task) {
    return { success: false, message: `任务 ${taskId} 不存在或已结束` };
  }

  task.cancelled = true;
  return { success: true, message: `任务 ${taskId} 已标记为停止` };
}

/**
 * 获取运行中的任务列表
 * @returns {Array} 任务列表
 */
function getRunningTasks() {
  const tasks = [];
  for (const [id, task] of runningTasks) {
    tasks.push({
      taskId: id,
      startTime: task.startTime,
      cancelled: task.cancelled,
      params: task.params
    });
  }
  return tasks;
}

/**
 * 初始化节点
 */
async function initializeNode(state, model, io, taskId) {
  checkTaskCancelled(taskId);
  sendIoState({ io, nodeName: 'initializeNode', status: 'start' })

  // 获取参数
  const { wordCount, articleTags, complateArticle, additionalNote } = state;
  // 构建标签描述字符串
  let tagsDescription = '';
  if (articleTags && Object.keys(articleTags).length > 0) {
    tagsDescription = '可用的标签包括：';
    for (const [category, tags] of Object.entries(articleTags)) {
      tagsDescription += `【${category}】: ${tags.join(', ')}; `;
    }
  }

  // 构建历史文章标题列表
  let historyTitles = '';
  if (complateArticle && complateArticle.length > 0) {
    historyTitles = '\n\n已生成的文章标题（请避免生成类似主题的内容）：\n';
    complateArticle.forEach((article, index) => {
      historyTitles += `${index + 1}. ${article.title}\n`;
    });
  }

  // 构建系统消息
  const systemMessageContent = `你是一个专业的QMS（质量管理体系）文章生成助手。根据提供的标签和要求生成高质量的专业文章。${tagsDescription ? `\n\n${tagsDescription}` : ''}${historyTitles}

要求：
1. 文章内容约为${wordCount || 100}字
2. 从可用标签中选择1-N个作为文章主题
3. 内容应专业、准确且具有实际应用价值
4. 确保文章逻辑清晰，结构完整
5. 避免与已生成的文章标题重复或相似${additionalNote ? `\n6. 补充要求：${additionalNote}` : ''}`;

  // 构建人类消息
  const humanMessageContent = `请基于以上要求生成一篇专业的QMS文章，从提供的标签中选择合适的内容作为主题进行撰写。如果提供了标签，请务必参考这些标签来组织文章内容。特别注意避免与已生成的文章主题重复。`;

  // 节点执行完成
  await new Promise(resolve => setTimeout(resolve, 1000));
  sendIoState({ io, nodeName: 'initializeNode', status: 'complete' })
  return {
    messages: [
      new SystemMessage(systemMessageContent),
      new HumanMessage(humanMessageContent),
    ],
    count: 1,
  };
}

/**
 * 文章生成节点
 */
async function articleGenerateNode(state, model, io, taskId) {
  checkTaskCancelled(taskId);
  sendIoState({ io, nodeName: 'articleGenerateNode', status: 'start' })

  // 如果是重新生成，需要增加重试计数
  const isReRegeneration = state.reviewStatus === 'regenerate';
  let response;

  if (isReRegeneration) {
    // 如果是重新生成，需要带上之前的评审反馈信息
    const regeneratePrompt = `根据以下评审反馈重新生成文章：

${state.reviewFeedback}

请根据上述反馈改进文章内容。`;

    response = await model.invoke([
      ...state.messages,
      new HumanMessage(regeneratePrompt)
    ]);
  } else {
    response = await model.invoke([
      ...state.messages,
    ]);
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  sendIoState({ io, nodeName: 'articleGenerateNode', status: 'complete' })
  console.log('---------------------------81---------------------------');
  console.log(response.content);
  return {
    messages: [response],
    count: 1,
    currentArticle: response.content,
    // 如果是重新生成，增加重试计数
    regenerateCount: isReRegeneration ? (state.regenerateCount || 0) + 1 : 0,
  };
}

/**
 * 文章评审节点
 */
async function articleReviewNode(state, model, io, taskId) {
  checkTaskCancelled(taskId);
  sendIoState({ io, nodeName: 'articleReviewNode', status: 'start' })

  // 获取当前文章和之前的文章
  const currentArticle = state.currentArticle || '';
  const allArticles = state.complateArticle || [];

  // 使用AI检查重复度
  const isDuplicate = await checkArticleDuplicationByAI(currentArticle, allArticles, model);

  // 根据重复度检查结果决定是否需要重新生成
  const reviewPassed = !isDuplicate.isDuplicate;

  // 发送评审状态
  await new Promise(resolve => setTimeout(resolve, 1000));
  sendIoState({
    io,
    nodeName: 'articleReviewNode',
    status: 'complete'
  });

  console.log('---------------------------133---------------------------');
  console.log(currentArticle);
  return {
    count: 1,
    reviewStatus: reviewPassed ? 'approved' : 'regenerate',
    currentArticle: currentArticle,
    reviewFeedback: isDuplicate.reason,
  };
}

/**
 * 结构优化节点
 */
async function structureOptimizeNode(state, model, io, taskId) {
  checkTaskCancelled(taskId);
  sendIoState({ io, nodeName: 'structureOptimizeNode', status: 'start' })

  const currentArticle = state.currentArticle || '';

  // 构建提示词，将文章转换为带有HTML结构的格式
  const structurePrompt = `
  请将以下文章内容转换为结构化的HTML格式，并自动生成合适的标题层级（h1, h2, h3等）：
  
  文章内容：
  ${currentArticle}
  
  要求：
  1. 分析文章内容结构，合理分配h1、h2、h3标题层级
  2. 使用合适的HTML标签格式化内容（如p、ul、ol、li等）
  3. 保持原文内容不变，只添加结构化标签
  4. 确保HTML格式正确，语义清晰
  5. 不要添加CSS样式或script标签
  `;

  const response = await model.invoke([
    new SystemMessage("你是一个专业的文档结构化助手，负责将普通文本转换为结构化的HTML格式，合理分配标题层级和内容标签。"),
    new HumanMessage(structurePrompt)
  ]);

  // 清理Markdown代码块标记（如 ```html ... ```）
  let cleanedContent = response.content
    .replace(/^```(?:html)?\s*\n?/i, '')  // 移除开头的 ```html 或 ```
    .replace(/\n?```\s*$/i, '');           // 移除结尾的 ```

  console.log('---------------------------172---------------------------');
  console.log(cleanedContent);

  await new Promise(resolve => setTimeout(resolve, 1000));
  sendIoState({ io, nodeName: 'structureOptimizeNode', status: 'complete' })
  return {
    messages: [response],
    count: 1,
    currentArticle: cleanedContent, // 更新为清理后的结构化文章
  };
}

/**
 * 下载图片并保存到本地存储
 * @param {string} imageUrl - 图片URL
 * @returns {Promise<string|null>} 本地图片URL路径
 */
async function downloadAndSaveImage(imageUrl) {
  try {
    // 下载图片
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error('下载图片失败:', response.status);
      return null;
    }

    // 获取图片buffer
    const imageBuffer = await response.arrayBuffer();
    
    // 生成文件名
    const filename = `${crypto.randomUUID()}.png`;
    
    // 确保存储目录存在
    const imageStorageDir = path.join(__dirname, '../../storage/image');
    if (!fs.existsSync(imageStorageDir)) {
      fs.mkdirSync(imageStorageDir, { recursive: true });
    }
    
    // 保存图片到本地
    const filePath = path.join(imageStorageDir, filename);
    fs.writeFileSync(filePath, Buffer.from(imageBuffer));
    
    console.log('图片已保存到本地:', filePath);
    
    // 返回本地URL路径
    return `/storage/image/${filename}`;
  } catch (error) {
    console.error('保存图片到本地失败:', error);
    return null;
  }
}

/**
 * 调用阿里云百炼API生成图片（同步方式）
 * @param {string} prompt - 图片描述提示词
 * @param {string} size - 图片尺寸，默认1280*720
 * @returns {Promise<string|null>} 本地图片URL路径
 */
async function generateImageByAlibaba(prompt, size = '1280*720') {
  try {
    const response = await fetch(DASHSCOPE_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'wan2.6-t2i',
        input: {
          messages: [
            {
              role: 'user',
              content: [
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        parameters: {
          size: size,
          n: 1,
          watermark: false,
          prompt_extend: true
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('图片生成API调用失败:', errorData);
      return null;
    }

    const data = await response.json();
    
    // 提取图片URL
    let remoteImageUrl = null;
    if (data.output && data.output.choices && data.output.choices.length > 0) {
      const choice = data.output.choices[0];
      if (choice.message && choice.message.content && choice.message.content.length > 0) {
        remoteImageUrl = choice.message.content[0].image || null;
      }
    }
    
    if (!remoteImageUrl) {
      console.error('未获取到远程图片URL');
      return null;
    }
    
    console.log('远程图片URL:', remoteImageUrl);
    
    // 下载图片并保存到本地
    const localImageUrl = await downloadAndSaveImage(remoteImageUrl);
    return localImageUrl;
    
  } catch (error) {
    console.error('图片生成失败:', error);
    return null;
  }
}

/**
 * 图片生成节点 - 根据文章内容生成配图和封面
 */
async function imageGenerateNode(state, model, io, taskId) {
  checkTaskCancelled(taskId);
  sendIoState({ io, nodeName: 'imageGenerateNode', status: 'start' })

  const currentArticle = state.currentArticle || '';
  
  // 使用AI根据文章内容生成配图描述
  const imageAnalysisPrompt = `请根据以下QMS（质量管理体系）文章内容，生成一张配图的中文描述提示词。

文章内容：
${currentArticle}

要求：
1. 生成的图片描述应与文章主题高度相关
2. 描述可以是：概念示意图、流程图解、场景插画、数据可视化、或者与主题相关的象征性图像
3. 即使是纯文字性内容，也可以生成抽象的概念图或主题相关的场景图来增强视觉效果
4. 描述应简洁明了，适合AI文生图模型理解

请直接返回图片描述提示词，不要包含任何其他说明文字。`;

  // 使用AI根据文章内容生成封面描述
  const coverAnalysisPrompt = `请根据以下QMS（质量管理体系）文章内容，生成一张文章封面的中文描述提示词。

文章内容：
${currentArticle}

要求：
1. 封面图应该大气、专业、有视觉冲击力
2. 突出文章主题，能够吸引读者点击阅读
3. 适合作为文章列表或卡片展示的封面图
4. 描述应简洁明了，适合AI文生图模型理解

请直接返回封面图片描述提示词，不要包含任何其他说明文字。`;

  let imagePrompt = '';
  let coverPrompt = '';
  let imageUrl = null;
  let coverUrl = null;

  try {
    // 生成配图描述
    const analysisResponse = await model.invoke([
      new SystemMessage("你是一个专业的配图设计助手，负责根据文章内容生成合适的图片描述，让文章更加生动丰富。"),
      new HumanMessage(imageAnalysisPrompt)
    ]);

    imagePrompt = analysisResponse.content
      .replace(/^```(?:text)?\s*\n?/i, '')
      .replace(/\n?```\s*$/i, '')
      .trim();

    console.log('---------------------------配图描述---------------------------');
    console.log(imagePrompt);

    // 生成封面描述
    const coverResponse = await model.invoke([
      new SystemMessage("你是一个专业的封面设计助手，负责根据文章内容生成吸引人的封面图片描述。"),
      new HumanMessage(coverAnalysisPrompt)
    ]);

    coverPrompt = coverResponse.content
      .replace(/^```(?:text)?\s*\n?/i, '')
      .replace(/\n?```\s*$/i, '')
      .trim();

    console.log('---------------------------封面描述---------------------------');
    console.log(coverPrompt);

    // 调用阿里云API生成配图
    if (imagePrompt) {
      imageUrl = await generateImageByAlibaba(imagePrompt);
      console.log('---------------------------生成配图URL---------------------------');
      console.log(imageUrl);
    }

    // 调用阿里云API生成封面（使用16:9比例）
    if (coverPrompt) {
      coverUrl = await generateImageByAlibaba(coverPrompt, '1920*1080');
      console.log('---------------------------生成封面URL---------------------------');
      console.log(coverUrl);
    }
  } catch (error) {
    console.error('图片生成失败:', error);
    // 失败时不阻塞流程，继续执行
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  sendIoState({ 
    io, 
    nodeName: 'imageGenerateNode', 
    status: 'complete',
    data: { hasImage: !!imageUrl, imageUrl: imageUrl, coverUrl: coverUrl }
  });

  return {
    count: 1,
    currentArticleImage: imageUrl, // 生成的配图URL
    currentArticleCover: coverUrl, // 生成的封面URL
  };
}

/**
 * 最终生成节点
 */
async function finalEditNode(state, model, io, taskId) {
  checkTaskCancelled(taskId);
  sendIoState({ io, nodeName: 'finalEditNode', status: 'start' })

  // 获取当前经过结构优化的文章、配图和封面
  let currentArticle = state.currentArticle || '';
  const imageUrl = state.currentArticleImage || null;
  const coverUrl = state.currentArticleCover || null;

  console.log('---------------------------213---------------------------');
  console.log(currentArticle);

  // 如果有图片，让AI分析文章并决定图片插入位置
  if (imageUrl) {
    const imageInsertionPrompt = `请分析以下HTML格式的文章内容，决定将配图插入到哪个位置最合适。

文章内容：
${currentArticle}

配图URL：${imageUrl}

要求：
1. 分析文章结构和内容，找到最适合插入配图的位置
2. 配图应该与周围的文字内容相关联，有助于读者理解
3. 可能的位置包括：标题后、某个段落前、两个段落之间等
4. 返回完整的文章HTML内容，在合适位置插入以下img标签（注意：图片宽度60%，水平居中，长方形比例）：
   <img src="${imageUrl}" alt="文章配图" style="width: 60%; height: auto; display: block; margin: 20px auto;" />
5. 只返回HTML内容，不要添加任何说明文字
6. 保持原文的HTML结构和格式不变，仅插入图片`;

    try {
      const insertionResponse = await model.invoke([
        new SystemMessage("你是一个专业的文章排版助手，负责将配图插入到文章最合适的位置，使图文结合更自然、更有表现力。"),
        new HumanMessage(imageInsertionPrompt)
      ]);

      // 清理响应内容
      let articleWithImage = insertionResponse.content
        .replace(/^```(?:html)?\s*\n?/i, '')
        .replace(/\n?```\s*$/i, '')
        .trim();

      console.log('---------------------------AI插入图片后的文章---------------------------');
      console.log(articleWithImage);

      // 使用AI返回的内容
      if (articleWithImage && articleWithImage.includes('<img')) {
        currentArticle = articleWithImage;
      } else {
        // 如果AI返回的内容没有图片，在开头插入
        const imageHtml = `<img src="${imageUrl}" alt="文章配图" style="width: 60%; height: auto; display: block; margin: 20px auto;" />\n\n`;
        currentArticle = imageHtml + currentArticle;
      }
    } catch (error) {
      console.error('AI插入图片失败:', error);
      // 失败时在开头插入图片
      const imageHtml = `<img src="${imageUrl}" alt="文章配图" style="width: 60%; height: auto; display: block; margin: 20px auto;" />\n\n`;
      currentArticle = imageHtml + currentArticle;
    }
  }

  //生成标题
  const titleResponse = await model.invoke([
    new SystemMessage("你是一个专业的文章标题生成助手。"),
    new HumanMessage(`请根据以下文章内容生成一个简洁且专业的标题，直接返回标题文字，不要包含任何多余的说明、引号或Markdown标记：\n\n${currentArticle}`)
  ]);
  let title = titleResponse.content.trim().replace(/^["']|["']$/g, '');

  // 将通过评审的当前文章添加到已完成的文章列表
  const updatedCompleteArticles = [...(state.complateArticle || []), {
    title,
    content: currentArticle,
    imageUrl: imageUrl, // 保留配图URL
    coverUrl: coverUrl, // 封面URL（不嵌入文章，只传回前端）
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }];
  const newGeneratedCount = (state.generatedCount || 0) + 1;


  sendIoLog({ io, nodeName: 'finalEditNode', value: updatedCompleteArticles, log: false, type: 'text' })
  await new Promise(resolve => setTimeout(resolve, 1000));
  sendIoState({ io, nodeName: 'finalEditNode', status: 'complete' })

  return {
    count: 1,
    complateArticle: updatedCompleteArticles,
    generatedCount: newGeneratedCount,
    reviewStatus: 'pending',
    regenerateCount: 0,
    currentArticle: '',
  };
}

/**
 * 创建智能体
 * @param {Object} model - AI模型实例
 * @param {Object} io - Socket.IO实例
 * @param {string} taskId - 任务ID
 * @returns {Object} 编译后的智能体
 */
function createAgent(model, io = null, taskId = null, params = {}) {
  const MessagesState = Annotation.Root({
    ...MessagesAnnotation.spec,
    count: Annotation({
      reducer: (x, y) => x + y,
      default: () => 0,
    }),
    articleCount: Annotation({
      reducer: (x, y) => y,
      default: () => 5,
    }),
    wordCount: Annotation({
      reducer: (x, y) => y,
      default: () => 500,
    }),
    articleTags: Annotation({
      reducer: (x, y) => y,
      default: () => { },
    }),
    additionalNote: Annotation({
      reducer: (x, y) => y,
      default: () => '',
    }),
    currentArticle: Annotation({
      reducer: (x, y) => y,
      default: () => '',
    }),
    complateArticle: Annotation({
      reducer: (x, y) => y,
      default: () => [],
    }),
    currentArticleImage: Annotation({
      reducer: (x, y) => y,
      default: () => null,
    }),
    currentArticleCover: Annotation({
      reducer: (x, y) => y,
      default: () => null,
    }),
    generatedCount: Annotation({
      reducer: (x, y) => y,
      default: () => 0,
    }),
    reviewStatus: Annotation({
      reducer: (x, y) => y,
      default: () => 'pending',
    }),
    reviewFeedback: Annotation({
      reducer: (x, y) => y,
      default: () => '',
    }),
    regenerateCount: Annotation({
      reducer: (x, y) => y,  // 使用替换而非累加，确保可以重置
      default: () => 0,
    })
  });

  const shouldRegenerate = (state) => {
    // 检查是否需要重新生成（只基于重复性检查）
    if (state.reviewStatus === 'regenerate') {
      // 检查重试次数，避免无限循环
      if ((state.regenerateCount || 0) >= 3) {  // 最多重试3次
        console.log(`达到最大重试次数，继续后续流程`);
        return "continue";
      }
      return "regenerate";
    }
    return "continue";
  };

  const shouldContinueGeneration = (state) => {
    // 检查是否已生成足够数量的文章
    const generated = state.generatedCount || 0;
    const target = state.articleCount || 5;

    if (generated >= target) {
      console.log(`已生成 ${generated}/${target} 篇文章，结束生成`);
      return "end";
    }

    console.log(`已生成 ${generated}/${target} 篇文章，继续生成`);
    return "continue";
  };

  const agent = new StateGraph(MessagesState)
    .addNode("initializeNode", (state) => initializeNode(state, model, io, taskId))
    .addNode("articleGenerateNode", (state) => articleGenerateNode(state, model, io, taskId))
    .addNode("articleReviewNode", (state) => articleReviewNode(state, model, io, taskId))
    .addNode("structureOptimizeNode", (state) => structureOptimizeNode(state, model, io, taskId))
    .addNode("imageGenerateNode", (state) => imageGenerateNode(state, model, io, taskId))
    .addNode("finalEditNode", (state) => finalEditNode(state, model, io, taskId))
    .addEdge(START, "initializeNode")
    .addEdge("initializeNode", "articleGenerateNode")
    .addEdge("articleGenerateNode", "articleReviewNode")
    .addConditionalEdges(
      "articleReviewNode",
      shouldRegenerate,
      {
        "regenerate": "articleGenerateNode",  // 未通过评审，返回生成节点
        "continue": "structureOptimizeNode"   // 通过评审，进入结构优化节点
      }
    )
    .addEdge("structureOptimizeNode", "imageGenerateNode")
    .addEdge("imageGenerateNode", "finalEditNode")
    .addConditionalEdges(
      "finalEditNode",
      shouldContinueGeneration,
      {
        "continue": "initializeNode",        // 继续生成下一篇文章
        "end": END                           // 已完成所有文章，结束流程
      }
    )
    .compile();

  return agent;
}



/**
 * 使用AI检查文章重复度（基于历史标题与当前内容对比）
 * @param {string} currentArticle - 当前文章内容
 * @param {Array} allArticles - 已生成的文章列表
 * @param {Object} model - AI模型实例
 * @returns {Object} 重复度检查结果
 */
async function checkArticleDuplicationByAI(currentArticle, allArticles, model) {
  if (!currentArticle || currentArticle.trim().length === 0) {
    return {
      isDuplicate: true,
      reason: "当前文章为空"
    };
  }

  if (!allArticles || allArticles.length === 0) {
    // 如果没有历史文章，则不存在重复
    return {
      isDuplicate: false,
      reason: "没有历史文章用于比较"
    };
  }

  // 构建历史文章标题列表
  const historyTitles = allArticles.map((article, index) => 
    `${index + 1}. ${article.title}`
  ).join('\n');

  // 使用AI判断当前文章内容是否与历史标题重复
  const reviewPrompt = `你是一个专业的文章评审助手。请判断以下新生成的文章内容是否与历史文章标题所代表的主题重复。

历史文章标题：
${historyTitles}

新生成的文章内容：
${currentArticle}

请判断：
1. 新文章的主题是否与任何一个历史标题重复或高度相似
2. 如果重复，说明与哪个标题重复以及原因
3. 如果不重复，说明新文章的独特性

请严格按照以下JSON格式返回（不要包含其他任何文字）：
{
  "isDuplicate": true/false,
  "reason": "详细说明"
}`;

  try {
    const response = await model.invoke([
      new SystemMessage("你是一个专业的文章评审助手，负责判断文章主题是否重复。请严格按照要求的JSON格式返回结果。"),
      new HumanMessage(reviewPrompt)
    ]);

    // 清理响应内容，移除可能的markdown代码块标记
    let cleanedContent = response.content
      .replace(/^```(?:json)?\s*\n?/i, '')
      .replace(/\n?```\s*$/i, '')
      .trim();

    // 解析AI返回的结果
    const result = JSON.parse(cleanedContent);

    return {
      isDuplicate: result.isDuplicate || false,
      reason: result.reason || "AI评审完成"
    };
  } catch (error) {
    console.error('AI评审失败:', error);
    // 如果AI评审失败，默认不重复以避免阻塞流程
    return {
      isDuplicate: false,
      reason: "AI评审失败，默认通过"
    };
  }
}

/**
 * 运行智能体
 * @param {Object} model - AI模型实例
 * @param {Object} io - Socket.IO实例
 * @param {Object} params - 参数对象
 * @returns {string} 任务ID
 */
function runAgent(model, io = null, params = {}) {
  // 生成唯一任务ID
  const taskId = crypto.randomUUID();

  // 注册任务
  runningTasks.set(taskId, {
    startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    cancelled: false,
    params: params
  });

  // 异步执行任务
  (async () => {
    try {
      // 节点执行开始，发送开始状态
      sendIoState({ io, nodeName: '__start__', status: 'start' });
      sendIoLog({ io, nodeName: '__start__', value: 'start', log: true, type: 'text' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      const agent = createAgent(model, io, taskId, params);
      const { articleCount, wordCount, articleTags, additionalNote } = params;
      const initialState = {
        articleCount: articleCount || 5,
        wordCount: wordCount || 500,
        articleTags: articleTags || {},
        additionalNote: additionalNote || '',
        regenerateCount: 0,
        generatedCount: 0,
        complateArticle: [],
      };
      const result = await agent.invoke(initialState, {
        recursionLimit: 999,
      });

      // 节点执行完成，发送结束状态
      await new Promise(resolve => setTimeout(resolve, 1000));
      sendIoState({ io, nodeName: '__end__', status: 'start' });
      sendIoLog({ io, nodeName: '__end__', value: 'end', log: true, type: 'text' });
    } catch (error) {
      if (error.message === 'TASK_CANCELLED') {
        console.log(`任务 ${taskId} 已被用户停止`);
        sendIoState({ io, nodeName: '__end__', status: 'start' });
        sendIoLog({ io, nodeName: '__end__', value: 'end', log: true, type: 'text' });
      } else {
        console.error(`任务 ${taskId} 执行失败:`, error);
        sendIoState({ io, nodeName: '__end__', status: 'start' });
        sendIoLog({ io, nodeName: '__end__', value: 'end', log: true, type: 'text' });
      }
    } finally {
      // 清理任务
      runningTasks.delete(taskId);
    }
  })();

  // 返回任务ID
  return taskId;
}

export { createAgent, runAgent, stopAgent, getRunningTasks };
