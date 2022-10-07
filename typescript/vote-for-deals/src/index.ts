import { IOptions } from './core/interfaces/others';
import { config, constants } from "./core/constants";
import { Controller } from "./core/controller";
import { IRemoteData } from "./core/interfaces/config"

const wind = window as any
const fbox = wind.Featurebox({ config, name: constants.SHEETNAME })
const store = wind.store
const btoa = wind.btoa
var Database = wind.Database
let controller: Controller

const currentUser = {
  isLoggedIn: false,
  email: "",
  pw: "",
};
const interval = setInterval(() => {
  if (/loaded|complete/.test(document.readyState)) {
    clearInterval(interval);
    currentUser.email = store.customer.email;
    currentUser.pw = btoa(currentUser.email.split("").reverse().join(""));

    if (currentUser.email.length > 0) {
      currentUser.isLoggedIn = true;

      const email = currentUser.email;
      const password = currentUser.pw;

      const options: IOptions = {
        email,
        password,
        Database
      }
 
      fbox.pubsub.subscribe(fbox.FETCHED_DATA, (data: any) => {
        const remoteData:IRemoteData = data as IRemoteData
        controller = new Controller(remoteData, fbox, options)
        const calendar:any[] = controller.getData(constants.NAME)
      })
    }
  }
}, 10);
