# EquipoFutbol Backend API

API REST desarrollada para la aplicación **EquipoFutbol**, una plataforma web en React para explorar equipos de fútbol argentino, ver información detallada de cada club, buscar equipos, navegar mediante scroll infinito y guardar favoritos.

Este backend fue desarrollado con **Node.js**, **Express**, **Prisma ORM** y **PostgreSQL**, utilizando **Neon** como base de datos en la nube y **Vercel** para el deploy.

---

## Integrantes del grupo

* Tomás Sánchez
* Jorge González
* Axel Ostrovsky

Rol de coordinación / PM: Axel Ostrovsky

---

## Links del proyecto

### Repositorios

* Repositorio backend: https://github.com/ttomisanchezz/EquipoFutbol-backend.git
* Repositorio frontend: https://github.com/axelost2005/PWAtp2

### Deploys

* Backend deployado: https://equipo-futbol-backend.vercel.app
* Frontend deployado: https://pw-atp2.vercel.app

### Tablero de trabajo

* Tablero Linear: https://linear.app/pwaalta2026/project/tp-express-backend-rest-api-a738b4b2e06b/overview

---

## Descripción de la aplicación

**EquipoFutbol** es una aplicación web que permite explorar información de equipos del fútbol argentino.

Desde el frontend, el usuario puede:

* Ver un listado de equipos.
* Buscar equipos por nombre.
* Navegar mediante scroll infinito.
* Ver el detalle de cada equipo.
* Consultar información como país, liga, estadio, año de fundación, entrenador y títulos.
* Guardar equipos favoritos.

En el trabajo práctico anterior, el frontend trabajaba con datos locales. En este proyecto se reemplazó la fuente principal de datos por una **API REST propia**, conectada a una base de datos **PostgreSQL** real.

---

## Objetivo del backend

El objetivo del backend es proveer una API REST que permita al frontend consumir datos reales persistidos en una base de datos.

La API implementa:

* Servidor Node.js con Express.
* Conexión a PostgreSQL mediante Prisma ORM.
* Modelo de datos para equipos de fútbol.
* Migraciones de Prisma.
* Seed inicial con equipos argentinos.
* CRUD completo.
* Autenticación de usuarios con JWT: registro, login y logout, con contraseñas hasheadas con bcrypt.
* Endpoints de favoritos por usuario, protegidos con un middleware de autenticación JWT.
* Validación manual del body en `POST` y `PUT`.
* Manejo de errores.
* Códigos HTTP adecuados.
* Configuración de CORS para conectar frontend y backend.
* Deploy en Vercel.
* Base de datos en Neon.

---

## Tecnologías utilizadas

* Node.js
* Express
* Prisma ORM
* PostgreSQL
* Neon
* Vercel
* CORS
* dotenv
* Nodemon
* bcrypt (hash de contraseñas)
* jsonwebtoken (autenticación con JWT)

---

## Entidad principal

La entidad principal del proyecto es **Team**, que representa un equipo de fútbol.

### Modelo Team

```prisma
model Team {
    id               Int      @id @default(autoincrement())
    name             String
    category         String
    shortDescription String
    description      String
    country          String
    league           String
    stadium          String
    founded          Int
    coach            String
    titles           Int
    logo             String?
    image            String?
    createdAt        DateTime @default(now())
    updatedAt        DateTime @updatedAt
}
```

### Descripción de campos

| Campo            | Tipo     | Descripción                                    |
| ---------------- | -------- | ---------------------------------------------- |
| id               | Int      | Identificador único autoincremental            |
| name             | String   | Nombre del equipo                              |
| category         | String   | Categoría del equipo                           |
| shortDescription | String   | Descripción corta para las cards               |
| description      | String   | Descripción completa para la página de detalle |
| country          | String   | País del equipo                                |
| league           | String   | Liga en la que participa                       |
| stadium          | String   | Estadio del equipo                             |
| founded          | Int      | Año de fundación                               |
| coach            | String   | Entrenador                                     |
| titles           | Int      | Cantidad de títulos                            |
| logo             | String?  | Ruta del logo                                  |
| image            | String?  | Ruta de imagen complementaria                  |
| createdAt        | DateTime | Fecha de creación del registro                 |
| updatedAt        | DateTime | Fecha de última actualización                  |

