const canvas = document.querySelector('.game');
const c = canvas.getContext('2d');

const drops = [];
var cooldown = 0;

var level = 1;
var levelbox = document.querySelector('.level');
var deaths = 0;
var deathbox = document.querySelector('.deaths');

var cars = [];
var carSpanCooldown = 0;

const leftSpace = 50;
const roadWidth = 26;
const sidewalkWidth = 5;
const strapWidth = 2;
const strapHeight = 10;

canvas.width = leftSpace + roadWidth * 6 + sidewalkWidth;
canvas.height = canvas.width * 1.25;

//COLORS
const orange = '#f18f01';
const lightgray = '#adcad6';
const gray = '#6f7370';
const green = '#99c24d';
const blue = '#41bbd9';
//CLASSES
class Player{
    constructor(position){
        this.position = {
            x: position.x,
            y: position.y
        }
        this.width = 12;
        this.direction = {
            x: 0,
            y: 0
        };
    }

    update(){
        if(this.position.x + this.direction.x < 0){
            this.direction.x = 0;
        }
        if(this.position.x + this.width + this.direction.x > canvas.width){
            this.direction.x = 0;
        }
        if(this.position.y + this.direction.y < 0){
            this.direction.y = 0;
        }
        if(this.position.y + this.width + this.direction.y > canvas.height){
            this.direction.y = 0;
        }

        this.position.x += this.direction.x
        this.position.y += this.direction.y

        cars.forEach(car => {
            if(this.position.x + this.width > car.position.x &&
                this.position.x < car.position.x + car.width &&
                this.position.y + this.width > car.position.y &&
                this.position.y < car.position.y + car.height){
                this.position.x = leftSpace/2;
                this.position.y = canvas.height/2+0.5;
                cars = [];
                level = 1;
                deaths++
        }})

        this.draw();
    }

    draw(){
        c.fillStyle = blue;
        c.fillRect(this.position.x, this.position.y, this.width, this.width);
    }
}
class Car{
    constructor(line, height){
        this.line = line;
        this.position = {
            x: 0,
            y: 0
        }
        this.width = 16;
        this.height = height;
        this.direction = {
            x: 0,
            y: 0
        };
    }

    update(){
        this.position.x += this.direction.x
        this.position.y += this.direction.y

        this.draw();
    }
    draw(){
        c.fillStyle = orange;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
class Rain{
    constructor(height, speed){
        this.position = {
            x: 0,
            y: 0
        }
        this.width = 1;
        this.height = height;
        this.speed = speed;
    }

    update(){
        this.position.y = this.position.y + this.speed;
        this.draw();
    }

    draw(){
        c.fillStyle = blue;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const testP = new Player({x: leftSpace/2, y: canvas.height/2+0.5});
//-------------------------------------------------------------------------------------------------

addEventListener('keydown', handleKey);
addEventListener('keyup', unHandleKey);
function handleKey(event){
    switch(event.key){
        case 'w':
            testP.direction.y = -1;
            break
        case 'a':
            testP.direction.x = -1;
            break
        case 's':
            testP.direction.y = 1;
            break
        case 'd':
            testP.direction.x = 1;
            break
    }
}
function unHandleKey(event){
    switch(event.key){
        case 'w':
            testP.direction.y = 0;
            break
        case 'a':
            testP.direction.x = 0;
            break
        case 's':
            testP.direction.y = 0;
            break
        case 'd':
            testP.direction.x = 0;
            break
    }
}

//-------------------------------------------------------------------------------------------------

function animate(){
    requestAnimationFrame(animate);
    drawMap();
    testP.update();
    if(carSpanCooldown < 1){
        generateCar();
        carSpanCooldown = Math.floor(Math.random() * 60) + 20;
    }
    carSpanCooldown--
    for(let i = cars.length - 1;i != 0;i--){
        cars[i].update();

        if(cars[i].position.y - 2*cars[i].height > canvas.height || cars[i].position.y + 2 * cars[i].height < 0){
            cars.splice(1, i);
        }
    }

    if(cooldown < 1){
        generateRain();
        cooldown = 2;
    }
    cooldown--

    for(let i = drops.length - 1;i != 0;i--){
        drops[i].update();

        if(drops[i].position.y > canvas.width){
            drops.splice(1, i);
        }
    }

    nextLevel();
    levelbox.innerHTML = `LEVEL: ${level}`
    deathbox.innerHTML = `DEATHS: ${deaths}`
}
animate();

//-------------------------------------------------------------------------------------------------

function drawMap(){
    c.fillStyle = green;
    c.fillRect(0, 0, leftSpace, canvas.height);
    c.fillStyle = lightgray;
    c.fillRect(leftSpace - sidewalkWidth, 0, leftSpace, canvas.height);
    for(let i = 0;i < 6;i++){
        c.fillStyle = gray;
        c.fillRect(leftSpace, 0, leftSpace + roadWidth * i, canvas.height);
    }

    for(let j = 1;j < 6;j++){
        for(let i = 0;i < 13;i++){
            c.fillStyle = lightgray;
            c.fillRect(leftSpace + (roadWidth * j) - strapWidth/2, strapHeight * (i * 2), strapWidth, strapHeight);
        }
    }

    c.fillStyle = lightgray;
    c.fillRect(canvas.width - sidewalkWidth, 0, sidewalkWidth, canvas.height);
}

function nextLevel(){
    if(testP.position.x + testP.width == canvas.width){
        testP.position.x = leftSpace/2;
        testP.position.y = canvas.height/2+0.5;
        level++
    }
}

function generateCar(){
    let car = new Car(getRandomInt(1, 6), getRandomInt(20, 40));
    car.position.x = leftSpace + roadWidth * car.line - car.width/2 - roadWidth/2;
    let random = getRandomInt(0, 1);
    if(random == 0){
        car.position.y = 0 - car.height;
        car.direction.y = getRandomInt(1, 4) + level/5;
    }
    if(random == 1){
        car.position.y = canvas.height + car.height;
        car.direction.y = getRandomInt(-1, -4) - level/5;
    }
    cars.push(car);
}

function generateRain(){
    if(drops.length < 15){
        let rain = new Rain(getRandomInt(0, 3), getRandomInt(1, 5));
        rain.position.x = getRandomInt(0, canvas.width);
        drops.push(rain);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}