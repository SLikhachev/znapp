
// src/sparv/struct/spravStruct.js
/**
    defStruct object defines the set of the representation of some entities
    used by app for states, models and views generation.
    Every entity have unique name as the ref of the object to present this entity.
    Every entity is an object with the set of attrs (properties) that may be absent
    and that case are used defaults.
    Struct of props:

const defStruct = {
  // entity's unique name
  eName: {
    // special object for prefetch data before rendering
    // includes ONLY rest object same as REST below 
    count: { {rest} }
    
    // rest attr present the api interface for the restful db server
    // if absent then api endpoint is a `eName`, and default params
    // will be params as follow
    
    rest: {

      // String RESTful api url (table name). Def: `eName`
      url: tablename || eName,

      // String Request method Def: 'GET'
      method: 'POST' || 'GET',

      // Object Request headers. Def: undef
      headers: Object || undefined,

      // Object present the query params. Def: { order: 'id.asc' }
      params: Object || { order: 'id.asc' } ,

      // Array(String) for local stream request body definition 
      // as for additional request via RPC call
      body: Array(String) || undef

      // Array(String) of entity's objects to query in option with this one
      // every name in array must be present in this `defStruct`
      // Def: undef
      options: Array('eName1', 'eName2') || undefined
    },
    
    // this object present fetch form for large DB table to fetch list of items
    fetch: {
      // every prop is object present the form field and construct request
      // as for STRUCT props in ITEM object
      // column/field name
      code: {
        //label: ["Код диагноза МКБ-10"],
        tag: ['.input-find.pure-u-2-4', 'required'],
        attrs: { placeholder: "Код диагноза МКБ-10" },
        
        // params for construct field request 
        // ( used by fetchParams func from moList module)
        params: 'ilike.*' 
      },
    },
    
    // task attr present app server task api
    task: {
      // String POST request url for given task
      post: 'url',
      // String GET request url for given task
      get: 'url',
      // task form definition
      form: {
        legend: "Расчет объемов",
        month: _month,
        test: _test
      },
      // set of form buttons
      buttons: {
        butt1: {
          label: ["Обновить"], type: 'submit', tag: ['.pure-button'],
          attrs: { style: 'font-size: 1.2em', method: 'POST' }
        },
        butt2: {
          label: ["Отчет"], type: 'submit',
          tag: ['.pure-button.pure-button-primary'],
          attrs: { style: "font-size: 1.2em; margin-left: 2em;", method: 'GET' }
        }
      }

    },

    // Object item define the presentation of the entity
    item: {

      // Object present of the table and form for entity presentation
      struct: {

        // Object or Array. Name of the entity prop (column name of the DB)
        // 1st var: Array(String) ["Name", 'sort']
        // Name - name of the prop table column and text for prop form's `lable` tag
        // 'sort' if any column will be sortable, may be absent
        // Def: undef (also [] is undef)
        field1: ["column1", 'sort'], // ["column1"]

        // 2nd var: Object
        // Object present the table and form presentation of entity prop
        field2: {

          // Array(String) ["Name", 'sort'], as above for field1
          th: ["Код", 'sort'],

          // Array(String) form label presentation [labeltext, labelclass]
          // Def: th[0] or null
          label: ['name', 'klass'],

          // String type of the form's input tag
          // Def: 'text'
          type: 'number',

          // Array(String) form input tag presentation [tagclass, opt1, opt2, ...]
          // Def: undef
          tag: ['.lcode', 'required'],

          // Object present the form's input tag aux attrs
          // Def: undef
          attrs: { placeholder: "Код диагноза МКБ-10" }
        },
      },

      // Number attr for 'search form' in sheet table and def how many cols must
      // be used for search some text in table cols. Def: 2
      find: 0,

      // String defines as the entity will be present in side bar nav
      name: 'itemName',

      // Array(String) present the allowed action with object item
      // Def: undef, no actions allowed
      editable: ['add', 'edit', 'del'],

      // Array(String), fields' names which allowed to edit
      // Def: undef, all fields editable exclude 'id'
      edit_fields: ['field1', `field2`],

      // String primary key column name for sql model table
      // Def: 'id'
      pk: 'pk',

      // Array(String order of fields in entity form, tabindex
      // is Array index of current field
      form: ['field2', 'field1']
    }
  }
}


// this Object present of the nav paths for above def
const structNav = {
  // String of the current nav
  // item will be correspond with the defStruct eNames
  path: '/local/:item',

  // horizontal nav bar button\item name
  name: "Локальные",

  // this defStruct ref
  def: spravLocal,

  // eNames will be rendered on the nav sidebar in this order
  items: ['doctor', 'sp_para', 'mo_local', 'smo_local'],
  router: 'router'
};
*/

import { disp } from '../appApi';
import { _month } from '../model/moModel';
import { vuDialog } from '../view/vuDialog';

// change list item in Dialog window 
const onchange = (method, word) => e => {
  disp(['change', method, word, e.target.getAttribute('data')]);
  vuDialog.open();
};
export const onedit = onchange('PATCH', "Изменить");
export const ondelet = onchange('DELETE', "Удалить");
export const onadd = e => {
  e.preventDefault();
  disp(['add']);
  vuDialog.open();
};

export const editItem = (row, key, pk) => ([
  row[key],
  '.choice.blue',
  { data: row[pk], onclick: onedit }
]);

export const deletItem = (row, key, pk) => m('i.fa.fa-minus-circle.choice.red',
  { data: row[pk], onclick: ondelet });

export const linkItem = (row, key, pk) => ([
  m(m.route.Link, { href: `${m.route.get()}/${row[pk]}` }, row[key]),
  '.choice.blue',
]);

export const get_month = (data, key) => [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь"
][data[key] - 1];

export const $upper = text => ({ placeholder: text, style: 'text-transform: uppercase' });
export const $place = text => ({ placeholder: text, style: "font-size: 1.2em", });

export const $month = {
  label: ["Месяц"], type: 'month', tag: ['', 'required'],
  attrs: { 'data-initial': _month() }
};

export const $button_attrs = {
  style: 'font-size: 1.2em; margin-top: 0.5em', method: 'POST'
}

export const $checkbox = text => ({
  label: [text.toString(), '.pure-checkbox'],
  type: "checkbox",
  view: 'controls'
})

export const $button = text => ({
  label: [text.toString()], type: 'submit',
  tag: ['.pure-button.pure-button-primary'],
  attrs: $button_attrs
});

const packType = {
  1: "Амбулаторный",
  2: "Онкология",
  3: "Дневной стационар",
  4: "Профосмотр",
  5: "Инокраевые",
  6: "Тарифы ПМУ"
}

export const smoId = {
  '': "ФОМС",
  '25016': "СВ Прим",
  '25011': "ВС Альянс"
}

export const $pack = {
  label: ["Тип счета"],
  tag: ['.ml10'],
  type: 'select',
  options: packType,
  attrs: { 'data-initial': 1 }
}

export const $smo = {
  label: ["СМО"],
  tag: ['.ml10'],
  type: 'select',
  options: smoId,
  attrs: { 'data-initial': '' }
}



// The default struct Object to render table, form if
// defStruct.eName.item.struct not present
export const idName = {
  id: { th: ["Код", 'sort'], type: 'number', tag: ['.lcode', 'readonly'] },
  name: { th: ["Описаение", 'sort'], tag: ['', 'required'] }
}

