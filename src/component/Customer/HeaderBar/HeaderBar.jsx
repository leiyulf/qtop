import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Image } from 'antd';
import moment from 'moment';

//接口

//组件
import ListItem from './Component/ListItem/ListItem';

//方法

//样式
import "./HeaderBar.css";

//模板
const HeaderBar = (props) => {

  let {
    fixed = true,
    light
  } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  //useState

  //useEffect
  //modal初始化
  useEffect(() => {
    console.log("HeaderBar");
  }, []);

  //func

  return (
    <div className={`${fixed ? 'HeaderBar' : 'HeaderBarNoFixed'}`}>
      {/* logo */}
      <div className='row'>
        <Image
          src="/image/logo.png"
          width={'2rem'}
          height={'2rem'}
          preview={false}
        />
        <div className='column' style={{ marginLeft: '1rem' }}>
          <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: 'white' }}>江苏比尔信息科技</div>
          <div style={{ fontSize: "0.7rem", color: 'white' }}>JIANGSU BLL JINFORMATION TECHNOLGY</div>
        </div>
      </div>

      {/* list */}
      <div className='HeaderBarList'>
        <ListItem
          light={light}
          context='首页'
          onClick={() => {
            window.open(`/`, '_self');
          }}
        />
        <ListItem
          light={light}
          context='软件产品'
        >
          <div className='HeaderBarItemContext'>Q-TOP QMS</div>
          <div className='HeaderBarItemContext'>Q-TOP LIMS</div>
          <div className='HeaderBarItemContext'>Q-TOP SPC</div>
          <div className='HeaderBarItemContext'>Q-TOP FMEA</div>
          <div className='HeaderBarItemContext'>Q-TOP 8D</div>
          <div className='HeaderBarItemContext'>Q-TOP RoHS</div>
        </ListItem>
        <ListItem light={light} context='解决方案' onClick={() => { window.open(`/#Page3`, '_self'); }} />
        <ListItem light={light} context='案例中心' />
        <ListItem context='新闻资讯' light={light} onClick={() => { window.open(`/news`, '_self'); }} />
        <ListItem light={light} context='交流中心' onClick={() => { window.open(`/#Page5`, '_self'); }} />
        <ListItem light={light} context='关于我们' onClick={() => { window.open(`/#Page5`, '_self'); }} />
        <ListItem light={light} context='软件试用' onClick={() => { window.open(`/#Page5`, '_self'); }} />
      </div>
    </div>
  );
};


export default HeaderBar;
