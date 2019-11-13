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

    cards_cnt: { url:"rpc/get_crd_count", method:"POST" }, 
    card_find: { url:"rpc/cards_list", method:"POST" },
    get_card: { url:"rpc/clin_card_by_num", method:"POST"},
    get_crd_talons: {url: 'rpc/crd_talons', method: 'POST'},
    
    //talons_cnt: { url:"count_talons_clin", method:"GET" }, 
    talons_cnt: { url:"rpc/get_tal_count", method:"POST" }, 
    talon_find: { url:"rpc/talons_list", method:"POST"},
    get_talon: { url:"rpc/get_talon_by_num", method:"POST"},

    get_pmu: { url:"rpc/get_tal_pmu", method:"POST"},
    // now current polis in talon inclided
    //get_polis: { url:"rpc/get_tal_polis", method: "POST" },
    para_clin: { url: "para_clin"},
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

const clinicMenu = { subAppMenu: {

  cards: {
    nref: [ `#!${clinicApi.cards}`, "Карты"],
  },

  talons: {
    nref: [`#!${clinicApi.talons}`, "Визиты"],
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
  if ( !error)
    return 'Ошибка сервера (детали в журнале)'
  let e= error.response ? error.response: 'Ошибка сервера (пустой ответ)' ;
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

//export const _region= ()=> int(window.localStorage.getItem('smo_reg'));

const _region= ()=> '25.';

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

// src/apps/model/moTalons.js

const tmonth = function () {
    let d = new Date();
    return d.getMonth() + 1;
 };

const moTalonsList = {
  // :: Object
  // return model object (POJO)
  getModel() {
    const model = {
      url: restClinic.talon_find.url,
      method: restClinic.talon_find.method,
      list: null, // main data list (showing in table page)
      error: null, // Promise all error
      order: true, // for list
      sort: null // for list
    };
    return model;
  },
  // in cards talons reads from actual table only
  // there is backdoor, you may set current local year to old date
  // then talons will be reads and writes to old table
  // talons reads from, 
  year: _month().split('-')[0], // on init app
  _year:  _month().split('-')[0], // on init app year,
  // only one table
  _table: 'talonz_clin_',
  _pmu: 'para_clin_',
  talTable() {
    return `${moTalonsList._table}${moTalonsList._year.slice(2)}`;
  },
  pmuTable() {
    return `${moTalonsList._pmu}${moTalonsList._year.slice(2)}`;
  },
  
  markDelete(event, num) {
    let pg_rest =  _schema('pg_rest');
    let table= moTalonsList.talTable();
    let url=`${pg_rest}${table}?tal_num=eq.${num}`;
    return m.request({
      url: url,
      method: 'PATCH',
      body: { talon_type: 0 },
    }).then( () => {
      return num;
    }).catch( err => {
      //model.save = { err: true, msg: errMsg(err) };
      throw ( errMsg (err) );
    });
  },
  
};

const talonOpt= {
  options: [ restSprav.doctor, restSprav.ist_fin, restSprav.smo_local, restSprav.okato,
    restSprav.purp, restSprav.chm, restSprav.cishod, restSprav.cresult, restSprav.travma ],
  data: new Map(),
  error: null,
  getOptions: async function() {
    if (this.data && this.data.size && this.data.size !== 0) return true;
    await moModel.getData( talonOpt );
  }
};

const moTalon = {
  
  getModel() {
    const model= {
      // current polis included in talon
      url: [restClinic.get_talon.url, restClinic.get_pmu.url], //restClinic.get_polis.url],
      method: [restClinic.get_talon.method,  restClinic.get_pmu.method], //restClinic.get_polis.method],
      map_keys: ['talon', 'pmu', 'polis'],
      talon: null,
      card: null,
      pmu: null,
      polis: null,
      tosave: null,
      error: null,
      save: null
    };
    return model;
  },
  
  getTalon(model, card, talon) {
    let tal= parseInt(talon), crd = parseInt(card);
    if ( !isNaN(tal) && tal !== 0) {
      const t1= { tbl: moTalonsList.talTable(), _tal: tal };
      const t2= { tbl: moTalonsList.pmuTable(), _tal: tal };
      //const t3= { tyear: moTalonsList._year, _tal: tal };
      // exisiting talon? card will be fetched within talon record
      return moModel.getViewRpcMap(
        model, [ t1, t2 ]
      ).then( t => moTalon.prepare( model )  );//.catch(e => alert(e));
    }
    // get card only to new talon
    if ( isNaN(crd) || crd === 0) {
      model.error = 'Нужно выбрать карту';
      return false;
    }
    let pg_rest = _schema('pg_rest');
    let url = `${pg_rest}cardz_clin?crd_num=eq.${crd}`;
    return m.request({
      method: 'GET',
      url: url
    }).then(function(res) {
      // there are no talon and pmu keys
      model.card =  moTalon.set_polis( res ); // res is list
      model.pmu= [];
      moTalon.prepare( model ); 
    }).catch(function(err) {
      model.error = errMsg(err);
    });
  },
  
  set_polis( res ) {
    if (res.length === 0)
      throw 'Empty card for new talon';
    const card= Object.assign({}, res[0]);
    card.crd_polis_ser= card.polis_ser;
    card.crd_polis_num= card.polis_num;
    card.crd_smo= card.smo;
    return [card];
  },
  
  // delete from talon cards fields
  to_talon(data, fields) {
    let t = {};
    Object.keys(data).map( k => {
      if (fields.indexOf(k) < 0) t[k] = data[k];
    });
    t.crd_num = data.crd_num;
    if ( !t.talon_month ) t.talon_month= tmonth();
    if (!t.tal_num) {
        t.first_vflag= 1; // new talon with first visit always
        t.talon_type= 1; // open talon
        t.urgent= 0;
    }
    if( Boolean(t.for_pom) ) {
        t.urgent= t.for_pom == 2 ? 1: 0;
    }
    if (!data.ot) t.d_type= '5'; // d_type only one case here NET OTCHESYVA
    return t;
  },
  
  
  prepare( model ) {
   const card_fileds = [
    'id', 'crd_num', 'fam', 'im', 'ot', 'birth_date',
    'crd_polis_ser', 'crd_polis_num', 'crd_smo',
    'dul_serial', 'dul_number',
    'mo_att' ];
    // prepare card
    let card = model.card ? model.card[0] : model.talon[0];
    let c = {};
    for (let f of card_fileds) {
      c[f] = card[f];
    }
    //c.smo -= _reg;
    //c.old_card= c.crd_num;
    model.card= c; // rewrites and this is not a list
    // prepare talon
    if ( Boolean(model.talon) && model.talon.length > 0)
      model.talon= moTalon.to_talon(model.talon[0], card_fileds);
    else
      model.talon= moTalon.to_talon( c, card_fileds );
  },
  
  saveTalon(event, model, method) {
    //console.log(event);
    event.target.parentNode.classList.add('disable');
    let to_save= Object.assign({}, model.talon);
    let pg_rest =  _schema('pg_rest');
    let { tal_num } = to_save;
    let table= moTalonsList.talTable();
    let url=`${pg_rest}${table}`;
    if ( Boolean(tal_num) ) {
      url += `?tal_num=eq.${tal_num}`;
      delete to_save.tal_num;
    }
    ['created', 'modified', 'cuser', 'urgent'].forEach( k=> delete to_save[k] );
    Object.keys(to_save).map( k=> {
      if ( to_save[k] === "" || to_save[k] === null ) {
        //console.log(k);
        delete to_save[k]; //= null; // include 0 "" null
      }
    });
    return m.request({
      url: url,
      method: Boolean(tal_num) ? 'PATCH': 'POST',
      body: to_save,
      headers: {Prefer: 'return=representation'}
    }).then( res => {
      event.target.parentNode.classList.remove('disable');
      return res;
    }).catch( err => {
      //model.save = { err: true, msg: errMsg(err) };
      event.target.parentNode.classList.remove('disable');
      throw ( errMsg (err) );
    });
  },
  
};

// src/clinic/model/moCards.js

const moCardsList = {
  // return model object 
  getModel() {
    const model = {
      url: restClinic.card_find.url,
      method: restClinic.card_find.method,
      list: null, // main data list (showing in table page)
      error: null, // Promise all error
      order: true, // for list
      sort: null // for list
    };
    return model;
  },
  
  sort(model, id=null) {
    //console.log(id);
    let order = model.order ? 'desc' : 'asc';
    let field = id ? id : 'id'; 
    model.list = _.orderBy(model.list, [ field ], [ order ]);
    model.order = !model.order;
  },
  _table: 'cardz_clin',
  crdTable() {
    return `${moCardsList._table}`;
  },
};

const cardOpt= {
  options: [restSprav.dul, restSprav.smo_local, restSprav.mo_local, restSprav.okato],
  data: new Map(),
  error: null,
  getOptions() {
    if (this.data && this.data.size && this.data.size !== 0) return;
    moModel.getData( cardOpt );
  }
};

const moCard = {

  getModel() {
    const model= {
      url: [restClinic.get_card.url, restClinic.get_crd_talons.url],
      method: [restClinic.get_card.method, restClinic.get_crd_talons.method],
      map_keys: ['card', 'talons'],
      //map_data: new Map(),
      card: null,
      talons: null,
      error: null,
      save: null
    };
    return model;
  },
  
  getCard(model, crd) {
    let c= { _tbl: moCardsList.crdTable(), crd_num: String(crd) };
    let t= { tal_tbl: moTalonsList.talTable(), crd_num: String(crd) };
    //console.log(crd);
    return moModel.getViewRpcMap(
      model, [c, t]
    );
  },
  
  saveCard(event, card, model, method) {
    event.target.parentNode.classList.add('disable');
    //let { crd_num } = model.card[0];
    //model.card = Object.assign(model.card, card);
    const to_save= Object.assign({}, card);
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
    let schema = _schema('pg_rest');
    //let method = event.target.getAttribute('method');
    let { crd_num, id, old_card } = card;
    let table = `${schema}cardz_clin`;
    let url = id ? `${table}?id=eq.${id}`: table;
    ['id', 'created', 'modified', 'cuser'].forEach( k=> delete to_save[k] );
    if ( method === 'PATCH' && (crd_num == old_card) )
      // same card number 
      delete to_save.crd_num; // primary key duplication
    // else change card number
    delete to_save.old_card; // no that field in table
    //to_save.smo = parseInt(to_save.smo) + _reg;
    return m.request({
      url: url,
      method: method,
      body: to_save
    }).then( res => {
      event.target.parentNode.classList.remove('disable');
      return true;
    }).catch( err => {
      //model.save = errMsg(err);
      event.target.parentNode.classList.remove('disable');
      throw ( errMsg (err) );
      //vuDialog.open();
    });
  }
};

const vuClinic = function(vnode) {
  return {
    oninit: function(vnode) {
      // init optons data
      //if ( !Boolean(moCard.data) ) moCard.getOptions();
      //if ( !Boolean(moTalon.data) ) moTalon.getOptions();
    },
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
  }
};

const getFIO= s=> {
   let f= ['fam', 'im', 'ot'].map(k=> s[k]? s[k]: '');
   return `${f[0]} ${f[1]} ${f[2]}`;
};

const _Num= num=> num ? num: ''; //talon number

//talon editable
const _notEdit= tal=> {
  // 0- deleted 1- open (may edit) 2- closed
  //if (tal.talon_type === null || tal.talon_type === 1)
    // talon of the same year may edit
    // case of 1. mek else we can not send it twice in same year
    // same year may edit
    if( moTalonsList.year == moTalonsList._year )
      //console.log(tal.tal_num, tal.talon_type);
      return false; // may edit
  return true;
};

const talNum= tal=> 
  m('legend', `Талон № ${_Num(tal.tal_num)}`,
    m('span', {style: "padding: 3em"}, _notEdit(tal) ? 'закрыт': 'открыт') , `Год ${moTalonsList._year}`);

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


const cardFind= function (vnode) {

  let { model } = vnode.attrs; 
  let href= [clinicApi.card_add];
  
  const findCards= function(event) {  
    // button FIND click event handler callback 
    event.preventDefault();
    let data = moModel.getFormData( $('form#card_find') );
    //console.log ( data );
    //return false;
    data._tbl= moCardsList.crdTable();
    data.lim = 50;
    data.offs = 1;
    moModel.getViewRpc( model, data );
    return false;
  };
  return {
    view () {
    //console.log(vnode.attrs);
    return m(".pure-g", [
      //m(".pure-u-2-12", m('a.pure-button.pure-button-primary', { href: `#!${clinicApi.card_add}`}, "Добавить")),
      m(".pure-u-18-24",
      // data gets from this FORM fieldsl
        m("form.pure-form[id=card_find]",
          m("fieldset",
            m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[name=q_crd][type='text']",
                  {placeholder: "Номер карты", style: "font-size: 1.2em"
                  //onkeyup: m.withAttr("value", vmFind.setFind ),
                  //value: vmFind.toFind
                  }
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_fam][type='text']",
                  {placeholder:"Фамилия", style: "font-size: 1.2em"}
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_im][type='text']",
                  {placeholder:"Имя", style: "font-size: 1.2em"}
                )
              ),
              m(".pure-u-1-3",
                m('button.pure-button[type="button"]', {
                    //value: 0,
                    onclick: findCards, style: "font-size: 1.2em"
                  }, "Найти" ),
                m(m.route.Link, { selector: 'a.pure-button.pure-button-primary', 
                  href: href,
                  //oncreate: m.route.link,
                  style: "margin-left: 2em; font-size: 1.2em"
                  }, "Новая карта" )
              ),
            ])
          )
        )
      ),
    ]);
  }
}
};

