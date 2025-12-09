import React, { useState, useEffect } from 'react';
import { Tag, Pagination, Image } from 'antd';
import moment from 'moment';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

// 组件
import FooterPage from '../FooterPage/FooterPage';
import HeaderBar from '@/component/Customer/HeaderBar/HeaderBar';
import BackToTop from '@/component/Global/BackToTop/BackToTop';

//接口
import { getAllArticle } from '@/service/ArticleManagement';

//方法
import { resultTip } from '@/utils/lyTool';
import { checkAndSetDevice } from '@/utils/Tool';

// 样式
import "./NewsPage.css";

// 新闻页面组件
const NewsPage = (props) => {
  let { } = props;
  const isMobile = useSelector(state => state.globalData.isMobile);

  //useState
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [tableDataList, setTableDataList] = useState([]); // 所有文章数据
  const [paginatedData, setPaginatedData] = useState([]); // 当前页文章数据
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [totalItems, setTotalItems] = useState(0); // 总条目数
  const pageSize = 10; // 每页显示条数

  //useEffect
  useEffect(() => {
    checkAndSetDevice();
    refreshDataList();
  }, []);

  //code
  //刷新
  async function refreshDataList(tableFilter = {}) {
    setTableLoading(true);
    try {
      let getResult = await getAllArticle({ ...tableFilter });
      if (getResult?.success != false) {
        let dataList = getResult?.data ?? [];
        dataList = dataList.sort((a, b) => moment(b.updateTime).valueOf() - moment(a.updateTime).valueOf());
        dataList = dataList.map((item, index) => ({ ...item, key: item.id, index: index + 1 }));
        setTableDataList(dataList);
        setTotalItems(dataList.length);
        // 初始化第一页数据
        updatePaginatedData(dataList, 1);
      } else {
        resultTip(0, "获取数据失败", getResult?.message ?? "");
      }
    } catch (error) {
      resultTip(0, "获取数据失败", error?.message ?? "");
    }
    setTableLoading(false);
  }

  // 更新分页数据
  const updatePaginatedData = (data, page) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedData(data.slice(startIndex, endIndex));
  };

  // 处理页码变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updatePaginatedData(tableDataList, page);
  };

  function extractTextFromHtml(html, maxLength = 200) {
    if (!html) return '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 获取所有段落元素
    const paragraphs = doc.querySelectorAll('p');
    const paragraphTexts = [];

    // 提取每个段落的文本内容
    paragraphs.forEach(p => {
      const text = p.textContent?.trim();
      if (text) {
        paragraphTexts.push(text);
      }
    });

    // 用逗号连接段落，最后加句号
    let result = paragraphTexts.join('，');

    // 如果没有段落，则提取所有文本
    if (paragraphTexts.length === 0) {
      result = doc.body.textContent?.replace(/\s+/g, ' ').trim() || '';
    }

    // 添加句号结尾
    if (result && !result.endsWith('。')) {
      result += '。';
    }

    // 截取指定长度
    if (result.length > maxLength) {
      result = result.substring(0, maxLength) + '...';
    }

    return result;
  }

  return (
    <>
      <div className={isMobile ? 'MobileNewsPage' : 'NewsPage'}>
        <HeaderBar light={"新闻资讯"} />
        <div className={isMobile ? 'MobileNewsListBox' : 'NewsListBox'}>
          <div className={isMobile ? 'MobileNewsListContainer' : 'NewsListContainer'}>
            <div className={isMobile ? 'MobileNewsPageTitle' : 'NewsPageTitle'}>
              <UnorderedListOutlined style={{ color: '#84e2d8', marginRight: '1rem' }} />
              新闻资讯
            </div>
            <div className={isMobile ? 'MobileNewsList' : 'NewsList'}>
              {paginatedData?.map((news) => (
                <div
                  key={news.id}
                  className={isMobile ? 'MobileNewsItem' : 'NewsItem'}
                  onClick={() => {
                    window.open(`/article/${news.id}`);
                  }}
                >
                  <div className={isMobile ? 'MobileNewsItemWithCover' : 'NewsItemWithCover'}>
                    {news.articleCover ? (
                      <div className={isMobile ? 'MobileNewsItemCoverBox' : 'NewsItemCoverBox'}>
                        <Image
                          src={news.articleCover}
                          alt="封面"
                          className={isMobile ? 'MobileNewsItemCover' : 'NewsItemCover'}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          preview={{
                            visible: false,
                          }}
                        />
                      </div>
                    ) : null
                    }
                    <div className={isMobile ? 'MobileNewsItemContent' : 'NewsItemContent'}>
                      <div className={isMobile ? 'MobileNewsItemHeader' : 'NewsItemHeader'}>
                        <div style={{ flex: '1' }} />
                        <span className={isMobile ? 'MobileNewsItemDate' : 'NewsItemDate'}>{moment(news?.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                      </div>
                      <div className={isMobile ? 'MobileNewsItemTitle' : 'NewsItemTitle'}>{news?.mainTitle ?? '无标题'}</div>
                      <div className={isMobile ? 'MobileNewsItemSummary' : 'NewsItemSummary'}>
                        {extractTextFromHtml(news?.articleContent) ?? '无内容'}
                      </div>
                      <div className={isMobile ? 'MobileNewsItemFooter' : 'NewsItemFooter'}>
                        <span className={isMobile ? 'MobileNewsItemAuthor' : 'NewsItemAuthor'}>作者: {news?.author}</span>
                        <div className={isMobile ? 'MobileNewsItemTags' : 'NewsItemTags'}>
                          <Tag className={isMobile ? 'MobileNewsItemTag' : 'NewsItemTag'} color="default">{(news?.articleGroup) ?? '无标签'}</Tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* 添加分页组件 */}
            <div className={isMobile ? 'MobileNewsPagination' : 'NewsPagination'}>
              <Pagination
                style={{
                  background: 'transparent',
                }}
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>
        <BackToTop />
      </div >
      <div style={{ zIndex: 999 }}>
        <FooterPage />
      </div>
    </>
  );
};

export default NewsPage;