"use strict";

// Selecting all our project elements so we can manipulate the DOM and change the UI.
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const money_minus = document.getElementById("money-minus");

// Getting our data in advance from the locale storage that we will set later in our project.
const localStorageTransations = JSON.parse(localStorage.getItem("transations"));

let transations =
  localStorage.getItem("transations") !== null ? localStorageTransations : [];

// Our main function that we use when we add a new transaction.
function addTransation(e) {
  e.preventDefault();

  // Some input validations and updates on the UI.
  if (text.value.trim() === "" || amount.value.trim() === "") {
    text.placeholder = "please add a text";

    text.style.backgroundColor = "#ccc";

    amount.placeholder = "please add amount";

    amount.style.backgroundColor = "#ccc";
  } else {
    // creating our main object so that later we can fill it with the data that the user input.
    const transation = {
      id: genenrateID(),

      text: text.value,

      amount: +amount.value,
    };

    // Then we push that object inside an array(our local storage in the browser).
    transations.push(transation);

    // Pass it as an argument to the function that will inject all the data that the user input to the DOM and change the UI.
    addTransationDOM(transation);

    // Calling the update values function in order to restart our calculations again.
    updateValues();

    // Update the locale storage with the new received data.
    updateLocalStorage();

    // Setting our inputs back to zero after submitting a new transaction.
    text.value = "";

    amount.value = "";
  }
}

// Simple function to generate an ID to every transaction that we make in this app.
function genenrateID() {
  return Math.floor(Math.random() * 100000000);
}

// Our main function that will update the DOM(UI) everytime after we submit a new transaction.
function addTransationDOM(transation) {
  const item = document.createElement("li");

  item.classList.add(transation.amount < 0 ? "minus" : "plus");

  item.innerHTML = ` <span> ${
    transation.text.trim().split("")[0].toUpperCase() +
    transation.text.trim().slice(1).toLowerCase()
  } </span> <span class="value"> ${Math.abs(
    transation.amount
  )} </span> <button class="delete-btn" onclick="removeTransation(${
    transation.id
  })"> <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
</svg> </button>`;
  list.appendChild(item);
}

// This function is responsible for doing all the calculations and the main logic of the app.
function updateValues() {
  const amounts = transations.map((transation) => transation.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `$${total}`;

  money_plus.innerText = `$${income}`;

  money_minus.innerText = `$${expense}`;
}

// Our function that we call when we want to remove on of the transaction from our list.
function removeTransation(id) {
  // We first filter our transations and remove the one that we clicked on.
  transations = transations.filter((transation) => transation.id !== id);

  // then we update local storage with the new updated data.
  updateLocalStorage();

  // and call the init function.
  init();
}

// The function that we set to create our local storage and then update it.
function updateLocalStorage() {
  localStorage.setItem("transations", JSON.stringify(transations));
}

// Our main initial function that we call when we start the app for the first time or when the user remove a transaction.
function init() {
  list.innerHTML = "";

  transations.forEach(addTransationDOM);

  updateValues();
}
init();

// Our main trigger function call to start the whole thing when the user add a new transation.
form.addEventListener("submit", addTransation);
