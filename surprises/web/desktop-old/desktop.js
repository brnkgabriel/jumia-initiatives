// class ImageObserver {
//   constructor(parent) {
//     var query_from = parent || document
//     this.images = query_from.querySelectorAll('.lazy-image')

//     this.observer = null

//     try {
//       this.observer = new IntersectionObserver(this.onIntersection.bind(this), {})
//       this.images.forEach(image => this.observer.observe(image))
//     } catch (error) {
//       this.images.forEach(image => this.lazyLoadImage(image))
//     }
//   }

//   lazyLoadImage(image) {
//     var self = this
//     if (!image.src) {
//       image.src = image.getAttribute('data-src')
//       image.onload = () => this.afterLoad(image, self)
//     } else this.afterLoad(image, self)
//   }

//   afterLoad(image, self) {
//     image.classList.add('loaded')
//     self.removeLoader(image)
//   }

//   removeLoader(image) {
//     var parent = image.parentElement
//     var preloader = parent.querySelector('.-preloader')
//     preloader && preloader.classList.remove('-loading')
//     var preloaders = document.querySelectorAll('.-preloader')
//     preloaders.forEach(preloader => preloader.classList.remove('-loading'))
//   }

//   onIntersection(image_entities) {
//     image_entities.forEach(image => {
//       if (image.isIntersecting) {
//         this.observer.unobserve(image.target)
//         image.target.src = image.target.dataset.src
//         image.target.onload = () => {
//           image.target.classList.add('loaded')
//           this.removeLoader(image.target)
//         }
//       }
//     })
//   }
// }

class Main {
  constructor(detail) {
    this.initiative_name = 'Flash Sale'
    this.initiative_tandc = 'Flash Sale T & C'
    this.data = this.getData(detail, { key: 'initiative', name: this.initiative_name })
    this.tandcs = this.getData(detail, { key: 'type', name: this.initiative_tandc })
    this.config = detail.config
    this.domain = detail.domain

    this.initiative = document.querySelector('#initiative')

    this.el = query => this.initiative.querySelector(query)
    this.all = query => this.initiative.querySelectorAll(query)

    this.currency = this.config.currency

    this.tab_bounds = {}

    this.time_interval = null
    this.minute_duration_flash_sale = parseInt(this.config.minute_duration_flash_sale)

    this.skus_el = this.el('.-skus')
    this.tabs = this.el('.-all-tabs')
    this.tabs_parent = this.el('.-tabs')
    this.starts_ends = this.el('.-starts_ends')
    this.tandc_el = this.el('.-re.-rules')

    this.pad = time => time.toString().length == 1 ? '0' + time : time
    this.endTime = time => time + (this.minute_duration_flash_sale * 60 * 1000)
    this.isAGroup = sku => sku.fs_price.length === 0
    this.skuRow = time => this.el('._row-' + time)
    this.initializeClock = end_time => this.time_interval = setInterval(() => {
      this.toUpdateClock(end_time)
    }, 1000);
    this.tab = time => this.el('.-t-' + time)
    this.live = (list, action) => list.forEach(each => each.classList[action]('-live'))
    this.skuID = sku => sku.name + '-' + (+new Date(sku.time))
    this.capitalize = str => str[0].toUpperCase() + str.slice(1)
    this.oosByTime = times => times.map(time => this.skuRow(time).classList.add('-oos'))

    this.past_future_times = []

    this.init()
  }

  getData(detail, json) {
    return detail.json_list.filter(datum => datum[json.key] === json.name)
  }

  init() {
    var times = this.times(this.data)
    var grouped = this.group(this.data, times)
    
    this.past_future_times = this.pastAndFutureTimes(times)
    var reordered_times = this.past_future_times['future'].concat(this.past_future_times['past'])

    this.displayTabs(reordered_times)
    this.displaySKUs(grouped)
    this.displayTAndCs()
    this.tabListeners()
    this.topBannerFxn()
    this.setState(times)
    this.show()
  }

