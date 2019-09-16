// src/apps/view/vuMain.js

//import { moName, appMenu } from '../apiConf.js';
//import { appMenu } from '../apiConf.js';

//const appMenu = JSON.parse( window.localStorage.getItem('apps') );

//const moName = document.getElementsByTagName('title')[0].innerHTML;

const vuSidebar = {
  view: function(vnode) {
    let menu = vnode.attrs.subAppMenu[vnode.attrs.subApp].items,
    mroot = vnode.attrs.subAppMenu[vnode.attrs.subApp].nref[0],
    mname = vnode.attrs.subAppMenu[vnode.attrs.subApp].nref[1];
    //console.log(menu);
    return [
      m('span.dheader.blue', mname),
      menu.map( item => {
        return m('a.side-menu.blue', {
            //href: mroot + item[0], // here only last path fragment
            href: item[0], // here all path 
            //onclick: m.withAttr("href", vuSidebar.subRoute)
          },
          item[1] );
      })
    ];
  },
  subRoute: function(route) {
    //let rs = route.split("/"); // #!/catalog/doc-list/ => ['#!', 'catalog', 'doc-list', '']
    //console.log(rs);
  }
};

const vuMain = {
  
  moName: null,
  appsBar: null,
  app: null,
  subApp: null,
  
  oninit: function (vnode) {
    //console.log(vnode.attrs.subAppMenu)
    vuMain.moName = document.getElementsByTagName('title')[0].innerHTML;
    vuMain.app = document.body.id;
    vuMain.appsBar = JSON.parse( window.localStorage.getItem('apps') );
    //console.log('-- on init  --', vuMain.appsBar);
    try {
      let mr =  m.route.get().split("/")[1];
      vuMain.subApp = mr ? mr : null;
      vuMain.sideBar(vuMain.subApp, vnode.attrs.subAppMenu);
    } catch (e) {
      console.log( e );
      vuMain.subApp = null;
    }
    //console.log( 'on init -- ', this.subApp );
  },

  onbeforeupdate: function (vnode) {
    //vuMain.app = document.body.id;
    try {
      let mr =  m.route.get().split("/")[1];
      vuMain.subApp = mr ? mr : null;
      vuMain.sideBar(vuMain.subApp, vnode.attrs.subAppMenu);
    } catch (e) {
      console.log( e );
      vuMain.subApp = null;
    }
    //console.log( 'on before update -- ', this.subApp );
    return true;
  },
  
  oncreate: function (vnode) {
    $(window).scroll( () => {
      if ($(window).scrollTop() > 300) {
        $('.but__up').fadeIn();
      } else {
        $('.but__up').fadeOut();
      }
    });
    $('.but__up').click( () => {
      $("html, body").animate({ scrollTop: 0 }, 600);
      return false;
    });
    //console.log( $(window).localStorage); //.getItem('pg_rest') );
  },

  view: function(vnode) {
    //console.log(' view --', vuMain.appsBar);
    return [
      m('#header',
        m('#menus', [
          m('.apps-menu.pure-menu.pure-menu-horizontal', [
            m('span.pure-menu-heading', vuMain.moName),
            m('ul.pure-menu-list', [
              Object.keys(vuMain.appsBar).map( (appName) => {
                let s = appName == vuMain.app ? ".pure-menu-selected":"",
                li = "li.pure-menu-item" + s;
                //console.log(appName, vuMain.appsBar[appName].href);
                return m(li,
                  m('a.pure-menu-link', { href: vuMain.appsBar[appName].href }, vuMain.appsBar[appName].name)
                );
              })
            ]),
            m('ul.pure-menu-list.right', [
              m("li.pure-menu-item", m('a.pure-menu-link',
              {href: '/logout/?next=/'}, "Выход") )
            ])
          ]),
          m('.application-menu.pure-menu.pure-menu-horizontal', [
            m('a.pure-menu-heading', { href: "" }, m('i.fa.fa-bars') ), //buter
            m('ul.pure-menu-list', [
              Object.keys(vnode.attrs.subAppMenu).map( (subApp) => {
                //console.log(' view --', vuMain.subApp);
                //let submenu = appMenu[vuMain.app].menu[subApp];
                let aclass = vuMain.subApp === subApp ? '.pointed' : '',
                li_a = "a.pure-menu-link"+aclass; 
                return m('li.pure-menu-item.pure-menu-allow-hover',
                  m(li_a,
                    { href: vnode.attrs.subAppMenu[subApp].nref[0],
                      //data: subApp,
                      //onclick: m.withAttr("data", vuMain.sideBar)
                    }, vnode.attrs.subAppMenu[subApp].nref[1])
                );
              })
            ])
          ])
        ])
      ),
      m('#content.pure-g',
        vuMain.subApp !== null ? [
          m('#side-bar.pure-u-1-8', m(vuSidebar, {
              app: vuMain.app,
              subApp: vuMain.subApp,
              subAppMenu: vnode.attrs.subAppMenu
          } ) ),
          m('#page.pure-u-7-8', vnode.children)
        ] : m('#page.pure-u-1-1', vnode.children)
      ),
      m('#bup.but__up. hvr')
    ];
  }, 
  // state of sideBar
  sideBar: function(subApp, subAppMenu) {
    if (subApp === null) return true;
    if ( subAppMenu[subApp].hasOwnProperty("items") ) {
      if (subAppMenu[subApp].items.length === 0 )
        vuMain.subApp = null;
      else
        vuMain.subApp = subApp;
    } else {
       vuMain.subApp = null;
    }
    //console.log(s);
    
    return true;
  }
};

