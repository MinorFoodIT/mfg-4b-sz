import axios from "axios";

//var axiosInstance = axios.create({
//    baseURL: 'http://'+process.env.REACT_APP_API_HOST+':4000' || 'http://localhost:4000', // 'http://172.20.0.2:4000',
//    /* other custom settings */
//});

// Add a response interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { data } = error.response;

      if (data.message) {
        return Promise.reject(new Error(data.message));
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
