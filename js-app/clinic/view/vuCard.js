// src/clinic/view/vuCard.js

//import { trims } from '../../apps/utils';
//import { vuDialog } from '../../apps/view/vuDialog.js';
import { vuLoading } from '../../apps/view/vuApp.js';
//import { moModel, _region } from '../../apps/model/moModel.js';
//import { moCard, cardOpt } from '../model/moCards.js';
//import { clinicApi } from '../clinicApi.js';
import { tabsView } from './vuTabs.js';
//import { cof } from '../form/foForm.js';
//import { upper } from './vuClinic';
import { states } from '../../apps/appApi';
/*
const _Reg = _region();

export const checkDost = card => {

  ['fam', 'im', 'ot'].map(k => card[k] = card[k].trim().toUpperCase());

  let dost = '';
  if (!card.fam) dost += '2_';
  if (!card.im) dost += '3_';
  if (!card.ot) dost += '1_';
  if (!card.fam && !card.im)
    return 'Укажите Фамилию или Имя';
  if (Boolean(dost))
    card.dost = dost;
  return '';
}

export const num_digits = function (card) {
  let s = 0, n = 0;
  if (Boolean(card.polis_ser))
    s = card.polis_ser.toString().length;
  if (Boolean(card.polis_num))
    n = card.polis_num.toString().length;
  try {
    if (s === 0 && n === 16) {
      card.polis_type = 3;
      return "ЕНП 16 цифр";
    }
    if (s === 0 && n > 0 && n < 16) {
      card.polis_type = 2;
      return `Временное свидетельсто ${n} цифр`;
    }
    if (s > 0 && n > 0) {
      card.polis_type = 1;
      return `Старый полис ${n} цифр`;
    }
    card.polis_type = null;
    return m('span.red', `Кривой полис ${n} цифр`);
  } catch (e) {
    return m('span.red', "Тип полиса неизвестен");
  }
};
// set smo -- input 2 digits only
export const set_smo = card => {
  return e => {
    let smo = parseInt(e.target.value);
    if (isNaN(smo)) card.smo = 0; //this value subtracts from code in input
    else card.smo = smo; // + _reg;
    //console.log(card.smo);
  };
};
// set smo select from options
export const sel_smo = card => {
  return e => {
    if (Boolean(e.target.value)) {
      card.smo = e.target.value;
    } else {
      card.smo = null;
      card.smo_okato = null;
    }
  };
}

const okato = (target, data, okato) => {
  const o = data.get('okato').find(item => item.okato == okato);
  if (!!o)
    target.value = `${o.region}. ${o.name.split(' ')[0]}`;
  else
    target.value = '';
  return false;
}

const set_okato_by_smo = (target, data, card) => {
  const smo = data.get('smo_local').find(item => item.code == card.smo);
  if (Boolean(smo)) {
    card.smo_okato = smo.okato;
    return okato(target, data, smo.okato);
  }
  target.value = '';
  card.smo_okato = null;
  return false;
}

const set_card_okato = (target, data, card) => okato(target, data, card.smo_okato);

// smo OKATO
export const set_smo_okato = (data, card) => {
  return e => {
    // it was had been set SMO 
    if (Boolean(card.smo))
      return set_okato_by_smo(e.target, data, card);

    if (!e.target.value) // empty
      if (Boolean(card.smo_okato))
        // it was had been set OKATO and no value (empty) in field yet
        return set_card_okato(e.target, data, card);
      else
        return false;

    // firstly set OKATO
    if (!e.target.value.includes(_Reg)) {
      const rg = e.target.value.split('.')[0];
      card.smo_okato = data.get('okato').find(item => item.region.toString() == rg)['okato'];
    }
    return false;
  };
};

export const getName = function (data, val, key, prop, name, text, first_word = false) {
  // data - optional data MAP
  // val - String foForm input tag value
  // key - String key in data MAP to check
  // prop - String table's column name to check
  // name - String name of table's column to output from
  // text - String text to output if item not find
  // first_word - Boolean out only first word from named column

  //console.log(key, val);
  if (!Boolean(val)) return m('span', " ");
  let item = Array.from(data.get(key)).find(it => it[prop].toString() == val);
  //console.log(item);
  if (item !== undefined) {
    if (!first_word) return m('span', `${item[name]} `);
    return m('span', `${item[name].split(' ')[0]} `);
  }
  return m('span.red', `${text} `);
};


export const toSaveCard = card => {

  // card number
  card.crd_num = trims(card.crd_num);
  if (!card.crd_num)
    return 'Пустой номер карты';

  //dost
  const dost = checkDost(card);
  if (Boolean(dost))
    return dost;

  // birth date
  const d0 = new Date('1900-01-01');
  let d1 = new Date(Date.now());
  //d1= new Date( d1.getFullYear() - 18, 1, 1); // 18 years or older
  d1 = new Date(d1.getFullYear() - 3, 1, 1); // 3 years or older 
  const d = new Date(card.birth_date);
  if (d < d0 || d > d1)
    return 'Некорректная дата рождения';

  // gender
  if (!Boolean(card.gender))
    return 'Укажите пол';

  // DUL
  if (!card.dul_serial && !card.dul_number)
    card.dul_type = null;
  if (Boolean(card.polis_type) && card.polis_type < 3 && !Boolean(card.dul_type))
    return 'Для этого типа полиса требуются полные данные ДУЛ';

  //polis type
  if (!card.polis_type)
    return 'Неизвестный тип полиса'

  // SMO
  if (!card.smo && !card.smo_okato)
    return 'Укажите либо СМО либо СМО ОКАТО';
  //if ( card.smo < _reg)
  //  card.smo += _reg;

  // city_g
  if (!card.city_g && Boolean(card.street_g))
    return 'Укажите город';

  // nulled empty int values 
  ['mo_att'].forEach(k => {
    if (!Boolean(card[k]))
      card[k] = null;
  });

  return false;
};
*/

