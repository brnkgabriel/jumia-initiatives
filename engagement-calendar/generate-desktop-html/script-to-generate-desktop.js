class Tag {
  constructor(properties) {
    this.tag = properties[0]
    this.attributes = properties[1]
    this.styles = properties[2]
    this.textContent = properties[3]
    this.element = null
  }

  get() {
    return this.create()
      .setAttributes()
      .setStyle()
      .setHTML()
      .getElement()
  }

  create() {
    this.element = document.createElement(this.tag)
    return this
  }

  assignAttribute(object) {
    var keys = Object.keys(object)
    keys.forEach(key => this.element.setAttribute(key, object[key]))
  }

  setAttributes() {
    this.assignAttribute(this.attributes)
    return this
  }

  setStyle() {
    this.assignAttribute(this.styles)
    return this
  }

  setHTML() {
    this.element.innerHTML = this.textContent
    return this
  }

  getElement() { return this.element }

  static appendMany2One(many, one) { many.forEach(each => one.appendChild(each)) }

}

class CategoriesAndMFls {
  constructor() {
    this.imgPath = 'https://ng.jumia.is/cms/8-18/jumia-choice/'
    this.mflPath = 'https://ng.jumia.is/cms/8-18/fs-dod/mfls/'
    this.host = 'https://www.jumia.com.ng'
    this.categories = [
      { name: 'groceries', link: '/groceries/', icon: 'groceries.jpg' },
      { name: 'phones & tablets', link: '/phones-tablets/', icon: 'phones-tabletsv2.jpg' },
      { name: "men's fashion", link: '/mlp-mens-fashion/', icon: 'mens-fashionv2.jpg' },
      { name: "women's fashion", link: '/mlp-womens-fashion/', icon: 'womens-fashionv2.jpg' },
      { name: "kid's fashion", link: '/mlp-kids-fashion/', icon: 'kids-fashion.jpg' },
      { name: 'electronics', link: '/electronics/', icon: 'electronics.jpg' },
      { name: 'computing', link: '/computing/', icon: 'computing.jpg' },
      { name: 'home & office', link: '/home-office/', icon: 'home.png' },
      { name: 'kitchen & dining', link: '/mlp-kitchen-dining/', icon: 'kitchen-dining.jpg' },
      { name: 'furniture', link: '/mlp-furniture/', icon: 'furniture.jpg' },
      { name: 'health & beauty', link: '/health-beauty/', icon: 'health-beauty-vw.jpg' },
      { name: 'baby products', link: '/baby-products/', icon: 'baby-products.jpg' },
      { name: 'board games', link: '/board-games/', icon: 'board-games.jpg' },
      { name: 'video games', link: '/video-games/', icon: 'video-games.jpg' },
      { name: 'sports', link: '/mlp-team-sports/', icon: 'sports.jpg' },
      { name: 'automobile', link: '/automobile/', icon: 'automobilev2.jpg' },
      { name: 'generators', link: '/mlp-generators/', icon: 'generators.jpg' },
      { name: 'industrial & scientific', link: '/mlp-industrial-scientific/', icon: 'industrial_scientific.jpg' },
      { name: 'books', link: '/books-movies-music/', icon: 'books-and-stationery.png' },
      { name: 'art, craft & sewing', link: '/mlp-art-craft-sewing/', icon: 'art-craft-sewing.jpg' }
    ]
    this.mfls = [
      { link: '/mlp-anniversary-h-1k-store/', icon: 'fl-1k-store.jpg' },
      { link: '/mlp-anniversary-h-deals/', icon: 'fl-anniversary-deals.jpg' },
      { link: '/mlp-deals-of-the-day/', icon: 'fl-deals-of-the-day.jpg' },
      { link: '/mlp-anniversary-h-free-shipping-deals/', icon: 'fl-free-delivery.jpg' },
      { link: '/sp-spin-win-how-to/', icon: 'fl-spin-win.jpg' },
      { link: '/sp-vouchers-of-the-week/', icon: 'fl-vouchers.jpg' }
    ]
  }

  get() {
    var mfls = `<div class="-title">anniversary offers</div><div class="-mfls">`
    var categories = `<div class="-title">top categories</div><div class="-categories">`

    this.mfls.map(mfl => {
      mfls += `<a class="-mfl -inlineblock -vamiddle" href="${this.host}${mfl.link}"><img src="${this.mflPath}${mfl.icon}" alt="cat_img"/></a>`
    })
    mfls += '</div>'

    this.categories.map(cat => {
      categories += `<a class="-category -inlineblock -vatop" href="${this.host}${cat.link}"><img src="${this.imgPath}${cat.icon}" alt="cat_img"/><div class="-txt">${cat.name}</div></a>`
    })
    categories += '</div>'

    // return mfls + categories
    return categories
  }
}

