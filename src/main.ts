import {createApp} from 'vue'
import App from './App.vue'

const app = createApp(App)
import router from './router'
import '@/styles/index.scss' // global css

/* main.css */

/* import the required styles */
import "@braks/vue-flow/dist/style.css";

/* import the default theme (optional) */
// import "@braks/vue-flow/dist/theme-default.css";
import CKEditor from '@ckeditor/ckeditor5-vue';
//import vuex
import store from './store'
import draggable from 'vuedraggable'

app.use(store)

//import element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

app.use(ElementPlus, {size: 'small', locale: zhCn})

//global mixin
// import elementMixin from '@/mixins/elementMixin'
// app.mixin(elementMixin)
// import commonMixin from '@/mixins/commonMixin'
// app.mixin(commonMixin)
// import routerMixin from '@/mixins/routerMixin'
// app.mixin(routerMixin)
// //import axios req
// import axiosReq from '@/utils/axiosReq'
// app.config.globalProperties.$axiosReq = axiosReq

//svg-icon
//import svg-icon doc in  https://github.com/anncwb/vite-plugin-svg-icons/blob/main/README.zh_CN.md
import 'virtual:svg-icons-register'
import svgIcon from '@/icons/SvgIcon.vue'

app.component('SvgIcon', svgIcon)

//global mount moment-mini
// import $momentMini from 'moment-mini'
// app.config.globalProperties.$momentMini = $momentMini
//import global directive
import directive from '@/directive'

directive(app)
//import router  intercept
import './permission'

//element svg icon
import ElSvgIcon from "@/components/ElSvgIcon.vue"

app.component("ElSvgIcon", ElSvgIcon)
app.component("Draggable", draggable)
app.component("MonacoEditor", MonacoEditor)


//error log  collection
import errorLog from '@/hooks/useErrorLog'
import {EngineScript} from "@/modules/engine/core/engine.script";
import {loadWidget} from "@/modules/form/components/widgets/base-widget/widget-types";
import MonacoEditor from 'vue-monaco';
// load all dependencies
setTimeout(async () => {
  await EngineScript.loadDefaultContext();
  await loadWidget();
});
errorLog()

app.use(router).use(CKEditor).mount('#app')

