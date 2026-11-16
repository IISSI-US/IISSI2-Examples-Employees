--
-- Autor: David Ruiz
-- Fecha: Noviembre de 2026
-- Descripción: credenciales de acceso de los empleados a la aplicación: su correo, con el que
-- inician sesión, su contraseña y su puesto, que es su rol (como el proyecto del CI de Silence).
-- Ejecutar después de populate_db.sql.
--
USE employees_db;

-- #region employees-credentials
ALTER TABLE employees
  ADD COLUMN email    VARCHAR(255),
  ADD COLUMN password VARCHAR(255),
  ADD COLUMN position VARCHAR(16),
  ADD CONSTRAINT uq_employees_email UNIQUE (email),
  ADD CONSTRAINT ck_employees_position CHECK (position IN ('CEO', 'Manager', 'Programmer'));
-- #endregion

-- #region employees-data
-- El correo de cada empleado es su nombre en minúsculas en company.com, y su contraseña, la parte
-- del correo anterior a la @, en argon2 (silence hash <contraseña>)
UPDATE employees SET email = 'pedro@company.com', password = '$argon2id$v=19$m=65536,t=3,p=4$gbQDTNsKozUXh6FNi4wNUw$nQ9+k1s0CWNDHB91qHAP9z8DdoSmG19e5/XhNK6ITd0', position = 'Manager' WHERE employee_id = 1;
UPDATE employees SET email = 'jose@company.com', password = '$argon2id$v=19$m=65536,t=3,p=4$Mi6C5shlxwxA5r+KDxkXsQ$E5YLmLkqhQXLyKDXZi6wiOTi6UFp3uH86sXNH32/l3c', position = 'CEO' WHERE employee_id = 2;
UPDATE employees SET email = 'lola@company.com', password = '$argon2id$v=19$m=65536,t=3,p=4$EeDkZh/cKQROhqIBrfKXMA$qHVGvWagifCxht8+zLHBoIb2Jfa1fH8FImirh7jfAHQ', position = 'Manager' WHERE employee_id = 3;
UPDATE employees SET email = 'luis@company.com', password = '$argon2id$v=19$m=65536,t=3,p=4$sHN6eWc+TaOv0nZO49hCJg$TnB4C5KL17N3g7by5XfxcoXKGYMUNyIw8Ufxpk2xo+E', position = 'Programmer' WHERE employee_id = 4;
UPDATE employees SET email = 'ana@company.com', password = '$argon2id$v=19$m=65536,t=3,p=4$KHFCGY0KCiz/vOBM0p3ZOQ$D4o1HQW5pnGDIeSmfWwACAfqKOZe4o2y+oIgTLzfunc', position = 'Programmer' WHERE employee_id = 5;
UPDATE employees SET email = 'daniel@company.com', password = '$argon2id$v=19$m=65536,t=3,p=4$YGdlIqvlo3AOrm5KieuySg$l+h6RxnOTMV6xe2EAObbUMRmWB6UZRJPmlu2HVFG/MA', position = 'Programmer' WHERE employee_id = 6;
UPDATE employees SET email = 'eva@company.com', password = '$argon2id$v=19$m=65536,t=3,p=4$zgYWkkxOKjZJo4OX5A5hSQ$HcASxIjkzmGxaZL6Y7qK0IJdygfeRch237jCd0ElXD0', position = 'Programmer' WHERE employee_id = 7;

ALTER TABLE employees
  MODIFY email    VARCHAR(255) NOT NULL,
  MODIFY password VARCHAR(255) NOT NULL;
-- #endregion
