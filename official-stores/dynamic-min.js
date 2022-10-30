const Begin=function(s){class t{constructor(s){this.ID="official-stores",this.DATA_AVAILABLE="data available",this.MAX_ITEM_PER_COL=2,this.MIN_FOR_2_PER_COL=18,this.DESKTOP_SIDX="window.__STORE__=",this.DESKTOP_EIDX="};</scr",this.MOBILE_SIDX="window.__INITIAL_STATE__=",this.MOBILE_EIDX=";window.__CONFS__",this.TYPES={brand:"brand",about:"about",category:"category",dirBtn:"dir-btn"},this.isMobile="ontouchstart"in window,this.host="https://www.jumia",this.el=(s,t)=>t?t.querySelector(s):document.querySelector(s),this.all=(s,t)=>t?t.querySelectorAll(s):document.querySelectorAll(s),this.escapeStr=s=>s.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),this.mainEl=this.el(".-main-el"),this.topBannerEl=this.el(".-top-banner"),this.initiativeEl=this.el("#initiative"),this.fetched=this.el(".-fetched"),this.about=this.el(".-re.-rules")}}class i{constructor(s){this.initialize(s)}initialize(s){this.images=s?s.querySelectorAll(".lazy-image"):document.querySelectorAll(".lazy-image"),this.preloaders=s?s.querySelectorAll(".-preloader"):document.querySelectorAll(".-preloader"),this.images.forEach(this.lazyLoad.bind(this))}lazyLoad(s){void 0!==s.src?(s.src=s.getAttribute("data-src"),s.onload=()=>this.afterLoad(s)):this.afterLoad(s)}afterLoad(s){s.classList.add("loaded");const t=s.parentElement.querySelector(".-preloader");this.removeLoader(t),this.preloaders.forEach(this.removeLoader.bind(this))}removeLoader(s){s.classList.remove("-loading")}}class e extends t{constructor(s){super(s),this.brandMap={},this.isACategoryBrand=(s,t)=>s.category.toLowerCase()===t,this.isCompleteColumn=s=>s%this.MAX_ITEM_PER_COL==1,l.subscribe(this.DATA_AVAILABLE,this.process.bind(this))}process(s){const t=s.categories.map((t=>{const i=t.name.toLowerCase();return t.brands=s.brands.filter((s=>this.isACategoryBrand(s,i))),t})).sort(((s,t)=>t.brands.length-s.brands.length));this.build(t).setBanner(s.config).setAbout(s.about).show().listeners()}getMap(){}listeners(){this.initiativeEl.addEventListener("click",(s=>{const t=s.target;switch(t.getAttribute("data-type")){case this.TYPES.brand:const s=t.parentElement.getAttribute("data-brand"),i=this.brandMap[s],e=this.el(`.-superblock[data-name="${i.category}"]`),a=this.el(".-productfloor",e),l=this.el(".-productfloor .-title",e),d=this.el(".-see-all",e);l.textContent=`${i.name} top deals`,d.setAttribute("href",i.url),this.updateProductFloor(i.skus,a);break;case this.TYPES.dirBtn:const r=t.parentElement,o=this.el(".-scrollable",r.parentElement);this[`scrollTo${r.getAttribute("data-dir")}`](o);break;case this.TYPES.about:this.toggleBanner(t);break;default:break}}))}scrollTonext(s){var t=s.scrollLeft+80,i=s.scrollLeft+300-t;s.scrollLeft=t+1*i}scrollToprev(s){var t=s.scrollLeft-80,i=s.scrollLeft-300-t;s.scrollLeft=t+1*i}updateProductFloor(s,t){this.el(".-skus.-actual",t).innerHTML=`<div class="-scrollable">${s.map(this.skuHtml.bind(this)).join("")}</div>`,this.show(),t.classList.add("active")}setBanner(s){const{desktopBanner:t,mobileAppBanner:i}=s,e=this.isMobile?i:t;return this.topBannerEl.setAttribute("data-src",e),this}setAbout(s){return this.about.innerHTML=s.map(this.aboutHtml.bind(this)).join(""),this}toggleBanner(s){const t=s.parentElement,i=t.parentElement;i.classList.toggle("-show");t.querySelector(".-txt").textContent=i.classList.contains("-show")?"Close":"About Official Stores"}aboutHtml(s){return`<div class="-rule_element"><div class="-vatop -num">${s.num}.</div><div class="-vatop -desc">\n      <div class="-question">${s.question}</div><div class="-answer">${s.answer}</div>\n      </div></div>`}show(){return this.imageObserver=new i,this.imageObserver=null,this}build(s){return this.mainEl.innerHTML=s.map(this.buildSuperblock.bind(this)).join(""),this}buildSuperblock(s){let t=`<div class="-superblock" data-name="${s.name}">`;const i=`<div class="-title" style="background-color: ${s.backgroundColor};color:${s.fontColor}">${s.name}</div>`,e=this.buildFreelinks(s.brands),a=this.buildProductFloor({skus:s.skus,url:s.url,name:s.name,fontColor:s.fontColor,backgroundColor:s.backgroundColor});return t+=s.brands.length>=1?i:"",t+=e,t+=a,t+="</div>",s.skus.length>=7?t:""}buildFreelinks(s){const t={brands:s,prevNextButtons:this.isMobile?"":'<div class="-control -prev -posabs" data-dir="prev"><span class="-posabs -preloader -loading" data-type="dir-btn"></span></div><div class="-control -next -posabs" data-dir="next"><span class="-posabs -preloader -loading" data-type="dir-btn"></span></div>',shoppingCart:'<div class="icon-cart -hide"><div class="cart-line-1" style="background-color: #fff"></div><div class="cart-line-2" style="background-color: #fff"></div><div class="cart-line-3" style="background-color: #fff"></div><div class="cart-wheel" style="background-color: #fff"></div></div>',market:'<label class="demo -hide"><i class="icono-market"></i></label>'};return s.length>=this.MIN_FOR_2_PER_COL?this.twoPerCol(t):this.onePerCol(t)}single2MultidimensionalArray(s){const t=s.length,i=[];let e=[];const a=s=>0!==s&&s%this.MAX_ITEM_PER_COL==0,l=s=>s===t-1,d=(s,t)=>{i.push(e),e=[],e.push(t[s])};for(let r=0;r<t;r++)a(r)?(d(r,s),l(r)&&i.push(e)):(e.push(s[r]),l(r)&&i.push(e));return i}twoPerCol(s){const{brands:t,prevNextButtons:i,shoppingCart:e,market:a}=s;let l=this.single2MultidimensionalArray(t);const d=l.length,r="</div>";let o='<div class="-brands -posrel -double">'+(d<7?"":i),c='<div class="-scrollable">';for(let s=0;s<d;s++){const t=l[s],i=t.length;let d='<div class="-brands-col">';for(let s=0;s<i;s++){const i=t[s];d+=this.brandHtml(i,{shoppingCart:e,market:a})}d+=r,c+=d}return c+=r,o+=c,o+=r,o}brandHtml(s,t){const{shoppingCart:i,market:e}=t;return this.brandMap[s.name]=s,`<div class="-brand -posrel" data-brand="${s.name}" data-url="${s.url}"><span class="-posabs -preloader -loading" data-type="brand"></span>${i}${e}<img class="lazy-image" data-src="${s.logo}" alt="${s.name}"/></div>`}onePerCol(s){const{brands:t,prevNextButtons:i,shoppingCart:e,market:a}=s;let l='<div class="-brands -posrel -single">';return l+=t.length<7?"":i,l+=`<div class="-scrollable">${t.map((t=>this.brandHtml(t,s))).join("")}</div>`,l+="</div>",l}buildProductFloor(s){const{skus:t,url:i,name:e,fontColor:a,backgroundColor:l}=s;let d=`<div class="-productfloor active -posrel" data-name="${e}">${this.isMobile?"":'<div class="-control -prev -posabs" data-dir="prev"><span class="-posabs -preloader -loading" data-type="dir-btn"></span></div><div class="-control -next -posabs" data-dir="next"><span class="-posabs -preloader -loading" data-type="dir-btn"></span></div>'}`;return d+=`<div class="-head" style="background-color:${l}"><div class="-title" style="color:${a}">${e} top deals</div><a href="${i}" class="-see-all" style="color:${a}"><span class="-txt">See all</span><span class="-arrow" style="border: 2px solid ${a}"></span></a></div>`,d+=`<div class="-skus -actual"><div class="-scrollable">${t.map(this.skuHtml.bind(this)).join("")}</div></div><div class="-skus -skeleton"><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div><div class="-posrel -sku"><div class="-img -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/placeholder_300x300.png" /></div><div class="-details"><div class="-name -posrel"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div><div class="-txt" style="background-color:#f5f5f5;height:14px;width:80%"></div></div><div class="-newPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:50%;margin:4px 0"></div></div><div class="-oldPrice"><div class="-txt" style="background-color:#f5f5f5;height:14px;width:40%"></div></div></div></div></div>`,d+="</div>",d}skuHtml(s){const{sku:t,displayName:i,url:e,prices:{oldPrice:a,price:l,discount:d},image:r}=s;return`\n      <a href="${e}" data-sku="${t}" class="-posrel -sku"><div class="-img -posrel"><span class="-posabs -preloader -loading"></span><img class="lazy-image" data-src="${r}" alt="${i}"/></div>${d?`<div class="-discount -posabs">${d}</div>`:""} <div class="-details"><div class="-name">${i}</div><div class="-newPrice">${l}</div>${d?`<div class="-oldPrice">${a}</div>`:""}</div></a>\n      `}}class a extends t{constructor(s){super(s),this.send=s=>l.emit(this.DATA_AVAILABLE,s),this.initialize(s)}initialize(s){this.config=s;const t=firebase.initializeApp(this.config,this.config.projectId);this.db=t.firestore(),this.get()}get(){return this.mainEl.classList.add("-loading"),this.db.collection(this.ID).doc("data").get().then(this.onSuccess.bind(this)).catch(this.onError.bind(this))}onSuccess(s){this.mainEl.classList.remove("-loading");const t=s.exists?s.data():{};this.send(t)}onError(s){this.mainEl.classList.remove("-loading"),this.send({})}set(s){return this.db.collection(this.ID).doc("data").set(s,{merge:!0})}}const l=new class{constructor(){this.events={}}subscribe(s,t){this.events[s]=this.events[s]||[],this.events[s].push(t)}unsubscribe(s,t){if(this.events[s]){const i=this.events[s].findIndex((s=>s===t));this.events[s].splice(i,1)}}emit(s,t){this.events[s]&&this.events[s].forEach((s=>s(t)))}};new class extends t{constructor(s){super(s),this.database=new a(s),this.superblocksAndBanners=new e(s)}}(s)},config={apiKey:"AIzaSyCKGQw8QCq8qcxJ39QznQgarzOLP_WF1_Q",authDomain:"jumia-17681.firebaseapp.com",databaseURL:"https://jumia-17681.firebaseio.com",projectId:"jumia-17681",storageBucket:"jumia-17681.appspot.com",messagingSenderId:"472156067665",appId:"1:472156067665:web:976495829b072466"},interval=setInterval((()=>{/loaded|complete/.test(document.readyState)&&(clearInterval(interval),Begin(config))}));