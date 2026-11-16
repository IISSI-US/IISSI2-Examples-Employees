"use strict";

import { setupNavbar } from "./navbar.js";
import { employeesAPI_auto } from "./api/_auto/employees.js";
import { employeeRenderer } from "./renderers/employees.js";
import { messageRenderer } from "./renderers/messages.js";
import { sessionManager } from "./utils/session.js";
import { permissions } from "./permissions.js";

// #region main
async function main() {
  setupNavbar();
  let user = sessionManager.getUser();
  document.getElementById("new-employee").hidden = !permissions.canManageEmployees(user);

  // Los empleados, con su departamento y su jefe, de la API (GET /api/employees/with-details)
  try {
    let employees = await employeesAPI_auto.getAllWithDetails();
    document.getElementById("employees").replaceChildren(employeeRenderer.asTable(employees));
  } catch (error) {
    messageRenderer.showErrorMessage("No se han podido cargar los empleados", error);
  }
}

document.addEventListener("DOMContentLoaded", main);
// #endregion
