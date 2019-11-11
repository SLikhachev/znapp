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

// src/sparv/spravApi.js
// here url is a table name

// editable - array of string as [ 'add', 'edit', 'del' ]
// change - editable fields names if any else all fields exclude id
const restSprav = {
    // local
    get doctor() {
        return { url:"doctor", options: [ this.division, this.district ], order_by: 'code',
        editable: ['add', 'edit', 'del'] };
    },
    district: { url:"district"},
    division: { url:"division"},
    sp_podr: { url:"sp_podr", order_by: 'mo_code' },
    sp_para: { url:"sp_para"},
    purp: { url: 'purpose'},
    mo_local: { url:"mo_local"},
    smo_local: { url:"smo_local"},
    // prof
    doc_spec : { url:"spec_prvs_profil", order_by: 'spec', key: 'spec'}, 
    profil: { url: 'profil', editable: ['edit'], change: ['one_visit', 'two_visit', 'podr'], },
    prvs: { url: 'prvs' },
    vidpom: { url: 'vidpom' },
    pmu: { url: 'pmu', editable: ['edit'], change: ['ccode', 'code_podr', 'code_spec'], key: 'code_usl' },
    pgr: { url: 'pmu_grup_code' },
    pgc: { url: 'rpc/get_pgc', },
    pmu_grup: { url: 'pmu_grup', editable: ['add'] },
    grc: { url: 'rpc/get_grc'},
    mkb: { url: 'mkb10', order_by: 'code'},
    chm: { url: 'char_main'},
    travma: { url: 'travma_type'},
    ist_fin: { url: 'ist_fin'},
    cishod: { url: 'cishod'},
    cresult: { url: 'cresult'},
    
    // onko
    onko_n1: {url: 'n1_protkaz'},
    onko_n2: {url: 'n2_stady'},
    onko_n3: {url: 'n3_tumor'},
    onko_n4: {url: 'n4_nodus'},
    onko_n5: {url: 'n5_metastaz'},
    onko_n6: {url: 'rpc/onko_tnm'}, //pg base proc
    onko_n7: {url: 'n7_hystolog'},
    onko_n8: {url: 'onko_hysto_n8'}, // pg base view
    onko_n9: {url: 'onko_hysto_n9'}, // pg_base view
    onko_n10: {url: 'n10_mark'},
    onko_n11: {url: 'onko_mark_n11'}, // pg base view
    onko_n12: {url: 'onko_mark_n12'}, // pg base view
    onko_n13: {url: 'n13_lech_type'},
    onko_n14: {url: 'n14_hirlech_type'},
    onko_n15: {url: 'n15_leklech_line'},
    onko_n16: {url: 'n16_leklech_cycle'},
    onko_n17: {url: 'n17_luchlech_type'},
    onko_n18: {url: 'n18_povod_obras'},
    onko_n19: {url: 'n19_consil_cel'},
    //onko_n21: {url: 'rpc/onko_lek_schema'}, //pg base proc

    // common
    dul: {url: 'dul'},
    okato: { url: 'okato'},
    
    //tarif
    tarif_base: { url: 'tarifs_base', editable: ['edit'] },
    tarif_pmu_vzaimo:  { url: 'tarifs_pmu_vzaimoras', editable: ['edit'] },
};

const spravApi = {
    root: "/",
    mo: "/mo",
    mo_doct: "/mo/doct",
    //mo_dist:  "/mo/dist-list", // участки
    //mo_divs: "/mo/divs-list", //отделения
    //mo_podr: "mo/podr", //подразделения
    //mo_sp_podr: "mo/sp_podr", //вспомогательные
    mo_sp_para: "/mo/sp_para", // paraclin
    mo_local: "/mo/mo_local",
    mo_smo: "/mo/smo_local",
    //mo_org: "/mo/org," //ораганизации (договоры, профосмотьры)
    //
    prof: "/prof",
    prof_spec: "/prof/spec", //специальности првс профиль
    prof_prof: "/prof/prof", //профили с кодами услуг
    prof_prvs: "/prof/prvs", //првс
    prof_vidpom: "/prof/vidpom",
    prof_pmus: "/prof/pmu",
    prof_pmu_code: "/prof/pmu/:code",
    prof_pgrup: "/prof/pgrup",
    prof_pmu_grup: "/prof/pgrup/:grup",
    
    prof_mkb: "/prof/mkb",
    //prof_purp: "/prof/purp",
    //prof_type: "/prof/type",
    //prof_insur: "/prof/insur",
    //prof_istfin: "/prof/istfin",
    //prof_errors: "/prof/errors",
    //
    onko: "/onko",
    onko_n1: "/onko/n1",
    onko_n2: "/onko/n2",
    onko_n3: "/onko/n3",
    onko_n4: "/onko/n4",
    onko_n5: "/onko/n5",
    //onko_n6: "/onko/n6",
    onko_n7: "/onko/n7",
    onko_n8: "/onko/n8",
    onko_n9: "/onko/n9",
    onko_n10: "/onko/n10",
    onko_n11: "/onko/n11",
    onko_n12: "/onko/n12",
    onko_n13: "/onko/n13",
    onko_n14: "/onko/n14",
    onko_n15: "/onko/n15",
    onko_n16: "/onko/n16",
    onko_n17: "/onko/n17",
    onko_n18: "/onko/n18",
    onko_n19: "/onko/n19",
    //onko_n21: "/onko/n21",
    
    // common sprav
    com: "/com",
    com_dul: "/com/dul",
    com_okato: "/com/okato",
    
    //tarifs
    tarif: "/tarif",
    tarif_base: "/tarif/base",
    tarif_pmu_vzaimo: "/tarif/pmu_vzaimo",
};

