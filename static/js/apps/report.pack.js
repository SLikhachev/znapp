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

// https://github.com/GoogleChrome/dialog-polyfill
// https://html5test.com/
// Fifix since 53 about:config
// dom.dialog_element.enabled

//import { moModel } from '../model/moModel.js';

const vuDialog = {
  
  dialog: null,
  //dialog: document.getElementById('dialog'),
  
  oncreate(vnode) {
      vuDialog.dialog = vnode.dom;
      //console.log(dialogView.dialog);
  },
  
  view(vnode) {
    return m('dialog#dialog', m('.dialog-content', [
      m('i.fa fa-times.dclose', { onclick: vuDialog.close }),
        m('span.dheader', `${vnode.attrs.header} (${vnode.attrs.word})`),
          vnode.children
        ])
    );
  },
  
  open () {
    vuDialog.dialog.showModal();
    return false;
  },
  
  close (reload=false) { //e - EventObject
    //let srverr = document.getElementById('srv-error');
    //let srverr = vuDialog.dialog.querySelector('#srv-error');
    //if ( !!srverr ) srverr.parentNode.removeChild(srverr);
    f= vuDialog.dialog.querySelector('form');
    if (Boolean(f)) f.reset();
    vuDialog.dialog.close();
    if ( reload ) m.redraw();
    return false;
  },
};

// src/apps/model/moModel.js

//const pg_rest = window.localStorage.getItem('pg_rest'); //postgest schemaRest;
//console.log(schema);

const errMsg= function(error){
  //console.log(error);
  //console.log(' error ');
  //let e = JSON.parse(error.message);
  let e= error.response;
  let m= e.details ? e.details : e.message ? e.message: e;
  //let m= e.message ? e.message : error;
  console.log(m);
  return m;
};

// return date in yyyy-mm format
const _month= () => {
    let d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
    m= m < 10 ? `0${m}`: `${m}`;
    return `${y}-${m}`;
  };

// return posgrest url if pg_rest else task url
const _schema= type=> {
  if (type === 'task')
    return window.localStorage.getItem('task_rest');
  return window.localStorage.getItem('pg_rest');
};