// clojure
const vuCardsList = function (vnode) {
  
  const cardz_hdr = {
      crd_num: ['Карта'],
      fam: ['ФИО'],
      birth_date: ['Дата рождения'],
      polis_num: ['Номер полиса'] 
   };
  
  const model= moCardsList.getModel();
  const table_id= moCardsList.crdTable();
  moModel.getViewRpc(model, {_tbl: table_id}, restClinic.cards_cnt.url, restClinic.cards_cnt.method );
  const sort= '';
  
  const newTalon= (e) => {
    e.preventDefault();
    let crd= e.target.getAttribute('data');
    m.route.set(clinicApi.talon_id, { tal: 0, crd: crd} );
    return false;
    //return false;
  };
  
  const hdrMap= function(){
    return m('tr', [
      Object.keys(cardz_hdr).map( (column) => {
        let field = cardz_hdr[column];
        return field.length > 1 ? m('th.sortable',
          { data: column, onclick: sort },
          [field[0], m('i.fa.fa-sort.pl10')]
        ) : m('th', field[0]);
      }),
      m('th', "Новый талон")
    ]);
  };
  
  const listMap= function(s) {
    let fio = getFIO(s), first = true;
    return m('tr', [
      Object.keys(cardz_hdr).map( (column) => {
        let cell = column === 'fam' ? fio : s[column];
        let td = first ? m('td.choice.blue', m (m.route.Link, {
          href: `${clinicApi.cards}/${cell}`,
          //oncreate: m.route.link
        }, cell)) : m('td', cell ? cell: '');
        first = false;
        return td;
      }),
      
      m('td', m('i.fa.fa-plus-circle.choice', {
        style: "color: green; font-size: 1.7em; underline: none",
        data: s['crd_num'],
        onclick: newTalon
        }) )
      ]);
  };
  
  return {
    
    view () {
      
      return model.error ? [ m(".error", model.error) ] :
        model.list ? m('div', { style: "padding-left: 2em"}, [
          //m(vuTheader, { header: headerString} ),
          m(cardFind, { model } ),
          model.list[0] ? model.list[0].recount ? m('div' , 
            m('h1.blue', {style: "font-size: 1.5em;"}, 
              `${model.list[0].recount} записей в таблице`)
          ) : m('table.pure-table.pure-table-bordered', { id: table_id }, [
            m('thead', hdrMap() ),
            m('tbody', [model.list.map( listMap )] )
          ]) : m('h1.blue', {style: "font-size: 1.5em;"}, "Нет таких записей")
      ]) : m(vuLoading); 
    }
  }; //return this object
};

const tabsView = function(vnode) {
  //console.log(vnode.attrs);
  
  //let item = vnode.attrs.item;
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
    oncreate() {
      //console.log(vnode.attrs.data);
      tabs = document.getElementsByClassName('tab');
      tabs_cont=document.getElementsByClassName('tab-content');
      //console.log(tabs_cont);
      tabs[0].classList.add('active');
      tabs_cont[0].classList.add('show');
      hideTabs(1); // other hide
    },
    
    view() {
      let idx=0;
      return [ m('div#tabs', [
        tab_names.map( (name) => {
          return m('.tab',
              { idx: idx++,
                onclick: changeTab
              },  
            name);
        } ),
        tab_contents.map( (cont) => {
          //console.log(cont);
          return m('.tab-content',
            //{ oncreate: (vnode => tabs_cont.push(vnode.dom)) },
            
            m(cont, {model: vnode.attrs.model, method: vnode.attrs.method}) );
        })
      ]),
      m(vuDialog, { header: 'Ошибка бработки', word: vnode.attrs.model.word },
        m('span.red', {style: "font-size: 1.2em; font-weight: 600"},
          vnode.attrs.model.save ? vnode.attrs.model.save: 'No messages'
        )
      )
    ];
  }
}
};

