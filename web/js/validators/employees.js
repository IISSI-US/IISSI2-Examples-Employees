"use strict";

// #region employeeValidator
const employeeValidator = {
  // Los errores de los datos de un empleado (vacío si son correctos): el nombre, con el límite de
  // su columna, el salario, la comisión (RN05) y el jefe, que no puede ser él mismo (RN04)
  validateEmployee: function (formData, employeeId) {
    let errors = [];

    let name = formData.get("name_emp").trim();
    if (name.length === 0 || name.length > 64) {
      errors.push("El nombre debe tener entre 1 y 64 caracteres");
    }

    let salary = Number(formData.get("salary"));
    if (!(salary > 0)) {
      errors.push("El salario debe ser mayor que 0");
    }

    let fee = Number(formData.get("fee"));
    if (!(fee >= 0 && fee <= 1)) {
      errors.push("RN05: La comisión es un porcentaje del salario, entre 0 y 1");
    }

    if (employeeId !== null && formData.get("boss_id") === employeeId) {
      errors.push("RN04: Un empleado no puede ser su propio jefe");
    }

    return errors;
  },
};
// #endregion

export { employeeValidator };
