
import { states } from '../../apps/appApi';
import { talonCard } from './vuTalonCard';
import { talonForm } from './vuTalonMain'; 


export const vuTalon = () => {

  let tpl = '';

  return {
    view() {
      tpl = states().unit === 'templ' ? 'tpl' : '';
      
      return m(".pure-g", {
        style: "padding-left: 4em;"
      }, [
        //model.tpl ? m(templateForm, { model: model, method: method } ): [
        m(".pure-u-6-24.patz-data", { style: "overflow: hidden; padding-right: 1em" },
          tpl ? '' : m(talonCard)), // only patch
        m(".pure-u-18-24" , m(talonForm, { tpl }))
      ]);
    }
  };
};