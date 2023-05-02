const canvas = document.getElementById("bengt");
const ctx = canvas.getContext("2d");

const header = document.getElementById("header");
const bolibompa_theme = document.getElementById('bolibompa_theme');
//const bolibompa_theme = new Audio('misc/bolibompa.mp3')
var playsongs = 1

const bengt = {
    x: 242.5,
    y: 242.5,
    dx: 0,
    dy: 0,
    name: "Bengt",
    inventory: [],

}

const scenes = {
    main: 0,
    house1: 1
}

const items = {
    speed_potion: 0,
    paper: 0,
}

// Kontroller konstant som sparar alla tryckningar (utan detta kan inte två knappar tryckas samtidigt)
const controller = {
    'ArrowRight': {pressed: false, func: walkRight},
    'ArrowLeft': {pressed: false, func: walkLeft},
    'ArrowUp': {pressed: false, func: walkUp},
    'ArrowDown': {pressed: false, func: walkDown}
}

// Musik funktion
function togglePlay(song) {
    song.loop = true;
    song.volume = 0.4;
    if (song.duration > 0 && !song.paused) {
        song.pause();
    } else {
        song.play();
    }
}

function walkLeft() {
    if (!controller['ArrowLeft'].pressed) {
        if (!controller['ArrowRight'].pressed) {
            bengt.dx = 0;
        }
    } else {
        if (controller['ArrowRight'].pressed) {
            bengt.dx = 0;
        } else {
            bengt.dx = -3;
        }
    }
}

function walkUp() {
    bengt.dy = -3;
}
function walkDown() {
    if (!controller['ArrowDown'].pressed) {
        if (!controller['ArrowUp'].pressed) {
            bengt.dy = 0;
        }
    } else {
        bengt.dy = 3
    }
}

function walkRight() {
    if (!controller['ArrowRight'].pressed) {
        if (!controller['ArrowLeft'].pressed) {
            bengt.dx = 0;
        }
    } else {
        if (controller['ArrowLeft'].pressed) {
            bengt.dx = 0;
        } else {
            bengt.dx = 3
        }
    }
}


document.addEventListener('keydown', function(e) {
    if (controller[e.key]) {
        controller[e.key].pressed = true;
    }
    if (e.key === 'Escape') {
        togglePlay(bolibompa_theme);
        header.innerHTML = "escape pressed"
    }
});
document.addEventListener('keyup', function(e) {
    if (controller[e.key]) {
        controller[e.key].pressed = false;
    }
});
// tar elementen i kontroller konstanten och använder Foreach loop för att utföra funktionerna de är associerade med
const executeMoves = () => {Object.keys(controller).forEach(key=> {controller[key].func()})}

function interact(items) {
    
}

function loop() {
    requestAnimationFrame(loop); //säger till browsern att jag vill utföra en animation och tillkallar en funktion för att uppdatera animationen innan nästa ommålning av canvasen
    ctx.clearRect(0,0,canvas.width,canvas.height); //gör hela canvasen tom
    executeMoves();


    bengt.x += bengt.dx
    bengt.y += bengt.dy



    ctx.fillStyle = 'black';
    ctx.fillRect(bengt.x, bengt.y, 30, 30);
}



//Starta loop funktionen
requestAnimationFrame(loop);