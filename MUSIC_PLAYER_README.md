# 🎵 Music Player - DROPSLAND

Un reproductor de música completo integrado en DROPSLAND, inspirado en el diseño de [Radix UI Music App](https://www.radix-ui.com/themes/example-music-app).

## 🎧 Características

### Reproductor Principal
- **Controles completos**: Play/Pause, Anterior/Siguiente, Shuffle, Repeat
- **Barra de progreso**: Control de tiempo con seek
- **Control de volumen**: Slider de volumen con mute/unmute
- **Portada de álbum**: Visualización con animación de reproducción
- **Información de pista**: Título, artista y álbum
- **Lista de reproducción**: Vista expandible con todas las canciones

### Mini Player
- **Reproductor compacto**: Se muestra en la parte inferior cuando hay música reproduciéndose
- **Controles rápidos**: Play/Pause, Anterior/Siguiente
- **Barra de progreso**: Control de tiempo integrado
- **Información de pista**: Título y artista
- **Navegación**: Click para expandir al reproductor completo

### Tarjetas de Música
- **Diseño atractivo**: Tarjetas individuales para cada canción
- **Botón de reproducción**: Overlay con efecto hover
- **Botón de like**: Sistema de favoritos
- **Información completa**: Título, artista, álbum y duración

## 🎵 Canciones de Ejemplo

El reproductor incluye canciones de ejemplo inspiradas en el ejemplo de Radix UI:

1. **"The Less I Know the Better"** - Tame Impala (Currents)
2. **"Pieces"** - Villagers (Becoming a Jackal)
3. **"Cola"** - Arlo Parks (Super Sad Generation)
4. **"Do the Astral Plane"** - Flying Lotus (Cosmogramma)
5. **"Left Hand Free"** - Alt-J (This Is All Yours)

## 🛠️ Componentes

### `MusicPlayer`
- Reproductor principal completo
- Controles de reproducción
- Lista de reproducción expandible
- Control de volumen

### `MiniPlayer`
- Reproductor compacto
- Controles básicos
- Barra de progreso
- Navegación rápida

### `MusicCard`
- Tarjeta individual de canción
- Botón de reproducción con overlay
- Sistema de likes
- Información de pista

### `useMusicPlayer` Hook
- Estado global del reproductor
- Control de audio HTML5
- Gestión de pistas
- Eventos de audio

## 🎨 Diseño

### Colores
- **Fondo**: `bg-gray-800` con bordes `border-gray-700`
- **Acentos**: `bg-teal-600` para botones principales
- **Texto**: `text-white` para títulos, `text-gray-400` para subtítulos
- **Likes**: `text-red-500` para canciones favoritas

### Interacciones
- **Hover effects**: Transiciones suaves en botones y tarjetas
- **Animaciones**: Pulso en portada durante reproducción
- **Overlays**: Botones de reproducción con efecto hover
- **Estados activos**: Indicadores visuales para pista actual

## 📱 Integración

### En Home View
- **Sección "Popular Tracks"**: Tarjetas de música con reproducción directa
- **Reproductor expandible**: Botón para mostrar/ocultar reproductor completo
- **Estado global**: Sincronización entre componentes

### En Main App
- **Mini player**: Se muestra automáticamente cuando hay música reproduciéndose
- **Elemento de audio**: HTML5 audio element para reproducción real
- **Navegación**: El mini player permanece visible durante la navegación

## 🎯 Funcionalidades Técnicas

### Audio HTML5
- **Preload**: `metadata` para carga eficiente
- **Eventos**: `timeupdate`, `loadedmetadata`, `ended`
- **Controles**: `currentTime`, `volume`, `muted`

### Estado Global
- **Hook personalizado**: `useMusicPlayer` para estado compartido
- **Referencias**: `useRef` para control directo del audio
- **Sincronización**: Estado compartido entre todos los componentes

### Persistencia
- **Likes**: Estado local de canciones favoritas
- **Volumen**: Configuración de volumen persistente
- **Pista actual**: Estado de reproducción actual

## 🚀 Uso

### Reproducir una canción
1. Click en cualquier tarjeta de música en "Popular Tracks"
2. O usar el reproductor completo en la sección "Music Player"
3. El mini player aparecerá automáticamente

### Controlar la reproducción
- **Play/Pause**: Botón central en el reproductor
- **Anterior/Siguiente**: Botones laterales
- **Seek**: Arrastrar la barra de progreso
- **Volumen**: Slider de volumen en la parte inferior

### Gestionar favoritos
- Click en el corazón en cualquier tarjeta de música
- Los likes se guardan localmente
- Indicador visual en tarjetas y lista de reproducción

## 🔮 Futuras Mejoras

- **Integración con ICP**: Almacenamiento de música en canisters
- **Streaming real**: Reproducción de archivos de audio reales
- **Playlists**: Creación y gestión de listas de reproducción
- **Búsqueda**: Búsqueda de canciones y artistas
- **Recomendaciones**: Sistema de recomendaciones basado en gustos
- **Social features**: Compartir canciones y playlists
- **Analytics**: Estadísticas de reproducción para artistas

## 📄 Licencia

Este reproductor de música está integrado en DROPSLAND y sigue las mismas licencias del proyecto principal. 