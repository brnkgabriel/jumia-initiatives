// TO DO: Get category url from https://www.jumia.com.ng/index/allcategories/
// remember: we're currently working with L1 category filter. We'll add L2 later
class Util {
  constructor() {
    this.rem_content = [
      "Home & Office/Office Products/Packaging Materials",
      "Fashion/Men's Fashion/Clothing/Underwear",
      "Women's Fashion/Clothing/Lingerie, Sleep & Lounge",
      "Health & Beauty/Sexual Wellness",
      "Fashion/Women's Fashion/Underwear & Sleepwear",
      "Fashion/Women's Fashion/Maternity",
      "Fashion/Women's Fashion/Clothing/Swimsuits & Cover Ups",
      "Women's Fashion/Clothing/Socks & Hosiery",
      "Sporting Goods/Sports & Fitness/Exercise & Fitness",
      "Home & Office/Arts, Crafts & Sewing/Sewing/Sewing Notions & Supplies/Dress Forms & Mannequins/Mannequins"
    ]
    this.image_observer = null

    this.el = query => document.querySelector(query)
    this.all = query => document.querySelectorAll(query)
    this.withinString = (json, i) => (i !== 0 && i !== json.length - 1)

    this.fetched = this.el('.-fetched')
  }

  collect(href, type) {
    return fetch(href).then(res => res.text())
      .then(data => this['get' + type](data))
      .catch(err => console.log(':( error fetching', err))
  }

  debounce(fn, delay) {
    var timer = null

    return function () {
      var context = this, args = arguments
      clearTimeout(timer)
      timer = setTimeout(() => { fn.apply(context, args) }, delay);
    }
  }

  getContent(data) {
    var start = data.indexOf('<main'), end = data.lastIndexOf('</main>'), parsed = {}
    var html = data.substring(start, end + 7)
    
    this.fetched.innerHTML = html
    var categories = this.contentFromHTML()
    this.fetched.innerHTML = ''
    return categories
  }

  contentFromHTML() {
    var L1_wraps = this.all('.col4.-pvm')
    return Array.from(L1_wraps).map(L1_wrap => this.getL1L2s(L1_wrap))
  }

  getL1L2s(wrap) {
    var L1 = wrap.querySelector('.-pbm.-m.-upp.-hov-or5')
    var L1_href = L1.getAttribute('href')
    var L1_name = L1.textContent
    return { L1_name, L1_href, L2s: this.getL2s(wrap) }
  }

  getL2s(wrap) {
    var L2s = wrap.querySelectorAll('.-gy5.-hov-m.-hov-gy8')
    return Array.from(L2s).map(L2 => {
      var L2_href = L2.getAttribute('href')
      var L2_name = L2.textContent
      return { L2_name, L2_href }
    })
  }

  escape(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }

  braceIndices(str, brace) {
    var regex = new RegExp(brace, "gi"), result, indices = []
    while ((result = regex.exec(str))) {
      indices.push(result.index)
    }
    return indices
  }

  products(data) {
    this.fetched.innerHTML = data;
    var textC = [], scripts = this.fetched.querySelectorAll('script')
    this.fetched.innerHTML = ''
    scripts.forEach(script => textC.push(script.innerHTML))
    var foundIdx = textC.findIndex(script => script.indexOf('"products":[{') !== -1)
    return textC[foundIdx]
  }

  mobile(raw_products) {
    var start = raw_products.indexOf('"products":')
    var products = '{' + raw_products.substring(start, raw_products.length)
    var l_idx = products.indexOf(',"head"')
    return products.substring(0, l_idx - 1) + '}'
  }

  desktop(raw_products) {
    var start = raw_products.indexOf('"products":')
    var products = '{' + raw_products.substring(start, raw_products.length)
    var closing_brace_indices = this.braceIndices(products, this.escape("}]"))
    var last_idx = closing_brace_indices[closing_brace_indices.length - 1]
    return products.substring(0, last_idx + 2) + '}'
  }

