const fetchApi = (method, url, body = {},  headers = {}) => {
  return fetch(url, {
    headers: { ...headers },
    method: method,
    body: JSON.stringify(body)
  })
};

const setToken = (token) => `Bearer ${token}`;