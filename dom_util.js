const nameInput = document.getElementById("name_input");
const max_speedInput = document.getElementById("max_speed_input");
const millageInput = document.getElementById("millage_input");
const itemsContainer = document.getElementById("items_container");
const totalValue = document.getElementById("totalValue");

export const EDIT_BUTTON_PREFIX = "edit_button-";
export const DELETE_BUTTON_PREFIX = "delete_button-";

const getItemId = (id) => `item-${id}`;

const itemTemplate = ({ id, name, max_speed, millage }) => `
<div id="${getItemId(id)}" class="card" style="width: 14rem;">
            <div class="card-body">
              <h5 class="card-title">Name: ${name}</h5>
              <p class="card-text">Max Speed: ${max_speed}km/hour</p>
              <p class="card-text">Millage: ${millage}km</p>
              <div class="card-button">
              <button id="${EDIT_BUTTON_PREFIX}${id}" class="edit_button btn btn-primary mt-4">Edit</button>
              <button id="${DELETE_BUTTON_PREFIX}${id}"class=" delete_button btn btn-danger mt-4">Delete</button>
              </div>
            </div>
          </div>`

export const addItemToPage = ({ id, name, max_speed, millage }, onEdit, onDelete) => {
  itemsContainer.insertAdjacentHTML(
    "afterbegin",
    itemTemplate({ id, name, max_speed, millage })
  );

  const editButton = document.getElementById(`${EDIT_BUTTON_PREFIX}${id}`);
  editButton.addEventListener("click", onEdit);

  const deleteButton = document.getElementById(`${DELETE_BUTTON_PREFIX}${id}`);
  deleteButton.addEventListener("click", onDelete);
}

export const clearInputs = () => {
  nameInput.value = "";
  max_speedInput.value = "";
  millageInput.value = "";
}

export const renderItemsList = (items, onEdit, onDelete) => {
  itemsContainer.innerHTML = "";

  for (const item of items) {
    addItemToPage(item, onEdit, onDelete)
  }
};

export const getInputValues = () => {
  return {
    name: nameInput.value,
    max_speed: max_speedInput.value,
    millage: millageInput.value,
  };
};

export const sortItems = ({ cars, property }) => {
  function sortmax_speed(property) {
    if (property == "max_speed") {
      cars.sort((a, b) => b.max_speed - a.max_speed);
    }
  }
  function sortmillage(property) {
    if (property == "millage") {
      cars.sort((a, b) => b.millage - a.millage);
    }
  }

  if (property == "max_speed") {
    sortmax_speed(property);
  } else {
    sortmillage(property);
  }
  itemsContainer.innerHTML = ""
  renderItemsList(cars)
}

export const countMaxSpeedOfCars = ({ cars, property }) => {
  totalValue.innerHTML = "";
  const totalValues = cars.reduce((sum, current) => {
    if (property === "max_speed") {
      return parseInt(sum, 10) + parseInt(current.max_speed, 10)
    }
    if (property === "millage") {
      return parseInt(sum, 10) + parseInt(current.millage, 10)
    }
  }, 0)

  totalValue.innerHTML = totalValues;
}