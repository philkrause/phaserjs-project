// scenes/StartScene.js
import * as Config from '../config/constants';

class GameScene extends Phaser.Scene {
    constructor(config) {
        super({ key: 'GameSceneKey' });
        
        this.player;
        this.stars;
        this.bomb;
        this.platforms;
        this.cursors;
        this.score = 0;
        this.gameOver = false;
        this.scoreText;
        this.gameOverText;
        this.playAgainButton;
        this.playerJumpV = Config.PLAYER_JUMPV;
        this.playerSpeed = Config.PLAYER_SPEED;
    }

    preload() 
    {
        this.load.image('background', '../assets/images/landscape.png');
        this.load.image('ground', '../assets/images/platform.png');
        this.load.image('star', '../assets/images/star.png');
        this.load.image('bomb', '../assets/images/bomb.png');
        this.load.spritesheet('cat_idle','../assets/images/cat_idle.png', { frameWidth: 50, frameHeight: 40 }); 
        this.load.spritesheet('cat_walk','../assets/images/cat_walk.png', { frameWidth: 50, frameHeight: 40 }); 
        this.load.spritesheet('cat_jump','../assets/images/cat_jump.png', { frameWidth: 50, frameHeight: 50 }); 

        this.gameOver = false;
    }

    create() 
    {   

        //create cursor client for key input
        this.cursors = this.input.keyboard.createCursorKeys();

        //assets
        this.add.image(400, 300, 'background');
        this.player = this.physics.add.sprite(100, 450, 'cat_idle');
        this.bomb = this.physics.add.group()

        //camera---------------------
        // this.cameras.main.startFollow(this.player)
        // .setBounds(0, 0, 1200, 200)
        // .setName('main')

        //ground
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(4).refreshBody();
        this.platforms.create(400,400,'ground').setScale(.5)
        
        //player
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
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('cat_walk', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('cat_jump', { start: 0, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        //score
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        
        //stars---------------------
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 500,
            setXY: { x: 50, y: 0, stepX: 2 }
        });

        //star animations
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 1.0));
            child.setCollideWorldBounds(true)
            child.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }, this);

        const collectStar = (player, star) =>
        {   
            star.disableBody(true, true);
            this.score += 100;
            this.scoreText.setText('Score: ' + this.score);
            this.pointsText = this.add.text(player.x, player.y, '100', { fontSize: '10px', fill: '#F6E300' });

            //if all stars collected, then respawn all stars
            if (this.stars.countActive(true) === 0)
            {
                createBomb(this.bomb)
                //respawn all stars
                this.stars.children.iterate(function (child) {
                    child.enableBody(true, child.x, 0, true, true);
            });
            }
        } 

        //bombs---------------------        
        const createBomb = (bombs) =>
        {
            const bombSpawnX = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = bombs.create(bombSpawnX, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }

        const hitBomb = () => {
            this.player.setTint(0xff0000);
            this.player.anims.play('turn');
            this.gameOver = true;
        }

        const playAgain = () => {
            this.playAgainButton = this.add.text(400, this.gameHeight * .5, `GAME OVER!`, { fontSize: '25px',fill: '0xff0000' });
            this.tweens.add({
                targets:[this.playAgainButton],
                x:0,
                duration: 3000,
                repeat: -1,
                repeatDelay: 500,
                ease: 'back.in'
            })
            this.playAgainButton.setInteractive().on('pointerdown', ()=> {
                this.scene.start('TitleSceneKey');
            })
        }

        //collision---------------------
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        
        this.physics.add.collider(this.bomb, this.platforms);

        //player star collision
        this.physics.add.overlap(this.player, this.stars, collectStar, null, this);

        //player bomb collision
        this.physics.add.collider(this.player, this.bomb, playAgain, hitBomb, this);
    }

    update() 
    {   
        //remove controls if game over
        if (this.gameOver == true)
        {
            return;
        } 
        //player movement
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-120);
            this.player.setFlipX(true)
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(120);
            this.player.setFlipX(false)
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(this.playerJumpV);
            this.player.anims.play('jump', true)
        }

        this.scoreText.x = this.cameras.main.worldView.x + 10;
        this.scoreText.y = this.cameras.main.worldView.y + 10; 
    }
}


export default GameScene;
