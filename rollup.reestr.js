// set NODE_PATH=C:\Users\aughing\AppData\Roaming\npm\node_modules\

// rollup.config.js
//import { rollup } from "rollup";
//import { terser } from "rollup-plugin-terser";
/*
rollup({
  entry: "main.js",
  plugins: [terser()]
});
*/
export default {
  input: 'js-app/reestr/router_reestr.js',
  output: {
    file: 'static/js/apps/reestr.pack.js',
    format: 'es'
  },
  //plugins: [terser()]
};