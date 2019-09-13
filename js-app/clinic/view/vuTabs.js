
// src/clinic/view/vuTabs.js
import { vuDialog } from '../../apps/view/vuDialog.js';
//import { moCard } from '../model/moCards.js';
//import { moTalon } from '../model/moTalons.js';

export const ErrDialog= model=> m(vuDialog,
  { header: 'Ошибка обработки', word: model.word },
  model.save ? m('span', { style: " font-size: 1.3em; color: red; "}, model.save.msg): '');

export const toFocus = function (vnode) {
  vnode.dom.focus();
};

export const setPale = function(e) {
  e.target.setAttribute('style', 'opacity: 0.5');
}

export const delPale = function(e) {
  e.target.setAttribute('style', 'opacity: 1.0');
}

export const tabsView = function(vnode) {
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
          //console.log(cont);
          return m('.tab-content',
            //{ oncreate: (vnode => tabs_cont.push(vnode.dom)) },
            
            m(cont, {model: vnode.attrs.model, method: vnode.attrs.method}) );
        }),
        ErrDialog(vnode.attrs.model)
      ]);
  }
}
}

export const forTabs = function(vnode) {
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
}

