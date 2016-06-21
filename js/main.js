var game = new Phaser.Game('100', 480, Phaser.CANVAS, 'game');

var GameState = function () {
    this.player = null;
    this.platforms = null;
    this.facing = 'right';
    this.jumpTimer = 0;
    this.cursors = null;
};

GameState.prototype = {

	init: function () {
        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 900;
	},

	preload: function () {
		// Preload assets
		this.load.image('background', 'assets/stage.jpg');
		this.load.spritesheet('player', 'assets/character.png', 74, 92);
	},
	create: function () {
		// Adds background to the top left point of the screen
		this.background = this.game.add.sprite(0, 0, 'background');
		this.background.scale.setTo(2);
		
		// Add player to the center 
		this.player = this.game.add.sprite(0, this.game.world.bounds.height, 'player');
		this.player.scale.setTo(2);
        this.physics.arcade.enable(this.player);

	    this.player.animations.add('left', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
	    this.player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
        this.player.body.collideWorldBounds = true;
        this.cursors = this.input.keyboard.createCursorKeys();
	},
	update: function () {

        this.physics.arcade.collide(this.player, this.platforms, null, null, this);

        //  Do this AFTER the collide check, or we won't have blocked/touching set
        var standing = this.player.body.blocked.down || this.player.body.touching.down;

        this.player.body.velocity.x = 0;

		if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -400;
            if (this.facing !== 'left'){
                this.player.play('left');
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown){
            this.player.body.velocity.x = 400;

            if (this.facing !== 'right')
            {
                this.player.play('right');
                this.facing = 'right';
            }
        }
        else{
            if (this.facing !== 'idle'){
            	this.player.body.velocity.x = 0;
                this.player.animations.stop();

                if (this.facing === 'left')
                {
                    this.player.frame = 15;
                }
                else
                {
                    this.player.frame = 0;
                }
                this.facing = 'idle';
            }
        }

        if (standing && this.cursors.up.isDown && this.time.time > this.jumpTimer)
        {
            this.player.body.velocity.y = -600;
            this.jumpTimer = this.time.time - 300;
        }
	}
};

game.state.add('GameState', GameState);
game.state.start('GameState');