const spravMenu = { subAppMenu: {
  
  mo: {
    nref: [`#!${spravApi.mo}`, "Локальные"],
    items: [
      [`#!${spravApi.mo_doct}`, "Врачи"],
      //[`#!${spravApi.mo_dist}`, "Участки"],
      //[`#!${spravApi.mo_divs}`, "Отделения"],
      [`#!${spravApi.mo_sp_para}`, "Диагност. подр."],
      [`#!${spravApi.mo_local}`, "МО локальные"],
      [`#!${spravApi.mo_smo}`, "СМО локальные"],
    ]
  },
  prof: {
    nref: [`#!${spravApi.prof}`, "Профильные"],
    items: [
      [`#!${spravApi.prof_spec}`, "Специальности"],
      [`#!${spravApi.prof_prof}`, "Профили"],
      [`#!${spravApi.prof_prvs}`, "PRVS"],
      [`#!${spravApi.prof_vidpom}`, "Вид помощи"],
      [`#!${spravApi.prof_pmus}`, "ПМУ"],
      [`#!${spravApi.prof_pgrup}`, "Группы ПМУ"],
      [`#!${spravApi.prof_mkb}`, "МКБ-10"],
      //[`#!${spravApi.tfoms_podr}`, "Подразделения"],
      //[`#!${spravApi.tfoms_para_podr}`, "Доп. службы"],
      //[`#!${spravApi.tfoms_purp}`, "Цель обращения"],
      //[`#!${spravApi.tfoms_type}`, "Особый случай"],
      //[`#!${spravApi.tfoms_insur}`, "Категория ОМС"],
      //[`#!${spravApi.tfoms_istfin}`, "Фин. источник"],
      //[`#!${spravApi.tfoms_errors}`, "Причины отказов"],
    ]
  },
  onko: {
    nref: [`#!${spravApi.onko}`, "Онкология"],
    items: [
      [`#!${spravApi.onko_n1}`, "1. Причины отказов"],
      [`#!${spravApi.onko_n2}`, "2. Стадии"],
      [`#!${spravApi.onko_n3}`, "3. Tumor"],
      [`#!${spravApi.onko_n4}`, "4. Nodus"],
      [`#!${spravApi.onko_n5}`, "5. Метазстазы"],
      //[`#!${spravApi.onko_n6}`, "6. DS TNM"],
      [`#!${spravApi.onko_n7}`, "7. Гистология"],
      [`#!${spravApi.onko_n8}`, "8. Гистолог результ"],
      [`#!${spravApi.onko_n9}`, "9. Гистолог диагноз"],
      [`#!${spravApi.onko_n10}`, "10. Онкомаркеры"],
      [`#!${spravApi.onko_n11}`, "11. Онкомарк знач"],
      [`#!${spravApi.onko_n12}`, "12. Онкомарк диаг"],
      [`#!${spravApi.onko_n13}`, "13. Тип лечения"],
      [`#!${spravApi.onko_n14}`, "14. Хирург лечение"],
      [`#!${spravApi.onko_n15}`, "15. Лекарств линии"],
      [`#!${spravApi.onko_n16}`, "16. Лекарств циклы"],
      [`#!${spravApi.onko_n17}`, "17. Лучевая терапия"],
      [`#!${spravApi.onko_n18}`, "18. Повод обращения"],
      [`#!${spravApi.onko_n19}`, "19. Цель консилиума"],
      //[`#!${spravApi.onko_n21}`, "21. Схема терапии"],
    ]
  },
  com: {
    nref: [`#!${spravApi.com}`, "Общие"],
    items: [
      [`#!${spravApi.com_dul}`, "ДУЛ"],
      [`#!${spravApi.com_okato}`, "ОКАТО"],
    ]
  },
  
  tarif: {
    nref: [`#!${spravApi.tarif}`, "Тарифы"],
    items: [
      [`#!${spravApi.tarif_base}`, "Базовый"],
      [`#!${spravApi.tarif_pmu_vzaimo}`, "ПМУ взаиморас."],
    ]
  }
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
  if ( !error)
    return 'Ошибка сервера (детали в журнале)'
  let e= error.response ? error.response: 'Ошибка сервера (пустой ответ)' ;
  let m= e.details ? e.details : e.message ? e.message: e;
  //let m= e.message ? e.message : error;
  console.log(m);
  return m;
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
};

// src/sprav/view/vuSprav.js

const fetchForm= function( attrs ){
  //console.log(attrs)
  let { on_submit, data, flds, ffunc } = attrs;
    return m(".pure-g",
      m(".pure-u-1-2",
        m("form.pure-form", { onsubmit: on_submit },
          m("fieldset", m(".pure-g", [
            flds.map( f=> m(".pure-u-1-4", ffunc(f, data)) ),
            m(".pure-u-1-5",
                m('button.pure-button.pure-button-primary[type="submit"]',
                  {style:'margin-top: 1.7em'} ,
                 "Выбрать")
            )
          ]))
        ) //form
      ) // u-1-2
    ); // g return
}; //func


const change= function(e, model, method, word) {
    //console.log(word);
    //e.preventDefault();
    item_id= e.target.getAttribute('data');
    vuForm.method= method;
    vuForm.word= word;
    model.getItem(item_id);
    vuDialog.open();
    return true;
  };

// Forms in dialog window for catalogs 
const vuForm = {
  
  item: null,
  method: "",
  word: "",
  model: null,
  name: "",
  
  onSubmit(e) {
    e.preventDefault(); // if not then in route we will see wrong path (method GET + all form fields)
    if (vuForm.model !== null && vuForm.model.item !== null) {
      moModel.formSubmit(e, vuForm.model, vuForm.method);
    }
    //vuDialog.close();
    //moModel.getList(vuForm.model);
    return true;
  },
  
  oninit(vnode) {
    //vuDialog.model = vnode.attrs.model;
    vuForm.model = vnode.attrs.model;
    vuForm.name = vnode.attrs.name;
  },
    
  view(vnode) {
    return [m('form.pure-form.pure-form-aligned',
      { id: 'moform', onsubmit: vuForm.onSubmit }, [
        vnode.children,
        m('.pure-controls', [
            //m('input[type=hidden][name=method]', {value: method} ),
            m('button.pure-button[type=submit]', vuForm.word),
        ])
      ]), // form
      vuForm.model.save && vuForm.model.save.err ?
        [m('br'), m('span.red', 'Ошибка базы данных:'),
        m('br'), m('span.red', `${vuForm.model.save.msg}`)] : ''
    ]; // return
  },
};

const vuTheader = {
  view (vnode) {
    return m(".pure-g", m(".pure-u-1-1.box-1",
        m('span.dheader', vnode.attrs.header )
      )
    );
  }
};

const vmFilter = {
  
  tr_cols: 2, // how many tr childern (table columns) get to find 
  to_find: "",
  setFilter: function(e) {
    let str = e.target.value; 
    vmFilter.to_find = str.toLowerCase();
    $.each( $('table#list_table tbody tr'), function(ind, tr) {
      let subtr = $(tr).children().slice(0,vmFilter.tr_cols);
      //console.log( subtr );
      if (subtr.text().toLowerCase().indexOf(vmFilter.to_find) === -1) {
        $(tr).hide();
      } else {
        $(tr).show();
      }
      m.redraw();
    });
  }
  
};

const vuFilter = {
  
  model: null,
  add: false,
  
  addItem(e) {
    //e.preventDefault();
    vuForm.method= 'POST';
    vuForm.word= 'Добавить';
    vuFilter.model.getItem(null);
    vuDialog.open();
    //return false;
  },
  
  oninit(vnode) {
    vuFilter.model= vnode.attrs.model;
    vuFilter.add= vnode.attrs.add; 
    vmFilter.tr_cols = vnode.attrs.cols ? vnode.attrs.cols : 2;
    vmFilter.to_find = "";
    
  },
  
  view (vnode) {
    return m(".pure-g",
      m(".pure-u-1-1",
        m("form.pure-form",
          m("fieldset",
            m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[id='to-find'][type='search']",
                  {placeholder: "найти число, слово",
                  onkeyup: vmFilter.setFilter,
                  value: vmFilter.to_find
                  }
                )
              ),
              /*
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[id=name-find[type='text']",
                  {placeholder:"наименование"}
                )
              ),
              */
              m(".pure-u-1-5",
                vuFilter.add ? 
                  m('button.pure-button.pure-button-primary[type="button"]', {
                    onclick: vuFilter.addItem
                  },
                  "Добавить"
                ) : ''
              )
            ])
          )
        )
      )
    );
  }
};

const vuSprav = {
  view: function(vnode) {
    return m('div',
      { style: "margin: 0 auto; padding-top: 5em; width: 50%;" },
      m('h1.blue', {style: "font-size: 3em;"}, vnode.attrs.text)
    );
  }
};

