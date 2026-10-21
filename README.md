# CAMPUSGO

**Campus Go** es la aplicación móvil institucional para estudiantes universitarios: reúne en un solo lugar la información que el alumno necesita **entre clases y entre edificios** — *¿dónde tengo clase ahora?, ¿cuándo es mi próxima clase?, ¿cómo llego a ese salón?, ¿en qué piso está?*.

APP DE DESARROLLO DE APLICACIÓNES MÓVIL — React Native · Expo · TypeScript

---

## 1. ¿Qué hace la app?

Campus Go funciona como el **companion app del estudiante**. En lugar de consultar el portal académico, preguntar en administración o recorrer el campus sin rumbo, el alumno abre la app y obtiene de inmediato:

| Necesidad del estudiante | Cómo la resuelve Campus Go |
| --- | --- |
| *"¿Cuál es mi clase actual y dónde es?"* | Tarjeta de **clase actual** en la pestaña *Hoy*: asignatura, salón, piso, profesor y horario. |
| *"¿Qué tengo después?"* | Listado **El resto del día** con hora de inicio, asignatura y ubicación resumida. |
| *"¿Cómo llego a ese salón?"* | Botón **¿Cómo llegar?** que abre el croquis del edificio y piso correspondiente, con el salón resaltado. |
| *"¿Cuál es mi horario completo de la semana?"* | Pestaña **Horario** con selector de día (Lu–Vi) y estado por clase: `COMPLETADA`, `CLASE ACTUAL`, `PRÓXIMA`. |
| *"¿Dónde está el salón LAB-204?"* | Pestaña **Mapa**: selector de **edificio → piso → salón** con croquis interactivo y buscador por código de salón, etiqueta, profesor o asignatura. |
| *"¿Me están avisando a tiempo?"* | **Banner de próxima clase** y **notificación simulada en pantalla de bloqueo**, con acceso directo a la ruta del salón. |
| *"¿Quiero ver la app de noche o con luz?"* | **Modo oscuro** conmutable desde el perfil, aplicado de forma consistente a todas las pantallas. |

En resumen: **Campus Go recorta el tiempo perdido entre clases** — localizar un salón, recordar el horario y recibir el aviso de la próxima clase sin depender de internet lento, portales institucionales o preguntas en pasillos.

---

## 2. ¿A quién va dirigida?

- **Estudiante universitario** (principal usuario): organización personal de su carga académica y orientación física dentro del campus.
- **Personal de soporte TI de la institución**: la app es también el punto de entrega de una identidad institucional digital y el lugar donde se configuran preferencias (alertas de clase, modo oscuro, sincronización del horario).
- **Equipo de desarrollo / mantenimiento**: el código está preparado para evolucionar de datos simulados a datos reales del sistema académico institucional.

---

## 3. Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Framework | **Expo SDK 57** (Continuous Native Generation) |
| UI base | **React Native 0.86.3** + **React 19.2.3** |
| Lenguaje | **TypeScript 6.0.3** (modo `strict`) |
| Navegación | **Expo Router 7** (`expo-router/entry`, `typedRoutes` activado) |
| Animaciones | **Reanimated 4.5.1** + **Worklets 0.10.1** |
| Iconografía | **@expo/vector-icons** (Feather, Ionicons, MaterialCommunityIcons) |
| Platformas | iOS · Android · Web (`output: "static"`) |
| Runtime | **Node 22.22.2** (ver `.nvmrc`) |

Dependencias de Expo instaladas: `expo-constants`, `expo-device`, `expo-font`, `expo-glass-effect`, `expo-image`, `expo-linking`, `expo-splash-screen`, `expo-status-bar`, `expo-symbols`, `expo-system-ui`, `expo-web-browser`.

> No hay backend, base de datos ni capa de red: la versión actual es un **prototipo funcional con datos simulados** en `src/constants/campus-data.ts`. Toda la lógica está preparada para sustituir ese módulo por un cliente HTTP sin tocar las pantallas.

---

## 4. Arquitectura

### 4.1. Principio rector

> **La navegación de la app es un state machine de dos estados, y las pantallas son funciones puras de presentación que reciben su estado por props.**

No hay Redux, Zustand ni Context global. El estado vive donde se usa, y el flujo se propaga hacia abajo con *props drilling* explícito. Esto mantiene el bundle pequeño, evita re-renders innecesarios y hace que cada pantalla sea legible de principio a fin.

