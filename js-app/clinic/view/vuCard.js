// src/clinic/view/vuCard.js

import { moCard } from '../model/moCards.js';
import { clinicApi } from '../clinicApi.js';

const toFocus = function (vnode) {
  vnode.dom.focus();
};

const setPale = function(e) {
  e.target.setAttribute('style', 'opacity: 0.5');
}

const delPale = function(e) {
  e.target.setAttribute('style', 'opacity: 1.0');
}

const forTabs = function(vnode) {
  let inputs = vnode.dom.querySelectorAll("input,select,button");
  for (let i = 0 ; i < inputs.length; i++) {
    inputs[i].addEventListener("keypress", (e) => {
      if (e.which == 13 || e.keyCode == 13) {
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

const crdMain = function(vnode) {
  //console.log(vnode.attrs.data);

  return {
    
    view(vnode) {
      let card = vnode.attrs.item;
       return m('form.tcard.pure-form.pure-form-aligned',
         {style:"font-size: 1.2em;", id:"card", oncreate: forTabs },
         [ m('fieldset', [
          m('legend', "Карта пациента"),
          m(".pure-g", [
            m(".pure-u-7-24 ", [
            
              m(".pure-control-group", [
                m('label', { for: "crd_num" }, "Номер карты"),
                m('input[name="crd_num"][type="text"]][required]', {
                  value: card.crd_num,
                  tabindex: "1",
                  oncreate: toFocus

                })
              ]),
            
              m(".pure-control-group", [
                m('label', { for:"fam"} , " "),
                m('input[name="fam"][type="text"][required]', {
                  placeholder: "Фамилия",
                  value: card.fam,
                  tabindex: "2",
                })
              ]),
            
              m(".pure-control-group", [
                m('label', { for: "im" }, " "),
                m('input[name="im"][type="text"]', {
                  placeholder: "Имя",
                  value: card.im,
                  tabindex: "3",
                })
              ]),
            
              m('.pure-control-group', [
                m('label', { for: "ot" }, " "),
                m('input[name="ot"][type="text"]', {
                  placeholder: "Отчество",
                  value: card.ot,
                  tabindex: "4",
                }) 
              ]),
          	
            m(".pure-control-group", [
              m('label', { for: "birth_date" }, "Дата рождения"),
              m('input[name="birth_date"][type="date"][required]', {
                value: card.birth_date,
                tabindex: "5",
              })
            ]),
            
            m(".pure-control-group", [
              m('label', { for: "gender" }, "Пол"),
              m('span', { style: "line-height: 1em;" }, "М"), 
              m('input[name="gender"][type="radio"]', {
                style: "margin: 0 14px 0 7px;",
                value: 0,
                checked: ['м', 'ж'].indexOf( card.gender.toLowerCase() ) == 0 ? true : false  
              }),
              m('span', "Ж"),
              m('input[name="gender"][type="radio"]', {
                style: "margin: 0 0 0 7px;",
                value: 1,
                checked: ['м', 'ж'].indexOf( card.gender.toLowerCase() ) == 1 ? true: false
                })
            ]),  
            
            m(".pure-control-group", [
              m('label', { for:"dul_type"}, "Тип документа"),
              m('input.pure-u-1-6[name="dul_type"][type="text"]', {
                 value: card.dul_type,
                 tabindex: "6",
              })
            ]),
            
            m(".pure-control-group", [
              m('label', { for: "dul_serial" }, "Документ"),
              m('input[name="dul_serial"][type="text"]', {
                placeholder: "Серия",
                value: card.dul_serial,
                tabindex: "7",
              })
            ]),
            
            m(".pure-control-group", [
              m('label', { for:"dul_number" }, " "),
              m('input[name="dul_number"][type="text"]', {
                placeholder: "Номер",
                value: card.dul_number,
                tabindex: "8",
              })
            ])
          
            
          ]), // u-7-24
			
          m(".pure-u-8-24", [
            m('legend', "ОМС"), 
            m(".pure-control-group", [
              m('label', { for: "polis_num" }, "Полис" ), 
              m('input.pure-u-1-6[name="polis_num"][type="text"]', {
                placeholder:"Серия",
                value: card.poilis_ser,
                tabindex: "9",
              }), 	
              m('input.pure-u-3-6[name="polis_ser"][type="text"]', {
                placeholder:"Номер",
                value: card.polis_num,
                tabindex: "10",
              }), 
            ]),
          
            m(".pure-control-group", [
              m('label', { for: "smo"}, "Страховщик"),
              m('input.pure-u-1-6[name="smo"][type="text"]', {
                 value: card.smo,
                 tabindex: "11",
              })
            ]),
        
            m(".pure-control-group", [
              m('label', { for: "mo_att"}, "Прикреплен к МО"),
              m('input.pure-u-1-6[name="mo_att"][type="text"]', {
                 value: card.mo_att,
                 tabindex: "12",
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
          
            m(".pure-control-group", [
              m('label', { for: "doc-type"}, " "),
              m('button.pure-button.pure-button-primary[type="button"]', "Прикрепление")
            ]) */
          ]), //u-8-24
          // ADDRESS
          m(".pure-u-9-24", [
            m('legend', "Адрес"),
            m(".pure-control-group", [
              //<!--label for="-num">Город</label-->
              m('input[name="city_g"][type="text"]', {
                placeholder: "Город",
                value: card.city_g,
                tabindex: "13",
              })				
            ]),
          
            m(".pure-control-group", [
              //<!--label for="-num">Улица</label-->
              m('input[name="street_g"][type="text"]',  {
                placeholder: "Улица",
                value: card.street_g,
                tabindex: "14",
              }),				
            ]),
          
            m(".pure-control-group", [
              m('input.pure-u-1-8[name="home_g"][type="text"]', {
                placeholder: "Дом",
                value: card.home_g,
                tabindex: "15",
              }),				
              m('input.pure-u-1-8[name="corp_g"][type="text"]', {
                placeholder: "Корп",
                value: card.corp_g,
                tabindex: "16",
              }),
              m('input.pure-u-1-8[name="flat_g"][type="text"]', {
                placeholder: "Кв",
                value: card.flat_g,
                tabindex: "17",
              })		
            ]),
          
            m(".pure-control-group", [
              m('input[name="phone_1"][type="text"]', {
                placeholder: "Мобильный тел",
                value: card.phone_wrk,
                tabindex: "18",
              })				
            ]),
          
            m(".pure-control-group", [
              m('input[name="phone_2"][type="text"]', {
                placeholder: "Контактный тел",
                value: card.phone_hom,
                tabindex: "19",
              })				
            ]),
        /*
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
        */
        ]) //u-9-24
  
      ]) // pure-g
    ]), // fieldset
    m('fieldset', { style: "padding-left: 66%;"}, 
      m('button.pure-button.pure-button-primary[type="button"][tabindex="20"]',
        { onfocus: setPale,
          onblur: delPale
        },
        "Сохранить")
    )
  // form
  ]);

  }
}
}
const crdOpt = function(vnode) {
  return {
    view(vnode) {
       return m('h2', "Дополнительно");
    }
  }
}
const crdAtt = function(vnode) {
  return {
    view(vnode) {
       return  m('h2', "Прикрепить");
    }
  }
}
const tabsView = function(vnode) {
  
  let item = vnode.attrs.item;
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
  }
  
  const changeTab = function(event) {
    let idx = parseInt (event.target.getAttribute('idx'));
    if (tabs_cont[idx].classList.contains('hide')) {
        hideTabs(0);
        tabs[idx].classList.add('active');
        tabs_cont[idx].classList.remove('hide');
        tabs_cont[idx].classList.add('show');
    }

  }
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
          return m('.tab-content',
            //{ oncreate: (vnode => tabs_cont.push(vnode.dom)) },
            m(cont, {item: vnode.attrs.item}) );
        })
      ]);
  }
}
}
const vuCard =function(vnode) {
  
  let model; //, card;
  let tabs = ['Карта', 'Дополнительно', 'Прикрепить'];
  let conts = [crdMain, crdOpt, crdAtt];
  
 
  return {  
  oninit () {
    model = moCard.getModel();
    //card = model.list ? model.list[0] : null;
    //console.log(model);
  },
  
  view (vnode) {
    
    return model.error ? [ m(".error", model.error) ] :
      model.list && model.data ? 
        m(tabsView, {item: model.list[0], data: model.data, tabs: tabs, conts: conts})
      : m(".loading-icon", [
          m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
          m('span.sr-only', 'Loading...')
        ]);  
  } 
}
}

export { vuCard };