const vuView = function(view) {
  return m(vuMain, spravMenu, view);
};

// src/sparv/model/moStruct.js

// This object define how we shall render the particular table

const onko_ = function() {
  return { 
    id: ["Индекс"], 
    ds: ["Диагноз", true],
    kod: ["Код", true],
    name: ["Наименование"]
  };
};

const idName= {
  id: ["Код", true],     
  name: ["Описаение", true],
};

const moStruct = {
  // every DBtable has id column is not showed in html table header
  // Object.record:: Array(Name::String, Sortable::Bool (if any))
  // record is String - name of table column -- property of DB record object
  // every html table has last column to delete record purpose if it possible
  
  // local 
  doctor: {
    code: ["Код", true],     
    spec: ["Специальность", true],
    family: ["Врач"],
    snils: ["СНИЛС"],
    division: ["Отделение"],
    district: ["Участок"],
    tabid: ["Таб. номер"]
  },
  moLocal: {
    code: ["Код", true],     
    scode: ["Код ТФОМС", true],
    sname: ["Наименование кратко"],
    name: ["Наименование полное"]
  },
  smoLocal: {
    code: ["Код", true],     
    okato: ["ОКАТО", true],
    name: ["Наименование"]
  },
  // prof
  pmu: {
    code_usl: ['Код услуги'],
    ccode: ['Номер'],
    name: ['Наименование'],
    code_podr: ['Подразд.'],
    code_spec: ['Спец.']
  },
  
  mkb: {
    code:  [ 'Код', true ],
    name: [ 'Описание'],
    oms: ['ОМС'],
    oms_ds: ['ОМС ДС']
  },
  // tfoms
  spPodr: {
    mo_code: ["Код", true],     
    id_otd: ['Код отделения'],
    name_otd: ['Наименование'],
    profil: ['Код профиля'],
    prof_name: ['Наименвание профиля']
  },
  doc_spec: {
    spec: ["Код", true],
    name: ["Специальность"],
    prvs: ["Код PRVS V021" ],
    profil: ["Профиль"],
    prof_k: ["Профиль койки"],
    det: ["Детский"] 
  },
  profil: {
    id: ["Код", true ],
    name: ["Профиль"],
    one_visit: ["ПМУ посещение"],
    two_visit: ["ПМУ обращение"],
    podr: ["Подразделение"]
  },
  dul: {
    code: ["Код", true],     
    name: ["Наименование"],
    serial_tpl: ["Шаблон серии"],
    number_tpl: ["Шаблон номера"]
  },
  okato: {
    okato: ["ОКАТО", true],
    region: ["Код региона", true],
    name: ["Наименование региона"]
  },
  
  // onko
  onko_n2: {
    id: ["Индекс"],
    ds: ["Диагноз", true],
    kod: ["Код", true]
  },
  onko_n3: onko_(),
  onko_n4: onko_(),
  onko_n5: onko_(),
  onko_n6: {
    ds_code: ['Диагноз'],
    stady_id: ['Код Стадия'],
    //st_kod: ['Стадия'],
    tumor_id: ['Код Tumor'],
    //tm_kod: ['Tumor'],
    nodus_id: ['Код Nodus'],
    //nd_kod: ['Nodus'],
    metas_id: ['Код Метастаз'],
    //meta_kod:['Метастаз']
  },
  onko_n8: {
    id: ["Индекс"], 
    hysto_name: ["Наименование гистологии"], 
    hysto_id: ["Индекс гистологии"],
    name: ["Результат"]
  },
  onko_n9: {
    id: ["Индекс"], 
    ds: ["Диагноз"],
    hysto_name: ["Наименование гистологии"], 
    hysto_id: ["Индекс гистологии"],
  },
  onko_n10: {
    id: ["Индекс"], 
    kod: ["Код"],
    name: ["Наименование"]
  },
  onko_n11: {
    id: ["Индекс"], 
    mark_name: ["Наименование маркера"],
    mark_id: ["Индекс маркера"],
    kod: ["Код"],
    name: ["Результат"]
  },
  onko_n12: {
    id: ["Индекс"], 
    ds: ["Диагноз"],
    mark_name: ["Наименование маркера"],
    mark_id: ["Индекс маркера"],
  },
  // tarifs
  tarif_base: {
    id: ["№ п/п"], 
    name: ["Тариф"],
    tarif: ["Цена руб./ Коэфф. "],
  },
  tarif_pmu_vzaimo: {
    id: ["№ п/п"], 
    code: ["Код ПМУ"],
    tarif: ["Цена руб."],
    name: ["ПМУ"]
  },
  
  
  
};

// src/apps/view/vuApp.js

const vuLoading = {
  view() { 
    return m(".loading-icon", 
      m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
      m('span.sr-only', 'Loading...')
    );
  }
};

// src/sprav/view/vuList.js

const vuTableRow= function(data) {
  // data Object
  // edit - callback on click to edit row
  // ddel - callback to delete row
  // href - anchor href to set route on row page if any
  // there may be either edit or href attr
  // struct - struct object for row representation 
  //let { data={}, row=[] }= vnode.attrs;
  //console.log(data);
  //let id= data.id ? data.id : 'id';
  let {edit, ddel, href, struct, pk }= data;
  href= edit ? '' : href;
  
  const first_cell= id => m('td.choice.blue', id);
  
  const dialog_cell = (val, vpk) => m('td.choice.blue', {
      data: vpk, // every item must have id attr
      onclick: edit
    }, val);
  
  const anchor_cell= (val, vpk) => m('td.choice.blue', m(m.route.Link, {
      href: `${href}/${vpk}`,
    }, val));
  
  const ddel_cell= vpk => m('td', m('i.fa.fa-minus-circle.choice.red', {
    data: vpk,
    onclick: ddel
    }) );
  
  return function(row) {
      //console.log(vnode.attrs.row);
      let first= true, vpk=row[pk];
      return m('tr', [
        Object.keys(struct).map( column => {
          let rc= row[column];
          let td= first ? // first will be anchor code 
            edit ? dialog_cell(rc, vpk) :
            href ? anchor_cell(rc, vpk) : first_cell(rc)
          : m('td', rc);
          first = false;
          return td;
        }),
        ddel ? ddel_cell(vpk) : ''
      ]);
    };
};

// clojure
const vuListTable = function (vnode) {
  
  let {
    clss='', tid='', model, struct={},
    edialog={}, href='', sort='' //sort - callback
    
  }= vnode.attrs;
  let { edit='', ddel='' }= edialog;
  const pk= model.key;
  const listMap= vuTableRow( { struct, edit, ddel, href, pk} );
  
  let cls= clss ? clss : '.pure-table.pure-table-bordered';
  let ftid= tid ? tid : 'list_table'; 
  let table= `table${cls}[id=${ftid}]`;
  
  return {
    view() {
      //console.log(vnode.attrs.model.list);
      return m(table, [ 
        m('thead', m('tr', [
          Object.keys(struct).map( column => {
            let field = struct[column];
            let th= field.length > 1 ? m('th.sortable', // sortable field has 2nd elem in array
              { data: column, onclick: sort },
              [field[0], m('i.fa.fa-sort.pl10')]
            ) : m('th', field[0]);
            return th;
          }),
          ddel ? m('th', "Удалить") : ''
        ])),
        m('tbody', [model.list.map(listMap)])
     ]);
    }
  }; 
};

