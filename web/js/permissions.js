"use strict";

// #region permissions
// Qué puede hacer el usuario de la sesión (null si no hay sesión): dar de alta y editar
// empleados, con su puesto como rol, y dar de baja y borrar a un empleado (RN07). Los endpoints lo
// exigen; aquí, para no mostrar lo que no puede hacer
const permissions = {
  canManageEmployees: function (user) {
    return user !== null && ["CEO", "Manager"].includes(user.position);
  },

  // RN07: dar de baja y borrar a un empleado, solo su jefe o, si no tiene jefe, él mismo
  canEndContract: function (user, employee) {
    if (user === null) {
      return false;
    }
    if (employee.boss_id === null) {
      return employee.employee_id === user.employee_id;
    }
    return employee.boss_id === user.employee_id;
  },
};
// #endregion

export { permissions };
