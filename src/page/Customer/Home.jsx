import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

//接口
import { getAllBindValue } from '@/service/MainBindPage';

//组件
import HomePage from './HomePage/HomePage';
import Page2 from './Page2/Page2';
import Page3 from './Page3/Page3';
import Page4 from './Page4/Page4';
import Page5 from './Page5/Page5';
import FooterPage from './FooterPage/FooterPage';
import PageLoading from '@/component/Global/PageLoading/PageLoading';
import BackToTop from '@/component/Global/BackToTop/BackToTop'; // 引入新组件
import HeaderBar from '@/component/Customer/HeaderBar/HeaderBar';

//方法
import { setParameterBindDataMap } from '@/reducer/parameterBindSlice.js';
import { checkAndSetDevice } from '@/utils/Tool';

//样式

//模板
const Home = (props) => {

  let {
    rule = 'customer'
  } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const dataMap = useSelector(state => state.parameterBind.data);
  const isMobile = useSelector(state => state.globalData.isMobile);

  //useState
  const [loading, setLoading] = useState(false);

  //useEffect
  //modal初始化
  useEffect(() => {
    loadEnv();
    refreshDataList();
  }, []);

  //func
  async function loadEnv(){
    checkAndSetDevice();
  }

  async function refreshDataList() {
    setLoading(true);
    let getResult = await getAllBindValue({});
    if (getResult?.success == true) {
      let dataList = getResult.data || [];
      let dataMap = {};
      Array.from(dataList).forEach(item => {
        dataMap[item.bindCode] = item;
      });
      dispatch(setParameterBindDataMap(dataMap));
    }
    setLoading(false);
  }

  return (
    <div className={`Customer ${rule == 'admin' ? 'adminMode' : 'customerMode'}`} style={{ overflowX: 'hidden' }}>
      <PageLoading loading={loading} />
      <HeaderBar light={'首页'} fixed={rule == 'customer' ? true : false} />
      <HomePage rule={rule} />
      <Page2 rule={rule} />
      <Page3 rule={rule} />
      <Page4 rule={rule} />
      <Page5 rule={rule} />
      <FooterPage rule={rule} />
      <BackToTop /> {/* 使用返回顶部组件 */}
    </div>
  );
};

export default Home;