
'use strict';

import { checkArray, errMsg } from './moModel';
import { getRequest } from './moList';


const reqStrList = (def, list) => {
  const rest = def.rest || {};
  return checkArray(rest[list]) ? 
    rest[list] : [];
};


const reqObjList = (set, opts) => opts.
  map(op => getRequest(set, op));
  //.map(r => m.request(r));


export const getData = (set, item, list = 'options') => {
  let rlist= reqStrList(set[item], list),
    robj= reqObjList(set, rlist),
    err = robj.filter( o => typeof o === 'string');

  if (err.length)
    return Promise.reject({ error: `getData: ${err[0]}` });  
     
  return Promise.all(robj.map(r => m.request(r))).
    then(
      lists => ({
        [list]: rlist.reduce(
          (mp, op, ix) => mp.set(op, lists[ix] || []),
            new Map())
      }),
      err => Promise.reject({ error: `getData: ${errMsg(err)}` })
    );
};

