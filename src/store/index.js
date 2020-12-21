import Vue from "vue";
import Vuex from "vuex";
// import app from './modules/app'
// import permission from './modules/permission'
// import settings from './modules/settings'
// import user from './modules/user'

import getters from "./getters";

Vue.use(Vuex);

/*
动态加载vuex中所有的modules模块
不再需要通过import手动一个一个引入
*/
const context = require.context("./modules", false, /\.js$/);

// console.log("context", context); // 是一个函数
// context.keys() 函数当作对象使用：keys()
// console.log(context.keys()); // 获取modules目录下面的所有文件路径列表

const modules = context.keys().reduce((modules, modulePath) => {
  // './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  // const m = context(模块路径) 相当于 import * as m from 模块路径
  // context(模块路径) 引入xxx模块暴露的内容
  // context(modulePath).default 引入xxx模块得到默认暴露的内容
  // { app: app模块默认暴露的内容 }
  modules[moduleName] = context(modulePath).default;
  return modules;
}, {});

// 创建store对象
const store = new Vuex.Store({
  /*
  modules: {
    app,
    permission,
    settings,
    user
  }, */
  modules,
  getters
});

export default store;
