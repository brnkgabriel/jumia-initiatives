import { IOptions } from './interfaces/others';
import { constants } from "./constants";
import { IRemoteData } from "./interfaces/config";
import { IVoteDeals } from "./interfaces/data";
import { SKURows } from "./skurows";
import { Tabs } from "./tabs";
import { Util } from "./util";

export class Controller extends Util {
  private data: IVoteDeals[]
  private tandcs: IVoteDeals[]
  private tandcsEl: HTMLElement
  private hiwCTA: HTMLElement
  private topBanner: HTMLElement
  private tabs: Tabs
  private skuRows: SKURows
  private database: any

  constructor(remoteData: IRemoteData, fbox: any, options: IOptions) {
    super(remoteData, fbox)

    this.data = this.getData(constants.INITIATIVE)
    this.tandcs = this.getData(constants.TANDCS)

    this.tandcsEl = this.el(constants.TANDCSQUERY)
    this.hiwCTA = this.el(constants.HOWITWORKSQUERY)
    this.topBanner = this.el(constants.TOPBANNERQUERY)

    this.hiwCTA.addEventListener(constants.CLICK, this.toggleBanner.bind(this))

    this.tabs = new Tabs(remoteData, fbox)
    this.skuRows = new SKURows(remoteData, fbox)
    this.database = new options.Database({
      email: options.email,
      password: options.password,
      fbox
    })

    this.fbox.pubsub.subscribe(constants.RESET, this.init.bind(this))

    this.init()
    .setBanner()
    .displayTAndCs()
    .show()
    
  }

  init() {
    const allCategories = this.allCategories(this.data)
    const map = this.group(this.data, allCategories)

    const categories = this.randomize(allCategories)
    this.fbox.pubsub.emit(constants.GROUPED, { map, categories })

    return this
  }

  toggleBanner() {
    this.topBanner.classList.toggle(constants.SHOWCLASS)
    const hiwText = this.hiwCTA.querySelector(constants.TXTCLASS) as HTMLElement
    hiwText.textContent = hiwText?.textContent === constants.TERMSANDCONDIIONS
    ? constants.CLOSE : constants.TERMSANDCONDIIONS
  }

  setBanner() {
    const bannerImage = this.el(constants.BANNERQUERY)
    bannerImage.setAttribute(constants.DATASRC, this.platform().banner)
    return this
  }

  displayTAndCs() {
    this.tandcsEl.innerHTML = this.tandcs.map(this.tandcHTML.bind(this)).join("")
    return this
  }

  tandcHTML(tandc: IVoteDeals) {
    return `<div class="-rule_element"><div class="-inlineblock -vatop -num">${tandc.sku}.</div><div class="-inlineblock -vatop -desc">${tandc.name}</div></div>`
  }
}