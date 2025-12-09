import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import moment from 'moment';

//接口

//组件
import PriceCard from '@/component/Customer/PriceCard/PriceCard';
import TextBind from '@/component/Global/TextBind/TextBind';
import ImageBind from '@/component/Global/ImageBind/ImageBind';
import ListBind from '@/component/Global/ListBind/ListBind';
import RowDivider from '@/component/Global/RowDivider/RowDivider';

//方法
import { useSelector } from 'react-redux';
import { getValue } from '@/utils/Tool';


//样式
import "./Page4.css";

//模板
const Page4 = (props) => {

  let { } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const globalDataBindData = useSelector(state => state.globalDataBind.data);

  //useState

  //useEffect
  //modal初始化
  useEffect(() => {
    console.log("Home");
  }, []);

  //func

  return (
    <div className="Page4" style={{ padding: '8rem 16rem 6rem 16rem' }}>
      <div
        style={{
          position: "relative",
          display: 'flex',
          justifyContent: 'center',
          color: 'white',
          marginBottom: '2rem',
          letterSpacing: '1px',
          fontSize: '2rem',
          fontWeight: 'bold',
        }}
      >

        <TextBind
          data={globalDataBindData}
          bindTitle="页面4主标题"
          bindCode="page4_main_title__text"
        />
        {getValue(globalDataBindData, 'page4_main_title__text') || '标题标题标题标题标题标题标题标题'}
      </div>
      <div
        style={{
          position: "relative",
          display: 'flex',
          justifyContent: 'center',
          color: 'rgb(166, 170, 181)',
          marginBottom: '4rem',
          letterSpacing: '2px',
          fontSize: '0.9rem',
        }}
      >
        <TextBind
          data={globalDataBindData}
          bindTitle="页面4描述"
          bindCode="page4_desc__text"
        />
        {getValue(globalDataBindData, 'page4_desc__text') || '描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述'}
      </div>
      <RowDivider />
      <div
        style={{
          position: "relative",
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '3%',
          marginTop: '4rem',
        }}
      >
        <ListBind
          bindTitle="页面4价格列表"
          bindCode="page4_price_list__list"
          data={globalDataBindData}
        />
        {
          JSON.parse(getValue(globalDataBindData, 'page4_price_list__list') || '[]')?.map((item, index) => {
            let { code, value } = item;
            return (
              <PriceCard
                key={code}
                code={code}
                title={value}
              />
            )
          })
        }
      </div>
    </div>
  );
};


export default Page4;
