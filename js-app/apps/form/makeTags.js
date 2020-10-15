
import { states, memost } from '../appApi';
import { checkArray } from '../utils';
import { changeValue, changedItem } from '../model/moListItem';

const E = x => '';

// Any -> String
const _text = t => R.isNil(t) ? '' : t.toString();

// String -> String
export const _klass = k => R.isEmpty(_text(k)) ? '' : k[0] !== '.' ? `.${k}` : k;
//----------------------------------------------------------

// Object -> null | Array
const _labeltag = sf => {
  let _label = sf.label || sf.th || sf; //[labeltext, labelclass]

  if (!checkArray(_label)) // no label present
    return null;

  if (!sf.label && _label) // no klass for label 
    return [_label[0]];

  return _label;
};
//----------------------------------------------------

// Object -> Array
const _tagarray = sf => checkArray(sf.tag) ? sf.tag : [''];

//--------------------------------------------------------

// (String -> String -> String) -> Vnode
const label = (fortag, txt = '', kl = '') => m(
  `label${_klass(kl)}[for=${_text(fortag)}]`,
  _text(txt));

const labelcheckbox = (fortag, checkbox = '', txt = '', kl = '') => m('.pure-controls',
  m(`label${_klass(kl)}[for=${_text(fortag)}]`, [
    checkbox, _text(txt)
    //m('span', { style: "padding: 0px 7px 0px;" }, _text(txt))
  ])
);
//-------------------------------------------------

// Object -> Vnode
const _input = obj => { // {klass, type, name, tabindex, aux, value, attrs} => {

  let tag = `input${_klass(obj.klass)}`;

  tag = ['type', 'name', 'tabindex'].reduce(
    (s, el) => obj[el] ? s + `[${el}=${_text(obj[el])}]` : s, tag);

  tag = obj.aux.reduce((s, el) => s + `[${_text(el)}]`, tag);

  // we can redefine value oninput by attrs
  let attrs = { value: obj.value, oninput: changeValue };

  Object.keys(obj.attrs).forEach(k => {
    let val = obj.attrs[k];
    if (k === 'options')
      return;
    if (typeof val === 'function' && !k.startsWith('on')) {
      // func calls here
      attrs[k] = val();
      return;
    }
    // func as ref to call at event (takes event as param) 
    // or vnode at lifetime func call (takes vnode) 
    attrs[k] = val;
  });
  //attrs = Object.assign(attrs, obj.attrs)
  return m(tag, attrs);
};
//------------------------------------------

// String -> Vnode
const legend = t => m('legend', t.text ? _text(t.text) : _text(t) );
//-------------------------------------------

// Object -> Vnode
const button = sf => {
  let klass = _klass(_tagarray(sf)[0]);
  let text = _text(_labeltag(sf)[0]) || 'Выполнить';
  let attrs = sf.attrs || {};
  attrs.type = _text(sf.type) || 'submit';
  attrs.onclick = changeValue;
  return m(`button${klass}`, attrs, text);
};
//--------------------------------------------

// Object -> Vnode
const file = sf => {
  let klass = _klass(_tagarray(sf)[0]) || '.inputfile';
  return [
    m(`input${klass}[type="file"][name="file"][id="file"]`,
      {
        'data-multiple-caption': "{count} files selected",
        'multiple': false, onchange: changeValue
      }
    ),
    m('label[for="file"]', m('strong', "Выбрать файл"))
  ];
};
//-------------------------------------------

// (Object -> String) -> Vnode
const select = (sf, field) => {
  let _label = _labeltag(sf), _tag = _tagarray(sf), 
    _attrs= sf.attrs || {}, 
    attrs = Object.assign(_attrs, 
      { value: changedItem()[field], onchange: changeValue }
    );
  return [
    _label ? label(field, ..._label) : '',
    m(`select${_klass(_tag[0])}[name=${field}]`, attrs,
      Object.entries(sf.options).map(el => {
        let [v, op] = el;
        return m('option', { key: v, value: v }, op);
      })
    )
  ];
};
//-------------------------------------------

// (String -> Array -> String -> String) -> Array(Vnode)
const labelradio = (fortag='dummy', radio = [], txt = '', kl = '') => [
  m(`label${_klass(kl)}[for=${fortag}]`, _text(txt)),
  radio.map(tag => [
    m('span', { style: "line-height: 1em;" }, _text(tag.text)),
    m(`input[name=${fortag}][type=radio]`, {
      style: "margin: 0 14px 0 7px;",
      value: tag.value,
      checked: changedItem()[fortag] === tag.value ? true : false,
      onchange: changeValue
    })
  ])
];
//------------------------------------------

// Object -> Vnode
const memo = sf => {
  //console.log(sf)
  //memost('');
  let def = sf.memo || sf || {},
    check = def.check || E,
    params = def.params || [],
    tag_cls = _tagarray(def)[0],
    attrs = def.attrs || {},
    resp = check(params),
    [cls= '', txt=''] = typeof resp === 'string' ? resp.split('&') : [];
  
  if (!txt)
    ([txt, cls] = [cls, txt]); //swap it
  //console.log('txt', txt)
  return txt ? m(`span${tag_cls}`, attrs, m(`span.${cls}`, txt)) : '';
};

//----------------------------------------

// (String -> Func) -> Vnode
// list - string of list id
// fn - array morphism 
const datalist = (list='', fn=E) => {
  let opts = states().options.get(list) || [];
  return m(`datalist[id="${list}"]`, opts.map(fn));
};

//----------------------------------------

// (Object -> String -> Int) -> Array(Vnode)
const input = (sf, field, idx) => {

  // sprcial field wrapper
  if (field === 'wrap')
    return '';

  let _label = _labeltag(sf);

  // [tagclass, auxattrs(reqired, disabled, etc)]
  let _tag = _tagarray(sf, idx);
  /*
  // DATA-INITIAL set at ATTRS object and will be shown anyway
  let init_val = sf.attrs && sf.attrs['data-initial'];
  if (!!init_val)
    changedItem(Object.assign(changedItem(), { [field]: init_val }));
  */
  let type = sf.type || 'text';
  let value = changedItem()[field];
  let aux = _tag.slice(1);

  // checkbox value
  if (type === 'checkbox' && value)
    aux.push('checked');

  let _tagobj = {
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

  if (type === 'radio')
    return labelradio(_text(field), sf.radio, ..._label);

  let tags = [
    _label ? label(field, ..._label) : '',
    _input(_tagobj)
  ];

  if (_tagobj.attrs.list && _tagobj.attrs.options)
    tags.push(datalist(_tagobj.attrs.list, _tagobj.attrs.options));

  if (sf.memo) {// && (memost() === field))
    let _memo = memo(sf.memo, field);
    if (_memo) tags.push(_memo);
  }
    
  return tags;
};
//----------------------------------------

// group of input tags
// (Object -> int) -> Array(Vnode)
const inputs_group = (sf, idx) => Object.keys(sf).map( k => input(sf[k], k, idx) );

//----------------------------------------

// Curried Object -> (String -> Int) -> Func

const tag_fn = {
  file,
  select,
  button,
  submit: button,
  memo
};

export const makeTags = defs => (field, idx) => {

  let sf = defs[field]; // stuct of object presentation
  if (!sf) return ''; // no such field 

  if (field === 'legend')
    return legend(sf);

  if (sf.type && tag_fn[sf.type])
    return tag_fn[sf.type](sf, field);

  if (field === 'fields_group')
    return inputs_group(sf, idx);

  return input(sf, field, idx);
};