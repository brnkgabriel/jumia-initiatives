const Begin = function (data) {
  
  class Util {
    constructor(json) {
      this.NAME             = "Vote Deals Categories"
      this.TANDC            = "Vote Deals Categories T & Cs"
      this.UNVOTE           = "unvote"
      this.VOTE             = "vote"
      this.VOTES_AVAILABLE  = "votes available"
      this.LOAD_DATA        = "load data"
      this.SUBMIT           = "submit"
      this.FROM_INITIALIZE  = "from initialize"
      this.FROM_INTERVAL    = "from interval"
      this.ID               = "vote_deals_categories"
      this.BUILD            = "build"
      this.ACTIVE           = "active"
      this.TAB_LISTENER     = "tab listener"
      this.FOCUS            = "focus"
      this.DATA_CATEGORY    = "data-category"
      this.FIRST_TAB        = "first tab"
      this.PREV             = "prev"
      this.NEXT             = "next"
      this.VOTE_IDENTIFIER  = "-vt"
      this.CURRENCY         = json.config.currency
      this.MS_INTV_BTW_FTC  = 10

      this.regExReplace     = str => str.replace(/\"|\,/g, "")
      this.midnight         = () => new Date().setHours(0, 0, 0, 0)
      this.el               = (query, parent) => parent ? parent.querySelector(query) : document.querySelector(query)
      this.all              = (query, parent) => parent ? parent.querySelectorAll(query) : document.querySelectorAll(query)

      this.num2Array        = num => Array.from(Array(num).keys())
      this.isATab           = el => el.classList.contains("-tab")
      this.categoryId       = (category) => `cat-${this.id(category, "-")}`
      this.obtain           = (json, initiative) => json.json_list.filter(datum => datum.initiative === initiative)
      this.allCategories    = data => [...new Set(data.map(datum => datum.category))]
      this.randomize        = (list) => list.sort(() => Math.random() - 0.5)

      this.config           = json.config
      this.domain           = json.domain
      this.skusEl           = this.el(".-skus")
      this.user             = { email: json.email }
    }

    toggle(toRemove, toAdd, className) {
      toRemove.forEach(el => el.classList.remove(className))
      toAdd.classList.add(className)
    }

    group(data, categories) {
      const group = new Map()

      categories.map(category => {
        const skus = data.filter(datum => datum.category === category)
        const randomized = this.randomize(skus)
        group.set(category, randomized)
      })

      return group
    }

    // continue from replace pattern
    replacePattern(pattern, str) {
      const re = new RegExp(pattern, "g")
      return str.replace(re, "-")
    }

    id(name, delim) {
      const replaceApostrophe = this.replacePattern("'", name)
      const replaceAmpersand = this.replacePattern("&", replaceApostrophe)
      const replacePercent = this.replacePattern("%", replaceAmpersand)
      return replacePercent.toLowerCase().split(" ").join(delim)
    }
    

    platform() {
      var is_mobile = "ontouchstart" in window;
      var dateRange = this.config[this.ID + "_date_range"];
      var banner = is_mobile
        ? this.config[this.ID + "_mobile_banner"]
        : this.config[this.ID + "_desktop_banner"];
      var live_link = is_mobile
        ? this.config[this.ID + "_deeplink"]
        : this.domain.host + "/" + this.config.download_apps_page;
      var currencyPosition = this.config.currency_position;
      return { banner, live_link, dateRange, currencyPosition };
    }
    show(parent) {
      this.imageObserver = new fBox.ImageObserver(parent)
      this.imageObserver = null
      return this
    }
  }

  class Tabs extends Util {
    constructor(json) {
      super(json)

      this.tabs       = this.el(".-all-tabs")
      this.tabsParent = this.el(".-tabs")
      this.prev       = this.el(".-control.-prev")
      this.next       = this.el(".-control.-next")

      fBox.pubsub.subscribe(this.BUILD, this.build.bind(this))
      this.tabs.addEventListener("click", this.tabListener.bind(this))
    }

    build(data) {
      this.tabs.innerHTML = ""

      const categories = data.categories
      console.log("first category from tab", categories[0])

      this.tabs.innerHTML = categories
      .map(this.createTab.bind(this))
      .join("")

      // first tab
      const firstTab = this.all(".-tab")[0]
      this.setTabProps(firstTab, this.FIRST_TAB)
      this.show()

      fBox.is_mobile === false && this.scrollListeners()
    }

    createTab(category, idx) {
      const tabClass = idx === 0
      ? "-tab active -inlineblock -posrel -vamiddle"
      : "-tab -inlineblock -posrel -vamiddle"
  
      return `<a href="#top" class="${tabClass}" data-category="${this.categoryId(category)}"><span class="-posabs -preloader -loading"></span><span>${category}</span></a>`
    }

    setTabProps(toAdd, by) {
      const toRemove = this.all(".-tab")
      this.toggle(toRemove, toAdd, this.ACTIVE)

      if (by === this.TAB_LISTENER) {
        fBox.pubsub.emit(this.FOCUS, toAdd.getAttribute(this.DATA_CATEGORY))
      }
    }

    tabListener(evt) {
      const targetIsATab = this.isATab(evt.target)
      const parent = targetIsATab ? evt.target : evt.target.parentElement
      const parentIsATab = this.isATab(parent)

      const isTab = targetIsATab || parentIsATab 
      isTab && this.setTabProps(parent, this.TAB_LISTENER)
    }

    scrollListeners() {
      this.next.addEventListener("click", () => this.scrollTo(this.NEXT))
      this.prev.addEventListener("click", () => this.scrollTo(this.PREV))
    }

    scrollTo(type) {
      const start = type === "next"
      ? this.tabs.scrollLeft + 50 : this.tabs.scrollLeft - 50
      const end = type === "next"
      ? this.tabs.scrollLeft + 300 : this.tabs.scrollLeft - 300
  
      const delta = end - start
      this.tabs.scrollLeft = start + delta * 1
    }
  }

  class Controller extends Util {
    constructor(json) {
      super(json)
      this.database = new Database(json)
      this.time     = new Time(json)
      this.tabs     = new Tabs(json)
      this.SkuRows  = new SkuRows(json)

      this.data     = this.obtain(json, this.NAME)
      this.tandcs   = this.obtain(json, this.TANDC)

      this.tandcEl  = this.el(".-re.-rules")
      this.hiwCTA   = this.el(".-how-it-works")
      this.topBanner= this.el(".-banner.-top")
      
      this.hiwCTA.addEventListener("click", this.toggleBanner.bind(this))
      this.init().setBanner().displayTAndCs().show()
    }

    init() {
      const allCategories = this.allCategories(this.data)
      const map           = this.group(this.data, allCategories)
      const categories    = this.randomize(allCategories)

      fBox.pubsub.emit(this.BUILD, { map, categories })
      return this
    }

    setBanner() {
      const bannerImg = this.el(".-banner.-top img.lazy-image")
      bannerImg.setAttribute("data-src", this.platform().banner)
      return this
    }


    displayTAndCs() {
      this.tandcEl.innerHTML = this.tandcs
        .map(this.tandcHTML.bind(this))
        .join("");
      return this;
    }

    tandcHTML(tandc) {
      console.log()
      return `<div class="-rule_element"><div class="-inlineblock -vatop -num">${tandc.sku}.</div><div class="-inlineblock -vatop -desc">${tandc.name}</div></div>`;
    }

    toggleBanner(evt) {
      this.topBanner.classList.toggle("-show");
      let hiwTxt = this.el(".-txt", this.hiwCTA);
      hiwTxt.textContent =
        hiwTxt.textContent === "How It Works (T&Cs)"
          ? "Close"
          : "How It Works (T&Cs)";
    }
  }

  class VoteController extends Util {
    constructor(json) {
      super(json)

      this.votedDeals  = {}

      this.skuVoteMap = new Map()

      fBox.pubsub.subscribe(this.VOTES_AVAILABLE, (data) => {
        // countAndMapVotes updates skuVoteMap with databasevalue
        this.skuVoteMap = new Map()
        this.votedDeals = data
        this.countAndMapVotes()
      });

      this.skusEl.addEventListener("click", this.vote.bind(this))
    }

    vote(evt) {
      const target = evt.target
      const isVoteBtn = target.classList.contains(this.VOTE_IDENTIFIER)
      if (isVoteBtn) {
        const skuEl = target.parentElement.parentElement
        const skuId = skuEl.getAttribute("data-sku")
        const type = target.classList.contains(`-${this.UNVOTE}`) ? this.UNVOTE : this.VOTE
        
        this.makeUpdates({ skuEl, skuId, type })
      }
    }

    makeUpdates({ skuEl, skuId, type }) {
      this.updateVotedDeals({ skuEl, skuId, type })
      this.updateVoteMap({ skuId, email: this.user.email, type, from: this.VOTE })
      this.updateUi({ skuEl, skuId, type })
      fBox.pubsub.emit(this.SUBMIT, this.votedDeals)
      console.log('skuVoteMap', this.skuVoteMap)
    }

    updateVotedDeals({ skuEl, type, skuId }) {
      const vote = type === this.VOTE ? 1 : 0
      const exists = this.votedDeals[this.user.email]
      if (exists)
        this.votedDeals[this.user.email][skuId] = vote
      else {
        const emailJson = {}
        const skuJson = {}
        skuJson[skuId] = vote
        emailJson[this.user.email] = skuJson
        Object.assign(this.votedDeals, emailJson)
      }
    }

    updateVoteMap({ skuId, email, type, from }) {
      let exists = this.skuVoteMap.get(skuId)
      const votedBefore = email === this.user.email
      const fromVote = from === this.VOTE

      // if the user has voted before
      if (exists) {
        // and his action is to upvote an item
        if (type === this.VOTE) {
          // increase his upvote count
          exists.upvotes += 1
          // and subtract 1 from downvotes
          if (fromVote) {
            exists.downvotes = exists.downvotes - 1
          }
        } else {
          // if his action is to downvote an item
          // increase his downvote count
          exists.downvotes += 1
          // and subtract 1 from upvote
          if (fromVote) {
            exists.upvotes = exists.upvotes - 1
          }
        }
      } else {
        exists = type === this.VOTE ? { upvotes: 1, downvotes: 0 } : { upvotes: 0, downvotes: 1 }
      }
      this.skuVoteMap.set(skuId, exists)
      
    }
    
    updateUi({ skuEl, skuId, type }) {
      skuEl.setAttribute("data-state", type)
      this.updateVoteCounts(skuId)
    }

    updateVoteCounts(skuId) { 
      const skuEl = this.el(`.-sku[data-sku="${skuId}"]`)     
      const dvotestxt = this.el(".-down .-txt", skuEl)
      const uvotestxt = this.el(".-up .-txt", skuEl)
      const votes = this.skuVoteMap.get(skuId)
      uvotestxt.textContent = votes.upvotes
      dvotestxt.textContent = votes.downvotes

      const uvotes = this.el(".-up", skuEl)
      const dvotes = this.el(".-down", skuEl)

      if (votes.upvotes > votes.downvotes) {
        uvotes.classList.add("-greater")
        dvotes.classList.remove("-greater")
      }
      
      if (votes.downvotes > votes.upvotes) {
        dvotes.classList.add("-greater")
        uvotes.classList.remove("-greater")
      }
      
      
      this.skusEl.classList.remove("-loading")
    }

    countAndMapVotes() {
      const emailKeys = Object.keys(this.votedDeals)
      Object.keys(this.votedDeals).map(email => {
        const skuObj = this.votedDeals[email]
        
        Object.keys(skuObj).map(skuId => {
          const numb = Number(skuObj[skuId])
          const type = numb === 1 ? this.VOTE : this.UNVOTE
          this.updateVoteMap({ skuId, email, type, from: this.LOAD_DATA })
        })
      })

      console.log(this.skuVoteMap)
      this.skuVoteMap.forEach((value, skuId) => {
        this.setDataState(skuId)
        this.updateVoteCounts(skuId)
      })
    }

    setDataState(skuId) {
      const userHasVoted = this.votedDeals[this.user.email]
      const userHasVotedThisSKU = userHasVoted[skuId]
      if (userHasVoted) {
        const type = Number(userHasVotedThisSKU) === 1 ? this.VOTE: this.UNVOTE
        const skuEl = this.el(`.-sku[data-sku="${skuId}"]`)  
        skuEl.setAttribute("data-state", type)
      }
    }

  }

  class SkuRows extends Util {
    constructor(json) {
      super(json)

      this.json = json
      this.user = {}
      this.loggedIn = false
      this.mounted = false
      
      this.createSKUs = skus => skus.map(this.html.bind(this)).join("")
      this.row = category => this.el(`.-sku_row[data-category="${category}"]`)
      this.rows = () => this.all(".-sku_row")
      this.reset = () => this.skusEl.innerHTML = ""

      this.authenticate()

      fBox.pubsub.subscribe(this.FOCUS, this.inFocus.bind(this))
      fBox.pubsub.subscribe(this.BUILD, this.display.bind(this))
    }

    display(json) {
      this.reset()
      this.displaySKUs(json)
      this.activateVoteController()
    }

    displaySKUs(json) {
      const map = json.map
      const categories = json.categories

      for (let [ category, skus ] of map.entries()) {
        this.skusEl.innerHTML += this.rowHTML(category, skus, categories)
      }

      const catId = this.categoryId(categories[0])

      this.inFocus(catId)

      this.show()
      return this
    }

    selectedRow(categoryId) {
      const query = `.-sku_row[data-category="${categoryId}"]`
      return this.el(query)
    }

    inFocus(categoryId) {
      const skuRows = this.rows()
      const currentRow = this.selectedRow(categoryId)
      this.toggle(skuRows, currentRow, this.ACTIVE)
    }

    activateVoteController() {
      this.voteController = new VoteController(this.json)
    }

    authenticate() {

    }

    createRow(category, skusHTML, categories) {

      const rowClass = category === categories[0]
      ? `-sku_row active`
      : "-sku_row"

      return `<div class="${rowClass}" data-category="${this.categoryId(category)}">${skusHTML}</div>`
    }

    price(raw) {
      const split = raw.split("-")
      const num = this.numFromStr(split[0])
      return `${this.CURRENCY} ${Number(num).toLocaleString()}`
    }
  
    numFromStr(str) {
      return Number(str.replace(/[^0-9\.]+/g,""))
    }
  
    formatPrice(price) {
      const formatted = this.config.currency_position === "prefix"
      ? `${this.CURRENCY} ${Number(price).toLocaleString()}`
      : `${Number(price).toLocaleString()} ${this.config.CURRENCY}`
  
      return Number(price) === 0 ? "FREE" : formatted
    }
  
    isANumber(price) {
      const pieces = price.split(" ")
      const num = pieces.filter(piece => !isNaN(Number(piece)))[0]
  
      return !isNaN(Number(num)) ? Number(num) : null
    }
  
    discount($old, $new) {
      const oldP = this.isANumber($old)
      const newP = this.isANumber($new)
      if (!isNaN(Number(oldP))) {
        var diff = Number(oldP) - Number(newP)
        var ratio = (diff * 100) / Number(oldP)
        return !isNaN(ratio) ? "-" + Math.round(ratio) + "%" : "";
      }
      return null
    }

    rowHTML(category, skus, categories) {
      const skusHTML = this.createSKUs(skus)
      return this.createRow(category, skusHTML, categories)
    }


    html(sku) {
      const oldPrice = this.price(sku.old_price)
      const newPrice = this.price(sku.new_price)
      const discount = this.discount(sku.old_price, sku.new_price)
      const idName = sku.name + "-" + (+new Date()) 

      return `<div class="-sku -posrel -${sku.status}" data-sku="${sku.sku}"><a href="${sku.pdp}" target="_blank" class="-img -posrel" ><span class="-posabs -preloader -loading"></span><div class="-posabs -shadow"><span class="-posabs">voted</span></div><img class="lazy-image loaded" data-src="${sku.image}" alt="sku_img" /></a><div class="-details -posabs"><div class="-name">${sku.name}</div><div class="-prices"><div class="-price -new">${newPrice}</div><div class="-price -old">${oldPrice}</div><div class="-discount">${discount}</div></div></div><div class="-btns -posabs"><a href="${sku.pdp}" target="_blank" class="-btn -view"></a><div class="-btn -vt -unvote"></div><div class="-btn -vt -vote"></div></div><div class="-vcounts -posabs"><div class="-ploaders"><div class="-ploader -unvotedown"></div><div class="-ploader -voteup"></div></div><div class="-vcount -down"><div class="-icon -unvote"></div><div class="-txt">0</div></div><div class="-vcount -up"><div class="-icon -vote"></div><div class="-txt">0</div></div></div></div>`
    }
  }

  class Time extends Util {
    constructor(json) {
      super(json)

      this.comingTimes = () => this.times().filter(time => Date.now() < time)
      this.timeElapsedSinceMidnight = () => new Date() - new Date(this.midnight())
      this.nextTime = () => this.comingTimes()[0]
      this.minuteToMilliSecs = minute => minute * 60 * 1000

      this.clockEl = this.el("#clock")
      this.reset()
    }

    reset() {
      this.minutesInADay = 1440
      this.minutesInMs = 60000
      clearInterval(this.timeInterval)
      this.initializeClock(this.nextTime())
    }

    initializeClock(endTime) {
      this.timeInterval = setInterval(() => this.toUpdateClock(endTime), 1000);
    }

    toUpdateClock(endTime) {
      const t = this.remainingTime(endTime)
      if (t.t <= 0) {
        this.reset()
        fBox.pubsub.emit(this.LOAD_DATA, this.FROM_INTERVAL)
      }

      this.clockEl.innerHTML = `${("0" + t.minutes).slice(-2)}m : ${("0" + t.seconds).slice(-2)}s`;
    }

    remainingTime(endTime) {
      const t = +new Date(endTime) - Date.now()
      const seconds = Math.floor((t / 1000) % 60)
      const minutes = Math.floor((t / 1000 / 60) % 60)
      const hours = Math.floor((t / (1000 * 60 * 60)) % 24)
      const days = Math.floor(t / (1000 * 60 * 60 * 24))

      return { t, days, hours, minutes, seconds }
    }

    times() {
      const fetchCount = Math.round(
        this.minutesInADay / this.MS_INTV_BTW_FTC
      )
      const numList = this.num2Array(fetchCount)

      return numList.map(num => {
        const n = num + 1
        const ap = this.MS_INTV_BTW_FTC * n - this.MS_INTV_BTW_FTC
        return this.midnight() + ap * this.minutesInMs
      })
    }
  }

  class Database extends Util {
    constructor(json) {
      super(json)
      this.initialize(json)

      this.send = data => fBox.pubsub.emit(this.VOTES_AVAILABLE, data)
      fBox.pubsub.subscribe(this.LOAD_DATA, this.load.bind(this))
      fBox.pubsub.subscribe(this.SUBMIT, this.submit.bind(this))
    }

    initialize(json) {
      this.json     = json
      this.wConfig  = json.writeConfig
      this.$dbIdx   = 0

      const app     = firebase.initializeApp(this.wConfig, this.wConfig.projectId)
      const auth    = app.auth()
      this.db       = app.firestore()


      this.unsubscribe = auth.onAuthStateChanged(user => {
        this.user = user
        this.signIn(auth)
      })

      this.skusEl.classList.add("-loading")
    }

    signIn(auth) {
      console.log("signing in")
      auth
      .signInWithEmailAndPassword(this.json.email, this.json.password)
      .then(this.load.bind(this))
      .catch((err) => {
        if (err.code === "auth/user-not-found") this.signUp(auth);
      });
    }

    signUp(auth) {
      console.log("signing up")
      auth
        .createUserWithEmailAndPassword(this.json.email, this.json.password)
        .then((user) => console.log("account created"))
        .catch((err) => console.log(err));
    }

    load() {
      this.unsubscribe()
      this.get()
      .then(this.onSuccess.bind(this))
      .catch(this.onError.bind(this))
    }

    get() {
      this.skusEl.classList.add("-loading")
      return this.db.collection(this.ID)
      .doc("data")
      .get()
      .then(doc => {
        this.skusEl.classList.remove("-loading")
        return doc.exists ? doc.data() : {}
      }).catch(err => {
        this.skusEl.classList.remove("-loading")
        console.error(err)
      })
    }
    
    set(data) {
      return this.db
      .collection(this.ID)
      .doc("data")
      .set(data, { merge: true })
    }

    onSuccess(data) {
      console.info("successfully retrieved data from onSuccess", data)
      this.send(data)
    }
    onError(err) {
      console.info("error fetching data", err.message)
      this.send({})
    }

    submit(data) {
      if (this.user) {
        this.set(data)
        .then(() => console.log("successfully saved in", this.wConfig.projectId))
        .catch(err => console.log("error submitting document", err))
      } else console.log("you need to be signed in")
    }
  }

  new Controller(data) 
}

const currentUser = { isLoggedIn: false, email: "", pw: "" }
let fBox

const readConfig = {
  apiKey: "AIzaSyC8htXCQ-5Tm_qCKgbVBQaS_Enu5zQmIeU",
  authDomain: "jumia-vote-deals.firebaseapp.com",
  projectId: "jumia-vote-deals",
  storageBucket: "jumia-vote-deals.appspot.com",
  messagingSenderId: "15013363201",
  appId: "1:15013363201:web:d8ed9ec2a4f2f331d50a00",
  measurementId: "G-GNT4HGW9Z3"
}

const writeConfig = {...readConfig}

const interval = setInterval(() => {
  if (/loaded|complete/.test(document.readyState)) {
    clearInterval(interval)

    currentUser.email = store.customer.email
    currentUser.pw    = btoa(currentUser.email.split("").reverse().join(""))

    if (currentUser.email.length > 0) {
      currentUser.isLoggedIn = true 

      fBox = Featurebox({ config: readConfig, name: "vote_deals_categories" })

      fBox.pubsub.subscribe(fBox.DATA_ARRIVES, data => {
        Begin({ ...data, writeConfig, email: currentUser.email, password: currentUser.pw })
      })
      const containerEl = document.querySelector("#initiative.-container")
      containerEl.classList.remove("-not-logged-in")
    } else {
      const cloaderEl = document.querySelector(".-cloader")
      const loginBtnEl = document.querySelector(".-login-btn")
      loginBtnEl.classList.remove("-hide")
      cloaderEl.classList.add("-hide")
    }
  }
}, 10);