  format(raw_products) {
    return innerWidth > 600 ? this.desktop(raw_products) : this.mobile(raw_products)
  }

  extractProducts(data) {
    var raw_products = this.products(data)
    return this.format(raw_products)
  }

  getProducts(data) {
    localStorage.setItem('sku-finder', data)
    var extracted = this.extractProducts(data)
    var parsed = JSON.parse(extracted).products

    return parsed ? { raw: data, filtered: this.filterProducts(parsed) } : { raw: data, filtered: [] }
  }

  doesntHaveDiscount(parsed) {
    // var filtered = parsed.filter(sku => this.toInclude(sku))
    //   .filter(sku => sku.isBuyable === true)
    var filtered = parsed.filter(sku => sku.isBuyable === true)

    return (filtered.length !== 0) ? filtered : []
  }

  hasDiscount(parsed) {
    // var filtered = parsed.filter(sku => this.toInclude(sku))
    //   .filter(sku => {
    //     var discount = sku.prices.discount
    //     return discount && (parseInt(discount) > 0)
    //   }).sort((a, b) => {
    //     var aDiscount = parseInt(a.prices.discount)
    //     var bDiscount = parseInt(b.prices.discount)
    //     return bDiscount - aDiscount
    //   })
    var filtered = parsed.filter(sku => {
        var discount = sku.prices.discount
        return discount && (parseInt(discount) > 0)
      }).sort((a, b) => {
        var aDiscount = parseInt(a.prices.discount)
        var bDiscount = parseInt(b.prices.discount)
        return bDiscount - aDiscount
      })
    return (filtered.length !== 0) ? filtered : []
  }
  filterProducts(parsed) {
    return this.doesntHaveDiscount(parsed)
  }

  toInclude(sku) {
    var idx = this.rem_content.indexOf(sku.categories)
    return (idx !== -1) ? false : true
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

  lazyLoad() {
    this.image_observer = new ImageObserver()
    this.image_observer = null
  }
}

class SKUCollector {
  /**
   * 
   * @param {object} data 
   * @param {Util} util 
   */
  constructor(util) {
    this.util = util

    this.PRODUCTS = 'Products'
    this.CONTENT = 'Content'
    this.fetchCount = 0
    this.MAX_FETCH_COUNT = 10
    this.visibleSKUs = 5
    this.prevSearch = ''
    this.skuCats = []
    this.skus = []
    this.data = []
    this.unsorted_data = []
    this.original = []
    this.last_page = 0
    this.url = ''
    this.current_page = 1
    this.valid = 0
    this.oos = 0
    this.temp_valid = 0
    this.temp_oos = 0


    this.searchInput = this.util.el('.-productsearch')
    this.preloader = this.util.el('#preloader')
    this.preview_preloader = this.util.el('#preview-preloader')
    this.productfloorsS = this.util.el('.-product_floors.-search_floor')
    this._productSection = this.util.el('.-product-section')
    this.textarea_c = this.util.el('#copy')
    this.textarea_n = this.util.el('#copy-excel')
    this.page_no = this.util.el('#page-no')
    this.start = this.util.el('#find-btn')
    this.preview_skus = this.util.el('#preview-skus')
    this.shuffle_skus = this.util.el('#shuffle-skus')
    this.status = this.util.el('.-status')
    this.sort_status = this.util.el('.-sort-status')
    this.products_el = this.util.el('.-search_floor .-products')
    // this.checkboxes = this.util.all('.-filter input')
    this.discount_filter = this.util.el('#discount-filter')
    this.rating_filter = this.util.el('#rating-filter')
    this.category_filter = this.util.el('#category-filter')
    this.oos_filter = this.util.el('#oos-filter')
    this.sort_by = this.util.el('#sort-by')
    this.sort_by_stock = this.util.el('#sort-by-stock')
    this.sort_by_stock_wrap = this.util.el('.-sort.-by-stock')
    this.type = this.util.el('#type')
    this.find_control = this.util.el('.-find.-control')
    this.preview_control = this.util.el('.-preview.-control')
    this.controls = this.util.all('.-right .-control')
    this._imageObserver = null
    this.topcontrol = this.util.el('.-left .-top-control')
    this.country = this.util.el('#country')
    this.copy_btns = this.util.all('.-copy-btn')

    this.FLAGS = [
      { flag: false, txt: 'find' },
      { flag: true, txt: 'preview' }
    ]

    this.current_state = this.FLAGS[0]

    this.textareas = ['.-comma', '.-newline']

    this.comma = 'comma'
    this.newline = 'newline'
    this.PD = 'preview_delete'

    this.query = (class_name) => '.-' + class_name

    this.sku_url = 'https://www.jumia' + this.country.value + '/catalog/?q='
    this.domain = 'https://www.jumia' + this.country.value

    this.default_url = 'https://jumia.com.ng/mlp-holiday-sale-h-home-revamp'
    this.category_url = '/index/allcategories/'
    this.listeners()

    this.VALID_OOS = 'valid-oos'
    this.DISCOUNT = 'discount'
    this.RATING = 'rating'
    this.PRICE = 'price'
    this.CATEGORY = 'categories'
    this.categories = []

    this.sort_factor = this.PRICE

    this.L1L2Categories()
  }

