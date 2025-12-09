import React, { useState, useEffect } from 'react';
import { Button, Input, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import './404.css';

const Page404 = (props) => {


  return (
    <div className="Page404">
      <div
        className='gradientText'
        style={{
          fontSize: '10rem',
          fontWeight: 'bold',
          letterSpacing: '2rem',
          margin: '0 auto',
          textAlign: 'center',
          color: 'white'
        }}
      >
        404
      </div>
      <div
        className='normalButton'
        onClick={() => {
          window.location.href = '/';
        }}
      >
        返回首页
      </div>
    </div>
  );
};

export default Page404;