import { createSlice } from '@reduxjs/toolkit';

const parameterBindSlice = createSlice({
  name: 'parameterBindMap',
  initialState: {
    data: {}
  },
  reducers: {
    setParameterBindDataMap: (state, action) => {
      state.data = action.payload;
    },
    updateParameterBindDataMap: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    clearParameterBindDataMap: (state) => {
      state.data = {};
    }
  }
});

export const { setParameterBindDataMap, updateParameterBindDataMap, clearParameterBindDataMap } = parameterBindSlice.actions;
export default parameterBindSlice.reducer;