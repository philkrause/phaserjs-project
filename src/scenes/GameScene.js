// scenes/StartScene.js
import * as Constants from '../configs/constants';

class GameScene extends Phaser.Scene {
    constructor(config) {
        super({ key: 'GameSceneKey' });
        
        this.player;
        this.stars;
        this.bombs;
        this.platforms;
        this.cursors;
        this.score = 0;
        this.gameOver = false;
        this.scoreText;
        this.gameOverText;
        this.playAgainButton;
        this.gameWidth = Constants.GAME_WIDTH;
        this.gameHeight = Constants.GAME_HEIGHT;
        this.playerJumpV = Constants.PLAYER_JUMPV;
        this.controlText;
    }

    preload() 
    {
        this.load.image('sky', '../assets/images/sky.png');
        this.load.image('ground', '../assets/images/platform.png');
        this.load.image('star', '../assets/images/star.png');
        this.load.image('bombs', '../assets/images/bomb.png');
        this.load.spritesheet('dude','../assets/images/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('cat_idle','../assets/images/cat_idle.png', { frameWidth: 50, frameHeight: 40 }); 
        this.load.spritesheet('cat_walk','../assets/images/cat_walk.png', { frameWidth: 50, frameHeight: 40 }); 
        this.load.spritesheet('cat_jump','../assets/images/cat_jump.png', { frameWidth: 50, frameHeight: 50 }); 

 
        this.gameOver = false;

    }

    create() 
    {
        console.log(`GAMEOVER: ${this.gameOver}`)
        //control text
        this.controlText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        //assets
        this.add.image(400, 300, 'sky');

        //platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        
        //player
        this.player = this.physics.add.sprite(100, 450, 'cat_idle');    
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        //player movement
        this.anims.create({
            key:'left',
            frames:this.anims.generateFrameNumbers('cat_walk', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('cat_idle', {start: 0, end: 2  }),
            frameRate: 20
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('cat_walk', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        //create stars
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        //input events
        this.cursors = this.input.keyboard.createCursorKeys();

        //score
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        

        //bombs
        this.bombs = this.physics.add.group()
        
        //collision
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        
        this.physics.add.collider(this.bombs, this.platforms);

        //player star collision
        this.physics.add.overlap(this.player, this.stars, collectStar, null, this);

        //death
        this.physics.add.collider(this.player, this.bombs, playAgain, hitBomb, this);

        //star movement
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
        //collecting stars
        function collectStar (player,star)
        {
            star.disableBody(true, true);
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
                        
    
            //if all stars collected
            // if (this.stars.countActive(true) === 0)
            // {
            //         this.stars.children.iterate(function (child) {
            //         child.enableBody(true, child.x, 0, true, true);
            //     });

            //     createBomb()
            // }
        } 

        //bomb
        function createBomb(player,bombbs) 
        {
            const bombSpawnX = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = bombbs.create(bombSpawnX, 16, 'bombs');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }

        //enemy hit
        function hitBomb(player)
        {   
            player.setTint(0xff0000);
            player.anims.play('turn');
            this.gameOver = true;
        }

        //play again button
        function playAgain() 
        {
            this.playAgainButton = this.add.text(this.gameWidth * .5, this.gameHeight * .5, `GAME OVER!\nHIGH SCORE: ${this.score}\nCLICK HERE TO PLAY AGAIN`, { fontSize: '25px',fill: '0xff0000' });
            this.playAgainButton.setInteractive().on('pointerdown', ()=> {
                this.scene.start('TitleSceneKey');
            })
        }          

    }

    update() 
    {   

        //remove controls if game over
        if (this.gameOver == true)
        {
            return;
        }   
        
        //live movement
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-120);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(120);

            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            this.player.anims.play('idle');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(this.playerJumpV);
        }

    }
}


export default GameScene;