  L1L2Categories() {
    var url = this.domain + this.category_url
    this.util.collect(url,this.CONTENT)
    .then(data => this.categories = data) 
    .catch(err => console.trace(err))
  }

  listeners() {
    this.start.addEventListener('click', () => this.begin())
    // this.checkboxes.forEach(checkbox => checkbox.addEventListener('click', () => { this.checked(checkbox) }))
    this.discount_filter.addEventListener('change', () => {
      this.sort_factor = this.DISCOUNT
      this.resetFilter(this.rating_filter)
      this.resetFilter(this.oos_filter)
      this.resetFilter(this.category_filter)
      this.resetFilter(this.sort_by)
      this.sort_status.textContent = 'SKUS will be sorted by ' + this.sort_factor
      this.filter({ range: this.discount_filter.value, type: this.DISCOUNT })
    })
    this.rating_filter.addEventListener('change', () => {
      this.sort_factor = this.RATING
      this.resetFilter(this.discount_filter)
      this.resetFilter(this.oos_filter)
      this.resetFilter(this.category_filter)
      this.resetFilter(this.sort_by)
      this.sort_status.textContent = 'SKUS will be sorted by ' + this.sort_factor
      this.filter({ range: this.rating_filter.value, type: this.RATING })
    })
    this.oos_filter.addEventListener('change', () => {
      this.sort_factor = this.PRICE
      this.resetFilter(this.discount_filter)
      this.resetFilter(this.rating_filter)
      this.resetFilter(this.category_filter)
      this.resetFilter(this.sort_by)
      this.sort_status.textContent = 'SKUS will be sorted by ' + this.sort_factor
      this.filter({ value: this.oos_filter.value, type: this.VALID_OOS })
    })
    this.sort_by.addEventListener('change', () => this.sort(this.sort_by.value))
    this.sort_by_stock.addEventListener('change', () => this.sort(this.sort_by_stock.value, true))
    this.type.addEventListener('click', () => { this.switchControl() })
    this.attachBinder()
    this.preview_skus.addEventListener('click', () => { this.previewSKUs() })
    this.shuffle_skus.addEventListener('click', () => { this.shuffleSKUs() })
    this.country.addEventListener('change', () => {
      this.reset()
      this.sku_url = 'https://www.jumia' + this.country.value + '/catalog/?q='
      this.domain = 'https://www.jumia' + this.country.value
    })
    this.copy_btns.forEach(btn => {
      btn.addEventListener('click', () => {
        var parent = btn.parentElement
        var textarea = parent.querySelector('textarea')
        this.clipboard(btn, 'copy', textarea)
      })
    })
    this.textarea_c.setAttribute('placeholder', 'copy skus...\nCU005FC0IQMTPNAFAMZ,TS657EA0HUFVQNAFAMZ...')
    this.textarea_n.setAttribute('placeholder', 'copy skus...\nCU005FC0IQMTPNAFAMZ\nTS657EA0HUFVQNAFAMZ...')
  }

