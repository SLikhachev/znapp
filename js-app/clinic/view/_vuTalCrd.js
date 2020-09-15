
import { vuDialog } from '../../apps/view/vuDialog.js';
import { clinicApi } from '../clinicApi.js';
import { moCard } from '../model/moCards.js';
import { moTalonsList, talonOpt } from '../model/moTalons.js';
import { checkDost } from './vuCard.js';
import { ctf } from '../form/foForm.js';

let edit= moTalonsList.year == moTalonsList._year ? false: true;

export const talCrd = function (vnode) {
  let { model }= vnode.attrs;
  let { card }= model; // ref to talon model.card
  const data= talonOpt.data;
  //const model= {}; //local model
  const method= 'PATCH';
  //console.log(card);
  let ff = [
    'fam', 'im', 'ot', 'birth_date',
    'crd_polis_ser', 'crd_polis_num'];  //, 'smo'];
  
  const toSave= card=> {
    let dost= checkDost(card);
    if ( Boolean(dost) )
      return dost;
    if ( !card.crd_smo && !card.crd_smo_okato)
      return 'Укажите либо СМО либо СМО ОКАТО';
    // to save card 
    return '';
  };
  
  const _set_smo = e=> {
    if ( Boolean( e.target.value) ) {
      card.crd_smo= e.target.value;
      card.crd_smo_okato= data.get('smo_local')[0].okato;
    } else {
      card.crd_smo= null;
      card.crd_smo_okato= null;
    }
  };

  const cardSave = function(e) {
    e.preventDefault();
    //saveCard(event, card, model, method) {
    
    model.save= toSave(card);
    if ( Boolean( model.save ) ) {
      vuDialog.open();
      return false;
    }
    let _card= Object.assign( {}, card );
    ['crd_polis_num', 'crd_polis_ser', 'crd_smo', 'crd_smo_okato'].map( f=> delete _card[f] );
    _card.smo= card.crd_smo;
    _card.smo_okato= card.crd_smo_okato;
    return moCard.saveCard(e, _card, model, method).catch(err=> {
      model.save = err;
      vuDialog.open();
    });
  };

  return {
    view() {
    //console.log('crdForm view')
      let duls= card.dul_serial ? card.dul_serial: '';
      let duln= card.dul_number ? card.dul_number: 'Нет';
      let mo= card.mo_att ? card.mo_att: '';
      //console.log(card);
      return m(".pure-u-6-24.patz-data", { style: "overflow: hidden; padding-right: 1em" },
        m(".legnd", `Карта № ${card.crd_num}`),
        m('form.tcard.pure-form.pure-form-stacked',
         {style:"font-size: 1.2em;", id:"tal_card", onsubmit: cardSave },[
          //m(".legnd", `Карта № ${card.crd_num}`),
          ff.map( f => m(".pure-control-group", ctf(f, card)) ),
          m(".pure-control-group", [
            m('label', { for: "crd_smo"}, "Страховщик"),
            m('select[name="smo"]',
              {value: card.crd_smo, onchange: _set_smo}, [
              m('option[value=""]', ""),
              data.get('smo_local').map(s=> m('option', {value: s.code}, s.short_name))
            ])
          ]),
          m("span", `Приписан: ${mo}`),
          m("span", `Документ ${duls} ${duln}`),
          m('button.pure-button.pure-button-primary[type="submit"]',
            { disabled: edit
          }, "Сохранить"),
        
       m(m.route.Link, { selector: 'a.pure-button.', 
            href: `${clinicApi.cards}/${card.crd_num}`,
            style: "margin-left: 2em;"
            }, "Открыть карту" )
      ]) /*form*/
      /*
      m('span#card_message',
        model.save ? model.save.err ? m('span.red', model.save.msg) : '' : ''
      )
      */
    ); //patz
    } // view
  }; // return
};
