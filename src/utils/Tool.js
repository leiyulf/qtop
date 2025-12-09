import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile } from '@/reducer/globalData';
import { store } from '@/reducer/store'; // 需要导入store

function getValue(data, key) {
  return data?.[key]?.bindValue || ''
}

function getId(data, key) {
  return data?.[key]?.id || ''
}

// 添加节流工具函数
const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

const checkAndSetDevice = () => {
  const dispatch = store.dispatch; // 直接从store获取dispatch
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  dispatch(setIsMobile(isMobile));
};

export {
  getId,
  getValue,
  throttle,
  checkAndSetDevice
}