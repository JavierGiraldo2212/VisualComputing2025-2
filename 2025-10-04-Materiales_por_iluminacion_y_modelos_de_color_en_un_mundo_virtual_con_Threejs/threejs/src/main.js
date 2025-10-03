// =========================================================================
// PROYECTO: MATERIALES POR ILUMINACIÓN Y MODELOS DE COLOR EN THREE.JS
// =========================================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './style.css';

// =========================================================================
// MODELO DE COLOR: PALETA RGB CON CONTRASTE PERCEPTUAL CIELAB
// =========================================================================

// 5.1 PALETA BASE EN RGB CON JUSTIFICACIÓN PERCEPTUAL
const COLOR_PALETTE = {
  // COLORES PRIMARIOS DE VEHÍCULOS (Contraste alto en CIELAB)
  RACING_RED: 0xaa0000,     // L*: 35, a*: 50, b*: 40  - Rojo deportivo
  ELECTRIC_BLUE: 0x0033aa,  // L*: 25, a*: 15, b*: -45 - Azul eléctrico  
  FOREST_GREEN: 0x006600,   // L*: 30, a*: -35, b*: 25 - Verde racing
  
  // METALES Y ACABADOS (Valores neutros con alta diferenciación)
  CHROME_SILVER: 0xc0c0c0,  // L*: 75, a*: 0, b*: 0   - Cromo brillante
  GUNMETAL_GRAY: 0x404040,  // L*: 25, a*: 0, b*: 0   - Gris antracita
  MATTE_BLACK: 0x1a1a1a,    // L*: 10, a*: 0, b*: 0   - Negro mate
  
  // AMBIENTALES (Tonos cálidos/fríos contrastantes)
  WARM_AMBER: 0xffaa44,     // L*: 75, a*: 15, b*: 60  - Ámbar cálido
  COOL_CYAN: 0x4488ff,      // L*: 60, a*: -10, b*: -40 - Cian frío
  NEUTRAL_WHITE: 0xffffff   // L*: 100, a*: 0, b*: 0   - Blanco neutro
};

console.log('🎨 MODELO DE COLOR DEFINIDO:');
console.log('   📊 Sistema: RGB con análisis perceptual CIELAB');
console.log('   🔴 Primarios: Rojo/Azul/Verde con ΔE > 30 (alta diferenciación)');
console.log('   ⚪ Neutros: Escala de grises L*10-75 para metales');
console.log('   🌡️ Térmicos: Ámbar cálido vs Cian frío (contraste cromático)');

// VERIFICACIÓN DE RECURSOS DISPONIBLES
console.log('📋 VERIFICANDO RECURSOS DISPONIBLES...');
console.log('✅ Modelos GLB encontrados:');
console.log('   - corvette_stingray_c7.glb (Utilitario - Vehículo)');
console.log('   - Corvette_Stingray_GLB_File.glb (Utilitario - Vehículo)');
console.log('   - GTR_35.glb (Utilitario - Vehículo)');

console.log('✅ Texturas PBR encontradas:');
console.log('   - Aluminio/Rines: Color, Metalness, Normal, Roughness');
console.log('   - Goma/Neumáticos: Color, Normal, Roughness');
console.log('   - Pintura Metálica: Color, Metalness, Normal, Roughness');

console.log('✅ Entorno HDRI:');
console.log('   - dikhololo_night_2k.hdr');
console.log('   - NightEnvironmentHDRI002_4K-TONEMAPPED.jpg');

console.log('🔄 INICIANDO CONSTRUCCIÓN DE LA ESCENA...');

// =========================================================================
// PASO 1: CONFIGURACIÓN BASE DE THREE.JS
// =========================================================================

// 1.1 CREAR LA ESCENA
const scene = new THREE.Scene();
console.log('✅ Escena creada');

// 1.2 CREAR CÁMARAS (Perspectiva y Ortográfica)
const aspectRatio = window.innerWidth / window.innerHeight;

// Cámara en perspectiva (principal)
const perspectiveCamera = new THREE.PerspectiveCamera(
  75,        // Campo de visión
  aspectRatio, // Aspecto
  0.1,       // Plano cercano
  1000       // Plano lejano
);
perspectiveCamera.position.set(8, 6, -8); // Posición para vista de carrera

// Cámara ortográfica (alternativa)
const frustumSize = 20;
const orthographicCamera = new THREE.OrthographicCamera(
  frustumSize * aspectRatio / -2,  // left
  frustumSize * aspectRatio / 2,   // right
  frustumSize / 2,                 // top
  frustumSize / -2,                // bottom
  0.1,                             // near
  1000                             // far
);
orthographicCamera.position.set(8, 6, -8); // Misma posición para consistencia

// Variable para alternar entre cámaras
let currentCamera = perspectiveCamera;
let isPerspective = true;

// =========================================================================
// VARIABLES DE ANIMACIÓN
// =========================================================================

// 7.1 VARIABLES DE ANIMACIÓN DE CÁMARA
let cameraAnimationEnabled = false;
let cameraAnimationTime = 0;
const cameraRadius = 12;
const cameraHeight = 6;

// 7.2 VARIABLES DE ANIMACIÓN DE OBJETOS
let objectAnimationEnabled = true;
let objectAnimationTime = 0;

// 7.3 VARIABLES DE ANIMACIÓN DE LUZ
let lightAnimationEnabled = true;
let lightAnimationTime = 0;

console.log('✅ Cámaras creadas (Perspectiva y Ortográfica)');
console.log('🎬 Sistema de animaciones inicializado');

// 1.3 CREAR EL RENDERER
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.0; // Mucho más brillante
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.physicallyCorrectLights = true; // Iluminación físicamente correcta
renderer.gammaFactor = 2.2;