// src/apps/view/vuDialog.js

// src/apps/model/moModel.js

//const pg_rest = window.localStorage.getItem('pg_rest'); //postgest schemaRest;
//console.log(schema);

const errMsg= function(error){
  //console.log(error);
  //let e = JSON.parse(error.message);
  let e= error.response;
  //let m= e.details ? e.details : e.message ? e.message: error;
  let m= e.message ? e.message : error;
  console.log(m);
  return m;
};

// return posgrest url if pg_rest else task url
const _schema= type=> {
  if (type === 'task')
    return window.localStorage.getItem('task_rest');
  return window.localStorage.getItem('pg_rest');
};

// src/apps/view/vuApp.js

const get_href= model=> {
  return m('a.pure-button', { 
    href: `${_schema('task')}${model.href}${model.file}`,
    style: "font-size: 1.2 em"}, model.file );
};

const get_route= model=> {
  return m('a.pure-button', { 
    href: `${model.route}`,oncreate: m.route.link,
    style: "font-size: 1.2 em"}, model.file );
};
           
// func return chunk of hyper-script of form to post get task
const foResp= model=> m('#resp',
  model.error ? m('.error', model.error) :
    model.message ? m('.legend', ["Статус обработки",
      model.done ? m('div', [
        m('h4.blue', model.message),
        m('span.blue', {style: "font-size: 1.2em"}, "Результат, Файл : "),
        model.route ? get_route(model) : model.href ? get_href(model) :
          m('span.blue', {style: "font-size: 1.2em"}, model.file)
      ]) : m('div', m('h4.blue', model.message))
    ]) : ''
  );

const vuTheader$1 = {
  view (vnode) {
    return m(".pure-g",
      m(".pure-u-1-1.box-1",
        m('span.dheader', vnode.attrs.header )
      )
    );
  }
};

const vuApp = {
  view: function(vnode) {
    return m('div', {
        style: "margin: 0 auto; padding-top: 5em; width: 50%;"
      },
      m('h1.blue', {style: "font-size: 3em;"}, vnode.attrs.text)
    );
  }
};

const vuView = function(appMenu, view) {
  return m(vuMain, appMenu, view);
};

const vuLoading = {
  view() { 
    return m(".loading-icon", 
      m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
      m('span.sr-only', 'Loading...')
    );
  }
};

// src/reestr/reestrApi.js

const taskReestr = {
    // POST request for calculat, GET for download files
    impo_dbf: {
        post_url: "/reestr/import/dbf", //POST date, upload file
    },
    pack: { post_url: "/reestr/xml/pack" },
    vmx: {
      post_url: "/reestr/xml/vmx",
      get_url: "/utils/file/reestr/vmx/", //GET report file  
    },
    invoice: {
      post_url: "/reestr/inv/impex",
      get_url: "/utils/file/reestr/inv/" //GET reestr file  
    },

};

