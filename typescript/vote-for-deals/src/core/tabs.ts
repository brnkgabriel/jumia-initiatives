import { IVoteDeals } from './interfaces/data';
import { constants } from "./constants";
import { IRemoteData } from "./interfaces/config";
import { IBuild } from "./interfaces/others";
import { Util } from "./util";

export class Tabs extends Util {
  
  private $tabBounds: DOMRect
  private tabs: HTMLElement
  private tabsParent: HTMLElement
  private prev: HTMLElement
  private next: HTMLElement

  constructor(remoteData: IRemoteData, fbox: any) {
    super(remoteData, fbox)
    this.$tabBounds = {} as DOMRect

    this.tabs = this.el(constants.TABSQUERY)
    this.tabsParent = this.el(constants.TABSPARENTQUERY)
    this.prev = this.el(constants.PREVQUERY)
    this.next = this.el(constants.NEXTQUERY)

    fbox.pubsub.subscribe(constants.GROUPED, this.build.bind(this))
    this.tabs.addEventListener(constants.CLICK, this.tabListener.bind(this))
  }

  reset() {
    this.tabs.innerHTML = ""
  }

  build(data: IBuild) {
    this.reset()

    const { categories } = data
    console.log("first category from tab", categories[0])

    this.tabs.innerHTML = categories
    .map(this.createTab.bind(this))
    .join("")

    // first tab
    const firstTab = this.all(".-tab")[0] as HTMLElement
    this.setTabProps(firstTab, constants.FIRSTTAB)
    this.show()

    this.fbox.is_mobile === false && this.scrollListeners()
  }
  
  scrollListeners() {
    this.next.addEventListener(constants.CLICK, () => this.scrollTo(constants.NEXT))
    this.prev.addEventListener(constants.CLICK, () => this.scrollTo(constants.PREV))
  }

  scrollTo(type: string) {
    const start = type === constants.NEXT
    ? this.tabs.scrollLeft + 50 : this.tabs.scrollLeft - 50
    const end = type === constants.NEXT
    ? this.tabs.scrollLeft + 300 : this.tabs.scrollLeft - 300

    const delta = end - start
    this.tabs.scrollLeft = start + delta * 1
  }

  setTabProps(el: HTMLElement, by: string) {
    this.toggle(this.all(constants.TABQUERY), el, constants.ACTIVECLASS)

    if (by === constants.TABLISTENER) {
      this.fbox.pubsub.emit(constants.FOCUS, el.getAttribute(constants.DATACATEGORY))
    }
  }

  createTab(category: string, idx: number) {
    const tabClass = idx === 0
    ? "-tab active -inlineblock -posrel -vamiddle"
    : "-tab -inlineblock -posrel -vamiddle"

    return `<a href="#top" class="${tabClass}" data-category="${this.categoryId(category)}"><span class="-posabs -preloader -loading"></span><span>${category}</span></a>`
  }

  tabListener(evt: Event) {
    const parent = (evt.target as HTMLElement).parentElement as HTMLElement
    this.isATab(parent) && this.setTabProps(parent, constants.TABLISTENER)
  }
}