import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Image } from 'antd';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';

//接口

//组件
import TextBind from '@/component/Global/TextBind/TextBind';
import ImageBind from '@/component/Global/ImageBind/ImageBind';
import TitleTag from '@/component/Global/TitleTag/TitleTag';
import ListBind from '@/component/Global/ListBind/ListBind';
import ArticleBind from '@/component/Global/ArticleBind/ArticleBind';


//方法
import { useSelector } from 'react-redux';
import { getValue } from '@/utils/Tool';

//样式
import "./PriceCard.css";

//模板
const PriceCard = (props) => {

  let {
    code,
    title,
    children
  } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const parameterBindData = useSelector(state => state.parameterBind.data);
  const isMobile = useSelector(state => state.globalData.isMobile);

  //useState

  //useEffect
  //modal初始化
  useEffect(() => {
  }, []);

  //func

  return (
    <div className={isMobile ? 'MobilePriceCard' : 'PriceCard'}>
      <TitleTag value={title} />
      <div className='Card'>
        <div
          style={{
            position: "relative",
            color: 'white',
            width: "100%",
            fontSize: '1.2rem',
            fontWeight: 'bold',
            letterSpacing: '0.1rem',
            marginBottom: '1rem',
          }}>
          <TextBind
            data={parameterBindData}
            bindTitle="价格卡片主标题"
            bindCode={`price_title__${code}_text`}
            style={{
              position: "absolute",
              top: '-0.5rem',
              right: '0rem',
              width: '0.75rem',
              height: '0.75rem',
              padding: '0.25rem',
              fontSize: '0.75rem'
            }}
          />
          {getValue(parameterBindData, `price_title__${code}_text`) || '产品1'}
        </div>
        <div
          style={{
            position: "relative",
            color: 'rgb(166, 170, 181)',
            width: "100%",
            fontSize: '0.9rem',
            fontWeight: 'bold',
            letterSpacing: '0.1rem',
            lineHeight: '1.5rem',
          }}
        >
          <TextBind
            data={parameterBindData}
            bindTitle="价格卡片描述"
            bindCode={`price_description__${code}_text`}
            style={{
              position: "absolute",
              top: '-0.5rem',
              right: '0rem',
              width: '0.75rem',
              height: '0.75rem',
              padding: '0.25rem',
              fontSize: '0.75rem'
            }}
          />
          {getValue(parameterBindData, `price_description__${code}_text`) || '描述描述描述描述描述描述描述描描述描述描述描述描述描述描述描描述描述描述描述描述描述描述描描述描述描述描述描述描述描述描描述描述描述描述描述描述描述描描述描述描述描述描述描述描述描描述描述描述描述描述描述描述描描述描述描述描述描述描述描述描描述描述描述描述描述描述描述描描述描述描述描述描述描述描述描描述描述描述描述描述描述描述描描述描述描述描述描述描述描述描描述描述描述描述描述描述描述描'}
        </div>
        <div
          style={{
            position: "relative",
            width: "100%",
            fontSize: '1.5rem',
            fontWeight: 'bold',
            letterSpacing: '0.1rem',
            margin: '1rem 0'
          }}
          className="gradientText"
        >
          <span style={{ fontSize: '1.7rem' }}>￥</span>
          <TextBind
            data={parameterBindData}
            bindTitle="价格卡片金额"
            bindCode={`price_amount__${code}_text`}
            style={{
              position: "absolute",
              top: '-0.5rem',
              right: '0rem',
              width: '0.75rem',
              height: '0.75rem',
              padding: '0.25rem',
              fontSize: '0.75rem'
            }}
          />
          {getValue(parameterBindData, `price_amount__${code}_text`) || '100000'}
        </div>
        <div
          style={{
            padding: '1rem 1rem',
            textAlign: 'center',
          }}
          className='normalButton hollowOut'
          onClick={(e) => {
            e.stopPropagation();
            let articleCode = getValue(parameterBindData, `price_button_${code}__article`);
            if (articleCode) {
              window.open(`/article/${articleCode}`);
            }
          }}
        >
          点击查看明细
          <ArticleBind
            bindCode={`price_button_${code}__article`}
            bindTitle="跳转文章"
            data={parameterBindData}
            style={{ right: '-1rem', top: '-1rem' }}
          />
        </div>
      </div>
      {/* <div className='List'>
        <ListBind
          bindTitle="价格卡片小列表"
          bindCode={`price_small_list_${code}__list`}
          data={parameterBindData}
          style={{
            position: "absolute",
            top: '-0.5rem',
            right: '0rem',
            width: '0.75rem',
            height: '0.75rem',
            padding: '0.25rem',
            fontSize: '0.75rem'
          }}
        />
        {
          JSON.parse(getValue(parameterBindData, `price_small_list_${code}__list`) || '[]')?.map((item, index) => {
            let { value } = item;
            let innerCode = item['code'];
            return (
              <div className='ListItem'>
                <TitleTag value={value} style={{ left: '-0.5rem', top: '0.5rem', zIndex: '0' }} />
                <PlusOutlined
                  style={{
                    color: '#3858E9',
                    fontSize: '0.75rem',
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    whiteSpace: 'normal', // 允许换行
                    wordBreak: 'break-all', // 在任意字符间断行                 
                  }}
                >
                  <TextBind
                    data={parameterBindData}
                    bindTitle="价格卡片小列表内容"
                    bindCode={`price_small_list_text_${code}_${innerCode}__text`}
                    style={{
                      position: "absolute",
                      top: '-0.25rem',
                      right: '-2.5rem',
                      width: '0.75rem',
                      height: '0.75rem',
                      padding: '0.25rem',
                      fontSize: '0.75rem'
                    }}
                  />
                  {getValue(parameterBindData, `price_small_list_text_${code}_${innerCode}__text`) || '详情详情详情详情详情详情详情'}

                </div>
              </div>
            )
          })
        }
      </div> */}
    </div>
  );
};


export default PriceCard;
