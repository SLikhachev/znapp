// apps/apiConf.js

const moName = "Поликлиника №4";

const appMenu = { // routing by Flask
  clinic : { href: "/clinic", name: "Клиника"},     
  sprav: { href: "/sprav", name: "Справочники"},
  reports: { href: "#", name: "Отчеты"}
};

const schemaRest = 'http://localhost:3000/';

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
            href: mroot + item[0],
            //onclick: m.withAttr("href", vuSidebar.subRoute)
          },
          item[1] );
      })
    ];
  },
  subRoute: function(route) {
    let rs = route.split("/"); // #!/catalog/doc-list/ => ['#!', 'catalog', 'doc-list', '']
    //console.log(rs);
  }
};

const vuMain = {
  
  app: null,
  subApp: null,
  
  oninit: function (vnode) {
    //console.log(vnode.attrs.subAppMenu)
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
  },

  view: function(vnode) {
    //console.log(' view --', vuMain.subApp);
    return [
      m('#header',
        m('#menus', [
          m('.apps-menu.pure-menu.pure-menu-horizontal', [
            m('span.pure-menu-heading', moName),
            m('ul.pure-menu-list', [
              Object.keys(appMenu).map( (appName) => {
                let s = appName == vuMain.app ? ".pure-menu-selected":"",
                li = "li.pure-menu-item" + s;
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

// src/clinic/clinicApi.js

restApi = {

    cards_cnt: { url:"get_cards_count", method:"GET" }, 
    card_find: { url:"rpc/get_cards", method:"POST" },
    get_card: { url:"rpc/get_card_by_num", method:"POST"},
    
    talons_cnt: { url:"get_talons_count", method:"GET" }, 
    talon_find: { url:"rpc/get_talons", method:"POST"},
    get_talon: { url:"rpc/get_talon_by_num", method:"POST"},
    
};

const clinicApi = {
    root: "/",
    cards: "/cards",
    card_id: "/cards/:id",
    talons: "/talons",
    talon_id: "/talons/:id"
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
      m('h1.blue', {style: "font-size: 3em;"}, vnode.attrs.text)
    );
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

const schema = schemaRest;

const moModel = {
  
  // :: String -> Array -> String -> Object
  // ret models object (POJO)
  getModel(url, method="GET", options=null, field=null) {
    // url - string of model's REST url
    // method - string of model's REST method
    // options - array of strings of option tables names
    // need for form data select/option if any
    // field - string "sort by" with SELECT
    let model = {
      url: url,
      method: method,
      field: field,
      options: options,
      list: null, // main data list (showing in table page)
      data: {}, // every idx corresponds with index of options array
      
      error: null, // Promise all error
      order: true, // for list
      sort: null // for list
    };  
    model.sort = function(field) {
      return moModel.sort(model, field);
    };  
    return model;
  },
  // :: Object -> Promise
  // ret Promise
  getList (model) {
    // filed - sort by with SELECT, default 'id' field
    let id = model.field ? model.field : 'id',
    order = `?order=${id}.asc`;
    return m.request({
      method: model.method,
      url: schema + model.url + order
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
    let data = [],
    order = '?order=id.asc';
    model.options.forEach ( (t) => {
      let r = m.request({
        method: t.method,
        url: schema + t.url + order
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
    let _url = url ? url : model.url;
    let _method = method ? method : model.method;
    return m.request({
      method: _method,
      data: data,
      url: schema + _url
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
    let data = moModel.getFormData( form ),
    url = schema + model.url,
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

// src/apps/model/moCards.js

//let schema = schemaRest;

const moCardsList = {
  
  model : {
    url: restApi.card_find.url,
    method: restApi.card_find.method,
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
    url: restApi.get_card.url,
    method: restApi.get_card.method,
    list: null, 
    error: null
  },
  
  getModel() {
    return this.model;
  },
  
  getCard(args) {
    return moModel.getViewRpc(
      moCard.getModel(),
      { crd_num: args.id }
    );
  }
  
};

// src/clinic/view/vuCard.js

// POJO
const vuCard = {
  
  // String -> Undef
  viewCard(crd_num) {
    m.route.set(clinicApi.card_id, { id: crd_num } );
  },
    
  oninit () {
    this.model = moCard.getModel();
  },
  
  view (vnode) {
    
    return this.model.error ? [ m(".error", this.model.error) ] :
      this.model.list ? m('form.pure-form.pure-form-aligned.tcard', {style:"font-size: 1.2em;", id:"card" },
      [ m('fieldset', [
        m('legend', "Карта пациента"),
        m(".pure-g", [
          m(".pure-u-7-24 ", [
            
            m(".pure-control-group", [
              m('label', { for: "crd_num" }, "Номер карты"),
              m('input[name="crd_num"][type="text"]', {
                value: this.model.list[0].crd_num
              
              })
            ]),
            
            m(".pure-control-group", [
              m('label', { for:"fam"} , " "),
              m('input[name="fam"][type="text"]', {
                placeholder: "Фамилия",
                value: this.model.list[0].fam
              })
            ]),
            
            m(".pure-control-group", [
              m('label', { for: "im" }, " "),
              m('input[name="im"][type="text"]', {
                placeholder: "Имя",
                value: this.model.list[0].im
              })
            ]),
            
            m('.pure-control-group', [
              m('label', { for: "ot" }, " "),
              m('input[name="ot"][type="text"]', {
                placeholder: "Отчество",
                value: this.model.list[0].ot
              }) 
            ]),
          	
            m(".pure-control-group", [
              m('label', { for: "birth_date" }, "Дата рождения"),
              m('input[name="birth_date"][type="date"]', {
                value: this.model.list[0].birth_date  
              })
            ]),
            
            m(".pure-control-group", [
              m('label', { for: "gender" }, "Пол"),
              m('span', { style: "line-height: 1em;" }, "М"), 
              m('input[name="gender"][type="radio"]', {
                style: "margin: 0 14px 0 7px;",
                value: 0,
                checked: ['м', 'ж'].indexOf( this.model.list[0].gender.toLowerCase() ) == 0 ? true : false  
              }),
              m('span', "Ж"),
              m('input[name="gender"][type="radio"]', {
                style: "margin: 0 0 0 7px;",
                value: 1,
                checked: ['м', 'ж'].indexOf( this.model.list[0].gender.toLowerCase() ) == 1 ? true: false
                })
             //])
            ]),  
            
            m(".pure-control-group", [
              m('label', { for:"dul_type"}, "Тип документа"),
              m('input.pure-u-1-6[name="dul_type"][type="text"]', {
                 value: this.model.list[0].dul_type  
              })
            ]),
            
            m(".pure-control-group", [
              m('label', { for: "dul_serial" }, "Документ"),
              m('input[name="dul_serial"][type="text"]', {
                placeholder: "Серия",
                value: this.model.list[0].dul_serial  
              })
            ]),
            
            m(".pure-control-group", [
              m('label', { for:"dul_number" }, " "),
              m('input[name="dul_number"][type="text"]', {
                placeholder: "Номер",
                value: this.model.list[0].dul_number  
              })
            ])
          
            
          ]),
			
          m(".pure-u-8-24", [
            m('legend', "Мед страх"), 
            m(".pure-control-group", [
              m('label', { for: "polis_num" }, "Полис" ), 
              m('input.pure-u-1-6[name="polis_num"][type="text"]', {
                placeholder:"Серия",
                value: this.model.list[0].poilis_ser  
              }), 	
              m('input.pure-u-3-6[name="polis_ser"][type="text"]', {
                placeholder:"Номер",
                value: this.model.list[0].polis_num    
              }), 
            ]),
          
            m(".pure-control-group", [
              m('label', { for: "smo"}, "Страховщик"),
              m('input.pure-u-1-6[name="smo"][type="text"]', {
                 value: this.model.list[0].smo
              })
            ]),
        
            m(".pure-control-group", [
              m('label', { for: "mo_att"}, "Прикреплен к МО"),
              m('input.pure-u-1-6[name="mo_att"][type="text"]', {
                 value: this.model.list[0].mo_att  
              })
            ]),
          /*
            m(".pure-control-group", [
              m('label', { for: "doc-type" }, "Дата прикрепления"),
              m('input.pure-u-1-6[name="code-num"][type="date"]')
            ]),
          
            m(".pure-control-group" , [
              m('label', { for: "district" } , "Участок"),
              m('input.pure-u-1-6[name="district"][type="text"]')
            ]),
          */
            m(".pure-control-group", [
              m('label', { for: "doc-type"}, " "),
              m('button.pure-button.pure-button-primary[type="button"]', "Прикрепление")
            ])
          ]),
				
          m(".pure-u-9-24", [
            m('legend', "Адрес"),
            m(".pure-control-group", [
              //<!--label for="-num">Город</label-->
              m('input[name="city"][type="text"]', {
                placeholder: "Город",
                value: this.model.list[0].city    
              })				
            ]),
          
            m(".pure-control-group", [
              //<!--label for="-num">Улица</label-->
              m('input[name="street"][type="text"]',  {
                placeholder: "Улица",
                value: this.model.list[0].street
              }),				
            ]),
          
            m(".pure-control-group", [
              m('input.pure-u-1-5[name="home"][type="text"]', {
                placeholder: "Дом",
                value: this.model.list[0].home    
              }),				
              m('input.pure-u-1-6[name="flat"][type="text"]', {
                placeholder: "Кв",
                value: this.model.list[0].flat    
              })		
            ]),
          
            m(".pure-control-group", [
              m('input[name="phone_1"][type="text"]', {
                placeholder: "Мобильный тел",
                value: this.model.list[0].phone_1  
              })				
            ]),
          
            m(".pure-control-group", [
              m('input[name="phone_2"][type="text"]', {
                placeholder: "Контактный тел",
                value: this.model.list[0].phone_2  
              })				
            ]),
			
          m(".pure-control-group", [
            m('label', { for: "lgota"}, "Льготная кат"),
            m('input.pure-u-1-6[name="lgota"][type="text"]', {
               value: this.model.list[0].lgota  
              })	
          ]),
        
          m(".pure-control-group", [
            m('label', { for: "social_status" }, "Соц статус"),
            m('input.pure-u-1-6[name="social_status"][type="text"]', {
               value: this.model.list[0].social_status    
            })	
          ]),
        
          m(".pure-control-group", [
            m('label.pure-checkbox', { for: "wrk"}, "Работает"),
            m('input[name="wrk"][type="checkbox"]', {
              checked:  this.model.list[0].wrk_org ? true : false   
            })
          ]),
        
          m(".pure-control-group", [
            m('label', { for:"wrk_org"}, "Место работы"), 
            m('input[name="wrk_org"][type="text"]', {
               value: this.model.list[0].wrk_org  
            })
          ])
        ])
            
      ]) // pure-g
    ]), // fieldset
    m('fieldset', { style: "padding-left: 30%;"}, 
      m('button.pure-button.pure-button-primary[type="button"]', "Сохранить")
    )
  // form
  ]) : m(".loading-icon", [
            m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
            m('span.sr-only', 'Loading...')
          ]);  
    
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
    
    
    return m(".pure-g",
      m(".pure-u-1-1",
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
                m('button.pure-button.pure-button-primary[type="button"]', {
                    //value: 0,
                    onclick: moCardsList.cardsFind
                  },
                "Найти"
                )
              ), // to xls
                /*
                m(".pure-u-1-5",
                  m('a.pure-button.pure-button-primary', {
                    id: "to_xls",
                    //onclick: moCardsList.cardsFind
                    },
                    "Excel"
                  )
                ) */
            ])
          )
        )
      )
    );
  }
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
  
  return {
    
  oninit (vnode) {
    //this.model = moCardsList.getModel();
    //moCardsList.getList(model);
    moModel.getViewRpc(model, {}, restApi.cards_cnt.url, restApi.cards_cnt.method );
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
          data:  cell,
          onclick: m.withAttr( "data", vuCard.viewCard)
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
      model.list ? [
        //m(vuTheader, { header: headerString} ),
        m(cardFind, {table_id: table_id } ),
        model.list[0] ? model.list[0].recount ?
          m('h1.blue', {style: "font-size: 1.5em;"},
            `${model.list[0].recount} записей в таблице`) : 
        m('table.pure-table.pure-table-bordered', {id: table_id} , [
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
      ] : m(".loading-icon", [
            m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
            m('span.sr-only', 'Loading...')
          ]); 
  }
  }; //return this object
};

// src/apps/model/moTalons.js

const moTalonsList = {
  
  model : {
    url: restApi.talon_find.url,
    method: restApi.talon_find.method,
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
    if ( data.q_crd == "" && (data.q_date != "" || data.q_dcod != "" ) )
      data.q_crd = ".*";
    if (data.q_date == "" && data.q_dcod != "")
      data.q_date = '2010-01-01';
    data.q_date = data.q_date == "" ? null : data.q_date;
    if (data.q_dcod == "")
      data.q_dcod = null;
    data.lim = 50;
    data.offs = 0;
    
    
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
    url: restApi.get_talon.url,
    method: restApi.get_talon.method,
    list: null, 
    error: null
  },
  
  getModel() {
    return this.model;
  },
  
  getTalon(args) {
    return moModel.getViewRpc(
      moTalon.getModel(),
      { talon_num: args.id }
    );
  }
  
};

// src/clinic/view/vuTalon.js

const vuCardInfo = {
  
  para_hdr : {
    code: "Код", 
    units: "Кол.", 
    //date: "Дата", 
    name: "Наименование", 
		exec: "Исп."
  },
  
  handler(data) {
    console.log(data);
    return false;
  },
  
  listMap(p) {
    return m('tr', [
      Object.keys(vuCardInfo.para_hdr).map( (col) => {
        //console.log(talonz_hdr[column]);
        let tde = 'td', param={}, val=p[col];
        if (col == 'units') {
           val = m('input[type="number"][min=0][max=9]', {value: p[col], style: "width: 4em " } );
          
          //tde = 'td[contentEditable="true"]';
          //param = { data: p[col], onchange: m.withAttr("data", vuCardInfo.handler) };
        }
        return m(tde, param, val );
          //col == 'code' ? 
          //m('a.pdelete[href="#"]', m('i.fa.fa-minus-circle')) : ''
      })
    ]);
  },
  
  view(vnode) {
    let crd = vnode.attrs.crd;
    let para = vnode.attrs.para;
    crd = {
      crd_num: '123456',
      fam: 'СЕМЕНОВИЧ',
      im: 'Абдуллай',
      ot: 'Николаевич-Таксанбаевич',
      gender: "м",
      birth_date: '12-06-1987',
      dul_serial: '06 07',
      dul_number: '1234567',
      polis_num: '1234567890123456',
      smo: '260018',
      mo_att: '228'
      
    };
    para = {list: [
      {
        code: 'A12.890.13',
        units: 5,
        date: '12-09-2018',
        name: 'Исследование органов много раз на всякий случай малло ли что покажется',
        exec: '228281016'
      },
    
    ] };
    
    return m(".pure-u-9-24.patz-data", { style: "overflow: hidden; padding-right: 1em" },
    [
      m(".legnd", `Карта № ${crd.crd_num}`),
      m("span.snamel", `${crd.fam} ${crd.im} ${crd.ot}`),
      m("span", `Род. ${crd.birth_date} ${crd.gender}`),
      m("span", `Документ ${crd.dul_serial} ${crd.dul_number}`),
      m("span", `Полис № ${crd.polis_num}`),
      m("span" , `СМО: ${crd.smo}`),
      //<!--span>СМО ОКАТО: 25011</span-->
      m("span", `Приписан: ${crd.mo_att}`),
      m("table.pure-table.pure-table-horizontal.tpara", [
        m("caption", "Параклиника"), 
        m("thead", [
          m("tr", [ Object.keys(vuCardInfo.para_hdr).map( col => { 
            return m("th", vuCardInfo.para_hdr[col]);
            })
          ])
        ]),           
        m("tbody", [ para.list.map( this.listMap ) ] )
      ]),
      m('button.pure-button.pure-button-primary[type="button"]',
        {style: "font-size: 1.1em"},
        "Добавить"
      ),
      m("div", { style: "margin-top: 1em; padding-top: 2em; border-top: 1px solid #ccc;" }, [
        m('button.pure-button.button-secondary[type="button"]',
          { style: "font-size: 1.1em" },
          "Добавить"
        ),
        /*  
        m('button.pure-button[type="button"]',
          { style: "font-size: 1.1em" },
          "Добавить"
        )
        */
      ])
    ]);
  
  }
};

const vuTalonForm = {
  
  month(val) {
    let d = new Date();
    return d.getMonth() + 1;
  },
  
  help(link) {
    return m(".pure-u-1-24.aquest", 
      m('a.qhelp[href="#"]',
        m('i.fa.fa-question-circle.fa-lg') )
    ); 
  },
  
  view(vnode) {
    let tal = vnode.attrs.tal;
    tal = {tal_num: '123--456'};
    return m(".pure-u-15-24", [
		m("form.pure-form.pure-form-stacked.tcard", { style: "font-size: 1.2em;",  id: "talon" }, [
			m("fieldset", [
        m('legend', `Талон № ${tal.tal_num}`),  
        m(".pure-g", [
          m(".pure-u-4-24", [
            m('label[for="open_date"', "Открыт"),
            m('input.pure-u-22-24[name="open_date"][type="date"]', {
                style: "height: 45%",
                value: tal.open_date
            })	
          ]),	
          m(".pure-u-4-24", [
            m('label[for="close_date"]', "Закрыт"),
            m('input.pure-u-22-24[name="close_date"][type="date"]', {
                style: "height: 45%",
                value: tal.close_date
            })
            //<!--span class="pure-form-message">заполнить</span-->
          ]),
          m(".pure-u-2-24", [
            m('label[for="ist_fin"]', "Оплата"),
            m('input.pure-u-18-24[name="ist_fin"][type="text"]', {
              //style: "height: 50%",
              value: tal.ist_fin
            })
          ]),
          this.help(),
          m(".pure-u-2-24", [
            m('label[for="purp"]', "Цель"), 
            m('input.pure-u-18-24[name="purp"][type="text"]', {
               //style: "height: 50%"
               value: tal.purp
            })
          ]),
          this.help(),
          m(".pure-u-8-24", [
            m('label[for="first_vflag"]', [
              m('input[name="first_vflad"][type="checkbox"]', {
                checked: tal.first_vflag == 0 ? false : true,
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
                checked: tal.finality == 0 ? false : true,
                style: "margin-right: 0.7em"
              }),
              "Закончен",
            ]),
          ]),
          /*
          m(".pure-u-2-24", [
            m('label[for="for_pom"]', { style: "margin-top: 50%"}, [
              m('input[name="for_pom"][type="checkbox"]',
                {checked: false,  style: "margin-right: 0.7em"} ),
              "Неотл"
            ])
          ]),
          m(".pure-u-2-24", [
            m('label[for="for_pom"]', { style: "margin-top: 50%"}, [
              m('input[name="for_pom"][type="checkbox"]',
                {checked: false,  style: "margin-right: 0.7em"} ),
              "Неотл"
            ])
          ]),
          /*  
          m('.pure-u-4-24', [
            m('label[for="finality"]', { style: "margin-top: 50%"}, [
              m('input[name="finality"][type="checkbox"]',
                {checked: true,  style: "margin-right: 1em"} ),
              "Закончен"
            ])
          ])
          */
        ]),
        
        m(".pure-g", [
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
          this.help(),
          m(".pure-u-6-24", {
            style: "padding-top: 2em ; font-size: 1.2em; font-weight: 600"
            }, 
            tal.doc_fam
          )
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
          this.help(),
        ]), 
        
        m('legend.leg-sec', "Визиты, дни"),
        
        m(".pure-g", [
          m('.pure-u-3-24', [
            m('label[for="visit_pol"]', "В поликлинику"),
            m('input.pure-u-22-24[name="visit_pol"][type="text"]', {
              value: tal.visit_pol
             })
          ]),
          m('.pure-u-3-24', [
            m('label[for="tdc"]', "На дому"),
            m('input.pure-u-22-24[name="tdc"][type="text"]', {
              value: tal.visit_home
            })
          ]),
          m('.pure-u-3-24', [ 
            m('label[for="tdc"]', "Дн. стац"),
            m('input.pure-u-22-24[name="tdc"][type="text"]', {
              
            })
          ]),
          m('.pure-u-3-24', [
            m('label[for="tdc"]', "Стац. на дому"),
            m('input.pure-u-22-24[name="tdc"][type="text"]')
          ]),
        ]),
        
        m('legend.leg-sec', "Результат"),
        
        m('.pure-g', [
          m('.pure-u-2-24', [
            m('label[for="ds1"]', "Основной"),
            m('input.pure-u-22-24[name="ds1"][type="text"]'),
          ]),
          m('.pure-u-2-24', [
            m('label[for="tdc"]', "диагноз"),
            m('input.pure-u-16-24[name="tdc"][type="text"]'),
          ]),
          this.help(),
          m('.pure-u-2-24', [
            m('label[for="tdc"]', "Характер"),
            m('input.pure-u-16-24[name="tdc"][type="text"]'),
          ]),
          this.help(),
          m('.pure-u-2-24', [
            m('label[for="tdc"]', "Исход"),
            m('input.pure-u-16-24[name="tdc"][type="text"]'),
          ]),
          this.help(),
          m('.pure-u-2-24', [
            m('.label[for="tdc"]', "Травма"),
            m('input.pure-u-16-24[name="tdc"][type="text"]'),
          ]),
          this.help(),
        ]),
        
        m('.pure-g', [
          m('.pure-u-2-24', [
            m('label[for="tdc"]', "Диагноз"),
            m('input.pure-u-22-24[name="tdc"][type="text"]'),
          ]),
          m('.pure-u-2-24', [
            m('label[for="tdc"]', "дополн."),
            m('input.pure-u-16-24[name="tdc"][type="text"]'),
          ]),
          m('.pure-u-2-24', [
            m('label[for="tdc"]', "Характер"),
            m('input.pure-u-16-24[name="tdc"][type="text"]'),
          ])
        ])	
      
      ]),

			m('fieldset', { style: "padding-left: 0%;" }, [
				m('legend.leg-sec', { style: "color: red;" }, "Месяц талона"),
				
        m('.pure-g', [
					m('.pure-u-6-24', [
            m('input.pure-u-6-24.tal_month[name="talon_month"]', {
              type: "number",
              min: 1,
              max: 12,
              value: this.month()
            })
          ]),
          m('.pure-u-3-24', { style: "margin-top: 5px;" }, 
            m('button.pure-button.pure-button-primary[type="button"]',
              { style: "font-size: 1.1em"}, "Сохранить" )
          )
        ])
      ])		
    ]),//- form --
  ]) //- 15-24 -
 } // view
  
};

// POJO
const vuTalon = {
  
  // String -> Undef
  viewTalon(tal_num) {
    m.route.set("/talons/:id", { id: tal_num } );
  },
    
  oninit () {
    this.model = moTalon.getModel();
    this.model = {  list: [ {} ], error: null };
    //moCardsList.getList(model);
    //moCardsList.getViewRpc(model, "GET", "get_cards_count", {});
        
  },
  /*
  oncreate() {
  },
  
  onupdate() {
  },
  */
  view (vnode) {
    return this.model.error ? [ m(".error", this.model.error) ] :
      this.model.list ? m(".pure-g", [
        m(vuCardInfo, { crd: this.model.list[0], para: this.model.list[0] } ),
        m(vuTalonForm, {tal: this.model.list[0] } )
      ]) :
      m(".loading-icon", [
            m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
            m('span.sr-only', 'Loading...')
      ]);
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
                  //onkeyup: m.withAttr("value", vmFind.setFind ),
                  //value: vmFind.toFind
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
                m("input.input-find.pure-u-2-3[name=q_dcod][type='search']",
                  {placeholder:"Специалист"}
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


// clojure
const vuTalonsList = function (vnode) {
  
  var talonz_hdr = {
      crd_num: ['Карта', 'link'],
      fam: ['ФИО'],
      tal_num: ['Талон', 'link'],
      open_date: ['Открыт'],
      close_date: ['Закрыт'],
      purp: ['Цель'],
      spec: ['Спец'],
      code: ['Код'],
      family: ['Врач'],
     
   };
  var model = moTalonsList.getModel();

  return {
    
  oninit () {
    //this.model = moCardsList.getModel();
    //moCardsList.getList(model);
    moModel.getViewRpc(model, {}, restApi.talons_cnt.url, restApi.talons_cnt.method );
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
          data:  cell,
          onclick: column == "crd_num" ?
            m.withAttr( "data", vuCard.viewCard) :
            m.withAttr( "data", vuTalon.viewTalon)
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
      moCard.getCard(args);
      return vuCard;
    },
    render : function(vnode) {
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
      //moTalon.getTalon(args);
      return vuTalon;
    },
    render : function(vnode) {
        return m(vuMain, clinicMenu, vnode );
      }
  },
  
});