const forTabs = function(vnode) {
  //vnode.dom.reset();
  /*
  let id = vnode.dom.getAttribute('id');
  if ( id == 'card') {
    vnode.dom.addEventListener('submit', moCard.save);
    //console.log(id);
  }
  else {
    vnode.dom.addEventListener('submit', moTalon.save);
    //console.log(id);
  }
  //console.log(id);
  */
  let inputs = vnode.dom.querySelectorAll("input,select,button");
  for (let i = 0 ; i < inputs.length; i++) {
    inputs[i].addEventListener("keypress", (e) => {
      if (e.which === 13 || e.keyCode === 13) {
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

// label = [class, text]
// input = tag = [class, type, required]

/*
const month = function () {
    let d = new Date();
    return d.getMonth() + 1;
 };
*/
const talonField = {

  open_date: { label: ['', "Открыт"], input: {
      tag: ['.pure-u-22-24', "date", 1, true],
      attrs: {style: "height: 45%",}
    }
  },
  close_date: { label: ['', "Закрыт"], input: {
      tag: ['.pure-u-22-24', "date", 2, true],
      attrs: {style: "height: 45%",}
    }
  },
  talon_month: { label: ['.leg_sec.red', "Месяц талона"], input: {
      tag: ['.pure-u-12-24.tal_month', 'number', 3, true],
      attrs: {
        style: "height: 45%", min: 1, max: 12,
        //fval: v => v ? v : month()
      }
    }
  },
  mek: { label: ['', "МЭК", 'check'], input: {
      tag: ['', "checkbox", 4,  false],
      attrs: {style: "margin-right: 0.7em"}
    }
  },
  urgent: { label: ['', "Неотложный", 'check'], input: {
      tag: ['', "checkbox", 5, false],
      attrs: {style: "margin-right: 0.7em" } //, fcheck: v => v == 2 } // type coercion
    }
  },
  
  first_vflag: { label: ['', "Первичный", 'check'], input: {
      tag: ['', "checkbox", 6, false],
      attrs: {style: "margin-right: 0.7em"}
    }
  },
  /*
  finality: { label: ['', "Закончен", 'check'], input: {
      tag: ['', "checkbox", 6,  false],
      attrs: {style: "margin-right: 0.7em"}
    }
  },
  */
  ist_fin: { label: ['', "Оплата"], input: {
      tag: ['.pure-u-18-24', "text", 7, true],
      //attrs: { min: 1, max: 9}
    }
  },
  purp: { label: ['', "Цель"], input: {
      tag: ['.pure-u-18-24', 'number', 8, true],
      attrs: { min: 0, max: 33}
    }
  },
  doc_spec: { label: ['', "Врач"], input: {
      tag: ['.pure-u-22-24', "number", 9, true],
      attrs: { placeholder: "Спец"}
    }
  },
  doc_code: { label: ['', "Код"], input: {
      tag: ['.pure-u-22-24', "number", 10, true]
    }
  },
  visit_pol: {label: ['', "Амбул"], input: {
    tag: ['.pure-u-20-24', 'number', 11]
    }
  },
  visit_home: {label: ['', "На дом"], input: {
      tag: ['.input.pure-u-20-24', "number", 12]
    }
  },
  ds1: {label: ['', "Осн. диагноз"], input: {
      tag: ['.input.pure-u-20-24', "text", 13, true]
    }
  },
  char1: {label: ['', "Характер"], input: {
      tag: ['.input.pure-u-16-24', "text", 14, true]
    }
  },
  ishod: {label: ['', "Исход"], input: {
      tag: ['.input.pure-u-16-24', "text", 15, true]
    }
  },
  rslt: {label: ['', "Результат"], input: {
      tag: ['.input.pure-u-16-24', "text", 16, true]
    }
  },
  ds2: {label: ['', "Доп. диагноз"], input: {
      tag: ['.input.pure-u-20-24', "text", 17]
    }
  },
  char2: {label: ['', "Характер"], input: {
      tag: ['.input.pure-u-16-24', "text", 18]
    }
  },
  travma_type: {label: ['', "Травма"], input: {
      tag: ['.input.pure-u-14-24', "text", 19]
    }
  },
};

const pmuAdd = {
  code_usl: { label: ['', 'Код ПМУ'], input: {
      tag: ['.input-find.pure-u-3-4', "text"],
      //attrs: { placeholder: 'Номер' }
    }
  },
  ccode: { label: ['', 'Номер ПМУ'], input: {
      tag: ['.input-find.pure-u-3-4', "number"],
      //attrs: { placeholder: 'Номер' }
    }
  },
  grup: { label: ['', 'Группа ПМУ'], input: {
      tag: ['.input-find.pure-u-3-4', "number"],
      //attrs: { placeholder: 'Номер' }
    }
  },
  
};

// label = [class, text], if null no label
// input = tag = [class, type, tabindex (int), required(bool)]
// input attrs: attrs fval - value function, fblur - onblur function

const cardField = {

  //vfunc:  v => v ? v : '',
  //smo_val: v => v ? v - 250000: '',

  crd_num: { label: ['', "Номер карты"], input: {
      tag: ['', "text", 1, true],
      attrs: { autofocus: true }
    }
  },
  fam: { label: ['', ''], input: {
      tag: ['', 'text', 2, false],
      attrs: { placeholder: "Фамилия" }
    }
  },
  im: { label: ['', ''], input: {
      tag: ['', 'text', 3, false],
      attrs: { placeholder: "Имя" }
    }
  },
  ot: { label: ['', ''], input: {
      tag: ['', 'text', 4, false],
      attrs: { placeholder: "Отчество" }
    }
  },
  birth_date: { label: ['', 'Дата рождения'], input: {
      tag: ['', 'date', 5, true],
      //attrs: { }
    }
  },
  dul_type: {label: ['', 'Тип документа'], input: {
      tag: ['.pure-u-1-6', 'number', 6, false],
      attrs: { min: 1 }
    }
  },
  dul_serial: {label: ['', "Документ"], input: {
      tag: ['', 'text', 7, false],
      attrs: { placeholder: "Серия" }
    }
  },
  dul_number: {label: ['', ''], input: {
      tag: ['', 'text', 8, false],
      attrs: { placeholder: "Номер" }
    }
  },
  dul_date: {label: ['', 'Дата'], input: {
      tag: ['', 'date', 9, false],
      //attrs: { placeholder: "Номер" }
    }
  },
  dul_org: {label: ['', 'Выдан'], input: {
      tag: ['', 'text', 11, false],
      //attrs: { placeholder: "Номер" }
    }
  },
  polis_ser: {label: ['', "Полис серия"], input: {
      //tag: ['.pure-u-1-6', 'text', 9, false],
      tag: ['', 'text', 12, false],
      //attrs: {  placeholder:"Серия" }
  }},
  polis_num: {label: ['', "Номер"], input: {
      //tag: ['.pure-u-3-6', 'text', 10, false],
      tag: ['', 'number', 13, true],
      attrs: { min : 1 }
  }},
  smo: {label: ['', "Страховщик"], input: {
      //tag: ['.pure-u-1-6', 'text', 13, false],
      //attrs: { pattern: "[0-9]*" }
  }},
  smo_okato: {label: ['', "Регион"], input: {
      tag: ['', 'text', 14, false],
      attrs: { list:  "okato", fblur: true }
  }},
  mo_att: {label: ['',  "Прикреплен к МО"], input: {
      tag: ['.pure-u-1-6', 'number', 15, false],
      //attrs: { }
    }
  },
  city_g: {label: [], input: {
      tag: ['', 'text', 15, false],
      attrs: { placeholder: "Город" }
  }},
  street_g: {label: [], input: {
      tag: ['', 'text', 16, false],
      attrs: { placeholder: "Улица" }
  }},
  home_g: {label: [], input: {
      tag: ['.pure-u-1-8', 'text', 17, false ],
      attrs: { placeholder: "Дом" }
  }},
  corp_g: {label: [], input: {
    tag: ['.pure-u-1-8', 'text',  18, false ],
    attrs: { placeholder: "Корпус" }
  }},
  flat_g: {label: [], input: {
    tag: ['.pure-u-1-8', 'text',  19, false ],
    attrs: { placeholder: "Кв" }
  }},
  phone_wrk: {label: [], input: {
    tag: ['', 'text',  20, false ],
    attrs: { placeholder: "Мобильный тел" }
  }},
  phone_hom: {label: [], input: {
    tag: ['', 'text',  21, false ],
    attrs: { placeholder: "Контактный тел" }
  }},
};

const talCard = {
    fam: { label: [], input: {
      tag: ['.pure-u-22-24', "text"],
      attrs: { placeholder: 'Фамилия' }
    }},
    im: {label: [], input: {
      tag: ['.pure-u-22-24', "text"],
      attrs: { placeholder: 'Имя'}
    }},
    ot: {label: [], input: {
      tag: ['.pure-u-22-24', "text"],
      attrs: { placeholder: 'Отчество'}
    }},
    birth_date: { label: ['', 'Дата рождения'], input: {
      tag: ['', "date"],
      //attrs: {}
    }},
    crd_polis_ser: { label: ['', 'Полис (редактируем в карте)'], input: {
      tag: ['', "text"],
      attrs: { placeholder: 'Серия', readonly: true }
    }},
    crd_polis_num: { label: [], input: {
      tag: ['', "text"],
      attrs: { placeholder: 'Номер', readonly: true}
    }},
    crd_smo: {label: ['', 'СМО'], input: {
      tag: ['', "text"],
      attrs: {},
    }},   
};

// label = [class, text]
// input = tag = [class, type, tabindex (int), required(bool)]

const tof = function(field, data, to_attrs={}) {
  return fieldFrom(talonField, field, data, to_attrs);
};

const cof = function(field, data, to_attrs={}) {
  return fieldFrom(cardField, field, data, to_attrs);
};

const ctf = function(field, data, to_attrs={}) {
  return fieldFrom(talCard, field, data, to_attrs);
};

const ptf = function(field, data, to_attrs={}) {
  return fieldFrom(pmuAdd, field, data, to_attrs);
};

// src/clinic/view/vuCard.js

const _Reg= _region();

const checkDost = card=> {
  let dost= '';
  if ( !card.fam ) dost += '2_';
  if ( !card.im ) dost += '3_';
  if ( !card.ot ) dost += '1_';
  if ( !card.fam && !card.im )
      return 'Укажите Фамилию или Имя';
  if ( Boolean(dost) )
    card.dost= dost;
  return '';
};

const num_digits = function(card) {
    let s= 0, n= 0;
    if ( Boolean(card.polis_ser) )
      s= card.polis_ser.toString().length;
    if ( Boolean(card.polis_num) )
      n= card.polis_num.toString().length;
    try {
      if (s === 0 && n === 16) {
        card.polis_type = 3;
        return "ЕНП 16 цифр";
      }
      if (s === 0 && n > 0 && n < 16) {
        card.polis_type = 2;
        return `Временное свидетельсто ${n} цифр`;
      }
      if (s > 0 && n > 0) {
        card.polis_type = 1;
        return `Старый полис ${n} цифр`;
      }
      card.polis_type = null;
      return m('span.red', `Кривой полис ${n} цифр`);
    } catch (e) {
      return m('span.red', "Тип полиса неизвестен");
    }
};
// set smo select from options
const sel_smo = card=> {
  return e=>  {
    if ( Boolean( e.target.value) ) {
      card.smo= e.target.value;
    } else {
      card.smo= null;
      card.smo_okato= null;
    }
  };
};

  // smo OKATO
const set_smo_okato = (data, card)=> {
  return e=> {  
    if ( Boolean(card.smo) ) {
      let _smo= card.smo; // + _reg;
      let smo = Array.from( data.get('smo_local') ).find( item => item.code == _smo );
      if ( Boolean(smo) ) {
        card.smo_okato = smo.okato;
        let o = Array.from( data.get('okato') ).find( item => item.okato == smo.okato );
        e.target.value = `${o.region}. ${o.name.split(' ')[0]}`;
        return false;
      }
    } else {
      if ( Boolean( e.target.value ) && !e.target.value.includes(_Reg)) {
        rg = e.target.value.split('.')[0];
        card.smo_okato = Array.from(data.get('okato')).find(item => item.region.toString() == rg)['okato'];
      } else {
        e.target.value= null;
        card.smo_okato= null;
      }
    }
  };
};


const getName = function(data, val, key, prop, name, text, first_word=false) {
    // data - optional data MAP
    // val - String fofom input tag value
    // key - String key in data MAP to check
    // prop - String table's column name to check
    // name - String name of table's column to output from
    // text - String text to output if item not find
    // first_word - Boolean out only first word from named column
    
    //console.log(key, val);
    if ( !Boolean(val)) return m('span', " ");
    let item = Array.from( data.get(key) ).find( it => it[prop].toString() == val );
    //console.log(item);
    if (item !== undefined) {
      if ( !first_word ) return m('span', `${item[name]} `);
      return m('span', `${item[name].split(' ')[0]} `);
    }
    return m('span.red', `${text} `);
  };
  

const toSaveCard= card=> {
    //dost
    
    let dost= checkDost(card);
    if ( Boolean(dost) )
      return dost;
    
    // gender
    if ( !Boolean( card.gender ))
      return 'Укажите пол';
    
    // DUL
    if ( !card.dul_serial && !card.dul_number )
      card.dul_type= null;
    if ( Boolean(card.polis_type) && card.polis_type < 3 && !Boolean(card.dul_type) )
      return 'Для этого типа полиса требуются полные данные ДУЛ';
    
    // SMO
    if ( !card.smo && !card.smo_okato)
      return 'Укажите либо СМО либо СМО ОКАТО';
    //if ( card.smo < _reg)
    //  card.smo += _reg;
    
    // city_g
    if ( !card.city_g && Boolean(card.street_g) )
      return 'Укажите город';
    
    // nulled empty int values 
    ['mo_att'].forEach( k=> {
      if ( !Boolean( card[k] ) )
        card[k]= null;
    });
    
    return false;
};


const crdMain = function(vnode) {

  let { model, method }= vnode.attrs;
  const data= cardOpt.data;
  let card;
  if (model.card.length > 0) {
    card= model.card[0];
    card.old_card= card.crd_num;
  } else {
    card= {};
  }
  const ufms_test= v=> {
    if (v.length < 6) return false;
    let u= parseInt(v);
    if ( isNaN(u) ) return false;
    return u;
  };
  const ufms_model= { ufms: 'ufms?code=eq.', order_by: 'code', list: null, headers: { Range: '0-20' } };
  const set_ufms= e=> {
    card.ufms = e.target.value;
    //console.log(e.target.value);
    let u= ufms_test(card.ufms);
    if ( Boolean(u) ) {
      ufms_model.url = `${ufms_model.ufms}${u}`;
      return moModel.getList(ufms_model);// .then(t=> console.log( ds_model.list ));
    }
    return false;
  };
  const cardSave= function(e) {
    e.preventDefault();
    // form send with forTabs onCreate function
    // above changed all processing will made here
    //console.log(card);
    model.save= toSaveCard(card);
    if ( Boolean( model.save ) ) {
      vuDialog.open();
      return false;
    }
    //model.save= null;
    return moCard.saveCard(e, card, model, method).then(t=>
       m.route.set([clinicApi.cards])
    ).catch(err=> {
      model.save = err;
      vuDialog.open();
    });
  };
  // gender
  const gnd = function(c){
    return ['м', 'ж'].indexOf( c.gender.toLowerCase() );
  };
  // set smo
  //const _set_smo = set_smo(card);
  const _set_smo= sel_smo(card);
  
  // smo OKATO
  const _set_smo_okato = set_smo_okato(data, card);
  // gets the name of option from Map by key
  const get_name = function(val, key, prop, name) {
    return getName(data, val, key, prop, name, 'Неизвестный код', false);
  };
  
  return {
    view: function () {
      //console.log(method);
      //let crd= Boolean (model.talons);
      //console.log(model.talons);
      return m('form.tcard.pure-form.pure-form-aligned',
        {style: "font-size: 1.2em;", id: "card", oncreate: forTabs, onsubmit: cardSave},
        [m('fieldset', [m('legend', "Карта пациента"),
          m(".pure-g", [
            m(".pure-u-7-24", [
// --        // -- TODO check for card.card_type to process card number    
              m(".pure-control-group", cof('crd_num', card,
                  { readonly: Boolean (model.talons.length) } )),
              m(".pure-control-group", cof('fam', card)),
              m(".pure-control-group", cof('im', card)),
              m('.pure-control-group', cof('ot', card)),
              m(".pure-control-group", cof('birth_date', card)),

              m(".pure-control-group", [
                m('label', {for: "gender"}, "Пол"),
                m('span', {style: "line-height: 1em;"}, "М"),
                m('input[name="gender"][type="radio"]', {
                  style: "margin: 0 14px 0 7px;",
                  value: 0,
                  checked: card.gender ? gnd(card) === 0 : false,
                  onchange: e => e.target.checked ? card.gender = 'м' : card.gender = 'ж'
                }),
                m('span', "Ж"),
                m('input[name="gender"][type="radio"]', {
                  style: "margin: 0 0 0 7px;",
                  value: 1,
                  checked: card.gender ? gnd(card) === 1 : false,
                  onchange: e => e.target.checked ? card.gender = 'ж' : card.gender = 'м'
                })
              ]),
// --            
              m(".pure-control-group", [cof('dul_type', card),
                m('span.item_name', get_name(card.dul_type, 'dul', 'code', 'short_name'))
              ]),
              m(".pure-control-group", cof('dul_serial', card)),
              m(".pure-control-group", cof('dul_number', card)),
              m(".pure-control-group", cof('dul_date', card)),
              // UFMS
              m(".pure-control-group", [
                m('label[for=ufms]', 'УФМС'),
                m('input[type=text][tabindex=10][name=ufms]', {
                  list: 'ufms', value: card.ufms, oninput: set_ufms
                }),
                m('datalist[id="ufms"]',
                  ufms_model.list ? ufms_model.list.map(d=> m('option', {
                    value: d.name } ) ) : []
                ),
              ]),
              m(".pure-control-group", cof('dul_org', card)),
            ]), // u-7-24
// ============================			
            m(".pure-u-8-24", [m('legend', "ОМС"),
              m(".pure-control-group", cof('polis_ser', card)),
              m(".pure-control-group", [cof('polis_num', card),
                m('div.item_name', {style: "margin-left: 10em;"}, num_digits(card)),
              ]),
              /*
              m(".pure-control-group", [
                cof('smo', card, {onblur: _set_smo}),
                m('span.item_name',
                  card.smo === null ? '':  get_name(card.smo + _reg, 'smo_local', 'code', 'short_name'))
              ]),*/
// --
              m(".pure-control-group", [
                m('label', { for: "smo"}, "Страховщик"),
                m('select[name="smo"]',
                  {tabindex: 13, value: card.smo, onchange: _set_smo}, [
                  m('option[value=""]', ""),
                  data.get('smo_local').map(s=> m('option', {value: s.code}, s.short_name))
                ])
              ]),
              m(".pure-control-group", [
                m('label', { for: "smo_okato"}, "Регион"),
                m('input[name="smo_okato"][type="text"]', {
                  oncreate: v => _set_smo_okato( { target: v.dom} ),
                  list:  "okato",
                  //value: card.smo_okato,
                  tabindex: "12",
                  onblur: _set_smo_okato
                }),
                //cof('smo_okato', card, {
                //  oncreate: v => set_smo_okato({target: v.dom}),
                //  onblur: set_smo_okato
                //}),
                //m('span.item_name', set_name(card.smo_okato, 'okato', 'okato', 'name', true) )
                m('datalist[id="okato"]', [
                  data.get('okato').map(o => {
                    let okato = `${o.region}. ${o.name.split(' ')[0]}`;
                    return m('option', okato);
                  })
                ])
              ]),
// --          
              m(".pure-control-group", [
                cof('mo_att', card),
                m('.item_name',
                  {style: "margin: 1em 0; padding-left: 1em"},
                  get_name(card.mo_att, 'mo_local', 'scode', 'sname') )
              ]),
            ]), //-- 8-24
// ============================         
            m(".pure-u-9-24", [m('legend', "Адрес"),
              m(".pure-control-group", cof('city_g', card)),
              m(".pure-control-group", cof('street_g', card)),
              m(".pure-control-group", [
                cof('home_g', card),
                cof('corp_g', card),
                cof('flat_g', card)
              ]),
              m(".pure-control-group", cof('phone_wrk', card)),
              m(".pure-control-group", cof('phone_hom', card))
            ]) //u-9-24
// ============================
          ]) // pure-g
        ]), // fieldset
// ============================
          m(".pure-g", [
            m(".pure-u-10-24 ", [
              m('span#card_message', '')
                //model.save ? model.save.ok ? model.save.msg : m('span.red', model.save.msg) : '')
            ]),
            m(".pure-u-14-24 ", [
              m('button.pure-button.pure-button-primary[type="submit"]',
                { //onfocus: setPale,
                  //onclick: cardSave
                  //tetabindex: "20",
                }, "Сохранить"),

              /*m('a.pure-button.', {
                href: [clinicApi.cards],
                oncreate: m.route.link,
                //onclick: (e) => m.route.set('/cards/0/'),
                style: "margin-left: 2em;"
              }, "Добавить новую")*/
            ])
          ]) // pure-g
        ]);// form
//=========================
    } // view
  }; // return
}; //func
const crdViz = function(vnode) {

  let crd;
  if ( vnode.attrs.model.card.length > 0 )
    crd= vnode.attrs.model.card[0].crd_num;
  else
    crd= '';
  //console.log(crd);
  let tal = vnode.attrs.model.talons ? vnode.attrs.model.talons: [];
  // tal_num int, open_date date, close_date date, purp smallint,
  //doc_spec int , doc_code int, family varchar,  ds1 varchar
  let tal_hdr = {
      tal_num: ['Номер талона', 'link'],
      open_date: ['Открыт'],
      close_date: ['Закрыт'],
      purp: ['Цель визита'],
      doc_spec: ['Спец'],
      doc_code: ['Спец код'],
      family: ['Доктор'],
      ds1: ['Диагноз']
  };

  return {

    listMap (s) {
      return m('tr', [
        Object.keys(tal_hdr).map( column => {
          let td = tal_hdr[column].length === 2 ?
            m('td.choice.blue', m(m.route.Link, {
              href: `${clinicApi.talons}/${s[column]}/${crd}`,
            }, s[column])) : m('td', s[column]);
          return td;
        })
      ]);
    },

    view() {
       //console.log('talPara view');
      return [m('.pure-g', m('.pure-u-1-1', m('table.pure-table.pure-table-bordered', [
          m('caption', 'Визиты в текущем году'),
          m('thead', [ m('tr', [
              Object.keys(tal_hdr).map( column => m('th', tal_hdr[column][0])),
            ])
          ]),
          m('tbody', [tal.map( this.listMap )] )
        ]) )),
        m('.pure-g', m('.pure-u-1-3',
          m(m.route.Link, { selector: 'a.pure-button.pure-button-primary',
            href: `${[clinicApi.talon_add]}${crd}`,
            style: "float: right; margin-top: 2em; font-size: 1.3 em"
            }, "Добавить талон")
          )
        )
      ]; // return
    } // view
  }; // return
};
const crdExt = function(vnode) {
  return {
    view(vnode) {
       return m('h2', "Дополнительно");
    }
  };
};
const crdAtt = function(vnode) {
  return {
    view(vnode) {
       return  m('h2', "Прикрепить");
    }
  };
};
const crdDel = function (vnode) {
  return {
    view(vnode) {
       return  m('h2', "Удалить/Объеденить");
    }
  };
};
const vuCard = function(vnode) {
  //console.log(vnode.attrs);
  
  let tabs = ['Карта', 'Визиты', 'Дополнительно', 'Прикрепить', 'Удалить'];
  let conts = [crdMain, crdViz, crdExt, crdAtt, crdDel];
  const crd = parseInt(vnode.attrs.crd);
  const model= moCard.getModel();
  model.word= 'Карты';
  moCard.getCard( model, crd );
  const method = Number.isNaN(crd) || crd === 0 ? "POST": "PATCH";
  
  return {  
    oninit () {
      //model = moCard.getModel();
      //card = model.list ? model.list[0] : null;
      //console.log(model);
    },
    onbeforeupdate() {
      //console.log('update');
      //model = moCard.getModel();
    },
  
    view () {
      return model.error ? [ m(".error", model.error) ] :
        cardOpt.data.size > 0 && model.card ? 
          m(tabsView, {model: model, tabs: tabs, conts: conts, method: method})
        : m(vuLoading);
    } 
  };
};

// src/clinic/view/vuTalonsList.js
/*
IN tbl varchar,
IN q_tal integer,
IN q_crd character varying,
IN q_date date,
IN lim integer,
IN offs integer)
*/
const talonFind = function(vnode){
  
  let { model } = vnode.attrs;
  //let yy= moTalonsList._year;
  const findTalons= function(event) {  
    event.preventDefault();
    //let data = moModel.getFormData( $('form#talon_find') );
    let data = moModel.getFormData( event.target );
    //console.log ( data.q_year );
    //moTalonsList.model.list=[];
    //return false;
    if ( !data.q_tal)
      data.q_tal = 1;
    if ( !data.q_crd && Boolean(data.q_date) ) // || data.q_dspec !== "" ) )
      data.q_crd = ".*";
    if ( !data.q_date) //&& data.q_dspec !== "")
      data.q_date = '2010-01-01';
    //data.q_date = data.q_date === "" ? null : data.q_date;
    /*
    if (data.q_dspec === "")
      data.q_dspec = null;
    */
    //data.q_dspec= null;
    data.lim = 50;
    data.offs = 0;
    data.tbl= moTalonsList.talTable();
    delete data.q_year;
    //console.log ( data );
    return moModel.getViewRpc( model, data );
    //return false;
  };
  const changeYear= e=> {
    moTalonsList._year= e.target.value;
    m.route.set([clinicApi.lalons]);
  };
  
  return { 
    view () { return m(".pure-g",
      m(".pure-u-1-1", // data gets from this FORM fieldsl
        m("form.pure-form[id=talon_find]", { onsubmit: findTalons },
          m("fieldset",
            m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_tal][type='number']",
                  { placeholder: "Номер талона",
                    onupdate: v => v.dom.value = '', //vnode hook
                    style: "font-size: 1.2em"
                  }
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_crd][type='text']",
                  {placeholder:"Номер карты", style: "font-size: 1.2em"}
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_date][type='date']",
                  //{placeholder:"С даты"}
                )
              ),
              /*
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_dspec][type='number']",
                  {placeholder:"Специалист (код)"}
                )
              ),
              
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_data_end][type='date']",
                  {placeholder:"По дату"}
                )
              ),
              */
              m(".pure-u-1-8",
                m('button.pure-button.pure-button-primary[type=submit"]', {
                    //onclick: findTalons
                    style: "font-size: 1.2em"
                  },
                "Найти"
                )
              ),
              m(".pure-u-1-5", [ // {style: "float: left"}, [
                m('label[for=q_year]', { style: "padding-right: 2em; font-size: 1.2em" }, 'Год талонов'),
                m("input.input-find.pure-u-1-3[name=q_year][type='number']",
                  { value: moTalonsList._year, onchange: changeYear,
                    style: "font-size: 1.2em; font-weight: 600",
                    min: 2010, max: 2030
                  }
                )
              ]),
            ]) // pure-g
          ) //fieldset
        ) //form
      )// u-1-1
    ); //pure-g;
    } //view
  }; //return
};
// clojure
const vuTalonsList = function (vnode) {
  
  const talonz_hdr = {
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
  let model = moTalonsList.getModel();
  let yy= moTalonsList.talTable();
  //console.log(yy);
  moModel.getViewRpc(model, { _tbl: yy }, restClinic.talons_cnt.url, restClinic.talons_cnt.method );
  
  const markDeleted= (e, num)=> {
    e.preventDefault();
    if (window.confirm(`Пометить талон №${num} на удаление?`)) { 
      return moTalonsList.markDelete(e, num).then( num=> {
        model.list= model.list.filter( t=> t.tal_num != num  ); 
      });
    }
    return false;
  };
  
  const sort= '';
  
  const hdrMap= function(){
    return m('tr', [
      Object.keys(talonz_hdr).map( (column) => {
        let field = talonz_hdr[column];
        return field.length > 1 ? m('th.sortable',
          { data: column, onclick: sort },
          [field[0], m('i.fa.fa-sort.pl10')]
        ) : m('th', field[0]);
      }),
      m('th', "Удалить")
    ]);
  };
  
  const listMap= function(s) {
    let fio = getFIO(s);
    let tal= s.tal_num, crd= s.crd_num;
    return m('tr', [
      Object.keys(talonz_hdr).map( (column) => {
        //console.log(talonz_hdr[column]);
        let cell = column === 'fam' ? fio : s[column];
        let td = talonz_hdr[column].length === 2 ?
        /*
        m('td.choice.blue', {
          //data:  cell,
          onclick: column == "crd_num" ?
            e => { e.preventDefault(); toCard(crd); } :
            e => { e.preventDefault(); toTalon(tal, crd);}
        }, cell) */
        m('td.choice.blue', m(m.route.Link, {
          href: column == 'crd_num' ? `${clinicApi.cards}/${crd}`: `${clinicApi.talons}/${tal}/${crd}`,
        }, cell)) : m('td', cell);
        return td;
      }),
      m('td', _notEdit(s) ? '':
        m('i.fa.fa-minus-circle.choice.red', {
        onclick: e=> markDeleted (e, s.tal_num),
      }) )
    ]);
  };
  
  
  return {
    view () {
    //return m(tableView, {model: this.model , header: this.header }, [
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        //m(vuTheader, { header: headerString} ),
        m(talonFind, { model }),
        model.list[0] ? model.list[0].recount ?
          m('h1.blue', {style: "font-size: 1.5em;"},
            `${model.list[0].recount} записей в таблице`) : 
          m('table.pure-table.pure-table-bordered[id=find_table]', [
            m('thead', hdrMap() ),
            m('tbody', [model.list.map( listMap )] )
          ]) : m('h1.blue', {style: "font-size: 1.5em;"}, "Нет таких записей")
      ] : m(vuLoading); 
    }
  }; //return this object
};

