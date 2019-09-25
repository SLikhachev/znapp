
export const talNap = function(vnode) {
  let tal= vnode.attrs.model.talon;

  return {
    view() {
      return m("form.pure-form.pure-form-stacked.tcard",
        {style: "font-size: 1.2em;", id: "tal_nap"}, [
          m('fieldset', [
            m('legend', `Талон № ${tal.tal_num}`),
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
              ])
            ]),
            m('legend.leg-sec', "Госпитализация"),

            m(".pure-g", [
              m(".pure-u-2-24", [
                m('label[for="hosp_mo"]', "Код МО"),
                m('input.pure-u-22-24[name="hosp_mo"][type="text"][placeholder=""]', {
                  value: tal.hosp_mo
                })
              ]),
              m(".pure-u-5-24", [
                m('label[for="nsndhosp"]', "Номер направления"),
                m('input.pure-u-22-24[name="nsndhosp"][type="text"]', {
                  value: tal.nsndhosp
                })
              ]),
              m(".pure-u-8-24", [
                m('label[for="extr"]', { style: "margin-top: 2.2em;"}, [
                  m('input[name="extr"][type="checkbox"]', {
                    checked: tal.extr === 0 ? false : true,
                //style: "margin: 1em, 0 0"
                  }),
                  "Экстренно",
                ]),
              ])
            ]),


          ])
        ]);
    }
  };
};
