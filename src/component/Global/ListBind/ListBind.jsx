import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider, Popover } from 'antd';
import moment from 'moment';
import { FontSizeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

//接口
import { createBind, updateBind, getBindValueByCode } from '@/service/MainBindPage';

//组件

//方法
import { useDispatch, useSelector } from 'react-redux';
import { getValue, getId } from '@/utils/Tool';
import { updateParameterBindDataMap } from '@/reducer/parameterBindSlice.js';

//样式

//模板
const ListBind = (props) => {

  let {
    bindTitle,
    bindCode,
    bindType = 'list',
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
    setValue(getValue(data, bindCode) ? JSON.parse(getValue(data, bindCode)) : []);
    setId(getId(data, bindCode));
  }, [data, bindCode]);

  //func
  async function bindFunc() {
    let postData = {
      id,
      bindTitle,
      bindCode,
      bindType,
      bindValue: JSON.stringify(value),
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
        dispatch(updateParameterBindDataMap({ [bindCode]: data }));
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
          <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {
                value?.map((item, index) => {
                  let inputValue = item.value;
                  let inputCode = item.code;
                  return (
                    <div
                      key={inputCode}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <Input
                        placeholder="请输入"
                        value={inputValue}
                        onChange={(e) => {
                          setValue(value.map(item => item.code == inputCode ? { ...item, value: e.target.value } : item));
                        }}
                      />
                      <Button
                        type="primary"
                        danger
                        onClick={() => {
                          setValue(value.filter(item => item.code != inputCode));
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  )
                })
              }
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
                marginTop: '1rem'
              }}
            >
              <Button
                type="primary"
                style={{ width: '100%' }}
                onClick={() => {
                  setValue([...value, { value: '', code: uuidv4() }]);
                }}
              >
                新增
              </Button>
              <Button
                type="primary"
                style={{ width: '100%' }}
                onClick={bindFunc}
              >
                保存
              </Button>
            </div>
          </div>
        }
        trigger="click"
      >
        <div
          className='globalBindButton'
          style={{ borderColor: '#faad14', fontSize: '1.5rem', background: '#ffffb8', ...style }}
        >
          <UnorderedListOutlined
            style={{ color: '#faad14' }}
          />
        </div>
      </Popover>
    </div>
  );
};


export default ListBind;
