// set NODE_PATH=C:\Users\aughing\AppData\Roaming\npm\node_modules\

// rollup.config.js
//import { terser } from "rollup-plugin-terser";

export default {
  input: 'js-app/sprav/router.js',
  output: {
    file: 'static/js/apps/sprav.pack.js',
    format: 'es'
  },
//  plugins: [terser()]
};