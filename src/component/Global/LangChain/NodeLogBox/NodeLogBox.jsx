import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import moment from 'moment';

import { getSocket } from '../../../../page/Management/QTopAgent/QTopAgentServer';

import ContentItem from './component/ContentItem/ContentItem';

import './NodeLogBox.css';


//模板
const NodeLogBox = (props) => {

  let { } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  let tagColor = ['magenta', 'green', 'red', 'blue', 'volcano', 'orange', 'gold', 'lime', 'cyan', 'geekblue', 'purple'];

  const [nodeColorMap, setNodeColorMap] = useState(new Map());
  const [dataList, setDataList] = useState([]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);
    if (socketInstance) {
      socketInstance.on('nodeLog', (data) => {
        setDataList(pre => [...pre, data]);
      });

      socketInstance.on('nodeConfirmation', (data) => {
        setDataList(pre => [...pre, data]);
      });

      return () => {
        socketInstance.off('nodeLog');
        socketInstance.off('nodeConfirmation');
      };
    }
  }, []);

  //func
  // 获取nodeName对应的颜色
  const getNodeColor = (nodeName) => {
    if (!nodeName) return tagColor[0];
    if (!nodeColorMap.has(nodeName)) {
      const colorIndex = nodeColorMap.size % tagColor.length;
      setNodeColorMap(new Map(nodeColorMap.set(nodeName, tagColor[colorIndex])));
      return tagColor[colorIndex];
    }

    return nodeColorMap.get(nodeName);
  };

  return (
    <div className="NodeLogBox">
      <div className='logBox'>
        {
          dataList?.map((item, index) => {
            let { nodeName, type, value, timeStamp } = item;
            return (
              <div className='logItem' key={index}>
                <div className='logItemTag'>
                  <Tag color={getNodeColor(nodeName)}>{nodeName}</Tag>
                </div>
                <div className='logItemContent'>
                  <ContentItem
                    type={type}
                    value={value}
                    socket={socket}
                  />
                  <div style={{ flex: 1 }} />
                  <div className='logItemContentTime'>{timeStamp}</div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};


export default NodeLogBox;