  categoryListener() {
    this.category_filter.addEventListener('change', () => {
      this.sort_factor = this.CATEGORY
      this.resetFilter(this.discount_filter)
      this.resetFilter(this.rating_filter)
      this.resetFilter(this.oos_filter)
      this.resetFilter(this.sort_by)
      this.sort_status.textContent = 'SKUS will be sorted by ' + this.sort_factor
      this.filter({ el: this.category_filter, type: this.CATEGORY })
    })
  }

  clipboard(elem, event, input) {
    input.select()
    document.execCommand(event)
    elem.classList.add('-clicked')
    setTimeout(() => {
      elem.classList.remove('-clicked')
    }, 800);
  }

  shuffleSKUs() {
    this.data.sort( () => .5 - Math.random() )
    var skus = this.data.map(datum => datum.sku) 
    this.update(skus)
    this.attach()
  }

  previewSKUs() {
    if (this.skus.length === 0) 
      alert('paste skus in the textareas below in their respective formats')
    else {
      // this.sku_url = this.domain_el.textContent + '/catalog/?q='
      this.skus = this.skus.filter(sku => sku !== "")
      this.collectSKUData()
        .then(data => {
          this.preview_preloader.classList.remove('-loading')
          this.data = []
          this.data = data.filter(sku => sku !== undefined)
          this.buildCategoryFilter()
          this.attach()
        }).catch(err => {
          this.preview_preloader.classList.remove('-loading')
          console.log('err', err.message)
          this.attach()
        })
    }
  }

  collectSKUData() {
    this.valid = 0
    this.temp_valid = this.valid
    this.preview_preloader.classList.add('-loading')
    return Promise.all(
      this.skus.map((sku) => {
        var url = this.sku_url + sku
        return this.util.collect(url, this.PRODUCTS)
          .then(data => {
            this.valid++
            this.temp_valid = this.valid
            this.oos = this.skus.length - this.valid
            this.temp_oos = this.oos
            this.updateStatus(this.valid, this.oos, this.skus.length)
            return data.filtered[0]
          }).catch(err => {
            this.valid--;
            this.temp_valid = this.valid
            return {
              "sku": sku,
              "name": "out of stock",
              "brand": "oos",
              "sellerId": 0,
              "isShopGlobal": true,
              "categories": "out of stock",
              "prices": {
                "rawPrice": "0",
                "price": "N 0,000",
                "priceEuro": "0",
                "taxEuro": "0",
                "oldPrice": "0",
                "oldPriceEuro": "0",
                "discount": "0"
              },
              "stock": {
                "percent": 0,
                "text": "0 items left"
              },
              "rating": {
                "average": 0,
                "totalRatings": 0
              },
              "image": "https://ng.jumia.is/cms/0-1-weekly-cps/onsite-report/floor-product-templatev2.jpg",
              "url": '/catalog/?q=' + sku,
              "isBuyable": true,
              "shopGlobal": {
                "identifier": "global",
                "name": "Shipped from abroad"
              },
              "selectedVariation": sku
            }
          })
      })
    )
  }

  attachBinder() {
    // todo: transform newline textarea value to comma delimeted input and update in comma textarea
    var comma_el = this.util.el(this.query(this.comma))
    var newline_el = this.util.el(this.query(this.newline))

    var newline = { el: newline_el, symbol: '\n' }
    var comma = { el: comma_el, symbol: ',' }
    newline_el.addEventListener('keyup', () => { this.edit(newline, comma) })
    comma_el.addEventListener('keyup', () => { this.edit(comma, newline) })
  }