---

## Entidades de usuarios y favoritos

A partir de la incorporación de autenticación, el modelo de datos suma dos entidades: **User** (usuarios registrados) y **Favorite** (relación entre un usuario y un equipo que marcó como favorito).

### Modelo User

```prisma
model User {
    id        Int      @id @default(autoincrement())
    name      String
    email     String   @unique
    password  String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    favorites Favorite[]
}
```

La contraseña se guarda **hasheada con bcrypt**, nunca en texto plano. El email es único.

### Modelo Favorite

```prisma
model Favorite {
    id        Int      @id @default(autoincrement())
    userId    Int
    teamId    Int
    createdAt DateTime @default(now())

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)
    team Team @relation(fields: [teamId], references: [id], onDelete: Cascade)

    @@unique([userId, teamId])
}
```

La restricción `@@unique([userId, teamId])` evita que un usuario guarde dos veces el mismo equipo. Si se borra un usuario o un equipo, sus favoritos se eliminan en cascada.

---

## Estructura del proyecto

```txt
EquipoFutbol-backend/
│
├── prisma/
│   ├── migrations/
│   ├── prismaClient.js
│   ├── schema.prisma
│   └── seed.js
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── favorites.controller.js
│   │   └── teams.controller.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── favorites.routes.js
│   │   └── teams.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── favorites.service.js
│   │   └── teams.service.js
│   │
│   ├── validations/
│   │   ├── auth.validation.js
│   │   └── team.validation.js
│   │
│   ├── app.js
│   └── index.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/ttomisanchezz/EquipoFutbol-backend.git
```

### 2. Entrar al proyecto

```bash
cd EquipoFutbol-backend
```

### 3. Instalar dependencias

```bash
npm install
```

---

## Variables de entorno

El proyecto utiliza variables de entorno para configurar la conexión a la base de datos, el puerto del servidor y la URL del frontend autorizada por CORS.

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

### `.env.example`

```env
# URL de conexión a PostgreSQL / Neon
DATABASE_URL=

# Puerto local del backend
PORT=3000

# URL del frontend autorizado por CORS
FRONTEND_URL=http://localhost:5173

# Clave secreta para firmar los JWT (usar al menos 32 caracteres aleatorios)
JWT_SECRET=tu_clave_secreta_de_al_menos_32_caracteres

# Tiempo de vida del token. Acepta formato de ms/vercel: 1d, 12h, 30m, etc.
JWT_EXPIRES_IN=1d
```

### Ejemplo de `.env` local

```env
DATABASE_URL="postgresql://usuario:password@host/neondb?sslmode=require"
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=una_clave_secreta_larga_y_aleatoria_de_32_caracteres
JWT_EXPIRES_IN=1d
```

> Las variables `JWT_SECRET` y `JWT_EXPIRES_IN` son **nuevas** y obligatorias para la autenticación. `JWT_SECRET` firma y verifica los tokens; `JWT_EXPIRES_IN` define su expiración.

Importante: el archivo `.env` real no debe subirse al repositorio porque contiene credenciales privadas.

---

## Prisma ORM

El proyecto utiliza **Prisma ORM** para comunicarse con la base de datos PostgreSQL.

### Generar Prisma Client

```bash
npx prisma generate
```

### Crear o aplicar migraciones en desarrollo

```bash
npx prisma migrate dev
```

### Aplicar migraciones en producción

```bash
npx prisma migrate deploy
```

También existe un script para producción:

```bash
npm run db:migrate:deploy
```

---

## Seed de datos iniciales

El proyecto incluye un seed con equipos del fútbol argentino para que la base de datos no quede vacía y se pueda probar correctamente el listado, el detalle, la búsqueda y el scroll infinito.

Para ejecutar el seed:

```bash
npm run db:seed
```

El seed carga equipos con datos como:

* Nombre.
* Categoría.
* Descripción corta.
* Descripción completa.
* País.
* Liga.
* Estadio.
* Año de fundación.
* Entrenador.
* Cantidad de títulos.
* Logo.
* Imagen.

---

## Ejecutar el backend localmente

### Modo desarrollo

```bash
npm run dev
```

El servidor queda disponible en:

```txt
http://localhost:3000
```

### Modo producción

