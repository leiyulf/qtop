import React, { useState, useEffect } from 'react';
import { Card, Table, Popconfirm, Button, message, Popover, Form, Select, Input, DatePicker } from 'antd';
import { DeleteOutlined, ReloadOutlined, RestOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

//组件

//接口

//方法
import { testDataJson } from './testData.js';
import { tableRow } from './tableRow.js';

//样式

//模板
const tablePage = (props) => {

    const [searchForm] = Form.useForm();
    const { RangePicker } = DatePicker;
    const { TextArea } = Input;

    //useState
    const [tableDataList, setTableDataList] = useState([]);  //表格数据
    const [tableLoading, setTableLoading] = useState(false); //表格加载状态
    const [delBtnLoading, setDelBtnLoading] = useState(false); //删除加载状态  
    const [popOpen, setPopOpen] = useState(false);//筛选气泡显示

    //分页器
    const [pagination, setPagination] = useState({
        current: 1,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100']
    });

    //useEffect
    //获取数据，加载表格
    useEffect(() => {
        refreshTableList();
    }, []);


    //表格结构
    const TableColumns = [
        ...tableRow,
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: "24rem",
            fixed: 'right',
            render: (_, rowData) => (
                <Popconfirm
                    title="确定删除该行数据?"
                    onConfirm={() => delRowFunc(rowData["index"])}
                    okText="是"
                    cancelText="否"
                    okButtonProps={{ loading: delBtnLoading }}
                >
                    <Button
                        type="link"
                        icon={<DeleteOutlined />} >删除</Button>
                </Popconfirm>
            ),
        }
    ]

    //func
    //刷新列表
    async function refreshTableList() {
        setTableLoading(true);
        let dataJson = testDataJson;
        if (dataJson !== undefined) {
            setTableDataList(dataJson);
        }
        setTableLoading(false);
    }

    //删除行数据
    async function delRowFunc(value) {
        console.log(value);
    }

    //表格操作
    const tableAction = (pagination) => {
        setPagination(pagination);
    }
    return (
        <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "white" }}>
            {/* 顶栏 */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", padding: '0.5rem 1.5rem', backgroundColor: '#e6f7ff' }}>
                <Popover
                    content={
                        <div style={{ width: "34rem" }}>
                            <Form
                                form={searchForm}
                                name="searchForm"
                                autoComplete="off"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}
                            >
                                <Form.Item
                                    label="测试"
                                    name="test"
                                >
                                    <Input placeholder='请输入测试' />
                                </Form.Item>
                            </Form>
                            <div>
                                <Button
                                    icon={<SearchOutlined />}
                                    style={{ marginLeft: "25%" }}
                                    type='primary' >搜索</Button>
                                <Button
                                    icon={<RestOutlined />}
                                    style={{ marginLeft: "1rem" }}
                                    onClick={() => { searchForm.resetFields() }} >重置</Button>
                            </div>
                        </div>
                    }
                    title="筛选搜索"
                    trigger="click"
                    open={popOpen}
                    onOpenChange={(state) => { setPopOpen(state) }}
                >
                    <Button
                        style={{
                            marginLeft: "1rem"
                        }}
                        type="primary">
                        <SearchOutlined /> 筛选搜索
                    </Button>
                </Popover>
                <Button
                    style={{
                        marginLeft: "1rem"
                    }}
                    onClick={() => refreshTableList()}
                    type="primary">
                    <ReloadOutlined /> 刷新
                </Button>
            </div>

            {/* 表格 */}
            <Table
                style={{ width: "100%" }}
                scroll={{ x: "100%", y: "calc(100vh - 94px - 12.2rem)" }}
                onChange={tableAction}
                pagination={pagination}
                bordered
                columns={TableColumns}
                dataSource={tableDataList}
                loading={tableLoading}
            >
            </Table>
        </div >
    );
};


export default tablePage;