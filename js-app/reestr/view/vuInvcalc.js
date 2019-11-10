// src/report/view/vuInvcalc.js

import { vuTheader, taskResp } from '../../apps/view/vuApp.js';
import { _schema } from '../../apps/model/moModel.js';
import { clinicApi } from '../../clinic/clinicApi.js';
import { taskReestr } from '../reestrApi.js';
import { moModel } from '../model/moModel.js';
import { vuDataSheet } from './vuDataSheet.js';


const Form = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  const md= { url: taskReestr.vmx.post_url, href: taskReestr.vmx.get_url };
  const upload= event=> {
    //console.log('report');
    event.preventDefault();
    let task= document.getElementById('task');
    task.setAttribute('display', 'none');
    return moModel.formSubmit(event, _schema('task'), md, "GET").then(() => {
      task.setAttribute('display', 'block');
    });
  };
  
  return {
  
    view() {
      //console.log(model);
      return [ m('div#task.pure-g', { style: "margin-bottom: 1.3em;" }, [
        m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked', {onsubmit: upload},
          m('fieldset', [
            m('legend', "Выгрузить в CSV файл"),
            m('.pure-controls', [
              m('button.pure-button.pure-button-primary[type="submit"]',
                { style: "font-size: 1.2em; margin-left: 2em;",
                  //onclick: upload
                }, "Выгрузить")
            ])
          ])
        )
      ]),
      m('.pure-u-2-3', taskResp(md) )
    ])
  ];
  }
};  
}

export const vuInvcalc = function (vnode) {
  //card_id: "/cards/:crd",
  return {
    view () {
      return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(Form, { model: vnode.attrs.model } )
      ];
    }    
        
  }; //return this object
}