const restReestr = {
    vmx: { url:"vmx_errors", params: { limit: 50 } }
};
   

const reestrApi = {
    root: "/",
    
    pack: "/pack",
    pack_xml: "/pack/xml",
    
    vmxl: "/vmxl",
    vmxl_imp: "/vmxl/imp",
    vmxl_last: "/vmxl/last",
    
    invoice: "/invoice",
    inv_impex: "/invoice/impex",
    inv_calc: "/invoice/calc",
    
    impo: "/impo",
    impo_dbf: "/impo/dbf",

};

const reestrMenu = { subAppMenu: {
  
  pack: {
    nref: [`#!${reestrApi.pack}`, "Пакеты"],
    items: [
      [`#!${reestrApi.pack_xml}`, "Сформировать"],
    ]
  },
  vmxl: {
    nref: [`#!${reestrApi.vmxl}`, "Ошибки"],
    items: [
      [`#!${reestrApi.vmxl_imp}`, "Импорт ошибок"],
      [`#!${reestrApi.vmxl_last}`, "Показать последние"],
    ]
  },
  
  invoice: {
    nref: [`#!${reestrApi.invoice}`, "Счета"],
    items: [
      [`#!${reestrApi.inv_impex}`, "Реестр в СМО"],
      [`#!${reestrApi.inv_calc}`, "Рассчеты"],
    ]
  },
  impo: {
    nref: [`#!${reestrApi.impo}`, "Импорт"],
    items: [
      [`#!${reestrApi.impo_dbf}`, "Файлы реестров (DBF)"],
    ]
  }
}
};

const _month$1= () => {
    let d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
    m= m < 10 ? `0${m}`: `${m}`;
    return `${y}-${m}`;
  };

const _schema$1= type=> {
  if (type === 'task')
    return window.localStorage.getItem('task_rest');
  return window.localStorage.getItem('pg_rest');
};

const moModel$1 = {
  
  getModel( url=null, order_by=null ) {
    //console.log(url);
    const model= {
      url: url,
      order_by: order_by,
      list: null,
      error: null,
      message: null,
      detail: null,
      file: null,
      done: false
    };  
    model.sort= e=> { e.preventDefault(); return false;};
    return model;
  },
  
  getList (schema, model, params=null, method='GET') {
    // filed - sort by with SELECT, default 'id' field
    //let schema = window.localStorage.getItem('pg_rest');
    //let id = model.field ? model.field : 'id',
    //order = `?order=${id}.asc`;
    let get_param= params ? '?' + m.buildQueryString(params) : '';
    let url= `${schema}${model.url}${get_param}`;
    //console.log(url);
    return m.request({
      url: url,
      method: method,
    }).then(function(res) {
      model.list = res; // list of objects
      model.order = true;
    }).catch(function(e) {
      model.error = errMsg(e);
      console.log(model.error);
    });
  },

  // simple CORS request with data as multipart form data and POST/GET
  // data have been got from FORM object
  formSubmit(event, schema, model, method) {
    let form= event.target;
    form.classList.add('disable');
    //let finput = form.elements.namedItem('file'),
    //file = finput.files[0],
    let data = new FormData(form);
    let get_param = '';
    if (method == "GET") {
      let get_data = {};
      data.forEach( (v, k) => { get_data[k] = v; } );
      get_param = '?' + m.buildQueryString(get_data);
    }
    const url= `${schema}${model.url}${get_param}`;
    //console.log(get_param);
    //data.append("test", form.elements.namedItem('test'));
    //data.append("month", form.elements.namedItem('month'));
    //data.append("file", file);
    //console.log(data.getAll('test')[0], data.getAll('month')[0]);
    //data.append("")
    return m.request({
      url: url,
      method: method,
      body: data,
      timeout: 0
    }).then((res) => {
      model.file = res.file ? res.file: null;
      model.message = res.message;
      model.detail = res.detail ? res.detail: null;
      model.done = res.done ? res.done : null;
      //console.log(` msg: ${model.message}, file: ${model.file}, done: ${model.done}`);
      form.classList.remove('disable');
      return true;
    }).catch((err) => {
      model.error = errMsg(e);
      console.log(model.error);
      form.classList.remove('disable');
      return false;
    });
  },
  
  // submit with simple / preflight CORS request   
  doSubmit(event, schema, cors, model, data, method) {
    event.target.parentNode.classList.add('disable');
    //console.log(data);
    const url= `${schema}${model.url}`;
    //console.log(upurl);
    let fdata;
    if ( cors == 'simple' ) {
      fdata= new FormData();
      for (let k of Object.keys(data))
        fdata.append( k, data[k] );
    } else {
      fdata= data;
    }
    return m.request({
      url: url,
      method: method,
      body: fdata,
      timeout: 0
    }).then((res) => {
      model.file = res.file ? res.file: null;
      model.message = res.message;
      model.detail = res.detail ? res.detail: null;
      model.done = res.done ? res.done : null;
      event.target.parentNode.classList.remove('disable');
      return true;
    }).catch((err) => {
      model.error = errMsg(e);
      console.log(model.error);
      event.target.parentNode.classList.remove('disable');
      return false;
    });
  }

};

