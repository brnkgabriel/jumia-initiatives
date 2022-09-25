import { config, constants } from "./core/constants";
import { IRemoteConfig, IRemoteData } from "./core/interfaces/config";
import { ICampaignCalendar, MarketingTypes } from "./core/interfaces/data";
import { Util } from "./core/util";

const wind = window as any
const fbox = wind.Featurebox({ config })
let util: Util

fbox.pubsub.subscribe(fbox.FETCHED_DATA, (data: any) => {
  const remoteData:IRemoteData = data as IRemoteData
  util = new Util(remoteData)
  const calendar:any[] = util.getData(constants.NAME)
  const times: number[] = util.times(calendar)
  console.log("times", times)
})