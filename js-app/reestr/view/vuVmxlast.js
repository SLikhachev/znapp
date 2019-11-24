// ./report/view/vuVmxlast.js
// show the last imported errors and download errors csv file 

import { taskResp } from '../../apps/view/vuApp.js';
import { _schema } from '../../apps/model/moModel.js';
import { clinicApi } from '../../clinic/clinicApi.js';
import { taskReestr } from '../reestrApi.js';
import { moModel } from '../model/moModel.js';
import { vuDataSheet, get_fref } from './vuDataSheet.js';


const Form = function(vnode) {
  
  //const model = vnode.attrs.model;
  //console.log(model);
  const md= { url: taskReestr.vmx.post_url, href: taskReestr.vmx.get_url };
  const download= event=> {
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
        m('form.pure-form.pure-form-stacked', {onsubmit: download},
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


export const vuVmxlast = function (vnode) {

  const { struct }= vnode.attrs;
  const fref= get_fref();

  const listMap= s=> m('tr', [ Object.keys(struct).map(
    column=> m('td', fref( s, column ))
  ) ] );
  
  const view = vuDataSheet(vnode);
  const v= Object.assign( view, { listMap: listMap } );
  v.form = Form;
  return v;
}