// src/sprav/view/vuSheet.js

// clojure
const vuSheet = function (vnode) {
  /* common view for sprav
  attrs if defined:
  model - required model object,
      if model has editable array ( set in spravApi.restSprav of 3 words: add, del, edit ),
      then dialog window will be defined to change the item of sprav
      add - may add item
      del - may del item
      edit - may edit item
      if model has change array of strings then this fields ( names) will be editable
  header - required header string for view page,
  name - string requred for item edit form as header in dialog window,
  struct - required object represent items in table: order and names of tabel's header,
  filter - int represent number of columns to fiter tables row from 1  ,
  href - if defined then first column will be route to another page of this app,
  itemForm - if defined then yhis form will bu used for change item in dialog window,
  fetchForm - if defined then this form will be used for fetch items from sql table
    in that case items will not be showed in table as for simple tables (short tables)
  */
 
  let {
    model, header, name, struct, filter=0, //filter int of fields to order
    href='', itemForm=null, fetchForm: fetchForm$$1=null
  }= vnode.attrs;
  //console.log( typeof fetchForm );
  //console.log(href);
  const edit= e => change(e, model, 'PATCH', 'Изменить');
  const ddel= e => change(e, model, 'DELETE', 'Удалить');
  const edialog={}; 
  let { editable }= model;

  if (Boolean( editable ) && editable instanceof Array){
      edialog.add= editable.indexOf('add') >= 0 ? true : false;
      if (editable.indexOf('edit') >= 0) edialog.edit= edit;
      if (editable.indexOf('del') >= 0) edialog.ddel= ddel;
  }
  const dialog= edialog.add || edialog.edit || edialog.ddel;
  const sort=  e=> model.sort(e.target.getAttribute('data'));
  //const table= {struct, edialog, href, sort};
  
  if (href) delete edialog.edit; 
  
  if ( fetchForm$$1 === null ) {
    moModel.getList( model );
    moModel.getData( model );
  } else {
    model.getItem(null);
  }
  
  return {
    
    oninit () {
    },
    view () {
      //console.log(itemForm);
      return [
        header ? m(vuTheader, {header: header}) : '',
        fetchForm$$1 ? fetchForm$$1( model ) : '',
        model.error ? m(".error", model.error) :
          model.list ? [
            filter ? m(vuFilter, {cols: filter, model: model, add: edialog.add} ) : '',
            m(vuListTable, {struct: struct, edialog: edialog, href: href, sort: sort, model: model} ),
            dialog ? itemForm ? // set in parent view if any
              m(vuDialog, { header: header, word: vuForm.word },
                m(vuForm, { model: model, name: name },
                  m(itemForm, { model: model, method: vuForm.method } )
                )
              ) : '' //m('h2', 'Не определена форма редактирования объекта')
            : '' // not editable
          ] : m(vuLoading)
      ];
    }
  }; //return this object
};

const fieldFrom = function (fromObj, field, data, to_attrs={}) {
  //console.log(fromObj);
  // fromObj - object with form fields (label, input) description
  // field - fromObj attribute name for form field (form input tag name is equal  to attr name)
  // data - object gets actual data from (model field)
  // to_attrs = additional attrs to be set to input tag

 // this is standard onblur function
  const fblur = e => data[field] = e.target.value;
  const fval = v => v ? v : '';
  
  let { label,  input } = fromObj[field];
  let { tag, attrs={} } = input;
  let t = tag[2] ? `[tabindex=${tag[2]}]`: '';
  let r = tag[3] ? '[required]' : '';
  let tg = `input${tag[0]}[name=${field}][type=${tag[1]}]${t}${r}`;
  
  attrs.value = attrs.fval === undefined ? fval( data[field] ) : attrs.fval(data[field]);
  //attrs.value= data[field] ? data[field] : '';
  attrs.onblur = attrs.fblur === undefined ? fblur: null;
  //attrs
  attrs = Object.assign (attrs, to_attrs);
  //console.log(attrs);
  let lt;
  if (label.length > 0 ) {
    lt = `label${label[0]}[for=${field}]`;
    // third elem only for checkbox
    if (label.length > 2) { //firstly on first render time
      
      attrs.checked = //attrs.checked ? attrs.checked :
        attrs.fcheck ? attrs.fcheck(data[field]) : Boolean(data[field]);
      delete attrs.value;
      delete attrs.onblur;
      return m(lt, m(tg, attrs), label[1]);
    }
    return [ m(lt, label[1]),  m(tg, attrs)];
  }
  return [m(tg, attrs)];

};

//export const fieldFrom = function (fromObj, field, data, to_attrs={}) {
  // fromObj - object with form fields (label, input) description
  // field - fromObj attribute name for form field (form input tag name is equal  to attr name)
  // data - object gets actual data from (model field)
  // to_attrs = additional attrs to be set to input tag

// return only fieldset html
const itForm = function(flds, func, vnode){
/*
return item form editanle item of sprav model
flds - array of fields to edit
func- function returns field represent
item - item to edit
*/
  let item; //= vnode.attrs.item;
 
  //let fld = fld;
  //let func= vnode.attrs.ffunc;
  
  return {  
    onbeforeupdate(vnode) {
      item= vnode.attrs.model.item;
    },
    view(vnode) {
      //item= vnode.attrs.model.item;
      //console.log(item);
      return m('fieldset', [
        item ? flds.map( f => m('.pure-control-group', func(f, item)) ): ''
      ]);
    },
  };
};

// label = [class, text], if null no label
// input = tag = [class, type, tabindex (int), required(bool)]
// Item object for simple model of id and name fields only
const Item= {
  id: { label: ['', "Номер"], input: {
      tag: ['.lcode', "number", 1, true],
      attrs: { autofocus: true }
    }
  },
  name: { label: ['', 'Наименование'], input: {
      tag: ['.fname[size=54]', 'text', 2],
    }
  },
};
// represent item form

const itemForm = function(vnode){
  const itf = function(f, d, a={}) { return fieldFrom(Item, f, d, a); };
  //return itForm( Object.assign( { flds: ['id', 'name'], ffunc: itf }, vnode.attrs ) );
  let flds= ['id', 'name'];
  return itForm( flds, itf, vnode );
};

// src/sprav/view/vuDoctor.js

// label = [class, text], if null no label
// input = tag = [class, type, tabindex (int), required(bool)]
const Item$1 = {
  family: { label: ['', "Фамилия"], input: {
      tag: ['', "text", 1, true],
      attrs: { autofocus: true }
    }
  },
  name: { label: ['', 'Имя'], input: {
      tag: ['.fname', 'text', 2],
    }
  },
  sname: { label: ['', 'Отчество'], input: {
      tag: ['.fname', 'text', 3],
    }
  },
  snils: { label: ['', 'СНИЛС'], input: {
      tag: ['.fname', 'text', 4, true],
    }
  },
  code: { label: ['', 'Код'], input: {
      tag: ['.lcode', 'number', 5, true],
    }
  },
  spec: { label: ['', 'Специальность'], input: {
      tag: ['.lcode', 'number', 6, true],
    }
  },
  division:  { label: ['', 'Отделение'], input: {
      tag: ['.lcode', 'number', 7],
    }
  },
  district: { label: ['', 'Участок'], input: {
      tag: ['.lcode', 'number', 8],
    }
  },
  tabid: { label: ['', 'Таб. номер'], input: {
      tag: ['.fname', 'number', 9],
    }
  }
};


