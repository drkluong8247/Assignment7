/**
 * Created by Brannon on 4/2/2015.
 */

BasicGame.Menu = function(game) {

    // local vars
    this.music = null;
    this.background = null;
    this.enter = null;
    this.door = null;
    this.gameTime = -1;
    this.enterClicked = false;

    // local funcs
    this.clickEnter = function() {

        if(this.enterClicked == false) {
            this.enterClicked = true;
            this.gameTime = this.game.time.now + 3000;
            this.door.play();
        }
    }

};

BasicGame.Menu.prototype = {
    create: create,
    update: update
};

function create() {
    console.log("%cStarting game state Menu", "color:white; background:green");

    // play music if set to play
    if(playMusic) {
        this.music = this.game.add.audio('theme');
        this.music.play();
    }

    // load background
    this.background = this.game.add.image(0, 0, 'mansion');

    // set up door sound
    this.door = this.game.add.audio('door');

    // set up button sprite
    this.enter = this.game.add.sprite(400, 500, 'enter');
    this.enter.scale.setTo(.5,.5);
    this.enter.anchor.setTo(.5,.5);
    this.enter.inputEnabled = true;
    this.enter.events.onInputDown.add(this.clickEnter, this);
}

function update() {
    if(this.gameTime > 0 && this.game.time.now >= this.gameTime) {

        this.state.start('Game');
    }
}

