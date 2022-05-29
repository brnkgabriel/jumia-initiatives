var Begin = (function (data) {

  var pubsub = (function () {
    var events = {}
  
    function subscribe(eventName, fn) {
      events[eventName] = events[eventName] || []
      events[eventName].push(fn)
    }
  
    function unsubscribe(eventName, fn) {
      if (events[eventName]) {
        var idx = events[eventName].findIndex(fxn => fxn === fn)
        events[eventName].splice(idx, 1)
      }
    }
  
    function emit(eventName, data) {
      if (events[eventName]) { events[eventName].forEach(fn => fn(data)) }
    }
  
    return { subscribe, unsubscribe, emit }
  })()

  class Util {
    constructor(json) {
      this.pubsub = pubsub
      this.json = json
      this.FOCUS = 'focus'
      this.BUILD = 'build'
      this.RESET = 'reset'
      this.TAB_LISTENER = 'tab listener'
      this.TABBED = 'tabbed'
      this.FIRST_TAB = 'first tab'
      this.IN_SESSION = 'in session'
      this.AFTER_SESSION = 'after session'
      this.BTW_OR_B4_SESSION = 'between or before session'
      this.SET_STATE = 'set state'
      this.TABS_PER_PAGE = 6
      this.TIME_SLOTS_TO_DISPLAY = 12
      this. SEGMENT_COUNT = 8
      this.SKU_X_MARGIN = 4
      this.time_interval = null
      this.minute_duration = 1440

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

    pastAndFutureTimes(times) {
      var past = times.filter(this.isPast).sort((a, b) => a - b)
      var future = times.filter(time => this.isFuture(time, past)).sort((a, b) => a - b)
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

    timeFormat(time) {
      var t_units = this.timeUnits(time)
      var t = this.twelveHrFormat(t_units.hr, t_units.mn)
      return this.date(time) + "'s " + t + ' sale'
    }

    show(parent) {
      this.image_observer = new ImageObserver(parent)
      this.image_observer = null
    }
  }
  var wof = (function (symSegments) {
    const wheel = document.querySelector('.-wheel')
    const startButton = document.querySelector('.-spin-btn')
    const display = document.querySelector('.-display')
  
    let deg = 0;
    let zoneSize = 45
  
    const symbolSegments = symSegments
  
    const handleWin = (actualDeg) => {
      const winningSymbolNr = Math.ceil(actualDeg / zoneSize)
      display.innerHTML = symbolSegments[winningSymbolNr]
    }
  
    startButton.addEventListener('click', () => {
      /* Reset display */
      display.innerHTML = '-'
      /* Disable button during spin */
      startButton.style.pointerEvents = 'none'
      /* Calculate a new rotation between 5000 and 10,000 */
      deg = Math.floor(5000 + Math.random() * 5000)
      /* Set the transition on the wheel */
      wheel.style.transition = 'all 5s ease-out'
      wheel.style.transform = 'rotate(' + deg + 'deg)'
      /* Apply the blur */
      wheel.classList.add('-blur')
    })
  
    wheel.addEventListener('transitionend', () => {
      /* Remove blur */
      wheel.classList.remove('blur')
      /* Enable button when spin is over */
      startButton.style.pointerEvents = 'auto'
      /* Need to set transition to none as we want to rotate instantly */
      wheel.style.transition = 'none'
      /* Calculate degree on a 360 degree basis to get the "natural" real rotation
       Important because we want to start the next spin from that one
       Use modulus to get the rest value */
      const actualDeg = deg % 360
      /* Set the real rotation instantly without animation */
      wheel.style.transform = 'rotate(' + actualDeg + 'deg)'
      /* calculate and display the winning symbol */
      handleWin(actualDeg)
    })
  })

  class BuildWheel extends Util {
    constructor(json) {
      super(json)
      var wheel_el = this.el('.-wof_wheel')
      var wheel_data = this.wheel()
      wheel_el.innerHTML = wheel_data.html
      wof(wheel_data.segments)
    }
  
    wheel() {

      var sku_rows = Array.from(this.all('.-sku_row')).filter(el => {
        var start_time = parseInt(el.getAttribute('data-time')) 
        return Date.now() < this.endTime(start_time)
      })

      var active_row = sku_rows[0]
      var sku_els = active_row.querySelectorAll('.-sku') 

      var segs = []
      for (var i = 0; i < this.SEGMENT_COUNT; i++) {
        var seg_no = i + 1
        var sku = Array.from(sku_els).find(sku_el => parseInt(sku_el.getAttribute('data-segment')) == seg_no)
        if (sku) {
          segs.push({
            cl: '',
            image: sku.getAttribute('data-segment-image'),
            segment: seg_no,
            type: sku.getAttribute('data-type'),
            name: sku.querySelector('.-prize-name').textContent
          })
        } else {
          segs.push({
            cl: '-oops',
            image: 'https://ng.jumia.is/cms/0-1-initiatives/spin-win/skus/oops_3.png',
            segment: i + 1,
            type: 'oops',
            name: 'oops!! try again'
          })
        }
      }
  
      var html = this.topwrap() + this.segmentshtml(segs) + this.bottomwrap()
  
      var segments = {}
      segs.forEach(segment_obj => {
        segments[segment_obj.segment] = segment_obj.name
      })
  
      console.log('wheel & segments', { html, segments })
  
      return { html, segments }
    }
  
    topwrap() {
      return '<div class="-wheel-wrap -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/spin-win/marker.png" alt="marker" class="-wheel-marker -posabs" /><div class="-wheel -posrel"><svg height="0" width="0"><defs><clipPath id="segment_0deg"><path d="M -1.023305e-5,9.0154354e-7 V 150 L 106.06562,43.934327 A 149.99994,150 0 0 0 -1.023305e-5,9.0154354e-7 Z" /></clipPath></defs></svg>'
    }
  
    bottomwrap() {
      return ' <img src="https://ng.jumia.is/cms/0-1-initiatives/spin-win/wheel-frame.png" alt="wheel frame" class="-wheel-frame -posabs" /></div></div><img src="https://ng.jumia.is/cms/0-1-initiatives/spin-win/button.png" alt="spin button" class="-spin-btn" /><div class="-display">-</div>'
    }
  
    segmentshtml(list) {
      var html = '<div class="-segments -posabs">'
      list.map(segment => {
        html += this['seg' + segment.type](segment)
      })
      html += '</div>'
      return html
    }
  
    segvoucher(json) {
      var name = json.name.split(' ').join('<br/>')
      /** transform formula: -45n + 360 using arithmetic progression */
      var rotation = -45 * json.segment + 360
      
      return '<div class="-triangle -posabs" data-segment="' + json.segment + '" style="background-color:' + json.light_color + ';transform: rotate(' + rotation + 'deg)"><div class="-voucher -posabs">' + name + '</div><div class="-big-bag -posabs"></div><div class="-overlay -posabs"></div><img class="lazy-image" src="' + json.image + '" alt="image"/></div>'
    }
  
    segsku(json) {
      /** transform formula: -45n + 360 using arithmetic progression */
      var rotation = -45 * json.segment + 360
      return '<div class="-triangle -posabs ' + json.cl + '" data-segment="' + json.segment + '" style="transform: rotate(' + rotation + 'deg)"><img src="' + json.image + '" alt="image"/></div>'
    }
    
    segoops(json) {
      /** transform formula: -45n + 360 using arithmetic progression */
      var rotation = -45 * json.segment + 360
      return '<div class="-triangle -posabs ' + json.cl + '" data-segment="' + json.segment + '" style="transform: rotate(' + rotation + 'deg)"><div class="-try-again"><div>try</div><div>again</div></div></div>'
    }
  }
  var ImageObserver = (function (parent) {
    var query_from = parent || document
    var images = query_from.querySelectorAll('.lazy-image')
    var preloaders = query_from.querySelectorAll('.-preloader')
  
    var entities = Array.from(images).concat(Array.from(preloaders))
    var observer = null
  
    try {
      observer = new IntersectionObserver(onIntersection.bind(this), {})
      entities.forEach(imageObserve)
    } catch (error) {
      entities.forEach(lazyLoad)
    }
  
    function imageObserve(entity) {
      observer.observe(entity)
    }
  
    function lazyLoad(entity) {
      if (entity.src !== undefined) {
        entity.src = entity.getAttribute('data-src')
        entity.onload = () => afterLoad(entity)
      } else afterLoad(entity)
    }
  
    function afterLoad(entity) {
      entity.classList.add('loaded')
      removeLoader(entity)
    }
  
    function removeLoader(entity) {
      entity.classList.remove('-loading')
    }
  
    function onIntersection(image_entities) {
      image_entities.forEach(intersect)
    }
  
    function intersect(entity) {
      if (entity.isIntersecting) {
        observer.unobserve(entity.target)
        isImage(entity) ? imageIntersect(entity) : preloaderIntersect(entity)
      }
    }
  
    function isImage(entity) {
      return entity.target.dataset.src !== undefined
    }
  
    function imageIntersect(entity) {
      entity.target.src = entity.target.dataset.src
      entity.target.onload = () => afterLoad(entity.target)
    }
  
    function preloaderIntersect(entity) {
      removeLoader(entity.target)
    }
  })

  class Controller extends Util {
    constructor(json) {
      super(json)

      this.tandc_el = this.el('.-re.-rules')
      this.hiw_cta = document.querySelector('.-how-it-works')
      this.top_banner = document.querySelector('.-banner.-top')
      this.top_banner.addEventListener('click', this.toggleBanner.bind(this))
      this.back_to_top = document.querySelector('.-btt')
      this.back_to_top.addEventListener('click', () => window.scroll(0,0))

      this.tabs = new Tabs(json)
      this.sku_rows = new SKURows(json)
      this.state = new State(json)

      this.pubsub.subscribe(this.RESET, this.init.bind(this))
      

      this.init('from start')
      // .setBanner()
      .show()
    }

    init(msg) {
      console.log('init', msg)
      var sku_rows = this.all('.-sku_row')
      var all_times = Array.from(sku_rows)
      .map(el => parseFloat(el.getAttribute('data-time')))
      
      this.pubsub.emit(this.BUILD, all_times)
      return this
    }

    toggleBanner(evt) {
      var target = evt.target
      console.log('target is', target)
      var rules = document.querySelector('.-rules_eligibility .-re')
      if (target.classList.contains('-up')) this.up(rules)
      else if (target.classList.contains('-down')) this.down(rules)
      else this.openOrClose()
    }

    upOrDown() {
      var up = document.querySelector('.-control.-up')
      var down = document.querySelector('.-control.-down')
      var rules = document.querySelector('.-rules_eligibility .-re')

      console.log('target')
      up.addEventListener('click', evt => this.up(rules))
      down.addEventListener('click', evt => this.down(rules))
    }

    openOrClose() {
      this.top_banner.classList.toggle('-show')
      var hiw_txt = this.hiw_cta.querySelector('.-txt')
      hiw_txt.textContent = hiw_txt.textContent === 'Terms & Conditions' ? 'Close' : 'Terms & Conditions'
    }

    setBanner() {
      var banner_img = this.el('.-banner.-top img.lazy-image')
      banner_img.setAttribute('data-src', "")
      
      return this
    }
    
    up(rules) {
      var start = rules.scrollTop  - 20, end = rules.scrollTop - 50
      var delta = end - start;
      rules.scrollTop = start + delta * 1;
    }

    down(rules) {
      var start = rules.scrollTop + 20, end = rules.scrollTop + 50
      var delta = end - start;
      rules.scrollTop = start + delta * 1;
    }
  }

  class Tabs extends Util {
    constructor(json) {
      super(json)

      this.tabs = this.el('.-all-tabs')
      this.tabs_parent = this.el('.-tabs')

      this.pubsub.subscribe(this.BUILD, this.build.bind(this))
      this.tabs.addEventListener('click', this.tabListener.bind(this))
    }

    build(times) {
      var reordered_times = this.reorder(times)
      this.tabs.innerHTML = reordered_times
      .map(this.createTab.bind(this))
      .join('')
      /* times.map(this.tabBounds.bind(this)) */

      /** first tab */
      var first_tab = this.all('.-tab')[0]
      this.setTabProps(first_tab, this.FIRST_TAB)
      this.show(this.tabs)
    }

    createTab(time, idx) {
      var tab_class = idx === 0 ? '-tab active -inlineblock -posrel -vamiddle' : '-tab -inlineblock -posrel -vamiddle'
      var t_units = this.timeUnits(time)
      return '<div class="' + tab_class + '" data-time="' + time + '"><span class="-posabs -preloader -loading"></span><span class="-time">' + this.twelveHrFormat(t_units.hr, t_units.mn) + '</span><span>' + this.date(time) + '</span></div>'
    }

    tabListener(evt) {
      var parent = evt.target.parentElement
      this.isATab(parent) && this.setTabProps(parent, this.TAB_LISTENER)
    }

    setTabProps(el, by) {
      this.toggleClass(this.all('.-tab'), el, 'active')

      if(by == this.TAB_LISTENER)
        this.pubsub.emit(this.TABBED, el.getAttribute('data-time'))
    }
  }

  class SKURows extends Util {
    constructor(json) {
      super(json)

      this.json = json
      this.skus_el = this.el('.-skus')

      this.pubsub.subscribe(this.TABBED, this.inFocus.bind(this))
      this.pubsub.subscribe(this.BUILD, this.display.bind(this))
    }

    inFocus(time) {
      var sku_rows = this.skuRows()
      var current_row = this.skuRow(time)
      this.toggleClass(sku_rows, current_row, 'active')
    }

    display(times) {
      this.build_wheel = new BuildWheel(this.json)
      var next_time = this.pastAndFutureTimes(times).future[0]
      this.inFocus(next_time)

      this.pubsub.emit(this.FOCUS, next_time)
      this.show(this.skus_el)
    }
  }

  class State extends Util {
    constructor(json) {
      super(json)

      this.time_el = this.el('.-countdown-row .-time')

      this.sessionEnded = json => json.t <= 0 || json.session_state === this.AFTER_SESSION
      this.amIInSession = time => Date.now() >= time && Date.now() < this.endTime(time)
      this.amIPastSession = time => Date.now() > this.endTime(time)

      this.pubsub.subscribe(this.FOCUS, this.inFocus.bind(this))
      this.pubsub.subscribe(this.TABBED, this.processState.bind(this))
    }

    inFocus(time) {
      this.gone()
      this.processState(time)
    }

    processState(time) {
      var start_time = parseInt(time)
      var end_time = this.endTime(start_time)
      var session_state = this.sessionState(start_time)

      session_state === this.IN_SESSION && this.liveActions(start_time)
      var time_to_use = session_state === this.IN_SESSION ? end_time : start_time

      this.initializeClock({ session_state, time: time_to_use })
    }

    gone() {
      var times = Array.from(this.all('.-sku_row'))
      .map(row => parseInt(row.getAttribute('data-time')))

      var past_times = this.pastAndFutureTimes(times).past
      this.oosByTime(past_times)
      
      past_times.map(time => this.tab(time).classList.remove('active'))
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
      this.time_el.style.display = 'inline-block'
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
        setTimeout(() => this.pubsub.emit(this.RESET, 'from reset'), 3000)
  
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

// Begin()

var wrap = document.querySelector('.-wrap')
window.onmessage = function (e) {
  wrap.innerHTML = e.data
  Begin()
}