"use strict";

import { parseHTML } from "../utils/parseHTML.js";
import { formatDate } from "../utils/formatDate.js";

// #region formats
// El salario con dos decimales y el euro; la comisión (de 0 a 1, RN05) como porcentaje; el
// departamento con su ciudad, si la tiene (RN03)
function formatSalary(salary) {
  return `${salary.toFixed(2)} €`;
}

function formatFee(fee) {
  return `${Math.round(fee * 100)} %`;
}

function formatDepartment(employee) {
  if (employee.name_dep === null) {
    return "";
  }
  return employee.city === null ? employee.name_dep : `${employee.name_dep} (${employee.city})`;
}
// #endregion

// #region employeeRenderer
const employeeRenderer = {
  // Los empleados en una tabla (dentro de ez-scroll), cada nombre enlazado a su ficha; los que
  // tienen fecha de fin están de baja
  asTable: function (employees) {
    let rows = "";
    for (let employee of employees) {
      let state = employee.end_date === null ? "Activo" : '<span class="ez-badge">De baja</span>';
      rows += `<tr>
        <td><a href="employee-detail.html?employeeId=${employee.employee_id}">${employee.name_emp}</a></td>
        <td>${formatDepartment(employee)}</td>
        <td>${employee.boss_name ?? ""}</td>
        <td class="ez-number">${formatSalary(employee.salary)}</td>
        <td>${state}</td>
      </tr>`;
    }
    let html = `<div class="ez-scroll">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Departamento</th>
            <th>Jefe</th>
            <th class="ez-number">Salario</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
    return parseHTML(html);
  },

  // La ficha de un empleado (su nombre es el título de la página): sus datos y los botones para editarlo, darlo de baja y borrarlo
  asDetails: function (employee) {
    let boss = "Sin jefe";
    if (employee.boss_id !== null) {
      boss = `<a href="employee-detail.html?employeeId=${employee.boss_id}">${employee.boss_name}</a>`;
    }
    let contract = `Desde el ${formatDate(employee.start_date)}`;
    if (employee.end_date !== null) {
      contract += ` hasta el ${formatDate(employee.end_date)}`;
    }
    let html = `<div>
      <dl class="app-employee-data">
        <dt>Puesto</dt>
        <dd>${employee.position}</dd>
        <dt>Correo electrónico</dt>
        <dd><a href="mailto:${employee.email}">${employee.email}</a></dd>
        <dt>Departamento</dt>
        <dd>${formatDepartment(employee) || "Sin departamento"}</dd>
        <dt>Jefe</dt>
        <dd>${boss}</dd>
        <dt>Salario</dt>
        <dd>${formatSalary(employee.salary)}</dd>
        <dt>Comisión</dt>
        <dd>${formatFee(employee.fee)}</dd>
        <dt>Contrato</dt>
        <dd>${contract}</dd>
      </dl>
      <p>
        <a class="ez-button ez-button--secondary" href="employee-form.html?employeeId=${employee.employee_id}">Editar</a>
        <button id="end-contract-button" class="ez-button ez-button--secondary" type="button">Dar de baja</button>
        <button id="delete-button" class="ez-button ez-button--danger" type="button">Borrar</button>
      </p>
    </div>`;
    return parseHTML(html);
  },

  // Los empleados a cargo de uno (de los que es jefe), en una tarjeta al lado de su ficha: son los
  // que puede dar de baja y borrar (RN07)
  asTeam: function (team) {
    let items = "";
    for (let employee of team) {
      let state = employee.end_date === null ? "" : ' <span class="ez-badge">De baja</span>';
      items += `<li><a href="employee-detail.html?employeeId=${employee.employee_id}">${employee.name_emp}</a>, ${employee.position}${state}</li>`;
    }
    let content = team.length === 0 ? "<p>Nadie a su cargo.</p>" : `<ul>${items}</ul>`;
    let html = `<article class="ez-card">
      <div class="ez-card__body">
        <h3>A su cargo</h3>
        ${content}
      </div>
    </article>`;
    return parseHTML(html);
  },
};
// #endregion

export { employeeRenderer };
