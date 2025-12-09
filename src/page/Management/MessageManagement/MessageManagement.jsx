import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Radio } from 'antd';
import moment from 'moment';

import { CheckOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';

//接口
import { deleteMessage, getAllMessage, updateMessage } from '@/service/CustomerMessage';

//组件
import OperationBtns from '@/component/Global/OperationBtns/OperationBtns';
import { resultTip } from '@/utils/lyTool';

//方法

//样式

//模板
const MessageManagement = (props) => {

  let { } = props;

  //组件初始化
  const [filterForm] = Form.useForm();
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  //useWatch
  const readStateWatch = Form.useWatch(['readState'], filterForm);

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
      title: '姓名',
      dataIndex: 'customerName',
      key: 'customerName',
      width: '120px'
    },
    {
      title: '手机号',
      dataIndex: 'customerTelephone',
      key: 'customerTelephone',
      width: '120px'
    },
    {
      title: '邮箱',
      dataIndex: 'customerEmail',
      key: 'customerEmail',
      width: '120px'
    },
    {
      title: '微信',
      dataIndex: 'customerWechat',
      key: 'customerWechat',
      width: '120px'
    },
    {
      title: '留言',
      dataIndex: 'customerMessage',
      key: 'customerMessage',
      width: '240px'
    },
    {
      title: '留言时间',
      dataIndex: 'commentTime',
      key: 'commentTime',
      width: '140px',
      render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    {
      title: 'IP',
      dataIndex: 'customerIp',
      key: 'customerIp',
      width: '120px'
    },
    {
      title: '状态',
      dataIndex: 'readState',
      key: 'readState',
      width: '80px',
      align: 'center',
      fixed: 'right',
      render: (text) => {
        if (text == 0) return <Tag style={{ margin: '0' }} color="orange">未读</Tag>
        if (text == 1) return <Tag style={{ margin: '0' }} color="green">已读</Tag>
        return <Tag style={{ margin: '0' }} color="red">未知</Tag>
      }
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
            icon={<CheckOutlined />}
            onClick={() => readRowFunc(record)}
          >
            已读
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

  //useEffect
  //modal初始化
  useEffect(() => {
    refreshDataList();
  }, []);

  useEffect(() => {
    let formDataJson = JSON.parse(JSON.stringify(filterForm.getFieldsValue()));
    setTableFilter({ ...formDataJson });
  }, [readStateWatch]);

  //code
  //刷新
  async function refreshDataList(tableFilter = {}) {
    setTableLoading(true);
    try {
      let getResult = await getAllMessage({ ...tableFilter });
      if (getResult?.success != false) {
        let dataList = getResult?.data ?? [];
        dataList = dataList.sort((a, b) => moment(b.commentTime).valueOf() - moment(a.commentTime).valueOf());
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
      let delResult = await deleteMessage(rowData);
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

  //已读
  async function readRowFunc(rowData) {
    setTableLoading(true);
    try {
      let delResult = await updateMessage({ ...rowData, readState: 1 });
      if (delResult?.success != false) {
        resultTip(1, "已读成功");
        refreshDataList();
      } else {
        resultTip(0, "已读失败", delResult?.message ?? "");
      }
    } catch (error) {
      resultTip(0, "已读失败", error?.message ?? "");
    }
    setTableLoading(false);
  }

  return (
    <div className='managementBox' >
      <div className='managementHeader'>
        <div className='title'><UnorderedListOutlined style={{ marginRight: '0.5rem' }} />留言列表</div>
        <div style={{ flex: 1 }} />
        <Form
          layout="inline"
          form={filterForm}
        >
          <Form.Item
            label="状态"
            name='readState'
          >
            <Radio.Group >
              <Radio.Button value={null}>全部</Radio.Button>
              <Radio.Button value={0}>未读</Radio.Button>
              <Radio.Button value={1}>已读</Radio.Button>
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
    </div>
  );
};


export default MessageManagement;