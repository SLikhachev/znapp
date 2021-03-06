
'use strict';

import { states, disp } from '../../apps/appApi';
import { changedItem } from '../../apps/model/moListItem';
import { vuListTable } from '../../apps/view/vuListTable';
import { makeGroup } from '../form/foForm';
import { _editable } from '../model/moTalons';
import { get_pmu_field } from '../model/moPmu';

const talonPmuForm = () => {

  let form, pmu, error;

  const onsubmit = e => {
    e.preventDefault();
    let field = get_pmu_field();
    if (!!field)
      return disp(['save_pmu', field, e]);
    return false;
  };

  return {
    view(vnode) {
      ({ form = {} } = vnode.attrs);
      pmu = states().options.get('pmu');
      error = (pmu && pmu[0] && pmu[0].error || '').
        split('&')[1] || '';
      console.assert(Reflect.has(form, 'fields'));

      return [m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", {
            onsubmit,
            class: _editable(changedItem().talon_type) &&
              !!changedItem().tal_num ?
              'tcard' : 'disable'
          },
            m("fieldset", makeGroup(form, 1))
          ) //form
        )), // u-1-2, g
      m('.pure-g',
        m(".pure-u-1-2 ",
          m('span#card_message', m('span.red', error))
        )
      )
      ];
    }// view
  }; //this object
}; //func

export const talonPmu = () => {

  let def, itdef, list, form;

  const _hdr = text => R.isNil(text) ? '' :
    m('h3', { style: "font-size: 1.2em;" }, text);

  const vuTable = vuListTable({});


  return {
    view() {
      def = states().suite.tal_pmu || {};
      form = def.form || {};
      itdef = def.item || {};
      list = states().data.get('tal_pmu') || [];

      return [
        _hdr("ПМУ текущего талона"),
        m(talonPmuForm, { form }),
        m(vuTable, { itdef, list })
      ];
    }
  };
};

