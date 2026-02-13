import React, { useState } from 'react';
import { Button, Select, Table, Input } from 'antd';
import EditCell from '@/component/Global/EditCell/EditCell.jsx';

const InteractionContent = (props) => {
  const {
    value,
    isTimeout,
    isInteracted,
    onInteraction
  } = props;

  const { type } = value;
  const isDisabled = isTimeout || isInteracted;

  // 二元交互
  if (type === 'binary') {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          type='primary'
          size='small'
          disabled={isDisabled}
          style={{ width: '100%' }}
          onClick={() => onInteraction({
            confirmed: true
          })}
        >
          确定
        </Button>
        <Button
          size='small'
          disabled={isDisabled}
          style={{ width: '100%' }}
          onClick={() => onInteraction({
            confirmed: false
          })}
        >
          取消
        </Button>
      </div>
    );
  }

  // 文本编辑
  if (type === 'text') {
    const { data } = value;
    const [textValue, setTextValue] = useState(data || '');

    return (
      <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>
        <Input.TextArea
          disabled={isDisabled}
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder='请输入内容'
          autoSize={{ minRows: 3, maxRows: 10 }}
          style={{ width: '600px' }}
        />
        <Button
          type='primary'
          size='small'
          disabled={isDisabled}
          onClick={() => onInteraction({ text: textValue })}
          style={{ width: '100%' }}
        >
          确定
        </Button>
      </div>
    );
  }

  //下拉框选择
  if (type === 'select') {
    let { data, params } = value;
    let { mode } = params;

    const [selectedValue, setSelectedValue] = useState(undefined);
    const dataMap = Object.fromEntries(data.map((item) => [item.value, item.label]));

    return (
      <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>
        <Select
          disabled={isDisabled}
          options={data}
          mode={mode}
          placeholder='请选择'
          style={{ width: '100%' }}
          value={selectedValue}
          onChange={(value) => {
            setSelectedValue(value);
          }}
        />
        <Button
          type='primary'
          size='small'
          disabled={isDisabled}
          onClick={() => onInteraction({
            values: selectedValue,
            labels: mode === 'multiple'
              ? selectedValue?.map(val => dataMap[val])
              : dataMap[selectedValue]
          })}
        >
          确定
        </Button>
      </div>
    );
  }

  // 表格编辑 
  if (type === 'table') {
    const { data, params } = value;
    const { header, addAble, deleteAble } = params;

    // 使用 state 管理可编辑的表格数据，确保每行有唯一标识
    const [editableData, setEditableData] = useState(() => {
      return data.map((item, index) => ({
        ...item,
        _uniqueKey: item.key || `row_${index}`
      }));
    });

    // 处理单元格编辑 - 使用索引而不是key来精确定位
    const handleCellChange = async (rowIndex, dataIndex, newValue) => {
      const newData = [...editableData];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [dataIndex]: newValue
      };
      setEditableData(newData);
    };

    // 处理删除行
    const handleDelete = (rowIndex) => {
      const newData = editableData.filter((_, index) => index !== rowIndex);
      setEditableData(newData);
    };

    // 处理新增行
    const handleAdd = () => {
      // 创建一个新的空行对象，根据 header 配置初始化字段
      const newRow = {};
      header.forEach(col => {
        if (col.dataIndex) {
          newRow[col.dataIndex] = '';
        }
      });
      newRow._uniqueKey = `row_${Date.now()}_${editableData.length}`;
      setEditableData([...editableData, newRow]);
    };

    // 处理列配置，添加可编辑和删除功能
    const processedColumns = header.map(col => {
      // 如果列有 editType: 'text'，则使用 EditCell 组件（交互结束后禁用编辑）
      if (col.editType === 'text') {
        return {
          ...col,
          render: (text, record, index) => {
            // 交互结束后只展示文本，不允许编辑
            if (isDisabled) {
              return <div>{record[col.dataIndex]}</div>;
            }
            return (
              <EditCell
                value={record[col.dataIndex]}
                type="text"
                onChange={async (newValue) => {
                  await handleCellChange(index, col.dataIndex, newValue);
                }}
              />
            );
          }
        };
      }
      return col;
    });

    // 如果 deleteAble 为 true，添加操作列（交互结束后隐藏）
    if (deleteAble && !isDisabled) {
      processedColumns.push({
        title: '操作',
        key: 'action',
        width: 80,
        fixed: 'right',
        align: 'center',
        render: (_, record, index) => (
          <Button
            type="link"
            danger
            size="small"
            onClick={() => handleDelete(index)}
          >
            删除
          </Button>
        )
      });
    }

    return (
      <div className='nodeTableEdit'>
        <Table
          style={{ width: "100%", marginBottom: "8px" }}
          scroll={{ x: "100%", y: "360px" }}
          bordered
          pagination={false}
          columns={processedColumns}
          dataSource={editableData}
          rowKey={(record, index) => record._uniqueKey || index}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {addAble && !isDisabled && (
            <Button
              size='small'
              onClick={handleAdd}
              style={{ width: '100%' }}
            >
              新增行
            </Button>
          )}
          <Button
            type='primary'
            size='small'
            disabled={isDisabled}
            onClick={() => {
              // 提交时移除内部使用的 _uniqueKey
              const submitData = editableData.map(({ _uniqueKey, ...rest }) => rest);
              onInteraction({ data: submitData });
            }}
            style={{ width: '100%' }}
          >
            确定
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default InteractionContent;
