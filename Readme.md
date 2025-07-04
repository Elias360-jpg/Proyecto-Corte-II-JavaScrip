API REST con Node.js, Express, JWT y MySQL
Esta es una API REST construida con Node.js y Express, que incluye un sistema de autenticación basado en JSON Web Tokens (JWT) con refresh tokens, un CRUD completo para la entidad Producto, y conexión a una base de datos MySQL. Implementa middlewares para la verificación de autenticación y autorización por roles (admin y user).

Características
Autenticación de Usuarios: Registro, inicio de sesión, y cierre de sesión.

Gestión de Tokens: Generación y renovación de Access Tokens y Refresh Tokens.

Autorización por Roles: Implementa roles admin y user con diferentes niveles de acceso a los recursos.

CRUD de Productos: Operaciones completas (Crear, Leer, Actualizar, Eliminar) para la entidad Producto.

Base de Datos SQL: Conexión y operaciones con MySQL.

Estructura Modular: Código organizado en controladores, rutas, middlewares y modelos.

Requisitos Previos
Antes de comenzar, asegúrate de tener instalado lo siguiente:

Node.js (versión 14 o superior)

npm (viene con Node.js)

MySQL Server (o un entorno como XAMPP/WAMP/MAMP que incluya MySQL)

Postman o una herramienta similar para probar la API (Insomnia, cURL, etc.)

Instalación
Sigue estos pasos para configurar y ejecutar la API en tu entorno local:

Clona el Repositorio (o crea la estructura de carpetas):
Si no lo tienes ya, crea la estructura de carpetas y archivos como se indicó anteriormente. Asegúrate de que todos los archivos (.env, server.js, sql_schema.sql, y todas las carpetas con sus respectivos archivos) estén en su lugar.

# Si estás creando la estructura desde cero, asegúrate de tener esta carpeta principal
mkdir tu-api-rest
cd tu-api-rest

Instala las Dependencias:
Navega a la carpeta raíz de tu proyecto (tu-api-rest) en tu terminal y ejecuta:

npm install

Configuración de la Base de Datos
Inicia tu Servidor MySQL:
Asegúrate de que tu servidor MySQL esté en ejecución.

Crea la Base de Datos y Tablas:
Abre tu cliente MySQL favorito (MySQL Workbench, phpMyAdmin, línea de comandos MySQL, etc.) y ejecuta el contenido del archivo sql_schema.sql para crear la base de datos y las tablas users y products.

-- sql_schema.sql
CREATE DATABASE IF NOT EXISTS your_database_name; -- ¡Usa el nombre que quieras para tu DB!

USE your_database_name;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    refresh_token VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

Configuración de Variables de Entorno
Crea el archivo .env:
En la raíz de tu proyecto (tu-api-rest), crea un archivo llamado .env.

Añade las Variables de Entorno:
Copia y pega el siguiente contenido en tu archivo .env, reemplazando los valores de marcador de posición con tus credenciales reales de MySQL y tus secretos JWT.

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_root_password # Tu contraseña de MySQL. Déjalo vacío si no tienes: DB_PASSWORD=
DB_NAME=your_database_name # El nombre de la base de datos que creaste

JWT_SECRET=your_super_secret_jwt_key # Una cadena larga y aleatoria para JWT
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key # Otra cadena larga y aleatoria para Refresh Token
ACCESS_TOKEN_EXPIRATION=1h # Tiempo de expiración del Access Token (ej: 1h, 15m, 30s)
REFRESH_TOKEN_EXPIRATION=7d # Tiempo de expiración del Refresh Token (ej: 7d, 30d)

Importante: No uses comillas alrededor de los valores en el archivo .env.

Ejecutar la API
Desde la carpeta raíz de tu proyecto (tu-api-rest) en la terminal, ejecuta:

node server.js

Deberías ver el mensaje: Servidor corriendo en el puerto 3000.

Uso de la API (Endpoints)
La API estará disponible en http://localhost:3000. Utiliza Postman o una herramienta similar para enviar las solicitudes.

1. Autenticación
Registro de Usuario
URL: http://localhost:3000/api/auth/register

Método: POST

