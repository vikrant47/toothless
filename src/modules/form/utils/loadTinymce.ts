import loadScript from './loadScript';
import {ElLoading} from 'element-plus';

let tinymceObj;
declare const tinymce;
export default function loadTinymce(cb) {
  if (tinymceObj) {
    cb(tinymceObj);
    return;
  }

  const loading = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: 'Rich text resource loading...',
    spinner: 'elu-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)',
  });

  loadScript('https://lib.baomitu.com/tinymce/5.3.2/tinymce.min.js', () => {
    loading.close();
    // eslint-disable-next-line no-undef
    tinymceObj = tinymce;
    cb(tinymceObj);
  });
}
