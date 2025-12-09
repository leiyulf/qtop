import loadable from '@loadable/component';

const CustomerHome = loadable(() => import("@/page/Customer/Home.jsx"));
const ArticlePage = loadable(() => import("@/page/Customer/ArticlePage/ArticlePage.jsx"));
const NewsPage = loadable(() => import("@/page/Customer/NewsPage/NewsPage.jsx"));
const AdminHome = loadable(() => import("@/page/Management/Home.jsx"));
const Page404 = loadable(() => import("@/page/404/404.jsx"));

export const routerList = [
  { path: "/", element: <CustomerHome rule="customer" /> },
  // { path: "/admin", element: <CustomerHome rule="admin" /> },
  { path: "/admin", element: <AdminHome /> },
  { path: "/article/:code", element: <ArticlePage /> },
  { path: "/news", element: <NewsPage /> },
  { path: "/404", element: <Page404 /> },
  { path: "*", element: <Page404 /> },
]