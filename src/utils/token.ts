//本地存儲存token
export const SET_TOKEN = (token: string) => {
  localStorage.setItem("TOKEN", token);
};

//本地存儲獲取token
export const GET_TOKEN = () => {
  return localStorage.getItem("TOKEN");
};

//本地存儲刪除方法
export const REMOVE_TOKEN = () => {
  localStorage.removeItem("TOKEN");
};
