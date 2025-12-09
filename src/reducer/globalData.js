import { createSlice } from '@reduxjs/toolkit';

const systemDataSlice = createSlice({
  name: 'systemDataMap',
  initialState: {
    webEnv: {},
    isMobile: false 
  },
  reducers: {
    setWebEnv: (state, action) => {
      state.webEnv = action.payload;
    },
    // 更新部分 web 环境数据
    updateWebEnv: (state, action) => {
      state.webEnv = { ...state.webEnv, ...action.payload };
    },
    // 清空 web 环境数据
    clearWebEnv: (state) => {
      state.webEnv = {};
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    }
  }
});

export const { 
  setWebEnv, 
  updateWebEnv, 
  clearWebEnv,
  setIsMobile
} = systemDataSlice.actions;
export default systemDataSlice.reducer;