import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import moment from 'moment';

//接口

//组件
import HeaderBar from '@/component/Customer/HeaderBar/HeaderBar';
import TextBind from '@/component/Global/TextBind/TextBind';
import ImageBind from '@/component/Global/ImageBind/ImageBind';

//方法
import { useSelector } from 'react-redux';
import { getValue } from '@/utils/Tool';

//样式
import "./HomePage.css";

//模板
const HomePage = (props) => {

  let {
    rule = 'customer'
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
    <div className="HomePage">
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* 主体 */}
        <div
          style={
            isMobile ? {
              position: "relative",
              display: 'flex',
              flexDirection: 'column',
              width: "100%",
              height: "100%",
            } : {
              position: "relative",
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              width: "100%",
              height: "100%",
            }
          }
        >
          <div
            style={
              isMobile ? {
                position: "relative",
                display: 'flex',
                flexDirection: 'column',
                gap: '3rem',
                padding: '9rem 2rem 2rem 2rem',
                boxSizing: "border-box",
                zIndex: 2
              } : {
                position: "relative",
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '6rem 2rem 7rem 4rem',
                boxSizing: "border-box",
                zIndex: 2
              }
            }
          >
            <div style={
              isMobile ? {
                position: "relative",
                fontSize: "2rem",
                color: "white",
                fontWeight: "bold",
                letterSpacing: "0.1rem",
                textAlign: "center"
              } : {
                position: "relative",
                fontSize: "4rem",
                color: "white",
                fontWeight: "bold",
                letterSpacing: "0.1rem"
              }
            }
              className='gradientText'
            >
              <TextBind
                data={parameterBindData}
                bindTitle="页面1主标题"
                bindCode="page1_main_title__text"
              />
              {getValue(parameterBindData, 'page1_main_title__text') || 'Q-TOP ® = 质量视角 + 信息化手段'}
            </div>
            <div style={
              isMobile ? {
                position: "relative",
                fontSize: "1.1rem",
                fontWeight: "bold",
                color: "#a6aab5",
                letterSpacing: "0.1rem",
                textAlign: "center"
              } : {
                position: "relative",
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#a6aab5",
                letterSpacing: "0.1rem"
              }
            }>
              <TextBind
                data={parameterBindData}
                bindTitle="页面1副标题"
                bindCode="page1_contact_title__text"
              />
              {getValue(parameterBindData, 'page1_contact_title__text') || 'Q-TOP ® = 质量视角 + 信息化手段'}
            </div>
          </div>

          <div
            style={
              isMobile ? {
                position: "relative",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                width: "100%",
                height: "100%",
                padding: '0 3rem 6rem 3rem',
                boxSizing: "border-box",
                zIndex: 2
              } : {
                flexShrink: 0,
                position: "relative",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'end',
                width: "26rem",
                height: "100%",
                paddingBottom: '7rem',
                boxSizing: "border-box",
                zIndex: 2
              }
            }
          >
            <div className={isMobile ? 'column' : 'row'} style={{ gap: '1rem' }}>
              <a href="#Page5" className='normalButton'>
                立即联系我们
              </a>

              <a href="#Page3" className='hollowOut normalButton'>
                解决方案
              </a>
            </div>
          </div>
        </div>
        {/* 背景 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${getValue(parameterBindData, 'page1_background__image') || '/image/background.jpg'})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "blur(3px) brightness(0.2)",
              transform: "scale(1.03)",
              zIndex: -1
            }}
          />
        </div>
        <ImageBind
          bindCode="page1_background__image"
          bindTitle="页面1背景图片"
          data={parameterBindData}
          style={{ right: '2rem', top: '7rem' }}
        />
      </div>
    </div >
  );
};


export default HomePage;
