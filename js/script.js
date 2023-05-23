const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Random
const header = document.getElementById("header");
var start = Date.now();
var setNormal = true;

// Ljud
const bolibompa_theme = document.getElementById('bolibompa_theme');
const press_t = document.getElementById('press_t');
const drawer_sound = document.getElementById('grattis');
const drunknar = document.getElementById('drunknar');
const mimimi = document.getElementById('mimimi');

// Animation
const bengtSpriteSheet = document.getElementById('bengt_sprite_sheet');
var stagger = 0;
var staggerFrame = 8;
var spriteFrame = 0;

// Konstanter
const house1 = document.getElementById('house1_sprite_sheet');
const house2 = document.getElementById('house2_sprite_sheet');
const grass_background = document.getElementById('grass_background');
const house1_inside = document.getElementById('inside_house1');
const bengt_bild = document.getElementById('bengt_bild');
const house2_inside = document.getElementById('inside_house2');
const bengt_drown = document.getElementById('bengt_drown');

const door1 = {
    width: 11,
    height: 5,
    x: 138,
    y: 50
}

const door2 = {
    width: 11,
    height: 5,
    x: 276,
    y: 158
}

const drawer = {
    width: 100,
    height: 60,
    x: 50,
    y: 20
}

const river = {
    width: 136,
    height: 50,
    x: 0,
    y: 220
}

function animate() {
    if (scene === 0) {
        if (collides(bengt, river)) {
            bengt.x = 45;
            bengt.y = 235;
            ctx.drawImage(bengt_drown, bengt.x, bengt.y);
            header.innerHTML = "Inside Drown"
            toggleSound(drunknar);
            return;
        }
    } else if (scene === 3) {
        if (collides(bengt, river)) {
            bengt.x = 26;
            bengt.y = 223;
            ctx.save();
            ctx.translate(bengt.x + bengt.width / 2, bengt.y + bengt.height / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.translate(-bengt.x - bengt.width / 2, -bengt.y - bengt.height / 2);
            ctx.drawImage(bengt_drown, bengt.x, bengt.y, bengt.width, bengt.height);
            ctx.restore();
            header.innerHTML = "Inside Bed"
            toggleSound(mimimi);
            return;
        }
    }
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
    width: 32,
    height: 48,

    name: "Bengt",
    reverse: false,
    inventory: [] //lägg in: items.speed_potion
}

var scene = 0;

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

function toggleSound(sound) {
    sound.play();
}

// Kolla efter kollision mellan två objekt med hjälp av "axis-aligned bounding box (AABB)"
// Källa: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

function speedWalk() {
    i = 0
    setNormal = true;
    while (i < bengt.inventory.length) {
        if (bengt.inventory[i] === items.speed_potion) {
            items.speed_potion[0] = 5;
            staggerFrame = 2;
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

function screenCollide() {
    if (bengt.x > (360-bengt.width)) {
        bengt.x = 360-bengt.width;
    } else if (bengt.x < 0) {
        bengt.x = 0;
    }

    if (bengt.y > (270-bengt.height)) {
        bengt.y = 270-bengt.height;
    } else if (bengt.y < 0) {
        bengt.y = 0;
    }
}

// function houseCollide() {
    // if (bengt.width > ())
// }

function enterDoor() {
    if (collides(bengt, door1)) {
        scene = 1;
        bengt.x = 100;
        bengt.y = 180;
    }

    if (collides(bengt, door2)) {
        scene = 3;
        bengt.x = 300;
        bengt.y = 180;
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
        scene = 0;
    } else if (e.key === 't') {
        if (collides(bengt, drawer)) {
            toggleSound(drawer_sound);
            scene = 2;
        }
    }
});
document.addEventListener('keyup', function(e) {
    if (controller[e.key]) {
        controller[e.key].pressed = false;
    }
});
// tar elementen i kontroller konstanten och använder Foreach loop för att utföra funktionerna de är associerade med
const executeMoves = () => {Object.keys(controller).forEach(key=> {controller[key].func()})}

function interact() {
    
}

function loop() {
    requestAnimationFrame(loop); //säger till browsern att jag vill utföra en animation och tillkallar en funktion för att uppdatera animationen innan nästa ommålning av canvasen
    ctx.clearRect(0,0,canvas.width,canvas.height); //gör hela canvasen tom
    if (scene === 0) {
        ctx.drawImage(grass_background, 0, 0);
        enterDoor();
        ctx.drawImage(house1, 250, 120)
        ctx.drawImage(house2, 50, 20)

    } else if (scene === 1) {
        ctx.drawImage(house1_inside, 0, 0);
        if (collides(bengt, drawer)) {
            ctx.fillStyle = "white";
            ctx.fillRect(76, 8, 44, 15);
            ctx.fillStyle = "black";
            ctx.rect(76, 8, 44, 15);
            ctx.stroke();
            ctx.font = "12px comic sans";
            ctx.fillText("Press T", 80, 20);
            toggleSound(press_t);
        }
    } else if (scene === 2) {
        ctx.drawImage(bengt_bild, 0, 0)
        if (drawer_sound.paused) {
            scene = 0;
            togglePlay(bolibompa_theme);
            const index = bengt.inventory.indexOf(items.speed_potion);
            if (index > -1) { // only splice array when item is found
                bengt.inventory.splice(index, 1); // 2nd parameter means remove one item only
            } else {
                bengt.inventory.push(items.speed_potion) // samma som append
            }
        }
    } else if (scene === 3) {
        ctx.drawImage(house2_inside, 0, 0)
    }
    executeMoves();
    screenCollide();
    animate();
    timer();

    // ctx.fillRect(138, 50, 11, 5); DOOR1
    // ctx.fillRect(276, 158, 11, 5); DOOR2
    


    bengt.x += bengt.dx*items.speed_potion[0]
    bengt.y += bengt.dy*items.speed_potion[0]
}



//Starta loop funktionen
requestAnimationFrame(loop);