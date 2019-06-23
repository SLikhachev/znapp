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

// editable - array of bools as [ add, edit, del ]

const restApi$1 = {
    // local
    get doctor() {
        return { url:"doctor", options: [ this.division, this.district ], sort_by: 'code',
        editable: [true, true, true] };
    },
    district: { url:"district"},
    division: { url:"division"},
    sp_podr: { url:"sp_podr", sort_by: 'mo_code' },
    sp_para: { url:"sp_para"},
    purp: { url: 'purpose'},
    mo_local: { url:"mo_local"},
    smo_local: { url:"smo_local"},
    // prof
    doc_spec : { url:"spec_prvs"}, // view name
    prof: { url: 'profil' },
    prvs: { url: 'prvs' },
    vidpom: { url: 'vidpom' },
    pmu: { url: 'pmu', editable: [false, true, false] },
    pmu_grup: { url: 'pmu_grup' },
    mkb: { url: 'mkb10'},
    type: {url: 'spec_case'},
    insur: {url: 'kategor'},
    istfin: {url: 'ist_fin'},
    errors: {url: 'errors_code'},
    
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
    
};

const spravApi = {
    root: "/",
    mo: "/mo",
    mo_doct: "/mo/doct",
    //mo_dist:  "/mo/dist-list", // участки
    //mo_divs: "/mo/divs-list", //отделения
    //mo_podr: "mo/podr", //подразделения
    //mo_sp_podr: "mo/sp_podr", //вспомогательные
    mo_sp_para: "mo/sp_para", // paraclin
    mo_local: "/mo/mo_local",
    mo_smo: "/mo/smo_local",
    //mo_org: "/mo/org," //ораганизации (договоры, профосмотьры)
    //
    prof: "/prof",
    prof_spec: "/prof/spec", //специальности првс профиль
    prof_prof: "/prof/prof", //профили с кодами услуг
    prof_prvs: "/prof/prvs", //првс
    prof_vidpom: "/prof/vidpom",
    prof_pmu: "/prof/pmu",
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
    com_okato: "/com/okato"
    
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
      [`#!${spravApi.prof_pmu}`, "ПМУ"],
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
  
  open (vnode=null) {
    vuDialog.dialog.showModal();
    return false;
  },
  
  close (reload=false) { //e - EventObject
    //let srverr = document.getElementById('srv-error');
    //let srverr = vuDialog.dialog.querySelector('#srv-error');
    //if ( !!srverr ) srverr.parentNode.removeChild(srverr);
    vuDialog.dialog.querySelector('form').reset();
    vuDialog.dialog.close();
    if ( reload ) m.redraw();
    return false;
  },
};

// src/apps/model/moModel.js

//const pg_rest = window.localStorage.getItem('pg_rest'); //postgest schemaRest;
//console.log(schema);

