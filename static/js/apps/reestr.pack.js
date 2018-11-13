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

const taskApi = {
    
    reestr_imp: {
        post_url: "/reestr/import/reestr", //POST date, upload file
    },
    /*
    volum: {
        post_url: "/report/common/volum/make_report", //POST date
        get_url: "/utils/file/volum/report/" //GET report file
    },
    */
};

const appApi = {
    root: "/",
    import: "/import",
    reestr_imp: "/import/reestr",
    //surv_volum: "/surv/volum",
};

const appMenu$1 = { subAppMenu: {
  
  import: {
    nref: [`#!${appApi.import}`, "Импорт"],
    items: [
      [`#!${appApi.reestr_imp}`, "Файлы реестров (DBF)"],
      //[`#!${appApi.surv_volum}`, "Объемы помощи"],
      
    ]
  }
}
};

// src/report/model/moModel.js

const pg_rest = window.localStorage.getItem('pg_rest'); //task schemaRest;
const task_rest = window.localStorage.getItem('task_rest'); //task schemaRest;

const moModel = {
  
  getModel( url=null, sort_by=null ) {
    //console.log(url);
    return {
      pg_url: url,
      //task_rest: task_rest,
      //task_get_url: null,
      //task_post_url: null,
      field: sort_by,
      list: null,
      error: null,
      message: null,
      detail: null,
      file: null,
      done: false
    };  
  },
  
  getList (model) {
    // filed - sort by with SELECT, default 'id' field
    //let schema = window.localStorage.getItem('pg_rest');
    //let id = model.field ? model.field : 'id',
    //order = `?order=${id}.asc`;
    let url = pg_rest + model.pg_url; // + order;
    //console.log(url);
    return m.request({
      method: 'GET',
      url: url
    }).then(function(res) {
      model.list = res; // list of objects
      model.order = true;
    }).catch(function(e) {
      model.error = e.message;
      console.log(model.error);
    });
  },

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
        m.request({
            method: method,
            url: task_rest + upurl + get_param,
            data: data,
        }).then((res) => {
            model.file = res.file ? res.file: null;
            model.message = res.message;
            model.detail = res.detail ? res.detail: null;
            model.done = res.done ? res.done : null;
            //console.log(` msg: ${model.message}, file: ${model.file}, done: ${model.done}`);
            form.classList.remove('disable');
        }).catch((err) => {
            model.error = err.message;
            console.log(model.error);
            form.classList.remove('disable');
        });
        return false;
    }
};

// src/report/model/moStruct.js

// src/reestr/view/vuRdbf.js

const fileForm = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  
  const on_form_submit = function (event) {
    event.preventDefault();
    model.error = null;
    model.message= null;
    model.file= null;
    model.done= false;
    model.detail= null;
    return moModel.doSubmit(event.target, model, "POST");
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

  return {

  oninit(vnode) {
    //vnode.state.task_get_url = restApi.hosp.get_url;
    vnode.state.task_post_url = taskApi.reestr_imp.post_url;
    /*
    vnode.state.ftype = [
      { id: 'rr', name: "Реестр", selected: true},
      { id: 'rp', name: "Параклиника", selected: false},
      { id: 'rs', name: "Стоматология", selected: false},
    ]
    */
    vnode.state.month = () => {
      let d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
        return `${y.toString()}-${m.toString()}`;
    };
  },
  
  view(vnode) {
    //console.log(model);
    return m('.pure-g', [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked', 
            { action: vnode.state.task_post_url,
              method: 'POST',
              oncreate: on_form_create
            }, [
          m('fieldset', [
            m('legend', "Импорт файлов реестров DBF"),
            m('.pure-control-group', [
            m('input.inputfile[type="file"][name="file"][id="file"]',
              {'data-multiple-caption': "{count} files selected", 'multiple':false }
            ),
            m('label[for="file"]', m('strong', "Выбрать файл"))
            ]),
            m('.pure-control-group', [
              m('label[for=month]', 'Месяц'),
              m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                { value: vnode.state.month() }
              )
            ]),
            /*
            m('.pure-control-group', [
              m('label[for=ftype]', 'Тип файла'),
              m('select[id=ftype][name=ftype]', [
                vnode.state.ftype.map( type => m('option', {
                  value: type.id,
                  selected: type.selected ? true : false
                }, type.name ) )
              ])
            ]),
            */
            m('.pure-controls', [
              m('label.pure-checkbox[for="test"]', [ 
                m('input[id="test"][type="checkbox"][name="test"]'),
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
              model.detail ? m('h4.blue', model.detail) : '',

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
  /*  
  oninit () {
  }
  /*
  oncreate() {
  },
  
  onupdate() {
  },
  */
  view (vnode) {
    
    return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(fileForm, { model: vnode.attrs.model } )
    ];
  }    
        
  }; //return this object
};

// src/reestr/router/roImport.js
//import { vuVolum } from '../view/vuRdbf.js';

const roImport = {
  [appApi.import]: {
    render: function() {
      return vuView(appMenu$1, m(vuApp, { text: "Импорт файлов" } ) );
    }
  },
  [appApi.reestr_imp]: {
    render: function() {
      let view = m(vuRdbf, {
        header: "Импорт реестов DBF",
        model: moModel.getModel()
        
      });
      return vuView(appMenu$1, view);
    }
  },
  /*
  [appApi.surv_volum]: {
    render: function() {
      //console.log(pgRest.volum);
      let view = m(vuVolum, {
        header: "Обемы помощи приказ 146",
        model: moModel.getModel( pgRest.volum ),
        struct: moStruct().p146_report,
        //form: true
      });
      return vuView(appMenu, view);
    }
  },
  */
};

// src/reestr/router_reestr.js
//import { roTfoms } from './router/roTfoms.js';
//import { roOnko } from './router/roOnko.js';

const reestrRouter = { [appApi.root]: {
    render: function () {
        return vuView(appMenu$1,
            m(vuApp, {text: "Медстатистика: Реестры ОМС"}));
    }
}
};

Object.assign(reestrRouter, roImport);

m.route(document.body, "/", reestrRouter);
