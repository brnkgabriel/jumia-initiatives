var Featurebox = (function (json) {

  class Util {
    constructor() {
      this.initialize()
    }
    initialize() {
      this.DATA_ARRIVES = "data arrives"
      this.COLLECTION = config.collection || "marketing-initiatives"
      this.FILTER_UPDATED = "filter updated"
      this.UPDATE_URL = "update url"
      this.FREELINKS_BUILT = "freelinks built"
      this.FREELINK_NAME = json.freelink ? json.freelink : "Userneed"
      this.GIFT_FINDER = "Gift Finder"
      
      this.isMobile = navigator.userAgent.toLowerCase().includes("mobi")
      this.urlParams = {
        brand: "",
        rating: "",
        price: "",
        discount: "",
        shop_premium_services: "",
        shipped_from: "",
        search: "",
        category: "",
        page: "",
        sort: "",
        tag: "",
        type: ""
      }

      /**
       * 
       * @param {string} query 
       * @param {string} parent 
       * @returns {HTMLElement}
       */
      this.el = (query, parent) => parent ? parent.querySelector(query) : document.querySelector(query)
      /**
       * 
       * @param {string} query 
       * @param {string} parent 
       * @returns {HTMLElement[]}
       */
      this.all = (query, parent) => parent ? parent.querySelectorAll(query) : document.querySelectorAll(query)
      /**
       * 
       * @param {string} query 
       * @returns {HTMLElement}
       */
      this.create = query => document.createElement(query)

      /**
       * 
       * @param {object} json 
       * @returns {string}
       */
      this.filtersUrl = json => json.host + "/catalog/filters/?return=" + json.url
    }

    url(json, domain) {
      const catalog = json.search !== "" ? domain.catalogSearch : domain.catalog
      const category = json.category
      const brand = json.brand
      let link = catalog
      const search = json.search

      link += category !== "" ? `/${category}/`: ""
      link += brand !== "" ? `/${brand}/` : ""
      link += "?"
      link += search !== "" ? `q=${search}&` : ""

      const otherFilters = Object.keys(json)
      .filter(key => this.otherFilters(key, json))
      .map(key => this.unite(key, json))
      .join("&")

      const url = link + otherFilters
      return url
    }

    unite(key, json) {
      return `${key}=${json[key]}`
    }

    otherFilters(key, json) {
      return json[key] !== "" &&
      key !== "category" &&
      key !== "brand" &&
      key !== "search"
    }
  }

  class PubSub {
    constructor() {
      this.events = {}
    }

    subscribe(eventName, fn) {
      this.events[eventName] = this.events[eventName] || []
      this.events[eventName].push(fn)
    }

    unsubscribe(eventName, fn) {
      if (this.events[eventName]) {
        const idx = this.events[eventName].findIndex(fxn => fxn === fn)
        this.events[eventName].splice(idx, 1)
      }
    }

    emit(eventName, data) {
      if (this.events[eventName]) { this.events[eventName].forEach(fn => fn(data)) }
    }
  }

  class Database {
    constructor(config) {
      this.initialize(config)
    }

    initialize(config) {
      this.app = firebase.initializeApp(config)
      this.firestore = this.app.firestore()
      this.getDoc(util.COLLECTION, "data")
    }

    getDoc(collection, docRef) {
      return this.firestore.collection(collection).doc(docRef)
      .get().then(doc => pubsub.emit(util.DATA_ARRIVES, doc.exists ? doc.data() : {}))
      .catch(err => console.error(err))
    }

    setDoc(collection, docRef, data) {
      const ref = this.firestore.collection(collection).doc(docRef)
      return ref.set(data, { merge: true })
    }
  }

  class PreProcess {
    constructor() {
      this.initialize()
    }

    initialize() {
      this.span = util.create("span")
      this.span.className = "-loading -posabs -preloader"
      window.addEventListener("load", this.cartSectionAdjustments.bind(this))
    }

    cartSectionAdjustments() {
      this.addPreloaderToMainHeader() && this.proceed()
    }

    proceed() {
      let actions = util.el(".header-main>.actions")
      let cart = util.el("#cart")
      let account = util.el("#account")
      let help = util.el("#help")

      actions.innerHTML = ""
      actions.appendChild(account)
      actions.appendChild(help)
      actions.appendChild(cart)

      let searchBar = util.el(".osh-search-bar")
      let searchBtn = util.el("#header-search-submit")
      let searchFld = util.el(".osh-search-bar>.field-panel")

      searchBar.innerHTML = ""
      searchBar.appendChild(searchFld)
      searchBar.appendChild(searchBtn)

      let hello = util.el("#account.osh-dropdown .label")
      let hTxtC = hello.textContent
      hello.innerHTML = hTxtC === "Your" ? "<icon></icon><txt>Your</txt>" : "<icon></icon><txt>Hi,</txt>"

      var helpLabel = util.el("#help.osh-dropdown .label")
      helpLabel.innerHTML = ""
      

      this.span.classList.remove("-loading")
      this.span.style.display = "none"
    }

    addPreloaderToMainHeader() {
      let mainHeader = util.el(".osh-container.header-main")
      mainHeader && mainHeader.prepend(this.span)
      return mainHeader
    }
  }

  class ImageObserver {
    constructor(parent) {
      this.initialize(parent)
    }

    initialize(parent) {
      let images = util.all(".lazy-image", parent)
      let preloaders = util.all(".-preloaders")

      let entities = Array.from(images).concat(Array.from(preloaders))

      entities.forEach(this.lazyLoad.bind(this))
    }

    /**
     * 
     * @param {HTMLImageElement} entity 
     */
    lazyLoad(entity) {
      if (entity.src !== undefined) {
        entity.src = entity.getAttribute("data-src")
        entity.onload = () => this.afterLoad(entity)
      } else this.afterLoad(entity)
    }

    /**
     * 
     * @param {HTMLImageElement} entity 
     */
    afterLoad(entity) {
      entity.classList.add("loaded")
      this.removeLoader(entity)
    }

    /**
     * 
     * @param {HTMLImageElement} entity 
     */
    removeLoader(entity) {
      entity.classList.remove("-loading")
      entity.classList.remove("-hide")
    }
  }

  class Controller {
    constructor(json) {
      this.initialize(json)
    }

    initialize(json) {
      this.json = json || {}
      this.domain = json.domain || {}
      this.config = json.config || {}
      this.products = util.el(".-products")
      this.tempHost = util.el(".-temporary-host")
      this.headerQuery = util.isMobile ? ".-filter-list" : ".-header"
      this.catalogQuery = util.isMobile ? ".-col.-filters" : ".-row.-catalog"
      this.header = util.el(this.headerQuery)
      this.catalog = util.el(this.catalogQuery)
      var productsFound = util.el(".-catalog") || { style: { display: "block" } }
      

      this.htmlEl = util.el("html")
      this.filtersEl = util.el(".-filters")

      this.fetchLoaders = [this.header, this.filtersEl, this.htmlEl]
      this.urlParams = util.urlParams

      this.urlParams.tag = json.config.campaign_tag

      pubsub.subscribe(util.FILTER_UPDATED, this.filterUpdated.bind(this))
      pubsub.subscribe(util.UPDATE_URL, this.updateURL.bind(this))
      pubsub.subscribe(util.FREELINKS_BUILT, this.freelinkListener.bind(this))

      this.start(this.urlParams)
    }

    freelinkListener(data) {
      if (util.FREELINK_NAME === util.GIFT_FINDER) {
        const freelinks = util.el(".-freelinks")
        freelinks.addEventListener("click", this.handleFreelinks.bind(this))
      }
    }

    handleFreelinks(evt) {
      evt.preventDefault()
      const el = evt.target
      if (el.classList.contains("-freelink")) {
        const tag = el.getAttribute("data-tag")
        this.urlParams.tag = tag
        this.start(this.urlParams, null)
      }
    }

    filterUpdated(data) {

    }

    updateURL(data) {

    }

    urlBeautifier(param, directUrl) {
      let tempUrl = directUrl
      if (param) {
        tempUrl = util.url(param, this.domain)
        tempUrl = tempUrl.split("//").join("/")
      }

      const linkObj = new URL(tempUrl)
      const pathnameSearch = linkObj.pathname + linkObj.search
      const url = linkObj.origin + pathnameSearch

      const filters = util.filtersUrl({ host: this.domain.host, url: pathnameSearch })
      
      return { url, filters }
    }

    start(param, directUrl) {
      util.isMobile ? this.fetch().mobile(param, directUrl) : this.fetch().desktop(param, directUrl)
    }

    fetch() {
      return {
        desktop: (param, directUrl) => {
          const beautified = this.urlBeautifier(param, directUrl)
          console.log("beautified", beautified)
        },
        mobile: (param, directUrl) => {
          const beautified = this.urlBeautifier(param, directUrl)
          console.log("beautified", beautified)
        }
      }
    }

  }
  
  var pubsub = new PubSub()
  var util = new Util()
  var database = new Database(json.config)
  var preProcess = new PreProcess()

  pubsub.subscribe(util.DATA_ARRIVES, data => {
    new Controller(data)
  })
})

