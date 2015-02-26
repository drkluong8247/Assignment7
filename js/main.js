/**
 * Author: Brannon Crymes
 * Class:  CS 325
 * File:   main.js
 * Date:   02/26/15
 */

window.onload = function () {
    "use strict";

    var game = new Phaser.Game(800, 600,
        Phaser.AUTO, 'game',
        {preload: preload, create: create, update: update});

    function preload() {
        // tilemap
        game.load.tilemap('map', 'assets/map/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/map/city.png');

        // player
        game.load.spritesheet('player', 'assets/vehicles/ambulance.png', 64, 32);
        game.load.audio('siren', 'assets/sounds/siren.wav');

        // music
        game.load.audio('transport', 'assets/sounds/transport.wav');

    }

    // game vars
    var first_play = true;

    // map vars
    var map;
    var bg;

    // player vars
    var player;
    var keys;

    // sounds
    var siren;
    var sDelay = 200;
    var lastPlayed = 0;

    var transport;

    // text
    var initial_instructions = 'Press Space to Begin Your Transport!\nW = UP     S = DOWN\nA = LEFT  D = RIGHT';
    initial_instructions += '\nSPACE = SIREN';

    function create() {
        // add physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.setBoundsToWorld();

        // set up tilemap
        map = game.add.tilemap('map');
        map.addTilesetImage('city', 'tiles');
        bg = map.createLayer('background');
        bg.resizeWorld();

        // add player
        player = game.add.sprite(0, 575, 'player');
        player.animations.add('lights_on');
        player.anchor.setTo(0, 1);
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

        addControls();
        siren = game.add.audio('siren', 2, true);

        // add text
        var style = {font : '20px Arial', fill : '#ffffff', align : 'left'};
        game.add.text(2, 7, initial_instructions, style);

        // add music
        transport = game.add.audio('transport', 3, true);

    }



    function update() {

        if(first_play) {
            startGame();
        } else {
            checkForInput();
        }
    }

    function addControls() {
        keys = {};
        keys.up = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keys.left = game.input.keyboard.addKey(Phaser.Keyboard.A);
        keys.down = game.input.keyboard.addKey(Phaser.Keyboard.S);
        keys.right = game.input.keyboard.addKey(Phaser.Keyboard.D);
        keys.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    function checkForInput() {

        // Player Movement
        if(keys.up.isDown && player.y >= 520) {
            player.y -= 2;
        } else if(keys.down.isDown) {
            player.y += 2;
        }

        if(keys.left.isDown) {
            player.x -= 2;
        }  else if(keys.right.isDown) {
            player.x += 2;
        }

        // play siren
        if(keys.space.isDown && siren.isPlaying && (game.time.now - lastPlayed) > sDelay) {
            siren.stop();
            player.animations.stop('lights_on', true);
            lastPlayed = game.time.now;
        } else if(keys.space.isDown && !siren.isPlaying && (game.time.now - lastPlayed) > sDelay) {
            siren.play();
            player.animations.play('lights_on', 5, true);
            lastPlayed = game.time.now;
        }
    }

    function startGame() {

        if(keys.space.isDown && (game.time.now - lastPlayed) > sDelay ){
            transport.play();
            siren.play();
            player.animations.play('lights_on',5, true);
            first_play = false;
            lastPlayed = game.time.now;
        }
    }


} // end on load function

