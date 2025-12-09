import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Popover } from 'antd';
import moment from 'moment';
import { FontSizeOutlined } from '@ant-design/icons';

//接口
import { createBind, updateBind, getBindValueByCode } from '@/service/MainBindPage';

//组件

//方法
import { useDispatch, useSelector } from 'react-redux';
import { getValue, getId } from '@/utils/Tool';
import { updateGlobalDataBindDataMap } from '@/reducer/globalDataBindSlice.js';

//样式

//模板
const TextBind = (props) => {

  let {
    bindTitle,
    bindCode,
    bindType = 'text',
    data,
    style = {}
  } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();

  //useState
  const [id, setId] = useState(null);
  const [value, setValue] = useState(null);

  //useEffect
  //modal初始化
  useEffect(() => {
    setValue(getValue(data, bindCode));
    setId(getId(data, bindCode));
  }, [data, bindCode]);

  //func
  async function bindFunc() {
    let postData = {
      id,
      bindTitle,
      bindCode,
      bindType,
      bindValue: value
    }
    let handleResult = {};
    if (id) {
      handleResult = await updateBind(postData);
    } else {
      handleResult = await createBind(postData);
    }
    if (handleResult?.success == true) {
      message.success('执行成功');
      //小规模刷新
      let getResult = await getBindValueByCode({ bindCode });
      if (getResult?.success == true) {
        let data = getResult.data || {};
        dispatch(updateGlobalDataBindDataMap({ [bindCode]: data }));
      }
    } else {
      message.error('执行失败');
    }
  }

  return (
    <div className='bindComponent' onClick={(e) => { e.stopPropagation() }}>
      <Popover
        placement="bottom"
        title={bindTitle}
        content={
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Input.TextArea
              style={{ width: '20rem' }}
              rows={4}
              placeholder={bindTitle}
              value={value}
              onChange={(e) => {
                let value = e.target.value;
                setValue(value);
              }}
            />
            <Button
              style={{ marginTop: '1rem' }}
              type="primary"
              onClick={bindFunc}
            >
              保存
            </Button>
          </div>
        }
        trigger="click"
      >
        <div className='globalBindButton' style={{ fontSize: '1.5rem', ...style }}>
          <FontSizeOutlined
            style={{ color: '#1890ff' }}
          />
        </div>
      </Popover>
    </div>
  );
};


export default TextBind;