const itemForm$1= function(vnode){
  let flds= ['family', 'name', 'sname', 'snils', 'code', 'spec', 'division', 'district', 'tabid'];
  const itf = function(f, d, a={}) { return fieldFrom(Item$1, f, d, a); };
  return itForm( flds, itf , vnode);
};
// clojure
const vuDoctor = function (vnode) {
  vnode.attrs.itemForm= itemForm$1;
  let view= vuSheet(vnode);
  return view
};

// src/sprav/router.moRouter.js

/*
const vuDist = function(vnode){
  return vuCatalog(vnode);
}
const vuDivs = function(vnode){
  return vuCatalog(vnode);
}
const vuSpPodr = function(vnode){
  return vuDataSheet(vnode);
}
*/
const vuSpPara = function(vnode){
  return vuSheet(vnode);
};
const vuMoLocal = function(vnode){
  return vuSheet(vnode);
};
const vuSmoLocal = function(vnode){
  return vuSheet(vnode);
};

const roLocal = {
  [spravApi.mo]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Cправочники локальные" } ) );
    }
  },
  [spravApi.mo_doct]: {
    render: function() {
      let view = m(vuDoctor, {
        model: moModel.getModel(restSprav.doctor),
        header: "Врачи",
        name: "Врач",
        filter: 3, // search in the first 3 table columns
        struct: moStruct.doctor
      });
      return vuView(view);
    }
  },
  /*
  [spravApi.mo_dist]: {
    render: function() {
      let view = m(vuDist, {
        model: moModel.getModel( restSprav.district ),
        header: "Врачебные участки",
        name: "Участок"
      });
      return vuView(view);
    }
  },
  [spravApi.mo_divs]: {
    render: function() {
      let view = m(vuDivs, {
        model: moModel.getModel( restSprav.division ),
        header: "Отделения МО",
        name: "Отделение"
      });
      return vuView(view);
    }
  },
  [spravApi.mo_podr]: {
    render: function() {
      let view = m(vuSpPodr, {
          model: moModel.getModel( restSprav.sp_podr ),
          header: "Отдеделения МО ПК",
          name: "Отделение",
          find: 2, // search in the first 1 table columns
          struct: moStruct.spPodr
        });
      return vuView(view);
    }
  },
  */
  [spravApi.mo_sp_para]: {
    render: function() {
      let view = m(vuSpPara, {
          model:  moModel.getModel( restSprav.sp_para),
          header: "Коды диагностических подразделений",
          name: "Подазделение",
          struct: idName,
          filter: 2,
      });
      return vuView(view);
    }
  },
  
  [spravApi.mo_local]: {
    render: function() {
      let view = m(vuMoLocal, {
          model: moModel.getModel( restSprav.mo_local ),
          header: "МО Приморского края",
          name: "МО",
          filter: 3, // search in the first 3 table columns
          struct: moStruct.moLocal
        });
        return vuView(view);
      }
  },
  [spravApi.mo_smo]: {
    render: function() {
      let view = m(vuSmoLocal, {
        model: moModel.getModel( restSprav.smo_local ),
        header: "СМО Приморского края",
        name: "СМО",
        struct: moStruct.smoLocal
      });
      return vuView(view);
    }
  },
};

//export const itForm = function(flds, func, vnode){
/*
return item form editanle item of sprav model
flds - array of fields to edit
func- function returns field represent
item - item to edit
*/
const Profil= {
  id: { label: ['', "Код"], input: {
      tag: ['.lcode', "number"],
      attrs: { readonly: true }
    }
  },
  name: { label: ['', 'Профиль'], input: {
      tag: ['.fname[size=54]', 'text'],
      attrs: { readonly: true }
    }
  },
  one_visit: { label: ['', "ПМУ посещение"], input: {
      tag: ['.fname[size=54]', 'text', 3],
    }
  },
  two_visit: { label: ['', "ПМУ обращени"], input: {
      tag: ['.fname[size=54]', 'text', 4],
    }
  },
  podr: { label: ['', "Подразделение"], input: {
      tag: ['.lcode', "number", 5],
    }
  },
};
const itemProfil = function(vnode){
  //return itForm( Object.assign( { flds: ['id', 'name'], ffunc: itf }, vnode.attrs ) );
  const _it = function(f, d, a={}) { return fieldFrom(Profil, f, d, a); };
  let flds= [ 'id', 'name', 'one_visit', 'two_visit', 'podr'];
  //let flds= [ 'id', 'name', 'one_visit', 'two_visit', 'podr'];
  return itForm( flds, _it, vnode );
};
//=================================================
const TarifBase= {
  name: { label: ['', "Тариф"], input: {
      tag: ['.fname[size=54]', "text"],
    }
  },
  tarif: { label: ['', 'Размер'], input: {
      tag: ['.fname[size=54]', 'text'],
    }
  },
};
const itemTarifBase = function(vnode){
  //return itForm( Object.assign( { flds: ['id', 'name'], ffunc: itf }, vnode.attrs ) );
  let flds= [ 'name', 'tarif'];
  const _it = function(f, d, a={}) { return fieldFrom(TarifBase, f, d, a); };
  return itForm( flds, _it, vnode );
};

const Fetch = {
  num_usl: { label: ['', "Номер услуги"], input: {
      tag: ['.input-find.pure-u-3-4[min=1]', "number"],
      //attrs: { placeholder: "Номер услуги" }
    }
  },
  code_usl: { label: ['', "Код услуги"], input: {
      tag: ['.input-find.pure-u-3-4', "text"],
      //attrs: { placeholder: "Код услуги" }
    }
  },
};

const pmu= function(f, d) {
  //const a= { fval: v=> v ? v : "", onkeyup: e=> d[f]= e.target.value};
  return fieldFrom(Fetch, f, d, {});
};

const pmuFind = function ( model ) {
  
  //let { model }= vnode.attrs, data={};
  let data= model.item;
  let flds= ['num_usl', 'code_usl'];
  //console.log( vnode );
  let on_submit = function (event) {
    // button FIND click event handler callback
    event.preventDefault();
    let { num_usl: nu='', code_usl: cu='' } = data, q;
    if (nu.length < 1 && cu.length < 3) return false;
    //console.log(nu, cu);
    if ( nu.length > 0) {
      q= `?ccode=gte.${nu}`;
    } else {
      q= `?code_usl=ilike.${cu}*`;
    }
    //console.log(q);
    model.url=restSprav.pmu.url + `${q}&limit=20`;
    //console.log(model.url);
    return moModel.getList(model);
    //m.redraw();
    //return false;
  };
  return fetchForm( {  on_submit, data, flds, ffunc: pmu} );
}; //func

// clojure
const vuPmu = function (vnode) {
  vnode.attrs.fetchForm= pmuFind;
  let view = vuSheet(vnode);
  return view;
};

