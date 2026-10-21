# Campus Go - Documentación del Proyecto

## 1. Presentación del Proyecto
**Campus Go** es una aplicación móvil desarrollada con **React Native**, **Expo** y **TypeScript** diseñada para estudiantes universitarios. Permite gestionar horarios de clases, consultar salones en tiempo real y recibir alertas académicas inmediatas.

Desarrollado por: **Isaac Castillo**  
Contacto de Soporte TI: `soporte@campusgo.edu`

---

## 2. Pantallas Desarrolladas

### A. Login (`campus-go-login`) - [src/screens/LoginScreen.tsx](file:///Users/admin/AndroidStudioProjects/Campsgo/app/MiAppMovil/src/screens/LoginScreen.tsx)
- **Diseño visual:**
  - Header con logo y tipografía de la marca Campus Go.
  - Título *"¡Hola, estudiante!"* y descripción institucional.
  - Formulario con campos estilizados para **Correo Institucional** y **Contraseña**.
  - Botón interactivo para alternar visibilidad de contraseña (*Mostrar / Ocultar*).
  - Enlace de recuperación de contraseña: *"¿Olvidaste tu contraseña?"*.
  - Botón primario de *"Iniciar sesión"* en tono índigo institucional.
  - Separador *"O ACCEDE CON"* y acceso rápido mediante **Single Sign-On (SSO) Universitario**.
  - Créditos y enlace de soporte de TI al pie.
- **Validaciones implementadas:**
  1. **Campos obligatorios:** Si alguno de los campos está vacío, emite una alerta indicando que son obligatorios.
  2. **Formato de correo:** Comprueba la presencia del `@` institucional antes de proceder.

### B. Home (`campus-go-hoy`) - [src/screens/HomeScreen.tsx](file:///Users/admin/AndroidStudioProjects/Campsgo/app/MiAppMovil/src/screens/HomeScreen.tsx)
- **Diseño visual:**
  - Header superior con branding y barra de búsqueda rápida.
  - Banner de alerta de próxima clase (*"Próxima clase en 12 min"*).
  - Tarjeta principal: **Clase actual o siguiente** (*"Redes de Computadoras"*, Salón LAB-204, Ing. Alberto Martínez, horario y botón de acción *"¿Cómo llegar?"*).
  - Listado de clases para *"El resto del día"* con insignias horarias (*"16:00 Programación Avanzada"*, *"18:00 Bases de Datos"*).
  - Sección de usuario autenticado que muestra el correo recibido y botón para *"Cerrar sesión"*.
  - Barra de pestañas inferior (*Hoy*, *Horario*, *Mapa*, *Perfil*).

---

## 3. Flujo de Navegación y Demostración Funcional

- **Punto de Entrada:** [src/app/index.tsx](file:///Users/admin/AndroidStudioProjects/Campsgo/app/MiAppMovil/src/app/index.tsx).
- Gestiona el estado de autenticación:
  - Cuando el usuario no está autenticado, se renderiza `LoginScreen`.
  - Al completar la validación exitosa (o mediante SSO), se transmite el correo electrónico hacia `HomeScreen`.
  - Al pulsar en *"Cerrar sesión"*, se restablece el estado para regresar a la pantalla de Login.

---

## 4. Guía para la Grabación del Video (Máx. 5 minutos)

### Estructura sugerida:
1. **Presentación (0:00 - 0:45)**:
   - Saludo y nombre (Isaac Castillo).
   - Introducción a **Campus Go** y objetivo de la aplicación.
2. **Ejecución de la App (0:45 - 1:15)**:
   - Ejecutar `npx expo start` y mostrar la app en pantalla (emulador o navegador con `w`).
3. **Explicación del Código (1:15 - 3:00)**:
   - Mostrar `LoginScreen.tsx`: campos, estados (`useState`), validaciones de campos vacíos y formato de correo con `Alert.alert`.
   - Mostrar `HomeScreen.tsx`: recepción del correo del estudiante, componentes de clases y pestañas.
   - Mostrar la navegación y cómo se transfieren los datos.
4. **Demostración Funcional (3:00 - 4:30)**:
   - Probar validación con campos vacíos.
   - Probar validación con correo inválido.
   - Ingresar credenciales válidas y pulsar "Iniciar sesión" (o SSO) para ver la transición a Home.
   - Mostrar la pantalla Home con el correo activo y cerrar sesión.
5. **Cierre (4:30 - 5:00)**:
   - Conclusión breve.
