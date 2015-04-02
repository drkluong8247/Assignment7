/**
 * Created by Brannon on 4/2/2015.
 */

BasicGame.Preloader = function(game) {
    this.background = null;
    this.preloadBar = null;

    this.ready = false;
};

BasicGame.Preloader.prototype = {
    preload: preload,
    create: create,
    update: update
};

function preload() {
    console.log("%cStarting game state Preloader", "color:white; background:green");
    this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, "preloadBar");
    this.preloadBar.anchor.setTo(0.5, 0.5);

    this.load.setPreloadSprite(this.preloadBar);

//======================= load all in game assets ============================================
    // audio
    this.game.load.audio('theme', 'assets/music/wos.mp3', true);
    this.game.load.audio('door', 'assets/sounds/creaky.mp3', false);

    // images
    this.game.load.image('mansion', 'assets/images/mansion.jpg');
    this.game.load.image('enter', 'assets/images/enter.gif');
    this.game.load.image('castle', 'assets/images/castle.PNG');
    this.game.load.tilemap('map', 'assets/images/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.spritesheet('cat', 'assets/images/cat.png', 50, 50);
    this.game.load.spritesheet('monster', 'assets/images/monster.png', 50, 50);
}

function create() {
    this.preloadBar.cropEnabled = false;
}

function update() {

    if(this.cache.isSoundDecoded('theme') && this.ready === false) {
        this.ready = true;
        this.state.start("Menu");
    }

}