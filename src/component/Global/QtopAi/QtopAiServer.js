import request from "@/utils/request";

export async function chatToAi(query = {}) {
  return request(
    '/ai/chat', {
    method: 'POST',
    data: query,
  });
}