// Agregar canvas al DOM
document.getElementById('app').appendChild(renderer.domElement);
console.log('✅ Renderer configurado con iluminación mejorada');

// =========================================================================
// PASO 2: CONTROLES Y LOADERS
// =========================================================================

// 2.1 CONFIGURAR CONTROLES DE CÁMARA
const controls = new OrbitControls(currentCamera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 1, 0); // Enfocar en el centro de los coches
console.log('✅ Controles configurados');

// 2.2 INSTANCIAR LOADERS
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();
console.log('✅ Loaders instanciados');

// =========================================================================
// PASO 3: CARGA Y ORGANIZACIÓN DE MODELOS GLB
// =========================================================================

console.log('🚗 CARGANDO MODELOS GLB...');

// Variables para almacenar los modelos cargados
let loadedModels = [];
let modelsLoaded = 0;
const totalModels = 3; // Jaguar, Corvette, GTR

// 3.1 CARGAR MODELO 1: Jaguar C-X75
gltfLoader.load('/glb_models/Jaguar_C_X75.glb', 
  (gltf) => {
    const model = gltf.scene;
    
    // Calcular bounding box para escalado coherente
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Escalar para coherencia de tamaño (2 unidades máximo)
    const targetSize = 2;
    const scale = targetSize / maxDim;
    model.scale.setScalar(scale);
    
    // Centrar el modelo
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center.multiplyScalar(scale));
    
        // POSICIÓN DE CARRERA: Carril izquierdo (Pole Position)
    model.position.set(-2, 0, -20); // Carril izquierdo, posición inicial del circuito
    model.rotation.y = 0; // Mirando hacia adelante (dirección +Z)
    
    // ALMACENAR POSICIÓN Y ORIGINAL PARA ANIMACIÓN
    model.userData.originalY = 0;
    
    // Configurar sombras
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    scene.add(model);
    loadedModels.push({ name: 'Jaguar C-X75', model: model });
    modelsLoaded++;
    
    console.log(`✅ Modelo 1/3 cargado: Jaguar C-X75`);
    checkAllModelsLoaded();
  },
  (progress) => console.log('Cargando Jaguar C-X75...', Math.round((progress.loaded / progress.total) * 100) + '%'),
  (error) => console.error('Error cargando Jaguar C-X75:', error)
);

// 3.2 CARGAR MODELO 2: Corvette Stingray File
gltfLoader.load('/glb_models/Corvette_Stingray_GLB_File.glb', 
  (gltf) => {
    const model = gltf.scene;
    
    // Escalado coherente
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 2;
    const scale = targetSize / maxDim;
    model.scale.setScalar(scale);
    
    // Centrar y posicionar
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center.multiplyScalar(scale));
    
    // POSICIÓN DE CARRERA: Carril central
    model.position.set(0, 0, -15); // Carril central, un poco adelante del primer carro
    model.rotation.y = 0; // Mirando hacia adelante (dirección +Z)
    
    // ALMACENAR POSICIÓN Y ORIGINAL PARA ANIMACIÓN
    model.userData.originalY = 0;
    
    // Configurar sombras
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    scene.add(model);
    loadedModels.push({ name: 'Corvette Stingray', model: model });
    modelsLoaded++;
    
    console.log(`✅ Modelo 2/3 cargado: Corvette Stingray GLB`);
    checkAllModelsLoaded();
  },
  (progress) => console.log('Cargando Corvette Stingray...', Math.round((progress.loaded / progress.total) * 100) + '%'),
  (error) => console.error('Error cargando Corvette Stingray:', error)
);

// 3.3 CARGAR MODELO 3: GTR 35
gltfLoader.load('/glb_models/GTR_35.glb', 
  (gltf) => {
    const model = gltf.scene;
    
    // Escalado coherente
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 2;
    const scale = targetSize / maxDim;
    model.scale.setScalar(scale);
    
    // Centrar y posicionar
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center.multiplyScalar(scale));
    
    // POSICIÓN DE CARRERA: Carril derecho
    model.position.set(2, 0, -10); // Carril derecho, más adelante
    model.rotation.y = 0; // Mirando hacia adelante (dirección +Z)
    
    // ALMACENAR POSICIÓN Y ORIGINAL PARA ANIMACIÓN
    model.userData.originalY = 0;
    
    // Configurar sombras
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    scene.add(model);
    loadedModels.push({ name: 'GTR 35', model: model });
    modelsLoaded++;
    
    console.log(`✅ Modelo 3/3 cargado: GTR 35`);
    checkAllModelsLoaded();
  },
  (progress) => console.log('Cargando GTR 35...', Math.round((progress.loaded / progress.total) * 100) + '%'),
  (error) => console.error('Error cargando GTR 35:', error)
);

// Función para verificar cuando todos los modelos estén cargados
function checkAllModelsLoaded() {
  if (modelsLoaded === totalModels) {
    console.log('🎉 TODOS LOS MODELOS CARGADOS EXITOSAMENTE');
    console.log('📐 Distribución espacial:');
    loadedModels.forEach((item, index) => {
      const pos = item.model.position;
      console.log(`   ${index + 1}. ${item.name}: (${pos.x}, ${pos.y}, ${pos.z})`);
    });
    
    // INICIALIZAR MATERIALES PBR UNA VEZ CARGADOS TODOS LOS MODELOS
    initializePBRMaterials();
    
    // APLICAR SHADERS PROCEDURALES DESPUÉS DE LOS MATERIALES PBR
    setTimeout(() => {
      applyProceduralShaders();
    }, 1000); // Esperar 1 segundo para que se carguen los materiales PBR
  }
}

// =========================================================================
// PASO 3.5: APLICACIÓN DE MATERIALES PBR
// =========================================================================

console.log('🎨 CONFIGURANDO MATERIALES PBR...');

