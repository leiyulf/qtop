import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Popover } from 'antd';
import moment from 'moment';
import { FontSizeOutlined, LinkOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

//接口
import { createBind, updateBind, getBindValueByCode } from '@/service/MainBindPage';
import { getAllArticle } from '@/service/ArticleManagement.js';

//组件
import PageLoading from '../PageLoading/PageLoading';
import { updateGlobalDataBindDataMap } from '@/reducer/globalDataBindSlice.js';

//方法
import { getValue, getId } from '@/utils/Tool';

//样式

//模板
const ArticleBind = (props) => {

  let {
    bindTitle,
    bindCode,
    bindType = 'article',
    data,
    style = {}
  } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();

  //useState
  const [id, setId] = useState(null);
  const [value, setValue] = useState(null);
  const [articleList, setArticleList] = useState([]); // 文章列表
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中的文章ID
  const [loading, setLoading] = useState(false);
  const [popVisible, setPopVisible] = useState(false);

  //useEffect
  //modal初始化
  useEffect(() => {
    setValue(getValue(data, bindCode));
    setId(getId(data, bindCode));

    // 获取文章列表
    if(popVisible){
      refreshDataList();
    }
  }, [data, bindCode, popVisible]);
  
  // 获取文章列表
  const refreshDataList = async (filter = {}) => {
    setLoading(true);
    try {
      const getResult = await getAllArticle({ ...filter });
      if (getResult?.success) {
        let dataList = getResult?.data ?? [];
        setArticleList(dataList);
        // 如果已有绑定的文章ID，设置为选中状态
        if (getValue(data, bindCode)) {
          setSelectedRowKeys([getValue(data, bindCode)]);
        }
      }
    } catch (error) {
      console.log(error);
      message.error('获取文章列表失败');
      setLoading(false);
    }
    setLoading(false);
  };

  // 表格列定义
  const columns = [
    {
      title: '标题',
      dataIndex: 'mainTitle',
      key: 'mainTitle',
      width: '160px',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '160px',
      render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    {
      title: '状态',
      dataIndex: 'articleStatus',
      key: 'articleStatus',
      width: '80px',
      align: 'center',
      render: (text) => {
        if (text == 0) return <Tag style={{ margin: '0' }} color="orange">隐藏</Tag>
        if (text == 1) return <Tag style={{ margin: '0' }} color="green">正常</Tag>
        return <Tag style={{ margin: '0' }} color="red">未知</Tag>
      }
    }
  ];

  // 表格行选择配置
  const rowSelection = {
    type: 'radio',
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
      if (selectedRows.length > 0) {
        setValue(selectedRows[0].id); // 设置选中文章的ID作为值
      } else {
        setValue(null);
      }
    }
  };

  //func
  async function bindFunc() {
    setLoading(true);
    let postData = {
      id,
      bindTitle,
      bindCode,
      bindType,
      bindValue: value
    }
    let handleResult = {};
    if (id) {
      handleResult = await updateBind(postData);
    } else {
      handleResult = await createBind(postData);
    }
    if (handleResult?.success == true) {
      message.success('执行成功');
      //小规模刷新
      let getResult = await getBindValueByCode({ bindCode });
      if (getResult?.success == true) {
        let data = getResult.data || {};
        dispatch(updateGlobalDataBindDataMap({ [bindCode]: data }));
      }
    } else {
      message.error('执行失败');
    }
    setLoading(false);
  }

  return (
    <div className='bindComponent' onClick={(e) => { e.stopPropagation() }}>
      <Popover
        placement="bottom"
        title={bindTitle}
        open={popVisible}
        onOpenChange={(visible) => {
          setPopVisible(visible);
        }}
        content={
          <div style={{ width: '660px' }}>
            <PageLoading loading={loading} />
            <div style={{ display: 'flex', height: '56px', alignItems: 'center' }}>
              <Form
                layout='inline'
                form={filterForm}
              >
                <Form.Item label="标题" name="mainTitleLike">
                  <Input style={{ width: '120px' }} placeholder="请输入" allowClear />
                </Form.Item>
                {/* <Form.Item label="创建时间" name="createTime">
                  <DatePicker.RangePicker style={{ width: '220px' }} allowClear />
                </Form.Item> */}
              </Form>
              <div style={{ flex: 1 }} />
              <Button
                type="primary"
                onClick={() => {
                  let filterData = filterForm.getFieldsValue();
                  refreshDataList(filterData);
                }}
              >
                查询
              </Button>
            </div>
            <Table
              rowKey="id"
              dataSource={articleList}
              columns={columns}
              rowSelection={rowSelection}
              scroll={{ x: "100%", y: 300 }}
              pagination={false}
            />
            <Button
              style={{ marginTop: '1rem', width: '100%' }}
              type="primary"
              onClick={bindFunc}
            >
              保存
            </Button>
          </div>
        }
        trigger="click"
      >
        <div
          className='globalBindButton'
          style={{
            borderColor: '#eb2f96',
            fontSize: '1.5rem',
            background: '#ffd6e7',
            top: '2rem',
            right: '-2rem',
            ...style
          }}
        >
          <LinkOutlined
            style={{ color: '#eb2f96' }}
          />
        </div>
      </Popover>
    </div>
  );
};

export default ArticleBind;