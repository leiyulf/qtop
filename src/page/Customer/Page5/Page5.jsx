import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import moment from 'moment';

//接口
import { createMessage } from '@/service/CustomerMessage';

//组件
import TextBind from '@/component/Global/TextBind/TextBind';
import ImageBind from '@/component/Global/ImageBind/ImageBind';
import ListBind from '@/component/Global/ListBind/ListBind';
import PageLoading from '@/component/Global/PageLoading/PageLoading';

//方法
import { useSelector } from 'react-redux';
import { getValue } from '@/utils/Tool';
import { getErrorCount, resultTip } from '@/utils/lyTool';

//样式
import "./Page5.css";

//模板
const Page5 = (props) => {

  let { } = props;

  //组件初始化
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const globalDataBindData = useSelector(state => state.globalDataBind.data);

  //useState
  const [handleLoading, setHandleLoading] = useState(false);

  //useEffect
  //modal初始化
  useEffect(() => {
    console.log("Home");
  }, []);

  //code
  //发送留言
  async function handleSendMessage() {
    try {
      await form.validateFields(); //表单验证
      let formDataJson = JSON.parse(JSON.stringify(form.getFieldsValue()));
      let postData = {
        ...formDataJson
      };
      setHandleLoading(true);
      let handleResult = await createMessage(postData);
      if (handleResult?.success != false) {
        resultTip(1, "留言发送成功");
        form.resetFields();
      } else {
        resultTip(3, "留言发送失败");
      }
      setHandleLoading(false);
    } catch (errorInfo) {
      console.log(errorInfo);
      resultTip(3, "请检查信息填写是否正确");
      setHandleLoading(false);
    }
  }

  return (
    <div id='Page5' className="Page5" style={{ padding: '8rem 16rem' }}>
      <PageLoading loading={handleLoading} />
      <div
        style={{
          display: 'flex',
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "50%"
          }}
        >
          <div
            style={{
              position: "relative",
              color: '#101828',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '0.1rem',
              width: '80%',
              marginBottom: '1rem',
            }}
          >
            <TextBind
              data={globalDataBindData}
              bindTitle="页面5主标题"
              bindCode="page5_main_title__text"
            />
            {getValue(globalDataBindData, 'page5_main_title__text') || '联系我们的销售团队'}
          </div>
          <div
            style={{
              position: "relative",
              fontSize: '1rem',
              color: 'rgb(166, 170, 181)',
              letterSpacing: '0.1rem',
              marginBottom: '3rem',
              width: '80%',
            }}
          >
            <TextBind
              data={globalDataBindData}
              bindTitle="页面5副标题"
              bindCode="page5_sub_title__text"
            />
            {getValue(globalDataBindData, 'page5_sub_title__text') || '获取定价方面的帮助，探索适合您的案例等等'}
          </div>
          {/* <div
            style={{
              position: "relative",
              fontSize: '1rem',
              color: 'rgb(166, 170, 181)',
              fontWeight: 'bold',
              letterSpacing: '0.1rem',
              marginBottom: '1rem',
              width: '80%',
            }}
          >
            <TextBind
              data={globalDataBindData}
              bindTitle="页面5描述"
              bindCode="page5_desc_title__text"
            />
            {getValue(globalDataBindData, 'page5_desc_title__text') || '每天有数万人使用我们产品:'}
          </div> */}
          <div>
            <div
              style={{
                position: "relative",
                width: "80%",
                height: "20rem",
                borderRadius: "1rem",
                overflow: "hidden",
              }}
            >
              <ImageBind
                bindCode="page5_title_image__image"
                bindTitle="页面5标题附带图片"
                data={globalDataBindData}
                style={{ right: '2rem', top: '2rem' }}
              />
              <div
                className='imageBox'
                style={{
                  backgroundImage: `url(${getValue(globalDataBindData, 'page5_title_image__image') || '/image/background.jpg'})`,
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '3rem',
              gap: '1rem'
            }}
          >
            <div
              style={{
                position: "relative",
                fontSize: '1.2rem',
                color: 'rgb(166, 170, 181)',
                letterSpacing: '0.1rem',
                fontWeight: 'bold',
              }}
            >
              <TextBind
                data={globalDataBindData}
                bindTitle="客服热线"
                bindCode="page5_admin__text"
              />
              {getValue(globalDataBindData, 'page5_admin__text') || '客服热线 : '}
            </div>

            <div
              style={{
                position: "relative",
                fontSize: '1.2rem',
                color: 'rgb(166, 170, 181)',
                letterSpacing: '0.1rem',
                fontWeight: 'bold',
              }}
              className='gradientText'
            >
              <TextBind
                data={globalDataBindData}
                bindTitle="客服热线"
                bindCode="page5_admin_telephone__text"
              />
              {getValue(globalDataBindData, 'page5_admin_telephone__text') || '0512-55230818'}
            </div>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            width: "50%"
          }}
        >
          <div style={{ marginBottom: '3rem' }}>
            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item name="customerName" label={<div style={{ fontWeight: 'bold', fontSize: "1rem", color: 'rgb(166, 170, 181)' }}>名称</div>}>
                <Input placeholder='名称' style={{ color: 'white', background: '#121315', borderColor: '#5C5C5C' }} />
              </Form.Item>
              <Form.Item
                name="customerTelephone"
                label={<div style={{ fontWeight: 'bold', fontSize: "1rem", color: 'rgb(166, 170, 181)' }}>联系电话</div>}
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder='联系电话' style={{ color: 'white', background: '#121315', borderColor: '#5C5C5C' }} />
              </Form.Item>
              <Form.Item name="customerEmail" label={<div style={{ fontWeight: 'bold', fontSize: "1rem", color: 'rgb(166, 170, 181)' }}>工作邮件</div>}>
                <Input placeholder='工作邮件' style={{ color: 'white', background: '#121315', borderColor: '#5C5C5C' }} />
              </Form.Item>
              <Form.Item name="customerWechat" label={<div style={{ fontWeight: 'bold', fontSize: "1rem", color: 'rgb(166, 170, 181)' }}>微信</div>}>
                <Input placeholder='微信' style={{ color: 'white', background: '#121315', borderColor: '#5C5C5C' }} />
              </Form.Item>
              <Form.Item
                name="customerMessage"
                label={<div style={{ fontWeight: 'bold', fontSize: "1rem", color: 'rgb(166, 170, 181)' }}>留言</div>}
                rules={[{ required: true, message: '请输入留言' }]}
              >
                <Input.TextArea rows={4} placeholder='留言' style={{ color: 'white', background: '#121315', borderColor: '#5C5C5C' }} />
              </Form.Item>
            </Form>

            <div
              style={{
                position: "relative",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: "100%",
                marginTop: '4rem',
                padding: '0.75rem',
                color: '#0A0B0D',
                borderRadius: '0.3rem',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                letterSpacing: '0.1rem',
                lineHeight: '1.5rem',
                boxSizing: 'border-box',
              }}
              className='normalButton'
              onClick={() => handleSendMessage()}
            >
              给我们留言
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};


export default Page5;
