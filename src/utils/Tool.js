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

export {
  getId,
  getValue,
  throttle
}