```bash
npm start
```

---

## Scripts disponibles

```json
{
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "postinstall": "prisma generate",
    "db:seed": "prisma db seed",
    "db:migrate:deploy": "prisma migrate deploy"
}
```

### Descripción de scripts

| Script                    | Descripción                                                           |
| ------------------------- | --------------------------------------------------------------------- |
| npm run dev               | Ejecuta el backend en modo desarrollo con nodemon                     |
| npm start                 | Ejecuta el backend en modo producción                                 |
| npm run db:seed           | Ejecuta el seed de Prisma                                             |
| npm run db:migrate:deploy | Aplica las migraciones en producción                                  |
| postinstall               | Genera Prisma Client automáticamente después de instalar dependencias |

---

## Endpoints disponibles

URL base local:

```txt
http://localhost:3000
```

URL base producción:

```txt
https://equipo-futbol-backend.vercel.app
```

---

### Health check

Verifica que la API esté funcionando correctamente.

```http
GET /api/health
```

Ejemplo:

```bash
curl https://equipo-futbol-backend.vercel.app/api/health
```

Respuesta esperada:

```json
{
    "status": "ok",
    "message": "API funcionando correctamente"
}
```

---

### Obtener equipos

Devuelve el listado de equipos.

```http
GET /api/equipos
```

Ejemplo:

```bash
curl https://equipo-futbol-backend.vercel.app/api/equipos
```

También permite paginado:

```http
GET /api/equipos?page=1&limit=8
```

Y búsqueda por nombre:

```http
GET /api/equipos?search=boca&page=1&limit=8
```

Ejemplo:

```bash
curl "https://equipo-futbol-backend.vercel.app/api/equipos?page=1&limit=8"
```

Respuesta esperada:

```json
[
    {
        "id": 1,
        "name": "Boca Juniors",
        "category": "Primera División",
        "shortDescription": "Descripción corta del equipo.",
        "description": "Descripción completa del equipo.",
        "country": "Argentina",
        "league": "Liga Profesional Argentina",
        "stadium": "Estadio del equipo",
        "founded": 1905,
        "coach": "Entrenador del equipo",
        "titles": 35,
        "logo": "/logos/boca.png",
        "image": "/images/boca.jpg",
        "createdAt": "2026-06-17T00:00:00.000Z",
        "updatedAt": "2026-06-17T00:00:00.000Z"
    }
]
```

---

### Obtener equipo por ID

Devuelve un equipo específico.

```http
GET /api/equipos/:id
```

Ejemplo:

```bash
curl https://equipo-futbol-backend.vercel.app/api/equipos/1
```

Respuesta esperada:

```json
{
    "id": 1,
    "name": "Boca Juniors",
    "category": "Primera División",
    "shortDescription": "Descripción corta del equipo.",
    "description": "Descripción completa del equipo.",
    "country": "Argentina",
    "league": "Liga Profesional Argentina",
    "stadium": "Estadio del equipo",
    "founded": 1905,
    "coach": "Entrenador del equipo",
    "titles": 35,
    "logo": "/logos/boca.png",
    "image": "/images/boca.jpg",
    "createdAt": "2026-06-17T00:00:00.000Z",
    "updatedAt": "2026-06-17T00:00:00.000Z"
}
```

Si el equipo no existe:

```json
{
    "error": "Recurso no encontrado"
}
```

Si el ID es inválido:

```json
{
    "error": "ID inválido"
}
```

---

### Crear equipo

Crea un nuevo equipo.

```http
POST /api/equipos
```

Body de ejemplo:

```json
{
    "name": "Equipo Test",
    "category": "Primera División",
    "shortDescription": "Equipo creado para probar el endpoint POST.",
    "description": "Este equipo fue creado desde Postman para verificar que la API pueda guardar datos reales en PostgreSQL usando Prisma.",
    "country": "Argentina",
    "league": "Liga Profesional Argentina",
    "stadium": "Estadio Test",
    "founded": 1999,
    "coach": "Entrenador Test",
    "titles": 3,
    "logo": "/logos/equipo-test.png",
    "image": "/images/equipo-test.jpg"
}
```

Ejemplo con curl:

