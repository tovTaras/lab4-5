import {
  getInputValues,
  clearInputs,
  renderItemsList,
  sortItems,
  countMaxSpeedOfCars,
  EDIT_BUTTON_PREFIX,
  DELETE_BUTTON_PREFIX
} from "./dom_util.js";

import {
  getAllCars,
  postCar,
  editCar,
  deleteCar,
} from "./api.js";


const submitButton = document.getElementById("submit_button");
const findButton = document.getElementById("find_button");
const cancelFindButton = document.getElementById("cancel_find_button");
const findInput = document.getElementById("find_input");
const sortProperty = document.getElementById("property_sorting");
const sortButton = document.getElementById("sort_button");
const totalValues = document.getElementById("property_total_value");

const nameInput = document.getElementById("name_input");
const max_speedInput = document.getElementById("max_speed_input");
const millageInput = document.getElementById("millage_input");

let cars = [];

const onEdit = async (e) => {
  const itemId = e.target.id.replace(EDIT_BUTTON_PREFIX, "");
  const { name, max_speed, millage } = getInputValues();

  clearInputs();

  editCar(itemId, { name, max_speed, millage }).then(refetchAllCars);
};

const onDelete = (element) => {
  const id = element.target.id.replace(DELETE_BUTTON_PREFIX, "");
  deleteCar(id).then(refetchAllCars);
};

const refetchAllCars = async () => {
  const Allcars = await getAllCars();

  cars = Allcars;
  renderItemsList(cars, onEdit, onDelete);
};

submitButton.addEventListener("click", (event) => {
  event.preventDefault();

  let invalidSymbols = ["`", "?", "!", ";", "#", "@", "%", "~", "&", "$", "№", "<", ">", "/", "\\", "*", "₴"];
  if (nameInput.value == 0) {
    alert("Insert car name")
  }
  else if (max_speedInput.value == 0) {
    alert("Insert car max speed")
  }
  else if (millageInput.value == 0) {
    alert("Insert millage of your car")
  }
  else if (invalidSymbols.some(symbol => nameInput.value.includes(symbol))) {
    alert("Car name contains unallowed symbols")
  }
  else if (isNaN(max_speedInput.value)) {
    alert("Max speed - should be a number");
  }
  else if (isNaN(millageInput.value)) {
    alert("Millage should be a number");
  }
  else {
    const { name, max_speed, millage } = getInputValues();
    clearInputs();
    postCar({
      name,
      max_speed,
      millage,
    }).then(refetchAllCars);
  }
});

findButton.addEventListener("click", () => {
  const foundcars = cars.filter(car => car.name.search(findInput.value) !== -1);
  renderItemsList(foundcars, onEdit, onDelete);
});

cancelFindButton.addEventListener("click", () => {
  renderItemsList(cars, onEdit, onDelete);
  findInput.value = "";
});

sortProperty.addEventListener("change", () => {
  sortItems({ cars, property: sortProperty.value });
});

sortButton.addEventListener("click", () => {
  cars = cars.reverse();
  renderItemsList(cars, onEdit, onDelete);
});

totalValues.addEventListener("change", () => {
  countMaxSpeedOfCars({ cars, property: totalValues.value })
});


refetchAllCars();
 

  