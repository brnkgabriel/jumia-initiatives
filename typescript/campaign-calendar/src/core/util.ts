import { IDomain, IRemoteConfig, IRemoteData } from "./interfaces/config";
import { IConstants, IGetDataOptions } from "./interfaces/others";
import { constants, fxn } from "./constants";
import { ICampaignCalendar } from "./interfaces/data";

type TypeOrNull<T> = T | null;

export class Util {
  private remoteData:IRemoteData;
  private timeInterval:number = 0;
  private minutesDuration: number;
  private currency: string;
  private config: IRemoteConfig;
  private domain: IDomain;
  private el;
  private all;
  private pad;
  private endTime;
  private skuRow;
  private skuRows;
  private tab;
  private live;
  private skuID;
  private capitalize;
  private oosByTime;
  private isItMyTime;
  private isPast;
  private isFuture;
  private digit;
  private isATab;
  private midnight;

  constructor(remoteData: IRemoteData) {
    this.remoteData = remoteData
    this.minutesDuration = Number(this.remoteData.config.minute_duration_campaign_calendar)
    this.currency = this.remoteData.config.currency
    this.config = this.remoteData.config
    this.domain = this.remoteData.domain

    this.el = (query: string) => document.querySelector(fxn.idQuery(query))
    this.all = (query: string) => document.querySelectorAll(fxn.idQuery(query))
    this.pad = (time: number) => time.toString().length == 1 ? "0" + time : time
    this.endTime = (time: number) => time + (this.minutesDuration * 60 * 1000)
    this.skuRow = (time: number) => this.el(fxn.timeQuery(time))
    this.skuRows = () => this.all(constants.SKUROWCLASS)
    this.tab = (time: number) => this.el(fxn.tabQuery(time))
    this.live = (list: HTMLElement[], action: "add" | "remove") => list.forEach(each => each.classList[action](constants.LIVECLASS))
    this.skuID = (sku: ICampaignCalendar) => sku.name + "-" + (+new Date(sku.time))
    this.capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)
    this.oosByTime = (times: number[]) => times.map(time => this.skuRow(time)?.classList.add(constants.OOSCLASS))
    this.isItMyTime = (sku: ICampaignCalendar, time: number) => +new Date(sku.time) === time
    this.isPast = (time: number) => Date.now() > time && Date.now() > this.endTime(time)
    this.isFuture = (time: string, past: string) => past.indexOf(time) === -1
    this.digit = (num: number, unit: string) => num !== 0 ? this.pad(num) + unit : ""
    this.isATab = (el: HTMLElement) => el.classList.contains(constants.TABCLASS)
    this.midnight = (time: number | string) => +new Date(time).setHours(0, 0, 0, 0)
  }

  getData(initiative: string) {
    const list = this.remoteData.json_list
    return list.filter((datum) => datum.initiative === initiative)
  }

  times(skus:ICampaignCalendar[]) {
    const times = skus.map(sku => this.midnight(sku.time))
    const uniqueTimes = Array.from(new Set(times))
    return uniqueTimes.sort((a, b) => a - b)
  }
}