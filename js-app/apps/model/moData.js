
import { checkArray, errMsg } from './moModel';
import { getRequest } from './moList';

const restOpts = (def, list) => {
  const rest = def.rest || {};
  if (checkArray(rest[list]))
    return rest[list];
  return [];
};


const reqOptions = (set, opts) => opts.
  map(op => getRequest(set, op)).
  map(r => m.request(r));


export const getData = (set, item, list = 'options') => {
  const opts = restOpts(set[item], list), optm = new Map();
  // order should preserved
  //console.log('get data ', list);
  return Promise.all(reqOptions(set, opts)).then(
    lists => {
      //console.log('get data resp ', list);
      opts.reduce((mp, op, ix) => {
        lists[ix] ? mp.set(op, lists[ix]) : mp.set(op, []);
        return mp;
      }, optm);
      return { [list]: optm };
    },
    err => ({ error: errMsg(err) }));
};
