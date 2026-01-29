import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
// @ts-ignore
import ReactContainer from './components/ReactContainer.vue';
import './custom.css';

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ReactContainer', ReactContainer);
  },
};

export default theme;
