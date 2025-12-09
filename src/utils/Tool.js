// 判断是否是手机端
const isMobile = () => {
  const userAgent = navigator.userAgent;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
};

export {
  getId,
  getValue,
  throttle,
  isMobile
}