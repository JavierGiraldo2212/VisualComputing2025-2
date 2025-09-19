// Este sketch es la versión 3D del ejemplo anterior.
// Demuestra el uso de transformaciones en un espacio tridimensional.

void setup() {
  // 1. Se crea un lienzo de 800x600 píxeles con el motor de renderizado 3D.
  // P3D (Processing 3D) activa las capacidades tridimensionales.
  size(800, 600, P3D); 
}

void draw() {
  // 2. Se limpia el fondo.
  background(240);
  
  // 3. Se añade una fuente de luz para que las caras del cubo se vean.
  // Sin luces en un entorno 3D, todas las caras del objeto se verían del mismo color.
  lights();

  // 4. AISLAMIENTO DE TRANSFORMACIONES (funciona igual que en 2D).
  pushMatrix();

  // 5. TRANSFORMACIÓN 1: translate()
  // Mueve el origen al centro de la pantalla en X y Y.
  // El movimiento ondulado ahora se aplica en el eje Z (profundidad).
  // Esto hará que el cubo se acerque y se aleje de la cámara.
  translate(width / 2, height / 2, sin(frameCount * 0.05) * 100);

  // 6. TRANSFORMACIÓN 2: rotate()
  // Para mostrar que es un objeto 3D, aplicamos rotaciones en dos ejes.
  // - rotateY(): Gira alrededor del eje vertical.
  // - rotateX(): Gira alrededor del eje horizontal.
  // Al combinar ambas, el cubo girará en diagonal, mostrando todas sus caras.
  rotateY(frameCount * 0.02);
  rotateX(frameCount * 0.01);

  // 7. TRANSFORMACIÓN 3: scale()
  // Funciona exactamente igual que en 2D, escalando el objeto uniformemente.
  float escala = map(sin(frameCount * 0.03), -1, 1, 0.5, 1.5);
  scale(escala);

  // 8. DIBUJO DE LA FIGURA 3D
  // Reemplazamos rect() con box() para dibujar un cubo.
  // El parámetro 100 define el tamaño de todos sus lados.
  noStroke(); // Quitamos el borde para un look más limpio en 3D
  fill(100, 150, 250); // Relleno azul
  box(100);

  // 9. RESTAURACIÓN DE LA MATRIZ.
  popMatrix();
}
