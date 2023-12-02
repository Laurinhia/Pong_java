let ball;
let leftPaddle;
let rightPaddle;
let leftScore = 0;
let rightScore = 0;
let gameStarted = false;
let lastSpeedIncreaseTime = 0;
const speedIncreaseInterval = 15000; // 15 segundos

function setup() {
  createCanvas(600, 400);
  ball = new Ball();
  leftPaddle = new Paddle(true);
  rightPaddle = new Paddle(false);
}

function draw() {
  background(0);

  // Desenha a linha branca dividindo os lados
  stroke(255);
  line(width / 2, 0, width / 2, height);

  if (gameStarted) {
    ball.update();
    ball.show();

    leftPaddle.update();
    leftPaddle.show();

    rightPaddle.update();
    rightPaddle.follow(ball);
    rightPaddle.show();

    checkCollision(leftPaddle);
    checkCollision(rightPaddle);

    if (ball.x - ball.radius < 0) {
      rightScore++;
      reset();
    }

    if (ball.x + ball.radius > width) {
      leftScore++;
      reset();
    }

    // Verifica se um jogador atingiu 10 pontos
    if (leftScore === 10 || rightScore === 10) {
      showResult(leftScore === 10);
      resetGame();
    }

    // Verifica se é hora de aumentar a velocidade
    if (millis() - lastSpeedIncreaseTime > speedIncreaseInterval) {
      increaseBallSpeed();
    }
  } else {
    ball.show();
  }

  textSize(32);
  fill(255);
  text(leftScore, width / 4, 50);
  text(rightScore, 3 * width / 4, 50);

  if (keyIsDown(UP_ARROW)) {
    leftPaddle.move(-5);
  } else if (keyIsDown(DOWN_ARROW)) {
    leftPaddle.move(5);
  }
}

function checkCollision(paddle) {
  if (
    ball.x - ball.radius < paddle.x + paddle.width / 2 &&
    ball.x + ball.radius > paddle.x - paddle.width / 2 &&
    ball.y + ball.radius > paddle.y - paddle.height / 2 &&
    ball.y - ball.radius < paddle.y + paddle.height / 2
  ) {
    ball.xSpeed *= -1;
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    leftPaddle.move(0);
  } else if (keyCode === 32 && !gameStarted) {
    gameStarted = true;
    ball.startMoving();
  }
}

function keyReleased() {
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    leftPaddle.move(0);
  }
}

function reset() {
  ball.x = width / 2;
  ball.y = height / 2;
  ball.xSpeed = 0;
  ball.ySpeed = 0;
  leftPaddle.y = height / 2;
  rightPaddle.y = height / 2;
  gameStarted = false;
}

function resetGame() {
  leftScore = 0;
  rightScore = 0;
  reset();
}

function increaseBallSpeed() {
  // Aumenta a velocidade da bola em 10%
  ball.xSpeed *= 1.1;
  ball.ySpeed *= 1.1;
  lastSpeedIncreaseTime = millis();
}

function showResult(winnerIsLeft) {
  textSize(48);
  fill(255);
  textAlign(CENTER, CENTER);
  if (winnerIsLeft) {
    text("Vitória!", width / 4, height / 2);
    text("Derrota...", 3 * width / 4, height / 2);
  } else {
    text("Vitória!", 3 * width / 4, height / 2);
    text("Derrota...", width / 4, height / 2);
  }
}

class Ball {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.radius = 10;
    this.xSpeed = 0;
    this.ySpeed = 0;
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.y - this.radius < 0 || this.y + this.radius > height) {
      this.ySpeed *= -1;
    }
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.radius * 2);
  }

  startMoving() {
    // Começa com uma velocidade inicial moderada
    this.xSpeed = random(2, 4) * (random() > 0.5 ? 1 : -1);
    this.ySpeed = random(1, 2) * (random() > 0.5 ? 1 : -1);
  }
}

class Paddle {
  constructor(isLeft) {
    this.width = 10;
    this.height = 80;
    this.isLeft = isLeft;
    this.y = height / 2;
    this.x = isLeft ? this.width : width - this.width;
    this.ySpeed = 0;
    this.speed = 5;
  }

  move(dir) {
    this.ySpeed = dir;
  }

  follow(ball) {
    let chance = random();

    if (chance < 0.9) {
      this.y += (ball.y - this.y) * 0.08;
    } else {
      this.y += random(-3, 3);
    }
  }

  update() {
    this.y += this.ySpeed;

    if (this.y - this.height / 2 < 0) {
      this.y = this.height / 2;
    }

    if (this.y + this.height / 2 > height) {
      this.y = height - this.height / 2;
    }
  }

  show() {
    fill(255);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height);
  }
}
