const fetchApi = (method, url, body = {},  headers = {}) => {
  console.log('FETCH BODY: ', body);
  return fetch(url, {
    headers: { ...headers },
    method: method,
    body: JSON.stringify(body)
  })
};

const getFetchApi = (url) => {
  return fetch(url);
};

const setToken = (token) => `Bearer ${token}`;