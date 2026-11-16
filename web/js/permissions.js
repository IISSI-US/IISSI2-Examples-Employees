"use strict";

// #region permissions
// Qué puede hacer el usuario de la sesión (null si no hay sesión), con su puesto como rol: dar de
// alta y editar empleados, solo CEO y Manager (los endpoints lo exigen; aquí, para no mostrar
// lo que no puede hacer)
const permissions = {
  canManageEmployees: function (user) {
    return user !== null && ["CEO", "Manager"].includes(user.position);
  },
};
// #endregion

export { permissions };
