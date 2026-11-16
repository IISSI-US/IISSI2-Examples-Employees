"use strict";

// #region formatDate
// Una fecha de la API ("2013-04-23 18:21:43") como fecha de JavaScript, escrita en español (23/4/2013)
function formatDate(date) {
  return new Date(date.replace(" ", "T")).toLocaleDateString("es-ES");
}
// #endregion

export { formatDate };
