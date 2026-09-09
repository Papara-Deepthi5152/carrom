const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");


/* =====================================================
   BOARD
===================================================== */

const W = 760;
const H = 760;

const BOARD_LEFT = 65;
const BOARD_RIGHT = 695;

const BOARD_TOP = 65;
const BOARD_BOTTOM = 695;

const PLAY_LEFT = 130;
const PLAY_RIGHT = 630;

const BOTTOM_Y = 620;
const TOP_Y = 140;

const COIN_RADIUS = 13;
const STRIKER_RADIUS = 20;

const POCKET_RADIUS = 27;

const FRICTION = 0.985;

const STOP_SPEED = 0.06;


/* =====================================================
   POCKETS
===================================================== */

const pockets = [

    {
        x: BOARD_LEFT,
        y: BOARD_TOP
    },

    {
        x: BOARD_RIGHT,
        y: BOARD_TOP
    },

    {
        x: BOARD_LEFT,
        y: BOARD_BOTTOM
    },

    {
        x: BOARD_RIGHT,
        y: BOARD_BOTTOM
    }

];


/* =====================================================
   GAME VARIABLES
===================================================== */

let coins = [];

let striker;

let player = 1;

let score1 = 0;

let score2 = 0;

let mode = "two";

let moving = false;

let gameOver = false;


/*
   Interaction:

   "none"
   "position"
   "aim"
*/

let interaction = "none";

let startX = 0;

let startY = 0;

let strikerStartX = 0;

let aimX = 0;

let aimY = 0;

let power = 0;


/* =====================================================
   CREATE STRIKER
===================================================== */

function createStriker() {

    striker = {

        x: W / 2,

        y: BOTTOM_Y,

        vx: 0,

        vy: 0

    };

}


/* =====================================================
   PLACE STRIKER ACCORDING TO PLAYER
===================================================== */

function placeStriker() {

    striker.x = W / 2;

    striker.y =
        player === 1
        ? BOTTOM_Y
        : TOP_Y;

    striker.vx = 0;

    striker.vy = 0;

}


/* =====================================================
   CREATE COINS
===================================================== */

function createCoins() {

    coins = [];

    const cx = W / 2;
    const cy = H / 2;


    /* QUEEN */

    coins.push({

        x: cx,

        y: cy,

        vx: 0,

        vy: 0,

        color: "#c83232",

        queen: true,

        pocketed: false

    });


    /* FIRST RING */

    for (let i = 0; i < 6; i++) {

        const angle =
            (Math.PI * 2 / 6) * i;

        coins.push({

            x:
                cx +
                Math.cos(angle) * 28,

            y:
                cy +
                Math.sin(angle) * 28,

            vx: 0,

            vy: 0,

            color:
                i % 2 === 0
                ? "#222"
                : "#f5eadb",

            queen: false,

            pocketed: false

        });

    }


    /* SECOND RING */

    for (let i = 0; i < 12; i++) {

        const angle =
            (Math.PI * 2 / 12) * i;

        coins.push({

            x:
                cx +
                Math.cos(angle) * 56,

            y:
                cy +
                Math.sin(angle) * 56,

            vx: 0,

            vy: 0,

            color:
                i % 2 === 0
                ? "#f5eadb"
                : "#222",

            queen: false,

            pocketed: false

        });

    }

}


/* =====================================================
   NEW GAME
===================================================== */

function newGame() {

    score1 = 0;

    score2 = 0;

    player = 1;

    moving = false;

    interaction = "none";

    createCoins();

    createStriker();

    updateUI();

}


/* =====================================================
   UPDATE UI
===================================================== */