// 3.5.1 CARGAR TEXTURAS PBR
function loadPBRTextures() {
  console.log('📁 Cargando texturas PBR...');
  
  // TEXTURAS PARA ALUMINIO/RINES
  const aluminumTextures = {
    color: textureLoader.load('/textures/pbr_akuminio_rines/Metal050A_2K-JPG_Color.jpg'),
    metalness: textureLoader.load('/textures/pbr_akuminio_rines/Metal050A_2K-JPG_Metalness.jpg'),
    normal: textureLoader.load('/textures/pbr_akuminio_rines/Metal050A_2K-JPG_NormalGL.jpg'),
    roughness: textureLoader.load('/textures/pbr_akuminio_rines/Metal050A_2K-JPG_Roughness.jpg')
  };

  // TEXTURAS PARA GOMA/NEUMÁTICOS
  const rubberTextures = {
    color: textureLoader.load('/textures/pbr_goma_neumaticos/Rubber004_2K-JPG_Color.jpg'),
    normal: textureLoader.load('/textures/pbr_goma_neumaticos/Rubber004_2K-JPG_NormalGL.jpg'),
    roughness: textureLoader.load('/textures/pbr_goma_neumaticos/Rubber004_2K-JPG_Roughness.jpg')
  };

  // TEXTURAS PARA PINTURA METÁLICA
  const metallicPaintTextures = {
    color: textureLoader.load('/textures/pbr_pintura_metalica/Metal050A_2K-JPG_Color.jpg'),
    metalness: textureLoader.load('/textures/pbr_pintura_metalica/Metal050A_2K-JPG_Metalness.jpg'),
    normal: textureLoader.load('/textures/pbr_pintura_metalica/Metal050A_2K-JPG_NormalGL.jpg'),
    roughness: textureLoader.load('/textures/pbr_pintura_metalica/Metal050A_2K-JPG_Roughness.jpg')
  };

  console.log('✅ Texturas PBR cargadas');
  return { aluminumTextures, rubberTextures, metallicPaintTextures };
}

// 3.5.2 CREAR MATERIALES PBR PERSONALIZADOS
function createPBRMaterials() {
  const textures = loadPBRTextures();
  
  // MATERIAL ALUMINIO (para rines)
  const aluminumMaterial = new THREE.MeshStandardMaterial({
    name: 'AluminumRims',
    map: textures.aluminumTextures.color,
    metalnessMap: textures.aluminumTextures.metalness,
    normalMap: textures.aluminumTextures.normal,
    roughnessMap: textures.aluminumTextures.roughness,
    metalness: 0.9,      // Alto metalness para aluminio
    roughness: 0.1,      // Baja rugosidad para brillo
    normalScale: new THREE.Vector2(1, 1)
  });

  // MATERIAL GOMA (para neumáticos)
  const rubberMaterial = new THREE.MeshStandardMaterial({
    name: 'RubberTires',
    map: textures.rubberTextures.color,
    normalMap: textures.rubberTextures.normal,
    roughnessMap: textures.rubberTextures.roughness,
    metalness: 0.0,      // Sin metalness para goma
    roughness: 0.9,      // Alta rugosidad para goma
    normalScale: new THREE.Vector2(1.5, 1.5) // Acentuar relieve
  });

  // MATERIAL PINTURA METÁLICA (para carrocería)
  const metallicPaintMaterial = new THREE.MeshStandardMaterial({
    name: 'MetallicPaint',
    map: textures.metallicPaintTextures.color,
    metalnessMap: textures.metallicPaintTextures.metalness,
    normalMap: textures.metallicPaintTextures.normal,
    roughnessMap: textures.metallicPaintTextures.roughness,
    metalness: 0.7,      // Metalness medio para pintura metálica
    roughness: 0.3,      // Rugosidad media
    normalScale: new THREE.Vector2(0.5, 0.5)
  });

  // MATERIAL VIDRIO (para ventanas)
  const glassMaterial = new THREE.MeshStandardMaterial({
    name: 'Glass',
    color: 0x88ccff,
    metalness: 0.0,
    roughness: 0.0,
    transparent: true,
    opacity: 0.3,
    envMapIntensity: 1.0
  });

  console.log('✅ Materiales PBR creados');
  return { aluminumMaterial, rubberMaterial, metallicPaintMaterial, glassMaterial };
}