```bash
curl -X POST https://equipo-futbol-backend.vercel.app/api/equipos \
-H "Content-Type: application/json" \
-d '{
    "name": "Equipo Test",
    "category": "Primera División",
    "shortDescription": "Equipo creado para probar el endpoint POST.",
    "description": "Este equipo fue creado desde curl.",
    "country": "Argentina",
    "league": "Liga Profesional Argentina",
    "stadium": "Estadio Test",
    "founded": 1999,
    "coach": "Entrenador Test",
    "titles": 3,
    "logo": "/logos/equipo-test.png",
    "image": "/images/equipo-test.jpg"
}'
```

Respuesta esperada:

```json
{
    "id": 27,
    "name": "Equipo Test",
    "category": "Primera División",
    "shortDescription": "Equipo creado para probar el endpoint POST.",
    "description": "Este equipo fue creado desde curl.",
    "country": "Argentina",
    "league": "Liga Profesional Argentina",
    "stadium": "Estadio Test",
    "founded": 1999,
    "coach": "Entrenador Test",
    "titles": 3,
    "logo": "/logos/equipo-test.png",
    "image": "/images/equipo-test.jpg",
    "createdAt": "2026-06-17T00:00:00.000Z",
    "updatedAt": "2026-06-17T00:00:00.000Z"
}
```

Si el body es inválido:

```json
{
    "error": "Datos inválidos",
    "details": [
        {
            "field": "name",
            "message": "El nombre es obligatorio y no puede estar vacío."
        }
    ]
}
```

Si el equipo ya existe:

```json
{
    "error": "Equipo ya ingresado"
}
```

---

### Actualizar equipo

Actualiza un equipo existente.

```http
PUT /api/equipos/:id
```

Body de ejemplo:

```json
{
    "name": "Equipo Test Actualizado",
    "category": "Primera División",
    "shortDescription": "Equipo actualizado para probar el endpoint PUT.",
    "description": "Este equipo fue actualizado desde la API.",
    "country": "Argentina",
    "league": "Liga Profesional Argentina",
    "stadium": "Estadio Actualizado",
    "founded": 1999,
    "coach": "Entrenador Actualizado",
    "titles": 4,
    "logo": "/logos/equipo-test.png",
    "image": "/images/equipo-test.jpg"
}
```

Ejemplo con curl:

```bash
curl -X PUT https://equipo-futbol-backend.vercel.app/api/equipos/27 \
-H "Content-Type: application/json" \
-d '{
    "name": "Equipo Test Actualizado",
    "category": "Primera División",
    "shortDescription": "Equipo actualizado para probar el endpoint PUT.",
    "description": "Este equipo fue actualizado desde curl.",
    "country": "Argentina",
    "league": "Liga Profesional Argentina",
    "stadium": "Estadio Actualizado",
    "founded": 1999,
    "coach": "Entrenador Actualizado",
    "titles": 4,
    "logo": "/logos/equipo-test.png",
    "image": "/images/equipo-test.jpg"
}'
```

---

### Eliminar equipo

Elimina un equipo existente.

```http
DELETE /api/equipos/:id
```

Ejemplo:

```bash
curl -X DELETE https://equipo-futbol-backend.vercel.app/api/equipos/27
```

Respuesta esperada:

```json
{
    "message": "Equipo eliminado correctamente"
}
```

---

## Endpoints de autenticación

La autenticación usa **JWT**. El login devuelve un token que el cliente debe enviar en el header `Authorization: Bearer <token>` para acceder a las rutas protegidas (`GET /api/auth/me` y todos los favoritos).

---

### Registrar usuario

```http
POST /api/auth/register
```

Body esperado (la contraseña debe tener al menos 6 caracteres):

```json
{
    "name": "Juan Perez",
    "email": "juan@mail.com",
    "password": "secreta123"
}
```

Respuesta `201` (devuelve el usuario creado, sin la contraseña):

```json
{
    "id": 1,
    "name": "Juan Perez",
    "email": "juan@mail.com",
    "createdAt": "2026-06-29T00:00:00.000Z",
    "updatedAt": "2026-06-29T00:00:00.000Z"
}
```

Si el body es inválido (`400`):

```json
{
    "error": "Datos de usuario inválidos",
    "details": [
        { "field": "password", "message": "La contraseña es obligatoria y debe tener al menos 6 caracteres." }
    ]
}
```

