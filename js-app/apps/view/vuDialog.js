// src/apps/view/vuDialog.js

// https://github.com/GoogleChrome/dialog-polyfill
// https://html5test.com/
// Fifix since 53 about:config
// dom.dialog_element.enabled

import { moModel } from '../model/moModel.js';

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

}

export { vuDialog };