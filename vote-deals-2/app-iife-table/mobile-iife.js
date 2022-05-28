// Put the matchWord at the end message if the person doesn't get the word. e.g.
// Get as many 6 letter word dictionary as possible
var Begin = (function (data) {
  class Util {
    constructor(json) {
      this.pubsub = feature_box

      /** data selection */
      this.NAME = 'Jumdle'
      this.TANDC = 'Jumdle T & Cs'
      this.WRONG_SPOT = 2
      this.RIGHT_SPOT = 5
      this.NO_OF_LETTERS = 6

      /** game specific */
      this.ID = 'jumdle'

      /** events */
      this.FOCUS = 'focus'
      this.BUILD = 'build'
      this.RESET = 'reset'
      this.START = 'start'
      this.SUBMITTED = 'submitted'
      this.UPDATE = 'update'
      this.TAB_STATE = 'tab state'
      this.LOAD_DATA = 'load data'
      this.FROM_INTERVAL = 'initialized from interval'
      this.FROM_LOGIN = 'initialized from login'

      /** other utils */
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
      this.minute_duration = parseInt(json.config.minute_duration_solve_win)
      this.CURRENCY = json.config.currency
      this.config = json.config
      this.domain = json.domain

      this.el = query => document.querySelector('#initiative ' + query)
      this.all = query => document.querySelectorAll('#initiative ' + query)
      this.pad = time => time.toString().length == 1 ? '0' + time : time
      this.endTime = time => time + (this.minute_duration * 60 * 1000)
      this.isAGroup = sku => sku.fs_price.length === 0
      this.skuRow = time => this.el('.-sku_row[data-time="' + time + '"]')
      this.skuRows = () => this.all('.-sku_row')
      this.tab = time => this.el('.-tab[data-time="' + time + '"]')
      this.live = (list, action) => list.forEach(each => each.classList[action]('-live'))
      this.skuID = sku => sku.name + '-' + (+new Date(sku.time))
      this.capitalize = str => str[0].toUpperCase() + str.slice(1)
      this.oosByTime = times => times.map(time => this.skuRow(time).classList.add('-oos'))
      this.getData = (detail, json) => detail.json_list.filter(datum => datum[json.key] === json.name)
      this.isItMyTime = (sku, time) => +new Date(sku.time) === parseInt(time)
      this.isPast = time => Date.now() > time && Date.now() > this.endTime(time)
      this.isFuture = (time, past) => past.indexOf(time) === -1
      this.displayCondition = (time, idx) => idx < this.TIME_SLOTS_TO_DISPLAY
      this.digit = (num, unit) => parseInt(num) !== 0 ? this.pad(num) + unit : ''
      this.isATab = (el, class_name) => el.classList.contains(class_name)
      this.midnight = time => time ? new Date(time).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0)
      this.clone = data => JSON.parse(JSON.stringify(data))
      this.arrayList = num => Array.from(Array(num).keys())
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
      var time_date = new Date(time).getDate()
      return new Date().getDate() - time_date
    }

    sameMonth(time) { return new Date(time).getMonth() === new Date().getMonth() }

    date(time) {
      var day_diff = this.dayDiff(time)
      if (day_diff === 0 && this.sameMonth(time)) return this.capitalize('today')
      else if (day_diff === 1 && this.sameMonth(time)) return this.capitalize('yesterday')
      else if (day_diff === -1 && this.sameMonth(time)) return this.capitalize('tomorrow')
      else return this.fullDate(time)
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
      return raw.split('-')
        .map(this.formatPrice.bind(this)).join(' - ')
    }

    formatPrice(price) {
      var formatted = this.config.currency_position === 'prefix' ? this.config.currency + ' ' + parseInt(price).toLocaleString() : parseInt(price).toLocaleString() + ' ' + this.config.currency
      return parseInt(price) == 0 ? 'PRIZE' : formatted
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
      var badge_el = badge_icon ? `<div class="-tag -inlineblock -vamiddle -b-img -${this.id(sku.type, '-')}">${badge}</div>` : `<div class="-tag -inlineblock -vamiddle -${this.id(sku.type, '-')}" style="background-color:${this.config[sku.type]}">${badge}</div>`
      return badge_el
    }

    platform() {
      var is_mobile = 'ontouchstart' in window
      var banner = is_mobile ? this.config[this.ID + '_mobile_banner'] : this.config[this.ID + '_desktop_banner']
      var live_link = is_mobile ? this.config[this.ID + '_deeplink'] : (this.domain.host + '/' + this.config.download_apps_page)
      return { banner, live_link }
    }

    show(parent) {
      this.image_observer = new feature_box.ImageObserver(parent)
      this.image_observer = null
      return this
    }

    reorder(times) {
      return this.pastAndFutureTimes(times)['future'].concat(this.pastAndFutureTimes(times)['past'])
    }
  }

  class Main {
    constructor(json) {
      fetch(atob('aHR0cHM6Ly93d3cuanVtaWEuY29tLm5nL3NwLXdvcmRsZS13b3Jkcy8'))
        .then(res => res.text())
        .then(data => new Wordle(data, json))
      new Leaderboard(json)
    }
  }

  class Wordle extends Util{
    constructor(data, json) {
      // this.determineTime()
      super(json)
      this.ext = this.extract(data)
      this.matchDict5L12am12pm = this.ext.matchDict5L12am12pm
      this.matchDict6L12pm1159pm = this.ext.matchDict6L12pm1159pm
      this.wordDict6L = this.ext.wordDict6L

      this.matchDict = this.matchDict6L12pm1159pm
      this.wordDict = this.wordDict6L

      // this.matchDict = this.ext.matchDict
      // this.wordDict = this.ext.wordDict

      this.numWords = this.matchDict.length
      this.wordLength = 6
      this.maxGuesses = 6
      this.guessAttempt = 0
      this.pts = 0

      this.alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

      this.keyboardLayout = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'delete']]

      this.keyboard = this.createKeyboard()

      this.keyboardElement = document.getElementById('keyboard')
      this.keyboardElement.appendChild(this.keyboard.element)

      /** Game Element */
      this.gameEl = document.getElementById('game')
      this.newGameButton = document.getElementById('newGameButton')
      this.status = document.querySelector('.-timer-score')
      // this.giveUpButton = document.getElementById('giveUpButton')

      this.initialize()
    }

    // determineTime() {
    //   var prevMidnight = new Date().setHours(0,0,0,0)
    //   var midday = new Date().setHours(12,0,0,0)
    //   var nextMidnight = new Date().setHours(24, 0, 0, 0)

    //   var currentTimeIsBeforeMidday = Date.now() < midday
    //   var currentTimeIsAfterMidday = Date.now() >= midday && Date.now() < nextMidnight

    //   console.log('current time is before midday', currentTimeIsBeforeMidday)
    //   console.log('current time is after midday', currentTimeIsAfterMidday)
    //   return currenttime
    // }

    initialize() {
      this.theGame = this.Game()
      this.theGame.startGame()


      this.newGameButton.addEventListener('click', (e) => {
        this.theGame.startGame();
        e.target.blur()
      });
      // this.giveUpButton.addEventListener('click', (e) => {
      //   this.theGame.giveUp();
      //   e.target.blur()
      // });
    }

    /**
     * 
     * @param {string} data
     */
    extract(data) {
      var s_idx = data.indexOf('<pre>') + 5
      var e_idx = data.indexOf('</pre>')
      var sub_str = data.substring(s_idx, e_idx)
      var json = JSON.parse(sub_str)
      return json
    }

    getRandomWord() {
      const idx = Math.floor(this.numWords * Math.random())
      return this.matchDict[idx]
    }

    Tile() {
      var self = this
      const element = document.createElement('div')
      element.classList.add('tile-container')

      const tile = document.createElement('div')
      tile.classList.add('tile')
      element.appendChild(tile)

      let value = ''
      let state = 'tbd'

      function get() { return value }

      function set(letter) {
        tile.innerHTML = letter
        tile.classList.add('pop')
        setTimeout(() => {
          tile.classList.remove('pop')
        }, 150);
        value = letter
      }

      function clear(letter) {
        
        tile.innerHTML = ''
        value = ''
        tile.classList.remove('correct', 'oop', 'wrong')
      }

      const stateActions = {
        'correct': setCorrect,
        'oop': setOutOfPlace,
        'wrong': setWrong
      }

      function setCorrect() { tile.classList.add('correct') }

      function setOutOfPlace() { tile.classList.add('oop') }

      function setWrong() { tile.classList.add('wrong') }

      function setState(newState) {
        state = newState
        stateActions[state] && stateActions[state]()
      }

      function getState() { return state }

      return { element, get, set, clear, setState, getState }
    }

    createGuessRow() {
      let self = this
      const element = document.createElement('div')
      element.classList.add('guess')

      let idx = 0

      let tiles = []

      for (var i = 0; i < self.wordLength; i++) {
        const tile = this.Tile()
        element.appendChild(tile.element)
        tiles.push(tile)
      }

      function appendLetter(letter) {
        if (idx >= self.wordLength) return
        tiles[idx].set(letter)
        idx++
      }

      function deleteLetter() {
        if (idx <= 0) return
        idx--
        tiles[idx].clear()
      }

      function getWord() {
        return tiles.reduce((prevValue, curTile) => {
          return prevValue += curTile.get()
        }, '')
      }

      function clear() {
        tiles.forEach(tile => tile.clear())
        idx = 0
      }

      return { element, tiles, appendLetter, deleteLetter, getWord, clear }
    }

    createGameBoard() {

      const element = document.createElement('div')
      element.classList.add('board')

      let guesses = []

      for (let i = 0; i < this.maxGuesses; i++) {
        const guess = this.createGuessRow()
        element.appendChild(guess.element)
        guesses.push(guess)
      }

      function clear() {
        guesses.forEach(guess => guess.clear())
      }

      return { element, guesses, clear }
    }

    createKey(letter, onClick) {
      var self = this
      const element = document.createElement('button')
      element.classList.add('key')
      element.dataset.value = letter
      element.innerHTML = letter.toUpperCase()

      element.addEventListener('click', onClick)

      let state = 'tbd'

      const stateActions = {
        'correct': setCorrect,
        'oop': setOutOfPlace,
        'wrong': setWrong
      }

      function setCorrect() {
        clear()
        element.classList.add('correct')
      }

      function setOutOfPlace() {
        clear()
        element.classList.add('oop')
      }

      function setWrong() {
        clear()
        element.classList.add('wrong')
      }

      function setState(newState) {
        state = newState

        stateActions[state] && stateActions[state]()
      }

      function getState() { return state }

      function clear() {
        element.classList.remove('correct', 'oop', 'wrong')
      }

      return { letter, element, setState, getState, clear }
    }

    createKeyboardRow(row, onClick) {
      const element = document.createElement('div')
      element.classList.add('keyboard-row')

      const keys = {}
      row.forEach(letter => {
        const key = this.createKey(letter, onClick)
        keys[letter] = key
        element.appendChild(key.element)
      })

      return { element, keys }
    }

    createKeyboard() {
      const element = document.createElement('div')
      element.classList.add('keyboard')

      const keyMap = {}
      this.keyboardLayout.forEach(keyRow => {
        const row = this.createKeyboardRow(keyRow, handleClick)
        element.appendChild(row.element)
        Object.assign(keyMap, row.keys)
      })

      let callback

      function handleClick(value) {
        if (!callback) return
        callback(value.srcElement)
      }

      function addClickCallback(fn) {
        if (!(fn && typeof fn === 'function')) return
        callback = fn
      }

      function removeClickCallback() { callback = undefined }

      function clear() { Object.keys(keyMap).forEach(key => keyMap[key].clear()) }

      return { element, keyMap, addClickCallback, removeClickCallback, clear }
    }

    MessageDisplay() {
      const element = document.createElement('div')
      element.classList.add('message', 'hide')

      const text = document.createElement('h4')
      text.classList.add('text')
      text.innerHTML = 'MESSAGE TEST'

      element.appendChild(text)

      let isVisible = false
      const duration = 1000

      function show(value) {
        if (isVisible) return
        if (!(value && typeof value === 'string')) return

        text.innerHTML = value

        element.classList.remove('hide')
        element.classList.add('show')
        isVisible = true

        setTimeout(hide, duration)
      }

      function hide() {
        element.classList.remove('show')
        element.classList.add('hide')
        isVisible = false
      }

      return { element, show }
    }

    updateScore(toAdd) {
      this.pts += toAdd
    }
    Game() {
      var self = this

      const gameBoard = this.createGameBoard()

      function GuessIterator() {
        const guesses = gameBoard.guesses
        const maxIdx = guesses.length - 1
        let idx = -1
        let guess = guesses[idx]

        return {
          next: function () {
            if (idx >= maxIdx) return { value: undefined, done: true }

            idx++
            guess = guesses[idx]
            return { value: guess, done: false }
          }
        }
      }

      let guessItr, guess
      let matchWord = ''

      function setMatchWord() { matchWord = self.getRandomWord() }

      const container = document.getElementById('game-container')
      container.appendChild(gameBoard.element)

      const message = this.MessageDisplay()
      container.appendChild(message.element)

      function appendGuessEntry(letter) {
        if (!guess.value) return

        if (!(letter && typeof letter === 'string')) return

        guess.value.appendLetter(letter)
      }

      function deleteGuessEntry() {
        if (!guess.value) return
        guess.value.deleteLetter()
      }

      function submitGuess() {
        const word = guess.value.getWord()

        if (word.length !== self.wordLength) {
          handleShortWord()
          return
        }

        if (!(self.wordDict.includes(word) || self.matchDict.includes(word))) {
          handleInvalidWord()
          return
        }

        self.guessAttempt += 1
        const correctGuess = evaluateTiles()

        if (!correctGuess) {
          guess = handleIncorrectGuess(guess)
          updateStatus()
          return
        }

        handleCorrectGuess()
        updateStatus()
        endGame()
      }

      function updateStatus() {
        var html = `<div class="-remaining -st">Pts (${self.pts})</div><div class="-st">:</div><div class="-elapsed -st">Atp (${self.guessAttempt})</div><div class="-st">:</div><div class="-elapsed -st">Sco (${score()})</div>`
        self.status.innerHTML = html
      }

      function evaluateTiles() {
        let matchLetters = [...matchWord],
          unmatchedLetters,
          matchLetter,
          tileValue,
          unmatched,
          correctLetters = 0;

        unmatchedLetters = matchLetters.reduce((obj, letter) => {
          if (obj[letter]) {
            obj[letter]++
            return obj
          }

          obj[letter] = 1
          return obj
        }, {})

        const tilesToReEvaluate = []
        guess.value.tiles.forEach((tile, idx) => {
          tileValue = tile.get()

          matchLetter = matchLetters[idx]

          if (tileValue === matchLetter) {
            self.updateScore(self.RIGHT_SPOT)
            tile.setState('correct')
            updateKeyboard(tileValue, 'correct')
            unmatchedLetters[tileValue]--
            correctLetters++
            return
          }

          tilesToReEvaluate.push(tile)
        })

        tilesToReEvaluate.forEach((tile, idx) => {
          tileValue = tile.get()

          matchLetter = matchLetters[idx]

          if (unmatchedLetters[tileValue] > 0) {
            self.updateScore(self.WRONG_SPOT)
            tile.setState('oop')
            updateKeyboard(tileValue, 'oop')
            unmatchedLetters[tileValue]--
            return
          }

          tile.setState('wrong')
          updateKeyboard(tileValue, 'wrong')
        })

        if (correctLetters === self.wordLength) return true

        return false
      }

      const keyboardStatePriority = {
        'correct': 0,
        'oop': 1,
        'wrong': 2,
        'tbd': 3
      }

      function updateKeyboard(key, state) {
        const curState = self.keyboard.keyMap[key].getState()

        const curPriority = keyboardStatePriority[curState]
        const newPriority = keyboardStatePriority[state]

        if (newPriority >= curPriority) return

        self.keyboard.keyMap[key].setState(state)
      }

      function handleShortWord() {
        message.show(`You need ${self.wordLength} letters`)
      }

      function handleInvalidWord() {
        message.show('Invalid Word')
      }

      function handleIncorrectGuess(guess) {
        guess = guessItr.next()
        if (guess.done === true) {
          message.show(`Correct Word = ${matchWord.toUpperCase()}<br/>YOUR SCORE HAS BEEN SUBMITTED`)
          feature_box.emit(self.UPDATE, { attempt: self.guessAttempt, pts: self.pts, score: score() })
        }
        return guess
      }

      function score() {
        var str = (self.pts / self.guessAttempt).toFixed(2)
        return parseFloat(str)
      }

      function handleCorrectGuess() {
        feature_box.emit(self.UPDATE, { attempt: self.guessAttempt, pts: self.pts, score: score() })
        message.show('YAY, CONGRATS!<br/>YOUR SCORE HAS BEEN SUBMITTED')
      }

      function startGame() {
        reset()
        gameBoard.clear()
        removeListeners()
        self.keyboard.clear()

        guessItr = new GuessIterator()
        guess = guessItr.next()

        setMatchWord()
        addListeners()
      }

      function reset() {
        self.guessAttempt = 0
        self.pts = 0
      }

      function endGame() {
        removeListeners()
      }

      function giveUp() {
        console.log('inside give up')
        message.show(matchWord.toUpperCase())
      }

      function addListeners() {
        self.keyboard.addClickCallback(onKeyboardClick)
        window.addEventListener('keydown', onButtonClick)
      }

      function removeListeners() {
        self.keyboard.removeClickCallback()
        window.removeEventListener('keydown', onButtonClick)
      }

      let actions = {
        'delete': deleteGuessEntry,
        'backspace': deleteGuessEntry,
        'enter': submitGuess,
        'guess': value => {
          appendGuessEntry(value)
        }
      }

      function onButtonClick(evt) {
        parseAction(evt.key)
      }

      function onKeyboardClick(el) {
        parseAction(el.dataset.value)
      }

      function parseAction(key) {
        if (self.alphabet.includes(key)) {
          actions.guess(key)
          return
        }

        const action = key.toLowerCase()
        if (!actions[action]) return

        actions[action]()
      }

      return { startGame, giveUp }
    }
  }

  class TableController extends Util {
    constructor(json) {
      super(json)

      this.pageCount = (data) => Math.ceil(data.length / this.entries_p_page)
      this.act = (datum, type) => this.el('.-score-row[data-id="' + datum.email + '"]').classList[type]('-hide')
      this.numOrOne = num => num ? num : 1
      this.maxEntry = data => data.length < this.entries_p_page ? data.length : this.entries_p_page
      this.pageHTML = num => `<span class="-page" data-page="${num + 1}">${num + 1}</span>`

      this.initialize()

      this.pages_el = this.el('.-pagination .-pages')
      this.search_el = this.el('.-scores .-search')
      this.score_list = this.el('.-score-list')
      this.info_el = this.el('.-table-info')
      this.no_entries_el = this.el('.-no-entries')
      this.select_epp_el = this.el('.-entries-per-page select')

      this.search_el.addEventListener('keyup', this.filter.bind(this))
      this.pages_el.addEventListener('click', this.goTo.bind(this))
      this.select_epp_el.addEventListener('change', this.changeEntries.bind(this))
    }

    changeEntries(evt) {
      this.entries_p_page = parseInt(evt.target.value)
      this.show(this.to_display, 1)
    }

    initialize() {
      this.entries_p_page = 10
      this.to_display = []
      this.data = []
    }

    goTo(evt) {
      var target = evt.target
      if (target.classList.contains('-page')) {
        var page_no = Number(target.getAttribute('data-page'))
        this.show(this.to_display, page_no)
      }
    }

    show(data_to_display, page_no) {
      this.data.map(datum => this.act(datum, 'add'))
      data_to_display.map((datum, idx) => this.displaySubset(datum, idx, page_no))
      this.updateStatus(data_to_display, page_no)
    }

    displaySubset(datum, idx, page_no) {
      var range = this.entryRange(page_no)
      var condition = (idx + 1) >= range.min && (idx + 1) <= range.max
      condition && this.act(datum, 'remove')
    }

    entryRange(page_no) {
      var min = 1 + (page_no * this.entries_p_page) - this.entries_p_page
      var max = page_no * this.entries_p_page
      return { min, max }
    }

    updateStatus(data, page_no) {
      var page_count = this.pageCount(data)

      this.pages_el.innerHTML = this.arrayList(page_count)
        .map(this.pageHTML.bind(this)).join('')

      var range = this.entryRange(page_no)
      var min = range.min
      var max = range.max > data.length ? data.length : range.max

      this.info_el.innerHTML = `Showing ${this.numOrOne(min)} - ${this.numOrOne(max)} of ${this.numOrOne(data.length)}`

      var fn = this.no_entries_el.classList
      data.length > 0 ? fn.add('-hide') : fn.remove('-hide')
    }

    filter(evt) {
      var value = evt.target.value.toLowerCase()
      this.to_display = this.clone(this.data).filter(datum => this.condition(datum, value))
      this.show(this.to_display, 1)
    }

    condition(datum, value) {
      var date = new Date(datum.timestamp)
      return datum.firstName.toLowerCase().indexOf(value) !== -1 ||
        datum.email.toLowerCase().indexOf(value) !== -1 ||
        datum.attempt.toString().toLowerCase().indexOf(value) !== -1 ||
        datum.position.toString().toLowerCase().indexOf(value) !== -1 ||
        date.toDateString().toLowerCase().indexOf(value) !== -1 ||
        date.toLocaleTimeString().toLowerCase().indexOf(value) !== -1
    }
    build(data) {
      this.data = data
      this.to_display = data
      this.score_list.innerHTML = this.to_display.map(this.rowHTML.bind(this)).join('')
      this.show(this.to_display, 1)
    }

    rowHTML(datum, idx) {
      return `<div class="-score-row -hide" data-id="${datum.email}"><div data-pos="${datum.position}" class="-score-col -color"></div><div class="-score-col -pos">${datum.position}</div><div class="-score-col -name">${datum.firstName}</div><div class="-score-col -tme">${datum.score}</div><div class="-score-col -date"><div class="-date-string">${new Date(datum.timestamp).toDateString()}</div><div class="-time-string">${new Date(datum.timestamp).toLocaleTimeString()}</div></div></div>`
    }
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

      feature_box.subscribe(this.TAB_STATE, this.startOrStopCycle.bind(this))

      this.reset()
    }

    startOrStopCycle(state) {
      state === 'scores' ? this.initializeClock(this.nextTime()) : this.reset()
    }

    reset() {
      this.minutes_in_a_day = 1440
      this.minutes_in_ms = 60000
      this.interval_btw_fetches_mins = 10
      clearInterval(this.time_interval)
    }

    toUpdateClock(endTime) {
      var t = this.remainingTime(endTime)
      if (t.t <= 0) {
        this.reset()
        setTimeout(() => {
          feature_box.emit(this.LOAD_DATA, this.FROM_INTERVAL)
          this.initializeClock(this.nextTime())
        }, 1000)
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
      var fetch_count = Math.round(this.minutes_in_a_day / this.interval_btw_fetches_mins)
      var num_list = this.arrayList(fetch_count)

      return num_list.map(num => {
        var n = num + 1
        var ap = (this.interval_btw_fetches_mins * n) - this.interval_btw_fetches_mins
        return ap * this.minutes_in_ms
      })
    }

  }

  class Leaderboard extends Util {
    constructor(json) {
      super(json)
      this.cloneSortPosition = data => this.clone(data).sort(this.doubleSort.bind(this)).map((datum, idx) => Object.assign(datum, { position: idx + 1 }))

      this.table_controller = new TableController(json)
      this.time = new Time(json)
      this.initialize()

      this.game_el = this.el('.-game')
      this.game_wrap = this.el('.-game-wrap')
      this.table = this.el('.-table')
      this.user_el = this.el('.-game-tabs-parent .-user')
      this.update_time = this.el('.-update-time')

      this.everything_loaded = setInterval(this.loginCondition.bind(this), 1000);

      feature_box.subscribe(this.LOAD_DATA, this.init.bind(this))
      feature_box.subscribe(this.UPDATE, this.updateUser.bind(this))
      feature_box.subscribe(this.FOCUS, this.rebuildTable.bind(this))
    }

    timeData(data, time) {
      console.log('time data', data)
      return data.filter(datum => {
        var midnight = this.midnight(time)
        var end_time = this.endTime(midnight)
        return datum.timestamp >= midnight && datum.timestamp < end_time
      })
    }
    rebuildTable(time) {
      if (this.firestore_data) {
        time = parseInt(time)
        var time_data = this.timeData(this.firestore_data, time)
        var cloned_sorted_pos = this.cloneSortPosition(time_data)
        this.build(cloned_sorted_pos)
      }
    }

    initialize() {
      this.database = new Database()
      var db_times = this.dbTimes()
      var current = db_times.filter(obj => Date.now() >= obj.starts && Date.now() < obj.ends)[0]
      this.db_idx = current.idx
      this.started = false
      this.data = { 'time-to-finish': 0 }
      this.user = {}
    }

    updateUser(data) {
      console.log('data to send to db is', data)
      Object.assign(this.user, data)
      this.user.timestamp = Date.now()
      var json = {}
      json[this.user.email] = this.user
      this.database.configs.map(config => {
        this.database.save(config.firestore, json)
          .then(_ => {
            feature_box.emit(this.SUBMITTED, {})
            feature_box.emit(this.LOAD_DATA, {})
            console.log('successfully saved in', config.projectId)
          }).catch(err => console.error('error submitting document', err))
      })

    }

    loginCondition() {
      var fn = this.game_wrap.classList
      if (/loaded|complete/.test(document.readyState)) {
        clearInterval(this.everything_loaded);
        var email = store.customer.email
        this.user = { email, firstName: store.headerInfo.customer.firstName, timestamp: Date.now() }
        email.length > 0 ? this.login(fn) : fn.remove('-loggedin')
      }
    }

    login(fn) {
      fn.add('-loggedin')
      this.init(this.FROM_LOGIN)
    }

    storeData(data) {
      console.log('from store data', data)
      this.firestore_data = data.filter(datum => parseFloat(datum.score) > 0)
      return this.firestore_data
    }

    dbTimes() {
      var first_term = this.time.minutes_in_a_day / this.database.configs.length,
        common_difference = first_term
      return this.database.configs.map((config, idx) => {
        var nth_term = idx + 1
        var start_ap_mn = first_term + ((idx - 1) * common_difference)
        var end_ap_mn = first_term + ((nth_term - 1) * common_difference)
        var midnight = this.midnight()
        var starts = Math.round(midnight + this.time.minuteToMillisecs(start_ap_mn))
        var ends = Math.round(midnight + this.time.minuteToMillisecs(end_ap_mn))
        return { id: config.projectId, starts, ends, start_time: new Date(starts), end_time: new Date(ends), idx }
      })
    }

    dbIdx(from) {
      if (from === this.FROM_INTERVAL) {
        this.db_idx++
        this.db_idx = this.db_idx >= this.database.configs.length ? 0 : this.db_idx
        return this.db_idx
      }
      return this.db_idx
    }

    init(from) {
      var idx = this.dbIdx(from)
      var db = this.database.configs[idx]
      console.log('fetching from', db.projectId, 'collection', db.firestore)
      this.database.get(db.firestore, this.ID)
        .then(this.rows.bind(this))
        .then(this.storeData.bind(this))
        .then(data => { return this.timeData(data, Date.now()) })
        .then(this.cloneSortPosition.bind(this))
        .then(this.build.bind(this))
        .then(data => this.updateUserStatusUi(data, this.user, this.user_el, 'Hi'))
        .then(this.start.bind(this))
        .catch(err => console.error('error loading data', err))
    }

    build(data) {
      this.table_controller.build(data)
      return data
    }

    start(data) {
      var json = { data, user: this.user }
      feature_box.emit(this.START, json)
    }

    rows(data) {
      console.log('data from db', data)
      var date = new Date(Date.now())
      this.update_time.innerHTML = date.toDateString() + ' ' + date.toLocaleTimeString()
      return Object.keys(data).map(key => data[key])
    }

    doubleSort(a, b) {
      if (parseFloat(a.score) === parseFloat(b.score)) {
        return a.timestamp - b.timestamp
      }
      return parseFloat(b.score) - parseFloat(a.score)
    }
    tripleSort(a, b) {
      if (b.score === a.score) {
        if (a.attempt === b.attempt) {
          return a.timestamp - b.timestamp
        }
        return a.attempt - b.attempt;
      }
      return b.score > a.score ? 1 : -1;
    }

    updateUserStatusUi(data, person, el, note) {
      var pos = data.findIndex(datum => datum.email === person.email)
      var user = data.find(datum => datum.email === person.email)
      var pos = pos >= 0 ? (pos + 1) : '-'
      var score = user ? user.score : '-'
      var attempt = user ? user.attempt : '-'
      var pts = user ? user.pts : '-'
      var time = user ? new Date(user.timestamp).toLocaleTimeString() : '-'
      el.innerHTML = `<div class="-username">${note} (${person.firstName})</div><div class="-stats"><div class="-stat-row">Pts = ${pts}, Atp = ${attempt}</div><div class="-stat-row">Sco = ${score}, Pos = ${pos}</div></div>`
      return data
    }
  }

  class Controller extends Util {
    constructor(json) {
      super(json)
      this.prizes = this.getData(json, { key: 'initiative', name: this.NAME })
      this.tandcs = this.getData(json, { key: 'type', name: this.TANDC })

      this.tandc_el = this.el('.-re.-rules')
      this.hiw_cta = this.el('.-how-it-works')
      this.top_banner = this.el('.-banner.-top')
      this.top_banner.addEventListener('click', this.toggleBanner.bind(this))

      this.tabs = new Tabs(json)
      this.sku_rows = new SKURows(json)
      this.state = new State(json)
      this.main = new Main(json)

      feature_box.subscribe(this.RESET, this.init.bind(this))


      this.init('from start')
        .setBanner()
        .displayTAndCs()
    }

    init(msg) {
      var all_times = this.times(this.prizes)
      var past_future = this.pastAndFutureTimes(all_times)
      var additional_times = this.additionalTimes(past_future).filter(time => time !== undefined)
      var reordered_times = past_future.future.concat(additional_times)
      var grouped_skus = this.group(this.prizes, reordered_times)
      feature_box.emit(this.BUILD, { reordered_times, grouped_skus })
      return this
    }

    toggleBanner() {
      this.top_banner.classList.toggle('-show')
      var hiw_txt = this.hiw_cta.querySelector('.-txt')
      hiw_txt.textContent = hiw_txt.textContent === 'How It Works (T & Cs)' ? 'Close' : 'How It Works (T & Cs)'
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
      return `<div class="-rule_element"><div class="-inlineblock -vatop -num">${tandc.sku}.</div><div class="-inlineblock -vatop -desc">${tandc.name}</div></div>`
    }
  }

  class Tabs extends Util {
    constructor(json) {
      super(json)
      this.tab_bounds = {}

      this.tabs = this.el('.-all-tabs')
      this.tabs_parent = this.el('.-tabs')

      this.game_tabs = this.el('.-game-tabs')
      this.game = this.el('.-game')

      feature_box.subscribe(this.BUILD, this.build.bind(this))

      this.tabs.addEventListener('click', this.tabListener.bind(this))
      this.game_tabs.addEventListener('click', this.gTabListener.bind(this))
    }

    reset() {
      this.tab_bounds = {}
      this.tabs.innerHTML = ''
    }

    hideControls(times) {
      times.length < 8 && this.tabs_parent.classList.add('-hide-controls')
    }

    build(json) {
      this.reset()
      var times = json.reordered_times
      /** hide controls if tab is less than 8 */
      this.hideControls(times)

      /** build tabs */
      this.tabs.innerHTML = times
        .map(this.createTab.bind(this))
        .join('')

      times.map(this.tabBounds.bind(this))

      /** first tab */
      var first_tab = this.all('.-tab')[0]
      this.setTabProps(first_tab, this.FIRST_TAB)
      this.show(this.tabs);
    }

    tabListener(evt) {
      var parent = evt.target.parentElement
      this.isATab(parent, '-tab') && this.setTabProps(parent, this.TAB_LISTENER)
    }

    gTabListener(evt) {
      var parent = evt.target.parentElement
      this.isATab(parent, '-g-tab') && this.assignState(parent)
    }

    assignState(el) {
      var state_styles = {
        game: 'height:515px;max-height:unset',
        scores: 'height:110vw;max-height:480px'
      }
      var state = el.getAttribute('data-state')
      this.game.setAttribute('data-state', state)
      this.game.setAttribute('style', state_styles[state])

      feature_box.emit(this.TAB_STATE, state)

      this.toggleClass(this.all('.-g-tab'), el, 'active')
    }

    setTabProps(el, by) {
      this.toggleClass(this.all('.-tab'), el, 'active')

      if (by == this.TAB_LISTENER)
        feature_box.emit(this.FOCUS, el.getAttribute('data-time'))
    }

    tabBounds(time, idx) {
      var tab = this.el('.-tab[data-time="' + time + '"]')
      this.tab_bounds[time] = tab.getBoundingClientRect()
    }

    createTab(time, idx) {
      var tab_class = idx === 0 ? '-tab active -inlineblock -posrel -vamiddle' : '-tab -inlineblock -posrel -vamiddle'
      var t_units = this.timeUnits(time)
      return `<div class="${tab_class}" data-time="${time}"><span class="-posabs -preloader -loading"></span><span class="-time">${this.twelveHrFormat(t_units.hr, t_units.mn)}</span><span>${this.date(time)}</span></div>`
    }
  }

  class SKURows extends Util {
    constructor(json) {
      super(json)
      this.row_bounds = {}

      this.skus_el = this.el('.-skus')

      this.skuHTML = sku => this.isAGroup(sku) ? this.groupHTML(sku) : this.singleHTML(sku)

      this.createSKUs = skus => skus.map(this.skuHTML.bind(this)).join('')

      feature_box.subscribe(this.FOCUS, this.inFocus.bind(this))
      feature_box.subscribe(this.BUILD, this.displayAndListen.bind(this))
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

    displayAndListen(json) {
      this.reset()
      this.skus_el.innerHTML = json.grouped_skus
        .map(this.rowHTML.bind(this)).join('')

      /** first row */
      var first_time = this.all('.-sku_row')[0].getAttribute('data-time')
      this.inFocus(first_time)

      feature_box.emit(this.FOCUS, first_time)
      this.show(this.skus_el)
      this.listen()
    }

    listen() {
      this.skus_el.addEventListener('click', evt => {
        evt.target.classList.contains('-cta') && window.scroll(0, 0)
      })
    }

    rowHTML(group, idx) {
      var skus_html = this.createSKUs(group.skus)
      return this.createRow(group, idx, skus_html)
    }

    description(desc) {
      var is_number = !isNaN(desc)
      var formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' })
      var formatted = is_number ? formatter.format(desc) : desc
      return formatted
    }

    badge(sku) {
      var badge_id = this.id(sku.type, '_')
      var badge_icon = this.config[badge_id + '_icon']
      var badge_txt = sku.type === 'Generic' ? 'Limited Stock' : sku.type
      var badge = badge_icon ? `<img class="lazy-image" data-src="${badge_icon}" alt="sku_img"/>` : badge_txt
      var badge_el = badge_icon ? `<div class="-tag -inlineblock -vamiddle -b-img -${this.id(sku.type, '-')}">${badge}</div>` : `<div class="-tag -inlineblock -vamiddle -${this.id(sku.type, '-')}" style="background-color:${this.config[sku.type]}">${badge}</div>`
      return badge_el
    }

    groupHTML(sku) {
      return `<div target="_blank" class="-sku -posrel -${sku.status}" id="${this.id(this.skuID(sku), '-')}"><a href="${sku.pdp}" class="-img -posrel"><span class="-posabs -preloader -loading"></span><div class="-posabs -shadow"><span class="-posabs">sold out</span></div><img class="lazy-image" data-src="${sku.image}" alt="sku_img" /></a><div class="-details -posabs"><div class="-name">${sku.name.toString()}</div><div class="-prices"><div class="-price -new">${sku.fs_discount}</div></div></div><div class="-cta -posabs">guess the word</div><div class="-tags -posabs">${this.badge(sku)}</div></div>`
    }

    singleHTML(sku) {
      var old_price = this.price(sku.barred_price)
      var new_price = this.price(sku.fs_price)
      var discount = this.discount(sku.barred_price, sku.fs_price)

      return `<div target="_blank" class="-sku -posrel -${sku.status}" id="${this.id(this.skuID(sku), '-')}"><a href="${sku.pdp}" class="-img -posrel"><span class="-posabs -preloader -loading"></span><div class="-posabs -shadow"><span class="-posabs">sold out</span></div><img class="lazy-image loaded" data-src="${sku.image}" alt="sku_img" /></a><div class="-details -posabs"><div class="-name">${sku.name}</div><div class="-prices"><div class="-price -new">${new_price}</div><div class="-price -old">${old_price}</div><div class="-discount">${discount}</div></div></div><div class="-cta -posabs">guess the word</div><div class="-tags -posabs">${this.badge(sku)}</div></div>`
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

      feature_box.subscribe(this.FOCUS, this.inFocus.bind(this))
    }

    inFocus(time) {
      var start_time = parseInt(time)
      var end_time = this.endTime(start_time)
      var session_state = this.sessionState(start_time);

      (session_state === this.IN_SESSION) && this.liveActions(start_time)
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
      var game_tab = this.el('.-g-tab[data-state="game"]')
      this.live([live_row, live_tab, game_tab], 'add')
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
      var json = { t, days, hours, minutes, seconds }

      if (this.itIsEndTime(json))
        setTimeout(() => feature_box.emit(this.RESET, 'from reset'), 3000)

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

class Database {
  constructor() {

    this.regExReplace = str => str.replace(/\"|\,/g, '')
    this.clone = data => JSON.parse(JSON.stringify(data))

    this.configs_str = ["projectId==jumia-d080c|messagingSenderId==877411630892|apiKey==AIzaSyCUP5ISID9Jh7-lm5R0k-HcOopqt8u-eyk|appId==1:877411630892:web:f7b7a9d6bbcfadb2", "projectId==jumia-og|messagingSenderId==502706301371|apiKey==AIzaSyAT9KiJMaEGcMK1F87-eanWtE-z0_-Lw2s|appId==1:502706301371:web:79fea8a63ea2581c567c9e", "projectId==jumia-bmtn2|messagingSenderId==875946805177|apiKey==AIzaSyAPvFJ9vtXynxudD9a-D7yhhEl-2rvEctA|appId==1:875946805177:web:a4adeca0b15e6b38", "projectId==jumia-br|messagingSenderId==114843399424|apiKey==AIzaSyCg3xSlGNcHzxpHq05HPwN0IpRw5JnKc74|appId==1:114843399424:web:1a5b9cb9aa574f579cefe5", "projectId==jumia-stor|messagingSenderId==659989278147|apiKey==AIzaSyB1N3LqxTcLPldBjKkQiiTJR8wy4f7IbJM|appId==1:659989278147:web:25d4693699d8aa0d", "projectId==jumia-89cc5|messagingSenderId==650879520928|apiKey==AIzaSyCBK409LGgtZk-RI9VXDQrHe8_FGo9lFeo|appId==1:650879520928:web:a603d1d6a8904b5e", "projectId==jumia-brnk|messagingSenderId==632015048847|apiKey==AIzaSyAfQc3JLSluNogTDwiHXy_pLJHmRd3Ufxw|appId==1:632015048847:web:34f74684ef297532",]

    this.configs = this.configs_str
      .map(this.strToJSON.bind(this))
      .map(this.configObj.bind(this))
      .map(this.firestore.bind(this))
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
    return firestore.collection('jumdle').doc('data')
      .set(data, { merge: true })
  }

  get(firestore, collection) {
    return firestore.collection(collection).doc('data')
      .get().then((doc) => doc.exists ? doc.data() : {})
      .catch(err => console.error(err))
  }
}


var fb_config = {
  apiKey: "AIzaSyAfQc3JLSluNogTDwiHXy_pLJHmRd3Ufxw",
  authDomain: "jumia-brnk.firebaseapp.com",
  databaseURL: "https://jumia-brnk.firebaseio.com",
  projectId: "jumia-brnk",
  storageBucket: "jumia-brnk.appspot.com",
  messagingSenderId: "632015048847",
  appId: "1:632015048847:web:34f74684ef297532"
}

var element_id = 'app'
var feature_box = Featurebox({ id: '', config: fb_config, element_id, name: 'jumdle' })

feature_box.subscribe(feature_box.FETCHED_DATA, Begin)