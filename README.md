# GML Language Support for VS Code / Cursor

<p align="center">
  <img src="images/icon.png" alt="GML Logo" width="128" height="128">
</p>

Soporte completo para **GameMaker Language (GML)** en Visual Studio Code y Cursor, con resaltado de sintaxis, IntelliSense, documentación hover y reconocimiento de contexto de objetos.

## ✨ Características

### 🎨 Resaltado de Sintaxis
- Resaltado completo para archivos `.gml`
- Soporte para palabras clave, funciones, constantes, variables y más
- Comentarios de línea (`//`) y bloque (`/* */`)
- Strings, números (incluido hexadecimal `$FF00FF` y binario `0b1010`)
- Macros y regiones

### 📚 Documentación Hover
- Documentación detallada al pasar el cursor sobre funciones de GML
- Muestra la firma de la función, descripción, parámetros y valor de retorno
- Documentación para variables built-in y constantes
- **Muestra comentarios de variables definidas por el usuario**

### 🧠 IntelliSense / Autocompletado
- Autocompletado para más de 1000+ funciones de GML
- Autocompletado para variables built-in de instancia y globales
- Autocompletado para constantes (colores, teclas, eventos, etc.)
- Snippets insertados con parámetros tabulables
- **Reconocimiento de variables del contexto de objeto**

### 📂 Contexto de Objeto
Una característica especial que escanea los archivos dentro de carpetas de objetos:

```
objects/
  obj_player/
    Create_0.gml
    Step_0.gml
    Draw_0.gml
```

Las variables definidas en cualquier archivo `.gml` dentro de `objects/obj_player/` estarán disponibles para autocompletado e información hover en **todos** los archivos de ese objeto.

```gml
// En Create_0.gml
/// Velocidad máxima del jugador
max_speed = 5;

/// Puntos de vida actuales
hp = 100;
```

Ahora `max_speed` y `hp` aparecerán en autocompletado en `Step_0.gml` y `Draw_0.gml`, ¡con sus comentarios!

### 📝 Snippets
Snippets útiles para estructuras comunes:

| Prefijo | Descripción |
|---------|-------------|
| `if` | Sentencia if |
| `ifelse` | Sentencia if-else |
| `for` | Bucle for |
| `while` | Bucle while |
| `repeat` | Bucle repeat |
| `switch` | Sentencia switch |
| `with` | Sentencia with |
| `function` | Definición de función |
| `constructor` | Constructor |
| `try` | Bloque try-catch |
| `debug` / `print` | show_debug_message |
| `instance_create` | Crear instancia en capa |
| `draw_sprite` | Dibujar sprite |
| `region` | Región de código plegable |

### 🔍 Ayuda de Firma
Muestra los parámetros de función mientras escribes, indicando qué parámetro estás editando actualmente.

## 📦 Instalación

### Desde VSIX (Local)
1. Clona o descarga este repositorio
2. Abre una terminal en la carpeta del proyecto
3. Ejecuta:
   ```bash
   npm install
   npm run compile
   npm run package
   ```
4. Instala el archivo `.vsix` generado:
   - En VS Code: `Ctrl+Shift+P` → "Extensions: Install from VSIX..."
   - Selecciona el archivo `.vsix`

### Desde el Código Fuente (Desarrollo)
1. Clona el repositorio
2. Ejecuta `npm install`
3. Presiona `F5` para abrir una ventana de extensión de desarrollo

## ⚙️ Configuración

La extensión proporciona las siguientes opciones de configuración:

```json
{
  // Habilitar escaneo de variables de contexto de objeto
  "gml.enableObjectContextVariables": true,
  
  // Mostrar comentarios de variables en tooltips hover
  "gml.showVariableComments": true,
  
  // Mostrar documentación de funciones al hacer hover
  "gml.enableFunctionDocumentation": true
}
```

## 🎮 Uso con GameMaker Studio 2

### Estructura de Proyecto Recomendada
Para aprovechar al máximo el contexto de objetos, organiza tu proyecto así:

```
mi_proyecto/
├── objects/
│   ├── obj_player/
│   │   ├── Create_0.gml
│   │   ├── Step_0.gml
│   │   └── Draw_0.gml
│   ├── obj_enemy/
│   │   ├── Create_0.gml
│   │   └── Step_0.gml
│   └── ...
├── scripts/
│   ├── scr_utils.gml
│   └── ...
└── ...
```

### Documentar Variables
Añade comentarios antes de tus variables para que aparezcan en los tooltips:

```gml
/// @description Velocidad horizontal del jugador
/// Esta variable controla qué tan rápido se mueve el jugador
player_hspeed = 0;

// También funciona con comentarios simples
// Contador de monedas recogidas
coins = 0;
```

## 🔧 Comandos

| Comando | Descripción |
|---------|-------------|
| `GML: Rescan Workspace` | Re-escanea todos los archivos GML del workspace |
| `GML: Show Output` | Muestra el canal de salida de la extensión |

## 🗺️ Roadmap

- [ ] Ir a definición para funciones y variables
- [ ] Renombrar símbolo
- [ ] Encontrar todas las referencias
- [ ] Diagnósticos/Linting básico
- [ ] Soporte para archivos .yyp (proyecto de GameMaker)
- [ ] Integración con documentación online de GameMaker

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 🙏 Créditos

- Basado en el trabajo del [GameMaker Language Bundle para Sublime Text](https://github.com/nicjansma/sublime-gamemaker-language-bundle)
- Documentación de funciones extraída de la documentación oficial de GameMaker Studio 2

---

**¡Disfruta programando en GML!** 🎮

