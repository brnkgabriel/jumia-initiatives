class Wordle {
  constructor(data) {
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
    this.WRONG_SPOT = 2
    this.RIGHT_SPOT = 5
    this.NO_OF_LETTERS = 6

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
      str = isNaN(str) ? 0.0 : str
      return parseFloat(str)
    }

    function handleCorrectGuess() {
      var data = { attempt: self.guessAttempt, pts: self.pts, score: score() }
      console.log("data", data)
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
      updateStatus()
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



fetch("https://www.jumia.com.ng/sp-wordle-words/")
.then(res => res.text())
.then(data => new Wordle(data))
.catch(err => console.error(err))
