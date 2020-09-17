
import { states, disp } from '../../apps/appApi';
import { changedItem, changeValue, target } from '../../apps/model/moListItem';
import { makeFormChildren } from '../form/foForm';
import { nextTagFocus } from './vuTabs.js';

const $_value = value => item => !!item ? item : value;

const $_number = $_value('');
const $_name = $_value('новый');

//talon editable
export const _editable = type => 
  // talon_type: 
  // 0- deleted 1- open (may edit) 2- closed
  // talon of the same year may edit
  // case of 1. mek else we can not send it twice in same year
  thisYear() && (type == 1) ? 'открыт': 'закрыт'; 


const _tplName = talon => m('legend', `Шаблон ${_name(talon.crd_num)}`);


export const _talNum = (talon, tpl = '') => tpl ? 
  _tplName(talon) :
  m('legend', `Талон № ${_number(talon.tal_num)}`,
    m('span', 
      { style: "padding: 3em" }, 
      _editable(talon.talon_type),
       `Год ${states().year}`
    )
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
          _talNum(changedItem()),
          makeFormChildren(form, 1)
        ]),
      ]);
    }
  };
};