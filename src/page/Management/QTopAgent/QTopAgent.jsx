import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import moment from 'moment';
import { ReadOutlined, UnorderedListOutlined, SendOutlined } from '@ant-design/icons';

import { createSocketConnection, sendTestMessage, disconnectSocket } from './QTopAgentServer';

import DataStorage from './component/DataStorage/DataStorage';
import StorageFiles from './component/StorageFiles/StorageFiles';
import NodeStateBox from '../../../component/Global/LangChain/NodeStateBox/NodeStateBox';
import NodeLogBox from '../../../component/Global/LangChain/NodeLogBox/NodeLogBox';
const QTopAgent = (props) => {

  let { } = props;

  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  const [storageFilesVisible, setStorageFilesVisible] = useState(false);
  const [storageFilesData, setStorageFilesData] = useState(null);
  const [cleanDataList, setCleanDataList] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const socket = createSocketConnection();
    if (socket) {
      socket.on('connect', () => {
        setSocketConnected(true);
        message.success('Socket连接成功!');
      });
      socket.on('disconnect', () => {
        setSocketConnected(false);
        message.warning('Socket已断开连接');
      });
      socket.on('connect_error', (error) => {
        setSocketConnected(false);
        message.error('Socket连接失败: ' + error.message);
      });
    }
    return () => {
      disconnectSocket();
    };
  }, []);

  const handleSendTestMessage = () => {
    if (!socketConnected) {
      message.error('Socket未连接,请稍后再试');
      return;
    }

    const result = sendTestMessage('测试');
    if (result) {
      message.success('测试消息已发送!');
    } else {
      message.error('发送失败,请检查连接状态');
    }
  };

  return (
    <div className='managementBox' >
      <div className='managementHeader'>
        <div className='title'><UnorderedListOutlined style={{ marginRight: '0.5rem' }} />智能体</div>
        <div style={{ flex: 1 }} />
        {/* <Button
          type="primary"
          onClick={() => {

          }}
          icon={<ReadOutlined />}
        >
          知识库
        </Button> */}
        <div style={{ marginLeft: '8px' }}>
          <Tag color={socketConnected ? 'success' : 'error'}>
            {socketConnected ? 'Socket已连接' : 'Socket未连接'}
          </Tag>
        </div>
      </div>
      <div className='managementBody' style={{ display: 'flex', flexDirection: 'row' }}>
        {/* <div style={{ position: 'relative', width: '300px', height: '100%' }}>
          <DataStorage
            onClick={(item) => {
              setStorageFilesData(item);
              setStorageFilesVisible(true);
            }}
          />
        </div> */}
        <NodeLogBox />
        <NodeStateBox
          style={{ position: 'absolute', right: '16px', top: '16px' }}
          node={(item) => {
            let { nodeName, status, timeStamp } = item;
            return (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', paddingLeft: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#333', letterSpacing: '1px' }}>{nodeName}</span>
                  <div style={{ flex: 1 }} />
                  {
                    status == 'start' ? <Tag style={{ margin: '0' }} color="blue">运行中</Tag> :
                      status == 'complete' ? <Tag style={{ margin: '0' }} color="green">已完成</Tag> :
                        null
                  }
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ flex: 1 }} />
                  <div style={{ fontSize: '10px', color: '#666' }}>{timeStamp}</div>
                </div>
              </div>
            )
          }}
        />
      </div>

      {storageFilesVisible && (
          <StorageFiles
            visible={storageFilesVisible}
            setVisible={setStorageFilesVisible}
            data={storageFilesData}
          />
        )
      }
    </div>
  );
};


export default QTopAgent;