import { isDemo } from '../constants/config';
import {api} from '@/constants/config';
export default async (to, from, next) => {
  if (localStorage.getItem('user') != null && localStorage.getItem('user').length > 0) {
    const valid = await api.get('valid');
    if(valid.data.data == true) {
      next()
    }else{
      localStorage.clear();
      next('/login');
    }
  } else {
    localStorage.clear();
    next('/login')
  }
}
