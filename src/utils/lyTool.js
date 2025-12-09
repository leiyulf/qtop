import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import request from '@/utils/request';

//更全面的提示
//level:1成功,2警告,3错误
//title:标题
//context:内容
const lyResultTip = (level, title, context, showTime) => {
  let icon = "";
  let durationTime = 4;
  if (level === 1) {
    icon = <CheckCircleOutlined style={{ color: "#52C41A" }} />
    durationTime = 1;
  }
  if (level === 2) {
    icon = <ExclamationCircleOutlined style={{ color: "#FAAD14" }} />
    durationTime = 3;
  }
  if (level === 3) {
    icon = <CloseCircleOutlined style={{ color: "#FF4D4F" }} />
    durationTime = 6;
  }
  notification.open({
    message: title,
    description: context,
    icon,
    duration: showTime ? showTime : durationTime
  });
}

const resultTip = (level, title, context, showTime) => {
  let icon = "";
  let durationTime = 4;
  if (level === 0 || level === 3) {
    icon = <CloseCircleOutlined style={{ color: "#FF4D4F" }} />
    durationTime = 6;
  }
  if (level === 1) {
    icon = <CheckCircleOutlined style={{ color: "#52C41A" }} />
    durationTime = 1;
  }
  if (level === 2) {
    icon = <ExclamationCircleOutlined style={{ color: "#FAAD14" }} />
    durationTime = 3;
  }
  notification.open({
    message: title,
    description: context,
    icon,
    duration: showTime ? showTime : durationTime
  });
}

//数组拼接字符串
//inputArray:拼接数组
//mixStr:拼接分隔字符
//实例: lyArrayToString(["a","b","c"],"$$") >>>> "a$$b$$c"
const lyArrayToString = (inputArray, mixStr = ",") => {
  let returnStr = "";
  if (inputArray !== undefined) {
    let array = [...inputArray];
    if (Array.from(array).length === 0) {
      return "";
    }
    if (Array.from(array).length === 1) {
      returnStr = Array.from(array)[0];
    }
    if (Array.from(array).length > 1) {
      Array.from(array).forEach((context, index) => {
        if (index !== Array.from(array).length - 1) {
          returnStr = `${returnStr}${context}${mixStr}`;
        } else {
          returnStr = `${returnStr}${context}`;
        }
      })
    }
  }
  return returnStr;
}

//创建字典(最多解析一层)(旧,不用了)
//postUrl:获取数据的url
//postUrlParams:url参数
//bindingFunc:绑定的方法(useState)
//mapKeyText:Map的key值
//mapValueText:Map的value值
//errorTip:错误信息的文本
//layerText:获取返回值的层级,一般都是data
const createJsonMap = async (value) => {
  //解析
  let {
    postUrl,
    postUrlParams,
    bindingFunc,
    mapKeyText,
    mapValueText,
    errorTip,
    layerText
  } = value;
  if (postUrl === undefined || bindingFunc === undefined || mapKeyText === undefined || mapValueText === undefined) {
    lyResultTip(3, "创建字典失败", "缺少参数");
  } else {
    let getResult = {};
    getResult = await postUrl(postUrlParams);
    if (getResult != undefined) {
      let resultMap = {};
      if (layerText !== undefined) {
        getResult = getResult[layerText]
      }
      Array.from(getResult).forEach((resultItem) => {
        let key = resultItem[mapKeyText];
        let value = resultItem[mapValueText];
        resultMap[key] = value;
      });
      bindingFunc(resultMap);
    } else {
      lyResultTip(3, "字典加载失败", `${errorTip === undefined ? "" : errorTip}加载失败`);
    }
  }
}
//创建字典(最多解析一层)(新)
//postUrl:获取数据的url
//postUrlParams:url参数
//bindingFunc:绑定的方法(useState)
//mapKeyText:Map的key值
//mapValueText:Map的value值
//errorTip:错误信息的文本
//layerText:获取返回值的层级,一般都是data
const createJsonMapNew = async (value) => {
  //解析
  let {
    postUrl, postUrlParams, bindingFunc,
    mapKeyText, mapValueText, errorTip, layerText
  } = value;
  if (!postUrl || !bindingFunc || !mapKeyText || !mapValueText) {
    lyResultTip(3, "创建字典失败", "缺少参数");
  } else {
    let getResult = {};
    getResult = await postUrl(postUrlParams);
    if (getResult != undefined) {
      let resultMap = new Map();
      if (layerText !== undefined) {
        Array.from(layerText).forEach(layer => {
          getResult = getResult[layer];
          if (getResult == undefined) {
            lyResultTip(3, "字典加载失败", `${errorTip === undefined ? "" : errorTip}加载失败`);
            return;
          }
        });
      }
      Array.from(getResult).forEach((resultItem) => {
        if (mapValueText == "all") {
          resultMap.set(resultItem[mapKeyText], resultItem);
        } else {
          key = resultItem[mapKeyText];
        }
        let value = "";
        if (typeof resultItem[mapValueText] == "string") {
          value = resultItem[mapValueText].trim();
        } else {
          value = resultItem[mapValueText];
        }
        resultMap[key] = value;
      });
      bindingFunc(resultMap);
    } else {
      lyResultTip(3, "字典加载失败", `${errorTip === undefined ? "" : errorTip}加载失败`);
    }
  }
}

