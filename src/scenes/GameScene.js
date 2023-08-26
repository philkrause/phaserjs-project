// scenes/StartScene.js
import * as Config from '../config/constants';

class GameScene extends Phaser.Scene {
    constructor(config) {
        super({ key: 'GameSceneKey' });
        
        this.player;
        this.stars;
        this.starsAmount = 0;
        this.sparkle;
        this.platforms;
        this.cursors;
        this.score = 0;
        this.points = 100;
        this.gameOver = false;
        this.scoreText;
        this.gameOverText;
        this.playAgainButton;
        this.playerJumpV = Config.PLAYER_JUMPV;
        this.playerSpeed = Config.PLAYER_SPEED;
        this.gameWidth = Config.GAME_WIDTH;
        this.gameHeight = Config.GAME_HEIGHT
    }
    
    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    preload() 
    {
        this.load.image('background', '../assets/images/preview.png');
        this.load.image('ground', '../assets/images/platform.png');
        this.load.image('star', '../assets/images/star.png');
        this.load.image('abulance', '../assets/images/abulance.png');
        this.load.spritesheet('sparkle', '../assets/images/mr_sparkle.png', { frameWidth: 100, frameHeight:183});
        this.load.spritesheet('cat_idle','../assets/images/cat_idle.png', { frameWidth: 50, frameHeight: 40 });
        this.load.spritesheet('cat_walk','../assets/images/cat_walk.png', { frameWidth: 50, frameHeight: 40 });
        this.load.spritesheet('cat_jump','../assets/images/cat_jump.png', { frameWidth: 50, frameHeight: 40 });
        this.load.bitmapFont('carrier_command', '../assets/fonts/carrier_command.png', '../assets/fonts/carrier_command.xml');
        
        this.gameOver = false;
    }
    
    create() 
    {   
        //background
        const width = this.scale.width;
        const height = this.scale.height;
        this.background = this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0);

        //platforms-----------------------
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(400, 300, 'ground').setScale(1).refreshBody();

        //player-----------------------
        this.player = this.physics.add.sprite(50, 300, 'cat_idle');
        
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        //player animations
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
            frames: this.anims.generateFrameNumbers('cat_jump', { start: 0, end: 13 }),
            frameRate: 10,
            repeat: -1
        });

        //score
        this.scoreText = this.add.bitmapText(16, 16, 'carrier_command', 'Score: 0', { 
            fontSize: '50px', 
            fill: '#F6E300'
        });
        
        //stars-----------------------------------
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 0,
            setXY: { x: 400, y: 0, stepX: 10 }
        });

        //star movement
        this.stars.children.iterate(function (child) {
            child.x = Phaser.Math.Between(0, 600)
            child.setBounce(1)
            child.setCollideWorldBounds(true,1,1)
            child.setVelocity(Phaser.Math.Between(-200, 400), 20);
        });

        //star collect
        const collectStar = (player, star) => {
            if(!this.gameOver){
                const self = this; // Store the outer 'this' context
                createsparkle(player,this.sparkle)
                star.disableBody(true, true);
                self.score += self.points;
                self.scoreText.setText('Score: ' + self.score);
                self.pointsText = self.add.text(player.x, player.y, '100', {
                    fontSize: '50px',
                    fill: '#F6E300'
                });
                this.tweens.add({
                    targets: self.pointsText,
                    setVelocityY: -30,
                    alpha: 0,
                    duration: 2000
                });
            
                if (self.stars.countActive(true) === 0) {
                    // Recreate stars if collected
                    self.stars.children.iterate(function (child) {
                        child.enableBody(true, Phaser.Math.Between(0, 600), 0, true, true);
                        child.setVelocity(Phaser.Math.Between(-200, 400), 20);
                    });
                }
            }
        }
        
        //MR SPARKLE-------------------------------------
        this.sparkle = this.physics.add.group();
        
        // Function to create sparkles
        const createsparkle = (player, sparkles) => {
            const sparkleSpawnX = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var sparkle = sparkles.create(sparkleSpawnX, 16, 'sparkle');
            sparkle.setBounce(1);
            sparkle.setScale(.5)
            sparkle.setCollideWorldBounds(true);
            sparkle.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }

        this.anims.create({
            key: 'sparkle',
            frames: this.anims.generateFrameNumbers('sparkle', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        //sparkle kill
        const hitsparkle = () => {
            this.player.setTint(0xff0000);
            this.player.anims.play('idle');
            this.player.setVelocityX(0);
            this.gameOver = true;
            playAgain();
        }
        //gameover
        const playAgain = () => {
            this.playAgainButton = this.add.text(400, 300, `GAME OVER!\nClick to play again`, {
                fontSize: '55px',
                fill: '#FFB7FF',
                fontFamily: 'fantasy',
            });
            this.tweens.add({
                targets:[this.playAgainButton],
                x:0,
                duration: 1000,
                repeat: -1,
                repeatDelay: 500,
                ease: 'back.in'
            })
            this.playAgainButton.setInteractive().on('pointerdown', ()=> {
                this.scene.start('GameSceneKey');
            })
        }

        //collision---------------------
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms,null,null,this);
        this.physics.add.collider(this.sparkle, this.platforms,);

        //player star collision
        this.physics.add.overlap(this.player, this.stars, collectStar, null, this);
        
        //player hit
        this.physics.add.overlap(this.player, this.sparkle, hitsparkle)
    }

    update() 
    {   
        //remove controls if game over
        if (this.gameOver == true)
        {
            this.scoreText.setText('Score: ' + this.score);
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
            this.player.setVelocityY(this.playerJumpV * -1);
            this.player.anims.play('jump', true)
        }
        
        //sparkle animation
        this.sparkle.children.iterate(function(child){
            child.anims.play('sparkle',true)
        })
        
        this.background.tilePositionY -= 2;
        this.scoreText.x = this.cameras.main.worldView.x + 10;
        this.scoreText.y = this.cameras.main.worldView.y + 10; 
    }
}


export default GameScene;
