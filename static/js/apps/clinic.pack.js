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

// src/clinic/clinicApi.js

const restClinic = {

    cards_cnt: { url:"count_cards_clin", method:"GET" }, 
    card_find: { url:"rpc/clin_cards", method:"POST" },
    get_card: { url:"rpc/clin_card_by_num", method:"POST"},
    
    talons_cnt: { url:"count_talons_clin", method:"GET" }, 
    talon_find: { url:"rpc/clin_talons", method:"POST"},
    get_talon: { url:"rpc/clin_talon_by_num", method:"POST"},
    
};

const clinicApi = {
    root: "/",
    cards: "/cards",
    card_id: "/cards/:id",
    card_add:"/cards/add",
    talons: "/talons",
    talon_id: "/talons/:id",
};

const clinicMenu = { subAppMenu: {
  
  talons: {
    nref: [`#!${clinicApi.talons}`, "Талоны"],
  },
  cards: { 
    nref: [ `#!${clinicApi.cards}`, "Карты"],
  },
}
};

// src/clinic/view/vuClinic.js

const vuClinic = {
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

// src/sparv/spravApi.js
// here url is a table name
restSprav = {
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

    // federal
    dul: {url: 'dul'},
    okato: { url: 'okato'},
    
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

// src/apps/model/moModel.js

//const pg_rest = window.localStorage.getItem('pg_rest'); //postgest schemaRest;
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
    let pg_rest = window.localStorage.getItem('pg_rest');
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
      model.error = e.message.message ? e.message.message : e.message;
      console.log(model.error);
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
    Promise.all(data).then( (lists) => {
      model.data = new Map();
      for ( let el of model.options.entries() ) {
        model.data.set( el[1].url, lists[ el[0] ]);
      }
      //window.localStorage.setItem(model.opt_name, model.data);
      //model.data = _.zipObject( model.options, lists);
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

};

// src/clinic/model/moCards.js

//let schema = schemaRest;

const moCardsList = {
  
  model : {
    url: restClinic.card_find.url,
    method: restClinic.card_find.method,
    list: null, // main data list (showing in table page)
    error: null, // Promise all error
    order: true, // for list
    sort: null // for list
  },
  
  // :: Object
  // return model object (POJO)
  getModel() {
    return moCardsList.model;
  },
  
  sort(model, id=null) {
    //console.log(id);
    let order = model.order ? 'desc' : 'asc';
    let field = id ? id : 'id'; 
    model.list = _.orderBy(model.list, [ field ], [ order ]);
    model.order = !model.order;
  },
    
  cardsFind(event) {  
    // button FIND click event handler callback 
    event.preventDefault();
    let data = moModel.getFormData( $('form#card_find') );
    //console.log ( data );
    //return false;
    data.lim = 50;
    data.offs = 1;
    moModel.getViewRpc(
      moCardsList.getModel(),
      data
    );
    //m.redraw();
    return false;
  }
  
};

const moCard = {
  
  model : {
    url: restClinic.get_card.url,
    method: restClinic.get_card.method,
    card: null,
    list: null,
    opt_name: 'card_options',
    options: [restSprav.dul, restSprav.smo_local, restSprav.mo_local, restSprav.okato],
    data: null, 
    error: null,
    save: null
  },
  
  getModel() {
    return this.model;
  },
  
  getOptions() {
    if (this.model.data && this.model.data.size && this.model.data.size !== 0) return;
    moModel.getData( this.model );
  },
  
  getCard(args) {
    return moModel.getViewRpc(
      moCard.getModel(),
      { crd_num: args.id }
    );
  },
  /*
  actions(update) {
    return {
      get(data) {
        let d = moCard.getCard(data);
        d.then( (res) => update(Object.assign({}, { card: res[0]} ) ) ).catch( (e) =>{
            let err = JSON.parse(e.message);
            let msg = err.message ? err.message : e.message;
            update( Object.assign({}, { error:msg} ) );
          }
        );
      },
      set(data) { update( Object.assign({}, data) ); },
      change(data) { update(data); },
      clear(data) { update( Object.assign(data, {card: null, list: null, error: null, save: null}) ); }
    }
  },
  */
  setCard(card) {
    //console.log(card);
    moCard.model.card = Object.assign({}, card);
    //console.log(moCard.model.card);
    return true;
  },
  
  clear() {
    this.model.card = null;
    this.model.list = null;
    this.model.error = null;
    this.model.save = null;
    //console.log(this.model);
  },
  
  save(event) {
    event.preventDefault();
    event.target.parentNode.classList.add('disable');
    //console.log(moCard.model.card);
    /*
    testCase(2000, true).then( (res) => {
      //console.log('ggg ', res);
      moCard.model.save = { ok: true,  msg: res};
      //console.log(moCard.model.save);
      event.target.parentNode.classList.remove('disable');
      m.redraw();
    }).catch( e => {
       moCard.model.save = { ok: false, msg: e };
       event.target.parentNode.classList.remove('disable');
        m.redraw();
    });
    */
    let pg_rest = window.localStorage.getItem('pg_rest');
    let method = event.target.getAttribute('method');
    let { id } = moCard.model.card;
    let table = `${pg_rest}cardz_clin`;
    let url = id ? `${table}?id=eq.${id}`: table; 
    if ( Boolean(id) ) delete moCard.model.card.id;
    
    m.request({
      url: url,
      method: method,
      data: moCard.model.card
    }).then( res => {
      moCard.model.save = { ok: false, msg: res };
      event.target.parentNode.classList.remove('disable');
    }).catch( err => {
      let e = JSON.parse(err.message);
      moCard.model.save = { ok: false, msg: e.message ? e.message : err.message };
      event.target.parentNode.classList.remove('disable');
    });
    return false;
  }
};
/*
export const appCard = {
  initalalState: Object.assign({}, moCard.model.card),
  actions(update) => Object.assign({}, moCard.actions(update) ) 
}

export const updateCrad = m.stream();
export const statesCard = m.stream().scan(Object.assign, appCard.initialState, update);
export const actionsCard = appCard.actions(update);
*/
/*
states.map(function(state) {
  m.request;
});
*/

// src/apps/view/vuApp.js
const vuLoading = {
  view() { 
    return m(".loading-icon", 
      m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
      m('span.sr-only', 'Loading...')
    );
  }
};

// src/clinic/view/vuCardsList.js

const cardFind = {
  
  //table: null,
  
  /*
  oninit(vnode) {
  },
  */
  
  onupdate(vnode) {
    //let table = document.getElementById(vnode.attrs.table_id);
    //console.log(table);
    /*
    let toXls = document.getElementById("to_xls");
    if (table)
      $(toXls).attr( { href: tableToXls(table), download: vnode.attrs.table_id + '_file.xls' } );
    */
  },
  
  view (vnode) {
    //console.log(vnode.attrs);
    
    
    return m(".pure-g", [
      //m(".pure-u-2-12", m('a.pure-button.pure-button-primary', { href: `#!${clinicApi.card_add}`}, "Добавить")),
      m(".pure-u-18-24",

        m("form.pure-form[id=card_find]",
          m("fieldset",
            m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[name=q_crd][type='search']",
                  {placeholder: "Номер карты",
                  //onkeyup: m.withAttr("value", vmFind.setFind ),
                  //value: vmFind.toFind
                  }
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_fam][type='search']",
                  {placeholder:"Фамилия"}
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_im][type='search']",
                  {placeholder:"Имя"}
                )
              ),
              m(".pure-u-1-5",
                m('button.pure-button[type="button"]', {
                    //value: 0,
                    onclick: moCardsList.cardsFind
                  }, "Найти" ),
                m('a.pure-button.pure-button-primary', {
                  href: [clinicApi.card_add],
                  oncreate: m.route.link,
                  style: "margin-left: 2em;"
                  }, "Добавить" )
              ),
            ])
          )
        )
      ),
    ]);
  }
};