const crdMain = function (vnode) {

  let { model, method } = vnode.attrs;
  const data = cardOpt.data;
  let card;
  if (model.card.length > 0) {
    card = model.card[0];
    card.old_card = card.crd_num;
  } else {
    card = {};
  }

  const fio = field => event => card[field] = upper(event.target.value);

  const ufms_test = v => {
    if (v.length < 5) return false;
    let u = parseInt(v);
    if (isNaN(u)) return false;
    return u;
  };
  const ufms_model = {
    ufms: 'ufms?code=eq.', order_by: 'code', list: null,
    headers: { Range: '0-1' }, uf: null
  };
  const set_ufms = e => {

    card.ufms = e.target.value;
    //console.log(e.target.value);
    let u = ufms_test(card.ufms);
    if (Boolean(u)) {
      ufms_model.url = `${ufms_model.ufms}${u}`;
      return moModel.getList(ufms_model).then(t => {
        if (t) {
          ufms_model.uf = ufms_model.list[0] ? ufms_model.list[0] : { code: null, name: 'Нет такого кода' };
          card.dul_org = ufms_model.uf.code ? ufms_model.uf.name : null;
        } else {
          ufms_model.uf = { code: null, name: 'Пустой ответ сервера' };
        }
      });
    }
    return false;
  };
  const ufms_show = () => {
    if (Boolean(ufms_model.error))
      return m('span.red', ufms_model.error);
    if (Boolean(ufms_model.uf)) {
      //console.log(ufms_model.uf);
      return m('span', { class: ufms_model.uf.code ? '' : 'red' }, ufms_model.uf.name);
    }
    return m('span', card.dul_org);
  };
  const cardSave = function (e) {
    e.preventDefault();
    // form send with forTabs onCreate function
    // above changed all processing will made here
    //console.log(card);
    model.save = toSaveCard(card);
    if (Boolean(model.save)) {
      vuDialog.open();
      return false;
    }
    //model.save= null;
    return moCard.saveCard(e, card, model, method).then(t =>
      m.route.set([clinicApi.cards])
    ).catch(err => {
      model.save = err;
      vuDialog.open();
    });
  };
  // gender
  const gnd = function (c) {
    return ['м', 'ж'].indexOf(c.gender.toLowerCase());
  };
  // set smo
  //const _set_smo = set_smo(card);
  const _set_smo = sel_smo(card);

  // smo OKATO
  const _set_smo_okato = set_smo_okato(data, card);
  // gets the name of option from Map by key
  const get_name = function (val, key, prop, name) {
    return getName(data, val, key, prop, name, 'Неизвестный код', false);
  };

  return {
    view: function () {
      //console.log(method);
      //let crd= Boolean (model.talons);
      //console.log(model.talons);
      return m('form.tcard.pure-form.pure-form-aligned',
        { style: "font-size: 1.2em;", id: "card", oncreate: forTabs, onsubmit: cardSave },
        [m('fieldset', [m('legend', "Карта пациента"),
        m(".pure-g", [
          m(".pure-u-7-24", [
            // --        // -- TODO check for card.card_type to process card number    
            m(".pure-control-group", cof('crd_num', card,
              { readonly: Boolean(model.talons.length) })),
            m(".pure-control-group", cof('fam', card, { onblur: fio('fam') })),
            m(".pure-control-group", cof('im', card, { onblur: fio('im') })),
            m('.pure-control-group', cof('ot', card, { onblur: fio('ot') })),
            m(".pure-control-group", cof('birth_date', card)),

            m(".pure-control-group", [
              m('label', { for: "gender" }, "Пол"),
              m('span', { style: "line-height: 1em;" }, "М"),
              m('input[name="gender"][type="radio"]', {
                style: "margin: 0 14px 0 7px;",
                value: 0,
                checked: card.gender ? gnd(card) === 0 : false,
                onchange: e => e.target.checked ? card.gender = 'м' : card.gender = 'ж'
              }),
              m('span', "Ж"),
              m('input[name="gender"][type="radio"]', {
                style: "margin: 0 0 0 7px;",
                value: 1,
                checked: card.gender ? gnd(card) === 1 : false,
                onchange: e => e.target.checked ? card.gender = 'ж' : card.gender = 'м'
              })
            ]),
            // --            
            m(".pure-control-group", [cof('dul_type', card),
            m('span.item_name', get_name(card.dul_type, 'dul', 'code', 'short_name'))
            ]),
            m(".pure-control-group", cof('dul_serial', card)),
            m(".pure-control-group", cof('dul_number', card)),
            m(".pure-control-group", cof('dul_date', card)),
            // UFMS
            m(".pure-control-group", [
              m('label[for=ufms]', 'УФМС'),
              m('input.pure-u-6-24[type=number][tabindex=10][name=ufms]', {
                value: card.ufms, onblur: set_ufms
              }),
            ]),
            m(".pure-control-group", cof('dul_org', card)),
            ufms_show()
          ]), // u-7-24
          // ============================			
          m(".pure-u-8-24", [m('legend', "ОМС"),
          m(".pure-control-group", cof('polis_ser', card)),
          m(".pure-control-group", [cof('polis_num', card),
          m('div.item_name', { style: "margin-left: 10em;" }, num_digits(card)),
          ]),
          /*
          m(".pure-control-group", [
            cof('smo', card, {onblur: _set_smo}),
            m('span.item_name',
              card.smo === null ? '':  get_name(card.smo + _reg, 'smo_local', 'code', 'short_name'))
          ]),
          */ //--
          m(".pure-control-group", [
            m('label', { for: "smo" }, "Страховщик"),
            m('select[name="smo"]',
              { tabindex: 12, value: card.smo, onchange: _set_smo }, [
              m('option[value=""]', ""),
              data.get('smo_local').map(s => m('option', { value: s.code }, s.short_name))
            ])
          ]),
          m(".pure-control-group", [
            m('label', { for: "smo_okato" }, "Регион"),
            m('input[name="smo_okato"][type="text"]', {
              oncreate: v => _set_smo_okato({ target: v.dom }),
              list: "okato",
              //value: card.smo_okato,
              tabindex: "13",
              onblur: _set_smo_okato
            }),
            //cof('smo_okato', card, {
            //  oncreate: v => set_smo_okato({target: v.dom}),
            //  onblur: set_smo_okato
            //}),
            //m('span.item_name', set_name(card.smo_okato, 'okato', 'okato', 'name', true) )
            m('datalist[id="okato"]', [
              data.get('okato').map(o => {
                let okato = `${o.region}. ${o.name.split(' ')[0]}`;
                return m('option', okato);
              })
            ])
          ]),
          // --          
          m(".pure-control-group", [
            cof('mo_att', card),
            m('.item_name',
              { style: "margin: 1em 0; padding-left: 1em" },
              get_name(card.mo_att, 'mo_local', 'scode', 'sname'))
          ]),
          ]), //-- 8-24
          // ============================         
          m(".pure-u-9-24", [m('legend', "Адрес"),
          m(".pure-control-group", cof('city_g', card)),
          m(".pure-control-group", cof('street_g', card)),
          m(".pure-control-group", [
            cof('home_g', card),
            cof('corp_g', card),
            cof('flat_g', card)
          ]),
          m(".pure-control-group", cof('phone_wrk', card)),
          m(".pure-control-group", cof('phone_hom', card))
          ]) //u-9-24
          // ============================
        ]) // pure-g
        ]), // fieldset
        // ============================
        m(".pure-g", [
          m(".pure-u-10-24 ", [
            m('span#card_message', '')
            //model.save ? model.save.ok ? model.save.msg : m('span.red', model.save.msg) : '')
          ]),
          m(".pure-u-14-24 ", [
            m('button.pure-button.pure-button-primary[type="submit"]',
              { //onfocus: setPale,
                //onclick: cardSave
                //tetabindex: "20",
              }, "Сохранить"),

            /*m('a.pure-button.', {
              href: [clinicApi.cards],
              oncreate: m.route.link,
              //onclick: (e) => m.route.set('/cards/0/'),
              style: "margin-left: 2em;"
            }, "Добавить новую")*/
          ])
        ]) // pure-g
        ]);// form
      //=========================
    } // view
  }; // return
}; //func

