import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Button, Popover } from 'antd';
import { DownOutlined } from '@ant-design/icons';

//组件

//接口

//数据

//样式

//方法
const ListItem = (props) => {

  let {
    light = '',
    context = '',
    children,
    ...otherPorps
  } = props;

  //init

  //useState
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  //useEffect
  useEffect(() => {
  }, []);

  //code

  return children ? (
    <Popover
      trigger="hover"
      classNames={{ root: "HeadListItemPopover" }}
      placement="bottom"
      open={popoverVisible}
      onOpenChange={(visible) => {
        setPopoverVisible(visible);
      }}
      styles={{
        body: {
          background: '#0A0B0D'
        }
      }}
      content={
        <div
          onClick={(e) => {
            setPopoverVisible(false);
          }}
          style={{
            background: '#0A0B0D'
          }}
        >
          {
            children
          }
        </div>
      }
    >
      <div
        className={`ListItem ${(isHovered || (light == context)) ? 'gradientText' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {context}
      </div>
    </Popover>
  ) : (
    <div
      className={`ListItem ${((isHovered || (light == context))) ? 'gradientText' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...otherPorps}
    >
      {context}
    </div>
  );
};


export default ListItem;
