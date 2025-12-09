// reducer/store.js
import { configureStore } from '@reduxjs/toolkit'
import globalDataBindReducer from './globalDataBindSlice'

export const store = configureStore({
  reducer: {
    globalDataBind: globalDataBindReducer,
  },
})

// 可选：导出类型
export default store