  edit(from, to) {
    this.bindTextareas(from, to)
    this.updateSKUList()
  }

  updateSKUList() {
    var comma_tarea = this.util.el(this.query(this.comma))
    this.skus = comma_tarea.value.split(',')
  }

  bindTextareas(from, to) {
    var to_str = from.el.value.split(from.symbol).join(to.symbol)
    to.el.value = to_str
  }

  switchControl() { 
    var json = this.FLAGS.filter(obj => obj.flag === this.type.checked)[0] 
    this.switch(json) 
    this.reset()
    this.updateStatus(0, 0, this.skus.length)
  }

  switch(json) {
    this.current_state = json
    // this.util.el('.-control.-' + json.txt).classList.add('active')
    this.topcontrol.setAttribute('data-action', json.txt)
    var action = json.txt === 'find' ? 'copy' : 'paste'
    this.textarea_c.setAttribute('placeholder', action + ' skus...\nCU005FC0IQMTPNAFAMZ,TS657EA0HUFVQNAFAMZ...')
    this.textarea_n.setAttribute('placeholder', action + ' skus...\nCU005FC0IQMTPNAFAMZ\nTS657EA0HUFVQNAFAMZ...')
  }

  filter(json) {
    this.data = this.subset(json)
    this.processUpdate()
  }

  processUpdate() {
    this.skus = this.data.map(datum => datum.sku)
    this.update(this.skus)
    this.statusCheckAndUpdate()
    this.preRender()
    this.render(this.data)
    this.listener()
  }

  sortByValue(value) {
    return this.data.sort((a, b) => {
      var a = this.sortObj(a)
      var b = this.sortObj(b)
      if (value === 'asc') { 
        return a[this.sort_factor] - b[this.sort_factor]
      } else { 
        return b[this.sort_factor] - a[this.sort_factor]
      }
    })
  }

  sortByStock(value) {
    return this.data.sort((a, b) => {
      var aStock = a.stock.text.split(' ')[0]
      var bStock = b.stock.text.split(' ')[0]
      if (value === 'asc') { 
        return parseInt(aStock) - parseInt(bStock)
      } else { 
        return parseInt(bStock) - parseInt(aStock)
      }
    })
  }

  sort(value, stock) {
    if (value !== "0") {
      this.data = stock ? this.sortByStock(value) : this.sortByValue(value)
    } else {
      this.data = this.unsorted_data
    }
    this.processUpdate()
  }

  sortObj(sku) {
    return {
      price: this.newPrice(sku.prices.price),
      discount: parseFloat(sku.prices.discount),
      rating: parseFloat(sku.rating.average),
      category: sku.categories.split('/')
    }
  }

  newPrice(price) {
    var with_currency = price.split('-')[0].trim()
    var without_currency = with_currency.split(' ')[1]
    var without_comma = without_currency.replace(',', '')
    return parseFloat(without_comma)
  }

  // checked(checkbox) {
  //   this.data = this.subset(checkbox)
  //   this.skus = this.data.map(datum => datum.sku)
  //   this.update(this.skus)
  //   this.statusCheckAndUpdate()
  //   this.render(this.data)
  //   this.listener()
  // }

  statusCheckAndUpdate(action) {
    if (action !== this.PD) {
      this.temp_oos = this.oos
      this.temp_valid = this.valid
    }
    var oos = this.temp_oos
    var valid = this.temp_valid
    if (this.current_state.txt === 'find')
      this.updateStatus(this.current_page, this.last_page, this.skus.length)
    else
      this.updateStatus(valid, oos, this.skus.length)
  }

