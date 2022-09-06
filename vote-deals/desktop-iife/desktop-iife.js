var Begin = function (data) {
  class Util {
    constructor(json) {
      this.json = json;
      this.NAME = "Vote Deals";
      this.LS_KEY = "voted-deals"
      this.TANDC = "Vote Deals T & Cs";
      this.LOAD_DATA = "load data"
      this.FROM_INTERVAL = "interval"
      this.FROM_INITIALIZE = "initialize"
      this.VOTED_LIST = "voted-list"
      this.SUBMIT = "submit"
      this.VOTE_CLASS = "-vote-btn"
      this.UNVOTED = "unvoted"
      this.VOTED = "voted"
      this.redirect = "https://www.jumia.com.ng/customer/account/login/?return=https%3A%2F%2Fwww.jumia.com.ng%2Fsp-vote%2F"
      this.ID = "vote_deals";
      this.FOCUS = "focus";
      this.BUILD = "build";
      this.VOTES_AVAILABLE = "votes available"
      this.RESET = "reset";
      this.MS_INTV_BTW_FETCHES = 0.5
      this.TAB_LISTENER = "tab listener";
      this.FIRST_TAB = "first tab";
      this.IN_SESSION = "in session";
      this.AFTER_SESSION = "after session";
      this.BTW_OR_B4_SESSION = "between or before session";
      this.TIME_SLOTS_TO_DISPLAY = 12;
      this.time_interval = null;
      this.minute_duration = parseInt(json.config.minute_duration_vote_deals);
      this.CURRENCY = json.config.currency;
      this.config = json.config;
      this.domain = json.domain;

      this.el = (query, parent) => parent ? parent.querySelector(query) : document.querySelector(query);
      this.all = (query, parent) => parent ? parent.querySelectorAll(query) : document.querySelectorAll(query);
      this.pad = (time) => (time.toString().length == 1 ? "0" + time : time);
      this.endTime = (time) => time + this.minute_duration * 60 * 1000;
      this.skuRow = (time) => this.el('.-sku_row[data-time="' + time + '"]');
      this.skuRows = () => this.all(".-sku_row");
      this.tab = (time) => this.el('.-tab[data-time="' + time + '"]');
      this.live = (list, action) => list.forEach((each) => each.classList[action]("-live"));
      this.skuID = (sku) => sku.category + "_" + sku.sku + "_" + sku.time;
      this.capitalize = (str) => str[0].toUpperCase() + str.slice(1);
      this.oosByTime = (times) => times.map((time) => this.skuRow(time).classList.add("-oos"));
      this.getData = (detail, json) => detail.json_list.filter((datum) => datum[json.key] === json.name);
      this.isItMyTime = (sku, time) => +new Date(sku.time) === parseInt(time);
      this.isPast = (time) => Date.now() > time && Date.now() > this.endTime(time);
      this.isFuture = (time, past) => past.indexOf(time) === -1;
      this.digit = (num, unit) => parseInt(num) !== 0 ? this.pad(num) + unit : "";
      this.isATab = (el) => el.classList.contains("-tab");
      this.midnight = time => time ? new Date(time).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0)
      this.clone = data => JSON.parse(JSON.stringify(data))
      this.arrayList = num => Array.from(Array(num).keys())
      this.jsonFrLStorage = (key, useIfNull) => JSON.parse(localStorage.getItem(key)) || useIfNull
      this.jsonToLStorage = (key, item) => localStorage.setItem(key, JSON.stringify(item))
      this.groupID = (category, time) => this.id(category + "-" + this.fullDate(time).toLowerCase().split(" ").join("-"), "-")
    }

    times(skus) {
      var times = skus.map((sku) => +new Date(sku.time));
      var unique_times = Array.from(new Set(times));
      return unique_times.sort((a, b) => a - b);
    }

    group(sku_list, times) {
      return times.map((time) => {
        var skus = sku_list.filter((sku) => this.isItMyTime(sku, time));
        return { time, skus };
      });
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
        // voteTag.setAttribute("data-color", "green")
        sku.setAttribute("data-color", "green")
      } else if (parseInt(vote) === min) {
        // voteTag.setAttribute("data-color", "red")
        sku.setAttribute("data-color", "red")
      } else {
        // voteTag.setAttribute("data-color", "orange")
        sku.setAttribute("data-color", "orange")
      }
    
      if (duplicates.indexOf(parseInt(vote)) !== -1) {
        // voteTag.setAttribute("data-color", "orange")
        sku.setAttribute("data-color", "orange")
      }
    }

    pastAndFutureTimes(times) {
      var past = times.filter(this.isPast);
      var future = times.filter((time) => this.isFuture(time, past));
      return { past, future };
    }

    additionalTimes(past_future_times) {
      var future = past_future_times.future;
      var past = past_future_times.past;
      var additional_times = this.addition(future, past);
      return future.length < this.TIME_SLOTS_TO_DISPLAY ? additional_times : [];
    }

    addition(future, past) {
      var additional = [];
      var remaining = this.TIME_SLOTS_TO_DISPLAY - future.length;
      for (var i = remaining; i > -1; i--) {
        var end_idx = past.length - 1;
        var idx = end_idx - i;
        additional.push(past[idx]);
      }
      return additional;
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

    toggleClass(to_remove, to_add, class_name) {
      to_remove.forEach((el) => el.classList.remove(class_name));
      to_add.classList.add(class_name);
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

    timeFormat(time) {
      var t_units = this.timeUnits(time);
      var t = this.twelveHrFormat(t_units.hr, t_units.mn);
      return this.date(time) + "'s " + t + " sale";
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

  class Controller extends Util {
    constructor(json) {
      super(json);
      
      this.database = new Database(json)
      this.time = new Time(json)

      this.database.load(this.FROM_INITIALIZE)
      
      this.data = this.getData(json, { key: "initiative", name: this.NAME });
      this.tandcs = this.getData(json, { key: "type", name: this.TANDC });

      this.tandc_el = this.el(".-re.-rules");
      this.hiw_cta = document.querySelector(".-how-it-works");
      this.hiw_cta.addEventListener("click", this.toggleBanner.bind(this));
      this.top_banner = document.querySelector(".-banner.-top");

      this.tabs = new Tabs(json);
      this.sku_rows = new SKURows(json);
      this.state = new State(json);

      feature_box.pubsub.subscribe(this.RESET, this.init.bind(this));

      this.init("from start").setBanner().displayTAndCs().show()
    }


    init(msg) {
      var all_times = this.times(this.data);
      var past_future = this.pastAndFutureTimes(all_times);
      var additional_times = this.additionalTimes(past_future).filter(
        (time) => time !== undefined
      );
      var reordered_times = past_future.future.concat(additional_times);
      var grouped_skus = this.group(this.data, reordered_times);
      feature_box.pubsub.emit(this.BUILD, { reordered_times, grouped_skus });
      return this;
    }

    toggleBanner() {
      this.top_banner.classList.toggle("-show");
      var hiw_txt = this.hiw_cta.querySelector(".-txt");
      hiw_txt.textContent =
        hiw_txt.textContent === "How It Works (T&Cs)"
          ? "Close"
          : "How It Works (T&Cs)";
    }

    setBanner() {
      console.log("****** ran setBanner ********")
      var banner_img = this.el(".-banner.-top img.lazy-image");
      banner_img.setAttribute("data-src", this.platform().banner);
      return this;
    }

    displayTAndCs() {
      this.tandc_el.innerHTML = this.tandcs
        .map(this.tandcHTML.bind(this))
        .join("");
      return this;
    }

    tandcHTML(tandc) {
      return `<div class="-rule_element"><div class="-inlineblock -vatop -num">${tandc.sku}.</div><div class="-inlineblock -vatop -desc">${tandc.name}</div></div>`;
    }
  }

  class Tabs extends Util {
    constructor(json) {
      super(json);
      this.tab_bounds = {};

      this.tabs = this.el(".-all-tabs");
      this.tabs_parent = this.el(".-tabs");
      this.prev = this.el(".-control.-prev");
      this.next = this.el(".-control.-next");

      feature_box.pubsub.subscribe(this.BUILD, this.build.bind(this));
      this.tabs.addEventListener("click", this.tabListener.bind(this));
    }

    reset() {
      this.tab_bounds = {};
      this.tabs.innerHTML = "";
    }

    build(json) {
      this.reset();
      var times = json.reordered_times;
      this.tabs.innerHTML = times.map(this.createTab.bind(this)).join("");

      times.map(this.tabBounds.bind(this));

      /** first tab */
      var first_tab = this.all(".-tab")[0];
      this.setTabProps(first_tab, this.FIRST_TAB);
      this.show(this.tabs);
      feature_box.is_mobile === false && this.scrollListener();
    }

    scrollListener() {
      this.next.addEventListener("click", this.scrollToNext.bind(this));
      this.prev.addEventListener("click", this.scrollToPrev.bind(this));
    }

    scrollToNext() {
      var start = this.tabs.scrollLeft + 50,
        end = this.tabs.scrollLeft + 300;
      var delta = end - start;
      this.tabs.scrollLeft = start + delta * 1;
    }

    scrollToPrev() {
      var start = this.tabs.scrollLeft - 50,
        end = this.tabs.scrollLeft - 300;
      var delta = end - start;
      this.tabs.scrollLeft = start + delta * 1;
    }

    tabListener(evt) {
      var parent = evt.target.parentElement;
      this.isATab(parent) && this.setTabProps(parent, this.TAB_LISTENER);
    }

    setTabProps(el, by) {
      this.toggleClass(this.all(".-tab"), el, "active");

      if (by == this.TAB_LISTENER)
        feature_box.pubsub.emit(this.FOCUS, el.getAttribute("data-time"));
    }

    tabBounds(time, idx) {
      var tab = this.el('.-tab[data-time="' + time + '"]');
      this.tab_bounds[time] = tab.getBoundingClientRect();
    }

    createTab(time, idx) {
      var tab_class =
        idx === 0
          ? "-tab active -inlineblock -posrel -vamiddle"
          : "-tab -inlineblock -posrel -vamiddle";
      var t_units = this.timeUnits(time);
      return `<a href="#top" class="${tab_class}" data-time="${time}"><span class="-posabs -preloader -loading"></span><span class="-time">${this.twelveHrFormat(
        t_units.hr,
        t_units.mn
      )}</span><span>${this.date(time)}</span></a>`;
    }
  }

  class SKURows extends Util {
    constructor(json) {
      super(json);
      this.initialize()
    }

    initialize() {
      this.row_bounds = {};
      this.user = {}
      this.loggedIn = false
      this.votedDeals = {}
      this.mounted = false
      this.votedList = this.jsonFrLStorage(this.VOTED_LIST, [])

      this.skus_el = this.el(".-skus");

      this.loginCondition()

      feature_box.pubsub.subscribe(this.FOCUS, this.inFocus.bind(this));
      feature_box.pubsub.subscribe(this.BUILD, this.display.bind(this));
      feature_box.pubsub.subscribe(this.VOTES_AVAILABLE, this.updateUiWithVotes.bind(this))

      this.skus_el.addEventListener("click", this.vote.bind(this))
    }

    removeFromList(sku) {
      var skuId = sku.getAttribute("id")
      this.updateImageAndCTA({ skuId, action: "remove", text: "vote" })
      var idxOfEmailInVotedDeals = this.votedDeals[skuId] ? this.votedDeals[skuId].indexOf(this.user.email) : -1
      var idxOfEmailInVotedList = this.votedList.indexOf(skuId)

      if (!this.votedDeals[skuId]) {
        this.votedDeals[skuId] = []
      }      

      if (idxOfEmailInVotedDeals !== -1) {
        this.votedDeals[skuId].splice(idxOfEmailInVotedDeals, 1)
      }

      if (idxOfEmailInVotedList !== -1) {
        this.votedList.splice(idxOfEmailInVotedList, 1)
      }
    }

    addToList(sku) {
      var skuId = sku.getAttribute("id")
      var idxOfEmailInVotedDeals = this.votedDeals[skuId] ? this.votedDeals[skuId].indexOf(this.user.email) : -1
      var idxOfEmailInVotedList = this.votedList.indexOf(skuId)

      if (!this.votedDeals[skuId]) {
        this.votedDeals[skuId] = []
      }

      if (idxOfEmailInVotedDeals === -1) {
        this.votedDeals[skuId].push(this.user.email)
      } else {
        this.votedDeals[skuId].splice(idxOfEmailInVotedDeals, 1)
      }

      if (idxOfEmailInVotedList === -1) {
        this.votedList.push(skuId)
        this.updateImageAndCTA({ skuId, action: "add", text: "unvote" })
      } else {
        this.updateImageAndCTA({ skuId, action: "remove", text: "vote" })
        this.votedList.splice(idxOfEmailInVotedList, 1)
      }
    }

    vote(evt) {
      var target = evt.target
      if (target.classList.contains(this.VOTE_CLASS)) {
        var sku = target.parentElement
        var skuId = sku.getAttribute("id")
        var section = sku.parentElement
        var allSkusInSection = this.all(".-sku", section)

        var otherSkusInSection = Array.from(allSkusInSection)
        .filter(sku => {
          var _skuId = sku.getAttribute("id")
          return _skuId !== skuId
        })


        // if has voted others in row, remove the vote
        otherSkusInSection.forEach(this.removeFromList.bind(this))
        // add the new vote
        this.addToList(sku)
        
        console.log("this.votedDeals", this.votedDeals, "this.votedList", this.votedList)


        // var idxInVotedList = this.votedList.indexOf(skuId)


        // if (idxInVotedList !== -1) {
        //   this.votedList.splice(idxInVotedList, 1)
        // } else {
        //   this.votedList.push(skuId)
        // }

        // this.jsonToLStorage(this.VOTED_LIST, this.votedList)


        // this.updateVotes("click")
        // feature_box.pubsub.emit(this.SUBMIT, this.votedDeals)
        // this.jsonToLStorage("voted-deals", this.votedDeals)
      }
    }

    updateImageAndCTA({ skuId, action, text }) {
      var skuEl = document.getElementById(skuId)
      var skuCTA = this.el(".-cta", skuEl)
      var section = skuEl.parentElement

      section.classList[action]("-voted")
      skuEl.classList[action]("-sku-voted")
      skuCTA.textContent = text
    }

    reset() {
      this.row_bounds = {};
      this.skus_el.innerHTML = "";
    }

    inFocus(time) {
      var sku_rows = this.skuRows();
      var current_row = this.skuRow(time);
      this.toggleClass(sku_rows, current_row, "active");
    }

    decoupledSKUID(skuID) {
      var pieces = skuID.split("_") 
      var category = pieces[0]
      var sku = pieces[1]
      var time = pieces[2]
      return { category, sku, time }
    }

    updateUiWithVotes(data) {
      this.votedDeals = data
      this.updateVotes()
    }

    updateVotes(from) {
      Object.keys(this.votedDeals).map(skuId => {
        var mapOfEmails = this.votedDeals[skuId]
        var pieces = this.decoupledSKUID(skuId)
        var skuEl = this.el(`.-sku[data-time="${pieces.time}"][data-sku="${pieces.sku}"]`)
        var section = skuEl.parentElement
        var skuCTA = this.el(".-cta", skuEl)
        
        this.updateVoteCount({ section, skuEl, mapOfEmails })
        // this.updateImageAndCTA({ section, skuEl, skuCTA, mapOfEmails, from })
      })
    }

    updateVoteCount({ section, skuEl, mapOfEmails }) {
      var voteCount = Object.keys(mapOfEmails)
      .filter(email => mapOfEmails[email] !== this.UNVOTED).length

      var skusInSection = this.all(".-sku", section)
      var voteCountEl = this.el(".-count", skuEl)
      
      voteCountEl.textContent = this.voteTxt(voteCount)
      skuEl.setAttribute("data-votes", voteCount)
      // skusInSection.forEach(this.assignColor.bind(this))
      this.assignBgColor(section)
    }

    // updateImageAndCTA({ section, skuEl, skuCTA, mapOfEmails, from }) {
    //   var mapOfEmail = mapOfEmails[this.user.email]
    //   if (mapOfEmail) {
    //     console.log("updates when updatestate is", this.updateState)
    //     if (mapOfEmail === this.UNVOTED) {
    //       section.classList.remove("-voted")
    //       skuEl.classList.remove("-sku-voted")
    //       skuCTA.textContent = "vote"
    //     } else {
    //       section.classList.add("-voted")
    //       skuEl.classList.add("-sku-voted")
    //       skuCTA.textContent = "unvote"
    //     }
    //   }
    // }

    display(json) {
      this.reset();
      this.displaySKUs(json)
    }

    displaySKUs(json) {
      this.skus_el.innerHTML = json.grouped_skus
        .map(this.rowHTML.bind(this))
        .join("");

      /** first row */
      var first_time = this.all(".-sku_row")[0].getAttribute("data-time");
      this.inFocus(first_time);

      feature_box.pubsub.emit(this.FOCUS, first_time);
      this.show(this.skus_el);      
    }

    
    loginCondition() {
      if (/loaded|complete/.test(document.readyState)) {
        clearInterval(this.everything_loaded);
        var email = store.customer.email
        this.user = { email }
        this.loggedIn = email.length > 0 ? true : false
      }
    }

    login(fn) {
      fn.add('-loggedin')
      this.init(this.FROM_LOGIN)
    }

    rowHTML(group, idx) {
      var categories = group.skus.map((sku) => sku.category);
      categories = [...new Set(categories)];
      var sections = categories.reduce((acc, cur) => {
        acc[cur] = group.skus.filter((sku) => sku.category === cur);
        return acc;
      }, {});
      var skus_html = this.createSections(sections);
      return this.createRow(group, idx, skus_html);
    }

    createSections(sections) {
      return Object.keys(sections).map((key) =>
        this.sectionHTML(sections[key], key)
      ).join("");
    }

    voteTxt(count) {
      return `${count} vote(s)`
    }

    sectionHTML(sectionSKUs, key) {
      var sku1 = sectionSKUs[0] 
      var html = `<div class="-section" data-group-id="${this.groupID(sku1.category, sku1.time)}"><div class="-title">${key}</div>`;
      html += sectionSKUs.map(this.singleHTML.bind(this)).join("");
      html += `</div>`;
      return html;
    }

    voteHTML(count) {
      return `<div class="-inlineblock -vamiddle -arrow"></div><div class="-inlineblock -vamiddle -count">${this.voteTxt(count)}</div>`;
    }

    isLoggedIn() {
      return this.loggedIn
    }

    singleHTML(sku) {
      var old_price = this.price(sku.old_price);
      var new_price = this.price(sku.new_price);
      var discount = this.discount(sku.old_price, sku.new_price);

      var cta = this.isLoggedIn() ? `<div class="-cta -posabs ${this.VOTE_CLASS}">vote</div>` : `<a class="-redirect -posabs" href="${this.redirect}">log in</a>`
      
      return `<div class="-sku -posrel" data-votes="0" id="${this.skuID(sku)}" data-color="orange" data-time="${sku.time}" data-sku="${sku.sku}" data-category="${sku.category}"><a href="${sku.pdp}" class="-img -posabs"><div class="-posabs -shadow"><span class="-posabs">voted</span></div><img class="lazy-image loaded" data-src="${sku.image}" alt="sku_img"/><div class="-preloader -posabs"></div></a><div class="-details -posabs"><div class="-name">${sku.name}</div><div class="-desc">${sku.desc}</div><div class="-prices"><div class="-price -new">${new_price}</div><div class="-price -old">${old_price}</div></div><div class="-discount -price -posabs">${discount}</div></div>${cta}<div class="-tags -posabs">${this.voteHTML(0)}</div></div>`
    }

    createRow(group, idx, skus_html) {
      var row_class =
        idx === 0 ? "-sku_row -posrel active" : "-sku_row -posrel";
      return `<div class="${row_class}" data-time="${group.time}">${skus_html}</div>`;
    }


    showVotes(data) {
      var groupIds = []
      var list = Object.keys(data).map(key => {
        var extracted = this.extractData(data, key)
        groupIds.push(extracted.groupId)
        this.displayVotes(extracted)
        return extracted
      })

      var sections = document.querySelectorAll(".-section")
      sections.forEach(section => {
        var skus = section.querySelectorAll(".-sku")
        // skus.forEach(this.assignColor.bind(this))
        this.assignBgColor(section)
      })
    
    }

    extractData(data, key) {
      var pieces = key.split("_")
      var category = pieces[0]
      var sku = pieces[1]
      var time = pieces[2]

      var emailMap = data[key]

      var voteList = Object.keys(emailMap)
      .map(key => emailMap[key])
      .filter(datum => datum !== this.UNVOTED)
      var votes = voteList.length
      
      return { sku, time, category, votes, groupId: this.groupID(category, time) }
    }

    displayVotes(json) {
      var votes = json.votes
      var id = this.skuID(json)
      var el = document.getElementById(id.toString())
      var voteEl = el.querySelector(".-count")
      voteEl.textContent = votes + " vote(s)"
      el.setAttribute("data-votes", votes)
    }
  }

  class State extends Util {
    constructor(json) {
      super(json);

      this.time_el = this.el(".-countdown-row .-time");

      this.sessionEnded = (json) =>
        json.t <= 0 || json.session_state === this.AFTER_SESSION;
      this.amIInSession = (time) =>
        Date.now() >= time && Date.now() < this.endTime(time);
      this.amIPastSession = (time) => Date.now() > this.endTime(time);

      feature_box.pubsub.subscribe(this.FOCUS, this.inFocus.bind(this));
    }

    inFocus(time) {
      var start_time = parseInt(time);
      var end_time = this.endTime(start_time);
      var session_state = this.sessionState(start_time);

      session_state === this.IN_SESSION && this.liveActions(start_time);
      var time_to_use =
        session_state === this.IN_SESSION ? end_time : start_time;

      // this.initializeClock({ session_state, time: time_to_use });
      this.markSoldSKUs();
    }

    markSoldSKUs() {
      var times = Array.from(this.all(".-sku_row")).map((row) =>
        parseInt(row.getAttribute("data-time"))
      );

      var past_times = this.pastAndFutureTimes(times).past;
      this.oosByTime(past_times);
    }

    sessionState(start_time) {
      var session_state = "";
      var in_session = this.amIInSession(start_time);
      var past_session = this.amIPastSession(start_time);
      session_state = in_session ? this.IN_SESSION : "";
      session_state = past_session ? this.AFTER_SESSION : session_state;
      return session_state === "" ? this.BTW_OR_B4_SESSION : session_state;
    }

    liveActions(start_time) {
      var live_row = this.skuRow(start_time);
      var live_tab = this.tab(start_time);
      this.live([live_row, live_tab], "add");
    }

    // initializeClock(json) {
    //   clearInterval(this.time_interval);
    //   this.time_interval = setInterval(() => this.tick(json), 1000);
    // }

    // tick(json) {
    //   var rtime = this.remainingTime(json);
    //   rtime.session_state = json.session_state;

    //   this.sessionEnded(rtime) && clearInterval(this.time_interval);
    //   this.updateClockUi(rtime);
    // }

    // updateClockUi(rtime) {
    //   var text = "";
    //   text = rtime.session_state === this.IN_SESSION ? "Ends in " : "";
    //   text = rtime.session_state === this.AFTER_SESSION ? "Ended last " : text;
    //   text =
    //     rtime.session_state === this.BTW_OR_B4_SESSION ? "Starts in " : text;

    //   var clock_digits = this.digits(rtime);
    //   var clock_text = clock_digits.filter((digit) => digit !== "").join(" : ");
    //   this.time_el.innerHTML = text + clock_text;
    // }

    // remainingTime(json) {
    //   var end_time = json.time;
    //   var t = +new Date(end_time) - Date.now();
    //   t = this.sessionEnded(json) ? Date.now() - +new Date(end_time) : t;

    //   var seconds = Math.floor((t / 1000) % 60);
    //   var minutes = Math.floor((t / 1000 / 60) % 60);
    //   var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    //   var days = Math.floor(t / (1000 * 60 * 60 * 24));
    //   var json = { t, days, hours, minutes, seconds };

    //   if (this.itIsEndTime(json))
    //     setTimeout(() => feature_box.pubsub.emit(this.RESET, "from reset"), 3000);

    //   return { t, days, hours, minutes, seconds };
    // }

    // itIsEndTime(json) {
    //   return (
    //     json.days === 0 &&
    //     json.hours === 0 &&
    //     json.minutes === 0 &&
    //     json.seconds === 0
    //   );
    // }

    // digits(t) {
    //   return t.days >= 1
    //     ? [
    //         this.digit(t.days, "d"),
    //         this.digit(t.hours, "h"),
    //         this.digit(t.minutes, "m"),
    //       ]
    //     : [
    //         this.digit(t.hours, "h"),
    //         this.digit(t.minutes, "m"),
    //         this.digit(t.seconds, "s"),
    //       ];
    // }
  }

  class Time extends Util {

    constructor(json) {
      super(json)

      this.comingTimes = () => this.times().filter(time => this.timeElapsedSinceMidnight() < time)
      this.timeElapsedSinceMidnight = () => new Date() - new Date(this.midnight())
      this.nextTime = () => +new Date(this.midnight()) + this.comingTimes()[0]
      this.initializeClock = endTime => this.time_interval = setInterval(() => this.toUpdateClock(endTime), 1000)
      this.minuteToMillisecs = minute => minute * 60 * 1000

      this.clock_el = this.el('#clock')

      this.reset()
    }
    
    reset() {
      this.minutes_in_a_day = 1440
      this.minutes_in_ms = 60000
      clearInterval(this.time_interval)
      var nextTime = this.nextTime()
      this.initializeClock(nextTime)
    }

    toUpdateClock(endTime) {
      var t = this.remainingTime(endTime)
      if (t.t <= 0) {
        this.reset()
        feature_box.pubsub.emit(this.LOAD_DATA, this.FROM_INTERVAL)
      }

      this.clock_el.innerHTML = `${('0' + t.minutes).slice(-2)}m : ${('0' + t.seconds).slice(-2)}s`
    }

    remainingTime(endTime) {
      var t = +new Date(endTime) - (+new Date())
      var seconds = Math.floor((t / 1000) % 60)
      var minutes = Math.floor((t / 1000 / 60) % 60)
      var hours = Math.floor((t / (1000 * 60 * 60)) % 24)
      var days = Math.floor(t / (1000 * 60 * 60 * 24))

      return { t, days, hours, minutes, seconds }
    }

    times() {
      var fetch_count = Math.round(this.minutes_in_a_day / this.MS_INTV_BTW_FETCHES)
      var num_list = this.arrayList(fetch_count)

      return num_list.map(num => {
        var n = num + 1
        var ap = (this.MS_INTV_BTW_FETCHES * n) - this.MS_INTV_BTW_FETCHES
        return ap * this.minutes_in_ms
      })
    }

  }

  class Database extends Util {
    constructor(json) {
      super(json)
  
      this.regExReplace = str => str.replace(/\"|\,/g, '')
      this.clone = data => JSON.parse(JSON.stringify(data))

      this.initialize()
    }

    initialize() {

      this.configs_str = ["projectId==jumia-d080c|messagingSenderId==877411630892|apiKey==AIzaSyCUP5ISID9Jh7-lm5R0k-HcOopqt8u-eyk|appId==1:877411630892:web:f7b7a9d6bbcfadb2", "projectId==jumia-og|messagingSenderId==502706301371|apiKey==AIzaSyAT9KiJMaEGcMK1F87-eanWtE-z0_-Lw2s|appId==1:502706301371:web:79fea8a63ea2581c567c9e", "projectId==jumia-bmtn2|messagingSenderId==875946805177|apiKey==AIzaSyAPvFJ9vtXynxudD9a-D7yhhEl-2rvEctA|appId==1:875946805177:web:a4adeca0b15e6b38", "projectId==jumia-br|messagingSenderId==114843399424|apiKey==AIzaSyCg3xSlGNcHzxpHq05HPwN0IpRw5JnKc74|appId==1:114843399424:web:1a5b9cb9aa574f579cefe5", "projectId==jumia-stor|messagingSenderId==659989278147|apiKey==AIzaSyB1N3LqxTcLPldBjKkQiiTJR8wy4f7IbJM|appId==1:659989278147:web:25d4693699d8aa0d", "projectId==jumia-89cc5|messagingSenderId==650879520928|apiKey==AIzaSyCBK409LGgtZk-RI9VXDQrHe8_FGo9lFeo|appId==1:650879520928:web:a603d1d6a8904b5e", "projectId==jumia-brnk|messagingSenderId==632015048847|apiKey==AIzaSyAfQc3JLSluNogTDwiHXy_pLJHmRd3Ufxw|appId==1:632015048847:web:34f74684ef297532",]
  
      this.configs = this.configs_str
        .map(this.strToJSON.bind(this))
        .map(this.configObj.bind(this))
        .map(this.firestore.bind(this))

      feature_box.pubsub.subscribe(this.LOAD_DATA, this.load.bind(this))
      feature_box.pubsub.subscribe(this.SUBMIT, this.submit.bind(this))

      this.db_idx = 0
    }

    submit(data) {
      this.configs.map(config => {
        this.save(config.firestore, data)
          .then(_ => console.log('successfully saved in', config.projectId))
          .catch(err => console.error('error submitting document', err))
      })
    }

    
    dbIdx(from) {
      if (from === this.FROM_INTERVAL) {
        this.db_idx++
        return this.db_idx >= this.configs.length ? 0 : this.db_idx
      }
      return this.db_idx
    }

    load(from) {
      var dbIdx = this.dbIdx(from)
      var dbConfig = this.configs[dbIdx]

      this.get(dbConfig.firestore, this.ID)
      .then(this.sendData.bind(this))
      .catch(err => {
        var data = this.jsonFrLStorage("voted-deals", {})
        console.info("error fetching data", err.message)
        this.sendData(data)
      })
    }

    sendData(data) {
      feature_box.pubsub.emit(this.VOTES_AVAILABLE, data)
    }
  
    configObj(json) {
      var cloned = this.clone(json),
        authDomain = json.projectId + ".firebaseapp.com",
        databaseURL = "https://" + json.projectId + ".firebaseio.com",
        storageBucket = json.projectId + ".appspot.com"
      return Object.assign(cloned, { authDomain, databaseURL, storageBucket })
    }
  
    firestore(json) {
      var app = firebase.initializeApp(json, json.projectId)
      return Object.assign(json, { firestore: app.firestore() })
    }
  
    strToJSON(str) {
      var replaced = this.regExReplace(str)
      var props = replaced.split('|')
      return props.reduce(this.reduceProp.bind(this), {})
    }
  
    reduceProp(arr, prop) {
      var key_val = prop.split('==')
      var key = key_val[0]
      arr[key] = key_val[1] ? key_val[1].toLocaleString() : key_val[1]
      return arr
    }
  
    save(firestore, data) {
      return firestore.collection(this.ID).doc('data')
        .set(data, { merge: true })
    }
  
    get(firestore, collection) {
      return firestore.collection(collection).doc('data')
        .get().then((doc) => doc.exists ? doc.data() : {})
        .catch(err => console.error(err))
    }
  }
  
  new Controller(data);
};

var gsheet_id = "16AmKgEy2tHWRHgt9wdAfQJvgsML_pu_Z9PTH-_LvSjY";
var fb_config = {
  apiKey: "AIzaSyAA8dQEt-yZnDyY3Lra8lndRJ3LWNYVW0o",
  authDomain: "jumia-c15a3.firebaseapp.com",
  databaseURL: "https://jumia-c15a3.firebaseio.com",
  projectId: "jumia-c15a3",
  storageBucket: "jumia-c15a3.appspot.com",
  messagingSenderId: "295115190934",
  appId: "1:295115190934:web:de0b33b53a514c3c",
};
var element_id = "app";
var feature_box = Featurebox({
  id: gsheet_id,
  config: fb_config,
  element_id,
  name: "vote_deals",
});

feature_box.pubsub.subscribe(feature_box.FETCHED_DATA, Begin);