//简单消息推送
async function sendMessage(category, title, content, shortContent, userId) {
  let sendResult = await sendSimpleMessage({
    category, title, content, shortContent, userId
  });
  if (sendResult["success"] === true) {
    lyResultTip(1, "推送成功", "消息推送成功");
    return true;
  } else {
    lyResultTip(3, "推送失败", "消息推送失败");
    return false;
  }
}

//是否是合法数字
function isNumeric(value) {
  return /^-?\d+(\.\d+)?$/.test(value);
}

//时间戳转YYYYMMDD
function timestampToYYYYMMDD(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

//json字段求和
function getJsonKeySum(array, keyName = "") {
  array = Array.from(array);
  let returnSum = 0;
  for (let index = 0; index < array.length; index++) {
    let arrayItem = array[index] ?? {};
    if (!arrayItem[keyName] || arrayItem[keyName] == NaN || arrayItem[keyName] == "NaN") {
      returnSum += parseFloat(0);
    } else {
      returnSum += parseFloat(arrayItem[keyName]);
    }
  }
  if (returnSum == NaN) {
    return 0;
  }
  return returnSum;
}

//获取宽高和字体宽高
function getBoxSize(type = "screen", name = "") {
  if (type == "screen") {
    let screenWidthInPx = window.innerWidth;
    let screenHeightInPx = window.innerHeight;
    let rootElement = document.documentElement;
    let rootFontSizeInPx = parseFloat(getComputedStyle(rootElement).fontSize);
    return {
      width: screenWidthInPx,
      height: screenHeightInPx,
      fontSize: rootFontSizeInPx
    }
  }
  if (type == "class") {
    let myElement = document.querySelector(name);
    let widthInPx = myElement.offsetWidth;
    let heightInPx = myElement.offsetHeight;
    return {
      width: widthInPx,
      height: heightInPx
    }
  }

  if (type == "id") {
    let myDiv = document.getElementById(name);
    let widthInPx = myDiv.offsetWidth;
    let heightInPx = myDiv.offsetHeight;
    return {
      width: widthInPx,
      height: heightInPx
    }
  }
}

//数字转字母 类型Excel首行
function numberToLetter(number) {
  if (number >= 1 && number <= 26) {
    // 将数字转换为对应的大写字母
    return String.fromCharCode(64 + number);
  } else if (number > 26) {
    // 当数字大于26时，使用多个字母表示
    let result = '';
    while (number > 0) {
      const remainder = (number - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      number = Math.floor((number - 1) / 26);
    }
    return result;
  } else {
    return "Invalid input: Number should be a positive integer.";
  }
}


//排序混合字符
function customCompare(a, b) {
  // 判断字符类型：英文、中文、数字
  const typeA = getType(a);
  const typeB = getType(b);

  if (typeA === typeB) {
    // 如果字符类型相同，使用localeCompare方法进行排序
    return a.localeCompare(b);
  } else {
    // 不同字符类型，英文字符优先
    if (typeA === "english") return -1;
    if (typeB === "english") return 1;

    // 中文字符排在数字之前
    if (typeA === "chinese" && typeB === "number") return -1;
    if (typeA === "number" && typeB === "chinese") return 1;

    // 默认情况下，中文字符排在前面
    return a.localeCompare(b);
  }
}

//字符串类型
function getType(str) {
  const char = str.charAt(0);

  if (/[a-zA-Z]/.test(char)) {
    return "english";
  } else if (/[\u4e00-\u9fa5]/.test(char)) {
    return "chinese";
  } else if (/[\d]/.test(char)) {
    return "number";
  }

  return "other";
}

//当前用户
function getCurrentUser(data = "account") {
  return JSON.parse(localStorage.getItem("currentUserinfo"))[data] ?? "";
}

//当前公司
function getCurrentCompany(data = "companyName") {
  if (localStorage.getItem("currentCompany")) {
    return JSON.parse(localStorage.getItem("currentCompany"))[data] ?? "";
  } else {
    return "";
  }
}

//小数变整数 3.0 变成 3 , 3.1不会变
function convertToIntegerIfNoDecimal(numberString) {
  const floatValue = parseFloat(numberString);
  const isInteger = Number.isInteger(floatValue);

  if (isInteger) {
    return Math.floor(floatValue).toString();
  } else {
    return numberString;
  }
}

//文件大小转换
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

//获取用户是否有权限
const getUserAuthority = async (code) => {
  let currentUser = await localStorage.getItem("currentUserinfo");
  let authoritys = JSON.parse(currentUser).authoritys;//  await localStorage.getItem("currentUserAuthoritys");
  let authority = authoritys.filter(auth => auth == code);
  if (!code || authority.length > 0) {
    return true;
  } else {
    return false;
  }
}

//获取公司名
async function getFactoryName() {
  let getDetailResult = await getFactoryDetail();
  if (getDetailResult["success"] != false) {
    return getDetailResult["data"]["fullName"] ? getDetailResult["data"]["fullName"] : "";
  } else {
    lyResultTip(3, "公司信息获取失败", "");
    return "";
  }
}

//找到2个对象里不同项(同长度)
function findDifferentItems(oldArr, newArr) {
  let length1 = oldArr.length;
  let length2 = newArr.length;
  if (length1 != length2) {
    return [];
  }
  let returnArr = [];
  for (let index = 0; index < length1; index++) {
    if (JSON.stringify(oldArr[index]) != JSON.stringify(newArr[index])) {
      returnArr.push(newArr[index]);
    }
  }
  return returnArr;
}

//清理base64
function cleanBase64(base64String) {
  // 移除所有非 Base64 字符，包括空格、换行符等
  let cleanedBase64 = base64String.replace(/[^A-Za-z0-9+/=]/g, '');

  // 处理 Base64 长度不是 4 的倍数的情况
  let paddingLength = 4 - (cleanedBase64.length % 4);
  if (paddingLength !== 4) {
    cleanedBase64 += '='.repeat(paddingLength);
  }
  return cleanedBase64;
}

/**
  * 获取第一个表格的可视化高度
  * @param {*} cutHeight 剪掉的高度(表格底部的内容高度 Number类型,默认为74) 
  * @param {*} id 当前页面中有多个table时需要制定table的id
  */
function getTableScroll(params) {
  let cutHeight = params?.cutHeight;
  if (typeof cutHeight == "undefined") {
    //  默认底部边距20
    cutHeight = "0px";
  }
  let tHeader = null
  if (params?.id) {
    const { id } = params;
    tHeader = document.getElementById(id) ? document.getElementById(id).getElementsByClassName("ant-table-thead")[0] : null
  } else {
    tHeader = document.getElementsByClassName("ant-table-thead")[0];
  }
  //表格内容距离顶部的距离
  let tHeaderBottom = 0;
  if (tHeader) {
    tHeaderBottom = tHeader.getBoundingClientRect().bottom;
  }

  //窗体高度-表格内容顶部的高度-表格内容底部的高度
  let height = `calc(100vh - ${tHeaderBottom}px - ${cutHeight} - 1rem)`;
  return height;
}

function getErrorCount(result) {
  return result?.success == false ? 1 : result?.filter(item => item?.success == false).length ?? 0;
}

//滚动条到底部
function scrollToBottom(ref) {
  if (ref && ref.current) {
    const div = ref.current;
    div.scrollTop = div.scrollHeight
  }
}

// 判断是否是合法的JSON
function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

//深拷贝
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== "object") {
    return obj; // 如果是基本类型，直接返回
  }

  // 检查循环引用
  if (map.has(obj)) {
    return map.get(obj);
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    for (const item of obj) {
      clonedArray.push(deepClone(item, map));
    }
    return clonedArray;
  }

  // 处理日期
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 处理正则表达式
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 处理普通对象
  const clonedObj = {};
  map.set(obj, clonedObj); // 记录克隆过的对象
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key], map);
    }
  }

  return clonedObj;
}

