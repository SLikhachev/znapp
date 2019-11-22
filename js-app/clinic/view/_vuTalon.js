// src/clinic/view/vuTalon.js

import { moTalon } from '../model/moTalons.js';

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
}

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
  
}

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
}

export { vuTalon };