const moModel = {
  
  // :: String -> Array -> String -> Object
  // ret models object (POJO)
  getModel( {url=null, method="GET", options=null, sort_by=null, editable=null } = {} ) {
    // url - string of model's REST url
    // method - string of model's REST method
    // options - array of strings of option tables names
    // need for form data select/option if any
    // field - string "sort by" with SELECT
    // editable = bool defines is model could changed
    let model = {
      url: url,
      method: method,
      field: sort_by,
      options: options,
      //editable: editable,
      
      list: null, // main data list (showing in table page)
      data: new Map(), // every idx corresponds with index of options array
      item: null,
      error: null, // Promise all error
      order: true, // for list
      sort: null, // for list
      save: null,
    };  
    if ( Boolean( editable ) && editable instanceof Array) {
      for (let [idx, val] of ['add', 'edit', 'del'].entries() ) {
        if (Boolean( editable[idx] )) model[val] = true;
      }
    }
    model.sort= field => moModel.sort(model, field);
    model.getItem= id => {
      model.item= {};
      if (id === null) return false; 
      for ( let it of model.list ) {
        if (it.id == id) {
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
    // filed - sort by with SELECT, default 'id' field
    //let schema = window.localStorage.getItem('pg_rest');
    let pg_rest = window.localStorage.getItem('pg_rest');
    let id = model.field ? model.field : 'id',
    sign= model.url.includes('?') ? '&': '?';
    order = `${sign}order=${id}.asc`;
    let url = pg_rest + model.url + order;
    console.log(url);
    return m.request({
      method: model.method,
      url: url
    }).then(function(res) {
      model.list = res; // list of objects
      model.order = true;
      return true;
    }).catch(function(e) {
      //console.log(e);
      let err = JSON.parse(e.message);
      model.error = err.message ? err.message : e.message;
      console.log( err );
    });
  },
  // :: Object -> undef
  // return Promise all
  getData(model){
    if ( model.options === null ) return false;
    //let schema = window.localStorage.getItem('pg_rest');
    let pg_rest = window.localStorage.getItem('pg_rest');
    let data = [],
    order = '?order=id.asc';
    model.options.forEach ( (t) => {
      let r = m.request({
        method: t.method ? t.method : "GET" ,
        url: pg_rest + t.url + order
      });
      data.push(r);
    });
    // order should preserved
    return Promise.all(data).then( (lists) => {
      model.data.clear(); // = new Map();
      for ( let el of model.options.entries() ) {
        model.data.set( el[1].url, lists[ el[0] ]);
      }
      //window.localStorage.setItem(model.opt_name, model.data);
      //model.data = _.zipObject( model.options, lists);
      //console.log( model.list );
    }).catch(function(e) {
      //model.error = e.message;
      console.log(e.message);
      alert(e.message);
    });
    
  },
  
  // :: Object -> String -> String -> Object -> Promise
  // return Promise
  getViewRpc (model, data, url=null, method=null) {
    //let schema = window.localStorage.getItem('pg_rest');
    let pg_rest = window.localStorage.getItem('pg_rest');
    let _url = url ? url : model.url;
    let _method = method ? method : model.method;
    return m.request({
      url: pg_rest + _url,
      method: _method,
      data: data,
      
    }).then(function(res) {
      model.list = res; // list of objects
      model.order = true;
    }).catch(function(e) {
      console.log(e);
      let err = JSON.parse(e.message);
      model.error = err.message ? err.message : e.message;
      console.log( err );
    });
  },

  getViewRpcMap (model, data) {
    let pg_rest = window.localStorage.getItem('pg_rest');
    let reqs = [];
    for (let [idx, url] of model.url.entries()) {
      let r = m.request({
        method: model.method[idx],
        url: pg_rest + url,
        data: data
      });
      reqs.push(r);
    }
    // order should preserved
    return Promise.all(reqs).then( (lists) => {
      // map data must be Map
      //model.map_data.clear(); // = new Map();
      for ( let [idx, key] of model.map_keys.entries() ) {
        //model.map_data.set( name, lists[ idx ]);
        model[key] = lists[idx];
      } 
      return true;
      return Promise.resolve(true);
    }).catch(function (e) {
      console.log(e);
      let err = JSON.parse(e.message);
      model.error = err.message ? err.message : e.message;
    });
  },

  sort(model, id=null) {
    //console.log(id);
    let order = model.order ? 'desc' : 'asc';
    let field = id ? id : 'id'; 
    model.list = _.orderBy(model.list, [ field ], [ order ]);
    model.order = !model.order;
  },
  
  /** getFormData
    return item's data object 
  */
  /*
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
  */
  /** formSubmit
    return false    
  */
  dialogFormSubmit(event, model, method) {
    event.target.parentNode.classList.add('disable');
    let pg_rest = window.localStorage.getItem('pg_rest');
    let url = pg_rest + model.url;
    if ( method == 'DELETE' || method == 'PATCH' )
      url += '?' + 'id=eq.' + model.item.id;
    let data= Object.assign({}, model.item);
    
    for ( let k of Object.keys(data) ){
      if ( data[k] === '' ) data[k] = null;
    }
    
    return m.request({
      url: url,
      method: method,
      data: data,
      async: false
    }).then( res => {
      model.save = { err: false, msg: res };
      event.target.parentNode.classList.remove('disable');
      moModel.getList( model );
      vuDialog.close();
    }).catch( err => {
      let e = JSON.parse(err.message);
      model.save = { err: true, msg: e.message ? e.message : err.message };
      event.target.parentNode.classList.remove('disable');
      //console.log(model.save);
    });
    
    return false;
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

// src/sprav/view/vuSprav.js

const change= function(e, model, method, word) {
    //console.log(word);
    e.preventDefault();
    item_id= e.target.getAttribute('data');
    vuForm.method= method;
    vuForm.word= word;
    model.getItem(item_id);
    vuDialog.open();
    return false;
  };

// Forms in dialog window for catalogs 
const vuForm = {
  
  item: null,
  method: "",
  word: "",
  model: null,
  name: "",
  
  onSubmit(e) {
    e.preventDefault();
    if (vuForm.model !== null && vuForm.model.item !== null) {
      moModel.dialogFormSubmit(e, vuForm.model, vuForm.method);
    }
    //vuDialog.close();
    return false;
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

const vmFind = {
  
  trCols: 2, // how many tr childern (table columns) get to find 
  toFind: "",
  setFind: function(e) {
    let str = e.target.value; 
    vmFind.toFind = str.toLowerCase();
    $.each( $('table#find_table tbody tr'), function(ind, tr) {
      let subtr = $(tr).children().slice(0,vmFind.trCols);
      //console.log( subtr );
      if (subtr.text().toLowerCase().indexOf(vmFind.toFind) === -1) {
        $(tr).hide();
      } else {
        $(tr).show();
      }
      m.redraw();
    });
  }
  
};

const vuFind = {
  
  model: null,
  
  addItem(e) {
    e.preventDefault();
    vuForm.method= 'POST';
    vuForm.word= 'Добавить';
    vuFind.model.getItem(null);
    vuDialog.open();
    return false;
  },
  
  oninit(vnode) {
    vuFind.model= vnode.attrs.model;
    vmFind.trCols = vnode.attrs.cols ? vnode.attrs.cols : 2;
    vmFind.toFind = "";
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
                  onkeyup: vmFind.setFind,
                  value: vmFind.toFind
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
                vnode.attrs.model.add ? 
                m('button.pure-button.pure-button-primary[type="button"]', {
                    onclick: vuFind.addItem
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
  
  pmu: {
    code_usl: ['Код услуги'],
    name: ['Наименование'],
    code_podr: ['Подразд.'],
    code_spec: ['Спец.']
  },
  
  // tfoms
  spPodr: {
    mo_code: ["Код", true],     
    id_otd: ['Код отделения'],
    name_otd: ['Наименование'],
    profil: ['Код профиля'],
    prof_name: ['Наименвание профиля']
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

// src/sprav/view/vuCatalog.js

const itemForm = function(vnode) {
  let item; // = vnode.attrs.item;
  
  return {
    view(vnode) {
      item = vnode.attrs.item;
      //ro = vnode.attrs.method === 'DELETE' ? true : false;
    
      return m('fieldset', [
        m('.pure-control-group', [
          m('label[for=code]', 'Код'),
          m('input.fcode[id=code][type=number][name=id]', {
            value: item.id ? item.id : '',
            readonly: item.id ? true : false, //id is auto
          }),
          item.id ? m('span.pure-form-message-inline', 'Поле не редактируется.') : ''
        ]),
        m('.pure-control-group', [
          m('label[for=desc]', this.name),
          m('textarea[id=desc][name=name][cols=40]',
            item.name ? item.name : '')
        ])
      ]);
    },
  };
};

// clojure
const vuCatalog = function(vnode) {
  
  let model = vnode.attrs.model,
  header = vnode.attrs.header,
  name = vnode.attrs.name;
  
  const edit= function(e) {
    return change(e, model, 'PATCH', 'Изменить');
  };
  const ddel= function(e) {
    return change(e, model, 'DELETE', 'Удалить');
  };
  const sort=  e=> {
    e.preventDefault();
    return model.sort(e.target.getAttribute('data'));
  };
  
  return {
  
    oninit () {
     moModel.getList( model );
   //console.log(name);
    },
  
    listMap (s) {
      return m('tr', [
        m('td.choice.blue', {
            data: s.id,
            onclick: model.editable ? edit : ''
        }, s.id),
      m('td', s.name),
      model.editable ? 
      m('td', 
        m('i.fa.fa-minus-circle.choice.red', {
          data: s.id,
          onclick: ddel
        })
      ) : ''
    ]);
  },

  view () {
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        m(vuTheader, { header: header} ),
        m(vuFind, {cols: 2, model: modelObject} ),
        //
        m('table.pure-table.pure-table-bordered[id="find_table"]', [
          m('thead', [
            m('tr', [
              m('th.choice', {data: "id", onclick: sort },
                ["Код", m('i.fa.fa-sort.pl10')] ),
              m('th', name),
              model.editable ? m('th', "Удалить") : '',
            ])
          ]),
          m('tbody', [model.list.map( this.listMap ) ] )
        ]),
        model.editable ? 
          m(vuDialog, { header: header, word: vuForm.word },
            m(vuForm, { model: model, name: name },
              m(itemForm, { model: model, method: vuForm.method  } )
            ) 
          ) : ''
      ] : m(vuLoading);
    },
  };
};
//

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
  attrs.onblur = attrs.fblur === undefined ? fblur: null;
  attrs = Object.assign (attrs, to_attrs);

  let lt;
  if (label.length > 0 ) {
    lt = `label${label[0]}[for=${field}]`;
    // third elem only for checkbox
    if (label.length > 2) {
      attrs.checked = attrs.checked ? attrs.checked :
        attrs.fcheck ? attrs.fcheck(data[field]) : data[field] === 0;
      return m(lt, m(tg, attrs), label[1]);
    }
    return [ m(lt, label[1]),  m(tg, attrs)];
  }
  return [m(tg, attrs)];

};

// src/sprav/view/vuDataSheet.js

// DataSheet view: assumes model is not a simple list of records
// { id, name }, but has definitely struct defined in Struct module 
// clojure
const vuDataSheet = function (vnode) {
  
  let modelObject = vnode.attrs.model, // model Object
    headerString = vnode.attrs.header, // String: page header 
    nameString = vnode.attrs.name, // String: models item name 
    findInt = vnode.attrs.find, // Int: how many cols include in find function
    structObject = vnode.attrs.struct; // the struct Object
  
  //let item, method;
  
  const edit= function(e) {
    return change(e, modelObject, 'PATCH', 'Изменить');
  };
  const ddel= function(e) {
    return change(e, modelObject, 'DELETE', 'Удалить');
  };
  
  const sort=  e=> {
    e.preventDefault();
    return modelObject.sort(e.target.getAttribute('data'));
  };
  
  return {
    
    oninit () {
      moModel.getList( modelObject );
      moModel.getData( modelObject );
    },
    //onbeforeupdate() {
      //moModel.getList( modelObject );
      //moModel.getData( modelObject );
    //},
    listMap (s) {
      //let id = s.code + ' ' + s.spec;
      let first = true;
      return m('tr', [
        Object.keys(structObject).map( (column) => {
          let td = first ? m('td.choice.blue', {
            data:  s.id, // every item must have id attr
            onclick: modelObject.edit ? edit : ''
          }, s[column]) : m('td', s[column]);
          first = false;
          return td;
        }),
        modelObject.del ? 
        m('td', m('i.fa.fa-minus-circle.choice.red', {
          data: s.id,
          onclick: ddel
        }) ) : ''
      ]);
    },

    view () {
      return modelObject.error ? [ m(".error", modelObject.error) ] :
        modelObject.list ? [
          m(vuTheader, { header: headerString} ),
          m(vuFind, {cols: findInt, model: modelObject} ),
        
          m('table.pure-table.pure-table-bordered[id=find_table]', [
            m('thead', [
              m('tr', [
                Object.keys(structObject).map( (column) => {
                  let field = structObject[column];
                  return field.length > 1 ? m('th.sortable',
                    { data: column, onclick: sort },
                    [field[0], m('i.fa.fa-sort.pl10')]
                    ) : m('th', field[0]);
                }),
                modelObject.del ? m('th', "Удалить") : ''
              ])
            ]),
            m('tbody', [modelObject.list.map( this.listMap )] )
          ]),
          modelObject.edit ? this.itemForm ? // set in parent view if any
          m(vuDialog,
            { header: headerString,
              word: vuForm.word
            }, m(vuForm, { model: modelObject, name: nameString },
                m(this.itemForm, { model: modelObject, method: vuForm.method } )
             )
          ) : m('h2', 'Не определена форма редактирования объекта') : ''
        
        ] : m(vuLoading);
    }
  }; //return this object
};

// src/sprav/view/vuDoctor.js

// label = [class, text], if null no label
// input = tag = [class, type, tabindex (int), required(bool)]
const Item = {
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
const itf = function(f, d, a={}) { return fieldFrom(Item, f, d, a); };

const itemForm$1 = function(vnode){
  let item; //= vnode.attrs.item;
 
  //ro = vnode.attrs.method === 'DELETE' ? true : false;
  let fld = ['family', 'name', 'sname', 'snils', 'code', 'spec', 'division', 'district', 'tabid'];
  return {  
    onbeforeupdate(vnode) {
      item= vnode.attrs.model.item;
    },
    view(vnode) {
      //item= vnode.attrs.model.item;
      //console.log(item);
      return m('fieldset', [
        item ? fld.map( f => m('.pure-control-group', itf(f, item)) ): ''
      ]);
    },
  };
};
// clojure
const vuDoctor = function (vnode) {
  let view = vuDataSheet(vnode);
  view.itemForm = itemForm$1;
  return view;
};

// src/clinic/view/vuMoLocal.js

//POJO
const itemForm$2 = {
    
  view(vnode) {
    let item = vnode.attrs.item,
    ro = vnode.attrs.method === 'DELETE' ? true : false;
    return m('fieldset', [      
      m('input[type=hidden][name=id]', {value: item ? item.id : '' } ),
      m('.pure-control-group', [
        m('label[for=code]', 'Код MO'),
        m('input.lcode[id=code][type=text][name=code]', {
          value: item ? item.code : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        }),
      ]),
      m('.pure-control-group', [
        m('label[for=scode]', 'Код MO для ТФОМС'),
        m('input.fcode[id=scode][type=text][name=scode]', {
          value: item ? item.scode : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        }),
      ]),
      m('.pure-control-group', [
        m('label[for=sname]', 'Наименование кратко'),
        m('textarea[id=sname][name=sname][cols=40]',
          {readonly: ro},
          item ? item.sname : '')
      ]),
      m('.pure-control-group', [
        m('label[for=name]', 'Наименование полное'),
        m('textarea[id=name][name=name][cols=40]',
          {readonly: ro},
          item ? item.name : '')
      ]),
    ]);
  },
};
// clojure
const vuMoLocal = function (vnode) {
  let view = vuDataSheet(vnode);
  view.itemForm = itemForm$2;
  return view;
};

// src/clinic/view/vuSmoLocal.js

//POJO
const itemForm$3 = {
    
  view(vnode) {
    let item = vnode.attrs.item,
    ro = vnode.attrs.method === 'DELETE' ? true : false;
    return m('fieldset', [      
      m('input[type=hidden][name=id]', {value: item ? item.id : '' } ),
      m('.pure-control-group', [
        m('label[for=code]', 'Код СMO'),
        m('input.lcode[id=code][type=text][name=code]', {
          value: item ? item.code : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        }),
      ]),
      m('.pure-control-group', [
        m('label[for=okato]', 'СМО ОКАТО'),
        m('input.fcode[id=okato][type=text][name=okato]', {
          value: item ? item.okato : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        }),
      ]),
      m('.pure-control-group', [
        m('label[for=sname]', 'Наименование'),
        m('textarea[id=name][name=name][cols=40]',
          {readonly: ro},
          item ? item.name : '')
      ]),
    ]);
  },
};
// clojure
const vuSmoLocal = function (vnode) {
  let view = vuDataSheet(vnode);
  view.itemForm = itemForm$3;
  return view;
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
  return vuCatalog(vnode);
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
        model: moModel.getModel(restApi$1.doctor),
        header: "Врачи",
        name: "Врач",
        find: 3, // search in the first 3 table columns
        struct: moStruct.doctor
      });
      return vuView(view);
    }
  },
  /*
  [spravApi.mo_dist]: {
    render: function() {
      let view = m(vuDist, {
        model: moModel.getModel( restApi.district ),
        header: "Врачебные участки",
        name: "Участок"
      });
      return vuView(view);
    }
  },
  [spravApi.mo_divs]: {
    render: function() {
      let view = m(vuDivs, {
        model: moModel.getModel( restApi.division ),
        header: "Отделения МО",
        name: "Отделение"
      });
      return vuView(view);
    }
  },
  [spravApi.mo_podr]: {
    render: function() {
      let view = m(vuSpPodr, {
          model: moModel.getModel( restApi.sp_podr ),
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
          model:  moModel.getModel( restApi$1.sp_para),
          header: "Коды диагностических подразделений",
          name: "Подазделение"
      });
      return vuView(view);
    }
  },
  
  [spravApi.mo_local]: {
    render: function() {
      let view = m(vuMoLocal, {
          model: moModel.getModel( restApi$1.mo_local ),
          header: "МО Приморского края",
          name: "МО",
          find: 3, // search in the first 3 table columns
          struct: moStruct.moLocal
        });
        return vuView(view);
      }
  },
  [spravApi.mo_smo]: {
    render: function() {
      let view = m(vuSmoLocal, {
        model: moModel.getModel( restApi$1.smo_local ),
        header: "СМО Приморского края",
        name: "СМО",
        find: 2, // search in the first 3 table columns
        struct: moStruct.smoLocal
      });
      return vuView(view);
    }
  },
};

// src/sprav/view/vuComboSheet.js

// this for pmu yet

// clojure
const vuItemSheet = function (vnode) {
  
  let modelObject = vnode.attrs.model, // model Object
    headerString = vnode.attrs.header, // String: page header 
    //findString= vnode.attrs.findstr, // find help string
    //listMap = vnode.attrs.listMap, // list mapping function
    findForm = vnode.attrs.findForm, // form to find
    //nameString = vnode.attrs.name, // String: models item name
    filterForm = vnode.attrs.filter, //
    structObject = vnode.attrs.struct; // the struct Object
  // init - show only find form initially
  let load = false;
  
  const edit= function(e) {
    return change(e, modelObject, 'PATCH', 'Изменить');
  };
  
  let listMap= function(s) {
    let first = true;
    return m('tr', [
      Object.keys(structObject).map( (column) => {
        let td = first ? m('td.choice.blue', {
          data:  s.id, // every item must have id attr
          onclick: modelObject.edit ? edit : ''
        }, s[column]) : m('td', s[column]);
        first = false;
        return td;
      })
    ]);
  };
  
  return {
    
    oninit () {
      //moModel.getList( vnode.attrs.model );
      //moModel.getData( vnode.attrs.model );
    },
    onupdate() {
      load = true; 
    },

    view: function () {
     
      return [
        m(vuTheader, {header: headerString}),
        m(findForm, {model: modelObject}),
//        init ? m('h1.blue', {style: "font-size: 1.2em;"}, `${findString}`) :
          modelObject.error ? [m(".error", modelObject.error)] :
            modelObject.list ? [
              filterForm ? m(filterForm): '' ,
              m('table.pure-table.pure-table-bordered[id=find_table]', [
                m('thead', m('tr',
                  Object.keys(structObject).map( (column) => {
                    return m('th', structObject[column][0]);
                  })  // not sorted
                )),
                m('tbody', [modelObject.list.map(listMap)])
              ])
            ] : load ? m(vuLoading): ''
        ];
    }
  }; //return this object
};

const pmuFind = function (vnode) {
  
  let model=vnode.attrs.model, data={};
  
  let on_submit = function (event) {
    // button FIND click event handler callback
    event.preventDefault();
    let cu= data.code_usl;
    if (cu.length < 3) return false;
    model.url=restApi$1.pmu.url + `?code_usl=ilike.${cu}*&limit=20`;
    return moModel.getList(model);
    //m.redraw();
    //return false;
  };

  return {

    oninit(vnode) {
      //vnode.attrs.model.method='POST';
      //vnode.attrs.model.url =restApi.onko_n6.url;
    },

    view(vnode) {

      return m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", { onsubmit: on_submit },
            m("fieldset", m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[name=code_usl][type='text']",
                  { placeholder: "Код услуги",
                    onkeyup: e=> data.code_usl= e.target.value,
                    value: data.code_usl
                })
              ),
              /*
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[name=stady][type='search']",
                  {placeholder: "Стадия (число)"}
                )
              ),
              */
              m(".pure-u-1-5",
                m('button.pure-button.pure-button-primary[type="submit"]', "Выбрать")
              )
            ]))
          ) //form
        ) // u-1-2
      ); // g return
    }// view
  }; //this object
}; //func

