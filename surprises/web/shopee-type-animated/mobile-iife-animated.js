
var Begin = (function (data) {
  class Util {
    constructor(json) {
      this.json = json
      this.NAME = 'Flash Sale'
      this.TANDC = 'Flash Sale T & C'
      this.REORDERED = 'reordered'
      this.TAB_EVENT = 'tab event'
      this.DISPLAY_SKUS = 'display skus'
      this.TABS_PER_PAGE = 6
      this.TIME_SLOTS_TO_DISPLAY = 12
      this.SKU_X_MARGIN = 4
      this.time_interval = null
      this.minute_duration = parseInt(json.config.minute_duration_flash_sale)
      this.CURRENCY = json.config.currency
      this.config = json.config
      this.domain = json.domain

      this.el = query => document.querySelector('#initiative ' + query)
      this.all = query => document.querySelectorAll('#initiative ' + query)
      this.pad = time => time.toString().length == 1 ? '0' + time : time
      this.endTime = time => time + (this.minute_duration * 60 * 1000)
      this.isAGroup = sku => sku.fs_price.length === 0
      this.skuRow = time => this.el('._row-' + time)
      this.initializeClock = (end_time, fn) => time_interval = setInterval(() => fn(end_time), 1000);
      this.tab = time => this.el('.-t-' + time)
      this.live = (list, action) => list.forEach(each => each.classList[action]('-live'))
      this.skuID = sku => sku.name + '-' + (+new Date(sku.time))
      this.capitalize = str => str[0].toUpperCase() + str.slice(1)
      this.oosByTime = times => times.map(time => this.skuRow(time).classList.add('-oos'))
      this.getData = (detail, json) => detail.json_list.filter(datum => datum[json.key] === json.name)
      this.isItMyTime = (sku, time) => +new Date(sku.time) === parseInt(time)
      this.isPast = time => Date.now() > time && Date.now() > this.endTime(time)
      this.isFuture = (time, past) => past.indexOf(time) === -1
      this.displayCondition = (time, idx) => idx < this.TIME_SLOTS_TO_DISPLAY
    }

    times(skus) {
      var times = skus.map(sku => +new Date(sku.time))
      var unique_times = Array.from(new Set(times))
      return unique_times.sort((a, b) => a - b)
    }

    group(sku_list, times) {
      return times.map(time => {
        var skus = sku_list.filter(sku => this.isItMyTime(sku, time))
        return { time, skus }
      })
    }

    pastAndFutureTimes(times) {
      var past = times.filter(this.isPast)
      var future = times.filter(time => this.isFuture(time, past))
      return { past, future }
    }

    lastTimeSet(times) {
      return times.reverse()
      .filter(this.displayCondition).reverse()
    }

    reorder(times) {
      return this.pastAndFutureTimes(times)['future'].concat(this.pastAndFutureTimes(times)['past'])
    }

    timeUnits(time) {
      var _date = new Date(time)
      var day = _date.getDay()
      var month = _date.getMonth()
      var date = _date.getDate()
      var hr = _date.getHours()
      var mn = _date.getMinutes()
      return { day, month, date, hr, mn }
    }

    twelveHrFormat(hr, mn) {
      if (hr === 12) return this.pad(hr) + ':' + this.pad(mn) + 'pm'
      else if (hr > 12) return this.pad(hr - 12) + ':' + this.pad(mn) + 'pm'
      else if (hr === 0) return '12:' + this.pad(mn) + 'am'
      else return this.pad(hr) + ':' + this.pad(mn) + 'am'
    }

    date(time) {
      var _time = new Date(time)
      var time_date = _time.getDate()
      var now_date = new Date(Date.now()).getDate()
      var time_diff = now_date - time_date
  
      if (time_diff === 0) return this.capitalize('today')
      else if (time_diff === 1) return this.capitalize('yesterday')
      else if (time_diff === -1) return this.capitalize('tomorrow')
      else return this.fullDate(time)
    }

    fullDate(time) {
      var date = new Date(time)
      var mnth = date.toLocaleDateString("en-US", { month: 'short' })
      var day = date.toLocaleDateString("en-US", { weekday: 'short' })
      return mnth + ' ' + day + ' ' + date.getDate()
    }

    toggleClass(to_remove, to_add, class_name) {
      to_remove.forEach(el => el.classList.remove(class_name))
      to_add.classList.add(class_name)
    }

    price(raw) {
      return raw.split('-')
      .map(this.formatPrice.bind(this)).join(' - ')
    }

    formatPrice(price) {
      var formatted = this.config.currency_position === 'prefix' ? this.config.currency + ' ' + parseInt(price).toLocaleString() : parseInt(price).toLocaleString() + ' ' + this.config.currency
      return parseInt(price) == 0 ? 'FREE' : formatted
    }

    discount(_old, _new) {
      var diff = parseInt(_old) - parseInt(_new)
      var ratio = diff * 100 / parseInt(_old)
      return !isNaN(ratio) ? '-' + Math.round(ratio) + '%' : ''
    }

    replacePattern(pattern, str) {
      var re = new RegExp(pattern, 'g')
      return str.replace(re, '-')
    }
  
    id(name, delim) {
      var replaceApostrophe = this.replacePattern("'", name)
      var replaceAmpersand = this.replacePattern('&', replaceApostrophe)
      var replacePercent = this.replacePattern('%', replaceAmpersand)
      return replacePercent.toLowerCase().split(' ').join(delim)
    }

    badge(sku) {
      var badge_id = this.id(sku.type, '_')
      var badge_icon = this.config[badge_id + '_icon']
      var badge_txt = sku.type === 'Generic' ? 'Limited Stock' : sku.type
      var badge = badge_icon ? `<img class="lazy-image" data-src="${badge_icon}" alt="sku_img"/>` : badge_txt
      var badge_el = badge_icon ? `<div class="-tag -inlineblock -vamiddle -b-img -${this.id(sku.type, '-')}">${badge}</div>` : `<div class="-tag -inlineblock -vamiddle -${this.id(sku.type, '-')}" style="background-color:${this.config[sku.type]}">${badge}</div>`
      return badge_el
    }

    timeFormat(time) {
      var t_units = this.timeUnits(time)
      var t = this.twelveHrFormat(t_units.hr, t_units.mn)
      return this.date(time) + "'s " + t + ' sale'
    }
  }

  class Controller extends Util {
    constructor(json) {
      super(json)
      this.data = this.getData(json, { key: 'initiative', name: this.NAME })
      this.tandc = this.getData(json, { key: 'type', name: this.TANDC })

      this.tabs = new Tabs(json)
      this.sku_rows = new SKURows(json)

      this.init()
    }

    init() {
      var all_times = this.times(this.data)
      var last_time_set = this.lastTimeSet(all_times)
      var reordered = this.reorder(last_time_set)

      feature_box.emit(this.REORDERED, reordered)

      reordered.map(time => console.log(new Date(time).toLocaleString()))

      var grouped = this.group(this.data, reordered)
      feature_box.emit(this.DISPLAY_SKUS, grouped)
    }
  }

  class Tabs extends Util {
    constructor(json) {
      super(json)
      this.tab_bounds = {}

      this.tabs = this.el('.-all-tabs')
      this.tabs_parent = this.el('.-tabs')

      feature_box.subscribe(this.REORDERED, this.build.bind(this))

      this.tabs.addEventListener('click', this.tabListener.bind(this))
    }

    build(times) {
      this.tabs.innerHTML = times
      .map(this.createTab.bind(this))
      .join('') + '<span class="-indicator -posabs"></span>'

      times.map(this.tabBounds.bind(this))
    }

    tabListener(evt) {
      var parent = evt.target.parentElement
      this.isATab(parent) && this.setTabProps(parent)
    }

    setTabProps(el) {
      this.toggleClass(this.all('.-tab'), el, 'active')
      this.moveIndicator(el)
      feature_box.emit(this.TAB_EVENT, el.getAttribute('data-time'))
    }

    moveIndicator(el) {
      var time = el.getAttribute('data-time')
      var tab_bound = this.tab_bounds[time]
      var indicator = this.el('.-tabs .-indicator')
      var width = tab_bound.width + "px"
      var left = tab_bound.x + "px"
      var style = 'left:' + left + ';width:' + width
      indicator.setAttribute('style', style)
    }
    
    isATab(el) { return el.classList.contains('-tab') }

    tabBounds(time) {
      var tab = this.el('.-tab[data-time="' + time + '"]')
      this.tab_bounds[time] = tab.getBoundingClientRect()
    }

    createTab(time, idx) {
      var tab_class = idx === 0 ? '-tab active -inlineblock -posrel -vamiddle' : '-tab -inlineblock -posrel -vamiddle'
      var t_units = this.timeUnits(time)
      return `<a href="#top" class="${tab_class}" data-time="${time}"><span class="-posabs -preloader -loading"></span><span class="-time">${this.twelveHrFormat(t_units.hr, t_units.mn)}</span><span>${this.date(time)}</span></a>`
    }
  }

  class SKURows extends Util {
    constructor(json) {
      super(json)
      this.row_bounds = {}

      this.skus_el = this.el('.-skus')
      this.sku_rows = this.el('.-sku_rows')

      feature_box.subscribe(this.TAB_EVENT, this.tabbed.bind(this))
      feature_box.subscribe(this.DISPLAY_SKUS, this.displayAndInit.bind(this))
    }

    tabbed(time) {
      var number_time = parseFloat(time)
      var row_bound = this.row_bounds[number_time]
      var row_left_style = 'left:' + (-row_bound.x + this.SKU_X_MARGIN) + 'px'
      
      var skus_height_style = 'height:' + row_bound.height + 'px'
      this.sku_rows.setAttribute('style', row_left_style)
      this.skus_el.setAttribute('style', skus_height_style)
    }

    displayAndInit(sku_groups) {
      this.sku_rows.innerHTML = sku_groups
      .map(this.rowHTML.bind(this)).join('')

      this.init()
    }

    init() {
      var sku_rows = this.all('.-sku_row')

      Array.from(sku_rows)
      .map(el => el.getAttribute('data-time'))
      .map(this.rowBounds.bind(this))

      /** tab first row */
      var first_time = sku_rows[0].getAttribute('data-time')
      this.tabbed(first_time)
    }

    rowHTML(group, idx) {
      var skus_html = this.createSKUs(group.skus)
      return this.createRow(group, idx, skus_html)
    }

    createSKUs(skus) {
      return skus.map(this.skuHTML.bind(this)).join('')
    }

    skuHTML(sku) {
      return this.isAGroup(sku) ? this.createSKU(sku, 'group') : this.createSKU(sku, 'single')
    }

    createSKU(sku, type) {   
      return type === 'group' ? this.groupHTML(sku) : this.singleHTML(sku)
    }

    groupHTML(sku) {
      var cta_txt = sku.type === 'Jumia Pay' ? 'buy now' : 'shop now'
      return `<a href="${sku.pdp}" target="_blank" class="-sku -posrel -${sku.status}" id="${this.id(this.skuID(sku), '-')}"><div class="-img -posrel"><span class="-posabs -preloader -loading"></span><div class="-posabs -shadow"><span class="-posabs">sold out</span></div><img class="lazy-image" data-src="${sku.image}" alt="sku_img"/></div><div class="-details -posabs"><div class="-name">${sku.name}</div><div class="-prices"><div class="-price -new">${sku.fs_discount}</div></div></div><div class="-cta -posabs">${cta_txt}</div><div class="-tags -posabs">${this.badge(sku)}</div></a>`
    }

    singleHTML(sku) {
      var old_price = this.price(sku.barred_price)
      var new_price = this.price(sku.fs_price)
      var discount = this.discount(sku.barred_price, sku.fs_price)

      return `<a href="${sku.pdp}" target="_blank" class="-sku -posrel -${sku.status}" id="${this.id(this.skuID(sku), '-')}"><div class="-img -posrel"><span class="-posabs -preloader -loading"></span><div class="-posabs -shadow"><span class="-posabs">sold out</span></div><img class="lazy-image loaded" data-src="${sku.image}" alt="sku_img"/></div><div class="-details -posabs"><div class="-name">${sku.name}</div><div class="-prices"><div class="-price -new">${new_price}</div><div class="-price -old">${old_price}</div><div class="-discount">${discount}</div></div></div><div class="-cta -posabs">add to cart</div><div class="-tags -posabs">${this.badge(sku)}</div></a>`
    }

    createRow(group, idx, skus_html) {
      var row_class = idx === 0 ? '-sku_row -posrel active _row-' + group.time : '-sku_row -posrel _row-' + group.time
      return `<div class="${row_class}" data-time="${group.time}">${skus_html}</div>`
    }

    rowBounds(time) {
      var row = this.el('.-sku_row[data-time="' + time + '"]')
      this.row_bounds[time] = row.getBoundingClientRect()
    }
  }

  new Controller(data)
})

var gsheet_id = "16AmKgEy2tHWRHgt9wdAfQJvgsML_pu_Z9PTH-_LvSjY"
var fb_config = {
  apiKey: "AIzaSyAA8dQEt-yZnDyY3Lra8lndRJ3LWNYVW0o",
  authDomain: "jumia-c15a3.firebaseapp.com",
  databaseURL: "https://jumia-c15a3.firebaseio.com",
  projectId: "jumia-c15a3",
  storageBucket: "jumia-c15a3.appspot.com",
  messagingSenderId: "295115190934",
  appId: "1:295115190934:web:de0b33b53a514c3c"
}
var element_id = 'app'
var feature_box = Featurebox({ id: gsheet_id, config: fb_config, element_id })

feature_box.subscribe(feature_box.FETCHED_DATA, Begin)