  subset(json) {
    switch (json.type) {
      case this.VALID_OOS: return this.validOrOOS(json)
      case this.CATEGORY: return this.categoryFilter(json)
      default: return this.rangeFilter(json)
    }
    // return (json.type === this.VALID_OOS) ? this.validOrOOS(json) : this.rangeFilter(json)
  }

  buildCategoryFilter() {
    var sku_categories = this.data.map(sku => sku.categories.split('/')[0])
    var unique_categories = [...new Set(sku_categories)]
    var html = '<option selected value="0">Category...</option>'
    unique_categories.map(category => {
      html += `<option data-href="${this.categoryLink(category).L1_href}" value="${category}">${category}</option>`
    })
    this.category_filter.innerHTML = html
    this.categoryListener()
  }

  categoryLink(category) { 
    var category_object = this.categories.find(cat => cat.L1_name === category)
    return category_object || {}
  }

  categoryFilter(json) {
    var value = json.el.value
    var link = json.el.getAttribute('data-href')
    var filtered = this.original.filter(sku => {
      var sku_L1 = sku.categories.split('/')[0]
      return value === sku_L1
    })
    return filtered
  }

  rangeFilter(json) {
    var boundary = json.range.split('-')
    var type = json.type
    var min = parseInt(boundary[0])
    var max = parseInt(boundary[1])

    if (min === 0 && max === 0)
      return this.original.filter(datum => datum.rating.average === 0)
    else if (isNaN(max)) return this.original
    else {
      return this.original.filter(datum => {
        if (type === 'discount') {
          var discount = parseInt(datum.prices.discount)
          return discount >= min && discount < max
        }
        if (type === 'rating') {
          var rating = parseFloat(datum.rating.average)
          return rating >= min && rating < max
        }
      })
    }
  }
  
  validOrOOS(json) {
    var value = json.value
    return this.original.filter(datum => {
      if (value === 'oos') return datum.brand === 'oos'
      else return datum.brand !== 'oos'
    })
  }

  // subset(checkbox) {
  //   var name = checkbox.getAttribute('id')
  //   if (name === 'discount') {
  //     if (checkbox.checked) return this.original.filter(datum => parseInt(datum.prices.discount) > 0)
  //     else return this.original
  //   } else if (name === 'rating') {
  //     if (checkbox.checked) return this.original.filter(datum => datum.rating.average && datum.rating.average > 0)
  //     else return this.original
  //   } else if (name === 'valid') {
  //     if (checkbox.checked) return this.original.filter(datum => datum.brand !== 'oos')
  //     else return this.original
  //   } else if (name === 'oos') {
  //     if (checkbox.checked) return this.original.filter(datum => datum.brand === 'oos')
  //     else return this.original
  //   } else return this.original
  // }

  reset() {
    this.skus = []
    this.data = []
    this.original = []
    this.last_page = 1
    this.url = ''
    this.current_page = 1
    this.textarea_c.value = ''
    this.textarea_n.value = ''
    this.products_el.innerHTML = ''
    this.resetFilter(this.discount_filter)
    this.resetFilter(this.rating_filter)
    this.resetFilter(this.oos_filter)
    this.resetFilter(this.category_filter)
    this.resetFilter(this.sort_by)
  }

  resetFilter(el) {
    var options = el.querySelectorAll('option')
    options.forEach(option => option.selected = false)
    options[0].selected = true
    el.value = options[0].getAttribute('value')
  }

  begin() {
    this.reset()
    var url = this.searchInput.value
    var page_no = parseInt(this.page_no.value)
    var isValidUrl = this.isValidUrl(url)
    var isANumber = !isNaN(page_no) && (page_no > 0)

    !isValidUrl && alert('Enter a valid url')
    !isANumber && alert('Enter a valid number from 1')

    if (isValidUrl && isANumber) {
      this.url = url
      this.last_page = page_no
      this.updateData()
    }
  }

