import React, { useState, useEffect } from 'react';
import { Button, Tag, Divider, Spin, Empty, Card } from 'antd';
import dayjs from 'dayjs';
import {
  DatabaseOutlined,
  ClusterOutlined,
  FileTextOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

// 接口
import { getDatasetList } from '../../QTopAgentServer.js';

// 样式
import './DataStorage.css';

const DataStorage = (props) => {
  const {
    className = '',
    style,
    onClick = () => { }
  } = props || {};

  const [loading, setLoading] = useState(false);
  const [dataStorageList, setDataStorageList] = useState([]);

  useEffect(() => {
    getDataStorageList();
  }, []);

  async function getDataStorageList() {
    setLoading(true);
    try {
      const getResult = await getDatasetList({});
      if (getResult?.success === true) {
        const dataList = getResult?.data?.dataList || [];
        setDataStorageList(dataList);
      } else {
        setDataStorageList([]);
      }
    } finally {
      setLoading(false);
    }
  }


  return (
    <div
      className={`dataStorage ${className}`.trim()}
      style={style}
    >
      <div className="dataStorageHeader">
        <div className="dataStorageHeaderLeft">
          <div className="dataStorageTitleIcon">
            <DatabaseOutlined />
          </div>
          <div className="dataStorageTitleInfo">
            <div className="dataStorageTitle">知识库</div>
          </div>
        </div>
        <Button
          size="small"
          type="primary"
          icon={<ReloadOutlined />}
          onClick={getDataStorageList}
          loading={loading}
          className="dataStorageRefreshBtn"
        >
          刷新
        </Button>
      </div>

      <Divider className="dataStorageDivider" />

      {loading ? (
        <div className="dataStorageLoading">
          <Spin tip="数据加载中..." />
        </div>
      ) : dataStorageList.length === 0 ? (
        <div className="dataStorageEmpty">
          <Empty description="暂未配置任何数据集" />
        </div>
      ) : (
        <div className="dataStorageList">
          {dataStorageList.map((item) => {
            const {
              id,
              chunkCount,
              name,
              createTime,
              description,
              documentCount,
              status,
            } = item;

            return (
              <Card
                key={id || name}
                size="small"
                className="dataStorageCard"
                title={<span className="dataStorageCardTitle">{name}</span>}
                hoverable
                onClick={() => {
                  onClick && onClick(item);
                }}
              >
                <div className="dataStorageCardDesc">
                  {description || '暂无描述信息'}
                </div>

                <div className="dataStorageCardStats">
                  <div className="dataStorageCardStat">
                    <ClusterOutlined className="dataStorageCardStatIcon" />
                    <span className="dataStorageCardStatLabel">分片</span>
                    <span className="dataStorageCardStatValue">
                      {chunkCount ?? '--'}
                    </span>
                  </div>
                  <div className="dataStorageCardStat">
                    <FileTextOutlined className="dataStorageCardStatIcon" />
                    <span className="dataStorageCardStatLabel">文档</span>
                    <span className="dataStorageCardStatValue">
                      {documentCount ?? '--'}
                    </span>
                  </div>
                </div>

                <div className="dataStorageCardTime">
                  <span className="dataStorageCardTimeLabel">创建时间</span>
                  <span className="dataStorageCardTimeValue">
                    {createTime
                      ? dayjs(createTime).format('YYYY-MM-DD HH:mm:ss')
                      : '--'}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DataStorage;