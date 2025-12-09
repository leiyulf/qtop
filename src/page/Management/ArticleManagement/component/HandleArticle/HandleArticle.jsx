import React, { useState, useEffect } from 'react';
import { Drawer, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';

//接口
import { createArticle, updateArticle } from '@/service/ArticleManagement';

//组件
import ReactQuill from 'react-quill';
import useElementSize from '@/component/UseHooks/useElementSize';
import PageLoading from '@/component/Global/PageLoading/PageLoading';

//方法
import { resultTip } from '@/utils/lyTool';
import request from '@/utils/request';

//样式
import './HandleArticle.css';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;

//模板
const HandleArticle = (props) => {

  let {
    drawerVisible,
    setDrawerVisible,
    drawerData,
    onSub = () => { }
  } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const [pageForm] = Form.useForm();

  const modules = {
    toolbar: {
      container: [
        // 标题
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        // 字体大小
        [{ 'size': ['small', false, 'large', 'huge'] }],
        // 字体类型
        [{ 'font': [] }],
        // 字体样式
        ['bold', 'italic', 'underline', 'strike'],
        // 对齐方式
        [{ 'align': [] }],
        // 颜色和背景色
        [{ 'color': [] }, { 'background': [] }],
        // 文本格式
        ['blockquote', 'code-block'],
        // 列表
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        // 缩进
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        // 链接和图片
        ['link', 'image'],
        // 脚本（上标/下标）
        [{ 'script': 'sub' }, { 'script': 'super' }],
        // 清除格式
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: true  // 是否保留视觉格式
    },
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: false
    }
  };
  //useRef
  const quillRef = React.createRef();

  //useHook
  const [boxRef, { width: boxWidth, height: boxHeight }, updateSize] = useElementSize();

  //useState
  const [content, setContent] = useState(''); // 内容
  const [loading, setLoading] = useState(false);

  //useEffect
  useEffect(() => { setTimeout(() => { updateSize(); }, 100); }, []);

  //数据初始化
  useEffect(() => {
    if (drawerData && JSON.stringify(drawerData) !== "{}") {
      let drawerDataTemp = JSON.parse(JSON.stringify(drawerData));
      let { createTime, articleContent = '' } = drawerDataTemp;
      createTime && (drawerDataTemp.createTime = dayjs(drawerDataTemp.createTime));
      setContent(articleContent);
      pageForm.setFieldsValue(drawerDataTemp);
    } else {
      pageForm.setFieldValue("author", "管理员");
      pageForm.setFieldValue("createTime", dayjs());
    }
  }, [drawerData]);

  //code
  // 辅助函数用于上传单个base64图片
  const uploadBase64Image = async (base64Data) => {
    try {
      // 将base64转换为Blob对象
      const byteString = atob(base64Data.split(',')[1]);
      const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      // 创建FormData并添加文件
      const formData = new FormData();
      formData.append('file', blob);

      // 发送请求到后端
      const uploadResponse = await request('/upload/single', { method: 'POST', body: formData });

      if (uploadResponse?.success != false) {
        return uploadResponse?.data?.path ?? '';
      } else {
        return false;
      }
    } catch (error) {
      console.error('图片上传失败:', error);
      return false;
    }
  };

  //保存
  async function handleSaveArticle() {
    try {
      setLoading(true);
      await pageForm.validateFields(); //表单验证
      let formDataJson = JSON.parse(JSON.stringify(pageForm.getFieldsValue()));
      let { mainTitle, author, createTime, articleGroup } = formDataJson;

      // 处理文章内容中的base64图片
      let processedContent = content;
      const base64Regex = /<img[^>]+src="data:image\/[^">]+"/g;
      const matches = content.match(base64Regex);

      if (matches && matches.length > 0) {
        for (const match of matches) {
          const srcMatch = match.match(/src="(data:image\/[^">]+)"/);
          if (srcMatch && srcMatch[1]) {
            const base64Data = srcMatch[1];
            const imagePath = await uploadBase64Image(base64Data);
            if (imagePath) {
              processedContent = processedContent.replace(base64Data, imagePath);
            } else {
              resultTip(0, '上传图片失败');
              return;
            }
          }
        }
      }

      let postData = {
        id: drawerData?.id ?? null,
        mainTitle,
        author,
        createTime: createTime ? dayjs(createTime).format("YYYY-MM-DD HH:mm:ss") : dayjs().format("YYYY-MM-DD HH:mm:ss"),
        updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        articleContent: processedContent,
        articleStatus: drawerData?.articleStatus ?? '1',
        viewCount: drawerData?.viewCount ?? 0,
        articleGroup: articleGroup
      };

      let handleResult = postData?.id ? await updateArticle(postData) : await createArticle(postData);
      if (handleResult?.success != false) {
        resultTip(1, "保存成功");
        onSub() && onSub();
        setDrawerVisible(false);
        setLoading(false);
      }
    } catch (errorInfo) {
      console.log(errorInfo);
      resultTip(3, "异常错误");
      setLoading(false);
    }
  }

  return (
    <Drawer
      title="文章编辑"
      placement="right"
      width={'100%'}
      onClose={() => setDrawerVisible(false)}
      open={drawerVisible}
      closeIcon={<CloseOutlined style={{ color: 'white' }} />}
      styles={{
        body: { padding: '0px', background: '#F0F2F5' },
        header: { borderBottom: '1px solid #001529', background: '#001529', color: 'white' }
      }}
      extra={
        <>
          <Button
            type='primary'
            onClick={() => {
              handleSaveArticle()
            }}
            icon={<SaveOutlined />}
          >
            保存文章
          </Button>
        </>
      }
    >
      <div className='HandleArticle'>
        <PageLoading loading={loading} />
        {/* 编辑区域 */}
        <div className='editArea'>
          {/* 基本信息 */}
          <Form layout='vertical' form={pageForm}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="主标题"
                  name="mainTitle"
                  rules={[{ required: true, message: '请输入标题' }]}
                >
                  <Input placeholder="请输入标题" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="编写人"
                  name="author"
                >
                  <Input placeholder="请输入编写人" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="创建时间"
                  name="createTime"
                >
                  <DatePicker showTime style={{ width: '100%' }} placeholder="请选择创建时间" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="文章分组"
                  name="articleGroup"
                >
                  <Select placeholder="请选择文章分组">
                    <Option value="分组1">分组1</Option>
                    <Option value="分组2">分组2</Option>
                    <Option value="分组3">分组3</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <div ref={boxRef} className="quillBox">
            {
              boxWidth && boxHeight && (
                <ReactQuill
                  ref={quillRef}
                  value={content}
                  onChange={(value) => {
                    setContent(value);
                  }}
                  modules={modules}
                  placeholder="请输入文章内容"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: `${boxHeight - 2}px`,
                    borderRadius: '8px',
                    border: '1px solid #d9d9d9'
                  }}
                />
              )
            }
          </div>
        </div>
        {/* 预览区域 */}
        <div className='previewArea'>
          <div
            style={{
              borderRadius: '8px',
              background: 'white',
              overflow: 'auto'
            }}
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className='previewTitle'>文章预览</div>
        </div>
      </div>
    </Drawer >
  );
};


export default HandleArticle;