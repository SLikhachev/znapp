
'use strict';

import { checkArray } from '../utils';
import { errMsg } from './moModel';
import { getRequest } from './moList';


const reqStrList = (def, list, loaded) => {
  const rest = def.rest || {};
  let _list = checkArray(rest[list]) ? 
    rest[list] : [];
  return _list.map( 
    o => loaded.indexOf(o) < 0 ? 
    o : '').
    filter(o => !!o);
};


const reqObjList = (set, opts) => opts.
  map(op => getRequest(set, op));
  //.map(r => m.request(r));


export const getData = (set, item, list = 'options', loaded = []) => {
  let rlist= reqStrList(set[item], list, loaded);
  //console.log( 'opts %O, loaded %O', rlist, loaded );
  
  if (rlist.length === 0)
    return Promise.resolve({ [list]: new Map() }); // just empty map
  
  let robj= reqObjList(set, rlist),
    err = robj.filter( o => typeof o === 'string');

  if (err.length)
    return Promise.reject({ error: `getData: ${err.join(', ')}` });
  
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

