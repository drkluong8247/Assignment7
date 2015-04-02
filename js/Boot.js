/**
 * Created by Brannon on 4/2/2015.
 *
 * Boot state
 */

var BasicGame = {};     // holds all game states
var playMusic = true;   // global toggle to control music across states

// global variables
BasicGame.Boot = function(game) {
};

// functions in the state
BasicGame.Boot.prototype = {
    preload: preload,
    create: create
};

// preload only what is needed for the loading screen
function preload() {
    console.log("%cStarting game state Boot", "color:white; background:green");
    this.game.load.image('preloadBar', 'assets/images/symbol.jpg');
}

function create() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.maxWidth = 800;
    this.scale.maxHeight = 600;
    this.scale.forceLandscape = false;

    this.game.state.start("Preloader");
}