Si el email o el nombre ya están en uso (`409`):

```json
{ "error": "Email ya ingresado" }
```

---

### Iniciar sesión

```http
POST /api/auth/login
```

Body esperado:

```json
{
    "email": "juan@mail.com",
    "password": "secreta123"
}
```

Respuesta `200` (token JWT + datos básicos del usuario):

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "name": "Juan Perez",
        "email": "juan@mail.com"
    }
}
```

Si faltan campos (`400`) o las credenciales son incorrectas (`401`):

```json
{ "error": "Email o contraseña incorrectos" }
```

---

### Cerrar sesión

```http
POST /api/auth/logout
```

Como el JWT es stateless, el cierre real se hace en el cliente borrando el token. Este endpoint confirma la acción.

Respuesta `200`:

```json
{ "message": "Sesión cerrada correctamente" }
```

---

### Perfil del usuario autenticado (ruta protegida)

```http
GET /api/auth/me
```

Requiere el header `Authorization: Bearer <token>`.

```bash
curl https://equipo-futbol-backend.vercel.app/api/auth/me \
-H "Authorization: Bearer <token>"
```

Respuesta `200`:

```json
{
    "id": 1,
    "name": "Juan Perez",
    "email": "juan@mail.com",
    "createdAt": "2026-06-29T00:00:00.000Z",
    "updatedAt": "2026-06-29T00:00:00.000Z"
}
```

Si no se envía token o es inválido/expiró (`401`):

```json
{ "error": "No autorizado: falta el token de autenticación" }
```

---

## Endpoints de favoritos

Todas las rutas de favoritos son **privadas**: requieren el header `Authorization: Bearer <token>`. El usuario se toma del token, no se envía en el body.

---

### Listar favoritos del usuario

```http
GET /api/favorites
```

Respuesta `200` (cada favorito incluye el equipo completo):

```json
[
    {
        "id": 5,
        "userId": 1,
        "teamId": 3,
        "createdAt": "2026-06-29T00:00:00.000Z",
        "team": {
            "id": 3,
            "name": "Boca Juniors",
            "category": "Primera División",
            "country": "Argentina",
            "league": "Liga Profesional Argentina",
            "stadium": "La Bombonera",
            "founded": 1905,
            "coach": "Entrenador",
            "titles": 35,
            "logo": "/logos/boca.png"
        }
    }
]
```

Si no hay token o es inválido (`401`):

```json
{ "error": "No autorizado: falta el token de autenticación" }
```

---

### Agregar un favorito

```http
POST /api/favorites
```

Body esperado:

```json
{ "teamId": 3 }
```

```bash
curl -X POST https://equipo-futbol-backend.vercel.app/api/favorites \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <token>" \
-d '{ "teamId": 3 }'
```

Respuesta `201` (el favorito creado con su equipo):

```json
{
    "id": 5,
    "userId": 1,
    "teamId": 3,
    "createdAt": "2026-06-29T00:00:00.000Z",
    "team": { "id": 3, "name": "Boca Juniors", "category": "Primera División" }
}
```

Otros códigos posibles:

* `400` → `{ "error": "teamId invalido" }`
* `404` → `{ "error": "Equipo no encontrado" }`
* `409` → `{ "error": "Equipo ya agregado a favoritos" }`

---

### Quitar un favorito

```http
DELETE /api/favorites/:teamId
```

```bash
curl -X DELETE https://equipo-futbol-backend.vercel.app/api/favorites/3 \
-H "Authorization: Bearer <token>"
```

Respuesta `200`:

```json
{ "message": "Favorito eliminado correctamente" }
```

Otros códigos posibles:

* `400` → `{ "error": "teamId invalido" }`
* `404` → `{ "error": "Favorito no encontrado" }`

---

## Validaciones implementadas

La API valida manualmente el body en los endpoints `POST` y `PUT`, sin utilizar librerías externas como Zod o Joi.

Se validan los siguientes puntos:

* Body vacío.
* Campos obligatorios.
* Strings vacíos.
* Año de fundación numérico.
* Año de fundación coherente.
* Títulos numéricos.
* Títulos no negativos.
* Formato de ruta para `logo`.
* Formato de ruta para `image`.

Ejemplo de respuesta con error de validación:

```json
{
    "error": "Datos inválidos",
    "details": [
        {
            "field": "name",
            "message": "El nombre es obligatorio y no puede estar vacío."
        },
        {
            "field": "founded",
            "message": "El año de fundación debe ser un número válido."
        }
    ]
}
```

---

## Códigos HTTP utilizados

| Caso                           | Código |
| ------------------------------ | ------ |
| Obtener recursos correctamente | 200    |
| Crear recurso correctamente    | 201    |
| Body inválido                  | 400    |
| ID inválido                    | 400    |
| No autorizado (token faltante o inválido) | 401 |
| Recurso no encontrado          | 404    |
| Recurso duplicado (equipo / email / favorito) | 409 |
| Error inesperado del servidor  | 500    |

---

## Integración con el frontend

El frontend React consume esta API mediante `fetch`.

En el frontend se configuró la variable:

```env
VITE_API_URL=https://equipo-futbol-backend.vercel.app
```

El backend utiliza la variable:

```env
FRONTEND_URL=https://pw-atp2.vercel.app
```

Esto permite que el frontend deployado pueda consumir la API respetando la configuración de CORS.

### Flujo general

```txt
Frontend React
    ↓
