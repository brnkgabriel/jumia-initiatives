import { IDomain, IRemoteConfig, IRemoteData } from "./interfaces/config";
import { IDBConfig, IPastAndFutureTimes } from "./interfaces/others";
import { constants, fxn } from "./constants";
import { IVoteDeals } from "./interfaces/data";

// type TypeOrNull<T> = T | null;

export class Util {
  private remoteData:IRemoteData;
  private timeInterval:number = 0;
  private minutesDuration: number;
  private currency: string;
  private config: IRemoteConfig;
  private domain: IDomain;
  protected el;
  protected all;
  private pad;
  private endTime;
  private skuRow;
  // private skuRows;
  private tab;
  private live;
  private skuID;
  private capitalize;
  // private oosByTime;
  private isPast;
  private isFuture;
  private digit;
  protected isATab;
  private midnight;
  protected fbox;
  protected allCategories;
  protected randomize;
  protected categoryId;

  constructor(remoteData: IRemoteData, fbox: any) {
    this.remoteData = remoteData
    this.minutesDuration = Number(this.remoteData.config.minute_duration_campaign_calendar)
    this.currency = this.remoteData.config.currency
    this.config = this.remoteData.config
    this.domain = this.remoteData.domain
    this.fbox = fbox

    this.el = (query: string) => document.querySelector(fxn.idQuery(query)) as HTMLElement
    this.all = (query: string) => document.querySelectorAll(fxn.idQuery(query))
    this.allCategories = (data: IVoteDeals[]) => [...new Set(data.map(datum => datum.category))]
    this.pad = (time: number) => time.toString().length == 1 ? "0" + time : time
    this.endTime = (time: number) => time + (this.minutesDuration * 60 * 1000)
    this.randomize = (list: any[]) => list.sort( () => .5 - Math.random() )
    this.skuRow = (category: string) => this.el(fxn.tabQuery(category))
    this.categoryId = (category: string) => `cat-${this.id(category, "-")}`
    // this.skuRows = () => this.all(constants.SKUROWQUERY)
    this.tab = (category: string) => this.el(fxn.tabQuery(category))
    this.live = (list: HTMLElement[], action: "add" | "remove") => list.forEach(each => each.classList[action](constants.LIVECLASS))
    this.skuID = (sku: IVoteDeals) => sku.name + "-" + (+new Date(sku.sku))
    this.capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)
    // this.oosByCategory = (category: string[]) => times.map(time => this.skuRow(time)?.classList.add(constants.OOSCLASS))
    this.isPast = (time: number) => Date.now() > time && Date.now() > this.endTime(time)
    this.isFuture = (time: number, past: number[]) => past.indexOf(time) === -1
    this.digit = (num: number, unit: string) => num !== 0 ? this.pad(num) + unit : ""
    this.isATab = (el: HTMLElement) => el.classList.contains(constants.TABCLASS) 
    this.midnight = (time: number | string) => +new Date(time).setHours(0, 0, 0, 0)
  }

  getData(initiative: string) {
    const list = this.remoteData.json_list as IVoteDeals[]
    return list.filter((datum) => datum.initiative === initiative)
  }

  group(data: IVoteDeals[], categories: string[]) {
    const group:Map<string, IVoteDeals[]> = new Map()

    categories.map(category => {
      const skus = data.filter(datum => datum.category === category)
      const randomized = this.randomize(skus)
      group.set(category, randomized)
      // group.set(category, skus)
    })
    return group
  }

  pastAndFutureTimes(times: number[]) {
    const past = times.filter(this.isPast)
    const future = times.filter(time => this.isFuture(time, past))
    return { past, future }
  }

  timeUnits(time: number) {
    const $date = new Date(time)
    const day = $date.getDay()
    const month = $date.getMonth()
    const date = $date.getDate()
    const hour = $date.getHours()
    const mins = $date.getMinutes()

    return { day, month, date, hour, mins }
  }
  

  toggle(toRemove: NodeListOf<Element>, toAdd: HTMLElement, className: string) {
    toRemove.forEach(el => el.classList.remove(className))
    toAdd.classList.add(className)
  }

  price(raw: string) {
    const num = this.numFromStr(raw)
    return `${this.currency} ${Number(num).toLocaleString()}`
  }

  numFromStr(str: string) {
    return Number(str.replace(/[^0-9\.]+/g,""))
  }

  formatPrice(price: string) {
    const formatted = this.config.currency_position === constants.PREFIX
    ? `${this.currency} ${Number(price).toLocaleString()}`
    : `${Number(price).toLocaleString()} ${this.config.currency}`

    return Number(price) === 0 ? constants.FREE : formatted
  }

  isANumber(price: string) {
    const pieces = price.split(" ")
    const num = pieces.filter(piece => !isNaN(Number(piece)))[0]

    return !isNaN(Number(num)) ? Number(num) : null
  }

  discount($old: string, $new: string) {
    const oldP = this.isANumber($old)
    const newP = this.isANumber($new)
    if (!isNaN(Number(oldP))) {
      var diff = Number(oldP) - Number(newP)
      var ratio = (diff * 100) / Number(oldP)
      return !isNaN(ratio) ? "-" + Math.round(ratio) + "%" : "";
    }
    return null
  } 

  // continue from replace pattern
  replacePattern(pattern: string | RegExp, str: string) {
    const re = new RegExp(pattern, "g")
    return str.replace(re, "-")
  }

  id(name: string, delim: string) {
    const replaceApostrophe = this.replacePattern("'", name)
    const replaceAmpersand = this.replacePattern("&", replaceApostrophe)
    const replacePercent = this.replacePattern("%", replaceAmpersand)
    return replacePercent.toLowerCase().split(" ").join(delim)
  }

  key(keyStr: string, obj: IRemoteConfig) {
    type KeyType = keyof typeof obj
    return keyStr as KeyType
  }

  dbConfigKey(keyStr: string, obj: IDBConfig) {
    type keyType = keyof typeof obj
    return keyStr as KeyType
  }

  show() {
    let imageObserver = new this.fbox.ImageObserver()
    imageObserver = null
    return this
  }

  platform() {
    const isMobile = 'ontouchstart' in window
    const mBannerStr = constants.SHEETNAME + "_mobile_banner"
    const dBannerStr = constants.SHEETNAME + "_desktop_banner"
    const deeplinkStr = constants.SHEETNAME + "_deeplink"

    const mBannerKey = this.key(mBannerStr, this.config)
    const dBannerKey = this.key(dBannerStr, this.config)
    const deeplinkKey = this.key(deeplinkStr, this.config)

    const mBanner = this.config[mBannerKey]
    const dBanner = this.config[dBannerKey]
    const deeplink = this.config[deeplinkKey]

    const banner = isMobile ? mBanner : dBanner
    const lvlink = isMobile ? deeplink : (`${this.domain.host}/${this.config.download_apps_page}`)
    
    return { banner, live_link: lvlink }
  }
}