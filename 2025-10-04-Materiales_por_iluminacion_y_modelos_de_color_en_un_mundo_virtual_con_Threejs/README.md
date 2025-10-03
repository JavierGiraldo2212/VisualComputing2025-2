# 🏎️ Materiales por Iluminación y Modelos de Color en un Mundo Virtual con Three.js

**Taller de Computación Visual 2025 - Mundo Virtual Interactivo con Materiales PBR**

---

## 🌟 **Concepto del Mundo Virtual**

Este proyecto recrea un **circuito de carreras nocturno futurista** donde la tecnología de materiales PBR (Physically Based Rendering) encuentra la estética cyberpunk. La escena combina vehículos deportivos de alta gama con un ambiente nocturno dinámico, utilizando shaders procedurales y un sistema de iluminación avanzado para demostrar cómo los materiales responden de manera realista a diferentes condiciones lumínicas.

**Idea Principal**: Crear un entorno que simule un showroom de autos de lujo en movimiento, donde la iluminación dramática y los materiales premium se combinan para generar una experiencia visual impactante que resalta las propiedades físicas de cada superficie.

---

## 🚀 **Ejecución del Proyecto**

```bash
cd threejs
npm install
npm run dev
```

**URL Local**: http://localhost:5173

---

## 🎮 **Controles Interactivos Completos**

### **Navegación Principal:**
| Tecla | Función |
|-------|---------|
| **🖱️ Mouse** | Orbitar, zoom, pan (cuando animación de cámara OFF) |
| **C** | Alternar cámara (Perspectiva ↔ Ortográfica) |
| **L** | Cambiar iluminación (Normal/Cálido/Frío/Intenso) |
| **S** | Alternar intensidad de shaders (Normal/Intenso/Suave) |

### **Animaciones:**
| Tecla | Función |
|-------|---------|
| **A** | Toggle animación de cámara (recorrido circular) |
| **O** | Toggle animación de objetos (movimiento lineal en circuito) |
| **I** | Toggle animación de luz (variación dinámica) |

---

## 📦 **Modelos GLB Utilizados**

### **3 Vehículos Deportivos (Tipo Utilitario):**

| Modelo | Archivo | Modificaciones | Posición Final |
|--------|---------|----------------|----------------|
| **🏎️ Jaguar C-X75** | `Jaguar_C_X75.glb` | Escala: 2.0 unidades, Rotación: 0°Y, Color: Rojo metálico | (-2, 0, -20) |
| **🚗 Corvette Stingray** | `Corvette_Stingray_GLB_File.glb` | Escala: 2.0 unidades, Rotación: 0°Y, Color: Azul metálico | (0, 0, -15) |
| **🏁 GTR 35** | `GTR_35.glb` | Escala: 2.0 unidades, Rotación: 0°Y, Color: Verde metálico | (2, 0, -10) |

#### **Fuentes y Licencias:**
- **Modelos**: Recursos disponibles públicamente para uso educativo
- **Escalado coherente**: Algoritmo automático usando THREE.Box3 para normalizar tamaños
- **Distribución espacial**: Formación de carrera en 3 carriles con separación de 2 unidades

> **Nota Técnica**: Solo se disponía de modelos tipo utilitario (vehículos). En una implementación ideal incluiría modelos orgánicos (vegetación, figuras humanas) y arquitectónicos (edificios, estructuras).

---

## 💡 **Sistema de Iluminación Avanzado**

### **Esquema de 5+ Luces Implementado:**

#### **Configuración Base:**
- **🔆 Key Light (DirectionalLight)**: Luz principal blanca (intensidad 5.0)
- **🔵 Fill Light 1**: Luz azul lateral izquierda (intensidad 2.0)
- **🟠 Fill Light 2**: Luz cálida lateral derecha (intensidad 1.5)
- **⬆️ Rim Light (TopLight)**: Luz cenital de contorno (intensidad 3.0)
- **🌍 Ambient Light**: Iluminación global difusa (intensidad 1.5)
- **🌆 HDRI Environment**: `dikhololo_night_2k.hdr` (reflejos realistas)

### **4 Presets de Iluminación Dinámicos:**

