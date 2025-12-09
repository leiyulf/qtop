import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Card, List, Spin, Alert } from 'antd';
import moment from 'moment';
import request from '@/utils/request'; // 根据你的实际路径调整
import { UnorderedListOutlined } from '@ant-design/icons';
import { resultTip } from '@/utils/lyTool';
import PageLoading from '@/component/Global/PageLoading/PageLoading';

const LogManagement = (props) => {
  let { } = props;

  // 组件初始化
  const { TextArea } = Input;

  // useState
  const [logFiles, setLogFiles] = useState([]); // 日志文件列表
  const [selectedLog, setSelectedLog] = useState(null); // 选中的日志文件
  const [logContent, setLogContent] = useState(''); // 日志内容
  const [loading, setLoading] = useState(false); // 加载状态
  const [contentLoading, setContentLoading] = useState(false); // 内容加载状态

  // 获取日志文件列表
  const fetchLogFiles = async () => {
    setLoading(true);
    try {
      const response = await request('/logs/files');
      setLogFiles(response.data || []);
    } catch (error) {
      console.error('获取日志文件列表失败:', error);
      resultTip(0, '获取日志文件列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取日志内容
  const fetchLogContent = async (fileName) => {
    if (!fileName) return;
    setContentLoading(true);
    try {
      const response = await request(`/logs/content/${fileName}`);
      setLogContent(response.data || '');
    } catch (error) {
      console.error('获取日志内容失败:', error);
      resultTip(0, '获取日志内容失败');
    } finally {
      setContentLoading(false);
    }
  };

  // 处理日志文件选择
  const handleLogSelect = (file) => {
    setSelectedLog(file);
    fetchLogContent(file.name);
  };

  // 格式化文件大小
  const formatFileSize = (size) => {
    return size; // 后端返回的已经是格式化后的字符串
  };

  // 格式化日期
  const formatDate = (dateStr) => {
    return moment(dateStr).format('YYYY-MM-DD HH:mm:ss');
  };

  // useEffect
  useEffect(() => {
    fetchLogFiles();
  }, []);

  return (
    <div className='managementBox' >
      <PageLoading loading={(loading || contentLoading)} />
      <div className='managementHeader'>
        <div className='title'><UnorderedListOutlined style={{ marginRight: '0.5rem' }} />日志列表</div>
      </div>
      <div style={{ display: 'flex', gap: '16px', minHeight: '600px' }}>
        {/* 左侧日志文件列表 */}
        <Card
          title="日志文件"
          style={{ width: '300px', height: `calc(100vh - 164px)`, borderRadius: '8px' }}
          styles={{
            body: { padding: '8px', height: `calc(100vh - 228px)`, overflowY: 'auto' }
          }}
        >
          <List
            dataSource={logFiles}
            renderItem={(file) => (
              <List.Item
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderLeft: selectedLog?.name === file.name ? '3px solid #1890ff' : '3px solid transparent',
                  backgroundColor: selectedLog?.name === file.name ? '#e6f7ff' : 'transparent',
                  transition: 'all 0.3s'
                }}
                onClick={() => handleLogSelect(file)}
              >
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                        {file.name.replace('.txt', '')}
                      </span>
                      <Tag color="blue" style={{ fontSize: '12px' }}>
                        {formatFileSize(file.size)}
                      </Tag>
                    </div>
                  }
                  description={
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      文件名: {file.name}
                      {file.date && <div>更新时间: {formatDate(file.date)}</div>}
                    </div>
                  }
                />
              </List.Item>
            )}
            locale={{ emptyText: '暂无日志文件' }}
          />
        </Card>

        {/* 右侧日志内容 */}
        <Card
          title={selectedLog ? `日志内容 - ${selectedLog.name}` : '选择日志文件查看内容'}
          style={{ flex: 1, height: `calc(100vh - 164px)`, borderRadius: '8px' }}
          styles={{
            body: { padding: '8px 8px 0 8px', overflowY: 'auto', overflowX: 'hidden' }
          }}
        >
          {selectedLog ? (
            <>
              <div style={{ background: '#f8f9fa', padding: '0', borderRadius: '6px' }}>
                <TextArea
                  value={logContent}
                  readOnly
                  style={{
                    height: 'calc(100vh - 164px - 56px - 56px - 8px)',
                    background: '#1e1e1e',
                    color: '#d4d4d4',
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontSize: '13px',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '56px',
                padding: '0 16px'
              }}>
                <span style={{ color: '#666', fontSize: '12px' }}>
                  文件大小: {formatFileSize(selectedLog.size)} |
                  最后更新: {formatDate(selectedLog.date)}
                </span>
                <Button
                  type="primary"
                  onClick={() => fetchLogContent(selectedLog.name)}
                  loading={contentLoading}
                >
                  刷新内容
                </Button>
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 0',
              color: '#999',
              background: '#fafafa',
              borderRadius: '6px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
              <div>请从左侧选择一个日志文件查看内容</div>
            </div>
          )}
        </Card>
      </div>
    </div >
  );
};

export default LogManagement;