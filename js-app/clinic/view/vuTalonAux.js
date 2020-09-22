
'use strict';

import { states } from '../../apps/appApi';
import { changedItem } from '../../apps/model/moListItem';
import { makeFormChildren } from '../form/foForm';
import { nextTagFocus } from './vuTabs';
import { _talNum } from './vuTalonMain'; 


export const talonAuxForm = () => {

  let form = {}, auxform;

  return {
    view(vnode) {
      ({ auxform='noform' } = vnode.attrs);
      form = states().suite.talon[auxform] || {};

      return m("form.pure-form.pure-form-stacked.tcard", 
        { 
          style: "font-size: 1.2em;", 
          id: auxform, 
          oncreate: nextTagFocus,
        }, [
        m('fieldset', [
          _talNum(changedItem()),
          makeFormChildren(form, 1)
        ]),
      ]);
    }
  };
};