import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';

//接口

//组件
import ClientTopBar from '@/component/navigation/ClientTopBar/ClientTopBar';

//方法

//样式

//模板
const AppPage = (props) => {

  let { } = props;

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
    <div style={{ display: "flex", flexFlow: "column" }}>
      <ClientTopBar />
      <div style={{ width: "100vw", height: "calc(100vh - 2.75rem)", marginTop: "2.75rem", overflow: "auto" }}>
        {/* 主体 */}
      </div>
    </div>
  );
};


export default AppPage;