  updateData() {
    var anchor_idx = this.url.indexOf('#catalog-listing')
    this.url = anchor_idx === -1 ? this.url : this.url.substring(0, anchor_idx)
    var paged_url = this.url + (this.url.indexOf('?') === -1 ? '?page=' : '&page=') + this.current_page
    this.collect(paged_url)
  }

  collect(href) {
    if (href) {
      this.preloader.classList.add('-loading')
      return this.util.collect(href, this.PRODUCTS)
        .then(data => this.attachData(data.filtered))
        .then(_ => this.update(this.skus))
        .then(_ => this.buildCategoryFilter())
        .catch(err => this.unsuccessful(err, href))
    } else return Promise.resolve([])
  }

  attach() {
    this.original = []
    this.data.map(datum => this.original.push(datum)) // backup of all skus
    this.preRender()
    this.render(this.original)
  }

  preRender() {
    this.unsorted_data = JSON.parse(JSON.stringify(this.data))
  }
  

  render(data) {
    // this.current_page = 1
    this.products_el.innerHTML = ''
    this.products_el.innerHTML = this.catSKUs(data)
    this._imageObserver = new ImageObserver(this._productSection)
    this._imageObserver = null
    this.listener()
    location.href = '#container'
  }

  process(data) {
    // this.checkboxes.forEach(checkbox => checkbox.checked = false)
    // this.checkboxes[0].checked = true
    data.map(datum => this.data.push(datum))
    data.map(datum => this.skus.push(datum.sku))
    if (this.current_page <= this.last_page) {
      // this.updateStatus(this.current_page, this.skus.length)
      this.updateStatus(this.current_page, this.last_page, this.skus.length)
      if (this.current_page === this.last_page) this.attach()
      else {
        this.current_page++
        this.updateData()
      }
    }
  }

  attachData(data) {
    localStorage.setItem('data', JSON.stringify(data))
    this.preloader.classList.remove('-loading')
    data.length !== 0 ? this.process(data) : this.collect(this.default_url)
    return data
  }

  updateStatus(one, two, three) {
    var th_one = this.status.querySelector('.-th-one')
    var th_two = this.status.querySelector('.-th-two')
    var th_three = this.status.querySelector('.-th-three')
    var td_one = this.status.querySelector('.-td-one')
    var td_two = this.status.querySelector('.-td-two')
    var td_three = this.status.querySelector('.-td-three')

    th_one.textContent = this.current_state.txt === this.FLAGS[0].txt ? 'page' : 'valid'
    th_two.textContent = this.current_state.txt === this.FLAGS[0].txt ? 'max. page' : 'OOS'
    th_three.textContent = 'total'
    td_one.textContent = one
    td_two.textContent = two
    td_three.textContent = three
  }

  isValidUrl(string) {
    let url;

    try { url = new URL(string) }
    catch (_) { return false; }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  idx(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  unsuccessful(err) {
    this.preloader.classList.remove('-loading')
    // this.status.textContent = "could not fetch skus beyond page " + this.current_page
    this.attach()
    console.log('error fetching because', err)
  }

  randomIndex(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  listener() {
    var closes = this.util.all('.-product .-close')
    closes.forEach(close => {
      var product = close.parentElement
      close.addEventListener('click', _ => { this.delete(product)})
      this.preventAnchorDefault(product)
    })
  }

  delete(product) {
    var sku = product.getAttribute('data-sku')
    this.skus = this.skus.filter(datum => datum !== sku)
    this.products_el.removeChild(product)
    this.update(this.skus) 
    this.dataCheckAndUpdate(sku)
    this.statusCheckAndUpdate(this.PD) 
  }

  preventAnchorDefault(product) {
    var anchor = product.querySelector('.-img')
    anchor.addEventListener('click', evt => evt.preventDefault())
  }

  dataCheckAndUpdate(sku) {
    var found = this.data.find(datum => datum.sku === sku)
    found.brand === 'oos' ? this.temp_oos-- : this.temp_valid--
  }

  update(skus) {
    this.textarea_c.value = skus
    this.textarea_n.value = skus.join('\n')
  }

  debounce(fn, delay) {
    var timer = null;

    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(context, args); }, delay)
    }
  }

