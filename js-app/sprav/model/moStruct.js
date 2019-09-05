// src/sparv/model/moStruct.js

// This object define how we shall render the particular table

const onko_ = function() {
  return { 
    id: ["Индекс"], 
    ds: ["Диагноз", true],
    kod: ["Код", true],
    name: ["Наименование"]
  };
};

export const idName= {
  id: ["Код", true],     
  name: ["Описаение", true],
}

export const moStruct = {
  // every DBtable has id column is not showed in html table header
  // Object.record:: Array(Name::String, Sortable::Bool (if any))
  // record is String - name of table column -- property of DB record object
  // every html table has last column to delete record purpose if it possible
  
  // local 
  doctor: {
    code: ["Код", true],     
    spec: ["Специальность", true],
    family: ["Врач"],
    snils: ["СНИЛС"],
    division: ["Отделение"],
    district: ["Участок"],
    tabid: ["Таб. номер"]
  },
  moLocal: {
    code: ["Код", true],     
    scode: ["Код ТФОМС", true],
    sname: ["Наименование кратко"],
    name: ["Наименование полное"]
  },
  smoLocal: {
    code: ["Код", true],     
    okato: ["ОКАТО", true],
    name: ["Наименование"]
  },
  // prof
  pmu: {
    code_usl: ['Код услуги'],
    ccode: ['Номер'],
    name: ['Наименование'],
    code_podr: ['Подразд.'],
    code_spec: ['Спец.']
  },
  
  mkb: {
    code:  [ 'Код', true ],
    name: [ 'Описание'],
    oms: ['ОМС'],
    oms_ds: ['ОМС ДС']
  },
  // tfoms
  spPodr: {
    mo_code: ["Код", true],     
    id_otd: ['Код отделения'],
    name_otd: ['Наименование'],
    profil: ['Код профиля'],
    prof_name: ['Наименвание профиля']
  },
  doc_spec: {
    spec: ["Код", true],
    name: ["Специальность"],
    prvs: ["Код PRVS V021" ],
    profil: ["Профиль"],
    prof_k: ["Профиль койки"],
    det: ["Детский"] 
  },
  
  
  dul: {
    code: ["Код", true],     
    name: ["Наименование"],
    serial_tpl: ["Шаблон серии"],
    number_tpl: ["Шаблон номера"]
  },
  okato: {
    okato: ["ОКАТО", true],
    region: ["Код региона", true],
    name: ["Наименование региона"]
  },
  
  // onko
  onko_n2: {
    id: ["Индекс"],
    ds: ["Диагноз", true],
    kod: ["Код", true]
  },
  onko_n3: onko_(),
  onko_n4: onko_(),
  onko_n5: onko_(),
  onko_n6: {
    ds_code: ['Диагноз'],
    stady_id: ['Код Стадия'],
    //st_kod: ['Стадия'],
    tumor_id: ['Код Tumor'],
    //tm_kod: ['Tumor'],
    nodus_id: ['Код Nodus'],
    //nd_kod: ['Nodus'],
    metas_id: ['Код Метастаз'],
    //meta_kod:['Метастаз']
  },
  onko_n8: {
    id: ["Индекс"], 
    hysto_name: ["Наименование гистологии"], 
    hysto_id: ["Индекс гистологии"],
    name: ["Результат"]
  },
  onko_n9: {
    id: ["Индекс"], 
    ds: ["Диагноз"],
    hysto_name: ["Наименование гистологии"], 
    hysto_id: ["Индекс гистологии"],
  },
  onko_n10: {
    id: ["Индекс"], 
    kod: ["Код"],
    name: ["Наименование"]
  },
  onko_n11: {
    id: ["Индекс"], 
    mark_name: ["Наименование маркера"],
    mark_id: ["Индекс маркера"],
    kod: ["Код"],
    name: ["Результат"]
  },
  onko_n12: {
    id: ["Индекс"], 
    ds: ["Диагноз"],
    mark_name: ["Наименование маркера"],
    mark_id: ["Индекс маркера"],
  },
  
  
  
};