Headers: Content-Type: application/json

Body (raw, JSON):

{
    "username": "tu_nuevo_usuario",
    "password": "tu_contraseña_segura",
    "role": "user" // O "admin" para crear un administrador
}

Respuesta Exitosa (201 Created):

{
    "message": "Usuario registrado exitosamente.",
    "user": {
        "id": 1,
        "username": "tu_nuevo_usuario",
        "role": "user"
    }
}

Inicio de Sesión
URL: http://localhost:3000/api/auth/login

Método: POST

Headers: Content-Type: application/json

Body (raw, JSON):

{
    "username": "tu_usuario",
    "password": "tu_contraseña"
}

Respuesta Exitosa (200 OK):

{
    "accessToken": "eyJhbGciOiJIUzI1Ni...",
    "refreshToken": "eyJhbGciOiJIUzI1Ni..."
}

Guarda estos tokens. El accessToken es necesario para acceder a las rutas protegidas.

Renovar Token
URL: http://localhost:3000/api/auth/refresh-token

Método: POST

Headers: Content-Type: application/json

Body (raw, JSON):

{
    "token": "tu_refresh_token_aqui"
}

Respuesta Exitosa (200 OK):

{
    "accessToken": "eyJhbGciOiJIUzI1Ni...",
    "refreshToken": "eyJhbGciOiJIUzI1Ni..."
}

Cerrar Sesión
URL: http://localhost:3000/api/auth/logout

Método: POST

Headers:

Authorization: Bearer <tu_access_token_aqui>

Respuesta Exitosa (200 OK):

{
    "message": "Sesión cerrada exitosamente."
}

2. CRUD de Productos
Para acceder a estos endpoints, debes incluir el accessToken en el encabezado Authorization.

Header Requerido para Rutas Protegidas:

Key: Authorization

Value: Bearer <tu_access_token_aqui>

Crear Producto
URL: http://localhost:3000/api/products

Método: POST

Headers:

Authorization: Bearer <tu_access_token_aqui>

Content-Type: application/json

Requisitos de Rol: admin

Body (raw, JSON):

{
    "name": "Laptop Gamer",
    "description": "Potente laptop para gaming con RTX 4080.",
    "price": 1800.00,
    "stock": 25
}

Respuesta Exitosa (201 Created):

{
    "id": 1,
    "name": "Laptop Gamer",
    "description": "Potente laptop para gaming con RTX 4080.",
    "price": 1800.00,
    "stock": 25
}

Obtener Todos los Productos
URL: http://localhost:3000/api/products

Método: GET

Headers: Authorization: Bearer <tu_access_token_aqui>

Requisitos de Rol: user o admin

Respuesta Exitosa (200 OK):

[
    {
        "id": 1,
        "name": "Laptop Gamer",
        "description": "Potente laptop para gaming con RTX 4080.",
        "price": 1800.00,
        "stock": 25
    }
]

Obtener Producto por ID
URL: http://localhost:3000/api/products/:id (ej. http://localhost:3000/api/products/1)

Método: GET

Headers: Authorization: Bearer <tu_access_token_aqui>

Requisitos de Rol: user o admin

Respuesta Exitosa (200 OK):

{
    "id": 1,
    "name": "Laptop Gamer",
    "description": "Potente laptop para gaming con RTX 4080.",
    "price": 1800.00,
    "stock": 25
}

Actualizar Producto
URL: http://localhost:3000/api/products/:id (ej. http://localhost:3000/api/products/1)

Método: PUT

Headers:

Authorization: Bearer <tu_access_token_aqui>

Content-Type: application/json

Requisitos de Rol: admin

Body (raw, JSON):

{
    "name": "Laptop Gamer Pro",
    "price": 1900.00
}

Respuesta Exitosa (200 OK):

{
    "message": "Producto actualizado exitosamente."
}

Eliminar Producto
URL: http://localhost:3000/api/products/:id (ej. http://localhost:3000/api/products/1)

Método: DELETE

Headers: Authorization: Bearer <tu_access_token_aqui>

Requisitos de Rol: admin

Respuesta Exitosa (204 No Content):
(No devuelve cuerpo de respuesta)