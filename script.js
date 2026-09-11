/* =========================================================
   FOODIE RESTAURANT SYSTEM
   Frontend prototype with localStorage.
   ========================================================= */

const STORAGE = {
  user: "foodie_user",
  session: "foodie_session",
  menu: "foodie_menu",
  profile: "foodie_profile",
  settings: "foodie_settings"
};

let editingMenuId = null;
let currentTable = null;
let pendingOtp = null;


/* =========================================================
   STARTUP
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  initializeData();

  if (localStorage.getItem(STORAGE.session) === "true") {
    openDashboard();
  } else {
    showAuthBox("loginBox");
  }
});


function initializeData() {
  if (!localStorage.getItem(STORAGE.menu)) {
    const defaultMenu = [
      {
        id: Date.now() + 1,
        name: "Paneer Pizza",
        price: 240,
        image: ""
      },
      {
        id: Date.now() + 2,
        name: "Veg Burger",
        price: 120,
        image: ""
      },
      {
        id: Date.now() + 3,
        name: "French Fries",
        price: 90,
        image: ""
      }
    ];

    saveMenu(defaultMenu);
  }

  if (!localStorage.getItem(STORAGE.profile)) {
    saveProfileData({
      name: "TADVI PIYUSH",
      restaurant: "Foodie Restaurant"
    });
  }

  if (!localStorage.getItem(STORAGE.settings)) {
    localStorage.setItem(
      STORAGE.settings,
      JSON.stringify({
        notifications: true,
        open: true
      })
    );
  }
}


/* =========================================================
   AUTH
   ========================================================= */

function showAuthBox(id) {
  document.querySelectorAll(".auth-box").forEach(function (box) {
    box.classList.add("hidden");
  });

  const box = document.getElementById(id);
  if (box) box.classList.remove("hidden");

  clearAuthMessage();

  if (id === "forgotBox") {
    document.getElementById("forgotStep1").classList.remove("hidden");
    document.getElementById("forgotStep2").classList.add("hidden");
  }
}


function setAuthMessage(message) {
  document.getElementById("authMessage").innerText = message;
}


function clearAuthMessage() {
  document.getElementById("authMessage").innerText = "";
}


function cleanMobile(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 10);
}


function validMobile(value) {
  return /^\d{10}$/.test(value);
}


function registerUser() {
  const name = document.getElementById("regName").value.trim();
  const mobile = cleanMobile(document.getElementById("regMobile").value);
  const password = document.getElementById("regPassword").value;
  const password2 = document.getElementById("regPassword2").value;

  if (!name) {
    setAuthMessage("Please enter your name.");
    return;
  }

  if (!validMobile(mobile)) {
    setAuthMessage("Enter a valid 10-digit mobile number.");
    return;
  }

  if (password.length < 4) {
    setAuthMessage("Password must be at least 4 characters.");
    return;
  }

  if (password !== password2) {
    setAuthMessage("Passwords do not match.");
    return;
  }

  const existing = JSON.parse(localStorage.getItem(STORAGE.user) || "null");

  if (existing && existing.mobile === mobile) {
    setAuthMessage("This mobile number is already registered. Please login.");
    return;
  }

  const user = {
    name: name,
    mobile: mobile,
    password: password
  };

  localStorage.setItem(STORAGE.user, JSON.stringify(user));

  saveProfileData({
    name: name,
    restaurant: "Foodie Restaurant"
  });

  setAuthMessage("Account created successfully. You can login now.");
  showAuthBox("loginBox");

  document.getElementById("loginMobile").value = mobile;
}


function loginUser() {
  const mobile = cleanMobile(document.getElementById("loginMobile").value);
  const password = document.getElementById("loginPassword").value;

  const user = JSON.parse(localStorage.getItem(STORAGE.user) || "null");

  if (!validMobile(mobile)) {
    setAuthMessage("Enter your 10-digit mobile number.");
    return;
  }

  if (!user) {
    setAuthMessage("No account found. Please register first.");
    return;
  }

  if (user.mobile !== mobile || user.password !== password) {
    setAuthMessage("Mobile number or password is incorrect.");
    return;
  }

  localStorage.setItem(STORAGE.session, "true");
  openDashboard();
}


