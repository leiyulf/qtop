import React, { useState, useEffect } from 'react';
import { Button, Tag, Divider, Spin, Empty, Card, Drawer, Table, Upload, Modal, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import {
  DatabaseOutlined,
  ClusterOutlined,
  FileTextOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  UploadOutlined,
  InboxOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';

// 接口
import { getDocumentList, uploadDocument, parseDocuments, stopParseDocuments } from '../../QTopAgentServer.js';

// 样式
import './StorageFiles.css';

// 方法
import { resultTip } from '@/utils/lyTool.js';

const StorageFiles = (props) => {
  //init
  const {
    visible,
    setVisible,
    data = {}
  } = props || {};
  const tableColumns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '上传日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    }, {
      title: '切块方法',
      dataIndex: 'chunkMethod',
      key: 'chunkMethod',
    }, {
      title: '分块数量',
      dataIndex: 'chunkCount',
      key: 'chunkCount',
    }, {
      title: '分块大小',
      dataIndex: 'parserConfig',
      key: 'parserConfig',
      render: (text) => text?.chunkTokenNum,
    }, {
      title: '切块分隔符',
      dataIndex: 'parserConfig',
      key: 'parserConfig',
      render: (text) => `${JSON.stringify(text?.delimiter)}`,
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: "180px",
      fixed: 'right',
      render: (_, rowData) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Popconfirm
            title="解析"
            description="确定要启动解析这个文档吗？"
            onConfirm={() => handleParseDocument(rowData)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
            >
              解析
            </Button>
          </Popconfirm>
          <Popconfirm
            title="停止"
            description="确定要停止解析这个文档吗？"
            onConfirm={() => handleStopParse(rowData)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              danger
              size="small"
              icon={<StopOutlined />}
            >
              停止
            </Button>
          </Popconfirm>
        </div>
      ),
    }
  ]

  //useState
  const [loading, setLoading] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  //useEffect
  useEffect(() => {
    refreshDataList();
  }, []);

  //code
  async function refreshDataList() {
    try {
      setLoading(true);
      const getResult = await getDocumentList({ datasetId: data.id });
      if (getResult?.success === true) {
        const dataList = getResult?.data?.docs || [];
        setDocumentList(dataList);
      } else {
        setDocumentList([]);
      }
    } catch (error) {
      resultTip(3, '获取数据失败', error?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  // 上传文件
  const handleUpload = async () => {
    if (fileList.length === 0) {
      resultTip(2, '请先选择要上传的文件');
      return;
    }

    setUploading(true);

    try {
      const file = fileList[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('datasetId', data.id);

      const uploadResponse = await fetch('/api/ragFlow/uploadDocument', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (uploadResult.success) {
        resultTip(1, '上传成功');
        setUploadModalVisible(false);
        setFileList([]);
        refreshDataList();
      } else {
        resultTip(0, uploadResult?.message || '上传文件失败');
      }
    } catch (error) {
      console.error('上传错误:', error);
      resultTip(0, '上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // Upload组件配置
  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      // 文件大小校验 (50MB)
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        resultTip(0, '文件必须小于 50MB!');
        return false;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
  };

  // 启动文档解析
  const handleParseDocument = async (rowData) => {
    try {
      const result = await parseDocuments({
        datasetId: data.id,
        documentIds: [rowData.id],
      });

      if (result?.success) {
        resultTip(1, '启动解析成功');
        refreshDataList();
      } else {
        resultTip(0, result?.message || '启动解析失败');
      }
    } catch (error) {
      console.error('启动解析错误:', error);
      resultTip(0, '启动解析失败，请重试');
    }
  };

  // 停止文档解析
  const handleStopParse = async (rowData) => {
    try {
      const result = await stopParseDocuments({
        datasetId: data.id,
        documentIds: [rowData.id],
      });

      if (result?.success) {
        resultTip(1, '停止解析成功');
        refreshDataList();
      } else {
        resultTip(0, result?.message || '停止解析失败');
      }
    } catch (error) {
      console.error('停止解析错误:', error);
      resultTip(0, '停止解析失败，请重试');
    }
  };


  return (
    <Drawer
      open={visible}
      onClose={() => {
        setVisible(false);
      }}
      styles={{
        header: { display: 'none' },
        body: { padding: '0 16px' },
      }}
      width={1200}
    >
      {/* 表头 */}
      <div className='row' style={{ width: '100%', height: '60px', gap: '16px' }}>
        <div className='title' style={{ paddingLeft: '16px' }}>
          <UnorderedListOutlined style={{ marginRight: '8px' }} />
          文件列表
        </div>
        <div style={{ flex: 1 }} />
        <Button
          type="primary"
          icon={<DatabaseOutlined />}
          onClick={() => {
            setUploadModalVisible(true);
          }}
        >
          上传附件
        </Button>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => {
            refreshDataList();
          }}
        >
          刷新
        </Button>
      </div>
      <Table
        style={{ width: "100%" }}
        scroll={{ x: "100%", y: "calc(100vh - 76px)" }}
        bordered
        pagination={false}
        columns={tableColumns}
        dataSource={documentList}
        loading={loading}
      />

      {/* 上传文件弹窗 */}
      <Modal
        centered
        title="上传附件到数据集"
        open={uploadModalVisible}
        onOk={handleUpload}
        onCancel={() => {
          setUploadModalVisible(false);
          setFileList([]);
        }}
        confirmLoading={uploading}
        okText="确认上传"
        cancelText="取消"
      >
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持单个文件上传，文件大小不超过 50MB
          </p>
        </Upload.Dragger>
      </Modal>
    </Drawer>
  );
};

export default StorageFiles;