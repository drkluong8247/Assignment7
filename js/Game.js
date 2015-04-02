/**
 * Created by Brannon on 4/2/2015.
 */

BasicGame.Game = function(game) {

    // local vars
    this.map = null;
    this.ground = null;
    this.background = null;
    this.exit = null;

    this.player = null;
    this.keys = null;

    this.ghosts = null;
    this.ghost = null;
    this.spawnTime = 0;
    this.ghostDelay = 1000;
    this.ghostVel = 0;
    this.ghostNum = 0;
    this.changetime = 0;

    this.gameText = null;

    // local funcs
    this.checkKeys = function() {
        if(this.keys.a.isDown) {
            this.player.body.velocity.x = -250;
            this.player.scale.x = -1;
        } else if(this.keys.d.isDown) {
            this.player.body.velocity.x = 250;
            this.player.scale.x = 1;
        } else {
            this.player.body.velocity.x = 0;
        }

        if(this.keys.space.isDown && (this.player.body.onFloor() || this.player.body.touching.down) ) {
            this.player.body.velocity.y = -350;
        }
    };
    this.exitHandler = function() {
        this.player.kill();
        var text = "You escaped! Reload to restart the game!";
        var style = {font: "20px Arial", fill: "#ffffff", align: "left"};
        this.gameText = this.game.add.text(135, 250, text, style);
        this.gameText.fixedToCamera = true;
    };
    this.spawnGhost = function() {
        if(this.spawnTime <= this.game.time.now && this.ghostNum <= 80) {
            this.ghostNum++;
            this.spawnTime = this.game.time.now + this.ghostDelay;
            this.ghost = this.ghosts.getFirstExists(false);
            this.ghost.body.collideWorldBounds = true;
            this.ghost.body.immovable = true;

            this.ghost.reset(40, 20);
            this.ghostVel = Math.pow(-1, this.game.rnd.integerInRange(0, 2)) * 300;
            this.ghost.body.velocity.x = this.ghostVel;
        }
    };

    this.changeDirections = function() {
        if(this.changetime <= this.game.time.now) {
            this.changetime += this.game.rnd.integerInRange(1000, 3000);
            this.ghosts.forEach(function (ghost) {
                ghost.body.velocity.x = (Math.random() < 0.5 ? -1 : 1) * 300;
            })
        }
    };

    this.killHandler= function() {
        this.player.kill();
        var text = "You were caught! Reload to restart the game!";
        var style = {font: "20px Arial", fill: "#ffffff", align: "left"};
        this.gameText = this.game.add.text(135, 250, text, style);
        this.gameText.fixedToCamera = true;
    }

};

BasicGame.Game.prototype = {
    create: create,
    update: update
};

function create() {
    console.log("%cStarting game state Game", "color:white; background:green");

    // load map
    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('castle', 'castle');
    this.background = this.map.createLayer('layer');

    this.exit = this.map.createLayer('exit');
    this.map.setTileIndexCallback([54, 55, 64, 65], this.exitHandler, this, 'exit');

    this.ground = this.map.createLayer('collide');
    this.map.setCollision(42, true, 'collide');
    this.ground.resizeWorld();


    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 300;


    // add player
    this.player = this.game.add.sprite(20, 1150, 'cat');
    this.player.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;
    this.game.camera.follow(this.player);

    // add controls
    this.keys = {};
    this.keys.w = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.keys.a = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.keys.s = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.keys.d = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // add enemies
    this.ghosts = this.game.add.group();
    this.ghosts.enableBody = true;
    this.ghosts.physicsBodyType = Phaser.Physics.ARCADE;
    this.ghosts.createMultiple(80, 'monster');
    this.ghosts.setAll('anchor.x', 0.5);
    this.ghosts.setAll('anchor.y', 0.5);
    this.ghosts.setAll('outOfBoundsKill', true);
    this.ghosts.setAll('checkWorldBounds', true);
}

function update() {
    this.game.physics.arcade.collide(this.ground, this.player);
    this.game.physics.arcade.collide(this.exit, this.player);   // calls exitHandler
    this.checkKeys();

    this.game.physics.arcade.collide(this.ghosts, this.player, this.killHandler, null, this);
    this.game.physics.arcade.collide(this.ground, this.ghosts);

    this.spawnGhost();
    this.changeDirections();
}
