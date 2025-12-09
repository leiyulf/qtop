const { override, overrideDevServer } = require('customize-cra');
const path = require('path');

// 代理配置
const customizeDevServer = () => (config) => {
  //重定向
  const urlBody = `http://localhost:`;
  const redirectMap = [
  ];

  
  let proxyMap = {};
  redirectMap.forEach(item => {
    let { urlStart, port } = item;
    proxyMap[urlStart] = {
      target: `${urlBody}${port}`,
      changeOrigin: true,
    }
  });
  return {
    ...config,
    proxy: proxyMap
  };
};

// 路径重定向配置
const pathRedirection = (config) => {
  // 添加你的自定义Webpack配置
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, 'src'),
  };
  // 添加其他配置...
  return config;
};

module.exports = {
  webpack: override(pathRedirection),
  devServer: overrideDevServer(customizeDevServer()),
};
