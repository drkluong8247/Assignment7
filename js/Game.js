/**
 * Created by Brannon on 4/2/2015.
 */

BasicGame.Game = function(game) {

    // local vars
    this.map = null;
    this.layer = null;
};

BasicGame.Game.prototype = {
    create: create,
    update: update
};

function create() {
    console.log("%cStarting game state Game", "color:white; background:green");

}

function update() {

}
