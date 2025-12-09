import React, { useState, useEffect } from 'react';
import { Drawer, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';

//接口

//组件
//方法
import { resultTip } from '@/utils/lyTool';

//样式

const { Option } = Select;

//模板
const PreviewArticle = (props) => {

  let {
    drawerVisible,
    setDrawerVisible,
    drawerData,
    onSub = () => { }
  } = props;

  let { articleContent } = drawerData;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const [pageForm] = Form.useForm();

  //useRef

  //useHook

  //useState

  //useEffect

  //code

  return (
    <Drawer
      placement="right"
      width={'1000px'}
      onClose={() => setDrawerVisible(false)}
      open={drawerVisible}
      styles={{
        body: { padding: '0px', background: '#F0F2F5' },
        header: { display: 'none' }
      }}
    >
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: articleContent }}
      />
    </Drawer >
  );
};


export default PreviewArticle;