class Logic {
  constructor() {
    this.UNIQUE_PARAMETER = 'BlackFriday'
    this.UNIQUE_PARAMETER_2 = 'Prime'
    this.BOB_IMG_LINK = 'https://ng.jumia.is/cms/8-18/fs-dod/'
    this.LIVE_LINK = "https://www.jumia.com.ng/sp-mobile-apps"
    this.uniqueLinks = {
      'jumiapay.jpg': 'https://pay.jumia.com.ng/?utm_source=jumia&utm_medium=mall&utm_campaign=homepage',
      'fs-templatev4.jpg': 'https://pay.jumia.com.ng/?utm_source=jumia&utm_medium=mall&utm_campaign=homepage',
      'JumiaPay': 'https://pay.jumia.com.ng/?utm_source=jumia&utm_medium=mall&utm_campaign=homepage',
      'Jumia Food': 'https://food.jumia.com.ng/drinks/n3ab/jumia-party/food-fest-deals-3889/up-to-30-off-jameson-martell-absolu-26037/?utm_source=jumia&utm_medium=mall&utm_campaign=FlashSales'
    }
    this.host = 'https://www.jumia.com.ng'
    this.now = new Date()
    this.CURRENCY = '₦'
    this.keyValDelimeter = '='
    this.CATEGORY_BANNER = 'https://ng.jumia.is/cms/8-18/Anniversary/2020/flash-sales/ja20-cbmv2.jpg'
    this.LOGO_ICON = 'https://ng.jumia.is/cms/8-18/fs-dod/fs-pilot/ja-logov2.png'
    this.HEADER_COLOR = '#e43b14'
    this.extraMinutes = 900
    this.months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    this.daysOfWeek = [
      'sunday', 'monday', 'tuesday',
      'wednesday', 'thursday', 'friday',
      'saturday'
    ]
    this.skusData = [
      "sku=|name=HAYAT|desc=Groceries|tag=|time=October 30 2020 10:00:00 GMT+0100|oldPrice=|newPrice=Extra 5% Off|image=hayat__store.jpg|pdp=https://www.jumia.com.ng/hayat-store/|logo=hayat__store.jpg|category=Laptops|categorypdp=https://www.jumia.com.ng/laptops/asus--hp--lenovo/|startPrice=80000|endPrice=120000|status=available",
      "sku=GE779EA10JD3SNAFAMZ|name=M4C Smartwatch|desc=Waterproof|tag=|time=October 30 2020 10:00:00 GMT+0100|oldPrice=6159|newPrice=2700|image=m4c__wristband__waterproof.jpg|pdp=https://www.jumia.com.ng/generic-smart-watch-m4c-waterproof-blood-pressure-sport-heart-rate-42696316.html|logo=|category=Clothing Bundles|categorypdp=https://www.jumia.com.ng/mens-clothing-bundles/acelloti--fashion-brand--generic--jumia-bundles--rukari/|startPrice=0|endPrice=12190|status=available",
      "sku=NI930ST0IBFMANAFAMZ|name=Nivea Men Bundle|desc=Spray, Rollon, Creme, Bag|tag=|time=October 30 2020 10:00:00 GMT+0100|oldPrice=3235|newPrice=2340|image=nivea__me_n_Bundle.jpg|pdp=https://www.jumia.com.ng/nivea-deep-men-spray-deep-men-rollon-creme-for-men-free-shower-bag-64566703.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=GE779HA1H7AVINAFAMZ|name=Smoothie Blender|desc=USB|tag=|time=October 30 2020 10:00:00 GMT+0100|oldPrice=8599|newPrice=3790|image=smoothie__maker__blendr.jpg|pdp=https://www.jumia.com.ng/usb-mini-electric-fruit-juicer-handheld-smoothie-maker-blender-juice-cup-generic-mpg1213921.html|logo=|category=Washing Machines|categorypdp=https://www.jumia.com.ng/appliances-washers-dryers/|startPrice=23000|endPrice=40000|status=available",
      "sku=NI930ST1BWY9CNAFAMZ|name=Nivea Body Lotion For Women|desc=400ml x2|tag=|time=October 30 2020 10:00:00 GMT+0100|oldPrice=3400|newPrice=2700|image=nivea__cocoa__lotion__women.jpg|pdp=https://www.jumia.com.ng/nivea-nourishing-cocoa-body-lotion-for-women-400ml-pack-of-2-44397408.html|logo=|category=Groceries|categorypdp=https://www.jumia.com.ng/groceries/dangote--dano--devon-king-s--honeywell--indomie--jumia-bundles--nestle/|startPrice=4400|endPrice=10000|status=available",
      
      
      "sku=|name=HAYAT|desc=Groceries|tag=|time=October 30 2020 10:00:00 GMT+0100|oldPrice=|newPrice=Extra 5% Off|image=hayat__store.jpg|pdp=https://www.jumia.com.ng/hayat-store/|logo=hayat__store.jpg|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=|name=Pizza Hut|desc=The Big Boss|tag=JFood|time=October 30 2020 14:00:00 GMT+0100|oldPrice=|newPrice=50% Off|image=pizza__hut.jpg|pdp=https://tinyurl.com/y4u5uxv4|logo=pizza__hut.jpg|category=Smartphones|categorypdp=https://www.jumia.com.ng/smartphones/|startPrice=10000|endPrice=29990|status=available",
      "sku=LE792HA0UH6DUNAFAMZ|name=Lee Buy Single Burner|desc=Electric Cooking Plate|tag=|time=October 30 2020 14:00:00 GMT+0100|oldPrice=5275|newPrice=2800|image=leebuy__single__burner_jg.jpg|pdp=https://www.jumia.com.ng/lee-buy-electric-cooking-plate-single-burner-white-60998115.html|logo=|category=Sewing|categorypdp=https://www.jumia.com.ng/crafts-sewing-machines/|startPrice=0|endPrice=10000|status=available",
      "sku=CO169DB06XORYNAFAMZ|name=Coca Cola|desc=1Litre x12|tag=|time=October 30 2020 14:00:00 GMT+0100|oldPrice=2400|newPrice=1700|image=coca__cola__1l_x12.jpg|pdp=https://www.jumia.com.ng/coca-cola-coke-1litre-x12-45494611.html|logo=|category=Drinks|categorypdp=https://www.jumia.com.ng/drinks/|startPrice=0|endPrice=1700|status=available",
      "sku=GE779HL06Q9WPNAFAMZ|name= Electric Sewing Machine|desc=Mini - Home Handwork|tag=|time=October 30 2020 14:00:00 GMT+0100|oldPrice=9560|newPrice=4300|image=electric_mini_sewing_machine.jpg|pdp=https://www.jumia.com.ng/home-handwork-electric-mini-sewing-machine-with-led-light-generic-mpg1178071.html|logo=|category=Generators|categorypdp=https://www.jumia.com.ng/generators/|startPrice=40000|endPrice=70000|status=available",
      "sku=EA102EL15J90UNAFAMZ|name=Eaget Flash Drive|desc=32G + OTG Transfer Interface|tag=|time=October 30 2020 14:00:00 GMT+0100|oldPrice=4199|newPrice=1790|image=eaget__flash_drive_plus_gift.jpg|pdp=https://www.jumia.com.ng/eaget-u96-32gb-usb-3.0-metal-otg-flash-drive-eaget-mpg1236705.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",



      "sku=KN679GR14KQPHNAFAMZ|name=Knorr Combo Pack|desc=Beef & Chicken, Cubes & Powder|tag=BlackFriday|time=November 06 2020 00:00:00 GMT+0100|oldPrice=2500|newPrice=1250|image=knorr__combo__.jpg|pdp=https://www.jumia.com.ng/beef-cubes-chicken-cubes-chicken-powder-combo-pack-knorr-mpg1220889.html|logo=|category=Men Loafers|categorypdp=https://www.jumia.com.ng/mens-loafers-slip-ons/|startPrice=1690|endPrice=10000|status=available",
      "sku=DE973FF0S8KT5NAFAMZ|name=King's Cooking Oil|desc=5 Litres|tag=BlackFriday|time=November 06 2020 00:00:00 GMT+0100|oldPrice=4500|newPrice=2990|image=devon__king__5_l_itre_oil.jpg|pdp=https://www.jumia.com.ng/cooking-oil-5l-devon-kings-mpg1473315.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=JA052GR1B5DLHNAFAMZ-48279668|name=Jameson|desc=70cl - Irish Whiskey|tag=BlackFriday|time=November 06 2020 00:00:00 GMT+0100|oldPrice=5688|newPrice=2850|image=jameson___2.jpg|pdp=https://www.jumia.com.ng/jameson-irish-whiskey-70cl-35829197.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=BR614EA19CWOHNAFAMZ|name=UKA HD TV|desc=32 inches|tag=BlackFriday|time=November 06 2020 00:00:00 GMT+0100|oldPrice=47000|newPrice=35990|image=jbf__uka__32__inches__tv.jpg|pdp=https://www.jumia.com.ng/uka-32-led-hd-tv-haier-3-year-warranty-led32k8000-black-54943903.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      "sku=UM742MP05UJ48NAFAMZ-88640397|name=Umidigi A7|desc=4GB / 64GB|tag=BlackFriday|time=November 06 2020 00:00:00 GMT+0100|oldPrice=81900|newPrice=35990|image=bf_umidigi__a7_global.jpg|pdp=https://www.jumia.com.ng/umidigi-a7-4gb-64gb-rom-6.49full-screen-android-10-16mp8mp5mp5mp16mp-4150mah-global-band-dual-4g-triple-slots-green-63522890.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=EA839EC1BFHHUNAFAMZ|name=FIFA 21|desc=PS4|tag=BlackFriday|time=November 06 2020 00:00:00 GMT+0100|oldPrice=40000|newPrice=20990|image=bf__fifa21__ps4v2.jpg|pdp=https://www.jumia.com.ng/playstation-4-fifa-21-ea-sports-mpg1546740.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      "sku=|name=Jumia Prime|desc=3 Months Subscription|tag=Prime|time=November 06 2020 10:00:00 GMT+0100|oldPrice=|newPrice=20% Off|image=bf__jumia_prime_3months_subscriptionv2.jpg|pdp=https://www.jumia.com.ng/mlp-3-months-prime-subscriptions/|logo=bf__jumia_prime_3months_subscriptionv2.jpg|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=|name=Unilever|desc=Groceries|tag=BlackFriday|time=November 06 2020 10:00:00 GMT+0100|oldPrice=|newPrice=Up to 50% Off|image=unilever__storev3.jpg|pdp=https://www.jumia.com.ng/mlp-unilever-store/|logo=unilever-logo.png|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=BR169EA0IF1K1NAFAMZ|name=UKA HD TV|desc=32 inches|tag=BlackFriday|time=November 06 2020 10:00:00 GMT+0100|oldPrice=60000|newPrice=39000|image=jbf__uka__32__inches__tv.jpg|pdp=https://www.jumia.com.ng/uka-32-led-hd-tv-haier-3-year-warranty-led32k8000-black-54943903.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=CH351HL14XBTENAFAMZ|name=Chaoba Clipper|desc=With Aftershave and Bag|tag=BlackFriday|time=November 06 2020 10:00:00 GMT+0100|oldPrice=5000|newPrice=2990|image=chaoba-clipper-with-aftershave.jpg|pdp=https://www.jumia.com.ng/chaoba-clipper-with-after-shave-an-bag-chaoba-mpg207232.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      
      "sku=UM742MP19VU6NNAFAMZ|name=Umidigi A7 Pro|desc=4GB / 64GB|tag=BlackFriday|time=November 06 2020 12:00:00 GMT+0100|oldPrice=81900|newPrice=39990|image=bf__umidigi__a7_ligt_blue.jpg|pdp=https://www.jumia.com.ng/umidigi-a7-pro-6.3-inch-4gb64gb-rom-android-10.016mp16mp5mp5mp16mp-4150mah-global-version-dual-4g-smartphone-57186077.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      "sku=FA815GR124VKWNAFAMZ|name=Familia Tissue|desc=x48|tag=BlackFriday|time=November 06 2020 12:00:00 GMT+0100|oldPrice=6000|newPrice=2990|image=bf__familia__tissue.jpg|pdp=https://www.jumia.com.ng/familia-f-ultra-perfumed-strawberry-single-roll-x-48-6925046.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      
      "sku=|name=Reckitt Benckiser|desc=Groceries |tag=BlackFriday|time=November 06 2020 14:00:00 GMT+0100|oldPrice=|newPrice=Up to 50% Off|image=reckitt__benckiser__storev2.jpg|pdp=https://www.jumia.com.ng/mlp-reckitt-benckiser-store|logo=reckitt-benkiser-logo.png|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      "sku=FA203SH0HEULBNAFAMZ|name=Men's Sneakers|desc=Sports Shoes|tag=BlackFriday|time=November 06 2020 14:00:00 GMT+0100|oldPrice=4704|newPrice=1750|image=mens__breathable___sneakersv2.jpg|pdp=https://www.jumia.com.ng/fashion-mens-breathable-sports-shoes-sneakers-black-30364292.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=BI681HL0BK4YSNAFAMZ|name=Binatone Blender & Smoothie Maker|desc=1.25L + 0.5L|tag=BlackFriday|time=November 06 2020 14:00:00 GMT+0100|oldPrice=17849|newPrice=13990|image=bf__binatone__blender_1_25_0_5.jpg|pdp=https://www.jumia.com.ng/binatone-blender-and-smoothie-maker-bls-360-23351491.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=NI930ST1BWY9CNAFAMZ|name=Nivea Body Lotion For Women|desc=400ml x2|tag=BlackFriday|time=November 06 2020 14:00:00 GMT+0100|oldPrice=3400|newPrice=1250|image=nivea__cocoa__lotion__women.jpg|pdp=https://www.jumia.com.ng/nivea-nourishing-cocoa-body-lotion-for-women-400ml-pack-of-2-44397408.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      
      "sku=WE029EL10QZ4ENAFAMZ|name=WD External Hard Drive|desc=1TB|tag=BlackFriday|time=November 06 2020 16:00:00 GMT+0100|oldPrice=20900|newPrice=16500|image=bf__wd__hard_drive.jpg|pdp=https://www.jumia.com.ng/western-digital-1tb-external-hard-drive-with-nigeria-warranty-5742716.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=BI681HL0GCCMTNAFAMZ|name=Binatone Standing Fan|desc=18 inches|tag=BlackFriday|time=November 06 2020 16:00:00 GMT+0100|oldPrice=27200|newPrice=14900|image=bf__binatone_standing__fan_18inches.jpg|pdp=https://www.jumia.com.ng/binatone-18-inch-standing-fan-ts-1880-mk2-black.-10105472.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=GI790MT1H65EZNAFAMZ|name=Gionee S11 Lite|desc=4GB / 64GB|tag=BlackFriday|time=November 06 2020 16:00:00 GMT+0100|oldPrice=49990|newPrice=35990|image=gionee__s11___lite.jpg|pdp=https://www.jumia.com.ng/s11-lite-hybrid-dual-4gb-ram-32gb-rom-4g-lte-black-gionee-mpg147063.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=CH870AA1F4AW2NAFAMZ|name=Chrysolite Designs|desc=Polo & Cap Bundle - JA|tag=BlackFriday|time=November 06 2020 16:00:00 GMT+0100|oldPrice=6500|newPrice=2500|image=chrysolite__designs__27polocap.jpg|pdp=https://www.jumia.com.ng/chrysolite-designs-27-polo-cap-bundle-wine-wine-45116858.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      
      
      "sku=FR910HB1NJ5IENAFAMZ|name=Franck Olivier Oud Touch|desc=100ml|tag=BlackFriday|time=November 06 2020 18:00:00 GMT+0100|oldPrice=10000|newPrice=5990|image=franck__olivier__oud__touch.jpg|pdp=https://www.jumia.com.ng/franck-olivier-oud-touch-edp-for-men-100ml-5909999.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=NE493HL0NKT8BNAFAMZ|name=Nexus Refrigerator|desc=100 Litres|tag=BlackFriday|time=November 06 2020 18:00:00 GMT+0100|oldPrice=65990|newPrice=42990|image=bf__nexus_refrigerator_100l.jpg|pdp=https://www.jumia.com.ng/17120693.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
      "sku=|name=Saisho Bundle|desc=3 in 1|tag=BlackFriday|time=November 06 2020 18:00:00 GMT+0100|oldPrice=19000|newPrice=13290|image=bf__saisho__bundle.jpg|pdp=https://www.jumia.com.ng/saisho-electric-jug-s-402ss-double-burner-gas-stove-3-in-1-blender1.8-20795948.html|logo=|category=|categorypdp=|startPrice=|endPrice=|status=available",
    ]
    this.timeInterval = null
  }

  initializeClock(endTime) {
    this.timeInterval = setInterval(() => this.toUpdateClock(endTime), 1000)
  }

  toUpdateClock(endTime) {
    var t = this.remainingTime(endTime)
    var classNames = ['days', 'hours', 'minutes', 'seconds']
    this.updateClock(classNames, t)
    if (t['t'] <= 0) { clearInterval(this.timeInterval) }
  }

  remainingTime(endTime) {
    var t = +new Date(endTime) - (+new Date())
    var seconds = Math.floor((t / 1000) % 60)
    var minutes = Math.floor((t / 1000 / 60) % 60)
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24)
    var days = Math.floor(t / (1000 * 60 * 60 * 24))

    if (
      days === 0 && hours === 0 &&
      minutes === 0 && seconds === 0
    ) { setTimeout(() => location.reload(true), 1000); }

