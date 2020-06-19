

import { changeValue, changedItem } from '../model/moListItem';


// String -> String
const _klass = kl => kl ? kl[0] !== '.' ? `.${kl}` : kl : '';

// String -> String -> String -> Vnode
const label = (ffor, text = '', klass = '') => m(`label${klass}[for=${ffor}]`, text);

// Object -> Vnode
const input = obj => { // {klass, type, name, tabindex, aux, value, attrs} => {

  let tag = `input${_klass(obj.klass)}`;

  tag = ['type', 'name', 'tabindex'].reduce(
    (s, el) => obj[el] ? s + `[${el}=${obj[el]}]` : s, tag);

  tag = obj.aux.reduce((s, el) => s + `[${el}]`, tag);

  // we can redefine value oninput by attrs
  const attrs = { value: obj.value, oninput: changeValue };

  const val = obj.attrs.value;

  if (typeof val === 'function' && val.name === 'stream') {
    attrs.value = val();
    delete obj.attrs.value;
  }

  return m(tag, Object.assign({}, attrs, obj.attrs));
}

export const makeTags = defs => (field, idx) => {

  const sf = defs[field]; // stuct of object presentation
  if (!sf) return ''; // no such field 

  // composite struct
  let _label = sf.label || sf.th || sf; //[labeltext, labelclass]

  if (!Array.isArray(_label)) // no label present
    _label = null;

  if (!sf.label && _label && _label.length > 1) // label from th
    _label = [_label[0]];

  const _tag = sf.tag || [''] // [tagclass, auxattrs(reqired, disabled, etc)]
  //if (idx == 1 || idx == 2)
  if (idx < 2)
    _tag.push['autofocus'];

  // checkbox value
  let type = sf.type || 'text';
  let value = changedItem()[field];
  let aux = _tag.slice(1);
  if (type === 'checkbox' && value)
    aux.push('checked')

  return [
    _label ? label(field, ..._label) : '',
    input({
      klass: _tag[0],
      type: type, //type of input field
      name: field, //name of input field
      tabindex: idx,
      aux: aux, // aux params
      value: value, // current chosen value
      attrs: sf.attrs || {} // attrs from definition eg. { placeholder: 'i love you' }
    })
  ]
};
