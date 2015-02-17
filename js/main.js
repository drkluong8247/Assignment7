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

        game.load.tilemap('map', 'assets/map/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/map/map_tiles.png');
    }

    // map variables
    var map;    // json tilemap
    var ground; // tilemap tiles
    var ladders;
    var bg;
    var ceiling;

    // player variables
    var player;
    var cursors;


    /*
     * You are an officer who swore to avenge the killing of a little girl,
     * but you have failed to keep up your promise, forgetting about her
     * entirely. WRONG MOVE. She has become angry, waiting for you to avenge
     * solve her murder, but she has decided to accept another form of promise-
     * fulfilment: your death. It is your job to hastily find all of the evidence
     * from her murder scene to solve her murder before she takes your life in
     * the process.
     */

    /*
     * Requirements:
     *      1. Collect evidence
     *          a. if found, win
     *          b. if die, lose
     *
     *      2. fight off ghosts
     *          a. use service pistol to dispel the apparitions
     *
     *      3. drop the mic
     */

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
        map.setCollision(456, true, 'TwoFloors');
        //map.setCollision([[0, 18], [40, 18]], true, 'TwoFloors');

        bg = map.createLayer('Background');
        bg.resizeWorld();

        ladders = map.createLayer('Ladders');
        ceiling = map.createLayer('Ceiling');
        map.setCollision([257, 258, 259], true, 'Ceiling');

        // add enemies (grudge holding ghosts)

        // add player (officer Williams)
        addPlayer();
        addControls();
    }

    function update () {

        // check collision
        game.physics.arcade.collide(ground, player);
        game.physics.arcade.collide(ceiling, player);

        // check controls
        checkPlayerMovement();

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

    function addControls() {
        cursors = game.input.keyboard.createCursorKeys();
    }

    function checkPlayerMovement() {

        // horizontal movement
        if (cursors.right.isDown) {
            player.body.velocity.x = 180;

        } else if (cursors.left.isDown) {
            player.body.velocity.x = -180;

        } else {
            player.body.velocity.x = 0;
        }

        // vertical movement
        if (cursors.up.isDown) {
            player.body.velocity.y = -400;

        } else if (cursors.down.isDown) {
            player.body.velocity.y = 400;
        }
    }

} // end of window onload