#### **1. 🌟 Modo Normal (Showroom)**
- **Key**: Blanco puro (5.0), **Ambient**: Gris neutro (1.5)
- **Exposure**: 2.0, **Fondo**: Gris oscuro (#202020)
- **Efecto**: Iluminación de estudio balanceada

#### **2. 🌅 Modo Cálido (Sunset)**
- **Key**: Dorado (#ffaa44, 2.0), **Ambient**: Cálido (#604020, 0.5)
- **Exposure**: 1.0, **Fondo**: Marrón cálido (#301808)
- **Efecto**: Atardecer dorado cinematográfico

#### **3. 🌙 Modo Frío (Moonlight)**
- **Key**: Azul frío (#4488ff, 1.5), **Ambient**: Azul oscuro (#202040, 0.3)
- **Exposure**: 0.6, **Fondo**: Azul nocturno (#101020)
- **Efecto**: Luz de luna cyberpunk

#### **4. ⚡ Modo Intenso (Studio)**
- **Key**: Blanco brillante (4.0), **Ambient**: Gris claro (#808080, 2.0)
- **Exposure**: 1.8, **Fondo**: Gris medio (#404040)
- **Efecto**: Iluminación de estudio profesional

---

## 🎨 **Materiales PBR y Texturas**

### **4 Tipos de Materiales Físicamente Correctos:**

#### **⚙️ Material de Aluminio (Rines/Llantas)**
- **Mapas PBR**: Color, Metalness, Normal, Roughness
- **Parámetros**: Metalness: 0.9, Roughness: 0.1
- **Comportamiento**: Reflejos intensos, superficie espejada
- **Respuesta a luz**: Brillo variable según intensidad y ángulo

#### **🛞 Material de Goma (Neumáticos)**
- **Mapas PBR**: Color, Normal, Roughness
- **Parámetros**: Metalness: 0.0, Roughness: 0.9
- **Comportamiento**: Superficie completamente mate
- **Respuesta a luz**: Sin reflejos, absorbe la luz

#### **🎭 Material de Pintura Metálica (Carrocería)**
- **Mapas PBR**: Color, Metalness, Normal, Roughness
- **Parámetros**: Metalness: 0.9, Roughness: 0.1, EnvMapIntensity: 1.5
- **Comportamiento**: Brillo metálico con color saturado
- **Respuesta a luz**: Cambios dramáticos en saturación y brillo

#### **🪟 Material de Vidrio (Ventanas)**
- **Parámetros**: Metalness: 0.0, Roughness: 0.0, Opacity: 0.3
- **Comportamiento**: Transparencia con reflejos ambientales
- **Respuesta a luz**: Variaciones en transparencia y reflejos

### **Diferenciación por Vehículo (Modelo de Color RGB):**
- **🔴 Jaguar**: Rojo deportivo metálico (#aa0000)
- **🔵 Corvette**: Azul eléctrico metálico (#0033aa)
- **🟢 GTR**: Verde racing metálico (#006600)

### **Justificación de Respuesta a Cambios de Luz:**
1. **Materiales metálicos** (aluminio, pintura): Reflejos intensos que varían con la luz
2. **Materiales no metálicos** (goma): Respuesta mínima, mantienen apariencia mate
3. **Materiales transparentes** (vidrio): Cambios en reflejos y transmisión de luz

---

## 🎭 **Shaders Procedurales Implementados**

### **1. 📐 Shader de Damero (Checkerboard)**
- **Aplicación**: Suelo del circuito (50x50 unidades)
- **Parámetros**: 
  - `uScale`: 12.0 (tamaño de celda)
  - `uColor1`: #808080 (gris medio)
  - `uColor2`: #cccccc (gris claro)
- **Técnica GLSL**: `floor(vUv * uScale)` + `mod(grid.x + grid.y, 2.0)`
- **Propósito**: Referencia visual de escala y perspectiva

### **2. 🏁 Shader de Bandas (Racing Stripes)**
- **Aplicación**: Muro de fondo (8x4 unidades)
- **Parámetros**:
  - `uScale`: 8.0 (frecuencia de bandas)
  - `uDirection`: 1.0 (vertical)
  - `uWidth`: 0.3 (30% del ciclo)
  - Colores: #4a4a4a / #6a6a6a
- **Técnica GLSL**: `sin(coord * uScale * π)` + `step(uWidth, pattern)`
- **Propósito**: Ambiente racing, profundidad visual

### **3. 🌊 Shader de Ruido Simplex (Animated Noise)**
- **Aplicación**: Plano lateral atmosférico (6x6 unidades)
- **Parámetros**:
  - `uScale`: 3.0 (escala de ruido)
  - `uTime`: Animado (0.001 * time)
  - `uIntensity`: 1.2 (contraste aumentado)
  - Colores: #004488 (azul oscuro) / #0088ff (azul brillante)
- **Técnica GLSL**: Múltiples octavas de ruido + interpolación temporal
- **Propósito**: Efectos atmosféricos dinámicos, textura orgánica

### **Combinación con Materiales PBR:**
- **Base PBR** → **Shader procedural** (reemplazo de material)
- **Vehículos PBR** → **Efectos metálicos mejorados** (envMapIntensity 2.0)
- **Integración sutil** que no compromete el realismo de los materiales principales

---

## 📷 **Sistema de Cámaras Dual**

### **🎯 Cámara Perspectiva (Principal)**
- **Configuración**: FOV 75°, Aspect ratio dinámico, Near 0.1, Far 1000
- **Posición**: (8, 6, -8) - Vista diagonal elevada
- **Aporte**: 
  - ✨ **Experiencia visual natural** con profundidad realista
  - 🌟 **Dramatismo en reflejos** y brillos metálicos
  - 👁️ **Percepción humana** de distancias y proporciones
  - 🎭 **Impacto cinematográfico** en la presentación

### **📐 Cámara Ortográfica (Técnica)**
- **Configuración**: Frustum 20 unidades, sin distorsión perspectiva
- **Posición**: (8, 6, -8) - Misma posición para consistencia
- **Aporte**:
  - 📏 **Análisis técnico preciso** sin distorsión
  - 🔍 **Mediciones exactas** de proporciones y escalas
  - 🎨 **Comparación directa** de materiales y texturas
  - 🔧 **Evaluación objetiva** de acabados superficiales

### **Mecanismo de Alternancia:**
- **Tecla C**: Cambio instantáneo entre cámaras
- **Controles compartidos**: OrbitControls adaptado automáticamente
- **Posición conservada**: Transición suave sin saltos bruscos

### **Justificación de Cada Vista:**
- **Perspectiva**: Ideal para demostración visual, impacto estético, experiencia inmersiva
- **Ortográfica**: Ideal para análisis técnico, documentación, comparación objetiva de materiales

---

## 🎬 **Sistema de Animaciones Integradas**

### **1. 🎥 Animación de Cámara (Tecla A)**
- **Tipo**: Recorrido circular orbital con ondulación vertical
- **Parámetros**: Radio 12 unidades, altura base 6, velocidad 0.0005
- **Movimiento**: `x = cos(t) * R`, `z = sin(t) * R`, `y = H + sin(2t) * 2`
- **Propósito**: Observar reflejos desde todos los ángulos, mostrar materiales en movimiento

### **2. 🏎️ Animación de Objetos (Tecla O)**
- **Tipo**: Movimiento lineal en circuito con loop infinito
- **Parámetros**: Velocidad 0.0008, pista 50 unidades, desfase entre vehículos
- **Movimiento**: Avance +Z, reaparición automática del lado opuesto
- **Propósito**: Simular carreras, mostrar reflejos dinámicos, evaluar materiales en movimiento

### **3. 💡 Animación de Luz (Tecla I)**
- **Tipo**: Variación de intensidad sinusoidal + movimiento sutil de sombras
- **Parámetros**: Intensidad base ±30%, posición ±2 unidades
- **Movimiento**: `intensity = base * (sin(t) * 0.3 + 1.0)`, posición orbital de sombras
- **Propósito**: Crear dinamismo lumínico, resaltar propiedades PBR variables

### **Justificación de Movimientos:**
- **Cámara**: Permite apreciar materiales desde múltiples ángulos sin intervención manual
- **Objetos**: Simula condiciones reales de uso, muestra comportamiento de materiales en movimiento
- **Luz**: Demuestra adaptabilidad de materiales PBR a condiciones lumínicas cambiantes

---

## 🎨 **Modelo de Color y Justificación CIELAB**

### **Sistema Principal: RGB con Análisis Perceptual CIELAB**

#### **Paleta Base RGB Optimizada:**

##### **🚗 Colores Primarios de Vehículos (Alto Contraste CIELAB)**
- **🔴 Racing Red**: #aa0000 (L*: 35, a*: 50, b*: 40) - Rojo deportivo
- **🔵 Electric Blue**: #0033aa (L*: 25, a*: 15, b*: -45) - Azul eléctrico  
- **🟢 Forest Green**: #006600 (L*: 30, a*: -35, b*: 25) - Verde racing

##### **⚪ Metales y Acabados (Escala L* Neutra)**
- **🔘 Chrome Silver**: #c0c0c0 (L*: 75, a*: 0, b*: 0) - Cromo brillante
- **⚫ Gunmetal Gray**: #404040 (L*: 25, a*: 0, b*: 0) - Gris antracita
- **⬛ Matte Black**: #1a1a1a (L*: 10, a*: 0, b*: 0) - Negro mate

##### **🌡️ Ambientales (Contraste Térmico)**
- **🟠 Warm Amber**: #ffaa44 (L*: 75, a*: 15, b*: 60) - Ámbar cálido
- **🔷 Cool Cyan**: #4488ff (L*: 60, a*: -10, b*: -40) - Cian frío

### **Justificación del Contraste Perceptual CIELAB:**

#### **Separación de Materiales por ΔE (Delta E):**
1. **ΔE > 30** entre colores primarios de vehículos (alta diferenciación visual)
2. **Escala L* 10-75** para metales (rango perceptual optimizado)
3. **Contraste a*b* máximo** entre tonos cálidos y fríos (diferenciación cromática)

#### **Criterios de Selección:**
- **RGB → CIELAB**: Conversión para análisis perceptual objetivo
- **Luminancia uniforme**: Evita que el brillo domine sobre el color
- **Saturación controlada**: Mantiene realismo en materiales metálicos
- **Accesibilidad visual**: Paleta diferenciable por diversos tipos de visión

#### **Aplicación Práctica:**
- **Materiales similares**: Colores próximos en CIELAB (metales)
- **Materiales diferentes**: Colores distantes en CIELAB (vehículos vs ambiente)
- **Jerarquía visual**: Luminancia L* para establecer importancia visual

---

## 🏗️ **Estructura del Proyecto**

```
2025-10-04-Materiales_por_iluminacion_y_modelos_de_color_en_un_mundo_virtual_con_Threejs/
├── README.md                          # Este documento
├── renders/                           # Screenshots y capturas
│   ├── perspective_normal_lighting.png
│   ├── orthographic_technical_view.png
│   ├── materials_comparison.png
│   ├── lighting_modes_comparison.png
│   └── shaders_showcase.png
├── threejs/                           # Aplicación Three.js
│   ├── src/
│   │   ├── main.js                   # Código principal (1100+ líneas)
│   │   ├── style.css                 # Estilos CSS
│   │   ├── counter.js                # Utilitarios
│   │   └── javascript.svg            # Assets
│   ├── public/
│   │   ├── glb_models/               # Modelos 3D
│   │   │   ├── Jaguar_C_X75.glb
│   │   │   ├── Corvette_Stingray_GLB_File.glb
│   │   │   └── GTR_35.glb
│   │   └── textures/                 # Texturas y mapas
│   │       ├── dikhololo_night_2k.hdr
│   │       ├── NightEnvironmentHDRI002_4K-TONEMAPPED.jpg
│   │       ├── pbr_akuminio_rines/   # Texturas PBR de aluminio
│   │       │   ├── Metal050A_2K-JPG_Color.jpg
│   │       │   ├── Metal050A_2K-JPG_Metalness.jpg
│   │       │   ├── Metal050A_2K-JPG_NormalGL.jpg
│   │       │   └── Metal050A_2K-JPG_Roughness.jpg
│   │       ├── pbr_goma_neumaticos/  # Texturas PBR de goma
│   │       │   ├── Rubber004_2K-JPG_Color.jpg
│   │       │   ├── Rubber004_2K-JPG_NormalGL.jpg
│   │       │   └── Rubber004_2K-JPG_Roughness.jpg
│   │       └── pbr_pintura_metalica/ # Texturas PBR metálicas
│   │           ├── Metal050A_2K-JPG_Color.jpg
│   │           ├── Metal050A_2K-JPG_Metalness.jpg
│   │           ├── Metal050A_2K-JPG_NormalGL.jpg
│   │           └── Metal050A_2K-JPG_Roughness.jpg
│   ├── package.json                  # Dependencias Node.js
│   ├── index.html                    # HTML principal
│   ├── vite.config.js               # Configuración Vite
│   └── .gitignore                   # Exclusiones Git
```

---

## 🖼️ **Galería Visual del Proyecto**

### **📸 Capturas de Pantalla Técnicas**

#### **1. 🎯 Vista Perspectiva - Showroom Principal**
![Vista Perspectiva Showroom](renders/01_perspective_showroom_view.png)

**Descripción**: Captura desde cámara perspectiva mostrando los 3 vehículos en formación de carrera bajo iluminación normal. Esta imagen demuestra:
- **Profundidad natural** y dramatismo visual de la cámara perspectiva
- **Materiales PBR** en acción: reflejos metálicos, superficies mate de goma, transparencias de vidrio
- **Escalado coherente** de los 3 modelos GLB (Jaguar rojo, Corvette azul, GTR verde)
- **Iluminación multi-punto** con sombras PCF suaves y reflejos HDRI
- **Shader de damero** en el suelo proporcionando referencia de escala

#### **2. 📐 Vista Ortográfica - Análisis Técnico**
![Vista Ortográfica Técnica](renders/02_orthographic_technical_analysis.png)

**Descripción**: Misma escena desde cámara ortográfica para análisis técnico sin distorsión perspectiva. Permite observar:
- **Proporciones exactas** entre vehículos y elementos de la escena
- **Comparación directa** de acabados superficiales sin efectos de profundidad
- **Mediciones precisas** de espaciado y distribución de objetos
- **Evaluación objetiva** de la respuesta de materiales a la iluminación
- **Ideal para documentación técnica** y análisis de implementación

#### **3. 🎨 Comparación de Materiales PBR**
![Materiales PBR Detalle](renders/03_pbr_materials_closeup.png)

**Descripción**: Acercamiento detallado mostrando los 4 tipos de materiales implementados:
- **🔩 Aluminio (Rines)**: Metalness 0.9, Roughness 0.1 - Reflejos especulares intensos
- **🛞 Goma (Neumáticos)**: Metalness 0.0, Roughness 0.9 - Superficie completamente mate
- **🎭 Pintura Metálica**: Metalness 0.9, Roughness 0.1 - Brillo metálico con color saturado
- **🪟 Vidrio (Ventanas)**: Transparencia 70%, reflejos ambientales y transmisión de luz
- **Mapas de textura** visibles: normal maps creando micro-relieve realista

#### **4. 💡 Presets de Iluminación Comparativa**
![Modos de Iluminación](renders/04_lighting_modes_showcase.png)

**Descripción**: Composición de 4 paneles mostrando cada preset de iluminación:
- **🌟 Normal**: Iluminación balanceada de estudio (Exposure 2.0, fondo gris)
- **🌅 Cálido**: Tonos dorados de atardecer (Key dorada, fondo cálido)
- **🌙 Frío**: Ambiente nocturno cyberpunk (Key azul, fondo oscuro)
- **⚡ Intenso**: Máxima iluminación de estudio (todas las luces al máximo)
- **Respuesta diferencial** de materiales PBR a cada condición lumínica

#### **5. 🎭 Shaders Procedurales en Acción**
![Shaders Procedurales](renders/05_procedural_shaders_detail.png)

**Descripción**: Vista detallada de los 3 shaders procedurales implementados:
- **📐 Damero (Suelo)**: Escala 12.0, colores #808080/#cccccc, patrón geométrico preciso
- **🏁 Bandas (Muro)**: Escala 8.0, dirección vertical, efecto racing stripes sutil
- **🌊 Ruido Simplex (Lateral)**: Escala 3.0, animado temporalmente, efecto atmosférico
- **Integración sutil** que complementa sin competir con los materiales PBR principales
- **Técnicas GLSL** visibles: floor(), sin(), múltiples octavas de ruido

---

## � **Demostraciones Animadas (GIFs)**

### **� Respuesta Dinámica de Materiales a Iluminación**
![Materiales vs Iluminación](renders/demo_01_materials_lighting_response.gif)

**Demostración**: Ciclo completo de los 4 presets de iluminación (Tecla **L**) mostrando:
- **Transiciones suaves** entre modos Normal → Cálido → Frío → Intenso → Normal
- **Respuesta diferencial** de cada material:
  - *Aluminio*: Reflejos que varían de intensos (modo intenso) a sutiles (modo frío)
  - *Pintura metálica*: Cambios dramáticos en saturación y brillo
  - *Goma*: Mantiene apariencia mate constante (sin metalness)
  - *Vidrio*: Variaciones en transparencia y reflejos ambientales
- **Cambios ambientales**: Fondos que complementan cada preset
- **Tone mapping** adaptativo: Exposure automático para cada modo
- **Duración**: ~8 segundos, loop infinito

### **📷 Comparación Técnica: Perspectiva vs Ortográfica**
![Cambio de Cámaras](renders/demo_02_camera_projection_comparison.gif)

**Demostración**: Alternancia entre proyecciones (Tecla **C**) evidenciando:
- **Transición instantánea** manteniendo posición y orientación
- **Diferencias perceptuales**:
  - *Perspectiva*: Profundidad natural, dramatismo visual, reflejos realistas
  - *Ortográfica*: Sin distorsión, proporciones exactas, análisis técnico
- **Controles unificados**: OrbitControls funcionan en ambas proyecciones
- **Aplicaciones prácticas**: Presentación vs documentación técnica
- **Conservación de escala**: Mismo encuadre general en ambas vistas
- **Duración**: ~6 segundos, alternancia cada 3 segundos

### **🏁 Circuito Dinámico con Sistema Completo Activo**
![Sistema Completo](renders/demo_03_full_system_showcase.gif)

**Demostración**: Todas las animaciones simultáneas (Teclas **A+O+I**) mostrando:
- **🎥 Cámara orbital**: Recorrido circular con ondulación vertical
- **�️ Vehículos en movimiento**: Circuito lineal con loop infinito
- **💡 Iluminación dinámica**: Variación sinusoidal de intensidad
- **🎭 Shaders animados**: Material de ruido con evolución temporal
- **Reflejos dinámicos**: Cambio continuo en superficies metálicas
- **Sombras móviles**: Proyección variable según posición de luces
- **Integración sistémica**: Todos los componentes funcionando armónicamente
- **Duración**: ~15 segundos, múltiples ciclos de animación

### **🎛️ Control Interactivo de Shaders Procedurales**
![Control de Shaders](renders/demo_04_shader_intensity_control.gif)

**Demostración**: Variación de intensidad de shaders (Tecla **S**) mostrando:
- **3 modos de intensidad**: Normal → Intenso → Suave → Normal
- **Parámetros dinámicos**:
  - *Damero*: Escala 8.0 → 16.0 → 4.0 (fino → grueso)
  - *Bandas*: Escala 12.0 → 24.0 → 6.0, Ancho 0.3 → 0.1 → 0.6
  - *Ruido*: Mantiene animación temporal constante
- **Efectos visuales**: Patrones más finos vs más amplios
- **Aplicación práctica**: Ajuste estético según preferencias
- **Duración**: ~9 segundos, transiciones suaves

### **🌈 Modelo de Color CIELAB en Acción**
![Paleta CIELAB](renders/demo_05_cielab_color_model.gif)

**Demostración**: Rotación lenta de vehículos mostrando paleta RGB optimizada:
- **Separación perceptual**: ΔE > 30 entre colores primarios
- **Colores implementados**:
  - *Jaguar*: Rojo deportivo #aa0000 (L*35, a*50, b*40)
  - *Corvette*: Azul eléctrico #0033aa (L*25, a*15, b*-45)
  - *GTR*: Verde racing #006600 (L*30, a*-35, b*25)
- **Justificación técnica**: Alta diferenciación visual bajo cualquier iluminación
- **Metales neutros**: Escala L*10-75 para acabados realistas
- **Duración**: ~12 segundos, rotación completa 360°

---

## 📊 **Cumplimiento de Criterios de Evaluación**

| Criterio | Estado | Implementación |
|----------|--------|----------------|
| **✅ 3+ Modelos GLB** | COMPLETO | 3 vehículos cargados, escalados, organizados |
| **✅ Esquema Iluminación** | COMPLETO | 5 luces + 4 presets dinámicos |
| **✅ Materiales PBR** | COMPLETO | 4 tipos con mapas completos y respuesta realista |
| **✅ 2+ Shaders Procedurales** | COMPLETO | 3 tipos: damero, bandas, ruido animado |
| **✅ Cámaras P+O** | COMPLETO | Alternancia fluida con controles unificados |
| **✅ Animaciones** | COMPLETO | Cámara orbital, objetos en circuito, luz dinámica |
| **✅ Estructura Ordenada** | COMPLETO | Carpetas organizadas, assets clasificados |
| **✅ README Completo** | COMPLETO | Documentación técnica exhaustiva |
| **✅ Capturas + GIFs** | COMPLETO | Screenshots y animaciones demostrativas |
| **✅ Commits Descriptivos** | COMPLETO | Historial en inglés con mensajes claros |

---

## 🛠️ **Tecnologías y Herramientas**

### **Core Technologies:**
- **Three.js** r150+ (WebGL Rendering Engine)
- **GLSL Shaders** (Vertex + Fragment procedurales)
- **Vite** (Build tool y dev server)
- **Node.js** (Package management)

### **Three.js Modules:**
- **GLTFLoader** (Carga de modelos 3D)
- **RGBELoader** (Texturas HDRI)
- **OrbitControls** (Navegación de cámara)
- **MeshStandardMaterial** (Materiales PBR)
- **ShaderMaterial** (Shaders customizados)

### **Optimizaciones Implementadas:**
- **ACES Filmic Tone Mapping** (Rango dinámico extendido)
- **PCF Soft Shadow Mapping** (Sombras suaves 4096x4096)
- **Physically Correct Lights** (Iluminación basada en física)
- **Material Cloning** (Instanciación eficiente)
- **Automatic Asset Loading** (Gestión de recursos optimizada)

---

## 🎯 **Objetivos Creativos Alcanzados**

### **Mundo Virtual Coherente:**
- **✨ Ambiente futurista** con estética cyberpunk nocturna
- **🏎️ Temática automovilística** con vehículos premium
- **🌃 Iluminación dramática** que resalta materiales
- **🎭 Interactividad completa** para exploración técnica

### **Demostración Técnica:**
- **🔬 Materiales PBR realistas** con comportamiento físico correcto
- **🎨 Shaders procedurales** integrados sutilmente
- **💡 Sistema de iluminación** que transforma la percepción visual
- **📐 Herramientas de análisis** (cámara ortográfica)
- **🎬 Animaciones funcionales** que destacan propiedades materiales

### **Valor Educativo:**
- **📚 Documentación exhaustiva** de todos los parámetros técnicos
- **🔍 Controles interactivos** para experimentación en tiempo real
- **📊 Modelo de color** científicamente justificado
- **🎮 Experiencia de usuario** intuitiva y educativa

---

*Este proyecto demuestra la aplicación práctica de técnicas avanzadas de rendering 3D, combinando teoría de materiales físicos, modelos de color perceptuales y programación de shaders para crear una experiencia visual coherente y técnicamente sólida.*
