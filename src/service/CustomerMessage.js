import request from "@/utils/request";

export async function getAllMessage(query = {}) {
  return request(
    '/customerMessage/getAllMessage', {
    method: 'POST',
    data: query,
  });
}

export async function createMessage(query = {}){
  return request(
    '/customerMessage/createMessage', {
    method: 'POST',
    data: query,
  });
}

export async function updateMessage(query = {}) {
  return request(
    '/customerMessage/updateMessage', {
    method: 'POST',
    data: query,
  });
}

export async function deleteMessage(query = {}) {
  return request(
    '/customerMessage/deleteMessage', {
    method: 'POST',
    data: query,
  });
}