function updateUI() {

    document.getElementById("score1").textContent =
        score1;

    document.getElementById("score2").textContent =
        score2;


    document.getElementById("p1Card")
        .classList.toggle(
            "active",
            player === 1
        );


    document.getElementById("p2Card")
        .classList.toggle(
            "active",
            player === 2
        );


    if (player === 1) {

        document.getElementById("turn")
            .textContent =
            "PLAYER 1 TURN";

    } else {

        document.getElementById("turn")
            .textContent =
            mode === "computer"
            ? "COMPUTER TURN"
            : "PLAYER 2 TURN";

    }


    document.getElementById("p2Name")
        .textContent =
        mode === "computer"
        ? "COMPUTER"
        : "PLAYER 2";

    const message = document.getElementById("gameMessage");
    if (gameOver) {
        if (score1 > score2) {
            message.textContent = "PLAYER 1 WINS!";
        } else if (score2 > score1) {
            message.textContent =
                mode === "computer"
                ? "COMPUTER WINS!"
                : "PLAYER 2 WINS!";
        } else {
            message.textContent = "GAME DRAW!";
        }
    } else {
        message.textContent = "";
    }

}


/* =====================================================
   DRAW BOARD
===================================================== */

function drawBoard() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    /* OUTER WOOD */

    ctx.fillStyle = "#70421f";

    ctx.fillRect(
        35,
        35,
        690,
        690
    );


    /* PLAYING SURFACE */

    ctx.fillStyle = "#e5b878";

    ctx.fillRect(
        BOARD_LEFT,
        BOARD_TOP,
        BOARD_RIGHT - BOARD_LEFT,
        BOARD_BOTTOM - BOARD_TOP
    );


    /* INNER BORDER */

    ctx.strokeStyle = "#63391d";

    ctx.lineWidth = 5;

    ctx.strokeRect(
        90,
        90,
        580,
        580
    );


    drawCenter();

    drawBaselines();

    drawPockets();

}


/* =====================================================
   CENTER DESIGN
===================================================== */

