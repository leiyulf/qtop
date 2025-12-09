import React, { useState } from 'react';
import { Button, Image, Modal } from 'antd';
import { UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

// 方法
import { resultTip } from '@/utils/lyTool';

const CoverUploadCell = ({
  rowData,
  updateArticle,
  onSub = () => { },
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload/single', {
        method: 'POST',
        body: formData
      });

      const uploadResult = await uploadResponse.json();

      if (uploadResult.success) {
        // 更新文章的封面路径
        const updateResult = await updateArticle({
          ...rowData,
          articleCover: uploadResult.data.path
        });

        if (!updateResult.success) {
          resultTip(0, "操作失败");
          console.error('更新失败:', updateResult.message);
        } else {
          resultTip(1, "操作成功");
          onSub();
        }
      } else {
        resultTip(0, "上传失败");
        console.error('上传失败:', uploadResult.message);
      }
    } catch (error) {
      resultTip(0, "上传失败");
      console.error('上传失败:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteCover = async () => {
    try {
      const result = await updateArticle({
        ...rowData,
        articleCover: null
      });

      if (!result.success) {
        resultTip(0, "操作失败");
      } else {
        resultTip(1, "操作成功");
        onSub();
      }
    } catch (error) {
      resultTip(0, "删除封面失败");
      console.error('删除封面失败:', error);
    }
  };

  const triggerFileInput = () => {
    document.getElementById(`cover-upload-${rowData.id}`).click();
  };

  return (
    <div>
      {rowData.articleCover ? (
        <>
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              top: '0',
              right: '0',
              zIndex: '1',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <Button
              size="small"
              onClick={triggerFileInput}
              loading={isUploading}
              style={{ marginRight: '5px' }}
              icon={<EditOutlined />}
              type="link"
            />
            <Button
              size="small"
              onClick={handleDeleteCover}
              danger
              icon={<DeleteOutlined />}
              type="link"
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Image
              src={rowData.articleCover}
              style={{
                height: 'auto',
                width: 'auto',
                maxHeight:'60px',
                maxWidth:'140px',
                borderRadius: '2px',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                objectFit: 'cover',
              }}
              preview={{
                visible: previewVisible,
                src: rowData.articleCover,
                onVisibleChange: (value) => setPreviewVisible(value),
              }}
              onClick={() => {
                setPreviewImage(rowData.articleCover);
                setPreviewVisible(true);
              }}
            />
          </div>
        </>
      ) : (
        <Button
          icon={<UploadOutlined />}
          onClick={triggerFileInput}
          loading={isUploading}
          type="link"
        >
          上传封面
        </Button>
      )}

      <input
        type="file"
        id={`cover-upload-${rowData.id}`}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default CoverUploadCell;