const toCard = function (crd_num) {
    m.route.set(clinicApi.card_id, { id: crd_num } );
    return false;
};

// clojure
const vuCardsList = function (vnode) {
  
  let cardz_hdr = {
      crd_num: ['Карта'],
      fam: ['ФИО'],
      birth_date: ['Дата рождения'],
      polis_num: ['Номер полиса'] 
   };
  
  let model = moCardsList.getModel();
  let table, table_id = 'cards_list';
  /*
  let toCard = function (crd_num) {
    m.route.set(clinicApi.card_id, { id: crd_num } );
    return false;
  };
  */
  
  return {
    
  oninit (vnode) {
    //this.model = moCardsList.getModel();
    //moCardsList.getList(model);
    moModel.getViewRpc(model, {}, restClinic.cards_cnt.url, restClinic.cards_cnt.method );
  },
  
  oncreate(vnode) {
    //table = document.getElementById(table_id);
    //console.log(table);
  },
  
  onupdate(vnode) {
    table = document.getElementById(table_id);
    //console.log(table);
  },
  
  listMap (s) {
    let fio = `${s['fam']} ${s['im']} ${s['ot']}`;
    let first = true;
    return m('tr', [
      Object.keys(cardz_hdr).map( (column) => {
        let cell = column === 'fam' ? fio : s[column];
        let td = first ? m('td.choice.blue', {
          //data:  cell,
          onclick: e => { e.preventDefault(); toCard(cell); }
        }, cell) : m('td', cell);
        first = false;
        return td;
      }),
      
      m('td', m('i.fa.fa-minus-circle.choice.red', {
        data: s['crd_num'],
        //onclick: m.withAttr( "data", vuForm.ddel)
      }) )
    ]);
  },

  view (vnode) {

    //return m(tableView, {model: this.model , header: this.header }, [
    return model.error ? [ m(".error", model.error) ] :
      model.list ? m('div', { style: "padding-left: 2em"}, 
        //m(vuTheader, { header: headerString} ),
        m(cardFind, {table_id: table_id } ),
        model.list[0] ? model.list[0].recount ? m('div' , 
          m('h1.blue', {style: "font-size: 1.5em;"},
            `${model.list[0].recount} записей в таблице`),
          /*
          m('a.pure-button.pure-button-primary',
            { href: [clinicApi.card_add],
              oncreate: m.route.link
            
            }, "Добавить"
          )
          */
        ) : m('table.pure-table.pure-table-bordered', {id: table_id} , [
          m('thead', [
            m('tr', [
              Object.keys(cardz_hdr).map( (column) => {
                let field = cardz_hdr[column];
                return field.length > 1 ? m('th.sortable',
                  { data: column, onclick: m.withAttr('data', model.sort) },
                  [field[0], m('i.fa.fa-sort.pl10')]
                  ) : m('th', field[0]);
              }),
              m('th', "Удалить")
            ])
          ]),
          m('tbody', [model.list.map( this.listMap )] )
        ]) : m('h1.blue', {style: "font-size: 1.5em;"}, "Нет таких записей")
            
        /*
        m(vuDialog,
          { header: headerString,
            word: vuForm.word
          }, m(vuForm, { model: modelObject, name: nameString },
              m(this.itemForm, { item: vuForm.item, data: modelObject.data, method: vuForm.method } )
             )
        )
        */
      ) : m(vuLoading); 
  }
  }; //return this object
};

// src/apps/model/moTalons.js

const moTalonsList = {
  
  model : {
    url: restClinic.talon_find.url,
    method: restClinic.talon_find.method,
    list: null, // main data list (showing in table page)
    error: null, // Promise all error
    order: true, // for list
    sort: null // for list
  },
  
  // :: Object
  // return model object (POJO)
  getModel() {
    return moTalonsList.model;
  },
  
  talonsFind(event) { 
    // button FIND click event handler callback 
    event.preventDefault();
    let data = moModel.getFormData( $('form#talon_find') );
    //console.log ( data );
    //moTalonsList.model.list=[];
    //return false;
    if (data.q_tal == "")
      data.q_tal = 1;
    if ( data.q_crd == "" && (data.q_date != "" || data.q_dspec != "" ) )
      data.q_crd = ".*";
    if (data.q_date == "" && data.q_dspec != "")
      data.q_date = '2010-01-01';
    data.q_date = data.q_date == "" ? null : data.q_date;
    if (data.q_dspec == "")
      data.q_dspec = null;
    data.lim = 50;
    data.offs = 0;
    //console.log ( data );
    
    moModel.getViewRpc(
      moTalonsList.getModel(),
      data
    );
    //m.redraw();
    return false;
  }
  
};

