import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Radio } from 'antd';
import moment from 'moment';

import { CheckOutlined, DeleteOutlined, EditOutlined, EyeOutlined, SwapOutlined, UnorderedListOutlined } from '@ant-design/icons';

//接口
import { getAllArticle, createArticle, updateArticle, deleteArticle } from '@/service/ArticleManagement';

//组件
import OperationBtns from '@/component/Global/OperationBtns/OperationBtns';
import Stick from '@/component/Global/Stick/Stick';
import HandleArticle from './component/HandleArticle/HandleArticle';
import PreviewArticle from './component/PreviewArticle/PreviewArticle';
import CoverUploadCell from './component/CoverUploadCell/CoverUploadCell';
import HandleBatchArticle from './component/HandleBatchArticle/HandleBatchArticle';

//方法
import { resultTip } from '@/utils/lyTool';

//样式

//模板
const ArticleManagement = (props) => {

  let { } = props;

  //组件初始化
  const [filterForm] = Form.useForm();
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  //useWatch
  const articleStatusWatch = Form.useWatch(['articleStatus'], filterForm);

  //useState
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [tableDataList, setTableDataList] = useState([]);
  const [tableFilter, setTableFilter] = useState({});
  const [tableColumns, setTableColumns] = useState([
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: '80px',
      align: 'center'
    },
    {
      title: '封面',
      dataIndex: 'cover',
      key: 'cover',
      width: '160px',
      align: 'center',
      render: (text, record) => (
        <CoverUploadCell
          rowData={record}
          updateArticle={updateArticle}
          onSub={() => {
            refreshDataList(tableFilter);
          }}
        />
      )
    },
    {
      title: '主标题',
      dataIndex: 'mainTitle',
      key: 'mainTitle',
      width: '160px'
    },
    {
      title: '编写人',
      dataIndex: 'author',
      key: 'author',
      width: '100px'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '160px',
      render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: '160px',
      render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    {
      title: '文章分组',
      dataIndex: 'articleGroup',
      key: 'articleGroup',
      width: '100px'
    },
    {
      title: '文章状态',
      dataIndex: 'articleStatus',
      key: 'articleStatus',
      width: '100px',
      align: 'center',
      render: (text) => {
        if (text == 0) return <Tag style={{ margin: '0' }} color="orange">隐藏</Tag>
        if (text == 1) return <Tag style={{ margin: '0' }} color="green">正常</Tag>
        return <Tag style={{ margin: '0' }} color="red">未知</Tag>
      }
    },
    {
      title: '浏览次数',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: '100px',
      align: 'center'
    },
    {
      title: '预览',
      dataIndex: 'preview',
      key: 'preview',
      width: '100px',
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setPreviewVisible(true);
            setPreviewData(record);
          }}
        >
          预览
        </Button>
      )
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '100px',
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <OperationBtns>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setHandleVisible(true);
              setHandleData(record);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<SwapOutlined />}
            onClick={() => changeArticleStatus(record)}
          >
            切换状态
          </Button>
          <Popconfirm
            title="确定删除该行数据?"
            onConfirm={() => delRowFunc(record)}
            okText="是"
            cancelText="否"
            okButtonProps={{ loading: tableLoading }}
          >
            <Button
              type="link"
              icon={<DeleteOutlined />} >
              删除
            </Button>
          </Popconfirm>
        </OperationBtns>
      )
    }
  ]);
  const [pagination, setPagination] = useState({
    current: 1,
    defaultPageSize: 20,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total) => `共 ${total} 条记录`
  });

  //维护文章
  const [handleVisible, setHandleVisible] = useState(false);
  const [handleData, setHandleData] = useState({});

  //批量添加文章
  const [handleBatchVisible, setHandleBatchVisible] = useState(false);
  const [handleBatchData, setHandleBatchData] = useState({});

  //预览文章
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState({});

  //useEffect
  //modal初始化
  useEffect(() => {
    refreshDataList();
  }, []);

  useEffect(() => {
    let formDataJson = JSON.parse(JSON.stringify(filterForm.getFieldsValue()));
    setTableFilter({ ...formDataJson });
  }, [articleStatusWatch]);

  //code
  //刷新
  async function refreshDataList(tableFilter = {}) {
    setTableLoading(true);
    try {
      let getResult = await getAllArticle({ ...tableFilter });
      if (getResult?.success != false) {
        let dataList = getResult?.data ?? [];
        dataList = dataList.sort((a, b) => moment(b.updateTime).valueOf() - moment(a.updateTime).valueOf());
        dataList = dataList.map((item, index) => ({ ...item, key: item.id, index: index + 1 }));
        setTableDataList(dataList);
      } else {
        resultTip(0, "获取数据失败", getResult?.message ?? "");
      }
    } catch (error) {
      resultTip(0, "获取数据失败", error?.message ?? "");
    }
    setTableLoading(false);
  }

  //删除行
  async function delRowFunc(rowData) {
    setTableLoading(true);
    try {
      let delResult = await deleteArticle(rowData);
      if (delResult?.success != false) {
        resultTip(1, "删除成功");
        refreshDataList();
      } else {
        resultTip(0, "删除失败", delResult?.message ?? "");
      }
    } catch (error) {
      resultTip(0, "删除失败", error?.message ?? "");
    }
    setTableLoading(false);
  }

  //隐藏显示切换
  async function changeArticleStatus(rowData) {
    setTableLoading(true);
    try {
      let delResult = await updateArticle({ ...rowData, articleStatus: rowData.articleStatus == '0' ? '1' : '0' });
      if (delResult?.success != false) {
        resultTip(1, "操作成功");
        refreshDataList();
      } else {
        resultTip(0, "操作失败", delResult?.message ?? "");
      }
    } catch (error) {
      resultTip(0, "操作失败", error?.message ?? "");
    }
    setTableLoading(false);
  }

  return (
    <div className='managementBox' >
      <div className='managementHeader'>
        <div className='title'><UnorderedListOutlined style={{ marginRight: '0.5rem' }} />文章管理</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button
            type="primary"
            onClick={() => {
              setHandleVisible(true);
              setHandleData({});
            }}
          >
            添加文章
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setHandleBatchVisible(true);
              setHandleBatchData({});
            }}
          >
            批量添加文章
          </Button>
        </div>
        <Stick />
        <Form
          layout="inline"
          form={filterForm}
        >
          <Form.Item
            label="文章状态"
            name='articleStatus'
          >
            <Radio.Group >
              <Radio.Button value={null}>全部</Radio.Button>
              <Radio.Button value={0}>隐藏</Radio.Button>
              <Radio.Button value={1}>显示</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
        <Button
          type="primary"
          onClick={() => { refreshDataList(tableFilter) }}
          loading={tableLoading}
        >
          查询
        </Button>
      </div>
      <Table
        style={{ width: "100%" }}
        scroll={{ x: "100%", y: "calc(100vh - 294px)" }}
        bordered
        pagination={pagination}
        onChange={(pagination) => {
          setPagination(prev => ({
            ...prev,
            ...pagination
          }));
        }}
        columns={tableColumns}
        dataSource={tableDataList}
        loading={tableLoading}
      />

      {/* 文章维护 */}
      {
        handleVisible && (
          <HandleArticle
            drawerVisible={handleVisible}
            setDrawerVisible={setHandleVisible}
            drawerData={handleData}
            onSub={() => {
              refreshDataList(tableFilter);
            }}
          />
        )
      }

      {/* 批量添加文章 */}
      {
        handleBatchVisible && (
          <HandleBatchArticle
            drawerVisible={handleBatchVisible}
            setDrawerVisible={setHandleBatchVisible}
            drawerData={handleBatchData}
            onSub={() => {
              refreshDataList(tableFilter);
            }}
          />
        )
      }

      {/* 预览文章 */}
      {
        previewVisible && (
          <PreviewArticle
            drawerVisible={previewVisible}
            setDrawerVisible={setPreviewVisible}
            drawerData={previewData}
          />
        )
      }
    </div>
  );
};


export default ArticleManagement;