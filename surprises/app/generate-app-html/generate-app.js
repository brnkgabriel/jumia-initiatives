function extractData(json) {
  var skus = document.querySelector('#initiative .-skus')
  var products = document.querySelector('.-filter-list-products .-products')
  var tabs = document.querySelector('#initiative .-tabs')
  var skus_el = skus ? skus.innerHTML : ''
  var products_el = products ? products.outerHTML : ''
  var tabs = tabs ? tabs.innerHTML : ''
  var campaign_banner = json.campaign_banner
  var campaign_url = json.campaign_url
  var campaign_title = json.campaign_title
  var minute_duration_wof = json.minute_duration_wof
  var wof_app_banner = json.wof_app_banner
  var userneed_html = json.userneed_html
  var campaign_1_mdb = json.campaign_1_mdb
  var campaign_2_mdb = json.campaign_2_mdb
  var campaign_1_url = json.campaign_1_url
  var campaign_2_url = json.campaign_2_url
  var featurebox_title = json.featurebox_title
  var tandc_html = json.tandc_html
  var hide_banner_class = json.hide_banner_class
  var hide_title_class = json.hide_title_class
  var hide_catalog_class = json.hide_catalog_class
  var json = {
    campaign_title, campaign_banner, campaign_url,
    products_el, skus_el, tabs, minute_duration_wof,
    wof_app_banner, userneed_html, tandc_html,
    campaign_1_mdb, campaign_2_mdb, campaign_1_url,
    campaign_2_url,featurebox_title, hide_banner_class, hide_title_class,
    hide_catalog_class
  }
  generateHTML(json)
  
}
  
function replaceStr(str, toreplace, replacement) {
  var re = new RegExp(toreplace, 'g')
  return str.replace(re, replacement)
}

function clipboard(elem, event, input) {
  input.select()
  document.execCommand(event)
  elem.classList.add('-clicked')
  setTimeout(() => {
    elem.classList.remove('-clicked')
  }, 800);
}

function processProducts(html) {
  var temporary = document.querySelector('.-temporary')
  temporary.innerHTML = html
  var products = temporary.querySelectorAll('.-product')
  var new_html = temporary.innerHTML
  products.forEach(product => {
    new_html += product.outerHTML
    console.log('processing product')
  })
  temporary.innerHTML = ''
  return new_html
}