//获取用户供应商列表
async function getUserSupplierList(userId) {
  let getResult = await request(`/spc/supplierInteraction/supplierApplication/getUserDetailInfo?userId=${userId}`, {
    method: 'POST',
  });
  if(getResult?.success != false){
    let { suppliers = [] } = getResult;
    return suppliers;
  }else{
    return [];
  }
}

function calculateStringLengthPX(str, baseFontSize = 16) {
  if (typeof str !== 'string') {
    throw new Error('输入必须是字符串');
  }
  
  let totalRem = 0;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    // 检查字符是否为中文
    const isChinese = /[\u4e00-\u9fff]/.test(char);
    // 检查字符是否为英文或数字
    const isEnglishOrNumber = /[a-zA-Z0-9]/.test(char);
    
    if (isChinese || isEnglishOrNumber) {
      totalRem += 1;
    } else {
      // 符号和其他字符算0.5rem
      totalRem += 0.5;
    }
  }
  
  // 返回px值
  return totalRem * baseFontSize;
}

export {
  resultTip,
  lyResultTip,
  lyArrayToString,
  createJsonMap,
  sendMessage,
  isNumeric,
  timestampToYYYYMMDD,
  getJsonKeySum,
  getBoxSize,
  numberToLetter,
  customCompare,
  getCurrentUser,
  createJsonMapNew,
  convertToIntegerIfNoDecimal,
  formatFileSize,
  getUserAuthority,
  getFactoryName,
  findDifferentItems,
  cleanBase64,
  getTableScroll,
  getErrorCount,
  getCurrentCompany,
  scrollToBottom,
  isValidJSON,
  deepClone,
  getUserSupplierList,
  calculateStringLengthPX
}