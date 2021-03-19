import Vue from 'vue'
import App from './App'

// BootstrapVue add
import BootstrapVue from 'bootstrap-vue'
// Router & Store add
import router from './router'
import store from './store'
// Multi Language Add
import en from './locales/en.json'
import es from './locales/es.json'
import VueI18n from 'vue-i18n'
import { defaultLocale, localeOptions, firebaseConfig } from './constants/config'
// Notification Component Add
import Notifications from './components/Common/Notification'
// Breadcrumb Component Add
import Breadcrumb from './components/Common/Breadcrumb'
// RefreshButton Component Add
import RefreshButton from './components/Common/RefreshButton'
// Colxx Component Add
import Colxx from './components/Common/Colxx'
// Perfect Scrollbar Add
import vuePerfectScrollbar from 'vue-perfect-scrollbar'
import contentmenu from 'v-contextmenu'
import VueLineClamp from 'vue-line-clamp'
import VCalendar from 'v-calendar'
// import 'v-calendar/lib/v-calendar.min.css'
import VueScrollTo from 'vue-scrollto'
import VueSweetalert2 from 'vue-sweetalert2';

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

// import Vuelidate from 'vuelidate'
// Vue.use(Vuelidate);


Vue.use(BootstrapVue);
Vue.use(VueI18n);
Vue.use(VueSweetalert2);

const messages = { en: en, es: es };
const locale = (localStorage.getItem('currentLanguage') && localeOptions.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) ? localStorage.getItem('currentLanguage') : defaultLocale;
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'en',
  messages
});

Vue.use(Notifications);
Vue.component('piaf-breadcrumb', Breadcrumb);
Vue.component('b-refresh-button', RefreshButton);
Vue.component('b-colxx', Colxx);
Vue.component('vue-perfect-scrollbar', vuePerfectScrollbar);
Vue.use(require('vue-shortkey'));
Vue.use(contentmenu);
Vue.use(VueLineClamp, {
  importCss: true
})
Vue.use(VCalendar, {
  firstDayOfWeek: 2, // ...other defaults,
  formats: {
    title: 'MMM YY',
    weekdays: 'WW',
    navMonths: 'MMMM',
    input: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'],
    dayPopover: 'L'
  },
  datePickerShowDayPopover: false,
  popoverExpanded: true,
  popoverDirection: 'bottom'
});
Vue.use(VueScrollTo);
Vue.config.productionTip = false

Vue.filter("numeroPreco", valor => {
  valor = Number(valor);
  if (!isNaN(valor)) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  } else {
    return "";
  }
});


Vue.filter("timeSince", date => {
  var seconds = Math.floor((new Date() - (new Date(date)) ) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " Anos";
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " Meses";
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " Dias";
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " Horas";
  }

  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " Minutos";
  }
  return Math.floor(seconds) + " Segundos";
});

Vue.filter("capitalize", valor => {
  return valor.substring(0,1).toUpperCase().concat(valor.toLowerCase().substring(1));
});

Vue.filter("date", valor => {
  let d = new Date(valor)
  return d.toLocaleDateString('pt-BR');
});

Vue.filter("datetime", valor => {
  let d = new Date(valor)
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
});

export default new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