```
Expo Router (src/app/)
        │
        ├── _layout.tsx        ThemeProvider + SplashScreen + Stack
        │        │
        │        ▼
        └── index.tsx          AppEntry: decide Login ⇄ Home según userEmail
                    │
                    ▼
              HomeScreen            ← contenedor de la sesión iniciada
                    │
    ┌───────────┬───────────┬───────────┐
    ▼           ▼           ▼           ▼
 HorarioView  MapaView   PerfilView  LockScreenModal
    │           │           │
    └───────────┴───────────┘
        consumen
              src/constants/campus-data.ts
```

### 4.2. Capas

1. **Presentación** — `src/screens/*.tsx`. Componentes de pantalla con `StyleSheet.create` para estilos locales, tipados con `interface Props`.
2. **Dominio / datos** — `src/constants/campus-data.ts`. Tipos (`ScheduleClass`, `RoomBlock`), catálogos (`DAYS`, `BUILDINGS`, `FLOORS`) y las estructuras de horario semanal y croquis por edificio/piso.
3. **Shell / navegación** — `src/app/_layout.tsx` (raíz de Expo Router) y `src/app/index.tsx` (entrada de la aplicación).
4. **Soporte visual** — `src/components/animated-icon.tsx` (overlay animado del splash con Reanimated).

### 4.3. Flujo de autenticación

`src/app/index.tsx` es el punto de control de sesión:

```tsx
const [userEmail, setUserEmail] = useState<string | null>(null);

if (userEmail) {
  return <HomeScreen email={userEmail} onLogout={() => setUserEmail(null)} />;
}
return <LoginScreen onLogin={(email) => setUserEmail(email)} />;
```

- `LoginScreen` valida **campos obligatorios** y **formato de correo** (debe contener `@`) mediante `Alert.alert`, y expone un acceso rápido **SSO** que entra con una cuenta institucional de demostración.
- `HomeScreen` recibe el correo y lo reenvía a `PerfilView`, donde se muestra la sesión activa.
- `onLogout` devuelve el estado a `null` y la aplicación vuelve al login.

### 4.4. Navegación interna por pestañas

`HomeScreen` es un **contenedor de pestañas** (`activeTab: 'Hoy' | 'Horario' | 'Mapa' | 'Perfil'`) con una barra inferior propia:

- El **estado de la pestaña activa** y el **tema** (`darkMode`) viven en `HomeScreen` y se pasan como props a las pantallas hijas.
- Cambiar de pestaña **no desmonta** la barra inferior ni el `SafeAreaView`: solo el contenido central se sustituye.
- `MapaView` se monta con una `key` derivada del destino (`${building}-${floor}-${roomCode}`) para forzar el remount y aplicar correctamente el salón seleccionado.

### 4.5. Flujo "de la clase al mapa"

Este es el recorrido principal de la app y atraviesa tres capas:

```tsx
// 1. HomeScreen o HorarioView detectan la selección de una clase
const handleSelectScheduleClass = (item: ScheduleClass) => {
  navigateToRoomInMap(item.building, item.floor, item.roomCode);
};

// 2. Se actualiza el destino y se cambia de pestaña
const navigateToRoomInMap = (building, floor, roomCode) => {
  setMapTarget({ building, floor, roomCode });
  setActiveTab('Mapa');
};

// 3. MapaView recibe el destino como props iniciales
<MapaView
  key={`${mapTarget.building}-${mapTarget.floor}-${mapTarget.roomCode}`}
  darkMode={darkMode}
  initialBuilding={mapTarget.building}
  initialFloor={mapTarget.floor}
  initialRoomCode={mapTarget.roomCode}
/>
```

`MapaView` usa esas props como estado inicial (`useState(initialBuilding)`, etc.), por lo que el salón queda seleccionado y resaltado en el croquis al llegar.

---

## 5. Puntos clave del código

### 5.1. Modelo de datos tipado (`src/constants/campus-data.ts`)

Todo el dominio está expressedo con tipos unions estrictos, lo que impide estados imposibles en compilación:

```ts
export type ClassStatus = 'COMPLETADA' | 'CLASE ACTUAL' | 'PRÓXIMA';
export type DayKey = 'Lu' | 'Ma' | 'Mi' | 'Ju' | 'Vi';

export interface ScheduleClass {
  id: string;
  day: DayKey;
  timeRange: string;      // "14:00 - 16:00"
  startTime: string;      // "14:00"  → badge de hora
  title: string;          // "Redes de Computadoras"
  professor: string;
  building: 'Edificio A' | 'Edificio B' | 'Edificio C';
  floor: 'Piso 1' | 'Piso 2' | 'Piso 3';
  roomCode: string;       // "LAB-204"
  locationLabel: string;  // "Edificio B, Salón LAB-204"
  shortLocation: string;  // "Piso 2 — Salón LAB-204"
  status: ClassStatus;
  directions: string;     // indicaciones verbales para llegar al salón
}

export interface RoomBlock {
  code: string;
  label: string;
  building: 'Edificio A' | 'Edificio B' | 'Edificio C';
  floor: 'Piso 1' | 'Piso 2' | 'Piso 3';
  professor: string;
  subject: string;
  directions: string;
}
```

