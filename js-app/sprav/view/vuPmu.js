
// src/sprav/view/dsTNM.js

import { moModel } from '../../apps/model/moModel.js';
import { restApi } from '../spravApi.js';
import { moStruct } from '../model/moStruct.js';

export const pmuFind = function (vnode) {
  
  let model=vnode.attrs.model, data={};
  //let model = vnode.attrs.model;
  let _usl= function(e) {
    data.code_usl= e.target.value;
    return false;
  };
  
  let on_submit = function (event) {
    // button FIND click event handler callback
    event.preventDefault();
    let cu= data.code_usl;
    if (cu.length < 3) return false;
    model.url=restApi.pmu.url + `?code_usl=ilike.${cu}*&limit=20`;
    return moModel.getList(model);
    //m.redraw();
    //return false;
  };

  return {

    oninit(vnode) {
      //vnode.attrs.model.method='POST';
      //vnode.attrs.model.url =restApi.onko_n6.url;
    },

    view(vnode) {

      return m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", { onsubmit: on_submit },
            m("fieldset", m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[name=code_usl][type='text']",
                  { placeholder: "Код услуги",
                    onkeyup: e=> data.code_usl= e.target.value,
                    value: data.code_usl
                })
              ),
              /*
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[name=stady][type='search']",
                  {placeholder: "Стадия (число)"}
                )
              ),
              */
              m(".pure-u-1-5",
                m('button.pure-button.pure-button-primary[type="submit"]', "Выбрать")
              )
            ]))
          ) //form
        ) // u-1-2
      ); // g return
    }// view
  }; //this object
}; //func