// src/reestr/view/vuReestr.js
//import { taskReestr } from '../reestrApi.js';
//import { task_rest, moModel } from '../model/moModel.js';

const reestrForm = function(vnode) {
  
  const model= vnode.attrs.model;
  const data= { month: _month$1(), pack: 1 };
  const schema= _schema$1('task');  
  
  const on_submit = event=> {
    //console.log(data);
    event.preventDefault();
    //console.log(data);
    //return false;
    return moModel$1.doSubmit(event, schema, 'simple', model, data, "POST");
  };
  
  return {
    view() {
      return m('.pure-g', [
        m('.pure-u-1-3', [
          m('form.pure-form.pure-form-stacked', { onsubmit: on_submit }, [
            m('fieldset', [
              m('legend', "Параметры реестра"),
              m('.pure-control-group', [
                m('label[for=month]', 'Месяц'),
                m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                  { value: data.month, onblur: e=> data.month = e.target.value }
                )
              ]),
              m('.pure-control-group', [
                m('label[for=pack]', 'Номер пакета'),
                m('input.fname[id="pack"][type="number"][min=1][name="pack"]',
                  { value: data.pack, onblur: e=> data.pack = e.target.value }
                )
              ]),
              m('.pure-controls', [
                m('label.pure-checkbox[for="sent"]', [ 
                  m('input[id="sent"][type="checkbox"][name="sent"]',
                    { value: data.sent, onblur: e=> data.sent = e.target.value }
                  ),
                  m('span', { style: "padding: 0px 5px 3px;"}, "Не отправлять принятые")
                ])
              ]),
              m('.pure-controls', [
                m('button.pure-button pure-button-primary[type="submit"]',
                  { style: 'margin-top: 0.5em'}, "Сформировать")
              ])  
            ])
          ])
        ]),
        m('.pure-u-2-3', [
          model.error ? m('.error', model.error) :
            model.message ? m('.legend', ["Статус обработки", 
              m('div', [

                m('h4.blue', model.message),
                m('span.blue', {style: "font-size: 1.2em"}, "Файл пакета: ", model.file ),
                model.detail ? m('h4.red', model.detail) : '',

              ])
            ]) : m('div')
        ])
      ]);
    }
  };
};


// clojure
const vuReestr = function (vnode) {
  
  return {
    view () {
      return [
        m(vuTheader$1, { header: vnode.attrs.header } ),
        m(reestrForm, { model: vnode.attrs.model } )
      ];
    }    
        
  }; //return this object
};

// src/reestr/router/roImport.js

const roReestr = {
  [reestrApi.pack]: {
    render: function() {
      return vuView(reestrMenu, m(vuApp, { text: "Пакеты ФОМС" } ) );
    }
  },
  [reestrApi.pack_xml]: {
    render: function() {
      let view = m(vuReestr, {
        header: "Формируем XML пакет для ФОМС",
        model: moModel$1.getModel( taskReestr.pack.post_url )
        
      });
      return vuView(reestrMenu, view);
    }
  },
};

// src/report/model/moStruct.js

