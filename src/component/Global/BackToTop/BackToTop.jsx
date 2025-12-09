// src/component/Global/BackToTop/BackToTop.jsx
import React, { useState, useEffect } from 'react';
import { UpOutlined } from '@ant-design/icons';

const BackToTop = () => {
  const [showBackTop, setShowBackTop] = useState(false);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      
      if (scrollTop > viewportHeight) {
        setShowBackTop(true);
      } else {
        setShowBackTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 返回顶部函数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {showBackTop && (
        <div 
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            right: '5rem',
            bottom: '5rem',
            width: '3rem',
            height: '3rem',
            background: 'linear-gradient(135deg, #84e2d8, #b2f1e8, #84e2d8)',
            border: '2px solid #146262',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 9999,
            transition: 'opacity 0.3s ease'
          }}
        >
          <UpOutlined style={{ color: '#146262', fontSize: '1.5rem' }}/>
        </div>
      )}
    </>
  );
};

export default BackToTop;