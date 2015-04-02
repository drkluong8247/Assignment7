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