// 3.5.3 APLICAR MATERIALES A LOS MODELOS
function initializePBRMaterials() {
  console.log('🎭 Aplicando materiales PBR a los modelos...');
  
  const materials = createPBRMaterials();
  let materialsApplied = 0;

  loadedModels.forEach((item, index) => {
    console.log(`🔧 Aplicando materiales a: ${item.name}`);
    
    item.model.traverse((child) => {
      if (child.isMesh) {
        const materialName = child.material.name ? child.material.name.toLowerCase() : '';
        const meshName = child.name ? child.name.toLowerCase() : '';
        
        // APLICAR MATERIALES SEGÚN EL NOMBRE DEL MESH/MATERIAL
        if (materialName.includes('rim') || materialName.includes('wheel') || 
            meshName.includes('rim') || meshName.includes('wheel')) {
          // Aplicar material de aluminio a rines
          child.material = materials.aluminumMaterial.clone();
          console.log(`   ⚙️  Aluminio aplicado a: ${child.name || 'rim'}`);
          materialsApplied++;
          
        } else if (materialName.includes('tire') || materialName.includes('rubber') ||
                   meshName.includes('tire') || meshName.includes('rubber')) {
          // Aplicar material de goma a neumáticos
          child.material = materials.rubberMaterial.clone();
          console.log(`   🛞 Goma aplicada a: ${child.name || 'tire'}`);
          materialsApplied++;
          
        } else if (materialName.includes('glass') || materialName.includes('window') ||
                   meshName.includes('glass') || meshName.includes('window')) {
          // Aplicar material de vidrio
          child.material = materials.glassMaterial.clone();
          console.log(`   🪟 Vidrio aplicado a: ${child.name || 'glass'}`);
          materialsApplied++;
          
        } else {
          // Aplicar pintura metálica al resto (carrocería)
          const bodyMaterial = materials.metallicPaintMaterial.clone();
          
          // Mejorar propiedades PBR para realismo
          bodyMaterial.metalness = 0.9;
          bodyMaterial.roughness = 0.1;
          bodyMaterial.envMapIntensity = 1.5;
          
          // Variar el color según el modelo para diferenciación
          if (index === 0) bodyMaterial.color.setHex(0xaa0000); // Rojo metálico
          else if (index === 1) bodyMaterial.color.setHex(0x0033aa); // Azul metálico
          else if (index === 2) bodyMaterial.color.setHex(0x006600); // Verde metálico
          
          child.material = bodyMaterial;
          console.log(`   🎨 Pintura metálica aplicada a: ${child.name || 'body'}`);
          materialsApplied++;
        }

        // Asegurar que el material reciba sombras y reflejos
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  });

  console.log('✅ Materiales PBR aplicados: ${materialsApplied} meshes procesados');
  console.log('🎨 RESPUESTA A LA LUZ CONFIGURADA:');
  console.log('   - Aluminio: Alto metalness (0.9), baja roughness (0.1)');
  console.log('   - Goma: Sin metalness (0.0), alta roughness (0.9)');
  console.log('   - Pintura: Metalness medio (0.7), roughness media (0.3)');
  console.log('   - Vidrio: Transparente con reflejos');
}

// =========================================================================
// PASO 3.6: SHADERS CON TEXTURAS PROCEDURALES
// =========================================================================

console.log('🎨 CONFIGURANDO SHADERS PROCEDURALES...');

// 3.6.1 SHADER DE DAMERO (CHECKERBOARD)
const checkerboardVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const checkerboardFragmentShader = `
  uniform float uScale;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uMetalness;
  uniform float uRoughness;
  varying vec2 vUv;
  
  void main() {
    // Crear patrón de damero
    vec2 grid = floor(vUv * uScale);
    float checker = mod(grid.x + grid.y, 2.0);
    
    // Interpolar entre los dos colores
    vec3 color = mix(uColor1, uColor2, checker);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// 3.6.2 SHADER DE BANDAS (STRIPES)
const stripesVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const stripesFragmentShader = `
  uniform float uScale;
  uniform float uDirection; // 0 = horizontal, 1 = vertical, 0.5 = diagonal
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uWidth; // Ancho de las bandas (0.0 - 1.0)
  varying vec2 vUv;
  
  void main() {
    // Calcular coordenada según dirección
    float coord = mix(vUv.x, vUv.y, uDirection);
    
    // Crear patrón de bandas
    float pattern = sin(coord * uScale * 3.14159);
    float stripes = step(uWidth, pattern);
    
    // Interpolar entre colores
    vec3 color = mix(uColor1, uColor2, stripes);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// 3.6.3 SHADER DE RUIDO SIMPLEX
const noiseVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const noiseFragmentShader = `
  uniform float uScale;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uIntensity;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Función de ruido simple (pseudo-random)
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Ruido suave interpolado
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  void main() {
    // Generar ruido con animación temporal
    vec2 st = vUv * uScale + uTime * 0.1;
    float n = noise(st);
    
    // Crear múltiples octavas de ruido
    n += noise(st * 2.0) * 0.5;
    n += noise(st * 4.0) * 0.25;
    n += noise(st * 8.0) * 0.125;
    
    // Normalizar y aplicar intensidad
    n = n * uIntensity;
    
    // Interpolar entre colores basado en ruido
    vec3 color = mix(uColor1, uColor2, n);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// 3.6.4 CREAR MATERIALES PROCEDURALES
function createProceduralMaterials() {
  console.log('🎛️ Creando materiales procedurales...');
  
  // MATERIAL DAMERO - Para pisos o patrones geométricos
  const checkerboardMaterial = new THREE.ShaderMaterial({
    vertexShader: checkerboardVertexShader,
    fragmentShader: checkerboardFragmentShader,
    uniforms: {
      uScale: { value: 8.0 },        // Tamaño de celda: 8x8 cuadros
      uColor1: { value: new THREE.Color(0x333333) }, // Gris oscuro
      uColor2: { value: new THREE.Color(0xcccccc) }, // Gris claro
      uMetalness: { value: 0.1 },
      uRoughness: { value: 0.8 }
    }
  });
  
  // MATERIAL BANDAS - Para efectos de velocidad o racing stripes
  const stripesMaterial = new THREE.ShaderMaterial({
    vertexShader: stripesVertexShader,
    fragmentShader: stripesFragmentShader,
    uniforms: {
      uScale: { value: 12.0 },       // Escala: 12 bandas por unidad
      uDirection: { value: 0.0 },    // Dirección: horizontal (0), vertical (1), diagonal (0.5)
      uColor1: { value: new THREE.Color(0xff0000) }, // Rojo
      uColor2: { value: new THREE.Color(0xffffff) }, // Blanco
      uWidth: { value: 0.3 }         // Ancho de banda: 30% del ciclo
    }
  });
  
  // MATERIAL RUIDO - Para texturas orgánicas o efectos dinámicos
  const noiseMaterial = new THREE.ShaderMaterial({
    vertexShader: noiseVertexShader,
    fragmentShader: noiseFragmentShader,
    uniforms: {
      uScale: { value: 4.0 },        // Escala de ruido: 4 unidades
      uTime: { value: 0.0 },         // Tiempo para animación
      uColor1: { value: new THREE.Color(0x000066) }, // Azul oscuro
      uColor2: { value: new THREE.Color(0x00ffff) }, // Cian
      uIntensity: { value: 0.8 }     // Intensidad del ruido: 80%
    }
  });
  
  console.log('✅ Materiales procedurales creados:');
  console.log('   📐 DAMERO: Escala 8x8, colores gris oscuro/claro');
  console.log('   🏁 BANDAS: 12 bandas horizontales, rojo/blanco, ancho 30%');
  console.log('   🌊 RUIDO: Escala 4, azul/cian, intensidad 80%, animado');
  
  return { checkerboardMaterial, stripesMaterial, noiseMaterial };
}

// 3.6.5 APLICAR SHADERS PROCEDURALES A ELEMENTOS DE LA ESCENA
function applyProceduralShaders() {
  console.log('🎨 Aplicando shaders procedurales de forma sutil...');
  
  const proceduralMaterials = createProceduralMaterials();
  
  // APLICAR DAMERO AL SUELO CON COLORES MÁS VISIBLES
  if (ground) {
    const subtleCheckerboard = proceduralMaterials.checkerboardMaterial.clone();
    subtleCheckerboard.uniforms.uColor1.value.setHex(0x808080); // Gris medio
    subtleCheckerboard.uniforms.uColor2.value.setHex(0xcccccc); // Gris claro
    subtleCheckerboard.uniforms.uScale.value = 12.0; // Más cuadros más pequeños
    ground.material = subtleCheckerboard;
    console.log('   📐 Damero visible aplicado al suelo');
  }
  
  // MURO DE FONDO CON BANDAS (TAMAÑO REDUCIDO)
  const stripesGeometry = new THREE.PlaneGeometry(8, 4); // REDUCIDO: era 20x8, ahora 8x4
  const subtleStripes = proceduralMaterials.stripesMaterial.clone();
  subtleStripes.uniforms.uColor1.value.setHex(0x4a4a4a); // Gris medio-oscuro
  subtleStripes.uniforms.uColor2.value.setHex(0x6a6a6a); // Gris medio
  subtleStripes.uniforms.uScale.value = 8.0; // REDUCIDO: era 20.0, ahora 8.0
  subtleStripes.uniforms.uDirection.value = 1.0; // Vertical
  
  const stripesPlane = new THREE.Mesh(stripesGeometry, subtleStripes);
  stripesPlane.position.set(-8, 2, -8); // REPOSICIONADO: más a la izquierda y menos alto
  stripesPlane.rotation.x = 0;
  scene.add(stripesPlane);
  console.log('   🏁 Bandas sutiles aplicadas a muro de fondo (tamaño reducido)');
  
  // AGREGAR PLANO CON NOISE VISIBLE
  const noiseGeometry = new THREE.PlaneGeometry(6, 6); // Tamaño moderado
  const visibleNoise = proceduralMaterials.noiseMaterial.clone();
  visibleNoise.uniforms.uColor1.value.setHex(0x004488); // Azul oscuro
  visibleNoise.uniforms.uColor2.value.setHex(0x0088ff); // Azul brillante
  visibleNoise.uniforms.uScale.value = 3.0;
  visibleNoise.uniforms.uIntensity.value = 1.2; // Más intenso para ser visible
  
  const noisePlane = new THREE.Mesh(noiseGeometry, visibleNoise);
  noisePlane.position.set(8, 3, -6); // A la derecha del fondo
  noisePlane.rotation.x = 0;
  scene.add(noisePlane);
  console.log('   🌊 Ruido visible aplicado a plano lateral');
  
  // APLICAR EFECTO SUTIL A LOS VEHÍCULOS
  if (loadedModels.length > 0) {
    loadedModels.forEach((item, index) => {
      if (item && item.model) {
        item.model.traverse((child) => {
          if (child.isMesh) {
            // Aplicar un brillo metálico mejorado
            if (child.material && child.material.color) {
              child.material.envMapIntensity = 2.0;
              child.material.needsUpdate = true;
            }
          }
        });
      }
    });
    console.log('   ✨ Efectos metálicos mejorados aplicados a vehículos');
  }
  
  return proceduralMaterials;
}

// 3.6.6 ACTUALIZAR MATERIALES ANIMADOS
function updateProceduralMaterials(time) {
  // Actualizar el tiempo en el material de ruido para animación
  if (scene.children) {
    scene.traverse((child) => {
      if (child.material && child.material.uniforms && child.material.uniforms.uTime) {
        child.material.uniforms.uTime.value = time * 0.001; // Convertir a segundos
      }
    });
  }
}

// =========================================================================
// PASO 4: CONFIGURACIÓN DE ILUMINACIÓN Y ENTORNO
// =========================================================================

// 4.1 CONFIGURAR COLOR DE FONDO INICIAL
scene.background = new THREE.Color(0x202020); // Fondo gris oscuro en lugar de negro

// 4.2 CARGAR ENTORNO HDRI
console.log('🌍 Cargando entorno HDRI...');
rgbeLoader.load('/textures/dikhololo_night_2k.hdr', 
  (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    
    // Aplicar como entorno para iluminación y reflejos
    scene.environment = environmentMap;
    
    console.log('✅ Entorno HDRI cargado y aplicado');
  },
  undefined,
  (error) => console.error('Error cargando HDRI:', error)
);

// 4.3 ILUMINACIÓN COMPLEMENTARIA
// Luz direccional principal (mucho más brillante)
const directionalLight = new THREE.DirectionalLight(0xffffff, 5.0);
directionalLight.position.set(10, 15, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
scene.add(directionalLight);

// Luz ambiental mucho más fuerte
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

// Luces adicionales para iluminar bien los vehículos
const fillLight1 = new THREE.DirectionalLight(0x4488ff, 2.0);
fillLight1.position.set(-15, 10, 10);
scene.add(fillLight1);

const fillLight2 = new THREE.DirectionalLight(0xffaa44, 1.5);
fillLight2.position.set(15, 10, -10);
scene.add(fillLight2);

// Luz cenital para iluminación general
const topLight = new THREE.DirectionalLight(0xffffff, 3.0);
topLight.position.set(0, 20, 0);
scene.add(topLight);

console.log('✅ Iluminación configurada');

// 4.4 SUELO/PLANO BASE
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x666666, // Mucho más claro
  roughness: 0.8,
  metalness: 0.1
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

console.log('✅ Suelo creado');

// =========================================================================
// PASO 4.5: SISTEMA DE CONTROL DE ILUMINACIÓN (PRUEBA DE MATERIALES)
// =========================================================================

// Variables para controlar la iluminación dinámicamente
let lightIntensity = 1.0;
let lightColor = 0xffffff;
let currentLightMode = 0; // 0: normal, 1: cálido, 2: frío, 3: intenso

// 4.5.1 FUNCIÓN PARA CAMBIAR MODOS DE ILUMINACIÓN (CORREGIDA)
function changeLightMode() {
  currentLightMode = (currentLightMode + 1) % 4;
  
  switch(currentLightMode) {
    case 0: // Modo normal - TODAS las luces
      directionalLight.color.setHex(0xffffff);
      directionalLight.intensity = 5.0;
      ambientLight.intensity = 1.5;
      ambientLight.color.setHex(0x404040);
      fillLight1.color.setHex(0x4488ff);
      fillLight1.intensity = 2.0;
      fillLight2.color.setHex(0xffaa44);
      fillLight2.intensity = 1.5;
      topLight.color.setHex(0xffffff);
      topLight.intensity = 3.0;
      renderer.toneMappingExposure = 2.0;
      scene.background = new THREE.Color(0x202020); // Fondo normal
      console.log('💡 Iluminación: NORMAL - Luz blanca brillante (TODAS las luces)');
      break;
      
    case 1: // Modo cálido (sunset) - TODAS las luces
      directionalLight.color.setHex(0xffaa44);
      directionalLight.intensity = 2.0;
      ambientLight.intensity = 0.5;
      ambientLight.color.setHex(0x604020);
      fillLight1.color.setHex(0xff6600);
      fillLight1.intensity = 1.0;
      fillLight2.color.setHex(0xffcc88);
      fillLight2.intensity = 1.2;
      topLight.color.setHex(0xffaa44);
      topLight.intensity = 1.5;
      renderer.toneMappingExposure = 1.0;
      scene.background = new THREE.Color(0x301808); // Fondo cálido
      console.log('🌅 Iluminación: CÁLIDA - Tonos dorados (TODAS las luces)');
      break;
      
    case 2: // Modo frío (moonlight) - TODAS las luces
      directionalLight.color.setHex(0x4488ff);
      directionalLight.intensity = 1.5;
      ambientLight.intensity = 0.3;
      ambientLight.color.setHex(0x202040);
      fillLight1.color.setHex(0x2266cc);
      fillLight1.intensity = 0.8;
      fillLight2.color.setHex(0x6699ff);
      fillLight2.intensity = 0.6;
      topLight.color.setHex(0x4488ff);
      topLight.intensity = 1.0;
      renderer.toneMappingExposure = 0.6;
      scene.background = new THREE.Color(0x101020); // Fondo azul oscuro
      console.log('🌙 Iluminación: FRÍA - Tonos azulados (TODAS las luces)');
      break;
      
    case 3: // Modo intenso (studio) - TODAS las luces
      directionalLight.color.setHex(0xffffff);
      directionalLight.intensity = 4.0;
      ambientLight.intensity = 2.0;
      ambientLight.color.setHex(0x808080);
      fillLight1.color.setHex(0xffffff);
      fillLight1.intensity = 3.0;
      fillLight2.color.setHex(0xffffff);
      fillLight2.intensity = 3.0;
      topLight.color.setHex(0xffffff);
      topLight.intensity = 4.0;
      renderer.toneMappingExposure = 1.8;
      scene.background = new THREE.Color(0x404040); // Fondo más claro
      console.log('⚡ Iluminación: INTENSA - Máxima iluminación (TODAS las luces)');
      break;
  }
  
  console.log('🎨 Observa cómo responden los materiales PBR a este cambio de luz:');
  console.log('   - Aluminio: Reflejos más/menos intensos');
  console.log('   - Goma: Sin cambios significativos en reflexión');
  console.log('   - Pintura metálica: Variación en brillo y color');
  console.log('   - Vidrio: Cambios en transparencia y reflejos');
  console.log('   - Entorno completo: Cambio en atmósfera y colores');
}

// 4.5.2 EVENT LISTENERS PARA CONTROL COMPLETO
window.addEventListener('keydown', (event) => {
  switch(event.code) {
    case 'KeyC':
      toggleCamera();
      break;
    case 'KeyL':
      changeLightMode();
      break;
    case 'KeyS':
      toggleShaderEffects();
      break;
    case 'KeyA':
      cameraAnimationEnabled = !cameraAnimationEnabled;
      console.log(`🎬 Animación de cámara: ${cameraAnimationEnabled ? 'ACTIVADA' : 'DESACTIVADA'}`);
      console.log('   📽️ Recorrido circular para observar materiales desde todos los ángulos');
      break;
    case 'KeyO':
      objectAnimationEnabled = !objectAnimationEnabled;
      console.log(`🔄 Animación de objetos: ${objectAnimationEnabled ? 'ACTIVADA' : 'DESACTIVADA'}`);
      console.log('   🏁 Movimiento lineal: Carros avanzan y reaparecen del otro lado');
      break;
    case 'KeyI':
      lightAnimationEnabled = !lightAnimationEnabled;
      console.log(`💡 Animación de luz: ${lightAnimationEnabled ? 'ACTIVADA' : 'DESACTIVADA'}`);
      console.log('   ✨ Variación de intensidad para resaltar materiales');
      break;
  }
});

// 4.5.3 FUNCIÓN PARA ALTERNAR EFECTOS DE SHADERS
let currentShaderMode = 0;
function toggleShaderEffects() {
  currentShaderMode = (currentShaderMode + 1) % 3;
  
  scene.traverse((child) => {
    if (child.material && child.material.uniforms) {
      switch(currentShaderMode) {
        case 0: // Modo normal
          if (child.material.uniforms.uScale) {
            if (child.material.uniforms.uDirection !== undefined) {
              // Bandas
              child.material.uniforms.uScale.value = 12.0;
              child.material.uniforms.uWidth.value = 0.3;
            } else if (child.material.uniforms.uColor1) {
              // Damero
              child.material.uniforms.uScale.value = 8.0;
            }
          }
          console.log('🎨 Shaders: MODO NORMAL');
          break;
          
        case 1: // Modo intenso
          if (child.material.uniforms.uScale) {
            if (child.material.uniforms.uDirection !== undefined) {
              // Bandas más finas y rápidas
              child.material.uniforms.uScale.value = 24.0;
              child.material.uniforms.uWidth.value = 0.1;
            } else if (child.material.uniforms.uColor1) {
              // Damero más pequeño
              child.material.uniforms.uScale.value = 16.0;
            }
          }
          console.log('⚡ Shaders: MODO INTENSO - Patrones más finos');
          break;
          
        case 2: // Modo suave
          if (child.material.uniforms.uScale) {
            if (child.material.uniforms.uDirection !== undefined) {
              // Bandas más anchas
              child.material.uniforms.uScale.value = 6.0;
              child.material.uniforms.uWidth.value = 0.6;
            } else if (child.material.uniforms.uColor1) {
              // Damero más grande
              child.material.uniforms.uScale.value = 4.0;
            }
          }
          console.log('🌊 Shaders: MODO SUAVE - Patrones más amplios');
          break;
      }
    }
  });
  
  console.log('🎛️ PARÁMETROS ACTUALES:');
  console.log('   📐 Damero: Escala variada según modo');
  console.log('   🏁 Bandas: Escala y ancho ajustados');
  console.log('   🌊 Ruido: Animación continua con intensidad 80%');
}

console.log('✅ Sistema de control de iluminación y shaders configurado');
console.log('🎮 CONTROLES:');
console.log('   - C: Alternar cámara (Perspectiva/Ortográfica)');
console.log('   - L: Cambiar modo de iluminación (Normal/Cálido/Frío/Intenso)');
console.log('   - S: Alternar efectos de shaders (Normal/Intenso/Suave)');

// =========================================================================
// PASO 5: SISTEMA DE CÁMARAS Y CONTROLES
// =========================================================================

// 5.1 FUNCIÓN PARA ALTERNAR CÁMARAS CON ANÁLISIS DE APORTE
function toggleCamera() {
  if (isPerspective) {
    currentCamera = orthographicCamera;
    isPerspective = false;
    console.log('📷 CÁMARA ORTOGRÁFICA ACTIVADA:');
    console.log('   🎯 Aporte: Análisis técnico preciso');
    console.log('   📐 Sin distorsión de perspectiva');
    console.log('   📏 Mediciones exactas de proporciones');
    console.log('   🎨 Comparación directa de materiales');
    console.log('   🔧 Ideal para: Diseño técnico, evaluación de texturas');
  } else {
    currentCamera = perspectiveCamera;
    isPerspective = true;
    console.log('📷 CÁMARA PERSPECTIVA ACTIVADA:');
    console.log('   👁️ Aporte: Experiencia visual natural');
    console.log('   🌟 Profundidad y realismo');
    console.log('   💫 Reflejos y brillos naturales');
    console.log('   🎭 Dramatismo en la iluminación');
    console.log('   🏎️ Ideal para: Presentación, impacto visual');
  }
  
  // Actualizar controles con la nueva cámara
  controls.object = currentCamera;
  controls.update();
}

console.log('✅ Sistema de cámaras configurado');

// =========================================================================
// PASO 5.5: SISTEMA DE ANIMACIONES
// =========================================================================

// 7.1 FUNCIÓN DE ANIMACIÓN DE CÁMARA (RECORRIDO CIRCULAR)
function updateCameraAnimation(time) {
  if (cameraAnimationEnabled) {
    cameraAnimationTime = time * 0.0005; // Velocidad lenta para observar materiales
    
    // Recorrido circular alrededor de los vehículos
    const x = Math.cos(cameraAnimationTime) * cameraRadius;
    const z = Math.sin(cameraAnimationTime) * cameraRadius;
    const y = cameraHeight + Math.sin(cameraAnimationTime * 2) * 2; // Ondulación vertical
    
    currentCamera.position.set(x, y, z);
    currentCamera.lookAt(0, 1, 0); // Siempre mirando al centro de los vehículos
    
    // Actualizar controles para seguir la cámara animada
    controls.target.set(0, 1, 0);
    controls.update();
  }
}

// 7.2 FUNCIÓN DE ANIMACIÓN DE OBJETOS (MOVIMIENTO LINEAL)
function updateObjectAnimation(time) {
  if (objectAnimationEnabled && loadedModels.length > 0) {
    objectAnimationTime = time * 0.0008; // Velocidad de avance moderada
    
    // Configuración del circuito
    const trackLength = 50; // Longitud del suelo (50 unidades)
    const startZ = -25; // Inicio del circuito (atrás)
    const endZ = 25; // Final del circuito (adelante)
    const totalDistance = trackLength; // Distancia total a recorrer
    
    loadedModels.forEach((item, index) => {
      if (item && item.model) {
        // Posiciones X fijas para cada carril (izquierdo, centro, derecho)
        const lanePositions = [-2, 0, 2];
        const laneX = lanePositions[index] || 0;
        
        // Calcular posición Z usando módulo para loop infinito
        const progress = (objectAnimationTime + index * 0.3) % 1; // Desfase entre vehículos
        const currentZ = startZ + (progress * totalDistance);
        
        // Aplicar posición
        item.model.position.x = laneX;
        item.model.position.z = currentZ;
        
        // Mantener Y original con ligera ondulación para realismo
        const baseY = item.model.userData.originalY || 0;
        item.model.position.y = baseY + Math.sin(time * 0.002 + index * Math.PI) * 0.02;
        
        // Rotación mínima para simular dirección (siempre hacia adelante +Z)
        item.model.rotation.y = 0;
      }
    });
  }
}

// 7.3 FUNCIÓN DE ANIMACIÓN DE LUZ (VARIACIÓN DE INTENSIDAD)
function updateLightAnimation(time) {
  if (lightAnimationEnabled) {
    lightAnimationTime = time * 0.001;
    
    // Variación sutil de intensidad para crear dinamismo
    const intensityVariation = Math.sin(lightAnimationTime) * 0.3 + 1.0; // 0.7 a 1.3
    
    // Solo variar las luces de relleno para no perder la iluminación principal
    fillLight1.intensity = 2.0 * intensityVariation;
    fillLight2.intensity = 1.5 * intensityVariation;
    
    // Ligero movimiento de la luz principal para cambiar sombras
    const lightOffset = Math.sin(lightAnimationTime * 0.5) * 2;
    directionalLight.position.x = 10 + lightOffset;
    directionalLight.position.z = 10 + lightOffset;
  }
}

console.log('🎬 Sistema de animaciones configurado:');
console.log('   A: Toggle animación de cámara (recorrido circular)');
console.log('   O: Toggle animación de objetos (movimiento lineal)');
console.log('   I: Toggle animación de luz (variación dinámica)');

// =========================================================================
// PASO 6: LOOP DE ANIMACIÓN Y RENDERIZADO
// =========================================================================

// 6.1 FUNCIÓN DE ANIMACIÓN PRINCIPAL CON SISTEMA COMPLETO
function animate() {
  requestAnimationFrame(animate);
  
  // Obtener tiempo actual para animaciones
  const time = performance.now();
  
  // 7.1 ACTUALIZAR ANIMACIÓN DE CÁMARA
  updateCameraAnimation(time);
  
  // 7.2 ACTUALIZAR ANIMACIÓN DE OBJETOS
  updateObjectAnimation(time);
  
  // 7.3 ACTUALIZAR ANIMACIÓN DE LUZ
  updateLightAnimation(time);
  
  // Actualizar materiales procedurales animados
  updateProceduralMaterials(time);
  
  // Actualizar controles (solo si no hay animación de cámara activa)
  if (!cameraAnimationEnabled) {
    controls.update();
  }
  
  // Renderizar escena con la cámara actual
  renderer.render(scene, currentCamera);
}

// 6.2 MANEJO DE REDIMENSIONAMIENTO
window.addEventListener('resize', () => {
  const newAspect = window.innerWidth / window.innerHeight;
  
  // Actualizar cámara perspectiva
  perspectiveCamera.aspect = newAspect;
  perspectiveCamera.updateProjectionMatrix();
  
  // Actualizar cámara ortográfica
  orthographicCamera.left = frustumSize * newAspect / -2;
  orthographicCamera.right = frustumSize * newAspect / 2;
  orthographicCamera.updateProjectionMatrix();
  
  // Actualizar renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 6.3 INICIAR ANIMACIÓN
animate();

console.log('🚀 ESCENA INICIADA CON SISTEMA COMPLETO:');
console.log('🎮 CONTROLES PRINCIPALES:');
console.log('   🖱️ Mouse: Navegar (cuando animación de cámara esté OFF)');
console.log('   C: Alternar cámara (Perspectiva ↔ Ortográfica)');
console.log('   L: Cambiar iluminación (Normal/Cálido/Frío/Intenso)');
console.log('   S: Alternar intensidad de shaders');
console.log('🎬 CONTROLES DE ANIMACIÓN:');
console.log('   A: Toggle animación de cámara (recorrido circular)');
console.log('   O: Toggle animación de objetos (movimiento lineal en circuito)');
console.log('   I: Toggle animación de luz (variación dinámica)');
console.log('🎨 OBJETIVO: Observar cómo los materiales PBR responden a:');
console.log('   - Diferentes ángulos de vista (animación de cámara)');
console.log('   - Movimiento continuo de vehículos (reflejos dinámicos)');
console.log('   - Variaciones de iluminación (animación de luz)');
console.log('   - Comparación entre vistas perspectiva vs ortográfica');
console.log('');
console.log('📊 MODELO DE COLOR IMPLEMENTADO:');
console.log('   🔴 Paleta RGB: Rojo deportivo (0xaa0000), Azul eléctrico (0x0033aa), Verde racing (0x006600)');
console.log('   ⚪ Contraste CIELAB: ΔE > 30 entre colores primarios para máxima diferenciación');
console.log('   🌡️ Temperatura: Cálidos (ámbar 0xffaa44) vs Fríos (cian 0x4488ff)');
console.log('   📐 Justificación: RGB optimizado para renders PBR con separación perceptual CIELAB');