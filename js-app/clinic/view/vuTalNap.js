
import { fieldFrom } from '../../apps/form/foForm.js';
import { talNum } from './vuClinic';

const talNapr= {
 npr_mo: { label: ['', "Код МО"], input: {
      tag: ['.pure-u-22-24', 'number', 1, false],
      //attrs: { min: 0, max: 33}
    }
  },
  npr_spec: { label: ['', "Спец"], input: {
      tag: ['.pure-u-22-24', 'number', 2, false],
      //attrs: { min: 0, max: 33}
    }
  },
  naprlech: { label: ['', "Номер направления"], input: {
      tag: ['.pure-u-22-24', 'number', 3, false],
      //attrs: { min: 0, max: 33}
    }
  },
  hosp_mo: { label: ['', "Код МО"], input: {
      tag: ['.pure-u-22-24', 'number', 4, false],
      //attrs: { min: 0, max: 33}
    }
  },
  nsndhosp: { label: ['', "Номер направления"], input: {
      tag: ['.pure-u-22-24', 'number', 5, false],
      //attrs: { min: 0, max: 33}
    }
  },
  extr: { label: ['', "Экстренно", 'check'], input: {
      tag: ['', "checkbox", 6,  false],
      attrs: {style: "margin-right: 0.7em"}
    }
  },
}

const tnf = function(field, data, to_attrs={}) {
  return fieldFrom(talNapr, field, data, to_attrs);
}

export const talNap = function(vnode) {
  let tal= vnode.attrs.model.talon;

  return {
    view() {
      return m("form.pure-form.pure-form-stacked.tcard",
        {style: "font-size: 1.2em;", id: "tal_nap"}, [
          m('fieldset', [ talNum(tal),
            //m('legend', `Талон № ${_Num(tal.tal_num)}`),
            m('label[for="npr_date"]', 'Дата направления'),
            m('input[type=date][name="npr_date"]', { value: tal.npr_date, onblur: e=> tal.npr_date= e.target.value }),
            m('legend.leg-sec', "Направление: лечение. диагностика, консультация"),
            
            m(".pure-g", [
              m(".pure-u-2-24", tnf('npr_mo', tal)),
              m(".pure-u-2-24", tnf('npr_spec', tal)),
              m(".pure-u-5-24", tnf('naprlech', tal)),
            ]),
            m('legend.leg-sec', "Госпитализация"),

            m(".pure-g", [
              m(".pure-u-2-24", tnf('hosp_mo', tal)),
              m(".pure-u-5-24", tnf('nsndhosp', tal)),
              m(".pure-u-8-24", { style: "margin-top: 2.2em;"}, tnf('extr', tal)),
            ]),
          ])
        ]);
    }
  };
};
