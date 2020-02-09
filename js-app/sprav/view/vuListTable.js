
// src/sprav/view/vuListTable.js

export const vuTableRow= function(data) {
  // data Object
  // edit - callback on click to edit row
  // ddel - callback to delete row
  // href - anchor href to set route on row page if any
  // there may be either edit or href attr
  // struct - struct object for row representation 
  //let { data={}, row=[] }= vnode.attrs;
  //console.log(data);
  //let id= data.id ? data.id : 'id';
  const {edit, ddel, href, struct, pk }= data;
  let _href= edit ? '' : href;
  
  const first_cell= id => m('td.choice.blue', id);
  
  const dialog_cell = (val, vpk) => m('td.choice.blue', {
      data: vpk, // every item must have id attr
      onclick: edit
    }, val);
  
  const anchor_cell= (val, vpk) => m('td.choice.blue', m(m.route.Link, {
      href: `${_href}/${vpk}`,
    }, val));
  
  const ddel_cell= vpk => m('td', m('i.fa.fa-minus-circle.choice.red', {
    data: vpk,
    onclick: ddel
    }) );
  
  return function(row) {
      //console.log(vnode.attrs.row);
      let first= true, vpk=row[pk];
      return m('tr', [
        Object.keys(struct).map( column => {
          let rc= row[column];
          let td= first ? // first will be anchor code 
            edit ? dialog_cell(rc, vpk) :
            _href ? anchor_cell(rc, vpk) : first_cell(rc)
          : m('td', rc);
          first = false;
          return td;
        }),
        ddel ? ddel_cell(vpk) : ''
      ]);
    };
}

// clojure
export const vuListTable = function (vnode) {
  
  let {
    clss='', tid='', model, struct={},
    edialog={}, href='', sort='' //sort - callback
    
  }= vnode.attrs;
  let { edit='', ddel='' }= edialog;
  const pk= model.key;
  const listMap= vuTableRow( { struct, edit, ddel, href, pk} );
  
  let cls= clss ? clss : '.pure-table.pure-table-bordered';
  let ftid= tid ? tid : 'list_table' 
  let table= `table${cls}[id=${ftid}]`;
  
  return {
    view() {
      //console.log(vnode.attrs.model.list);
      return m(table, [ 
        m('thead', m('tr', [
          Object.keys(struct).map( column => {
            let field = struct[column];
            let th= field.length > 1 ? m('th.sortable', // sortable field has 2nd elem in array
              { data: column, onclick: sort },
              [field[0], m('i.fa.fa-sort.pl10')]
            ) : m('th', field[0]);
            return th;
          }),
          ddel ? m('th', "Удалить") : ''
        ])),
        m('tbody', [model.list.map(listMap)])
     ]);
    }
  }; 
}