const Item$3 = {
  ccode: { label: ['', 'Номер ПМУ'], input: {
      tag: ['.input-find.pure-u-3-4', "number"],
      //attrs: { placeholder: 'Номер' }
    }
  },
  code_podr: { label: ['', 'Подразделение'], input: {
      tag: ['.input-find.pure-u-3-4', 'number'],
      //attrs: { placeholder: 'Подразд' }
    }
  },
  code_spec: { label: ['', 'Специалист'], input: {
      tag: ['.input-find.pure-u-3-4', 'number'],
      //attrs: { placeholder: 'Спец' }
    }
  },
};
const itf$2 = function(f, d, a={}) { return fieldFrom(Item$3, f, d, a); };

const pmuForm = function (vnode) {

  let item= Object.assign({}, vnode.attrs.item);
  let fld= ['ccode', 'code_podr', 'code_spec'];
  let on_submit = function (event) {
    event.preventDefault();
    let model= Object.assign({ item: item}, restSprav.pmu );
    return moModel.formSubmit(event, model, 'PATCH');
  };
  
  return {

    view() {

      return m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", { onsubmit: on_submit },
            m("fieldset", m(".pure-g", [
              fld.map( f => m(".pure-u-1-4", itf$2(f, item))),
              m(".pure-u-1-5", 
                m('button.pure-button.pure-button-primary[type="submit"]',
                  {style: 'margin-top: 1.7em'},
                  "Сохранить")
              )
            ]))
          ) //form
        ) // u-1-2
      ); // g return
    }// view
  }; //this object
}; //func


const vuItem= function(vnode){

  let item= vnode.attrs.model.item[0];
  //console.log(item);
  let thdr= [['code_usl', 'Код ПМУ'], ['name', 'Описание'] ];
  
  let tr= it => m('tr', [thdr.map( k => m('td', it[ k[0] ]) ) ]); 
  
  return {
    view(){
      return [
        m('h2', 'Редактор ПМУ'),
        m('table.pure-table.pure-table-bordered', [
          m('thead', [thdr.map( t => m('th', t[1])) ]),
          m('tbody', tr(item))
        ]),
        m(pmuForm, {item: item}),
      ];
    }
  };
};

const Grit = {
  grup: { label: ['', 'Добавить к гуппе'], input: {
      tag: ['.input-find.pure-u-3-4', "number"],
      //attrs: { placeholder: 'Номер' }
    }
  },
};
const itg = function(f, d, a={}) { return fieldFrom(Grit, f, d, a); };

const grcForm = function (vnode) {
  
  let { model, item }= vnode.attrs;
  let _item= Object.assign({ grup: '' }, item);
  let _model= { url: restSprav.pgr.url, item: _item, change: ['code_usl', 'grup'] };
  let fld= ['grup', ];
  let on_submit = function (event) {
    event.preventDefault();
    return moModel.formSubmit(event, _model, 'POST').then( ()=> 
      moModel.getViewRpcMap(model, [ null, {code: item.code_usl}] ) );
    //console.log(model);
  };
  
  return {
    view() {
      return [ m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", { onsubmit: on_submit },
            m("fieldset", m(".pure-g", [
              fld.map( f => m(".pure-u-1-4", itg(f, _item) ) ),
              m(".pure-u-1-5", 
                m('button.pure-button.pure-button-primary[type="submit"]',
                  {style: 'margin-top: 1.7em'},
                  "Добавить")
              )
            ]))
          ) //form
        )), // u-1-2, g
        m('.pure-g', 
          m(".pure-u-1-2 ", 
            m('span#card_message',
              _model.save ? _model.save.ok ? _model.save.msg : m('span.red', _model.save.msg) : '')
          )
        )
      ]; // g return
    }// view
  }; //this object
}; //func


const vuGrups= function(vnode){
  
  let model= vnode.attrs.model;
  let item= vnode.attrs.model.item[0];
  let grup;
  //let grup= vnode.attrs.model.grup; //[0];
  //console.log(vnode.attrs.model.grup);
  let ddel= e => {
    //e.preventDefault();
    let grup= e.target.getAttribute('data');
    let _model= {
      url: `${restSprav.pgr.url}?code_usl=eq.${item.code_usl}`,
      key: 'grup',
      item: { grup: grup },
    };
    return moModel.formSubmit(e, _model, 'DELETE').then(()=>
      moModel.getViewRpcMap(model, [ null, {code: item.code_usl}] ) );
    //m.redraw();
  };
  let thdr= [['id', 'Номер группы'], ['name', 'Описание'], [null, 'Удалить из группы'] ];
  let tr= row => m('tr', [thdr.map( k => {
    let td= k[0] ? row [ k[0] ] : m('i.fa.fa-minus-circle.choice.red',
      { data: row.id, onclick: ddel });
    return m('td', td);
  }) ] ); 
  
  return {
    view(vnode){
      grup= vnode.attrs.model.grup;
      return [
        m('h3', 'ПМУ Включена в группы'),
        m(grcForm, {model: model, item: item}),
        grup ? 
        m('table.pure-table.pure-table-bordered', [
          m('thead', [thdr.map( t => m('th', t[1])) ]),
          m('tbody', [grup.map(tr)] )
        ]) : '',
      ];
    }
  };
};

const vuPmuItem = function(vnode){
  
  let { code } = vnode.attrs; //from url
  //console.log(code);
  let q= `?code_usl=eq.${code}`;
  //console.log(q);
  let model= moModel.getModel();
  model.url= [ `${restSprav.pmu.url}${q}`, `${restSprav.pgc.url}` ];
  model.method= ['GET', 'POST'];
  model.map_keys= ['item', 'grup'];
  // getViewRpcMap(model: object, data: additional data object)
  moModel.getViewRpcMap(model, [ null, {code: code}] );
  
  return {  
    onupdate() {
      //moModel.getViewRpcMap(model, [ null, {code: code}] );
    },
    view() {
      return model.error ? [ m(".error", model.error) ] :
      model.item ?
        [m(vuItem, {model: model}), m(vuGrups, {model: model} )] 
      : m(vuLoading);
    }
  };
};

const Item$4 = {
  name: { label: ['', 'Название группы'], input: {
      tag: ['.pure-u-3-4[size=64]', "text"],
    }
  },
};

const itf$3 = function(f, d, a={}) { return fieldFrom(Item$4, f, d, a); };

// add PMU to GRUP
const grupForm = function (vnode) {

  let item; // = Object.assign({}, vnode.attrs.item);
  let fld= ['name',];
  let on_submit = function (event) {
    event.preventDefault();
    let model= Object.assign({ item: item}, restSprav.pmu_grup );
    moModel.formSubmit(event, model, 'PATCH');
    //moModel.getViewRpcMap(model, [ null, {code: item.code_usl}] );
  };
  
  return {

    view(vnode) {
      item= vnode.attrs.item;
      return m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", { onsubmit: on_submit },
            m("fieldset", m(".pure-g", [
              fld.map( f => m(".pure-u-1-3", itf$3(f, item))),
              m(".pure-u-1-5", 
                m('button.pure-button.pure-button-primary[type="submit"]',
                  {style: 'margin-top: 1.7em'},
                  "Сохранить")
              )
            ]))
          ) //form
        ) // u-1-2
      ); // g return
    }// view
  }; //this object
}; //func


