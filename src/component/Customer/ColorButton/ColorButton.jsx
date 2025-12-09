import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Image } from 'antd';
import moment from 'moment';

//接口

//组件
import TitleTag from '@/component/Global/TitleTag/TitleTag';

//方法

//样式
import "./ColorButton.css";

//模板
const ColorButton = (props) => {

  let {
    title,
    children
  } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  //useState

  //useEffect
  //modal初始化
  useEffect(() => {
    console.log("ColorButton");
  }, []);

  //func

  return (
    <div className="ColorButton">
      <TitleTag value={title} style={{ bottom: '-4.5rem' }} />
      {children}
    </div>
  );
};


export default ColorButton;
