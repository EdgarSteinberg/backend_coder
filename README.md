🛒 E-commerce - Curso Backend CoderHouse
📋 Descripción
Este proyecto es un e-commerce desarrollado como parte de una práctica integradora. La aplicación permite a los usuarios:

Registrarse e iniciar sesión.
Gestionar productos: Crear, leer, actualizar y eliminar productos con roles específicos (admin, premium).
Cargar documentos: Subir documentos utilizando Multer, con rutas específicas para diferentes tipos de archivos.
Realizar compras y otras operaciones.
El backend está construido con Node.js y Express, utilizando MongoDB como base de datos. El sistema de autenticación soporta JWT y GitHub OAuth, implementando seguridad con Passport.js.

🌟 Características
Autenticación y Autorización: Opciones de autenticación mediante JWT o GitHub OAuth.
Gestión de Productos: CRUD completo para productos, con soporte para diferentes roles de usuario.
Carga de Documentos: Subida de documentos con rutas específicas para diferentes tipos de archivos (documentos, imágenes, etc.).
WebSockets: Funcionalidades en tiempo real mediante Socket.io.
Documentación de API: API documentada utilizando Swagger.
⚙️ Requisitos Previos
Antes de comenzar, asegúrate de tener instalados los siguientes programas:

Node.js (v14 o superior)
MongoDB
🛠️ Instalación
Clona el repositorio:
git clone https://github.com/tu_usuario/segundapracticaintegradora.git
cd segundapracticaintegradora

Instala las dependencias:
npm install

🚀 Uso
🏭 Modo Producción
Para ejecutar la aplicación en modo producción:
npm start
Esto iniciará la aplicación utilizando nodemon para monitorear cambios en el código y reiniciar automáticamente el servidor.

📖 Documentación de API
La API está documentada utilizando Swagger. Puedes acceder a la documentación en http://localhost:8080/api-docs después de iniciar la aplicación.

🧪 Pruebas
El proyecto incluye un conjunto de pruebas de integración con Mocha y Chai.

Para ejecutar las pruebas:
npm test

📦 Dependencias
El proyecto utiliza las siguientes dependencias:

bcrypt: Encriptación de contraseñas.
connect-mongo: Almacenamiento de sesiones en MongoDB.
cookie-parser: Manejo de cookies.
cors: Habilitación de CORS.
cross-env: Configuración de variables de entorno multiplataforma.
dayjs: Manipulación de fechas.
dotenv: Manejo de variables de entorno.
express: Framework web para Node.js.
express-handlebars: Motor de plantillas para Express.
express-session: Manejo de sesiones en Express.
jsonwebtoken: Manejo de JWT.
mongoose: ODM para MongoDB.
mongoose-paginate-v2: Paginación en Mongoose.
multer: Middleware para manejo de archivos.
nodemailer: Envío de correos electrónicos.
passport: Middleware de autenticación.
passport-github2: Estrategia de autenticación con GitHub.
passport-jwt: Estrategia de autenticación con JWT.
passport-local: Estrategia de autenticación local.
socket.io: Comunicación en tiempo real.
swagger-jsdoc: Generación de documentación Swagger.
swagger-ui-express: Interfaz de usuario para Swagger.
winston: Logger para Node.js.
📄 Licencia
Este proyecto está licenciado bajo la Licencia ISC. Consulta el archivo LICENSE para más detalles.

