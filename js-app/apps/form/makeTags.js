

import { changeValue, changedItem } from '../model/moListItem';


// Any -> String
const _text = t => R.isNil(t) ? '' : t.toString();
const _klass = k => R.isEmpty(_text(k)) ? '' : k[0] !== '.' ? `.${k}` : k;


// (String -> String -> String) -> Vnode
const label = (fortag, txt = '', kl = '') => m(
  `label${_klass(kl)}[for=${_text(fortag)}]`,
  _text(txt));

const labelcheckbox = (fortag, checkbox = '', txt = '', kl = '') => m('.pure-controls',
  m(`label${_klass(kl)}[for=${_text(fortag)}]`, [
    checkbox,
    m('span', { style: "padding: 0px 7px 0px;" }, _text(txt))
  ])
)

// Object -> Vnode
const _input = obj => { // {klass, type, name, tabindex, aux, value, attrs} => {

  let tag = `input${_klass(obj.klass)}`;

  tag = ['type', 'name', 'tabindex'].reduce(
    (s, el) => obj[el] ? s + `[${el}=${_text(obj[el])}]` : s, tag);

  tag = obj.aux.reduce((s, el) => s + `[${_text(el)}]`, tag);

  // we can redefine value oninput by attrs
  let attrs = { value: obj.value, oninput: changeValue };

  const val = obj.attrs.value;

  if (typeof val === 'function' && val.name === 'stream') {
    attrs.value = val();
    delete obj.attrs.value;
  }
  attrs = Object.assign(attrs, obj.attrs)
  return m(tag, attrs);
}

const legend = t => m('legend', _text(t));

const button = sf => {
  const klass = Array.isArray(sf.tag) ? _klass(sf.tag[0]) : '';
  const text = Array.isArray(sf.label) ? _text(sf.label[0]) : 'Выполнить';
  const attrs = sf.attrs || {};
  attrs.type = _text(sf.type) || 'submit';
  attrs.onclick = changeValue;
  return m(`button${klass}`, attrs, text);
}

const file = sf => {
  const klass = Array.isArray(sf.tag) ? _klass(sf.tag[0]) : '.inputfile';
  return [
    m(`input${klass}[type="file"][name="file"][id="file"]`,
      {
        'data-multiple-caption': "{count} files selected",
        'multiple': false, onchange: changeValue
      }
    ),
    m('label[for="file"]', m('strong', "Выбрать файл"))
  ];
}

const input = (sf, field, idx) => {

  // composite struct
  let _label = sf.label || sf.th || sf; //[labeltext, labelclass]

  if (!Array.isArray(_label)) // no label present
    _label = null;

  if (!sf.label && _label) // no klass for label 
    _label = [_label[0]];

  // [tagclass, auxattrs(reqired, disabled, etc)]
  const _tag =
    (sf.tag && Array.isArray(sf.tag) && sf.tag.length > 0) ? sf.tag : ['']

  //if (idx == 1 || idx == 2)
  if (idx < 2)
    _tag.push['autofocus'];

  /*
  let init_val = sf.attrs && sf.attrs['data-initial'];
  if (!!init_val)
    changedItem(Object.assign(changedItem(), { [field]: init_val }));
  */
  let type = sf.type || 'text';
  let value = changedItem()[field];
  let aux = _tag.slice(1);

  // checkbox value
  if (type === 'checkbox' && value)
    aux.push('checked')

  const _tagobj = {
    klass: _tag[0],
    type: type, //type of input field
    name: field, //name of input field
    tabindex: idx,
    aux: aux, // aux params
    value: value, // current chosen value
    attrs: sf.attrs || {} // attrs from definition eg. { placeholder: 'i love you' } 
  };

  if (type === 'checkbox' && sf.view && sf.view === 'controls')
    return labelcheckbox(field, _input(_tagobj), ..._label);

  return [
    _label ? label(field, ..._label) : '',
    _input(_tagobj)
  ]
};


export const makeTags = defs => (field, idx) => {

  const sf = defs[field]; // stuct of object presentation
  if (!sf) return ''; // no such field 

  if (field === 'legend')
    return legend(sf);
  if (sf.type && sf.type === 'file')
    return file(sf);

  if (sf.type && (sf.type === 'submit' || sf.type === 'button'))
    return button(sf);

  return input(sf, field, idx);
}