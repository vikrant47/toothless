import {loadScriptQueue} from './loadScript';
import {ElLoading} from "element-plus";

// monaco-editor单例
let monacoEidtor;
declare const monaco;
declare const window;
/**
 * 动态加载monaco-editor cdn资源
 * @param {Function} cb 回调，必填
 */
export default function loadMonaco(cb) {
  if (monacoEidtor) {
    cb(monacoEidtor);
    return;
  }

  const vs = 'https://lib.baomitu.com/monaco-editor/0.19.3/min/vs';

  // 使用element ui实现加载提示
  const loading = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: '编辑器资源初始化中...',
    spinner: 'elu-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)',
  });

  !window.require && (window.require = {});
  !window.require.paths && (window.require.paths = {});
  window.require.paths.vs = vs;

  loadScriptQueue(
    [
      `${vs}/loader.js`,
      `${vs}/editor/editor.main.nls.js`,
      `${vs}/editor/editor.main.js`,
    ],
    () => {
      loading.close();
      // eslint-disable-next-line no-undef
      monacoEidtor = monaco;
      cb(monacoEidtor);
    }
  );
}