// This object define how we shall render the particular table

const moStruct = function() {
  // every DBtable has id column is not showed in html table header
  // Object.record:: Array(Name::String, Sortable::Bool (if any))
  // record is String - name of table column -- property of DB record object
  // every html table has last column to delete record purpose

  const get_month = function (month) {
    return [
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
    ][ month-1 ];
  };
   
   return {
  // local 
    p146_report: {
      this_month: ["Месяц", get_month],    
      pol_ambul_visits: ["Амбул визиты"],
      pol_stac_visits: ["Стац визиты"],
      pol_stom_uet: ["Стом УЕТ"],
      pol_ambul_persons: ["Амбул персон"],
      pol_stac_persons: ["Стац персон"],
      pol_stom_persons: ["Стом персон"],
      travma_ambul_visits: ["Травма визиты"],
      travma_ambul_persons: ["Травма персон"],
    },
    vmx_last: {
      tal_num: ['Талон'],
      crd_num: ['Карта'],
      fam: ['Фамилия'],
      open_date: ['Открыт'],
      close_date: ['Закрыт'],
      error: ['Номер ошибки'],
      cmt: ['Текст ошибки']
    }
  };
};

const file_field= (data) => {
  return [
    m('input.inputfile[type="file"][name="file"][id="file"]',
      {'data-multiple-caption': "{count} files selected",
      'multiple':false, onblur: e=> data.file= e.target.value.split( '\\' ).pop() }
    ),
    m('label[for="file"]', m('strong', "Выбрать файл"))
  ];
};

const form_file_dom= vnode=>  {
  let inputs = vnode.dom.querySelectorAll('.inputfile');
  Array.prototype.forEach.call( inputs, input=> {
    let label	 = input.nextElementSibling, labelVal = label.innerHTML;
    input.addEventListener( 'change', e=> {
      let fileName = '', el= e.target;
      //console.log(el.files, el.value);
      if( el.files && el.files.length > 1 )
        fileName = ( el.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', el.files.length );
      else
        fileName = el.value.split( '\\' ).pop();
      
      if( fileName )
        label.querySelector( 'strong' ).innerHTML = fileName;
      else
        label.innerHTML = labelVal;
    });
  });
};

// src/reestr/view/vuReestr.js
//import { taskReestr } from '../reestrApi.js';
//import { task_rest, moModel } from '../model/moModel.js';

const errorsForm = function(vnode) {
  
  const model= vnode.attrs.model;
  const data= {};
  const schema= _schema$1('task');  
  const get_type= el=> el.options[ el.selectedIndex].value;
  
  const on_submit = function (event) {
    event.preventDefault();
    return moModel$1.formSubmit(event, schema, model, "POST");
  };
  
  return {
    view() {
      return m('.pure-g', [
        m('.pure-u-1-3', [
          m('form.pure-form.pure-form-stacked',
            { onsubmit: on_submit, oncreate: form_file_dom }, [
            m('fieldset', [
              m('legend', "Тип файла ошибок"),
              m('.pure-control-group', file_field(data) ),
              m('.pure-control-group', [
                m('label[for=type]', 'Тип протокола'),
                m('select.ml10[name=type]',
                  { onblur: e=> data.type= get_type(e.target) }, [
                  m('option[value=1][selected]', 'Амбулаторный'),
                  m('option[value=2]', 'Онкология')
                ]),
              ]),
              m('.pure-controls', [
                m('button.pure-button pure-button-primary[type="submit"]',
                  { style: 'margin-top: 0.5em'}, "Импорт")
              ])  
            ])
          ])
        ]),
        m('.pure-u-2-3', [
          //m('progress[value=50][max=100]'),
          model.error ? m('.error', model.error) :
            model.message ? m('.legend', ["Статус обработки", 
              m('div', [

                m('h4.blue', model.message),
                m('span.blue', {style: "font-size: 1.2em"}, "Файл пакета: ", model.file ),
                model.detail ? m('h4.red', model.detail) : '',

              ])
            ]) : m('div')
        ])
      ]);
    }
  };
};


// clojure
const vuVmxlimp = function (vnode) {
  
  return {
    view () {
      return [
        m(vuTheader$1, { header: vnode.attrs.header } ),
        m(errorsForm, { model: vnode.attrs.model } )
      ];
    }    
        
  }; //return this object
};

const clinicApi = {
    root: "/",
    cards: "/cards",
    card_id: "/cards/:crd",
    card_add:"/cards/0", // maybe /cards/0
    talons: "/talons",
    talon_id: "/talons/:tal/:crd",
    talon_add: "/talons/0/" //crd adds by click event
};

// src/report/view/vuDataSheet.js


const vuDataSheet = function (vnode) {
  
  //getList (schema, model, params=null, method='GET') {
  let { model, struct, header, params } = vnode.attrs;
  
  moModel$1.getList( _schema$1('pg_rest'), model, params);
  
  return {

  listMap (s) {
    //let id = s.code + ' ' + s.spec;
    let first = true;
    return m('tr', [
      Object.keys(struct).map( (column) => {
        let field = struct[column],
        value = field[1] ? field[1]( s[column] ) : s[column]; // 2nd el is function if any
        let td = first ? m('td.blue', {
        }, value) : m('td', value);
        first = false;
        return td;
      })
    ]);
  },

  view () {
    
    //return m(tableView, {model: this.model , header: this.header }, [
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        m(vuTheader$1, { header: header} ),
        this.form ? m(this.form, {model:  model}) : '',
        m('table.pure-table.pure-table-bordered[id=find_table]', [
          m('thead', [
            m('tr', [
              Object.keys(struct).map( (column) => {
                let field = struct[column];
                return field[2] ? m('th.sortable', // 3rd el sortable bool
                  { data: column, onclick: e => model.sort },
                  [field[0], m('i.fa.fa-sort.pl10')]
                  ) : m('th', field[0]);
              }),
            ])
          ]),
          m('tbody', [model.list.map( this.listMap )] )
        ]),
      ] : m(vuLoading);
  }
  }; //return this object
};

