// Este sketch demuestra el uso de transformaciones 2D (translate, rotate, scale)
// y su aislamiento con pushMatrix/popMatrix para animar una figura geométrica.

void setup() {
  // 1. Se crea un lienzo de 800x600 píxeles.
  size(800, 600);
  
  // 2. Se establece el modo del rectángulo en CENTER.
  // Esto hace que las transformaciones (como rotar y escalar) ocurran
  // desde el centro de la figura, no desde su esquina superior izquierda.
  rectMode(CENTER);
}

void draw() {
  // 3. Se limpia el fondo en cada fotograma con un color gris claro.
  background(240);

  // 4. AISLAMIENTO DE TRANSFORMACIONES:
  // pushMatrix() guarda el estado actual del sistema de coordenadas (la "matriz").
  // Es como decir: "Voy a hacer unos cambios, pero quiero poder volver a como estaba antes".
  pushMatrix();

  // 5. TRANSFORMACIÓN 1: translate()
  // Mueve el punto de origen (0,0) a una nueva posición.
  // Usamos sin() con frameCount para crear un movimiento ondulado vertical.
  // - width/2: Centra el movimiento horizontalmente.
  // - height/2: Es la base del movimiento vertical.
  // - sin(frameCount * 0.05) * 100: Crea una onda sinusoidal.
  //   El valor de sin() va de -1 a 1. Al multiplicarlo por 100, la posición
  //   vertical oscilará 100 píxeles hacia arriba y 100 hacia abajo desde el centro.
  translate(width / 2, height / 2 + sin(frameCount * 0.05) * 100);

  // 6. TRANSFORMACIÓN 2: rotate()
  // Rota el sistema de coordenadas alrededor del nuevo origen.
  // El ángulo aumenta con cada fotograma (frameCount), haciendo que el cubo gire continuamente.
  // Se multiplica por 0.02 para ralentizar la velocidad de rotación.
  rotate(frameCount * 0.02);

  // 7. TRANSFORMACIÓN 3: scale()
  // Escala el sistema de coordenadas.
  // Usamos sin() nuevamente para que el tamaño cambie cíclicamente.
  // La función map() convierte el rango de sin() [-1, 1] a un rango de escala [0.5, 2.0].
  // Esto significa que el rectángulo se encogerá hasta la mitad de su tamaño
  // y crecerá hasta el doble de su tamaño.
  float escala = map(sin(frameCount * 0.03), -1, 1, 0.5, 2.0);
  scale(escala);

  // 8. DIBUJO DE LA FIGURA
  // Ahora que todas las transformaciones están aplicadas, dibujamos la figura.
  // Como hemos movido, rotado y escalado el "lienzo" mismo, solo necesitamos
  // dibujar el rectángulo en el origen (0,0) de este nuevo sistema de coordenadas.
  stroke(40);      // Borde negro
  fill(100, 150, 250); // Relleno azul
  rect(0, 0, 80, 80); // Dibuja un cuadrado de 80x80 en el origen transformado

  // 9. RESTAURACIÓN DE LA MATRIZ:
  // popMatrix() restaura el sistema de coordenadas a como estaba cuando se llamó a pushMatrix().
  // Cualquier cosa que se dibuje después de esta línea no se verá afectada por las
  // transformaciones anteriores (translate, rotate, scale).
  popMatrix();
  
  // Ejemplo: Este círculo se dibuja en la esquina superior izquierda,
  // sin ser afectado por las transformaciones del rectángulo.
  fill(255, 100, 100); // Relleno rojo
  noStroke();
  ellipse(50, 50, 30, 30);
}
