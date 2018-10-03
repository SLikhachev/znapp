// clinic/view/specView.js

import { moModel } from '../model/moModel.js';
import { moSpec } from '../model/moSpec.js';
import { dialogView } from './dialogView';

const specForm = {
  
  item: null,
  method: "",
  word: "",
  model: null,
  
  oninit(vnode) {
    dialogView.model = moSpec;
    specForm.model = moSpec;
  },
    
  view(vnode) {
    let item = specForm.item,
    method = specForm.method,
    word = specForm.word;
    
    return m('form.pure-form.pure-form-aligned',
      { id: 'cvs',
        oncreate: dialogView.fvalid //, 
      },
      [
        m('fieldset', [
          m('.pure-control-group', [
            m('label[for=code]', 'Код'),
            m('input[id=code][type=text][name=code]', {
              style: 'width: 4em;',
              value: item ? item.id : '',
              readonly: item ? true : false,
              'data-validation': 'number',
              'data-validation-error-msg': 'целое число'
            } ),
            item ? m('span.pure-form-message-inline', 'Поле не редактируется.') : ''
          ]),
          m('.pure-control-group', [
            m('label[for=desc]', 'Специальность'),
            m('textarea[id=desc][name=desc][cols=40]', item ? item.name : '')
          ]),
          m('.pure-controls', [
            m('input[type=hidden][name=method]', {value: method} ),
            m('button.pure-button[type=submit]', word),
          ])
        ])
      ]);
  },
  
  getItem(id) {
    let list = this.model.list;
    return id ? _.find( list, (i) => { return i.id == id; } ) : null;
  }, 
    
  dput (id) {
    if ( id == "0" ) {
      specForm.method = "POST";
      specForm.word = "Добавить";
      specForm.item = null;
    } else {  
      specForm.method = "PATCH";
      specForm.word = "Изменить";
      specForm.item = specForm.getItem(id);
    }  
    dialogView.open();
    //specForm.types();
    return false;
  },
  
  ddel(id) {
    specForm.method = "DELETE";
    specForm.word = "Удалить";
    specForm.item = specForm.getItem(id);
    dialogView.open();
    //specForm.types()
    return false;
  },
  
  types() {
    console.log(this.item);
    console.log(this.method);
    console.log(this.word);
  }
  
}

const specView = {
  
  oninit () {
    this.model = moSpec;
    moModel.getList( moSpec );
  },

  oncreate() {
  },
  
  onupdate() {
    //docSpec.getList();
  },

  
  listMap (s) {
    return m('tr', [
      m('td.choice', {
          data: s.id,
          onclick: m.withAttr( "data", specForm.dput)
        }, s.id),
      m('td', s.name),
      m('td', 
        m('i.fa.fa-minus-circle.ddel', {
          data: s.id,
          onclick: m.withAttr( "data", specForm.ddel)
        })
      )
    ]);
  },

  panel() {
    return m('.panel', [
      m('div', m('span.dheader', "Коды врачебных специальностей") ),
      m('div', m('button.pure-button-cust', {
          value: 0,
          onclick: m.withAttr( "value", specForm.dput)
        }, 'Добавить'),
      ),
      m('div', m('form.pure-form', [
          m('input[type=text].pure-input', {placeholder: 'Поиск'}),
          m('select.ml10', [
            m('option[value=0]', 'На этой странице'),
            m('option[value=1]', 'В базе данных')
          ]),
          m('button.pure-button.ml10', 'Найти')
        ])
      )
    ]);

  },
  
  view (vnode) {
    return this.model.error ? [ m(".error", this.model.error) ] :
      this.model.list ? [
        specView.panel(),
        m('table.pure-table.pure-table-bordered', [
          m('thead', [
            m('tr', [
              m('th.sortable', {onclick: this.model.sort },
                ["Код", m('i.fa.fa-sort.pl10')] ),
              m('th', "Специальность"),
              m('th', "Удалить"),
            ])
          ]),
          m('tbody', [this.model.list.map( this.listMap ) ] )
        ]),

        m(dialogView,
          { header: "Коды врачебных специальностей",
            word: specForm.word
          }, m(specForm)
        )
        
      ] : m(".loading-icon", [
            m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
            m('span.sr-only', 'Loading...')
          ]);
  }
}

export { specView };