/*
const crdViz = function (vnode) {

  let crd;
  if (vnode.attrs.model.card.length > 0)
    crd = vnode.attrs.model.card[0].crd_num;
  else
    crd = '';
  //console.log(crd);
  let tal = vnode.attrs.model.talons ? vnode.attrs.model.talons : [];
  // tal_num int, open_date date, close_date date, purp smallint,
  //doc_spec int , doc_code int, family varchar,  ds1 varchar
  let tal_hdr = {
    tal_num: ['Номер талона', 'link'],
    open_date: ['Открыт'],
    close_date: ['Закрыт'],
    purp: ['Цель визита'],
    doc_spec: ['Спец'],
    doc_code: ['Спец код'],
    family: ['Доктор'],
    ds1: ['Диагноз']
  };

  return {

    listMap(s) {
      return m('tr', [
        Object.keys(tal_hdr).map(column => {
          let td = tal_hdr[column].length === 2 ?
            m('td.choice.blue', m(m.route.Link, {
              href: `${clinicApi.talons}/${s[column]}/${crd}`,
            }, s[column])) : m('td', s[column]);
          return td;
        })
      ]);
    },

    view() {
      //console.log('talPara view');
      return [m('.pure-g', m('.pure-u-1-1', m('table.pure-table.pure-table-bordered', [
        m('caption', 'Визиты в текущем году'),
        m('thead', [m('tr', [
          Object.keys(tal_hdr).map(column => m('th', tal_hdr[column][0])),
        ])
        ]),
        m('tbody', [tal.map(this.listMap)])
      ]))),
      m('.pure-g', m('.pure-u-1-3',
        m(m.route.Link, {
          selector: 'a.pure-button.pure-button-primary',
          href: `${[clinicApi.talon_add]}${crd}`,
          style: "float: right; margin-top: 2em; font-size: 1.3 em"
        }, "Добавить талон")
      )
      )
      ]; // return
    } // view
  }; // return
};
*/

export const vuCard = () => {
  //console.log(vnode.attrs);
  /*
  let tabs = ['Карта', 'Визиты', 'Дополнительно', 'Прикрепить', 'Удалить'];
  let conts = [crdMain, crdViz, crdExt, crdAtt, crdDel];
  const crd = parseInt(vnode.attrs.crd);
  const model = moCard.getModel();
  model.word = 'Карты';
  moCard.getCard(model, crd);
  const method = Number.isNaN(crd) || crd === 0 ? "POST" : "PATCH";
  */
  return {
    view(vnode) {
      console.log(vnode.attrs.crd);

      return states().error ? [m(".error", states().error)] :
        states().options && states().data ?
          m(tabsView) : m(vuLoading);
    }
  };
};