  topBannerFxn() {
    var hiw_cta = document.querySelector('.-how-it-works')
    var hiw_txt = hiw_cta.querySelector('.-txt')
    var banner = document.querySelector('#initiative .-banner')
    hiw_cta.addEventListener('click', () => {
      banner.classList.toggle('-show')
      hiw_txt.textContent = hiw_txt.textContent === 'Terms & Conditions' ? 'Close' : 'Terms & Conditions'
    })
    var banner_img = banner.querySelector('img.lazy-image')
    banner_img.setAttribute('data-src', this.platform().banner)
  }

  displayTabs(times) {
    var html = ''
    times.map((time, idx) => html += this.createTab(time, idx))
    this.tabs.innerHTML = html
    times.map(time => {
      var tab = this.el('.-t-' + time)
      this.tab_bounds[time] = tab.getBoundingClientRect()
    })
    return this
  }

  createTab(time, idx) {
    var tab_class = idx === 0 ? '-tab active -inlineblock -posrel -vamiddle -t-' + time : '-tab -inlineblock -posrel -vamiddle -t-' + time
    var t_units = this.timeUnits(time)
    return `<a href="#top" class="${tab_class}" data-time="${time}"><span class="-time">${this.twelveHrFormat(t_units.hr, t_units.mn)}</span><span>${this.date(time)}</span></a>`
  }

