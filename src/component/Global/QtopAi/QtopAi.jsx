import React, { useState, useEffect } from 'react';
import { Modal, Drawer, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import dayjs from 'dayjs';
import { SendOutlined } from '@ant-design/icons';


//接口
import { chatToAi } from './QtopAiServer';

//组件
import PageLoading from '@/component/Global/PageLoading/PageLoading';
import ChatItem from './component/ChatItem/ChatItem';

//方法
import { resultTip } from '@/utils/lyTool';

//样式
import './QtopAi.css';


//模板
const QtopAi = (props) => {

  let {
    children,
  } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  //useState
  const [loading, setLoading] = useState(false);
  const [aiVisible, setAiVisible] = useState(false);
  const [userMessage, setUserMessage] = useState([]);
  const [chatMap, setChatMap] = useState({}); // 聊天消息Map
  const [chatGroupList, setChatGroupList] = useState([]); // 聊天列表
  const [threadId, setThreadId] = useState(null); // 当前记忆线程ID

  //useEffect
  //更新聊天Map
  useEffect(() => {
    let chatMap = {};
    Array.from(chatGroupList)?.forEach((groupItem) => {
      let { chatList } = groupItem;
      chatList.forEach((item) => {
        let { id, message, type } = item;
        chatMap[id] = item;
      });
    });
    setChatMap(chatMap);
  }, [chatGroupList]);

  //func
  //发送消息
  async function sendMessage() {
    setLoading(true);
    try {
      if (!userMessage) {
        resultTip(3, '请输入内容');
        setLoading(false);
        return;
      }
      let handleResult = await chatToAi({ userMessage, threadId });
      if (handleResult?.success) {
        let returnChatList = handleResult?.data?.dataList ?? [];
        let threadId = handleResult?.data?.threadId;
        let chatList = [];
        let receiveDateStamp = dayjs().valueOf();
        Array.from(returnChatList).forEach((item, index) => {
          let { id, message, type } = item;
          if (!chatMap[id]) {
            chatList.push({ id, message, type, index });
          }
        });
        setChatGroupList(
          pre => [...pre, {
            chatList,
            receiveDateStamp,
          }]
        );
        setThreadId(threadId);
      } else {
        resultTip(3, handleResult?.message || '请求失败');
      }
    } catch (error) {
      resultTip(3, error?.message || '请求失败');
    }
    setLoading(false);
  }

  return (
    <>
      <div
        onClick={() => {
          setAiVisible(pre => !pre);
        }}
      >
        {children || <Button type="primary">AI</Button>}
      </div>

      {/* AI区域 */}
      <Drawer
        title="AI"
        open={aiVisible}
        onClose={() => setAiVisible(false)}
        width={1200}
        styles={{
          header: { display: 'none' },
          body: { display: 'flex', flexDirection: 'column', padding: '0' },
        }}
      >
        <PageLoading loading={loading} />
        {/* 顶部 */}
        <div className='qtopAiHeader'>
          <div className='qtopAiHeaderTitle'>AI助手</div>
        </div>
        {/* 聊天区域 */}
        <div className='qtopAiChat'>
          {
            chatGroupList?.map((groupItem) => {
              let { chatList, receiveDateStamp } = groupItem;
              return (
                <>
                  {
                    Array.from(chatList).map((item) => {
                      let { id, message, type, index, receiveDateStamp } = item;
                      return (
                        <ChatItem
                          key={id}
                          message={message}
                          type={type}
                          index={index}
                          receiveDateStamp={receiveDateStamp}
                        />
                      );
                    })
                  }
                  <Divider variant="dotted" style={{ borderColor: '#d4d4d4' }}>
                    <span className='qtopAiChatDate'>{dayjs(receiveDateStamp).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </Divider>
                </>
              )
            })
          }
        </div>
        {/* 聊天栏 */}
        <div className='qtopAiChatBar'>
          <Input.TextArea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            style={{ width: '100%', height: '100%', resize: 'none', fontSize: '18px' }}
            placeholder="请输入内容"
            bordered={false}
          />
          <div className='qtopAiChatBarButtons'>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
            >
              发送
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};


export default QtopAi;