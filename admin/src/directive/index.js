import Vue from 'vue'
import store from '@/store'

const has = Vue.directive('has', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding, vnode) {
    // 获取按钮类型
    let value = binding.value || binding.arg;
    // 获取路由name
    let routeName = vnode.context.$route.name;
    console.log(value)
    console.log(store.getters.buttons[routeName])
    if (!(store.getters.buttons.hasOwnProperty(routeName) && store.getters.buttons[routeName].includes(value))) {
      el.parentNode.removeChild(el);
    }
  }
});
// 权限检查方法
Vue.prototype.$_has = function (value) {
  return store.getters.buttons.hasOwnProperty(value) && store.getters.buttons[value].includes(value)
};
export { has }