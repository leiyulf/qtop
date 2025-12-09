import request from "@/utils/request";

/**
 * 获取所有绑定值
 */
export async function getAllBindValue(query = {}) {
  return request(
    '/mainBindPage/getAllBindValue', {
    method: 'POST',
    data: query,
  });
}

export async function getBindValueByCode(query = {}){
  return request(
    '/mainBindPage/getBindValueByCode', {
    method: 'POST',
    data: query,
  });
}

/**
 * 创建绑定值
 */
export async function createBind(query = {}) {
  return request(
    '/mainBindPage/createBind', {
    method: 'POST',
    data: query,
  });
}

/**
 * 修改绑定值
 */
export async function updateBind(query = {}) {
  return request(
    '/mainBindPage/updateBind', {
    method: 'POST',
    data: query,
  });
}