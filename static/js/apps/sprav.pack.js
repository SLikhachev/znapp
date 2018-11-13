// apps/apiConf.js

//const moName = "Поликлиника №4";

const appMenu = { // routing by Django
  clinic : { href: "#", name: "Клиника"},
  travm: { href: "#", name: "Травма"},
  stom: { href: "#", name: "Стоматолог"},
  sprav: { href: "/sprav", name: "Справочники"},
  reestr: { href: "/reestr", name: "Реестры" },
  report: { href: "/report", name: "Отчеты"}
};

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
  app: null,
  subApp: null,
  
  oninit: function (vnode) {
    //console.log(vnode.attrs.subAppMenu)
    vuMain.moName = document.getElementsByTagName('title')[0].innerHTML;
    vuMain.app = document.body.id;
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
    //console.log(' view --', vuMain.subApp);
    return [
      m('#header',
        m('#menus', [
          m('.apps-menu.pure-menu.pure-menu-horizontal', [
            m('span.pure-menu-heading', vuMain.moName),
            m('ul.pure-menu-list', [
              Object.keys(appMenu).map( (appName) => {
                let s = appName == vuMain.app ? ".pure-menu-selected":"",
                li = "li.pure-menu-item" + s;
                //console.log(appName, vuMain.app);
                return m(li,
                  m('a.pure-menu-link', { href: appMenu[appName].href }, appMenu[appName].name)
                );
              })
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
restApi = {
    // local
    district: { url:"district"},
    division: { url:"division"},
    mo_local: { url:"mo_local"},
    smo_local: { url:"smo_local"},
    get doctor() {
        return { url:"doctor", options: [ this.division, this.district ], sort_by: 'code' };
    },
    // tfoms
    doc_spec : { url:"doc_spec"},
    sp_podr: { url:"sp_podr", sort_by: 'mo_code' },
    sp_para: { url:"sp_para"},
    purp: { url: 'purpose'},
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
    onko_n7: {url: 'n7_hystolog'},
    onko_n8: {url: 'onko_hysto_n8'},
    onko_n9: {url: 'onko_hysto_n9'},
    onko_n10: {url: 'n10_mark'},
    onko_n11: {url: 'onko_mark_n11'},
    onko_n12: {url: 'onko_mark_n12'},
    onko_n13: {url: 'n13_lech_type'},
    onko_n14: {url: 'n14_hirlech_type'},
    onko_n15: {url: 'n15_leklech_line'},
    onko_n16: {url: 'n16_leklech_cycle'},
    onko_n17: {url: 'n17_luchlech_type'},
    
    
};

const spravApi = {
    root: "/",
    mo: "/mo",
    mo_doct: "/mo/doct-list",
    mo_dist:  "/mo/dist-list",
    mo_divs: "/mo/divs-list",
    mo_local: "/mo/mo-local",
    mo_smo: "/mo/smo-local",
    //
    tfoms: "/tfoms",
    tfoms_spec: "/tfoms/spec",
    tfoms_podr: "/tfoms/podr",
    tfoms_para_podr: "/tfoms/para_podr",
    tfoms_purp: "/tfoms/purp",
    tfoms_type: "/tfoms/type",
    tfoms_insur: "/tfoms/insur",
    tfoms_istfin: "/tfoms/istfin",
    tfoms_errors: "/tfoms/errors",
    //
    onko: "/onko",
    onko_n1: "/onko/n1",
    onko_n2: "/onko/n2",
    onko_n3: "/onko/n3",
    onko_n4: "/onko/n4",
    onko_n5: "/onko/n5",
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
    /*
    spec: "/spec",
    other: "/other",
    tarif: "tarif",
   
    */
};

const spravMenu = { subAppMenu: {
  
  mo: {
    nref: [`#!${spravApi.mo}`, "Локальные"],
    items: [
      [`#!${spravApi.mo_doct}`, "Врачи"],
      [`#!${spravApi.mo_dist}`, "Участки"],
      [`#!${spravApi.mo_divs}`, "Отделения"],
      [`#!${spravApi.mo_local}`, "МО локальные"],
      [`#!${spravApi.mo_smo}`, "СМО локальные"],
    ]
  },
  tfoms: {
    nref: [`#!${spravApi.tfoms}`, "ТФОМС"],
    items: [
      [`#!${spravApi.tfoms_spec}`, "Специальности"],
      [`#!${spravApi.tfoms_podr}`, "Подразделения"],
      [`#!${spravApi.tfoms_para_podr}`, "Доп. службы"],
      [`#!${spravApi.tfoms_purp}`, "Цель обращения"],
      [`#!${spravApi.tfoms_type}`, "Особый случай"],
      [`#!${spravApi.tfoms_insur}`, "Категория ОМС"],
      [`#!${spravApi.tfoms_istfin}`, "Фин. источник"],
      [`#!${spravApi.tfoms_errors}`, "Причины отказов"],
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
      [`#!${spravApi.onko_n7}`, "7. Гистология"],
      [`#!${spravApi.onko_n8}`, "8. Гистология результат"],
      [`#!${spravApi.onko_n9}`, "9. Гистология диагноз"],
      [`#!${spravApi.onko_n10}`, "10. Онкомаркеры"],
      [`#!${spravApi.onko_n11}`, "11. Онкомаркеры значение"],
      [`#!${spravApi.onko_n12}`, "12. Онкомаркеры диагноз"],
      [`#!${spravApi.onko_n13}`, "13. Тип лечения"],
      [`#!${spravApi.onko_n14}`, "14. Хирург лечение"],
      [`#!${spravApi.onko_n15}`, "15. Лекарственные линии"],
      [`#!${spravApi.onko_n16}`, "16. Лекарственные циклы"],
      [`#!${spravApi.onko_n17}`, "17. Лучевая терапия"],
    ]
  },
  
  /*
  spec: {
    nref: [`#!${spravApi.foms}`, "Врачебные"],
    items: [
      [`#!${spravApi.foms_mo}`, "МО Приморский край"],
      [`#!${spravApi.mo_dist}`, "Участки"],
      [`#!${spravApi.mo_divs}`, "Отделения"]
    ]
  },
  
  */
  }
};

// src/apps/model/moModel.js

const pg_rest = window.localStorage.getItem('pg_rest'); //postgest schemaRest;
//console.log(schema);

const moModel = {
  
  // :: String -> Array -> String -> Object
  // ret models object (POJO)
  getModel( {url=null, method="GET", options=null, sort_by=null, editable=false } = {} ) {
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
      editable: editable,
      
      list: null, // main data list (showing in table page)
      data: {}, // every idx corresponds with index of options array
      
      error: null, // Promise all error
      order: true, // for list
      sort: null // for list
    };  
    model.sort = function(field) {
      return moModel.sort(model, field);
    };  
    //console.log(model);
    return model;
  },
  // :: Object -> Promise
  // ret Promise
  getList (model) {
    // filed - sort by with SELECT, default 'id' field
    //let schema = window.localStorage.getItem('pg_rest');
    let id = model.field ? model.field : 'id',
    order = `?order=${id}.asc`;
    let url = pg_rest + model.url + order;
    console.log(url);
    return m.request({
      method: model.method,
      url: url
    }).then(function(res) {
      model.list = res; // list of objects
      model.order = true;
    }).catch(function(e) {
      model.error = e.message;
      console.log(model.error);
    });
  },
  // :: Object -> undef
  // return Promise all
  getData(model){
    if ( model.options === null ) return false;
    //let schema = window.localStorage.getItem('pg_rest');
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
    Promise.all(data).then( (lists) => {
      model.data = _.zipObject( model.options, lists);
      //console.log( model.list );
    }).catch(function(e) {
      //model.error = e.message;
      console.log(e.message);
    });
    
  },
  
  // :: Object -> String -> String -> Object -> Promise
  // return Promise
  getViewRpc (model, data, url=null, method=null) {
    //let schema = window.localStorage.getItem('pg_rest');
    let _url = url ? url : model.url;
    let _method = method ? method : model.method;
    return m.request({
      method: _method,
      data: data,
      url: pg_rest + _url
    }).then(function(res) {
      model.list = res; // list of objects
      model.order = true;
    }).catch(function(e) {
      model.error = e.message;
      console.log(model.error);
    });
  },
  
  sort(model, id=null) {
    console.log(id);
    let order = model.order ? 'desc' : 'asc';
    let field = id ? id : 'id'; 
    model.list = _.orderBy(model.list, [ field ], [ order ]);
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
  formSubmit (model, form) {  
    // form - jQuery object
    // model - model object 
    //let schema = window.localStorage.getItem('pg_rest');
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

};

// src/apps/view/vuDialog.js

const vuDialog = {
  
  dialog: null,
  form: null,
  model: null,
  //dialog: document.getElementById('dialog'),
  
  oncreate(vnode) {
    vuDialog.dialog = vnode.dom;
    //console.log(dialogView.dialog);
  },
  
  view(vnode) {
    return m('dialog#dialog', [
      m('.dialog-content', 
        [
          m('i.fa fa-times.dclose', { onclick: vuDialog.close }),
          m('span.dheader', `${vnode.attrs.header} (${vnode.attrs.word})`),
          vnode.children
        ])
      ]);
  },
  
  open (vnode=null) {
    //m.render(dialogView.dialog, vnode);
    vuDialog.dialog.showModal();
    return false;
  },
  
  close (e, reload=false) { //e - EventObject
    //let srverr = document.getElementById('srv-error');
    let srverr = vuDialog.dialog.querySelector('#srv-error');
    if ( !!srverr ) srverr.parentNode.removeChild(srverr);
    //$('dialog div.dialog-content').remove('#srv-error');
    vuDialog.dialog.querySelector('form').reset();
    vuDialog.dialog.close();
    //m.route.set('/spec-list');
    //console.log (reload);
    if ( reload ) m.redraw();
    //if ( reload ) window.location.reload();
    return false;
  },
  
  fvalid(vnode) {
    
    vnode.dom.addEventListener('submit', (e) => {e.preventDefault(); } );
    
    //console.log(form.method.value);
    //console.log(form.code.value, form.desc.value);
    //console.log(vnode.attrs['id']);
    
    $.validate({
        form: '#' + vnode.attrs.id,
        dateFormat: 'dd-mm-yyyy',
        errorElementClass: 'input-error',
        errorMessageClass: 'error-msg',
        onError: ($form) => {
          console.log('form not valid error');
        },
        onSuccess: ($form) => {
          if (vuDialog.model !== null ) {
            return moModel.formSubmit( vuDialog.model, $form );
          }
            return false;
        }
    });
    //console.log (vnode.attrs)
  },
  
  offForm () { vuDialog.form.parent().addClass('disable'); },
  onForm () { vuDialog.form.parent().removeClass('disable'); },
  
  sErr (form, err) {
    let s = `<span id="srv-error">Ошибка базы данных:<br>
    ${err.details}<br>
    ${err.message}
    </span>`;
    form.append(s);
  },

  xError (xhr, err) {
    let rsp = xhr.responseText;
    console.log (`error status -- ${xhr.status} text -- ${rsp}`);
    vuDialog.onForm();
    if ( xhr.status < 400 ) {
      moModel.getList( vuDialog.model );
      vuDialog.close(null, true );
      return;
    }
    //console.log ('error', err);
    let d = {};
    try {
      d = JSON.parse(rsp);
    } catch (err) {
      d.details = "Не удалось выполнить запрос";
      d.message = "";
    }
    vuDialog.sErr(vuDialog.form, d);
  },
    
  xSuccess (data, code) {
    console.log (`success data ${data}, code ${code}`);
    vuDialog.onForm();
    moModel.getList( vuDialog.model );
    vuDialog.close(null, true );
  } 

};

// src/sprav/view/vuSprav.js
//import { moModel } from '../model/moModel.js';

// Forms in dialog window for catalogs 
const vuForm = {
  
  item: null,
  method: "",
  word: "",
  model: null,
  name: "",
  
  oninit(vnode) {
    vuDialog.model = vnode.attrs.model;
    vuForm.model = vnode.attrs.model;
    vuForm.name = vnode.attrs.name;
  },
    
  view(vnode) {
    //let item = vuForm.item,
    let method = vuForm.method,
    word = vuForm.word;
    
    return m('form.pure-form.pure-form-aligned',
      { id: 'moform',
        oncreate: vuDialog.fvalid //, 
      }, [
        vnode.children,
        m('.pure-controls', [
            m('input[type=hidden][name=method]', {value: method} ),
            m('button.pure-button[type=submit]', word),
        ])
      ] );
  },
  getItem(id) {
    let list = this.model.list;
    return id ? _.find( list, (i) => { return i.id == id; } ) : null;
  }, 
    
  dput (id) { // add or edit item
    if ( id == "0" ) { // new item add
      vuForm.method = "POST";
      vuForm.word = "Добавить";
      vuForm.item = null;
    } else {  // edit item
      vuForm.method = "PATCH";
      vuForm.word = "Изменить";
      vuForm.item = vuForm.getItem(id);
    }  
    vuDialog.open();
    return false;
  },
  
  ddel(id) { // delete item
    vuForm.method = "DELETE";
    vuForm.word = "Удалить";
    vuForm.item = vuForm.getItem(id);
    vuDialog.open();
    return false;
  },
  
  types() { // debug output
    console.log(this.item);
    console.log(this.method);
    console.log(this.word);
  }
};
/*
const vuPanel = {
    
  view (vnode) {
    return m('.panel', [
      m('div', m('span.dheader', vnode.attrs.header )),
      m('div', m('button.pure-button-cust', {
          value: 0,
          onclick: m.withAttr( "value", vuForm.dput)
        }, 'Добавить')
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
  
}
*/
const vuTheader = {
  view (vnode) {
    return m(".pure-g",
      m(".pure-u-1-1.box-1",
        m('span.dheader', vnode.attrs.header )
      )
    );
  }
};

const vmFind = {
  
  trCols: 2, // how many tr childern (table columns) get to find 
  toFind: "",
  setFind: function(str) {
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
  
  oninit(vnode) {
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
                  onkeyup: m.withAttr("value", vmFind.setFind ),
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
                vnode.attrs.addButton ? 
                m('button.pure-button.pure-button-primary[type="button"]', {
                    value: 0,
                    onclick: m.withAttr( "value", vuForm.dput)
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
/*
const vuLoading = {
 
    oninit: function (vnode) {
      console.log(vnode.attrs.model);
    },
    
    view: function (vnode) {
      console.log(vnode.attrs.model);
      return m('div', "HER");
      
      return vnode.attrs.model.error ? [ m(".error", vnode.attrs.model.error) ] :
        vnode.attrs.model.list ? [ vnode.children ] : m(".loading-icon", [
          m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
          m('span.sr-only', 'Loading...')
        ]);
      
    }
  
}
*/
/*
const vuTable = {
  
  view (vnode) {
    //let model = vnode.attrs.model;
    //console.log(model);
    return vnode.attrs.model.error ? [ m(".error", vnode.attrs.model.error) ] :
      vnode.attrs.model.list ? [
        m(vuPanel, { header: vnode.attrs.header } ),
        vnode.children
      ] : m(".loading-icon", [
            m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
            m('span.sr-only', 'Loading...')
      ]);
  }
}
*/
const vuSprav = {
  view: function(vnode) {
    return m('div', {
        style: "margin: 0 auto; padding-top: 5em; width: 50%;"
      },
      /*
      m(".pure-g", [
        m(".pure-u-1-6",
          m("a.pure-button.pure-button-primary",
            { href: "#!/new-card", style: "font-size: 1.2em; font-weight: 600" }, "Карта"),
        ),
        m(".pure-u-1-6",
          m('a.pure-button.pure-button-primary',
            { href: "#!/new-talon", style: "font-size: 1.2em; font-weight: 600" }, "Талон"),
        )
      ]),
      */
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
  // every html table has last column to delete record purpose
  
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

// src/sprav/view/vuCatalog.js

const itemForm = {

  view(vnode) {
    let item = vnode.attrs.item,
    ro = vnode.attrs.method === 'DELETE' ? true : false;
    
    return m('fieldset', [
      m('.pure-control-group', [
        m('label[for=code]', 'Код'),
        m('input.fcode[id=code][type=text][name=id]', {
          value: item ? item.id : '',
          readonly: item ? true : false,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        } ),
        item ? m('span.pure-form-message-inline', 'Поле не редактируется.') : ''
      ]),
      m('.pure-control-group', [
        m('label[for=desc]', this.name),
        m('textarea[id=desc][name=name][cols=40]',
          {readonly: ro},
          item ? item.name : '')
      ])
    ]);
  },
  
};

// clojure
const vuCatalog = function(vnode) {
  
  var model = vnode.attrs.model,
  header = vnode.attrs.header,
  name = vnode.attrs.name;
  
  return {
  
  oninit () {
   moModel.getList( model );
   //console.log(name);
  },

  oncreate() {
    //m.redraw();
  },
  
  onupdate() {
    //m.redraw();
    //this.model = vnode.attrs.model;
    //moModel.getList( vnode.attrs.model );
    //this.header = vnode.attrs.header;
    //this.name = vnode.attrs.name;         
  },
  
  listMap (s) {
    return m('tr', [
      m('td.choice.blue', {
          data: s.id,
          onclick: model.editable ? m.withAttr( "data", vuForm.dput) : ''
        }, s.id),
      m('td', s.name),
      model.editable ? 
      m('td', 
        m('i.fa.fa-minus-circle.choice.red', {
          data: s.id,
          onclick: m.withAttr( "data", vuForm.ddel)
        })
      ) : ''
    ]);
  },

  view () {
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        m(vuTheader, { header: header} ),
        m(vuFind, { cols: 2, addButton: model.editable} ),
        m('table.pure-table.pure-table-bordered[id="find_table"]', [
          m('thead', [
            m('tr', [
              m('th.choice', {data: "id", onclick: m.withAttr( "data", model.sort) },
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
              m(itemForm, { item: vuForm.item, method: vuForm.method  } )
            )
          ) : []
      ] : m(".loading-icon", [
          m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
          m('span.sr-only', 'Loading...')
      ]);
  }
  
  }
};

// src/sprav/view/vuDataSheet.js

// clojure
const vuDataSheet = function (vnode) {
  
  var modelObject = vnode.attrs.model, // model Object
    headerString = vnode.attrs.header, // String: page header 
    nameString = vnode.attrs.name, // String: models item name 
    findInt = vnode.attrs.find, // Int: how many cols include in find function
    structObject = vnode.attrs.struct; // the struct Object
    
  return {
    
  oninit () {
    moModel.getList( vnode.attrs.model );
    moModel.getData( vnode.attrs.model );
  },
  /*
  oncreate() {
  },
  
  onupdate() {
  },
  */
  listMap (s) {
    //let id = s.code + ' ' + s.spec;
    let first = true;
    return m('tr', [
      Object.keys(structObject).map( (column) => {
        let td = first ? m('td.choice.blue', {
          data:  s.id,
          onclick: modelObject.editable ? m.withAttr( "data", vuForm.dput) : ''
        }, s[column]) : m('td', s[column]);
        first = false;
        return td;
      }),
      modelObject.editable ? 
      m('td', m('i.fa.fa-minus-circle.choice.red', {
        data: s.id,
        onclick: m.withAttr( "data", vuForm.ddel)
      }) ) : ''
    ]);
  },

  view () {
    
    //return m(tableView, {model: this.model , header: this.header }, [
    return modelObject.error ? [ m(".error", modelObject.error) ] :
      modelObject.list ? [
        m(vuTheader, { header: headerString} ),
        m(vuFind, {cols: findInt} ),
        
        m('table.pure-table.pure-table-bordered[id=find_table]', [
          m('thead', [
            m('tr', [
              Object.keys(structObject).map( (column) => {
                let field = structObject[column];
                return field.length > 1 ? m('th.sortable',
                  { data: column, onclick: m.withAttr('data', modelObject.sort) },
                  [field[0], m('i.fa.fa-sort.pl10')]
                  ) : m('th', field[0]);
              }),
              modelObject.editable ? m('th', "Удалить") : ''
            ])
          ]),
          m('tbody', [modelObject.list.map( this.listMap )] )
        ]),
        modelObject.editable ? this.itemForm ? 
        m(vuDialog,
          { header: headerString,
            word: vuForm.word
          }, m(vuForm, { model: modelObject, name: nameString },
              m(this.itemForm, { item: vuForm.item, data: modelObject.data, method: vuForm.method } )
             )
        ) : m('h2', 'Не определена форма редактирования объекта') : ''
        
      ] : m(".loading-icon", [
            m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
            m('span.sr-only', 'Loading...')
          ]); 
  }
  }; //return this object
};

// src/sprav/view/vuDoctor.js

//POJO
const itemForm$1 = {
    
  view(vnode) {
    let item = vnode.attrs.item,
    ro = vnode.attrs.method === 'DELETE' ? true : false;
    return m('fieldset', [      
      m('input[type=hidden][name=id]', {value: item ? item.id : '' } ),
      m('.pure-control-group', [
        m('label[for=family]', 'Фамилия'),
        m('input.fname[id=family][type=text][name=family]', {
          value: item ? item.family : '',
          readonly: ro,
          'data-validation': 'required',
          'data-validation-error-msg': 'заполнить'
        } ),
        //item ? m('span.pure-form-message-inline', 'Поле не редактируется.') : ''
      ] ),
      m('.pure-control-group', [
        m('label[for=name]', 'Имя'),
        m('input.fname[id=name][type=text][name=name]', {
          value: item ? item.name : '',
          readonly: ro,
          //'data-validation': 'required',
          //'data-validation-error-msg': 'заполнить'
        } ),
        //item ? m('span.pure-form-message-inline', 'Поле не редактируется.') : ''
      ] ),
      m('.pure-control-group', [
        m('label[for=sname]', 'Отчество'),
        m('input.fname[id=sname][type=text][name=sname]', {
          value: item ? item.sname : '',
          readonly: ro,
          //'data-validation': 'required',
          //'data-validation-error-msg': 'заполнить'
        } ),
        //item ? m('span.pure-form-message-inline', 'Поле не редактируется.') : ''
      ] ),
      m('.pure-control-group', [
        m('label[for=snils]', 'СНИЛС'),
        m('input.fname[id=snils][type=text][name=snils]', {
          value: item ? item.snils : '',
          readonly: ro
        } ),
      ] ),
      m('.pure-control-group', [
        m('label[for=code]', 'Код'),
        m('input.fcode[id=code][type=text][name=code]', {
          value: item ? item.code : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        } ),
      ] ),
      m('.pure-control-group', [
        m('label[for=spec]', 'Специальнсть'),
        m('input.fcode[id=spec][type=text][name=spec]', {
          value: item ? item.spec : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        } ),
      ] ),
      m('.pure-control-group', [
        m('label[for=div]', 'Отделение'),
        vnode.attrs.data.division ? m('select[id=div][name=division]',
          vnode.attrs.data.division.map( d => m('option', {
            value: d.id,
            selected: item && item.division == d.id ? true : false
          }, d.name ) )
        ) : m('input.fcode[id=div][type=text][name=division]', {
          value: item ? item.division : 1,
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        }),
      ] ),
      m('.pure-control-group', [
        m('label[for=dist]', 'Участок'),
        vnode.attrs.data.district ? m('select[id=dist][name=district]',
          vnode.attrs.data.district.map( d => m('option', {
            value: d.id,
            selected: item && item.district == d.id ? true : false
          }, d.name ) )
        ) : m('input.fcode[id=dist][type=text][name=district]', {
             value: item ? item.district : 0,
             readonly: ro
        } ),
      ] ),
      m('.pure-control-group', [
          m('label[for=tabid]', 'Таб. номер'),
          m('input.fname[id=tabid][type=text][name=tabid]', {
            value: item ? item.tabid : '',
            readonly: ro
          } ),
      ] ),
    ]);
  },
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

const vuDist = function(vnode){
  return vuCatalog(vnode);
};
const vuDivs = function(vnode){
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
        model: moModel.getModel(restApi.doctor),
        header: "Врачи",
        name: "Врач",
        find: 3, // search in the first 3 table columns
        struct: moStruct.doctor
      });
      return vuView(view);
    }
  },
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
  [spravApi.mo_local]: {
    render: function() {
      let view = m(vuMoLocal, {
          model: moModel.getModel( restApi.mo_local ),
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
        model: moModel.getModel( restApi.smo_local ),
        header: "СМО Приморского края",
        name: "СМО",
        find: 2, // search in the first 3 table columns
        struct: moStruct.smoLocal
      });
      return vuView(view);
    }
  },
};

// src/sprav/router/tfomsRouter.js

const vuSpec = function(vnode){
  return vuCatalog(vnode);
};
const vuSpPodr = function(vnode){
  return vuDataSheet(vnode);
};
const vuSpPara = function(vnode){
  return vuCatalog(vnode);
};
const vuPurp = function(vnode){
  return vuCatalog(vnode);
};
const vuType = function(vnode){
  return vuCatalog(vnode);
};
const vuCateg = function(vnode){
  return vuCatalog(vnode);
};
const vuIstfin = function(vnode){
  return vuCatalog(vnode);
};
const vuErrors = function(vnode){
  return vuCatalog(vnode);
};

const roTfoms = {
  [spravApi.tfoms]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Cправочники ТФОМС" } ) );
    }
  },
  
  [spravApi.tfoms_spec]: {
    render: function() {
      let view = m(vuSpec, {
          model:  moModel.getModel( restApi.doc_spec ),
          header: "Коды врачебных специальностей",
          name: "Специальность"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_podr]: {
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
  [spravApi.tfoms_para_podr]: {
    render: function() {
      let view = m(vuSpPara, {
          model:  moModel.getModel( restApi.sp_para),
          header: "Коды диагностических подразделений",
          name: "Плдазделение"
      });
      return vuView(view);
    }
  },
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
};

// src/sprav/router/roOnko.js

const vuN1 = function(vnode){
  return vuCatalog(vnode);
};
const vuN2 = function(vnode){
  return vuDataSheet(vnode);
};
const vuN3 = function(vnode){
  return vuDataSheet(vnode);
};
const vuN4 = function(vnode){
  return vuDataSheet(vnode);
};
const vuN5 = function(vnode){
  return vuDataSheet(vnode);
};
const vuN7 = function(vnode){
  return vuCatalog(vnode);
};
const vuN8 = function(vnode){
  return vuDataSheet(vnode);
};
const vuN9 = function(vnode){
  return vuDataSheet(vnode);
};
const vuN10 = function(vnode){
  return vuDataSheet(vnode);
};
const vuN11 = function(vnode){
  return vuDataSheet(vnode);
};
const vuN12 = function(vnode){
  return vuDataSheet(vnode);
};
const vuN13 = function(vnode){
  return vuCatalog(vnode);
};
const vuN14 = function(vnode){
  return vuCatalog(vnode);
};
const vuN15 = function(vnode){
  return vuCatalog(vnode);
};
const vuN16 = function(vnode){
  return vuCatalog(vnode);
};
const vuN17 = function(vnode){
  return vuCatalog(vnode);
};

const roOnko = {
  [spravApi.onko]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Cправочники по онкологии" } ) );
    }
  },
  
  [spravApi.onko_n1]: {
    render: function() {
      let view = m(vuN1, {
          model:  moModel.getModel( restApi.onko_n1 ),
          header: "Коды отказов",
          name: "Отказ"
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n2]: {
    render: function() {
      let view = m(vuN2, {
          model: moModel.getModel( restApi.onko_n2 ),
          header: "Стадия заболевания",
          name: "Стадия",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n2
        });
      return vuView(view);
    }
  },
  [spravApi.onko_n3]: {
    render: function() {
      let view = m(vuN3, {
          model:  moModel.getModel( restApi.onko_n3),
          header: "Tumor",
          name: "Tumor",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n3
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n4]: {
    render: function() {
      let view = m(vuN4, {
          model:  moModel.getModel( restApi.onko_n4 ),
          header: "Nodus",
          name: "Nodus",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n4
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n5]: {
    render: function() {
      let view = m(vuN5, {
          model:  moModel.getModel( restApi.onko_n5 ),
          header: "Метазтазы",
          name: "Метастазы",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n5
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n7]: {
    render: function() {
      let view = m(vuN7, {
          model:  moModel.getModel( restApi.onko_n7),
          header: "Гистология",
          name: "Наименование"
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n8]: {
    render: function() {
      let view = m(vuN8, {
          model:  moModel.getModel( restApi.onko_n8 ),
          header: "Гистлогия результат",
          name: "Результат",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n8
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n9]: {
    render: function() {
      let view = m(vuN9, {
          model:  moModel.getModel( restApi.onko_n9 ),
          header: "Гистология диагноз",
          name: "Диагноз",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n9
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n10]: {
    render: function() {
      let view = m(vuN10, {
          model:  moModel.getModel( restApi.onko_n10 ),
          header: "Онкомаркеры",
          name: "Маркер",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n10
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n11]: {
    render: function() {
      let view = m(vuN11, {
          model:  moModel.getModel( restApi.onko_n11 ),
          header: "Онкомаркеры значение",
          name: "Маркер",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n11
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n12]: {
    render: function() {
      let view = m(vuN12, {
          model:  moModel.getModel( restApi.onko_n12 ),
          header: "Онкомаркеры диагноз",
          name: "Маркер",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n12
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n13]: {
    render: function() {
      let view = m(vuN13, {
          model:  moModel.getModel( restApi.onko_n13 ),
          header: "Тип лечения",
          name: "Тип",
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n14]: {
    render: function() {
      let view = m(vuN14, {
          model:  moModel.getModel( restApi.onko_n14 ),
          header: "Тип хирургического лечения",
          name: "Тип",
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n15]: {
    render: function() {
      let view = m(vuN15, {
          model:  moModel.getModel( restApi.onko_n15),
          header: "Линии лекрственной тераапии",
          name: "Линия",
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n16]: {
    render: function() {
      let view = m(vuN16, {
          model:  moModel.getModel( restApi.onko_n16 ),
          header: "Циклы лекарственной терапии",
          name: "Цикл",
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n17]: {
    render: function() {
      let view = m(vuN17, {
          model:  moModel.getModel( restApi.onko_n17),
          header: "Тип лучевой терапии",
          name: "Тип",
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

Object.assign(spravRouter, roLocal, roTfoms, roOnko);

//m.route(document.getElementById('content'), "/", {})
m.route(document.body, "/", spravRouter);

  /*
  "/reflocal/dul-list": {
    render: function() {
      return m(vuMain,
        m(vuDul, {
          model: moModel.getModel( 'dul'),
          header: "Документы удостоверния личности",
          name: "ДУЛ",
          find: 2, // search in the first 2 table columns
          struct: moStruct.dul
        })
      );
    }
  },
   "/reflocal/categ-case": {
    render: function() {
      let cat = m(vuCateg, {
          model: moModel.getModel( 'kategor' ),
          header: "Категории ОМС",
          name: "Категория"
      });
      return m(vuMain, cat);
    }
  },
  "/reflocal/polis-type": {
    render: function() {
      let pol = m(vuPolis, {
          model: moModel.getModel( 'polis_type' ),
          header: "Полис ОМС",
          name: "Полис"
      });
      return m(vuMain, pol);
    }
  },
  "/reflocal/okato": {
    render: function() {
      return m(vuMain,
        m(vuOkato, {
          model: moModel.getModel( 'okato' ),
          header: "ОКАТО",
          name: "ОКАТО",
          find: 3, // search in the first 3 table columns
          struct: moStruct.okato
        })
      );
    }
  },
  "/reflocal/invalid-type": {
    render: function() {
      let inv = m(vuInvalid, {
          model: moModel.getModel( 'invalid_type' ),
          header: "Инвалидность",
          name: "Инвалидность"
      });
      return m(vuMain, inv);
    }
  },

    "/refederal": {
    render: function() {
      return m(vuMain, m(vuRoot, { text: "Cправочники федеральные" } ));
    }
  },
  
  "/refederal/dul-list": {
    render: function() {
      return m(vuMain,
        m(vuDul, {
          model: moModel.getModel( 'dul'),
          header: "Документы удостоверния личности",
          name: "ДУЛ",
          find: 2, // search in the first 2 table columns
          struct: moStruct.dul
        })
      );
    }
  },

  "/refederal/polis-type": {
    render: function() {
      let pol = m(vuPolis, {
          model: moModel.getModel( 'polis_type' ),
          header: "Полис ОМС",
          name: "Полис"
      });
      return m(vuMain, pol);
    }
  },

  "/refederal/okato": {
    render: function() {
      return m(vuMain,
        m(vuOkato, {
          model: moModel.getModel( 'okato' ),
          header: "ОКАТО",
          name: "ОКАТО",
          find: 3, // search in the first 3 table columns
          struct: moStruct.okato
        })
      );
    }
  },
  */
