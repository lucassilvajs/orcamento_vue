export const defaultMenuType = 'menu-default' // 'menu-default', 'menu-sub-hidden', 'menu-hidden';
export const defaultStartPath = '/order/information'
export const searchPath = '/app/pages/miscellaneous/search'
export const buyUrl = 'https://1.envato.market/nEyZa'

export const subHiddenBreakpoint = 1440
export const menuHiddenBreakpoint = 768

export const defaultLocale = 'en'
export const defaultDirection = 'ltr'
export const localeOptions = [
  { id: 'en', name: 'English LTR', direction: 'ltr' },
  { id: 'es', name: 'Español', direction: 'ltr' },
  { id: 'enrtl', name: 'English RTL', direction: 'rtl' }
]

export const firebaseConfig = {
  apiKey: "AIzaSyBv16fh1gsBGZRAqVBUdIHSD8isR5VSxrw",
  authDomain: "idsafety-1ac31.firebaseapp.com",
  databaseURL: "https://idsafety-1ac31.firebaseio.com",
  projectId: "idsafety-1ac31",
  storageBucket: "idsafety-1ac31.appspot.com",
  messagingSenderId: "39691086084",
  appId: "1:39691086084:web:2ce228488bf7a2c9748851",
  measurementId: "G-TE13GVCH26"
};


export const apiUrl = 'https://api.coloredstrategies.com'

export const currentUser = {
  id: 1,
  title: 'Sarah Kortney',
  img: '/assets/img/profile-pic-l.jpg',
  date: 'Last seen today 15:24'
}

export const isDemo = false
export const themeRadiusStorageKey = 'theme_radius'
export const defaultColor = 'light.idsafety'
export const colors = [
  'light.purple',
  'dark.purple',
  'light.blue',
  'dark.blue',
  'light.green',
  'dark.green',
  'light.orange',
  'dark.orange',
  'light.red',
  'dark.red'
]

import axios from "axios";

let base = "";
if(window.location.href.indexOf('localhost') >= 0) {
  base = "http://localhost/producao/";
}else{
  base = "https://api.idsafety.com.br/";
}

export const baseURL = base;
const url = baseURL;

const axiosInstance = axios.create({
  baseURL: url + ""
});

axiosInstance.interceptors.request.use(
  function(config) {
    const token = window.localStorage.token;
    if (token) {
      config.headers['X-Auth-Token'] = token;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export const api = {

  file(endpoint, body) {
    axios.post( endpoint,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    ).then(function(){
      console.log('SUCCESS!!');
    })
    .catch(function(){
      console.log('FAILURE!!');
    });
  },
  get(endpoint, parameter = '') {
    return axiosInstance.get(endpoint, parameter);
  },
  post(endpoint, body) {
    return axiosInstance.post(endpoint, body);
  },
  put(endpoint, body) {
    return axiosInstance.put(endpoint, body);
  },
  delete(endpoint) {
    return axiosInstance.delete(endpoint);
  },
  login(body) {
    return axios.post(url + "/jwt-auth/v1/token", body);
  },
  validateToken() {
    return axiosInstance.post(url + "/jwt-auth/v1/token/validate");
  }
};

export function getCep(cep) {
  return axios.get(`https://viacep.com.br/ws/${cep}/json/`);
}

