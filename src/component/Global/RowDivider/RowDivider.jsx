import React, { useState, useEffect } from 'react';
import moment from 'moment';

//接口

//组件

//方法

//样式

//模板
const RowDivider = (props) => {
  let {
    width = '80%',
  } = props;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width:'100%',
      }}
    >
      <div
        style={{
          position: 'relative',
          width,
          height: '2px',
          margin: '1rem 0',
          background: '#b2f1e833',
          borderRadius: '2px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-3px',
            left: '-8px',
            width: '4px',
            height: '4px',
            background: 'rgba(255,255,255,0)',
            border: '2px solid #b2f1e833',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-3px',
            right: '-8px',
            width: '4px',
            height: '4px',
            background: 'rgba(255,255,255,0)',
            border: '2px solid #b2f1e833',
            borderRadius: '50%',
          }}
        />
      </div>
    </div>
  );
};


export default RowDivider;
