import { constants, fxn } from "./constants";
import { IRemoteData } from "./interfaces/config";
import { IVoteDeals } from "./interfaces/data";
import { IBuild, IGroup } from "./interfaces/others";
import { Util } from "./util";

export class SKURows extends Util {
  private skusEl;
  private createSKUs;
  private skuHTML;
  private row;
  private rows;

  constructor(remoteData: IRemoteData, fbox: any) {
    super(remoteData, fbox)

    this.skusEl = this.el(constants.SKUSELQUERY)
    this.createSKUs = (skus: IVoteDeals[]) => skus.map(this.skuHTML.bind(this)).join("")
    this.skuHTML = (sku: IVoteDeals) => this.html(sku)
    this.row = (category: string) => this.el(`${constants.SKUROWQUERY}[data-category="${category}"]`)
    this.rows = () => this.all(constants.SKUROWQUERY)

    fbox.pubsub.subscribe(constants.FOCUS, this.handleFocus.bind(this))
    fbox.pubsub.subscribe(constants.GROUPED, this.handleDisplay.bind(this))
  }

  reset() {
    this.skusEl.innerHTML = ""
  }

  selectedRow(categoryId: string) {
    const query = fxn.rowQuery(categoryId)
    return this.el(query)
  }

  handleFocus(categoryId: string) {
    const skuRows = this.rows()
    const currentRow = this.selectedRow(categoryId) 
    this.toggle(skuRows, currentRow, constants.ACTIVECLASS)
  }

  handleDisplay(data: IBuild) {
    this.reset()
    const { categories, map } = data 

    for (let [category, skus] of map.entries()) {
      this.skusEl.innerHTML += this.rowHTML(category, skus, categories)
    }

    const catId = this.categoryId(categories[0]) 

    this.handleFocus(catId)

    // this.fbox.pubsub.emit(constants.FOCUS, catId)
    this.show()
  }

  rowHTML(category: string, skus: IVoteDeals[], categories: string[]) {
    const skusHTML = this.createSKUs(skus)
    return this.createRow(category, skusHTML, categories)
  }

  createRow(category: string, skusHTML: string, categories: string[]) {

    const rowClass = category === categories[0]
    ? `${constants.SKUROWCLASS} active`
    : constants.SKUROWCLASS

    return `<div class="${rowClass}" data-category="${this.categoryId(category)}">${skusHTML}</div>`
  }

  html(sku: IVoteDeals) {
    const oldPrice = this.price(sku.old_price)
    const newPrice = this.price(sku.new_price)
    // const oldPrice = sku.old_price
    // const newPrice = sku.new_price
    const discount = this.discount(sku.old_price, sku.new_price)
    const idName = sku.name + "-" + (+new Date()) 

    return `<div class="-sku -posrel -${sku.status}" id="${this.id(idName, '-')}"><a href="${sku.pdp}" target="_blank" class="-img -posrel" ><span class="-posabs -preloader -loading"></span><div class="-posabs -shadow"><span class="-posabs">sold out</span></div><img class="lazy-image loaded" data-src="${sku.image}" alt="sku_img" /></a><div class="-details -posabs"><div class="-name">${sku.name}</div><div class="-prices"><div class="-price -new">${newPrice}</div><div class="-price -old">${oldPrice}</div><div class="-disvcount">${discount}</div></div></div><div class="-btns -posabs"><a href="${sku.pdp}" target="_blank" class="-btn -view"></a><div class="-btn -unvote"></div><div class="-btn -vote"></div></div><div class="-vcounts -posabs"><div class="-ploader -unvotedown"></div><div class="-ploader -voteup"></div><div class="-vcount -down"><div class="-icon -unvote"></div><div class="-txt">8</div></div><div class="-vcount -up"><div class="-icon -vote"></div><div class="-txt">9</div></div></div></div>`
  }
}