const moModel = {
  
  // :: String -> Array -> String -> Object
  // ret models object (POJO)
  getModel(
    {url=null, method="GET", options=null, order_by='id', editable=null, change=null, key='id' } = {}
  ) {
/*
  url - string of model's REST API url
  method - string of model's REST method
  options - array of strings of option tables names, required for complex views of this model
    need for form data select/option if any
  order_by - string "order by" with initially SELECT 
  editable - array defines is model could changed
  change - array editable fields names
  key - primary key for sql model table dafault id
*/
    let model = {
      url: url,
      method: method,
      order_by: order_by,
      options: options,
      editable: editable,
      change: change,
      key: key,
      list: null, // main data list (showing in table page)
      data: new Map(), // every idx corresponds with index of options array
      item: null,
      error: null, // Promise all error
      order: true, // for list
      sort: null, // for list
      save: null,
    };  
    model.sort= field => moModel.sort(model, field);
    model.getItem= id => {
      model.item= {};
      if (id === null) return false; 
      let key= model.key;
      for ( let it of model.list ) {
        if (it[key] == id) {
          model.item= Object.assign({}, it);
          break;
        }
      }
      return false;
    };
    
    return model;
  },
  // :: Object -> Promise
  // ret Promise
  // model = {field, url, method,  }
  getList (model) {
    model.list= null;
    let method= model.method ? model.method : 'GET';
    // filed - sort by with SELECT, default 'id' field
    //let schema = window.localStorage.getItem('pg_rest');
    let schema = _schema('pg_rest');
    let id = model.order_by ? model.order_by : 'id',
    sign= model.url.includes('?') ? '&': '?';
    order = `${sign}order=${id}.asc`;
    let url = schema + model.url + order;
    console.log(url);
    return m.request({
      method: method,
      url: url,
      headers: model.headers ? model.headers: null
    }).then(function(res) {
      //console.log(res);
      if ( ! Boolean(res) ) return false;
      if (res.length && res.length > 0) {
        model.list = Array.from( res ); // list of objects
        model.order = true;
      } else
        model.list= []; 
      return true;
    }).catch(function(err) { 
      //console.log(err);
      model.error = errMsg(err);
    });
  },
  // :: Object -> undef
  // return Promise all
  getData(model){
    if ( model.options === null ) return false;
    //let schema = window.localStorage.getItem('pg_rest');
    let schema= _schema('pg_rest');
    let data = [];
    //morder= model.order ? model.order : 'id';
    //order= `?order=${morder}.asc`;
    model.options.forEach ( t => {
      let id= t.order_by ? t.order_by : 'id';
      let sign= t.url.includes('?') ? '&': '?';
      let order = `${sign}order=${id}.asc`;
      
      let r = m.request({
        method: t.method ? t.method : "GET" ,
        url: schema + t.url + order
      });
      data.push(r);
    });
    // order should preserved
    return Promise.all(data).then( (lists) => {
      model.data.clear(); // = new Map();
      
      for ( let el of model.options.entries() ) {
        // entries [ idx, value ]
        if ( ! Boolean( lists[ el[0] ] ) ) continue; // no data for this option
        model.data.set( el[1].url, lists[ el[0] ]); // el[1] option object
      }
      //window.localStorage.setItem(model.opt_name, model.data);
      //model.data = _.zipObject( model.options, lists);
      //console.log( model.list );
      return true;
    }).catch(function(err) {
      model.error = errMsg(err);
      throw model.error;
    });
    
  },
  
  // :: Object -> String -> String -> Object -> Promise
  // return Promise
  getViewRpc (model, data, url=null, method=null) {
    //let schema = window.localStorage.getItem('pg_rest');
    let schema = _schema('pg_rest');
    let _url = url ? url : model.url;
    let _method = method ? method : model.method;
    let headers= model.headers ? model.headers : null;
    return m.request({
      url: schema + _url,
      method: _method,
      body: data,
      headers: headers
    }).then( res=> {
      if ( ! Boolean(res) ) return false;
      if (res.length && res.length > 0) {
        model.list= Array.from( res ); // list of objects
        model.order = true;
        return true;
      } else
        model.list= [];
        return false;
    }).catch( err=> {
      let msg=  errMsg(err);
      model.error= msg;
      return Promise.reject(msg);
    });
  },

  getViewRpcMap (model, data) {
    let schema= _schema('pg_rest');
    let reqs = [];
    for (let [idx, url] of model.url.entries()) {
      let r = m.request({
        method: model.method[idx],
        url: schema + url,
        body: data[idx]
      });
      reqs.push(r);
    }
    // order should preserved
    return Promise.all(reqs).then( (lists) => {
      // map data must be Map
      //model.map_data.clear(); // = new Map();
      for ( let [idx, key] of model.map_keys.entries() ) {
        //model.map_data.set( name, lists[ idx ]);
        if ( ! Boolean( lists[idx] ) ) continue;
        if (lists[idx].length && lists[idx].length > 0) {
          //model[key]= lists[ idx ];
          model[key] = Array.from( lists[idx] );
          //console.log(lists[idx]);
        } else
          model[key]= [];
      } 
      return true;
      return Promise.resolve(true);
    }).catch(function (err) {
      model.error = errMsg(err);
    });
  },

  sort(model, id=null) {
    //console.log(id);
    let order = model.order ? 'desc' : 'asc';
    let field = id ? id : 'id'; 
    model.list = _.orderBy(model.list, [ field ], [ order ]);
    //console.log(model.list);
    model.order = !model.order;
  },
  
  /** getFormData
    return item's data object 
  */
  
  getFormData(form, isSetOnly=false) {
    // form - dom form
    // isSetOnly - set out only
    let data = {};
    //let da = [];
    let text  = $(':input', form);
    Array.from(text).forEach( ( el ) => {
      if ( !!el.name )
        data[ el.name ] = el.value;
    } );
    return data;
  },
  
  /** formSubmit
    return false    
  */
  
  formSubmit(event, model, method) {
    //console.log(model);
    event.target.parentNode.classList.add('disable');
    let schema= _schema('pg_rest');
    let url = schema + model.url;
    let key= model.key ? model.key : 'id';
    let data= Object.assign({}, model.item);
    let sign= model.url.includes('?') ? '&': '?';
    if ( method == 'DELETE' || method == 'PATCH' ) {
      url += `${sign}${key}=eq.${data[key]}`; 
      if (data[key]) delete data[key];
    }
    for ( let k of Object.keys(data) ){
      if (model.change && model.change.indexOf(k) < 0) {
        delete data[k];
        continue;
      }
      if ( data[k] === '' ) delete data[k];  //data[k] = null;
    }
    model.save = { err: false, msg: '' };
    return m.request({
      url: url,
      method: method,
      body: data,
      //async: false,
      headers: model.headers
    }).then( res => {
      event.target.parentNode.classList.remove('disable');
      if (model.list) moModel.getList(model);
      if ( vuDialog.dialog && vuDialog.dialog.open) vuDialog.close();
      return res; 
    }).catch( err => {
      let msg= errMsg(err);
      model.save = { err: true, msg: msg };
      event.target.parentNode.classList.remove('disable');
      return Promise.reject(msg);
    });
  }
/*
  formSubmit (model, form) {  
    // form - jQuery object
    // model - model object 
    //let schema = window.localStorage.getItem('pg_rest');
    let pg_rest = window.localStorage.getItem('pg_rest');
    let data = moModel.getFormData( form ),
    url = pg_rest + model.url,
    method = data.method;
    //console.log ( data );
    //return false;
    vuDialog.form = form;
    delete data.method;
    if ( method == 'DELETE' || method == 'PATCH' )
      url += '?' + 'id=eq.' + data.id;
    $.ajax({
      url: url,
      type: method,
      async: false,
      data: data,
      //context: form,
      //contentType: 'application/json',
      dataType: 'json',
      beforeSend: vuDialog.offForm,
      error: vuDialog.xError,
      success: vuDialog.xSuccess
    });
    return false;
  }
*/
};

