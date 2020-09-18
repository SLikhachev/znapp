
'use strict';

import { states, disp } from '../../apps/appApi';
import { changedItem, changeValue, target } from '../../apps/model/moListItem';
import { thisYear } from '../model/moModel';
import { makeFormChildren } from '../form/foForm';
import { nextTagFocus } from './vuTabs.js';

const _value = value => item => !!item ? item : value;

const _number = _value('');
const _name = _value('новый');

//talon editable
export const _editable = type => thisYear() && (type == 1);
  // talon_type: 
  // 0- deleted 1- open (may edit) 2- closed
  // talon of the same year may edit
  // case of 1. mek else we can not send it twice in same year


const _tplName = talon => m('legend', `Шаблон ${_name(talon.crd_num)}`);


export const _talNum = (talon, tpl = '') => tpl ? 
  _tplName(talon) :
  m('legend', `Талон № ${_name(talon.tal_num)}`,
    m('span', 
      { style: "padding: 3em" }, 
      _editable(talon.talon_type) ? 'открыт': 'закрыт',
       m('span', {style: 'padding-left: 2em' }, `Год ${states().year}`)
    )
  );

const talonButton= () => m('fieldset', { style: "padding-left: 0%;" },
  m('.pure-g',
    m('.pure-u-4-24', { style: "margin-top: 5px;" },
      m('button.pure-button.pure-button-primary[type="submit"]',
        { style: "font-size: 1.1em" }, // disabled: _notEdit(tal) },
        "Сохранить"
      )
    )
  ) // --pure-g
);// -- fieldset


export const talonForm = () => {

  let form = {};

  const onsubmit = e => {
    e.preventDefault();
    //console.log('talon submit');
    return disp(['save', 'talon', e]);
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
        _editable(changedItem().talon_type) ? talonButton() : ''
      ]);
    }
  };
};