function drawCenter() {

    const cx = W / 2;

    const cy = H / 2;


    ctx.strokeStyle = "#6c3e21";

    ctx.lineWidth = 3;


    ctx.beginPath();

    ctx.arc(
        cx,
        cy,
        85,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.arc(
        cx,
        cy,
        45,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    ctx.fillStyle = "#6c3e21";

    ctx.beginPath();

    ctx.arc(
        cx,
        cy,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   BASELINES
===================================================== */

function drawBaselines() {

    ctx.strokeStyle = "#6c3e21";

    ctx.lineWidth = 4;


    /* BOTTOM */

    ctx.beginPath();

    ctx.moveTo(
        PLAY_LEFT,
        BOTTOM_Y
    );

    ctx.lineTo(
        PLAY_RIGHT,
        BOTTOM_Y
    );

    ctx.stroke();


    /* TOP */

    ctx.beginPath();

    ctx.moveTo(
        PLAY_LEFT,
        TOP_Y
    );

    ctx.lineTo(
        PLAY_RIGHT,
        TOP_Y
    );

    ctx.stroke();


    /* END CIRCLES */

    drawBaselineCircle(
        PLAY_LEFT,
        BOTTOM_Y
    );

    drawBaselineCircle(
        PLAY_RIGHT,
        BOTTOM_Y
    );

    drawBaselineCircle(
        PLAY_LEFT,
        TOP_Y
    );

    drawBaselineCircle(
        PLAY_RIGHT,
        TOP_Y
    );

}


/* =====================================================
   BASELINE CIRCLE
===================================================== */

function drawBaselineCircle(x, y) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        17,
        0,
        Math.PI * 2
    );

    ctx.stroke();

}


/* =====================================================
   DRAW POCKETS
===================================================== */

function drawPockets() {

    for (const p of pockets) {

        ctx.fillStyle = "#24150c";

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            POCKET_RADIUS,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle = "#573018";

        ctx.lineWidth = 5;

        ctx.stroke();

    }

}


/* =====================================================
   DRAW COINS
===================================================== */

function drawCoins() {

    for (const coin of coins) {

        if (coin.pocketed)
            continue;


        ctx.fillStyle = coin.color;

        ctx.beginPath();

        ctx.arc(
            coin.x,
            coin.y,
            COIN_RADIUS,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle = "#111";

        ctx.lineWidth = 1.5;

        ctx.stroke();

    }

}


/* =====================================================
   DRAW STRIKER
===================================================== */

function drawStriker() {

    ctx.fillStyle = "#fafafa";

    ctx.beginPath();

    ctx.arc(
        striker.x,
        striker.y,
        STRIKER_RADIUS,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle = "#222";

    ctx.lineWidth = 3;

    ctx.stroke();


    /* INNER RING */

    ctx.strokeStyle = "#8b5a35";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.arc(
        striker.x,
        striker.y,
        10,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    /* CENTER */

    ctx.fillStyle = "#8b5a35";

    ctx.beginPath();

    ctx.arc(
        striker.x,
        striker.y,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =====================================================
   POINTER POSITION
===================================================== */

function getPointer(event) {

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
            (event.clientX - rect.left) *
            W /
            rect.width,

        y:
            (event.clientY - rect.top) *
            H /
            rect.height

    };

}


/* =====================================================
   DISTANCE
===================================================== */

function distance(
    x1,
    y1,
    x2,
    y2
) {

    return Math.sqrt(

        (x2 - x1) ** 2 +

        (y2 - y1) ** 2

    );

}


/* =====================================================
   POINTER DOWN
===================================================== */

canvas.addEventListener(
    "pointerdown",
    function(event) {

        if (moving || gameOver)
            return;


        /* COMPUTER CANNOT BE CONTROLLED */

        if (
            mode === "computer" &&
            player === 2
        ) {

            return;

        }


        const p =
            getPointer(event);


        const d =
            distance(
                p.x,
                p.y,
                striker.x,
                striker.y
            );


        /*
           ONLY CLICK NEAR STRIKER
        */

        if (d <= 35) {

            interaction = "position";

            startX = p.x;

            startY = p.y;

            strikerStartX =
                striker.x;

            canvas.setPointerCapture(
                event.pointerId
            );

        }

    }
);


/* =====================================================
   POINTER MOVE
===================================================== */

canvas.addEventListener(
    "pointermove",
    function(event) {

        if (interaction === "none")
            return;


        const p =
            getPointer(event);


        /* ==========================================
           POSITION STRIKER LEFT / RIGHT
        ========================================== */

        if (
            interaction === "position"
        ) {

            const dx =
                p.x - startX;

            const dy =
                p.y - startY;


            /*
               HORIZONTAL MOVEMENT
               = POSITION STRIKER
            */

            if (
                Math.abs(dx) >
                Math.abs(dy) * 1.2
            ) {

                striker.x =
                    strikerStartX + dx;


                striker.x =
                    Math.max(
                        PLAY_LEFT + 20,
                        Math.min(
                            PLAY_RIGHT - 20,
                            striker.x
                        )
                    );


                /*
                   STRIKER ALWAYS STAYS
                   ON CURRENT PLAYER'S SIDE
                */

                striker.y =
                    player === 1
                    ? BOTTOM_Y
                    : TOP_Y;

            }


            /*
               VERTICAL DRAG
               = START AIMING
            */

            else if (
                Math.abs(dy) > 10
            ) {

                interaction = "aim";

                aimX = p.x;

                aimY = p.y;

                calculatePower();

            }

        }


        /* ==========================================
           AIM
        ========================================== */

        else if (
            interaction === "aim"
        ) {

            aimX = p.x;

            aimY = p.y;

            calculatePower();

        }

    }
);


/* =====================================================
   CALCULATE POWER
===================================================== */

function calculatePower() {

    const dx =
        aimX - striker.x;

    const dy =
        aimY - striker.y;


    const d =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    power =
        Math.min(
            d / 180,
            1
        );

}


/* =====================================================
   POINTER UP
===================================================== */

canvas.addEventListener(
    "pointerup",
    function(event) {

        if (
            interaction === "aim"
        ) {

            shoot();

        }


        interaction = "none";

        power = 0;


        try {

            canvas.releasePointerCapture(
                event.pointerId
            );

        } catch (e) {}

    }
);


/* =====================================================
   SHOOT
===================================================== */

function shoot() {

    if (moving)
        return;


    if (power < 0.08)
        return;


    /*
       AIM POINT -> STRIKER

       The striker travels from
       the pulled point back toward
       the striker.
    */

    let dx =
        striker.x - aimX;

    let dy =
        striker.y - aimY;


    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (length === 0)
        return;


    dx /= length;

    dy /= length;


    const speed =
        14 * power;


    striker.vx =
        dx * speed;

    striker.vy =
        dy * speed;


    moving = true;

}


/* =====================================================
   PHYSICS UPDATE
===================================================== */

function updatePhysics() {

    if (!moving)
        return;


    /* MOVE STRIKER */

    striker.x += striker.vx;

    striker.y += striker.vy;


    /* FRICTION */

    striker.vx *= FRICTION;

    striker.vy *= FRICTION;


    /* MOVE COINS */

    for (const coin of coins) {

        if (coin.pocketed)
            continue;


        coin.x += coin.vx;

        coin.y += coin.vy;


        coin.vx *= FRICTION;

        coin.vy *= FRICTION;


        if (
            Math.abs(coin.vx) <
            STOP_SPEED
        ) {

            coin.vx = 0;

        }


        if (
            Math.abs(coin.vy) <
            STOP_SPEED
        ) {

            coin.vy = 0;

        }


        coinWallCollision(coin);

    }


    strikerWallCollision();

    strikerCoinCollision();

    coinCoinCollision();

    checkPockets();


    if (
        allStopped()
    ) {

        moving = false;

        endTurn();

    }

}


/* =====================================================
   STRIKER WALL
===================================================== */

function strikerWallCollision() {

    const r =
        STRIKER_RADIUS;


    if (
        striker.x - r <
        BOARD_LEFT
    ) {

        striker.x =
            BOARD_LEFT + r;

        striker.vx *= -0.8;

    }


    if (
        striker.x + r >
        BOARD_RIGHT
    ) {

        striker.x =
            BOARD_RIGHT - r;

        striker.vx *= -0.8;

    }


    if (
        striker.y - r <
        BOARD_TOP
    ) {

        striker.y =
            BOARD_TOP + r;

        striker.vy *= -0.8;

    }


    if (
        striker.y + r >
        BOARD_BOTTOM
    ) {

        striker.y =
            BOARD_BOTTOM - r;

        striker.vy *= -0.8;

    }

}


/* =====================================================
   COIN WALL
===================================================== */

function coinWallCollision(coin) {

    const r =
        COIN_RADIUS;


    if (
        coin.x - r <
        BOARD_LEFT
    ) {

        coin.x =
            BOARD_LEFT + r;

        coin.vx *= -0.85;

    }


    if (
        coin.x + r >
        BOARD_RIGHT
    ) {

        coin.x =
            BOARD_RIGHT - r;

        coin.vx *= -0.85;

    }


    if (
        coin.y - r <
        BOARD_TOP
    ) {

        coin.y =
            BOARD_TOP + r;

        coin.vy *= -0.85;

    }


    if (
        coin.y + r >
        BOARD_BOTTOM
    ) {

        coin.y =
            BOARD_BOTTOM - r;

        coin.vy *= -0.85;

    }

}


/* =====================================================
   STRIKER - COIN COLLISION
===================================================== */

function strikerCoinCollision() {

    for (const coin of coins) {

        if (coin.pocketed)
            continue;


        const dx =
            coin.x - striker.x;

        const dy =
            coin.y - striker.y;


        const dist =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        const minDist =
            STRIKER_RADIUS +
            COIN_RADIUS;


        if (
            dist < minDist &&
            dist > 0
        ) {

            const nx =
                dx / dist;

            const ny =
                dy / dist;


            /* SEPARATE */

            const overlap =
                minDist - dist;


            coin.x +=
                nx * overlap;

            coin.y +=
                ny * overlap;


            /* RELATIVE VELOCITY */

            const rvx =
                striker.vx -
                coin.vx;

            const rvy =
                striker.vy -
                coin.vy;


            const velocity =
                rvx * nx +
                rvy * ny;


            if (velocity > 0) {

                const impulse =
                    velocity * 0.95;


                coin.vx +=
                    nx * impulse;

                coin.vy +=
                    ny * impulse;


                striker.vx *= 0.55;

                striker.vy *= 0.55;

            }

        }

    }

}


/* =====================================================
   COIN - COIN COLLISION
===================================================== */

function coinCoinCollision() {

    for (
        let i = 0;
        i < coins.length;
        i++
    ) {

        const a =
            coins[i];


        if (a.pocketed)
            continue;


        for (
            let j = i + 1;
            j < coins.length;
            j++
        ) {

            const b =
                coins[j];


            if (b.pocketed)
                continue;


            const dx =
                b.x - a.x;

            const dy =
                b.y - a.y;


            const dist =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            const minDist =
                COIN_RADIUS * 2;


            if (
                dist < minDist &&
                dist > 0
            ) {

                const nx =
                    dx / dist;

                const ny =
                    dy / dist;


                const overlap =
                    minDist - dist;


                a.x -=
                    nx *
                    overlap / 2;

                a.y -=
                    ny *
                    overlap / 2;


                b.x +=
                    nx *
                    overlap / 2;

                b.y +=
                    ny *
                    overlap / 2;


                const rvx =
                    b.vx -
                    a.vx;

                const rvy =
                    b.vy -
                    a.vy;


                const velocity =
                    rvx * nx +
                    rvy * ny;


                if (velocity < 0) {

                    const impulse =
                        -velocity * 0.9;


                    a.vx -=
                        nx * impulse / 2;

                    a.vy -=
                        ny * impulse / 2;


                    b.vx +=
                        nx * impulse / 2;

                    b.vy +=
                        ny * impulse / 2;

                }

            }

        }

    }

}


/* =====================================================
   CHECK POCKETS
===================================================== */

function checkPockets() {


    /* COINS */

    for (const coin of coins) {

        if (coin.pocketed)
            continue;


        for (const pocket of pockets) {

            const d =
                distance(
                    coin.x,
                    coin.y,
                    pocket.x,
                    pocket.y
                );


            if (
                d <
                POCKET_RADIUS
            ) {

                coin.pocketed = true;

                coin.vx = 0;

                coin.vy = 0;


                if (coin.queen) {

                    addScore(2);

                } else {

                    addScore(1);

                }


                break;

            }

        }

    }


    /* STRIKER */

    for (const pocket of pockets) {

        const d =
            distance(
                striker.x,
                striker.y,
                pocket.x,
                pocket.y
            );


        if (
            d <
            POCKET_RADIUS
        ) {

            /*
               STRIKER FOUL
            */

            addScore(-1);

            placeStriker();

            break;

        }

    }

}


/* =====================================================
   ADD SCORE
===================================================== */

function addScore(points) {

    if (player === 1) {

        score1 =
            Math.max(
                0,
                score1 + points
            );

    } else {

        score2 =
            Math.max(
                0,
                score2 + points
            );

    }


    updateUI();

}


/* =====================================================
   ALL OBJECTS STOPPED
===================================================== */

function allStopped() {

    if (
        Math.abs(striker.vx) >
        STOP_SPEED ||

        Math.abs(striker.vy) >
        STOP_SPEED
    ) {

        return false;

    }


    for (const coin of coins) {

        if (coin.pocketed)
            continue;


        if (
            Math.abs(coin.vx) >
            STOP_SPEED ||

            Math.abs(coin.vy) >
            STOP_SPEED
        ) {

            return false;

        }

    }


    return true;

}


/* =====================================================
   END TURN
===================================================== */

function endTurn() {

    /*
       SWITCH PLAYER
    */

    player =
        player === 1
        ? 2
        : 1;


    /*
       STRIKER GOES TO
       OPPOSITE SIDE
    */

    placeStriker();

    updateUI();


    /*
       COMPUTER TURN
    */

    if (
        mode === "computer" &&
        player === 2
    ) {

        setTimeout(
            computerTurn,
            900
        );

    }

}


/* =====================================================
   COMPUTER
===================================================== */

function computerTurn() {

    if (moving)
        return;


    if (
        mode !== "computer" ||
        player !== 2
    ) {

        return;

    }


    const available =
        coins.filter(
            c =>
                !c.pocketed &&
                !c.queen
        );


    if (
        available.length === 0
    ) {

        return;

    }


    /*
       FIND A RANDOM COIN
    */

    const target =
        available[
            Math.floor(
                Math.random() *
                available.length
            )
        ];


    /*
       COMPUTER STRIKER
       IS ON TOP
    */

    striker.y = TOP_Y;


    /*
       POSITION UNDER/NEAR TARGET
    */

    striker.x =
        Math.max(
            PLAY_LEFT + 20,
            Math.min(
                PLAY_RIGHT - 20,
                target.x
            )
        );


    /*
       AIM DOWNWARD
    */

    let dx =
        target.x -
        striker.x;

    let dy =
        target.y -
        striker.y;


    /*
       SMALL ERROR
    */

    dx +=
        (Math.random() - 0.5) *
        35;


    dy +=
        (Math.random() - 0.5) *
        20;


    const len =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (len === 0)
        return;


    dx /= len;

    dy /= len;


    const speed =
        9 + Math.random() * 4;


    striker.vx =
        dx * speed;

    striker.vy =
        dy * speed;


    moving = true;

}


/* =====================================================
   DRAW AIM LINE
===================================================== */

function drawAimLine() {

    if (
        interaction !== "aim"
    )
        return;


    if (moving)
        return;


    const dx =
        striker.x - aimX;

    const dy =
        striker.y - aimY;


    const len =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (len === 0)
        return;


    const nx =
        dx / len;

    const ny =
        dy / len;


    const lineLength =
        100 +
        power * 180;


    ctx.setLineDash([
        8,
        8
    ]);


    ctx.strokeStyle =
        "rgba(70,40,20,0.6)";

    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.moveTo(
        striker.x,
        striker.y
    );

    ctx.lineTo(
        striker.x +
        nx * lineLength,

        striker.y +
        ny * lineLength
    );

    ctx.stroke();


    ctx.setLineDash([]);

}


/* =====================================================
   GAME LOOP
===================================================== */

function gameLoop() {

    updatePhysics();

    drawBoard();

    drawCoins();

    drawAimLine();

    drawStriker();

    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   BUTTONS
===================================================== */

document
    .getElementById("twoPlayer")
    .addEventListener(
        "click",
        function() {

            mode = "two";

            this.classList.add(
                "active"
            );

            document
                .getElementById("computer")
                .classList.remove(
                    "active"
                );

            newGame();

        }
    );


document
    .getElementById("computer")
    .addEventListener(
        "click",
        function() {

            mode = "computer";

            this.classList.add(
                "active"
            );

            document
                .getElementById("twoPlayer")
                .classList.remove(
                    "active"
                );

            newGame();

        }
    );


document
    .getElementById("newGame")
    .addEventListener(
        "click",
        newGame
    );


/* =====================================================
   START GAME
===================================================== */

newGame();

gameLoop();