
var Begin = (function (data) {
  class Util {
    constructor(json) {
      this.json = json
      this.NAME = 'Surprises'
      this.TANDC = 'Surprises T & Cs'
      this.ID = "surprises"
      this.FOCUS = 'focus'
      this.BUILD = 'build'
      this.RESET = 'reset'
      this.TAB_OFFSET = 63
      this.TAB_LISTENER = 'tab listener'
      this.FIRST_TAB = 'first tab'
      this.IN_SESSION = 'in session'
      this.AFTER_SESSION = 'after session'
      this.BTW_OR_B4_SESSION = 'between or before session'
      this.SET_STATE = 'set state'
      this.TABS_PER_PAGE = 6
      this.TIME_SLOTS_TO_DISPLAY = 12
      this.SKU_X_MARGIN = 4
      this.time_interval = null
      this.minute_duration = parseInt(json.config[`minute_duration_${this.ID}`])
      this.CURRENCY = json.config.currency
      this.config = json.config
      this.domain = json.domain

      this.el = query => document.querySelector('#initiative ' + query)
      this.all = query => document.querySelectorAll('#initiative ' + query)
      this.pad = time => time.toString().length == 1 ? '0' + time : time
      this.endTime = time => time + (this.minute_duration * 60 * 1000)
      // this.isAGroup = sku => sku.fs_price.length === 0
      this.skuRow = time => this.el('.-sku_row[data-time="' + time + '"]')
      this.skuRows = () => this.all('.-sku_row')
      this.tab = time => this.el('.-tab[data-time="' + time + '"]')
      this.live = (list, action) => list.forEach(each => each.classList[action]('-live'))
      this.skuID = sku => sku.name + '-' + (+new Date(sku.time))
      this.capitalize = str => str[0].toUpperCase() + str.slice(1)
      this.oosByTime = times => times.map(time => this.skuRow(time).classList.add('-oos'))
      this.getData = (detail, json) => detail.json_list.filter(datum => datum[json.key] === json.name)
      this.isItMyTime = (sku, time) => +new Date(sku.time) === parseInt(time)
      this.isComing = sku => +new Date(sku.time) > Date.now()
      this.isPast = time => Date.now() > time && Date.now() > this.endTime(time)
      this.isFuture = (time, past) => past.indexOf(time) === -1
      this.displayCondition = (time, idx) => idx < this.TIME_SLOTS_TO_DISPLAY
      this.digit = (num, unit) => parseInt(num) !== 0 ? this.pad(num) + unit : ''
      this.isATab = el => el.classList.contains('-tab')
    }

    giftbox() {
      return `<svg class="-giftbox -posabs" viewBox="0 0 480 480.00003"><path class="st0" d="m 258.84298,195.7438 c -9.91736,0 -16.85951,-0.99173 -18.84298,-0.99173 -5.95041,0.99173 -53.55372,5.95041 -75.3719,-14.87604 C 148.76033,165 140.82645,151.1157 140.82645,138.22314 c 0,-9.91736 4.95867,-19.83471 13.88429,-28.76033 14.87604,-13.884298 39.66943,-22.809918 74.38017,8.92562 4.95868,3.96694 7.93388,9.91735 10.90909,16.8595 2.97521,-6.94215 6.94215,-11.90082 10.90909,-16.8595 34.71075,-31.735538 59.50413,-22.809918 74.38017,-8.92562 8.92562,8.92562 13.88429,17.85124 13.88429,28.76033 0,12.89256 -7.93388,26.77686 -23.80165,41.65289 -13.8843,13.8843 -38.67768,15.86777 -56.52892,15.86777 z m -74.38017,-88.26446 c -7.93388,0 -15.86777,2.97521 -23.80165,9.91735 -6.94215,6.94215 -10.90909,13.8843 -10.90909,20.82645 0,9.91736 6.94215,21.81818 19.83471,34.71074 15.86777,14.87604 48.59504,13.8843 62.47934,12.89257 l -9.91736,-4.95868 c 0,0 -28.76033,-13.8843 -43.63636,-27.7686 -6.94215,-5.95041 -9.91736,-11.90082 -9.91736,-17.85124 0,-4.95867 1.98347,-7.93388 2.97521,-8.92562 v 0 c 0,0 10.90909,-8.92562 27.76859,6.94215 14.87604,13.8843 29.75207,40.66116 29.75207,41.6529 l 5.95041,10.90909 c 1.98347,0 2.97521,0 2.97521,0 l -3.96694,-28.76033 c -1.98347,-13.8843 -5.95042,-23.80166 -12.89256,-29.75207 -12.89257,-13.8843 -24.79339,-19.83471 -36.69422,-19.83471 z m 62.47934,78.34711 c 13.8843,0.99173 46.61157,1.98347 62.47934,-12.89257 13.8843,-12.89256 19.83471,-23.80165 19.83471,-34.71074 0,-7.93388 -3.96694,-13.8843 -10.90909,-20.82645 -16.85951,-15.86776 -36.69422,-12.89256 -60.49587,8.92562 -6.94215,5.95042 -10.90909,15.86777 -12.89256,29.75207 l -3.96694,28.76033 c 0,0 0.99173,0 2.9752,0 l 5.95042,-10.90909 c 0.99173,-0.99174 15.86776,-27.7686 29.75206,-41.65289 v 0 c 16.85951,-15.86777 27.7686,-6.94215 27.7686,-6.94215 0.99173,0.99173 3.96694,3.96694 2.9752,8.92562 0,5.95041 -3.96694,11.90082 -10.90909,17.85124 -12.89256,14.87603 -41.65289,28.76033 -42.64463,28.76033 z m 39.66942,-45.61984 c -6.94215,5.95041 -13.8843,15.86777 -18.84297,23.80165 8.92562,-4.95867 19.83471,-11.90082 26.77686,-17.85124 6.94214,-6.94214 7.93388,-10.90909 6.94214,-12.89256 -1.98347,-0.99173 -6.94214,0 -14.87603,6.94215 z M 178.5124,133.26446 c -0.99174,1.98347 0,5.95042 6.94215,12.89256 6.94214,5.95042 17.85124,12.89257 26.77686,17.85124 -4.95868,-7.93388 -11.90083,-17.85124 -18.84298,-23.80165 -7.93388,-6.94215 -12.89256,-7.93388 -14.87603,-6.94215 z" id="path2" style="stroke-width:9.91736" /><path class="st1" d="m 222.14876,126.32231 c -13.8843,-12.89256 -25.78512,-18.84297 -37.68595,-18.84297 -7.93388,0 -15.86777,2.97521 -23.80165,9.91735 -6.94215,6.94215 -10.90909,13.8843 -10.90909,20.82645 0,9.91736 6.94215,21.81818 19.83471,34.71074 15.86777,14.87604 48.59504,13.8843 62.47934,12.89257 l -9.91736,-4.95868 c 0,0 -28.76033,-13.8843 -43.63636,-27.7686 -6.94215,-5.95041 -9.91736,-11.90082 -9.91736,-17.85124 0,-4.95867 1.98347,-7.93388 2.97521,-8.92562 v 0 c 0,0 10.90909,-8.92562 27.76859,6.94215 14.87604,13.8843 29.75207,40.66116 29.75207,41.6529 l 5.95041,10.90909 c 1.98347,0 2.97521,0 2.97521,0 l -3.96694,-28.76033 c -0.99174,-14.87604 -4.95868,-24.79339 -11.90083,-30.74381 z" id="path8" style="stroke-width:9.91736" /><path class="st1" d="m 308.42975,172.93388 c 13.8843,-12.89256 19.83471,-23.80165 19.83471,-34.71074 0,-7.93388 -3.96694,-13.8843 -10.90909,-20.82645 -16.8595,-15.86776 -36.69421,-12.89256 -60.49587,8.92562 -6.94214,5.95042 -10.90909,15.86777 -12.89256,29.75207 L 240,184.83471 c 0,0 0.99174,0 2.97521,0 l 5.95041,-10.90909 c 0.99174,-0.99174 15.86777,-27.7686 29.75207,-41.65289 16.8595,-15.86777 27.76859,-6.94215 27.76859,-6.94215 0.99174,0.99173 3.96694,3.96694 2.97521,8.92562 0,5.95041 -3.96694,11.90082 -10.90909,17.85124 -11.90083,14.87603 -40.66116,28.76033 -41.6529,28.76033 l -9.91735,4.95868 c 13.8843,0.99173 46.61157,1.98347 61.4876,-12.89257 z" id="path10" style="stroke-width:9.91736" /><path class="st0" d="M 341.15703,383.18182 H 138.84298 c -7.93389,0 -14.87604,-6.94215 -14.87604,-14.87603 V 264.17355 c 0,-7.93388 6.94215,-14.87603 14.87604,-14.87603 h 202.31405 c 7.93388,0 14.87603,6.94215 14.87603,14.87603 v 103.1405 c 0,8.92562 -6.94215,15.86777 -14.87603,15.86777 z M 138.84298,259.21488 c -2.97521,0 -4.95868,1.98347 -4.95868,4.95867 v 103.1405 c 0,2.97521 1.98347,4.95868 4.95868,4.95868 h 202.31405 c 2.9752,0 4.95867,-1.98347 4.95867,-4.95868 v -103.1405 c 0,-2.9752 -1.98347,-4.95867 -4.95867,-4.95867 z" id="path14" style="stroke-width:9.91736" /><path class="st2" d="M 341.15703,259.21488 H 138.84298 c -2.97521,0 -4.95868,1.98347 -4.95868,4.95867 v 103.1405 c 0,2.97521 1.98347,4.95868 4.95868,4.95868 h 202.31405 c 2.9752,0 4.95867,-1.98347 4.95867,-4.95868 v -103.1405 c 0,-2.9752 -1.98347,-4.95867 -4.95867,-4.95867 z" id="path18" style="stroke-width:9.91736" /><path class="st0" d="M 353.05785,259.21488 H 125.95041 c -7.93388,0 -14.87603,-6.94215 -14.87603,-14.87604 v -29.75206 c 0,-7.93389 6.94215,-14.87604 14.87603,-14.87604 h 227.10744 c 7.93389,0 14.87604,6.94215 14.87604,14.87604 v 29.75206 c 0,7.93389 -5.95042,14.87604 -14.87604,14.87604 z M 125.95041,209.6281 c -2.9752,0 -4.95867,1.98347 -4.95867,4.95868 v 29.75206 c 0,2.97521 1.98347,4.95868 4.95867,4.95868 h 227.10744 c 2.97521,0 4.95868,-1.98347 4.95868,-4.95868 v -29.75206 c 0,-2.97521 -1.98347,-4.95868 -4.95868,-4.95868 z" id="path20" style="stroke-width:9.91736" /><path class="st2" d="M 353.05785,209.6281 H 125.95041 c -2.9752,0 -4.95867,1.98347 -4.95867,4.95868 v 29.75206 c 0,2.97521 1.98347,4.95868 4.95867,4.95868 h 227.10744 c 2.97521,0 4.95868,-1.98347 4.95868,-4.95868 v -29.75206 c 0,-1.98347 -1.98347,-4.95868 -4.95868,-4.95868 z" id="path24" style="stroke-width:9.91736" /><path class="st0" d="m 269.75207,259.21488 h -59.50414 v -59.50414 h 59.50414 z m -49.58678,-9.91736 h 39.66942 V 209.6281 h -39.66942 z" id="path26" style="stroke-width:9.91736" /><rect x="220.1653" y="209.6281" class="st3" width="39.669422" height="39.669422" id="rect30" style="stroke-width:9.91736" /><path class="st0" d="m 269.75207,383.18182 h -59.50414 v -133.8843 h 59.50414 z m -49.58678,-9.91736 h 39.66942 V 259.21488 h -39.66942 z" id="path32" style="stroke-width:9.91736" /><rect x="220.1653" y="259.21487" class="st3" width="39.669422" height="113.05785" id="rect36" style="stroke-width:9.91736" /><path class="st0" d="m 475.04132,259.21488 h -44.6281 c -2.9752,0 -4.95867,-1.98348 -4.95867,-4.95868 0,-2.97521 1.98347,-4.95868 4.95867,-4.95868 h 44.6281 c 2.97521,0 4.95868,1.98347 4.95868,4.95868 0,2.9752 -2.97521,4.95868 -4.95868,4.95868 z" id="path38" style="stroke-width:9.91736" /><path class="st0" d="m 422.47934,209.6281 c -1.98347,0 -2.97521,-0.99174 -3.96694,-1.98347 -0.99174,-1.98347 -0.99174,-4.95868 1.98347,-6.94215 l 38.67769,-22.80992 c 1.98347,-0.99173 4.95867,-0.99173 6.94214,1.98347 0.99174,1.98347 0,5.95042 -2.9752,6.94215 l -38.67769,22.80992 c -0.99173,0 -0.99173,0 -1.98347,0 z" id="path42" style="stroke-width:9.91736" /><path class="st0" d="m 461.15703,331.61157 c -0.99174,0 -1.98347,0 -1.98347,-0.99174 l -38.67769,-22.80991 c -1.98347,-0.99174 -2.97521,-3.96694 -1.98347,-6.94215 0.99173,-2.97521 3.96694,-2.97521 6.94215,-1.98347 l 38.67768,22.80992 c 1.98347,0.99173 2.97521,3.96694 1.98347,6.94214 -1.98347,1.98347 -2.9752,2.97521 -4.95867,2.97521 z" id="path46" style="stroke-width:9.91736" /><path class="st0" d="M 49.586777,259.21488 H 4.9586777 C 1.9834711,259.21488 0,257.2314 0,254.2562 c 0,-2.97521 1.9834711,-4.95868 4.9586777,-4.95868 H 49.586777 c 2.975207,0 4.958678,1.98347 4.958678,4.95868 0,2.9752 -1.983471,4.95868 -4.958678,4.95868 z" id="path52" style="stroke-width:9.91736" /><path class="st0" d="m 18.842975,331.61157 c -1.983471,0 -2.975206,-0.99174 -3.966942,-1.98347 -0.991735,-1.98347 -0.991735,-4.95868 1.983471,-6.94215 L 55.53719,299.87603 c 1.983471,-0.99173 4.958678,-0.99173 6.942149,1.98347 0.991736,1.98348 0.991736,4.95868 -1.983471,6.94215 l -38.677686,22.80992 c -0.991736,0 -1.983471,0 -2.975207,0 z" id="path56" style="stroke-width:9.91736" /><path class="st0" d="m 57.520661,209.6281 c -0.991735,0 -1.983471,0 -1.983471,-0.99174 L 15.867769,186.81818 c -1.983471,-0.99173 -2.975207,-4.95868 -0.991736,-6.94215 0.991736,-1.98347 3.966942,-2.9752 5.950413,-1.98347 l 38.677686,22.80992 c 1.983471,0.99173 2.975207,3.96694 1.983471,6.94215 -0.991735,0.99173 -1.983471,1.98347 -3.966942,1.98347 z" id="path60" style="stroke-width:9.91736" /></svg>`
    }

    copyIcon() {
      return `<svg class="-copy-icon -cta" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" color=""><path fill-rule="evenodd" d="M4.75 3A1.75 1.75 0 003 4.75v9.5c0 .966.784 1.75 1.75 1.75h1.5a.75.75 0 000-1.5h-1.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.25-.25h9.5a.25.25 0 01.25.25v1.5a.75.75 0 001.5 0v-1.5A1.75 1.75 0 0014.25 3h-9.5zm5 5A1.75 1.75 0 008 9.75v9.5c0 .966.784 1.75 1.75 1.75h9.5A1.75 1.75 0 0021 19.25v-9.5A1.75 1.75 0 0019.25 8h-9.5zM9.5 9.75a.25.25 0 01.25-.25h9.5a.25.25 0 01.25.25v9.5a.25.25 0 01-.25.25h-9.5a.25.25 0 01-.25-.25v-9.5z"/></svg>`
    }

    copy() {
      const skus = this.el(".-skus")
      skus.addEventListener("click", evt => {
        const target = evt.target
        if (target.classList.contains("-copy-icon")) {
          this.copyToClipboard(target)
        }
      })
    }

    copyToClipboard(btn) {
      const parent = btn.parentElement
      let selectedNode = parent.querySelector(".-code-txt")
      const code = selectedNode.textContent
      const range = document.createRange()
      range.selectNode(selectedNode)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      try {  
        const successful = document.execCommand('copy')
        const message = successful ? 'Copied :)' : 'Not Copied :(';
        selectedNode.textContent = message
        window.getSelection().removeAllRanges()
      } catch(e) {  
        resultado.innerHTML = 'Not Copied :('
      }
      setTimeout(() => {
        selectedNode.textContent = code
      }, 800);
    }
    times(skus) {
      var times = skus.map(sku => +new Date(sku.time))
      var unique_times = Array.from(new Set(times))
      return unique_times.sort((a, b) => a - b)
    }

    group(sku_list, times) {
      return times.map(time => {
        var skus = sku_list.filter(sku => this.isItMyTime(sku, time))
        return { time, skus }
      })
    }

    pastAndFutureTimes(times) {
      var past = times.filter(this.isPast)
      var future = times.filter(time => this.isFuture(time, past))
      return { past, future }
    }

    additionalTimes(past_future_times) {
      var future = past_future_times.future
      var past = past_future_times.past
      var additional_times = this.addition(future, past)
      return future.length < this.TIME_SLOTS_TO_DISPLAY ? additional_times : []
    }

    addition(future, past) {
      var additional = []
      var remaining = this.TIME_SLOTS_TO_DISPLAY - future.length
      for (var i = remaining; i > -1; i--) {
        var end_idx = past.length - 1
        var idx = end_idx - i
        additional.push(past[idx])
      }
      return additional
    }

    timeUnits(time) {
      var _date = new Date(time)
      var day = _date.getDay()
      var month = _date.getMonth()
      var date = _date.getDate()
      var hr = _date.getHours()
      var mn = _date.getMinutes()
      return { day, month, date, hr, mn }
    }

    twelveHrFormat(hr, mn) {
      if (hr === 12) return this.pad(hr) + ':' + this.pad(mn) + 'pm'
      else if (hr > 12) return this.pad(hr - 12) + ':' + this.pad(mn) + 'pm'
      else if (hr === 0) return '12:' + this.pad(mn) + 'am'
      else return this.pad(hr) + ':' + this.pad(mn) + 'am'
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
      var date = new Date(time)
      var mnth = date.toLocaleDateString("en-US", { month: 'short' })
      var day = date.toLocaleDateString("en-US", { weekday: 'short' })
      return day + ' ' + mnth + ' ' + date.getDate()
    }

    toggleClass(to_remove, to_add, class_name) {
      to_remove.forEach(el => el.classList.remove(class_name))
      to_add.classList.add(class_name)
    }

    price(raw) {
      const num = this.numFromStr(raw);
      return this.CURRENCY + " " + parseInt(num).toLocaleString();
    }

    numFromStr(str) {
      var match = str.match(/\d/g);
      return match ? match.join("") : 0;
    }

    formatPrice(price) {
      var formatted = this.config.currency_position === 'prefix' ? this.config.currency + ' ' + parseInt(price).toLocaleString() : parseInt(price).toLocaleString() + ' ' + this.config.currency
      return parseInt(price) == 0 ? 'FREE' : formatted
    }

    discount(_old, _new) {
      var diff = parseInt(_old) - parseInt(_new)
      var ratio = diff * 100 / parseInt(_old)
      return !isNaN(ratio) ? '-' + Math.round(ratio) + '%' : ''
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

    badge(sku) {
      var badge_id = this.id(sku.type, '_')
      var badge_icon = this.config[badge_id + '_icon']
      var badge_txt = sku.type === 'Generic' ? 'Limited Stock' : sku.type
      var badge = badge_icon ? `<img class="lazy-image" data-src="${badge_icon}" alt="sku_img"/>` : badge_txt
      var badge_el = badge_icon ? `<div class="-tag -inlineblock -vamiddle -b-img -${this.id(sku.type, '-')}"><span class="-posabs -preloader -loading"></span>${badge}</div>` : `<div class="-tag -inlineblock -vamiddle -${this.id(sku.type, '-')}" style="background-color:${this.config[sku.type]}">${badge}</div>`
      return badge_el
    }

    timeFormat(time) {
      var t_units = this.timeUnits(time)
      var t = this.twelveHrFormat(t_units.hr, t_units.mn)
      return this.date(time) + "'s " + t + ' sale'
    }
    
    platform() {
      var is_mobile = 'ontouchstart' in window
      var banner = is_mobile ? this.config[`${this.ID}_mobile_banner`] : this.config[`${this.ID}_desktop_banner`]
      var live_link = is_mobile ? this.config[`${this.ID}_deeplink`] : (this.domain.host + '/' + this.config.download_apps_page)
      return { banner, live_link }
    }

    show(parent) {
      this.image_observer = new feature_box.ImageObserver()
      this.image_observer = null
      return this
    }
  }

  class Controller extends Util {
    constructor(json) {
      super(json)
      this.data = this.getData(json, { key: 'initiative', name: this.NAME })
      this.tandcs = this.getData(json, { key: 'initiative', name: this.TANDC })

      this.tandc_el = this.el('.-re.-rules')
      this.hiw_cta = document.querySelector('.-how-it-works')
      this.hiw_cta.addEventListener('click', this.toggleBanner.bind(this))
      this.top_banner = document.querySelector('.-banner.-top')

      this.tabs = new Tabs(json)
      this.sku_rows = new SKURows(json)
      this.state = new State(json)

      feature_box.pubsub.subscribe(this.RESET, this.init.bind(this))

      this.init('from start')
      .setBanner()
      .displayTAndCs()
      .show()
    }

    init(msg) {
      console.log('init', msg)
      var all_times = this.times(this.data)
      var past_future = this.pastAndFutureTimes(all_times)
      var additional_times = this.additionalTimes(past_future).filter(time => time !== undefined)
      var reordered_times = past_future.future.concat(additional_times)
      var grouped_skus = this.group(this.data, reordered_times)
      feature_box.pubsub.emit(this.BUILD, { reordered_times, grouped_skus })
      return this
    }

    toggleBanner() {
      this.top_banner.classList.toggle('-show')
      var hiw_txt = this.hiw_cta.querySelector('.-txt')
      hiw_txt.textContent = hiw_txt.textContent === 'Terms & Conditions' ? 'Close' : 'Terms & Conditions'
    }

    setBanner() {
      var banner_img = this.el('.-banner.-top img.lazy-image')
      banner_img.setAttribute('data-src', this.platform().banner)
      return this
    }

    displayTAndCs() {
      this.tandc_el.innerHTML = this.tandcs.map(this.tandcHTML.bind(this)).join('')
      return this
    }

    tandcHTML(tandc) {
      return `<div class="-rule_element"><div class="-inlineblock -vatop -num">${tandc.code}.</div><div class="-inlineblock -vatop -desc">${tandc.name}</div></div>`
    }
  }

  class Tabs extends Util {
    constructor(json) {
      super(json)
      this.tab_bounds = {}

      this.tabs = this.el('.-all-tabs')
      this.tabs_parent = this.el('.-tabs')
      this.prev = this.el('.-control.-prev')
      this.next = this.el('.-control.-next')

      feature_box.pubsub.subscribe(this.BUILD, this.build.bind(this))
      this.tabs.addEventListener('click', this.tabListener.bind(this))
    }

    reset() {
      this.tab_bounds = {}
      this.tabs.innerHTML = ''
    }

    build(json) {
      this.reset()
      var times = json.reordered_times
      this.tabs.innerHTML = times
      .map(this.createTab.bind(this))
      .join('')

      times.map(this.tabBounds.bind(this))

      /** first tab */
      var first_tab = this.all('.-tab')[0]
      this.setTabProps(first_tab, this.FIRST_TAB)
      this.show(this.tabs);
      (feature_box.is_mobile === false) && this.scrollListener()
    }
    
    scrollListener() {
      this.next.addEventListener('click', this.scrollToNext.bind(this))
      this.prev.addEventListener('click', this.scrollToPrev.bind(this))
    }

    scrollToNext() {
      var start = this.tabs.scrollLeft + 50, end = this.tabs.scrollLeft + 300
      var delta = end - start;
      this.tabs.scrollLeft = start + delta * 1;
    }

    scrollToPrev() {
      var start = this.tabs.scrollLeft - 50, end = this.tabs.scrollLeft - 300
      var delta = end - start;
      this.tabs.scrollLeft = start + delta * 1;
    }

    tabListener(evt) {
      var parent = evt.target.parentElement
      this.isATab(parent) && this.setTabProps(parent, this.TAB_LISTENER)
    }

    setTabProps(el, by) {
      this.toggleClass(this.all('.-tab'), el, 'active')

      if(by == this.TAB_LISTENER)
        feature_box.pubsub.emit(this.FOCUS, el.getAttribute('data-time'))
    }

    tabBounds(time, idx) {
      var tab = this.el('.-tab[data-time="' + time + '"]')
      this.tab_bounds[time] = tab.getBoundingClientRect()
    }

    createTab(time, idx) {
      var tab_class = idx === 0 ? '-tab active -inlineblock -posrel -vamiddle' : '-tab -inlineblock -posrel -vamiddle'
      var t_units = this.timeUnits(time)
      return `<a href="#top" class="${tab_class}" data-time="${time}"><span class="-posabs -preloader -loading"></span><span class="-time">${this.twelveHrFormat(t_units.hr, t_units.mn)}</span><span>${this.date(time)}</span></a>`
    }
  }

  class SKURows extends Util {
    constructor(json) {
      super(json)
      this.row_bounds = {}

      this.skus_el = this.el('.-skus')

      this.createSKUs = skus => skus.map(this.skuHTML.bind(this)).join('')
      this.skuHTML = sku => this.singleHTML(sku)

      feature_box.pubsub.subscribe(this.FOCUS, this.inFocus.bind(this))
      feature_box.pubsub.subscribe(this.BUILD, this.display.bind(this))
    }

    reset() {
      this.row_bounds = {}
      this.skus_el.innerHTML = ''
    }

    inFocus(time) {
      var sku_rows = this.skuRows()
      var current_row = this.skuRow(time)
      this.toggleClass(sku_rows, current_row, 'active')
    }

    display(json) {
      this.reset()
      this.skus_el.innerHTML = json.grouped_skus
      .map(this.rowHTML.bind(this)).join('')

      /** first row */
      var first_time = this.all('.-sku_row')[0].getAttribute('data-time')
      this.inFocus(first_time)

      feature_box.pubsub.emit(this.FOCUS, first_time)
      this.show(this.skus_el)
      this.copy()
    }

    rowHTML(group, idx) {
      var skus_html = this.createSKUs(group.skus)
      return this.createRow(group, idx, skus_html)
    }
    singleHTML(sku) {
      var discount = "Max. discount: " + this.price(sku.max_discount)
      var discountEl = sku.max_discount ? `<div class="-price -new -prettify">${discount}</div>` : ""
      const type = this.id(sku.type, "-")

      const isThisSKUComing = this.isComing(sku)
      console.log("is this sku coming", isThisSKUComing)

      const details = isThisSKUComing ? "" : `<div class="-details -posabs"><div class="-name">${sku.name}</div><div class="-prices">${discountEl} <div class="-price -old"></div></div></div>`
      const order = isThisSKUComing ? "" : `<div class="-cta -posabs">order</div>`
      const tags = `<div class="-tags -posabs">${this.badge(sku)}</div>`
      const giftbox = isThisSKUComing ? this.giftbox() : ""
      const unveiled = isThisSKUComing ? `<div class="-unveiled -prettify -posabs">Unveiled: ${this.date(sku.time)}</div>` : ""
      const codeHTML = type === "jumia-mall" ? `<div class="-code -posabs -prettify"><div class="-code-txt">${sku.code}</div>${this.copyIcon()}</div>` : ""
      const code = isThisSKUComing ? "" : codeHTML

      return `<div class="-sku -posrel -${sku.status} -${type}" id="${this.id(this.skuID(sku), '-')}" ><a href="${sku.pdp}" target="_blank" class="-img -posrel"><span class="-posabs -preloader -loading"></span><div class="-posabs -shadow"><span class="-posabs">sold out</span></div><img class="lazy-image loaded" data-src="${sku.image}" alt="sku_img" /></a>${giftbox} ${details} ${order} ${tags} ${unveiled} ${code}
      </div>`
    }

    createRow(group, idx, skus_html) {
      var row_class = idx === 0 ? '-sku_row -posrel active' : '-sku_row -posrel'
      return `<div class="${row_class}" data-time="${group.time}">${skus_html}</div>`
    }
  }

  class State extends Util {
    constructor(json) {
      super(json)

      this.time_el = this.el('.-countdown-row .-time')

      this.sessionEnded = json => json.t <= 0 || json.session_state === this.AFTER_SESSION
      this.amIInSession = time => Date.now() >= time && Date.now() < this.endTime(time)
      this.amIPastSession = time => Date.now() > this.endTime(time)

      feature_box.pubsub.subscribe(this.FOCUS, this.inFocus.bind(this))
    }

    inFocus(time) {
      var start_time = parseInt(time)
      var end_time = this.endTime(start_time)
      var session_state = this.sessionState(start_time)

      session_state === this.IN_SESSION && this.liveActions(start_time)
      var time_to_use = session_state === this.IN_SESSION ? end_time : start_time

      this.initializeClock({ session_state, time: time_to_use })
      this.markSoldSKUs()
    }

    markSoldSKUs() {
      var times = Array.from(this.all('.-sku_row'))
      .map(row => parseInt(row.getAttribute('data-time')))

      var past_times = this.pastAndFutureTimes(times).past
      this.oosByTime(past_times)
    }

    sessionState(start_time) {
      var session_state = ''
      var in_session = this.amIInSession(start_time)
      var past_session = this.amIPastSession(start_time)
      session_state = in_session ? this.IN_SESSION : ''
      session_state = past_session ? this.AFTER_SESSION : session_state
      return session_state === '' ? this.BTW_OR_B4_SESSION : session_state
    }

    liveActions(start_time) {
      var live_row = this.skuRow(start_time)
      var live_tab = this.tab(start_time)
      this.live([live_row, live_tab], 'add')
    }

    initializeClock(json) {
      clearInterval(this.time_interval)
      this.time_interval = setInterval(() => this.tick(json), 1000)
    }
    
    tick(json) {
      var rtime = this.remainingTime(json)
      rtime.session_state = json.session_state

      this.sessionEnded(rtime) && clearInterval(this.time_interval)
      this.updateClockUi(rtime)
    }

    updateClockUi(rtime) {
      var text = ''
      text = rtime.session_state === this.IN_SESSION ? 'Ends in ' : ''
      text = rtime.session_state === this.AFTER_SESSION ? 'Ended last ' : text
      text = rtime.session_state === this.BTW_OR_B4_SESSION ? 'Starts in ' : text

      var clock_digits = this.digits(rtime)
      var clock_text = clock_digits
      .filter(digit => digit !== '').join(' : ')
      this.time_el.innerHTML = text + clock_text
    }

    remainingTime(json) {
      var end_time = json.time
      var t = +new Date(end_time) - Date.now()
      t = this.sessionEnded(json) ? Date.now() - (+new Date(end_time)) : t

      var seconds = Math.floor((t / 1000) % 60)
      var minutes = Math.floor((t / 1000 / 60) % 60)
      var hours = Math.floor((t / (1000 * 60 * 60)) % 24)
      var days = Math.floor(t / (1000 * 60 * 60 * 24))
      var json = {t, days, hours, minutes, seconds }
  
      if (this.itIsEndTime(json))
        setTimeout(() => feature_box.pubsub.emit(this.RESET, 'from reset'), 3000)
  
      return { t, days, hours, minutes, seconds }
    }

    itIsEndTime(json) {
      return json.days === 0 && json.hours === 0 &&
      json.minutes === 0 && json.seconds === 0
    }

    digits(t) {
      return t.days >= 1 ? [
        this.digit(t.days, 'd'),
        this.digit(t.hours, 'h'),
        this.digit(t.minutes, 'm')
      ] : [
        this.digit(t.hours, 'h'),
        this.digit(t.minutes, 'm'),
        this.digit(t.seconds, 's')
      ]
    }
  }
  new Controller(data)
})

var config = {
  apiKey: "AIzaSyAA8dQEt-yZnDyY3Lra8lndRJ3LWNYVW0o",
  authDomain: "jumia-c15a3.firebaseapp.com",
  databaseURL: "https://jumia-c15a3.firebaseio.com",
  projectId: "jumia-c15a3",
  storageBucket: "jumia-c15a3.appspot.com",
  messagingSenderId: "295115190934",
  appId: "1:295115190934:web:de0b33b53a514c3c"
}
var feature_box = Featurebox({ config, name: 'surprises' })

feature_box.pubsub.subscribe(feature_box.DATA_ARRIVES, Begin)

