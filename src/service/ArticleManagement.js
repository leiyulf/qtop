import request from "@/utils/request";

export async function getAllArticle(query = {}) {
  return request(
    '/articleManagement/getAllArticle', {
    method: 'POST',
    data: query,
  });
}

export async function getArticleById(query = {}){
  return request(
    '/articleManagement/getArticleById', {
    method: 'POST',
    data: query,
  });
}

export async function createArticle(query = {}){
  return request(
    '/articleManagement/createArticle', {
    method: 'POST',
    data: query,
  });
}

export async function updateArticle(query = {}) {
  return request(
    '/articleManagement/updateArticle', {
    method: 'POST',
    data: query,
  });
}

export async function deleteArticle(query = {}) {
  return request(
    '/articleManagement/deleteArticle', {
    method: 'POST',
    data: query,
  });
}

export async function batchCreateArticle(query = {}) {
  return request(
    '/ai/lang/article/start', {
    method: 'POST',
    data: query,
  });
}

export async function stopCreateArticle(query = {}) {
  return request(
    '/ai/lang/article/stop', {
    method: 'POST',
    data: query,
  });
}
