// rollup.config.js

//import { terser } from "rollup-plugin-terser";

export default {
  input: 'js-app/clinic/router.js',
  output: {
    file: 'static/js/apps/clinic.pack.js',
    format: 'es'
  }, 
  //plugins: [terser()]
};