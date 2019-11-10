
import { talonOpt } from '../model/moTalons.js';
import { cof } from '../form/foForm.js';
import { num_digits, sel_smo, set_smo_okato } from './vuCard'; 
import { _Num } from './vuClinic'; //tal number

export const talPolis = function(vnode) {
  
  let tal= vnode.attrs.model.talon;
  const data= talonOpt.data;
  //let tal= { smo: null, smo_okato: null, polis_ser: null, polis_num:null, polis_type: null};
  
  const _set_smo= sel_smo(tal);
  const _set_smo_okato = set_smo_okato(data, tal);
  
  return {
    view() { 
      return m("form.pure-form.pure-form-aligned.tcard",
        {style: "font-size: 1.2em;", id: "tal_polis" }, [
        m('fieldset', [
          m('legend', `Талон № ${_Num(tal.tal_num)}`),
          m('legend.leg-sec', "Полис на дату визита"),
          m(".pure-control-group", cof('polis_ser', tal)),
          m(".pure-control-group", [ cof('polis_num', tal),
            m('span.item_name', {style: "margin-left: 0em;"}, num_digits(tal)),
          ]),
// --
          m(".pure-control-group", [
            m('label', { for: "smo"}, "Страховщик"),
            m('select[name="smo"]',
              { value: tal.smo, onchange: _set_smo}, [
              m('option[value=""]', ""),
              data.get('smo_local').map(s=> m('option', {value: s.code}, s.short_name))
            ])
          ]),
          m(".pure-control-group", [
            m('label', { for: "smo_okato"}, "Регион"),
            m('input[name="smo_okato"][type="text"]', {
               oncreate: v => _set_smo_okato( { target: v.dom} ),
               list:  "okato",
               onblur: _set_smo_okato
            }),
            m('datalist[id="okato"]', [
              data.get('okato').map(o => {
                let okato = `${o.region}. ${o.name.split(' ')[0]}`;
                return m('option', okato);
              })
            ])
          ]),
// --        
        ])
      ]);
    }
  };
};
