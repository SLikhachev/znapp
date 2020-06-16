
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
  const opts = restOpts(set[item])
  // order should preserved
  return Promise.all(reqOptions(set, opts)).then(
    lists => {
      const opt = new Map();
      opts.forEach((op, idx) => {
        if (lists[idx])
          opt.set(op, lists[idx])
        else
          opt.set(op, [])
      });
      return { options: opt };
    },
    err => ({ error: errMsg(err) }));
};
