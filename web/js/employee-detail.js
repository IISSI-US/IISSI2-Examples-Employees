"use strict";

import { setupNavbar } from "./navbar.js";
import { employeesAPI_auto } from "./api/_auto/employees.js";
import { employeeRenderer } from "./renderers/employees.js";
import { messageRenderer } from "./renderers/messages.js";
import { sessionManager } from "./utils/session.js";
import { permissions } from "./permissions.js";
import { ezConfirm } from "../ez-ui/js/dialog.js";

// #region employeeId
// El empleado de la vista, del parámetro employeeId de la URL (employee-detail.html?employeeId=6)
let employeeId = new URLSearchParams(window.location.search).get("employeeId");
// #endregion

// #region showEmployee
// Pide el empleado, con su departamento y su jefe, a la API (GET /api/employees/with-details/6) y
// lo pinta, con los botones de lo que puede hacer el usuario de la sesión. Un endpoint propio
// devuelve siempre una lista, aquí con una sola fila
async function showEmployee() {
  let rows = await employeesAPI_auto.getByIdWithDetails(employeeId);
  let employee = rows[0];
  let user = sessionManager.getUser();
  let actions = {
    canEdit: permissions.canManageEmployees(user),
    canEnd: permissions.canEndContract(user, employee),
  };
  document.getElementById("employee-name").textContent = employee.name_emp;
  document.getElementById("employee-details").replaceChildren(employeeRenderer.asDetails(employee, actions));
  // Los empleados a su cargo: los de la lista (GET /api/employees/with-details) cuyo jefe es él
  let employees = await employeesAPI_auto.getAllWithDetails();
  let team = employees.filter((other) => other.boss_id === employee.employee_id);
  document.getElementById("team").replaceChildren(employeeRenderer.asTeam(team));
  document.title = `${employee.name_emp} · Empleados`;

  if (actions.canEnd) {
    document.getElementById("end-contract-button")?.addEventListener("click", handleEndContract);
    document.getElementById("delete-button").addEventListener("click", handleDelete);
  }
}
// #endregion

// #region handleEndContract
// Al pulsar Dar de baja: si se confirma, la API pone hoy como su fecha de fin
// (PUT /api/employees/6/end-contract) y la ficha se vuelve a pintar
async function handleEndContract() {
  let confirmed = await ezConfirm(document.getElementById("end-contract-dialog"));
  if (!confirmed) {
    return;
  }
  try {
    await employeesAPI_auto.endContract(employeeId);
    messageRenderer.showSuccessMessage("El empleado está de baja");
    await showEmployee();
  } catch (error) {
    messageRenderer.showErrorMessage("No se ha podido dar de baja al empleado", error);
  }
}
// #endregion

// #region handleDelete
// Al pulsar Borrar: si se confirma, se borra en la API (DELETE /api/employees/6) y se vuelve a la
// lista. Si el usuario se borra a sí mismo (sin jefe, RN07), su sesión se cierra
async function handleDelete() {
  let confirmed = await ezConfirm(document.getElementById("delete-dialog"));
  if (!confirmed) {
    return;
  }
  try {
    await employeesAPI_auto.delete(employeeId);
    if (String(sessionManager.getUser().employee_id) === employeeId) {
      sessionManager.logout();
    }
    window.location.href = "index.html";
  } catch (error) {
    // Un jefe con empleados no se puede borrar: lo impide la clave ajena boss_id de sus empleados
    if (error.response?.data?.message?.includes("boss_id")) {
      messageRenderer.showErrorMessage("No se puede borrar: es el jefe de otros empleados");
    } else {
      messageRenderer.showErrorMessage("No se ha podido borrar el empleado", error);
    }
  }
}
// #endregion

// #region main
async function main() {
  setupNavbar();
  try {
    await showEmployee();
  } catch (error) {
    // 404: no hay ningún empleado con ese identificador
    if (error.response?.status === 404) {
      messageRenderer.showErrorMessage("El empleado no existe");
    } else {
      messageRenderer.showErrorMessage("No se ha podido cargar el empleado", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", main);
// #endregion
