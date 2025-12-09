import React, { useState, useEffect } from 'react';
import { Button, message, Popover, Upload } from 'antd';
import { PictureOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

// 接口
import { createBind, updateBind, getBindValueByCode } from '@/service/MainBindPage';

// 方法
import { useDispatch } from 'react-redux';
import { getValue, getId } from '@/utils/Tool';
import { updateParameterBindDataMap } from '@/reducer/parameterBindSlice.js';

const ImageBind = (props) => {
  let {
    bindTitle,
    bindCode,
    bindType = 'image',
    data,
    style = {},
  } = props;

  const dispatch = useDispatch();

  // useState
  const [id, setId] = useState(null);
  const [value, setValue] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  // useEffect - 初始化数据
  useEffect(() => {
    const currentValue = getValue(data, bindCode);
    setValue(currentValue);
    setId(getId(data, bindCode));

    // 根据value初始化fileList
    if (currentValue) {
      setFileList([{
        uid: '-1',
        name: currentValue.split('/').pop() || 'image',
        status: 'done',
        url: currentValue,
      }]);
    } else {
      setFileList([]);
    }
  }, [data, bindCode]);

  // 上传前校验
  const beforeUpload = (file) => {
    // 文件类型校验
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }

    // 文件大小校验 (10MB)
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('图片必须小于 10MB!');
      return false;
    }

    return true;
  };

  // 自定义上传方法
  const customUpload = async (options) => {
    const { file, onSuccess, onError } = options;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/single', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const fileUrl = result.data.path; // 获取文件路径
        onSuccess(result.data, file);

        // 更新文件列表显示
        const newFile = {
          uid: file.uid,
          name: result.data.filename,
          status: 'done',
          url: fileUrl,
          response: result.data,
        };

        setFileList([newFile]);
        setValue(fileUrl);

        message.success('图片上传成功');
      } else {
        onError(new Error(result.message || '上传失败'));
        message.error(result.message || '上传失败');
      }
    } catch (error) {
      console.error('上传错误:', error);
      onError(error);
      message.error('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 处理文件变化
  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    // 限制只能上传一个文件
    newFileList = newFileList.slice(-1);

    // 处理上传状态
    newFileList = newFileList.map(file => {
      if (file.response) {
        // 组件展示上传成功
        file.url = file.response.path;
      }
      return file;
    });

    setFileList(newFileList);
  };

  // 删除图片
  const handleRemove = () => {
    setFileList([]);
    setValue(null);
  };

  // 保存绑定
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
      message.success('保存成功');
      // 小规模刷新
      let getResult = await getBindValueByCode({ bindCode });
      if (getResult?.success == true) {
        let data = getResult.data || {};
        dispatch(updateParameterBindDataMap({ [bindCode]: data }));
      }
    } else {
      message.error('保存失败');
    }
  }

  // 预览图片
  const previewImage = (file) => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  return (
    <div className='bindComponent' onClick={(e) => { e.stopPropagation() }}>
      <Popover
        placement="bottom"
        title={bindTitle}
        content={
          <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }} onClick={(e) => { e.stopPropagation() }}>
            {/* 上传组件 */}
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              customRequest={customUpload}
              onChange={handleChange}
              onRemove={handleRemove}
              maxCount={1}
              accept="image/*"
              style={{ width: '100%' }}
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
                previewIcon: <EyeOutlined onClick={e => {
                  e.stopPropagation();
                  if (fileList[0]) previewImage(fileList[0]);
                }} />,
                removeIcon: <DeleteOutlined />,
              }}
            >
              {fileList.length >= 1 ? null : (
                <div style={{ width: '100%' }}>
                  {uploading ? (
                    <div>上传中...</div>
                  ) : (
                    <div>
                      <div style={{ marginTop: 8 }}>
                        <PictureOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                      </div>
                      <div style={{ marginTop: 8 }}>点击上传</div>
                    </div>
                  )}
                </div>
              )}
            </Upload>

            {/* 操作按钮 */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }} onClick={(e) => { e.stopPropagation() }}>
              <Button
                type="primary"
                onClick={bindFunc}
                disabled={!value}
                style={{ flex: 1 }}
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
          style={{ borderColor: '#52c41a', background: '#f4ffb8', ...style }}
        >
          <PictureOutlined style={{ fontSize: '1.5rem', color: '#52c41a' }} />
        </div>
      </Popover>
    </div>
  );
};

export default ImageBind;