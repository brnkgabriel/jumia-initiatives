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
    this.popup_day = document.querySelector('.-m-popup .-day')
    this.popup_dat = document.querySelector('.-m-popup .-date')
    this.popup_mnt = document.querySelector('.-m-popup .-month')
    this.popup_itm = document.querySelector('.-m-popup .-items')

    this.dy = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    this.months = [
      'january', 'february', 'march',
      'april', 'may', 'june', 'july',
      'august', 'september', 'october',
      'november', 'december'
    ]
    this.GMT = 'GMT+0100'
    this.today = new Date()

    this.initiatives = {
      'black friday deals': {
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
          'November 07 2020 12:00:00 GMT+0100',
          'November 14 2020 12:00:00 GMT+0100',
          'November 21 2020 12:00:00 GMT+0100',
          'November 28 2020 12:00:00 GMT+0100'
        ],
        link: 'https://www.jumia.com.ng/sp-n100-sale-app/'
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
          'November 21 2020 00:00:00 GMT+0100',
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
          'November 11 2020 00:00:00 GMT+0100',
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
          'November 16 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-scanfrost-store'
      },
      'nexus brand day': {
        dates: [
          'November 25 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-nexus-store'
      },
      'xiaomi brand day': {
        dates: [
          'November 24 2020 00:00:00 GMT+0100',
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
      'DeFacto brand day': {
        dates: [
          'November 23 2020 00:00:00 GMT+0100',
        ],
        link: 'https://www.jumia.com.ng/mlp-defacto-store'
      },
    }

    this.cols = null

    this.days_in_wk = 7
    this.fridays = 6
    this.days = {}

    this.init()
  }

  init() {

    this.datesInMonth().build().listen().set()
    // this.calendar.addEventListener('click', evt => this.update(evt))
    return this
  }

  listen() {
    this.cols = document.querySelectorAll('.-calendar .-c-row:not(.-head) .-c-col')
    this.cols.forEach((col, idx) => col.addEventListener('click', evt => this.update(evt, col, idx)))
    return this
  }

  set() {
    var month = this.months[this.today.getMonth()]
    var date = this.today.getDate()
    date = date.toString().length == 1 ? '0' + date : date
    var year = this.today.getFullYear()
    var todayDataTime = month + ' ' + date + ' ' + year + ' 00:00:00 GMT+0100'

    var colIdx = {}

    this.cols.forEach((col, idx) => {
      var dataTime = col.getAttribute('data-time')
      if (todayDataTime == dataTime) {
        colIdx['col'] = col
        colIdx['idx'] = idx
      }
    })
    console.log('colIdx', colIdx)
    this.updPopup(colIdx.col, colIdx.idx)
  }

  build() {
    var row = ''
    Object.keys(this.days).map((key, idx) => {
      if (idx % 7 === 0) {
        var prop = {
          row: ['div', { class: '-c-row' }, '', '']
        }
        row = Tag.create(prop['row'])
      } 
      row.appendChild(this.column(key, idx))
      this.calendar.appendChild(row)
    })
    return this
  }

  column(time, idx) {
    var friNo = 0, colClass = ''
    var day = new Date(time).getDay()
    if (day == 5) {
      friNo = Math.round(idx / (day + 1))
      colClass = (this.today.getDate() == (idx + 1)) ? '-c-col -today' : '-c-col -friday-' + friNo
    } else {
      colClass = (this.today.getDate() == (idx + 1)) ? '-c-col -today' : '-c-col'
    }
    var prop = {
      col: ['div', { class: colClass, 'data-time': time }, '', ''],
      mon: ['div', { class: '-month'}, '', this.months[new Date(time).getMonth()].substr(0, 3)],
      items: ['div', { class: '-items' }, '', ''],
      base: ['div', { class: '-base' }, '', ''],
      date: ['div', { class: '-date' }, '', idx + 1]
    }
    var col = Tag.create(prop['col'])
    var mon = Tag.create(prop['mon'])
    var items = Tag.create(prop['items'])
    var itemsList = this.getItems(this.findInitiatives(time))
    var base = Tag.create(prop['base'])
    var date = Tag.create(prop['date'])

    base.appendChild(date)
    Tag.appendMany2One(itemsList, items)
    Tag.appendMany2One([mon, items, base], col)
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
    // if (hr === 12) return this.pad(hr) + ':' + this.pad(min) + 'pm'
    // else if (hr > 12) return this.pad(hr - 12) + ':' + this.pad(min) + 'pm'
    // else if (hr === 0) return '12' + ':' + this.pad(min) + 'am'
    // else return this.pad(hr) + ':' + this.pad(min) + 'am'
    if (hr === 12) return this.pad(hr) + 'pm'
    else if (hr > 12) return this.pad(hr - 12) + 'pm'
    else if (hr === 0) return '12' + 'am'
    else return this.pad(hr) + 'am'
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
      for(var i = 0; i < initiative.dates.length; i++) {
        var loopTime = initiative.dates[i]
        var loopDate = new Date(loopTime).getDate()
        var loopMnth = new Date(loopTime).getMonth()
        if (date === loopDate && mnth === loopMnth) {
          agenda.push({ link: initiative.link, time: loopTime, name: key })
        }
      }
    })
    agenda.sort((a,b) => +new Date(a.time) - +new Date(b.time))
    return agenda
  }

  datesInMonth() {
    var today = new Date('November 01 2020 01:00:00 GMT+0100')
    var month = today.getMonth() + 1
    var end = new Date(today.getFullYear(), month, 0).getDate()

    for (var i = 1; i <= end; i++) {
      // result.push(this.format(today, i))
      this.days[this.format(today, i)] = {}
    }
    return this
  }

  format(today, i) {
    var monthStr = this.months[today.getMonth()]
    return `${monthStr} ${i < 10 ? '0' + i : i} ${today.getFullYear()} 00:00:00 ${this.GMT}`
  }

  update(evt, col, idx) {
    this.updPopup(col, idx)
      .updPos(evt)
  }

  updPopup(col, idx) {
    var month = col.querySelector('.-month').textContent
    var date = col.querySelector('.-date').textContent
    var time = col.getAttribute('data-time')
    var items = col.querySelectorAll('.-item')
    var dayIdx = idx % this.days_in_wk
    var day = this.dy[dayIdx]

    this.popup_day.textContent = day
    this.popup_dat.textContent = date
    this.popup_mnt.textContent = month
    
    var friNo = 0
    var day = new Date(time).getDay();
    (day == 5) && (friNo = Math.round(idx / (day + 1)));

    var addedClass = '';
    // if (day == 5) {
    //   addedClass = '-friday-' + friNo
    // }
    (day == 5) && (addedClass = '-friday-' + friNo);
    // if (this.today == (idx + 1)) {
    //   addedClass = '-today'
    // }
    (this.today.getDate() == (idx + 1)) && (addedClass = '-today');

    this.popup_mnt.className = '-month ' + addedClass
    // console.log('addedClass', addedClass)
    // var addedClass = '-friday-' + friNo
    // var fn = this.popup_mnt.classList
    // console.log('idx', idx)
    // if (day == 5) {
    //   ;(this.today == (idx + 1)) ? fn.add('-friday-' + friNo) : fn.add('-today')
    //   // this.popup_mnt.classList.add('-friday-' + friNo)
    // } else {
    //   // ;(this.today == (idx + 1)) ? fn.add('-friday-' + friNo) : fn.add('-today')
    //   this.popup_mnt.className = (this.today == (idx + 1)) ? '-month -today' : fn[0]
    // }

    this.popup_itm.innerHTML = ''
    items.forEach(item => {
      var href = item.getAttribute('href')
      var time = item.querySelector('.-txt').textContent
      var engagement = item.querySelector('.-engagement').textContent
      this.popup_itm.innerHTML += `<a class="-item" href="${href}"><div class="-time -inlineblock -vamiddle"><span class="-icn"></span><span class="-txt">${time}</span></div><div class="-engagement -inlineblock -vamiddle">${engagement}</div></a>`
    })
    return this
  }

  updPos(evt) {
    var x = evt.clientX
    var y = evt.clientY
    document.documentElement.setAttribute("style", "--pos-x: " + x + 'px;--pos-y:' + y + 'px')
    return this
  }
}

new Calendar()