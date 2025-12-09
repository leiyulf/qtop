import React, { useState, useEffect } from 'react';
import { Menu, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Modal } from 'antd';
import moment from 'moment';
import { AuditOutlined, FormOutlined, PieChartOutlined, WechatOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SearchOutlined, AppstoreOutlined, BellOutlined } from '@ant-design/icons';

//接口

//组件
import PageLoading from '@/component/Global/PageLoading/PageLoading';

//页面
import CustomerHome from '@/page/Customer/Home.jsx';
import MessageManagement from './MessageManagement/MessageManagement';
import LogManagement from './LogManagement/LogManagement';
import ArticleManagement from './ArticleManagement/ArticleManagement';

//方法

//样式
import "./Home.css";

//模板
const Home = (props) => {

  let {
  } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  //useState
  const [loading, setLoading] = useState(false);
  const [menuKey, setMenuKey] = useState('home');
  const [collapsed, setCollapsed] = useState(false);
  const [showMask, setShowMask] = useState(true); // 新增遮罩状态
  const [password, setPassword] = useState(''); // 新增密码状态
  const [menuItems, setMenuItems] = useState([
    { key: 'home', icon: <FormOutlined />, label: '首页管理' },
    { key: 'article', icon: <AuditOutlined />, label: '文章管理' },
    { key: 'message', icon: <WechatOutlined />, label: '留言列表' },
    { key: 'log', icon: <SearchOutlined />, label: '日志管理' }
  ]);

  //useEffect
  //modal初始化
  useEffect(() => {
    refreshDataList();
  }, []);

  //func
  async function refreshDataList() {
    setLoading(true);

    setLoading(false);
  }

  // 验证密码
  const handlePasswordSubmit = () => {
    if (password === 'billinfo.cn') {
      setShowMask(false);
      message.success('验证成功！');
    } else {
      message.error('密码错误，请重新输入！');
    }
  };

  return (
    <div className={`Management`} style={{ overflowX: 'hidden', position: 'relative' }}>
      {
        (!showMask) && (
          <>
            <div className='ManagementHeader'>
              {/* logo */}
              <div
                style={{
                  display: "flex",
                  alignContent: 'center',
                  justifyItems: 'center',
                  width: collapsed ? '80px' : '256px',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'width 0.2s ease-in-out',

                }}
              >
                <span style={{ fontSize: '1.4rem', color: 'white', fontWeight: 'bold' }}>QMS</span>
              </div>

              {/* 缩放按钮 */}
              <Button
                type="primary"
                onClick={() => {
                  setCollapsed(!collapsed);
                }}
                size='large'
              >
                {collapsed ? <MenuUnfoldOutlined style={{ fontSize: '1.4rem' }} /> : <MenuFoldOutlined style={{ fontSize: '1.4rem' }} />}
              </Button>

              <div style={{ flex: 1 }} />

              {/* 功能按钮组 */}
              <div style={{ display: 'flex', gap: '2rem', marginRight: '2rem' }}>
                <AppstoreOutlined style={{ fontSize: '1.6rem', color: 'white' }} />
                <BellOutlined style={{ fontSize: '1.6rem', color: 'white' }} />
              </div>
            </div>
            <div className='ManagementBody'>
              <Menu
                onClick={(e) => {
                  let { key } = e;
                  setMenuKey(key);
                }}
                style={{ flexShrink: 0, width: collapsed ? 80 : 256, height: '100%' }}
                selectedKeys={[menuKey]}
                mode="inline"
                theme="dark"
                items={menuItems}
                inlineCollapsed={collapsed}
              />
              <div className='ManagementContent' style={{ width: `calc(100% - ${collapsed ? 80 : 256}px)` }}>
                <div className='ManagementContentInner'>
                  {menuKey == 'home' && <CustomerHome rule="admin" />}
                  {menuKey == 'message' && <MessageManagement />}
                  {menuKey == 'log' && <LogManagement />}
                  {menuKey == 'article' && <ArticleManagement />}
                </div>
              </div>
            </div>
          </>
        )
      }

      {/* 遮罩密码层 */}
      {showMask && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#001529',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center',
            minWidth: '300px'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>请输入访问密码</h2>
            <Input.Password
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onPressEnter={handlePasswordSubmit}
              style={{ marginBottom: '1rem' }}
            />
            <Button type="primary" onClick={handlePasswordSubmit}>
              确认
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;