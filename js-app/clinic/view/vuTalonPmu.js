
import { states, disp } from '../../apps/appApi';
import { vuListTable } from '../../apps/view/vuListTable';
import { makeGroup } from '../form/foForm';
import { get_pmu_attr } from '../model/moPmu'; 

const talonPmuForm = () => {
  
  let form, pmu, error;

  const onsubmit = e => {
    e.preventDefault();
    let _pmu = get_pmu_attr();
    if (!!_pmu)
      return disp(['pmu', _pmu, e]);
    return false;
  };

  return {
    view(vnode) {
      ({ form = {} } = vnode.attrs);
      pmu = states().options.get('pmu');
      error = (pmu && pmu[0] && pmu[0].error || '').
        split('&')[1] || '';
      console.assert(Reflect.has(form, 'fields'));

      return [ m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", { onsubmit },
            m("fieldset", makeGroup(form, 1) )
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
        _hdr("И вот заголовок"),
        m(talonPmuForm, { form }),
        m(vuTable, {itdef, list})
      ];
    }
  };
};