const moTalon = {
  
  model : {
    url: restClinic.get_talon.url,
    method: restClinic.get_talon.method,
    //card: null,
    list: null, 
    opt_name: 'talon_options',
    options: [], //[restSprav.dul, restSprav.smo_local, restSprav.mo_local, restSprav.okato],
    data: null, 
    error: null,
    save: null
  },
 
  getModel() {
    return this.model;
  },
  
  getTalon(args) {
    return moModel.getViewRpc(
      moTalon.getModel(),
      { tal_num: args.id }
    );
  },
  
  getOptions() {
    if (this.model.data && this.model.data.size && this.model.data.size !== 0) return;
    moModel.getData( this.model );
  },
  
};

const tabsView = function(vnode) {
  //console.log(vnode.attrs);
  
  let item = vnode.attrs.item;
  let tabs = [], tabs_cont=[];
  let tab_names = vnode.attrs.tabs;  //Array.of('Карта', 'Дополнительно', 'Прикрепить');
  let tab_contents = vnode.attrs.conts; //Array.of(crdMain, crdOpt, crdAtt);
  //console.log(tab_names);
  
  const hideTabs = function(idx) {
    for ( let id=idx; id < tabs.length; id++ ) {
      tabs[id].classList.remove('active');
      tabs_cont[id].classList.remove('show');
      tabs_cont[id].classList.add('hide');
    }
  };
  
  const changeTab = function(event) {
    let idx = parseInt (event.target.getAttribute('idx'));
    if (tabs_cont[idx].classList.contains('hide')) {
        hideTabs(0);
        tabs[idx].classList.add('active');
        tabs_cont[idx].classList.remove('hide');
        tabs_cont[idx].classList.add('show');
    }

  };
  return {
    oncreate(vnode) {
      //console.log(vnode.attrs.data);
      tabs = document.getElementsByClassName('tab');
      tabs_cont=document.getElementsByClassName('tab-content');
      //console.log(tabs_cont);
      tabs[0].classList.add('active');
      tabs_cont[0].classList.add('show');
      hideTabs(1); // other hide
    },
    
    view(vnode) {
      let idx=0;
      return m('div#tabs', [
        tab_names.map( (name) => {
          return m('.tab',
              { idx: idx++,
                onclick: changeTab
              },  
            name);
        } ),
        tab_contents.map( (cont) => {
          return m('.tab-content',
            //{ oncreate: (vnode => tabs_cont.push(vnode.dom)) },
            m(cont, {model: vnode.attrs.model, method: vnode.attrs.method}) );
        })
      ]);
  }
}
};

const forTabs = function(vnode) {
  //vnode.dom.reset();
  let submit = vnode.dom.getAttribute('id');
  if ( submit == 'card') vnode.dom.addEventListener('submit', moCard.save);
  else vnode.dom.addEventListener('submit', moTalon.save);
  
  let inputs = vnode.dom.querySelectorAll("input,select,button");
  for (let i = 0 ; i < inputs.length; i++) {
    inputs[i].addEventListener("keypress", (e) => {
      if (e.which == 13 || e.keyCode == 13) {
        e.preventDefault();
        let tabindex = parseInt(e.target.getAttribute('tabindex')) + 1;
        let nextInput = vnode.dom.querySelectorAll(`[tabindex="${tabindex}"]`);
        //console.log(nextInput[0]);
        if (nextInput.length === 0) {
          nextInput = vnode.dom.querySelectorAll('[tabindex="1"]');
        }
        nextInput[0].focus();
      }
    });
  }
};

// src/clinic/view/vuCard.js

