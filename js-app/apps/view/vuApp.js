// src/apps/view/vuApp.js

//import { vuMain } from './vuMain';
import { _schema } from '../model/moModel';

const href = state => state.suite[state.unit].task.get || '';

export const _get_href = state => {
  return m('a.pure-button', {
    href: `${_schema('task')}${href(state)}${state.file}`,
    style: "font-size: 1.2 em"
  }, state.file);
}

export const get_href = model => {
  return m('a.pure-button', {
    href: `${_schema('task')}${href}${model.file}`,
    style: "font-size: 1.2 em"
  }, model.file);
}

export const get_route = model => {
  return m('a.pure-button', {
    href: `${model.route}`, oncreate: m.route.Link,
    style: "font-size: 1.2 em"
  }, model.file);
}

const file = model => [
  m('span.blue', { style: "font-size: 1.2em" }, "Результат, Файл : "),
  model.route ?
    get_route(model) :
    model.href ? get_href(model) :
      m('span.blue', { style: "font-size: 1.2em" }, model.file)
];

const _file = state => [
  m('span.blue', { style: "font-size: 1.2em" }, "Результат, Файл : "),
  href(state) ? _get_href(state) :
    m('span.blue', { style: "font-size: 1.2em" }, state.file)
];

export const doTask = async function (event, promise) {
  event.preventDefault();
  let resp = document.getElementById('resp'); // taskResp - view with #resp dom
  //resp.classList.add('disable');
  resp.open = false;
  let res = await promise;
  //task.classList.remove('disable');
  resp.open = true;
  return res;
};
/*
// func return chunk of hyper-script of form to post get task
export const taskResp = model => m('details#resp',
  m('summary.legend', "Статус обработки"),
  model.error ? m('.error', model.error) :
    !model.message ? '' : [
      m('h4', { class: model.done ? 'blue' : 'red' }, model.message),
      model.file ? file(model) : ''
    ]
);
*/
// func return chunk of hyper-script of form to post get task
export const taskResp = state => m('details#resp',
  m('summary.legend', "Статус обработки"),
  state.error ? m('.error', state.error) :
    !state.message ? '' : [
      m('h4', { class: state.done ? 'blue' : 'red' }, state.message),
      state.file ? _file(state) : ''
    ]
);



export const foMonth = data => [m('label[for=month]', 'Месяц'),
m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
  { value: data.month, onblur: e => data.month = e.target.value }
)];


export const vuTheader = {
  header: '',
  view(vnode) {
    this.header = vnode.attrs.itdef.header ||
      vnode.attrs.itdef.name ||
      'Нет заголовка в определении';
    return m(".pure-g",
      m(".pure-u-1-1.box-1", m('span.dheader', this.header))
    );
  }
}

export const vuLoading = {
  view() {
    return m(".loading-icon",
      m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
      m('span.sr-only', 'Loading...')
    );
  }
};


export const taskResponse = (model, href = null) => {
  return model.error ? m('.error', model.error) :
    model.message ? m('.legend', ["Статус обработки",
      model.done ? m('div', [
        m('h4.blue', model.message),
        m('span.blue', { style: "font-size: 1.2em" }, "Файл: "),
        href ? m('a.pure-button', { href: href, style: "font-size: 1.2 em" }, model.file) :
          ('span', model.file)
      ]) : m('div', m('h4.red', model.message))
    ]) : '';
}
