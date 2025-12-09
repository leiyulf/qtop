import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Tabs, DatePicker, InputNumber, Table, Popconfirm, Select, Tag, Divider } from 'antd';
import dayjs from 'dayjs';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';


//接口
import { getArticleById } from '@/service/ArticleManagement';

//组件
import PageLoading from '@/component/Global/PageLoading/PageLoading';
import HeaderBar from '@/component/Customer/HeaderBar/HeaderBar';
import FooterPage from '../FooterPage/FooterPage';

//方法
import { resultTip } from '@/utils/lyTool';
import { checkAndSetDevice, throttle } from '@/utils/Tool';

//样式
import './ArticlePage.css';

//模板
const ArticlePage = (props) => {

  let { } = props;

  //组件初始化
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const { code } = useParams();
  const isMobile = useSelector(state => state.globalData.isMobile);

  //useState
  const [isValidUuid, setIsValidUuid] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [articleData, setArticleData] = useState({});
  const [articleContent, setArticleContent] = useState('');
  const [catalogueItems, setCatalogueItems] = useState([]);
  const [activeCatalogueId, setActiveCatalogueId] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  //useEffect
  //modal初始化
  useEffect(() => {
    if (code) {
      // setIsValidUuid(isValidUUID4(code));
      checkAndSetDevice();
      loadArticle(code);
    }

    // 检查系统偏好或本地存储设置
    // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // const storedTheme = localStorage.getItem('theme');
    // setIsDarkMode(storedTheme ? storedTheme === 'dark' : prefersDark);
  }, [code]);

  // 应用主题变化
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('darkMode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('darkMode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  //载入文章
  // useEffect(() => {
  //   if (isValidUuid) {
  //     loadArticle(code);
  //   }
  // }, [isValidUuid]);

  // 修改滚动监听 effect
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!catalogueItems.length) return;
      const headers = catalogueItems.map(item => document.getElementById(item.id));
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;

      // 找到当前视窗中最接近顶部且可见的标题
      let activeId = '';
      for (let i = headers.length - 1; i >= 0; i--) {
        const header = headers[i];
        if (header) {
          const offsetTop = header.offsetTop;
          if (offsetTop <= scrollTop + windowHeight / 3) {
            activeId = header.id;
            break;
          }
        }
      }

      setActiveCatalogueId(activeId);
    }, 100); // 100ms 节流间隔

    window.addEventListener('scroll', handleScroll);
    // 初始化调用一次
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [catalogueItems]);

  //code
  //uuid判断
  const isValidUUID4 = (uuid) => {
    const uuid4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuid4Regex.test(uuid);
  };

  //载入文章
  async function loadArticle(articleCode = '') {
    if (!articleCode) return;
    setPageLoading(true);
    let getResult = await getArticleById({ id: articleCode });
    if (getResult?.success != false) {
      let dataInfo = getResult?.data ?? {};
      // 给文章的所有标签加上uuid
      if (dataInfo?.articleContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(dataInfo.articleContent, 'text/html');

        // 按文档顺序处理 h1-h6 标签
        const headers = [];
        const allHeaders = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

        allHeaders.forEach(element => {
          const id = uuidv4();
          element.id = id;
          headers.push({
            id: id,
            level: parseInt(element.tagName.charAt(1)),
            text: element.textContent
          });
        });

        dataInfo.articleContent = doc.body.innerHTML;
        setCatalogueItems(headers);
      }
      setArticleContent(dataInfo?.articleContent);
      setArticleData(dataInfo);
      // 当文章不存在时，跳转到404页面
      console.log(dataInfo);
      if (!dataInfo?.id) {
        window.location.href = '/404';
      }
    } else {
      window.location.href = '/404';
      // resultTip(0, getResult?.message ?? '获取文章失败！');
    }
    setPageLoading(false);
  }

  // 切换主题函数
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };


  return (
    <>
      <HeaderBar />
      <div className={`${isMobile ? 'MobileArticlePage' : 'ArticlePage'} darkMode`}>
        <PageLoading loading={pageLoading} />

        {/* 背景图 */}
        {/* <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundImage: `url('/image/articleBackground.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: isDarkMode ? "brightness(1)" : "brightness(0.15)",
            transform: "scale(1.03)",
            zIndex: -1,
          }}
        /> */}

        {/* 文章 */}
        <div className={isMobile ? 'MobileArticlePageContent' : 'ArticlePageContent'}>
          <div className={isMobile ? 'MobileArticlePageTitle' : 'ArticlePageTitle'} id={'ArticleTitle'}>
            {articleData.mainTitle}
          </div>
          <div className={isMobile ? 'MobileArticlePageTime' : 'ArticlePageTime'}>
            于<span style={{ margin: '0 0.2rem' }}>{dayjs(articleData.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>发布
          </div>
          <Divider style={{ margin: '12px 0' }} />
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: articleContent }}
          />
        </div>
        {/* 右侧目录(PC端显示) */}
        {
          (!isMobile) ? (
            <div className={isMobile ? 'MobileArticlePageCatalogue' : 'ArticlePageCatalogue'}>
              <div className={isMobile ? 'MobileCatalogueTitle' : 'CatalogueTitle'}>
                <UnorderedListOutlined style={{ marginRight: '1rem' }} />
                目录
              </div>

              <div className={isMobile ? 'MobileCatalogueList' : 'CatalogueList'}>
                {catalogueItems.map((item) => (
                  <div
                    key={item.id}
                    className={`CatalogueItem CatalogueLevel${item.level} ${activeCatalogueId === item.id ? 'CatalogueItemActive' : ''}`}
                    onClick={() => {
                      const element = document.getElementById(item.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    style={{ paddingLeft: `${(item.level) * 16}px` }}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          ) : null
        }
      </div>
      <div style={{ zIndex: 999 }}>
        <FooterPage />
      </div>
    </>
  );
};

export default ArticlePage;