Estructuras exportadas:

- `WEEKLY_SCHEDULE: Record<DayKey, ScheduleClass[]>` — horario semanal completo (Lu–Vi) con 4–5 clases por día.
- `FLOOR_CROQUIS: Record<Edificio, Record<Piso, RoomBlock[]>>` — croquis de 3 edificios × 3 pisos; cada piso es una lista de bloques (salones) con su profesor/asignatura asignada.
- `DAYS`, `BUILDINGS`, `FLOORS` — catálogos que alimentan los selectores de la UI.

### 5.2. Modo oscuro sin librerías externas

El tema no usa `useColorScheme()` del sistema: es un **toggle manual** que vive en `HomeScreen` y se propaga como `darkMode: boolean` a cada pantalla. Cada pantalla define su par de estilos (`styles.x` / `styles.xDark`) y los aplica con `style={[styles.x, darkMode && styles.xDark]}`.

```tsx
// HomeScreen (estado)
const [darkMode, setDarkMode] = useState(false);

// Cada pantalla
<View style={[styles.container, darkMode && styles.containerDark]}>
```

Ventajas: el usuario decide, el estado es determinista y no depende del sistema operativo.

### 5.3. Búsqueda por coincidencia en varias dimensiones

- **Hoy**: filtra las clases próximas por **asignatura**, **ubicación** o **profesor** (`title`, `shortLocation`, `professor` en minúsculas).
- **Mapa**: busca en **todos los edificios y pisos** a la vez (`code`, `label`, `professor`, `subject`); al encontrar coincidencia cambia automáticamente edificio, piso y salón seleccionado.

### 5.4. Notificación en pantalla de bloqueo simulada

`LockScreenModal` es un `<Modal>` a pantalla completa que **reproduce visualmente el lockscreen** del teléfono: fondo con una capa "ghost" (buscador y banner atenuados que simulan el desenfoque del wallpaper), reloj, fecha y una notificación de la próxima clase con dos acciones:

- **Desbloquear** → cierra el modal.
- **Ver ruta** → navega al salón en el mapa.

Se abre desde el banner de "Próxima clase en 12 min" (pestaña *Hoy*) o desde el botón del perfil.

### 5.5. Splash screen animado

`src/app/_layout.tsx` mantiene el splash nativo oculto (`SplashScreen.preventAutoHideAsync()`) y monta `AnimatedSplashOverlay`, que anima el icono con **Reanimated `Keyframe`** (escala + opacidad con `Easing.elastic`), calcula el factor de escala a partir del alto de pantalla y oculta el splash nativo cuando termina la animación.

### 5.6. Estilos

- `StyleSheet.create` por pantalla: estilos estáticos, sin re-creación en render.
- Paleta institucional consistente en todo el proyecto: índigo `#4f46e5` (acción), slate `#0f172a`/`#1e293b`/`#334155` (texto y superficies), verde `#059669` (ubicación), ámbar `#d97706` (alertas).
- `SafeAreaView` en las pantallas raíz para respetar el notch y la barra de gestos de iOS/Android.

### 5.7. Configuración de la app (`app.json`)

- `orientation: "portrait"`, `userInterfaceStyle: "automatic"`.
- Iconos adaptativos de Android (`foregroundImage`, `backgroundImage`, `monochromeImage`).
- Plugin `expo-splash-screen` con color `#208AEF` e imagen de 76 px.
- `experiments.typedRoutes` (rutas verificadas por TypeScript) y `reactCompiler` activado.

---

## 6. Estructura del proyecto

