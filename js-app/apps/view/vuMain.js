
// src/apps/view/vuMain.js

const getSubApp= () => {
  const r=  m.route.get().split("/");
  return r ? r[1] ? r[1] : null: null;
};

const renderSideBar= (_subApp, _subAppMenu)=> {
  // side Bar will be rendered ?
  if ( _subApp === null )
    return null; // no sub Apps
    
  if ( !_subAppMenu[_subApp].hasOwnProperty("items") ||
       !_subAppMenu[_subApp].items.length || _subAppMenu[_subApp].items.length === 0 )
    return null; // no sub App menu items 
    
    return _subApp; // string
};

const sideBar = ( name, menu )=> [m('span.dheader.blue', name), 
  menu.map( item => m( m.route.Link, {
    selector: 'a.side-menu.blue',
    href: item[0],  
  }, item[1] ) )
]; //};

/**
export const vuMain = {
  
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
}
*/
const appsMenu= ( moName, app, appsBar )=> m('.apps-menu.pure-menu.pure-menu-horizontal', [
  m('span.pure-menu-heading', moName),
  // list of server apps items 
  m('ul.pure-menu-list', 
    Object.keys(appsBar).map( appName => {
      const s = appName == app ? '.pure-menu-selected': '';
      const li = `li.pure-menu-item${s}`;
      return m(li, m('a.pure-menu-link', // here links to server side apps
        { href: appsBar[appName].href }, appsBar[appName].name)
      );
    })
  ), 
  // out link from apps on the server 
  m('ul.pure-menu-list.right', 
    m("li.pure-menu-item",
      m('a.pure-menu-link', {href: '/logout/?next=/'}, "Выход")
    )
  )
]);


const subMenu= ( menu, app )=> m('.application-menu.pure-menu.pure-menu-horizontal', [
  m('a.pure-menu-heading', { href: "" }, m('i.fa.fa-bars') ), //buterbrot // not used yet
  m('ul.pure-menu-list', 
    Object.keys(menu).map( item => {
      const aclass = app === item ? '.pointed' : '',
      _a= `a.pure-menu-link${aclass}`, 
      _h= menu[item].nref[0];
      return m('li.pure-menu-item.pure-menu-allow-hover',
        m(m.route.Link, { href: _h , selector: _a },
          menu[item].nref[1])
      );
    })
  )
]);


export const vuMain= function(vnode) {
  /**
   * every app delivered as js pack by server side application
   * with some attrs in html and localStorage
   * here we use closure to save MO name, id, and apps string from server
   * and state of subApp and sidebar
  */
  //  deliver with call, as vnode.attrs to render menu bar 
  const { subAppMenu } = vnode.attrs;
  
  const mo= document.getElementsByTagName('title');
  const id= document.body.id;
  const apps= window.localStorage.getItem('apps');
  
  const moName= mo.length ? mo[0] ? mo[0].text : '': '';
  const app= id ? id : 'sprav';
  // assume apps is legal json string without try 
  // format: { 'app': { href: 'string', name: 'string' }, ... }
  // delivered by server side application
  const appsBar= apps ? JSON.parse( apps ) : {};
  
  // here define render side bar or not
  let subApp= getSubApp();
  let sidebar= renderSideBar(subApp, subAppMenu);
  //console.log(subApp);
  
  return {
    // jQuery used 
    // up arrow
    oncreate() {
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
    // check for sub menu render
    onbeforeupdate() {
      subApp= getSubApp();
      sidebar= renderSideBar(subApp, subAppMenu);
      //console.log(subApp);
    },
    
    view(vnode) { return [
      m('#header', m('#menus', [
        // top apps menu delivered by server side
        appsMenu( moName, app, appsBar ),
        // items (routes) in application pack
        subMenu( subAppMenu, subApp ), 
      ]) ),
      // content starts here 
      m('#content',
        sidebar === null ? m('#page.pure-u-1-1', vnode.children) : [
          // sidebar if any
          m('#side-bar.pure-u-1-8',
            sideBar( subAppMenu[subApp].nref[1], subAppMenu[subApp].items )
          ),
          m('#page.pure-u-7-8', vnode.children)
        ]
      ),
      m('#bup.but__up. hvr')
    ];
  }}; 
}

