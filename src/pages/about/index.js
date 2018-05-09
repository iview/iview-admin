import Vue from 'vue';
import iView from 'iview';
import About from './about';
import 'iview/dist/styles/iview.css';

Vue.use(iView);

new Vue({
    el: '#app',
    render: h => h(About)
});
