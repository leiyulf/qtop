import React, { useState, useEffect, useRef } from 'react';
import { Input, InputNumber } from 'antd';

//组件
import TooltipDiv from '@/component/Global/TooltipDiv/TooltipDiv.jsx';
import { PageLoading } from '@ant-design/pro-layout';


const EditCell = (props) => {
  //init
  let {
    value,
    type = 'text',
    onChange = async () => { }
  } = props;

  //useRef
  const inputRef = useRef(null);

  //useState
  const [editing, setEditing] = useState(false);
  const [innerValue, setInnerValue] = useState(value || '');
  const [loading, setLoading] = useState(false);


  //useEffect
  // 外部 value 变化时同步内部值
  useEffect(() => {
    setInnerValue(value || '');
  }, [value]);

  // 进入编辑状态自动 focus + 全选
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    console.log('loading', loading);
  }, [loading]);

  //code
  const handleStartEdit = () => {
    setEditing(true);
  };

  const handleBlur = async () => {
    setEditing(false);
    if (innerValue !== (value || '') && typeof onChange === 'function') {
      setLoading(true);
      await onChange(innerValue);
      setLoading(false);
    }
  };

  // 直接让 Input 失焦，触发 onBlur 统一处理保存逻辑
  const handlePressEnter = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  if (loading) {
    return <div style={{ fontSize: '14px', color: '#bfbfbf' }}>保存中...</div>;
  }
  return (
    <>
      {
        (!editing) ? (
          <TooltipDiv
            row={1}
            value={(innerValue)}
            onClick={handleStartEdit}
          />
        ) : (
          <>
            {
              type == 'text' ? (
                <Input.TextArea
                  ref={inputRef}
                  value={innerValue}
                  onChange={(e) => setInnerValue(e.target.value)}
                  onBlur={handleBlur}
                  onPressEnter={handlePressEnter}
                  bordered={false}
                />
              ) : type == 'number' ? (
                <InputNumber
                  ref={inputRef}
                  value={innerValue}
                  onChange={(e) => setInnerValue(e)}
                  onBlur={handleBlur}
                  onPressEnter={handlePressEnter}
                  bordered={false}
                />
              ) : null
            }
          </>
        )
      }
    </>
  );
};

export default EditCell;