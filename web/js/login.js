"use strict";

import { authAPI_auto } from "./api/_auto/auth.js";
import { messageRenderer } from "./renderers/messages.js";
import { sessionManager } from "./utils/session.js";
import { setupNavbar } from "./navbar.js";

// #region handleSubmit
// Al enviar el formulario: inicia la sesión en la API, la guarda en el navegador y vuelve a la lista
async function handleSubmit(event) {
  event.preventDefault();
  let form = event.target;
  let formData = new FormData(form);
  let errorsContainer = document.getElementById("errors");

  try {
    let result = await authAPI_auto.login(formData);  // POST /api/login
    sessionManager.login(result.sessionToken, result.user);
    window.location.href = "index.html";
  } catch (error) {
    // 400: el correo o la contraseña no son correctos (el usuario tiene que corregirlos)
    if (error.response?.status === 400) {
      messageRenderer.showErrorsAsAlert(errorsContainer, ["El correo o la contraseña no son correctos"]);
    } else {
      messageRenderer.showErrorMessage("No se ha podido iniciar sesión", error);
    }
  }
}
// #endregion

// #region main
function main() {
  setupNavbar();
  let form = document.getElementById("login-form");
  form.addEventListener("submit", handleSubmit);
}

document.addEventListener("DOMContentLoaded", main);
// #endregion
