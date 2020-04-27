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
  apiKey: "AIzaSyDe94G7L-3soXVSpVbsYlB5DfYH2L91aTU",
  authDomain: "piaf-vue-login.firebaseapp.com",
  databaseURL: "https://piaf-vue-login.firebaseio.com",
  projectId: "piaf-vue-login",
  storageBucket: "piaf-vue-login.appspot.com",
  messagingSenderId: "557576321564",
  appId: "1:557576321564:web:bc2ce73477aff5c2197dd9"
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
  base = "http://localhost/orcamento_api/";
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

