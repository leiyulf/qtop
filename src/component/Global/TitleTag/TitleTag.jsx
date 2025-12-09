import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import moment from 'moment';

//接口

//组件

//方法

//样式
import "./TitleTag.css";
//模板
const TitleTag = (props) => {

  let { value = '', style = {} } = props;
  if (!value) return null;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  //useState

  //useEffect
  //modal初始化
  useEffect(() => {
  }, []);

  //func

  return (
    <div
      className='titleTag'
      style={style}
    >
      <Tag color='blue'>
        {value}
      </Tag>
    </div>
  );
};


export default TitleTag;