// src/apps/view/vuApp.js

const vuTheader = {
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

// src/report/reportApi.js

const restReport = {
    volum: {url: 'p146_report?insurer=eq.999&this_year=eq.2019', order_by: 'this_month' }
};

const taskReport = {
    
    hosp: {
        post_url: "/report/common/hosp/make_report", //POST date, upload file
        get_url: "/utils/file/hosp/report/", //GET report file
    },
    volum: {
        post_url: "/report/common/volum/make_report", //POST date
        get_url: "/utils/file/volum/report/" //GET report file
    },

};

const reportApi = {
    root: "/",
    surv: "/surv",
    surv_hosp: "/surv/hosp",
    surv_volum: "/surv/volum",
};

const reportMenu = { subAppMenu: {
  
  surv: {
    nref: [`#!${reportApi.surv}`, "Сводные"],
    items: [
      [`#!${reportApi.surv_hosp}`, "Госпитализация ЕИР"],
      [`#!${reportApi.surv_volum}`, "Объемы помощи"],
      
    ]
  }
}
};

// src/report/model/moStruct.js

// This object define how we shall render the particular table

const moStruct = function() {
  // every DBtable has id column is not showed in html table header
  // Object.record:: Array(Name::String, Sortable::Bool (if any))
  // record is String - name of table column -- property of DB record object
  // every html table has last column to delete record purpose

  var get_month = function (month) {
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
      pol_prof_visits: ["Проф визиты"],
      pol_stac_visits: ["Стац визиты"],
      pol_stom_uet: ["Стом УЕТ"],
      pol_ambul_persons: ["Амбул персон"],
      pol_prof_persons: ["Проф персон"],
      pol_stac_persons: ["Стац персон"],
      pol_stom_persons: ["Стом персон"],
      travma_ambul_visits: ["Травма визиты"],
      travma_ambul_persons: ["Травма персон"],
    },
  };
};

const moModel$1 = {
  
    doSubmit: function (form, model, method) {
        //console.log(form);
        let upurl = form.getAttribute('action');
        //console.log(upurl);
        //let finput = form.elements.namedItem('file'),
        //file = finput.files[0],
        let data = new FormData(form);
        let get_param = '';
        if (method == "GET") {
            let get_data = {};
            data.forEach( (v, k) => { get_data[k] = v; } );
            get_param = '?' + m.buildQueryString(get_data);
        }
        //console.log(get_param);
        form.classList.add('disable');

        //data.append("test", form.elements.namedItem('test'));
        //data.append("month", form.elements.namedItem('month'));
        //data.append("file", file);
        //console.log(data.getAll('test')[0], data.getAll('month')[0]);
        //data.append("")
        let url= `${_schema('task')}${upurl}${get_param}`;
        m.request({
            method: method,
            url: url,
            body: data,
        }).then( res=> {
            if (res.file) {
                model.file = res.file;
            }
            model.message = res.message;
            model.done = res.done;
            //console.log(` msg: ${model.message}, file: ${model.file}, done: ${model.done}`);
            form.classList.remove('disable');
        }).catch( err=> {
            model.error = errMsg(err);
            form.classList.remove('disable');
        });
        return false;
    }
};