let edit= moTalonsList.year == moTalonsList._year ? false: true;

const talCrd = function (vnode) {
  let { model }= vnode.attrs;
  let { card }= model; // ref to talon model.card
  const data= talonOpt.data;
  //const model= {}; //local model
  const method= 'PATCH';
  //console.log(card);
  let ff = [
    'fam', 'im', 'ot', 'birth_date',
    'crd_polis_ser', 'crd_polis_num'];  //, 'smo'];
  
  const toSave= card=> {
    let dost= checkDost(card);
    if ( Boolean(dost) )
      return dost;
    if ( !card.crd_smo && !card.crd_smo_okato)
      return 'Укажите либо СМО либо СМО ОКАТО';
    // to save card 
    return '';
  };
  
  const _set_smo = e=> {
    if ( Boolean( e.target.value) ) {
      card.crd_smo= e.target.value;
      card.crd_smo_okato= data.get('smo_local')[0].okato;
    } else {
      card.crd_smo= null;
      card.crd_smo_okato= null;
    }
  };

  const cardSave = function(e) {
    e.preventDefault();
    //saveCard(event, card, model, method) {
    
    model.save= toSave(card);
    if ( Boolean( model.save ) ) {
      vuDialog.open();
      return false;
    }
    let _card= Object.assign( {}, card );
    ['crd_polis_num', 'crd_polis_ser', 'crd_smo', 'crd_smo_okato'].map( f=> delete _card[f] );
    _card.smo= card.crd_smo;
    _card.smo_okato= card.crd_smo_okato;
    return moCard.saveCard(e, _card, model, method).catch(err=> {
      model.save = err;
      vuDialog.open();
    });
  };

  return {
    view() {
    //console.log('crdForm view')
      let duls= card.dul_serial ? card.dul_serial: '';
      let duln= card.dul_number ? card.dul_number: 'Нет';
      let mo= card.mo_att ? card.mo_att: '';
      //console.log(card);
      return m(".pure-u-6-24.patz-data", { style: "overflow: hidden; padding-right: 1em" },
        m(".legnd", `Карта № ${card.crd_num}`),
        m('form.tcard.pure-form.pure-form-stacked',
         {style:"font-size: 1.2em;", id:"tal_card", onsubmit: cardSave },[
          //m(".legnd", `Карта № ${card.crd_num}`),
          ff.map( f => m(".pure-control-group", ctf(f, card)) ),
          m(".pure-control-group", [
            m('label', { for: "crd_smo"}, "Страховщик"),
            m('select[name="smo"]',
              {value: card.crd_smo, onchange: _set_smo}, [
              m('option[value=""]', ""),
              data.get('smo_local').map(s=> m('option', {value: s.code}, s.short_name))
            ])
          ]),
          m("span", `Приписан: ${mo}`),
          m("span", `Документ ${duls} ${duln}`),
          m('button.pure-button.pure-button-primary[type="submit"]',
            { disabled: edit
          }, "Сохранить"),
        
       m(m.route.Link, { selector: 'a.pure-button.', 
            href: `${clinicApi.cards}/${card.crd_num}`,
            style: "margin-left: 2em;"
            }, "Открыть карту" )
      ]), /*form*/
      /*
      m('span#card_message',
        model.save ? model.save.err ? m('span.red', model.save.msg) : '' : ''
      )
      */
    ); //patz
    } // view
  }; // return
};

