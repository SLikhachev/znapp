// src/report/view/vuVmxlast.js

import { foResp } from '../../apps/view/vuApp.js';
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
    let resp= document.getElementById('resp');
    resp.setAttribute('display', 'none');
    return moModel.formSubmit(event, _schema('task'), md, "GET").then((t) => {
      //console.log(r);
      resp.setAttribute('display', 'block');
    });
  };
  
  return {
  
    view() {
      //console.log(model);
      return [ m('.pure-g', { style: "margin-bottom: 1.3em;" }, [
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
      m('.pure-u-2-3', foResp(md) )
    ])
  ];
  }
};  
}

export const vuVmxlast = function (vnode) {
  //card_id: "/cards/:crd",
  const card_id= clinicApi.card_id.split(':')[0];
  //talon_id: "/talons/:tal/:crd",
  const talon_id= clinicApi.talon_id.split(':')[0];
  
  const { struct }= vnode.attrs;
  let clinic= location.href.split('/').slice(0,3);
  clinic[1]= '/';
  clinic.push('clinic/#!');
  const root= clinic.join('/');
  //console.log(root);
  const link= (val, ref)=> m('a', {href: `${root}${ref}`, target: '_blank' }, val);

  const fref= (s, f)=> {
    if (f == 'crd_num')
      return link (s.crd_num, `${card_id}${s.crd_num}`);
    if (f == 'tal_num')
      return link(s.tal_num, `${talon_id}${s.tal_num}/${s.crd_num}`);
    return s[f];
  }

  const listMap= s=> m('tr', [ Object.keys(struct).map(
    column=> m('td', fref( s, column ))
  ) ] );
  
  const view = vuDataSheet(vnode);
  const v= Object.assign( view, { listMap: listMap } );
  v.form = Form;
  return v;
}

