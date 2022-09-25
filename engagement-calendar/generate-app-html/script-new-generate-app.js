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

class CategoriesAndMFls {
  constructor() {
    this.imgPath = 'https://ng.jumia.is/cms/8-18/jumia-choice/'
    this.mflPath = 'https://ng.jumia.is/cms/8-18/fs-dod/mfls/'
    this.host = 'https://www.jumia.com.ng'
    this.categories = [
      { name: 'groceries', link: '/groceries/', icon: 'groceries.jpg' },
      { name: 'phones & tablets', link: '/phones-tablets/', icon: 'phones-tabletsv2.jpg' },
      { name: "men's fashion", link: '/mlp-mens-fashion/', icon: 'mens-fashionv2.jpg' },
      { name: "women's fashion", link: '/mlp-womens-fashion/', icon: 'womens-fashionv2.jpg' },
      { name: "kid's fashion", link: '/mlp-kids-fashion/', icon: 'kids-fashion.jpg' },
      { name: 'electronics', link: '/electronics/', icon: 'electronics.jpg' },
      { name: 'computing', link: '/computing/', icon: 'computing.jpg' },
      { name: 'home & office', link: '/home-office/', icon: 'home.png' },
      { name: 'kitchen & dining', link: '/mlp-kitchen-dining/', icon: 'kitchen-dining.jpg' },
      { name: 'furniture', link: '/mlp-furniture/', icon: 'furniture.jpg' },
      { name: 'health & beauty', link: '/health-beauty/', icon: 'health-beauty-vw.jpg' },
      { name: 'baby products', link: '/baby-products/', icon: 'baby-products.jpg' },
      { name: 'board games', link: '/board-games/', icon: 'board-games.jpg' },
      { name: 'video games', link: '/video-games/', icon: 'video-games.jpg' },
      { name: 'sports', link: '/mlp-team-sports/', icon: 'sports.jpg' },
      { name: 'automobile', link: '/automobile/', icon: 'automobilev2.jpg' },
      { name: 'generators', link: '/mlp-generators/', icon: 'generators.jpg' },
      { name: 'industrial & scientific', link: '/mlp-industrial-scientific/', icon: 'industrial_scientific.jpg' },
      { name: 'books', link: '/books-movies-music/', icon: 'books-and-stationery.png' },
      { name: 'art, craft & sewing', link: '/mlp-art-craft-sewing/', icon: 'art-craft-sewing.jpg' }
    ]
    this.mfls = [
      { link: '/mlp-anniversary-h-1k-store/', icon: 'mfl-1k-store.jpg' },
      { link: '/mlp-anniversary-h-deals/', icon: 'mfl-anniversary-deals.jpg' },
      { link: '/mlp-deals-of-the-day/', icon: 'mfl-dod.jpg' },
      { link: '/mlp-anniversary-h-free-shipping-deals/', icon: 'mfl-free-delivery.jpg' },
      { link: '/sp-wheel-fortune/', icon: 'mfl-spin-win.jpg' },
      { link: '/sp-vouchers-of-the-week-app/', icon: 'mfl-vouchers.jpg' }
    ]
  }

  get() {
    var mfls = `<div class="-title">anniversary offers</div><div class="-mfls">`
    var categories = `<div class="-title">top categories</div><div class="-categories">`

    this.mfls.map(mfl => {
      mfls += `<a class="-mfl -inlineblock -vamiddle" href="${this.host}${mfl.link}"><img src="${this.mflPath}${mfl.icon}" alt="cat_img"/></a>`
    })
    mfls += '</div>'

    this.categories.map(cat => {
      categories += `<a class="-category -inlineblock -vatop" href="${this.host}${cat.link}"><img src="${this.imgPath}${cat.icon}" alt="cat_img"/><div class="-txt">${cat.name}</div></a>`
    })
    categories += '</div>'

    // return mfls + categories
    return categories
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

    this.days_in_wk = 7
    this.fridays = 6
    this.days = {}

    this.init()
  }

