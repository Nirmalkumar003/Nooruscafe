(function () {
    var ITEMS = [
        { id: "j1", cat: "Fresh juice", name: "Watermelon Juice", desc: "Chilled, pressed to order, a squeeze of lime.", price: 90, veg: true, tag: "Bestseller" },
        { id: "j2", cat: "Fresh juice", name: "Sweet Lime (Mosambi)", desc: "Plain and bright, served over ice.", price: 100, veg: true },
        { id: "j3", cat: "Fresh juice", name: "Pomegranate Juice", desc: "Deep ruby, a little tart, no sugar added.", price: 140, veg: true },
        { id: "j4", cat: "Fresh juice", name: "Cold-Pressed Orange", desc: "Four oranges in every 300 ml glass.", price: 130, veg: true },
        { id: "j5", cat: "Fresh juice", name: "Sugarcane &amp; Ginger", desc: "Roadside classic with a warm ginger kick.", price: 80, veg: true },
        { id: "j6", cat: "Fresh juice", name: "Mixed Fruit Juice", desc: "Seasonal fruit, blended without water.", price: 120, veg: true },

        { id: "t1", cat: "Tea", name: "Chai", desc: "Assam, cardamom, ginger, boiled with milk.", price: 15, veg: true, tag: "Bestseller" },
        { id: "t2", cat: "Tea", name: "Ginger Lemon Tea", desc: "Light, no milk, honey on request.", price: 20, veg: true },
        { id: "t3", cat: "Tea", name: "Kashmiri Kahwa", desc: "Green tea with saffron, almond and cinnamon.", price: 110, veg: true },
        { id: "t4", cat: "Tea", name: "Iced Peach Tea", desc: "Black tea, peach, lots of ice.", price: 130, veg: true },
        { id: "t5", cat: "Tea", name: "Matcha Latte", desc: "Ceremonial-grade matcha with steamed milk.", price: 190, veg: true },

        { id: "c1", cat: "Coffee", name: "Kaapi", desc: "Chicory blend, decoction and frothy milk in a steel tumbler.", price: 20, veg: true, tag: "House favourite" },
        { id: "c2", cat: "Coffee", name: "Cappuccino", desc: "Double shot, thick microfoam.", price: 150, veg: true },
        { id: "c3", cat: "Coffee", name: "Flat White", desc: "Double ristretto, silky milk, small cup.", price: 160, veg: true },
        { id: "c4", cat: "Coffee", name: "Hazelnut Latte", desc: "Espresso, steamed milk, roasted hazelnut syrup.", price: 180, veg: true },
        { id: "c5", cat: "Coffee", name: "Iced Americano", desc: "Two shots over ice and cold water.", price: 140, veg: true },
        { id: "c6", cat: "Coffee", name: "Cold Brew", desc: "Steeped 16 hours, served black or with milk.", price: 170, veg: true },

        { id: "s1", cat: "Shakes", name: "Cold Coffee Frappe", desc: "Blended with ice cream and a chocolate drizzle.", price: 170, veg: true },
        { id: "s2", cat: "Shakes", name: "Oreo Shake", desc: "Crushed Oreos, vanilla ice cream, milk.", price: 180, veg: true },
        { id: "s3", cat: "Shakes", name: "Alphonso Mango Shake", desc: "In season only, thick and not too sweet.", price: 150, veg: true },

        { id: "b1", cat: "Bites", name: "Veg Puff", desc: "Flaky pastry, spiced potato and peas.", price: 45, veg: true },
        { id: "b2", cat: "Bites", name: "Paneer Tikka Sandwich", desc: "Grilled on multigrain with mint chutney.", price: 170, veg: true, tag: "Bestseller" },
        { id: "b3", cat: "Bites", name: "Chicken Club Sandwich", desc: "Roast chicken, egg, lettuce, mayo, three layers.", price: 210, veg: false },
        { id: "b4", cat: "Bites", name: "Peri Peri Fries", desc: "Crisp fries tossed in house peri peri.", price: 140, veg: true },
        { id: "b5", cat: "Bites", name: "Banana Walnut Cake", desc: "Baked every morning, a slice per order.", price: 120, veg: true },
        { id: "b6", cat: "Bites", name: "Chocolate Brownie", desc: "Fudgy, served warm on request.", price: 130, veg: true }
    ];
    var CATS = ["Fresh juice", "Tea", "Coffee", "Shakes", "Bites"];
    var BOARD = ["c1", "t1", "j1", "b2", "c6"];
    var GST = 0.05;
    var HOURS = [["Sunday", "12 am – 12 pm"], ["Monday", "12 am – 12 pm"], ["Tuesday", "12 am – 12 pm"], ["Wednesday", "12 am – 12 pm"], ["Thursday", "12 am – 12 pm"], ["Friday", "12 am – 12:00 pm"], ["Saturday", "12 am – 12:00 pm"]];
    var STORE_KEY = "filterfig-cart";

    var cart = {};
    var state = { cat: "All", vegOnly: false, view: "cart", lastOrder: null };
    var byId = {};
    ITEMS.forEach(function (i) { byId[i.id] = i; });

    function $(id) { return document.getElementById(id); }
    function rs(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
    function qtyOf(id) { return cart[id] || 0; }
    function totalCount() { var n = 0; for (var k in cart) n += cart[k]; return n; }
    function subtotal() { var s = 0; for (var k in cart) s += cart[k] * byId[k].price; return s; }
    function plain(s) { return s.replace(/&amp;/g, "&"); }
    function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
    function dot(v) { return '<span class="dot' + (v ? "" : " nv") + '" role="img" aria-label="' + (v ? "Vegetarian" : "Non-vegetarian") + '"></span>'; }

    /* remember the cart if the page is refreshed */
    function saveCart() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) { }
    }
    function loadCart() {
        try {
            var saved = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
            for (var k in saved) {
                if (byId[k] && saved[k] > 0) cart[k] = Math.floor(saved[k]);
            }
        } catch (e) { cart = {}; }
    }

    function ctrl(id) {
        var q = qtyOf(id);
        if (!q) return '<button class="add" type="button" data-act="add" data-id="' + id + '" aria-label="Add ' + plain(byId[id].name) + '">ADD</button>';
        return '<div class="step"><button type="button" data-act="dec" data-id="' + id + '" aria-label="Remove one ' + plain(byId[id].name) + '">&minus;</button><span>' + q + '</span><button type="button" data-act="add" data-id="' + id + '" aria-label="Add one more ' + plain(byId[id].name) + '">+</button></div>';
    }

    function renderBoard() {
        $("boardList").innerHTML = BOARD.map(function (id) {
            var i = byId[id];
            return '<li><span class="n">' + i.name + '</span><span class="dots"></span><span class="p">' + rs(i.price) + '</span></li>';
        }).join("");
    }

    function renderChips() {
        var all = ["All"].concat(CATS);
        $("chips").innerHTML = all.map(function (c) {
            return '<button class="chip" type="button" data-cat="' + c + '" aria-pressed="' + (state.cat === c) + '">' + c + '</button>';
        }).join("");
    }

    function renderMenu() {
        var html = "";
        var shown = 0;
        CATS.forEach(function (c) {
            if (state.cat !== "All" && state.cat !== c) return;
            var list = ITEMS.filter(function (i) { return i.cat === c && (!state.vegOnly || i.veg); });
            if (!list.length) return;
            shown += list.length;
            html += '<section class="cat" aria-labelledby="h-' + c.replace(/\s/g, "") + '"><div class="cat-title"><h3 id="h-' + c.replace(/\s/g, "") + '">' + c + '</h3><span class="eyebrow">' + list.length + ' items</span></div><div class="items">';
            list.forEach(function (i) {
                html += '<div class="item" data-item="' + i.id + '"><div class="name">' + dot(i.veg) + '<span>' + i.name + '</span>' + (i.tag ? '<span class="tag">' + i.tag + '</span>' : '') + '</div><p class="desc">' + i.desc + '</p><div class="side"><span class="price">' + rs(i.price) + '</span><div class="ctrl" data-ctrl="' + i.id + '">' + ctrl(i.id) + '</div></div></div>';
            });
            html += '</div></section>';
        });
        if (!shown) html = '<p class="empty-note">No items match these filters.</p>';
        $("menuList").innerHTML = html;
        $("itemTotal").textContent = shown;
    }

    function refreshCtrl(id) {
        var el = document.querySelector('[data-ctrl="' + id + '"]');
        if (!el) return;
        var hadFocus = el.contains(document.activeElement);
        el.innerHTML = ctrl(id);
        if (hadFocus) {
            var b = el.querySelector("button[data-act]");
            if (b) b.focus();
        }
    }

    function refreshBar() {
        var n = totalCount();
        $("cartCount").textContent = n;
        $("barText").textContent = n + (n === 1 ? " item" : " items") + " · " + rs(subtotal());
        $("bar").classList.toggle("on", n > 0);
        document.body.classList.toggle("has-bar", n > 0);
    }

    function orderText(token) {
        var lines = Object.keys(cart).map(function (k) {
            return cart[k] + " x " + plain(byId[k].name) + "  " + rs(cart[k] * byId[k].price);
        });
        var s = subtotal(), g = s * GST;
        return (token ? "Order " + token + "\n" : "") + lines.join("\n") + "\nSubtotal " + rs(s) + "\nGST 5% " + rs(g) + "\nTotal " + rs(s + g);
    }

    function renderDrawer() {
        var body = $("drawerBody"), foot = $("drawerFoot");
        if (state.view === "done") {
            var o = state.lastOrder;
            body.innerHTML = '<div class="done"><div class="eyebrow">Demo order placed</div><div class="token">' + o.token + '</div><h3>Thanks, ' + esc(o.name || "friend") + '.</h3><p>' + (o.type === "Dine-in" ? 'Table ' + esc(o.table || "to be assigned") + ' · Dine-in' : 'Takeaway') + '. Show this token at the counter.</p><div class="ordertxt">' + esc(o.text) + '</div></div>';
            foot.innerHTML = '<button class="btn ghost" type="button" data-act="copyorder">Copy order details</button><button class="btn" type="button" data-act="reset">Start a new order</button><p class="demo-note">This is a demo site, so no order was sent to a real kitchen.</p>';
            return;
        }
        var ids = Object.keys(cart);
        if (!ids.length) {
            body.innerHTML = '<p class="empty-note">Your order is empty. Add a few items from the menu and they will show up here.</p>';
            foot.innerHTML = '<button class="btn" type="button" data-act="close">Browse the menu</button>';
            return;
        }
        var s = subtotal(), g = s * GST;
        var keepName = ($("custName") && $("custName").value) || "";
        var keepTable = ($("custTable") && $("custTable").value) || "";
        var keepType = (document.querySelector('input[name="otype"]:checked') || {}).value || "Dine-in";
        var h = ids.map(function (k) {
            var i = byId[k];
            return '<div class="line"><div class="l-name">' + dot(i.veg) + '<span>' + i.name + '</span></div><div class="l-sub">' + rs(i.price) + ' each · ' + rs(i.price * cart[k]) + '</div><div class="step"><button type="button" data-act="dec" data-id="' + k + '" aria-label="Remove one ' + plain(i.name) + '">&minus;</button><span>' + cart[k] + '</span><button type="button" data-act="add" data-id="' + k + '" aria-label="Add one more ' + plain(i.name) + '">+</button></div></div>';
        }).join("");
        h += '<div class="totals mono"><div><span>Subtotal</span><span>' + rs(s) + '</span></div><div><span>GST 5%</span><span>' + rs(g) + '</span></div><div class="grand"><span>Total</span><span>' + rs(s + g) + '</span></div></div>';
        h += '<fieldset class="field"><legend>How will you have it?</legend><div class="seg"><label><input type="radio" name="otype" value="Dine-in"' + (keepType === "Dine-in" ? " checked" : "") + '><span>Dine-in</span></label><label><input type="radio" name="otype" value="Takeaway"' + (keepType === "Takeaway" ? " checked" : "") + '><span>Takeaway</span></label></div></fieldset>';
        h += '<div class="field"><label for="custName">Your name</label><input type="text" id="custName" autocomplete="given-name" placeholder="e.g. Priya" value="' + esc(keepName) + '"></div>';
        h += '<div class="field" id="tableField"' + (keepType === "Takeaway" ? " hidden" : "") + '><label for="custTable">Table number</label><input type="text" id="custTable" inputmode="numeric" placeholder="e.g. 6" value="' + esc(keepTable) + '"></div>';
        body.innerHTML = h;
        foot.innerHTML = '<button class="btn" type="button" data-act="place">Place order · ' + rs(s + g) + '</button><button class="btn ghost" type="button" data-act="clear">Clear order</button><p class="demo-note">Demo checkout. Connect it to your kitchen or WhatsApp to take real orders.</p>';
    }

    function openCart() {
        $("layer").hidden = false;
        renderDrawer();
        var c = $("closeCart"); if (c) c.focus();
    }
    function closeCart() {
        $("layer").hidden = true;
        $("openCart").focus();
    }

    function change(id, d) {
        var q = qtyOf(id) + d;
        if (q <= 0) delete cart[id]; else cart[id] = q;
        saveCart();
        refreshCtrl(id);
        refreshBar();
        if (!$("layer").hidden && state.view === "cart") renderDrawer();
    }

    function copy(text, btn, label) {
        function flash(t) { var old = btn.textContent; btn.textContent = t; setTimeout(function () { btn.textContent = old; }, 1600); }
        function fallback() {
            var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
            document.body.appendChild(ta); ta.select();
            var ok = false; try { ok = document.execCommand("copy"); } catch (e) { }
            document.body.removeChild(ta); flash(ok ? label : "Select and copy manually");
        }
        try { navigator.clipboard.writeText(text).then(function () { flash(label); }, fallback); } catch (e) { fallback(); }
    }

    document.addEventListener("click", function (e) {
        var chip = e.target.closest("[data-cat]");
        if (chip) { state.cat = chip.getAttribute("data-cat"); renderChips(); renderMenu(); return; }
        var b = e.target.closest("[data-act]");
        if (!b) return;
        var act = b.getAttribute("data-act"), id = b.getAttribute("data-id");
        if (act === "add") change(id, 1);
        else if (act === "dec") change(id, -1);
        else if (act === "close") closeCart();
        else if (act === "clear") { var old = Object.keys(cart); cart = {}; saveCart(); old.forEach(refreshCtrl); refreshBar(); renderDrawer(); }
        else if (act === "place") {
            var type = (document.querySelector('input[name="otype"]:checked') || {}).value || "Dine-in";
            var name = ($("custName").value || "").trim();
            var table = $("custTable") ? $("custTable").value.trim() : "";
            var token = "A-" + (100 + Math.floor(Math.random() * 900));
            state.lastOrder = { token: token, name: name, type: type, table: table, text: orderText(token) };
            state.view = "done";
            var olds = Object.keys(cart); cart = {}; saveCart(); olds.forEach(refreshCtrl); refreshBar();
            renderDrawer();
        }
        else if (act === "copyorder") copy(state.lastOrder.text, b, "Copied");
        else if (act === "reset") { state.view = "cart"; state.lastOrder = null; renderDrawer(); closeCart(); }
    });

    document.addEventListener("change", function (e) {
        if (e.target && e.target.name === "otype") { $("tableField").hidden = e.target.value === "Takeaway"; }
        if (e.target && e.target.id === "vegOnly") { state.vegOnly = e.target.checked; renderMenu(); }
    });

    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("layer").hidden) closeCart(); });
    $("openCart").addEventListener("click", function () { if (state.view === "done") state.view = "cart"; openCart(); });
    $("barBtn").addEventListener("click", function () { state.view = "cart"; openCart(); });
    $("closeCart").addEventListener("click", closeCart);
    $("scrim").addEventListener("click", closeCart);
    $("copyAddr").addEventListener("click", function () { copy($("addrText").textContent, this, "Address copied"); });

    function renderHours() {
        var now = new Date(), d = now.getDay();
        $("hoursTable").innerHTML = HOURS.map(function (r, i) {
            return '<tr' + (i === d ? ' class="today"' : '') + '><td>' + r[0] + (i === d ? ' (today)' : '') + '</td><td>' + r[1] + '</td></tr>';
        }).join("");
        var mins = now.getHours() * 60 + now.getMinutes();
        var close = (d === 5 || d === 6) ? 23 * 60 + 30 : 23 * 60;
        var open = mins >= 7 * 60 && mins < close;
        $("openPill").classList.toggle("closed", !open);
        $("openText").textContent = open ? "Open now" : "Closed now, opens at 7 am";
    }

    loadCart();
    renderBoard(); renderChips(); renderMenu(); renderHours(); refreshBar();
})();