  tabListeners() {
    var tabs = document.querySelectorAll('#initiative .-tabs .-tab')
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        var time = parseFloat(tab.getAttribute('data-time'))
        var sku_rows = this.all('.-sku_row')
        var sku_row = this.el('._row-' + time)
        this.removeAddActive(sku_rows, sku_row)
        this.removeAddActive(tabs, tab)
        this.show(sku_row)
      })
    })

    var prev = this.el('.-timer_tabs .-control.-prev')
    var next = this.el('.-timer_tabs .-control.-next')
    this.scrollListener(prev, next)
    this.showOrHideTabControls(prev, next, tabs)
    return this
  }

  showOrHideTabControls(prev, next, tabs) {
    var tab_count = tabs.length
    if (tab_count < 7) {
      prev.classList.add('-hide')
      next.classList.add('-hide')
    } else {
      prev.classList.remove('-hide')
      next.classList.remove('-hide')
    }
  }

  scrollListener(prev, next) {
    var tabs_p = this.el('.-timer_tabs .-tabs')
    next.addEventListener('click', (e) => {
      var start = tabs_p.scrollLeft + 50, end = tabs_p.scrollLeft + 300
      var delta = end - start;
      tabs_p.scrollLeft = start + delta * 1;
    })

    prev.addEventListener('click', (e) => {
      var start = tabs_p.scrollLeft - 50, end = tabs_p.scrollLeft - 300
      var delta = end - start;
      tabs_p.scrollLeft = start + delta * 1;
    })
  }

  timeFormat(time) {
    var t_units = this.timeUnits(time)
    var t = this.twelveHrFormat(t_units.hr, t_units.mn)
    return this.date(time) + "'s " + t + ' sale'
  }

  show(parent) {
    this.image_observer = new feature_box.ImageObserver(parent)
    this.image_observer = null
  }

  removeAddActive(to_remove, to_add) {
    to_remove.forEach(each => each.classList.remove('active'))
    to_add.classList.add('active')
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

  timeUnits(time) {
    var _date = new Date(time)
    var day = _date.getDay()
    var month = _date.getMonth()
    var date = _date.getDate()
    var hr = _date.getHours()
    var mn = _date.getMinutes()
    return { day, month, date, hr, mn }
  }

  displaySKUs(sku_groups) {
    this.skus_el.innerHTML = ''
    sku_groups.map((group, idx) => {
      var skus_html = this.createSKUs(group.skus)
      var sku_rows = this.createSKURow(group, idx, skus_html)
      this.skus_el.innerHTML += sku_rows
    })
  }

  displayTAndCs() {
    console.log('t&cs', this.tandcs)
    this.tandc_el.innerHTML = this.tandcs.map(tandc => {
      return `<div class="-rule_element"><div class="-inlineblock -vatop -num">${tandc.sku}.</div><div class="-inlineblock -vatop -desc">${tandc.name}</div></div>`
    }).join('')
  }

  createSKUs(skus) {
    var html = ''
    skus.map(sku => {
      html += this.isAGroup(sku) ? this.create(sku, 'group') : this.create(sku, 'single')
    })
    return html
  }

  create(sku, type) {
    var cta_txt = ''
    var old_price = this.price(sku.barred_price)
    var new_price = this.price(sku.fs_price)
    var discount = this.discount(sku.barred_price, sku.fs_price)
    if (type === 'group') {
      cta_txt = sku.type === 'Jumia Pay' ? 'buy now' : 'shop now'
      old_price = ''
      new_price = sku.fs_discount
      discount = ''
      var json = { old_price, new_price, discount, cta_txt, sku }
      return this.groupFS(json)
    } else {
      cta_txt = 'add to cart'
      var json = { old_price, new_price, discount, cta_txt, sku }
      return this.singleFS(json)
    }
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

  price(raw) {
    return raw.split('-').map(price => {
      var new_price_gt_0 = this.config.currency_position === 'prefix' ? this.config.currency + ' ' + parseInt(price).toLocaleString() : parseInt(price).toLocaleString() + ' ' + this.config.currency
      var new_price_lt_0 = 'FREE'
      return parseInt(price) === 0 ? new_price_lt_0 : new_price_gt_0
    }).join(' - ')
  }
  
  badge(sku) {
    var badge_id = this.id(sku.type, '_')
    var badge_icon = this.config[badge_id + '_icon']
    var badge_txt = sku.type === 'Generic' ? 'Limited Stock' : sku.type
    var badge = badge_icon ? `<img class="lazy-image" data-src="${badge_icon}" alt="sku_img"/>` : badge_txt
    var badge_el = badge_icon ? `<div class="-tag -inlineblock -vamiddle -b-img -${this.id(sku.type, '-')}">${badge}</div>` : `<div class="-tag -inlineblock -vamiddle -${this.id(sku.type, '-')}" style="background-color:${this.config[sku.type]}">${badge}</div>`
    return badge_el
  }

  groupFS(json) {
    return `<a href="${json.sku.pdp}" target="_blank" class="-sku -posrel -${json.sku.status}" id="${this.id(this.skuID(json.sku), '-')}"><div class="-img -posrel"><span class="-posabs -preloader -loading"></span><div class="-posabs -shadow"><span class="-posabs">sold out</span></div><img class="lazy-image" data-src="${json.sku.image}" alt="sku_img"/></div><div class="-details -posabs"><div class="-name">${json.sku.name}</div><div class="-prices"><div class="-price -new">${json.new_price}</div></div></div><div class="-cta -posabs">${json.cta_txt}</div><div class="-tags -posabs">${this.badge(json.sku)}</div></a>`
  }

  singleFS(json) {
    return `<a href="${json.sku.pdp}" target="_blank" class="-sku -posrel -${json.sku.status}" id="${this.id(this.skuID(json.sku), '-')}"><div class="-img -posrel"><span class="-posabs -preloader -loading"></span><div class="-posabs -shadow"><span class="-posabs">sold out</span></div><img class="lazy-image loaded" data-src="${json.sku.image}" alt="sku_img"/></div><div class="-details -posabs"><div class="-name">${json.sku.name}</div><div class="-prices"><div class="-price -new">${json.new_price}</div><div class="-price -old">${json.old_price}</div><div class="-discount -price">${json.discount}</div></div></div><div class="-cta -posabs">${json.cta_txt}</div><div class="-tags -posabs">${this.badge(json.sku)}</div></a>`
  }

  createSKURow(group, idx, skus_html) {
    var row_class = idx === 0 ? '-sku_row -posrel active _row-' + group.time : '-sku_row -posrel _row-' + group.time
    return `<div class="${row_class}" data-time="${group.time}"><div class="-title">${this.timeFormat(parseFloat(group.time))}</div>${skus_html}</div>`
  }

  setState(times) {
    this.gone()
    if (Date.now() < this.startEnd(times).start)
      this.b41stSession(times)
    else if (Date.now() > this.startEnd(times).end)
      this.afterLastSession()
    else
      this.inAndBtwSessions()
  }

  startEnd(times) {
    var start = times[0]
    var last = times[times.length - 1]
    var end = this.endTime(last)
    return { start, end }
  }

  b41stSession(times) {
    this.starts_ends.textContent = this.timeFormat(times[0]) + ' starts in'
    this.initializeClock(times[0])
    console.log('before 1st session')
  }

  afterLastSession() {
    var main_el = this.el('.-main-el')
    main_el.classList.add('-hide')
    console.log('after last session')
  }

  inAndBtwSessions() {
    console.log('in and between session')
    var next_time = this.past_future_times.future[0]
    
    var session_cond = Date.now() >= next_time && Date.now() < this.endTime(next_time)

    session_cond ? this.inSession(next_time) : this.btwSession(next_time)
  }

  inSession(time) {
    var live_row = this.skuRow(time)
    var live_tab = this.tab(time)
    var end_time = this.endTime(time)

    this.live([live_row, live_tab], 'add')

    this.initializeClock(end_time)

    this.starts_ends.textContent = this.timeFormat(time) + ' ends in'

    console.log('in session', new Date(time))
  }

  btwSession(time) {
    this.initializeClock(time)
    this.starts_ends.textContent = this.timeFormat(time) + ' starts in'
    console.log('between session', new Date(time))
  }

  gone() {
    var split_times = this.past_future_times
    this.oosByTime(split_times.past)
    if (split_times.future.length > 0) {this.reLabelActiveTabRow(split_times.future) }
  }

  reLabelActiveTabRow(times) {
    var tabs = this.all('#initiative .-tab')
    var next_tab = this.el('.-tab.-t-' + times[0])
    var sku_rows = this.all('.-sku_row')
    var next_row = this.el('._row-' + times[0])
    this.removeAddActive(tabs, next_tab)
    this.removeAddActive(sku_rows, next_row)
  }

  pastAndFutureTimes(times) {
    var past = times.filter(time => Date.now() > time && Date.now() > this.endTime(time))
    var future = times.filter(time => past.indexOf(time) === -1)
    return { past, future }
  }

  times(skus) {
    var times = skus.map(sku => +new Date(sku.time))
    var unique_times = Array.from(new Set(times))
    return unique_times.sort((a, b) => a - b)
  }

  group(skus, times) {
    return times.map(time => {
      var skus_in_time = skus.filter(sku => +new Date(sku.time) === parseInt(time))
      return { time, skus: skus_in_time }
    })
  }

  digit(digit, unit) {
    return parseInt(digit) !== 0 ? this.wrapWith(this.pad(digit), 'span') + this.wrapWith(unit, 'sub') : ''
  }

  updateClock(t) {
    var clock = this.el('#clock .-clock_element')
    clock.innerHTML = [
      this.digit(t.days, 'day(s)'),
      this.digit(t.hours, 'hour(s)'),
      this.digit(t.minutes, 'minute(s)'),
      this.digit(t.seconds, 'second(s)')
    ].filter(digit => digit !== '')
    .join(' ')
    /**.filter(digit => parseInt(digit) > 0).join(' ') */
  }

  wrapWith(to_wrap, tag) {
    return '<' + tag + ' class="-inlineblock -vabaseline">' + to_wrap + '</' + tag + '>'
  }

  toUpdateClock(end_time) {
    var t = this.remainingTime(end_time)
    this.updateClock(t)
    if (t.t <= 0) { clearInterval(this.time_interval) }
  }

  remainingTime(endTime) {
    var t = +new Date(endTime) - Date.now()
    var seconds = Math.floor((t / 1000) % 60)
    var minutes = Math.floor((t / 1000 / 60) % 60)
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24)
    var days = Math.floor(t / (1000 * 60 * 60 * 24))

    if (
      days === 0 && hours === 0 &&
      minutes === 0 && seconds === 0
    ) { setTimeout(() => {
      /** replace location.reload() with this.reset() */
      location.reload()
    }, 1000); }

    return { t, days, hours, minutes, seconds }
  }
  
  discount(_old, _new) {
    var diff = parseInt(_old) - parseInt(_new)
    var ratio = diff * 100 / parseInt(_old)
    if (!isNaN(ratio)) return '-' + Math.round(ratio) + '%'
  }

  platform() {
    var is_mobile = 'ontouchstart' in window
    var banner = is_mobile ? this.config.flash_sale_mobile_banner : this.config.flash_sale_desktop_banner
    var live_link = is_mobile ? this.config.flashsale_deeplink : (this.domain.host + '/' + this.config.download_apps_page)
    return { banner, live_link }
  }
}

