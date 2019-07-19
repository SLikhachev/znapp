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

// src/report/reportApi.js

const pgRest = {
    volum: 'p146_report?insurer=eq.999&this_year=eq.2019&order=this_month.asc',
};

const taskApi = {
    
    hosp: {
        post_url: "/report/common/hosp/make_report", //POST date, upload file
        get_url: "/utils/file/hosp/report/", //GET report file
    },
    volum: {
        post_url: "/report/common/volum/make_report", //POST date
        get_url: "/utils/file/volum/report/" //GET report file
    },

};

const appApi = {
    root: "/",
    surv: "/surv",
    surv_hosp: "/surv/hosp",
    surv_volum: "/surv/volum",
};

const appMenu = { subAppMenu: {
  
  surv: {
    nref: [`#!${appApi.surv}`, "Сводные"],
    items: [
      [`#!${appApi.surv_hosp}`, "Госпитализация ЕИР"],
      [`#!${appApi.surv_volum}`, "Объемы помощи"],
      
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
            if (res.file) {
                model.file = res.file;
            }
            model.message = res.message;
            model.done = res.done;
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

// src/report/view/vuHosp.js

const fileForm = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  
  const on_form_submit = function (event) {
    event.preventDefault();
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
  
  const get_href = function(vnode, model) {
    return task_rest + vnode.state.task_get_url + model.file;
  };
  
  return {
  
  oninit(vnode) {
    vnode.state.task_get_url = taskApi.hosp.get_url;
    vnode.state.task_post_url = taskApi.hosp.post_url;
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
                 { value: vnode.state.month() }
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
              m('a.pure-button', {href: get_href( vnode, model ), style: "font-size: 1.2 em"}, model.file ) 
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


// clojure
const vuHosp = function (vnode) {
    
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

// src/report/view/vuDataSheet.js

// clojure
const vuDataSheet = function (vnode) {
  
  var modelObject = vnode.attrs.model, // model Object
    structObject = vnode.attrs.struct, // the struct Object
    headerString = vnode.attrs.header;
  
  return {
    
  oninit () {
    moModel.getList( vnode.attrs.model );
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
        let field = structObject[column],
        value = field[1] ? field[1]( s[column] ) : s[column]; // 2nd el is function if any
        let td = first ? m('td.blue', {
        }, value) : m('td', value);
        first = false;
        return td;
      })
    ]);
  },

  view (vnode) {
    
    //return m(tableView, {model: this.model , header: this.header }, [
    return modelObject.error ? [ m(".error", modelObject.error) ] :
      modelObject.list ? [
        m(vuTheader, { header: headerString} ),
        this.form ? m(this.form, {model:  vnode.attrs.model}) : '',
        
        
        m('table.pure-table.pure-table-bordered[id=find_table]', [
          m('thead', [
            m('tr', [
              Object.keys(structObject).map( (column) => {
                let field = structObject[column];
                return field[2] ? m('th.sortable', // 3rd el sortable bool
                  { data: column, onclick: m.withAttr('data', modelObject.sort) },
                  [field[0], m('i.fa.fa-sort.pl10')]
                  ) : m('th', field[0]);
              }),
            ])
          ]),
          m('tbody', [modelObject.list.map( this.listMap )] )
        ]),
      ] : m(".loading-icon", [
            m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
            m('span.sr-only', 'Loading...')
          ]); 
  }
  }; //return this object
};

// src/report/view/vuVolum.js

const Form = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  
  const update = function (event) {
    //console.log('update');
    event.preventDefault();
    let form = document.getElementById("volume_form");
    return moModel.doSubmit(form, model, "POST");
  };
  
  const report = function (event) {
    //console.log('report');
    event.preventDefault();
    let form = document.getElementById("volume_form");
    return moModel.doSubmit(form, model, "GET");
  };

  const get_href = function(vnode, model) {
    return task_rest + vnode.state.task_get_url + model.file;
  };
  
  return {
  
  oninit(vnode) {
    vnode.state.task_get_url = taskApi.volum.get_url;
    vnode.state.task_post_url = taskApi.volum.post_url;
    vnode.state.month = () => {
      let d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
        return `${y.toString()}-${m.toString()}`;
    };
  },
  
  view(vnode) {
    //console.log(model);
    return [ m('.pure-g', [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked[id="volume_form"]',
            { action: vnode.state.task_post_url,
            }, [
          m('fieldset', [
            m('legend', "Расчет объемов"),
            m('.pure-control-group', [
              m('label[for=month]', 'Месяц'),
              m('input[id="month"][type="month"][name="month"][reqired=required]',
                 { value: vnode.state.month() }
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
            m('a.pure-button', {href: get_href( vnode, model ), style: "font-size: 1.2 em"}, model.file ) 
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
  let view = vuDataSheet(vnode);
  view.form = Form;
  return view;
};

// src/report/router/roSurvey.js

const roSurvey = {
  [appApi.surv]: {
    render: function() {
      return vuView(appMenu, m(vuApp, { text: "Отчеты сводные" } ) );
    }
  },
  [appApi.surv_hosp]: {
    render: function() {
      let view = m(vuHosp, {
        header: "Госпитализация отчет из файда ЕИР",
        model: moModel.getModel()
        
      });
      return vuView(appMenu, view);
    }
  },
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
};

// src/report/router_report.js
//import { roTfoms } from './router/roTfoms.js';
//import { roOnko } from './router/roOnko.js';

const reportRouter = { [appApi.root]: {
    render: function() {
       return vuView( appMenu,
          m(vuApp, { text: "Медстатистика: Отчеты" }));
    }
  }
};

Object.assign(reportRouter, roSurvey); //, roTfoms, roOnko);

m.route(document.body, "/", reportRouter);
