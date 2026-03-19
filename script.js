let demoarray = [];
let activeFilter = "all";

const list = document.querySelector(".js-todo-list");
const form = document.querySelector(".formselect");
const input = document.querySelector(".inputselect");
const totalCount = document.querySelector('[data-count="total"]');
const activeCount = document.querySelector('[data-count="active"]');
const doneCount = document.querySelector('[data-count="done"]');
const emptyState = document.querySelector(".empty-state");
const clearCompletedBtn = document.querySelector(".js-clear-completed");
const filterButtons = document.querySelectorAll(".js-filter");
const themeToggle = document.querySelector(".theme-toggle");

function saveTodos() {
  localStorage.setItem("demoarray", JSON.stringify(demoarray));
}

function loadTodos() {
  const stored = localStorage.getItem("demoarray");
  if (stored) {
    demoarray = JSON.parse(stored);
  }
}

function getFilteredTodos() {
  if (activeFilter === "active") {
    return demoarray.filter((todo) => !todo.checked);
  }
  if (activeFilter === "done") {
    return demoarray.filter((todo) => todo.checked);
  }
  return demoarray;
}

function updateStats() {
  const total = demoarray.length;
  const done = demoarray.filter((todo) => todo.checked).length;
  const active = total - done;
  totalCount.textContent = total;
  activeCount.textContent = active;
  doneCount.textContent = done;
}

function updateEmptyState(visible) {
  emptyState.classList.toggle("is-visible", visible);
}

function createTodoElement(todo) {
  const item = document.createElement("li");
  item.className = `todo-item ${todo.checked ? "done" : ""}`;
  item.dataset.key = todo.id;

  const checkBtn = document.createElement("button");
  checkBtn.className = "todo-check js-tick";
  checkBtn.type = "button";
  checkBtn.setAttribute("aria-pressed", String(todo.checked));
  checkBtn.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12l4 4 10-10" />
    </svg>
  `;

  const text = document.createElement("span");
  text.className = "todo-text";
  text.textContent = todo.x;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "todo-delete js-delete-todo";
  deleteBtn.type = "button";
  deleteBtn.setAttribute("aria-label", "Delete task");
  deleteBtn.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 7h12l-1 13H7L6 7zm3-3h6l1 2H8l1-2z" />
    </svg>
  `;

  item.append(checkBtn, text, deleteBtn);
  return item;
}

function renderTodos() {
  list.innerHTML = "";
  const filtered = getFilteredTodos();

  filtered.forEach((todo) => {
    list.appendChild(createTodoElement(todo));
  });

  updateStats();
  updateEmptyState(filtered.length === 0);
}

function addTodo(text) {
  const todoobject = {
    x: text,
    checked: false,
    id: Date.now(),
  };

  demoarray.unshift(todoobject);
  saveTodos();
  renderTodos();
}

function toggleDone(id) {
  const todo = demoarray.find((item) => item.id === id);
  if (!todo) return;
  todo.checked = !todo.checked;
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  demoarray = demoarray.filter((item) => item.id !== id);
  saveTodos();
  renderTodos();
}

function clearCompleted() {
  demoarray = demoarray.filter((item) => !item.checked);
  saveTodos();
  renderTodos();
}

function setFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.filter === filter);
  });
  renderTodos();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (text.length === 0) return;
  addTodo(text);
  input.value = "";
});

list.addEventListener("click", (event) => {
  const target = event.target;
  const item = target.closest(".todo-item");
  if (!item) return;
  const itemKey = Number(item.dataset.key);

  if (target.closest(".js-tick")) {
    toggleDone(itemKey);
  }

  if (target.closest(".js-delete-todo")) {
    deleteTodo(itemKey);
  }
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function initTheme() {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    applyTheme(storedTheme);
  }
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  initTheme();
  renderTodos();
});
