window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";

    var game = new Phaser.Game( 800, 600,
        Phaser.AUTO, 'Remembrance of Dog',
        { preload: preload, create: create, update: update }
    );
    
    function preload() {

        game.load.spritesheet("player", "assets/sprites/dog.png", 46, 27, 4);
        game.load.image("brick", "assets/backgrounds/brick.JPG");
        game.load.image("road", "assets/backgrounds/road.jpg");
        game.load.image("box", "assets/box.png");
        game.load.audio("woof", "assets/woof.mp3");
        game.load.audio("theme", "assets/music/SummerTown.mp3");


    }

    var tiledBrick; // holds tiled brick background
    var platforms;  // group to hold objects to stand on
    var player;     // the player of the game
    var cursors;    // adds keyboard support
    var bark;       // add spacebar to jump with
    var woof;       // woof sound during bark attack
    var music;      // theme song

    function create() {

        // add music on loop
        music = game.add.audio("theme", 2, true);
        music.play("", 0, 1, true);

        woof = game.add.audio("woof", 4, false);

        // start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // add background
        tiledBrick = game.add.tileSprite(0, 0, 800, 600, "brick");

        // add platforms group and enable physics for all members
        platforms = game.add.group();
        platforms.enableBody = true;

        // add ground
        var ground = platforms.create(0, game.world.height - 70, "road");
        ground.body.immovable = true;

        // add some platforming elements
        var box1 = platforms.create(700, game.world.height - 170, "box");
        box1.body.immovable = true;

        var box2 = platforms.create(600, game.world.height - 170, "box");
        box2.body.immovable = true;

        var box3 = platforms.create(500, game.world.height - 170, "box");
        box3.body.immovable = true;


        // add player
        player = game.add.sprite(82, game.world.height - 70, "player");
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.anchor.setTo(.5, 1); // flip around the middle
        player.scale.x = -2;
        player.scale.y = 2;
        player.body.gravity.y = 300;
        player.animations.add("walk", [0,1,2,3,4], 7, true);

        // add cursors
        cursors = game.input.keyboard.createCursorKeys();

        // add spacebar
        bark = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    }
    
    function update() {
        // check if player is on the ground
        game.physics.arcade.collide(player, platforms);

        // reset player velocity
        player.body.velocity.x = 0;

        if(bark.isDown) {
            woof.play();
        }

        if(cursors.right.isDown) {
            player.scale.x = -2;
            player.body.velocity.x = 150;
            player.animations.play("walk");

        } else if(cursors.left.isDown) {
            player.scale.x = 2;
            player.body.velocity.x = -150;
            player.animations.play("walk");
        } else {
            player.animations.stop();
            player.frame = 4;
        }

        if(cursors.up.isDown && player.body.touching.down) {
            player.body.velocity.y = -300;
        }
    }

};
