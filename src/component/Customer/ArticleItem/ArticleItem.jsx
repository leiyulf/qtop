import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Image } from 'antd';
import moment from 'moment';

//接口

//组件
import TextBind from '@/component/Global/TextBind/TextBind';
import ImageBind from '@/component/Global/ImageBind/ImageBind';
import TitleTag from '@/component/Global/TitleTag/TitleTag';

//方法
import { useSelector } from 'react-redux';
import { getValue } from '@/utils/Tool';

//样式
import "./ArticleItem.css";

//模板
const ArticleItem = (props) => {

  let {
    code,
    title,
    direction = 'left'
  } = props;

  if (!code) {
    return null;
  }

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
    <div className={isMobile ? 'MobileArticleItem' : 'ArticleItem'}>
      <TitleTag value={title} />
      {
        direction === 'right' && (
          <div
            className='contentBox'
            style={{
              position: "relative",
            }}
          >
            <TextBind
              data={parameterBindData}
              bindTitle="方案内容"
              bindCode={`plan_content__${code}_text`}
            />
            {getValue(parameterBindData, `plan_content__${code}_text`) || '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'}
          </div>
        )
      }
      <div className='titleBox'>
        <div
          style={
            isMobile ? {
              position: "relative",
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '0.1rem'
            } : {
              position: "relative",
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '0.1rem'
            }
          }>
          <TextBind
            data={parameterBindData}
            bindTitle="方案主标题"
            bindCode={`plan_title__${code}_text`}
          />
          {getValue(parameterBindData, `plan_title__${code}_text`) || '标题标题标题'}
        </div>
        <div
          style={
            isMobile ? {
              position: "relative",
              fontSize: '1rem',
              fontWeight: '500',
              color: 'rgb(166, 170, 181)',
              letterSpacing: '0.1rem'
            } : {
              position: "relative",
              fontSize: '1.1rem',
              fontWeight: '500',
              color: 'rgb(166, 170, 181)',
              letterSpacing: '0.1rem'
            }
          }>
          <TextBind
            data={parameterBindData}
            bindTitle="方案副标题"
            bindCode={`plan_sub_title__${code}_text`}
          />
          {getValue(parameterBindData, `plan_sub_title__${code}_text`) || '副标题副标题副标题副标题'}
        </div>
        <div
          style={
            isMobile ? {
              position: "relative",
              width: "100%",
              height: "14rem",
              borderRadius: "4px",
              overflow: "hidden",
            } : {
              position: "relative",
              width: "100%",
              height: "20rem",
              borderRadius: "4px",
              overflow: "hidden",
            }
          }
        >
          <ImageBind
            bindCode={`plan_background_${code}__image`}
            bindTitle="方案背景图片"
            data={parameterBindData}
            style={{ right: '1rem', top: '1rem' }}
          />
          <div
            className='imageBox'
            style={{
              backgroundImage: `url(${getValue(parameterBindData, `plan_background_${code}__image`) || '/image/background.jpg'})`,
            }}
          />
        </div>
      </div>
      {
        direction === 'left' && (
          <div
            className='contentBox'
            style={{
              position: "relative",
            }}
          >
            <TextBind
              data={parameterBindData}
              bindTitle="方案内容"
              bindCode={`plan_content__${code}_text`}
            />
            {getValue(parameterBindData, `plan_content__${code}_text`) || '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'}
          </div>
        )
      }
    </div>
  );
};


export default ArticleItem;
