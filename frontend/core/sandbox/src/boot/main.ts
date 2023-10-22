import { boot } from 'quasar/wrappers';
import 'quasar/src/css/index.sass';
import { createPinia } from 'pinia';
import { JLCore, instance } from '../../../src';
import { version } from '../../package.json';

export default boot(async ({ app }) => {
  const comment = document.createComment(`App version: ${version}`);
  document.body.appendChild(comment);

  const pinia = createPinia();

  app.use(JLCore, { $pinia: pinia }).use(pinia);

  instance.defaults.baseURL = process.env.VITE_API_BASE_URL;
});
