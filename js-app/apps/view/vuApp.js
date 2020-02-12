// src/apps/view/vuApp.js

import { vuMain } from './vuMain.js';
import { _schema } from '../model/moModel.js';

export const get_href= model=> {
  return m('a.pure-button', { 
    href: `${_schema('task')}${model.href}${model.file}`,
    style: "font-size: 1.2 em"}, model.file );
}

export const get_route= model=> {
  return m('a.pure-button', { 
    href: `${model.route}`,oncreate: m.route.Link,
    style: "font-size: 1.2 em"}, model.file );
}

const file = model=> [
    m('span.blue', {style: "font-size: 1.2em"}, "Результат, Файл : "),
    model.route ?
        get_route(model) :
          model.href ? get_href(model) :
              m('span.blue', {style: "font-size: 1.2em"}, model.file)
];

export const doTask= async function ( event, promise ) {
  event.preventDefault();
  let resp= document.getElementById('resp'); // taskResp - view with #resp dom
  //resp.classList.add('disable');
  resp.open= false;
  let res= await promise;
  //task.classList.remove('disable');
  resp.open= true;
  return res;
};

// func return chunk of hyper-script of form to post get task
export const taskResp= model=> m('details#resp',
  m('summary.legend', "Статус обработки"),
  model.error ? m('.error', model.error) :
    !model.message ? '': [
      m('h4', { class: model.done ? 'blue' : 'red'}, model.message),
      model.file ? file(model): ''
    ] 
  );
 

export const foMonth= data=> [m('label[for=month]', 'Месяц'),
  m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
    { value: data.month, onblur: e=> data.month = e.target.value }
  )];

export const vuTheader = {
  view (vnode) { return m(".pure-g",
    m(".pure-u-1-1.box-1", m('span.dheader', vnode.attrs.header ) )
  ); }
}


export const vuApp = {
  view: function(vnode) {
    return m('div', { style: "margin: 0 auto; padding-top: 5em; width: 50%;" },
      m('h1.blue', {style: "font-size: 3em;"}, vnode.attrs.text)
    );
  }
}

//export const vuView = view=> m(vuMain, spravMenu, view);
export const vuView = (appMenu, view)=> m(vuMain, appMenu, view);

export const vuLoading = {
  view() { return m(".loading-icon", 
    m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
    m('span.sr-only', 'Loading...')
  );
}};


export const taskResponse= (model, href=null) => {
  return model.error ? m('.error', model.error) :
    model.message ? m('.legend', ["Статус обработки",
      model.done ? m('div', [
        m('h4.blue', model.message),
        m('span.blue', {style: "font-size: 1.2em"}, "Файл: "),
        href ? m('a.pure-button', {href: href, style: "font-size: 1.2 em"}, model.file ):
          ('span', model.file)
      ]) : m('div', m('h4.red', model.message))
    ]) : '';
}
  