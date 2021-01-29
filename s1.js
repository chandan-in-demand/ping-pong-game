const can = document.getElementById('canvas')
const draw = can.getContext('2d')

const ball = {
    x : can.width/2,
    y : can.height/2,
    radius  : 10,
    velX : 5,
    velY : 5,
    speed : 10,
    color : 'orange'
}

const user = {
    x : 0,
    y : (can.height- 100)/2,
    width : 10,
    height : 100,
    color: "red",
    score : 0
}

const com = {
    x : can.width - 10,
    y : (can.height -100)/2,
    width : 10,
    height : 100,
    score : 0,
    color: "red"
}

const net = {
    x : (can.width-2)/2,
    y : 0,
    height: 10,
    width : 2,
    color : "white"
}

function drawRect (x, y, w, h, color){
    draw.fillStyle = color
    draw.fillRect(x, y, w, h)
}

function drawArc(x, y, r, color) {
    draw.fillStyle = color
    draw.beginPath()
    draw.arc(x, y, r, 0, Math.PI*2, true)
    draw.closePath()
    draw.fill()
}

function drawNet () {
    for(let i=0;i<can.height; i+=20){
        drawRect(net.x, net.y + i, net.width, net.height, net.color)
    }    
}

function drawText(text, x, y){
    draw.fillStyle = "#FFF"
    draw.font = "60px fantasy"
    draw.fillText(text,x, y)
}

can.addEventListener("mousemove",getMousePos)

function getMousePos(evt){
    let rect = can.getBoundingClientRect()
    user.y = evt.clientY - rect.top - user.height/2
}

function resetBall(){
    ball.x = can.width/2
    ball.y = can.height/2
    ball.velX = -ball.velX
    ball.speed = 10    
}

function collision (b,p){
    p.left = p.x
    p.right = p.x + p.width
    p.top = p.y
    p.bottom = p.y + p.height
    
    b.top = b.y - b.radius
    b.bottom = b.y + b.radius
    b.left = b.x - b.radius
    b.right = b.x + b.radius
    console.log('collision checked ')
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;     
}

function update (){
  
    if(ball.x - ball.radius < 0){
        com.score++
        resetBall();
        console.log("called user hit")
    }else if(ball.x + ball.radius > can.width ){
        user.score++
        console.log('called com hit')
        resetBall();
    }

    ball.x += ball.velX
    ball.y += ball.velY

    com.y += ((ball.y -(com.y + com.height/2)))*0.1

    if(ball.y - ball.radius < 0 || ball.y + ball.radius > can.height){
        ball.velY = -ball.velY

    }

    let player = (ball.x + ball.radius > can.width/2) ? com : user

    if(collision(ball, player)){
        console.log("collision occured")
        let collidePoint = (ball.y -(player.y + player.height/2))
        collidePoint = collidePoint/(player.height/2)
        
        let angleRad = (Math.PI/4) * collidePoint;
        

        let direction = (ball.x + ball.radius < can.width/2) ? 1 : -1;
        ball.velX = direction * ball.speed * Math.cos(angleRad);
        ball.velY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;

    }

}

function render(){
    
    drawRect(0, 0, can.width, can.height, "#000");
    drawText(user.score,can.width/4,can.height/5);
    drawText(com.score,3*can.width/4,can.height/5);
    drawNet();
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function play(){
    update()
    render()
}

let fPS = 50

let loop = setInterval(play, 1000/fPS)



