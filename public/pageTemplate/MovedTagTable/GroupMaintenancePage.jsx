import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import moment from 'moment';

//接口

//组件
import { getJsonKeySum, lyArrayToString, lyResultTip } from '@/utils/lyTool.js';
import { CloseOutlined, DeleteOutlined, EditOutlined, FileAddOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';

//样式

//模板
const GroupMaintenancePage = (props) => {

    let { } = props;

    //组件初始化
    const { TextArea } = Input;
    const { RangePicker } = DatePicker;

    let TableColumns = [
        {
            title: '组别名称',
            dataIndex: 'groupName',
            key: 'groupName',
            width: "10rem"
        },
        {
            title: '检验项目',
            dataIndex: 'experimentalProjectList',
            key: 'experimentalProjectList',
            width: "26rem",
            render: (text, record, index) => (
                <div
                    style={{ display: "flex", flexWrap: "wrap", alignContent: "center", width: "100%", minHeight: "3rem", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "0.25rem" }}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, index, 'experimentalProjectList')}
                    onDrop={(e) => handleDrop(e, index, 'experimentalProjectList', record, "experimentalProjectList")}
                >
                    {(() => {
                        let { experimentalProjectList } = record;
                        if (experimentalProjectList != undefined && experimentalProjectList != "") {
                            return experimentalProjectList.split("$$").map(tagId => {
                                let tagCarrier = movableTagList[tagId];
                                return (
                                    <Tag style={{ display: "flex", alignItems: "center", margin: "0.5rem", height: "2rem" }} draggable onDragStart={(e) => handleDragStart(e, JSON.stringify(tagCarrier))}>
                                        {tagCarrier["tagContext"]}
                                        <Button type='link' size='small' style={{ color: "rgba(0,0,0,0.5)" }} onClick={() => removeCurrentTag(tagCarrier)}>
                                            <CloseOutlined />
                                        </Button>
                                    </Tag>
                                );
                            });
                        }
                    })()}
                </div>
            )
        }, {
            title: '样品',
            dataIndex: 'sampleNameList',
            key: 'sampleNameList',
            width: "26rem",
            render: (text, record, index) => (
                <div
                    style={{ display: "flex", flexWrap: "wrap", alignItems: "center", width: "100%", minHeight: "3rem", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "0.25rem" }}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, index, 'sampleNameList')}
                    onDrop={(e) => handleDrop(e, index, 'sampleNameList', record, "sampleNameList")}
                >
                    {(() => {
                        let { sampleNameList } = record;
                        if (sampleNameList != undefined && sampleNameList != "") {
                            return sampleNameList.split("$$").map(tagId => {
                                let tagCarrier = movableTagList[tagId];
                                return (
                                    <Tag style={{ display: "flex", alignItems: "center", margin: "0.5rem", height: "2rem" }} draggable onDragStart={(e) => handleDragStart(e, JSON.stringify(tagCarrier))}>
                                        {tagCarrier["tagContext"]}
                                        <Button type='link' size='small' style={{ color: "rgba(0,0,0,0.5)" }} onClick={() => removeCurrentTag(tagCarrier)}>
                                            <CloseOutlined />
                                        </Button>
                                    </Tag>
                                );
                            });
                        }
                    })()}
                </div>
            )
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: "12rem",
            fixed: 'right',
            render: (_, rowData) => (
                <>
                    <Button
                        type="link"
                        icon={<EditOutlined />} >编辑</Button>
                    <Popconfirm
                        title="确定删除该组?"
                        // onConfirm={() => delRowFunc(rowData["index"])}
                        okText="是"
                        cancelText="否"
                        okButtonProps={{ loading: delBtnLoading }}
                    >
                        <Button
                            type="link"
                            icon={<DeleteOutlined />} >删除</Button>
                    </Popconfirm>
                </>
            ),
        }
    ]

    //useState
    const [tableDataList, setTableDataList] = useState([
        { groupNameId: "leg0001", groupName: "leg1", experimentalProjectList: "", sampleNameList: "" },
        { groupNameId: "leg0002", groupName: "leg2", experimentalProjectList: "", sampleNameList: "" }]);  //表格数据
    const [tableLoading, setTableLoading] = useState(false); //表格加载状态
    const [delBtnLoading, setDelBtnLoading] = useState(false); //删除加载状态

    //拖动组件(靠tagType分类)
    const [movableTagList, setMovableTagList] = useState({
        'experTag001': { tagId: "experTag001", tagContext: "检验项目1", tagType: "experimentalProjectList", tagAffiliation: "" },
        'experTag002': { tagId: "experTag002", tagContext: "检验项目2", tagType: "experimentalProjectList", tagAffiliation: "" },
        'experTag003': { tagId: "experTag003", tagContext: "检验项目3", tagType: "experimentalProjectList", tagAffiliation: "" },
        'sampleTag001': { tagId: "sampleTag001", tagContext: "样品1(编号0001)", tagType: "sampleNameList", tagAffiliation: "" },
        'sampleTag002': { tagId: "sampleTag002", tagContext: "样品2(编号0002)", tagType: "sampleNameList", tagAffiliation: "" },
        'sampleTag003': { tagId: "sampleTag003", tagContext: "样品3(编号0003)", tagType: "sampleNameList", tagAffiliation: "" },
        'sampleTag004': { tagId: "sampleTag004", tagContext: "样品4(编号0004)", tagType: "sampleNameList", tagAffiliation: "" }
    });


    //useEffect
    //modal初始化
    useEffect(() => {
        console.log("GroupMaintenancePage");
    }, []);

    //func

    //////标签事件
    //拖起事件
    const handleDragStart = (event, content) => {
        console.log(event);
        event.dataTransfer.setData('text/plain', content);
    };
    //放手事件
    const handleDragEnd = (event) => {
        console.log("标签松手了");
    };

    //////盒事件
    //略过事件
    const handleDragOver = (event) => {
        event.preventDefault();
    };
    //进入事件
    const handleDragEnter = (event, rowIndex, columnIndex) => {
        event.preventDefault();
    };
    //离开事件
    const handleDragLeave = (event, rowIndex, columnIndex) => {
        event.preventDefault();
    };
    //释放事件
    const handleDrop = (event, rowIndex, columnIndex, record = {}, boxType = "") => {
        try {
            event.preventDefault();
            //获取当前标签的信息
            const tagCarrier = JSON.parse(event.dataTransfer.getData('text/plain'));
            let { tagId, tagAffiliation, tagType } = tagCarrier;
            if (boxType != tagType) {
                lyResultTip(2, "请拖放到正确的位置", "");
                return;
            }
            //修改表格内容
            //由空拖动到表格的清空
            let updatedData = [...tableDataList];
            if (tagAffiliation == "" || tagAffiliation == null) {
                let targetData = updatedData.find((item) => item["groupNameId"] == record["groupNameId"]);
                if (targetData) {
                    let currentTagArr = targetData[boxType] ? targetData[boxType].split("$$") : [];
                    if (!currentTagArr.includes(`${tagId}`)) { //不能重复添加
                        currentTagArr.push(`${tagId}`);
                    }
                    targetData[boxType] = lyArrayToString(currentTagArr, "$$");

                    //修改标签信息
                    let movableTagListTemp = { ...movableTagList };
                    movableTagListTemp[tagId]["tagAffiliation"] = record["groupNameId"]; //绑定组
                    setMovableTagList(movableTagListTemp);
                }
            } else { //由表格拖到另一个表格的情况
                let targetData = updatedData.find((item) => item["groupNameId"] == record["groupNameId"]);
                if (targetData) {
                    let previousGroup = tagAffiliation; //上一个组
                    //先移除
                    const needRemovedData = updatedData.find((item) => item["groupNameId"] == previousGroup);
                    if (needRemovedData) {
                        let needRemovedTagArr = needRemovedData[boxType] ? needRemovedData[boxType].split("$$") : [];
                        let currentNeedRemovedTagArr = needRemovedTagArr.filter((id) => id != `${tagId}`);
                        needRemovedData[boxType] = lyArrayToString(currentNeedRemovedTagArr, "$$");
                    }
                    //再添加
                    const targetData = updatedData.find((item) => item["groupNameId"] == record["groupNameId"]);
                    if (targetData) {
                        let currentTagArr = targetData[boxType] ? targetData[boxType].split("$$") : [];
                        if (!currentTagArr.includes(`${tagId}`)) { //不能重复添加
                            currentTagArr.push(`${tagId}`);
                        }
                        targetData[boxType] = lyArrayToString(currentTagArr, "$$");

                        //修改标签信息
                        let movableTagListTemp = { ...movableTagList };
                        movableTagListTemp[tagId]["tagAffiliation"] = record["groupNameId"]; //绑定组
                        setMovableTagList(movableTagListTemp);
                    }
                }
            }
            setTableDataList(updatedData);
        } catch (error) {
            console.log(error);
            lyResultTip(3, "异常错误", "异常错误");
        }
    };
    //移除标签
    function removeCurrentTag(tagCarrier, boxType) {
        try {
            let { tagId, tagType } = tagCarrier;
            let tagAffiliation = movableTagList[tagId]["tagAffiliation"]; //当前标签所在组
            //修改表格内容
            const updatedData = [...tableDataList];
            const targetData = updatedData.find((item) => item["groupNameId"] == tagAffiliation);
            if (targetData) {
                let currentTagArr = targetData[tagType] ? targetData[tagType].split("$$") : [];
                let removedCurrentTagArr = currentTagArr.filter((id) => id != `${tagId}`);
                targetData[tagType] = lyArrayToString(removedCurrentTagArr, "$$");

                //修改标签信息
                let movableTagListTemp = { ...movableTagList };
                movableTagListTemp[tagId]["tagAffiliation"] = ""; //清空组
                setMovableTagList(movableTagListTemp);
            }
            setTableDataList(updatedData);
        } catch (error) {
            lyResultTip(3, "异常错误", "异常错误");
        }
    }

    return (
        <>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Button
                    style={{
                        marginLeft: "1rem"
                    }}
                    type="primary">
                    <FileAddOutlined /> 新增组别
                </Button>
                <Button
                    style={{
                        marginLeft: "1rem"
                    }}
                    type="primary">
                    <SaveOutlined /> 保存状态
                </Button>
                <Button
                    style={{
                        marginLeft: "1rem"
                    }}
                    type="primary">
                    <ReloadOutlined /> 刷新
                </Button>
            </div>
            <Divider style={{ margin: "0.5rem 0 0.5rem 0" }} />
            {/* 检验项目列表 */}
            <div style={{ display: "flex", alignItems: "center", width: "100%", minHeight: "3rem" }}>
                <div style={{ width: "8rem", paddingRight: "1rem", textAlign: "right" }}>检验项目列表:</div>
                <div style={{ flex: "1", flexShrink: "0", display: "flex", flexWrap: "wrap" }}>
                    {(() => {
                        let showTagArr = [];
                        if (movableTagList != undefined) {
                            for (const tagId in movableTagList) {
                                if (Object.hasOwnProperty.call(movableTagList, tagId)) {
                                    const tagCarrier = movableTagList[tagId];
                                    let { tagAffiliation, tagType } = tagCarrier;
                                    if ((tagAffiliation == "" || tagAffiliation == null) && tagType == "experimentalProjectList") {
                                        showTagArr.push(
                                            <Tag
                                                style={{ display: "flex", alignItems: "center", margin: "0.25rem 0.25rem 0.25rem 0", height: "2rem" }}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, JSON.stringify(tagCarrier))}
                                                onDragEnd={handleDragEnd}
                                            >
                                                {tagCarrier["tagContext"]}
                                            </Tag>
                                        )
                                    }
                                }
                            }
                        }
                        return showTagArr;
                    })()}
                </div>
            </div>
            {/* 样品列表 */}
            <div style={{ display: "flex", alignItems: "center", width: "100%", minHeight: "3rem" }}>
                <div style={{ width: "8rem", paddingRight: "1rem", textAlign: "right" }}>样品列表:</div>
                <div style={{ flex: "1", flexShrink: "0", display: "flex", flexWrap: "wrap" }}>
                    {(() => {
                        let showTagArr = [];
                        if (movableTagList != undefined) {
                            for (const tagId in movableTagList) {
                                if (Object.hasOwnProperty.call(movableTagList, tagId)) {
                                    const tagCarrier = movableTagList[tagId];
                                    let { tagAffiliation, tagType } = tagCarrier;
                                    if ((tagAffiliation == "" || tagAffiliation == null) && tagType == "sampleNameList") {
                                        showTagArr.push(
                                            <Tag
                                                style={{ display: "flex", alignItems: "center", margin: "0.25rem 0.25rem 0.25rem 0", height: "2rem" }}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, JSON.stringify(tagCarrier))}
                                                onDragEnd={handleDragEnd}
                                            >
                                                {tagCarrier["tagContext"]}
                                            </Tag>
                                        )
                                    }
                                }
                            }
                        }
                        return showTagArr;
                    })()}
                </div>
            </div>

            {/* 表格 */}
            <Table
                style={{ width: "100%" }}
                scroll={{ x: "100%", y: "50vh" }}
                bordered
                columns={TableColumns}
                dataSource={tableDataList}
                loading={tableLoading}
                pagination={false}
            >
            </Table>
        </>
    );
};


export default GroupMaintenancePage;
