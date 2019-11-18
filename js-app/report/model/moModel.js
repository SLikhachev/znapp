
// src/report/model/moModel.js

import { _schema, errMsg  } from '../../apps/model/moModel.js';

export const moModel = {
  
    doSubmit: function (form, model, method) {
        //console.log(form);
        let upurl = form.getAttribute('action');
        //console.log(upurl);
        //let finput = form.elements.namedItem('file'),
        //file = finput.files[0],
        let data = new FormData(form);
        let get_param = '';
        if (method == "GET") {
            let get_data = {};
            data.forEach( (v, k) => { get_data[k] = v; } );
            get_param = '?' + m.buildQueryString(get_data);
        }
        //console.log(get_param);
        form.classList.add('disable');

        //data.append("test", form.elements.namedItem('test'));
        //data.append("month", form.elements.namedItem('month'));
        //data.append("file", file);
        //console.log(data.getAll('test')[0], data.getAll('month')[0]);
        //data.append("")
        let url= `${_schema('task')}${upurl}${get_param}`;
        return m.request({
            method: method,
            url: url,
            body: data,
        }).then( res=> {
            if (res.file) {
                model.file = res.file;
            }
            model.message = res.message;
            model.done = res.done;
            //console.log(` msg: ${model.message}, file: ${model.file}, done: ${model.done}`);
            form.classList.remove('disable');
            return true;
        }).catch( err=> {
            model.error = errMsg(err);
            form.classList.remove('disable');
        });
    }
}
