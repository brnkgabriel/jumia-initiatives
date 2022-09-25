
class Calendar {
  constructor() {

    this.scrollUp = document.querySelector('.-control.-up')
    this.scrollDown = document.querySelector('.-control.-down')
    this.toScroll = document.querySelector('#fri-6 .-items')

    this.today = new Date()
    this.months = [
      'january', 'february', 'march',
      'april', 'may', 'june', 'july',
      'august', 'september', 'october',
      'november', 'december'
    ]

    this.init().scrollByButtons().set()
  }

  init() {

    var cols = document.querySelectorAll('.-calendar .-c-row:not(.-head) .-c-col')
    cols.forEach(col => {
      (this.today.getDate() == this.pDate(col)) ? col.classList.add('-today') : ''
      col.addEventListener('click', () => {
        this.update(col)
        // var popups = document.querySelectorAll('.-m-popup')
        // var id = col.getAttribute('id')
        // var popup = document.querySelector('.-m-popup#' + id)

        // popups.forEach(popup => popup.classList.remove('active'))
        // popup.classList.add('active')
      })
    })
    return this
  }
  
  set() {
    var month = this.today.getMonth()
    var monthStr = this.months[month].substr(0, 3)
    var id = monthStr + '-' + this.today.getDate()
    var popups = document.querySelectorAll('.-m-popup')
    var popup = document.getElementById(id)
    this.toScroll = popup.querySelector('.-items')
    popups.forEach(popup => popup.classList.remove('active'))
    popup.classList.add('active')
  }

  pDate(col) {
    var time = col.getAttribute('data-time')
    return new Date(time).getDate()
  }

  update(col) {
    var popups = document.querySelectorAll('.-m-popup')
    var id = col.getAttribute('id')
    var popup = document.querySelector('.-m-popup#' + id)
    var popup_mnt = popup.querySelector('.-month')
    popup_mnt.className = this.today.getDate() == this.pDate(col) ? '-month -today' : popup_mnt.className
    

    popups.forEach(popup => popup.classList.remove('active'))
    popup.classList.add('active')

    this.toScroll = popup.querySelector('.-items')
  }

  scrollByButtons () {
    var self = this
    this.scrollUp.addEventListener('click', function () {
      
      var start = self.toScroll.scrollTop - 20, end = self.toScroll.scrollTop - 50
      self.tween(start, end, 500, self.easeOutQuart, self.toScroll, 'Top');
    });
    this.scrollDown.addEventListener('click', function () {
      var start = self.toScroll.scrollTop + 20, end = self.toScroll.scrollTop + 50
      self.tween(start, end, 500, self.easeOutQuart, self.toScroll, 'Top');
    })
    return this
  }
  easeOutQuart(x, t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  }
  tween(start, end, duration, easing, w, type) {
    var delta = end - start;
    var startTime;
    if (window.performance && window.performance.now) { startTime = performance.now(); }
    else if (Date.now) { startTime = Date.now() }
    else { startTime = new Date().getTime() }

    var tweenLoop = function (time) {
      var t = (!time ? 0 : time - startTime);
      var factor = easing(null, t, 0, 1, duration);
      w['scroll' + type] = start + delta * factor;
      if (t < duration && w['scroll' + type] != end)
        requestAnimationFrame(tweenLoop);
    }
    tweenLoop();
  }
}

new Calendar()