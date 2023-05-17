const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Random
const header = document.getElementById("header");
var start = Date.now();

// Ljud
const bolibompa_theme = document.getElementById('bolibompa_theme');

// Animation
const bengtSpriteSheet = document.getElementById('bengt_sprite_sheet');
var stagger = 0;
var staggerFrame = 8;
var spriteFrame = 0;

// Konstanter
const house1 = document.getElementById('house1_sprite_sheet');
const house2 = document.getElementById('house2_sprite_sheet')

function animate() {
    if ((bengt.dx != 0) || (bengt.dy != 0)) {
        if ((stagger % staggerFrame) == 0) {
            if (spriteFrame < 3) {
                spriteFrame++;
            } else {
                spriteFrame = 0
            }
        }

        if (!bengt.reverse) {
            ctx.drawImage(bengtSpriteSheet, 32*spriteFrame, 0, 32, 48, bengt.x, bengt.y, 32, 48)
        } else {
            // move to x + img's width
            // adding img.width is necessary because we're flipping from
            //     the right side of the img so after flipping it's still
            //     at [x,y]
            ctx.translate(bengt.x+32, bengt.y);

            // scaleX by -1; this "trick" flips horizontally
            ctx.scale(-1, 1);

            // draw the img
            // no need for x,y since we've already translated
            ctx.drawImage(bengtSpriteSheet, 32*spriteFrame, 0, 32, 48, 0, 0, 32, 48)

            // always clean up -- reset transformations to default
            ctx.setTransform(1,0,0,1,0,0);
        }
        stagger++;
    } else {
        if (!bengt.reverse) {
            ctx.drawImage(bengtSpriteSheet, 0, 0, 32, 48, bengt.x, bengt.y, 32, 48)
        } else {
            ctx.translate(bengt.x+32, bengt.y);
            ctx.scale(-1, 1);
            ctx.drawImage(bengtSpriteSheet, 0, 0, 32, 48, 0, 0, 32, 48)
            ctx.setTransform(1,0,0,1,0,0);
        }
    }
}

function timer() {
    ctx.font = "24px comic sans";
    ctx.fillText(`Time: ${Math.floor((Date.now()-start)/1000)}`, 250, 30);
}

const items = {
    speed_potion: [1],
    paper: 0,
}

const bengt = {
    x: 100,
    y: 80,
    dx: 0,
    dy: 0,

    name: "Bengt",
    reverse: false,
    inventory: [0, 2, 3, 4] //lägg in: items.speed_potion
}

const scenes = {
    main: 0,
    house1: 1
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
    song.volume = 1.0;
    if (song.duration > 0 && !song.paused) {
        song.pause();
    } else {
        song.play();
    }
}

var setNormal = true;

function speedWalk() {
    i = 0
    setNormal = true;
    while (i < bengt.inventory.length) {
        if (bengt.inventory[i] === items.speed_potion) {
            items.speed_potion[0] = 5;
            staggerFrame = 1;
            header.innerHTML = "speed haha waow";
            setNormal = false;
            break;
        }
        i += 1
    }

    if (setNormal) {
        items.speed_potion[0] = 1;
        staggerFrame = 8;
        header.innerHTML = "Baengans häng";
    }
}

function walkLeft() {
    speedWalk();
    if (!controller['ArrowLeft'].pressed) {
        if (!controller['ArrowRight'].pressed) {
            bengt.dx = 0;
        }
    } else {
        if (controller['ArrowRight'].pressed) {
            bengt.dx = 0;
        } else {
            bengt.dx = -3;
            bengt.reverse = true;
        }
    }
}

function walkUp() {
    speedWalk();
    bengt.dy = -3;
}
function walkDown() {
    speedWalk();
    if (!controller['ArrowDown'].pressed) {
        if (!controller['ArrowUp'].pressed) {
            bengt.dy = 0;
        }
    } else {
        bengt.dy = 3;
    }
}

function walkRight() {
    speedWalk();
    if (!controller['ArrowRight'].pressed) {
        if (!controller['ArrowLeft'].pressed) {
            bengt.dx = 0;
        }
    } else {
        if (controller['ArrowLeft'].pressed) {
            bengt.dx = 0;
        } else {
            bengt.dx = 3;
            bengt.reverse = false;
        }
    }
}


document.addEventListener('keydown', function(e) {
    if (controller[e.key]) {
        controller[e.key].pressed = true;
    }
    if (e.key === 'Escape') {
        togglePlay(bolibompa_theme);
        const index = bengt.inventory.indexOf(items.speed_potion);
        if (index > -1) { // only splice array when item is found
            bengt.inventory.splice(index, 1); // 2nd parameter means remove one item only
        } else {
            bengt.inventory.push(items.speed_potion) // samma som append
        }
    } else if (e.key === 'r') {
        bengt.x = 100;
        bengt.y = 80;
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
    document.add
}

function loop() {
    requestAnimationFrame(loop); //säger till browsern att jag vill utföra en animation och tillkallar en funktion för att uppdatera animationen innan nästa ommålning av canvasen
    ctx.clearRect(0,0,canvas.width,canvas.height); //gör hela canvasen tom
    executeMoves();
    ctx.drawImage(house1, 250, 120)
    ctx.drawImage(house2, 50, 20)
    
    
    animate();
    timer();
    


    bengt.x += bengt.dx*items.speed_potion[0]
    bengt.y += bengt.dy*items.speed_potion[0]
}



//Starta loop funktionen
requestAnimationFrame(loop);