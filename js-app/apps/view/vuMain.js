
// src/apps/view/vuMain.js

/**
 * main layout view component schema => rendered by vuLayout
 * -------------------------------------------
 * -- The sundry appilcations' links to the server side paths 
 * -- are provided by the apps server in localStorage string.
 * --
 * ...  app1 app2 app3  ... exit => rendered by spaOptionBar
 * ---------------------------------------------
 * -- Current SPA's menu bar is get from script provided by the apps server in
 * -- script tag. Declared in struct folder. These used as the logical seprated group 
 * -- of the current SPA's tasks or views.
 * -- 
 *  ... appgroup1 appgroup2 appgroup3 ... => current SPA menu rendered by spaMenuBar
 * ----------------------------------------------
 * -- The layout below may be splitted or not on the 2 columns: side_Bar and/or Main.
 * -- The side_Bar is rendered if the current appgroup has a set of group's items else only 
 * -- Main column is present. 
 * --
 *   appgroupName  |      groupitemHeader
 *                    |     
 *   groupitem1      |      gropitem View component
 *   groupitem2      | 
 *   groupitem3      |
 *   rendered by sideBar    rendered by it depends ( vuPageTitle or else)
 */

// return first path chunk after slash if any
const getItemPath = () => {
  //has menu item route chunk ?
  const r = m.route.get().split("/");
  return r ? r[1] ? r[1] : '' : '';
};

const hasChildren = (spaMenu, menuItem) => {
  /** Should be side Bar rendered ?
    menuItem: String from the route path 2nd (first after leading slash) segment
    spaMenu: Object from spaApi
    return String: item || ''
  */
  //console.log('hasChildren',menuItem);
  if (!menuItem)
    return ''; // no menu item selected

  const $m = spaMenu[menuItem];
  if ($m.hasOwnProperty('items') && $m.items.length)
    return menuItem; // no items' Array in menu item's definition

  return ''; // string
};

// sidebar renderer 
const sideBar = menuItem => [m('span.dheader.blue', menuItem.name),
menuItem.items.map(it => m(m.route.Link, {
  selector: 'a.side-menu.blue',
  href: `${menuItem.path.split(':')[0]}${it}`,
}, menuItem.def[it].item.name)
)];

// top spa menu from server data
const spaOptionBar = (moName, currentSpa, spaLinks) =>
  m('.apps-menu.pure-menu.pure-menu-horizontal', [
    m('span.pure-menu-heading', moName),
    // list of server apps items 
    m('ul.pure-menu-list',
      Object.keys(spaLinks).map(spaName => {
        const s = spaName == currentSpa ? '.pure-menu-selected' : '';
        const li = `li.pure-menu-item${s}`;
        return m(li, m('a.pure-menu-link', // here links to server side apps
          { href: spaLinks[spaName].href }, spaLinks[spaName].name)
        );
      })
    ),
    // out link from apps on the server 
    m('ul.pure-menu-list.right',
      m("li.pure-menu-item",
        m('a.pure-menu-link', { href: '/logout/?next=/' }, "Выход")
      )
    )
  ]);


// spa Menu bar from spa API
const spaMenuBar = (menu, current_path) =>
  m('.application-menu.pure-menu.pure-menu-horizontal', [
    m('a.pure-menu-heading', { href: "" }, m('i.fa.fa-bars')), //buterbrot // not used yet
    m('ul.pure-menu-list',
      Object.keys(menu).map(item => {
        if (item === 'root') return '';
        const aclass = item === current_path ? '.pointed' : '',
          _a = `a.pure-menu-link${aclass}`,
          _h = menu[item].path.split(':')[0];
        return m('li.pure-menu-item.pure-menu-allow-hover',
          m(m.route.Link, { href: _h, selector: _a },
            menu[item].name)
        );
      })
    )
  ]);


export const vuLayout = vnode => {
  /**
   * every spa delivered as js pack by server side application
   * with some attrs in html and localStorage
   * here we use closure to save MO name, id, and apps string from server
   * and state of spa menu item and sidebar status
  */
  //  deliver with call, as vnode.attrs to render menu bar 
  const { spaMenu } = vnode.attrs;

  const mo = document.getElementsByTagName('title');
  const id = document.body.id;
  const apps = window.localStorage.getItem('apps');

  const moName = mo.length ? mo[0] ? mo[0].text : '' : '';
  const currentSpa = id ? id : 'sprav';
  // assume apps is legal json string without try 
  // format: { 'app': { href: 'string', name: 'string' }, ... }
  // delivered by server side application
  const spaLinks = apps ? JSON.parse(apps) : {};

  // here define render side bar or not
  let item_path = getItemPath();
  //console.log('item_path', item_path);
  let menu_item_children = hasChildren(spaMenu, item_path);
  //console.log('has children', menu_item_children);
  //console.log(spaMenu[menu_item_children].def['doctor'].item.name);

  return {
    // jQuery used 
    // up arrow
    oncreate() {
      $(window).scroll(() => {
        if ($(window).scrollTop() > 300) {
          $('.but__up').fadeIn();
        } else {
          $('.but__up').fadeOut();
        }
      });
      $('.but__up').click(() => {
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
      });
    },
    // check for sub menu render
    onbeforeupdate() {
      item_path = getItemPath();
      menu_item_children = hasChildren(spaMenu, item_path);
      //console.log('item', item_path);
      //console.log('has children', menu_item_children);
    },

    view(vnode) {
      return [
        m('#header', m('#menus', [
          // top apps menu delivered by server side
          spaOptionBar(moName, currentSpa, spaLinks),
          // items (routes) in application pack
          spaMenuBar(spaMenu, item_path),
        ])),
        // content starts here 
        m('#content', [
          menu_item_children ?
            m('#side-bar.pure-u-1-8', sideBar(spaMenu[menu_item_children])) : '',
          m('#page',
            { class: menu_item_children ? 'pure-u-7-8' : 'pure-u-1-1' }, vnode.children)
        ]),
        m('#bup.but__up. hvr')
      ];
    }
  };
}

// Just wrapper for Layout
//export const vuView = view=> m(vuMain, spravMenu, view);
export const vuView = (spaMenu, view) => m(vuLayout, spaMenu, view);

// simple view for blank app page with text in center
export const vuPageTitle = {
  view(vnode) {
    return m('div', { style: "margin: 0 auto; padding-top: 5em; width: 50%;" },
      m('h1.blue', { style: "font-size: 3em;" }, vnode.attrs.text)
    );
  }
};
