//ping pong 3-A
const canvas = document.getElementById('pingPongCanvas');
const context = canvas.getContext('2d');

// as dimensões do canvas
canvas.width = 600;
canvas.height = 400;

// Propriedade da bola
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "white"
};

// Raquete do jogador
const user = {
    x: 0, // lado esquerdo do canvas
    y: (canvas.height - 100) / 2, // -100 é a altura da raquete
    width: 10,
    height: 100,
    score: 0,
    color: "red"
};

// Raquete do bot 
const ai = {
    x: canvas.width - 10, // lado direito do canvas
    y: (canvas.height - 100) / 2, // -100 é a altura da raquete
    width: 10,
    height: 100,
    score: 0,
    color: "black"
};

// Desenho da raquete
function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

// Controlando a raquete do jogador1
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}

// Reinicia a bola quando alguém marca um ponto
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// Desenhar a bola
function drawBall(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}

// Atualizar: movimento, pontuação, etc.
function update() {
    // Mover a bola
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // IA simples
    ai.y += ((ball.y - (ai.y + ai.height / 2))) * 0.09;
    
    // Colisões
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width / 2) ? user : ai;
    if(collisionDetect(player, ball)){
        // Tratar colisão...
        let collidePoint = ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);
        
        let angleRad = collidePoint * Math.PI / 4;
        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        ball.speed += 0.1;
    }

    // Pontuação
    if(ball.x - ball.radius < 0){
        ai.score++;
        resetBall();
    }else if(ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall();
    }
}

function collisionDetect(player, ball) {
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;
    
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;
    
    return player.right > ball.left && player.top < ball.bottom && player.left < ball.right && player.bottom > ball.top;
}

// Desenhar tudo
function render() {
    // Limpa o canvas
    drawRect(0, 0, canvas.width, canvas.height, '#eee');
    // Desenha a raquete do usuário
    drawRect(user.x, user.y, user.width, user.height, user.color);
    // Desenha a raquete do bot
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    // Desenha a bola
    drawBall(ball.x, ball.y, ball.radius, ball.color);
}

function game() {
    update();
    render();
}

// Loop
let framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);
//Fim