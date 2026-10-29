import DropDown from "./components/Dropdown.vue";
import SearchSelect from "./components/SearchSelect.vue";
import DateField from "./components/DateField.vue";
import "vue-select/dist/vue-select.css";

/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(Vue) {
    Vue.component("drop-down", DropDown);
    Vue.component("k-search-select", SearchSelect);
    Vue.component("k-date-field", DateField);
  },
};

export default GlobalComponents;
