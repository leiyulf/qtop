import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import moment from 'moment';

//接口

//组件
import CardItem from '@/component/Customer/CardItem/CardItem';
import ColorButton from '@/component/Customer/ColorButton/ColorButton';
import TextBind from '@/component/Global/TextBind/TextBind';
import ListBind from '@/component/Global/ListBind/ListBind';
import RowDivider from '@/component/Global/RowDivider/RowDivider';

//方法
import { useSelector } from 'react-redux';
import { getValue } from '@/utils/Tool';

//样式
import "./Page2.css";

//模板
const Page2 = (props) => {

  let {
    rule = 'customer'
  } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const parameterBindData = useSelector(state => state.parameterBind.data);
  const isMobile = useSelector(state => state.globalData.isMobile);

  //useState
  const [scrollContainerRef, setScrollContainerRef] = useState(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  //useEffect
  // 替换现有的自动滚动 useEffect 钩子
  useEffect(() => {
    if (!scrollContainerRef || !isAutoScrolling) return;

    const scrollSpeed = 1;
    let direction = 1; // 1 表示向右滚动，-1 表示向左滚动

    const interval = setInterval(() => {
      if (scrollContainerRef) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef;
        const maxScrollLeft = scrollWidth - clientWidth;

        // 判断是否需要改变方向
        if (scrollLeft >= (maxScrollLeft - 10)) {
          direction = -1; // 到达最右侧，开始向左滚动
        } else if (scrollLeft <= 0) {
          direction = 1; // 到达最左侧，开始向右滚动
        }

        // 执行滚动
        scrollContainerRef.scrollLeft += scrollSpeed * direction;
      }
    }, 30);

    return () => clearInterval(interval);
  }, [scrollContainerRef, isAutoScrolling]);

  useEffect(() => {
    // 添加被动事件监听器以更好地控制滚轮行为
    const container = scrollContainerRef;
    if (container) {
      const wheelHandler = (e) => {
        // 阻止默认行为和事件冒泡
        e.preventDefault();
        e.stopPropagation();
        // 将垂直滚动转换为水平滚动
        container.scrollLeft += e.deltaY;
      };

      // 使用 passive: false 确保 preventDefault 生效
      container.addEventListener('wheel', wheelHandler, { passive: false });

      // 清理事件监听器
      return () => {
        container.removeEventListener('wheel', wheelHandler);
      };
    }
  }, [scrollContainerRef]);

  // 在现有的滚轮事件处理 useEffect 中添加鼠标事件监听
  useEffect(() => {
    // 添加被动事件监听器以更好地控制滚轮行为
    const container = scrollContainerRef;
    if (container) {
      const wheelHandler = (e) => {
        // 阻止默认行为和事件冒泡
        e.preventDefault();
        e.stopPropagation();
        // 将垂直滚动转换为水平滚动
        container.scrollLeft += e.deltaY;
      };

      // 鼠标悬停事件处理
      const mouseEnterHandler = () => {
        setIsAutoScrolling(false);
      };

      const mouseLeaveHandler = () => {
        setIsAutoScrolling(true);
      };

      // 使用 passive: false 确保 preventDefault 生效
      container.addEventListener('wheel', wheelHandler, { passive: false });
      container.addEventListener('mouseenter', mouseEnterHandler);
      container.addEventListener('mouseleave', mouseLeaveHandler);

      // 清理事件监听器
      return () => {
        container.removeEventListener('wheel', wheelHandler);
        container.removeEventListener('mouseenter', mouseEnterHandler);
        container.removeEventListener('mouseleave', mouseLeaveHandler);
      };
    }
  }, [scrollContainerRef]);

  //code
  const handleWheel = useCallback((e) => {
    if (scrollContainerRef) {
      e.preventDefault();
      e.stopPropagation();
      scrollContainerRef.scrollLeft += e.deltaY;

      // 用户手动滚动时暂停自动滚动
      setIsAutoScrolling(false);
      setTimeout(() => setIsAutoScrolling(true), 3000);
    }
  }, [scrollContainerRef]);

  return (
    <div id='Page2' className="Page2" style={
      isMobile ? {
        padding: '6rem 2rem'
      } : {
        padding: '12rem 0'
      }
    }>
      {/* 文本 */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          marginBottom: "3rem"
        }}
      >
        <div
          style={
            isMobile ? {
              position: "relative",
              fontSize: "2rem",
              fontWeight: "bold",
              letterSpacing: "0.2rem",
              color: "white",
              textAlign: "center"
            } : {
              position: "relative",
              fontSize: "3rem",
              fontWeight: "bold",
              letterSpacing: "0.2rem",
              color: "white"
            }
          }
        >
          <TextBind
            data={parameterBindData}
            bindTitle="页面2主标题"
            bindCode="page2_main_title__text"
          />
          {getValue(parameterBindData, 'page2_main_title__text') || '数字化时代的质量管理挑战'}
        </div>
        <div
          style={
            isMobile ? {
              position: "relative",
              fontSize: "1.2rem",
              letterSpacing: "0.1rem",
              color: "#A6AAB5",
              textAlign: "center"
            } : {
              position: "relative",
              fontSize: "1.2rem",
              letterSpacing: "0.1rem",
              color: "#A6AAB5"
            }
          }
        >
          <TextBind
            data={parameterBindData}
            bindTitle="页面2副标题"
            bindCode="page2_sub_title__text"
          />
          {getValue(parameterBindData, 'page2_sub_title__text') || '顺应趋势，与时俱进，质量管理信息化势在必行'}
        </div>
      </div>
      {/* 按钮组 */}
      {/* <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          margin: "3rem 0",
          gap: "1rem"
        }}
      >
        <ListBind
          bindTitle="页面2按钮列表"
          bindCode="page2_button_list__list"
          data={parameterBindData}
        />
        {
          JSON.parse(getValue(parameterBindData, 'page2_button_list__list') || '[]')?.map((item, index) => {
            let { code, value } = item;
            return (
              <ColorButton
                title={value}
              >
                <TextBind
                  data={parameterBindData}
                  bindTitle="按钮文本"
                  bindCode={`button_content_${code}__text`}
                />
                {getValue(parameterBindData, `button_content_${code}__text`) || '按钮1'}
              </ColorButton>
            )
          })
        }
      </div> */}
      <RowDivider />
      {/* 卡片 */}
      <div
        style={
          isMobile ? {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            margin: '2rem 0 0 0',
            padding: '0',
          } : {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            margin: '0 4rem 0rem 4rem',
            padding: '4rem 0',
          }
        }
      >
        {/* 左侧文本(PC端显示) */}
        {
          (!isMobile) ? (
            <div
              style={{
                position: 'relative',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24rem',
                height: '100%',
                padding: '0 2rem',
                color: 'white',
                fontSize: '3rem',
                fontWeight: 'bold',
                overflowWrap: 'break-word', // 长单词换行
                boxSizing: 'border-box',
              }}
            >
              <TextBind
                data={parameterBindData}
                bindTitle="页面2列表左侧文本"
                bindCode="page2_list_left__text"
                style={{
                  left: '-1rem'
                }}
              />
              {getValue(parameterBindData, 'page2_list_left__text') || '左侧文本'}
            </div>
          ) : null
        }
        <ListBind
          bindTitle="页面2卡片列表"
          bindCode="page2_card_list__list"
          data={parameterBindData}
          style={{
            top: '-1rem',
            left: '50%',
          }}
        />
        <div
          style={
            isMobile ? {
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              gap: '2rem',
              width: '100%',
              height: '100%',
              padding: '0',
              overflowX: 'auto'
            } : {
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              gap: '2rem',
              width: 'calc(100% - 24rem)',
              height: '100%',
              padding: '0 2rem',
              overflowX: 'auto'
            }
          }
          ref={setScrollContainerRef}
          onWheel={handleWheel}
        >
          {
            JSON.parse(getValue(parameterBindData, 'page2_card_list__list') || '[]')?.map((item, index) => {
              let { code, value } = item;
              return (
                <CardItem
                  key={code}
                  index={index}
                  code={code}
                  title={value}
                />
              )
            })
          }
        </div>
      </div>

    </div>
  );
};


export default Page2;