class PreProcess {
  constructor() {
    this.featurebox = document.getElementById('feature-box')
    this.body = document.querySelector('body')
    this.start = Date.now()

    this.listeners()
  }

  appendPreloaders() {
    var header = document.querySelector('.osh-container.header-main')

    header.classList.add('-posrel')
    var span = document.createElement('span')
    span.className = "-posabs -preloader -loading"
    header.prepend(span)
  }

  listeners() {
    this.featurebox.addEventListener('load', () => {
      var main = document.querySelector('body main')
      
      this.featurebox.contentWindow.page_location = location
      var featurebox_document = this.featurebox.contentWindow.document
      
      var featurebox_styles = featurebox_document.getElementById('feature-box-styles')
      var featurebox_html = featurebox_document.getElementById('feature-box-html')
      var featurebox_script = featurebox_document.getElementById('feature-box-script')
      var mlp_transform = featurebox_document.getElementById('mlp-transform')
      
      main.appendChild(mlp_transform)
      main.appendChild(featurebox_styles)

      this.appendPreloaders()

      this.cartSectionAdjustments()
      
      window.document.addEventListener('pageloaded', evt => {
        var detail = evt.detail
        if (detail.config.display_feature_box === 'no') {
          this.featurebox.style.display = 'none'
          this.body.classList.add('-page-loaded')
        } else {
          main.appendChild(featurebox_html)
          main.appendChild(featurebox_script)
          var header = featurebox_html.querySelector('.-header')
          var interval = setInterval(() => {
            if (!header.classList.contains('-fetch-loading')) {
              this.body.classList.add('-page-loaded')
              clearInterval(interval)
            }
          }, 100);
        }
        console.log('from pageloaded evt.detail', evt.detail, Date.now() - this.start)
      })
    })

    window.document.addEventListener('dataimported', evt => {
      console.log('from dataimported evt.detail', evt.detail, Date.now() - this.start)
      new Main(evt.detail)
    })
  }

  cartSectionAdjustments() {
    var actions = document.querySelector('.header-main>.actions')
    var cart = document.getElementById('cart')
    var account = document.getElementById('account')
    var help = document.getElementById('help')

    actions.innerHTML = ''
    actions.appendChild(account)
    actions.appendChild(help)
    actions.appendChild(cart)

    var search_bar = document.querySelector('.osh-search-bar')
    var search_btn = document.getElementById('header-search-submit')
    var search_fld = document.querySelector('.osh-search-bar>.field-panel')

    search_bar.innerHTML = ''
    search_bar.appendChild(search_fld)
    search_bar.appendChild(search_btn)

    var hello = document.querySelector('#account.osh-dropdown .label')
    var tc = hello.textContent
    hello.innerHTML = tc === 'Your' ? '<icon></icon><txt>Your</txt>' : '<icon></icon><txt>Hi,</txt>'

    var help_label = document.querySelector('#help.osh-dropdown .label')
    help_label.innerHTML = ''
  }
}

new PreProcess()


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

feature_box.subscribe(feature_box.FETCHED_DATA, data => new Main(data))
