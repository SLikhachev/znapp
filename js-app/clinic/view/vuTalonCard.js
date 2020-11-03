

'use strict';

import { states, disp } from '../../apps/appApi';
import { changedItem } from '../../apps/model/moListItem';
import { makeTags } from '../../apps/form/makeTags';
import { cardPath } from '../defines/defCards';
import { makeFields } from '../form/foForm';
import { _editable } from '../model/moTalons';
import { nextTagFocus } from './vuTabs.js';


export const talonCard = function () {

  let form = {}, fields, card;

  const onsubmit = e => {
    e.preventDefault();
    return disp(['save', 'card', e, 'PATCH']);
  };

  return {
    view() {
      form = states().suite.card.form || {};
      fields = form.fields || {};
      card = states().card;

      return [
        m(".legnd", `Карта № ${card}`),
        m('form.tcard.pure-form.pure-form-stacked', {
          style: "font-size: 1.2em;",
          id: "tal_card",
          oncreate: nextTagFocus,
          onsubmit
        }, [
          makeFields(makeTags(fields), fields, Object.keys(fields)),
          _editable(changedItem().talon_type) ?
            m('button.pure-button.pure-button-primary[type="submit"]',
              "Сохранить") : '',
          m(m.route.Link, {
            selector: 'a.pure-button.',
            href: cardPath(card),
            style: "margin-left: 2em;"
          }, "Открыть карту")
        ])
      ]; // form return 
    } // view
  }; // return object
}; // fn