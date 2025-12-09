import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import moment from 'moment';

//接口

//组件
import ArticleItem from '@/component/Customer/ArticleItem/ArticleItem';
import TextBind from '@/component/Global/TextBind/TextBind';
import ImageBind from '@/component/Global/ImageBind/ImageBind';
import ListBind from '@/component/Global/ListBind/ListBind';
import RowDivider from '@/component/Global/RowDivider/RowDivider';

//方法
import { useSelector } from 'react-redux';
import { getValue } from '@/utils/Tool';

//样式
import "./Page3.css";

//模板
const Page3 = (props) => {

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
    <div id="Page3" className="Page3" style={{ padding: '6rem 10rem', gap: '2rem' }}>
      <div
        style={{
          position: "relative",
          display: 'inner-flex',
          fontSize: '4rem',
          fontWeight: 'bold',
          color: 'white',
          letterSpacing: '0.2rem',
          marginBottom: '2rem'
        }}>
        <TextBind
          data={globalDataBindData}
          bindTitle="页面3主标题"
          bindCode="page3_main_title__text"
        />
        {getValue(globalDataBindData, 'page3_main_title__text') || '解决方案'}
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "40rem",
          marginBottom: '4rem',
          borderRadius: "2rem",
          overflow: "hidden",
        }}
      >
        <div
          className='imageBox'
          style={{
            backgroundImage: `url(${getValue(globalDataBindData, 'page3_main_image__image') || '/image/background.jpg'})`,
          }}
        />
        <ImageBind
          bindCode="page3_main_image__image"
          bindTitle="页面3主背景图片"
          data={globalDataBindData}
          style={{ right: '2rem', top: '2rem' }}
        />
      </div>

      <div
        style={{
          position: "relative",
          display: 'flex',
          flexFlow: 'column',
          gap: '6rem'
        }}
      >
        <ListBind
          bindTitle="页面3方案列表"
          bindCode="page3_plan_list__list"
          data={globalDataBindData}
        />
        {
          JSON.parse(getValue(globalDataBindData, 'page3_plan_list__list') || '[]')?.map((item, index) => {
            let { code, value } = item;
            return (
              <>
                {index !== 0 && <RowDivider width={"100%"} />}
                <ArticleItem
                  key={code}
                  code={code}
                  title={value}
                  direction={index % 2 === 0 ? 'right' : 'left'}
                />
              </>
            )
          })
        }
      </div>
    </div>
  );
};


export default Page3;