  init() {
    this.datesInMonth().build().listen()
    return this
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
      })
    })
  }

  build() {
    var rowCount = 1
    var row = ''
    Object.keys(this.days).map((key, idx) => {
      if (idx % 7 === 0) {
        row = Tag.create(['div', { class: '-c-row' }, '', ''])
        rowCount++
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

}

class Logic {
  constructor() {
    this.UNIQUE_PARAMETER = 'BlackFriday'
    this.UNIQUE_PARAMETER_2 = 'Prime'
    this.BOB_IMG_LINK = 'https://ng.jumia.is/cms/8-18/fs-dod/'
    this.host = 'https://www.jumia.com.ng/'
    this.now = new Date()
    this.CURRENCY = '₦'
    this.keyValDelimeter = '='
    this.CATEGORY_BANNER = 'https://ng.jumia.is/cms/8-18/Anniversary/2020/flash-sales/ja20-cbmv2.jpg'
    this.LOGO_ICON = 'https://ng.jumia.is/cms/8-18/fs-dod/fs-pilot/ja-logov2.png'
    this.HEADER_COLOR = '#e43b14'
    this.extraMinutes = 900
    this.months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    this.daysOfWeek = [
      'sunday', 'monday', 'tuesday',
      'wednesday', 'thursday', 'friday',
      'saturday'
    ]
    this.skusData = [
      "sku=|name=HAYAT|desc=Groceries|tag=|time=October 30 2020 10:00:00 GMT+0100|oldPrice=|newPrice=Extra 5% Off|image=hayat__store.jpg|pdp=https://www.jumia.com.ng/hayat-store/|logo=hayat__store.jpg|category=Laptops|categorypdp=https://www.jumia.com.ng/laptops/asus--hp--lenovo/|startPrice=80000|endPrice=120000|status=available",
      "sku=GE779EA10JD3SNAFAMZ|name=M4C Smartwatch|desc=Waterproof|tag=|time=October 30 2020 10:00:00 GMT+0100|oldPrice=6159|newPrice=2700|image=m4c__wristband__waterproof.jpg|pdp=https://www.jumia.com.ng/generic-smart-watch-m4c-waterproof-blood-pressure-sport-heart-rate-42696316.html|logo=|category=Clothing Bundles|categorypdp=https://www.jumia.com.ng/mens-clothing-bundles/acelloti--fashion-brand--generic--jumia-bundles--rukari/|startPrice=0|endPrice=12190|status=available",
      "sku=NI930ST0IBFMANAFAMZ|name=Nivea Men Bundle|desc=Spray, Rollon, Creme, Bag|tag=|time=October 30 2020 10:00:00 GMT+0100|oldPrice=3235|newPrice=2340|image=nivea__me_n_Bundle.jpg|pdp=https://www.jumia.com.ng/nivea-deep-men-spray-deep-men-rollon-creme-for-men-free-shower-bag-64566703.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=GE779HA1H7AVINAFAMZ|name=Smoothie Blender|desc=USB|tag=|time=October 30 2020 10:00:00 GMT+0100|oldPrice=8599|newPrice=3790|image=smoothie__maker__blendr.jpg|pdp=https://www.jumia.com.ng/usb-mini-electric-fruit-juicer-handheld-smoothie-maker-blender-juice-cup-generic-mpg1213921.html|logo=|category=Washing Machines|categorypdp=https://www.jumia.com.ng/appliances-washers-dryers/|startPrice=23000|endPrice=40000|status=available",
      "sku=NI930ST1BWY9CNAFAMZ|name=Nivea Body Lotion For Women|desc=400ml x2|tag=|time=October 30 2020 10:00:00 GMT+0100|oldPrice=3400|newPrice=2700|image=nivea__cocoa__lotion__women.jpg|pdp=https://www.jumia.com.ng/nivea-nourishing-cocoa-body-lotion-for-women-400ml-pack-of-2-44397408.html|logo=|category=Groceries|categorypdp=https://www.jumia.com.ng/groceries/dangote--dano--devon-king-s--honeywell--indomie--jumia-bundles--nestle/|startPrice=4400|endPrice=10000|status=available",
      
      
      "sku=|name=HAYAT|desc=Groceries|tag=|time=October 30 2020 10:00:00 GMT+0100|oldPrice=|newPrice=Extra 5% Off|image=hayat__store.jpg|pdp=https://www.jumia.com.ng/hayat-store/|logo=hayat__store.jpg|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=|name=Pizza Hut|desc=The Big Boss|tag=JFood|time=October 30 2020 14:00:00 GMT+0100|oldPrice=|newPrice=50% Off|image=pizza__hut.jpg|pdp=https://tinyurl.com/y4u5uxv4|logo=pizza__hut.jpg|category=Smartphones|categorypdp=https://www.jumia.com.ng/smartphones/|startPrice=10000|endPrice=29990|status=available",
      "sku=LE792HA0UH6DUNAFAMZ|name=Lee Buy Single Burner|desc=Electric Cooking Plate|tag=|time=October 30 2020 14:00:00 GMT+0100|oldPrice=5275|newPrice=2800|image=leebuy__single__burner_jg.jpg|pdp=https://www.jumia.com.ng/lee-buy-electric-cooking-plate-single-burner-white-60998115.html|logo=|category=Sewing|categorypdp=https://www.jumia.com.ng/crafts-sewing-machines/|startPrice=0|endPrice=10000|status=available",
      "sku=CO169DB06XORYNAFAMZ|name=Coca Cola|desc=1Litre x12|tag=|time=October 30 2020 14:00:00 GMT+0100|oldPrice=2400|newPrice=1700|image=coca__cola__1l_x12.jpg|pdp=https://www.jumia.com.ng/coca-cola-coke-1litre-x12-45494611.html|logo=|category=Drinks|categorypdp=https://www.jumia.com.ng/drinks/|startPrice=0|endPrice=1700|status=available",
      "sku=GE779HL06Q9WPNAFAMZ|name= Electric Sewing Machine|desc=Mini - Home Handwork|tag=|time=October 30 2020 14:00:00 GMT+0100|oldPrice=9560|newPrice=4300|image=electric_mini_sewing_machine.jpg|pdp=https://www.jumia.com.ng/home-handwork-electric-mini-sewing-machine-with-led-light-generic-mpg1178071.html|logo=|category=Generators|categorypdp=https://www.jumia.com.ng/generators/|startPrice=40000|endPrice=70000|status=available",
      "sku=EA102EL15J90UNAFAMZ|name=Eaget Flash Drive|desc=32G + OTG Transfer Interface|tag=|time=October 30 2020 14:00:00 GMT+0100|oldPrice=4199|newPrice=1790|image=eaget__flash_drive_plus_gift.jpg|pdp=https://www.jumia.com.ng/eaget-u96-32gb-usb-3.0-metal-otg-flash-drive-eaget-mpg1236705.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",


      "sku=KN679GR14KQPHNAFAMZ|name=Knorr Combo Pack|desc=Beef & Chicken, Cubes & Powder|tag=BlackFriday|time=November 06 2020 00:00:00 GMT+0100|oldPrice=2500|newPrice=1250|image=knorr__combo__.jpg|pdp=https://www.jumia.com.ng/beef-cubes-chicken-cubes-chicken-powder-combo-pack-knorr-mpg1220889.html|logo=|category=Men Loafers|categorypdp=https://www.jumia.com.ng/mens-loafers-slip-ons/|startPrice=1690|endPrice=10000|status=available",
      "sku=DE973FF0S8KT5NAFAMZ|name=King's Cooking Oil|desc=5 Litres|tag=BlackFriday|time=November 06 2020 00:00:00 GMT+0100|oldPrice=4500|newPrice=2990|image=devon__king__5_l_itre_oil.jpg|pdp=https://www.jumia.com.ng/cooking-oil-5l-devon-kings-mpg1473315.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=JA052GR1B5DLHNAFAMZ-48279668|name=Jameson|desc=70cl - Irish Whiskey|tag=BlackFriday|time=November 06 2020 00:00:00 GMT+0100|oldPrice=5688|newPrice=2850|image=jameson___2.jpg|pdp=https://www.jumia.com.ng/jameson-irish-whiskey-70cl-35829197.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=BR614EA19CWOHNAFAMZ|name=UKA HD TV|desc=32 inches|tag=BlackFriday|time=November 06 2020 00:00:00 GMT+0100|oldPrice=47000|newPrice=35990|image=jbf__uka__32__inches__tv.jpg|pdp=https://www.jumia.com.ng/uka-32-led-hd-tv-haier-3-year-warranty-led32k8000-black-54943903.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      "sku=UM742MP05UJ48NAFAMZ-88640397|name=Umidigi A7|desc=4GB / 64GB|tag=BlackFriday|time=November 06 2020 00:00:00 GMT+0100|oldPrice=81900|newPrice=35990|image=bf_umidigi__a7_global.jpg|pdp=https://www.jumia.com.ng/umidigi-a7-4gb-64gb-rom-6.49full-screen-android-10-16mp8mp5mp5mp16mp-4150mah-global-band-dual-4g-triple-slots-green-63522890.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=EA839EC1BFHHUNAFAMZ|name=FIFA 21|desc=PS4|tag=BlackFriday|time=November 06 2020 00:00:00 GMT+0100|oldPrice=40000|newPrice=20990|image=bf__fifa21__ps4v2.jpg|pdp=https://www.jumia.com.ng/playstation-4-fifa-21-ea-sports-mpg1546740.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      "sku=|name=Jumia Prime|desc=3 Months Subscription|tag=Prime|time=November 06 2020 10:00:00 GMT+0100|oldPrice=|newPrice=20% Off|image=bf__jumia_prime_3months_subscriptionv2.jpg|pdp=https://www.jumia.com.ng/mlp-3-months-prime-subscriptions/|logo=bf__jumia_prime_3months_subscriptionv2.jpg|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=|name=Unilever|desc=Groceries|tag=BlackFriday|time=November 06 2020 10:00:00 GMT+0100|oldPrice=|newPrice=Up to 50% Off|image=unilever__storev3.jpg|pdp=https://www.jumia.com.ng/mlp-unilever-store/|logo=unilever-logo.png|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=BR169EA0IF1K1NAFAMZ|name=UKA HD TV|desc=32 inches|tag=BlackFriday|time=November 06 2020 10:00:00 GMT+0100|oldPrice=60000|newPrice=39000|image=jbf__uka__32__inches__tv.jpg|pdp=https://www.jumia.com.ng/uka-32-led-hd-tv-haier-3-year-warranty-led32k8000-black-54943903.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=CH351HL14XBTENAFAMZ|name=Chaoba Clipper|desc=With Aftershave and Bag|tag=BlackFriday|time=November 06 2020 10:00:00 GMT+0100|oldPrice=5000|newPrice=2990|image=chaoba-clipper-with-aftershave.jpg|pdp=https://www.jumia.com.ng/chaoba-clipper-with-after-shave-an-bag-chaoba-mpg207232.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      
      "sku=UM742MP19VU6NNAFAMZ|name=Umidigi A7 Pro|desc=4GB / 64GB|tag=BlackFriday|time=November 06 2020 12:00:00 GMT+0100|oldPrice=81900|newPrice=39990|image=bf__umidigi__a7_ligt_blue.jpg|pdp=https://www.jumia.com.ng/umidigi-a7-pro-6.3-inch-4gb64gb-rom-android-10.016mp16mp5mp5mp16mp-4150mah-global-version-dual-4g-smartphone-57186077.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      "sku=FA815GR124VKWNAFAMZ|name=Familia Tissue|desc=x48|tag=BlackFriday|time=November 06 2020 12:00:00 GMT+0100|oldPrice=6000|newPrice=2990|image=bf__familia__tissue.jpg|pdp=https://www.jumia.com.ng/familia-f-ultra-perfumed-strawberry-single-roll-x-48-6925046.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      
      "sku=|name=Reckitt Benckiser|desc=Groceries |tag=BlackFriday|time=November 06 2020 14:00:00 GMT+0100|oldPrice=|newPrice=Up to 50% Off|image=reckitt__benckiser__storev2.jpg|pdp=https://www.jumia.com.ng/mlp-reckitt-benckiser-store|logo=reckitt-benkiser-logo.png|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      "sku=FA203SH0HEULBNAFAMZ|name=Men's Sneakers|desc=Sports Shoes|tag=BlackFriday|time=November 06 2020 14:00:00 GMT+0100|oldPrice=4704|newPrice=1750|image=mens__breathable___sneakersv2.jpg|pdp=https://www.jumia.com.ng/fashion-mens-breathable-sports-shoes-sneakers-black-30364292.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=BI681HL0BK4YSNAFAMZ|name=Binatone Blender & Smoothie Maker|desc=1.25L + 0.5L|tag=BlackFriday|time=November 06 2020 14:00:00 GMT+0100|oldPrice=17849|newPrice=13990|image=bf__binatone__blender_1_25_0_5.jpg|pdp=https://www.jumia.com.ng/binatone-blender-and-smoothie-maker-bls-360-23351491.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=NI930ST1BWY9CNAFAMZ|name=Nivea Body Lotion For Women|desc=400ml x2|tag=BlackFriday|time=November 06 2020 14:00:00 GMT+0100|oldPrice=3400|newPrice=1250|image=nivea__cocoa__lotion__women.jpg|pdp=https://www.jumia.com.ng/nivea-nourishing-cocoa-body-lotion-for-women-400ml-pack-of-2-44397408.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      
      "sku=WE029EL10QZ4ENAFAMZ|name=WD External Hard Drive|desc=1TB|tag=BlackFriday|time=November 06 2020 16:00:00 GMT+0100|oldPrice=20900|newPrice=16500|image=bf__wd__hard_drive.jpg|pdp=https://www.jumia.com.ng/western-digital-1tb-external-hard-drive-with-nigeria-warranty-5742716.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=BI681HL0GCCMTNAFAMZ|name=Binatone Standing Fan|desc=18 inches|tag=BlackFriday|time=November 06 2020 16:00:00 GMT+0100|oldPrice=27200|newPrice=14900|image=bf__binatone_standing__fan_18inches.jpg|pdp=https://www.jumia.com.ng/binatone-18-inch-standing-fan-ts-1880-mk2-black.-10105472.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=GI790MT1H65EZNAFAMZ|name=Gionee S11 Lite|desc=4GB / 64GB|tag=BlackFriday|time=November 06 2020 16:00:00 GMT+0100|oldPrice=49990|newPrice=35990|image=gionee__s11___lite.jpg|pdp=https://www.jumia.com.ng/s11-lite-hybrid-dual-4gb-ram-32gb-rom-4g-lte-black-gionee-mpg147063.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=CH870AA1F4AW2NAFAMZ|name=Chrysolite Designs|desc=Polo & Cap Bundle - JA|tag=BlackFriday|time=November 06 2020 16:00:00 GMT+0100|oldPrice=6500|newPrice=2500|image=chrysolite__designs__27polocap.jpg|pdp=https://www.jumia.com.ng/chrysolite-designs-27-polo-cap-bundle-wine-wine-45116858.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      
      "sku=FR910HB1NJ5IENAFAMZ|name=Franck Olivier Oud Touch|desc=100ml|tag=BlackFriday|time=November 06 2020 18:00:00 GMT+0100|oldPrice=10000|newPrice=5990|image=franck__olivier__oud__touch.jpg|pdp=https://www.jumia.com.ng/franck-olivier-oud-touch-edp-for-men-100ml-5909999.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=NE493HL0NKT8BNAFAMZ|name=Nexus Refrigerator|desc=100 Litres|tag=BlackFriday|time=November 06 2020 18:00:00 GMT+0100|oldPrice=65990|newPrice=42990|image=bf__nexus_refrigerator_100l.jpg|pdp=https://www.jumia.com.ng/17120693.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=|name=Saisho Bundle|desc=3 in 1|tag=BlackFriday|time=November 06 2020 18:00:00 GMT+0100|oldPrice=19000|newPrice=13290|image=bf__saisho__bundle.jpg|pdp=https://www.jumia.com.ng/saisho-electric-jug-s-402ss-double-burner-gas-stove-3-in-1-blender1.8-20795948.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
    ]
    this.timeInterval = null
  }

  initializeClock(endTime) {
    this.timeInterval = setInterval(() => this.toUpdateClock(endTime), 1000)
  }

  toUpdateClock(endTime) {
    var t = this.remainingTime(endTime)
    var classNames = ['days', 'hours', 'minutes', 'seconds']
    this.updateClock(classNames, t)
    if (t['t'] <= 0) { clearInterval(this.timeInterval) }
  }

  remainingTime(endTime) {
    var t = +new Date(endTime) - (+new Date())
    var seconds = Math.floor((t / 1000) % 60)
    var minutes = Math.floor((t / 1000 / 60) % 60)
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24)
    var days = Math.floor(t / (1000 * 60 * 60 * 24))

    if (
      days === 0 && hours === 0 &&
      minutes === 0 && seconds === 0
    ) { setTimeout(() => location.reload(true), 1000); }

    return { t, days, hours, minutes, seconds }
  }

  updateClock(classNames, t) {
    var clock = document.getElementById('clock')
    classNames.forEach(name => {
      var el = clock.querySelector(`.${name}`)
      if (el === 'days') { el.innerHTML = t[name] }
      else { el.innerHTML = `0${t[name]}`.slice(-2) }
    })
  }

  expand(skus) {
    return skus.map(sku => this.json(sku.split('|')))
  }

  json(skuDetails) {
    var obj = {}
    skuDetails.map(property => {
      var keyValue = property.split(this.keyValDelimeter)
      obj[keyValue[0]] = keyValue[1]
    })
    return obj
  }

  times(skus) {
    var times = skus.map(sku => +new Date(sku['time']))
    var uniqueTimes = Array.from(new Set(times))
    return uniqueTimes.sort((a, b) => a - b)
  }

  group(skus, times) {
    return times.map(time => {
      var skusInTime = skus.filter(sku => +new Date(sku['time']) === parseInt(time))
      return { time, skus: skusInTime }
    })
  }

  pad(time) { return `0${time}`.slice(-2) }

  twelveHrFormat(hr, min) {
    if (hr === 12) return `${this.pad(hr)}:${this.pad(min)}pm`
    else if (hr > 12) return `${this.pad(hr - 12)}:${this.pad(min)}pm`
    else if (hr === 0) return `12:${this.pad(min)}am`
    else return `${this.pad(hr)}:${this.pad(min)}am`
  }

  fullDate(time) {
    var day = new Date(time).getDay()
    var month = new Date(time).getMonth()
    var date = new Date(time).getDate()
    var check = date.toString()[date.toString().length - 1]
    var dateTxt = date
    if (parseInt(check) === 1) { dateTxt = `${date}st` }
    else if (parseInt(check) === 2) {
      (date === 12) ? dateTxt = date + 'th' : dateTxt = date + 'nd'
    } else if (parseInt(check) === 3) {
      (date === 13) ? dateTxt = date + 'th' : dateTxt = date + 'rd'
    }
    else { dateTxt = `${date}th` }
    return `${this.daysOfWeek[day].substr(0, 3)} ${this.months[month].substr(0, 3)} ${dateTxt}`
  }

  date(time) {
    var $time = new Date(time)
    var timeDate = $time.getDate()
    var nowDate = this.now.getDate()
    var timeDiff = nowDate - timeDate

    if (timeDiff === 0) return 'today'
    else if (timeDiff === 1) return 'yesterday'
    else if (timeDiff === -1) return 'tomorrow'
    else return this.fullDate(time)
  }

  removeAddActive(toRemove, toAdd) {
    toRemove.forEach(each => each.classList.remove('active'))
    toAdd.classList.add('active')
  }

  tabListener(tab, time) {
    tab.addEventListener('click', () => {
      var skuRows = document.querySelectorAll('.-sku_row')
      var skuRow = document.querySelector(`._row-${time}`)
      var tabs = document.querySelectorAll('.-tab')
      this.removeAddActive(skuRows, skuRow)
      this.removeAddActive(tabs, tab)
      this.showSKUImage(skuRow)
    })
  }

  showSKUImage(skuRow) {
    var skus = skuRow.querySelectorAll('.-sku')
    skus.forEach(sku => {
      var img = sku.querySelector('.-img img')
      img.setAttribute('src', img.getAttribute('data-src'))
    })
  }

  createTab(time, idx) {
    var tabClass = (idx === 0) ? `-tab active -inline_block pos-rel -vamiddle -t-${time}` : `-tab -inline_block pos-rel -vamiddle -t-${time}`
    var date = new Date(time)
    var hr = date.getHours()
    var mn = date.getMinutes()
    var tabProps = {
      tab: ['div', { class: tabClass }, '', ''],
      tabTime: ['span', { class: '-time pos-abs' }, '', this.twelveHrFormat(hr, mn)],
      tabTxt: ['span', '', '', this.date(time)]
    }

    var tab = new Tag(tabProps['tab']).get()
    var tabTime = new Tag(tabProps['tabTime']).get()
    var tabTxt = new Tag(tabProps['tabTxt']).get()

    Tag.appendMany2One([tabTime, tabTxt], tab)
    this.tabListener(tab, time)
    return tab
  }

  replacePattern(pattern, str) {
    var re = new RegExp(pattern, 'g')
    var replaced = str.replace(re, '-')
    return replaced
  }

  skuID(name) {
    var replacedApos = this.replacePattern("'", name)
    var replaceAmp = this.replacePattern('&', replacedApos)
    var replacePercnt = this.replacePattern('%', replaceAmp)
    return replacePercnt.toLowerCase().split(' ').join('-')
  }

  price(rawPrice) {
    return rawPrice.split('-')
      .map(price => {
        var newPriceGtZero = `${this.CURRENCY}${parseInt(price).toLocaleString()}`
        var newPriceLtZero = 'FREE'
        return parseInt(price) === 0 ? newPriceLtZero : newPriceGtZero
      }).join(' - ')
  }

  createSKURow(group, idx) {
    var rowClass = (idx === 0) ? `-sku_row pos-rel active _row-${group.time}` : `-sku_row pos-rel _row-${group.time}`
    var rowProp = ['div', { class: rowClass, 'data-time': group.time }, '', '']
    return new Tag(rowProp).get()
  }

  discount(oldPrice, newPrice) {
    var diff = parseInt(oldPrice) - parseInt(newPrice)
    var ratio = diff * 100 / parseInt(oldPrice)
    if (!isNaN(ratio)) return `-${Math.round(ratio)}%`
  }

  isUnique(sku) {
    var unique = this.UNIQUE_PARAMETER.toLowerCase()
    return sku.tag.toLowerCase().indexOf(unique) != -1
  }

  isUnique2(sku) {
    var unique = this.UNIQUE_PARAMETER_2.toLowerCase()
    return sku.tag.toLowerCase().indexOf(unique) != -1
  }

  isAGroup(sku) {
    return sku.logo.length > 0
  }

  createSingle(sku) {
    var oldPrice = this.price(sku.oldPrice)
    var newPrice = this.price(sku.newPrice)
    var discount = this.discount(sku.oldPrice, sku.newPrice)
    var dNewPrice = discount ? newPrice : '???'
    var skuClass = '-sku -inline_block -vatop pos-rel'

    if (this.isUnique(sku)) {
      skuClass = `-sku -inline_block -vatop pos-rel -unique`
    } else if (this.isUnique2(sku)) {
      console.log('inside unique 2')
      skuClass = `-sku -inline_block -vatop pos-rel -unique_2`
    }

    var skuProp = {
      sku: ['a', { href: sku.pdp, class: skuClass, id: this.skuID(sku['name']), 'data-sku': sku.sku }, '', ''],
      imgWrap: ['div', { class: '-img pos-rel' }, '', ''],
      img: ['img', { 'data-src': this.BOB_IMG_LINK + sku.image, alt: 'sku_img' }, '', ''],
      shadow: ['div', { class: 'pos-abs -shadow' }, '', ''],
      sold: ['span', { class: 'pos-abs' }, '', 'unavailable'],
      mask: ['span', { class: '-mask pos-abs' }, '', ''],
      maskBg: ['span', { class: '-mask_bg pos-abs' }, '', ''],
      name: ['div', { class: '-name' }, '', sku.name],
      desc: ['div', { class: '-desc' }, '', sku.desc],
      prices: ['div', { class: '-prices' }, '', ''],
      oldPrice: ['div', { class: '-price -old' }, '', oldPrice],
      newPrice: ['div', { class: '-price -new', 'data-new-price': newPrice }, '', dNewPrice],
      discount: ['div', { class: '-discount pos-abs' }, '', discount],
      cta: ['div', { class: '-cta' }, '', 'preview']
    }


    var skuEl = new Tag(skuProp['sku']).get()
    var imgWrap = new Tag(skuProp['imgWrap']).get()
    var img = new Tag(skuProp['img']).get()
    var shadow = new Tag(skuProp['shadow']).get()
    var sold = new Tag(skuProp['sold']).get()
    var maskBg = new Tag(skuProp['maskBg']).get()
    var mask = new Tag(skuProp['mask']).get()
    var name = new Tag(skuProp['name']).get()
    var desc = new Tag(skuProp['desc']).get()
    var prices = new Tag(skuProp['prices']).get()
    var oldPrice = new Tag(skuProp['oldPrice']).get()
    var newPrice = new Tag(skuProp['newPrice']).get()
    var discount = new Tag(skuProp['discount']).get()
    var cta = new Tag(skuProp['cta']).get()

    shadow.appendChild(sold)
    Tag.appendMany2One([newPrice, oldPrice], prices)
    Tag.appendMany2One([shadow, img], imgWrap)
    if (dNewPrice === '???')
      Tag.appendMany2One([imgWrap, name, desc, cta, mask, maskBg], skuEl)
    else
      Tag.appendMany2One([imgWrap, name, desc, prices, cta, mask, maskBg, discount], skuEl)

    return skuEl
  }

  createGroup(sku) {
    var skuClass = '-sku -inline_block -vatop pos-rel'
    if (this.isUnique(sku)) {
      skuClass = `-sku -inline_block -vatop pos-rel -unique`
    } else if (this.isUnique2(sku)) {
      console.log('inside unique 2')
      skuClass = `-sku -inline_block -vatop pos-rel -unique_2`
    }
    var skuProp = {
      sku: ['a', { href: sku.pdp, class: skuClass, id: this.skuID(sku['name']), 'data-sku': sku.sku }, '', ''],
      imgWrap: ['div', { class: '-img pos-rel' }, '', ''],
      img: ['img', { 'data-src': this.BOB_IMG_LINK + sku.image, alt: 'sku_img' }, '', ''],
      shadow: ['div', { class: 'pos-abs -shadow' }, '', ''],
      sold: ['span', { class: 'pos-abs' }, '', 'unavailable'],
      mask: ['span', { class: '-mask pos-abs' }, '', ''],
      maskBg: ['span', { class: '-mask_bg pos-abs' }, '', ''],
      name: ['div', { class: '-name' }, '', sku.name],
      desc: ['div', { class: '-desc' }, '', sku.desc],
      prices: ['div', { class: '-prices' }, '', ''],
      oldPrice: ['div', { class: '-price -old' }, '', ''],
      newPrice: ['div', { class: '-price -new' }, '', sku.newPrice],
      discount: ['div', { class: '-discount pos-abs' }, '', ''],
      cta: ['div', { class: '-cta' }, '', 'preview']
    }

    var skuEl = new Tag(skuProp['sku']).get()
    var imgWrap = new Tag(skuProp['imgWrap']).get()
    var img = new Tag(skuProp['img']).get()
    var shadow = new Tag(skuProp['shadow']).get()
    var sold = new Tag(skuProp['sold']).get()
    var maskBg = new Tag(skuProp['maskBg']).get()
    var mask = new Tag(skuProp['mask']).get()
    var name = new Tag(skuProp['name']).get()
    var desc = new Tag(skuProp['desc']).get()
    var prices = new Tag(skuProp['prices']).get()
    var oldPrice = new Tag(skuProp['oldPrice']).get()
    var newPrice = new Tag(skuProp['newPrice']).get()
    var discount = new Tag(skuProp['discount']).get()
    var cta = new Tag(skuProp['cta']).get()

    shadow.appendChild(sold)
    Tag.appendMany2One([newPrice], prices)
    Tag.appendMany2One([shadow, img], imgWrap)
    Tag.appendMany2One([imgWrap, name, desc, prices, cta, mask, maskBg], skuEl)

    return skuEl
  }

  createSKU(sku) {
    return (this.isAGroup(sku)) ? this.createGroup(sku) : this.createSingle(sku)
  }

  extraMillisec(minutes) { return minutes * 60 * 1000 }

  endTime(time) {
    return time + this.extraMillisec(this.extraMinutes)
  }

  startEnd(times) {
    var start = times[0]
    var last = times[times.length - 1]
    var end = last + this.extraMillisec(this.extraMinutes)
    return { start, end }
  }

  skuRow(time) {
    return document.querySelector(`._row-${time}`)
  }

  oos(times) {
    times.map(time => {
      var oosRow = this.skuRow(time)
      oosRow.classList.add('-oos')
    })
  }

  pastAndFutureTimes(times) {
    var past = times.filter(time => +this.now > time && +this.now > this.endTime(time))
    var future = times.filter(time => past.indexOf(time) === -1)
    return { past, future }
  }

  gone(times) {
    this.oos(this.pastAndFutureTimes(times)['past'])
    this.reLabelActiveTabRow(this.pastAndFutureTimes(times)['future'])
  }

  reLabelActiveTabRow(times) {
    var tabs = document.querySelectorAll('.-tab')
    var nextTab = document.querySelector(`.-tab.-t-${times[0]}`)
    var skuRows = document.querySelectorAll('.-sku_row')
    var nextRow = document.querySelector(`._row-${times[0]}`)
    this.removeAddActive(tabs, nextTab)
    this.removeAddActive(skuRows, nextRow)
    this.showSKUImage(nextRow)
  }

  showNewPrice(sku) {
    var newPrice = sku.querySelector('.-price.-new')
    newPrice.textContent = newPrice.getAttribute('data-new-price')
  }

  oosSKU(skus) {
    var oosSKUs = skus.filter(sku => sku.status !== 'available')
    oosSKUs.map(sku => {
      var id = this.skuID(sku['name'])
      var el = document.getElementById(id)
      el.classList.add('-oos')
      this.showNewPrice(el)
      this.changeCTA(el, 'preview')
    })
  }

  changeCTA(sku, text) {
    sku.querySelector('.-cta').textContent = text
  }

  tab(time) {
    return document.querySelector(`.-t-${time}`)
  }

  live(list, action) {
    list.forEach(each => each.classList[action]('-live'))
  }

  changeCTAAndLink(skuRow, text) {
    var self = this
    var skus = skuRow.querySelectorAll('.-sku')
    skus.forEach(sku => self.changeCTA(sku, text))
  }

}

class Main {
  constructor() {
    this.logic = new Logic()
    this.calendar = new Calendar()
    this.skusEl = document.querySelector('.-skus')
    this.tabs = document.querySelector('.-tabs')
    this.nextCurrentSale = document.querySelector('.-next_current_sale')
    this.startsEnds = document.querySelector('.-starts_ends')
    this.toCopy = document.querySelector('.-to-copy')
    this.skusData = this.logic.skusData
    this.now = new Date()

    this.popups = document.querySelector('.-m-popups')
    this.calendEl = document.querySelector('.-calendar')
  }

  displayTabs(times) {
    // todo: sort time by current time
    times.map((time, idx) => this.tabs.appendChild(this.logic.createTab(time, idx)))
  }

  displaySKUs(skuGroups) {
    skuGroups.map((group, idx) => {
      var skuRow = this.logic.createSKURow(group, idx)
      group.skus.map(sku => skuRow.appendChild(this.logic.createSKU(sku)))
      this.skusEl.appendChild(skuRow)
    })
  }

  setState(times) {
    this.nextCurrentSale.classList.remove('-live')
    if (+this.now < this.logic.startEnd(times)['start']) { this.b41stSession(times) }
    else if (+this.now > this.logic.startEnd(times)['end']) { this.afterLastSession(times) }
    else { this.inAndBtwSessions(times) }
  }

  b41stSession(times) {
    var skuRow = this.logic.skuRow(times[0])
    this.logic.showSKUImage(skuRow)

    this.nextCurrentSale.textContent = `${this.logic.date(times[0])}'s sale`
    this.startsEnds.textContent = 'starts in'
    this.logic.initializeClock(times[0])

    console.log('before first session')
  }

  afterLastSession(times) {
    console.log('after last session')
  }

  inAndBtwSessions(times) {
    console.log('in and between session', times.length)
    this.logic.gone(times)
    this.coming(times)
  }

  coming(times) {
    var nextTime = this.logic.pastAndFutureTimes(times)['future'][0]
    var sessionCondition = +this.now >= nextTime && +this.now < this.logic.endTime(nextTime)

    sessionCondition ? this.inSession(nextTime) : this.betweenSession(nextTime)
  }

  inSession(nextTime) {
    var liveRow = this.logic.skuRow(nextTime)
    var liveTab = this.logic.tab(nextTime)
    var endTime = this.logic.endTime(nextTime)

    this.logic.changeCTAAndLink(liveRow, 'buy now')
    this.logic.live([liveRow, this.nextCurrentSale, liveTab], 'add')
    this.logic.initializeClock(endTime)

    this.nextCurrentSale.textContent = `${this.logic.date(nextTime)}'s sale`
    this.startsEnds.textContent = 'ends in'
  }

  betweenSession(nextTime) {
    this.logic.initializeClock(nextTime)
    this.nextCurrentSale.textContent = `${this.logic.date(nextTime)}'s sale`
    this.startsEnds.textContent = 'starts in'
  }

  init() {
    // var expanded = this.logic.expand(this.skusData)
    // var times = this.logic.times(expanded)
    // var grouped = this.logic.group(expanded, times)

    // var pastAndFuture = this.logic.pastAndFutureTimes(times)
    // var reorderedTimes = pastAndFuture['future'].concat(pastAndFuture['past'])

    // this.displayTabs(reorderedTimes)
    // this.displaySKUs(grouped)
    // this.setState(times)

    // this.logic.oosSKU(expanded)

    this.generateHTML()
    return this
  }

  replaceStr(str, toreplace, replacement) {
    var re = new RegExp(toreplace, 'g')
    return str.replace(re, replacement)
  }

  generateHTML() {
    var styles = `<style>
    *,*::before,*::after{padding:0;margin:0;box-sizing:border-box;vertical-align:middle;transition:all 0.2s cubic-bezier(.075,.82,.165,1);line-height:normal}:root{--campaign:#000;--jumia-color:#f68b1e;--complement:#7a75cc;--friday-1:#7a75cc;--friday-2:#00d3aa;--friday-3:#0090b2;--friday-4:#cf3501;--complement-light:#c3bef7;--bg-color:#eaeded;--bg-color-2:#f5f5f5;--gray:#70757a;--dark-font:#3c4043;--pos-x:50%;--pos-y:50%}.-today .-month,.-today .-base,.-m-popup .-today{background-color:var(--jumia-color)!important;color:#fff}.-friday-1 .-month,.-friday-1 .-base,.-m-popup .-friday-1{background-color:var(--friday-1)!important;color:#fff}.-friday-2 .-month,.-friday-2 .-base,.-m-popup .-friday-2{background-color:var(--friday-2)!important;color:#000}.-friday-3 .-month,.-friday-3 .-base,.-m-popup .-friday-3{background-color:var(--friday-3)!important;color:#fff}.-friday-4 .-month,.-friday-4 .-base,.-m-popup .-friday-4{background-color:var(--friday-4)!important;color:#fff}body main{font-size:1.2em}body,body main{background-color:var(--bg-color)}.-container{width:100%;max-width:480px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;color:var(--dark-font);font-size:.8em}.-hide{display:none!important}.-container a{color:var(--dark-font);text-decoration:unset}.-posrel{position:relative}.-possti{position:sticky}.-posabs{position:absolute}.-posfix{position:fixed}.-inlineblock{display:inline-block}.-vamiddle{vertical-align:middle}.-vabaseline{vertical-align:baseline}.-vabottom{vertical-align:bottom}.-vatop{vertical-align:top}.-row.-banner img{width:100%}.-calendar{font-size:.85em}.-calendar .-c-row.-head{background-color:var(--bg-color-2)}.-calendar .-c-row.-head .-c-col{text-transform:uppercase;font-weight:600;color:#fff;pointer-events:none;padding:5px;margin-bottom:unset;background-color:var(--complement)}.-calendar .-c-row .-c-col{display:inline-block;vertical-align:middle;width:calc(95% / 7);margin:calc(5% / 14);text-align:center;border:1px solid rgba(0,0,0,.05);box-shadow:0 0 0 0 transparent;background-color:#fff;border-bottom:unset}.-calendar .-c-row:not(.-head) .-c-col{cursor:pointer;box-shadow:0 1px 1px 0 rgba(0,0,0,.2);border-radius:2px}.-calendar .-c-row .-c-col:hover{box-shadow:0 0 .8125rem 0 rgba(0,0,0,.05);border-color:rgba(0,0,0,.12)}.-items{height:71px;overflow:hidden;display:none}.-items .-item{font-size:.8em;font-weight:600;text-align:left;margin:3px 0;pointer-events:none;padding:5px 0}.-items .-item:nth-child(odd){background-color:var(--bg-color)}.-m-popup .-items .-item{pointer-events:all}.-items .-item.-more{font-weight:700;padding:0 5px}.-items .-item .-time{width:22%;font-size:.8em;position:relative}.-items .-item .-time .-icn,.-items .-item .-time .-txt{display:inline-block;vertical-align:middle;width:calc(100% - 20px)}.-items .-item .-time .-icn{width:8px;height:8px;position:relative;margin:6px;border-radius:50%;border:2px solid var(--complement)}.-items .-item .-engagement{width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-left:1.5%;padding-right:10px;text-transform:capitalize;font-weight:600}.-calendar .-c-row .-c-col .-base{padding:5px 0;background-color:var(--bg-color-2)}.-calendar .-c-row .-c-col .-date{display:inline-block;width:30px;height:30px;line-height:30px;border-radius:50%;box-shadow:0 1px 1px 0 rgba(0,0,0,.2);background-color:#fff;font-weight:700;color:#000}.-m-popups{height:160px;width:100%;overflow:hidden}.-m-popup{border-radius:8px;width:95%;text-align:center;background-color:#fff;padding:10px;box-shadow:0 1px 3px 0 rgba(60,64,67,.302),0 4px 8px 3px rgba(60,64,67,.149);top:50%;left:200%;transform:translate(-50%,-50%);height:150px;z-index:1}.-m-popup.active{left:50%}.-m-popups .-controls{right:10px;bottom:10px;width:50px;background-color:#fff;z-index:10}.-m-popups .-controls .-control{display:inline-block;width:45px;height:45px;margin:5px 0;border-radius:50%;box-shadow:0 1px 1px 0 rgba(0,0,0,.2);background-color:var(--complement);position:relative;cursor:pointer}.-m-popups .-controls .-control::before{content:'';position:absolute;width:10px;height:10px;border:2px solid #fff;border-left:unset;border-bottom:unset;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-45deg)}.-m-popups .-controls .-control.-down::before{transform:translate(-50%,-50%) rotate(135deg)}.-m-popup .-m-close{position:absolute;width:32px;height:32px;top:5px;right:5px;border-radius:50%;cursor:pointer;background-color:#fff;display:none}.-m-popup .-day,.-m-popup .-date,.-m-popup .-month{display:inline-block;vertical-align:middle;padding:5px 10px}.-m-popup .-m-close:hover{background-color:var(--bg-color-2)}.-m-popup .-m-close::before,.-m-popup .-m-close::after{content:'';position:absolute;width:12px;height:2px;background-color:var(--dark-font);top:50%;left:50%;transform:translate(-50%,-50%) rotate(45deg)}.-m-popup .-m-close::after{transform:translate(-50%,-50%) rotate(135deg)}.-m-popup .-day{text-transform:uppercase;letter-spacing:1px;font-weight:600;padding:5px;font-size:.8em;color:var(--gray)}.-m-popup .-date{font-size:1.3em;font-weight:600}.-m-popup .-items{height:calc(100% - 37px);display:block;overflow:auto}.-m-popup .-items .-item{display:block}.-m-popup .-items .-item:hover{background-color:var(--bg-color-2)}.-month{text-transform:uppercase;font-size:.7em;font-weight:700;padding:5px 0;background-color:var(--complement-light)}#category-icons{background-color:var(--darkColor);text-align:center}#category-icons .-category-icon{display:inline-block;vertical-align:top;width:10%;text-align:center;margin:20px 0}#category-icons .-category-icon .-img{width:30%;display:block;margin:0 auto}#category-icons .-category-icon .-txt{text-transform:capitalize;font-size:.75em;font-weight:500;color:#fff}.-mfls .-mfl{height:unset;display:inline-block;vertical-align:middle;width:48%;background-color:#fff;margin:1%;border-radius:8px;box-shadow:0 1px 1px 0 rgba(0,0,0,.2)}.-mfls .-mfl img{width:100%;border-radius:8px}.-title{padding:20px 0;text-transform:uppercase;font-weight:600;text-align:center;color:var(--campaignFontColor);padding-bottom:5px}.-categories{padding-top:unset;background-color:#fff;font-size:.9em}.-inlineblock{display:inline-block}.-vatop{vertical-align:top}.-categories .-category{width:calc(100% / 4);text-align:center;max-width:150px;border:1px solid rgba(0,0,0,.05);padding:10px 5px;transition:transform .1s cubic-bezier(.4,0,.6,1),box-shadow .1s cubic-bezier(.4,0,.6,1),-webkit-transform .1s cubic-bezier(.4,0,.6,1);text-decoration:none;color:#000}.-categories .-category:hover{transform:translateZ(0);z-index:1;border-color:rgba(0,0,0,.12);box-shadow:0 0 .8125rem 0 rgba(0,0,0,.05)}.-categories .-category img{width:60%;display:block;margin:0 auto}.-categories .-category .-txt{display:block;margin-top:5px;text-transform:capitalize;line-height:1;font-weight:500;font-size:.85em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    </style>`

    var container = `<div class="-container -posrel"><div class="-row -banner"> <img src="https://ng.jumia.is/cms/0-MLPS-CAMPAIGN/0-black-friday/mlp-banners/cbm-friday-planning.jpg" alt="banner" /></div><div class="-posrel -m-popups"><div class="-controls -posabs"><div class="-control -up"></div><div class="-control -down"></div></div>${this.popups.innerHTML}</div><div class="-calendar">${this.calendEl.innerHTML}</div>${new CategoriesAndMFls().get()}</div>`

    var script = `
    <script>
    class Calendar{constructor(){this.scrollUp=document.querySelector(".-control.-up"),this.scrollDown=document.querySelector(".-control.-down"),this.toScroll=document.querySelector("#fri-6 .-items"),this.today=new Date,this.months=["january","february","march","april","may","june","july","august","september","october","november","december"],this.init().scrollByButtons().set()}init(){return document.querySelectorAll(".-calendar .-c-row:not(.-head) .-c-col").forEach(t=>{this.today.getDate()==this.pDate(t)&&t.classList.add("-today"),t.addEventListener("click",()=>{this.update(t)})}),this}set(){var t=this.today.getMonth(),e=this.months[t].substr(0,3)+"-"+this.today.getDate(),o=document.querySelectorAll(".-m-popup"),r=document.getElementById(e);this.toScroll=r.querySelector(".-items"),o.forEach(t=>t.classList.remove("active")),r.classList.add("active")}pDate(t){var e=t.getAttribute("data-time");return new Date(e).getDate()}update(t){var e=document.querySelectorAll(".-m-popup"),o=t.getAttribute("id"),r=document.querySelector(".-m-popup#"+o),a=r.querySelector(".-month");a.className=this.today.getDate()==this.pDate(t)?"-month -today":a.className,e.forEach(t=>t.classList.remove("active")),r.classList.add("active"),this.toScroll=r.querySelector(".-items")}scrollByButtons(){var t=this;return this.scrollUp.addEventListener("click",function(){var e=t.toScroll.scrollTop-20,o=t.toScroll.scrollTop-50;t.tween(e,o,500,t.easeOutQuart,t.toScroll,"Top")}),this.scrollDown.addEventListener("click",function(){var e=t.toScroll.scrollTop+20,o=t.toScroll.scrollTop+50;t.tween(e,o,500,t.easeOutQuart,t.toScroll,"Top")}),this}easeOutQuart(t,e,o,r,a){return-r*((e=e/a-1)*e*e*e-1)+o}tween(t,e,o,r,a,l){var c,s=e-t;c=window.performance&&window.performance.now?performance.now():Date.now?Date.now():(new Date).getTime();var n=function(i){var u=i?i-c:0,d=r(null,u,0,1,o);a["scroll"+l]=t+s*d,u<o&&a["scroll"+l]!=e&&requestAnimationFrame(n)};n()}}new Calendar;
    </script>
    `

    var skuHTML = container
    skuHTML = this.replaceStr(skuHTML, '.jpg">', '.jpg"/>')
    skuHTML = this.replaceStr(skuHTML, '.png">', '.png"/>')
    skuHTML = this.replaceStr(skuHTML, 'sku_img">', 'sku_img"/>')
    this.toCopy.value = `${styles}${skuHTML}${script}`
  }

}

new Main().init()