const talNapr= {
 npr_mo: { label: ['', "Код МО"], input: {
      tag: ['.pure-u-22-24', 'number', 1, true],
      //attrs: { min: 0, max: 33}
    }
  },
  npr_spec: { label: ['', "Спец"], input: {
      tag: ['.pure-u-22-24', 'number', 1, true],
      //attrs: { min: 0, max: 33}
    }
  },
  naprlech: { label: ['', "Номер направления"], input: {
      tag: ['.pure-u-22-24', 'number', 1, true],
      //attrs: { min: 0, max: 33}
    }
  },
  hosp_mo: { label: ['', "Код МО"], input: {
      tag: ['.pure-u-22-24', 'number', 1, true],
      //attrs: { min: 0, max: 33}
    }
  },
  nsndhosp: { label: ['', "Номер направления"], input: {
      tag: ['.pure-u-22-24', 'number', 1, true],
      //attrs: { min: 0, max: 33}
    }
  },
  extr: { label: ['', "Экстренно", 'check'], input: {
      tag: ['', "checkbox", 6,  false],
      attrs: {style: "margin-right: 0.7em"}
    }
  },
};

const tnf = function(field, data, to_attrs={}) {
  return fieldFrom(talNapr, field, data, to_attrs);
};

const talNap = function(vnode) {
  let tal= vnode.attrs.model.talon;

  return {
    view() {
      return m("form.pure-form.pure-form-stacked.tcard",
        {style: "font-size: 1.2em;", id: "tal_nap"}, [
          m('fieldset', [ talNum(tal),
            //m('legend', `Талон № ${_Num(tal.tal_num)}`),
            m('label[for="npr_date"]', 'Дата направления'),
            m('input[type=date][name="npr_date"]', { value: tal.npr_date, onblur: e=> tal.npr_date= e.target.value }),
            m('legend.leg-sec', "Направление: лечение. диагностика, консультация"),
            
            m(".pure-g", [
              m(".pure-u-2-24", tnf('npr_mo', tal)),
              m(".pure-u-2-24", tnf('npr_spec', tal)),
              m(".pure-u-5-24", tnf('naprlech', tal)),
            ]),
            m('legend.leg-sec', "Госпитализация"),

            m(".pure-g", [
              m(".pure-u-2-24", tnf('hosp_mo', tal)),
              m(".pure-u-5-24", tnf('nsndhosp', tal)),
              m(".pure-u-8-24", { style: "margin-top: 2.2em;"}, tnf('extr', tal)),
            ]),
          ])
        ]);
    }
  };
};

