
'use strict';

import { states, disp } from '../../apps/appApi';
import { makeFormChildren } from '../form/foForm';
import { nextTagFocus } from './vuTabs.js';


export const crdMain = () => {

  let form = {};

  const onsubmit = e => {
    e.preventDefault();
    return disp(['save', 'card', e]);
  };

  return {
    view() {
      form = states().suite.card.mainForm || {};
      //console.log('crd maim');
      return m('form.tcard.pure-form.pure-form-aligned',
        { style: "font-size: 1.2em;", id: "card", oncreate: nextTagFocus, onsubmit },
        m('fieldset', [
          m('legend', "Карта пациента"),
          m(".pure-g", makeFormChildren(form)),
          m(".pure-g", [
            m(".pure-u-10-24 ", m('span#card_message', '')),
            m(".pure-u-14-24 ",
              m('button.pure-button.pure-button-primary[type="submit"]',
                "Сохранить")
            )
          ]) // pure-g
        ]));// form
    } // view
  }; // return
}; //func