// src/report/view/vuVmxlast.js


const Form = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  const md= { url: taskReestr.vmx.post_url, href: taskReestr.vmx.get_url };
  const upload= event=> {
    //console.log('report');
    event.preventDefault();
    let resp= document.getElementById('resp');
    resp.setAttribute('display', 'none');
    return moModel$1.formSubmit(event, _schema('task'), md, "GET").then((t) => {
      //console.log(r);
      resp.setAttribute('display', 'block');
    });
  };
  
  return {
  
    view() {
      //console.log(model);
      return [ m('.pure-g', { style: "margin-bottom: 1.3em;" }, [
        m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked', {onsubmit: upload},
          m('fieldset', [
            m('legend', "Выгрузить в CSV файл"),
            m('.pure-controls', [
              m('button.pure-button.pure-button-primary[type="submit"]',
                { style: "font-size: 1.2em; margin-left: 2em;",
                  //onclick: upload
                }, "Выгрузить")
            ])
          ])
        )
      ]),
      m('.pure-u-2-3', foResp(md) )
    ])
  ];
  }
};  
};

const vuVmxlast = function (vnode) {
  //card_id: "/cards/:crd",
  const card_id= clinicApi.card_id.split(':')[0];
  //talon_id: "/talons/:tal/:crd",
  const talon_id= clinicApi.talon_id.split(':')[0];
  
  const { struct }= vnode.attrs;
  let clinic= location.href.split('/').slice(0,3);
  clinic[1]= '/';
  clinic.push('clinic/#!');
  const root= clinic.join('/');
  //console.log(root);
  const link= (val, ref)=> m('a', {href: `${root}${ref}`, target: '_blank' }, val);

  const fref= (s, f)=> {
    if (f == 'crd_num')
      return link (s.crd_num, `${card_id}${s.crd_num}`);
    if (f == 'tal_num')
      return link(s.tal_num, `${talon_id}${s.tal_num}/${s.crd_num}`);
    return s[f];
  };

  const listMap= s=> m('tr', [ Object.keys(struct).map(
    column=> m('td', fref( s, column ))
  ) ] );
  
  const view = vuDataSheet(vnode);
  const v= Object.assign( view, { listMap: listMap } );
  v.form = Form;
  return v;
};

// src/reestr/router/roImport.js

