import React, { useState, useEffect } from 'react';
import { Drawer , Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import moment from 'moment';

//接口

//组件

//方法

//样式

//模板
const test = (props) => {

  let {
    drawerVisible,
    setDrawerVisible,
    drawerData,
    refreshFunc } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  //useState

  //useEffect
  //modal初始化
  useEffect(() => {
    console.log("NullPage");
  }, []);

  //func

  return (
    <Drawer
      title="测试"
      placement="right"
      onClose={() => setDrawerVisible(false)}
      open={drawerVisible}>

    </Drawer>
  );
};


export default test;
