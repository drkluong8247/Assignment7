window.onload = function () {
    "use strict";

    var game = new Phaser.Game(800, 600,
        Phaser.AUTO, 'Remembrance of Dog',
        {preload: preload, create: create, update: update}
    );

    function preload() {
        // load sprites
        game.load.spritesheet("player", "assets/sprites/dog.png", 46, 27, 4);
        game.load.spritesheet("catcher", "assets/sprites/dc.png", 32, 32);

        // load images
        game.load.image("laser", "assets/sprites/laser.png");
        game.load.image("brick", "assets/backgrounds/brick.png");
        game.load.image("road", "assets/backgrounds/road.png");
        game.load.image("box", "assets/box.png");

        // loads audio
        game.load.audio("woof", "assets/woof.mp3");
        game.load.audio("theme", "assets/music/SummerTown.mp3");
    }

    var music;          // music for the game
    var woof;           // sound of player barking
    var background;     // background of game
    var ground;         // level the player walks on
    var boxes;          // group of boxes to walk on
    var box;            // holds a single box at a time
    var player;         // holds the sprite of the player
    var cursors;        // buttons corresponding to arrows up, down, left, and right
    var spacebar;       // holds spacebar button operations
    var lasers;         // group of lasers
    var laser;          // holds a single laser at a time
    var laserTime = 0;  // time at which last laser was fired

    var catchers;       // group to hold dog catchers
    var catcher;        // individual catcher
    var lives = 4;      // how many times you can be hit

    var text;
    var points = 0;
    var t;

    var numKilled = 0;


    function create() {

//------------------- add sounds ----------------------------------------
        // add music on loop
        music = game.add.audio("theme", 2, true);
        music.play("", 0, 1, true);

        // add bark sound
        woof = game.add.audio("woof", 4, false);

//-------------------- Set up environment --------------------------------
        // start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // add background
        background = game.add.sprite(0, 0, "brick");

        // add ground
        ground = game.add.sprite(0, game.world.height - 70, "road");
        game.physics.arcade.enable(ground);
        ground.body.immovable = true;

        // add boxes
        boxes = game.add.group();
        boxes.enableBody = true;
        drawBoxes();

        // add text
        updateText();

//------------------- Set up player --------------------------------------
        // add player
        player = game.add.sprite(82, game.world.height - 70, "player");
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 300;
        player.animations.add("run", [0, 1, 2, 3, 4], 7, true);

        // transform player model
        player.anchor.setTo(.5, 1);
        player.scale.x = -2;
        player.scale.y = 2;

// ---------------------- Add Player Controls ----------------------------
        // add arrows for movement
        cursors = game.input.keyboard.createCursorKeys();

        // add spacebar to fire lasers
        spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

//----------------------- Add Lasers -------------------------------------
        lasers = game.add.group();
        lasers.enableBody = true;
        lasers.physicsBodyType = Phaser.Physics.ARCADE;
        lasers.createMultiple(30, 'laser');             // create 30 lasers ready to go
        lasers.setAll("outOfBoundsKill", true);
        lasers.setAll("checkWorldBounds", true);

//------------------------ Add Dog Catcher -------------------------------
        /*
        catcher = game.add.sprite(Math.floor(Math.random() * 801), 0, "catcher");
        game.physics.arcade.enable(catcher);
        catcher.body.collideWorldBounds = true;
        catcher.body.velocity.x = 150;
        catcher.body.velocity.y = 100;

        //catcher.body.gravity.y = 300;
        catcher.animations.add("attack", [0, 1], 10, true);
        catcher.animations.play("attack");
        */

        drawNewCatcher();
    }

    function update() {

        game.physics.arcade.moveToObject(catcher, player);

 // ------------------------ Collisions ----------------------------------

        game.physics.arcade.collide(player, ground);    // check if player is on the ground

        game.physics.arcade.collide(player, boxes);     // check if player is colliding with boxes

        game.physics.arcade.overlap(player, catcher, playerCollisionHandler, null, this);

        //game.physics.overlap(player.sprite, catcher.sprite, laserCollisionHandler, null, this);



// ---------------------- Movement ---------------------------------------
        // reset player velocity
        player.body.velocity.x = 0;

        // check for input from controls
        checkControls();
    }

    function playerCollisionHandler() {
        if(lives <= 0) {
            catcher.kill();
            player.scale.y = -2;

            game.world.remove(t);
            game.pause = true;
            var restartText = "You Died! Click to restart...";
            var style = {font: "42px Arial", fill: "#ff0000", align: "center"};
            t = game.add.text(180, 258, restartText, style);

        } else {
            catcher.kill();
            lives -= 1;
            points += 10;
            game.world.remove(t);
            updateText();

            numKilled++;
            drawCatcher(numKilled);
        }

        return;
    }

    function laserCollisionHandler() {

    }

    function updateText() {
        // write text
        text = "Points: " + points + "\nLives: " + lives;
        var style = {font: "32px Arial", fill: "#ffffff", align: "left"};
        t = game.add.text(0, 0, text, style);
    }

    function checkControls() {
        if (cursors.right.isDown) { // move right

            player.scale.x = -2;
            player.body.velocity.x = 150;
            player.animations.play("run");

        } else if (cursors.left.isDown) {   // move left

            player.scale.x = 2;
            player.body.velocity.x = -150;
            player.animations.play("run");

        } else {    // stop walking animations

            player.animations.stop();
            player.frame = 4;

        }

        // jump
        if (cursors.up.isDown && player.body.touching.down) {
            player.body.velocity.y = -300;
        }

        // fire laser
        if(spacebar.isDown) {
            woof.play();
            fireLaser();
            laser.scale.x = 1;
        }
    }

    function fireLaser() {
        // check to see if enough time has passed
        if(game.time.now > laserTime) {

            // grab prepared laser created above from the 30
            laser = lasers.getFirstExists(false);

            if(laser) {
                // if the player is facing right
                if (player.scale.x === -2) {

                    // move laser to appropriate location
                    laser.reset(player.x + 50, player.y - 40);
                    laser.body.velocity.x = 300;

                    // set next time to fire at minimum of .2 second away.
                    laserTime = game.time.now + 200;

                    // if the player is facing left
                } else if (player.scale.x === 2) {

                    // move laser to appropriate location
                    laser.reset(player.x - 68, player.y - 40);
                    laser.body.velocity.x = -300;

                    // set next time to fire at minimum of .2 second away.
                    laserTime = game.time.now + 200;
                }
            }
        }
    }

    function drawNewCatcher() {

        /*
        // get first catcher in existance
        catcher = catchers.getFirstDead();
        catcher.revive();
        //game.physics.enable(catcher, Phaser.Physics.ARCADE);

        // add animation
        catcher.animations.add("float", [1,2], 10, true);
        catcher.animations.play("float");

        // generate intial start position.
        var randX = Math.floor(Math.random() * (801));
        var randX = Math.floor(Math.random() * (601));

        catcher.reset(400, 300);
        game.physics.moveToObject(catcher, player, 100);
        */


        catcher = game.add.sprite(Math.floor(Math.random() * 801), 0, "catcher");
        game.physics.arcade.enable(catcher);
        catcher.body.collideWorldBounds = true;
        catcher.body.velocity.x = 150;
        catcher.body.velocity.y = 100;

        //catcher.body.gravity.y = 300;
        catcher.animations.add("attack", [0, 1], 10, true);
        catcher.animations.play("attack");


    }

    function drawCatcher(killed) {
        for(var i = 0; i < killed + 1; i++) {
            drawNewCatcher();
        }
    }

    function drawBoxes() {

        var xLocation = 700;

        // add level 1 boxes
        for(var i = 0; i < 3; i++) {
            box = boxes.create(xLocation, game.world.height - 170, "box");
            box.body.immovable = true;
            xLocation -= 100;
        }

        xLocation = 0;

        // add level 2 boxes
        for(var i = 0; i < 3; i++) {
            box = boxes.create(xLocation, game.world.height - 270, "box");
            box.body.immovable = true;
            xLocation += 100;
        }

        // add level 3 boxes
        box = boxes.create(100, game.world.height - 370, "box");
        box.body.immovable = true;
        box = boxes.create(600, game.world.height - 370, "box");
        box.body.immovable = true;
        box = boxes.create(700, game.world.height - 370, "box");
        box.body.immovable = true;

        // add level 4 boxes
        box = boxes.create(400, game.world.height - 470, "box");
        box.body.immovable = true;
        box = boxes.create(500, game.world.height - 470, "box");
        box.body.immovable = true;
    }
}