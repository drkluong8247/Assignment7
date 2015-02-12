window.onload = function () {
    "use strict";

    var game = new Phaser.Game(800, 800,
        Phaser.AUTO, 'game',
        {preload: preload, create: create, update: update}
    );

    function preload() {

        // load songs
        game.load.audio("main", "assets/new/main.mp3");

        // spaceship
        game.load.spritesheet("ship", "assets/new/ships.png", 256, 277);
        game.load.image("enemyShip", "assets/new/ship/png/eShip.png");
        game.load.image("bg", "assets/new/m6.png");
        

        // bullets
        game.load.image("pBullet", "assets/new/big_bullet_single.png");
        game.load.image("eBullet", "assets/new/little_bullet_single.png");

    }

    var playerBot;
    var botHealth = 3;
    var playerTop;
    var topHealth = 3;
    var playerRight;
    var rightHealth = 3;
    var playerLeft;
    var leftHealth = 3;

    var score = 0;
    var highScore = 0;

    var text = {top: "Top Health: ",
                bottom: "Bottom Health: ",
                left: "Left Health: ",
                right: "Right Health: "};
    var t1, t2, t3, t4;
    var style;

    var aliens;
    var alien;

    var cursors;
    var wasd;
    var resetButton;

    var pBullets;
    var pBulletTime = 0;
    var pBullet;
    var pBulletDelay = 300; // 400 ms

    var eBullets;
    var eBulletTime = 0;
    var eBullet;

    var numShot = 0;



    function create() {
        // start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //set background
        game.add.tileSprite(0,0, "bg");

        var audio = game.add.audio("main");
        audio.play();

        //game.stage.backgroundColor = "#FFFF00";

        // show text
        style = {font: "24px Arial", fill: "#ffff00", align: "center"};

        t1 = game.add.text(320, 0, text.top + topHealth, style);
        t2 = game.add.text(320, 770, text.bottom + botHealth, style);
        t3 = game.add.text(10, 770, text.left + leftHealth, style);
        t4 = game.add.text(635, 770, text.right + rightHealth, style);


        // add four player ships
        enablePlayers();

        // add buttons
        addButtons();

        // add bullets
        addBullets();

        // add enemy bullets
        addEnemyBullets();

        // add enemies
        createAliens();
    }

    function update() {


        // check collisions
        game.physics.arcade.overlap(pBullet, alien, playerHitsEnemy, null, this);
        game.physics.arcade.overlap(eBullet, playerBot, enemyHitsPlayerB, null, this);
        game.physics.arcade.overlap(eBullet, playerTop, enemyHitsPlayerT, null, this);
        game.physics.arcade.overlap(eBullet, playerLeft, enemyHitsPlayerL, null, this);
        game.physics.arcade.overlap(eBullet, playerRight, enemyHitsPlayerR, null, this);

        // process player input
        checkPlayerInput();

        // rotate all aliens in place
        rotateAliens();
    }

    function playerHitsEnemy() {

        numShot++;

        var x = alien.x;
        var y = alien.y;

        alien.kill();
        pBullet.kill();

// ---------------- Q1 ---------------------------
        // one
        eBullet = eBullets.getFirstExists(false);
        eBullet.reset(400 + x, 400 + y);
        eBullet.body.velocity.x = 0;
        eBullet.body.velocity.y = -240;

        // two
        eBullet = eBullets.getFirstExists(false);
        eBullet.reset(400 + x, 400 + y);
        eBullet.body.velocity.x = 160;
        eBullet.body.velocity.y = -160;


        // three
        eBullet = eBullets.getFirstExists(false);
        eBullet.reset(400 + x, 400 + y);
        eBullet.body.velocity.x = 240;
        eBullet.body.velocity.y = 0;

// ------------------- Q2 ------------------------

        // four
        eBullet = eBullets.getFirstExists(false);
        eBullet.reset(400 + x, 400 + y);
        eBullet.body.velocity.x = 160;
        eBullet.body.velocity.y = 160;

        // five
        eBullet = eBullets.getFirstExists(false);
        eBullet.reset(400 + x, 400 + y);
        eBullet.body.velocity.x = 0;
        eBullet.body.velocity.y = 240;

// ------------------- Q3 ------------------------

        // eight
        eBullet = eBullets.getFirstExists(false);
        eBullet.reset(400 + x, 400 + y);
        eBullet.body.velocity.x = -160;
        eBullet.body.velocity.y = 160;


        // nine
        eBullet = eBullets.getFirstExists(false);
        eBullet.reset(400 + x, 400 + y);
        eBullet.body.velocity.x = -240;
        eBullet.body.velocity.y = 0;

// ------------------- Q4 ------------------------

        // ten
        eBullet = eBullets.getFirstExists(false);
        eBullet.reset(400 + x, 400 + y);
        eBullet.body.velocity.x = -160;
        eBullet.body.velocity.y = -160;

        for(var i = 0; i < numShot; i++) {

            var newX = Math.floor(Math.random() * 501 - 300);
            var newY = Math.floor(Math.random() * 501 - 300);

            alien = alien.reset(newX, newY);

            newX = Math.floor(Math.random() * 501 - 300);
            newY = Math.floor(Math.random() * 501 - 300);

            var alien2 = aliens.create(newX, newY, "enemyShip");
            alien2.anchor.setTo(.5,.5);
            alien2.scale.x = .15;
            alien2.scale.y = .15;
            alien2.body.moves = false;

            newX = 0;
            newY = 0;

        }


    }

    function enemyHitsPlayerB() {

        eBullet.kill();
        if(botHealth < 0) {
            if(topHealth >= 0 || leftHealth >= 0 || rightHealth >= 0) {
                playerBot.kill();
            } else {
                game.paused = true;
                var restartText = "You Died! Reload the Page to Restart...";
                var style = {font: "42px Arial", fill: "#ff0000", align: "center"};
                var t = game.add.text(20, 258, restartText, style);
            }
        } else {
            botHealth -= 1;
            t2 = game.add.text(320, 770, text.bottom + botHealth, style);

            eBullet.kill();
        }

    }

    function enemyHitsPlayerT() {

        eBullet.kill();
        if(topHealth < 0) {
            if(topHealth >= 0 || leftHealth >= 0 || rightHealth >= 0) {
                playerTop.kill();
            } else {
                game.paused = true;
                var restartText = "You Died! Reload the Page to Restart...";
                var style = {font: "42px Arial", fill: "#ff0000", align: "center"};
                var t = game.add.text(20, 258, restartText, style);
            }
        } else {
            topHealth -= 1;
            t1 = game.add.text(320, 0, text.top + topHealth, style);
            eBullet.kill();
        }

    }

    function enemyHitsPlayerL() {

        eBullet.kill();
        if(leftHealth < 0) {
            if(topHealth >= 0 || leftHealth >= 0 || rightHealth >= 0) {
                playerLeft.kill();
            } else {
                game.paused = true;
                var restartText = "You Died! Reload the Page to Restart...";
                var style = {font: "42px Arial", fill: "#ff0000", align: "center"};
                var t = game.add.text(20, 258, restartText, style);
            }
        } else {
            leftHealth -= 1;
            t3 = game.add.text(10, 770, text.left + leftHealth, style);

            eBullet.kill();
        }

    }

    function enemyHitsPlayerR() {

        eBullet.kill();
        if(rightHealth < 0) {
            if(topHealth >= 0 || leftHealth >= 0 || rightHealth >= 0) {
                playerTop.kill();
            } else {
                game.paused = true;
                var restartText = "You Died! Reload the Page to Restart...";
                var style = {font: "42px Arial", fill: "#ff0000", align: "center"};
                var t = game.add.text(20, 258, restartText, style);
            }
        } else {
            rightHealth -= 1;
            t4 = game.add.text(635, 770, text.right + rightHealth, style);

            eBullet.kill();
        }

    }

    // set up buttons for use
    function addButtons() {

        // enable buttons
        cursors = game.input.keyboard.createCursorKeys();
        resetButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        wasd = {
            w: game.input.keyboard.addKey(Phaser.Keyboard.W),
            a: game.input.keyboard.addKey(Phaser.Keyboard.A),
            s: game.input.keyboard.addKey(Phaser.Keyboard.S),
            d: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
    }

    // set up aliens and create first
    function createAliens() {


        aliens = game.add.group();
        aliens.enableBody = true;
        aliens.physicsBodyType = Phaser.Physics.ARCADE;

        alien = aliens.create(0, 0, "enemyShip");
        alien.anchor.setTo(.5,.5);
        alien.scale.x = .15;
        alien.scale.y = .15;
        alien.body.moves = false;

        aliens.x = 400;
        aliens.y = 400;

    }

    // rotate around group center at (400, 400)
    function rotateAliens() {
        aliens.angle += 2;
    }

    // process player input
    function checkPlayerInput() {

        // reset movements
        playerRight.body.velocity.x = 0;
        playerRight.body.velocity.y = 0;

        playerLeft.body.velocity.x = 0;
        playerLeft.body.velocity.y = 0;

        playerBot.body.velocity.x = 0;
        playerBot.body.velocity.y = 0;

        playerTop.body.velocity.x = 0;
        playerTop.body.velocity.y = 0;

        // allow for player movements
        if(cursors.left.isDown) {
            playerBot.body.velocity.x = -300;
            playerTop.body.velocity.x = -300;
        }

        if(cursors.right.isDown) {
            playerBot.body.velocity.x = 300;
            playerTop.body.velocity.x = 300;
        }

        if(cursors.down.isDown) {
            playerLeft.body.velocity.y = 300;
            playerRight.body.velocity.y = 300;
        }

        if(cursors.up.isDown) {
            playerRight.body.velocity.y = -300;
            playerLeft.body.velocity.y = -300;
        }

        // shoot cannons up, left, down, or right
        if(wasd.w.isDown) {
            fireBullet(wasd.w);
        } else if(wasd.a.isDown) {
            fireBullet(wasd.a);
        } else if(wasd.s.isDown) {
            fireBullet(wasd.s);
        } else if(wasd.d.isDown) {
            fireBullet(wasd.d);
        }
    }

    // build four player ships
    function enablePlayers() {

        // Bottom ship
        playerBot = game.add.sprite(400, 775, "ship");
        playerBot.scale.x = .5;
        playerBot.scale.y = .5;
        playerBot.anchor.setTo(.5,.5);
        game.physics.enable(playerBot, Phaser.Physics.ARCADE);
        playerBot.body.collideWorldBounds = true;

        // Top Ship
        playerTop = game.add.sprite(400, 25, "ship");
        playerTop.scale.x = .5;
        playerTop.scale.y = -.5;
        playerTop.anchor.setTo(.5,.5);
        game.physics.enable(playerTop, Phaser.Physics.ARCADE);
        playerTop.body.collideWorldBounds = true;

        // left Ship
        playerLeft = game.add.sprite(25, 400, "ship");
        playerLeft.angle += 90;
        playerLeft.scale.x = .5;
        playerLeft.scale.y = .5;
        playerLeft.anchor.setTo(.5,.5);
        game.physics.enable(playerLeft, Phaser.Physics.ARCADE);
        playerLeft.body.collideWorldBounds = true;

        // right ship
        playerRight = game.add.sprite(775, 400, "ship");
        playerRight.angle += -90;
        playerRight.scale.x = .5;
        playerRight.scale.y = .5;
        playerRight.anchor.setTo(.5,.5);
        game.physics.enable(playerRight, Phaser.Physics.ARCADE);
        playerRight.body.collideWorldBounds = true;

    }

    // build bullets
    function addBullets() {

        // my bullets
        pBullets = game.add.group();
        pBullets.enableBody = true;
        pBullets.physicsBodyType = Phaser.Physics.ARCADE;
        pBullets.createMultiple(30, "pBullet");
        pBullets.setAll("anchor.x",.5);
        pBullets.setAll("anchor.y",1);
        pBullets.setAll("outOfBoundsKill", true);
        pBullets.setAll("checkWorldBounds", true);

        // enemy bullets
        eBullets = game.add.group();
        eBullets.enableBody = true;
        eBullets.physicsBodyType = Phaser.Physics.ARCADE;
        eBullets.createMultiple(15, 'enemyBullet');
        eBullets.setAll('anchor.x', 0.5);
        eBullets.setAll('anchor.y', 1);
        eBullets.setAll('outOfBoundsKill', true);
        eBullets.setAll('checkWorldBounds', true);
    }

    // build enemyBullets
    function addEnemyBullets() {
        eBullets = game.add.group();
        eBullets.enableBody = true;
        eBullets.physicsBodyType = Phaser.Physics.ARCADE;
        eBullets.createMultiple(100, 'eBullet');
        eBullets.setAll('anchor.x', 0.5);
        eBullets.setAll('anchor.y', 1);
        eBullets.setAll('outOfBoundsKill', true);
        eBullets.setAll('checkWorldBounds', true);
    }

    // fire player bullets
    function fireBullet(button) {

        // limit attack
        if(game.time.now > pBulletTime) {

            // get bullet and reset angle before adjusting
            pBullet = pBullets.getFirstExists(false);
            pBullet.angle = 0;

            if(pBullet && (button === wasd.w)) {

                // fire up
                pBullet.reset(playerBot.x, playerBot.y);
                pBullet.angle += -90;
                pBullet.body.velocity.y = -400;

                pBulletTime = game.time.now + pBulletDelay;

            } else if(pBullet && (button === wasd.a)) {

                // fire left
                pBullet.reset(playerRight.x, playerRight.y);
                pBullet.angle += 180;
                pBullet.body.velocity.x = -400;

                pBulletTime = game.time.now + pBulletDelay;

            } else if(pBullet && (button === wasd.s)) {

                // fire down
                pBullet.reset(playerTop.x, playerTop.y);
                pBullet.angle += 90;
                pBullet.body.velocity.y = 400;

                pBulletTime = game.time.now + pBulletDelay;

            } else if(pBullet && (button === wasd.d)) {

                // fire right
                pBullet.reset(playerLeft.x, playerLeft.y);
                pBullet.body.velocity.x = 400;

                pBulletTime = game.time.now + pBulletDelay;
            }
        }
    }


}
