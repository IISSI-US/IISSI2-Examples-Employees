"use strict";

import { ezNavbar } from "../ez-ui/js/navbar.js";
import { ezThemeToggle } from "../ez-ui/js/theme.js";
import { authAPI_auto } from "./api/_auto/auth.js";
import { sessionManager } from "./utils/session.js";
import { permissions } from "./permissions.js";

// #region setupNavbar
// Activa los botones de la barra de navegación de la vista (el menú plegable y el tema) y pone
// la sesión: sin sesión, el enlace para iniciarla; con sesión, el usuario y el enlace para
// cerrarla. «Nuevo empleado» solo se ve si el usuario puede dar de alta empleados
function setupNavbar() {
  let navbar = document.querySelector(".ez-navbar");
  ezNavbar(navbar);
  ezThemeToggle(navbar.querySelector(".ez-theme-toggle"));

  let user = sessionManager.getUser();
  let session = document.getElementById("navbar-session");
  if (user === null) {
    session.innerHTML = '<a href="login.html">Iniciar sesión</a>';
  } else {
    session.innerHTML = `${user.name_emp} (${user.position}) · <a href="index.html" id="logout-link">Cerrar sesión</a>`;
    document.getElementById("logout-link").addEventListener("click", handleLogout);
  }
  document.getElementById("navbar-new").hidden = !permissions.canManageEmployees(user);
}
// #endregion

// #region handleLogout
// Al cerrar la sesión: la cierra en la API (el token deja de valer) y en el navegador, y vuelve a
// la lista
async function handleLogout(event) {
  event.preventDefault();
  try {
    await authAPI_auto.logout();  // POST /api/logout
  } catch (error) {
    // Si el token ya no vale (ha caducado), la sesión ya estaba cerrada en el servidor
  }
  sessionManager.logout();
  window.location.href = "index.html";
}
// #endregion

export { setupNavbar };
