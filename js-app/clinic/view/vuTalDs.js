

export const talDs = function(vnode) {
  let tal= vnode.attrs.model.talon;
  return {

    view() {
      return m("form.pure-form.pure-form-stacked.tcard",
        {style: "font-size: 1.2em;", id: "tal_ds"}, [
          m('fieldset', [
            m('legend', `Талон № ${tal.tal_num}`),
            m('legend.leg-sec', "Дневной стационар"),
            m(".pure-g", [
              m('.pure-u-2-24', [
                m('label[for="tdc"]', "Дн. стац"),
                m('input.pure-u-20-24[name="tdc"][type="text"]', {
                  value: tal.visit_daystac
                })
              ]),
              m('.pure-u-2-24', [
                m('label[for="tdc"]', "Стац. дом"),
                m('input.pure-u-20-24[name="tdc"][type="text"]', {
                  value: tal.visit_homstac
                })
              ]),
            ]),
            m(".pure-g", [
              m('.pure-u-2-24', [
                m('label[for="ksg"]', "КСГ"),
                m('input.pure-u-20-24[name="ksg"][type="text"]', {
                  value: tal.ksg
                })
              ]),
              m('.pure-u-2-24', [
                m('label[for="prof_k"]', "Пр. койки"),
                m('input.pure-u-20-24[name="prof_k"][type="text"]', {
                  value: tal.prof_k
                })
              ]),
              m('.pure-u-2-24', [
                m('label[for="sh"]', "Схема"),
                m('input.pure-u-20-24[name="sh"][type="text"]', {
                  value: tal.sh
                })
              ]),
            ]),
          ])
        ]);
    }
  };
};
