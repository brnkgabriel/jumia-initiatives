class Tag {
  constructor(properties) {
    this.tag = properties[0]
    this.attributes = properties[1]
    this.styles = properties[2]
    this.textContent = properties[3]
    this.element = null
  }

  get() {
    return this.init()
      .setAttributes()
      .setStyle()
      .setHTML()
      .getElement()
  }

  init() {
    this.element = document.createElement(this.tag)
    return this
  }

  static create(properties) {
    return new Tag(properties).get()
  }

  assignAttribute(object) {
    var keys = Object.keys(object)
    keys.forEach(key => {
      var value = object[key]
      this.element.setAttribute(key, value)
    })
  }

  setAttributes() {
    this.assignAttribute(this.attributes)
    return this
  }

  setStyle() {
    this.assignAttribute(this.styles)
    return this
  }

  setHTML() {
    this.element.innerHTML = this.textContent
    return this
  }

  getElement() {
    return this.element
  }

  static appendMany2One(many, one) {
    many.forEach(each => one.appendChild(each))
  }
}

class Calendar {
  constructor() {
    this.calendar = document.querySelector('.-calendar')

    this.popup_papa = document.querySelector('.-m-popups')
    this.campaign_month = 'November 01 2020 01:00:00 GMT+0100'

    this.dy = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    this.months = [
      'january', 'february', 'march',
      'april', 'may', 'june', 'july',
      'august', 'september', 'october',
      'november', 'december'
    ]
    this.GMT = 'GMT+0100'

    this.today = new Date().getDate()

    this.initiatives = {
      'black friday (Up to 80% Off)': {
        dates: [
          'November 06 2020 00:00:00 GMT+0100',
          'November 07 2020 00:00:00 GMT+0100',
          'November 08 2020 00:00:00 GMT+0100',
          'November 09 2020 00:00:00 GMT+0100',
          'November 10 2020 00:00:00 GMT+0100',
          'November 11 2020 00:00:00 GMT+0100',
          'November 12 2020 00:00:00 GMT+0100',
          'November 13 2020 00:00:00 GMT+0100',
          'November 14 2020 00:00:00 GMT+0100',
          'November 15 2020 00:00:00 GMT+0100',
          'November 16 2020 00:00:00 GMT+0100',
          'November 17 2020 00:00:00 GMT+0100',
          'November 18 2020 00:00:00 GMT+0100',
          'November 19 2020 00:00:00 GMT+0100',
          'November 20 2020 00:00:00 GMT+0100',
          'November 21 2020 00:00:00 GMT+0100',
          'November 22 2020 00:00:00 GMT+0100',
          'November 23 2020 00:00:00 GMT+0100',
          'November 24 2020 00:00:00 GMT+0100',
          'November 25 2020 00:00:00 GMT+0100',
          'November 26 2020 00:00:00 GMT+0100',
          'November 27 2020 00:00:00 GMT+0100',
          'November 28 2020 00:00:00 GMT+0100',
          'November 29 2020 00:00:00 GMT+0100',
          'November 30 2020 00:00:00 GMT+0100',
          'December 01 2020 00:00:00 GMT+0100',
          'December 02 2020 00:00:00 GMT+0100'
        ],
        link: 'https://www.jumia.com.ng/mlp-black-friday/'
      },
      'wheel of fortune': {
        dates: [
          'November 09 2020 12:00:00 GMT+0100',
          'November 16 2020 12:00:00 GMT+0100',
          'November 23 2020 12:00:00 GMT+0100',
          'November 30 2020 12:00:00 GMT+0100',
          'November 12 2020 12:00:00 GMT+0100',
          'November 19 2020 12:00:00 GMT+0100',
          'November 26 2020 12:00:00 GMT+0100'
        ],
        link: 'https://www.jumia.com.ng/wheel-fortune/'
      },
      '₦100 sale': {
        dates: [
          'November 08 2020 12:00:00 GMT+0100',
          'November 15 2020 12:00:00 GMT+0100',
          'November 22 2020 12:00:00 GMT+0100',
          'November 29 2020 12:00:00 GMT+0100'
        ],
        link: 'https://www.jumia.com.ng/mlp-last-price/'
      },
      'treasure hunt': {
        dates: [
          'November 06 2020 00:00:00 GMT+0100',
          'November 06 2020 18:00:00 GMT+0100',
          'November 13 2020 00:00:00 GMT+0100',
          'November 13 2020 18:00:00 GMT+0100',
          'November 20 2020 00:00:00 GMT+0100',
          'November 20 2020 18:00:00 GMT+0100',
          'November 27 2020 00:00:00 GMT+0100',
          'November 27 2020 18:00:00 GMT+0100'
        ],
        link: 'https://www.jumia.com.ng/sp-treasure-hunt-app/'
      },
      'live flash sale': {
        dates: [
          'November 11 2020 14:00:00 GMT+0100',
          'November 18 2020 14:00:00 GMT+0100',
          'November 25 2020 14:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/sp-live-giveaways-app/'
      },
      'daily flash sales': {
        dates: [
          'November 06 2020 00:00:00 GMT+0100',
          'November 06 2020 10:00:00 GMT+0100',
          'November 06 2020 12:00:00 GMT+0100',
          'November 06 2020 14:00:00 GMT+0100',
          'November 06 2020 16:00:00 GMT+0100',
          'November 06 2020 18:00:00 GMT+0100',

          'November 09 2020 10:00:00 GMT+0100',
          'November 09 2020 12:00:00 GMT+0100',
          'November 09 2020 14:00:00 GMT+0100',
          'November 09 2020 16:00:00 GMT+0100',

          'November 10 2020 10:00:00 GMT+0100',
          'November 10 2020 12:00:00 GMT+0100',
          'November 10 2020 14:00:00 GMT+0100',
          'November 10 2020 16:00:00 GMT+0100',

          'November 11 2020 10:00:00 GMT+0100',
          'November 11 2020 12:00:00 GMT+0100',
          'November 11 2020 14:00:00 GMT+0100',
          'November 11 2020 16:00:00 GMT+0100',

          'November 12 2020 10:00:00 GMT+0100',
          'November 12 2020 12:00:00 GMT+0100',
          'November 12 2020 14:00:00 GMT+0100',
          'November 12 2020 16:00:00 GMT+0100',

          'November 13 2020 00:00:00 GMT+0100',
          'November 13 2020 10:00:00 GMT+0100',
          'November 13 2020 12:00:00 GMT+0100',
          'November 13 2020 14:00:00 GMT+0100',
          'November 13 2020 16:00:00 GMT+0100',
          'November 13 2020 18:00:00 GMT+0100',

          'November 16 2020 10:00:00 GMT+0100',
          'November 16 2020 12:00:00 GMT+0100',
          'November 16 2020 14:00:00 GMT+0100',
          'November 16 2020 16:00:00 GMT+0100',

          'November 17 2020 10:00:00 GMT+0100',
          'November 17 2020 12:00:00 GMT+0100',
          'November 17 2020 14:00:00 GMT+0100',
          'November 17 2020 16:00:00 GMT+0100',

          'November 18 2020 10:00:00 GMT+0100',
          'November 18 2020 12:00:00 GMT+0100',
          'November 18 2020 14:00:00 GMT+0100',
          'November 18 2020 16:00:00 GMT+0100',

          'November 19 2020 10:00:00 GMT+0100',
          'November 19 2020 12:00:00 GMT+0100',
          'November 19 2020 14:00:00 GMT+0100',
          'November 19 2020 16:00:00 GMT+0100',


          'November 20 2020 00:00:00 GMT+0100',
          'November 20 2020 10:00:00 GMT+0100',
          'November 20 2020 12:00:00 GMT+0100',
          'November 20 2020 14:00:00 GMT+0100',
          'November 20 2020 16:00:00 GMT+0100',
          'November 20 2020 18:00:00 GMT+0100',

          'November 23 2020 10:00:00 GMT+0100',
          'November 23 2020 12:00:00 GMT+0100',
          'November 23 2020 14:00:00 GMT+0100',
          'November 23 2020 16:00:00 GMT+0100',

          'November 24 2020 10:00:00 GMT+0100',
          'November 24 2020 12:00:00 GMT+0100',
          'November 24 2020 14:00:00 GMT+0100',
          'November 24 2020 16:00:00 GMT+0100',

          'November 25 2020 10:00:00 GMT+0100',
          'November 25 2020 12:00:00 GMT+0100',
          'November 25 2020 14:00:00 GMT+0100',
          'November 25 2020 16:00:00 GMT+0100',

          'November 26 2020 10:00:00 GMT+0100',
          'November 26 2020 12:00:00 GMT+0100',
          'November 26 2020 14:00:00 GMT+0100',
          'November 26 2020 16:00:00 GMT+0100',

          'November 27 2020 00:00:00 GMT+0100',
          'November 27 2020 10:00:00 GMT+0100',
          'November 27 2020 12:00:00 GMT+0100',
          'November 27 2020 14:00:00 GMT+0100',
          'November 27 2020 16:00:00 GMT+0100',
          'November 27 2020 18:00:00 GMT+0100',

          'November 30 2020 10:00:00 GMT+0100',
          'November 30 2020 12:00:00 GMT+0100',
          'November 30 2020 14:00:00 GMT+0100',
          'November 30 2020 16:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/sp-flashsales-app/'
      },
      'prime flash sale': {
        dates: [
          'November 06 2020 14:00:00 GMT+0100',
          'November 09 2020 14:00:00 GMT+0100',
          'November 10 2020 14:00:00 GMT+0100',
          'November 11 2020 14:00:00 GMT+0100',
          'November 12 2020 14:00:00 GMT+0100',
          'November 13 2020 14:00:00 GMT+0100',
          'November 16 2020 14:00:00 GMT+0100',
          'November 17 2020 14:00:00 GMT+0100',
          'November 18 2020 14:00:00 GMT+0100',
          'November 19 2020 14:00:00 GMT+0100',
          'November 20 2020 14:00:00 GMT+0100',
          'November 23 2020 14:00:00 GMT+0100',
          'November 24 2020 14:00:00 GMT+0100',
          'November 25 2020 14:00:00 GMT+0100',
          'November 26 2020 14:00:00 GMT+0100',
          'November 27 2020 14:00:00 GMT+0100',
          'November 30 2020 14:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/sp-flashsales-app/'
      },
      'shake & win': {
        dates: [
          'November 01 2020 00:00:00 GMT+0100',
          'November 02 2020 00:00:00 GMT+0100',
          'November 03 2020 00:00:00 GMT+0100',
          'November 04 2020 00:00:00 GMT+0100',
          'November 05 2020 00:00:00 GMT+0100'
        ],
        link: 'https://www.jumia.com.ng/mlp-shake-and-win/'
      },
      'stanbic cashback': {
        dates: [
          'November 06 2020 00:00:00 GMT+0100',
          'November 09 2020 00:00:00 GMT+0100',
          'November 10 2020 00:00:00 GMT+0100',
          'November 11 2020 00:00:00 GMT+0100',
          'November 12 2020 00:00:00 GMT+0100',
          'November 13 2020 00:00:00 GMT+0100',
          'November 16 2020 00:00:00 GMT+0100',
          'November 17 2020 00:00:00 GMT+0100',
          'November 18 2020 00:00:00 GMT+0100',
          'November 19 2020 00:00:00 GMT+0100',
          'November 20 2020 00:00:00 GMT+0100',
          'November 23 2020 00:00:00 GMT+0100',
          'November 24 2020 00:00:00 GMT+0100',
          'November 25 2020 00:00:00 GMT+0100',
          'November 26 2020 00:00:00 GMT+0100',
          'November 27 2020 00:00:00 GMT+0100',
          'November 30 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-stanbic-offer/'
      },
      'samsung brand day': {
        dates: [
          'November 09 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-samsung-store'
      },
      'unilever brand day': {
        dates: [
          'November 10 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-unilever-store'
      },
      'oppo brand day': {
        dates: [
          'November 11 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-oppo-store'
      },
      'michelin brand day': {
        dates: [
          'November 14 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-michelin-store'
      },
      'intel brand day': {
        dates: [
          'November 16 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-intel-store'
      },
      'reckitt benckiser brand day': {
        dates: [
          'November 17 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-reckitt-benckiser-store'
      },
      'umidigi brand day': {
        dates: [
          'November 18 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-umidigi-store'
      },
      'absolut brand day': {
        dates: [
          'November 21 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-absolut-store'
      },
      'scanfrost brand day': {
        dates: [
          'November 23 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-scanfrost-store'
      },
      'nexus brand day': {
        dates: [
          'November 24 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-nexus-store'
      },
      'xiaomi brand day': {
        dates: [
          'November 25 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-xiaomi-store'
      },
      'lloyd brand day': {
        dates: [
          'November 28 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-lloyd-store'
      },
      'skyrun brand day': {
        dates: [
          'December 01 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-skyrun-store/'
      },
      'deFacto brand day': {
        dates: [
          'December 02 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-defacto-store'
      },
    }

    this.days_in_wk = 7
    this.fridays = 6
    this.days = {}

    this.scrollUp = document.querySelector('.-control.-up')
    this.scrollDown = document.querySelector('.-control.-down')
    this.toScroll = document.querySelector('#fri-6 .-items')

    this.init()

  }

  init() {
    this.datesInMonth().build().listen().scrollByButtons().set()
    return this
  }

  set() {
    var month = new Date().getMonth()
    var monthStr = this.months[month].substr(0, 3)
    var date = this.today
    var id = monthStr + '-' + date
    var popups = document.querySelectorAll('.-m-popup')
    var popup = document.getElementById(id)
    popups.forEach(popup => popup.classList.remove('active'))
    popup.classList.add('active')
  }

  listen() {
    var cols = document.querySelectorAll('.-calendar .-c-row:not(.-head) .-c-col')
    cols.forEach(col => {
      col.addEventListener('click', () => {
        var popups = document.querySelectorAll('.-m-popup')
        var id = col.getAttribute('id')
        var popup = document.querySelector('.-m-popup#' + id)

        popups.forEach(popup => popup.classList.remove('active'))
        popup.classList.add('active')

        this.toScroll = popup.querySelector('.-items')
      })
    })
    return this
  }

  build() {
    var row = ''
    Object.keys(this.days).map((key, idx) => {
      if (idx % 7 === 0) {
        row = Tag.create(['div', { class: '-c-row' }, '', ''])
      }
      row.appendChild(this.column(key, idx))
      this.calendar.appendChild(row)
      this.popup_papa.appendChild(this.popup(key, idx))
    })
    return this
  }

  popup(time, idx) {
    var friNo = 0
    var day = new Date(time).getDay();
    (day == 5) && (friNo = Math.round(idx / (day + 1)))
    var month = this.months[new Date(time).getMonth()].substr(0, 3)

    var prop = {
      popup: ['div', { class: '-m-popup -posabs', id: month + '-' + (idx + 1) }, '', ''],
      topItem: ['div', { class: '-top-item' }, '', ''],
      day: ['div', { class: '-day' }, '', this.dy[day]],
      date: ['div', { class: '-date' }, '', idx + 1],
      month: ['div', { class: day == 5 ? '-month -friday-' + friNo : '-month' }, '', month],
      items: ['div', { class: '-items' }, '', '']
    }

    var popup = Tag.create(prop['popup'])
    var topItem = Tag.create(prop['topItem'])
    var dayEl = Tag.create(prop['day'])
    var date = Tag.create(prop['date'])
    var month = Tag.create(prop['month'])
    var items = Tag.create(prop['items'])
    var itemsList = this.getItems(this.findInitiatives(time))

    Tag.appendMany2One([dayEl, date, month], topItem)
    Tag.appendMany2One(itemsList, items)
    Tag.appendMany2One([topItem, items], popup)

    return popup
  }

  column(time, idx) {
    var friNo = 0, colClass = ''
    var day = new Date(time).getDay();
    if (day == 5) {
      friNo = Math.round(idx / (day + 1))
      colClass = (this.today == (idx + 1)) ? '-c-col -today' : '-c-col -friday-' + friNo
    } else {
      colClass = (this.today == (idx + 1)) ? '-c-col -today' : '-c-col'
    }

    var month = this.months[new Date(time).getMonth()].substr(0, 3)
    var prop = {
      col: ['div', { class: colClass, id: month + '-' + (idx + 1), 'data-time': time }, '', ''],
      mon: ['div', { class: '-month' }, '', month],
      items: ['div', { class: '-items' }, '', ''],
      base: ['div', { class: '-base' }, '', ''],
      date: ['div', { class: '-date' }, '', idx + 1]
    }
    var col = Tag.create(prop['col'])
    var mon = Tag.create(prop['mon'])
    var items = Tag.create(prop['items'])
    var base = Tag.create(prop['base'])
    var date = Tag.create(prop['date'])

    base.appendChild(date)
    Tag.appendMany2One([mon, base], col)
    return col
  }

  AMPM(time) {
    var date = new Date(time)
    var hr = date.getHours()
    var mn = date.getMinutes()
    return this.twelveHrFormat(hr, mn)
  }

  pad(time) { return ('0' + time).slice(-2) }

  twelveHrFormat(hr, min) {
    if (hr === 12) return this.pad(hr) + ':' + this.pad(min) + 'pm'
    else if (hr > 12) return this.pad(hr - 12) + ':' + this.pad(min) + 'pm'
    else if (hr === 0) return '12:' + this.pad(min) + 'am'
    else return this.pad(hr) + ':' + this.pad(min) + 'am'
  }

  getItems(initiatives) {
    var items = []
    initiatives.map(init => {
      var prop = {
        item: ['a', { class: '-item', href: init.link }, '', ''],
        time: ['div', { class: '-time -inlineblock -vamiddle' }, '', ''],
        icn: ['span', { class: '-icn' }, '', ''],
        txt: ['span', { class: '-txt' }, '', this.AMPM(init.time)],
        engagement: ['div', { class: '-engagement -inlineblock -vamiddle' }, '', init.name]
      }
      var item = Tag.create(prop['item'])
      var time = Tag.create(prop['time'])
      var icn = Tag.create(prop['icn'])
      var txt = Tag.create(prop['txt'])
      var engagement = Tag.create(prop['engagement'])

      Tag.appendMany2One([icn, txt], time)
      Tag.appendMany2One([time, engagement], item)
      items.push(item)
    })
    return items
  }

  findInitiatives(time) {
    var agenda = []
    var date = new Date(time).getDate()
    var mnth = new Date(time).getMonth()
    Object.keys(this.initiatives).map(key => {
      var initiative = this.initiatives[key]
      for (var i = 0; i < initiative.dates.length; i++) {
        var loopTime = initiative.dates[i]
        var loopDate = new Date(loopTime).getDate()
        var loopMnth = new Date(loopTime).getMonth()
        if (date === loopDate && mnth === loopMnth) {
          agenda.push({ link: initiative.link, time: loopTime, name: key })
        }
      }
    })
    agenda.sort((a, b) => +new Date(a.time) - +new Date(b.time))
    return agenda
  }

  datesInMonth() {
    var today = new Date(this.campaign_month)
    var month = today.getMonth() + 1
    var end = new Date(today.getFullYear(), month, 0).getDate()

    for (var i = 1; i <= end; i++) {
      this.days[this.format(today, i)] = {}
    }
    return this
  }

  format(today, i) {
    var monthStr = this.months[today.getMonth()]
    return `${monthStr} ${i < 10 ? '0' + i : i} ${today.getFullYear()} 00:00:00 ${this.GMT}`
  }
  
  scrollByButtons () {
    var self = this
    this.scrollUp.addEventListener('click', function () {
      
      var start = self.toScroll.scrollTop - 20, end = self.toScroll.scrollTop - 50
      self.tween(start, end, 500, self.easeOutQuart, self.toScroll, 'Top');
    });
    this.scrollDown.addEventListener('click', function () {
      var start = self.toScroll.scrollTop + 20, end = self.toScroll.scrollTop + 50
      self.tween(start, end, 500, self.easeOutQuart, self.toScroll, 'Top');
    })
    return this
  }
  easeOutQuart(x, t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  }
  tween(start, end, duration, easing, w, type) {
    var delta = end - start;
    var startTime;
    if (window.performance && window.performance.now) { startTime = performance.now(); }
    else if (Date.now) { startTime = Date.now() }
    else { startTime = new Date().getTime() }

    var tweenLoop = function (time) {
      var t = (!time ? 0 : time - startTime);
      var factor = easing(null, t, 0, 1, duration);
      w['scroll' + type] = start + delta * factor;
      if (t < duration && w['scroll' + type] != end)
        requestAnimationFrame(tweenLoop);
    }
    tweenLoop();
  }
}

new Calendar()