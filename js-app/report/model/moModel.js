
// src/report/model/moModel.js

const task_rest = window.localStorage.getItem('task_rest'); //task schemaRest;

const moModel = {
  
  getModel() {
    return {
      rest_url: task_rest,
      api_url: null,
      error: null,
      message: null,
      file: null,
      done: false
    };  
  },
  
  doUpload(form, model) {
    //console.log(form);
    let upurl = form.getAttribute('action');
    //console.log(upurl);
    //let finput = form.elements.namedItem('file'),
    //file = finput.files[0], 
    let data = new FormData(form);
    
    form.classList.add('disable');
    
    //data.append("test", form.elements.namedItem('test'));
    //data.append("month", form.elements.namedItem('month'));
    //data.append("file", file);
    //console.log(data.getAll('test')[0], data.getAll('month')[0]);
    //data.append("")
    m.request({
        method: "POST",
        url: task_rest + upurl,
        data: data,
    }).then( (res) =>{
        model.message = res['message'];
        model.file = res['file'];
        model.done = res['done']
        console.log(` msg: ${model.message}, file: ${model.file}, done: ${model.done}`);
        form.classList.remove('disable');
    }).catch( (err) => {
        model.error = err.message;
        console.log( model.error);
        form.classList.remove('disable');
    });
    return false;
  }
}
export { moModel }