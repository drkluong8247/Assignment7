/**
 * Author: Brannon Crymes
 * Class:  CS 325
 * File:   main.js
 * Date:   02/17/15
 */

window.onload = function () {
    "use strict";

    var game = new Phaser.Game(800, 600,
        Phaser.AUTO, 'game',
        {preload: preload, create: create, update: update});

    function preload () {

        game.load.image('player', 'assets/player/test.png');
        game.load.image('bullet', 'assets/player/bullet.png');
        game.load.image('orb', 'assets/evidence/orb.png');

        game.load.image('ghost', 'assets/ghost/ghost.png');

        game.load.tilemap('map', 'assets/map/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/map/map_tiles.png');

        game.load.audio('main', 'assets/music/action.mp3');
        game.load.audio('shoot', 'assets/music/laser.wav');
        game.load.audio('grunt', 'assets/music/grunt.wav');
        game.load.audio('death', 'assets/music/death.wav');
        game.load.audio('ghostSound', 'assets/music/ghost.wav');
        game.load.audio('win', 'assets/music/win.wav');
        game.load.audio('item', 'assets/music/item.wav');
    }

    // map variables
    var map;    // json tilemap
    var ground; // tilemap tiles
    var ladders;
    var bg;
    var ceiling;

    // player variables
    var player;
    var keys;       // hold all of the keyboard inputs

    // bullets variables
    var bullets;
    var fireRate = 350;
    var nextFire = 0;

    // create enemies
    var ghosts;     // group of ghosts
    var gTime;
    var gDelay;

    // game statistics
    var lives = 5;
    var scoreMax = 1000;
    var currentScore = 0;
    var controlsText = 'Move: WASD    Jump: Spacebar    Fire: Click';
    var scoreText = "Score: ";
    var livesText = "Lives: ";

    var finalText;

    // evidence variables
    var evidence;
    var evidenceFound = false;

    // audio
    var music;
    var shoot;
    var grunt;
    var death;
    var ghostSound;
    var win;
    var item;

    function create () {

        // add physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //game.physics.arcade.gravity.y = 300;
        game.physics.setBoundsToWorld();

        // set up tilemap
        map = game.add.tilemap('map');
        map.addTilesetImage('scifi', 'tiles');

        // add tilemap layers
        ground = map.createLayer('TwoFloors');
        map.setCollision(456, true, 'TwoFloors');   // set collision on floors

        bg = map.createLayer('Background');
        bg.resizeWorld();

        ladders = map.createLayer('Ladders');
        // call ladderHandler when the sprite is located on any of these tile ID's
        map.setTileIndexCallback([217, 218, 252, 253, 287, 288, 322, 323, 357, 358, 392, 393, 427, 428], ladderHandler, this, 'Ladders');

        ceiling = map.createLayer('Ceiling');
        map.setCollision([257, 258, 259], true, 'Ceiling'); // set collision on ceiling

        // add text to game
        var text = controlsText + "\n" + scoreText + currentScore + "\n" + livesText + lives;
        var style = {font: "20px Arial", fill: '#ffffff', align: 'left'};
        finalText = game.add.text(0, 0, text, style);
        finalText.fixedToCamera = true;

        // add evidence
        addEvidence();

        // add player (officer Williams)
        addPlayer();
        addControls();
        addBullets();

        // add enemies (grudge holding ghosts)
        gTime = 0;
        gDelay = 1000;
        addGhosts();
        //spawnGhost();

        // add music
        music = game.add.audio('main', 10, true);
        music.loop = true;
        music.play();
        shoot = game.add.audio('shoot', 5, false);
        grunt = game.add.audio('grunt', 6, false);
        death = game.add.audio('death', 6, false);
        ghostSound = game.add.audio('ghostSound', 2, false);
        win = game.add.audio('win', 8, false);
        item = game.add.audio('item', 6, false);
    }

    function update () {

        // world collisions
        game.physics.arcade.collide(ground, player);
        game.physics.arcade.collide(ceiling, player);
        game.physics.arcade.collide(player, ladders);   // necessary for calling ladderHandler()
        game.physics.arcade.collide(bullets, ground, shootBoundaryHandler);
        game.physics.arcade.collide(evidence, ground);

        // enemy collisions
        game.physics.arcade.collide(bullets, ghosts, shootGhostHandler);
        game.physics.arcade.collide(player, ghosts, hitPlayerHandler);

        // evidence collision
        game.physics.arcade.collide(player, evidence, evidenceHandler);

        // check controls
        checkPlayerMovement();

        spawnGhost();

        fireBullets();

    }

    function ladderHandler(sprite, tile) {
        if(keys.w.isDown) {
            sprite.body.velocity.y = -200;
        } else if(keys.s.isDown) {
            sprite.body.velocity.y = 200;
        } else {
            sprite.body.velocity.y = 0;
        }
    }

    function evidenceHandler() {
        spawnEvidence();
        currentScore += 100;

        if(currentScore === scoreMax) {
            player.kill();
            showWinText();
            music.stop();
            win.play();
            return;
        }

        updateText();

        item.play();
    }

    function shootGhostHandler(bullet, ghost) {
        bullet.kill();
        ghost.kill();
        ghostSound.play();
    }

    function shootBoundaryHandler(bullet, tile) {
        bullet.kill();
    }

    function hitPlayerHandler(sprite, ghost) {
        ghost.kill();
        if(lives === 0) {
            death.play();
            player.kill();
            showDeathText();
            return;
        }
        grunt.play();
        lives--;
        updateText();
    }

    function addPlayer() {
        //player = game.add.sprite(game.world.centerX, game.world.height - 160, 'player');
        player = game.add.sprite(0, game.world.height - 160, 'player');
        game.physics.arcade.enable(player);
        player.body.gravity.y = 300;
        player.anchor.setTo(.5,.5);
        player.body.collideWorldBounds = true;

        game.camera.follow(player);
    }

    function addGhosts() {
        ghosts = game.add.group();
        ghosts.enableBody = true;

        ghosts.physicsBodyType = Phaser.Physics.ARCADE;
        ghosts.createMultiple(20, 'ghost');
        ghosts.setAll('anchor.x', 0.5);
        ghosts.setAll('anchor.y', 0.5);
        ghosts.setAll('outOfBoundsKill', true);
        ghosts.setAll('checkWorldBounds', true);
    }

    function spawnEvidence() {
        var x = game.rnd.integerInRange(32, 2368);
        var y = game.rnd.integerInRange(0, 545);

        var temp = player.x;

        while(Math.abs(temp - x) < 400) {
            x = game.rnd.integerInRange(32, 2368);
        }

        temp = player.x;

        while(y >= 288 && y <= 448) {
            y = game.rnd.integerInRange(0, 545);
        }

        evidence.reset(x, y);
    }

    function addEvidence() {
        var x = game.rnd.integerInRange(32, 2368);
        var y = game.rnd.integerInRange(0, 545);

        while(y >= 288 && y <= 448) {
            y = game.rnd.integerInRange(0, 545);
        }

        evidence = game.add.sprite(x, y, 'orb');
        game.physics.arcade.enable(evidence);
        evidence.body.gravity.y = 300;
        evidence.anchor.setTo(.5,.5);
    }

    function spawnGhost() {

        if(gTime < game.time.now && ghosts.countLiving() <= 14) {
            gTime = game.time.now + gDelay;

            var ghost = ghosts.getFirstExists(false);
            var topOrBottom = game.rnd.integerInRange(0, 2);


            if(topOrBottom === 0) {
                ghost.reset(game.rnd.integerInRange(32, 2469), game.rnd.integerInRange(448, 544));
                var distFromPlayer = ghost.x - player.x;
                if(distFromPlayer <= 150 && distFromPlayer >= 0) {
                    ghost.x += 150;
                } else if(distFromPlayer >= 150 && distFromPlayer <= 0) {
                    ghost.x -= 150;
                }
                ghost.body.velocity.x = Math.pow(-1, topOrBottom) * 400;
                var distFromPlayer = ghost.x - player.x;
                if(distFromPlayer <= 150 && distFromPlayer >= 0) {
                    ghost.x += 150;
                } else if(distFromPlayer >= 150 && distFromPlayer <= 0) {
                    ghost.x -= 150;
                }
                if(ghost.body.velocity.x > 0) {
                    ghost.scale.x = -1;
                }
            } else {
                ghost.reset(game.rnd.integerInRange(32, 2469), game.rnd.integerInRange(150, 300));
                ghost.body.velocity.x = Math.pow(-1, topOrBottom) * 400;
                if(ghost.body.velocity.x > 0) {
                    ghost.scale.x = -1;
                }
            }
        }
    }

    function addControls() {
        keys = {};
        keys.w = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keys.a = game.input.keyboard.addKey(Phaser.Keyboard.A);
        keys.s = game.input.keyboard.addKey(Phaser.Keyboard.S);
        keys.d = game.input.keyboard.addKey(Phaser.Keyboard.D);
        keys.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    function checkPlayerMovement() {

        // horizontal movement
        if (keys.d.isDown) {
            player.body.velocity.x = 250;

        } else if (keys.a.isDown) {
            player.body.velocity.x = -250;

        } else {
            player.body.velocity.x = 0;
        }

        if(keys.space.isDown && (player.body.onFloor() || player.body.touching.down)) {
            player.body.velocity.y = -250;
        }
    }

    function addBullets() {
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        bullets.createMultiple(50, 'bullet');
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
    }

    function fireBullets() {
        if(game.input.activePointer.isDown && player.alive === true) {
            if (game.time.now > nextFire && bullets.countDead() > 0) {
                nextFire = game.time.now + fireRate;
                var bullet = bullets.getFirstDead();
                bullet.reset(player.x, player.y);
                game.physics.arcade.moveToPointer(bullet, 500);
                shoot.play();
            }
        }
    }

    function updateText() {
        game.world.remove(finalText);
        var text = controlsText + "\n" + scoreText + currentScore + "\n" + livesText + lives;
        var style = {font: "20px Arial", fill: '#ffffff', align: 'left'};
        finalText = game.add.text(0, 0, text, style);
        finalText.fixedToCamera = true;
    }

    function showDeathText() {
        game.world.remove(finalText);
        var restartText = "You have Died!\nReload the Page to Restart...";
        var style = {font: "42px Arial", fill: "#ff0000", align: "center"};
        finalText = game.add.text(135, 250, restartText, style);
        finalText.fixedToCamera = true;
    }

    function showWinText() {
        game.world.remove(finalText);
        var restartText = "Congratulations!\nYou have Won!\nReload the Page to Restart...";
        var style = {font: "42px Arial", fill: "#ff0000", align: "center"};
        finalText = game.add.text(135, 250, restartText, style);
        finalText.fixedToCamera = true;
    }

} // end of window onload