const crdMain = function(vnode) {
  //console.log(vnode.attrs);
  
  //const model = vnode.attrs.model;
  //const data = model.data;
  //const card = model.list ? model.list[0] : {};
  //const method = vnode.attrs.method;
  let model, data, card, method;
  let attrs = vnode.attrs;
  
  //console.log(card);
  //
  
  const cardSave = function(e) {
    //console.log(card);
    return moCard.setCard(card);
    //return true;
  };
  
  const num_digits = function(val) {
    try {
      if (val.toString().length == 16) return "Длина номера 16 цифр";
      return m('span.red', `Длина номера ${val.toString().length} цифр`);
    } catch (e) {
      return m('span.red', "Длина номера неизвестна");      
    }
  };
  const set_polis_num = function(e) {
     card.polis_num = e.target.value;
  };
  const set_dul = function(e) {
     card.dul_type = e.target.value;
  };
  const set_mo = function(e) {
     card.mo_att = e.target.value;
  };
  const set_smo = function(e) {
     let smo = parseInt(e.target.value);
     if ( isNaN(smo) ) card.smo = 250000; //this value subtracts from code in input
     else card.smo = smo + 250000;
  };
  const set_smo_okato = function(e) {
    if ( Boolean(card.smo) ) {
      let smo = Array.from( data.get('smo_local') ).find( item => item.code == card.smo );
      if ( Boolean(smo) ) {
        card.smo_okato = smo.okato;
        let o = Array.from( data.get('okato') ).find( item => item.okato == smo.okato );
        e.target.value = `${o.region}. ${o.name.split(' ')[0]}`;
        return false;
      }
    }    if (Boolean(e.target.value )) {
      rg = e.target.value.split('.')[0];
      card.smo_okato = Array.from(data.get('okato')).find(item => item.region.toString() == rg)['okato'];
    }
  };
  const set_name = function(val, key, prop, name, first_word=false) {
    //console.log(key, val);
    if ( !Boolean(val)) return "";
    let item = Array.from( data.get(key) ).find( item => item[prop].toString() == val );
    //console.log(item);
    if (item !== undefined) {
      if ( !first_word ) return item[name];
      return item[name].split(' ')[0];
    }
    return m('span.red', "Неизвестный код");
  };
  
  return {
    oninit() {
      model = attrs.model;
      data = model.data;
      card = model.list ? Object.assign({}, model.list[0]) : new Object();
      method = attrs.method;
      //console.log(card);
    },
    
    view() {
      //console.log(method);
       return m('form.tcard.pure-form.pure-form-aligned',
         {style:"font-size: 1.2em;", id:"card", oncreate: forTabs, method: method },
         [ m('fieldset', [ m('legend', "Карта пациента"),
          m(".pure-g", [
            m(".pure-u-7-24", [
// --            
              m(".pure-control-group", [
                m('label', { for: "crd_num" }, "Номер карты"),
                m('input[name="crd_num"][type="text"][required][autofocus]', {
                  value: card.crd_num ? card.crd_num : '',
                  tabindex: "1",
                  //oncreate: toFocus,
                  onblur: e => card.crd_num = e.target.value,
                })
              ]),
// --            
              m(".pure-control-group", [
                m('label', { for:"fam"} , " "),
                m('input[name="fam"][type="text"][required]', {
                  placeholder: "Фамилия",
                  value: card.fam ? card.fam : '',
                  onblur: e => card.fam = e.target.value,
                  tabindex: "2",
                })
              ]),
// --            
              m(".pure-control-group", [
                m('label', { for: "im" }, " "),
                m('input[name="im"][type="text"]', {
                  placeholder: "Имя",
                  value: card.im ? card.im: '',
                  onblur: e => card.im = e.target.value,
                  tabindex: "3",
                })
              ]),
// --    
              m('.pure-control-group', [
                m('label', { for: "ot" }, " "),
                m('input[name="ot"][type="text"]', {
                  placeholder: "Отчество",
                  value: card.ot ? card.ot: '',
                  onblur: e => card.ot = e.target.value,
                  tabindex: "4",
                }) 
              ]),
// --          	
              m(".pure-control-group", [
                m('label', { for: "birth_date" }, "Дата рождения"),
                m('input[name="birth_date"][type="date"][required]', {
                  value: card.birth_date ? card.birth_date: '',
                  onblur: e => card.birth_date = e.target.value,
                  tabindex: "5",
                })
              ]),
// --            
              m(".pure-control-group", [
                m('label', { for: "gender" }, "Пол"),
                m('span', { style: "line-height: 1em;" }, "М"), 
                m('input[name="gender"][type="radio"]', {
                  style: "margin: 0 14px 0 7px;",
                  value: 0,
                  checked: card.gender ? ['м', 'ж'].indexOf( card.gender.toLowerCase() ) === 0 ? true : false : false,
                  onchange: e => e.target.checked ? card.gender = 'м' :  card.gender = 'ж' 
                }),
                m('span', "Ж"),
                m('input[name="gender"][type="radio"]', {
                  style: "margin: 0 0 0 7px;",
                  value: 1,
                  checked: card.gender ? ['м', 'ж'].indexOf( card.gender.toLowerCase() ) == 1 ? true: false: false,
                  onchange: e => e.target.checked ? card.gender = 'ж' : card.gender = 'м' 
                })
              ]),  
// --            
              m(".pure-control-group", [
                m('label', { for:"dul_type"}, "Тип документа"),
                m('input.pure-u-1-6[name="dul_type"][type="text"]', {
                  //list: "type_dul",
                  value: card.dul_type ? card.dul_type : '',
                  tabindex: "6",
                  onblur: set_dul
                }),
                m('span.item_name', set_name (card.dul_type, 'dul', 'code', 'short_name') )
              ]),
// --            
              m(".pure-control-group", [
                m('label', { for: "dul_serial" }, "Документ"),
                m('input[name="dul_serial"][type="text"]', {
                  placeholder: "Серия",
                  value: card.dul_serial ? card.dul_serial: '',
                  tabindex: "7",
                  onblur: e => card.dul_serial = e.target.value,
                })
              ]),
// --             
              m(".pure-control-group", [
                m('label', { for:"dul_number" }, " "),
                m('input[name="dul_number"][type="text"]', {
                  placeholder: "Номер",
                  value: card.dul_number ? card.dul_number: '',
                  tabindex: "8",
                  onblur: e => card.dul_number = e.target.value,
                })
              ])
            ]), // u-7-24
// ============================			
            m(".pure-u-8-24", [ m('legend', "ОМС"),
              m(".pure-control-group", [
                m('label', { for: "polis_ser" }, "Полис" ),
                m('input.pure-u-1-6[name="polis_ser"][type="text"]', {
                  placeholder:"Серия",
                  value: card.polis_ser ? card.polis_ser: '',
                  tabindex: "9",
                  onblur: e => card.polis_ser = e.target.value,
                }),
                m('input.pure-u-3-6[name="polis_num"][type="text"]', {
                  placeholder:"Номер",
                  value: card.polis_num ? card.polis_num: '',
                  tabindex: "10",
                  onblur: set_polis_num
                }),
                m('div.item_name', {style: "margin-left: 10em;"}, num_digits (card.polis_num) ),
              ]),
// --    
              m(".pure-control-group", [
                m('label', { for: "smo"}, "Страховщик"),
                m('input.pure-u-1-6[name="smo"][type="text"]', {
                  value: card.smo ? card.smo - 250000: '',
                  tabindex: "11",
                  onblur: set_smo
                }),
                m('span.item_name', set_name (card.smo, 'smo_local', 'code', 'short_name') )
              ]),
// --
              m(".pure-control-group", [
                m('label', { for: "smo_okato"}, "Регион"),
                m('input[name="smo_okato"][type="text"]', {
                  oncreate: v => set_smo_okato( { target: v.dom} ),
                  list:  "okato",
                  //value: card.smo_okato,
                  tabindex: "12",
                  onblur: set_smo_okato

                }),
               //m('span.item_name', set_name(card.smo_okato, 'okato', 'okato', 'name', true) )
                m('datalist[id="okato"]', [
                  data.get('okato').map( o => {
                  let okato = `${o.region}. ${o.name.split(' ')[0]}`;
                    return m('option', okato );
                  })
                ])
              ]),
// --          
              m(".pure-control-group", [
                m('label', { for: "mo_att"}, "Прикреплен к МО"),
                m('input.pure-u-1-6[name="mo_att"][type="text"]', {
                  value: card.mo_att ? card.mo_att: '',
                  tabindex: "13",
                  onblur: set_mo
                }),
              ]),
              m('span.item_name', set_name (card.mo_att, 'mo_local', 'scode', 'sname') ),
            ]),
// ============================         
            m(".pure-u-9-24", [ m('legend', "Адрес"),
              m(".pure-control-group", [
                //<!--label for="-num">Город</label-->
                m('input[name="city_g"][type="text"]', {
                  placeholder: "Город",
                  value: card.city_g ? card.city_g: '',
                  tabindex: "14",
                  onblur: e => card.city_g = e.target.value,
                })
              ]),
// --
              m(".pure-control-group", [
              //<!--label for="-num">Улица</label-->
                m('input[name="street_g"][type="text"]',  {
                  placeholder: "Улица",
                  value: card.street_g ? card.street_g: '',
                  tabindex: "15",
                  onblur: e => card.street_g = e.target.value,
                }),
              ]),
// --
              m(".pure-control-group", [
                m('input.pure-u-1-8[name="home_g"][type="text"]', {
                  placeholder: "Дом",
                  value: card.home_g ? card.home_g: '',
                  tabindex: "16",
                  onblur: e => card.home_g = e.target.value,
                }),
                m('input.pure-u-1-8[name="corp_g"][type="text"]', {
                  placeholder: "Корп",
                  value: card.corp_g ? card.corp_g: '',
                  tabindex: "17",
                  onblur: e => card.corp_g = e.target.value,
                }),
                m('input.pure-u-1-8[name="flat_g"][type="text"]', {
                  placeholder: "Кв",
                  value: card.flat_g  ? card.flat_g: '',
                  tabindex: "18",
                  onblur: e => card.flat_g = e.target.value,
                })
              ]),
// --
              m(".pure-control-group", [
                m('input[name="phone_1"]', {
                  type: "text",
                  placeholder: "Мобильный тел",
                  value: card.phone_wrk ? card.phone_wrk: '',
                  //pattern: "([0-9]{3}) [0-9]{3}-[0-9]{4}",
                  tabindex: "19",
                  onblur: e => card.phone_wrk = e.target.value,
                })
              ]),
// --     
              m(".pure-control-group", [
                m('input[name="phone_2"][type="text"]', {
                  placeholder: "Контактный тел",
                  value: card.phone_hom ? card.phone_hom: '',
                  tabindex: "20",
                  onblur: e => card.phone_hom = e.target.value,
                })
              ]),
            ]) //u-9-24
// ============================
          ]) // pure-g
        ]), // fieldset
// ============================
        m(".pure-g", [
            m(".pure-u-13-24 ", [
            m('span#card_message', model.save ? model.save.ok ? model.save.msg : m('span.red', model.save.msg) : '')
          ]),
        m(".pure-u-9-24 ", [
          m('button.pure-button.pure-button-primary[type="submit"]',
            { //onfocus: setPale,
              onclick: cardSave
              //tetabindex: "20",
            }, "Сохранить"),
          m('a.pure-button.', {
            href: [clinicApi.cards],
            oncreate: m.route.link,
            //onclick: (e) => m.route.set('/crads/add/'),
            style: "margin-left: 2em;"
            }, "Добавить новую" )
        ])
      ]) // pure-g
    ]);// form
//=========================
  }
}
};
const crdOpt = function(vnode) {
  return {
    view(vnode) {
       return m('h2', "Дополнительно");
    }
  }
};
const crdAtt = function(vnode) {
  return {
    view(vnode) {
       return  m('h2', "Прикрепить");
    }
  }
};

