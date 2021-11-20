import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./components/Vant/index";
import 'vant/lib/index.less';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
  created(){
    const BusComponent = Vue.extend({})
    Vue.prototype.$bus = new BusComponent()
  }
}).$mount("#app");
