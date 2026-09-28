# Despliegue

## Plataforma utilizada

El frontend del proyecto fue desplegado mediante **GitHub Pages**.

Repositorio:

- GitHub: `GitCristianRo/ecommerce`
- Frontend: React + Vite
- Backend: Spring Boot
- Base de datos: MySQL 8.0

## URL del frontend

El frontend publicado está disponible en:

`https://gitcristianro.github.io/ecommerce/`

## Proceso de despliegue

El despliegue se realiza mediante **GitHub Actions**.

El workflow ubicado en:

`.github/workflows/deploy.yml`

realiza las siguientes acciones:

1. Descarga el código del repositorio.
2. Configura Node.js.
3. Habilita y configura GitHub Pages.
4. Instala las dependencias del frontend.
5. Ejecuta `npm run build`.
6. Genera los archivos de producción en `frontend/dist`.
7. Publica esos archivos en GitHub Pages.

La configuración de Vite utiliza la ruta base:

`/ecommerce/`

para que los recursos del frontend funcionen correctamente dentro de GitHub Pages.

## Limitación del despliegue

GitHub Pages se utiliza únicamente para publicar el **frontend estático** del proyecto.

El backend desarrollado con Spring Boot y la base de datos MySQL continúan ejecutándose de forma local durante el desarrollo y las pruebas.

La arquitectura completa del proyecto es:

```text
Frontend React
     ↓
Axios
     ↓
API REST Spring Boot
     ↓
Service
     ↓
Repository
     ↓
MySQL
```

Sin embargo, GitHub Pages no ejecuta aplicaciones Spring Boot ni servidores MySQL.

Además, el frontend actual realiza las solicitudes a la API mediante:

`http://localhost:8080/api/productos`

Por esta razón, la versión publicada en GitHub Pages no puede establecer directamente la conexión con el backend y la base de datos que se encuentran en el computador local.

## Forma de demostrar el funcionamiento completo

Para demostrar la integración completa del MVP se debe ejecutar localmente:

- MySQL 8.0
- Backend Spring Boot en el puerto 8080
- Frontend React mediante Vite

De esta forma se puede demostrar el flujo:

```text
MySQL
  ↓
Spring Boot
  ↓
REST API
  ↓
Axios
  ↓
React
  ↓
Interfaz del usuario
```

El despliegue en GitHub Pages permite demostrar la publicación del frontend, mientras que las pruebas locales permiten demostrar la integración completa entre frontend, backend y base de datos.

## Alcance

No se incorporó un servicio externo para alojar el backend o la base de datos, ya que esto se encuentra fuera del alcance inicial definido para el MVP académico.
