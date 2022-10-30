const Begin = function (config) {

  class Util {
    constructor(config) {
      this.ID = "official-stores"
      this.DATA_AVAILABLE = "data available" 
      this.MAX_ITEM_PER_COL = 2
      this.MIN_FOR_2_PER_COL = 18
      this.DESKTOP_SIDX = 'window.__STORE__='
      this.DESKTOP_EIDX = '};</scr'
      this.MOBILE_SIDX = "window.__INITIAL_STATE__="
      this.MOBILE_EIDX = ";window.__CONFS__"
      this.TYPES = {
        brand: "brand",
        about: "about",
        category: "category",
        dirBtn: "dir-btn"
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
      this.about            = this.el(".-re.-rules")
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
      this.brandMap = {}
      this.isACategoryBrand = (brand, key) => brand.category.toLowerCase() === key
      this.isCompleteColumn = i => i % this.MAX_ITEM_PER_COL === 1

      pubsub.subscribe(this.DATA_AVAILABLE, this.process.bind(this))
    }

    process(data) {
      const list = data.categories.map(category => {
        const catKey = category.name.toLowerCase()
        category.brands = data.brands.filter(brand => this.isACategoryBrand(brand, catKey))
        return category
      }).sort((a, b) => b.brands.length - a.brands.length)

      this.build(list)
      .setBanner(data.config)
      .setAbout(data.about)
      .show()
      .listeners()
    }

    getMap() {
      console.log(this.brandMap)
    }

    listeners() {
      this.initiativeEl.addEventListener("click", evt => {
        const target = evt.target
        const type = target.getAttribute("data-type")
        switch (type) {
          case this.TYPES.brand:
            const brandName = target.parentElement.getAttribute("data-brand")
            const obj = this.brandMap[brandName]
            const superblock = this.el(`.-superblock[data-name="${obj.category}"]`)
            const productFloor = this.el(".-productfloor", superblock)
            const productFloorTitle = this.el(".-productfloor .-title", superblock)
            const productFloorSeeAll = this.el(".-see-all", superblock)
            productFloorTitle.textContent = `${obj.name} top deals` 
            productFloorSeeAll.setAttribute("href", obj.url) 
            this.updateProductFloor(obj.skus, productFloor)
            break;

          case this.TYPES.dirBtn:
            const control = target.parentElement
            const scrollable = this.el(".-scrollable", control.parentElement)
            const direction = control.getAttribute("data-dir")
            this[`scrollTo${direction}`](scrollable)
            break
          
          case this.TYPES.about:
            this.toggleBanner(target)
            break
        
          default:
            break;
        }
      })
    }
    
    scrollTonext(scrollable) {
      var start = scrollable.scrollLeft + 80, end = scrollable.scrollLeft + 300
      var delta = end - start;
      scrollable.scrollLeft = start + delta * 1;
    }

    scrollToprev(scrollable) {
      var start = scrollable.scrollLeft - 80, end = scrollable.scrollLeft - 300
      var delta = end - start;
      scrollable.scrollLeft = start + delta * 1;
    } 

    updateProductFloor(data, productfloor) {
      const actual = this.el(".-skus.-actual", productfloor)
      actual.innerHTML = `<div class="-scrollable">${data.map(this.skuHtml.bind(this)).join("")}</div>`
      this.show()
      productfloor.classList.add("active")
    }

    setBanner(config) {
      const { desktopBanner, mobileAppBanner } = config
      const banner = this.isMobile ? mobileAppBanner : desktopBanner
      this.topBannerEl.setAttribute("data-src", banner)
      return this
    }

    setAbout(aboutList) {
      this.about.innerHTML = aboutList.map(this.aboutHtml.bind(this)).join("")
      return this
    }

    toggleBanner(target) {
      const btn = target.parentElement
      const banner = btn.parentElement
      banner.classList.toggle('-show')
      const hiw_txt = btn.querySelector('.-txt')
      hiw_txt.textContent = banner.classList.contains("-show") ? 'Close' : 'About Official Stores'
    }
    
    aboutHtml(about) {
      return `<div class="-rule_element"><div class="-vatop -num">${about.num}.</div><div class="-vatop -desc">
      <div class="-question">${about.question}</div><div class="-answer">${about.answer}</div>
      </div></div>`
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
      const title = `<div class="-title" style="background-color: ${superblock.backgroundColor};color:${superblock.fontColor}">
      <div class="-text">${superblock.name}</div>
      <div class="-switch">switch</div>
      </div>`
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
      const prevNextButtons = this.isMobile ? '' : '<div class="-control -prev -posabs" data-dir="prev"><span class="-posabs -preloader -loading" data-type="dir-btn"></span></div><div class="-control -next -posabs" data-dir="next"><span class="-posabs -preloader -loading" data-type="dir-btn"></span></div>'
      
      const shoppingCart = `<div class="icon-cart -hide"><div class="cart-line-1" style="background-color: #fff"></div><div class="cart-line-2" style="background-color: #fff"></div><div class="cart-line-3" style="background-color: #fff"></div><div class="cart-wheel" style="background-color: #fff"></div></div>`

      const market = `<label class="demo -hide"><i class="icono-market"></i></label>`

      const json = { brands, prevNextButtons, shoppingCart, market }
      return brands.length >= this.MIN_FOR_2_PER_COL
      ? this.twoPerCol(json) : this.onePerCol(json)
    }

    single2MultidimensionalArray(singleDimensionalList) {
      const len = singleDimensionalList.length
      const multidimensionalList = []
      let subset = []
    
      const isTheStartOfNewArray = i => i !== 0 && (i % this.MAX_ITEM_PER_COL) === 0
      const isLastElementInList = i => i === len - 1
      const storeAndClearSubset = (i, singleDimensionalList) => {
        multidimensionalList.push(subset)
        subset = []
        subset.push(singleDimensionalList[i])
      }
    
      for (let i = 0; i < len; i++) {
    
        if (isTheStartOfNewArray(i)) {
          storeAndClearSubset(i, singleDimensionalList)
          isLastElementInList(i) && multidimensionalList.push(subset)
          continue
        }
    
        subset.push(singleDimensionalList[i])
        isLastElementInList(i) && multidimensionalList.push(subset)
      }
      return multidimensionalList
    }    

    twoPerCol(json) {
      const { brands, prevNextButtons, shoppingCart, market } = json

      let multidimensionalBrands = this.single2MultidimensionalArray(brands)
      const len = multidimensionalBrands.length

      const brandsColOpeningTag = '<div class="-brands-col">'
      const brandsHtmlOpeningTag = `<div class="-brands -posrel -double">`
      const closingDiv = '</div>'
      let brandsHtml = brandsHtmlOpeningTag + (len < 7 ? '' : prevNextButtons)
      let scrollableHtml = `<div class="-scrollable">`

      for (let i = 0; i < len; i++) {
        const brandsCol = multidimensionalBrands[i]
        const rowLen = brandsCol.length
        let brandsColHtml = brandsColOpeningTag

        for (let j = 0; j < rowLen; j++) {
          const brand = brandsCol[j]
          brandsColHtml += this.brandHtml(brand, { shoppingCart, market })
        }
        brandsColHtml += closingDiv
        scrollableHtml += brandsColHtml
      }
      scrollableHtml += closingDiv
      brandsHtml += scrollableHtml
      brandsHtml += closingDiv
      return brandsHtml
    }

    brandHtml(brand, json) { 
      const { shoppingCart, market } = json
      this.brandMap[brand.name] = brand 
      return `<div class="-brand -posrel" data-brand="${brand.name}" data-url="${brand.url}"><span class="-posabs -preloader -loading" data-type="brand"></span>${shoppingCart}${market}<img class="lazy-image" data-src="${brand.logo}" alt="${brand.name}"/></div>`
    }

    onePerCol(json) {
      const { brands, prevNextButtons, shoppingCart, market } = json

      let brandsHtml = '<div class="-brands -posrel -single">'
      brandsHtml += brands.length < 7 ? '' : prevNextButtons
      brandsHtml += `<div class="-scrollable">${brands.map(brand => this.brandHtml(brand, json)).join("")}</div>`
      brandsHtml += '</div>'
      return brandsHtml
    } 
    
    buildProductFloor(json) {
      const { skus, url, name, fontColor, backgroundColor } = json
      const prevNextButtons = this.isMobile ? '' : `<div class="-control -prev -posabs" data-dir="prev"><span class="-posabs -preloader -loading" data-type="dir-btn"></span></div><div class="-control -next -posabs" data-dir="next"><span class="-posabs -preloader -loading" data-type="dir-btn"></span></div>`
      
      let html = `<div class="-productfloor active -posrel" data-name="${name}">${prevNextButtons}`
      const header = `<div class="-head" style="background-color:${backgroundColor}"><div class="-title" style="color:${fontColor}">${name} top deals</div><a href="${url}" class="-see-all" style="color:${fontColor}"><span class="-txt">See all</span><span class="-arrow" style="border: 2px solid ${fontColor}"></span></a></div>`
      html += header
      html += `<div class="-skus -actual"><div class="-scrollable">${skus.map(this.skuHtml.bind(this)).join("")}</div></div><div class="-skus -skeleton"><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div></div>`
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
      return `
      <a href="${url}" data-sku="${sku}" class="-posrel -sku"><div class="-img -posrel"><span class="-posabs -preloader -loading"></span><img class="lazy-image" data-src="${image}" alt="${displayName}"/></div>${discountHtml} <div class="-details"><div class="-name">${displayName}</div><div class="-newPrice">${price}</div>${oldPriceHtml}</div></a>
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