```
.
├── app.json                     # Configuración Expo (iconos, splash, plugins, experiments)
├── package.json                 # Dependencias y scripts
├── .nvmrc                       # Node 22.22.2
├── eslint.config.js             # ESLint plano con eslint-config-expo
├── tsconfig.json                # TypeScript (alias @/ → ./src)
├── gamestore-rules.json         # Reglas de publicación en tiendas
├── assets/
│   ├── logo.png, campus_go_logo.png
│   ├── profile_avatar.png, map_dog.png
│   ├── crop_hoy.png, crop_login.png
│   └── images/, expo.icon/      # Iconos por plataforma
├── scripts/reset-project.js     # Utilidad de plantilla Expo
├── DOCUMENTATION.md             # Documentación funcional por pantalla
├── CONTRIBUTING.md              # Guía de contribución
└── src/
    ├── app/                     # Rutas Expo Router
    │   ├── _layout.tsx          # Layout raíz: tema, splash, Stack
    │   ├── index.tsx            # Entrada: Login ⇄ Home
    │   └── explore.tsx          # Ruta heredada de la plantilla Expo
    ├── components/
    │   ├── animated-icon.tsx    # Overlay animado del splash (Reanimated)
    │   └── …                    # themed-text, themed-view, ui/, etc. (plantilla)
    ├── constants/
    │   ├── campus-data.ts       # ⭐ Dominio: tipos, horario semanal, croquis
    │   └── theme.ts             # Tokens de la plantilla Expo
    ├── hooks/                   # use-theme, use-color-scheme
    └── screens/
        ├── LoginScreen.tsx      # Autenticación (correo + contraseña / SSO)
        ├── HomeScreen.tsx       # Contenedor de pestañas + vista "Hoy"
        ├── HorarioView.tsx      # Horario semanal Lu–Vi
        ├── MapaView.tsx         # Croquis por edificio y piso
        ├── PerfilView.tsx       # Perfil, ajustes, modo oscuro, logout
        └── LockScreenModal.tsx  # Notificación simulada de pantalla de bloqueo
```

> `src/app/explore.tsx` y los componentes `themed-*`, `app-tabs*`, `ui/`, `hint-row`, `external-link`, `web-badge` provienen de la plantilla `create-expo-app` y **no participan del flujo de Campus Go**; son los candidatos naturales a eliminar cuando se consolide el producto.

---

## 7. Puesta en marcha

Requisitos: **Node 22.22.2** (usa `nvm use`) y un emulador/dispositivo con **Expo Go** o un development build.

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo
npx expo start        # abre Expo DevTools y el QR para Expo Go

# 3. Atajos
npx expo start --android
npx expo start --ios
npx expo start --web
```

### Calidad y verificación

```bash
npx expo lint          # ESLint (eslint-config-expo)
npx tsc --noEmit       # TypeScript en modo estricto
npx expo-doctor        # diagnóstico de dependencias y configuración
```

### Compilación nativa (opcional)

El proyecto usa **Continuous Native Generation**: las carpetas `ios/` y `android/` **no están en el repositorio** y no deben editarse a mano. Para builds nativos se usa EAS:

```bash
npx eas-cli build --profile development
npx eas-cli build --profile preview
```

---

## 8. Scripts disponibles

| Script | Descripción |
| --- | --- |
| `npm start` | Servidor de desarrollo de Expo. |
| `npm run android` / `npm run ios` / `npm run web` | Abre la app en la plataforma indicada. |
| `npm run lint` | `expo lint` — ESLint. |
| `npm run reset-project` | Restaura los archivos de plantilla de Expo (⚠️ sobrescribe archivos del proyecto). |

---

## 9. Estado actual y alcance

**Implementado (prototipo funcional)**

- Login con validaciones, modo SSO y acceso a la sesión.
- Pestaña *Hoy*: banner de próxima clase, tarjeta de clase actual, lista del resto del día y botón *¿Cómo llegar?*.
- Horario semanal con estados por clase.
- Mapa interactivo por edificio/piso/salón con buscador y croquis.
- Perfil con preferencias (alertas, modo oscuro, sincronización), versión de la app, logout.
- Simulación de notificación en pantalla de bloqueo con acceso a la ruta del salón.
- Modo oscuro completo en todas las pantallas.

**Pendiente (siguiente etapa)**

- Backend institucional: autenticación real (SSO/OAuth), consulta de horario y disponibilidad de salones en tiempo real.
- Notificaciones push reales (la pantalla de bloqueo es hoy una simulación en-app).
- Geolocalización y navegación turn-by-turn al salón.
- Caché offline del horario y persistencia de sesión.

**Nota de alcance:** los datos de `campus-data.ts` son **simulados y fijos**. Los nombres de asignaturas, profesores y salones son de demostración.

---

## 10. Convenciones de contribución

1. Todo componente nuevo debe tipar sus props con una `interface` exportada.
2. Estilos con `StyleSheet.create`; nada de estilos inline salvo valores dinámicos mínimos.
3. Respetar la paleta institucional y los pares de estilos claros/oscuros en toda pantalla nueva.
4. Verificar antes de abrir un PR: `npx tsc --noEmit` y `npx expo lint`.
5. Detalle funcional por pantalla en [`DOCUMENTATION.md`](./DOCUMENTATION.md); guías de contribución en [`CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## 11. Licencia

Distributed under the **Apache License 2.0** — ver [`LICENSE`](./LICENSE).

**Desarrollado por:** Isaac Castillo · Soporte TI: `soporte@campusgo.edu`
