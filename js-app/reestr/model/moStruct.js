// src/report/model/moStruct.js

// This object define how we shall render the particular table

export const moStruct = function() {
  // every DBtable has id column is not showed in html table header
  // Object.record:: Array(Name::String, Sortable::Bool (if any))
  // record is String - name of table column -- property of DB record object
  // every html table has last column to delete record purpose

  const get_month = function (month) {
    return [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь"
    ][ month-1 ];
  };
   
   return {
  // local 
    p146_report: {
      this_month: ["Месяц", get_month],    
      pol_ambul_visits: ["Амбул визиты"],
      pol_stac_visits: ["Стац визиты"],
      pol_stom_uet: ["Стом УЕТ"],
      pol_ambul_persons: ["Амбул персон"],
      pol_stac_persons: ["Стац персон"],
      pol_stom_persons: ["Стом персон"],
      travma_ambul_visits: ["Травма визиты"],
      travma_ambul_persons: ["Травма персон"],
    },
    vmx_last: {
      tal_num: ['Талон'],
      crd_num: ['Карта'],
      fam: ['Фамилия'],
      open_date: ['Открыт'],
      close_date: ['Закрыт'],
      error: ['Номер ошибки'],
      cmt: ['Текст ошибки']
    }
  };
};
