import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Image, Tooltip } from 'antd';
import moment from 'moment';

//接口

//组件
import TextBind from '@/component/Global/TextBind/TextBind';
import ImageBind from '@/component/Global/ImageBind/ImageBind';
import TitleTag from '@/component/Global/TitleTag/TitleTag';
import ArticleBind from '@/component/Global/ArticleBind/ArticleBind';

//方法
import { useSelector } from 'react-redux';
import { getValue } from '@/utils/Tool';

//样式
import "./CardItem.css";

//模板
const CardItem = (props) => {

  let {
    code,
    title,
    index
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
    <div
      className="CardItem"
      style={
        isMobile ? {
          width: '16rem'
        } : {
          width: '20rem'
        }
      }
      onClick={(e) => {
        e.stopPropagation();
        let articleCode = getValue(parameterBindData, `card_content_${code}__article`);
        if (articleCode) {
          window.open(`/article/${articleCode}`);
        }
      }}
    >
      <TitleTag value={title} />
      <div
        style={
          isMobile ? {
            position: "relative",
            width: "16rem",
          } : {
            position: "relative",
            width: "20rem",
          }
        }
      >
        {/* 序号 */}
        <div
          style={{
            position: "relative",
            fontSize: '0.9rem',
            color: '#b2f1e8',
            letterSpacing: '4px',
            fontWeight: 'bold',
          }}
        >
          [{index + 1}]
        </div>
        {/* 标题 */}
        <div
          className='title'
          style={{
            position: "relative",
            fontSize: '1.3rem',
            margin: '0.5rem 0 1rem 0',
            color: 'white',
            fontWeight: '600',
            letterSpacing: '2px'
          }}
        >
          <TextBind
            data={parameterBindData}
            bindTitle="卡片主标题"
            bindCode={`card_title__${code}_text`}
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
          {getValue(parameterBindData, `card_title__${code}_text`) || '标题内容'}
        </div>
        {/* 图片 */}
        <div
          style={
            isMobile ? {
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "16rem",
              height: "13rem",
              borderRadius: "3px",
              overflow: "hidden"
            } : {
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "20rem",
              height: "18rem",
              borderRadius: "3px",
              overflow: "hidden"
            }
          }
        >
          <ImageBind
            bindCode={`card_background_${code}__image`}
            bindTitle="卡片背景图片"
            data={parameterBindData}
            style={{ right: '1rem', top: '0.5rem' }}
          />
          <ArticleBind
            bindCode={`card_content_${code}__article`}
            bindTitle="跳转文章"
            data={parameterBindData}
            style={{ right: '1rem', top: '4rem' }}
          />
          <div
            className='CardItemImage'
            style={{
              backgroundImage: `url(${getValue(parameterBindData, `card_background_${code}__image`) || '/image/background.jpg'})`,
            }}
          />
        </div>

        {/* 内容 */}
        <div
          className='content'
          style={{
            position: "relative",
            fontSize: '0.9rem',
            color: '#A6AAB5',
            margin: '1rem 0',
            lineHeight: '1.5rem',
            letterSpacing: '1px',
          }}
        >
          <TextBind
            data={parameterBindData}
            bindTitle="卡片副标题"
            bindCode={`card_sub_title__${code}_text`}
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
          {getValue(parameterBindData, `card_sub_title__${code}_text`) || '详细内容详细内容详细内容详细内容'}
        </div>
      </div>
    </div>
  );
};


export default CardItem;