const _disabled= tal=> { return _notEdit(tal) || !Boolean( _Num(tal.tal_num) ); };

const pmuForm = function (vnode) {
  
  let { talon, pmu }= vnode.attrs.model;
  // form fields
  const fld= ['code_usl', 'ccode', 'grup'];
  // local form pmu obj
  const _pmu= {}, data= talonOpt.data;
  // local model obj
  const md= { url: moTalonsList.pmuTable(), method: 'POST' };
  
  const get_doc= spec=> {
    // if talon to this doctor spec then this doctor code
    if ( !talon.doc_spec || !talon.doc_code) return 0; //error
    if ( talon.doc_spec == spec) return talon.doc_code;
    // else first doc with this spec from all doctors
    let doc= Array.from(data.get('doctor')).find( d=> d.spec == spec);
    if ( doc ) return doc.code;
    return 0; // error
  };
  
  const preparePara= item=> {
    //INPUT
    // item -> code_usl, name, code_podr, code_spec
    // OUTPUT
    // para -> tal_num, date_usl, code_usl, kol_usl, exec_spec, exec_doc, exec_podr
    let exec_spec= parseInt( item.code_spec );
    
    if ( isNaN( exec_spec ) || exec_spec === 0)
      return { error: `Неверный код специалиста ПМУ ${item.code_usl}`}; //error 
    
    let exec_podr= item.code_podr ? item.code_podr : 281;
    
    let exec_doc= get_doc(exec_spec);
    if ( ! Boolean( exec_doc ))
      return { error: `В МО нет доктора по специальности: ${exec_spec}`}; //error   
    
    return {
      tal_num: talon.tal_num, date_usl: talon.open_date,
      code_usl: item.code_usl, kol_usl: 1, exec_podr: exec_podr,
      exec_spec: exec_spec, exec_doc: exec_doc, error: ''
    };
  };
  
  const on_submit = event=> {
    event.preventDefault();
    _pmu.error = _pmu.list = null;
    
    let q= fld.filter( f=> Boolean( _pmu[f] )); // field name
    //console.log(q);
    if ( q.length === 0 )
      return false;
    else
      q= q[0]; // first finded
    
    let errors={};
    // select by group
    if ( q == 'grup' ) {
      _pmu.url= restSprav.grc.url;
      _pmu.method= 'POST';
      return moModel.getViewRpc(_pmu, { grup: _pmu[q] } ).then(()=> {
        if (_pmu.list.length === 0)
          return Promise.reject('Нет такой группы');
       
        let items= [];
        for ( let it of _pmu.list.values() ){
          let item= preparePara(it);
          if ( item.error ) {
            errors[item.error]= errors[item.error] ? errors[item.error] + 1 :  1; 
            continue;
          }
          delete item.error;
          items.push(item);
        }
        if (items.length === 0) return Promise.reject('Плохая группа ');
        // bulk insert to table
        md.headers= {Prefer: 'return=representation'};
        return moModel.getViewRpc(md, items);
      }).then(()=> {
        if ( ! Boolean(md.list) ) return Promise.reject('Empty response after PMU GRUP POST ');
        //let list= Arroy.from(md.list);
        for (let [idx, it] of md.list.entries() ){
          it.name= _pmu.list[idx].name;
          it.ccode= _pmu.list[idx].ccode;
          //console.log(it);
          pmu.push( it );
        }
      }).catch( err=> {
         _pmu.error= err;
         Object.keys(errors).map( e=> {
           _pmu.error= _pmu.error + ` ${e}: ${errors[e]}`; 
         });
      });
    }
    
    _pmu.url= `${restSprav.pmu.url}?${q}=eq.${_pmu[q]}`;
    
    return moModel.getList( _pmu ).then( ()=>{
      // anyway returns Promise
      if (_pmu.list.length === 0) return Promise.reject('Нет таких ПМУ');
      md.item= preparePara( _pmu.list[0] );
      if ( md.item.error ) return Promise.reject(md.item.error);
      // promise
      // reutrn inserted object      
      md.headers= {Prefer: 'return=representation'};
      // promise
      return moModel.formSubmit(event, md, 'POST');
    // add this item to model.pmu
    }).then( res=>{
      if (res.length && res.length > 0) {
        //console.log(res);
        res[0].name= _pmu.list[0].name;
        res[0].ccode= _pmu.list[0].ccode;
        pmu.push( res[0] );
        //pmu= [...pmu, res[0] ];
        //console.log(pmu);
        //return true;
      } else
        return Promise.reject('Empty response after PMU ITEM POST ');
    }).catch( err => {
    // process error
      _pmu.error= err;
    });
  
  };
  return {
    view() {
      return [ m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", { onsubmit: on_submit },
            m("fieldset", m(".pure-g", [
              fld.map( f => m(".pure-u-1-4", ptf(f, _pmu) ) ),
              m(".pure-u-1-5", 
                m('button.pure-button.pure-button-primary[type="submit"]',
                  {style: 'margin-top: 1.7em', disabled: _disabled(talon) },
                  "Добавить")
              )
            ]))
          ) //form
        )), // u-1-2, g
        m('.pure-g', 
          m(".pure-u-1-2 ", 
            m('span#card_message', _pmu.error ? m('span.red', _pmu.error) : '')
          )
        )
      ];
    }// view
  }; //this object
}; //func


