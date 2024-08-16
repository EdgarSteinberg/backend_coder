from docx import Document

# Crear un nuevo documento
doc = Document()

# Añadir título
doc.add_heading('E-Commerce API', level=1)

# Añadir secciones
doc.add_heading('Descripción', level=2)
doc.add_paragraph(
    "Este proyecto es una API para gestionar productos y carritos de compras en una aplicación de comercio electrónico. "
    "La API incluye autenticación y autorización de usuarios, manejo de archivos (thumbnails de productos), y un proceso "
    "de compra completo con generación de tickets."
)

doc.add_heading('Estructura del Proyecto', level=2)
doc.add_paragraph(
    "- **Routers:**\n"
    "  - `Productrouter`: Maneja rutas relacionadas con los productos.\n"
    "  - `CartRouter`: Maneja rutas relacionadas con los carritos de compras.\n\n"
    "- **Controllers:**\n"
    "  - `ProductController`: Controlador que gestiona la lógica de negocio relacionada con los productos.\n"
    "  - `CartController`: Controlador que gestiona la lógica de negocio relacionada con los carritos.\n\n"
    "- **Middlewares:**\n"
    "  - `authorization`: Middleware que verifica los roles de los usuarios.\n"
    "  - `addLogger`: Middleware para registrar logs de las operaciones.\n\n"
    "- **Utils:**\n"
    "  - `multerUtil.js`: Configuración de Multer para manejar la carga de archivos."
)

doc.add_heading('Rutas y Endpoints', level=2)
doc.add_heading('Productos', level=3)
doc.add_paragraph(
    "- **GET `/api/products/`**\n"
    "  - Obtiene todos los productos disponibles.\n\n"
    "- **GET `/api/products/:pid`**\n"
    "  - Obtiene un producto específico por su ID (`pid`).\n\n"
    "- **POST `/api/products/`**\n"
    "  - Crea un nuevo producto. Requiere autenticación JWT y roles `admin` o `premium`.\n"
    "  - Permite la carga de hasta 3 archivos (thumbnails) utilizando Multer.\n"
    "  - Asigna el campo `owner` al producto basado en el rol del usuario (email del usuario si es premium, \"admin\" si es admin).\n\n"
    "- **PUT `/api/products/:pid`**\n"
    "  - Actualiza un producto existente por su ID (`pid`).\n"
    "  - Permite actualizar los thumbnails del producto.\n\n"
    "- **DELETE `/api/products/:pid`**\n"
    "  - Elimina un producto por su ID. Solo puede ser realizado por el `admin` o el dueño del producto si es premium."
)

doc.add_heading('Carritos', level=3)
doc.add_paragraph(
    "- **GET `/api/carts/`**\n"
    "  - Obtiene todos los carritos.\n\n"
    "- **GET `/api/carts/:cid`**\n"
    "  - Obtiene un carrito específico por su ID (`cid`).\n\n"
    "- **POST `/api/carts/`**\n"
    "  - Crea un nuevo carrito. Si se está ejecutando en modo de prueba, permite especificar un `userId`.\n\n"
    "- **POST `/api/carts/:cid/products/:pid`**\n"
    "  - Agrega un producto a un carrito específico. Verifica que un usuario premium no pueda agregar un producto propio a su carrito.\n\n"
    "- **DELETE `/api/carts/:cid/products/:pid`**\n"
    "  - Elimina un producto específico de un carrito.\n\n"
    "- **PUT `/api/carts/:cid`**\n"
    "  - Actualiza un carrito completo con los datos proporcionados.\n\n"
    "- **PUT `/api/carts/:cid/products/:pid`**\n"
    "  - Actualiza la cantidad de un producto en un carrito específico.\n\n"
    "- **DELETE `/api/carts/:cid`**\n"
    "  - Elimina todos los productos de un carrito.\n\n"
    "- **POST `/api/carts/:cid/purchase`**\n"
    "  - Procesa la compra de un carrito. Genera un ticket y vacía el carrito después de la compra."
)

doc.add_heading('Instalación', level=2)
doc.add_paragraph(
    "1. Clona este repositorio.\n"
    "   ```bash\n"
    "   git clone <url-del-repositorio>\n"
    "   ```\n"
    "2. Navega al directorio del proyecto.\n"
    "   ```bash\n"
    "   cd <nombre-del-proyecto>\n"
    "   ```\n"
    "3. Instala las dependencias.\n"
    "   ```bash\n"
    "   npm install\n"
    "   ```"
)

doc.add_heading('Configuración', level=2)
doc.add_paragraph(
    "Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables:\n\n"
    "```bash\n"
    "MONGODB_URI=<tu_uri_de_mongodb>\n"
    "JWT_SECRET=<tu_secreto_jwt>\n"
    "```"
)

doc.add_heading('Ejecutar el Proyecto', level=2)
doc.add_paragraph(
    "Para iniciar el servidor en desarrollo:\n\n"
    "```bash\n"
    "npm run dev\n"
    "```\n\n"
    "El servidor se iniciará en `http://localhost:3000` o en el puerto que hayas configurado."
)

doc.add_heading('Pruebas', level=2)
doc.add_paragraph(
    "Para ejecutar las pruebas:\n\n"
    "```bash\n"
    "npm test\n"
    "```"
)

doc.add_heading('Dependencias', level=2)
doc.add_paragraph(
    "- Express\n"
    "- Passport.js\n"
    "- Multer\n"
    "- Mongoose\n"
    "- Winston (Logger)\n"
    "- Chai y Mocha (Para pruebas)"
)

doc.add_heading('Contribuciones', level=2)
doc.add_paragraph(
    "Las contribuciones son bienvenidas. Por favor, crea un pull request o abre un issue para discutir cualquier cambio."
)

doc.add_heading('Licencia', level=2)
doc.add_paragraph(
    "Este proyecto está licenciado bajo la MIT License. Para más detalles, revisa el archivo `LICENSE`."
)

# Guardar el documento
file_path = "/mnt/data/README_E-Commerce_API.docx"
doc.save(file_path)

file_path
