import request from "@/utils/request";
import { io } from 'socket.io-client';

// Socket.IO 配置
const SOCKET_SERVER_URL = 'http://localhost:4000';
// const SOCKET_SERVER_URL = 'http://47.100.246.115:4/000';
let socket = null;

// 创建Socket连接
export function createSocketConnection() {
  try {
    if (socket && socket.connected) {
      console.log('Socket已连接,无需重复连接');
      return socket;
    }
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
    return socket;
  }
  catch (error) {
    console.error('创建Socket连接时出错:', error);
    return null;
  }
}

// 获取Socket实例
export function getSocket() {
  if (!socket || !socket.connected) {
    return createSocketConnection();
  }
  return socket;
}

// 发送测试消息
export function sendTestMessage(message = '这是一条测试消息') {
  const socketInstance = getSocket();
  if (socketInstance && socketInstance.connected) {
    socketInstance.emit('message', {
      type: 'test',
      content: message,
      timestamp: new Date().toISOString()
    });
    console.log('发送测试消息:', message);
    return true;
  } else {
    console.error('Socket未连接');
    return false;
  }
}

// 断开Socket连接
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket已断开');
  }
}

export async function getDatasetList(query = {}) {
  return request(
    '/ragFlow/getDatasetList', {
    method: 'POST',
    data: query,
  });
}

export async function getDocumentList(query = {}) {
  return request(
    '/ragFlow/getDocumentList', {
    method: 'POST',
    data: query,
  });
}

export async function uploadDocument(data) {
  return request(
    '/ragFlow/uploadDocument', {
    method: 'POST',
    data: data,
  });
}

export async function parseDocuments(data) {
  return request(
    '/ragFlow/parseDocuments', {
    method: 'POST',
    data: data,
  });
}

export async function stopParseDocuments(data) {
  return request(
    '/ragFlow/stopParseDocuments', {
    method: 'POST',
    data: data,
  });
}
