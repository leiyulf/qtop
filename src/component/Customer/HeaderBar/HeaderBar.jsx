// HeaderBar.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Image, Drawer } from 'antd';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { UnorderedListOutlined } from '@ant-design/icons';

//组件
import ListItem from './Component/ListItem/ListItem';

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
  const isMobile = useSelector(state => state.globalData.isMobile);
  //useState
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  //useEffect
  //modal初始化
  useEffect(() => {
  }, []);

  //func
  const showMobileMenu = () => {
    setMobileMenuVisible(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuVisible(false);
  };

  const menuItems = [
    { label: '首页', link: '/', icon: <UnorderedListOutlined /> },
    { label: '解决方案', link: '/#Page3', icon: <UnorderedListOutlined /> },
    { label: '新闻资讯', link: '/news', icon: <UnorderedListOutlined /> },
    { label: '交流中心', link: '/#Page5', icon: <UnorderedListOutlined /> },
    { label: '关于我们', link: '/#Page5', icon: <UnorderedListOutlined /> },
    { label: '软件试用', link: '/#Page5', icon: <UnorderedListOutlined /> },
    { label: '软件产品', link: '/#Page2', icon: <UnorderedListOutlined /> },
  ];

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
      {/* PC 模式 */}
      {
        (!isMobile) && (
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
        )
      }
      {/* Mobile 模式 */}
      {
        isMobile && (
          <>
            <UnorderedListOutlined
              style={{ fontSize: '1.5rem', color: '#84e2d8' }}
              onClick={showMobileMenu}
            />
            <Drawer
              title={
                <div
                  className='gradientText'
                  style={{
                    fontSize: '1.2rem',
                    textAlign: 'center',
                  }}
                >
                  菜单
                </div>
              }
              placement="right"
              onClose={closeMobileMenu}
              open={mobileMenuVisible}
              width={200}
              closable={false}
              styles={{
                header: {
                  background: '#0A0B0D',
                  borderBottom: '1px solid rgb(72, 72, 72)',
                  borderLeft: '1px solid rgb(72, 72, 72)',
                },
                body: {
                  background: '#1A1A1A',
                  padding: 0,
                  borderLeft: '1px solid rgb(72, 72, 72)',
                }
              }}
            >
              <div className="mobile-menu">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className={`mobile-menu-item ${light == item.label ? 'gradientText' : ''}`}
                    onClick={() => {
                      window.open(item.link, '_self');
                      closeMobileMenu();
                    }}
                  >
                    {item.icon}
                    <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </Drawer>
          </>
        )
      }
    </div>
  );
};

export default HeaderBar;