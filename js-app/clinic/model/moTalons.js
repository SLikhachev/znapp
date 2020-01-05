// src/apps/model/moTalons.js
import { moModel, errMsg, _schema, _region, _month } from '../../apps/model/moModel.js';
import { restSprav } from '../../sprav/spravApi.js';
import { restClinic } from '../clinicApi.js';

const tmonth = function () {
    let d = new Date();
    return d.getMonth() + 1;
 };

const _reg= _region();

export const moTalonsList = {
  // :: Object
  // return model object (POJO)
  getModel() {
    const model = {
      url: restClinic.talon_find.url,
      method: restClinic.talon_find.method,
      list: null, // main data list (showing in table page)
      error: null, // Promise all error
      order: true, // for list
      sort: null // for list
    };
    return model;
  },
  // in cards talons reads from actual table only
  // there is backdoor, you may set current local year to old date
  // then talons will be reads and writes to old table
  // talons reads from, 
  year: _month().split('-')[0], // on init app
  _year:  _month().split('-')[0], // on init app year,
  // only one table
  _table: 'talonz_clin_',
  _pmu: 'para_clin_',
  talTable() {
    return `${moTalonsList._table}${moTalonsList._year.slice(2)}`;
  },
  pmuTable() {
    return `${moTalonsList._pmu}${moTalonsList._year.slice(2)}`;
  },
  
  markDelete(event, num) {
    let pg_rest =  _schema('pg_rest');
    let table= moTalonsList.talTable();
    let url=`${pg_rest}${table}?tal_num=eq.${num}`;
    return m.request({
      url: url,
      method: 'PATCH',
      body: { talon_type: 0 },
    }).then( () => {
      return num;
    }).catch( err => {
      //model.save = { err: true, msg: errMsg(err) };
      throw ( errMsg (err) );
    });
  },
  
};

export const talonOpt= {
  options: [ restSprav.doctor, restSprav.ist_fin, restSprav.smo_local, restSprav.okato,
    restSprav.purp, restSprav.chm, restSprav.cishod, restSprav.cresult, restSprav.travma ],
  data: new Map(),
  error: null,
  getOptions: async function() {
    if (this.data && this.data.size && this.data.size !== 0) return true;
    await moModel.getData( talonOpt );

  }
}

export const moTalon = {
  
  getModel() {
    const model= {
      // current polis included in talon
      url: [restClinic.get_talon.url, restClinic.get_pmu.url], //restClinic.get_polis.url],
      method: [restClinic.get_talon.method,  restClinic.get_pmu.method], //restClinic.get_polis.method],
      map_keys: ['talon', 'pmu', 'polis'],
      talon: null,
      card: null,
      pmu: null,
      polis: null,
      tosave: null,
      error: null,
      save: null
    };
    return model;
  },
  
  getTalon(model, card, talon) {
    let tal= parseInt(talon), crd = parseInt(card);
    if ( !isNaN(tal) && tal !== 0) {
      const t1= { tbl: moTalonsList.talTable(), _tal: tal };
      const t2= { tbl: moTalonsList.pmuTable(), _tal: tal };
      //const t3= { tyear: moTalonsList._year, _tal: tal };
      // exisiting talon? card will be fetched within talon record
      return moModel.getViewRpcMap(
        model, [ t1, t2 ]
      ).then( () => moTalon.prepare( model )  );//.catch(e => alert(e));
    }
    // get card only to new talon
    if ( isNaN(crd) || crd === 0) {
      model.error = 'Нужно выбрать карту';
      return false;
    }
    let pg_rest = _schema('pg_rest');
    let url = `${pg_rest}cardz_clin?crd_num=eq.${crd}`;
    return m.request({
      method: 'GET',
      url: url
    }).then(function(res) {
      // there are no talon and pmu keys
      model.card =  moTalon.set_polis( res ); // res is list
      model.pmu= [];
      moTalon.prepare( model ); 
    }).catch(function(err) {
      model.error = errMsg(err);
    });
  },
  
  set_polis( res ) {
    if (res.length === 0)
      throw 'Empty card for new talon';
    const card= Object.assign({}, res[0]);
    card.crd_polis_ser= card.polis_ser;
    card.crd_polis_num= card.polis_num;
    card.crd_smo= card.smo;
    return [card];
  },
  
  // delete from talon cards fields
  to_talon(data, fields) {
    let t = {};
    Object.keys(data).map( k => {
      if (fields.indexOf(k) < 0) t[k] = data[k];
    });
    t.crd_num = data.crd_num;
    if ( !t.talon_month ) t.talon_month= tmonth();
    if (!t.tal_num) {
        t.first_vflag= 1; // new talon with first visit always
        t.talon_type= 1; // open/ready talon
        t.urgent= 0; // not urgent
        // initially set default smo, smo_okato from card
        t.smo = data.crd_smo;
        t.smo_okato = data.crd_smo_okato;
    }
    if( Boolean(t.for_pom) ) {
        t.urgent= t.for_pom == 2 ? 1: 0;
    }
    if (!data.ot) t.d_type= '5'; // d_type only one case here NET OTCHESYVA
    return t;
  },
  
  
  prepare( model ) {
   const card_fileds = [
    'id', 'crd_num', 'fam', 'im', 'ot', 'birth_date',
    'crd_polis_ser', 'crd_polis_num', 'crd_smo',
    'dul_serial', 'dul_number',
    'mo_att' ];
    // prepare card
    let card = model.card ? model.card[0] : model.talon[0];
    let c = {};
    for (let f of card_fileds) {
      c[f] = card[f];
    }
    //c.smo -= _reg;
    //c.old_card= c.crd_num;
    model.card= c; // rewrites and this is not a list
    // prepare talon
    if ( Boolean(model.talon) && model.talon.length > 0)
      model.talon= moTalon.to_talon(model.talon[0], card_fileds);
    else
      model.talon= moTalon.to_talon( c, card_fileds );
  },
  
  saveTalon(event, model, method) {
    //console.log(event);
    event.target.parentNode.classList.add('disable');
    let to_save= Object.assign({}, model.talon);
    let pg_rest =  _schema('pg_rest');
    let { tal_num } = to_save;
    let table= moTalonsList.talTable();
    let url=`${pg_rest}${table}`;
    if ( Boolean(tal_num) ) {
      url += `?tal_num=eq.${tal_num}`;
      delete to_save.tal_num;
    }
    ['created', 'modified', 'cuser', 'urgent'].forEach( k=> delete to_save[k] );
    Object.keys(to_save).map( k=> {
      if ( to_save[k] === "" || to_save[k] === null ) {
        //console.log(k);
        delete to_save[k] //= null; // include 0 "" null
      }
    })
    return m.request({
      url: url,
      method: Boolean(tal_num) ? 'PATCH': 'POST',
      body: to_save,
      headers: {Prefer: 'return=representation'}
    }).then( res => {
      event.target.parentNode.classList.remove('disable');
      return res;
    }).catch( err => {
      //model.save = { err: true, msg: errMsg(err) };
      event.target.parentNode.classList.remove('disable');
      throw ( errMsg (err) );
    });
  },
  
};
