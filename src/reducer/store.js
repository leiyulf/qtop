// reducer/store.js
import { configureStore } from '@reduxjs/toolkit'
import parameterBindReducer from './parameterBindSlice';
import globalDataReducer from './globalData';

export const store = configureStore({
  reducer: {
    parameterBind: parameterBindReducer,
    globalData: globalDataReducer
  },
})

// 可选：导出类型
export default store