function sendOtp() {
  const mobile = cleanMobile(document.getElementById("forgotMobile").value);
  const user = JSON.parse(localStorage.getItem(STORAGE.user) || "null");

  if (!validMobile(mobile)) {
    setAuthMessage("Enter your registered 10-digit mobile number.");
    return;
  }

  if (!user || user.mobile !== mobile) {
    setAuthMessage("This mobile number is not registered.");
    return;
  }

  /* DEMO ONLY:
     A real app must send OTP through a backend/SMS provider.
  */
  pendingOtp = String(Math.floor(100000 + Math.random() * 900000));

  document.getElementById("forgotStep1").classList.add("hidden");
  document.getElementById("forgotStep2").classList.remove("hidden");

  document.getElementById("otpHint").innerText =
    "Demo OTP: " + pendingOtp + " (real SMS OTP will be connected later).";

  setAuthMessage("OTP generated for this demo.");
}


function resetPassword() {
  const otp = document.getElementById("otpInput").value.trim();
  const newPassword = document.getElementById("newPassword").value;

  if (!pendingOtp || otp !== pendingOtp) {
    setAuthMessage("Incorrect OTP.");
    return;
  }

  if (newPassword.length < 4) {
    setAuthMessage("New password must be at least 4 characters.");
    return;
  }

  const user = JSON.parse(localStorage.getItem(STORAGE.user) || "null");

  if (!user) {
    setAuthMessage("Account not found.");
    return;
  }

  user.password = newPassword;

  localStorage.setItem(STORAGE.user, JSON.stringify(user));

  pendingOtp = null;

  showAuthBox("loginBox");
  document.getElementById("loginMobile").value = user.mobile;
  document.getElementById("loginPassword").value = "";

  setAuthMessage("Password changed successfully. Please login.");
}


function demoGoogleLogin() {
  setAuthMessage("Google login is a UI placeholder. Real Google authentication needs backend/API setup.");
}


function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);

  if (input.type === "password") {
    input.type = "text";
    button.innerText = "◉";
  } else {
    input.type = "password";
    button.innerText = "◉";
  }
}


/* =========================================================
   DASHBOARD
   ========================================================= */

function openDashboard() {
  document.getElementById("authScreen").classList.add("hidden");
  document.getElementById("appScreen").classList.remove("hidden");

  loadProfileUI();
  renderMenu();
  renderOrders();
  renderTables();
  loadSettingsUI();
}


