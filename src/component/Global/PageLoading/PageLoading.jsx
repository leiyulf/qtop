import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';

//接口

//组件

//方法

//样式

//模板
const PageLoading = (props) => {

  let { loading, context = '' } = props;

  //组件初始化

  //useState

  //useEffect

  //func
  return loading ? (
    <div style={{
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      left: "0",
      right: "0",
      top: "0",
      bottom: "0",
      background: "rgba(255,255,255,0.5)",
      zIndex: "10000"
    }}>
      <Spin spinning={loading} />
      {
        context && (
          <div style={{ marginTop: "16px", fontSize: "2rem", letterSpacing: "0.1rem", color: "#f5222d", fontWeight: "bold" }}>
            {context}
          </div>
        )
      }
    </div>
  ) : null;
};


export default PageLoading;
