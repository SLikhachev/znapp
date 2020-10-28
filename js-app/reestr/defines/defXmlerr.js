
// src/reestr/defines/defXmlerrr.js
// packages definition

import { $button } from '../../apps/defines/defStruct';
//import { _mo } from '../../apps/model/moModel';
import { linkCard, linkTalon } from './defLinks';


const packType = {
  1: "Амбулаторный",
  2: "Онкология",
}

const tableStruct = {
  tal_num: ['Талон', '', linkTalon],
  crd_num: ['Карта', '', linkCard],
  fam: ['Фамилия'],
  open_date: ['Открыт'],
  close_date: ['Закрыт'],
  error: ['Номер ошибки'],
  cmt: ['Текст ошибки']
}

const restErr = {
  url: "vmx_errors",
  params: { limit: 50 } // show vmx errors
}

export const xmlErrors = {

  page: "Правим ошибки реестра",
  ximp: {
    //rest: restErr,
    count: {
      rest: {
        url: 'task_rest',
        params: { task: 'eq.import_errors', select: 'file_name,pack_type(descr)' }
      }
    },
    task: {
      url: "/reestr/xml/vmx",
      //get: "/utils/file/reestr/vmx/", //GET report file  
      form: {
        legend: "Тип файла ошибок",
        file: { type: 'file' },
        pack: {
          label: ["Тип протокола"],
          tag: ['.ml10'],
          type: 'select',
          options: packType,
          attrs: { 'data-initial': 1 }
        }
      },
      buttons: {
        butt1: $button("Импорт")
      },
    },
    item: {
      name: "Импорт ошибок",
      header: "Импорт протокола ошибок (XML файл)",
      //struct: tableStruct
    },
  },
  last: {
    rest: restErr,
    task: {
      url: "/reestr/xml/vmx",
      get: "/utils/file/reestr/vmx/", //GET report file
      form: {
        legend: "Выгрузить в CSV файл"
      },
      buttons: {
        but1: R.assocPath(['attrs', 'method'], 'GET', $button("Выгрузить"))
      }
    },
    item: {
      name: "Показать последние",
      header: "Последние принятые ошибки (50 первых записей)",
      list: true, // show table anyway at beginning
      struct: tableStruct
    },

  }
}


export const xerr = {
  path: '/xerr/:item',
  name: "Ошибки",
  def: xmlErrors,
  items: ['ximp', 'last']
};