// apps/apiConf.js

const appMenu = { // routing by Django
  clinic : { href: "#", name: "Клиника"},     
  sprav: { href: "/sprav", name: "Справочники"},
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
                console.log(appName, vuMain.app);
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

// src/report/reportApi.js

restApi = {
    
    hosp: { url: "/utils/file/hosp/report/"},

};

const appApi = {
    root: "/",
    surv: "/surv",
    surv_hosp: "/surv/hosp",
};

const appMenu$1 = { subAppMenu: {
  
  surv: {
    nref: [`#!${appApi.surv}`, "Сводные"],
    items: [
      [`#!${appApi.surv_hosp}`, "Госпитализация"],
    ]
  }
}
};

// src/report/model/moModel.js

const task_rest = window.localStorage.getItem('task_rest'); //task schemaRest;

const moModel = {
  
  getModel() {
    return {
      rest_url: task_rest,
      api_url: null,
      error: null,
      message: null,
      file: null,
      done: false
    };  
  },
  
  doUpload(form, model) {
    //console.log(form);
    let upurl = form.getAttribute('action');
    //console.log(upurl);
    //let finput = form.elements.namedItem('file'),
    //file = finput.files[0], 
    let data = new FormData(form);
    
    form.classList.add('disable');
    
    //data.append("test", form.elements.namedItem('test'));
    //data.append("month", form.elements.namedItem('month'));
    //data.append("file", file);
    //console.log(data.getAll('test')[0], data.getAll('month')[0]);
    //data.append("")
    m.request({
        method: "POST",
        url: task_rest + upurl,
        data: data,
    }).then( (res) =>{
        model.message = res['message'];
        model.file = res['file'];
        model.done = res['done'];
        console.log(` msg: ${model.message}, file: ${model.file}, done: ${model.done}`);
        form.classList.remove('disable');
    }).catch( (err) => {
        model.error = err.message;
        console.log( model.error);
        form.classList.remove('disable');
    });
    return false;
  }
};

// src/report/view/vuHosp.js

const fileForm = function(vnode) {
  
  var model = vnode.attrs.model;
  //console.log(model);
  
  var on_form_submit = function (event) {
    event.preventDefault();
    return moModel.doUpload(event.target, model);
  };
  
  var on_form_create = function (vnode) {
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
  
  var get_file_name = function(model) {
    return model.file;
    //return model.file.replace("\\", "\/").split('/').pop();
  };
  
  var get_href = function(model) {
    return model.rest_url + model.api_url + get_file_name(model);
  };
  
  
  return {
  
  oninit(vnode) {
    model.api_url = restApi.hosp.url;
  },
  
  view(vnode) {
    //console.log(model);
    return m('.pure-g', [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked[action="/report/common/hosp/make_report"][method="POST"]',
          { oncreate: on_form_create }, [
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
              m('input.fname[id="month"][type="month"][name="month"][reqired=required]')
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
              m('a.pure-button', {href: get_href( model ), style: "font-size: 1.2 em"}, get_file_name( model ) ) 
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

// src/report/router/roSurvey.js

const roSurvey = {
  [appApi.surv]: {
    render: function() {
      return vuView(appMenu$1, m(vuApp, { text: "Отчеты сводные" } ) );
    }
  },
  [appApi.surv_hosp]: {
    render: function() {
      let view = m(vuHosp, {
        header: "Госпитализация",
        model: moModel.getModel()
      });
      return vuView(appMenu$1, view);
    }
  },
  
};

// src/report/router_report.js
//import { roTfoms } from './router/roTfoms.js';
//import { roOnko } from './router/roOnko.js';

const reportRouter = { [appApi.root]: {
    render: function() {
       return vuView( appMenu$1,
          m(vuApp, { text: "Медстатистика: Отчеты" }));
    }
  }
};

Object.assign(reportRouter, roSurvey); //, roTfoms, roOnko);

m.route(document.body, "/", reportRouter);