    return { t, days, hours, minutes, seconds }
  }

  updateClock(classNames, t) {
    var clock = document.getElementById('clock')
    classNames.forEach(name => {
      var el = clock.querySelector(`.${name}`)
      if (el === 'days') { el.innerHTML = t[name] }
      else { el.innerHTML = `0${t[name]}`.slice(-2) }
    })
  }

  expand(skus) {
    return skus.map(sku => this.json(sku.split('|')))
  }

  json(skuDetails) {
    var obj = {}
    skuDetails.map(property => {
      var keyValue = property.split(this.keyValDelimeter)
      obj[keyValue[0]] = keyValue[1]
    })
    return obj
  }

  times(skus) {
    var times = skus.map(sku => +new Date(sku['time']))
    var uniqueTimes = Array.from(new Set(times))
    return uniqueTimes.sort((a, b) => a - b)
  }

  group(skus, times) {
    return times.map(time => {
      var skusInTime = skus.filter(sku => +new Date(sku['time']) === parseInt(time))
      return { time, skus: skusInTime }
    })
  }

  pad(time) { return `0${time}`.slice(-2) }

  twelveHrFormat(hr, min) {
    if (hr === 12) return `${this.pad(hr)}:${this.pad(min)}pm`
    else if (hr > 12) return `${this.pad(hr - 12)}:${this.pad(min)}pm`
    else if (hr === 0) return `12:${this.pad(min)}am`
    else return `${this.pad(hr)}:${this.pad(min)}am`
  }

  fullDate(time) {
    var day = new Date(time).getDay()
    var month = new Date(time).getMonth()
    var date = new Date(time).getDate()
    var check = date.toString()[date.toString().length - 1]
    var dateTxt = date
    if (parseInt(check) === 1) { dateTxt = `${date}st` }
    else if (parseInt(check) === 2) {
      (date === 12) ? dateTxt = date + 'th' : dateTxt = date + 'nd'
    } else if (parseInt(check) === 3) {
      (date === 13) ? dateTxt = date + 'th' : dateTxt = date + 'rd'
    }
    else { dateTxt = `${date}th` }
    return `${this.daysOfWeek[day].substr(0, 3)} ${this.months[month].substr(0, 3)} ${dateTxt}`
  }

  date(time) {
    var $time = new Date(time)
    var timeDate = $time.getDate()
    var nowDate = this.now.getDate()
    var timeDiff = nowDate - timeDate

    if (timeDiff === 0) return 'today'
    else if (timeDiff === 1) return 'yesterday'
    else if (timeDiff === -1) return 'tomorrow'
    else return this.fullDate(time)
  }

  removeAddActive(toRemove, toAdd) {
    toRemove.forEach(each => each.classList.remove('active'))
    toAdd.classList.add('active')
  }

  tabListener(tab, time) {
    tab.addEventListener('click', () => {
      var skuRows = document.querySelectorAll('.-sku_row')
      var skuRow = document.querySelector(`._row-${time}`)
      var tabs = document.querySelectorAll('.-tab')
      this.removeAddActive(skuRows, skuRow)
      this.removeAddActive(tabs, tab)
      this.showSKUImage(skuRow)
    })
  }

  showSKUImage(skuRow) {
    var skus = skuRow.querySelectorAll('.-sku')
    skus.forEach(sku => {
      var img = sku.querySelector('.-img img')
      img.setAttribute('src', img.getAttribute('data-src'))
    })
  }

  createTab(time, idx) {
    var tabClass = (idx === 0) ? `-tab active -inline_block pos-rel -vamiddle -t-${time}` : `-tab -inline_block pos-rel -vamiddle -t-${time}`
    var date = new Date(time)
    var hr = date.getHours()
    var mn = date.getMinutes()
    var tabProps = {
      tab: ['div', { class: tabClass }, '', ''],
      tabTime: ['span', { class: '-time pos-abs' }, '', this.twelveHrFormat(hr, mn)],
      tabTxt: ['span', '', '', this.date(time)]
    }

    var tab = new Tag(tabProps['tab']).get()
    var tabTime = new Tag(tabProps['tabTime']).get()
    var tabTxt = new Tag(tabProps['tabTxt']).get()

    Tag.appendMany2One([tabTime, tabTxt], tab)
    this.tabListener(tab, time)
    return tab
  }

  replacePattern(pattern, str) {
    var re = new RegExp(pattern, 'g')
    var replaced = str.replace(re, '-')
    return replaced
  }

  skuID(name) {
    var replacedApos = this.replacePattern("'", name)
    var replaceAmp = this.replacePattern('&', replacedApos)
    var replacePercnt = this.replacePattern('%', replaceAmp)
    return replacePercnt.toLowerCase().split(' ').join('-')
  }

  price(rawPrice) {
    return rawPrice.split('-')
      .map(price => {
        var newPriceGtZero = `${this.CURRENCY}${parseInt(price).toLocaleString()}`
        var newPriceLtZero = 'FREE'
        return parseInt(price) === 0 ? newPriceLtZero : newPriceGtZero
      }).join(' - ')
  }

  createSKURow(group, idx) {
    var rowClass = (idx === 0) ? `-sku_row pos-rel active _row-${group.time}` : `-sku_row pos-rel _row-${group.time}`
    var rowProp = ['div', { class: rowClass, 'data-time': group.time }, '', '']
    return new Tag(rowProp).get()
  }

  discount(oldPrice, newPrice) {
    var diff = parseInt(oldPrice) - parseInt(newPrice)
    var ratio = diff * 100 / parseInt(oldPrice)
    if (!isNaN(ratio)) return `-${Math.round(ratio)}%`
  }

  isUnique(sku) {
    var unique = this.UNIQUE_PARAMETER.toLowerCase()
    return sku.tag.toLowerCase().indexOf(unique) != -1
  }

  isUnique2(sku) {
    var unique = this.UNIQUE_PARAMETER_2.toLowerCase()
    return sku.tag.toLowerCase().indexOf(unique) != -1
  }

  isAGroup(sku) {
    return sku.logo.length > 0
  }

  createSingle(sku) {
    var oldPrice = this.price(sku.oldPrice)
    var newPrice = this.price(sku.newPrice)
    var discount = this.discount(sku.oldPrice, sku.newPrice)
    var dNewPrice = discount ? newPrice : '???'
    var skuClass = this.uniqueLinks[sku.name] ? '-sku -inline_block -vatop pos-rel -unique_links' : '-sku -inline_block -vatop pos-rel'

    if (this.isUnique(sku)) {
      skuClass += ` -unique`
    } else if (this.isUnique2(sku)) {
      skuClass += ` -unique_2`
    }

    var skuProp = {
      sku: ['a', { href: this.link(sku), class: skuClass, id: this.skuID(sku['name']) }, '', ''],
      imgWrap: ['div', { class: '-img pos-rel' }, '', ''],
      img: ['img', { 'data-src': this.BOB_IMG_LINK + sku.image, alt: 'sku_img' }, '', ''],
      shadow: ['div', { class: 'pos-abs -shadow' }, '', ''],
      sold: ['span', { class: 'pos-abs' }, '', 'sold'],
      mask: ['span', { class: '-mask pos-abs' }, '', ''],
      maskBg: ['span', { class: '-mask_bg pos-abs' }, '', ''],
      name: ['div', { class: '-name' }, '', sku.name],
      desc: ['div', { class: '-desc' }, '', sku.desc],
      prices: ['div', { class: '-prices' }, '', ''],
      oldPrice: ['div', { class: '-price -old' }, '', oldPrice],
      newPrice: ['div', { class: '-price -new', 'data-new-price': newPrice }, '', dNewPrice],
      discount: ['div', { class: '-discount pos-abs' }, '', discount],
      cta: ['div', { class: '-cta' }, '', 'download app']
    }


    var skuEl = new Tag(skuProp['sku']).get()
    var imgWrap = new Tag(skuProp['imgWrap']).get()
    var img = new Tag(skuProp['img']).get()
    var shadow = new Tag(skuProp['shadow']).get()
    var sold = new Tag(skuProp['sold']).get()
    var maskBg = new Tag(skuProp['maskBg']).get()
    var mask = new Tag(skuProp['mask']).get()
    var name = new Tag(skuProp['name']).get()
    var desc = new Tag(skuProp['desc']).get()
    var prices = new Tag(skuProp['prices']).get()
    var oldPrice = new Tag(skuProp['oldPrice']).get()
    var newPrice = new Tag(skuProp['newPrice']).get()
    var discount = new Tag(skuProp['discount']).get()
    var cta = new Tag(skuProp['cta']).get()

    shadow.appendChild(sold)
    Tag.appendMany2One([newPrice, oldPrice], prices)
    Tag.appendMany2One([shadow, img], imgWrap)
    
    if (dNewPrice === '???')
      Tag.appendMany2One([imgWrap, name, desc, cta, mask, maskBg], skuEl)
    else
      Tag.appendMany2One([imgWrap, name, desc, prices, cta, mask, maskBg, discount], skuEl)

    return skuEl
  }

  link(sku) {
    return this.uniqueLinks[sku.name] ? this.uniqueLinks[sku.name] : this.LIVE_LINK
  }

  createGroup(sku) {
    var skuClass = this.uniqueLinks[sku.name] ? '-sku -inline_block -vatop pos-rel -unique_links' : '-sku -inline_block -vatop pos-rel'

    if (this.isUnique(sku)) {
      skuClass += ` -unique`
    } else if (this.isUnique2(sku)) {
      skuClass += ` -unique_2`
    }

    var skuProp = {
      sku: ['a', { href: this.uniqueLinks[sku.name] ? this.link(sku) : sku.pdp, class: skuClass, id: this.skuID(sku['name']) }, '', ''],
      imgWrap: ['div', { class: '-img pos-rel' }, '', ''],
      img: ['img', { 'data-src': this.BOB_IMG_LINK + sku.image, alt: 'sku_img' }, '', ''],
      shadow: ['div', { class: 'pos-abs -shadow' }, '', ''],
      sold: ['span', { class: 'pos-abs' }, '', 'sold'],
      mask: ['span', { class: '-mask pos-abs' }, '', ''],
      maskBg: ['span', { class: '-mask_bg pos-abs' }, '', ''],
      name: ['div', { class: '-name' }, '', sku.name],
      desc: ['div', { class: '-desc' }, '', sku.desc],
      prices: ['div', { class: '-prices' }, '', ''],
      oldPrice: ['div', { class: '-price -old' }, '', ''],
      newPrice: ['div', { class: '-price -new' }, '', sku.newPrice],
      discount: ['div', { class: '-discount pos-abs' }, '', ''],
      cta: ['div', { class: '-cta' }, '', 'preview']
    }

    var skuEl = new Tag(skuProp['sku']).get()
    var imgWrap = new Tag(skuProp['imgWrap']).get()
    var img = new Tag(skuProp['img']).get()
    var shadow = new Tag(skuProp['shadow']).get()
    var sold = new Tag(skuProp['sold']).get()
    var maskBg = new Tag(skuProp['maskBg']).get()
    var mask = new Tag(skuProp['mask']).get()
    var name = new Tag(skuProp['name']).get()
    var desc = new Tag(skuProp['desc']).get()
    var prices = new Tag(skuProp['prices']).get()
    var oldPrice = new Tag(skuProp['oldPrice']).get()
    var newPrice = new Tag(skuProp['newPrice']).get()
    var discount = new Tag(skuProp['discount']).get()
    var cta = new Tag(skuProp['cta']).get()

    shadow.appendChild(sold)
    Tag.appendMany2One([newPrice], prices)
    Tag.appendMany2One([shadow, img], imgWrap)
    Tag.appendMany2One([imgWrap, name, desc, prices, cta, mask, maskBg], skuEl)

    return skuEl
  }

  createSKU(sku) {
    return (this.isAGroup(sku)) ? this.createGroup(sku) : this.createSingle(sku)
  }

  extraMillisec(minutes) { return minutes * 60 * 1000 }

  endTime(time) {
    return time + this.extraMillisec(this.extraMinutes)
  }

  startEnd(times) {
    var start = times[0]
    var last = times[times.length - 1]
    var end = last + this.extraMillisec(this.extraMinutes)
    return { start, end }
  }

  skuRow(time) {
    return document.querySelector(`._row-${time}`)
  }

  oos(times) {
    times.map(time => {
      var oosRow = this.skuRow(time)
      oosRow.classList.add('-oos')
    })
  }

  pastAndFutureTimes(times) {
    var past = times.filter(time => +this.now > time && +this.now > this.endTime(time))
    var future = times.filter(time => past.indexOf(time) === -1)
    return { past, future }
  }

  gone(times) {
    this.oos(this.pastAndFutureTimes(times)['past'])
    this.reLabelActiveTabRow(this.pastAndFutureTimes(times)['future'])
  }

  reLabelActiveTabRow(times) {
    var tabs = document.querySelectorAll('.-tab')
    var nextTab = document.querySelector(`.-tab.-t-${times[0]}`)
    var skuRows = document.querySelectorAll('.-sku_row')
    var nextRow = document.querySelector(`._row-${times[0]}`)
    this.removeAddActive(tabs, nextTab)
    this.removeAddActive(skuRows, nextRow)
    this.showSKUImage(nextRow)
  }

  showNewPrice(sku) {
    var newPrice = sku.querySelector('.-price.-new')
    newPrice.textContent = newPrice.getAttribute('data-new-price')
  }

  oosSKU(skus) {
    var oosSKUs = skus.filter(sku => sku.status !== 'available')
    oosSKUs.map(sku => {
      var id = this.skuID(sku['name'])
      var el = document.getElementById(id)
      el.classList.add('-oos')
      this.showNewPrice(el)
      this.changeCTA(el, 'preview')
    })
  }

  changeCTA(sku, text) {
    sku.querySelector('.-cta').textContent = text
  }

  tab(time) {
    return document.querySelector(`.-t-${time}`)
  }

  live(list, action) {
    list.forEach(each => each.classList[action]('-live'))
  }

  changeCTAAndLink(skuRow, text) {
    var self = this
    var skus = skuRow.querySelectorAll('.-sku')
    skus.forEach(sku => self.changeCTA(sku, text))
  }

}

