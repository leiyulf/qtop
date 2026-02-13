import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, Select, Drawer, Space, Splitter, Typography, Row, Col, InputNumber, Tag, Card, Popconfirm, Empty } from 'antd';
import { AppstoreAddOutlined, SaveOutlined, SettingOutlined, UnorderedListOutlined, DeleteOutlined, EditOutlined, PlayCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

//接口
import { batchCreateArticle, createArticle, stopCreateArticle } from '@/service/ArticleManagement';
import { getSocket } from '@/page/Management/QTopAgent/QTopAgentServer';

//组件
import Colon from '@/component/Global/Colon/Colon';
import WorkflowDiagram from '@/component/Global/WorkflowDiagram/WorkflowDiagram';

//方法
import { getErrorCount, lyResultTip, getCurrentCompany, getCurrentUser, resultTip } from '@/utils/lyTool';

// 质量管理体系概念数据
const qualityManagementConcepts = {
  "核心概念与标准": [
    "质量管理体系", "ISO 9001", "质量方针与目标", "过程方法", "持续改进",
    "风险管理", "客户满意度", "文档控制", "内部审核", "管理评审"
  ],
  "关键要素与实施": [
    "质量策划", "质量控制", "质量保证", "质量改进", "合规性",
    "绩效指标", "纠正与预防措施", "变更管理", "供应商质量管理", "培训与能力管理"
  ],
  "工具与方法": [
    "PDCA循环", "六西格玛", "精益生产", "统计过程控制", "失效模式与影响分析",
    "根本原因分析", "检查表", "流程图", "标杆管理"
  ],
  "行业特定应用": [
    "医疗器械质量管理体系", "汽车行业质量管理体系", "航空航天质量管理体系", "食品质量管理体系",
    "信息技术服务管理体系", "环境管理体系", "实验室质量管理体系", "制药行业质量管理体系"
  ],
  "技术与数字化": [
    "数字化质量管理体系", "质量管理软件", "自动化与质量4.0", "数据完整性",
    "云计算与QMS", "人工智能在质量管理中的应用", "物联网与实时监控"
  ],
  "趋势与挑战": [
    "供应链韧性", "可持续发展与质量", "远程审核", "敏捷质量管理",
    "文化变革与质量文化", "全球化与本地化合规", "客户体验管理"
  ],
  "效益与成果": [
    "运营效率", "成本降低", "品牌声誉", "市场竞争力",
    "产品安全性", "法规符合性", "员工参与度"
  ]
};

//样式
import './HandleBatchArticle.css';

//模板
const HandleBatchArticle = (props) => {
  let {
    drawerVisible,
    setDrawerVisible,
    drawerData = {},
    onSub,
  } = props;

  //组件初始化
  const [pageForm] = Form.useForm();
  const { TextArea } = Input;

  //useState
  const [pageLoading, setPageLoading] = useState(false); //按钮加载
  const [socketConnected, setSocketConnected] = useState(false); //socket连接状态
  const [articleList, setArticleList] = useState([]);

  // 标签选择状态
  const [selectedTags, setSelectedTags] = useState({});

  // 文章数量和字数
  const [articleCount, setArticleCount] = useState(3);
  const [articleWordCount, setArticleWordCount] = useState(500);
  const [additionalNote, setAdditionalNote] = useState('');

  // 展开内容状态
  const [expandedIndex, setExpandedIndex] = useState(null);

  //运行状态
  const [taskId, setTaskId] = useState(null);
  const [runStatus, setRunStatus] = useState('end');

  //useEffect
  //modal初始化
  useEffect(() => {
    // 抽屉关闭时,如果正在运行则停止任务
    if (!drawerVisible && taskId) {
      handleStopGenerate();
    }
  }, [drawerVisible]);

  // 组件卸载时停止任务
  useEffect(() => {
    return () => {
      if (taskId) {
        stopCreateArticle({ taskId });
      }
    };
  }, []);

  // Socket连接状态监听
  useEffect(() => {
    const socketInstance = getSocket();
    if (socketInstance) {
      setSocketConnected(socketInstance.connected);

      socketInstance.on('connect', () => {
        setSocketConnected(true);
      });

      socketInstance.on('disconnect', () => {
        setSocketConnected(false);
      });

      socketInstance.on('nodeLog', (data) => {
        //获取已生成的文章
        if (data?.nodeName == 'finalEditNode') {
          let articleList = data?.value ?? [];
          setArticleList(articleList);
        }
      });

      socketInstance.on('nodeLog', (data) => {
        console.log(data);
        //获取已生成的文章
        if (data?.nodeName == 'finalEditNode') {
          let articleList = data?.value ?? [];
          setArticleList(articleList);
        }
        if (data?.nodeName == '__end__' || data?.nodeName == '__start__') {
          setRunStatus(data?.value);

          if(data?.value == 'end'){
            setTaskId(null);
          }
        }
      });

      return () => {
        socketInstance.off('connect');
        socketInstance.off('disconnect');
        socketInstance.off('nodeLog');
      };
    }
  }, []);

  //func
  const toggleTag = (category, tagValue) => {
    setSelectedTags(prev => {
      const categoryTags = prev[category] || [];
      const newCategoryTags = categoryTags.includes(tagValue)
        ? categoryTags.filter(tag => tag !== tagValue)
        : [...categoryTags, tagValue];

      return {
        ...prev,
        [category]: newCategoryTags
      };
    });
  };

  //生成文章
  const handleGenerate = async () => {
    setPageLoading(true);
    // 停止正在运行的任务
    if(taskId){
      stopCreateArticle({ taskId });
    }

    let articleTags = {};
    setArticleList([]);
    Object.keys(selectedTags).forEach(category => {
      if (selectedTags[category] && selectedTags[category].length > 0) {
        articleTags[category] = selectedTags[category];
      }
    });

    let handleResult = await batchCreateArticle({
      articleCount: articleCount,
      wordCount: articleWordCount,
      articleTags,
      additionalNote: additionalNote
    });

    if (handleResult?.data?.taskId) {
      setTaskId(handleResult?.data?.taskId);
    } else {
      resultTip(3, '生成失败', handleResult?.data?.message || '生成失败');
    }
    // 重置加载状态
    setPageLoading(false);
  };

  //停止生成文章
  const handleStopGenerate = async () => {
    if (!taskId) {
      resultTip(3, '停止失败', '任务ID不存在');
      return;
    }
    setPageLoading(true);
    let handleResult = await stopCreateArticle({
      taskId: taskId
    });
    if (handleResult?.success) {
      resultTip(1, '停止成功,将在下一个节点停止');
    }
    // else {
    //   resultTip(3, '停止失败', handleResult?.data?.message || '停止失败');
    // }
    // 重置加载状态
    setPageLoading(false);
  };

  // 删除文章
  const handleDeleteArticle = (index) => {
    setArticleList(prev => prev.filter((_, i) => i !== index));
  };

  // 切换内容展开/收起
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // 提取HTML文本内容
  const extractTextFromHtml = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  };

  //批量添加
  const batchAddArticle = async () => {
    if (!articleList || articleList.length === 0) {
      resultTip(3, '批量添加失败', '文章列表为空');
      return;
    }

    setPageLoading(true);

    try {
      // 构造批量添加的文章数据
      const articlesToAdd = articleList.map(article => ({
        mainTitle: article.title,
        author: '管理员',
        createTime: article.createTime ? moment(article.createTime).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        articleContent: article.content,
        articleStatus: '1',
        viewCount: 0,
        articleGroup: '普通文章',
        articleCover: article.coverUrl || null
      }));

      // 逐个添加文章
      let successCount = 0;
      let failCount = 0;

      for (const articleData of articlesToAdd) {
        const handleResult = await createArticle(articleData);
        if (handleResult?.success !== false) {
          successCount++;
        } else {
          failCount++;
        }
      }

      if (failCount === 0) {
        resultTip(1, `批量添加成功，共添加 ${successCount} 篇文章`);
        onSub && onSub();
        setArticleList([]);
        setDrawerVisible(false);
      } else {
        resultTip(2, `批量添加完成`, `成功 ${successCount} 篇，失败 ${failCount} 篇`);
        onSub && onSub();
      }
    } catch (error) {
      console.error('批量添加文章异常:', error);
      resultTip(3, '批量添加失败', '系统异常');
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <Drawer
      placement="right"
      width={'100%'}
      title={'批量添加文章'}
      open={drawerVisible}
      onClose={() => {
        // 关闭前如果正在运行则停止任务
        if (taskId) {
          handleStopGenerate();
        }
        setDrawerVisible(false);
      }}
      maskClosable={false}
      styles={{
        body: { padding: 0 },
      }}
      footer={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            key="close"
            type="primary"
            onClick={() => {
              // 关闭前如果正在运行则停止任务
              if (taskId) {
                handleStopGenerate();
              }
              setDrawerVisible(false);
            }}>
            关闭
          </Button>
          <Button
            key="submit"
            type="primary"
            loading={pageLoading}
            disabled={pageLoading || runStatus == 'start' || articleList?.length == 0}
            onClick={batchAddArticle}
            icon={<AppstoreAddOutlined />}
          >
            {
              runStatus == 'start' ? '文章正在生成中...' : `批量导入文章(${articleList?.length || 0}条)`
            }
          </Button>
        </div>
      }>
      <Splitter lazy layout="horizontal">
        <Splitter.Panel>
          <Splitter lazy layout="vertical">
            {/* 提示词区域 */}
            <Splitter.Panel style={{ padding: '16px' }} defaultSize="60%" min="40%" max="60%">
              <div className='normalBox' style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className='title'><SettingOutlined style={{ marginRight: '0.5rem' }} />配置</div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                  <Row style={{ width: '100%', margin: '8px 0px' }}>
                    <Col className='row' span={12}>
                      <div className='label' style={{ width: '8rem' }}>文章数量<Colon /></div>
                      <InputNumber
                        style={{ width: '100%' }}
                        min={1}
                        max={20}
                        step={1}
                        value={articleCount}
                        onChange={(value) => setArticleCount(value)}
                        placeholder="请输入文章数量" />
                    </Col>
                    <Col className='row' span={12}>
                      <div className='label' style={{ width: '8rem' }}>文章字数<Colon /></div>
                      <InputNumber
                        style={{ width: '100%' }}
                        min={100}
                        max={3000}
                        step={100}
                        value={articleWordCount}
                        onChange={(value) => setArticleWordCount(value)}
                        placeholder="请输入文章字数" />
                    </Col>
                  </Row>
                  <Row style={{ width: '100%', margin: '8px 0px' }}>
                    <Col className='row' span={24}>
                      <div className='label' style={{ width: '8rem' }}>补充说明<Colon /></div>
                      <Input
                        style={{ width: '100%' }}
                        value={additionalNote}
                        onChange={(e) => setAdditionalNote(e.target.value)}
                        placeholder="请输入补充说明（可选）" />
                    </Col>
                  </Row>
                  <Row style={{ width: '100%', margin: '8px 0px' }}>
                    <Col className='row' style={{ alignItems: 'flex-start' }} span={24}>
                      <div className='label' style={{ width: '8rem' }}>核心概念与标准<Colon /></div>
                      <div className='tagBox'>
                        {qualityManagementConcepts["核心概念与标准"].map((item, index) => (
                          <Tag.CheckableTag
                            key={`core-${index}`}
                            checked={(selectedTags["核心概念与标准"] || []).includes(item)}
                            onChange={() => toggleTag("核心概念与标准", item)}
                          >
                            {item}
                          </Tag.CheckableTag>
                        ))}
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ width: '100%', margin: '8px 0px' }}>
                    <Col className='row' style={{ alignItems: 'flex-start' }} span={24}>
                      <div className='label' style={{ width: '8rem' }}>关键要素与实施<Colon /></div>
                      <div className='tagBox'>
                        {qualityManagementConcepts["关键要素与实施"].map((item, index) => (
                          <Tag.CheckableTag
                            key={`key-element-${index}`}
                            checked={(selectedTags["关键要素与实施"] || []).includes(item)}
                            onChange={() => toggleTag("关键要素与实施", item)}
                          >
                            {item}
                          </Tag.CheckableTag>
                        ))}
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ width: '100%', margin: '8px 0px' }}>
                    <Col className='row' style={{ alignItems: 'flex-start' }} span={24}>
                      <div className='label' style={{ width: '8rem' }}>工具与方法<Colon /></div>
                      <div className='tagBox'>
                        {qualityManagementConcepts["工具与方法"].map((item, index) => (
                          <Tag.CheckableTag
                            key={`tools-${index}`}
                            checked={(selectedTags["工具与方法"] || []).includes(item)}
                            onChange={() => toggleTag("工具与方法", item)}
                          >
                            {item}
                          </Tag.CheckableTag>
                        ))}
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ width: '100%', margin: '8px 0px' }}>
                    <Col className='row' style={{ alignItems: 'flex-start' }} span={24}>
                      <div className='label' style={{ width: '8rem' }}>行业特定应用<Colon /></div>
                      <div className='tagBox'>
                        {qualityManagementConcepts["行业特定应用"].map((item, index) => (
                          <Tag.CheckableTag
                            key={`industry-${index}`}
                            checked={(selectedTags["行业特定应用"] || []).includes(item)}
                            onChange={() => toggleTag("行业特定应用", item)}
                          >
                            {item}
                          </Tag.CheckableTag>
                        ))}
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ width: '100%', margin: '8px 0px' }}>
                    <Col className='row' style={{ alignItems: 'flex-start' }} span={24}>
                      <div className='label' style={{ width: '8rem' }}>技术与数字化<Colon /></div>
                      <div className='tagBox'>
                        {qualityManagementConcepts["技术与数字化"].map((item, index) => (
                          <Tag.CheckableTag
                            key={`tech-${index}`}
                            checked={(selectedTags["技术与数字化"] || []).includes(item)}
                            onChange={() => toggleTag("技术与数字化", item)}
                          >
                            {item}
                          </Tag.CheckableTag>
                        ))}
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ width: '100%', margin: '8px 0px' }}>
                    <Col className='row' style={{ alignItems: 'flex-start' }} span={24}>
                      <div className='label' style={{ width: '8rem' }}>趋势与挑战<Colon /></div>
                      <div className='tagBox'>
                        {qualityManagementConcepts["趋势与挑战"].map((item, index) => (
                          <Tag.CheckableTag
                            key={`trend-${index}`}
                            checked={(selectedTags["趋势与挑战"] || []).includes(item)}
                            onChange={() => toggleTag("趋势与挑战", item)}
                          >
                            {item}
                          </Tag.CheckableTag>
                        ))}
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ width: '100%', margin: '8px 0px' }}>
                    <Col className='row' style={{ alignItems: 'flex-start' }} span={24}>
                      <div className='label' style={{ width: '8rem' }}>效益与成果<Colon /></div>
                      <div className='tagBox'>
                        {qualityManagementConcepts["效益与成果"].map((item, index) => (
                          <Tag.CheckableTag
                            key={`benefit-${index}`}
                            checked={(selectedTags["效益与成果"] || []).includes(item)}
                            onChange={() => toggleTag("效益与成果", item)}
                          >
                            {item}
                          </Tag.CheckableTag>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                  {
                    runStatus === 'end' && (
                      <Button
                        type='primary'
                        style={{ width: '100%', padding: '8px 0px' }}
                        loading={pageLoading}
                        onClick={handleGenerate}
                        icon={<PlayCircleOutlined />}
                      >
                        开始生成
                      </Button>
                    )
                  }
                  {
                    runStatus === 'start' && (
                      <Button
                        danger
                        type='primary'
                        style={{ width: '100%', padding: '8px 0px' }}
                        loading={pageLoading}
                        onClick={handleStopGenerate}
                        icon={<CloseCircleOutlined />}
                      >
                        停止生成
                      </Button>
                    )
                  }
                </div>
              </div>
            </Splitter.Panel>

            {/* 工作流区域 */}
            <Splitter.Panel style={{ padding: '16px' }} defaultSize="40%" min="30%" max="60%">
              <div className='normalBox' style={{ height: '100%' }}>
                <div className='title'>
                  <AppstoreAddOutlined style={{ marginRight: '0.5rem' }} />工作流
                  <Tag color={socketConnected ? 'success' : 'error'} style={{ marginLeft: '8px' }}>
                    {socketConnected ? '已连接' : '未连接'}
                  </Tag>
                </div>
                <div style={{ height: 'calc(100% - 40px)', marginTop: '16px' }}>
                  <WorkflowDiagram />
                </div>
              </div>
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
        {/* 文章列表 */}
        <Splitter.Panel style={{ padding: '16px' }} defaultSize="50%" min="30%" max="70%">
          <div className='normalBox' style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className='title' style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UnorderedListOutlined />
              文章列表
              <Tag color="blue">{articleList.length}篇</Tag>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
              {articleList.length === 0 ? (
                <Empty description="暂无文章" style={{ marginTop: '60px' }} />
              ) : (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {articleList.map((article, index) => {
                    const textContent = extractTextFromHtml(article.content);
                    const isExpanded = expandedIndex === index;
                    const previewText = textContent.slice(0, 150);

                    return (
                      <Card
                        key={index}
                        size="small"
                        hoverable
                        style={{
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                        bodyStyle={{ padding: '16px' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div style={{ flex: 1, marginRight: '12px' }}>
                            <Typography.Title level={5} style={{ margin: 0, marginBottom: '8px' }}>
                              {article.title}
                            </Typography.Title>
                            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                              创建时间: {moment(article.createTime).format('YYYY-MM-DD HH:mm:ss')}
                            </Typography.Text>
                          </div>
                          <Popconfirm
                            title="确认删除"
                            description="确定要删除这篇文章吗?"
                            onConfirm={() => handleDeleteArticle(index)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button
                              type="text"
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                            />
                          </Popconfirm>
                        </div>

                        <div style={{
                          marginBottom: '12px',
                          padding: '12px',
                          background: '#fafafa',
                          borderRadius: '4px',
                          maxHeight: isExpanded ? 'none' : '120px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          {isExpanded ? (
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                          ) : (
                            <>
                              <Typography.Paragraph
                                ellipsis={{ rows: 3 }}
                                style={{ margin: 0, color: '#666' }}
                              >
                                {previewText}{textContent.length > 150 ? '...' : ''}
                              </Typography.Paragraph>
                              {textContent.length > 150 && (
                                <div style={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  height: '40px',
                                  background: 'linear-gradient(to bottom, transparent, #fafafa)',
                                }} />
                              )}
                            </>
                          )}
                        </div>

                        <Button
                          type="link"
                          size="small"
                          onClick={() => toggleExpand(index)}
                          style={{ padding: 0 }}
                        >
                          {isExpanded ? '收起内容' : '展开查看全文'}
                        </Button>
                      </Card>
                    );
                  })}
                </Space>
              )}
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
    </Drawer >
  );
};


export default HandleBatchArticle;
