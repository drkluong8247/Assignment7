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

        // man
        game.load.spritesheet('man', 'assets/people/man.png', 9, 8);
        game.load.audio('squish', 'assets/sounds/squish.wav');

    }

    // game vars
    var first_play = true;
    var arrived = false;
    var notHaveTheOrgan = true;
    var OnTheWayBack = false;
    var alive = true;
    var victim;
    var people;
    var score = 0;

    // map vars
    var map;
    var bg;

    // player vars
    var player;
    var keys;
    var man;
    var manNotCreated = true;

    // sounds
    var siren;
    var sDelay = 200;
    var lastPlayed = 0;
    var squish;
    var transport;

    // text
    var initial_instructions = 'Press Space and Get to the Hospital!\nW = UP     S = DOWN\nA = LEFT  D = RIGHT';
    initial_instructions += '\nSPACE = SIREN';
    var second_instructions = 'Grab the Organ at the Lighted Doorway!';
    var organText = "You have the Organ! Get It to the Patient Before He Expires!";
    var scoreText;
    var scoreString = "Score: " + score;
    var victimText;

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
        player = game.add.sprite(2848, 575, 'player');
        player.animations.add('lights_on');
        player.anchor.setTo(0, 1);
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

        // add victim
        victim = game.add.sprite(200, 520, 'man');
        game.physics.arcade.enable(victim);
        victim.scale.x = 2;
        victim.scale.y = 2;

        var style = {font : '12px Arial', fill : '#ffffff', align : 'left'};
        victimText = game.add.text(150, 470, "Help! My heart is bad and I can't risk moving!\nCan you get me a new heart?", style);

        addControls();
        siren = game.add.audio('siren', 2, true);

        // add text
        var style = {font : '20px Arial', fill : '#ffffff', align : 'left'};
        game.add.text(2, 7, initial_instructions, style);

        // add music
        transport = game.add.audio('transport', 3, true);

        // add squish
        squish = game.add.audio('squish', 2, false);

    }

    function update() {

        if(first_play) {
            startGame();
        } else if(arrived){
            arrivalInteraction();
        } else if(alive){
            checkForInput();
        }

        if(OnTheWayBack) {
            game.physics.arcade.overlap(player, people, roadKillHandler);
            game.physics.arcade.overlap(player, victim, victimHandler);
            if(score < 0) {
                player.kill();
                alive = false;
                var restartText = "You're Supposed to Be Saving People!\nReload the Page to Restart...";
                var style = {font: "42px Arial", fill: "#ff0000", align: "center"};
                restartText = game.add.text(60, 250, restartText, style);
                restartText.fixedToCamera = true;
            }
        }

        //console.log(player.x);
    }

    function roadKillHandler(player, person) {
        score -= 100;
        updateScoreText(score);
        person.kill();
        squish.play();
    }

    function victimHandler(s1, s2) {
        var style = {font : '12px Arial', fill : '#ffffff', align : 'left'};
        victimText = game.add.text(150, 470, "Thank you for saving me! Now I can live!", style);
        alive = false;

        style = {font : '20px Arial', fill : '#ffffff', align : 'left'};
        victimText = game.add.text(60, 250, "You've Won! \nReload If You Want to Try Again!", style);
        victimText.fixedToCamera = true;

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

        if(player.x >= 2858 && OnTheWayBack === false) {
            arrived = true;

        }
    }

    function startGame() {

        if(keys.space.isDown && (game.time.now - lastPlayed) > sDelay ){
            transport.play();
            siren.play();
            player.animations.play('lights_on',5, true);
            first_play = false;
            lastPlayed = game.time.now;
            game.world.remove(victimText);
        }
    }

    function arrivalInteraction() {

        // create the man to walk into the hospital
        if(manNotCreated) {
            score = 1000;
            man = game.add.sprite(2848, player.y, 'man');
            man.animations.add('walk');
            man.animations.play('walk', 8, true);
            manNotCreated = false;
            game.camera.follow(man, Phaser.Camera.FOLLOW_PLATFORMER);
            var style = {font : '20px Arial', fill : '#ffffff', align : 'left'};
            second_instructions = game.add.text(2150, 27, second_instructions, style);
        }

        // if you have the organ, initiate return trip
        if(notHaveTheOrgan && man.x >= 2848 && man.y === 520){

            updateScoreText(score);
            game.world.remove(second_instructions);
            var style = {font : '20px Arial', fill : '#ffffff', align : 'left'};
            game.add.text(2150, 27, organText, style);
            notHaveTheOrgan = false;
            man.kill();
            arrived = false;
            player.scale.x = -1;
            player.anchor.setTo(.5,.5);
            OnTheWayBack = true;
            game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
            generateRoadkill();
        }

        // Player Movement
        if(keys.up.isDown && man.y >= 520) {
            man.y -= 1;
        } else if(keys.down.isDown) {
            man.y += 1;
        }

        if(keys.left.isDown) {
            man.x -= 1;
        }  else if(keys.right.isDown) {
            man.x += 1;
        }
    }

    function updateScoreText(score) {
        game.world.remove(scoreText);
        scoreString = "Score: " + score;
        var style = {font : '20px Arial', fill : '#ffffff', align : 'left'};
        scoreText = game.add.text(0,0, scoreString, style);
        scoreText.fixedToCamera = true;
    }

    function generateRoadkill() {
        people = game.add.group();
        people.enableBody = true;
        people.physicsBodyType = Phaser.Physics.ARCADE;

        people.createMultiple(30, 'man');
        people.setAll('outOfBoundsKill', true);
        people.setAll('checkWorldBounds', true);

        for(var i = 0; i < 30; i++) {
            var person = people.getFirstExists(false);
            var xInt = game.rnd.integerInRange(0, 2400);
            var yInt = game.rnd.integerInRange(504, 600);
            person.reset(xInt, yInt);
        }
    }


} // end on load function

