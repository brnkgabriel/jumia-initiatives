class FetchData {
  constructor() {
    this.skus_textarea = document.getElementById("skus");
    this.fetch_el = document.getElementById("fetch");
    this.country = document.getElementById("country");
    this.copy_data = document.getElementById("copy-data");
    this.app_data = document.getElementById("app-data");

    this.domain = "https://www.jumia.com.ng";

    this.catalog = "https://www.jumia.com.ng/catalog/?q=";

    this.country.addEventListener("change", () => {
      console.log("country", this.country.value);
      this.domain = "https://www.jumia" + this.country.value;
      this.catalog = this.domain + "/catalog/?q=";
    });

    this.fetch_el.addEventListener("click", () => this.fetch());

    this.copy_data.addEventListener("click", () =>
      this.copyToClipboard(this.app_data)
    );
  }

  copyToClipboard(el) {
    var body = document.body,
      range,
      sel;
    if (document.createRange && window.getSelection) {
      range = document.createRange();
      sel = window.getSelection();
      sel.removeAllRanges();
      try {
        range.selectNodeContents(el);
        sel.addRange(range);
      } catch (e) {
        range.selectNode(el);
        sel.addRange(range);
      }
    } else if (body.createTextRange) {
      range = body.createTextRange();
      range.moveToElementText(el);
      range.select();
    }
    document.execCommand("copy");
  }

  fetch() {
    var split = this.skus_textarea.value.split("\n");

    Promise.all(
      split.map((sku) => {
        var url = this.catalog + sku;
        return fetch(url)
          .then((res) => res.text())
          .then((html) => this.data(html));
      })
    )
      .then((data) => this.build(data, split))
      .catch((err) => console.error(err));
  }

  data(html) {
    var start_idx = html.indexOf("window.__STORE__=") + 17;
    var end_idx = html.indexOf("};</scr") + 1;
    var obj = html.substring(start_idx, end_idx);
    return JSON.parse(obj).products ? JSON.parse(obj).products[0] : {};
  }

  categoryL1(sku) {
    const categoryStr = sku.categories;
    if (categoryStr) {
      const pieces = categoryStr.split("/");
      return pieces[0]
    }
    return ""
  }

  /**
   *
   * @param {object[]} data
   */
  build(data, split) {
    console.log("data", data);
    var html = "";
    var app_data_tbody = this.app_data.querySelector("tbody");
    /**data.filter(datum => datum.sku)*/
    data.map((datum, idx) => {
      var old_price = datum.prices ? datum.prices.oldPrice : "";
      var new_price = datum.prices ? datum.prices.price : "";
      var url = datum.url ? this.domain + datum.url : "";
      const catL1 = this.categoryL1(datum);
      /**html += `<tr><td>${datum.sku}</td><td>${datum.prices.oldPrice ? datum.prices.oldPrice : ''}</td><td>${datum.prices.price}</td><td>${datum.displayName}</td><td>${datum.image}</td><td>${this.domain}${datum.url}</td></tr>`*/
      html += `<tr><td>${datum.sku ? datum.sku : split[idx]}</td><td>${
        datum.displayName ? datum.displayName : ""
      }</td><td>${
        datum.image ? datum.image : ""
      }</td><td>${url}</td><td>${old_price}</td><td>${new_price}</td><td>${
        catL1
      }</td></tr>`;
    });
    app_data_tbody.innerHTML = html;
  }
}

new FetchData();
