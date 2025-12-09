import { createSlice } from '@reduxjs/toolkit';

const globalDataBindSlice = createSlice({
  name: 'globalDataBindMap',
  initialState: {
    data: {}
  },
  reducers: {
    setGlobalDataBindDataMap: (state, action) => {
      state.data = action.payload;
    },
    updateGlobalDataBindDataMap: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    clearGlobalDataBindDataMap: (state) => {
      state.data = {};
    }
  }
});

export const { setGlobalDataBindDataMap, updateGlobalDataBindDataMap, clearGlobalDataBindDataMap } = globalDataBindSlice.actions;
export default globalDataBindSlice.reducer;