import React, { useState, useEffect, useRef, memo } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Tooltip } from 'antd';
import moment from 'moment';

//接口

//组件

//样式

//模板
const TooltipDiv = memo((props) => {
  //region init
  let {
    value,
    line = 1,
    autoLine = true,
    fontSize = 14,
    lineHeight = 22,
    padding = '0',
    onClick = () => { },
  } = props;

  //region useRef
  const tipBoxRef = useRef(null);

  //region useState
  const [lineCount, setLineCount] = useState(line);

  //region useEffect
  //计算高度
  useEffect(() => {
    if (tipBoxRef.current && autoLine) {
      let tipHeight = tipBoxRef.current.parentElement.clientHeight;
      let tipLine = Math.floor(tipHeight / lineHeight) ?? 1;
      setLineCount(tipLine);
    }
  }, [autoLine]);

  //region code

  return (
    <Tooltip title={value ?? ""}>
      <div
        ref={tipBoxRef}
        style={{
          fontSize: `${fontSize}px`,
          minHeight: `${lineHeight}px`,
          lineHeight: `${lineHeight}px`,
          display: '-webkit-box',
          padding,
          WebkitLineClamp: lineCount ?? 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
        onClick={onClick}
      >
        {value ?? ""}
      </div>
    </Tooltip>
  );
}, (prevProps, nextProps) => prevProps.value === nextProps.value);


export default TooltipDiv;