fetch a la API
    ↓
Backend Express
    ↓
Controller
    ↓
Service
    ↓
Prisma ORM
    ↓
PostgreSQL / Neon
```

### Flujo de ejemplo

Cuando el usuario entra al home del frontend:

```txt
https://pw-atp2.vercel.app
```

React ejecuta una solicitud al backend:

```txt
GET https://equipo-futbol-backend.vercel.app/api/equipos?page=1&limit=8
```

El backend recibe la request, consulta la base de datos usando Prisma y devuelve un JSON con los equipos.

---

## Deploy

### Backend

El backend está deployado en Vercel:

```txt
https://equipo-futbol-backend.vercel.app
```

Variables configuradas en Vercel para el backend:

```env
DATABASE_URL=postgresql://...
PORT=3000
FRONTEND_URL=https://pw-atp2.vercel.app
```

### Frontend

El frontend está deployado en Vercel:

```txt
https://pw-atp2.vercel.app
```

Variable configurada en Vercel para el frontend:

```env
VITE_API_URL=https://equipo-futbol-backend.vercel.app
```

---

## Base de datos

La base de datos utilizada es **PostgreSQL** mediante **Neon**.

El proyecto no utiliza arrays en memoria ni archivos JSON como base de datos. Toda la persistencia principal de los equipos se realiza en PostgreSQL usando Prisma ORM.

Los **usuarios** y los **favoritos** también se persisten en PostgreSQL (modelos `User` y `Favorite`). Los favoritos dejaron de guardarse en `localStorage` del navegador: ahora son por usuario y se obtienen siempre desde la API. Las contraseñas se almacenan hasheadas con bcrypt.

---

## Pruebas realizadas

Se probaron los siguientes endpoints:

* `GET /api/health`
* `GET /api/equipos`
* `GET /api/equipos?page=1&limit=8`
* `GET /api/equipos?search=boca&page=1&limit=8`
* `GET /api/equipos/:id`
* `POST /api/equipos`
* `PUT /api/equipos/:id`
* `DELETE /api/equipos/:id`

También se verificó:

* Backend funcionando localmente.
* Backend funcionando en producción.
* Base de datos Neon conectada.
* Seed ejecutado correctamente.
* Frontend local consumiendo backend local.
* Frontend local consumiendo backend deployado.
* Frontend deployado consumiendo backend deployado.
* Configuración correcta de CORS.
* Manejo de errores en frontend.
* Página de detalle consumiendo `GET /api/equipos/:id`.
* Buscador consumiendo `GET /api/equipos?search=...`.
* Scroll infinito consumiendo paginado desde la API.

---

## Estado final del proyecto

* API REST funcional.
* CRUD completo implementado.
* PostgreSQL conectado mediante Prisma.
* Base de datos desplegada en Neon.
* Seed ejecutado con datos iniciales.
* Backend deployado en Vercel.
* Frontend deployado en Vercel.
* Frontend consumiendo API real.
* Variables de entorno configuradas.
* CORS configurado.
* README documentado.
* Proyecto listo para entrega.
