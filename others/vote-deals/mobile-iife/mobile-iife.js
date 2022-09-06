
var Begin = (function (data) {
  class Util {
    constructor(json) {
      this.json = json
      this.NAME = 'Spot The Difference'
      this.TANDC = 'Spot The Difference T & C'
      this.ID = 'spot_the_difference'
      this.FOCUS = 'focus'
      this.BUILD = 'build'
      this.RESET = 'reset'
      this.TAB_OFFSET = 63
      this.TAB_LISTENER = 'tab listener'
      this.FIRST_TAB = 'first tab'
      this.IN_SESSION = 'in session'
      this.AFTER_SESSION = 'after session'
      this.BTW_OR_B4_SESSION = 'between or before session'
      this.SET_STATE = 'set state'
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
      this.skuRow = time => this.el('.-sku_row[data-time="' + time + '"]')
      this.skuRows = () => this.all('.-sku_row')
      this.tab = time => this.el('.-tab[data-time="' + time + '"]')
      this.live = (list, action) => list.forEach(each => each.classList[action]('-live'))
      this.skuID = sku => sku.name + '-' + (+new Date(sku.time))
      this.capitalize = str => str[0].toUpperCase() + str.slice(1)
      this.oosByTime = times => times.map(time => this.skuRow(time).classList.add('-oos'))
      this.getData = (detail, json) => detail.json_list.filter(datum => datum[json.key] === json.name)
      this.isItMyTime = (sku, time) => +new Date(sku.time) === parseInt(time)
      this.isPast = time => Date.now() > time && Date.now() > this.endTime(time)
      this.isFuture = (time, past) => past.indexOf(time) === -1
      this.displayCondition = (time, idx) => idx < this.TIME_SLOTS_TO_DISPLAY
      this.digit = (num, unit) => parseInt(num) !== 0 ? this.pad(num) + unit : ''
      this.isATab = el => el.classList.contains('-tab')
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

    additionalTimes(past_future_times) {
      var future = past_future_times.future
      var past = past_future_times.past
      var additional_times = this.addition(future, past)
      return future.length < this.TIME_SLOTS_TO_DISPLAY ? additional_times : []
    }

    addition(future, past) {
      var additional = []
      var remaining = this.TIME_SLOTS_TO_DISPLAY - future.length
      for (var i = remaining; i > -1; i--) {
        var end_idx = past.length - 1
        var idx = end_idx - i
        additional.push(past[idx])
      }
      return additional
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

    dayDiff(time) {
      var time_date = new Date(time).getDate()
      return new Date().getDate() - time_date
    }

    sameMonth(time) { return new Date(time).getMonth() === new Date().getMonth() }

    date(time) {  
      var day_diff = this.dayDiff(time)
      if (day_diff === 0 && this.sameMonth(time)) return this.capitalize('today')
      else if (day_diff === 1 && this.sameMonth(time)) return this.capitalize('yesterday')
      else if (day_diff === -1 && this.sameMonth(time)) return this.capitalize('tomorrow')
      else return this.fullDate(time)
    }

    fullDate(time) {
      var date = new Date(time)
      var mnth = date.toLocaleDateString("en-US", { month: 'short' })
      var day = date.toLocaleDateString("en-US", { weekday: 'short' })
      return day + ' ' + mnth + ' ' + date.getDate()
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
      return parseInt(price) == 0 ? 'PRIZE' : formatted
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
    
    platform() {
      var is_mobile = 'ontouchstart' in window
      var banner = is_mobile ? this.config[this.ID + '_mobile_banner'] : this.config[this.ID + '_desktop_banner']
      var live_link = is_mobile ? this.config[this.ID + '_deeplink'] : (this.domain.host + '/' + this.config.download_apps_page)
      return { banner, live_link }
    }

    show(parent) {
      this.image_observer = new feature_box.ImageObserver(parent)
      this.image_observer = null
      return this
    }
  }

  class Controller extends Util {
    constructor(json) {
      super(json)
      this.data = this.getData(json, { key: 'initiative', name: this.NAME })
      this.tandcs = this.getData(json, { key: 'type', name: this.TANDC })

      this.tandc_el = this.el('.-re.-rules')
      this.hiw_cta = document.querySelector('.-how-it-works')
      this.hiw_cta.addEventListener('click', this.toggleBanner.bind(this))
      this.top_banner = document.querySelector('.-banner.-top')

      this.tabs = new Tabs(json)
      this.sku_rows = new SKURows(json)
      this.state = new State(json)

      feature_box.subscribe(this.RESET, this.init.bind(this))

      this.init('from start')
      .setBanner()
      .displayTAndCs()
    }

    init(msg) {
      console.log('init', msg)
      var all_times = this.times(this.data)
      var past_future = this.pastAndFutureTimes(all_times)
      var additional_times = this.additionalTimes(past_future).filter(time => time !== undefined)
      var reordered_times = past_future.future.concat(additional_times)
      var grouped_skus = this.group(this.data, reordered_times)
      feature_box.emit(this.BUILD, { reordered_times, grouped_skus })
      return this
    }

    toggleBanner() {
      this.top_banner.classList.toggle('-show')
      var hiw_txt = this.hiw_cta.querySelector('.-txt')
      hiw_txt.textContent = hiw_txt.textContent === 'How It Works (T&Cs)' ? 'Close' : 'How It Works (T&Cs)'
    }

    setBanner() {
      var banner_img = this.el('.-banner.-top img.lazy-image')
      banner_img.setAttribute('data-src', this.platform().banner)
      return this
    }

    displayTAndCs() {
      this.tandc_el.innerHTML = this.tandcs.map(this.tandcHTML.bind(this)).join('')
      return this
    }

    tandcHTML(tandc) {
      return `<div class="-rule_element"><div class="-inlineblock -vatop -num">${tandc.sku}.</div><div class="-inlineblock -vatop -desc">${tandc.name}</div></div>`
    }
  }

  class Tabs extends Util {
    constructor(json) {
      super(json)
      this.tab_bounds = {}

      this.tabs = this.el('.-all-tabs')
      this.tabs_parent = this.el('.-tabs')
      this.prev = this.el('.-control.-prev')
      this.next = this.el('.-control.-next')

      feature_box.subscribe(this.BUILD, this.build.bind(this))
      this.tabs.addEventListener('click', this.tabListener.bind(this))
    }

    reset() {
      this.tab_bounds = {}
      this.tabs.innerHTML = ''
    }

    build(json) {
      this.reset()
      var times = json.reordered_times
      this.tabs.innerHTML = times
      .map(this.createTab.bind(this))
      .join('')

      times.map(this.tabBounds.bind(this))

      /** first tab */
      var first_tab = this.all('.-tab')[0]
      this.setTabProps(first_tab, this.FIRST_TAB)
      this.show(this.tabs);
      (feature_box.is_mobile === false) && this.scrollListener()
    }
    
    scrollListener() {
      this.next.addEventListener('click', this.scrollToNext.bind(this))
      this.prev.addEventListener('click', this.scrollToPrev.bind(this))
    }

    scrollToNext() {
      var start = this.tabs.scrollLeft + 50, end = this.tabs.scrollLeft + 300
      var delta = end - start;
      this.tabs.scrollLeft = start + delta * 1;
    }

    scrollToPrev() {
      var start = this.tabs.scrollLeft - 50, end = this.tabs.scrollLeft - 300
      var delta = end - start;
      this.tabs.scrollLeft = start + delta * 1;
    }

    tabListener(evt) {
      var parent = evt.target.parentElement
      this.isATab(parent) && this.setTabProps(parent, this.TAB_LISTENER)
    }

    setTabProps(el, by) {
      this.toggleClass(this.all('.-tab'), el, 'active')

      if(by == this.TAB_LISTENER)
        feature_box.emit(this.FOCUS, el.getAttribute('data-time'))
    }

    tabBounds(time, idx) {
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

      this.createSKUs = skus => skus.map(this.skuHTML.bind(this)).join('')
      this.skuHTML = sku => this.isAGroup(sku) ? this.groupHTML(sku) : this.singleHTML(sku)

      feature_box.subscribe(this.FOCUS, this.inFocus.bind(this))
      feature_box.subscribe(this.BUILD, this.display.bind(this))
    }

    reset() {
      this.row_bounds = {}
      this.skus_el.innerHTML = ''
    }

    inFocus(time) {
      var sku_rows = this.skuRows()
      var current_row = this.skuRow(time)
      this.toggleClass(sku_rows, current_row, 'active')
    }

    display(json) {
      this.reset()
      this.skus_el.innerHTML = json.grouped_skus
      .map(this.rowHTML.bind(this)).join('')

      /** first row */
      var first_time = this.all('.-sku_row')[0].getAttribute('data-time')
      this.inFocus(first_time)

      feature_box.emit(this.FOCUS, first_time)
      this.show(this.skus_el)
    }

    rowHTML(group, idx) {
      var skus_html = this.createSKUs(group.skus)
      return this.createRow(group, idx, skus_html)
    }

    groupHTML(sku) {
      
      return `<a href="${this.platform().live_link}" target="_blank" class="-sku -posrel -${sku.status}" id="${this.id(this.skuID(sku), '-')}"><div class="-img -posrel"><span class="-posabs -preloader -loading"></span><div class="-posabs -shadow"><span class="-posabs">sold out</span></div><img class="lazy-image" data-src="${sku.image}" alt="sku_img"/></div><div class="-details -posabs"><div class="-name">${sku.name.toString()}</div><div class="-prices"><div class="-price -new">${sku.fs_discount}</div></div></div><div class="-cta -posabs">download the app</div><div class="-tags -posabs">${this.badge(sku)}</div></a>`
    }

    singleHTML(sku) {
      var old_price = this.price(sku.barred_price)
      var new_price = this.price(sku.fs_price)
      var discount = this.discount(sku.barred_price, sku.fs_price)

      return `<a href="${this.platform().live_link}" target="_blank" class="-sku -posrel -${sku.status}" id="${this.id(this.skuID(sku), '-')}"><div class="-img -posrel"><span class="-posabs -preloader -loading"></span><div class="-posabs -shadow"><span class="-posabs">sold out</span></div><img class="lazy-image loaded" data-src="${sku.image}" alt="sku_img"/></div><div class="-details -posabs"><div class="-name">${sku.name}</div><div class="-prices"><div class="-price -new">${new_price}</div><div class="-price -old">${old_price}</div><div class="-discount">${discount}</div></div></div><div class="-cta -posabs">download the app</div><div class="-tags -posabs">${this.badge(sku)}</div></a>`
    }

    createRow(group, idx, skus_html) {
      var row_class = idx === 0 ? '-sku_row -posrel active' : '-sku_row -posrel'
      return `<div class="${row_class}" data-time="${group.time}">${skus_html}</div>`
    }
  }

  class State extends Util {
    constructor(json) {
      super(json)

      this.time_el = this.el('.-countdown-row .-time')

      this.sessionEnded = json => json.t <= 0 || json.session_state === this.AFTER_SESSION
      this.amIInSession = time => Date.now() >= time && Date.now() < this.endTime(time)
      this.amIPastSession = time => Date.now() > this.endTime(time)

      feature_box.subscribe(this.FOCUS, this.inFocus.bind(this))
    }

    inFocus(time) {
      var start_time = parseInt(time)
      var end_time = this.endTime(start_time)
      var session_state = this.sessionState(start_time)

      session_state === this.IN_SESSION && this.liveActions(start_time)
      var time_to_use = session_state === this.IN_SESSION ? end_time : start_time

      this.initializeClock({ session_state, time: time_to_use })
      this.markSoldSKUs()
    }

    markSoldSKUs() {
      var times = Array.from(this.all('.-sku_row'))
      .map(row => parseInt(row.getAttribute('data-time')))

      var past_times = this.pastAndFutureTimes(times).past
      this.oosByTime(past_times)
    }

    sessionState(start_time) {
      var session_state = ''
      var in_session = this.amIInSession(start_time)
      var past_session = this.amIPastSession(start_time)
      session_state = in_session ? this.IN_SESSION : ''
      session_state = past_session ? this.AFTER_SESSION : session_state
      return session_state === '' ? this.BTW_OR_B4_SESSION : session_state
    }

    liveActions(start_time) {
      var live_row = this.skuRow(start_time)
      var live_tab = this.tab(start_time)
      this.live([live_row, live_tab], 'add')
    }

    initializeClock(json) {
      clearInterval(this.time_interval)
      this.time_interval = setInterval(() => this.tick(json), 1000)
    }
    
    tick(json) {
      var rtime = this.remainingTime(json)
      rtime.session_state = json.session_state

      this.sessionEnded(rtime) && clearInterval(this.time_interval)
      this.updateClockUi(rtime)
    }

    updateClockUi(rtime) {
      var text = ''
      text = rtime.session_state === this.IN_SESSION ? 'Ends in ' : ''
      text = rtime.session_state === this.AFTER_SESSION ? 'Ended last ' : text
      text = rtime.session_state === this.BTW_OR_B4_SESSION ? 'Starts in ' : text

      var clock_digits = this.digits(rtime)
      var clock_text = clock_digits
      .filter(digit => digit !== '').join(' : ')
      this.time_el.innerHTML = text + clock_text
    }

    remainingTime(json) {
      var end_time = json.time
      var t = +new Date(end_time) - Date.now()
      t = this.sessionEnded(json) ? Date.now() - (+new Date(end_time)) : t

      var seconds = Math.floor((t / 1000) % 60)
      var minutes = Math.floor((t / 1000 / 60) % 60)
      var hours = Math.floor((t / (1000 * 60 * 60)) % 24)
      var days = Math.floor(t / (1000 * 60 * 60 * 24))
      var json = {t, days, hours, minutes, seconds }
  
      if (this.itIsEndTime(json))
        setTimeout(() => feature_box.emit(this.RESET, 'from reset'), 3000)
  
      return { t, days, hours, minutes, seconds }
    }

    itIsEndTime(json) {
      return json.days === 0 && json.hours === 0 &&
      json.minutes === 0 && json.seconds === 0
    }

    digits(t) {
      return t.days >= 1 ? [
        this.digit(t.days, 'd'),
        this.digit(t.hours, 'h'),
        this.digit(t.minutes, 'm')
      ] : [
        this.digit(t.hours, 'h'),
        this.digit(t.minutes, 'm'),
        this.digit(t.seconds, 's')
      ]
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
var feature_box = Featurebox({ id: gsheet_id, config: fb_config, element_id, name: 'spot_the_difference' })

feature_box.subscribe(feature_box.FETCHED_DATA, Begin)

