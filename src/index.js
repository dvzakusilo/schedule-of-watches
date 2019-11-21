'use strict';
import Vue from 'vue'
import './assets/styles.scss';
import Calendar from "./lib/index"

Vue.component('Calendar', Calendar);

// export default class
export default new Vue({el: '#schedule-of-watches'});
