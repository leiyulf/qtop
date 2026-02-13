import React, { useState, useEffect, memo } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Alert } from 'antd';
import moment from 'moment';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

//接口

//组件

//方法

//样式
import './ChatItem.css';


//模板
const ChatItem = memo((props) => {

  let {
    key,
    message,
    type, //HumanMessage,AIMessage,ToolMessage
    index,
    receiveDateStamp,
  } = props;
  console.log(props);
  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  //useState

  //useEffect
  //modal初始化
  useEffect(() => {
  }, []);

  //code
  //生成工具消息
  function generateToolMessage(message) {
    let dataJson = {};
    try {
      dataJson = JSON.parse(message);
    } catch (error) {
      return (
        <>
          <Alert
            message="数据渲染失败"
            type="error"
            description={message}
            showIcon
          />
        </>
      )
    }
    let { showType, input, data, date, params } = dataJson;
    console.log(input);
    //渲染表格
    if (showType === 'table') {
      let { header } = params;
      return (
        <Table
          style={{ width: "100%" }}
          scroll={{ x: "100%", y: "400px" }}
          bordered
          pagination={false}
          columns={header}
          dataSource={data}
        />
      )
    }
  }
  console.log(type);
  //人类消息
  if (type === 'HumanMessage') {
    return (
      <div className='chatItem' style={{ justifyContent: 'flex-end' }}>
        <div
          className='chatItemContent'
          style={{
            background: '#e6f4ff'
          }}
        >
          {message}
        </div>
      </div>
    )
  }
  //AI消息
  if (type === 'AIMessage') {
    return (
      <div className='chatItem' style={{ justifyContent: 'flex-start' }}>
        <div className='chatItemContent'>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message}
          </ReactMarkdown>
        </div>
      </div>
    )
  }
  //工具消息
  if (type === 'ToolMessage') {
    return (
      <div className='chatItem' style={{ justifyContent: 'flex-start' }}>
        <div
          className='chatItemContent'
          style={{
            border: '1px solid #d4d4d4'
          }}
        >
          {generateToolMessage(message)}
        </div>
      </div>
    )
  }
});

export default ChatItem;