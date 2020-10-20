
'use strict';

import { states, disp } from '../../apps/appApi';


// apply template view
export const applyTempl = function() {

  let templs, tpl = m.stream('');

  const apply = e => {
    e.preventDefault();
    disp(['apply_tpl', tpl()]);
  };

  return { view() {
    
    templs = states().options.get('templs') || [];

    return m('.pure-g', [
      m(".pure-u-1-5", [
        m('select[name="templ"]', 
          { value: tpl(), onchange: e => tpl(e.target.value) }, [
          m('option[value=""]', "Шаблон талона"),
          templs.map( t => m('option', 
            {key: t.tal_num, value: t.tal_num}, t.crd_num)
          )
        ]),
      ]),
      m(".pure-u-1-5",
        m('button.pure-button.pure-button[type="button"]',
          {style: "margin-top: 0.3em", onclick: apply},
          "Применить шаблон")
        ),
      ]);
    }
  };
};
