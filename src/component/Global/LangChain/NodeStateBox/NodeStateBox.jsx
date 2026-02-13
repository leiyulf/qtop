import React, { useRef, useState, useEffect } from 'react';
import { BarChartOutlined, ShrinkOutlined, ArrowsAltOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { getSocket } from '../../../../page/Management/QTopAgent/QTopAgentServer';

import './NodeStateBox.css';

const NodeStateBox = (props) => {

  let {
    style = {},
    node = (item) => { return <div>{JSON.stringify(item)}</div> }
  } = props;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dataList, setDataList] = useState([]);
  const prevListRef = useRef([]);
  const containerRef = useRef(null);
  const totalCount = dataList.length;
  
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [dataList, isCollapsed]);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      const handleNodeState = (data) => {
        setDataList(pre => [...pre, data]);
      };
      
      socket.on('nodeState', handleNodeState);
      
      return () => {
        socket.off('nodeState', handleNodeState);
      };
    }
  }, []);
  
  const isNewNode = (index) => {
    const prevData = prevListRef.current;
    const hasNewData = dataList.length > prevData.length || 
                       (dataList.length > 0 && prevData.length > 0 && 
                        dataList[dataList.length - 1] !== prevData[prevData.length - 1]);
    prevListRef.current = dataList;
    return hasNewData && index === dataList.length - 1;
  };

  return (
    <div className={`NodeStateBox ${isCollapsed ? 'collapsed' : ''}`} style={style}>
      {isCollapsed ? (
        <div className="collapsedView" onClick={() => setIsCollapsed(false)}>
          <div className="collapsedIcon">
            <BarChartOutlined style={{ fontSize: '24px', color: '#0284c7' }} />
          </div>
          <div className="collapsedCount">{totalCount}</div>
          <div className="expandBtn">
            <ArrowsAltOutlined style={{ fontSize: '14px', color: '#0284c7' }} />
          </div>
        </div>
      ) : (
        <>
          <div className="statusHeader">
            <div className="totalCount">
              <span className="countLabel">总数:</span>
              <span className="countValue">{totalCount}</span>
            </div>
            <div className="collapseBtn" onClick={() => setIsCollapsed(true)}>
              <ShrinkOutlined style={{ fontSize: '14px', color: '#0284c7' }} />
            </div>
          </div>
          <div className="NodeStateBoxContainer" ref={containerRef}>
            {dataList.length === 0 ? (
              <div className="emptyState">
                <div className="emptyIcon">
                  <BarChartOutlined style={{ fontSize: '36px', color: '#7dd3fc' }} />
                </div>
                <div className="emptyText">等待数据...</div>
              </div>
            ) : (
              dataList.map((item, index) => (
                <div
                  key={index}
                  className={`NodeStateBoxNode ${isNewNode(index) ? 'nodeSlideUp' : ''}`}
                >
                  <div className="nodeContent">
                    {node(item)}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};


export default NodeStateBox;