class Main {
  constructor() {
    this.logic = new Logic()
    this.skusEl = document.querySelector('.-skus')
    this.tabs = document.querySelector('.-tabs')
    this.nextCurrentSale = document.querySelector('.-next_current_sale')
    this.startsEnds = document.querySelector('.-starts_ends')
    this.toCopy = document.querySelector('.-to-copy')
    this.skusData = this.logic.skusData
    this.now = new Date()
    this.campaign = 'https://www.jumia.com.ng/mlp-fashion-forward/'

  }

  displayTabs(times) {
    // todo: sort time by current time
    times.map((time, idx) => this.tabs.appendChild(this.logic.createTab(time, idx)))
  }

  displaySKUs(skuGroups) {
    skuGroups.map((group, idx) => {
      var skuRow = this.logic.createSKURow(group, idx)
      group.skus.map(sku => skuRow.appendChild(this.logic.createSKU(sku)))
      this.skusEl.appendChild(skuRow)
    })
  }

  setState(times) {
    this.nextCurrentSale.classList.remove('-live')
    if (+this.now < this.logic.startEnd(times)['start']) { this.b41stSession(times) }
    else if (+this.now > this.logic.startEnd(times)['end']) { this.afterLastSession(times) }
    else { this.inAndBtwSessions(times) }
  }

  b41stSession(times) {
    var skuRow = this.logic.skuRow(times[0])
    this.logic.showSKUImage(skuRow)

    this.nextCurrentSale.textContent = `${this.logic.date(times[0])}'s sale`
    this.startsEnds.textContent = 'starts in'
    this.logic.initializeClock(times[0])

    console.log('before first session')
  }

  afterLastSession(times) {
    console.log('after last session')
  }

  inAndBtwSessions(times) {
    console.log('in and between session', times.length)
    this.logic.gone(times)
    this.coming(times)
  }

  coming(times) {
    var nextTime = this.logic.pastAndFutureTimes(times)['future'][0]
    var sessionCondition = +this.now >= nextTime && +this.now < this.logic.endTime(nextTime)

    sessionCondition ? this.inSession(nextTime) : this.betweenSession(nextTime)
  }

  inSession(nextTime) {
    var liveRow = this.logic.skuRow(nextTime)
    var liveTab = this.logic.tab(nextTime)
    var endTime = this.logic.endTime(nextTime)

    this.logic.changeCTAAndLink(liveRow, 'download app')
    this.logic.live([liveRow, this.nextCurrentSale, liveTab], 'add')
    this.logic.initializeClock(endTime)

    this.nextCurrentSale.textContent = `${this.logic.date(nextTime)}'s sale`
    this.startsEnds.textContent = 'ends in'
  }

  betweenSession(nextTime) {
    this.logic.initializeClock(nextTime)
    this.nextCurrentSale.textContent = `${this.logic.date(nextTime)}'s sale`
    this.startsEnds.textContent = 'starts in'
  }

  init() {
    var expanded = this.logic.expand(this.skusData)
    var times = this.logic.times(expanded)
    var grouped = this.logic.group(expanded, times)

    var pastAndFuture = this.logic.pastAndFutureTimes(times)
    var reorderedTimes = pastAndFuture['future'].concat(pastAndFuture['past'])

    this.displayTabs(reorderedTimes)
    this.displaySKUs(grouped)
    this.setState(times)

    // this.logic.oosSKU(expanded)

    this.generateHTML()
    return this
  }

  replaceStr(str, toreplace, replacement) {
    var re = new RegExp(toreplace, 'g')
    return str.replace(re, replacement)
  }

