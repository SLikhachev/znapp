
// src/report/model/moModel.js

const pg_rest = window.localStorage.getItem('pg_rest'); //task schemaRest;
const task_rest = window.localStorage.getItem('task_rest'); //task schemaRest;

const moModel = {
  
  getModel( url=null, sort_by=null ) {
    //console.log(url);
    return {
      pg_url: url,
      //task_rest: task_rest,
      //task_get_url: null,
      //task_post_url: null,
      field: sort_by,
      list: null,
      error: null,
      message: null,
      file: null,
      done: false
    };  
  },
  
  getList (model) {
    // filed - sort by with SELECT, default 'id' field
    //let schema = window.localStorage.getItem('pg_rest');
    //let id = model.field ? model.field : 'id',
    //order = `?order=${id}.asc`;
    let url = pg_rest + model.pg_url; // + order;
    //console.log(url);
    return m.request({
      method: 'GET',
      url: url
    }).then(function(res) {
      model.list = res; // list of objects
      model.order = true;
    }).catch(function(e) {
      model.error = e.message;
      console.log(model.error);
    });
  },

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
        m.request({
            method: method,
            url: task_rest + upurl + get_param,
            body: data,
        }).then((res) => {
            if (res.file) {
                model.file = res.file;
            }
            model.message = res.message;
            model.done = res.done;
            //console.log(` msg: ${model.message}, file: ${model.file}, done: ${model.done}`);
            form.classList.remove('disable');
        }).catch((err) => {
            model.error = err.message;
            console.log(model.error);
            form.classList.remove('disable');
        });
        return false;
    }
}
export { task_rest, moModel }