const vuItem$1= function(vnode){

  let item= vnode.attrs.model.item[0];
  //console.log(item);
  let thdr= [['id', 'Код группы'], ['name', 'Описание'] ];
  let tr= it => m('tr', [thdr.map( k => m('td', it[ k[0] ]) ) ]); 
  
  return {
    view(){
      return [
        m('h2', 'Редактор групп ПМУ'),
        m('table.pure-table.pure-table-bordered', [
          m('thead', [thdr.map( t => m('th', t[1])) ]),
          m('tbody', tr(item))
        ]),
        m(grupForm, {item: item}),
      ];
    }
  };
};

const Pmuf = {
  /*
  ccode: { label: ['', 'Номер'], input: {
      tag: ['.input-find.pure-u-3-4', "number"],
      //attrs: { placeholder: 'Номер' }
    }
  },
  */
  code_usl: { label: ['', 'Код ПМУ'], input: {
      tag: ['.input-find.pure-u-3-4[size=20]', "text"],
      //attrs: { placeholder: 'Номер' }
    }
  },
};
const itg$1 = function(f, d, a={}) { return fieldFrom(Pmuf, f, d, a); };

const grcForm$1 = function (vnode) {
  
  let { model, item }= vnode.attrs;
  let _item= Object.assign({ code_usl: '' }, { grup: item.id });
  let _model= { url: restSprav.pgr.url, item: _item, change: ['code_usl', 'grup'] };
  let fld= ['code_usl'];
  let on_submit = function (event) {
    event.preventDefault();
    moModel.formSubmit(event, _model, 'POST');
    moModel.getViewRpcMap(model, [ null, {grup: item.id}] );
    //console.log(model);
  };
  
  return {
    view() {
      return [ m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", { onsubmit: on_submit },
            m("fieldset", m(".pure-g", [
              fld.map( f => m(".pure-u-1-4", itg$1(f, _item) ) ),
              m(".pure-u-1-5", 
                m('button.pure-button.pure-button-primary[type="submit"]',
                  {style: 'margin-top: 1.7em'},
                  "Добавить")
              )
            ]))
          ) //form
        )), // u-1-2, g
        m('.pure-g', 
          m(".pure-u-1-2 ", 
            m('span#card_message',
              _model.save ? _model.save.ok ? _model.save.msg : m('span.red', _model.save.msg) : '')
          )
        )
      ]; // g return
    }// view
  }; //this object
}; //func


const vuPmus= function(vnode){
  
  let model= vnode.attrs.model;
  let item= vnode.attrs.model.item[0];
  let pmus;
  let ddel= e => {
    //e.preventDefault();
    let code_usl= e.target.getAttribute('data');
    let _model= {
      url: `${restSprav.pgr.url}?grup=eq.${item.id}`,
      key: 'code_usl',
      item: { code_usl },
    };
    moModel.formSubmit(e, _model, 'DELETE');
    moModel.getViewRpcMap(model, [ null, {grup: item.id}] );
    //m.redraw();
  };
  let thdr= [['code_usl', 'Код ПМУ'], ['name', 'Описание'],
    ['ccode', 'Номер'], [null, 'Удалить из группы'] ];
  let tr= row => m('tr', [thdr.map( k => {
    let td= k[0] ? row [ k[0] ] : m('i.fa.fa-minus-circle.choice.red',
      { data: row.code_usl, onclick: ddel });
    return m('td', td);
  }) ] ); 
  
  return {
    view(vnode){
      pmus= vnode.attrs.model.pmus;
      return [
        m('h3', 'В группу включены ПМУ'),
        m(grcForm$1, {model: model, item: item}),
        pmus ? 
        m('table.pure-table.pure-table-bordered', [
          m('thead', [thdr.map( t => m('th', t[1])) ]),
          m('tbody', [pmus.map(tr)] )
        ]) : '',
      ];
    }
  };
};


const vuGrupItem = function(vnode){
  
  let { grup } = vnode.attrs; //from url
  let q= `?id=eq.${grup}`;
  //console.log(q);
  let model= moModel.getModel();
  model.url= [ `${restSprav.pmu_grup.url}${q}`, `${restSprav.grc.url}` ];
  model.method= ['GET', 'POST'];
  model.map_keys= ['item', 'pmus'];
  // getViewRpcMap(model: object, data: additional data object)
  moModel.getViewRpcMap(model, [ null, {grup: grup}] );
  
  return {  
    view() {
      return model.error ? [ m(".error", model.error) ] :
      model.item ?
        [m(vuItem$1, {model: model}), m(vuPmus, {model: model} )] 
      : m(vuLoading);
    }
  };
};

const Fetch$1 = {
  code: { label: ['', "Код диагноза МКБ-10"], input: {
      tag: ['.input-find.pure-u-3-4', "text"],
      //attrs: { placeholder: "Код услуги" }
    }
  },
};

const form= function(f, d) {
  //const a= { fval: v=> v ? v : "", onkeyup: e=> d[f]= e.target.value};
  return fieldFrom(Fetch$1, f, d, {});
};

const foFind = function ( model ) {
  
  //let { model }= vnode.attrs, data={};
  let data= model.item;
  let flds= ['code'];
  let on_submit = function (event) {
    // button FIND click event handler callback
    event.preventDefault();
    let { code: co='' } = data, q;
    if (co.length < 2) return false;
    q= `?code=ilike.${co}*`;
    model.url=restSprav.mkb.url + `${q}&limit=20`;
    return moModel.getList(model);
  };
  return fetchForm( {  on_submit, data, flds, ffunc: form} );
}; //func

// clojure
const vuMkb = function (vnode) {
  vnode.attrs.fetchForm= foFind;
  let view = vuSheet(vnode);
  return view;
};

// src/sprav/router/profRouter.js

const vuSpec = function(vnode){
  return vuSheet(vnode);
};
const vuProf = function(vnode){
  return vuSheet(vnode);
};
const vuPrvs = function(vnode){
  return vuSheet(vnode);
};
const vuVidpom = function(vnode){
  return vuSheet(vnode);
};

/*
const vuPurp = function(vnode){
  return vuCatalog(vnode);
}
const vuType = function(vnode){
  return vuCatalog(vnode);
}
const vuCateg = function(vnode){
  return vuCatalog(vnode);
}
const vuIstfin = function(vnode){
  return vuCatalog(vnode);
}
const vuErrors = function(vnode){
  return vuCatalog(vnode);
}
*/
const vuPgrup = function (vnode) {
  vnode.attrs.itemForm= itemForm;
  let view= vuSheet(vnode);
  return view;
};

