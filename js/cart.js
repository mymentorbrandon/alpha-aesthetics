/**
 * ALPHA AESTHETICS & HEALTH — CART
 *
 * Include this AFTER cart-data.js on every page:
 *   <script src="/js/cart-data.js"></script>
 *   <script src="/js/cart.js"></script>
 *
 * This script:
 *  - Injects a cart icon + badge into the nav bar automatically
 *  - Builds a slide-out cart drawer
 *  - Persists cart contents in localStorage (survives page navigation)
 *  - Renders "Add to Cart" buttons wherever a
 *      <button class="alpha-add-to-cart" data-product-id="xyz"></button>
 *    exists on the page
 *  - Sends the cart to the Netlify function to create a Stripe Checkout
 *    Session, then redirects to Stripe's hosted checkout page
 */

(function () {
  const CART_STORAGE_KEY = "alphaCart";
  const CHECKOUT_ENDPOINT = "/.netlify/functions/create-checkout-session";

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Cart read error:", e);
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    renderBadge();
    renderDrawer();
  }

  function findProduct(productId) {
    return (window.ALPHA_PRODUCTS || []).find((p) => p.id === productId);
  }

  function addToCart(productId, quantity) {
    const product = findProduct(productId);
    if (!product) return;

    if (!product.priceId || product.priceId.startsWith("REPLACE_ME")) {
      alert(
        `"${product.name}" isn't available for online payment yet — please book a consultation or call us at (470) 610-4550.`
      );
      return;
    }

    quantity = Math.max(1, parseInt(quantity, 10) || 1);

    const cart = getCart();
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: productId, quantity });
    }
    saveCart(cart);
    openDrawer();
  }

  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter((item) => item.id !== productId);
    saveCart(cart);
  }

  function updateQuantity(productId, quantity) {
    quantity = Math.max(1, parseInt(quantity, 10) || 1);
    const cart = getCart();
    const item = cart.find((i) => i.id === productId);
    if (item) {
      item.quantity = quantity;
      saveCart(cart);
    }
  }

  function cartTotalCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  // ---------- UI: nav icon + badge ----------

  function injectButtonStyles() {
    if (document.getElementById("alpha-cart-btn-styles")) return;
    const style = document.createElement("style");
    style.id = "alpha-cart-btn-styles";
    style.textContent = `
      .alpha-add-to-cart {
        background: var(--teal, #4a8fa0);
        color: #fff;
        border: none;
        padding: 7px 16px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.1s ease;
        margin-left: 10px;
        white-space: nowrap;
      }
      .alpha-add-to-cart:hover {
        background: var(--teal-dark, #3a7080);
      }
      .alpha-add-to-cart:active {
        transform: scale(0.96);
      }
      .alpha-qty-input {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 5px 6px;
        font-size: 12px;
      }
      .alpha-qty-input:focus {
        outline: none;
        border-color: var(--teal, #4a8fa0);
      }
    `;
    document.head.appendChild(style);
  }

  function injectButtonStyles() {
    if (document.getElementById("alpha-cart-btn-styles")) return;
    const style = document.createElement("style");
    style.id = "alpha-cart-btn-styles";
    style.textContent = `
      .alpha-add-to-cart {
        background: var(--teal, #4a8fa0);
        color: #fff;
        border: none;
        padding: 7px 16px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.1s ease;
        margin-left: 10px;
        white-space: nowrap;
      }
      .alpha-add-to-cart:hover {
        background: var(--teal-dark, #3a7080);
      }
      .alpha-add-to-cart:active {
        transform: scale(0.96);
      }
      .alpha-qty-input {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 5px 6px;
        font-size: 12px;
      }
      .alpha-qty-input:focus {
        outline: none;
        border-color: var(--teal, #4a8fa0);
      }
    `;
    document.head.appendChild(style);
  }

  function injectButtonStyles() {
    if (document.getElementById("alpha-cart-btn-styles")) return;
    const style = document.createElement("style");
    style.id = "alpha-cart-btn-styles";
    style.textContent = `
      .alpha-add-to-cart {
        background: var(--teal, #4a8fa0);
        color: #fff;
        border: none;
        padding: 7px 16px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.1s ease;
        margin-left: 10px;
        white-space: nowrap;
      }
      .alpha-add-to-cart:hover {
        background: var(--teal-dark, #3a7080);
      }
      .alpha-add-to-cart:active {
        transform: scale(0.96);
      }
      .alpha-qty-input {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 5px 6px;
        font-size: 12px;
      }
      .alpha-qty-input:focus {
        outline: none;
        border-color: var(--teal, #4a8fa0);
      }
    `;
    document.head.appendChild(style);
  }

  function injectButtonStyles() {
    if (document.getElementById("alpha-cart-btn-styles")) return;
    const style = document.createElement("style");
    style.id = "alpha-cart-btn-styles";
    style.textContent = `
      .alpha-add-to-cart {
        background: var(--teal, #4a8fa0);
        color: #fff;
        border: none;
        padding: 7px 16px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.1s ease;
        margin-left: 10px;
        white-space: nowrap;
      }
      .alpha-add-to-cart:hover {
        background: var(--teal-dark, #3a7080);
      }
      .alpha-add-to-cart:active {
        transform: scale(0.96);
      }
      .alpha-qty-input {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 5px 6px;
        font-size: 12px;
      }
      .alpha-qty-input:focus {
        outline: none;
        border-color: var(--teal, #4a8fa0);
      }
    `;
    document.head.appendChild(style);
  }

  function injectCartIcon() {
    if (document.getElementById("alpha-cart-icon")) return; // already injected

    const nav =
      document.querySelector("nav") ||
      document.querySelector("header") ||
      document.body;

    const iconWrap = document.createElement("div");
    iconWrap.id = "alpha-cart-icon";
    iconWrap.setAttribute("aria-label", "View cart");
    iconWrap.style.cssText = `
      position: fixed;
      top: 18px;
      right: 20px;
      z-index: 9998;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    `;
    iconWrap.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      <span id="alpha-cart-badge" style="
        position: absolute;
        top: -4px;
        right: -4px;
        background: #c0392b;
        color: #fff;
        border-radius: 50%;
        font-size: 11px;
        font-weight: bold;
        width: 18px;
        height: 18px;
        display: none;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
      "></span>
    `;
    iconWrap.addEventListener("click", openDrawer);
    document.body.appendChild(iconWrap);
  }

  function renderBadge() {
    const badge = document.getElementById("alpha-cart-badge");
    if (!badge) return;
    const count = cartTotalCount();
    if (count > 0) {
      badge.style.display = "flex";
      badge.textContent = count;
    } else {
      badge.style.display = "none";
    }
  }

  // ---------- UI: drawer ----------

  function injectDrawer() {
    if (document.getElementById("alpha-cart-drawer")) return;

    const overlay = document.createElement("div");
    overlay.id = "alpha-cart-overlay";
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      display: none; z-index: 9999;
    `;
    overlay.addEventListener("click", closeDrawer);

    const drawer = document.createElement("div");
    drawer.id = "alpha-cart-drawer";
    drawer.style.cssText = `
      position: fixed; top: 0; right: -420px; width: 380px; max-width: 90vw;
      height: 100%; background: #fff; z-index: 10000;
      box-shadow: -4px 0 16px rgba(0,0,0,0.2);
      transition: right 0.3s ease;
      display: flex; flex-direction: column;
      font-family: Arial, sans-serif;
    `;
    drawer.innerHTML = `
      <div style="padding: 20px; border-bottom: 1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0; font-size: 18px;">Your Cart</h3>
        <button id="alpha-cart-close" style="background:none;border:none;font-size:22px;cursor:pointer;line-height:1;">&times;</button>
      </div>
      <div id="alpha-cart-items" style="flex:1; overflow-y:auto; padding: 16px 20px;"></div>
      <div style="padding: 20px; border-top: 1px solid #eee;">
        <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-weight:bold;">
          <span>Total</span>
          <span id="alpha-cart-total">$0.00</span>
        </div>
        <button id="alpha-cart-checkout" style="
          width:100%; padding: 14px; background:#111; color:#fff;
          border:none; border-radius:6px; font-size:15px; cursor:pointer;
        ">Checkout</button>
        <p style="font-size:11px; color:#888; margin-top:10px; text-align:center;">
          Secure checkout powered by Stripe
        </p>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    document.getElementById("alpha-cart-close").addEventListener("click", closeDrawer);
    document.getElementById("alpha-cart-checkout").addEventListener("click", startCheckout);
  }

  function openDrawer() {
    document.getElementById("alpha-cart-overlay").style.display = "block";
    document.getElementById("alpha-cart-drawer").style.right = "0";
  }

  function closeDrawer() {
    document.getElementById("alpha-cart-overlay").style.display = "none";
    document.getElementById("alpha-cart-drawer").style.right = "-420px";
  }

  function parsePriceDisplay(priceDisplay) {
    // Pulls the first dollar figure out of strings like "$750" or "$10/unit"
    const match = priceDisplay.match(/\$([\d,.]+)/);
    return match ? parseFloat(match[1].replace(/,/g, "")) : 0;
  }

  function renderDrawer() {
    const container = document.getElementById("alpha-cart-items");
    const totalEl = document.getElementById("alpha-cart-total");
    if (!container || !totalEl) return;

    const cart = getCart();
    if (cart.length === 0) {
      container.innerHTML = `<p style="color:#888;">Your cart is empty.</p>`;
      totalEl.textContent = "$0.00";
      return;
    }

    let total = 0;
    container.innerHTML = cart
      .map((item) => {
        const product = findProduct(item.id);
        if (!product) return "";
        const unitPrice = parsePriceDisplay(product.priceDisplay);
        const lineTotal = unitPrice * item.quantity;
        total += lineTotal;
        const qtyLabel = product.unitBased ? "units" : "qty";
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid #f0f0f0;">
            <div style="flex:1;">
              <div style="font-size:14px; font-weight:600;">${product.name}</div>
              <div style="font-size:12px; color:#888;">${product.priceDisplay}</div>
              <div style="margin-top:6px; display:flex; align-items:center; gap:6px;">
                <label style="font-size:12px; color:#555;">${qtyLabel}:</label>
                <input type="number" min="1" value="${item.quantity}"
                  data-product-id="${product.id}"
                  class="alpha-cart-qty-input"
                  style="width:50px; padding:2px 4px; font-size:12px;" />
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:14px; font-weight:600;">$${lineTotal.toFixed(2)}</div>
              <button data-product-id="${product.id}" class="alpha-cart-remove"
                style="margin-top:6px; background:none; border:none; color:#c0392b; font-size:12px; cursor:pointer; text-decoration:underline;">
                Remove
              </button>
            </div>
          </div>
        `;
      })
      .join("");

    totalEl.textContent = `$${total.toFixed(2)}`;

    container.querySelectorAll(".alpha-cart-remove").forEach((btn) => {
      btn.addEventListener("click", () => removeFromCart(btn.dataset.productId));
    });
    container.querySelectorAll(".alpha-cart-qty-input").forEach((input) => {
      input.addEventListener("change", () =>
        updateQuantity(input.dataset.productId, input.value)
      );
    });
  }

  // ---------- Checkout ----------

  async function startCheckout() {
    const cart = getCart();
    if (cart.length === 0) return;

    const lineItems = cart.map((item) => {
      const product = findProduct(item.id);
      return { priceId: product.priceId, quantity: item.quantity };
    });

    const checkoutBtn = document.getElementById("alpha-cart-checkout");
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Redirecting to secure checkout…";

    try {
      const response = await fetch(CHECKOUT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems }),
      });

      if (!response.ok) {
        throw new Error(`Checkout session failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong starting checkout. Please try again or call (470) 610-4550.");
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = "Checkout";
    }
  }

  // ---------- Wire up "Add to Cart" buttons already on the page ----------

  function wireAddToCartButtons() {
    document.querySelectorAll(".alpha-add-to-cart").forEach((btn) => {
      if (btn.dataset.wired) return;
      btn.dataset.wired = "true";
      btn.addEventListener("click", () => {
        const productId = btn.dataset.productId;
        const qtyInput = document.querySelector(
          `.alpha-qty-input[data-product-id="${productId}"]`
        );
        const quantity = qtyInput ? qtyInput.value : 1;
        addToCart(productId, quantity);
      });
    });
  }

  // ---------- Init ----------

  document.addEventListener("DOMContentLoaded", function () {
    injectButtonStyles();
    injectCartIcon();
    injectDrawer();
    renderBadge();
    renderDrawer();
    wireAddToCartButtons();
  });

  // Expose for pages that add buttons dynamically
  window.AlphaCart = {
    addToCart,
    removeFromCart,
    updateQuantity,
    wireAddToCartButtons,
    openDrawer,
    closeDrawer,
  };
})();
