"use strict";

import { setupNavbar } from "./navbar.js";
import { employeesAPI_auto } from "./api/_auto/employees.js";
import { employeeRenderer } from "./renderers/employees.js";
import { messageRenderer } from "./renderers/messages.js";

// #region employeeId
// El empleado de la vista, del parámetro employeeId de la URL (employee-detail.html?employeeId=6)
let employeeId = new URLSearchParams(window.location.search).get("employeeId");
// #endregion

// #region main
async function main() {
  setupNavbar();

  // El empleado, con su departamento y su jefe, de la API (GET /api/employees/with-details/6): un
  // endpoint propio devuelve siempre una lista, aquí con una sola fila
  try {
    let rows = await employeesAPI_auto.getByIdWithDetails(employeeId);
    let employee = rows[0];
    document.getElementById("employee-name").textContent = employee.name_emp;
    document.getElementById("employee-details").replaceChildren(employeeRenderer.asDetails(employee));
    // Los empleados a su cargo: los de la lista (GET /api/employees/with-details) cuyo jefe es él
    let employees = await employeesAPI_auto.getAllWithDetails();
    let team = employees.filter((other) => other.boss_id === employee.employee_id);
    document.getElementById("team").replaceChildren(employeeRenderer.asTeam(team));
    document.title = `${employee.name_emp} · Empleados`;
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
