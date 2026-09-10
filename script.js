/* =================================
   PAGE NAVIGATION
   ================================= */

function showPage(pageId, button) {

  // Hide all pages
  const pages = document.querySelectorAll(".page");

  pages.forEach(function(page) {
    page.classList.remove("active-page");
  });


  // Show selected page
  const selectedPage = document.getElementById(pageId);

  if (selectedPage) {
    selectedPage.classList.add("active-page");
  }


  // Remove active from all buttons
  const buttons = document.querySelectorAll(".nav-btn");

  buttons.forEach(function(btn) {
    btn.classList.remove("active");
  });


  // Add active to clicked button
  if (button) {
    button.classList.add("active");
  }


  // Change page title
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
}



/* =================================
   ACCEPT ORDER
   ================================= */

function acceptOrder(button) {

  button.innerText = "Accepted";

  button.disabled = true;

  button.style.opacity = "0.5";

}



/* =================================
   ADD MENU ITEM
   ================================= */

function addMenuItem() {

  const name = prompt("Food item name:");

  if (!name) {
    return;
  }


  const price = prompt("Food price:");

  if (!price) {
    return;
  }


  const menuList = document.getElementById("menuList");


  const item = document.createElement("div");

  item.className = "menu-item";


  item.innerHTML = `

    <div>

      <h3>${name}</h3>

      <p>₹${price}</p>

    </div>

    <button class="small-btn">
      Edit
    </button>

  `;


  menuList.appendChild(item);

}



/* =================================
   LOGOUT
   ================================= */

function logout() {

  const confirmLogout =
    confirm("Are you sure you want to logout?");


  if (confirmLogout) {

    alert("Logout system will be connected later.");

  }

}



/* =================================
   PAYMENT PLACEHOLDER
   =================================

   # PAYMENT

   Future payment system code
   will be added here.

   Example future logic:

   1. Check table order
   2. Calculate bill
   3. Enable payment
   4. Verify payment
   5. Mark order as paid

================================= */
