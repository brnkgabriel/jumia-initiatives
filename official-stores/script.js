const Begin = function (config) {

  class Util {
    constructor(config) {
      this.ID = "official-stores"
      this.DATA_AVAILABLE = "data available" 
      this.MAX_ITEM_PER_COL = 2
      this.MIN_FOR_2_PER_COL = 18
      this.TYPES = {
        brand: "brand",
        about: "about",
        category: "category"
      }

      this.isMobile = "ontouchstart" in window;

      this.host = 'https://www.jumia'
      this.el               = (query, parent) => parent ? parent.querySelector(query) : document.querySelector(query)
      this.all              = (query, parent) => parent ? parent.querySelectorAll(query) : document.querySelectorAll(query)
      this.escapeStr        = string => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      this.mainEl           = this.el(".-main-el")
      this.topBannerEl      = this.el(".-top-banner")
      this.initiativeEl     = this.el("#initiative")
      this.fetched          = this.el(".-fetched")
      this.brandMap = {}
    }
  }
  class PubSub {
    constructor() {
      this.events = {};
    }

    subscribe(eventName, fn) {
      this.events[eventName] = this.events[eventName] || [];
      this.events[eventName].push(fn);
    }

    unsubscribe(eventName, fn) {
      if (this.events[eventName]) {
        const idx = this.events[eventName].findIndex((fxn) => fxn === fn);
        this.events[eventName].splice(idx, 1);
      }
    }

    emit(eventName, data) {
      if (this.events[eventName]) {
        this.events[eventName].forEach((fn) => fn(data));
      }
    }
  }

  class ImageObserver {
    constructor(parent) {

      this.initialize(parent)
    }

    initialize(parent) { 
      this.images = parent ? parent.querySelectorAll(".lazy-image") : document.querySelectorAll(".lazy-image")
      this.preloaders = parent ? parent.querySelectorAll(".-preloader") : document.querySelectorAll(".-preloader")

      this.images.forEach(this.lazyLoad.bind(this))
    }

    /**
     * 
     * @param {HTMLImageElement} image 
     */
    lazyLoad(image) {
      if (image.src !== undefined) {
        image.src = image.getAttribute("data-src")
        image.onload = () => this.afterLoad(image)
      } else this.afterLoad(image)
    }

    /**
     * 
     * @param {HTMLImageElement} image 
     */
    afterLoad(image) {
      image.classList.add("loaded")
      const preloader = image.parentElement.querySelector(".-preloader") 
      this.removeLoader(preloader)
      this.preloaders.forEach(this.removeLoader.bind(this))
    }
    removeLoader(el) {
      el.classList.remove("-loading")
      /** el.classList.add("-hide") */
    }
  }

  class Controller extends Util {
    constructor(config) {
      super(config)

      this.database = new Database(config)
      this.superblocksAndBanners = new SuperblocksAndBanners(config)
    }
  }

  class SuperblocksAndBanners extends Util {
    constructor(config) {
      super(config)
      this.isACategoryBrand = (brand, key) => brand.category.toLowerCase() === key
      this.isCompleteColumn = i => i % this.MAX_ITEM_PER_COL === 0 && i !== 0

      pubsub.subscribe(this.DATA_AVAILABLE, this.process.bind(this))
    }

    process(data) { 
      this.domain = this.host + data.config.countryLocale + "/"
      const list = data.categories.map(category => {
        const catKey = category.name.toLowerCase()
        category.brands = data.brands.filter(brand => this.isACategoryBrand(brand, catKey))
        return category
      }).sort((a, b) => b.brands.length - a.brands.length)

      console.log(list) 
      this.build(list)
      .setBanner(data.config)
      .show()
      .listeners()
    }

    listeners() {
      this.initiativeEl.addEventListener("click", evt => {
        const target = evt.target
        const type = target.getAttribute("data-type")
        switch (type) {
          case this.TYPES.brand:
            const brandName = target.parentElement.getAttribute("data-brand")
            const obj = this.brandMap[brandName]
            console.log("obj", obj)
            const superblock = this.el(`.-superblock[data-name="${obj.category}"]`)
            const productFloor = this.el(".-productfloor", superblock)
            const productFloorTitle = this.el(".-productfloor .-title", superblock)
            const productFloorSeeAll = this.el(".-see-all", superblock)
            productFloorTitle.textContent = `${obj.name} top deals`
            const brandUrl = `${this.domain}${obj.url}`
            productFloorSeeAll.setAttribute("href", brandUrl)
            this.getProducts(brandUrl, productFloor)
            break;
        
          default:
            break;
        }
      })
    }
    

    getProducts(url, productfloor) {
      productfloor.classList.remove("active")
      return fetch(url)
      .then(res => res.text())
      .then(this.extractProducts.bind(this))
      .then(data => this.onSuccess(data, productfloor))
      .catch(err => this.onError(err, productfloor))
    }

    onSuccess(data, productfloor) {
      const actual = this.el(".-skus.-actual", productfloor)
      console.log("data is", data)
      actual.innerHTML = data.map(this.skuHtml.bind(this)).join("")
      this.show()
      productfloor.classList.add("active")
    }
    
    onError(err, productFloor) {
      productfloor.classList.add("active")
    }

    extractProducts(data) {
      var rawProducts = this.products(data)
      var formatted = this.format(rawProducts)
      return JSON.parse(formatted).products
    }

    format(rawProducts) {
      return this.isMobile ? this.mobile(rawProducts) : this.desktop(rawProducts) 
    }
    products(data) {
      this.fetched.innerHTML = data;
      var textC = [], scripts = this.fetched.querySelectorAll('script')
      this.fetched.innerHTML = ''
      scripts.forEach(script => textC.push(script.innerHTML))
      var foundIdx = textC.findIndex(script => script.indexOf('"products":[{') !== -1)
      return textC[foundIdx]
    }
    mobile(pageText) {
      var startIdx = pageText.indexOf('"products":')
      var products = '{' + pageText.substring(startIdx, pageText.length)
      var endIdx = products.indexOf(',"head"')
      return products.substring(0, endIdx - 1) + '}'
    }

    desktop(pageText) {
      var startIdx = pageText.indexOf('"products":')
      var products = '{' + pageText.substring(startIdx, pageText.length)
      var closing_brace_indices = this.braceIndices(products, this.escapeStr("}]"))
      var endIdx = closing_brace_indices[closing_brace_indices.length - 1]
      return products.substring(0, endIdx + 2) + '}'
    }
    
    braceIndices(str, brace) {
      var regex = new RegExp(brace, "gi"), result, indices = []
      while ((result = regex.exec(str))) { indices.push(result.index) }
      return indices
    } 

    setBanner(config) {
      const { desktopBanner, mobileAppBanner } = config
      const banner = this.isMobile ? mobileAppBanner : desktopBanner
      this.topBannerEl.setAttribute("data-src", banner)
      return this
    }

    show() {
      this.imageObserver = new ImageObserver()
      this.imageObserver = null
      return this
    }

    build(list) {
      this.mainEl.innerHTML = list.map(this.buildSuperblock.bind(this)).join("")
      return this
    }

    buildSuperblock(superblock) {
      const superblockOpeningTag = `<div class="-superblock" data-name="${superblock.name}">`
      const superblockClosingTag = '</div>'
      
      let superblockHtml = superblockOpeningTag
      const title = `<div class="-title" style="background-color: ${superblock.backgroundColor};color:${superblock.fontColor}">${superblock.name}</div>`
      const freelinks = this.buildFreelinks(superblock.brands)
      const productFloor = this.buildProductFloor({
        skus: superblock.skus,
        url: superblock.url,
        name: superblock.name,
        fontColor: superblock.fontColor,
        backgroundColor: superblock.backgroundColor
      })
      superblockHtml += superblock.brands.length >= 1 ? title : ""
      superblockHtml += freelinks
      superblockHtml += productFloor
      superblockHtml += superblockClosingTag
      return superblock.skus.length >= 7 ? superblockHtml : ""
    }

    buildFreelinks(brands) {
      return brands.length >= this.MIN_FOR_2_PER_COL
      ? this.twoPerCol(brands) : this.onePerCol(brands)
    }

    twoPerCol(brands) {
      const brandsColOpeningTag = '<div class="-brands-col">'
      const brandsHtmlOpeningTag = '<div class="-brands">'
      const brandsColClosingTag = '</div>'
      const brandsHtmlClosingTag = '</div>'

      let brandsHtml = brandsHtmlOpeningTag
      let brandsCol = brandsColOpeningTag
      for (let i = 0; i < brands.length; i++) {
        const brand = brands[i]
        this.brandMap[brand.name] = brand
        brandsCol += `<a href="${this.domain}${brand.url}" class="-brand -posrel" data-brand="${brand.name}" data-url="${brand.url}"><span class="-posabs -preloader -loading" data-type="brand"></span><img class="lazy-image" data-src="${brand.logo}" alt="${brand.name}"/></a>`

        if (this.isCompleteColumn(i)) {
          brandsCol += brandsColClosingTag
          brandsHtml += brandsCol
          brandsCol = brandsColOpeningTag
        }
      }

      brandsHtml += brandsHtmlClosingTag
      return brandsHtml
    }

    onePerCol(brands) {
      let brandsHtml = '<div class="-brands">'
      brandsHtml += brands.map(this.onePerColHtml.bind(this)).join("")
      brandsHtml += '</div>'
      return brandsHtml
    }

    onePerColHtml(brand) {
      this.brandMap[brand.name] = brand
      return `<a href="${this.domain}${brand.url}" class="-brand -posrel" data-brand="${brand.name}" data-url="${brand.url}"><span class="-posabs -preloader -loading" data-type="brand"></span><img class="lazy-image" data-src="${brand.logo}" alt="${brand.name}"/></a>`
    }
    

    buildProductFloor(json) {
      const { skus, url, name, fontColor, backgroundColor } = json
      let html = `<div class="-productfloor active" data-name="${name}">`
      const header = `<div class="-header" style="background-color:${backgroundColor}"><div class="-title" style="color:${fontColor}">${name} top deals</div><a href="${url}" class="-see-all" style="color:${fontColor}"><span class="-txt">See all</span><span class="-arrow" style="border: 2px solid ${fontColor}"></span></a></div>`
      html += header
      html += `<div class="-skus -actual">${skus.map(this.skuHtml.bind(this)).join("")}</div><div class="-skus -skeleton"><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div></div>`
      html += "</div>"
      return html
    }

    skuHtml(skuObj) {
      const {
        sku, displayName,
        url, prices: { oldPrice, price, discount },
        image
      } = skuObj
      const discountHtml = discount ? `<div class="-discount -posabs">${discount}</div>` : ""
      const oldPriceHtml = discount ? `<div class="-oldPrice">${oldPrice}</div>` : ""
      const href = this.domain + url
      return `
      <a href="${href}" data-sku="${sku}" class="-posrel -sku"><div class="-img -posrel"><span class="-posabs -preloader -loading"></span><img class="lazy-image" data-src="${image}" alt="${displayName}"/></div>${discountHtml} <div class="-details"><div class="-name">${displayName}</div><div class="-newPrice">${price}</div>${oldPriceHtml}</div></a>
      `
    }
  }

  class Database extends Util {
    constructor(config) {
      super(config)
      
      this.send = data => pubsub.emit(this.DATA_AVAILABLE, data)
      this.initialize(config)
    }

    initialize(config) {
      this.config = config

      const app = firebase.initializeApp(this.config, this.config.projectId)
      this.db   = app.firestore()

      this.get()
    }

    get() {
      this.mainEl.classList.add("-loading")
      return this.db.collection(this.ID)
      .doc("data").get()
      .then(this.onSuccess.bind(this))
      .catch(this.onError.bind(this))
    }

    onSuccess(doc) { 
      this.mainEl.classList.remove("-loading")
      const data = doc.exists ? doc.data() : {}
      this.send(data)
    }

    onError(err) {
      this.mainEl.classList.remove("-loading")
      console.info(err)
      this.send({})
    }

    set(data) {
      return this.db
      .collection(this.ID)
      .doc("data")
      .set(data, { merge: true })
    }
  }

  const pubsub = new PubSub()
  new Controller(config)
}

const config = {
  apiKey: "AIzaSyCKGQw8QCq8qcxJ39QznQgarzOLP_WF1_Q",
  authDomain: "jumia-17681.firebaseapp.com",
  databaseURL: "https://jumia-17681.firebaseio.com",
  projectId: "jumia-17681",
  storageBucket: "jumia-17681.appspot.com",
  messagingSenderId: "472156067665",
  appId: "1:472156067665:web:976495829b072466"
}

const interval = setInterval(() => {
  if (/loaded|complete/.test(document.readyState)) {

    clearInterval(interval)
    Begin(config)
  }
})