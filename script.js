let menu = JSON.parse(
  localStorage.getItem("restaurantMenu")
) || [
  {
    id: 1,
    name: "Cheese Pizza",
    price: 199,
    category: "pizza",
    emoji: "🍕"
  },
  {
    id: 2,
    name: "Classic Burger",
    price: 99,
    category: "burger",
    emoji: "🍔"
  },
  {
    id: 3,
    name: "Veg Noodles",
    price: 129,
    category: "chinese",
    emoji: "🍜"
  },
  {
    id: 4,
    name: "Cold Drink",
    price: 49,
    category: "drinks",
    emoji: "🥤"
  }
];


let cart = [];

let editingFoodId = null;


/* SAVE MENU */

function saveMenu() {

  localStorage.setItem(
    "restaurantMenu",
    JSON.stringify(menu)
  );

}


/* DISPLAY MENU */

function displayMenu(category = "all") {

  const foodGrid =
    document.getElementById("foodGrid");

  foodGrid.innerHTML = "";

  const foods = menu.filter(food => {

    return (
      category === "all" ||
      food.category === category
    );

  });


  if (foods.length === 0) {

    foodGrid.innerHTML =
      '<div class="cart-empty">Food nahi mila.</div>';

    return;

  }


  foods.forEach(food => {

    const card =
      document.createElement("div");

    card.className = "food-card";

    card.innerHTML = `

      <div class="food-image">
        ${food.emoji}
      </div>

      <h3>${escapeHTML(food.name)}</h3>

      <p>${food.category}</p>

      <div class="food-price">
        ₹${food.price}
      </div>

      <button
        class="add-cart"
        data-id="${food.id}">
        Add to Cart
      </button>

    `;

    foodGrid.appendChild(card);

  });


  document
    .querySelectorAll(".add-cart")
    .forEach(button => {

      button.addEventListener(
        "click",
        function() {

          const id =
            Number(this.dataset.id);

          addToCart(id);

        }
      );

    });

}


/* ADD CART */

function addToCart(id) {

  const food =
    menu.find(item => item.id === id);

  if (!food) return;


  const existing =
    cart.find(item => item.id === id);


  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      ...food,
      quantity: 1
    });

  }


  updateCart();

}


/* CART */

function updateCart() {

  const cartItems =
    document.getElementById("cartItems");

  const cartTotal =
    document.getElementById("cartTotal");

  const cartCount =
    document.getElementById("cartCount");


  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;


  if (cart.length === 0) {

    cartItems.innerHTML =
      '<div class="cart-empty">Cart abhi empty hai 🛒</div>';

  }


  cart.forEach((item, index) => {

    total +=
      item.price * item.quantity;

    count += item.quantity;


    const row =
      document.createElement("div");

    row.className = "cart-item";


    row.innerHTML = `

      <div>

        <strong>
          ${item.emoji}
          ${escapeHTML(item.name)}
        </strong>

        <div>
          ₹${item.price} × ${item.quantity}
        </div>

      </div>

      <div class="cart-controls">

        <button
          onclick="changeQuantity(${index}, -1)">
          −
        </button>

        <strong>
          ${item.quantity}
        </strong>

        <button
          onclick="changeQuantity(${index}, 1)">
          +
        </button>

        <button
          onclick="removeCartItem(${index})">
          ✕
        </button>

      </div>

    `;


    cartItems.appendChild(row);

  });


  cartTotal.textContent = total;
  cartCount.textContent = count;

}


/* QUANTITY */

function changeQuantity(index, amount) {

  cart[index].quantity += amount;


  if (cart[index].quantity <= 0) {

    cart.splice(index, 1);

  }


  updateCart();
const urlParams =
  new URLSearchParams(window.location.search);

const tableNumber =
  urlParams.get("table");

if (tableNumber) {

  localStorage.setItem(
    "currentTable",
    tableNumber
  );

  alert(
    "Welcome! Table " +
    tableNumber +
    " selected."
  );

}
}


/* REMOVE */

function removeCartItem(index) {

  cart.splice(index, 1);

  updateCart();

}


/* CATEGORY */

document
  .querySelectorAll(".category")
  .forEach(button => {

    button.addEventListener(
      "click",
      function() {

        document
          .querySelectorAll(".category")
          .forEach(btn => {

            btn.classList.remove("active");

          });


        this.classList.add("active");


        displayMenu(
          this.dataset.category
        );

      }
    );

  });


/* EXPLORE */

