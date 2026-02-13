import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Popover, Drawer } from 'antd';
import moment from 'moment';
import { RobotOutlined, PlayCircleOutlined, CopyOutlined, SettingOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import OpenAI from "openai";
import ReactMarkdown from 'react-markdown';

//接口

//组件
import ReactQuill from 'react-quill';
import PageLoading from '../PageLoading/PageLoading';

//方法

//样式
import './QuillBox.css';

//模板
const QuillBox = (props) => {

  let {
    onCopy = () => { },
  } = props;

  //init
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-3cbcd37eacf7481eab4900b03ec954a5',
    dangerouslyAllowBrowser: true
  });
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  //useState
  const [showAi, setShowAi] = useState(false);
  const [open, setOpen] = useState(false);
  const [activePromptId, setActivePromptId] = useState(1);
  const [activePrompt, setActivePrompt] = useState(null);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promptShow, setPromptShow] = useState(false);
  const [promptList, setPromptList] = useState([
    {
      id: 1, prompt: `
请生成一篇关于QMS(质量管理体系)的专业文章,字数约500字(如果我没有提字数要求),
以HTML格式输出(只需要body的部分,只需要文本元素(h1,h2,p,span...),不要下划线这些什么的,里面内容都需要用户可以复制),
生成的时候只要html元素,不要在开头结尾加\`\`\`html \`\`\`这种,
要求结构清晰、内容专业且实用。

具体要求：
1. 使用完整的HTML文档结构
2. 包含h1到h2层级标题,展现完整的标题层次(只要h1,h2,不要分的太细)
3. 我会提供相应的核心概念,你根据我的概念来进行生成文章。如果我没有提供概念,你可以根据第4条自己生成。
4. 内容涵盖以下核心方面：
- QMS的基本定义和重要性
- 国际标准(如ISO 9001)的核心要素
- QMS实施的关键步骤
- 常见挑战与解决方案
- 数字化QMS的发展趋势
4. 段落之间过渡自然,语言专业但不晦涩
5. 在适当位置使用加粗强调关键概念,文本颜色统一黑色

请确保文章既有理论深度,也有实践指导价值,适合企业管理人员和质量专业人士阅读。

接下我将提供核心概念,请根据要求生成文章：
` },
    { id: 0, prompt: '' }
  ]);

  //useEffect
  //modal初始化
  useEffect(() => {
  }, []);

  //更新提示词
  useEffect(() => {
    const activePrompt = promptList.find(prompt => prompt.id === activePromptId);
    if (activePrompt) {
      setActivePrompt(activePrompt.prompt);
    }
  }, [activePromptId]);

  //func
  const callDeepSeekAPI = async () => {
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: activePrompt },
          { role: "user", content: input }
        ],
        model: "deepseek-chat",
        temperature: 0.7,
        stream: false
      });

      const reply = completion.choices[0]?.message?.content;
      if (reply) {
        setResponse(reply);
      } else {
        setError('未收到有效回复');
      }
    } catch (err) {
      console.error('API调用失败:', err);
      setError(err.message || '请求失败,请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='exitHtmlBox'>
      {/* 编辑器 */}
      <ReactQuill
        {...props}
        onChange={(content, delta, source, editor) => {
          // 调用原始onChange
          if (props.onChange) props.onChange(content, delta, source, editor);
        }}
      />
      {/* 工具栏 */}
      <div className='toolButtons'>
        {/* AI按钮 */}
        <div
          className='toolButton'
          onClick={() => {
            setShowAi(pre => !pre);
          }}
        >
          <RobotOutlined style={{ color: '#1677ff', fontSize: '1.2rem' }} />
        </div>
      </div>
      {/* Ai辅助 */}
      {
        showAi && (
          <div className='aiBox'>
            <PageLoading context="文章生成中..." loading={loading} />
            <div style={{ backgroundColor: 'rgb(0, 21, 41)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CloseOutlined
                style={{ fontSize: '1rem', color: 'white', cursor: 'pointer' }}
                onClick={() => {
                  setShowAi(false);
                }}
              />
              <span style={{ fontSize: '1rem', letterSpacing: '0.1rem', fontWeight: 'bold', color: 'white' }}>AI辅助</span>
            </div>
            <div style={{ position: 'relative', padding: '16px', borderBottom: '1px solid #d9d9d9' }}>
              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="请输入..."
                // autoSize={{ minRows: 3, maxRows: 6 }}
                rows={3}
                style={{ width: 'calc(100% - 96px)' }}
              />
              <div style={{ position: 'absolute', display: 'flex', flexFlow: 'column', justifyContent: 'space-between', width: '80px', height: 'calc(100% - 32px)', right: '16px', bottom: '16px' }}>
                <Button
                  type="primary"
                  // icon={<SettingOutlined />}
                  onClick={() => { setPromptShow((newPromptShow) => !newPromptShow); }}
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  提示词
                </Button>
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() => { callDeepSeekAPI() }}
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  生成
                </Button>
              </div>
            </div>

            {/* 提示词 */}
            {
              promptShow && (
                <Drawer
                  title={null}
                  styles={{ header: { display: 'none' } }}
                  open={promptShow}
                  onClose={() => { setPromptShow(false) }}
                  placement="left"
                  width={'400px'}
                  getContainer={false}
                >
                  {
                    promptList?.length > 0 && promptList.map(item => {
                      let { id, prompt } = item;
                      if (id == 0) return null;
                      let isActive = id == activePromptId;
                      return (
                        <div
                          key={id}
                          className={`promptItem`}
                          style={isActive ? { borderLeft: '4px solid #1890ff', padding: '8px', margin: '8px 0', cursor: 'pointer' } : { padding: '8px', margin: '8px 0', cursor: 'pointer' }}
                          onClick={() => {
                            setActivePromptId(id);
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>{prompt}</div>
                          </div>
                        </div>
                      )
                    })
                  }
                  {/* 自定义prompt */}
                  <div
                    key={0}
                    className={`promptItem`}
                    style={activePromptId == 0 ? { borderLeft: '4px solid #1890ff', padding: '8px' } : { padding: '8px' }}
                    onClick={() => {
                      setActivePromptId(0);
                    }}
                  >
                    <TextArea
                      bordered={false}
                      rows={2}
                      style={{ fontWeight: '700', marginRight: '16px' }}
                      placeholder="请输入自定义提示词"
                      value={promptList.filter(item => item.id == 0)[0]?.prompt}
                      onChange={(e) => {
                        setPromptList(promptList.map(item => {
                          if (item.id == 0) {
                            return { ...item, prompt: e.target.value }
                          }
                          return item;
                        }));
                        setActivePrompt(e.target.value);
                      }}
                    />
                  </div>
                </Drawer>
              )
            }
            {
              response ? (
                <div style={{
                  position: 'relative',
                  padding: '16px',
                  borderTop: '1px solid #f0f0f0',
                  flex: 1,
                  overflow: 'auto'
                }}>
                  <div
                    className='htmlBox'
                    dangerouslySetInnerHTML={{ __html: response }}
                  />
                </div>
              ) : (
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTop: '1px solid #f0f0f0',
                  flex: 1,
                  overflow: 'auto'
                }}>
                  <div style={{ fontSize: '1rem', letterSpacing: '0.1rem', color: '#9d9d9d', fontWeight: 'bold' }}>
                    暂无生成结果
                  </div>
                </div>
              )
            }
            {/* 工具栏 */}
            {
              response && (
                <div className='toolButtons' style={{ left: '3rem', bottom: '3rem', }}>
                  {/* AI按钮 */}
                  <div
                    className='toolButton'
                    onClick={() => {
                      onCopy && onCopy(response);
                    }}
                  >
                    <CopyOutlined style={{ color: '#1677ff', fontSize: '1.2rem' }} />
                  </div>
                </div>
              )
            }
          </div>
        )
      }
    </div >
  );
};

export default QuillBox;