const vuCard = function(vnode) {
  //console.log(vnode.attrs);
  
  let model; //, card;
  let tabs = ['Карта', 'Дополнительно', 'Прикрепить'];
  let conts = [crdMain, crdOpt, crdAtt];
  let { id } = vnode.attrs;
 
  return {  
  oninit () {
    model = moCard.getModel();
    //card = model.list ? model.list[0] : null;
    //console.log(model);
  },
  onbeforeupdate() {
    //console.log('update');
    model = moCard.getModel();
  },
  
  view () {

    if ( id == 'add' ) {
      //console.log(id);
      return model.data ?
        m(tabsView, {model: model, tabs: tabs, conts: conts, method: 'POST'})
      : m(vuLoading);
    }
    
    return model.error ? [ m(".error", model.error) ] :
      model.list && model.data ? 
        m(tabsView, {model: model, tabs: tabs, conts: conts, method: 'PATCH'})
      : m(vuLoading);
  } 
}
};

// src/clinic/view/vuTalon.js

const talForm = function (vnode) {
  
  let tal = vnode.attrs.talon;
  tal = {tal_num: '123--456'};
  
  const month = function (val) {
    let d = new Date();
    return d.getMonth() + 1;
  };
  /*
  const help = function (link) {
    return m(".pure-u-1-24.aquest", 
      m('a.qhelp[href="#"]',
        m('i.fa.fa-question-circle.fa-lg') )
    ); 
  };
  */
  return {
  view() {
    return m(".pure-u-18-24", [
		m("form.pure-form.pure-form-stacked.tcard", { style: "font-size: 1.2em;",  id: "talon" }, [
			m("fieldset", [
        m('legend', `Талон № ${tal.tal_num}`),
        m(".pure-g", [
          m(".pure-u-4-24", [
            m('label[for="open_date"', "Открыт"),
            m('input.pure-u-22-24[name="open_date"][type="date"][required]', {
                style: "height: 45%",
                value: tal.open_date
            })	
          ]),	
          m(".pure-u-4-24", [
            m('label[for="close_date"]', "Закрыт"),
            m('input.pure-u-22-24[name="close_date"][type="date"][required]', {
                style: "height: 45%",
                value: tal.close_date
            })
            //<!--span class="pure-form-message">заполнить</span-->
          ]),
          m('.pure-u-6-24', [
            m('label.leg-sec[for="talon_month"]',{ style: "color: red;" }, "Месяц талона"),
            m('input.pure-u-6-24.tal_month[name="talon_month"]', {
              style: "height: 45%",
              type: "number",
              min: 1,
              max: 12,
              value: tal.tal_month ? tal.tal_month : month()
            })
          ]),
          m(".pure-u-8-24", [
            m('label[for="first_vflag"]', [
              m('input[name="first_vflad"][type="checkbox"]', {
                checked: tal.first_vflag === 0 ? false : true,
                style: "margin-right: 0.7em"
              }),
              "Первичный",
            ]),
            m('label[for="for_pom"]', [
              m('input[name="for_pom"][type="checkbox"]', {
                checked: tal.for_pom == 2 ? true : false,
                style: "margin-right: 0.7em"
              }),
              "Неотложный",
            ]),
            m('label[for="finality"]', [
              m('input[name="finality"][type="checkbox"]', {
                checked: tal.finality === 0 ? false : true,
                style: "margin-right: 0.7em"
              }),
              "Закончен",
            ]),
          ]),
        ]),
        
        m(".pure-g", [
          m(".pure-u-2-24", [
            m('label[for="ist_fin"]', "Оплата"),
            m('input.pure-u-18-24[name="ist_fin"][type="text"]', {
              //style: "height: 50%",
              value: tal.ist_fin
            })
          ]),
          m(".pure-u-2-24", [
            m('label[for="purp"]', "Цель"), 
            m('input.pure-u-18-24[name="purp"][type="text"]', {
               //style: "height: 50%"
               value: tal.purp
            })
          ]),
          m(".pure-u-2-24", [
            m('label[for="doc_spec"]', "Врач"),
            m('input.pure-u-22-24[name="doc_spec"][type="text"][placeholder="Спец"]',{
              value: tal.doc_spec
            })
          ]),
          m(".pure-u-2-24", [
            m('label[for="doc_code"', "Код "),
            m('input.pure-u-22-24[name="doc_code"][type="text"]', {
              value: tal.doc_code
            })
          ]),
          m(".pure-u-6-24", {
            style: "padding-top: 2em ; font-size: 1.2em; font-weight: 600"
            }, 
            "Иванопуло Н Н"
          ), 
        ]),

        m('legend.leg-sec', "Направление: лечение. диагностика, консультация"),
        
        m(".pure-g", [
          m(".pure-u-2-24", [
            m('label[for="npr_mo"]', "Код МО"),
            m('input.pure-u-22-24[name="naprlech"][type="text"][placeholder=""]', {
              value: tal.npr_mo
            })
          ]),
          m(".pure-u-2-24", [
            m('label[for="npr_spec"]', "Спец"),
            m('input.pure-u-22-24[name="npr_spec"][type="text"][placeholder=""]', {
              value: tal.npr_spec
            })
          ]),
          m(".pure-u-5-24", [
            m('label[for="naprlech"]', "Номер направления"), 
            m('input.pure-u-22-24[name="naprlech"][type="text"]', {
              value: tal.naprlech
            })
          ]),
        ]), 
        
        m('legend.leg-sec', "Визиты, дни"),
        
        m(".pure-g", [
          m('.pure-u-2-24', [
            m('label[for="visit_pol"]', "Амбул"),
            m('input.pure-u-20-24[name="visit_pol"][type="text"]', {
              value: tal.visit_pol
             })
          ]),
          m('.pure-u-2-24', [
            m('label[for="tdc"]', "На дом"),
            m('input.pure-u-20-24[name="tdc"][type="text"]', {
              value: tal.visit_home
            })
          ]),
          m('.pure-u-2-24', [ 
            m('label[for="tdc"]', "Дн. стац"),
            m('input.pure-u-20-24[name="tdc"][type="text"]', {
              value: tal.visit_daystac
            })
          ]),
          m('.pure-u-2-24', [
            m('label[for="tdc"]', "Стац. дом"),
            m('input.pure-u-20-24[name="tdc"][type="text"]', {
              value: tal.visit_homstac
            })
          ]),
        ]),
        
        m('legend.leg-sec', "Дневной стационар"),
        
        m(".pure-g", [
          m('.pure-u-2-24', [
            m('label[for="ksg"]', "КСГ"),
            m('input.pure-u-20-24[name="ksg"][type="text"]', {
              value: tal.ksg
             })
          ]),
          m('.pure-u-2-24', [
            m('label[for="prof_k"]', "Пр. койки"),
            m('input.pure-u-20-24[name="prof_k"][type="text"]', {
              value: tal.prof_k
            })
          ]),
          m('.pure-u-2-24', [ 
            m('label[for="sh"]', "Схема"),
            m('input.pure-u-20-24[name="sh"][type="text"]', {
              value: tal.sh
            })
          ]),
        ]),
        
        m('legend.leg-sec', "Диагноз, результат"),
        
        m('.pure-g', [
          m('.pure-u-3-24', [
            m('label[for="ds1"]', "Осн. диагноз"),
            m('input.pure-u-20-24[name="ds1"][type="text"]'), {
              value: tal.ds1              
            }
          ]),
          m('.pure-u-2-24', [
            m('label[for="char1"]', "Характер"),
            m('input.pure-u-16-24[name="char1"][type="text"]'), {
              value: tal.char1
            }
          ]),
          m('.pure-u-2-24', [
            m('label[for="ishod"]', "Исход"),
            m('input.pure-u-16-24[name="ishod"][type="text"]'), {
              value: tal.ishod
            }
          ]),
          m('.pure-u-2-24', [
            m('label[for="travma_type"]', "Травма"),
            m('input.pure-u-14-24[name=" travma_type"][type="text"]'), {
              value: tal.travma_type
            }
          ]),
        ]),
        
        m('.pure-g', [
          m('.pure-u-3-24', [
            m('label[for="ds2"]', "Доп. диагноз"),
            m('input.pure-u-20-24[name="ds2"][type="text"]'), {
              value: tal.ds2
            }
          ]),
          m('.pure-u-2-24', [
            m('label[for="char2"]', "Характер"),
            m('input.pure-u-16-24[name="char2"][type="text"]'), {
              value: tal.char2
            }
          ])
        ]),
        
        m('legend.leg-sec', "Госпитализация"),
        m(".pure-g", [
          m(".pure-u-2-24", [
            m('label[for="hosp_mo"]', "Код МО"),
            m('input.pure-u-22-24[name="hosp_mo"][type="text"][placeholder=""]', {
              value: tal.hosp_mo  
            })
          ]),
          m(".pure-u-5-24", [
            m('label[for="nsndhosp"]', "Номер направления"), 
            m('input.pure-u-22-24[name="nsndhosp"][type="text"]', {
              value: tal.nsndhosp
            })
          ]),
          m(".pure-u-8-24", [
            m('label[for="extr"]', { style: "margin-top: 2.2em;"}, [
              m('input[name="extr"][type="checkbox"]', {
                checked: tal.extr === 0 ? false : true,
                //style: "margin: 1em, 0 0"
              }),
              "Экстренно",
            ]),
          ])
        ]), 
      
      
      ]),

        
      
			m('fieldset', { style: "padding-left: 0%;" }, [
				m('.pure-u-3-24', { style: "margin-top: 5px;" }, 
          m('button.pure-button.pure-button-primary[type="button"]',
            { style: "font-size: 1.1em"},
          "Сохранить" )
        )
      ])
    ]),//- form --
  ]); //- 18-24 -
 } // view
 }
};
const crdForm = function (vnode) {
  let data = vnode.attrs.card, method = vnode.attrs.method;
  //console.log(card);
  let card = {
      crd_num: data.crd_num,
      fam: data.fam,
      im: data.im,
      ot: data.ot,
      birth_date: data.birth_date,
      dul_serial: data.dul_serial,
      dul_number: data.dul_number,
      polis_num: data.polis_num,
      smo: data.smo,
      mo_att: data.mo_att
    };
  return {
  view() {
    return m(".pure-u-6-24.patz-data", { style: "overflow: hidden; padding-right: 1em" },
      m(".legnd", `Карта № ${card.crd_num}`),
      m('form.tcard.pure-form.pure-form-stacked',
         {style:"font-size: 1.2em;", id:"card", oncreate: forTabs, method: method },[
          //m(".legnd", `Карта № ${card.crd_num}`),
          m(".pure-control-group", [
            m('input.pure-u-22-24[name="fam"][type="text"][required][autofocus]', {
              placeholder: 'Фамилия',
              value: card.fam ? card.fam : '',
              onblur: e => card.fam = e.target.value,
              tabindex: "1",
            })
          ]),
          m(".pure-control-group", [
            m('input.pure-u-22-24[name="im"][type="text"]', {
              placeholder: 'Имя',
              value: card.im ? card.im : '',
              onblur: e => card.im = e.target.value,
              tabindex: "2",
            })
          ]),
          m(".pure-control-group", [
            m('input.pure-u-22-24[name="ot"][type="text"]', {
              placeholder: 'Отчество',
              value: card.ot ? card.ot : '',
              onblur: e => card.ot = e.target.value,
              tabindex: "3",
            })
          ]),
          m(".pure-control-group", [
            m('label[for="birth_date"', 'Дата рождения'),
            m('input[name="birth_date"][type="date"]', {
              value: card.birth_date ? card.birth_date : '',
              onblur: e => card.birth_date = e.target.value,
              tabindex: "4",
            })
          ]),
          m(".pure-control-group", [
            m('label[for="polis_ser"', 'Полис'),
            m('input[name="polis_ser"][type="text"]', {
              placeholder: 'Серия',
              value: card.polis_ser ? card.polis_ser : '',
              onblur: e => card.polis_ser = e.target.value,
              tabindex: "5",
            })
          ]),
          m(".pure-control-group", [
            m('input[name="polis_num"][type="text"]', {
              placeholder: 'Номер',
              value: card.polis_num ? card.polis_num : '',
              onblur: e => card.polis_num = e.target.value,
              tabindex: "6",
            })
          ]),
          m(".pure-control-group", [
            m('label[for="smo"', 'CMO'),
            m('input[name="smo"][type="text"]', {
              value: card.smo ? card.smo : '',
              onblur: e => card.smo = e.target.value,
              tabindex: "7",
            })
          ]),
        m("span", `Приписан: ${card.mo_att}`),
        m("span", `Документ ${card.dul_serial} ${card.dul_number}`),
        m('button.pure-button.pure-button-primary[type="submit"]',
          { //onclick: cardSave
          }, "Сохранить"),
        
       m('a.pure-button.', {
            //href: [clinicApi.cards],
            //oncreate: m.route.link,
            //onclick: (e) => m.route.set('/crads/add/'),
            style: "margin-left: 2em;"
            }, "Открыть карту" )
      ]), /*form*/
     
    ); //patz
    } // view
  }; // return
};
const talMain = function (vnode) {
  
  let model;
  
  return {
  oninit () {
    model = moTalon.getModel();
  },
  /*
  oncreate() {
  },
  
  onupdate() {
  },
  */
  view () {
    return m(".pure-g", [
      m(crdForm, { card: model.list[0], method: 'PATCH' } ),
      m(talForm, {talon: model.list[0], method: 'PATCH' } )
    ]); 
  }
}
};
const talOpt = function(vnode) {
  return {
    view(vnode) {
       return m('h2', "Дополнительно");
    }
  };
};
const talPara = function(vnode) {
  return {
    view(vnode) {
       return  m('h2', "Параклиника");
    }
  };
};

