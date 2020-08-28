
import { states, disp } from '../../apps/appApi';
import { makeFormChildren } from '../form/foForm';
import { nextTagFocus } from './vuTabs.js';

const talNum = tal => m('legend', 
  `Талон № `, 
  m('span', { style: "padding: 3em" }, 'закрыт'), 
  `Год `
);


export const talonForm = () => {

  let form = {};

  const onsubmit = e => {
    e.preventDefault();
    console.log('talon submit');
    //return disp(['save', 'card', e]);
  };
  
  return {
    view() {
      form = states().suite.talon.mainForm || {};

      return m("form.pure-form.pure-form-stacked.tcard", 
        { 
          style: "font-size: 1.2em;", 
          id: "talon", 
          oncreate: nextTagFocus,
          onsubmit
        }, [
        m('fieldset', [
          talNum(),
          makeFormChildren(form, 1)
        ]),
      ]);
    }
  };
};