const roProf = {
  [spravApi.prof]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Профильные справочники" } ) );
    }
  },
  
  [spravApi.prof_spec]: {
    render: function() {
      let view = m(vuSpec, {
          model:  moModel.getModel( restSprav.doc_spec ),
          header: "Коды врачебных специальностей",
          name: "Специальность",
          struct: moStruct.doc_spec,
          filter: 2,
      });
      return vuView(view);
    }
  },
  [spravApi.prof_prof]: {
    render: function() {
      let view = m(vuProf, {
          model:  moModel.getModel( restSprav.profil),
          header: "Профили помощи",
          name: "Профиль",
          struct: moStruct.profil,
          itemForm: itemProfil,
          filter: 2,
      });
      return vuView(view);
    }
  },
  [spravApi.prof_prvs]: {
    render: function() {
      let view = m(vuPrvs, {
          model:  moModel.getModel( restSprav.prvs),
          header: "Специальности V021",
          name: "Специальность",
          struct: idName,
          filter: 2
      });
      return vuView(view);
    }
  },
  [spravApi.prof_vidpom]: {
    render: function() {
      let view = m(vuVidpom, {
          model:  moModel.getModel( restSprav.vidpom),
          header: "Вид помощи",
          name: "Вид",
          struct: idName,
          filter: 2
      });
      return vuView(view);
    }
  },
  [spravApi.prof_pmus]: {
    render: function() {
      let view = m(vuPmu, {
          model:  moModel.getModel( restSprav.pmu ),
          header: "Простые мед. усдуги",
          name: "Услуга",
          href: spravApi.prof_pmus,
          struct: moStruct.pmu
      });
      return vuView(view);
    }
  },
  [spravApi.prof_pmu_code] : {
    onmatch: function(args) {
      return vuPmuItem;
    },
    render : function(vnode) {
         return vuView( vnode );
      }
  },
  [spravApi.prof_pgrup]: {
    render: function() {
      let view = m(vuPgrup, {
          model:  moModel.getModel( restSprav.pmu_grup ),
          header: "Гуппы ПМУ ",
          name: "Группа",
          filter: 2,
          struct: idName,
          href: spravApi.prof_pgrup,
      });
      return vuView(view);
    }
  },
  [spravApi.prof_pmu_grup]: {
    onmatch: function(args) {
      return vuGrupItem;
    },
    render : function(vnode) {
        return vuView( vnode );
      }
  },
  [spravApi.prof_mkb]: {
    render: function() {
      let view = m(vuMkb, {
          model:  moModel.getModel( restSprav.mkb),
          header: "МКБ - 10",
          name: "Диагноз",
          struct: moStruct.mkb
      });
      return vuView(view);
    }
  },
  /*
  [spravApi.tfoms_purp]: {
    render: function() {
      let view = m(vuPurp, {
          model:  moModel.getModel( restSprav.purp ),
          header: "Цели обращения",
          name: "Цель"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_type]: {
    render: function() {
      let view = m(vuType, {
          model:  moModel.getModel( restSprav.type ),
          header: "Особый случай",
          name: "Случай"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_insur]: {
    render: function() {
      let view = m(vuCateg, {
          model:  moModel.getModel( restSprav.insur),
          header: "Категории ОМС",
          name: "Категория"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_istfin]: {
    render: function() {
      let view = m(vuIstfin, {
          model:  moModel.getModel( restSprav.istfin ),
          header: "Источники финансирования",
          name: "Источник"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_errors]: {
    render: function() {
      let view = m(vuErrors, {
          model:  moModel.getModel( restSprav.errors ),
          header: "Причины отказов",
          name: "Причина"
      });
      return vuView(view);
    }
  },
  */
};

// src/sprav/router/profRouter.js

const vuDul = function(vnode){
  return vuSheet(vnode);
};
const vuOkato = function(vnode){
  return vuSheet(vnode);
};

const roCom = {
  [spravApi.com]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Общие справочники" } ) );
    }
  },
  
  [spravApi.com_dul]: {
    render: function() {
      let view = m(vuDul, {
          model:  moModel.getModel( restSprav.dul ),
          header: "Документ удостоверяющий личнось",
          name: "Документ",
          struct: moStruct.dul,
          filter: 2
      });
      return vuView(view);
    }
  },
  [spravApi.com_okato]: {
    render: function() {
      let view = m(vuOkato, {
          model:  moModel.getModel( restSprav.okato),
          header: "ОКАТО",
          name: "ОКАТО",
          struct: moStruct.okato,
          filter: 3
      });
      return vuView(view);
    }
  },

};

// label = [class, text], if null no label
// input = tag = [class, type, tabindex (int), required(bool)]

const Item$5 = {
  code: { label: ['', "Код услуги"], input: {
      tag: ['', "text"],
      attrs: { readonly: true }
    }
  },
  tarif: { label: ['', 'Тариф'], input: {
      tag: ['', 'text'],
    }
  },
};

const itemForm$3 = function(vnode){
  let item; //= vnode.attrs.item;
  const _it = function(f, d, a={}) { return fieldFrom(Item$5, f, d, a); };
  let fld = ['code', 'tarif'];
  const fld_fun= item=> {
    return [
      fld.map( f => m('.pure-control-group', _it(f, item)) ),
      m('span', item.name )
    ];  
  };
  return {  
    onbeforeupdate(vnode) {
      item= vnode.attrs.model.item;
    },
    view() {
      //item= vnode.attrs.model.item;
      //console.log(item);
      return m('fieldset', [
        item ? fld_fun(item) : ''
      ]);
    },
  };
};

const Fetch$2 = {
  code: { label: ['', "Код услуги"], input: {
      tag: ['.input-find.pure-u-3-4', "text"],
      //attrs: { placeholder: "Код услуги" }
    }
  },
};

const pmu$1= function(f, d) {
  //const a= { fval: v=> v ? v : "", onkeyup: e=> d[f]= e.target.value};
  return fieldFrom(Fetch$2, f, d, {});
};

const pmuFind$1 = function ( model ) {
  
  //let { model }= vnode.attrs, data={};
  let data= model.item;
  let flds= ['code'];
  //console.log( vnode );
  let on_submit = function (event) {
    // button FIND click event handler callback
    event.preventDefault();
    let { code: cu='' } = data, q;
    if ( cu.length < 3) return false;
    q= `?code=ilike.${cu}*`;
    model.url=restSprav.tarif_pmu_vzaimo.url + `${q}&limit=20`;
    return moModel.getList(model);
  };
  return fetchForm( {  on_submit, data, flds, ffunc: pmu$1} );
}; //func

// clojure
const vuTarifPmuVzaimo = function (vnode) {
  vnode.attrs.fetchForm= pmuFind$1;
  vnode.attrs.itemForm= itemForm$3;
  let view = vuSheet(vnode);
  return view;
};

// src/sprav/router/profRouter.js

const vuBase = function(vnode){
  return vuSheet(vnode);
};

const roTarif = {
  [spravApi.tarif]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Тарифы ТТС" } ) );
    }
  },
  
  [spravApi.tarif_base]: {
    render: function() {
      let view = m(vuBase, {
          model:  moModel.getModel( restSprav.tarif_base ),
          header: "Базовые тарифы и коэфициенты",
          name: "Тфриф",
          struct: moStruct.tarif_base,
          itemForm: itemTarifBase,
      });
      return vuView(view);
    }
  },
  
  [spravApi.tarif_pmu_vzaimo]: {
    render: function() {
      let view = m(vuTarifPmuVzaimo, {
          model:  moModel.getModel( restSprav.tarif_pmu_vzaimo ),
          header: "Тарифы на ПМУ по взаиморасчетам",
          name: "Тариф",
          struct: moStruct.tarif_pmu_vzaimo,
      });
      return vuView(view);
    }
  },
  
};

// src/sprav/router_sprav.js

const spravRouter = { [spravApi.root]: {
    render: function() {
       return m(vuMain, spravMenu,
          m(vuSprav, { text: "Медстатистика: Справочники" }));
    }
  }
};

Object.assign(spravRouter, roLocal, roProf, roCom, roTarif); //roOnko);

//m.route(document.getElementById('content'), "/", {})
m.route(document.body, "/", spravRouter);
