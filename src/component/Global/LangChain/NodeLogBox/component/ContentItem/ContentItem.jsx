import React, { useState, useEffect, memo } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Alert, Descriptions } from 'antd';
import moment from 'moment';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

//接口

//组件
import InteractionContent from '../InteractionContent/InteractionContent';

//方法

//样式
import './ContentItem.css';

//模板
const ContentItem = memo((props) => {

  let {
    value,
    type = 'text',
    socket = null,
  } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  //useState
  const [remainingTime, setRemainingTime] = useState(0);
  const [isInteracted, setIsInteracted] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);

  //useEffect
  //modal初始化
  useEffect(() => {
  }, []);

  //倒计时处理
  useEffect(() => {
    if (type === 'interaction' && value?.timeout) {
      setRemainingTime(Math.ceil(value.timeout / 1000)); // 转换为秒
      setIsTimeout(false);
      setIsInteracted(false);

      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimeout(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [type, value?.timeout]);

  //code
  //处理按钮点击
  const handleInteraction = (responseData) => {
    setIsInteracted(true);
    if (socket && value?.response) {
      // const responseData = {
      //   confirmed: action === 'confirm'
      // };
      socket.emit(value.response, responseData);
    }
  };

  //异常信息
  function generateError(value) {
    // 如果 value 是对象，转换为 JSON 字符串显示
    const errorMessage = typeof value === 'object'
      ? JSON.stringify(value, null, 2)
      : String(value);

    return (
      <Alert
        message='数据异常'
        type="error"
        description={<pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{errorMessage}</pre>}
        showIcon
      />
    );
  }

  //生成工具消息
  function generateMessage(value) {
    //渲染文本
    if (type === 'text') {
      return (
        <div className='nodeText'>
          {value}
        </div>
      )
    }
    //渲染Map
    if (type === 'map') {
      let { data, params } = value;
      return (
        <div className='nodeMap'>
          <Descriptions
            bordered
            items={data}
            size='small'
            column={1}
            styles={{
              label: { minWidth: '120px', fontWeight: 'bold' },
            }}
          />
        </div>
      )
    }
    //渲染表格
    if (type === 'table') {
      try {
        let { data, params } = value;
        let { header } = params;
        return (
          <div className='nodeTable'>
            <Table
              style={{ width: "100%" }}
              scroll={{ x: "100%", y: "360px" }}
              bordered
              pagination={false}
              columns={header}
              dataSource={data}
            />
          </div>
        )
      } catch {
        return generateError(value);
      }
    }
    //渲染交互
    if (type === 'interaction') {
      let { type, message, response, timeout } = value;
      return (
        <div className='nodeInteraction'>
          <div className='nodeText' style={{ fontSize: '14px', fontWeight: 'bold', padding: '8px' }}>
            {message}
          </div>
          {/* 交互区域 */}
          <InteractionContent
            value={value}
            isTimeout={isTimeout}
            isInteracted={isInteracted}
            onInteraction={handleInteraction}
          />
          {/* 倒计时区域 */}
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            {
              (isTimeout || isInteracted) ? (
                <span style={{ color: '#999' }}>已结束</span>
              ) : (
                <span>剩余时间：{remainingTime} 秒</span>
              )
            }
          </div>
        </div>
      )
    }
  }



  return (
    <>
      {generateMessage(value)}
    </>
  )
});

export default ContentItem;
