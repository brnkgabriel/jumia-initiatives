const Begin = (function (data) {
  class Util {
    constructor(json) {
      this.NAME = "Vote Deals"
      this.TANDC = "Vote Deals T & C"
      this.LOAD_DATA = "load data"
      this.SUBMIT = "submit"
      this.FROM_INTERVAL = "interval"
      this.FROM_INITIALIZE = "initialize"
      this.VOTES_AVAILABLE = "votes available"
      this.ID = "vote_deals"
      this.MS_INTERVAL_BTW_FETCHES = 10
      this.VOTED_LIST = "voted-list"
      this.VOTED_DEALS = "voted-deals"
      this.FOCUS = "focus"
      this.BUILD = "build"
      this.FIRST_TAB = "first tab"
      this.TAB_LISTENER = "tab listener";
      this.CURRENCY = json.config.currency;
      this.VOTE_CLASS = "-vote-btn"
      this.VOTED = "voted"
      this.UNVOTED = "unvoted"
      this.time_interval = null;
      this.minute_duration = parseInt(json.config.minute_duration_vote_deals);
      this.redirect = "https://www.jumia.com.ng/customer/account/login/?return=https%3A%2F%2Fwww.jumia.com.ng%2Fsp-vote%2F"
      this.config = json.config;
      this.domain = json.domain;


      this.num2Array = num => Array.from(Array(num).keys())
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
      this.midnight = () => new Date().setHours(0, 0, 0, 0)

      this.jsonFrLStorage = (key, useIfNull) => JSON.parse(localStorage.getItem(key)) || useIfNull
      this.jsonToLStorage = (key, item) => localStorage.setItem(key, JSON.stringify(item))
      this.getData = (detail, json) => detail.json_list.filter((datum) => datum[json.key] === json.name);
      this.endTime = (time) => time + this.minute_duration * 60 * 1000
      this.isItMyTime = (sku, time) => +new Date(sku.time) === parseInt(time);
      this.isPast = (time) => Date.now() > time && Date.now() > this.endTime(time)
      this.isFuture = (time, past) => past.indexOf(time) === -1;
      this.isATab = (el) => el.classList.contains("-tab")
      this.pad = (time) => (time.toString().length == 1 ? "0" + time : time)
      this.skuRows = () => this.all(".-sku_row")
      this.skuRow = (time) => this.el('.-sku_row[data-time="' + time + '"]')
      this.skuID = (sku) => sku.category + "_" + sku.sku + "_" + sku.time
      this.groupID = (category, time) => this.id(category + "-" + this.fullDate(time).toLowerCase().split(" ").join("-"), "-")
      this.capitalize = (str) => str[0].toUpperCase() + str.slice(1);
      this.voteTxt = count => `${count} vote(s)`
      this.randomize = list => list.sort(() => Math.random() - 0.5)
      this.reverse = list => list.reverse()
    }


    assignBgColor(section) {
      var skus = this.all(".-sku", section)
      var votes = Array.from(skus).map(sku => parseInt(sku.getAttribute("data-votes")))
      var duplicates = votes.filter((e, i, a) => a.indexOf(e) !== i)
      var min = Math.min(...votes)
      var max = Math.max(...votes)

      skus.forEach(sku => this.assignColor({ sku, min, max, duplicates }))      
    }

    assignColor({ sku, min, max, duplicates }) {
      var voteTag = sku.querySelector(".-tags")
      var voteBtn = sku.querySelector(".-vote-btn")
      var vote = sku.getAttribute("data-votes")
      if (parseInt(vote) === max) {
        sku.setAttribute("data-color", "green")
      } else if (parseInt(vote) === min) {
        sku.setAttribute("data-color", "red")
      } else {
        sku.setAttribute("data-color", "orange")
      }
    
      if (duplicates.indexOf(parseInt(vote)) !== -1) {
        sku.setAttribute("data-color", "orange")
      }
    }

    price(raw) {
      const num = this.numFromStr(raw);
      return this.CURRENCY + " " + parseInt(num).toLocaleString();
    }

    numFromStr(str) {
      var match = str.match(/\d/g);
      return match ? match.join("") : 0;
    }

    discount(_old, _new) {
      if(isNaN(parseInt(_old))) {
        _old = _old.split(" ")[1]
        _new = _new.split(" ")[1]
      } 
      var diff = parseInt(_old) - parseInt(_new);
      var ratio = (diff * 100) / parseInt(_old);
      return !isNaN(ratio) ? "-" + Math.round(ratio) + "%" : "";
    }

    replacePattern(pattern, str) {
      var re = new RegExp(pattern, "g");
      return str.replace(re, "-");
    }

    id(name, delim) {
      var replaceApostrophe = this.replacePattern("'", name);
      var replaceAmpersand = this.replacePattern("&", replaceApostrophe);
      var replacePercent = this.replacePattern("%", replaceAmpersand);
      var replaceColon = this.replacePattern(":", replacePercent)
      var replaceSemiColon = this.replacePattern(";", replaceColon)
      return replaceColon.toLowerCase().split(" ").join(delim);
    }

    badge(sku) {
      var badge_id = this.id(sku.type, "_");
      var badge_icon = this.config[badge_id + "_icon"];
      var badge_txt = sku.type === "Generic" ? "Limited Stock" : sku.type;
      var badge = badge_icon
        ? `<img class="lazy-image" data-src="${badge_icon}" alt="sku_img"/>`
        : badge_txt;
      var badge_el = badge_icon
        ? `<div class="-tag -inlineblock -vamiddle -b-img -${this.id(
            sku.type,
            "-"
          )}">${badge}</div>`
        : `<div class="-tag -inlineblock -vamiddle -${this.id(
            sku.type,
            "-"
          )}" style="background-color:${this.config[sku.type]}">${badge}</div>`;
      return badge_el;
    }
    toggleClass(to_remove, to_add, class_name) {
      to_remove.forEach((el) => el.classList.remove(class_name));
      to_add.classList.add(class_name);
    }

    times(skus) {
      var times = skus.map((sku) => +new Date(sku.time));
      var unique_times = Array.from(new Set(times));
      return unique_times.sort((a, b) => a - b);
    }

    pastAndFutureTimes(times) {
      var past = times.filter(this.isPast);
      var future = times.filter((time) => this.isFuture(time, past));
      return { past, future };
    }
    
    timeUnits(time) {
      var _date = new Date(time);
      var day = _date.getDay();
      var month = _date.getMonth();
      var date = _date.getDate();
      var hr = _date.getHours();
      var mn = _date.getMinutes();
      return { day, month, date, hr, mn };
    }

    twelveHrFormat(hr, mn) {
      if (hr === 12) return this.pad(hr) + ":" + this.pad(mn) + "pm";
      else if (hr > 12) return this.pad(hr - 12) + ":" + this.pad(mn) + "pm";
      else if (hr === 0) return "12:" + this.pad(mn) + "am";
      else return this.pad(hr) + ":" + this.pad(mn) + "am";
    }

    dayDiff(time) {
      var time_date = new Date(time).getDate();
      return new Date().getDate() - time_date;
    }

    sameMonth(time) {
      return new Date(time).getMonth() === new Date().getMonth();
    }

    date(time) {
      var day_diff = this.dayDiff(time);
      if (day_diff === 0 && this.sameMonth(time))
        return this.capitalize("today");
      else if (day_diff === 1 && this.sameMonth(time))
        return this.capitalize("yesterday");
      else if (day_diff === -1 && this.sameMonth(time))
        return this.capitalize("tomorrow");
      else return this.fullDate(time);
    }

    fullDate(time) {
      var date = new Date(time);
      var mnth = date.toLocaleDateString("en-US", { month: "short" });
      var day = date.toLocaleDateString("en-US", { weekday: "short" });
      return day + " " + mnth + " " + date.getDate();
    }

    group(sku_list, times) {
      return times.map((time) => {
        var skus = sku_list.filter((sku) => this.isItMyTime(sku, time));
        return { time, skus };
      });
    }

    platform() {
      var is_mobile = "ontouchstart" in window;
      var banner = is_mobile
        ? this.config[this.ID + "_mobile_banner"]
        : this.config[this.ID + "_desktop_banner"];
      var live_link = is_mobile
        ? this.config[this.ID + "_deeplink"]
        : this.domain.host + "/" + this.config.download_apps_page;
      return { banner, live_link };
    }

    show(parent) {
      this.image_observer = new feature_box.ImageObserver(parent);
      this.image_observer = null;
      return this;
    }
  }

  class Tabs extends Util {
    constructor(json) {
      super(json)

      this.tabBounds$ = {}
      this.tabs = this.el(".-all-tabs")
      this.tabsParent = this.el(".-tabs")
      this.prev = this.el(".-control.-prev")
      this.next = this.el(".-control.-next")

      feature_box.pubsub.subscribe(this.BUILD, this.build.bind(this))
      this.tabs.addEventListener("click", this.tabListener.bind(this))
    }

    reset() {
      this.tabBounds$ = {}
      this.tabs.innerHTML = ""
    }

    build(json) {
      this.reset()
      const times = json.reorderedTimes

      this.tabs.innerHTML = times.map(this.createTab.bind(this)).join("")

      times.map(this.tabBounds.bind(this))

      const firstTab = this.all(".-tab")[0]
      this.setTabProps(firstTab, this.FIRST_TAB)
      feature_box.is_mobile === false && this.scrollListener()
    }

    scrollListener() {
      this.next.addEventListener("click", this.scrollToNext.bind(this))
      this.prev.addEventListener("click", this.scrollToPrev.bind(this))
    }

    scrollToNext() {
      const start = this.tabs.scrollLeft + 50
      const end$$ = this.tabs.scrollLeft + 300
      const delta = end$$ - start
      this.tabs.scrollLeft = start + delta * 1
    }

    scrollToPrev() {
      const start = this.tabs.scrollLeft - 50
      const end$$ = this.tabs.scrollLeft - 300
      const delta = end$$ - start
      this.tabs.scrollLeft = start + delta * 1
    }

    createTab(time, idx) {
      const tabClass = idx == 0
      ? "-tab active -inlineblock -posrel -vamiddle"
      : "-tab -inlineblock -posrel -vamiddle";
      const tUnits = this.timeUnits(time)
      return `<a href="#top" class="${tabClass}" data-time="${time}"><span class="-posabs -preloader -loading"></span><span class="-time">${this.twelveHrFormat(tUnits.hr, tUnits.mn)}</span><span>${this.date(time)}</span></a>`;
    }

    tabListener(evt) {
      const parent = evt.target.parentElement
      this.isATab(parent) && this.setTabProps(parent, this.TAB_LISTENER)
    }

    setTabProps(el, by) {
      this.toggleClass(this.all(".-tab"), el, "active")
      if (by === this.TAB_LISTENER)
        feature_box.pubsub.emit(this.FOCUS, el.getAttribute("data-time"))
    }

    tabBounds(time, idx) {
      const tab = this.el('.-tab[data-time="' + time + '"]')
      this.tabBounds$[time] = tab.getBoundingClientRect()
    }
  }

  class Controller extends Util {
    constructor(json) {
      super(json)
      this.database = new Database(json)
      this.time = new Time(json)
      this.tabs = new Tabs(json)
      this.skuRows = new SKURows(json) 

      this.database.load(this.FROM_INITIALIZE)
      
      this.data = this.getData(json, { key: "initiative", name: this.NAME }) 
      this.tandcs = this.getData(json, { key: "initiative", name: this.TANDC }) 

      this.tandcEl = this.el(".-re.-rules")
      this.hiwCTA = this.el(".-how-it-works")
      this.hiwCTA.addEventListener("click", this.toggleBanner.bind(this))
      this.topBanner = this.el(".-banner.-top")

      this.init().setBanner().displayTAndCs().show()
    }

    init() {
      const allTimes = this.times(this.data)
      const pastAndFutureTimes = this.pastAndFutureTimes(allTimes)
      let reorderedTimes = pastAndFutureTimes.future.concat(pastAndFutureTimes.past)
      reorderedTimes = this.randomize(reorderedTimes)
      const groupedSKUs = this.group(this.data, reorderedTimes)
      feature_box.pubsub.emit(this.BUILD, { reorderedTimes, groupedSKUs })
      return this
    }

    setBanner() {
      const bannerImg = this.el(".-banner.-top img.lazy-image")
      bannerImg.setAttribute("data-src", this.platform().banner)
      return this
    }

    displayTAndCs() {
      this.tandcEl.innerHTML = this.tandcs.map(this.tandcHTML.bind(this)).join("")
      return this
    }

    tandcHTML(tandc) {
      return `<div class="-rule_element"><div class="-inlineblock -vatop -num">${tandc.sku}.</div><div class="-inlineblock -vatop -desc">${tandc.name}</div></div>`;
    }
 
    toggleBanner(evt) {
      this.topBanner.classList.toggle("-show")
      let hiwTxt = this.el(".-txt", this.hiwCTA)
      hiwTxt.textContent = hiwTxt.textContent === "How It Works (T&Cs)"
      ? "Close" : "How It Works (T&Cs)"
    }
  }

  class VoteController extends Util {
    constructor(json, user) {
      super(json)
      this.skusEl = this.el(".-skus")

      this.votedDeals = {}
      this.user = user
      feature_box.pubsub.subscribe(this.VOTES_AVAILABLE, data => {
        this.votedDeals = data
        this.updateUiWithVotes()
      })

      this.skusEl.addEventListener("click", this.vote.bind(this))
    }

    vote(evt) {
      const target = evt.target
      if (target.classList.contains(this.VOTE_CLASS)) {
        const sku = target.parentElement

        this.updateVotedDeals(sku)
        this.updateUiWithVotes()
      }
    }
    
    updateVotedDeals(sku) {
      const skuId = sku.getAttribute("data-id")
      const voteState = this.votedDeals[skuId] ? this.votedDeals[skuId][this.user.email] : undefined

      if(voteState !== this.VOTED) {
        var json = {}
        json[this.user.email] = this.VOTED
        this.votedDeals[skuId] = json
      } else {
        this.votedDeals[skuId][this.user.email] = this.UNVOTED
      }
      
      this.jsonToLStorage(this.VOTED_DEALS, this.votedDeals) 
      feature_box.pubsub.emit(this.SUBMIT, this.votedDeals)
    }

    imageCTAUpdate(skuId) {
      const voteState = this.votedDeals[skuId] ? this.votedDeals[skuId][this.user.email] : undefined

      if(voteState === this.VOTED) { 
        this.updateImageAndCTA({ skuId, action: "add", text: "unvote" })
      } else { 
        this.updateImageAndCTA({ skuId, action: "remove", text: "vote" })
      }
    }

    updateImageAndCTA({ skuId, action, text }) {
      const skuEl$$ = this.el(`.-sku[data-id="${skuId}"]`)
      const skuCTA$ = this.el(".-cta", skuEl$$)
      const section = skuEl$$.parentElement

      section.classList[action]("-voted")
      skuEl$$.classList[action]("-sku-voted")
      if (skuCTA$) {
        skuCTA$.textContent = text
      }
    }

    updateUiWithVotes() {
      const allVotes = Object.keys(this.votedDeals).map(skuId => {
        const exists = this.el(`.-sku[data-id="${skuId}"]`)
        if (exists) {
          const skuObj = this.obj(skuId)
          this.updateVoteCount(skuObj)
          this.assignBgColor(skuObj.section)
          this.updateImageAndCTA({ skuId, action: "remove", text: "vote" })
          return skuId
        }
        return null
      }).filter(skuId => skuId !== null)
      
      const ownVotes = allVotes.filter(skuId => {
        if (this.votedDeals[skuId][this.user.email]) {
          if (this.votedDeals[skuId][this.user.email] === this.VOTED) {
            return true
          }
        }
        return false
      })

      ownVotes.map(skuId => this.updateImageAndCTA({ skuId, action: "add", text: "unvote" }))
    }

    obj(skuId) {
      const emailMap = this.votedDeals[skuId]
      const pieces$$ = this.decouple(skuId)
      const skuEl$$$ = this.el(`.-sku[data-time="${pieces$$.time}"][data-sku="${pieces$$.sku}"]`)
      const section$ = skuEl$$$.parentElement
      const skuCTA$$ = this.el(".-cta", skuEl$$$)
      return { section: section$, skuEl: skuEl$$$, emailMap }
    }

    decouple(skuId) {
      const pieces$$ = skuId.split("_")
      const category = pieces$$[0]
      const sku$$$$$ = pieces$$[1]
      const time$$$$ = pieces$$[2]
      return { category: category, sku: sku$$$$$, time: time$$$$ }
    }

    updateVoteCount({ section, skuEl, emailMap }) {
      const voteCount = Object.keys(emailMap)
      .filter(email => emailMap[email] === this.VOTED).length

      const skusInSection = this.all(".-sku", section)
      const voteCountEl = this.el(".-count", skuEl)

      voteCountEl.textContent = this.voteTxt(voteCount)
      skuEl.setAttribute("data-votes", voteCount)
    }
  }

  class SKURows extends Util {
    constructor(json) {
      super(json)

      this.json = json
      this.rowBounds$ = {}
      this.user = {}
      this.loggedIn = false
      this.mounted = false
      this.skusEl = this.el(".-skus")

      this.authenticate()

      feature_box.pubsub.subscribe(this.FOCUS, this.inFocus.bind(this))
      feature_box.pubsub.subscribe(this.BUILD, this.display.bind(this))

    }

    display(json) {
      this.reset().displaySKUs(json).activateVoteController()
    }

    reset() {
      this.rowBounds$ = {}
      this.skusEl.innerHTML = ""
      return this
    }

    activateVoteController() {
      this.voteController = new VoteController(this.json, this.user)
    }

    inFocus(time) {
      const skuRows$ = this.skuRows()
      const currentRow = this.skuRow(time)
      this.toggleClass(skuRows$, currentRow, "active")
    }

    displaySKUs(json) {
      this.skusEl.innerHTML = json.groupedSKUs
      .map(this.rowHTML.bind(this))
      .join("")

      const firstTime = this.all(".-sku_row")[0].getAttribute("data-time")
      this.inFocus(firstTime)

      feature_box.pubsub.emit(this.FOCUS, firstTime)
      this.show(this.skusEl)
      return this
    }

    rowHTML(group, idx) {
      let categories = group.skus.map(sku => sku.category)
      categories = [...new Set(categories)]
      categories = this.randomize(categories)
      const sections = categories.reduce((acc, cur) => {
        acc[cur] = group.skus.filter(sku => sku.category === cur)
        return acc
      }, {})
      const skusHtml = this.createSections(sections)
      return this.createRow(group, idx, skusHtml)
    }

    createSections(sections) {
      return Object.keys(sections)
      .map(key => this.sectionHtml(sections[key], key))
      .join("")
    }

    sectionHtml(sectionSKUs, key) {
      const sku1 = sectionSKUs[0]
      let html = `<div class="-section" data-group-id="${this.groupID(sku1.category, sku1.time)}"><div class="-title">${key}</div>`
      html += sectionSKUs.map(this.singleHtml.bind(this)).join("");
      html += `</div>`;
      return html;
    }

    singleHtml(sku) {
      var oldPrice = this.price(sku.old_price);
      var newPrice = this.price(sku.new_price);
      var discount = this.discount(sku.old_price, sku.new_price);

      var cta = this.loggedIn ? `<div class="-cta -posabs ${this.VOTE_CLASS}">vote</div>` : `<a class="-redirect -posabs" href="${this.redirect}">log in</a>`
      
      return `<div class="-sku -posrel" data-votes="0" data-id="${this.skuID(sku)}" data-color="orange" data-time="${sku.time}" data-sku="${sku.sku}" data-category="${sku.category}"><a href="${sku.pdp}" class="-img -posabs"><div class="-posabs -shadow"><span class="-posabs">voted</span></div><img class="lazy-image loaded" data-src="${sku.image}" alt="sku_img"/><div class="-preloader -posabs"></div></a><div class="-details -posabs"><div class="-name">${sku.name}</div><div class="-desc">${sku.desc}</div><div class="-prices"><div class="-price -new">${newPrice}</div><div class="-price -old">${oldPrice}</div></div><div class="-discount -price -posabs">${discount}</div></div>${cta}<div class="-tags -posabs">${this.voteHTML(0)}</div></div>`  
    }

    voteHTML(count) {
      return `<div class="-inlineblock -vamiddle -arrow"></div><div class="-inlineblock -vamiddle -count">${this.voteTxt(count)}</div>`;
    }

    createRow(group, idx, skusHtml) {
      const rowClass = idx === 0 ? "-sku_row -posrel active" : "-sku_row -posrel"
      return `<div class="${rowClass}" data-time="${group.time}">${skusHtml}</div>`
    }

    authenticate() {
      if (/loaded|complete/.test(document.readyState)) {
        const email = store.customer.email
        this.user = { email }
        this.loggedIn = email.length > 0 ? true : false
      }
    }
  } 

  class Time extends Util {
    constructor(json) {
      super(json)
      
      this.comingTimes = () => this.times().filter(time => Date.now() < time)
      this.timeElapsedSinceMidnight = () => new Date() - new Date(this.midnight())
      this.nextTime = () => this.comingTimes()[0]
      this.initializeClock = endTime => this.timeInterval = setInterval(() => this.toUpdateClock(endTime), 1000)
      this.minuteToMillisecs = minute => minute * 60 * 1000


      this.clockEl = this.el('#clock')
      this.reset() 
      
    }

    reset() {
      this.minutesInADay = 1440
      this.minutesInMs = 60000
      clearInterval(this.timeInterval)  
      this.initializeClock(this.nextTime())
    }

    toUpdateClock(endTime) {
      const t = this.remainingTime(endTime) 
      if (t.t <= 0) {
        this.reset()
        feature_box.pubsub.emit(this.LOAD_DATA, this.FROM_INTERVAL)
      }

      this.clockEl.innerHTML = `${('0' + t.minutes).slice(-2)}m : ${('0' + t.seconds).slice(-2)}s`
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
      const fetchCount = Math.round(this.minutesInADay / this.MS_INTERVAL_BTW_FETCHES)
      const numList = this.num2Array(fetchCount)

      return numList.map(num => {
        const n = num + 1
        const ap = (this.MS_INTERVAL_BTW_FETCHES * n) - this.MS_INTERVAL_BTW_FETCHES
        return this.midnight() + (ap * this.minutesInMs)
      })
    }
  }

  class Database extends Util {
    constructor(json) {
      super(json)
      this.initialize(json)
      /**
       * 
       * @param {string} str
       * @returns string
       */
       this.regExReplace = str => str.replace(/\"|\,/g, '')
       this.clone = data => JSON.parse(JSON.stringify(data))
       this.send = data => feature_box.pubsub.emit(this.VOTES_AVAILABLE, data)
       this.configs = this.configStr
       .map(this.str2Obj.bind(this))
       .map(this.configObj.bind(this))
       .map(this.firestore.bind(this))

       feature_box.pubsub.subscribe(this.LOAD_DATA, this.load.bind(this))
       feature_box.pubsub.subscribe(this.SUBMIT, this.submit.bind(this))
    }

    initialize(json) {
      this.configStr = ["projectId==jumia-d080c|messagingSenderId==877411630892|apiKey==AIzaSyCUP5ISID9Jh7-lm5R0k-HcOopqt8u-eyk|appId==1:877411630892:web:f7b7a9d6bbcfadb2", "projectId==jumia-og|messagingSenderId==502706301371|apiKey==AIzaSyAT9KiJMaEGcMK1F87-eanWtE-z0_-Lw2s|appId==1:502706301371:web:79fea8a63ea2581c567c9e", "projectId==jumia-bmtn2|messagingSenderId==875946805177|apiKey==AIzaSyAPvFJ9vtXynxudD9a-D7yhhEl-2rvEctA|appId==1:875946805177:web:a4adeca0b15e6b38", "projectId==jumia-br|messagingSenderId==114843399424|apiKey==AIzaSyCg3xSlGNcHzxpHq05HPwN0IpRw5JnKc74|appId==1:114843399424:web:1a5b9cb9aa574f579cefe5", "projectId==jumia-stor|messagingSenderId==659989278147|apiKey==AIzaSyB1N3LqxTcLPldBjKkQiiTJR8wy4f7IbJM|appId==1:659989278147:web:25d4693699d8aa0d", "projectId==jumia-89cc5|messagingSenderId==650879520928|apiKey==AIzaSyCBK409LGgtZk-RI9VXDQrHe8_FGo9lFeo|appId==1:650879520928:web:a603d1d6a8904b5e", "projectId==jumia-brnk|messagingSenderId==632015048847|apiKey==AIzaSyAfQc3JLSluNogTDwiHXy_pLJHmRd3Ufxw|appId==1:632015048847:web:34f74684ef297532"]
      this.db_idx = 0
    }

    str2Obj(str) {
      const replaced = this.regExReplace(str)
      const props = replaced.split("|")
      return props.reduce(this.reducer.bind(this), {})
    }

    reducer(arr, prop) {
      const keyVal = prop.split("==")
      const key = keyVal[0]
      arr[key] = keyVal[1] ? keyVal[1].toLocaleString() : keyVal[1]
      return arr
    }

    configObj(json) {
      let cloned = this.clone(json)
      const authDomain = json.projectId + ".firebaseapp.com"
      const databaseURL = "https://" + json.projectId + ".firebaseio.com"
      const storageBucket = json.projectId + ".appspot.com"
      const obj = { authDomain, databaseURL, storageBucket }
      return { ...cloned, ...obj }
    }

    firestore(json) {
      let app = firebase.initializeApp(json, json.projectId)
      let appJSON = { firestore: app.firestore() }
      return { ...json, ...appJSON }
    }

    load(from) {
      const dbIdx = this.dbIdx(from)
      const dbConfig = this.configs[dbIdx]

      this.get(dbConfig.firestore, this.ID)
      .then(this.onSuccess.bind(this))
      .catch(this.onError.bind(this))
    }

    onSuccess(data) {
      console.info("successfully retrieved data")
      this.jsonToLStorage(this.VOTED_DEALS, data)
      this.send(data)
    }

    onError(err) {
      console.info("error fetching data", err.message)
      const data = this.jsonFrLStorage(this.VOTED_DEALS, {})
      this.send(data)
    }

    dbIdx(from) {
      if (from === this.FROM_INTERVAL) {
        this.db_idx++
        return this.db_idx >= this.configs.length ? 0 : this.db_idx
      }
      return this.db_idx
    }

    submit(data) {
      this.configs.map(config => {
        this.save(config.firestore, data)
        .then(() => console.log("successfully saved in", config.projectId))
        .catch(err => console.error("error submitting document", err))
      })
    }

    save(firestore, data) {
      return firestore.collection(this.ID).doc("data")
      .set(data, { merge: true })
    }

    get(firestore, collection) {
      return firestore.collection(collection).doc("data")
      .get().then(doc => doc.exists ? doc.data() : {})
      .catch(err => console.error(err))
    }
  }
  
  new Controller(data)
})

const config = {
  apiKey: "AIzaSyAA8dQEt-yZnDyY3Lra8lndRJ3LWNYVW0o",
  authDomain: "jumia-c15a3.firebaseapp.com",
  databaseURL: "https://jumia-c15a3.firebaseio.com",
  projectId: "jumia-c15a3",
  storageBucket: "jumia-c15a3.appspot.com",
  messagingSenderId: "295115190934",
  appId: "1:295115190934:web:de0b33b53a514c3c",
}

const feature_box = Featurebox({ config, name: "vote_deals" })

feature_box.pubsub.subscribe(feature_box.DATA_ARRIVES, data => {
  Begin(data)
})