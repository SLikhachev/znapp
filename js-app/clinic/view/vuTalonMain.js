
import { states, disp } from '../../apps/appApi';
import { changedItem, changeValue, target } from '../../apps/model/moListItem';
import { makeFormChildren } from '../form/foForm';
import { nextTagFocus } from './vuTabs.js';
import { _talNum } from './vuClinic';


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
          _talNum(changedItem()),
          makeFormChildren(form, 1)
        ]),
      ]);
    }
  };
};