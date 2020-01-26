
import { _schema } from '../../apps/model/moModel.js';
import { vuLoading,  vuTheader } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moFormModel.js';


export const vuImp = function ( model,  header,  url,  vuForm) {
  let hdr = header.toString();
  const _model = { url: url, list: null };

  moModel.getList(_schema('pg_rest'), _model).then(() => {
    if (_model.list && _model.list[0]) {
      const item=  _model.list[0];
        if ( !! item.file_name )
           hdr = `${hdr} (последний файл: ${item.file_name} - ${item.pack_type.descr} )`
     }
  });

  return {
    view () {
      return _model.error ? [ m(".error", _model.error) ] : ! _model.list ?  m(vuLoading) :  [
        m(vuTheader, { header: hdr } ),
        m(vuForm, { model: model } )
      ];
    }

  }; //return this object
};