const vuTalon = function(vnode) {
  //console.log(vnode.attrs);
  
  let model; //;
  let tabs = ['Талон', 'Параклиника', 'Дополнительно'];
  let conts = [talMain, talPara, talOpt];
  let { id } = vnode.attrs;
 
  return {  
  oninit () {
    model = moTalon.getModel();
    //talon = model.list ? model.list[0] : null;
    //console.log(model);
  },
  onbeforeupdate() {
    //console.log('update');
    model = moTalon.getModel();
  },
  
  view () {

    if ( id == 'add' ) {
      //console.log(id);
      return model.data ?
        m(tabsView, {model: model, tabs: tabs, conts: conts, method: 'POST'})
      : m(vuLoading);
    }
    //return m(tabsView, {model: model, tabs: tabs, conts: conts, method: 'PATCH'})
    return model.error ? [ m(".error", model.error) ] :
      model.list ? //&& model.data ? 
        m(tabsView, {model: model, tabs: tabs, conts: conts, method: 'PATCH'})
      : m(vuLoading);
  } 
}
};

// src/clinic/view/vuTalonsList.js

const talonFind = {
  
  /*
  oninit(vnode) {
  },
  */
  view (vnode) {
    return m(".pure-g",
      m(".pure-u-1-1",
        m("form.pure-form[id=talon_find]",
          m("fieldset",
            m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[name=q_tal][type='search']",
                  {placeholder: "Номер талона",
                  }
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_crd][type='search']",
                  {placeholder:"Номер карты"}
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_date][type='date']",
                  {placeholder:"С даты"}
                )
              ),

              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_dspec][type='search']",
                  {placeholder:"Специалист (код)"}
                )
              ),
              
              /*
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_data_end][type='date']",
                  {placeholder:"По дату"}
                )
              ),
              */
              m(".pure-u-1-5",
                m('button.pure-button.pure-button-primary[type="button"]', {
                    //value: 0,
                    onclick: moTalonsList.talonsFind
                  },
                "Найти"
                )
              )
            ])
          )
        )
      )
    );
  }
};