function logout() {
  if (!confirm("Are you sure you want to logout?")) return;

  localStorage.removeItem(STORAGE.session);

  document.getElementById("appScreen").classList.add("hidden");
  document.getElementById("authScreen").classList.remove("hidden");

  showAuthBox("loginBox");
}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(pageId, button) {
  document.querySelectorAll(".page").forEach(function (page) {
    page.classList.remove("active-page");
  });

  const selectedPage = document.getElementById(pageId);

  if (selectedPage) {
    selectedPage.classList.add("active-page");
  }

  document.querySelectorAll(".nav-btn").forEach(function (btn) {
    btn.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  }

  const titles = {
    home: "Dashboard",
    orders: "Live Orders",
    menu: "Menu Edit",
    qr: "QR Management",
    settings: "Settings",
    profile: "My Profile"
  };

  document.getElementById("pageTitle").innerText =
    titles[pageId] || "Dashboard";

  if (pageId === "menu") renderMenu();
  if (pageId === "orders") renderOrders();
  if (pageId === "qr") renderTables();
}


/* =========================================================
   ORDERS
   ========================================================= */

function getOrders() {
  return [
    {
      id: 1,
      table: "Table 01",
      items: ["2 × Paneer Pizza", "1 × Cold Drink"],
      total: 480,
      status: "Pending"
    },
    {
      id: 2,
      table: "Table 05",
      items: ["1 × Veg Burger", "2 × French Fries"],
      total: 300,
      status: "Pending"
    }
  ];
}


function renderOrders() {
  const list = document.getElementById("ordersList");
  if (!list) return;

  const orders = getOrders();

  list.innerHTML = orders.map(function (order) {
    const items = order.items.map(function (item) {
      return "<p>" + escapeHTML(item) + "</p>";
    }).join("");

    return `
      <div class="order">
        <div>
          <h3>${escapeHTML(order.table)}</h3>
          ${items}
        </div>

        <div class="order-right">
          <strong>₹${order.total}</strong>
          <button class="accept" onclick="acceptOrder(this)">Accept</button>
          <button class="reject" onclick="rejectOrder(this)">Reject</button>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("orderCount").innerText = orders.length;
}


function acceptOrder(button) {
  button.innerText = "Accepted";
  button.disabled = true;
  button.style.opacity = "0.5";
}


function rejectOrder(button) {
  const order = button.closest(".order");

  if (order) {
    order.style.opacity = "0.4";
    order.querySelector(".accept").disabled = true;
    button.innerText = "Rejected";
    button.disabled = true;
  }
}


/* =========================================================
   MENU
   ========================================================= */

function getMenu() {
  return JSON.parse(localStorage.getItem(STORAGE.menu) || "[]");
}


function saveMenu(menu) {
  localStorage.setItem(STORAGE.menu, JSON.stringify(menu));
}


function renderMenu() {
  const list = document.getElementById("menuList");
  if (!list) return;

  const menu = getMenu();

  document.getElementById("menuCount").innerText = menu.length;

  if (menu.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        No food items yet. Click "+ Add Item".
      </div>
    `;
    return;
  }

  list.innerHTML = menu.map(function (item) {
    const image = item.image
      ? item.image
      : "wallpaper.jpg";

    return `
      <div class="menu-item">
        <img class="menu-photo" src="${escapeAttribute(image)}" alt="Food">

        <div>
          <h3>${escapeHTML(item.name)}</h3>
          <p>₹${Number(item.price).toFixed(0)}</p>
        </div>

        <div class="menu-actions">
          <button class="small-btn" onclick="editMenuItem(${item.id})">Edit</button>
          <button class="delete-btn" onclick="deleteMenuItem(${item.id})">Delete</button>
        </div>
      </div>
    `;
  }).join("");
}


function addMenuItem() {
  editingMenuId = null;

  document.getElementById("menuModalTitle").innerText = "Add Food Item";
  document.getElementById("foodNameInput").value = "";
  document.getElementById("foodPriceInput").value = "";
  document.getElementById("foodImageInput").value = "";

  openModal("menuModal");
}


function editMenuItem(id) {
  const menu = getMenu();
  const item = menu.find(function (x) {
    return Number(x.id) === Number(id);
  });

  if (!item) return;

  editingMenuId = id;

  document.getElementById("menuModalTitle").innerText = "Edit Food Item";
  document.getElementById("foodNameInput").value = item.name;
  document.getElementById("foodPriceInput").value = item.price;
  document.getElementById("foodImageInput").value = item.image || "";

  openModal("menuModal");
}


function saveMenuItem() {
  const name = document.getElementById("foodNameInput").value.trim();
  const price = Number(document.getElementById("foodPriceInput").value);
  const image = document.getElementById("foodImageInput").value.trim();

  if (!name) {
    alert("Enter food name.");
    return;
  }

  if (!Number.isFinite(price) || price < 0) {
    alert("Enter a valid price.");
    return;
  }

  const menu = getMenu();

  if (editingMenuId === null) {
    menu.push({
      id: Date.now(),
      name: name,
      price: price,
      image: image
    });
  } else {
    const item = menu.find(function (x) {
      return Number(x.id) === Number(editingMenuId);
    });

    if (item) {
      item.name = name;
      item.price = price;
      item.image = image;
    }
  }

  saveMenu(menu);
  closeModal("menuModal");
  renderMenu();
}


function deleteMenuItem(id) {
  if (!confirm("Delete this food item?")) return;

  const menu = getMenu().filter(function (item) {
    return Number(item.id) !== Number(id);
  });

  saveMenu(menu);
  renderMenu();
}


/* =========================================================
   QR TABLES 01 - 50
   ========================================================= */

function getTableLink(tableNumber) {
  const base = window.location.href.split("#")[0];
  return base + "?table=" + tableNumber;
}


function renderTables() {
  const grid = document.getElementById("qrGrid");
  if (!grid) return;

  grid.innerHTML = "";

  for (let i = 1; i <= 50; i++) {
    const tableNumber = String(i).padStart(2, "0");

    const card = document.createElement("div");
    card.className = "qr-card";

    const qr = document.createElement("div");
    qr.className = "qr-mini";
    qr.id = "qr-" + i;

    const title = document.createElement("h3");
    title.innerText = "Table " + tableNumber;

    const button = document.createElement("button");
    button.className = "primary";
    button.innerText = "Manage QR";
    button.onclick = function () {
      openQR(i);
    };

    card.appendChild(qr);
    card.appendChild(title);
    card.appendChild(button);
    grid.appendChild(card);

    if (typeof QRCode !== "undefined") {
      new QRCode(qr, {
        text: getTableLink(i),
        width: 105,
        height: 105,
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      qr.innerText = "QR library loading...";
    }
  }
}


function refreshTables() {
  renderTables();
}


function openQR(tableNumber) {
  currentTable = tableNumber;

  const tableText = "Table " + String(tableNumber).padStart(2, "0");
  const link = getTableLink(tableNumber);

  document.getElementById("qrModalTitle").innerText = tableText;
  document.getElementById("qrModalText").innerText = link;

  const box = document.getElementById("qrCode");
  box.innerHTML = "";

  if (typeof QRCode !== "undefined") {
    new QRCode(box, {
      text: link,
      width: 200,
      height: 200,
      correctLevel: QRCode.CorrectLevel.M
    });
  } else {
    box.innerText = "QR library could not load.";
  }

  openModal("qrModal");
}


function copyTableLink() {
  if (!currentTable) return;

  const link = getTableLink(currentTable);

  navigator.clipboard.writeText(link)
    .then(function () {
      alert("Table link copied.");
    })
    .catch(function () {
      prompt("Copy this table link:", link);
    });
}


function downloadQR() {
  const canvas = document.querySelector("#qrCode canvas");

  if (!canvas) {
    alert("QR is not ready yet.");
    return;
  }

  const tableText = String(currentTable).padStart(2, "0");

  const link = document.createElement("a");
  link.download = "Foodie-Table-" + tableText + "-QR.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}


/* =========================================================
   PROFILE
   ========================================================= */

function getProfileData() {
  return JSON.parse(localStorage.getItem(STORAGE.profile) || "{}");
}


function saveProfileData(profile) {
  localStorage.setItem(STORAGE.profile, JSON.stringify(profile));
}


function loadProfileUI() {
  const user = JSON.parse(localStorage.getItem(STORAGE.user) || "null");
  const profile = getProfileData();

  const name = profile.name || (user ? user.name : "TADVI PIYUSH");
  const restaurant = profile.restaurant || "Foodie Restaurant";
  const mobile = user ? user.mobile : "—";

  document.getElementById("profileName").innerText = name;
  document.getElementById("profileMobile").innerText = "Mobile: " + mobile;
  document.getElementById("profileRestaurant").innerText =
    "Restaurant: " + restaurant;

  document.getElementById("ownerNameTop").innerText = name;

  const firstLetter = name.trim().charAt(0).toUpperCase() || "P";

  document.getElementById("ownerAvatar").innerText = firstLetter;
  document.getElementById("profileAvatar").innerText = firstLetter;

  document.getElementById("settingRestaurantName").innerText = restaurant;
}


function editProfile() {
  const profile = getProfileData();

  document.getElementById("profileNameInput").value =
    profile.name || "";

  document.getElementById("profileRestaurantInput").value =
    profile.restaurant || "Foodie Restaurant";

  openModal("profileModal");
}


function saveProfile() {
  const name = document.getElementById("profileNameInput").value.trim();
  const restaurant =
    document.getElementById("profileRestaurantInput").value.trim();

  if (!name || !restaurant) {
    alert("Please fill both fields.");
    return;
  }

  saveProfileData({
    name: name,
    restaurant: restaurant
  });

  loadProfileUI();
  closeModal("profileModal");
  alert("Profile saved.");
}


function editRestaurantName() {
  const profile = getProfileData();
  const name = prompt("Enter restaurant name:", profile.restaurant || "");

  if (!name || !name.trim()) return;

  profile.restaurant = name.trim();
  saveProfileData(profile);
  loadProfileUI();
}


/* =========================================================
   SETTINGS
   ========================================================= */

function getSettings() {
  return JSON.parse(
    localStorage.getItem(STORAGE.settings) ||
    '{"notifications":true,"open":true}'
  );
}


function saveSettings(settings) {
  localStorage.setItem(STORAGE.settings, JSON.stringify(settings));
}


function loadSettingsUI() {
  const settings = getSettings();

  const notificationBtn = document.getElementById("notificationBtn");
  const statusBtn = document.getElementById("statusBtn");
  const statusText = document.getElementById("restaurantStatusText");

  notificationBtn.innerText = settings.notifications ? "ON" : "OFF";
  notificationBtn.classList.toggle("off", !settings.notifications);

  statusBtn.innerText = settings.open ? "OPEN" : "CLOSED";
  statusBtn.classList.toggle("off", !settings.open);

  statusText.innerText = settings.open ? "OPEN" : "CLOSED";

  loadProfileUI();
}


function toggleNotifications() {
  const settings = getSettings();

  settings.notifications = !settings.notifications;

  saveSettings(settings);
  loadSettingsUI();
}


function toggleRestaurantStatus() {
  const settings = getSettings();

  settings.open = !settings.open;

  saveSettings(settings);
  loadSettingsUI();
}


/* =========================================================
   MODALS
   ========================================================= */

function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}


function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}


document.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.classList.add("hidden");
  }
});


/* =========================================================
   HELPERS
   ========================================================= */

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function escapeAttribute(value) {
  return escapeHTML(value);
}