function generateHTML(json) {
  
  var styles = `
  <style type="text/css">
 *,*::before,*::after{box-sizing:border-box;text-rendering:optimizeLegibility;-webkit-font-smoothing:subpixel-antialiased;-moz-osx-font-smoothing:grayscale;padding:0;margin:0;vertical-align:middle;scroll-behavior:smooth;transition:all .2s cubic-bezier(.165,.84,.44,1)}:root{--bg-color:#f5f5f5;--font-color:#282828;--campaign-color:#AA0314;--segcolor:#B177DA;--barred-price:#75757a;--jumia-cta:#f68b1e;--discount-bg:#feefde;--box-shadow:0 2px 5px 0 rgb(0 0 0 / 5%);--discount-bg:#feefde;--global:#0040ce;--official-store:#276076}body{background-color:var(--bg-color)}.main_header--search_box{display:none!important}.main_header{width:100%!important;max-width:480px!important;margin:0 auto!important}#feature-box{display:none}#banner-placement-top{text-align:center}.main_header--search_box{display:none!important}.-global,.-official-store{background-color:var(--global);border-radius:2px;line-height:1;padding:2px 4px;color:white}.-official-store{background-color:var(--official-store);color:white}#initiative.-container{width:100%;max-width:480px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;color:var(--font-color);font-size:.75em}.-hide{display:none!important}#initiative .-title{text-transform:uppercase;font-weight:600;text-align:center;padding:5px 0}#initiative.-container a:not(.-product):not(.-freelink){color:var(--font-color);vertical-align:baseline;text-decoration:unset}.-row{margin:8px 0}#initiative .-banner{background-color:white;overflow:hidden;margin-top:unset!important;padding:8px;border-radius:4px}.-banner.-top{height:43vw;max-height:201.59px}#initiative .-banner .-how-it-works{background-color:var(--font-color);color:white;bottom:8px;right:8px;padding:4px 8px;font-weight:500;border-bottom-right-radius:4px;border-top-left-radius:4px;z-index:3;box-shadow:0 1px 5px 0 rgba(0,0,0,.2);cursor:pointer;transform:scale(1);transform-origin:bottom right;width:129px;height:27px}#initiative .-banner .-how-it-works .-txt{top:50%;left:50%;transform:translate(-50%,-50%);width:100%;text-align:center}#initiative .-banner.-show .-how-it-works{background-color:var(--jumia-cta);color:white;z-index:4}#initiative .-banner .-how-it-works:active{transform:scale(.99)}#initiative .-banner .-how-it-works:hover{transform:scale(1.005)}#initiative .-banner .-img{display:block;width:100%;height:100%;min-height:121px}#initiative .-banner img{border-radius:4px}#initiative .-row img{width:100%;max-width:1170px}.-posrel{position:relative}.-posabs{position:absolute}.-possti{position:sticky!important}.-inlineblock{display:inline-block}.-vamiddle{vertical-align:middle}.-vabaseline{vertical-align:baseline}.-vatop{vertical-align:top}.-tabs{white-space:nowrap;overflow-x:auto;width:100%;background-color:white;box-shadow:var(--box-shadow);top:0;left:0;z-index:3;height:75px;position:relative}.-tabs .-all-tabs{scrollbar-width:none;-ms-overflow-style:none;text-align:center}.-tabs .-all-tabs::-webkit-scrollbar{width:0;height:0}.-tabs .-all-tabs{overflow-x:auto}.-tabs .-countdown-row{padding:4px 8px;bottom:0;left:50%;transform:translateX(-50%);font-weight:600;color:var(--campaign-color);position:absolute}.-tabs .-countdown-row .-time{display:none}.-tabs .-indicator{content:'';height:2px;width:var(--tab-width);background-color:var(--campaign-color);bottom:0;left:var(--tab-x-pos);position:absolute}.-tabs::-webkit-scrollbar{display:none}.-tabs .-tab{margin:4px 2px;text-align:center;cursor:pointer;position:relative;text-transform:uppercase;font-size:.9em;font-weight:500;width:calc(100% / 3.8);padding:5px 10px;box-shadow:var(--box-shadow)}.-tabs .-tab::after{content:'';position:absolute;left:50%;transform:translateX(-50%);bottom:0;height:2px;width:0;background-color:var(--campaign-color)}.-tabs .-tab.active::after{width:100%}@supports (-webkit-touch-callout:none){.-tabs .-tab{width:unset}}.-tabs .-tab.-live span{color:var(--campaign-color)}.-tabs .-tab.-live span,#initiative .-live .-tags{animation:blinking;animation-duration:.888s;animation-iteration-count:infinite;animation-direction:alternate}.-tabs .-tab span:last-child{text-transform:capitalize!important;font-size:.9em;font-weight:400}.-tabs .-tab.active{color:var(--campaign-color)!important}.-tabs .-tab.active::after{width:100%}.-timer{width:100%;text-align:center}.-starts_ends{margin:0 5px;font-weight:600;display:block}.countdownwrap .-clock_element{font-weight:600;color:var(--campaign-color);font-size:1.2em}@keyframes blinking{from{opacity:1.0}to{opacity:.0}}.-tabs .-tab .-time{font-weight:600;font-size:1.2em}.-tabs .-tab span{display:block}.-control{width:40px;height:40px;background-color:var(--jumia-cta);border-radius:50%;top:50%;transform:translateY(-50%) scale(1);left:40.2%;z-index:1;cursor:pointer;box-shadow:0 1px 1px 0 rgba(0,0,0,.2);display:none}.-control.-down,.-control.-up{display:block;left:unset;right:8px}.-control.-up{top:25%}.-control.-up::before{transform:translate(-50%,-50%) rotate(-45deg)}.-control.-down{top:55%}.-control.-down::before{transform:translate(-50%,-50%) rotate(135deg)}.-control:active{transform:translateY(-50%) scale(.96)}.-control.-next{left:unset;right:10px}.-control::before{content:'';position:absolute;width:10px;height:10px;border:2px solid white;border-left:unset;border-bottom:unset;top:50%;left:50%;transform:translate(-50%,-50%) rotate(45deg)}.-control.-prev::before{transform:translate(-50%,-50%) rotate(-135deg)}.-sku_row{display:none;background-color:var(--bg-color);text-align:left}.-sku_row.active{display:block}#initiative .-skus{padding:8px 4px;background-color:var(--bg-color);padding-bottom:unset}#initiative .-sku{text-align:left;width:100%;margin:8px auto;background-color:white;position:relative;border-radius:4px;box-shadow:0 2px 5px 0 rgb(0 0 0 / 5%);display:inline-block;height:50vw;max-height:180px;margin-bottom:unset;overflow:hidden}#initiative .-sku:hover{color:var(--font-color)!important;box-shadow:0 0 12px 0 rgba(0,0,0,.12)}#initiative .-sku .-img{width:50vw;max-width:180px;height:50vw;max-height:180px;display:inline-block;vertical-align:middle}#initiative .-sku .-details{width:calc(100% - 190px);top:40%;transform:translateY(-50%);right:5px;padding:8px;border-radius:4px}#initiative .-sku .-details .-offer-desc{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}#initiative .-sku .-tags{top:8px;right:8px;width:calc(100% - 190px);padding-left:10px;text-align:right}#initiative .-sku .-category-img{top:50%;left:50%;transform:translate(-50%,-50%)}#initiative .-sku .-tags .-tag{color:white;font-size:.85em;letter-spacing:.3px;padding:5px;border-radius:4px;font-weight:bold;margin:0 2px;line-height:1;display:none}#initiative .-sku .-tags .-tag.-single,#initiative .-sku .-tags .-tag.-top-deal{background-color:var(--campaign-color);color:white}#initiative .-sku .-tags .-tag.-official-store{background-color:unset}#initiative .-sku .-tags .-tag:first-child{margin-left:unset}#initiative .-sku .-tags .-tag img{height:14px}#initiative .-sku .-shadow{position:absolute;width:100%;height:100%;background-color:rgba(0,0,0,.6);top:0;left:0;display:none;z-index:4;border-top-left-radius:4px;border-bottom-left-radius:4px}#initiative .-sku_row.-oos .-sku .-shadow,#initiative .-sku_row .-sku.-oos .-shadow{display:block}#initiative .-sku .-shadow span,#initiative .-sku .-img img{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}#initiative .-sku .-shadow span{text-transform:uppercase;color:white;font-weight:600;font-size:1.5em;width:fit-content;text-align:center}#initiative .-sku .-img img{width:100%;display:block;margin:0 auto;z-index:0}#initiative .-sku .-img img.-sku-img{background-color:white;padding:5px}.-shadow{}.-overlay{background-color:rgba(0,0,0,.5);z-index:1;width:100%;height:100%}.-big-bag{z-index:2;background-image:url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 182.39999 259.2' height='2.7in' width='1.9in'%3E%3Cg style='display:inline' id='layer2'%3E%3Cpath id='path917' d='m 13.131082,232.98592 v 20.18485 H 53.00846' style='fill:none;stroke:%23f5f5f5;stroke-width:4;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' /%3E%3Cpath style='fill:none;stroke:%23f5f5f5;stroke-width:4;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' d='m 169.26892,232.98592 v 20.18485 H 53.00846' id='path959' /%3E%3Cpath transform='matrix(1.008092,0,0,1.008092,-102.52595,-45.66343)' style='fill:none;stroke:%23f5f5f5;stroke-width:3.96789;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' id='path961' d='m 172.88086,90.347656 h 38.58008 z' /%3E%3Cpath id='path976' d='M 66.338158,57.722373 V 25.722004 c 0,0 3.897203,-19.6193744 24.123359,-19.6925337 C 112.5501,5.9495791 116.06181,25.722004 116.06181,25.722004 v 32.000369' style='fill:none;stroke:%23f5f5f5;stroke-width:4;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' /%3E%3Cpath style='display:inline;fill:none;stroke:%23f5f5f5;stroke-width:4;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' d='M 13.131082,95.630493 V 45.414528 h 46.277451' id='path901' /%3E%3Cpath id='path903' d='M 169.26892,95.630493 V 45.414528 h -46.27745' style='display:inline;fill:none;stroke:%23f5f5f5;stroke-width:4;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1' /%3E%3C/g%3E%3C/svg%3E");background-repeat:no-repeat;height:90%;width:57%;background-size:contain;top:53%;left:50%;transform:translate(-50%,-50%);z-index:1}.-sku .-big-bag{display:none}.-wof_wheel .-big-bag{height:30%;width:30%;background-size:contain;top:40%;left:35%;transform:translate(-50%,-50%) rotate(22.5deg);z-index:3}.-hblock{z-index:3}.-circle-of-handle{z-index:4}.-square-of-handle{z-index:5}.-name{}#initiative .-sku .-names{left:50%;transform:translate(-50%,-50%) scale(.85);width:80%;z-index:2;text-align:center;top:60%;display:none}#initiative .-sku .-name{color:black!important;background-color:white!important;z-index:6;margin:8px 0;width:unset!important;display:inline-block!important;padding:8px!important;font-weight:bold!important;text-transform:lowercase!important}#initiative .-sku .-sub-name{color:white;z-index:2;text-transform:uppercase;text-align:center;font-weight:bold;font-size:1.1em;line-height:1}#initiative .-sku .-units{display:inline-block;background-color:white;padding:3px 5px;border-radius:10px;margin-top:8px;font-weight:bold}#initiative .-sku .-offer{}#initiative .-sku .-price{font-size:1.3em;font-weight:bold;margin-bottom:8px}#initiative .-sku .-offer,#initiative .-sku .-search{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#initiative .-sku .-img{}#initiative .-sku .-img .-category_img,#initiative .-sku .-img .-prize_img{width:100%;height:100%;left:50%;transform:translate(-50%,-50%)}#initiative .-sku .-img .-category_img{top:50%}#initiative .-sku .-img .-prize_img{top:-250%}#initiative .-sku.-show .-img .-category_img{top:-250%}#initiative .-sku.-show .-img .-prize_img{top:50%}#initiative .-sku.-show .-img .-prize_img img{padding:8px}#initiative .-sku .-details .-action,#initiative .-sku .-details .-prize{top:60%;transform:translate(-50%,-50%);width:100%;margin-left:8px;left:50%}#initiative .-sku .-img .-prize_img .-shop{z-index:1}#initiative .-sku .-details{height:100%}#initiative .-sku .-details .-prize .-prize-name{font-size:1.2em;font-weight:600}#initiative .-sku .-details .-prize .-desc{margin-bottom:16px}#initiative .-sku .-cta{background-color:var(--jumia-cta);color:white;text-align:center;padding:8px 16px;text-transform:uppercase;font-weight:500;font-size:.85em;box-shadow:0 2px 4px 0 rgb(0 0 0 / 20%);border-radius:4px;bottom:8px;right:8px;display:table;white-space:nowrap;height:unset}#initiative .-sku .-cta.-flip{z-index:2}#initiative .-sku .-discount{top:76%;right:10px;font-weight:500;background-color:var(--discount-bg);color:var(--jumia-cta);padding:3px 6px}.-rules_eligibility{font-size:.9em;background-color:var(--font-color);top:0;width:100%;left:105%;transform:translateX(0%);height:100%;z-index:3;padding-top:30px}#initiative .-banner.-show .-rules_eligibility{transform:translateX(-100%);left:100%}.-rules_eligibility .-title{position:absolute;padding:unset!important;top:8px;left:50%;transform:translateX(-50%);color:white;width:100%}.-rules_eligibility .-re{height:100%;overflow:auto;padding:0 16px;color:white;margin-left:-1px}.-rules_eligibility .-re .-rule_element,.-rules_eligibility .-re .-eligibility_element{margin:15px 0;margin-top:unset}.-rules_eligibility .-re .-num{width:5%;font-weight:500}.-rules_eligibility .-re .-desc{width:90%;letter-spacing:.5px}.-product .-cta{color:white}.-product .-cta{padding:8px}.-product,.-product .-img img,.-product .-details .-tag,.-product .-cta{border-radius:4px}.-product .-img img{width:100%}.-product .-details .-tag,.-product .-details .-price-discount .-pd{display:inline-block}.-product .-details .-price-discount .-pd{vertical-align:baseline}.-products{background-color:var(--bg-color);padding:4px}.-product{display:inline-block;vertical-align:top!important;width:calc((100% - 16px) / 2);margin:4px;background-color:white;color:var(--font-color);text-decoration:none}.-product:hover{box-shadow:0 0 12px 0 rgb(0 0 0 / 12%)}.-product .-img{width:46.25vw;max-width:230px;height:46.25vw;max-height:230px;margin:0 auto;margin-bottom:8px}.-product .-details{padding:0 8px}.-product .-details .-name .-text{white-space:nowrap;font-weight:500;overflow:hidden;text-overflow:ellipsis;font-size:.9em}.-product .-details .-tag,.-product .-badge{font-size:.7em;font-weight:500;letter-spacing:.3px;white-space:nowrap;margin-bottom:4px}.-product .-badge{top:8px;left:8px}.-product .-badge.-main{top:unset!important;bottom:-5%}.-product .-badge.-campaign{}.-product img.-badge{width:65%}.-product .-details .-price{margin-top:4px}.-product .-details .-price.-new{font-size:1.1em;font-weight:500}.-product .-details .-price-discount{margin:8px 0;margin-top:unset;margin-bottom:2px}.-product .-details .-price-discount .-pd.-old{color:var(--font-color-light);font-size:.9em;text-decoration:line-through}.-product .-details .-price-discount .-pd.-discount{background-color:var(--discount-bg);color:var(--jumia-cta);padding:2px 4px;font-weight:500;margin-left:8px;font-size:.9em}.-product .-details .-free-shipping{font-size:.69em;font-weight:500;margin-top:4px}.-product .-cta{background-color:var(--jumia-cta);text-transform:uppercase;font-weight:500;margin:8px;text-align:center;box-shadow:0 4px 8px 0 rgb(0 0 0 / 20%);transition:unset;font-size:.8em;width:90%;height:unset}.-in{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23f6b01e' width='16' height='12'%3E%3Cpath d='M8.58.38l1.35 2.86c.1.2.28.34.49.37l3.03.46c.53.08.74.77.35 1.16l-2.19 2.23a.7.7 0 0 0-.18.6l.52 3.15c.09.55-.47.97-.94.71l-2.7-1.49a.62.62 0 0 0-.61 0L5 11.93c-.48.25-1.04-.17-.95-.72l.52-3.15a.7.7 0 0 0-.18-.6l-2.2-2.23c-.38-.4-.17-1.08.36-1.16l3.03-.46c.21-.03.4-.17.49-.37L7.42.38c.24-.5.92-.5 1.16 0z'/%3E%3C/svg%3E");height:100%;position:absolute;background-repeat:repeat}.-stars{height:12px;width:80px;position:relative}.-stars::before{content:'';background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23c7c7cd' width='16' height='12'%3E%3Cpath d='M8.58.38l1.35 2.86c.1.2.28.34.49.37l3.03.46c.53.08.74.77.35 1.16l-2.19 2.23a.7.7 0 0 0-.18.6l.52 3.15c.09.55-.47.97-.94.71l-2.7-1.49a.62.62 0 0 0-.61 0L5 11.93c-.48.25-1.04-.17-.95-.72l.52-3.15a.7.7 0 0 0-.18-.6l-2.2-2.23c-.38-.4-.17-1.08.36-1.16l3.03-.46c.21-.03.4-.17.49-.37L7.42.38c.24-.5.92-.5 1.16 0z'/%3E%3C/svg%3E");height:100%;top:0;left:0;position:absolute;width:100%}.-product_rating .-count{color:var(--font-color-light);font-size:.75em;font-weight:500}.-list express{display:inline-block}.-express{margin-top:8px;background-image:url(https://ng.jumia.is/cms/8-18/fs-dod/system-icons/jumia-express.jpg);background-size:60%;height:12px;background-repeat:no-repeat}.-featurebox-title{text-align:center;background-color:white;padding:8px 0;font-weight:600}.-main-el{margin-bottom:8px}.-userneeds{margin-top:unset;padding:8px;background-color:white}.-userneed{width:calc(92% / 4);margin:calc(8% / 6);background-color:white;border-top-left-radius:4px;border-top-right-radius:4px;vertical-align:top!important}.-userneed:nth-child(4n - 3){margin-left:unset}.-userneed:nth-child(4n){margin-right:unset}.-userneed img{display:block;border-top-left-radius:4px;border-top-right-radius:4px}.-userneed .-txt{text-align:center;padding:4px}.-btt{width:calc(100% - 16px);height:56px;background-color:#323232;position:relative;cursor:pointer;margin:0 auto;border-radius:4px;margin-bottom:8px}.-btt::before,.-btt::after{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(45deg)}.-btt::before{content:'';width:8px;height:8px;border:2px solid white;border-right:unset;border-bottom:unset;top:35%}.-btt::after{content:'BACK TO TOP';color:white;transform:translate(-50%,-50%);top:65%;font-weight:600}.-banner .-db{display:inline-block;vertical-align:middle;width:calc(50% - 4px);margin:0 4px}.-banner .-db:first-child{margin-left:unset}.-banner .-db:last-child{margin-right:unset}.-preloader.-loading{background-size:550px;background-color:#dfdfdf;opacity:1}.-preloader{width:101%;height:100%;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2;opacity:0;overflow:hidden}.-preloader::before{position:absolute;content:'';content:unset;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)}.-preloader.-loading::before{animation:ssc-loading 1.3s infinite}@keyframes ssc-loading{from{transform:translateX(-100%)}to{transform:translateX(100%)}}.lazy-image{opacity:0}.lazy-image.loaded{opacity:1}.-oops{background-color:var(--campaign-color)}.-oops:nth-child(odd){background-color:var(--jumia-cta)}.-oops:nth-child(even){background-color:var(--campaign-color)}.-try-again{color:white;text-transform:uppercase;font-weight:600;position:absolute;left:43%;top:30%;transform:translate(-50%,-50%) rotate(20deg);font-size:1.2em;line-height:1.2}.-wheel-wrap{width:300px;height:300px;margin:20px auto}.-wheel{width:100%;height:100%;display:inline-block}.-triangle{position:absolute;width:106.066px;height:150px;overflow:hidden;display:inline-block;transform-origin:bottom left;clip-path:url(#segment_0deg);left:50%}.-triangle img{width:60%;position:absolute;top:40%;left:35%;transform:translate(-50%,-50%) rotate(22.5deg);z-index:1}.-segments{top:50%;left:50%;transform:translate(-50%,-50%);width:100%;height:100%}.-wheel-frame{width:105%;top:50%;left:50%;transform:translate(-50%,-50%) scale(1.1)}.-wheel-marker{left:50%;transform:translate(-50%,-50%);top:0;width:30px;z-index:1}.-spin-btn{width:182px;display:inline-block;margin:8px 0;cursor:pointer}.-spin-btn:hover{opacity:.8}.-display{width:80%;border:1px dashed white;border-radius:4px;text-align:center;display:inline-block;padding:16px;line-height:1;font-weight:bold;text-transform:uppercase;background-color:var(--campaign-color);color:white;font-size:1.2em}.-blur{animation:blur 5s}@keyframes blur{0%{filter:blur(1px)}80%{filter:blur(1px)}100%{filter:blur(0)}}.-triangle .-overlay{width:60%;height:42.424%;background-color:black;opacity:.7;top:40%;left:35%;border-radius:50%;transform:translate(-50%,-50%);z-index:2}.-sku .-overlay{display:none}.-triangle .-voucher{color:white;z-index:4;line-height:1;top:42%;left:35%;transform:translate(-50%,-50%) rotate(22.5deg);font-size:.6em;text-transform:uppercase;font-weight:bold}.-wof_wheel{text-align:center;background-color:white;padding-top:5px}.-stock{display:none}
  </style>
      `
  var markup = `
  <div class="-container" id="initiative"><div class="-row -banner -top -posrel"><span class="-posabs -preloader -loading"></span><div class="-how-it-works -posabs"><span class="-posabs -preloader -loading"></span><span class="-posabs -txt">Terms & Conditions</span></div><div class="-rules_eligibility -posabs -animate"><div class="-control -up -posabs"></div><div class="-control -down -posabs"></div><div class="-title">Terms & Conditions</div>${json.tandc_html} </div><img class="lazy-image" alt="top banner" data-src="${json.wof_app_banner}" /></div><div class="-wof_wheel"></div><div class="-main-el" id="top"><div class="-tabs -possti">${json.tabs}</div><div class="-skus -animate">${json.skus_el}</div></div><div id="app"><div class="-featurebox-title ${json.hide_title_class}">${json.featurebox_title}</div><div class="-row -banner -double ${json.hide_banner_class}"><a href="${json.campaign_1_url}" class="-db" target="_blank"><img src="${json.campaign_1_mdb}" alt="banner" /></a><a href="${json.campaign_2_url}" class="-db" target="_blank"><img src="${json.campaign_2_mdb}" alt="banner" /></a></div>${json.userneed_html}<div class="-catalog -col -filter-list-products ${json.hide_catalog_class}">${json.products_el}</div><div class="-btt"></div></div></div>
  `

  var script_begin = '<scr' + 'ipt>'
  var script_end = '</scr' + 'ipt>'

  /** ${parseInt(json.minute_duration)} */
  try {

    var jscript = `
    ${script_begin} 
    var Begin=function(t){var s=function(){var t={};return{subscribe:function(s,e){t[s]=t[s]||[],t[s].push(e)},unsubscribe:function(s,e){if(t[s]){var i=t[s].findIndex(t=>t===e);t[s].splice(i,1)}},emit:function(s,e){t[s]&&t[s].forEach(t=>t(e))}}}();class e{constructor(t){this.pubsub=s,this.json=t,this.FOCUS="focus",this.BUILD="build",this.RESET="reset",this.TAB_LISTENER="tab listener",this.TABBED="tabbed",this.FIRST_TAB="first tab",this.IN_SESSION="in session",this.AFTER_SESSION="after session",this.BTW_OR_B4_SESSION="between or before session",this.SET_STATE="set state",this.TABS_PER_PAGE=6,this.TIME_SLOTS_TO_DISPLAY=12,this.SEGMENT_COUNT=8,this.SKU_X_MARGIN=4,this.time_interval=null,this.minute_duration=${json.minute_duration_wof},this.el=(t=>document.querySelector("#initiative "+t)),this.all=(t=>document.querySelectorAll("#initiative "+t)),this.pad=(t=>1==t.toString().length?"0"+t:t),this.endTime=(t=>t+60*this.minute_duration*1e3),this.isAGroup=(t=>0===t.fs_price.length),this.skuRow=(t=>this.el('.-sku_row[data-time="'+t+'"]')),this.skuRows=(()=>this.all(".-sku_row")),this.tab=(t=>this.el('.-tab[data-time="'+t+'"]')),this.live=((t,s)=>t.forEach(t=>t.classList[s]("-live"))),this.skuID=(t=>t.name+"-"+ +new Date(t.time)),this.capitalize=(t=>t[0].toUpperCase()+t.slice(1)),this.oosByTime=(t=>t.map(t=>this.skuRow(t).classList.add("-oos"))),this.getData=((t,s)=>t.json_list.filter(t=>t[s.key]===s.name)),this.isItMyTime=((t,s)=>+new Date(t.time)===parseInt(s)),this.isPast=(t=>Date.now()>t&&Date.now()>this.endTime(t)),this.isFuture=((t,s)=>-1===s.indexOf(t)),this.displayCondition=((t,s)=>s<this.TIME_SLOTS_TO_DISPLAY),this.digit=((t,s)=>0!==parseInt(t)?this.pad(t)+s:""),this.isATab=(t=>t.classList.contains("-tab"))}times(t){var s=t.map(t=>+new Date(t.time));return Array.from(new Set(s)).sort((t,s)=>t-s)}pastAndFutureTimes(t){var s=t.filter(this.isPast).sort((t,s)=>t-s),e=t.filter(t=>this.isFuture(t,s)).sort((t,s)=>t-s);return{past:s,future:e}}lastTimeSet(t){return t.reverse().filter(this.displayCondition).reverse()}reorder(t){return this.pastAndFutureTimes(t).future.concat(this.pastAndFutureTimes(t).past)}timeUnits(t){var s=new Date(t);return{day:s.getDay(),month:s.getMonth(),date:s.getDate(),hr:s.getHours(),mn:s.getMinutes()}}twelveHrFormat(t,s){return 12===t?this.pad(t)+":"+this.pad(s)+"pm":t>12?this.pad(t-12)+":"+this.pad(s)+"pm":0===t?"12:"+this.pad(s)+"am":this.pad(t)+":"+this.pad(s)+"am"}dayDiff(t){var s=new Date(t).getDate();return(new Date).getDate()-s}sameMonth(t){return new Date(t).getMonth()===(new Date).getMonth()}date(t){var s=this.dayDiff(t);return 0===s&&this.sameMonth(t)?this.capitalize("today"):1===s&&this.sameMonth(t)?this.capitalize("yesterday"):-1===s&&this.sameMonth(t)?this.capitalize("tomorrow"):this.fullDate(t)}fullDate(t){var s=new Date(t),e=s.toLocaleDateString("en-US",{month:"short"});return s.toLocaleDateString("en-US",{weekday:"short"})+" "+e+" "+s.getDate()}toggleClass(t,s,e){t.forEach(t=>t.classList.remove(e)),s.classList.add(e)}replacePattern(t,s){var e=new RegExp(t,"g");return s.replace(e,"-")}id(t,s){var e=this.replacePattern("'",t),i=this.replacePattern("&",e);return this.replacePattern("%",i).toLowerCase().split(" ").join(s)}timeFormat(t){var s=this.timeUnits(t),e=this.twelveHrFormat(s.hr,s.mn);return this.date(t)+"'s "+e+" sale"}show(t){this.image_observer=new r(t),this.image_observer=null}}var i=function(t){const s=document.querySelector(".-wheel"),e=document.querySelector(".-spin-btn"),i=document.querySelector(".-display");let a=0;const r=t;e.addEventListener("click",()=>{i.innerHTML="-",e.style.pointerEvents="none",a=Math.floor(5e3+5e3*Math.random()),s.style.transition="all 5s ease-out",s.style.transform="rotate("+a+"deg)",s.classList.add("-blur")}),s.addEventListener("transitionend",()=>{s.classList.remove("blur"),e.style.pointerEvents="auto",s.style.transition="none";const t=a%360;s.style.transform="rotate("+t+"deg)",(t=>{const s=Math.ceil(t/45);i.innerHTML=r[s]})(t)})};class a extends e{constructor(t){super(t);var s=this.el(".-wof_wheel"),e=this.wheel();s.innerHTML=e.html,i(e.segments)}wheel(){for(var t=Array.from(this.all(".-sku_row")).filter(t=>{var s=parseInt(t.getAttribute("data-time"));return Date.now()<this.endTime(s)})[0].querySelectorAll(".-sku"),s=[],e=0;e<this.SEGMENT_COUNT;e++){var i=e+1,a=Array.from(t).find(t=>parseInt(t.getAttribute("data-segment"))==i);a?s.push({cl:"",image:a.getAttribute("data-segment-image"),segment:i,type:a.getAttribute("data-type"),name:a.querySelector(".-prize-name").textContent}):s.push({cl:"-oops",image:"https://ng.jumia.is/cms/0-1-initiatives/spin-win/skus/oops_3.png",segment:e+1,type:"oops",name:"oops!! try again"})}var r=this.topwrap()+this.segmentshtml(s)+this.bottomwrap(),n={};return s.forEach(t=>{n[t.segment]=t.name}),console.log("wheel & segments",{html:r,segments:n}),{html:r,segments:n}}topwrap(){return'<div class="-wheel-wrap -posrel"><img src="https://ng.jumia.is/cms/0-1-initiatives/spin-win/marker.png" alt="marker" class="-wheel-marker -posabs" /><div class="-wheel -posrel"><svg height="0" width="0"><defs><clipPath id="segment_0deg"><path d="M -1.023305e-5,9.0154354e-7 V 150 L 106.06562,43.934327 A 149.99994,150 0 0 0 -1.023305e-5,9.0154354e-7 Z" /></clipPath></defs></svg>'}bottomwrap(){return' <img src="https://ng.jumia.is/cms/0-1-initiatives/spin-win/wheel-frame.png" alt="wheel frame" class="-wheel-frame -posabs" /></div></div><img src="https://ng.jumia.is/cms/0-1-initiatives/spin-win/button.png" alt="spin button" class="-spin-btn" /><div class="-display">-</div>'}segmentshtml(t){var s='<div class="-segments -posabs">';return t.map(t=>{s+=this["seg"+t.type](t)}),s+="</div>"}segvoucher(t){var s=t.name.split(" ").join("<br/>"),e=-45*t.segment+360;return'<div class="-triangle -posabs" data-segment="'+t.segment+'" style="background-color:'+t.light_color+";transform: rotate("+e+'deg)"><div class="-voucher -posabs">'+s+'</div><div class="-big-bag -posabs"></div><div class="-overlay -posabs"></div><img class="lazy-image" src="'+t.image+'" alt="image"/></div>'}segsku(t){var s=-45*t.segment+360;return'<div class="-triangle -posabs '+t.cl+'" data-segment="'+t.segment+'" style="transform: rotate('+s+'deg)"><img src="'+t.image+'" alt="image"/></div>'}segoops(t){var s=-45*t.segment+360;return'<div class="-triangle -posabs '+t.cl+'" data-segment="'+t.segment+'" style="transform: rotate('+s+'deg)"><div class="-try-again"><div>try</div><div>again</div></div></div>'}}var r=function(t){var s=t||document,e=s.querySelectorAll(".lazy-image"),i=s.querySelectorAll(".-preloader"),a=Array.from(e).concat(Array.from(i)),r=null;try{r=new IntersectionObserver(function(t){t.forEach(h)}.bind(this),{}),a.forEach(function(t){r.observe(t)})}catch(t){a.forEach(function(t){void 0!==t.src?(t.src=t.getAttribute("data-src"),t.onload=(()=>n(t))):n(t)})}function n(t){t.classList.add("loaded"),o(t)}function o(t){t.classList.remove("-loading")}function h(t){t.isIntersecting&&(r.unobserve(t.target),function(t){return void 0!==t.target.dataset.src}(t)?function(t){t.target.src=t.target.dataset.src,t.target.onload=(()=>n(t.target))}(t):function(t){o(t.target)}(t))}};class n extends e{constructor(t){super(t),this.tabs=this.el(".-all-tabs"),this.tabs_parent=this.el(".-tabs"),this.pubsub.subscribe(this.BUILD,this.build.bind(this)),this.tabs.addEventListener("click",this.tabListener.bind(this))}build(t){var s=this.reorder(t);this.tabs.innerHTML=s.map(this.createTab.bind(this)).join("");var e=this.all(".-tab")[0];this.setTabProps(e,this.FIRST_TAB),this.show(this.tabs)}createTab(t,s){var e=0===s?"-tab active -inlineblock -posrel -vamiddle":"-tab -inlineblock -posrel -vamiddle",i=this.timeUnits(t);return'<div class="'+e+'" data-time="'+t+'"><span class="-posabs -preloader -loading"></span><span class="-time">'+this.twelveHrFormat(i.hr,i.mn)+"</span><span>"+this.date(t)+"</span></div>"}tabListener(t){var s=t.target.parentElement;this.isATab(s)&&this.setTabProps(s,this.TAB_LISTENER)}setTabProps(t,s){this.toggleClass(this.all(".-tab"),t,"active"),s==this.TAB_LISTENER&&this.pubsub.emit(this.TABBED,t.getAttribute("data-time"))}}class o extends e{constructor(t){super(t),this.json=t,this.skus_el=this.el(".-skus"),this.pubsub.subscribe(this.TABBED,this.inFocus.bind(this)),this.pubsub.subscribe(this.BUILD,this.display.bind(this))}inFocus(t){var s=this.skuRows(),e=this.skuRow(t);this.toggleClass(s,e,"active")}display(t){this.build_wheel=new a(this.json);var s=this.pastAndFutureTimes(t).future[0];this.inFocus(s),this.pubsub.emit(this.FOCUS,s),this.show(this.skus_el)}}class h extends e{constructor(t){super(t),this.time_el=this.el(".-countdown-row .-time"),this.sessionEnded=(t=>t.t<=0||t.session_state===this.AFTER_SESSION),this.amIInSession=(t=>Date.now()>=t&&Date.now()<this.endTime(t)),this.amIPastSession=(t=>Date.now()>this.endTime(t)),this.pubsub.subscribe(this.FOCUS,this.inFocus.bind(this)),this.pubsub.subscribe(this.TABBED,this.processState.bind(this))}inFocus(t){this.gone(),this.processState(t)}processState(t){var s=parseInt(t),e=this.endTime(s),i=this.sessionState(s);i===this.IN_SESSION&&this.liveActions(s);var a=i===this.IN_SESSION?e:s;this.initializeClock({session_state:i,time:a})}gone(){var t=Array.from(this.all(".-sku_row")).map(t=>parseInt(t.getAttribute("data-time"))),s=this.pastAndFutureTimes(t).past;this.oosByTime(s),s.map(t=>this.tab(t).classList.remove("active"))}sessionState(t){var s="",e=this.amIInSession(t),i=this.amIPastSession(t);return s=e?this.IN_SESSION:"",""===(s=i?this.AFTER_SESSION:s)?this.BTW_OR_B4_SESSION:s}liveActions(t){var s=this.skuRow(t),e=this.tab(t);this.live([s,e],"add")}initializeClock(t){clearInterval(this.time_interval),this.time_interval=setInterval(()=>this.tick(t),1e3)}tick(t){var s=this.remainingTime(t);s.session_state=t.session_state,this.sessionEnded(s)&&clearInterval(this.time_interval),this.updateClockUi(s)}updateClockUi(t){var s="";s=t.session_state===this.IN_SESSION?"Ends in ":"",s=t.session_state===this.AFTER_SESSION?"Ended last ":s,s=t.session_state===this.BTW_OR_B4_SESSION?"Starts in ":s;var e=this.digits(t).filter(t=>""!==t).join(" : ");this.time_el.innerHTML=s+e,this.time_el.style.display="inline-block"}remainingTime(t){var s=t.time,e=+new Date(s)-Date.now();e=this.sessionEnded(t)?Date.now()-+new Date(s):e;var i=Math.floor(e/1e3%60),a=Math.floor(e/1e3/60%60),r=Math.floor(e/36e5%24),n=Math.floor(e/864e5);t={t:e,days:n,hours:r,minutes:a,seconds:i};return this.itIsEndTime(t)&&setTimeout(()=>this.pubsub.emit(this.RESET,"from reset"),3e3),{t:e,days:n,hours:r,minutes:a,seconds:i}}itIsEndTime(t){return 0===t.days&&0===t.hours&&0===t.minutes&&0===t.seconds}digits(t){return t.days>=1?[this.digit(t.days,"d"),this.digit(t.hours,"h"),this.digit(t.minutes,"m")]:[this.digit(t.hours,"h"),this.digit(t.minutes,"m"),this.digit(t.seconds,"s")]}}new class extends e{constructor(t){super(t),this.tandc_el=this.el(".-re.-rules"),this.hiw_cta=document.querySelector(".-how-it-works"),this.top_banner=document.querySelector(".-banner.-top"),this.top_banner.addEventListener("click",this.toggleBanner.bind(this)),this.back_to_top=document.querySelector(".-btt"),this.back_to_top.addEventListener("click",()=>window.scroll(0,0)),this.tabs=new n(t),this.sku_rows=new o(t),this.state=new h(t),this.pubsub.subscribe(this.RESET,this.init.bind(this)),this.init("from start").show()}init(t){console.log("init",t);var s=this.all(".-sku_row"),e=Array.from(s).map(t=>parseFloat(t.getAttribute("data-time")));return this.pubsub.emit(this.BUILD,e),this}toggleBanner(t){var s=t.target;console.log("target is",s);var e=document.querySelector(".-rules_eligibility .-re");s.classList.contains("-up")?this.up(e):s.classList.contains("-down")?this.down(e):this.openOrClose()}upOrDown(){var t=document.querySelector(".-control.-up"),s=document.querySelector(".-control.-down"),e=document.querySelector(".-rules_eligibility .-re");console.log("target"),t.addEventListener("click",t=>this.up(e)),s.addEventListener("click",t=>this.down(e))}openOrClose(){this.top_banner.classList.toggle("-show");var t=this.hiw_cta.querySelector(".-txt");t.textContent="Terms & Conditions"===t.textContent?"Close":"Terms & Conditions"}setBanner(){return this.el(".-banner.-top img.lazy-image").setAttribute("data-src",""),this}up(t){var s=t.scrollTop-20,e=t.scrollTop-50-s;t.scrollTop=s+1*e}down(t){var s=t.scrollTop+20,e=t.scrollTop+50-s;t.scrollTop=s+1*e}}(t)};Begin();
    ${script_end}
    `
  } catch (error) {
    console.error('error', error.message)  
  }
  
  /**var skuHTML = replaceStr(markup, '.jpg">', '.jpg"/>')
  skuHTML = replaceStr(skuHTML, '.png">', '.png"/>')
  skuHTML = replaceStr(skuHTML, '"product">', '"product"/>')
  skuHTML = replaceStr(skuHTML, '"badge">', '"badge"/>')
  skuHTML = replaceStr(skuHTML, 'sku_img">', 'sku_img"/>')
  skuHTML = replaceStr(skuHTML, 'desktop banner">', 'desktop banner"/>')
  skuHTML = replaceStr(skuHTML, 'mobile banner">', 'mobile banner"/>')
  skuHTML = replaceStr(skuHTML, 'cat_img">', 'cat_img"/>')
  skuHTML = replaceStr(skuHTML, '&amp;', '&')
  skuHTML = skuHTML.replace(/(<img[^>]+)/g, "$1 /"); */
  var skuHTML = markup.replace(/(<img("[^"]*"|[^\/">])*)>/gi, "$1/>");
  var to_copy = document.querySelector('.-to-copy')
  to_copy.value = `${styles}${skuHTML}${jscript}`

  var copy_btn = document.querySelector('.-copy-btn')
  copy_btn.addEventListener('click', () => { clipboard(copy_btn, 'copy', to_copy) })

  var my_iframe = document.getElementById('test-bench')

  my_iframe.contentWindow.postMessage(skuHTML, '*');
}

