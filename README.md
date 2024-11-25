# ComentaLibros

### Aplicación de Gestión de Usuarios y Libros

Este proyecto es una aplicación desarrollada en **Ionic Framework** y **Angular** que permite la gestión de usuarios y la integración con la API de OpenLibrary para buscar y cargar libros en el módulo "Mis Lecturas". La aplicación utiliza **SQLite** para el almacenamiento local y **Capacitor** para acceso a funcionalidades nativas.

---

## **Características principales**

1. **Gestión de Usuarios**:
   - Registro, edición y eliminación de usuarios.
   - Almacenamiento de datos en SQLite mediante operaciones CRUD.

2. **Módulo "Mis Lecturas"**:
   - Búsqueda de libros por título o ISBN a través de la API de OpenLibrary.
   - Visualización y carga de lecturas con detalles como título, autor, imagen y más.

3. **Seguridad y Acceso**:
   - Validación de usuarios a través de formularios reactivos.
   - Protección de rutas con **Route Guards**.

4. **Sincronización de Datos**:
   - Almacenamiento local de sesiones con Capacitor.
   - Verificación de conectividad para sincronización con la API.

---

## **Tecnologías y Herramientas**

- **Frontend**:
  - **Ionic Framework**: Diseño responsivo y nativo para interfaces gráficas.
  - **Angular**: Gestión del flujo de datos y lógica de la aplicación.
  
- **Backend**:
  - **API OpenLibrary**: Fuente de datos para la búsqueda de libros.

- **Base de Datos**:
  - **SQLite**: Almacenamiento local para usuarios y libros.

- **Integraciones**:
  - **Capacitor**: Acceso a funcionalidades nativas del dispositivo.

---

## **Instalación y Ejecución**

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/RivaldoDuoc/e1_rivaldo_uribe_s3.git
   cd e1_rivaldo_uribe_s3
Instalar dependencias:

bash
Copiar código
npm install
Ejecutar en un navegador:

bash
Copiar código
ionic serve
Ejecutar en un dispositivo:

Android/iOS:
bash
Copiar código
ionic capacitor add android
ionic capacitor run android
Estructura del Proyecto
src/app:
services: Lógica para consumir la API de OpenLibrary y operaciones con SQLite.
pages:
login: Página de autenticación.
mi-perfil: Gestión del perfil del usuario.
mis-lecturas: Módulo para gestionar libros cargados.
Uso de la Aplicación
Inicio de Sesión:

Inicia sesión o regístrate para acceder a las funcionalidades.
Gestión de Usuarios:

Edita tus datos desde la página "Mi Perfil".
Búsqueda de Libros:

En "Mis Lecturas", busca libros por título o ISBN y añádelos a tu biblioteca.
Contribuciones
¡Las contribuciones son bienvenidas! Si encuentras algún problema o tienes ideas para nuevas funciones, abre un issue o envía un pull request.

