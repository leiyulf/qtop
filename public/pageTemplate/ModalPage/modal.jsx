import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, Select } from 'antd';
import { AppstoreAddOutlined, SaveOutlined } from '@ant-design/icons';
import moment from 'moment';

//接口

//组件

//方法
import { getErrorCount, lyResultTip, getCurrentCompany, getCurrentUser } from '@/utils/lyTool';

//样式

//模板
const HandleModal = (props) => {
    let {
        modalVisible,
        setModalVisible,
        modalType = "add",
        modalData = {},
        afterSub,
    } = props;

    //组件初始化
    const [pageForm] = Form.useForm();
    const { TextArea } = Input;

    //useState
    const [addBtnLoading, setAddBtnLoading] = useState(false); //按钮加载

    //useEffect
    //modal初始化
    useEffect(() => {
        if (modalVisible == false) {
            pageForm.resetFields(); //清空Form
        }
    }, [modalVisible]);

    //modal数据初始化
    useEffect(() => {
        if (modalData && JSON.stringify(modalData) !== "{}") {
            pageForm.setFieldsValue({ ...modalData });
        }
    }, [modalData]);

    //func
    //点击提交或修改
    async function btnSubmit(close = false) {
        try {
            await pageForm.validateFields(); //表单验证
            let formDataJson = { ...pageForm.getFieldsValue() };
            let postData = {
                id: modalData["id"] ?? null,
                ...formDataJson,
                affiliationGroup: getCurrentCompany(),
                handleUser: getCurrentUser("username"),
                handleTime: new moment().format("YYYY-MM-DD HH:mm:ss")
            };
            setAddBtnLoading(true);
            //let handleResult = await handleAppMenuList([postData]);   ↓↓替换↓↓
            let handleResult = {};
            if (getErrorCount(handleResult) == 0) {
                lyResultTip(1, "保存成功");
                if (close) {
                    setModalVisible(false);
                } else {
                    pageForm.resetFields(); //清空Form
                }
                afterSub && afterSub();
            } else {
                lyResultTip(3, "保存失败");
            }
            setAddBtnLoading(false);
        } catch (errorInfo) {
            console.log(errorInfo);
            lyResultTip(3, "异常错误");
            setAddBtnLoading(false);
        }
    }

    return (
        <Modal
            centered
            title={""}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            maskClosable={false}
            footer={
                <>
                    <Button
                        key="submit"
                        type="primary"
                        loading={addBtnLoading}
                        disabled={modalType == "edit"}
                        onClick={() => btnSubmit(false)}
                        icon={<AppstoreAddOutlined />}>
                        保存
                    </Button>
                    <Button
                        key="submit"
                        type="primary"
                        loading={addBtnLoading}
                        onClick={() => btnSubmit(true)}
                        icon={<SaveOutlined />}>
                        保存
                    </Button>
                    <Button
                        key="close"
                        type="primary"
                        onClick={() => setModalVisible(false)}>
                        关闭
                    </Button>
                </>
            }>
            <Form
                form={pageForm}
                name="pageFormModal"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
            >
                <Form.Item
                    label="测试"
                    name="test"
                    rules={[{ required: true, message: '请输入' }]}
                >
                    <Input placeholder='请输入' />
                </Form.Item>
            </Form>
        </Modal >
    );
};


export default HandleModal;