var Begin = (function (data) {
  class Util {
    constructor(json) {
      this.json = json
      this.NAME = 'Wheel of Fortune'
      this.ID = 'wof'
      this.TANDC = 'WOF T & C'
      this.USERNEED = 'Userneed'
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
      this.minute_duration = parseInt(json.config.minute_duration_wof)
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
      this.isATab = el => el.classList.contains('-tab')
      this.percent = rating => ((rating / 5) * 100).toFixed(2)
    }

    badgeSKUs(datum) {
      if (datum.badges)  {
        var badges = Object.keys(datum.badges).map(key => {
          var badge = datum.badges[key]
          return key === 'main' ? `<span class="-badge -main -posabs -${this.id(badge.name, '-')}">${badge.name}</span>` : `<img class="-badge -campaign -posabs lazy-image" data-src="${badge.image}" alt="badge"/>`
        })
        return badges.join('')
      } else return ''
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

    date(time) {
      var _time = new Date(time)
      var time_date = _time.getDate()
      var now_date = new Date(Date.now()).getDate()
      var time_diff = now_date - time_date
  
      if (time_diff === 0) return this.capitalize('today')
      else if (time_diff === 1) return this.capitalize('yesterday')
      else if (time_diff === -1) return this.capitalize('tomorrow')
      else return this.fullDate(time)
    }

    fullDate(time) {
      var date = new Date(time)
      var mnth = date.toLocaleDateString("en-US", { month: 'short' })
      var day = date.toLocaleDateString("en-US", { weekday: 'short' })
      return mnth + ' ' + day + ' ' + date.getDate()
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
      var badge_el = badge_icon ? `<div class="-tag -inlineblock -vamiddle -b-img -${this.id(sku.type, '-')}">${badge}</div>` : `<div class="-tag -inlineblock -vamiddle -${this.id(sku.type, '-')}" style="background-color:${this.config[sku.type]}">${badge}</div>`
      return badge_el
    }

    timeFormat(time) {
      var t_units = this.timeUnits(time)
      var t = this.twelveHrFormat(t_units.hr, t_units.mn)
      return this.date(time) + "'s " + t + ' sale'
    }
    
    platform() {
      var is_mobile = 'ontouchstart' in window
      var banner = is_mobile ? this.config.wof_mobile_banner : this.config.wof_desktop_banner
      var live_link = is_mobile ? this.config.wof_deeplink : (this.domain.host + '/' + this.config.download_apps_page)
      return { banner, live_link }
    }

    show(parent) {
      this.image_observer = new feature_box.ImageObserver(parent)
      this.image_observer = null
      return this
    }
  }

  class Controller extends Util {
    constructor(json) {
      super(json)
      this.data = this.getData(json, { key: 'initiative', name: this.NAME })
      this.tandcs = this.getData(json, { key: 'type', name: this.TANDC })
      this.userneeds = this.getData(json, { key: 'initiative', name: this.USERNEED })

      this.tandc_el = this.el('.-re.-rules')
      this.hiw_cta = document.querySelector('.-how-it-works')
      this.hiw_cta.addEventListener('click', this.toggleBanner.bind(this))
      this.top_banner = document.querySelector('.-banner.-top')
      this.container = document.querySelector('#initiative.-container')

      this.tabs = new Tabs(json)
      this.sku_rows = new SKURows(json)
      this.state = new State(json)

      feature_box.subscribe(this.RESET, this.init.bind(this))

    
      this.gridview_skus_el = document.querySelector('.-gridview-skus')
      this.gridview_skus_btn = document.querySelector('.-get-gridview-skus-data')

      this.gridview_skus_btn.addEventListener('click', () => {
        this.container.classList.add('-fetch-loading')
        var skus = this.gridview_skus_el.value
        var skus_list = skus.split(',')
        console.log('skus_list', skus_list)
        this.collectSKUData(skus_list)
        .then(data => {
          return data.map(datum => datum.skus ? datum.skus[0] : null)
          .filter(datum => datum !== null)
        })
        .then(this.buildData.bind(this))
        .then(() => this.appData())
        .catch(err => console.error(err))
      })

      this.init('from start')
      .setBanner()
      .displayTAndCs()

      feature_box.subscribe(feature_box.PRODUCTS_DISPLAYED, () => {
        this.appData()
        this.show()
      })
    }

    init(msg) {
      console.log('init', msg)
      var all_times = this.times(this.data)
      var past_future = this.pastAndFutureTimes(all_times)
      var additional_times = this.additionalTimes(past_future).filter(time => time !== undefined)
      var reordered_times = past_future.future.concat(additional_times)
      var grouped_skus = this.group(this.data, reordered_times)
      feature_box.emit(this.BUILD, { reordered_times, grouped_skus })
      return this
    }

    should(placement, type) {
      var should_display
      if (type == 'specific')
        should_display = this.config[placement + '_' + this.ID] || config[placement]
      else
        should_display = this.config[placement]
      return should_display === 'no' ? false : true
    }

    appData() {
      var campaign_title = this.config.campaign
      var campaign_banner = this.config.campaign_banner_mobile
      var campaign_url = this.config.campaign_url
      var minute_duration_wof = this.config.minute_duration_wof
      var wof_app_banner = this.config.wof_app_banner
      var campaign_1_mdb = this.config.campaign_1_mdb
      var campaign_2_mdb = this.config.campaign_2_mdb
      var campaign_1_url = this.config.campaign_1_url
      var campaign_2_url = this.config.campaign_2_url
      var featurebox_title = this.config.featurebox_title
      var tandc_html = this.tandc_el.outerHTML
      var hide_banner_class = this.should('display_double_banner', 'specific') ? '' : ' -hide'
      var hide_title_class = this.should('display_featurebox_title', 'generic') ? '' : ' -hide'
      var hide_userneed_class = this.should('display_collection_icons', 'specific') ? '' : ' -hide'
      var hide_catalog_class = this.should('display_catalog', 'specific') ? '' : ' -hide'
      var userneed_html = this.userneedHTML(this.userneeds, hide_userneed_class)
      
      try {
        extractData({
          campaign_title, campaign_banner, campaign_url,
          minute_duration_wof, wof_app_banner,
          userneed_html, campaign_1_mdb, campaign_2_mdb,
          campaign_1_url, campaign_2_url, tandc_html,featurebox_title,
          hide_banner_class, hide_title_class, hide_catalog_class
        })
      } catch (error) {
        console.error(error)
      }
      
      this.container.classList.remove('-fetch-loading')
      return this
    }

    collectSKUData(skus) {
      this.valid = 0
      this.temp_valid = this.valid
      return Promise.all(
        skus.map((sku) => {
          var url = this.domain.host + '/catalog/?q=' + sku
          return fetch(url)
            .then(res => res.text())
            .then(this.desktopExtract)
            .catch(err => {
              console.log('error fetching data', err.message)
            })
        })
      )
    }

    desktopExtract(data) {
      var start = data.indexOf('window.__STORE__=') + 17
      var end = data.indexOf('};</scr') + 1
      var json = data.substring(start, end)
      try { return { skus: JSON.parse(json).products } }
      catch (error) { console.log('error', error); return [] }
    }

    buildData(data) {
      console.log('data to build', data)
      var products = this.el('.-products')
      products.innerHTML = data.map(this.html.bind(this)).join('')
      this.show(products)
    }

    html(datum) {
      var oldprice_discount = datum.prices.discount ? `<div class="-price-discount"><div class="-pd -price -old -posrel"><div class="-text">${datum.prices.oldPrice}</div></div><div class="-pd -discount -posrel"><div class="-text">${datum.prices.discount}</div></div></div>` : ''
  
      var rating = datum.rating ? `<div class="-product_rating"><div class="-stars -radio-el -posrel -inlineblock -vamiddle"><div class="-in" style="width:${this.percent(datum.rating.average)}%"></div></div><div class="-count -inlineblock -vabaseline -posrel"><div class="-rt">(${datum.rating.totalRatings})</div></div></div>` : ''
  
      var express = datum.shopExpress ? `<div class="-express -list -posrel"><express></express></div>` : ''
  
      var free_shipping = datum.shopExpress ? `<div class="-free-shipping -posrel"><div class="-text">${datum.shopExpress.text ? datum.shopExpress.text : ''}</div></div>` : ''
  
      var global = datum.shopGlobal ? `<div class="-tag -posrel"><span class="-global">${datum.shopGlobal.name}</span></div>` : ''
  
      return `<a href="${this.domain.host}${datum.url}" class="-product" target="_blank">
        <div class="-img -posrel">
          <span class="-posabs -preloader -loading"></span>
          ${this.badgeSKUs(datum)}
          <img class="lazy-image" data-src="${datum.image}" alt="product"/>
        </div>
        <div class="-details">
          ${global}
          <div class="-name -posrel">
            <div class="-text">${datum.displayName}</div>
          </div>
          <div class="-price -new -posrel">
            <div class="-text">${datum.prices.price}</div>
          </div>
          ${oldprice_discount}
          ${rating}
          ${express}
          ${free_shipping}
        </div>
        <div class="-cta -posrel">
          <div class="-text">add to cart</div>
        </div>
      </a>`
    }

    userneedHTML(userneeds, hide_userneed_class) {
      var html = '<div class="-row -userneeds ' + hide_userneed_class + '">'
      userneeds.map(userneed => {
        html += `<a href="${userneed.url}" class="-inlineblock -vamiddle -userneed"><img src="${userneed.image}" alt="${userneed.name}" /><div class="-txt">${userneed.name}</div></a>`
      })
      html += '</div>'
      return html
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
      return `<div class="-rule_element"><div class="-inlineblock -vatop -num">${tandc.sku}.</div><div class="-inlineblock -vatop -desc">${tandc.prize_amount}</div></div>`
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

      feature_box.subscribe(this.BUILD, this.build.bind(this))
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

      this.createSKUs = skus => skus.map(this.skuHTML.bind(this)).join('')
      this.skuHTML = sku => this.createcard(sku)

      feature_box.subscribe(this.FOCUS, this.inFocus.bind(this))
      feature_box.subscribe(this.BUILD, this.display.bind(this))
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

      feature_box.emit(this.FOCUS, first_time)
      this.show(this.skus_el)
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

    createcard(sku) {
      var key = sku.name + ' ' + sku.category + ' ' + this.date(sku.time)
      return `<div class="-sku -posrel -${sku.status}" data-time="${+new Date(sku.time)}" id="${this.id(key, '-')}" data-segment="${sku.segment_no}" data-segment-image="${sku.image}" data-type="${sku.type}" data-light-color="${sku.light_color}"><div class="-posabs -shadow"><span class="-posabs">gone</span></div><div class="-img -posabs"><a href="${sku.category_url}" class="-category_img -posabs"><span class="-posabs -preloader"></span><div class="-posabs -overlay"></div><div class="-posabs -big-bag"></div><div class="-posabs -names"><div class="-sub-name">${sku.prize}</div><div class="-name -cta">${sku.units} unit(s)</div></div><img class="lazy-image -posabs -x-img" data-src="${sku.image}" alt="sku_img" /></a></div><div class="-details -posabs"><div class="-prize -posabs"><div class="-note">Spin the wheel above and stand a chance to win:</div><div class="-prize-name">${sku.prize}</div></div></div><div class="-tags -posabs"><div class="-tag -inlineblock -vamiddle -single">Live Now</div></div></div>`
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


var gsheet_id = "16AmKgEy2tHWRHgt9wdAfQJvgsML_pu_Z9PTH-_LvSjY"
var fb_config = {
  apiKey: "AIzaSyAA8dQEt-yZnDyY3Lra8lndRJ3LWNYVW0o",
  authDomain: "jumia-c15a3.firebaseapp.com",
  databaseURL: "https://jumia-c15a3.firebaseio.com",
  projectId: "jumia-c15a3",
  storageBucket: "jumia-c15a3.appspot.com",
  messagingSenderId: "295115190934",
  appId: "1:295115190934:web:de0b33b53a514c3c"
}
var element_id = 'app'
var feature_box = Featurebox({ id: gsheet_id, config: fb_config, element_id, name: 'wof' })

feature_box.subscribe(feature_box.FETCHED_DATA, Begin)