const roErrors = {
  [reestrApi.vmxl]: {
    render: function() {
      return vuView(reestrMenu, m(vuApp, { text: "Правим ошибки реестра" } ) );
    }
  },
  [reestrApi.vmxl_imp]: {
    render: function() {
      let view = m(vuVmxlimp, {
        header: "Импорт протокола ошибок (XML файл)",
        model: moModel$1.getModel( taskReestr.vmx.post_url )
        
      });
      return vuView(reestrMenu, view);
    }
  },
  [reestrApi.vmxl_last]: {
    render: function() {
      let view = m(vuVmxlast, {
        header: "Последние принятые ошибки",
        model: moModel$1.getModel( restReestr.vmx.url ),
        struct: moStruct().vmx_last,
        params: restReestr.vmx.params
      });
      return vuView(reestrMenu, view);
    }
  },
};

// src/reestr/view/vuInvimp.js

const Form$1 = function(vnode) {
  
  const model= vnode.attrs.model;
  const data= { type: 1 };
  //const schema= _schema('task');  
  const get_type= el=> el.options[ el.selectedIndex].value;
  model.href= taskReestr.invoice.get_url;
  const download= event=> {
    //console.log('report');
    event.preventDefault();
    let imp= document.getElementById('imp');
    imp.classList.add('disable');
    //console.log(resp.getAttribute('display'));
    moModel$1.formSubmit(event, _schema('task'), model, "POST").then((t) => {
      //console.log(imp);
      imp.classList.remove('disable');
    });
  };
  
  return {
    view() {
      return m('div#imp.pure-g', { style: "margin-bottom: 1.3em;" }, [
        m('.pure-u-1-3', [
          m('form.pure-form.pure-form-stacked',
            { onsubmit: download, oncreate: form_file_dom }, [
            m('fieldset', [
              m('legend', "Файл счета БАРС"),
              m('.pure-control-group', file_field(data) ),
              /*
              m('.pure-control-group', [
                m('label[for=month]', 'Месяц'),
                m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                  { value: data.month, onblur: e=> data.month = e.target.value }
                )
              ]),
              */
              m('.pure-control-group', [
                m('label[for=type]', 'Тип счета'),
                m('select.ml10[name=type]',
                  { onblur: e=> data.type= get_type(e.target) }, [
                  m('option[value=1][selected]', 'Амбулаторный'),
                  m('option[value=2]', 'Онкология'),
                  m('option[value=3]', 'Дневной стационар'),
                  m('option[value=4]', 'Профосмотр'),
                  m('option[value=5]', 'Инокраевые'),
                  m('option[value=6]', 'Тарифы ПМУ'),
                ]),
              ]),
              m('.pure-controls', [
                m('button.pure-button pure-button-primary[type="submit"]',
                  { style: 'margin-top: 0.5em'}, "Импорт")
              ])  
            ])
          ])
        ]),
        m('.pure-u-2-3',  foResp(model) )
      ]);
    }
  };
};


// clojure
const vuInvimp = function (vnode) {
  
  return {
    view () {
      return [
        m(vuTheader$1, { header: vnode.attrs.header } ),
        m(Form$1, { model: vnode.attrs.model } )
      ];
    }    
        
  }; //return this object
};

// src/report/view/vuInvexp.js


const Form$2 = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  const md= { url: taskReestr.vmx.post_url, href: taskReestr.vmx.get_url };
  const upload= event=> {
    //console.log('report');
    event.preventDefault();
    let resp= document.getElementById('resp');
    resp.setAttribute('display', 'none');
    return moModel$1.formSubmit(event, _schema('task'), md, "GET").then((t) => {
      //console.log(r);
      resp.setAttribute('display', 'block');
    });
  };
  
  return {
  
    view() {
      //console.log(model);
      return [ m('.pure-g', { style: "margin-bottom: 1.3em;" }, [
        m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked', {onsubmit: upload},
          m('fieldset', [
            m('legend', "Выгрузить в CSV файл"),
            m('.pure-controls', [
              m('button.pure-button.pure-button-primary[type="submit"]',
                { style: "font-size: 1.2em; margin-left: 2em;",
                  //onclick: upload
                }, "Выгрузить")
            ])
          ])
        )
      ]),
      m('.pure-u-2-3', foResp(md) )
    ])
  ];
  }
};  
};

