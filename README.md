# GamePlan - Planificador de Quedadas 🎮

Aplicación web para planificar partidas en grupo con calendario interactivo, eventos en tiempo real y notificaciones.

## 🚀 Características

- 📅 **Calendario interactivo** - Navega meses y visualiza eventos
- 🎮 **Soporte de juegos** - Minecraft, Fortnite, A Way Out, It Takes Two
- 👥 **Gestor de jugadores** - Añade jugadores a cada partida
- ⏰ **Selector de hora** - Elige horas de inicio y fin
- 📝 **Eventos personalizados** - Crea quedadas sin predefinir juego
- 🔔 **Notificaciones** - Recibe alertas por email (EmailJS)
- ⚡ **Sincronización real-time** - Firebase Realtime Database
- 🌐 **Desplegado en GitHub Pages** - Acceso desde cualquier lugar

## 📁 Estructura del Proyecto

```
QuedadasCalendario/
├── index.html          # Entrada principal
├── env.js              # Variables de entorno
├── css/
│   └── styles.css      # Estilos completos
├── js/
│   ├── data.js         # Estado global
│   ├── main.js         # Inicialización
│   ├── utils/          # Funciones reutilizables
│   ├── components/     # Componentes UI
│   └── services/       # Servicios (Firebase, eventos)
└── .github/
    └── workflows/
        └── pages.yml   # Deployment automático
```

**Para detalles de componentes**: ver [COMPONENTS.md](COMPONENTS.md)

## 🛠 Tecnologías

- **Frontend**: HTML5, CSS3, Vanilla JS (ES6+)
- **Backend**: Firebase Realtime Database
- **Notificaciones**: EmailJS
- **Hosting**: GitHub Pages + GitHub Actions

## ⚙️ Configuración

1. Copia `env.js.example` a `env.js` y completa:

```javascript
window.__env = {
  FIREBASE_API_KEY:         'tu-clave-api',
  FIREBASE_AUTH_DOMAIN:     'tu-proyecto.firebaseapp.com',
  FIREBASE_DATABASE_URL:    'https://tu-proyecto.firebaseio.com',
  FIREBASE_PROJECT_ID:      'tu-proyecto-id',
  FIREBASE_STORAGE_BUCKET:  'tu-proyecto.appspot.com',
  FIREBASE_MESSAGING_SENDER_ID: 'tu-sender-id',
  FIREBASE_APP_ID:          'tu-app-id',
  
  EMAILJS_PUBLIC_KEY:   'tu-clave-emailjs',
  EMAILJS_SERVICE_ID:   'tu-servicio-id',
  EMAILJS_TEMPLATE_ID:  'tu-template-id',
  NOTIFY_EMAIL:         'tu-email@ejemplo.com'
};
```

2. Obtén credenciales en:
   - [Firebase Console](https://console.firebase.google.com)
   - [EmailJS Dashboard](https://dashboard.emailjs.com)

## 🌐 Despliegue

El proyecto se despliega automáticamente a GitHub Pages cuando hace push a `main`:

```bash
git push origin main
```

GitHub Actions:
1. Ejecuta el workflow `.github/workflows/pages.yml`
2. Compila assets
3. Despliega a rama `gh-pages`
4. Disponible en: `https://tu-usuario.github.io/QuedadasCalendario/`

## 📝 Desarrollo

### Agregar nuevo componente

1. Crear `js/components/miComponente.js`
2. Importar en `index.html` antes de `main.js`
3. Usar estado global de `data.js`

Ejemplo:

```javascript
// js/components/miComponente.js
function renderMiComponente() {
  document.getElementById('id-elemento').innerHTML = 'contenido';
}
```

### Modificar estilos

Todos los estilos están en `css/styles.css` con variables CSS para colores y temas.

## 🐛 Troubleshooting

**Errores de Firebase**: Verifica env.js con credenciales correctas
**Eventos no sincronizados**: Comprueba conexión a internet y permisos Firebase
**Emails no enviados**: Valida configuración EmailJS y template

## 📄 Licencia

Proyecto personal para gestión de quedadas. Siéntete libre de usar y modificar.

## 👤 Autor

Desarrollado como herramienta para organizar partidas en grupo.

---

**Última actualización**: 2024 | Estructura modular con componentes independientes
