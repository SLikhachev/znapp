
import { moTalonsList, moTalon, talonOpt } from '../model/moTalons.js';
import { ptf } from '../form/foForm.js';
import { num_digits } from './vuCard'; 

let edit= moTalonsList.year == moTalonsList._year ? false: true;

export const talPolis = function(vnode) {
  let tal= vnode.attrs.model.talon;
  let polis= vnode.attrs.model.polis;
  let ff = [ 'polis_ser', 'polis_num', 'smo'];
  
  const toSave= polis=> {
    // SMO
    if ( polis.smo === null && polis.smo_okato === null)
      return 'Укажите либо СМО либо СМО ОКАТО';
    return '';
  };
  
  const polisSave = function(e) {
    e.preventDefault();
    //saveCard(event, card, model, method) {
    
    model.save= toSave(polis);
    if ( Boolean( model.save ) ) {
      vuDialog.open();
      return false;
    }
    return moTalon.savePolis(e, polis, model, method).catch(err=> {
      model.save = err;
      vuDialog.open();
    });
  };
  
  return {
    view() { return m('h2', 'TAL POLIS');
      return m("form.pure-form.pure-form-stacked.tcard",
        {style: "font-size: 1.2em;", id: "tal_polis", onsubmit: polisSave }, [
        m('fieldset', [
          m('legend', 'Талон № ', tal.tal_num ? tal.tal_num: 'Новый'),
          m('legend.leg-sec', "Полис на дату визита"),
          m(".pure-control-group", ptf('polis_ser', polis)),
          m(".pure-control-group", [ptf('polis_num', polis),
            m('div.item_name', {style: "margin-left: 10em;"}, num_digits(polis)),
          ]),
          m(".pure-control-group", [
             cof('smo', card, {onblur: _set_smo}),
                m('span.item_name',
                  card.smo === null ? '':  get_name(card.smo + _reg, 'smo_local', 'code', 'short_name'))
              ]),
// --
              m(".pure-control-group", [
                m('label', { for: "smo_okato"}, "Регион"),
                m('input[name="smo_okato"][type="text"]', {
                  oncreate: v => _set_smo_okato( { target: v.dom} ),
                  list:  "okato",
                  //value: card.smo_okato,
                  tabindex: "12",
                  onblur: _set_smo_okato
                }),
                //cof('smo_okato', card, {
                //  oncreate: v => set_smo_okato({target: v.dom}),
                //  onblur: set_smo_okato
                //}),
                //m('span.item_name', set_name(card.smo_okato, 'okato', 'okato', 'name', true) )
                m('datalist[id="okato"]', [
                  data.get('okato').map(o => {
                    let okato = `${o.region}. ${o.name.split(' ')[0]}`;
                    return m('option', okato);
                  })
                ])
              ]),
// --          
          m('button.pure-button.pure-button-primary[type="submit"]',
            { disabled: edit
          }, "Сохранить"),
        
        ])
      ]);
    }
  };
};
