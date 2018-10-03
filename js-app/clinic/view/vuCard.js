// src/clinic/view/vuCard.js

import { moCard } from '../model/moCards.js';
import { clinicApi } from '../clinicApi.js';

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
}

export { vuCard };