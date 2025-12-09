import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import moment from 'moment';
import { EnvironmentOutlined } from '@ant-design/icons';

//接口

//组件
import TextBind from '@/component/Global/TextBind/TextBind';
import ImageBind from '@/component/Global/ImageBind/ImageBind';
import ListBind from '@/component/Global/ListBind/ListBind';

//方法
import { useSelector } from 'react-redux';
import { getValue } from '@/utils/Tool';

//样式
import "./FooterPage.css";

//模板
const FooterPage = (props) => {

  let { 
    rule = 'customer'
  } = props;

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
    <div
    className={`FooterPage ${rule == 'admin' ? 'adminMode' : 'customerMode'}`}
      style={{ padding: '6rem 10rem 3rem 10rem' }}
    >
      <div className='row' style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8rem' }}>
        <div className='column' style={{ gap: '1rem' }}>
          <div style={{ position: "relative", fontSize: '1.5rem', fontWeight: 'bold', color: 'white', letterSpacing: '0.1rem' }}>
            <TextBind
              data={globalDataBindData}
              bindTitle="底栏文本1"
              bindCode="page6_bottom_text1__text"
            />
            {getValue(globalDataBindData, 'page6_bottom_text1__text') || '客服热线'}
          </div>
          <div style={{ position: "relative", fontSize: '2rem', fontWeight: 'bold', color: 'white', letterSpacing: '0.1rem' }}>
            <TextBind
              data={globalDataBindData}
              bindTitle="底栏文本2"
              bindCode="page6_bottom_text2__text"
            />
            {getValue(globalDataBindData, 'page6_bottom_text2__text') || '0512-55230818'}
          </div>
          <div style={{ position: "relative", fontSize: '1.5rem', fontWeight: 'bold', color: 'white', letterSpacing: '0.1rem' }}>
            <TextBind
              data={globalDataBindData}
              bindTitle="底栏文本3"
              bindCode="page6_bottom_text3__text"
            />
            <EnvironmentOutlined style={{ marginRight: '0.5rem' }} />{getValue(globalDataBindData, 'page6_bottom_text3__text') || '地址'}
          </div>
          <div style={{ position: "relative", fontSize: '0.75rem', fontWeight: 'bold', color: 'white', letterSpacing: '0.1rem' }}>
            <TextBind
              data={globalDataBindData}
              bindTitle="底栏文本4"
              bindCode="page6_bottom_text4__text"
            />
            {getValue(globalDataBindData, 'page6_bottom_text4__text') || '江苏省苏州市昆山市祖冲之南路1699号1号楼101室'}
          </div>
        </div>
        {/* 解决方案 */}
        <div className='childList'>
          <div>解决方案</div>
          <div>机加行业</div>
          <div>化工行业</div>
          <div>汽车电子</div>
          <div>半导体行业</div>
        </div>
        {/* 软件产品 */}
        <div className='childList'>
          <div>软件产品</div>
          <div>Q-TOP QMS</div>
          <div>Q-TOP LIMS</div>
          <div>Q-TOP SPC</div>
          <div>Q-TOP FMEA</div>
          <div>Q-TOP 8D</div>
          <div>Q-TOP RoHS</div>
        </div>
        {/* 案例中心 */}
        <div className='childList'>
          <div>案例中心</div>
          <div>半导体行业</div>
          <div>信息行业</div>
          <div>机械加工行业</div>
          <div>化工行业</div>
          <div>汽车制造行业</div>
        </div>
        {/* 新闻 */}
        <div className='childList'>
          <div>新闻</div>
          <div>公司新闻</div>
          <div>质量学堂</div>
          <div>行业新闻</div>
        </div>
        {/* 关于我们 */}
        <div className='childList'>
          <div>关于我们</div>
          <div>联系我们</div>
          <div>江苏比尔信息科技有限公司</div>
        </div>
      </div>
      <div style={{ position: "relative", textAlign: "center", fontSize: "0.8rem", color: '#989898', marginBottom: "2rem" }}>
        <TextBind
          data={globalDataBindData}
          bindTitle="底栏文本5"
          bindCode="page6_bottom_text5__text"
        />
        {getValue(globalDataBindData, 'page6_bottom_text5__text') || '版权所有 江苏比尔信息科技有限公司苏ICP备00000000号'}
      </div>
      <div style={{ position: "relative", textAlign: "center", fontSize: "0.8rem", color: '#989898' }}>
        <TextBind
          data={globalDataBindData}
          bindTitle="底栏文本6"
          bindCode="page6_bottom_text6__text"
        />
        {getValue(globalDataBindData, 'page6_bottom_text6__text') || '比尔信息产品：qms软件开发、spc分析软件、fmea软件、8d品质管理系统、质量管理8d软件、fmea失效分析系统、qms质量管理系统软件开发等，欢迎咨询FMEA开发公司。'}
      </div>
    </div>
  );
};


export default FooterPage;