// src/report/view/vuHosp.js

const fileForm = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  const data= {
    month: _month(),
    _get: taskReport.hosp.get_url,
    _post: taskReport.hosp.post_url,
  };
  
  const on_form_submit = function (event) {
    event.preventDefault();
    return moModel$1.doSubmit(event.target, model, "POST");
  };
  
  const on_form_create = function (vnode) {
    let inputs = vnode.dom.querySelectorAll('.inputfile');
    Array.prototype.forEach.call( inputs, ( input ) => {
      let label	 = input.nextElementSibling, labelVal = label.innerHTML;
      input.addEventListener( 'change', ( e ) => {
        let fileName = '';
        if( this.files && this.files.length > 1 )
          fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
        else
          fileName = e.target.value.split( '\\' ).pop();
      
        if( fileName )
          label.querySelector( 'strong' ).innerHTML = fileName;
        else
          label.innerHTML = labelVal;
      });
    });
    vnode.dom.addEventListener('submit', on_form_submit);
  };
  
  const get_href$$1 = file=> `${_schema('task')}${data._get}${file}`;
  
  return {
  
    view() {
    //console.log(model);
    return m('.pure-g', [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked', 
            { action: data._post,
              method: 'POST',
              oncreate: on_form_create
            }, [
          m('fieldset', [
            m('legend', "Отчет из файла ЕИР"),
            m('.pure-control-group', [
            m('input.inputfile[type="file"][name="file"][id="file"]',
              {'data-multiple-caption': "{count} files selected", 'multiple':false }
            ),
            m('label[for="file"]', m('strong', "Выбрать файл"))
            ]),
            m('.pure-control-group', [
              m('label[for=month]', 'Месяц'),
              m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                 { value: data.month }
              )
            ]),
            m('.pure-controls', [
              m('label.pure-checkbox[for="test"]', [ 
                m('input[id="test"][type="checkbox"][name="test"]'),
                m('span', { style: "padding: 0px 5px 3px;"}, "Тестовый режим")
              ])
            ]),
            m('.pure-controls', [
              m('button.pure-button pure-button-primary[type="submit"]',
                { style: 'margin-top: 0.5em'}, "Загрузить")
            ])  
          ])
        ])
      ]),
      m('.pure-u-2-3', [
        model.error ? m('.error', model.error) :
          model.message ? m('.legend', ["Статус обработки", 
            model.done ? m('div', [
              m('h4.blue', model.message),
              m('span.blue', {style: "font-size: 1.2em"}, "Файл отчета: "),
              m('a.pure-button', {href: get_href$$1( model.file ), style: "font-size: 1.2 em"}, model.file ) 
           ]) : m('div', [
              m('h4.blue', model.message),
              m('span.blue', {style: "font-size: 1.2em"}, "Исходный файл: ", model.file )
           ])
          ]) : m('div')
        
      ])
    ]);
  }
}
};


const vuHosp = function (vnode) {
  return {
    view () {
      return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(fileForm, { model: vnode.attrs.model } )
      ];
    }    
  }; 
};

// src/report/view/vuDataSheet.js

// clojure
const vuReportSheet = function (vnode) {
  
  var { model, struct, header } = vnode.attrs;
  // model Object
  // struct Object
  // header String;
  moModel.getList( model );
  
  const listMap = s=> {
    //let id = s.code + ' ' + s.spec;
    let first = true;
    return m('tr', [
      Object.keys(structObject).map( (column) => {
        let field = structObject[column],
        value = field[1] ? field[1]( s[column] ) : s[column]; // 2nd el is function if any
        let td = first ? m('td.blue', {
        }, value) : m('td', value);
        first = false;
        return td;
      })
    ]);
  };
  
  const hdr= c=> {
    let field = struct[c];
    return field[2] ? m('th.sortable', // 3rd el sortable bool
      { onclick: ()=> model.sort (c) },
      [field[0], m('i.fa.fa-sort.pl10')]
    ) : m('th', field[0]);
  };
  
  return {
    view () {
    
    //return m(tableView, {model: this.model , header: this.header }, [
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        m(vuTheader, { header: header} ),
        this.form ? m(this.form, {model:  model}) : '',
        
        m('table.pure-table.pure-table-bordered[id=find_table]', [
          m('thead', m('tr', [ Object.keys(struct).map( hdr ) ]) ),
          m('tbody', [modelObject.list.map( listMap )] )
        ])
      ] : m(vuLoading);
    }
  };
};

