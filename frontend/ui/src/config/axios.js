// import axios from 'axios'

// const token = localStorage.getItem('token')

// const axiosInstance = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//     headers: {
//         // "Authorization": `Bearer ${localStorage.getItem('token')}`,
//         "authorizations": `Bearer ${token}` 
//     }
// })

// export default axiosInstance




// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:4500/api/v1"
// });

// console.log(import.meta.env.VITE_API_URL)

// // Add request interceptor to dynamically add token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;








import axios from 'axios';

// // Don't use baseURL when you have a full URL
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4500/api/v1';

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // // Manually prepend the full URL if it's not already there
    // if (!config.url.startsWith('http')) {
    //   config.url = `${API_URL}${config.url}`;
    // }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;









// Design a dashboard in react with a modest and professional look.

// Data availabe:

// user profile comprising of name, email, age, income, emi, dependants;

// personal investment profile: volatility_tolerance, horizon, growth_preference;

// ML suggested investment profile: risk score, risk band, portfolio allocation;

// a list of file uploads (csv file uploads utilizde by a classification model in the backend to classify the risk profile) of the user;

// Graph:

// the data of twelve months classified 