const talPmu = function(vnode) {
  
  let model= vnode.attrs.model;
  let tal= model.talon;
  let pmu = model.pmu ? model.pmu: [];
  let para_table= moTalonsList.pmuTable();
  //tal_num int, date_usl date, code_usl varchar, kol_usl smallint,
  //exec_spec int, exec_doc int, exec_podr int, name varchar

  let pmu_hdr = {
      ccode: ['Номер'],
      code_usl: ['Код услуги'],
      kol_usl: ['Кол-во'],
      name: ['Наименование'],
      exec_spec: ['Спец'],
      exec_doc: ['Спец код'],
      exec_podr: ['Подр'],
      tarif: ['Тариф 5/2']
  };
  
  const caption= ()=>{
    if ( _notEdit(tal) )
      return 'Закрытые талоны не редактируем';
    if ( ! Boolean( _Num(tal.tal_num) ) )
      return 'Талон без номера, сначала сохраните новый талон';
    return 'ПМУ текущего талона';
  };
  
  const kol_usl= e=> {
    let id= e.target.getAttribute('data');
    let p= pmu.find( el => el.id == id );
    let url= `${para_table}?id=eq.${id}`;
    return { p, url };
  };
  
  const add_kol_usl= e=> {
    let { p, url } = kol_usl(e);
    let md= {};
    return moModel.getViewRpc( md, { kol_usl: p.kol_usl+1 }, url, 'PATCH' ).then( t=> {
       p.kol_usl += 1;
       return true;
    });
    //return false;    
  };
  const del_kol_usl= e=> {
    let { p, url } = kol_usl(e);
    let md= {};
    if (p.kol_usl == 1) {
      return moModel.getViewRpc( md, {}, url, 'DELETE' ).then( t => {
        //pmu= pmu.filter( el=> el.id != p.id );
        p.kol_usl=0;
        return true;
      });
    } else {
      return moModel.getViewRpc( md, { kol_usl: p.kol_usl-1 }, url, 'PATCH' ).then( t=> {
         p.kol_usl -= 1;
         return true;
      });
    }
    return false;    
  };
  
  let hdrMap= function(){
    return m('tr', [
      Object.keys(pmu_hdr).map( column => m('th', pmu_hdr[column][0])),
      m('th', "Добавить"),
      m('th', "Удалить"),
    ]);
  };
  //return s.kol_usl > 0 ? m('tr', { key: s.id }, [
  const listMap= function (s) {
      return s.kol_usl > 0 ? m('tr', [
        Object.keys(pmu_hdr).map( (column) => m('td', s[column])),
        m('td', m('i.fa.fa-plus-circle.choice', {
          style: "color: green;",
          data: s.id,
          onclick: _disabled(tal) ? null: add_kol_usl
        }) ),
        m('td', m('i.fa.fa-minus-circle.choice.red', {
          data: s.id,
          onclick: _disabled(tal) ? null: del_kol_usl
        }) )
      ]) : '';
  };
  
  return {
    view() {
       //console.log('talPara view');
      return [
        m(pmuForm, { model }),
        m('table.pure-table.pure-table-bordered', [
          m('caption', { style: "font-size: 1.2em; font-weight: 600" }, caption()),
          m('thead', hdrMap()),
          m('tbody', [pmu.map( listMap )] )
        ])
      ];
    }
  };
};

// not worked yet