// src/report/view/vuVolum.js

const Form = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  const data= {
    month: _month(),
    _get: taskReport.volum.get_url,
    _post: taskReport.volum.post_url,
  }; 
   
  const update = function (event) {
    //console.log('update');
    event.preventDefault();
    let form = document.getElementById("volume_form");
    return moModel$1.doSubmit(form, model, "POST");
  };
  
  const report = function (event) {
    //console.log('report');
    event.preventDefault();
    let form = document.getElementById("volume_form");
    return moModel$1.doSubmit(form, model, "GET");
  };

  const get_href = file=> `${_schema('task')}${data._get}${file}`;
  
  return {
  
  view() {
    //console.log(model);
    return [ m('.pure-g', [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked[id="volume_form"]',
            { action: data._post,
            }, [
          m('fieldset', [
            m('legend', "Расчет объемов"),
            m('.pure-control-group', [
              m('label[for=month]', 'Месяц'),
              m('input[id="month"][type="month"][name="month"][reqired=required]',
                 { value: data.month }
              )
            ]),
            m('.pure-controls', [
              m('label.pure-checkbox[for="test"]', [
                m('input[id="test"][type="checkbox"][name="test"]'),
                m('span', { style: "padding: 0px 5px 3px;"}, "Тест"),
              ])
            ]),
            m('.pure-controls', [
              m('button.pure-button[type="button"]',
                { style: "font-size: 1.2em",
                  onclick: update
                }, "Обновить"),
              m('button.pure-button.pure-button-primary[type="button"]',
                { style: "font-size: 1.2em; margin-left: 2em;",
                  onclick: report
                }, "Отчет")
            ])
          ])
        ])
      ]),
      m('.pure-u-2-3',
        model.error ? m('.error', model.error) :
        model.message ? m('.legend', ["Статус обработки",
          model.done ? m('div', [
            m('h4.blue', model.message),
            m('span.blue', {style: "font-size: 1.2em"}, "Файл отчета: "),
            m('a.pure-button', {href: get_href( model.file ), style: "font-size: 1.2 em"}, model.file ) 
          ]) : m('div', m('h4.blue', model.message))
        ]) : m('div')
      )
    ])
  ];
  }
}  
};


// clojure
const vuVolum = function (vnode) {
  //console.log(vnode.attrs.model.pg_url);
  let view = vuReportSheet(vnode);
  view.form = Form;
  return view;
};

// src/report/router/roSurvey.js

const roSurvey = {
  [reportApi.surv]: {
    render: function() {
      return vuView(reportMenu, m(vuApp, { text: "Отчеты сводные" } ) );
    }
  },
  [reportApi.surv_hosp]: {
    render: function() {
      let view = m(vuHosp, {
        header: "Госпитализация отчет из файда ЕИР",
        model: moModel.getModel()
        
      });
      return vuView(reportMenu, view);
    }
  },
  [reportApi.surv_volum]: {
    render: function() {
      //console.log(pgRest.volum);
      let view = m(vuVolum, {
        header: "Обемы помощи приказ 146",
        model: moModel.getModel( restReport.volum ),
        struct: moStruct().p146_report,
        //form: true
      });
      return vuView(reportMenu, view);
    }
  },
};

// src/report/router_report.js
//import { roTfoms } from './router/roTfoms.js';
//import { roOnko } from './router/roOnko.js';

const reportRouter = { [reportApi.root]: {
    render: function() {
       return vuView( reportMenu,
          m(vuApp, { text: "Медстатистика: Отчеты" }));
    }
  }
};

Object.assign(reportRouter, roSurvey); //, roTfoms, roOnko);

m.route(document.body, "/", reportRouter);
