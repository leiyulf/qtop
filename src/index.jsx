import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { store } from './reducer/store'
import { Provider } from 'react-redux'
import locale from 'antd/locale/zh_CN';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

//router配置文件
import { routerList } from "./config/routerInit";

import "./index.css";

const router = createBrowserRouter(routerList);
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider locale={locale} store={store}>
    <RouterProvider router={router} />
  </Provider>
);