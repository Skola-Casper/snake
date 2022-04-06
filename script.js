let canvas = document.getElementById("game-canvas")
let ctx = canvas.getContext("2d")
let scoreboard = document.getElementById("score-board")
const GRIDSIZE = 19 //bör vara ett udda tal.
canvas.height = Math.floor(window.innerHeight / 2)
canvas.width = canvas.height
const TILE = Math.floor(canvas.height / GRIDSIZE)

function drawGrid(){
    for(let i = 0; i<GRIDSIZE**2; i++){
        ctx.fillStyle = i%2 ? "#0B2429": "#1A4341";
        ctx.fillRect((i%GRIDSIZE)*TILE, Math.floor(i/GRIDSIZE)*TILE, TILE, TILE)
    }
}

class Segment{
    constructor(x, y){
        this.x = x
        this.y = y
        this.color = "white"
        this.last_x;
        this.last_y;
    }
    render() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x*TILE, this.y*TILE, TILE, TILE)
    }
    move(x, y) {
        this.last_x = this.x
        this.last_y = this.y
        this.x = x
        this.y = y
    }
}

class Apple extends Segment{
    constructor(x, y){
        super(x, y)
        this.color = "#F3AC3C"
    }
}

let random = () => Math.floor(Math.random() * GRIDSIZE**2)
let dead = () => {
    let head = segments[0]
    for(let i = 1; i<segments.length; i++){
        if(head.x == segments[i].x && head.y == segments[i].y){
            return true
        }
    } return false
}

let segments = [new Segment(5, 0)]
let vel = [1, 0]
let apple = new Apple(4, 4)

document.addEventListener("keydown", (event) => {
    let key = event["key"]
    switch(key){
        case "ArrowUp":
            vel = [0, -1]; break
        case "ArrowDown":
            vel = [0, 1]; break
        case "ArrowLeft":
            vel = [-1, 0]; break
        case "ArrowRight":
            vel = [1, 0]; break
    }
})
// set and stop intervall can be used as pause and resume function
setInterval(() => {
    drawGrid()
    let head = segments[0]
    apple.render()
    head.render()
    head.move(head.x+vel[0] >= 0 ? (vel[0]+head.x)%GRIDSIZE: GRIDSIZE-1, 
        head.y+vel[1] >= 0 ? (vel[1]+head.y)%GRIDSIZE: GRIDSIZE-1)
    for(let i = 0; i<segments.length-1; i++){ 
        segments[i+1].move(segments[i].last_x, segments[i].last_y)
        segments[i].render()
    }
    if (dead()){ segments = [new Segment(5, 0)]}
    if(head.x == apple.x && head.y == apple.y){
        let last = segments.slice(-1)[0]
        segments.push(new Segment(last.x, last.y))
        apple.move(random()%GRIDSIZE, Math.floor(random()/GRIDSIZE))
    }
    scoreboard.innerHTML = "Score: " + (segments.length - 1)
}, 100)