const talDs = function(vnode) {
  let tal= vnode.attrs.model.talon;
  return {

    view() {
      return m("form.pure-form.pure-form-stacked.tcard",
        {style: "font-size: 1.2em;", id: "tal_ds"}, [
          m('fieldset', [
            m('legend', `Талон № ${_Num(tal.tal_num)}`),
            m('legend.leg-sec', "Дневной стационар"),
            m(".pure-g", [
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
          ])
        ]);
    }
  };
};

const talPolis = function(vnode) {
  
  let tal= vnode.attrs.model.talon;
  const data= talonOpt.data;
  //let tal= { smo: null, smo_okato: null, polis_ser: null, polis_num:null, polis_type: null};
  
  const _set_smo= sel_smo(tal);
  const _set_smo_okato = set_smo_okato(data, tal);
  
  return {
    view() { 
      return m("form.pure-form.pure-form-aligned.tcard",
        {style: "font-size: 1.2em;", id: "tal_polis" }, [
        m('fieldset', [
          m('legend', `Талон № ${_Num(tal.tal_num)}`),
          m('legend.leg-sec', "Полис на дату визита"),
          m(".pure-control-group", cof('polis_ser', tal)),
          m(".pure-control-group", [ cof('polis_num', tal),
            m('span.item_name', {style: "margin-left: 0em;"}, num_digits(tal)),
          ]),
// --
          m(".pure-control-group", [
            m('label', { for: "smo"}, "Страховщик"),
            m('select[name="smo"]',
              { value: tal.smo, onchange: _set_smo}, [
              m('option[value=""]', ""),
              data.get('smo_local').map(s=> m('option', {value: s.code}, s.short_name))
            ])
          ]),
          m(".pure-control-group", [
            m('label', { for: "smo_okato"}, "Регион"),
            m('input[name="smo_okato"][type="text"]', {
               oncreate: v => _set_smo_okato( { target: v.dom} ),
               list:  "okato",
               onblur: _set_smo_okato
            }),
            m('datalist[id="okato"]', [
              data.get('okato').map(o => {
                let okato = `${o.region}. ${o.name.split(' ')[0]}`;
                return m('option', okato);
              })
            ])
          ]),
// --        
        ])
      ]);
    }
  };
};

// src/clinic/view/vuTalon.js

const num_fields= ['mek','visit_pol', 'pol_days', 'visit_home', 'home_days',
  'visit_homstac', 'visit_daystac', 'days_at_homstac', 'days_at_daystac',
  'npr_mo', 'npr_spec', 'hosp_mo', 'extr', 'prof_k',
  'char1', 'char2', 
  'travma_type', 'patient_age',
];

const toSaveTalon= async function (tal, check) {
  // mek and talon_type
  if ( Boolean( tal.mek ) )
    tal.talon_type=1;
  
  tal.for_pom= Boolean(tal.urgent) ? 2: 3;

  // Doct Oms
  let e1= { fin: 'Укажите способ оплаты ', doct: 'Укажите доктора '};
  let r1= Object.keys(e1).map( p=> !check[p] ? e1[p] : '').join('');
  if ( Boolean(r1) )
    return r1;

  // polis talona
  if ( Boolean( tal.polis_num ))
    // SMO
    if ( !tal.smo && !tal.smo_okato)
      return 'Укажите либо СМО либо СМО ОКАТО';
    
  // ambul - stac days together
  let amb= Number(tal.visit_pol) + Number(tal.visit_home);
  let ds=  Number(tal.visit_daystac) + Number(tal.visit_homstac);
  //console.log( amb, ds);
  if ( Boolean(amb) && Boolean(ds) )
    return 'Амбулвторный прием и ДСтац в одном талоне';
  if ( Boolean( amb ) )
    tal.usl_ok= 3;
  else
    tal.usl_ok= 2;
    
  // napr ambul, stac together
  let cons= Boolean(tal.naprlech), hosp= Boolean(tal.nsndhosp);
  if ( cons && hosp ) 
    return 'Госпитализация и Консультация в одном талоне';
  
  // napr MO code
  // napr spec ambul
  
  let mo=0, spec=0;
  if (cons || hosp) {
    mo= cons ? Number(tal.npr_mo): Number(tal.hosp_mo);
    spec= cons ? Number(tal.npr_spec): 0;
    let _mo_url= `${restSprav.mo_local.url}?scode=eq.${mo}`;
    let _spec_url= `${restSprav.doc_spec.url}?spec=eq.${spec}`;
    let opt= [ { url: _mo_url } ];
    if ( cons ) {
        if (!tal.npr_date)
            tal.npr_date = tal.open_date;

        opt.push({url: _spec_url, order_by: 'spec'});
    //hospital
    } else {
        if (!tal.npr_date)
            tal.npr_date = tal.close_date;
    }
    let _mdl= { options: opt, data: new Map() };
    try {
      let r= '';
      let t= await moModel.getData(_mdl);
      //console.log(_mdl);
      if (_mdl.data.get(_mo_url).length === 0)
        r += 'Неверный код МО направления ';
      if (cons)
        if (_mdl.data.get(_spec_url).length === 0)
          r += 'Неверный код Специалиста направления';
      //console.log(r);
      if ( Boolean (r) )
        return r;
    } catch (e) {
      return e;
    }
  }
  num_fields.map(f=> {
    if (tal[f] === "") tal[f]= 0;
  });
  return '';

};

/*
const card_fileds = [
  'crd_num', 'fam', 'im', 'ot', 'date_birth',
  'polis_ser', 'polis_num', 'smo',
  'dul_serial', 'dul_number',
  'mo_att'
];
*/

//export const getName = function(data, val, key, prop, name, text, first_word=false) {
  // data - optional data MAP
  // val - string fofom input tag value
  // key - key in data MAP to check
  // prop - table's colemn name to check
  // name - name of table's column to output from
  // text - String text to output if item not find
  // first_word - out only first word from named column
const talForm = function (vnode) {
  
  let { model, method }= vnode.attrs;
  let tal= model.talon;
  //console.table(tal);
  const data= talonOpt.data;
  //console.log(data);
  
  const set_chk= (e, f)=> {
    tal[f]= e.target.checked ? 1: 0;
    //console.log(`${f}->${tal[f]}`);
    //console.log( e.target.checked, e.target.value );
    return false;
  };
  
  const check= {};
  const dsp= "^[A-Z][0-9]{2}(\.[0-9]{1,2})?$";
  const diag= new RegExp( dsp );
  const get_name=
    (val, key, prop, name, text, _word)=> getName( data, val, key, prop, name, text, _word );
  
  const doc_fam= ()=> {
    let doc;
    check.fin= data.get('ist_fin').find( f=> tal.ist_fin == f.id );
    let purp= get_name(tal.purp, 'purpose', 'id', 'name', 'Цель?', true);
    check.doct= data.get('doctor').find( d=> d.spec == tal.doc_spec && d.code == tal.doc_code );
    if ( Boolean(check.doct) && Boolean(check.doct.family) )
      doc= m('span', check.doct.family);
    else 
      doc= m('span.red', ' Доктор? ');
    
    return Array.of('', purp, doc);
  };
  // c_zab (1,2,3) if ds1 <> Z
  //ishod ()
  // rslt 
  const set_data= (e, attr, table, prop)=> {
    let ch;
    if (Boolean(e.target.value )) {
      ch = Array.from(data.get(table)).find(item => item[prop] == e.target.value.split('.')[0]);
      if (Boolean(ch)) {
        tal[attr]= ch[prop];
        e.target.value= ch[prop];
      } else {
        tal[attr]= e.target.value;
      }
    }
    return false;
  };
  
  const data_list= (list, table) => m(`datalist[id=${list}]`,
    data.get(table).map(c=> m('option', { value: `${c.id}. ${c.name.split(' ')[0]}`} ) ) );
  
  const set_istfin= e=> set_data(e, 'ist_fin', 'ist_fin', 'id');
  const set_char1= e=> set_data(e, 'char1', 'char_main', 'id');
  const set_char2= e=> set_data(e, 'char2', 'char_main', 'id');
  const set_ishod= e=> set_data(e, 'ishod', 'cishod', 'id');
  const set_result= e=> set_data(e, 'rslt', 'cresult', 'id');
  const set_travma= e=> set_data(e, 'travma_type', 'travma_type', 'id');
  
  //let ds1= tal.ds1, ds2= tal.ds2;
  const ds1_model= { mkb: 'mkb10?code=like.', order_by: 'code', list: null, headers: { Range: '0-20' } };
  const ds2_model= { mkb: 'mkb10?code=like.', order_by: 'code', list: null, headers: { Range: '0-20' } };
  //const ds_check= { url: 'mkb10?code=eq.', order_by: 'code', list: null };
  const set_ds= (ds, _model)=> e=> {
    tal[ds] = e.target.value;
    //console.log(e.target.value);
    if ( diag.test(tal[ds]) ) {
      _model.url = `${_model.mkb}${tal[ds]}*`;
      //console.log(ds);
      return moModel.getList(_model);// .then(t=> console.log( ds_model.list ));
    }
    //return true;
    return false;
  };
  const set_ds1= set_ds('ds1', ds1_model);
  const set_ds2= set_ds('ds2', ds2_model);
  
  const ds_show= tds=> {
    //console.log(tds);
    let dsl= ds1_model.list ? ds1_model.list: [];
    let ds= dsl.find(d=> tds == d.code.trim() );
    //console.log(ds);
    return ds ? ds.name: ''; // m('span.red', ' Диагноз? ');
  };

  const talonSave = async function(e) {
    e.preventDefault();
    model.save= await toSaveTalon(tal, check);
    //console.log( model.save );
    if ( Boolean( model.save ) ) {
      vuDialog.open();
      return false;
    }
    //console.log(tal);
    //return false;
    //model.save= null;
    return moTalon.saveTalon(e, model, method).then(res=>{
       let t= res[0]; //r= `${clinicApi.talons}/${t.tal_num}/${t.crd_num}`;
       tal= Object.assign(tal, t);
       m.route.set(clinicApi.talon_id, { tal: t.tal_num, crd: t.crd_num });
       //return true;
    }).catch(err=> {
      model.save = err;
      vuDialog.open();
    });
  };
  
  return {
    view() {
    //console.log('talForm view');
    return m(".pure-u-18-24", [
		m("form.pure-form.pure-form-stacked.tcard", { style: "font-size: 1.2em;",
      id: "talon", oncreate: forTabs, onsubmit: talonSave}, [
			m('fieldset', [ talNum(tal), 
        //
        m(".pure-g", [
          m(".pure-u-4-24", tof('open_date', tal)),
          m(".pure-u-4-24", tof('close_date', tal)),
          m('.pure-u-3-24', tof('talon_month', tal)),
          m('.pure-u-3-24', {style: "padding-top: 2em"},
            tof('mek', tal, { onclick: e=> set_chk(e, 'mek') }) ),
          m(".pure-u-6-24", {style: "padding-top: 2em"}, [
            tof('urgent', tal, { onclick: e=> set_chk(e, 'urgent') }),
            tof('first_vflag', tal, { onclick: e=> set_chk(e, 'first_vflag') }),
            
            //tof('finality', tal)
          ]),
        ]),
        //
        m(".pure-g", [
          m(".pure-u-2-24", [ tof('ist_fin', tal, { list: "istfin", onblur: set_istfin }),
            data_list('istfin', 'ist_fin')
          ]),
          m(".pure-u-2-24", tof('purp', tal)),
          m(".pure-u-2-24", tof('doc_spec',tal)),
          m(".pure-u-2-24", tof('doc_code', tal)),
          m(".pure-u-10-24", {
              style: "padding-top: 2em ; font-size: 1.1em; font-weight: 500"
            }, doc_fam() ),
        ]),
        //m('legend.leg-sec', "Визиты, дни"),
        m(".pure-g", [
          m('.pure-u-2-24', tof('visit_pol', tal)),
          m('.pure-u-2-24', tof('visit_home', tal)),
          m(".pure-u-6-24", {
            style: "padding-top: 2em ; font-size: 1.2em; font-weight: 600"
            },
            "Количество посещений"
          ),
        ]),
        //m('legend.leg-sec', "Диагноз, результат"),
        m('.pure-g', [
          m('.pure-u-3-24', [
            m('label', "Осн. диагноз"),
            m('input.input.pure-u-20-24[type=text][tabindex=13][required]', {
              list: 'ds1', value: tal.ds1, oninput: set_ds1
            }),
            m('datalist[id="ds1"]',
              ds1_model.list ? ds1_model.list.map(d=> m('option', {value: d.code.trim()})) : []
            )
          ]),
          m('.pure-u-3-24', [ tof('char1', tal, { list:  "char", onblur: set_char1 } ),
            m('datalist[id="char"]',
              data.get('char_main').filter(c => c.id < 4).map(c=>
                m('option', { value: `${c.id}. ${c.name.split(' ')[0]}` })
              )
            )
          ]),
          m('.pure-u-3-24', [ tof('ishod', tal, { list:  "ishod", onblur: set_ishod} ),
            data_list('ishod', 'cishod')
          ]),
          m('.pure-u-3-24', [ tof('rslt', tal, { list:  "result", onblur: set_result} ),
            data_list('result', 'cresult')
          ]),
          m(".pure-u-10-24", {
              style: "padding-top: 2em ; font-size: 1.1em; font-weight: 500"
            }, ds_show(tal.ds1)
          ),
        ]),
        m('.pure-g', [
          m('.pure-u-3-24', [
            m('label', "Доп. диагноз"),
            m('input.input.pure-u-20-24[type=text][tabindex=17]', {
              list: 'ds2', value: tal.ds2, oninput: set_ds2
            }),
            m('datalist[id="ds2"]',
              ds2_model.list ? ds2_model.list.map(d=> m('option', {value: d.code.trim()})) : []
            )
          ]),
          m('.pure-u-3-24', tof('char2', tal, { list:  "char", onblur: set_char2 } )),
          m('.pure-u-3-24', [ tof('travma_type', tal, { list:  "travma", onblur: set_travma }),
            data_list('travma', 'travma_type')
          ]),
        ]),

      ]),

      m('fieldset', { style: "padding-left: 0%;" }, [
				m('.pure-u-3-24', { style: "margin-top: 5px;" }, 
          m('button.pure-button.pure-button-primary[type="submit"]',
            { style: "font-size: 1.1em", disabled: _notEdit(tal)
              //onclick: talonSave
            },
          "Сохранить" )
        )
      ]) 
    ])//- form --
  ]); //- 18-24 -
 } // view
 }
};

const talMain = function (vnode) {
  let { model, method }= vnode.attrs;
  return {
    view () {
      //console.log('talMain view');
      return m(".pure-g", {style: "padding-left: 4em;"}, [
        m(talCrd, {model: model} ), // only patch
        m(talForm, {model: model, method: method } )
      ]);
    }
  }
};


const vuTalon = function(vnode) {
  //console.log(vnode.attrs);
  
  let { tal, crd }= vnode.attrs;
  let model= moTalon.getModel(); //;
  let tabs= ['Талон', 'Направление', 'ДС', 'ПМУ', 'Полис на дату'];
  let conts= [talMain, talNap, talDs, talPmu, talPolis];
  model.word= 'Талоны';
  let t= parseInt(tal);
  const method = isNaN(t) || t === 0 ? "POST": "PATCH";
  moTalon.getTalon(model, crd, tal );
  
  return {
    /*
    oninit () {
    },
    onbeforeupdate() {
    },
    */
    view () {
      return model.error ? [ m(".error", model.error) ] :
        talonOpt.data.size > 0 && model.card ?
          m(tabsView, {model: model, tabs: tabs, conts: conts, method: method})
        : m(vuLoading);
    } 
  }; 
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
      if ( cardOpt.data.size === 0 ) cardOpt.getOptions();
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
      if ( talonOpt.data.size === 0 ) talonOpt.getOptions();
      //moTalon.getTalon(args);
      return vuTalon;
    },
    render : function(vnode) {
        return m(vuMain, clinicMenu, vnode );
      }
  },
  
});
