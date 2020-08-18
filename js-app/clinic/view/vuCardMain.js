
import { states, disp } from '../../apps/appApi';
import { makeTags } from '../../apps/form/makeTags';
import { nextTagFocus } from './vuTabs.js';


const makeFields = (fn, flds, ind) => flds.map((f, ix) => m('.pure-control-group', fn(f, ind*20+ix)));

const makeGroup = (group, ind) => m(group.class,
  makeFields(makeTags(group.fields), Object.keys(group.fields), ind)
);

const makeFormChildren = form => Object.keys(form).map( 
  (group, ind) => makeGroup(form[group], ind)
);

export const crdMain = () => {

  let form = {};

  const onsubmit = e => {
    e.preventDefault();
    return disp(['save', 'card', e]);
  };

  return {
    view() {
      form = states().suite.card.mainForm || {};

      return m('form.tcard.pure-form.pure-form-aligned',
        { style: "font-size: 1.2em;", id: "card", oncreate: nextTagFocus, onsubmit },
        m('fieldset', [
          m('legend', "Карта пациента"),
          m(".pure-g", makeFormChildren(form)),
          m(".pure-g", [
            m(".pure-u-10-24 ", m('span#card_message', '')),
            m(".pure-u-14-24 ",
              m('button.pure-button.pure-button-primary[type="submit"]',
                "Сохранить"),
            )
          ]) // pure-g
        ]));// form
    } // view
  }; // return
}; //func
