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
  input: 'js-app/report/router_report.js',
  output: {
    file: 'static/js/apps/report.pack.js',
    format: 'es'
  },
  //plugins: [terser()]
};