// src/sprav/router/profRouter.js

const vuSpec = function(vnode){
  return vuCatalog(vnode);
};
const vuProf = function(vnode){
  return vuDataSheet(vnode);
};
const vuPrvs = function(vnode){
  return vuDataSheet(vnode);
};
const vuVidpom = function(vnode){
  return vuDataSheet(vnode);
};
const vuPmu = function(vnode){
  return vuItemSheet(vnode);
};
const vuMkb = function(vnode){
  return vuDataSheet(vnode);
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
const roProf = {
  [spravApi.prof]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Профильные справочники" } ) );
    }
  },
  
  [spravApi.prof_spec]: {
    render: function() {
      let view = m(vuSpec, {
          model:  moModel.getModel( restApi$1.doc_spec ),
          header: "Коды врачебных специальностей",
          name: "Специальность"
      });
      return vuView(view);
    }
  },
  [spravApi.prof_prof]: {
    render: function() {
      let view = m(vuProf, {
          model:  moModel.getModel( restApi$1.prof),
          header: "Профили помощи",
          name: "Профиль"
      });
      return vuView(view);
    }
  },
  [spravApi.prof_prvs]: {
    render: function() {
      let view = m(vuPrvs, {
          model:  moModel.getModel( restApi$1.prvs),
          header: "Специальности V021",
          name: "Специальность"
      });
      return vuView(view);
    }
  },
  [spravApi.prof_vidpom]: {
    render: function() {
      let view = m(vuVidpom, {
          model:  moModel.getModel( restApi$1.vidpom),
          header: "Вид помощи",
          name: "Вид"
      });
      return vuView(view);
    }
  },
  [spravApi.prof_pmu]: {
    render: function() {
      let view = m(vuPmu, {
          model:  moModel.getModel( restApi$1.pmu),
          header: "Простые мед. усдуги",
          //name: "Услуга",
          findForm: pmuFind,
          struct: moStruct.pmu
          
      });
      return vuView(view);
    }
  },
  [spravApi.prof_mkb]: {
    render: function() {
      let view = m(vuMkb, {
          model:  moModel.getModel( restApi$1.mkb),
          header: "МКБ - 10",
          name: "Диагноз"
      });
      return vuView(view);
    }
  },
  /*
  [spravApi.tfoms_purp]: {
    render: function() {
      let view = m(vuPurp, {
          model:  moModel.getModel( restApi.purp ),
          header: "Цели обращения",
          name: "Цель"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_type]: {
    render: function() {
      let view = m(vuType, {
          model:  moModel.getModel( restApi.type ),
          header: "Особый случай",
          name: "Случай"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_insur]: {
    render: function() {
      let view = m(vuCateg, {
          model:  moModel.getModel( restApi.insur),
          header: "Категории ОМС",
          name: "Категория"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_istfin]: {
    render: function() {
      let view = m(vuIstfin, {
          model:  moModel.getModel( restApi.istfin ),
          header: "Источники финансирования",
          name: "Источник"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_errors]: {
    render: function() {
      let view = m(vuErrors, {
          model:  moModel.getModel( restApi.errors ),
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
  return vuCatalog(vnode);
};
const vuOkato = function(vnode){
  return vuCatalog(vnode);
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
          model:  moModel.getModel( restApi.dul ),
          header: "Документ удостоверяющий личнось",
          name: "Документ"
      });
      return vuView(view);
    }
  },
  [spravApi.com_okato]: {
    render: function() {
      let view = m(vuOkato, {
          model:  moModel.getModel( restApi.okato),
          header: "ОКАТО",
          name: "ОКАТО"
      });
      return vuView(view);
    }
  },

};

// src/sprav/router_sprav.js
//import { roOnko } from './router/roOnko.js';

const spravRouter = { [spravApi.root]: {
    render: function() {
       return m(vuMain, spravMenu,
          m(vuSprav, { text: "Медстатистика: Справочники" }));
    }
  }
};

Object.assign(spravRouter, roLocal, roProf, roCom); //roOnko);

//m.route(document.getElementById('content'), "/", {})
m.route(document.body, "/", spravRouter);
