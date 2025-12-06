import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- 1. SETUP BÁSICO ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020); 

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
const posPrincipal = new THREE.Vector3(12, 8, 12); 
const targetPrincipal = new THREE.Vector3(0, 2, 0);

camera.position.copy(posPrincipal);
camera.lookAt(targetPrincipal);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Sombras activadas
document.body.appendChild(renderer.domElement);

// --- 2. CARGA DE TEXTURAS ---
const textureLoader = new THREE.TextureLoader();

// A. Texturas de Maloka
const texturaConcreto = textureLoader.load('textures/Concrete025_1K-JPG_Color.jpg');
const texturaMetal = textureLoader.load('textures/Metal035_1K-JPG_Color.jpg');

// B. Textura del Suelo
const texturaSuelo = textureLoader.load('textures/Gravel028_1K-JPG_Color.jpg');

// CONFIGURACIÓN DE REPETICIÓN (Para que el suelo no se vea estirado)
texturaSuelo.wrapS = THREE.RepeatWrapping;
texturaSuelo.wrapT = THREE.RepeatWrapping;
texturaSuelo.repeat.set(10, 10); // Repetir la imagen 10 veces en X e Y


// --- 3. MATERIALES ---

// Material Base (Concreto)
const materialBase = new THREE.MeshStandardMaterial({ 
    map: texturaConcreto, 
    roughness: 0.8,
    metalness: 0.1
});

// Material Aros (Metal)
const materialAros = new THREE.MeshStandardMaterial({ 
    map: texturaMetal,
    color: 0xffaa00, 
    roughness: 0.3,
    metalness: 0.9
});

// Material Suelo
const materialSuelo = new THREE.MeshStandardMaterial({ 
    map: texturaSuelo,
    roughness: 0.8,
    metalness: 0.1
});

// --- 4. ILUMINACIÓN ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
// Mejorar la calidad de la sombra
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;

// Aumentar tamaño de la caja de sombras - evita cortes en las proyecciones
const d = 15;
dirLight.shadow.camera.left = -d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = -d;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 50;

scene.add(dirLight);

// --- 5. GEOMETRÍA ---

// A. EL SUELO
const sueloGeo = new THREE.PlaneGeometry(20, 20); // Un plano de 20x20
const suelo = new THREE.Mesh(sueloGeo, materialSuelo);
suelo.rotation.x = -Math.PI / 2; // Rotar -90 grados para que quede acostado
suelo.position.y = 0; // En el nivel 0
suelo.receiveShadow = true; // El suelo recibe sombras
scene.add(suelo);

// B. BASE CILINDRO
const radioCilindro = 3;
const alturaCilindro = 3; 
const baseGeo = new THREE.CylinderGeometry(radioCilindro, radioCilindro, alturaCilindro, 32);
const base = new THREE.Mesh(baseGeo, materialBase);
base.position.y = alturaCilindro / 2; 
base.receiveShadow = true; 
base.castShadow = true; // Que el cilindro también proyecte sombra en el suelo
scene.add(base);

// C. GRUPO DE AROS
const grupoAros = new THREE.Group();
scene.add(grupoAros);

const radioAro = 2.5;    
const grosorTubo = 0.1; 
const toroGeo = new THREE.TorusGeometry(radioAro, grosorTubo, 16, 100);

// Aro 1
const pivotGroup = new THREE.Group();
pivotGroup.position.set(0, alturaCilindro + 1.25, 0);
grupoAros.add(pivotGroup); 

const aro1 = new THREE.Mesh(toroGeo, materialAros);
aro1.rotation.x = Math.PI / 2;
aro1.position.set(0, grosorTubo, 0);
aro1.castShadow = true; 
pivotGroup.add(aro1);
pivotGroup.rotation.z = Math.PI / 6; 

// Aro 2
const pivotGroup2 = new THREE.Group();
pivotGroup2.position.set(0, alturaCilindro + 3.9, 0);
grupoAros.add(pivotGroup2);

const aro2 = new THREE.Mesh(toroGeo, materialAros);
aro2.rotation.x = Math.PI / 2;
aro2.position.set(0, grosorTubo, 0);
aro2.castShadow = true; 
pivotGroup2.add(aro2);
pivotGroup2.rotation.z = -Math.PI / 6; 

// --- 6. CONTROLES Y CÁMARA ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.copy(targetPrincipal);

// Limitar zoom
controls.minDistance = 5;
controls.maxDistance = 40;

// Evitar que la cámara entre bajo tierra
controls.maxPolarAngle = Math.PI / 2;

// --- LÓGICA DE CAMBIO DE CÁMARA ---
let esVistaPrincipal = true;
const uiTexto = document.getElementById('vista-nombre');
const posAerea = new THREE.Vector3(0, 35, 0);
const targetAerea = new THREE.Vector3(0, 0, 0);

window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'c') {
        esVistaPrincipal = !esVistaPrincipal;

        if (esVistaPrincipal) {
            camera.position.copy(posPrincipal);
            controls.target.copy(targetPrincipal);
            if(uiTexto) uiTexto.innerText = "Principal";
            controls.maxPolarAngle = Math.PI / 2;
        } else {
            camera.position.copy(posAerea);
            controls.target.copy(targetAerea);
            if(uiTexto) uiTexto.innerText = "Aérea (Top)";
            controls.maxPolarAngle = Math.PI;
        }
        camera.lookAt(controls.target);
        controls.update(); 
    }
});

function animate() {
    requestAnimationFrame(animate);
    
    // Animación
    grupoAros.rotation.y += 0.02;

    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});