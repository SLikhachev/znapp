

'use strict';

import { disp } from '../../apps/appApi';
import { changedItem } from '../../apps/model/moListItem';
import {
  $checkbox, $button, $month,
  $pack, $smo
} from '../../apps/defines/defStruct';
import { linkTalon } from './defLinks';


const extract_mek = resp => ({
  list: JSON.parse(resp.response),
  count: {
    mek: resp.getResponseHeader('Content-Range').split('/')[1]
  }
});

const mek_year = () => changedItem().month.split('-')[0].slice(2);
const mek_month = () => changedItem().month.split('-')[1];
const get_mek = e => {
  e.stopPropagation();
  e.preventDefault();
  return disp(['list']);
}

const mekTable = {
  tal_num: ['Талон', '', linkTalon],
  crd_num: ['Карта'],
  open_date: ['Открыт'],
  close_date: ['Закрыт'],
}

export const calcInvoice = {

  page: "Расчеты и реестры в СМО",

  tosmo: {
    count: {
      rest: {
        url: 'task_rest',
        params: { task: 'eq.import_invoice', select: 'file_name,pack_type(descr)' }
      }
    },
    task: {
      url: "/reestr/inv/impex",
      get: "/utils/file/reestr/inv/",  //GET reestr file
      form: {
        legend: "Файл счета БАРС",
        file: { type: 'file' },
        pack: $pack,
        csmo: $checkbox("Корректировать СМО"),
      },
      buttons: {
        butt1: $button("Импорт")
      },
    },
    item: {
      name: "Реестр в СМО",
      header: "Реестр в СМО из ZIP файла счета БАРС",
    },
  },
  calc: {
    task: {
      url: "/reestr/inv/calc",
      get: "/utils/file/reestr/calc/",  //GET reestr file  
      form: {
        legend: "Рассчитать реестр по месяцу и СМО",
        month: $month,
        pack: $pack,
        smo: $smo,
      },
      buttons: {
        butt1: $button("Рассчитать")
      },
    },
    item: {
      name: "Расчеты",
      header: "Собственные расчеты",
    },
  },

  mek: {
    rest: {
      get url() {
        return `talonz_clin_${mek_year()}`;
      },
      params: {
        mek: 'eq.1',
        talon_type: 'eq.1',
        get talon_month() {
          return `eq.${mek_month()}`
        }
      },
      headers: {
        Prefer: 'count=exact',
        Range: '0-50',
        'Range-Unit': 'tal_num',
      },
      extract: extract_mek
    },
    task: {
      url: "/reestr/inv/mek",
      get: "/utils/file/reestr/mek/", //GET mek file
      form: {
        legend: "Выгрузить отказанных по МЭК в CSV файл",
        month: $month,
        target: R.assoc('label', ["Перененсти на"], $month),
        but0: R.compose(
          R.assocPath(['attrs', 'type'], 'button'),
          R.assocPath(['attrs', 'onclick'], get_mek)
        )($button("Показать МЭКи")),
      },
      buttons: {
        but1: R.compose(
          R.assocPath(['attrs', 'method'], 'GET'),
          R.assocPath(['attrs', 'style'], 'font-size: 1.2em; margin: 1em 0 0 0;'),
          R.assocPath(['tag'], ['.pure-button']))
          ($button("Выгрузить в CSV")),
        but2: R.compose(
          R.assocPath(['attrs', 'style'], 'font-size: 1.2em; margin: 1em 0 0 2em;'),
          R.assocPath(['tag'], ['.pure-button']))
          ($button("Перенести МЭКи"))
      }
    },
    item: {
      name: "Перенести МЭК",
      header: "Переносим случаи отказа по МЭК",
      list: true, // show table anyway at beginning
      struct: mekTable,
      count_field: 'mek',
      count_text: "Всего МЭК по месяцу "
    },
  }
}

export const invce = {
  path: '/invce/:item',
  name: "Счета",
  def: calcInvoice,
  items: ['tosmo', 'calc', 'mek']
};