  generateHTML() {
    var styles = `
    <style type="text/css">
@import url(https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap);:root{--campaignDarkColor:#fe0000;--campaignLightColor:#fff;--campaignSecondDarkColor:#cd0000;--bgColor:#f5f5f5;--campaignFontColor:#000;--timerWidth:330px;--uniqueColor:#000;--uniqueColor2:#000b4d;--jumiaOrange:#f68b1e;--discountBg:#feefde;--scroll-track-color:rgba(255,255,255,0)}*,*::before,*::after{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-font-smoothing:subpixel-antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;padding:0;margin:0}body main{font-size:1.25em}main{width:100%!important;max-width:100%!important;background-color:var(--bgColor)}body{background-color:var(--bgColor)}.-container{width:100%;max-width:1170px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;background-color:var(--bgColor);color:#000}.-hide{display:none}.pos-rel,.-posrel{position:relative}.pos-abs,.-posabs{position:absolute}.-inline_block{display:inline-block}.-vamiddle{vertical-align:middle}.-vatop{vertical-align:top}.-red{color:red}.-skus{text-align:center}.-header{height:133px;background-color:var(--campaignDarkColor)}.-header>.-posabs{width:50%;text-align:center;height:100%;top:0%;z-index:2}.-header>img.-flash{top:50%;transform:translateY(-50%);z-index:1;left:24%;width:unset;height:70%}.-header .-left{left:2%;text-align:left;width:200px;height:unset;top:50%;transform:translateY(-50%)}.-header .-right{background-color:#fff;opacity:.94;left:50%;transform:translateX(-50%);display:block;color:#000;width:unset}.-header .-right .-header>.-posabs .-logo{width:100%;max-width:130px;top:15%;position:absolute;left:50%;transform:translateX(-50%)}.-header>.-posabs .-txt{text-transform:uppercase;left:50%;transform:translateX(-50%);bottom:0;width:fit-content;z-index:5;line-height:1;padding:8px 10px;background-color:rgba(255,255,255,.85);border-top-left-radius:5px;border-top-right-radius:5px}.-header .-posabs .-txt.-sub{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif!important}.-header .-keysku>.-txt{text-transform:uppercase;z-index:5;line-height:1;padding:8px 10px;background-color:rgba(255,255,255,.85);display:inline-block;position:unset;vertical-align:middle;transform:unset}.-header>.-posabs.-left .-txt{color:#fff;line-height:1;background-color:unset;font-size:2em;white-space:nowrap;padding-left:unset;bottom:unset;transform:unset;margin:unset;padding:unset;text-shadow:0 1px 3px rgba(0,0,0,.85);font-family:'Luckiest Guy';letter-spacing:3px}.-header>.-posabs.-left .-txt.-sub{font-size:1em;font-weight:700;letter-spacing:unset;box-shadow:unset}.-header>.-posabs .-txt span,.-header>.-posabs .-txt img{display:inline-block;vertical-align:middle}.-header>.-posabs .-txt img{width:15%}.-keysku{width:100%;height:100%;overflow:hidden;padding:0 30px}.-keysku img{width:100%;max-width:130px;display:inline-block;vertical-align:middle}.-keysku .-name{font-weight:600;color:var(--campaignDarkColor)}.-keysku .-desc{font-size:.7em;margin:1px 0}.-keysku .-price{font-size:.8em;font-weight:700}.-keysku .-price span{margin:0 1.5px}.-keysku .-price span.-percent{font-size:2em}.-keysku .-live{display:inline-block;margin:2px;background-color:var(--campaignDarkColor);color:#fff;padding:5px 10px;line-height:1;border-radius:50px;font-weight:700;font-size:.8em}.-keysku .-live.active{animation:blinking;animation-duration:.888s;animation-iteration-count:infinite}.-header>.-posabs .-logo{width:100%;max-width:150px;top:5%;position:absolute;left:0%}.-header .-posabs.downloadapp{top:50%;transform:translateY(-50%);right:1%;width:30%;max-width:280px;text-align:center;height:unset}.downloadapp .-notification{margin-bottom:10px}.downloadapp .-notification .-app{color:var(--campaignLightColor);font-weight:600}.downloadapp .-logos .-logo{display:inline-block;vertical-align:middle;width:calc(100% / 2.2);transform:scale(1);transition:transform 0.3s cubic-bezier(.175,.885,.32,1.275);position:unset}.downloadapp .-logos .-logo:hover{transform:scale(1.02)}.downloadapp .-logos .-logo img{width:100%}.tandc,.md-show{font-weight:700;border:0;cursor:pointer;outline:none;text-transform:uppercase;padding-top:3px;text-decoration:underline}.tandc{padding:5px}.md-show:active{transform:scale(.9);outline:none}.md-close{position:absolute;top:0;left:100%;background:var(--campaignDarkColor);color:#fff;cursor:pointer;border:3px solid #eaeded;font-size:1.2em;line-height:1.2em;font-weight:700;width:41px;height:41px;border-radius:50%;transform:translate(-50%,-50%)}.md-close::before,.md-close::after{content:'';width:3px;height:50%;background-color:var(--campaignLightColor);position:absolute;top:50%;left:50%}.md-close::before{transform:translate(-50%,-50%) rotate(45deg)}.md-close::after{transform:translate(-50%,-50%) rotate(-45deg)}.md-close:focus,.md-close:active{outline:none}.md-mask{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(52,73,94,.8);z-index:50;visibility:hidden;opacity:0;transition:0.3s}.md-modal{position:fixed;top:-50%;left:50%;width:100%;max-width:480px;background:#fff;z-index:100;opacity:0;transition:0.3s ease-out;transform:translate(-50%,-50%);transition:top 0.3s cubic-bezier(.175,.885,.32,1.275)}.md-active{visibility:visible;opacity:1}.md-active+.md-modal{visibility:visible;opacity:1;top:55%;transform:translate(-50%,-50%)}.fs-tandc-cta>h2{text-transform:uppercase;font-size:1.2em;font-weight:700}.fs-tandc-cta{display:inline-block;padding:10px;font-weight:500;text-transform:uppercase}#fs-tandc{z-index:35;text-align:center;background-color:var(--campaignLightColor);display:none}ol{text-align:left;padding-left:30px;padding-right:15px;padding-bottom:15px;padding-top:15px;box-shadow:0 2px 2px 0 rgba(0,0,0,.2);margin-left:2%;margin-right:2%;margin-bottom:2%;background-color:#fff;list-style:decimal}ol>li{font-size:.8em;line-height:1.5}.fs-tandc-mh{line-height:1.2;margin-top:5%;background-color:var(--campaignDarkColor);box-shadow:0 2px 2px 0 rgba(0,0,0,.2);color:#fff;text-transform:uppercase;padding:5px;margin-left:2%;margin-right:2%;font-weight:700;font-size:1em}.osh-search-bar>.field-panel{z-index:30!important}.-tabs{background-color:#fff;padding:10px 0;white-space:nowrap;overflow-x:auto;text-align:right;width:60%;scrollbar-color:#000 #c3bebe;scrollbar-width:thin}.-tabs::-webkit-scrollbar{transition:all .5s linear;height:20px}.-tabs::-webkit-scrollbar-track{background:var(--campaignDarkColor);height:5px;border-top:9.5px solid #fff;border-bottom:9.5px solid #fff}.-tabs::-webkit-scrollbar-thumb{background-color:var(--campaignDarkColor);box-shadow:0 1px 1px 0 rgba(0,0,0,.2);border-radius:15px}.-tabs:hover::-webkit-scrollbar-thumb{border-radius:15px;background-color:transparent;box-shadow:inset 0 0 6px rgba(0,0,0,.5)}.-tabs .-tab{padding:10px;margin:0 8px;text-align:center;cursor:pointer;position:relative;text-transform:uppercase;font-size:.9em;font-weight:500;transition:color 0.1s linear}.-tabs .-tab.-live span{color:var(--campaignDarkColor);animation:blinking;animation-duration:.888s;animation-iteration-count:infinite}.-tabs .-tab::before,.-tabs .-tab::after{position:absolute;content:'';height:2px;width:100%;bottom:0;left:50%;transform:translate(-50%,-50%)}.-tabs .-tab::before{background-color:var(--bgColor);z-index:0}.-tabs .-tab::after{background-color:var(--campaignDarkColor);z-index:1;width:0%;transition:width 0.3s cubic-bezier(.075,.82,.165,1)}.-tabs .-tab.-unique::after{background-color:var(--uniqueColor)}.-tabs .-tab.active{color:var(--campaignDarkColor)}.-tabs .-tab.-unique.active{color:var(--uniqueColor)}.-tabs .-tab.active::after{width:100%}.-sku_row{display:none;text-align:center}.-sku_row.active{display:block}.-sku_row .-row_header{text-align:center;padding:20px 0;background-color:#fff;border-top:2px solid var(--bgColor)}.-sku_row .-row_header .-time{text-transform:capitalize}.-sku:not(.osh-featured-box){text-align:left;width:calc(95% / 5);margin:calc(5% / 10);text-decoration:none;color:#000;background-color:#fff;padding:10px;position:relative;border-radius:5px;box-shadow:0 1px 1px 0 rgba(0,0,0,.12)}.-sku:not(.osh-featured-box):hover{color:black!important;box-shadow:0 0 12px 0 rgba(0,0,0,.12)}.-sku:not(.osh-featured-box)::before{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.2);z-index:1;display:none}.-sku .-img{width:202px;margin:0 auto;height:202px;background:url(https://ng.jumia.is/cms/8-18/fs-dod/fs-pilot/placeholder.jpg) no-repeat center hsl(0,0%,80%);background-position:top left;background-size:contain}.-sku .-mask_bg{content:'';position:absolute;width:100px;height:50px;border-bottom:solid 25px transparent;border-right:solid 50px transparent;border-top:solid 25px var(--campaignDarkColor);border-left:solid 50px var(--campaignDarkColor);z-index:2;top:0;left:0}.-sku.-unique_links .-mask_bg{display:none}.-sku.-unique .-mask_bg{border-top:solid 25px var(--uniqueColor);border-left:solid 50px var(--uniqueColor)}.-sku.-unique_2 .-mask_bg{display:block;border-top:solid 25px var(--uniqueColor2);border-left:solid 50px var(--uniqueColor2)}.-sku:not(.osh-featured-box)::after{content:'flash sale';position:absolute;text-transform:uppercase;font-weight:600;z-index:3;color:#fff;top:3.5%;left:2%;transform:rotate(-25deg);font-size:.65em}.-sku:not(.osh-featured-box).-unique_links::after{display:none}.-sku.-unique::after{content:'black friday';left:0}.-sku.-unique_2::after{content:"";display:block;background-image:url(https://ng.jumia.is/cms/8-18/jumia-prime/icons/jumia-prime-white.png);width:70px;height:8.5px;z-index:1000;background-size:contain;background-repeat:no-repeat;top:5%;left:-.5%}.-sku .-img .-shadow{position:absolute;width:100%;height:100%;background-color:rgba(0,0,0,.6);top:0;left:0;display:none;z-index:1}.-sku_row.-oos .-sku .-img .-shadow,.-sku_row .-sku.-oos .-img .-shadow{display:block}.-sku .-img .-shadow span{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-transform:uppercase;color:#fff;font-weight:600;font-size:1.5em}.-sku .-img img{width:100%;display:block;margin:0 auto;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.-sku .-mask{top:0;left:0;width:40px;height:20px;border-bottom:solid 10px transparent;border-right:solid 20px transparent;border-top:solid 10px #fff;border-left:solid 20px #fff;z-index:4}.-sku .-name,.-sku .-desc{white-space:nowrap;text-overflow:ellipsis;overflow-x:hidden}.-sku .-name{margin-top:10px;font-weight:500}.-sku .-desc{font-size:.8em}.-sku .-prices{margin-bottom:5px;height:47px}.-sku .-prices .-price.-new{margin:5px 10px;font-size:1.2em;font-weight:600;margin-left:unset;color:var(--campaignDarkColor)}.-sku .-prices .-price.-old{font-size:.75em;text-decoration:line-through}.-sku .-cta{background-color:var(--campaignDarkColor);color:#fff;text-align:center;padding:5px;text-transform:uppercase;font-weight:500;font-size:.9em;box-shadow:0 2px 4px 0 rgba(0,0,0,.2);border-radius:4px;visibility:hidden}.-sku:hover .-cta{visibility:visible}.-timer_tabs{padding:10px;padding-top:5px;background-color:#fff}.-timer{width:40%}.-timer .-ncs_se{text-transform:uppercase;font-weight:500;margin-right:5px;margin-bottom:3px}.-timer .-next_current_sale{background-color:var(--campaignDarkColor);color:#fff;margin-bottom:5px;padding:10px;text-transform:uppercase;font-size:.75em;font-weight:700}.-timer .countdownwrap{margin-top:10px}.-timer .countdownwrap .-starts_ends{font-weight:500;margin:0 10px;margin-bottom:3px;text-align:center;display:inline-block;vertical-align:8px}.-timer .countdownwrap .-clock_element{margin:0 5px;text-align:center;display:inline-block;vertical-align:middle}.-timer .countdownwrap .-clock_element .-txt{font-size:.8em;text-transform:capitalize;font-weight:500}.-timer .countdownwrap span:first-child{width:30px;height:30px;text-align:center;background-color:var(--campaignDarkColor);border-radius:50%;line-height:30px;color:#fff;font-weight:500;display:block}@keyframes blinking{0%{opacity:0}24%{opacity:0}25%{opacity:1}49%{opacity:1}50%{opacity:0}74%{opacity:0}75%{opacity:1}99%{opacity:1}100%{opacity:0}}.-generate-app-html{height:400px}.-generate-app-html .-generate{width:15%;background-color:#f90;text-align:center;padding:10px 0;font-weight:500;border-radius:10px;box-shadow:0 1px 1px 0 rgba(0,0,0,.2);cursor:pointer;margin-right:5%}.-generate-app-html .-to-copy{width:80%;height:100%}.-generate-app-html .-skus.-app{display:none}.osh-featured-box{width:100%;max-width:1170px;margin:0 auto;background-color:#fff}.osh-featured-box>.wrapper{margin-left:4%}.-tabs .-tab .-time{transform:translateY(-100%);font-size:.8em;font-weight:700}.-tabs .-tab.-unique .-time::before{position:absolute;color:var(--uniqueColor);top:50%;left:-40%;border-radius:50%}.-discount{top:76%;right:10px;font-weight:500;background-color:var(--discountBg);color:var(--jumiaOrange);padding:3px 6px}#category-icons{background-color:var(--darkColor);text-align:center}#category-icons .-category-icon{display:inline-block;vertical-align:top;width:10%;text-align:center;margin:20px 0}#category-icons .-category-icon .-img{width:30%;display:block;margin:0 auto}#category-icons .-category-icon .-txt{text-transform:capitalize;font-size:.75em;font-weight:500;color:#fff}.-title{padding:20px 0;text-transform:uppercase;font-weight:600;text-align:center;color:var(--campaignFontColor);padding-bottom:5px}.-categories{padding-top:unset;background-color:#fff;font-size:.9em}.-inlineblock{display:inline-block}.-vatop{vertical-align:top}.-categories .-category{width:10%;text-align:center;max-width:150px;border:1px solid rgba(0,0,0,.05);padding:10px 5px;transition:transform .1s cubic-bezier(.4,0,.6,1),box-shadow .1s cubic-bezier(.4,0,.6,1),-webkit-transform .1s cubic-bezier(.4,0,.6,1);text-decoration:none;color:#000}.-categories .-category:hover{transform:translateZ(0);z-index:1;border-color:rgba(0,0,0,.12);box-shadow:0 0 .8125rem 0 rgba(0,0,0,.05)}.-categories .-category img{width:60%;display:block;margin:0 auto}.-categories .-category .-txt{display:block;margin-top:5px;text-transform:capitalize;line-height:1;font-weight:500;height:30px;font-size:.85em}.-mfls .-mfl{height:unset;display:inline-block;vertical-align:middle;width:calc(95% / 3);background-color:#fff;margin:calc(5% / 6);border-radius:8px;box-shadow:0 1px 1px 0 rgba(0,0,0,.2)}.-mfls .-mfl img{width:100%;border-radius:8px}.-floor{margin:24px 0;background-color:#fff;box-shadow:0 1px 1px 0 rgba(0,0,0,.2);border-radius:4px;margin-top:unset}.-floor .-title{overflow:hidden;cursor:pointer;padding:unset;background-color:#fff;border-top-left-radius:4px;border-top-right-radius:4px;border-bottom:2px solid var(--bgColor)}#category-search .-title{position:sticky;left:0;top:0;z-index:1;background-color:var(--campaignDarkColor);border-bottom:unset;color:#fff}#category-search .-title .-main .-cta{color:#fff}.-floor .-title .-main{height:65px;border-top-left-radius:4px;border-top-right-radius:4px}.-floor .-title .-main .-txt,.-floor .-title .-main .-cta{top:50%;transform:translateY(-50%);left:8px;font-size:1.2em;font-weight:600;text-transform:capitalize}.-floor .-title .-main .-cta{left:unset;right:8px;text-transform:uppercase;font-size:.8em;font-weight:700;color:var(--jumiaOrange);text-decoration:unset}.-floor .-title .-subtitle{padding-left:8px;text-align:left;top:50%;left:50%;transform:translate(-50%,-50%);color:var(--campaignDarkColor);text-transform:uppercase;font-weight:600}.-floor .-products{padding:4px;white-space:nowrap;overflow:auto;padding:8px 4px;padding-bottom:unset;overflow-y:hidden;overflow:auto;-ms-overflow-style:none;scrollbar-width:none}.-search_floor .-products{white-space:pre-wrap}.-search_floor .-control{display:none!important}.-floor .-products::-webkit-scrollbar{display:none}.-floor .-products .-product{width:calc(100% / 5.5);margin:0 4px;text-align:center;text-decoration:unset;color:#000;margin-bottom:16px}.-search_floor .-floor .-products .-product{width:calc(95% / 6);margin:calc(5% / 12);box-shadow:0 0 0 0 transparent;padding:10px;height:260px}.-search_floor .-floor .-products .-product:hover{box-shadow:0 0 12px 0 rgba(0,0,0,.12)}.-floor .-products .-product .-img{width:100%}.-floor .-products .-product .-img img{width:100%}.-floor .-products .-product .-discount{right:6%;top:6%;color:var(--jumiaOrange);font-weight:700;background-color:#feefde;padding:0 4px;height:24px;line-height:24px}.-floor .-products .-product .-name{padding:8px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;text-align:left;font-weight:600}.-floor .-products .-product .-price{font-weight:600;text-align:left;padding:0 8px;font-size:1.3em;overflow:hidden;text-overflow:ellipsis}.-floor .-products .-product .-price.-old{color:gray;text-decoration:line-through;font-size:1em}.-floor .-control{background-color:rgba(40,40,40,.5);width:40px;height:40px;border-radius:50%;top:50%;transform:translateY(-50%);cursor:pointer}.-floor .-control.-next{right:5px;transform:translateY(-50%) rotate(45deg)}.-floor .-control.-prev{left:5px;transform:translateY(-50%) rotate(-135deg)}.-floor .-control::before{content:'';width:10px;height:10px;border:2px solid #fff;border-left:unset;border-bottom:unset;top:50%;left:50%;transform:translate(-50%,-50%);position:absolute}.-search{width:50%;top:50%;left:50%;transform:translate(-50%,-50%);height:48px;opacity:1;margin:0 auto}.-searchicon{height:100%;width:48px}.-searchicon::before,.-searchicon::after{content:'';position:absolute;top:50%;transform:translateY(-50%)}.-searchicon::after{width:10px;height:2px;top:67%;background-color:gray;transform:translateY(-50%) rotate(45deg);left:61%}.-searchicon::before{width:20px;height:20px;border:2px solid gray;border-radius:50%;left:30%}.-searchinput{background-color:#fff;border:none;border-radius:.5rem;box-shadow:0 1px 2px 0 rgba(60,64,67,.30),0 1px 3px 1px rgba(60,64,67,.15);box-sizing:border-box;color:#202124;display:block;height:48px;padding:0 50px;width:100%;-webkit-appearance:none;outline:none;line-height:1;text-overflow:ellipsis}#preloader{height:40px;width:40px;top:50%;transform:translateY(-50%);opacity:0;right:1%}#preloader.-loading{opacity:1}#preloader .-txt{top:50%;transform:translateY(-50%);left:50px;font-weight:600}#preloader::before{content:"";display:block;position:absolute;left:-1px;top:-1px;height:100%;width:100%;border:1px solid var(--campaignDarkColor);border-top:1px solid transparent;border-radius:100%}#preloader.-loading::before{animation:rotation 1s linear infinite}#preloader>.icon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);animation:wink 1s ease-in-out infinite alternate;width:60%}@keyframes rotation{from{transform:rotate(0deg)}to{transform:rotate(359deg)}}@keyframes wink{from{opacity:0}to{opacity:1}}.-b2s{background-color:var(--campaignLightColor);color:var(--campaignDarkColor);text-decoration:unset;display:inline-block;line-height:1;text-transform:uppercase;padding:10px;font-weight:700;margin-top:5px;font-size:.8em;box-shadow:0 1px 1px 0 rgba(0,0,0,.2)}.-rules_eligibility{font-size:.9em;background-color:#fff;box-shadow:0 1px 1px 0 rgba(0,0,0,.2)}.-rules_eligibility .-re{width:calc(95% / 2);margin:calc(5% / 4);padding:0 15px;border-radius:3px;display:inline-block;vertical-align:top}.-rules_eligibility .-re .-title{font-size:1.5em;text-transform:capitalize;text-align:center;background-color:var(--darkerBgColor);color:var(--white);padding:unset;border-top-left-radius:15px;border-top-right-radius:15px}.-rules_eligibility .-re .-rule_element,.-rules_eligibility .-re .-eligibility_element{margin:15px 0}.-rules_eligibility .-re .-num{width:4%;font-weight:500}.-rules_eligibility .-re .-desc{width:90%;letter-spacing:.5px}
        </style>
        `
    var top = `
<div class="-container"><div class="-header pos-rel"> <img class="-posabs -flash" src="https://ng.jumia.is/cms/8-18/fs-dod/fs-pilot/banner-divider.png" alt="flash" /><div class="-posabs -left"><div class="-txt -sub">daily</div><div class="-txt">flash sales</div><a href="${this.campaign}" class="-b2s">back to shop</a></div> <a href="#" class="-posabs -right"><div class="-keysku"> <img class="-keysku-img" src="https://ng.jumia.is/cms/8-18/fs-dod/fs-pilot/placeholder.jpg" alt="cat_img" /><div class="-txt -posabs"><div class="-name"></div><div class="-desc"> <span class="-extra"></span><span class="-percent">%</span><span class="-off">off</span></div><div class="-live">live at 2pm</div></div></div> </a><div class="downloadapp -posabs"><div class="-notification"><div class="-app">DOWNLOAD THE JUMIA APP</div></div><div class="-logos"> <a href="https://play.google.com/store/apps/details?id=com.jumia.android&referrer=adjust_reftag%3DcdTxOjM" class="-logo" target="_blank"> <img src="https://ng.jumia.is/cms/8-18/icons/google.png" alt="google app logo" /> </a><a href="https://apps.apple.com/us/app/jumia-online-shopping/id925015459" class="-logo" target="_blank"> <img src="https://ng.jumia.is/cms/8-18/icons/apple.png" alt="apple app logo" /> </a></div></div></div><div class="-main-el"><div class="-timer_tabs"><div class="-timer -inline_block -vamiddle"><div class="-next_current_sale -inline_block -vamiddle">tomorrow's sale</div><div class="countdownwrap -inline_block -vamiddle" id="clock"><div class="-starts_ends">Starts in</div><div class="-inline_block -vamiddle -clock_element"> <span class="days"></span> <span class="-txt">days</span></div><div class="-inline_block -vamiddle -clock_element"><span class="hours"></span><span class="-txt">hours</span></div><div class="-inline_block -vamiddle -clock_element"><span class="minutes"></span><span class="-txt">mins</span></div><div class="-inline_block -vamiddle -clock_element"><span class="seconds"></span><span class="-txt">secs</span></div></div></div><div class="-tabs -inline_block -vamiddle"></div></div>
    `

    var bottom = `</div><div class="-rules_eligibility"><div class="-re -rules"><div class="-title">flash sale terms</div><div class="-rule_element"><div class="-inline_block -vatop -num">1.</div><div class="-inline_block -vatop -desc">Selected products are offered to the public at highly subsidized prices by Jumia.</div></div><div class="-rule_element"><div class="-inline_block -vatop -num">2.</div><div class="-inline_block -vatop -desc">Discount level can be as high as 90% off depending on the offer</div></div><div class="-rule_element"><div class="-inline_block -vatop -num">3.</div><div class="-inline_block -vatop -desc">The number of products are of a limited quantity.</div></div><div class="-rule_element"><div class="-inline_block -vatop -num">4.</div><div class="-inline_block -vatop -desc">Flash sales go live at a specified time.</div></div><div class="-rule_element"><div class="-inline_block -vatop -num">5.</div><div class="-inline_block -vatop -desc">As selected products are popular and of limited quantity, you can expect them to sell out very quickly.</div></div><div class="-rule_element"><div class="-inline_block -vatop -num">6.</div><div class="-inline_block -vatop -desc">Flash sales typically sell out in seconds.</div></div><div class="-rule_element"><div class="-inline_block -vatop -num">7.</div><div class="-inline_block -vatop -desc">Bear in mind that tens of thousands of people are on the same page trying to buy the same product.</div></div><div class="-rule_element"><div class="-inline_block -vatop -num">8.</div><div class="-inline_block -vatop -desc">Jumia reserves the right to cancel orders it deems as fraudulent.</div></div><div class="-rule_element"><div class="-inline_block -vatop -num">9.</div><div class="-inline_block -vatop -desc">Jumia reserves the right to change products offered for flash sales.</div></div></div><div class="-re -eligibility"><div class="-title">eligibility criteria</div><div class="-eligibility_element"><div class="-inline_block -vatop -num">1.</div><div class="-inline_block -vatop -desc">Flash sales are limited to one item per customer.</div></div><div class="-eligibility_element"><div class="-inline_block -vatop -num">2.</div><div class="-inline_block -vatop -desc">You need to be super quick with your phone and on a fast and stable internet connection to buy a flash sale.</div></div><div class="-eligibility_element"><div class="-inline_block -vatop -num">3.</div><div class="-inline_block -vatop -desc">Flash sales are only available on the Jumia App</div></div><div class="-eligibility_element"><div class="-inline_block -vatop -num">4.</div><div class="-inline_block -vatop -desc">It’s really a case of the fastest fingers first.</div></div><div class="-eligibility_element"><div class="-inline_block -vatop -num">5.</div><div class="-inline_block -vatop -desc">Finding an item and adding it to your cart is no guaranty that you will be able to checkout with it before others.</div></div><div class="-eligibility_element"><div class="-inline_block -vatop -num">6.</div><div class="-inline_block -vatop -desc">All staff, family of staff, partners and agents are not eligible.</div></div></div></div><div class="-title -other-deals">other deals</div><div class="-row -product_floors -auto_load"></div><div class="-row -product_floors -search_floor"><div class="-floor -posrel" id="category-search"><div class="-title -posrel"><div class="-main -posrel"><div class="-txt -posabs">Still can't find what you seek?</div> <a href="https://www.jumia.com.ng/drinks/?price=0-2989" class="-cta -posabs">see all</a></div><div class="-search -posabs"><div class="-searchicon -posabs"></div> <input class="-searchinput" type="text" placeholder="Search products, brands, prices and categories"/><div id="preloader" class="-posabs"> <img class="icon" src="https://ng.jumia.is/cms/0-1-weekly-cps/shop-on-a-budget/placements/bolt.png" alt="_img"/></div></div></div><div class="-products"></div><div class="-control -prev -posabs"></div><div class="-control -next -posabs"></div></div></div>${new CategoriesAndMFls().get()}</div>`

    var script = `
    <script>
class Tag{constructor(e){this.tag=e[0],this.attributes=e[1],this.styles=e[2],this.textContent=e[3],this.element=null}get(){return this.init().setAttributes().setStyle().setHTML().getElement()}init(){return this.element=document.createElement(this.tag),this}static create(e){return new Tag(e).get()}assignAttribute(e){Object.keys(e).forEach(t=>this.element.setAttribute(t,e[t]))}setAttributes(){return this.assignAttribute(this.attributes),this}setStyle(){return this.assignAttribute(this.styles),this}setHTML(){return this.element.innerHTML=this.textContent,this}getElement(){return this.element}static appendMany2One(e,t){e.forEach(e=>t.appendChild(e))}}class Logic{constructor(e){this.expanded=this.expand(e),this.UNIQUE_PARAMETER="- JA",this.BOB_IMG_LINK="https://ng.jumia.is/cms/0-2-offers/",this.host="https://www.jumia.com.ng/",this.now=new Date,this.CURRENCY="₦",this.keyValDelimeter="=",this.CATEGORY_BANNER="https://ng.jumia.is/cms/8-18/Anniversary/2020/flash-sales/ja20-cbmv2.jpg",this.HEADER_COLOR="#e43b14",this.extraMinutes=120,this.months=["January","February","March","April","May","June","July","August","September","October","November","December"],this.daysOfWeek=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],this.timeInterval=null}initializeClock(e){this.timeInterval=setInterval(()=>this.toUpdateClock(e),1e3)}toUpdateClock(e){var t=this.remainingTime(e);this.updateClock(["days","hours","minutes","seconds"],t),t.t<=0&&clearInterval(this.timeInterval)}remainingTime(e){var t=+new Date(e)-+new Date,s=Math.floor(t/1e3%60),i=Math.floor(t/1e3/60%60),r=Math.floor(t/36e5%24),a=Math.floor(t/864e5);return 0===a&&0===r&&0===i&&0===s&&setTimeout(()=>location.reload(!0),1e3),{t:t,days:a,hours:r,minutes:i,seconds:s}}updateClock(e,t){var s=document.getElementById("clock");e.forEach(e=>{var i=s.querySelector("."+e);i.innerHTML="days"===i?t[e]:("0"+t[e]).slice(-2)})}expand(e){return e.map(e=>this.json(e.split("|")))}json(e){var t={};return e.map(e=>{var s=e.split("=");t[s[0]]=s[1]}),t}times(e){var t=e.map(e=>+new Date(e.time));return Array.from(new Set(t)).sort((e,t)=>e-t)}group(e,t){return t.map(t=>{var s=e.filter(e=>+new Date(e.time)===parseInt(t));return{time:t,skus:s}})}pad(e){return("0"+e).slice(-2)}twelveHrFormat(e,t){return 12===e?this.pad(e)+":"+this.pad(t)+"pm":e>12?this.pad(e-12)+":"+this.pad(t)+"pm":0===e?"12:"+this.pad(t)+"am":this.pad(e)+":"+this.pad(t)+"am"}fullDate(e){var t=new Date(e).getDay(),s=new Date(e).getMonth(),i=new Date(e).getDate(),r=i.toString()[i.toString().length-1],a=i;return a=1===parseInt(r)?i+"st":2===parseInt(r)?12===i?i+"th":i+"nd":3===parseInt(r)?13===i?i+"th":i+"rd":i+"th",this.daysOfWeek[t].substr(0,3)+" "+this.months[s].substr(0,3)+" "+a}date(e){var t=new Date(e).getDate(),s=this.now.getDate()-t;return 0===s?"today":1===s?"yesterday":-1===s?"tomorrow":this.fullDate(e)}AMPM(e){var t=new Date(e),s=t.getHours(),i=t.getMinutes();return this.twelveHrFormat(s,i)}removeAddActive(e,t){e.forEach(e=>e.classList.remove("active")),t.classList.add("active")}tabListener(e,t){e.addEventListener("click",()=>{var s=document.querySelectorAll(".-sku_row"),i=document.querySelector("._row-"+t),r=document.querySelectorAll(".-tab");this.removeAddActive(s,i),this.removeAddActive(r,e),this.showSKUImage(i)})}showSKUImage(e){e.querySelectorAll(".-sku").forEach(e=>{var t=e.querySelector(".-img img");t.setAttribute("src",t.getAttribute("data-src"))})}createTab(e,t){var s=0===t?"-tab active -inline_block pos-rel -vamiddle -t-"+e:"-tab -inline_block pos-rel -vamiddle -t-"+e,i=new Date(e),r=i.getHours(),a=i.getMinutes(),n={tab:["div",{class:s},"",""],tabTime:["span",{class:"-time pos-abs"},"",this.twelveHrFormat(r,a)],tabTxt:["span","","",this.date(e)]},o=new Tag(n.tab).get(),c=new Tag(n.tabTime).get(),l=new Tag(n.tabTxt).get();return Tag.appendMany2One([c,l],o),this.tabListener(o,e),o}replacePattern(e,t){var s=new RegExp(e,"g");return t.replace(s,"-")}skuID(e){var t=this.replacePattern("'",e),s=this.replacePattern("&",t);return this.replacePattern("%",s).toLowerCase().split(" ").join("-")}price(e){return e.split("-").map(e=>{var t=this.CURRENCY+parseInt(e).toLocaleString();return 0===parseInt(e)?"FREE":t}).join(" - ")}createSKURow(e,t){var s=["div",{class:0===t?"-sku_row pos-rel active _row-"+e.time:"-sku_row pos-rel _row-"+e.time,"data-time":e.time},"",""];return new Tag(s).get()}discount(e,t){var s=100*(parseInt(e)-parseInt(t))/parseInt(e);if(!isNaN(s))return"-"+Math.round(s)+"%"}isUnique(e){var t=this.UNIQUE_PARAMETER.toLowerCase();return-1!=e.tag.toLowerCase().indexOf(t)}createSKU(e){var t=this.price(e.oldPrice),s=this.price(e.newPrice),i=this.discount(e.oldPrice,e.newPrice),r=i?s:"???",a=this.isUnique(e)?"-sku -inline_block -vatop pos-rel -unique":"-sku -inline_block -vatop pos-rel",n={skuEl:["a",{href:this.host+e.urlApp,class:a,id:this.skuID(e.name)},"",""],imgWrap:["div",{class:"-img pos-rel"},"",""],img:["img",{"data-src":this.BOB_IMG_LINK+e.image,alt:"sku_img"},"",""],icon:["img",{src:this.BOB_IMG_LINK+e.icon,alt:"sku_img",class:"-icon pos-abs"},"",""],shadow:["div",{class:"pos-abs -shadow"},"",""],gone:["span",{class:"pos-abs"},"","gone"],mask:["span",{class:"-mask pos-abs"},"",""],maskBg:["span",{class:"-mask_bg pos-abs"},"",""],name:["div",{class:"-name"},"",e.name],desc:["div",{class:"-desc"},"",e.desc],prices:["div",{class:"-prices"},"",""],oldPriceEl:["div",{class:"-price -old"},"",t],newPriceEl:["div",{class:"-price -new","data-new-price":s},"",r],discountEl:["div",{class:"-discount pos-abs"},"",i],initiative:["div",{class:"-initiative"},"",e.initiative],cta:["div",{class:"-cta"},"","preview"]},o=new Tag(n.skuEl).get(),c=new Tag(n.imgWrap).get(),l=new Tag(n.img).get(),h=new Tag(n.icon).get(),u=new Tag(n.shadow).get(),d=new Tag(n.gone).get(),p=new Tag(n.maskBg).get(),g=new Tag(n.mask).get(),m=new Tag(n.name).get(),v=new Tag(n.desc).get(),w=new Tag(n.prices).get(),S=new Tag(n.oldPriceEl).get(),y=new Tag(n.newPriceEl).get(),f=new Tag(n.discountEl).get(),b=new Tag(n.initiative).get(),k=new Tag(n.cta).get();return u.appendChild(d),Tag.appendMany2One([y,S],w),Tag.appendMany2One([u,l,h],c),Tag.appendMany2One([b,c,m,v,w,g,p,f,k],o),o}extraMillisec(e){return 60*e*1e3}endTime(e){return e+this.extraMillisec(this.extraMinutes)}startEnd(e){return{start:e[0],end:e[e.length-1]+this.extraMillisec(this.extraMinutes)}}skuRow(e){return document.querySelector("._row-"+e)}oos(e){e.map(e=>{this.skuRow(e).classList.add("-oos")})}pastAndFutureTimes(e){var t=e.filter(e=>+this.now>e&&+this.now>this.endTime(e)),s=e.filter(e=>-1===t.indexOf(e));return{past:t,future:s}}gone(e){this.oos(this.pastAndFutureTimes(e).past),this.reLabelActiveTabRow(this.pastAndFutureTimes(e).future)}reLabelActiveTabRow(e){var t=document.querySelectorAll(".-tab"),s=document.querySelector(".-tab.-t-"+e[0]),i=document.querySelectorAll(".-sku_row"),r=document.querySelector("._row-"+e[0]);this.removeAddActive(t,s),this.removeAddActive(i,r),this.showSKUImage(r)}showNewPrice(e){var t=e.querySelector(".-price.-new");t.textContent=t.getAttribute("data-new-price")}oosSKU(e){e.filter(e=>"available"!==e.status).map(e=>{var t=this.skuID(e.name),s=document.getElementById(t);s.classList.add("-oos"),this.showNewPrice(s),this.changeCTA(s,"preview")})}changeCTA(e,t){e.querySelector(".-cta").textContent=t}tab(e){return document.querySelector(".-t-"+e)}live(e,t){e.forEach(e=>e.classList[t]("-live"))}changeCTAAndLink(e,t){var s=this;e.querySelectorAll(".-sku").forEach(e=>s.changeCTA(e,t))}}class Main{constructor(e){this.logic=new Logic(e),this.LIVE_NOW="live now",this.skusEl=document.querySelector(".-skus"),this.tabs=document.querySelector(".-tabs"),this.nextCurrentSale=document.querySelector(".-next_current_sale"),this.startsEnds=document.querySelector(".-starts_ends"),this.toCopy=document.querySelector(".-to-copy"),this.now=new Date,this.keySKUimg=document.querySelector(".-keysku img"),this.keySKUname=document.querySelector(".-keysku .-name"),this.keySKUdesc=document.querySelector(".-keysku .-desc"),this.keySKUprice=document.querySelector(".-keysku .-price"),this.keySKULive=document.querySelector(".-keysku .-live"),this.keySKUParent=document.querySelector(".-header .-right"),this.productfloorsA=document.querySelector(".-product_floors.-auto_load"),this.productfloorsS=document.querySelector(".-product_floors.-search_floor"),this.fetchCount=0,this.MAX_FETCH_COUNT=10,this.skuCats=[],this.searchInput=document.querySelector(".-searchinput"),this.preloader=document.getElementById("preloader"),this.remContent=["Home & Office/Office Products/Packaging Materials","Fashion/Men's Fashion/Clothing/Underwear","Women's Fashion/Clothing/Lingerie, Sleep & Lounge","Health & Beauty/Sexual Wellness","Fashion/Women's Fashion/Underwear & Sleepwear","Fashion/Women's Fashion/Maternity","Fashion/Women's Fashion/Clothing/Swimsuits & Cover Ups","Women's Fashion/Clothing/Socks & Hosiery"],this.prevSearch="",this.visibleSKUs=5,this.searchInput.addEventListener("keyup",()=>{this.debounce(this.search.bind(this),3e3)()}),this.domain="https://www.jumia.com.ng",this.defaultSearch="https://www.jumia.com.ng/all-products/?shipped_from=country_local"}displayTabs(e){e.map((e,t)=>this.tabs.appendChild(this.logic.createTab(e,t)))}displaySKUs(e){e.map((e,t)=>{var s=this.logic.createSKURow(e,t);e.skus.map(e=>s.appendChild(this.logic.createSKU(e))),this.skusEl.appendChild(s)})}updateTopSKU(e,t){var s=e.querySelector(".-img img"),i=e.querySelector(".-name"),r=e.querySelector(".-desc"),a=e.getAttribute("href"),n=s.getAttribute("src"),o=i.textContent,c=r.textContent;this.keySKUParent.setAttribute("href",a),this.keySKUimg.setAttribute("src",n),this.keySKUname.textContent=o,this.keySKUdesc.textContent=c,this.keySKULive.innerHTML=t,t===this.LIVE_NOW&&this.keySKULive.classList.add("active")}setState(e){this.nextCurrentSale.classList.remove("-live"),+this.now<this.logic.startEnd(e).start?this.b41stSession(e):+this.now>this.logic.startEnd(e).end?this.afterLastSession(e):this.inAndBtwSessions(e)}liveTime(e){return"live by "+this.logic.AMPM(e)+"<br/>"+this.logic.date(e)}saleTime(e){return this.logic.date(e)+"'s "+this.logic.AMPM(e)+" sale"}b41stSession(e){var t=this.logic.skuRow(e[0]),s=t.querySelectorAll(".-sku")[0];this.logic.showSKUImage(t),this.nextCurrentSale.textContent=this.saleTime(e[0]),this.startsEnds.textContent="starts in",this.logic.initializeClock(e[0]),console.log("before first session"),this.updateTopSKU(s,this.liveTime(e[0]))}afterLastSession(e){var t=document.querySelector(".-main-el"),s=document.querySelector(".-other-deals");t.classList.add("-hide"),s.classList.add("-hide"),console.log("after last session")}inAndBtwSessions(e){console.log("in and between session",e.length),this.logic.gone(e),this.coming(e)}coming(e){var t=this.logic.pastAndFutureTimes(e).future[0];+this.now>=t&&+this.now<this.logic.endTime(t)?this.inSession(t):this.betweenSession(t)}inSession(e){var t=this.logic.skuRow(e),s=t.querySelectorAll(".-sku")[0],i=this.logic.tab(e),r=this.logic.endTime(e);this.logic.changeCTAAndLink(t,"download app"),this.logic.live([t,this.nextCurrentSale,i],"add"),this.logic.initializeClock(r),this.nextCurrentSale.textContent=this.saleTime(e),this.startsEnds.textContent="ends in",this.updateTopSKU(s,this.LIVE_NOW)}betweenSession(e){this.logic.initializeClock(e),this.nextCurrentSale.textContent=this.saleTime(e),this.startsEnds.textContent="starts in";var t=this.logic.skuRow(e).querySelectorAll(".-sku")[0];this.updateTopSKU(t,this.liveTime(e))}toSearch(e){return this.preloader.classList.add("-loading"),fetch(e).then(e=>e.text()).then(e=>this.getSKUsAllPrducts(e)).then(t=>this.buildSearchSKUs(t,e)).catch(t=>{this.preloader.classList.remove("-loading"),this.fetchCount>this.MAX_FETCH_COUNT?this.fetchCount=0:(this.fetchCount++,this.toSearch(e));var s=this.productfloorsS.querySelector(".-prev"),i=this.productfloorsS.querySelector(".-next");this.showHideDirectionButtons([],s),this.showHideDirectionButtons([],i),console.log("error fetching",t)})}showHideDirectionButtons(e,t){var s=t.classList;e.length>this.visibleSKUs?s.remove("-hide"):s.add("-hide")}buildSearchSKUs(e,t){this.preloader.classList.remove("-loading");var s=this.productfloorsS.querySelector(".-products"),i=this.productfloorsS.querySelector(".-prev"),r=this.productfloorsS.querySelector(".-next");0!==e.length?(this.productfloorsS.querySelector(".-cta").setAttribute("href",t),s.innerHTML=this.catSKUs(e),this.showHideDirectionButtons(e,i),this.showHideDirectionButtons(e,r)):this.toSearch(this.defaultSearch);this.scrollListeners(s,i,r)}get(e){var t=e.categorypdp+"?price="+parseFloat(e.startPrice)+"-"+(parseFloat(e.endPrice)-1)+"&shipped_from=country_local";return e.catLink=t,fetch(t).then(e=>e.text()).then(t=>this.attachSKUs(t,e)).catch(t=>{this.fetchCount>this.MAX_FETCH_COUNT?this.fetchCount=0:(this.fetchCount++,this.get(e)),console.log("error fetching",t)})}attachSKUs(e,t){var s=e.indexOf('{"sku":'),i=e.lastIndexOf(',{"sku":'),r="["+e.substring(s,i)+"]",a=[];try{a=JSON.parse(r,(e,t)=>t)}catch(e){a=JSON.parse(r+"}]",(e,t)=>t)}return t.skus=0!==a.length?a.slice(0,16):[],this.fetchCount=0,t}toInclude(e){for(var t=!0,s=0;s<this.remContent.length;s++)if(-1!==e.categories.indexOf(this.remContent[s])){t=!1;break}return t}getSKUsAllPrducts(e){var t=e.indexOf('{"sku":'),s=e.lastIndexOf(',{"sku":'),i="["+e.substring(t,s)+"]",r=[];try{r=JSON.parse(i,(e,t)=>t)}catch(e){r=JSON.parse(i+"}]",(e,t)=>t)}console.log("parsed",r);var a=r.filter(e=>this.toInclude(e));return 0!==a.length?a.slice(0,24):[]}debounce(e,t){var s=null;return function(){var i=this,r=arguments;clearTimeout(s),s=setTimeout(function(){e.apply(i,r)},t)}}search(){var e=this.searchInput.value.toLowerCase();if(e!==this.prevSearch){var t=this.id(e,"+"),s=this.defaultSearch+"&q="+t;this.toSearch(s)}this.prevSearch=e}replacePattern(e,t){var s=new RegExp(e,"g");return t.replace(s,"-")}id(e,t){var s=this.replacePattern("'",e),i=this.replacePattern("&",s);return this.replacePattern("%",i).toLowerCase().split(" ").join(t)}easeOutQuart(e,t,s,i,r){return-i*((t=t/r-1)*t*t*t-1)+s}tween(e,t,s,i,r){var a,n=t-e;a=window.performance&&window.performance.now?performance.now():Date.now?Date.now():(new Date).getTime();var o=function(c){var l=c?c-a:0,h=i(null,l,0,1,s);r.scrollLeft=e+n*h,l<s&&r.scrollLeft!=t&&requestAnimationFrame(o)};o()}scrollListeners(e,t,s){var i=this;s.addEventListener("click",t=>{var s=e.scrollLeft+50,r=e.scrollLeft+300;i.tween(s,r,500,i.easeOutQuart,e)}),t.addEventListener("click",t=>{var s=e.scrollLeft-50,r=e.scrollLeft-300;i.tween(s,r,500,i.easeOutQuart,e)})}init(){this.toSearch(this.defaultSearch),this.skuCats=this.logic.expanded.filter(e=>e.category),Promise.all(this.skuCats.map(e=>this.get(e))).then(e=>this.renderFloors(e)).catch(e=>{console.log("error fetching categories",e)});var e=this.getTimes(),t=this.logic.pastAndFutureTimes(e),s=t.future.concat(t.past);return this.displayTabs(s),this.setState(e),this}renderFloors(e){e.filter(e=>void 0!==e).map(e=>{var t={floor:["div",{class:"-floor -posrel",id:"category-"+e.category},"",""],title:["div",{class:"-title -posrel"},"",""],main:["div",{class:"-main -posrel"},"",""],txt:["div",{class:"-txt -posabs"},"",e.category],cta:["a",{class:"-cta -posabs",href:e.catLink},"","see all"],subtitle:["div",{class:"-subtitle -posabs"},"","below ₦"+parseFloat(e.endPrice).toLocaleString()],products:["div",{class:"-products"},"",this.catSKUs(e.skus)],prev:["div",{class:"-control -prev -posabs"},"",""],next:["div",{class:"-control -next -posabs"},"",""]},s=new Tag(t.floor).get(),i=new Tag(t.title).get(),r=new Tag(t.main).get(),a=new Tag(t.txt).get(),n=new Tag(t.cta).get(),o=new Tag(t.subtitle).get(),c=new Tag(t.products).get(),l=new Tag(t.prev).get(),h=new Tag(t.next).get();this.scrollListeners(c,l,h),Tag.appendMany2One([a,n],r),Tag.appendMany2One([r,o],i),Tag.appendMany2One([i,c,l,h],s),this.productfloorsA.appendChild(s)})}catSKUs(e){var t="";return e.map(e=>{var s=e.prices.discount?'<div class="-discount -posabs">'+e.prices.discount+"</div>":"";t+='<a href="'+this.domain+e.url+'" class="-product -inlineblock -vatop -posrel"><div class="-img"><img src="'+e.image+'" alt="floor product"/></div>'+s+'<div class="-name">'+e.name+'</div><div class="-price -new">'+e.prices.price+'</div><div class="-price -old">'+(e.prices.oldPrice?e.prices.oldPrice:"")+"</div></a>"}),t}getTimes(){var e=document.querySelectorAll(".-sku_row");return Array.from(e).map(e=>parseInt(e.getAttribute("data-time")))}}new Main(${JSON.stringify(this.skusData)}).init();
    </script>
    `

    var skuHTML = this.replaceStr(this.skusEl.innerHTML, '.jpg">', '.jpg"/>')
    skuHTML = this.replaceStr(skuHTML, '.png">', '.png"/>')
    skuHTML = this.replaceStr(skuHTML, 'sku_img">', 'sku_img"/>')
    skuHTML = this.replaceStr(skuHTML, '&amp;', '&')
    skuHTML = top + skuHTML + bottom
    this.toCopy.value = `${styles}${skuHTML}${script}`
  }

}

new Main().init()