const toTalon = function (tal_num) {
    m.route.set(clinicApi.talon_id, { id: tal_num } );
    return false;
};

// clojure
const vuTalonsList = function (vnode) {
  
  var talonz_hdr = {
      crd_num: ['Карта', 'link'],
      fam: ['ФИО'],
      tal_num: ['Талон', 'link'],
      open_date: ['Открыт'],
      close_date: ['Закрыт'],
      purp: ['Цель'],
      ds1: ['Диагноз'],
      spec: ['Спец'],
      code: ['Код'],
      family: ['Врач']
     
   };
  var model = moTalonsList.getModel();

  return {
    
  oninit () {
    //this.model = moCardsList.getModel();
    //moCardsList.getList(model);
    moModel.getViewRpc(model, {}, restClinic.talons_cnt.url, restClinic.talons_cnt.method );
  },
  /*
  oncreate() {
  },
  
  onupdate() {
  },
  */
  listMap (s) {
    let fio = `${s['fam']} ${s['im']} ${s['ot']}`;
    return m('tr', [
      Object.keys(talonz_hdr).map( (column) => {
        //console.log(talonz_hdr[column]);
        let cell = column === 'fam' ? fio : s[column];
        let td = talonz_hdr[column].length == 2 ? m('td.choice.blue', {
          //data:  cell,
          onclick: column == "crd_num" ?
            e => { e.preventDefault(); toCard(cell); } :
            e => { e.preventDefault(); toTalon(cell);}
        }, cell) : m('td', cell);
        return td;
      }),
      
      m('td', m('i.fa.fa-minus-circle.choice.red', {
        data: s.tal_num,
        //onclick: m.withAttr( "data", vuForm.ddel)
      }) )
    ]);
  },

  view (vnode) {

    //return m(tableView, {model: this.model , header: this.header }, [
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        //m(vuTheader, { header: headerString} ),
        m(talonFind),
        model.list[0] ? model.list[0].recount ?
          m('h1.blue', {style: "font-size: 1.5em;"},
            `${model.list[0].recount} записей в таблице`) : 
        m('table.pure-table.pure-table-bordered[id=find_table]', [
          m('thead', [
            m('tr', [
              Object.keys(talonz_hdr).map( (column) => {
                let field = talonz_hdr[column];
                return field.length > 1 ? m('th.sortable',
                  { data: column, onclick: m.withAttr('data', model.sort) },
                  [field[0], m('i.fa.fa-sort.pl10')]
                  ) : m('th', field[0]);
              }),
              m('th', "Удалить")
            ])
          ]),
          m('tbody', [model.list.map( this.listMap )] )
        ]) : m('h1.blue', {style: "font-size: 1.5em;"}, "Нет таких записей")
            
        /*
        m(vuDialog,
          { header: headerString,
            word: vuForm.word
          }, m(vuForm, { model: modelObject, name: nameString },
              m(this.itemForm, { item: vuForm.item, data: modelObject.data, method: vuForm.method } )
             )
        )
        */
      ] : m(".loading-icon", [
            m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
            m('span.sr-only', 'Loading...')
          ]); 
  }
  }; //return this object
};

