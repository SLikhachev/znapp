
'use strict';

import { disp } from '../../apps/appApi';
import { changedItem, changeValue, target } from '../../apps/model/moListItem';
import { thisYear } from '../model/moModel';


const style = "font-size: 1.2em; font-weight: 600; margin-top: 3em;";
const color = "color: #fff; background-color: #C03;";


// delete talon view
export const deleteTalon = function() {

  let tal_num, talon_type;
  const deleted = 0, open = 1, closed = 2;
  const _type = { 
    [open]: ["Закрыть", closed],  
    [closed]: ["Открыть", open] 
  };

  const _click = type => e => {
    e.preventDefault();
    return disp(['change_talon_type', type, e]);
    //.then(res => changeValue(target('talon_type', res.talon_type)));
  };

  return { view() {
    ({ tal_num, talon_type } = changedItem());

    return !tal_num || !thisYear() ? '' : m('.pure-g', [
      m(".pure-u-1-8", 
        m('button.pure-button.pure-button.[type="button"]',
          {
            style, 
            onclick: _click(_type[talon_type][1])
          },
          `${_type[talon_type][0]} талон`
      )),
      m(".pure-u-1-8", talon_type == closed ? '' :
        m('button.pure-button.pure-button[type="button"]',
          {
            style: `${style} ${color}`,
            onclick: _click(deleted)
          },
          "Удалить талон"
      )),
    ]);
    }
  };
};
