# Cámara Ionic – Galería de Fotos

Aplicación móvil desarrollada con **Ionic**, **Angular** y **Capacitor** que permite **tomar fotos con la cámara, guardarlas en el dispositivo y eliminarlas** desde una galería dentro de la app.

---

## Tabla de contenido

1. [Descripción](#-descripción)
2. [Funcionalidades](#-funcionalidades)
3. [Tecnologías utilizadas](#-tecnologías-utilizadas)
4. [Requisitos previos](#-requisitos-previos)
5. [Instalación y ejecución](#-instalación-y-ejecución)
6. [Capturas de pantalla](#-capturas-de-pantalla)
7. [Estructura del proyecto](#-estructura-del-proyecto)
8. [Cómo funciona](#-cómo-funciona)
9. [Autora](#-autora)

---

## Descripción

El objetivo de esta aplicación es crear una galería de fotos personal. El usuario puede abrir la cámara del dispositivo (o la webcam si se usa en el navegador), tomar una foto y verla inmediatamente en una cuadrícula. Las fotos quedan **guardadas** aunque se cierre o recargue la aplicación, y se pueden **eliminar** tocándolas.

---

## Funcionalidades

| Funcionalidad | Descripción |
|---|---|
| **Tomar fotos** | Botón flotante que abre la cámara del dispositivo |
| **Guardar fotos** | Cada foto se guarda como archivo en el almacenamiento del dispositivo |
| **Ver galería** | Las fotos se muestran en una cuadrícula, la más reciente primero |
| **Persistencia** | Las fotos siguen disponibles al cerrar o recargar la app |
| **Eliminar fotos** | Al tocar una foto aparece un menú para eliminarla |

---

## Tecnologías utilizadas

- **[Ionic Framework](https://ionicframework.com/)** – componentes de interfaz móvil
- **[Angular](https://angular.dev/)** – framework de la aplicación (con *signals*)
- **[Capacitor](https://capacitorjs.com/)** – acceso a funciones nativas del dispositivo:
  - `@capacitor/camera` → tomar fotos
  - `@capacitor/filesystem` → guardar y eliminar los archivos de imagen
  - `@capacitor/preferences` → guardar la lista de fotos
- **@ionic/pwa-elements** → permite usar la cámara desde el navegador
- **TypeScript**, **HTML** y **SCSS**

---

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión LTS)
- [Git](https://git-scm.com/)
- Ionic CLI:
  ```bash
  npm install -g @ionic/cli
  ```

---

## Instalación y ejecución

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Amy-Mishell06/CamaraIconic.git
   cd CamaraIconic
   ```

2. **Instalar las dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en el navegador**
   ```bash
   ionic serve
   ```
   La aplicación se abrirá en `http://localhost:8100`. El navegador pedirá permiso para usar la cámara.

4. **(Opcional) Ejecutar en un celular Android**
   ```bash
   ionic build
   npx cap add android
   npx cap sync
   npx cap open android
   ```
   Esto abre el proyecto en Android Studio, desde donde se puede instalar en el celular.

---

## Capturas de pantalla

### 1. Galería vacía
Al abrir la aplicación por primera vez se muestra un mensaje indicando que aún no hay fotos.

<img width="350" alt="image" src="https://github.com/user-attachments/assets/5341c575-a800-4070-abb3-fed86d0d6b83" />

### 2. Tomar una foto
Al presionar el botón de la cámara se abre la cámara para tomar la foto.

<img width="350" alt="image" src="https://github.com/user-attachments/assets/5f6f9c52-350f-4a6e-9532-e47c046e2ded" />

### 3. Foto guardada en la galería
La foto aparece inmediatamente en la galería.

<img width="350" alt="image" src="https://github.com/user-attachments/assets/3da32d4a-d0b1-4579-9ba5-64c8f534ca3a" />

### 4. Varias fotos
Las fotos se organizan en una cuadrícula, la más reciente primero.

<img width="350" alt="image" src="https://github.com/user-attachments/assets/f214d5bf-cc9f-4356-81af-92ca9a06004a" />

### 5. Eliminar una foto
Al tocar una foto aparece un menú con las opciones **Eliminar** y **Cancelar**.

<img width="350" alt="image" src="https://github.com/user-attachments/assets/98f0d246-5b33-4555-975a-0aa12df4fb17" />

### 6. Foto eliminada
La foto desaparece de la galería y también se borra del dispositivo.

<img width="350" alt="image" src="https://github.com/user-attachments/assets/661480a7-c63d-4a6f-983e-160e6e47f8d4" />

---

## Estructura del proyecto

```
src/app/
├── services/
│   └── photo.service.ts    → lógica para tomar, guardar, cargar y eliminar fotos
├── tab2/
│   ├── tab2.page.html      → vista de la galería y botón de la cámara
│   ├── tab2.page.ts        → carga las fotos y muestra el menú de eliminar
│   └── tab2.page.scss      → estilos de la galería
└── tabs/
    ├── tabs.page.html      → barra de pestañas inferior
    └── tabs.routes.ts      → rutas de la aplicación
```

---

## Cómo funciona

### Tomar y guardar una foto
En `photo.service.ts`, el método `addNewToGallery()`:
1. Abre la cámara con `Camera.getPhoto()`.
2. Convierte la foto a base64 y la guarda como archivo con `Filesystem.writeFile()`.
3. Agrega la foto a la lista y guarda la lista con `Preferences.set()`.

### Cargar las fotos al abrir la app
El método `loadSaved()` lee la lista guardada con `Preferences.get()` y vuelve a cargar cada imagen desde el almacenamiento, para que las fotos sigan disponibles después de cerrar la app.

### Eliminar una foto
Al tocar una foto, `tab2.page.ts` muestra un *Action Sheet* (menú inferior). Si el usuario elige **Eliminar**, el método `deletePicture()`:
1. Quita la foto de la lista.
2. Actualiza la lista guardada.
3. Borra el archivo de la imagen con `Filesystem.deleteFile()`.

### Actualización de la pantalla
La lista de fotos es un **signal** de Angular (`signal<UserPhoto[]>`). Cada vez que se agrega o elimina una foto, la galería se actualiza automáticamente.

---

## Autora

**Amy Mishell**
GitHub: [@Amy-Mishell06](https://github.com/Amy-Mishell06)