// src/clinic/router_clinic.js

//m.route(document.getElementById('content'), "/", {
m.route(document.body, "/", {
  [clinicApi.root]: {
    render: function() {
      return m(vuMain, clinicMenu,
        m(vuClinic, { text: "Медстатистика: Поликликлиника" }));
    }
  },
  [clinicApi.cards] : {
    render : function() {
        return m(vuMain, clinicMenu, m(vuCardsList) );
      }
  },
  
  [clinicApi.card_id] : {
    onmatch: function(args) {
      
      moCard.clear();
      //actionsCard.clear({}): // initial state
      let { id } = args;
      // TODO card number may be not an Int but any string
      if ( !isNaN(parseInt(id) ) )  moCard.getCard(args); //tionsCard.get(args); //
      if ( !Boolean(moCard.data) ) moCard.getOptions();
      //console.log(args);
      return vuCard;
    },
    render : function(vnode) {
        //console.log(vnode.attrs);
        return m(vuMain, clinicMenu, vnode );
      }
  },

  [clinicApi.talons] : {
    render : function() {
        return m(vuMain, clinicMenu, m(vuTalonsList) );
      }
  },
  [clinicApi.talon_id] : {
    onmatch: function(args) {
      let { id } = args;
      if ( !isNaN(parseInt(id) ) )  moTalon.getTalon(args);
      if ( !Boolean(moTalon.data) ) moTalon.getOptions();
      return vuTalon;
    },
    render : function(vnode) {
        return m(vuMain, clinicMenu, vnode );
      }
  },
  
});
