
//import { vuDialog } from '../../apps/view/vuDialog.js';
//import { clinicApi } from '../clinicApi.js';
//import { moCard } from '../model/moCards.js';
//import { moTalonsList, talonOpt } from '../model/moTalons.js';
//import { checkDost } from './vuCard.js';
//import { ctf } from '../form/foForm.js';

import { states, disp } from '../../apps/appApi';
import { makeTags } from '../../apps/form/makeTags';
import { makeFields } from '../form/foForm';
import { nextTagFocus } from './vuTabs.js';


export const talonCard = function() {
  /*
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
  */
  let form = {}, fields;

  const onsubmit = e => {
    e.preventDefault();
    return false;
    //return disp(['save', 'card', e]);
  };

  return {
    view() {
      form = states().suite.card.form || {};
      fields = form.fields || {}; 
      //console.log('tal crd');
      return [
        m(".legnd", `Карта № `),
        m('form.tcard.pure-form.pure-form-stacked', {
          style: "font-size: 1.2em;",
          id: "tal_card",
          oncreate: nextTagFocus,
          onsubmit
        }, [
          makeFields(makeTags(fields), Object.keys(fields)),
          m('button.pure-button.pure-button-primary[type="submit"]',
            "Сохранить"),
          m(m.route.Link, {
            selector: 'a.pure-button.',
            href: `#`,
            style: "margin-left: 2em;"
          }, "Открыть карту")
        ])
      ]; // form return 
    } // view
  }; // return object
}; // fn