document
  .getElementById("exploreBtn")
  .addEventListener(
    "click",
    function() {

      document
        .getElementById("menu")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );


/* CART BUTTON */

document
  .getElementById("cartBtn")
  .addEventListener(
    "click",
    function() {

      document
        .getElementById("cartSection")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );


/* ORDER */

document
  .getElementById("orderBtn")
  .addEventListener(
    "click",
    function() {

      if (cart.length === 0) {

        alert(
          "Pehle cart me food add karo."
        );

        return;

      }


      let total = 0;

      cart.forEach(item => {

        total +=
          item.price * item.quantity;

      });


      alert(
        "Order ready hai! Total ₹" +
        total +
        ". Real order system next backend stage me connect hoga."
      );

    }
  );


/* OWNER LOGIN */

const ownerLogin =
  document.getElementById("ownerLogin");


document
  .getElementById("ownerLoginBtn")
  .addEventListener(
    "click",
    function() {

      ownerLogin.classList.remove(
        "hidden"
      );

    }
  );


document
  .getElementById("closeLoginBtn")
  .addEventListener(
    "click",
    function() {

      ownerLogin.classList.add(
        "hidden"
      );

    }
  );


document
  .getElementById("loginBtn")
  .addEventListener(
    "click",
    function() {

      const phone =
        document
          .getElementById("ownerPhone")
          .value
          .trim();


      const password =
        document
          .getElementById("ownerPassword")
          .value
          .trim();


      if (phone.length < 10) {

        alert(
          "Valid phone number dalo."
        );

        return;

      }


      if (password.length < 4) {

        alert(
          "Password kam se kam 4 characters ka hona chahiye."
        );

        return;

      }


      ownerLogin.classList.add(
        "hidden"
      );


      document
        .getElementById("ownerPanel")
        .classList.remove(
          "hidden"
        );


      document
        .getElementById("ownerPanel")
        .scrollIntoView({
          behavior: "smooth"
        });


      loadEditor();

    }
  );


/* EDIT MENU */

document
  .getElementById("editMenuBtn")
  .addEventListener(
    "click",
    function() {

      const editor =
        document.getElementById(
          "menuEditor"
        );

      editor.classList.toggle(
        "hidden"
      );


      if (
        !editor.classList.contains(
          "hidden"
        )
      ) {

        loadEditor();

      }

    }
  );


/* ADD FOOD BUTTONS */

document
  .getElementById("addFoodBtn")
  .addEventListener(
    "click",
    openAddFood
  );


document
  .getElementById("openAddFoodBtn")
  .addEventListener(
    "click",
    openAddFood
  );


function openAddFood() {

  editingFoodId = null;


  document
    .getElementById("foodModalTitle")
    .textContent =
    "Add New Food";


  document
    .getElementById("foodName")
    .value = "";


  document
    .getElementById("foodPrice")
    .value = "";


  document
    .getElementById("foodCategory")
    .value = "pizza";


  document
    .getElementById("foodEmoji")
    .value = "🍕";


  document
    .getElementById("foodModal")
    .classList.remove(
      "hidden"
    );

}


/* CLOSE MODAL */

document
  .getElementById("closeFoodModal")
  .addEventListener(
    "click",
    function() {

      document
        .getElementById("foodModal")
        .classList.add(
          "hidden"
        );

    }
  );


/* SAVE FOOD */

document
  .getElementById("saveFoodBtn")
  .addEventListener(
    "click",
    function() {

      const name =
        document
          .getElementById("foodName")
          .value
          .trim();


      const price =
        Number(
          document
            .getElementById("foodPrice")
            .value
        );


      const category =
        document
          .getElementById("foodCategory")
          .value;


      const emoji =
        document
          .getElementById("foodEmoji")
          .value;


      if (!name) {

        alert(
          "Food name dalo."
        );

        return;

      }


      if (!price || price <= 0) {

        alert(
          "Valid price dalo."
        );

        return;

      }


      if (editingFoodId !== null) {

        const food =
          menu.find(
            item =>
              item.id === editingFoodId
          );


        if (food) {

          food.name = name;
          food.price = price;
          food.category = category;
          food.emoji = emoji;

        }

      } else {

        menu.push({

          id: Date.now(),

          name: name,

          price: price,

          category: category,

          emoji: emoji

        });

      }


      saveMenu();

      displayMenu();

      loadEditor();


      document
        .getElementById("foodModal")
        .classList.add(
          "hidden"
        );


      alert(
        "Food successfully save ho gaya ✅"
      );

    }
  );


/* EDITOR */

function loadEditor() {

  const list =
    document.getElementById(
      "editorFoodList"
    );


  list.innerHTML = "";


  if (menu.length === 0) {

    list.innerHTML =
      '<div class="cart-empty">Menu empty hai.</div>';

    return;

  }


  menu.forEach(food => {

    const row =
      document.createElement("div");


    row.className =
      "editor-item";


    row.innerHTML = `

      <input
        value="${escapeHTML(food.name)}"
        id="edit-name-${food.id}">

      <input
        type="number"
        value="${food.price}"
        id="edit-price-${food.id}">

      <select
        id="edit-category-${food.id}">

        <option value="pizza"
          ${food.category === "pizza" ? "selected" : ""}>
          Pizza
        </option>

        <option value="burger"
          ${food.category === "burger" ? "selected" : ""}>
          Burger
        </option>

        <option value="chinese"
          ${food.category === "chinese" ? "selected" : ""}>
          Chinese
        </option>

        <option value="drinks"
          ${food.category === "drinks" ? "selected" : ""}>
          Drinks
        </option>

      </select>

      <button
        class="editor-save"
        onclick="saveEditorFood(${food.id})">
        Save
      </button>

      <button
        class="editor-delete"
        onclick="deleteFood(${food.id})">
        Delete
      </button>

    `;


    list.appendChild(row);

  });

}


/* SAVE EDITED FOOD */

function saveEditorFood(id) {

  const food =
    menu.find(
      item => item.id === id
    );


  if (!food) return;


  const name =
    document
      .getElementById(
        `edit-name-${id}`
      )
      .value
      .trim();


  const price =
    Number(
      document
        .getElementById(
          `edit-price-${id}`
        )
        .value
    );


  const category =
    document
      .getElementById(
        `edit-category-${id}`
      )
      .value;


  if (!name) {

    alert(
      "Food name dalo."
    );

    return;

  }


  if (!price || price <= 0) {

    alert(
      "Valid price dalo."
    );

    return;

  }


  food.name = name;
  food.price = price;
  food.category = category;


  saveMenu();

  displayMenu();

  loadEditor();


  alert(
    "Food update ho gaya ✅"
  );

}


/* DELETE FOOD */

function deleteFood(id) {

  const food =
    menu.find(
      item => item.id === id
    );


  if (!food) return;


  const confirmDelete =
    confirm(
      food.name +
      " ko delete karna hai?"
    );


  if (!confirmDelete) return;


  menu =
    menu.filter(
      item => item.id !== id
    );


  saveMenu();

  displayMenu();

  loadEditor();


  alert(
    "Food delete ho gaya."
  );

}


/* QR MANAGEMENT */

document
  .getElementById("qrManagementBtn")
  .addEventListener(
    "click",
    function() {

      const box =
        document.getElementById(
          "qrManagement"
        );


      box.classList.toggle(
        "hidden"
      );


      if (
        !box.classList.contains(
          "hidden"
        )
      ) {

        createTables();

      }

    }
  );


function createTables() {

  const list =
    document.getElementById("tableQRList");

  list.innerHTML = "";

  for (let i = 1; i <= 50; i++) {

    const table =
      document.createElement("div");

    table.className = "qr-table";

    table.innerHTML = `

      <strong>Table ${i}</strong>

      <div class="qr-icon">
        📱
      </div>

      <small>
        Table-${i}
      </small>

      <br>

      <button onclick="showQR(${i})">
        Generate QR
      </button>

    `;

    list.appendChild(table);

  }

}


function showQR(tableNumber) {

  const baseURL =
    window.location.origin +
    window.location.pathname;

  const tableURL =
    baseURL +
    "?table=" +
    tableNumber;

  const qrURL =
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
    encodeURIComponent(tableURL);


  const popup =
    document.createElement("div");

  popup.className = "modal";

  popup.innerHTML = `

    <div class="modal-box qr-popup">

      <button
        class="close-btn"
        onclick="this.parentElement.parentElement.remove()">
        ✕
      </button>

      <h2>Table ${tableNumber} QR</h2>

      <p>
        Is QR ko scan karne par
        Table ${tableNumber} open hoga.
      </p>

      <img
        src="${qrURL}"
        alt="Table ${tableNumber} QR"
        class="real-qr">

      <br>

      <button
        class="main-btn"
        onclick="window.open('${qrURL}', '_blank')">
        Open QR
      </button>

      <button
        class="main-btn"
        onclick="printQR(${tableNumber}, '${qrURL}')">
        Print QR
      </button>

    </div>

  `;

  document.body.appendChild(popup);

}


function printQR(tableNumber, qrURL) {

  const printWindow =
    window.open("", "_blank");

  printWindow.document.write(`

    <html>

      <head>

        <title>
          Table ${tableNumber} QR
        </title>

        <style>

          body {
            text-align: center;
            font-family: Arial;
            padding: 40px;
          }

          img {
            width: 300px;
          }

          h1 {
            margin-bottom: 20px;
          }

        </style>

      </head>

      <body>

        <h1>
          Table ${tableNumber}
        </h1>

        <img src="${qrURL}">

        <p>
          Scan to Order
        </p>

        <script>
          window.onload = function() {
            window.print();
          };
        <\/script>

      </body>

    </html>

  `);

  printWindow.document.close();

}