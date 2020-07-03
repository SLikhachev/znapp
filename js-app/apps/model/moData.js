
import { checkArray, errMsg } from './moModel';
import { getRequest } from './moList';

const restOpts = def => {
  const rest = def.rest || {};
  if (checkArray(rest.options))
    return rest.options;
  return [];
}


const reqOptions = (set, opts) => opts.
  map(op => getRequest(set, op)).
  map(r => m.request(r));


export const getData = (set, item) => {
  const opts = restOpts(set[item]), optm = new Map();
  // order should preserved
  return Promise.all(reqOptions(set, opts)).then(
    lists => {
      opts.reduce((mp, op, ix) => {
        lists[ix] ? mp.set(op, lists[ix]) : mp.set(op, []);
        return mp;
      }, optm);
      return { options: optm };
    },
    err => ({ error: errMsg(err) }));
};
