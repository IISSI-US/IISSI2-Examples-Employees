"use strict";

import { setupNavbar } from "./navbar.js";
import { employeesAPI_auto } from "./api/_auto/employees.js";
import { departmentsAPI_auto } from "./api/_auto/departments.js";
import { employeeValidator } from "./validators/employees.js";
import { messageRenderer } from "./renderers/messages.js";

// #region employeeId
// El empleado que se edita (employee-form.html?employeeId=6), o null si es un alta
let employeeId = new URLSearchParams(window.location.search).get("employeeId");
// #endregion

// #region loadOptions
// Las opciones de los desplegables, de la API: los departamentos (GET /api/departments) y los
// posibles jefes, todos los empleados (GET /api/employees)
async function loadOptions() {
  let departments = await departmentsAPI_auto.getAll();
  let departmentSelect = document.getElementById("department_id");
  for (let department of departments) {
    let label = department.city === null ? department.name_dep : `${department.name_dep} (${department.city})`;
    departmentSelect.append(new Option(label, department.department_id));
  }

  let employees = await employeesAPI_auto.getAll();
  let bossSelect = document.getElementById("boss_id");
  for (let employee of employees) {
    bossSelect.append(new Option(employee.name_emp, employee.employee_id));
  }
}
// #endregion

// #region loadEmployee
// Rellena el formulario con los datos del empleado que se edita, pedido a la API. La contraseña
// no se edita aquí: su campo se oculta
async function loadEmployee() {
  document.getElementById("form-title").textContent = "Editar empleado";
  document.title = "Editar empleado · Empleados";
  document.querySelector(".ez-navbar [aria-current]").removeAttribute("aria-current");
  let passwordField = document.getElementById("password-field");
  passwordField.hidden = true;
  passwordField.querySelector("input").disabled = true;

  let employee = await employeesAPI_auto.getById(employeeId);  // GET /api/employees/6
  let form = document.getElementById("employee-form");
  form.elements.name_emp.value = employee.name_emp;
  form.elements.email.value = employee.email;
  form.elements.position.value = employee.position;
  form.elements.department_id.value = employee.department_id ?? "";
  form.elements.boss_id.value = employee.boss_id ?? "";
  form.elements.salary.value = employee.salary;
  form.elements.fee.value = employee.fee;
  form.elements.start_date.value = employee.start_date;
}
// #endregion

// #region apiErrorMessage
// El motivo que da la API, con el requisito: las restricciones UNIQUE (RN01, el nombre repetido,
// y el correo repetido) se reconocen por su nombre; los triggers (RN02, RN04, RN06) ya lo traen
function apiErrorMessage(error) {
  let message = error.response?.data?.message ?? "No se han podido guardar los datos del empleado";
  if (message.includes("uq_employees_rn01_name")) {
    return "RN01: Ya hay un empleado con ese nombre";
  }
  if (message.includes("uq_employees_email")) {
    return "Ya hay un empleado con ese correo electrónico";
  }
  return message;
}
// #endregion

// #region handleSubmit
// Al enviar el formulario: el navegador no lo envía, se validan sus datos y, si son correctos, se
// crea el empleado en la API (o se modifica, si se edita) y se va a su ficha
async function handleSubmit(event) {
  event.preventDefault();
  let form = event.target;
  // Los campos desactivados (la contraseña, al editar) no van en los datos del formulario
  let formData = new FormData(form);
  let errorsContainer = document.getElementById("errors");

  let errors = employeeValidator.validateEmployee(formData, employeeId);
  messageRenderer.showErrorsAsAlert(errorsContainer, errors);
  if (errors.length > 0) {
    return;
  }

  try {
    if (employeeId === null) {
      let result = await employeesAPI_auto.create(formData);  // POST /api/employees
      window.location.href = `employee-detail.html?employeeId=${result.lastId}`;
    } else {
      await employeesAPI_auto.update(formData, employeeId);  // PUT /api/employees/6
      window.location.href = `employee-detail.html?employeeId=${employeeId}`;
    }
  } catch (error) {
    messageRenderer.showErrorsAsAlert(errorsContainer, [apiErrorMessage(error)]);
  }
}
// #endregion

// #region main
async function main() {
  setupNavbar();

  let form = document.getElementById("employee-form");
  form.addEventListener("submit", handleSubmit);
  // En un alta, la fecha de inicio es la de hoy (se puede cambiar)
  form.elements.start_date.value = new Date().toISOString().slice(0, 10);

  try {
    await loadOptions();
    if (employeeId !== null) {
      await loadEmployee();
    }
  } catch (error) {
    messageRenderer.showErrorMessage("No se han podido cargar los datos del formulario", error);
  }
}

document.addEventListener("DOMContentLoaded", main);
// #endregion
