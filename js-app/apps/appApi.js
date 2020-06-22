
// src/sparv/spravApi.js
/**
  */

//import { up } from './utils';


const [stream, scan] = [m.stream, m.stream.scan];


export const app = {
  initial: {
    suite: { page: "Медстатстика" },
    //unit: null,
    //pk: null,
    //list: null,
    //error: null,
    //method,
    //word,
    //id,

  },

  Actions: (state, update) => {
    // stream of states
    //const stup = up(update);
    return {};
  },

  menu: {
    root: '/'
  }
}


export const update = stream(); // update states stream
const acc = (state, patch) => patch(state);
//const init = app => app.initial;
export const states = scan(acc, app.initial, update);

export const disp = stream(); // event dispatcher stream 
//const actions = app.Actions(states, update); //=> obj of func ref

//[actionName, args]
/**
disp.map(av => {
  let [event, ...args] = av;
  return actions[event] ? actions[event](args) : stream.SKIP
})
*/
