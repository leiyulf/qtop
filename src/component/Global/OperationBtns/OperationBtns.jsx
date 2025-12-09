import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Button, Popover } from 'antd';
import { DownOutlined } from '@ant-design/icons';

//组件

//接口

//数据

//样式
import './OperationBtns.css';

//方法
const OperationBtns = (props) => {

  let { children } = props;

  //init

  //useState
  const [popoverVisible, setPopoverVisible] = useState(false);

  //useEffect
  useEffect(() => {
  }, []);

  //code

  return (
    <Popover
      trigger="hover"
      className="OperationBtns"
      overlayClassName="OperationBtnsPopover"
      placement="bottom"
      open={popoverVisible}
      onOpenChange={(visible) => {
        setPopoverVisible(visible);
      }}
      content={
        <div
          className="OperationBtnsPopoverContent"
          onClick={(e) => {
            setPopoverVisible(false);
          }}
        >
          {
            children
          }
        </div>
      }
    >
      <Button type="link">
        <span style={{ margin: '0px' }}>展开</span>
        <DownOutlined />
      </Button>
    </Popover>
  );
};


export default OperationBtns;