const vuInvcalc = function (vnode) {
  //card_id: "/cards/:crd",
  return {
    view () {
      return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(Form$2, { model: vnode.attrs.model } )
      ];
    }    
        
  }; //return this object
};

// src/reestr/router/roImport.js

const roInvoice = {
  [reestrApi.invoice]: {
    render: function() {
      return vuView(reestrMenu, m(vuApp, { text: "Счета и реестры для СМО и ФОМС" } ) );
    }
  },
  [reestrApi.inv_impex]: {
    render: function() {
      let view = m(vuInvimp, {
        header: "Реестр в СМО из ZIP файла счета БАРС",
        model: moModel$1.getModel( taskReestr.invoice.post_url )
        
      });
      return vuView(reestrMenu, view);
    }
  },
  [reestrApi.inv_calc]: {
    render: function() {
      let view = m(vuInvcalc, {
        header: "Собственные рассчеты",
       //model: moModel.getModel()
        
      });
      return vuView(reestrMenu, view);
    }
  },
};

// src/reestr/view/vuRdbf.js

const importForm = function(vnode) {
  
  const model= vnode.attrs.model;
  const data= { month: _month$1() };
  const schema= _schema$1('task');  
  //console.log(model);
  
  const on_submit = function (event) {
    event.preventDefault();
    return moModel$1.formSubmit(event, schema, model, "POST");
  };
  
  return {

  view() {
    //console.log(model);
    return m('.pure-g', [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked', 
            { onsubmit: on_submit, oncreate: form_file_dom }, [
          m('fieldset', [
            m('legend', "Импорт файлов реестров DBF"),
            m('.pure-control-group', file_field(data) ),
            m('.pure-control-group', [
              m('label[for=month]', 'Месяц'),
              m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                 { value: data.month, onblur: e=> data.month = e.target.value }
              )
            ]),
            m('.pure-controls', [
              m('label.pure-checkbox[for="test"]', [ 
                m('input[id="test"][type="checkbox"][name="test"]',
                  { value: data.sent, onblur: e=> data.sent = e.target.value }
                ),
                m('span', { style: "padding: 0px 5px 3px;"}, "Тест")
              ])
            ]),
            m('.pure-controls', [
              m('button.pure-button pure-button-primary[type="submit"]',
                { style: 'margin-top: 0.5em'}, "Импорт")
            ])  
          ])
        ])
      ]),
      m('.pure-u-2-3', [
        model.error ? m('.error', model.error) :
          model.message ? m('.legend', ["Статус обработки", 
            m('div', [

              m('h4.blue', model.message),
              m('span.blue', {style: "font-size: 1.2em"}, "Исходный файл: ", model.file ),
              model.detail ? m('h4.red', model.detail) : '',

            ])
          ]) : m('div')
      ])
    ]);
  }
}
};

// clojure
const vuRdbf = function (vnode) {
    
  return {
    view () {
      return [
        m(vuTheader$1, { header: vnode.attrs.header } ),
        m(importForm, { model: vnode.attrs.model } )
      ];
    }    
        
  }; //return this object
};

// src/reestr/router/roImport.js
//import { vuVolum } from '../view/vuRdbf.js';

const roImport = {
  [reestrApi.impo]: {
    render: function() {
      return vuView(reestrMenu, m(vuApp, { text: "Импорт файлов" } ) );
    }
  },
  [reestrApi.impo_dbf]: {
    render: function() {
      let view = m(vuRdbf, {
        header: "Импорт реестов DBF",
        model: moModel$1.getModel( taskReestr.impo_dbf.post_url )
      });
      return vuView(reestrMenu, view);
    }
  },
};

// src/reestr/router_reestr.js

const reestrRouter = { [reestrApi.root]: {
    render: function () {
        return vuView(reestrMenu,
            m(vuApp, {text: "Медстатистика: Реестры ОМС"}));
    }
}
};

Object.assign(reestrRouter, roReestr, roErrors, roInvoice, roImport);

m.route(document.body, "/", reestrRouter);