  catSKUs(skus) {
    console.log(skus)
    var html = ''
    skus.map((sku, idx) => {
      var discount = sku.prices.discount ? '<div class="-discount -inlineblock -vamiddle">' + sku.prices.discount + '</div>' : ''
      var rating = sku.rating.average ? '<div class="-rating -inlineblock -vamiddle">' + sku.rating.average + ' ✯</div>' : ''
      var pos = idx + 1
      var position = '<input type="number" class="-posabs -position" data-pos="' + pos + '" value="' + pos + '"/>'
      // html += '<div class="-product -inlineblock -vatop -posrel" data-sku="' + sku.sku + '"><a class="-img" href="' + this.domain + sku.url + '"><img data-src="' + sku.image + '" class="lazy-image" alt="floor product"/></a>' + discount + rating  + '<div class="-name">' + sku.name + '</div><div class="-prices"><div class="-price -new">' + sku.prices.price + '</div><div class="-price -old">' + (sku.prices.oldPrice ? sku.prices.oldPrice : '') + '</div></div><span class="-posabs -close"></span><div class="-sku-no">' + sku.sku + '</div></div>'
      var stock = sku.stock ? `<div class="-stock -posabs">${sku.stock.text}</div>` : ''
      var fn = this.sort_by_stock_wrap.classList
      sku.stock ? fn.remove('-hide') : fn.add('-hide')
      html += `<div class="-product -inlineblock -vatop -posrel" data-sku="${sku.sku}">${stock}${position} <a class="-img" href="${this.domain}${sku.url}"><img data-src="${sku.image}" class="lazy-image" alt="floor product" /></a><div class="-discount-rating">${discount} ${rating} </div><div class="-name">${sku.name}</div><div class="-prices"><div class="-price -new">${sku.prices.price}</div><div class="-price -old">${sku.prices.oldPrice ? sku.prices.oldPrice :''}</div></div><span class="-posabs -close"></span><div class="-sku-no">${sku.sku}</div></div>`
    })
    return html
  }
}

class ImageObserver {
  constructor(parent) {
    this.images = parent.querySelectorAll('.lazy-image')

    this.observer = null
    try {
      this.observer = new IntersectionObserver(this.onIntersection.bind(this), {})
      this.images.forEach(image => this.observer.observe(image))
    } catch (error) {
      this.images.forEach(image => this.lazyLoadImage(image))
    }
  }

  lazyLoadImage(image) {
    var self = this
    if (!image.src) {
      image.src = image.getAttribute('data-src')
      image.onload = () => this.afterLoad(image, self)
    } else this.afterLoad(image, self)
  }

  afterLoad(image, self) {
    image.classList.add('loaded')
    self.removeLoaderBCompat(image)
  }

  removeLoaderBCompat(image) {
    var parent = image.parentElement
    var preloader = parent.querySelector('.-preloader');
    (preloader) && preloader.classList.remove('-loading')
  }

  onIntersection(imageEntites) {
    imageEntites.forEach(image => {
      if (image.isIntersecting) {
        this.observer.unobserve(image.target)
        image.target.src = image.target.dataset.src
        image.target.onload = () => {
          image.target.classList.add('loaded')
          this.removeLoader(image)
        }
      }
    })
  }

  /**
  * 
  * @param {IntersectionObserverEntry} image 
  */
  removeLoader(image) {
    var parent = image.target.parentElement
    var preloader = parent.querySelector('.-preloader');
    preloader && preloader.classList.remove('-loading')
  }

}

if (window.innerWidth > 600) {
  var util = new Util()
  new SKUCollector(util)
}