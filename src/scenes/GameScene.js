// scenes/StartScene.js
import * as Config from '../config/constants';

class GameScene extends Phaser.Scene {
    constructor(config) {
        super({ key: 'GameSceneKey' });
        
        this.player;
        this.redCar;
        this.traffic;
        this.widthText;
        this.laser;
        this.createLaser;
        this.spawnCloud;
        this.fired = false;
        this.stars;
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
        this.width;
        this.height;
    }
    
    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    preload() 
    {
        this.load.image('background', '../assets/images/city_top2.png');
        this.load.image('ground', '../assets/images/platform.png');
        this.load.image('star', '../assets/images/star.png');
        this.load.image('laser', '../assets/images/laser.png');
        this.load.image('player', '../assets/images/player_y.png');
        this.load.image('red_car', '../assets/images/red_car1.png');
        this.load.image('cloud', '../assets/images/cloud.png');

        this.load.spritesheet('cat_idle','../assets/images/cat_idle.png', { frameWidth: 50, frameHeight: 40 });
        this.load.spritesheet('cat_walk','../assets/images/cat_walk.png', { frameWidth: 50, frameHeight: 40 });
        this.load.spritesheet('cat_jump','../assets/images/cat_jump.png', { frameWidth: 50, frameHeight: 40 });
        this.load.spritesheet('sparkle', '../assets/images/mr_sparkle.png', { frameWidth: 100, frameHeight:183});
        this.load.bitmapFont('carrier_command', '../assets/fonts/carrier_command.png', '../assets/fonts/carrier_command.xml');
        
        this.gameOver = false;
        this.starsAmount = 0;
    }
    
    create() 
    {   
        //background-----------------------------------------
        this.width = this.scale.width;
        this.height = this.scale.height;

         //lighting------------------------------------------
         this.lights.enable().setAmbientColor(0x111111);
         console.log(this.lights.getMaxVisibleLights());
 
         this.background = this.add.tileSprite(100, 100, this.gameWidth * 2.5, this.gameHeight * 2.5, 'background')
             .setPipeline("Light2D")
             .setScale(.5)
     
 
        //platforms-----------------------------------------
        //this.platforms = this.physics.add.staticGroup()
        //this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        //this.platforms.create(400, 300, 'ground').setScale(1).refreshBody();

        //player-----------------------------------------
        this.player = this.physics.add.sprite(this.width * .5, this.height, 'player').setSize(16, 16).setPipeline("Light2D");
        this.playerLight = this.lights.addLight(this.player.x, this.player.y, 300);
        this.tweens.add({
          targets: [this.playerLight],
          intensity: {
            value: 1.0,
            duration: 500,
            ease: "Elastic.easeInOut",
            repeat: -1,
            yoyo: true
          }
        });

        //this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);


                //Traffic
        this.spawnCar = () => { 
            console.log("Spawning Car")
            this.car = this.physics.add.sprite(Phaser.Math.Between(0,this.gameWidth), 0, 'red_car')
            this.car.setVelocityY(30)
            this.car.setSize(16,16)
            this.carLight = this.lights.addLight(this.car.x, this.car.y, 300);
            this.tweens.add({
                targets: [this.car],
                intensity: {
                  value: 1.0,
                  duration: 500,
                  ease: "Elastic.easeInOut",
                  repeat: -1,
                  yoyo: true
                }
              });
        };
                
                // Create a timer event to spawn cars every 2 seconds, 10 times
        // const spawnCarEvent = this.time.addEvent({
        //     delay: 2000,
        //     repeat: 9, // This will execute the callback 10 times (0 to 9)
        //     callbackScope: this // Maintain the scope of 'this' inside the callback
        // });

        this.spawnCar()

        //player animations
        // this.anims.create({
        //     key:'left',
        //     frames:this.anims.generateFrameNumbers('cat_walk', { start: 0, end: 3 }),
        //     frameRate: 10,
        //     repeat: -1
        // });
    
        //camera-----------------------------------------
        // this.cameras.main.startFollow(this.player)
        // .setName('main')

        //laser------------------------------------------
        this.lasers = this.physics.add.group();
        this.createLaser = (player) => {
            const laser = this.lasers.create(player.x, player.y, 'cat_idle')
            const laserSpeed = Math.sign(this.player.body.velocity.x)
            laser.setCollideWorldBounds(true,1,1)
            laser.setVelocityX(200);
            if (laser.x == 0 || laser.x > 600) 
            {
                laser.disableBody(true,true)
            }
        }
        //console.log(this.width)
        //score
        this.scoreText = this.add.bitmapText(15, 15, 'carrier_command', 'Score: 0').setTint(0xFFFF).setScale(.25)
        this.widthText= this.add.bitmapText(15, 35,'carrier_command',`Width: ${this.width}`).setScale(.2,.2).setTint(0xFFFF).setScale(.25)
        this.heightText = this.add.bitmapText(15, 45, 'carrier_command', `Height: ${this.height}`).setTint(0xFFFF).setScale(.25)

        //stars-----------------------------------------
        // this.stars = this.physics.add.group({
        //     key: 'red_car',
        //     repeat: 0,
        //     setXY: { x: Phaser.Math.Between(0, this.gameWidth), y: 0, stepX: 10 }
        // });

        //star movement
        // this.stars.children.iterate(function (child) {
        //     child.x = Phaser.Math.Between(0, 600);
        //     child.setBounce(1)
        //     child.setCollideWorldBounds(true,1,1);
        //     child.setVelocity(Phaser.Math.Between(-200, 400), 20);
        // });

        //star collect
        // const collectStar = (player, star) => {
        //     if(!this.gameOver){
        //        // Store the scene's context
        //         const self = this; 

        //         //create enemy
        //         createsparkle(player,this.sparkle)
        //         star.disableBody(true, true);
        //         self.score += self.points;   
        //         //update score and draw points with fade out animation
        //         self.scoreText.setText('Score: ' + self.score);
        //         self.pointsText = self.add.text(player.x, player.y, '100', {
        //             fontSize: '50px',
        //             fill: '#F6E300'
        //         });
        //         this.tweens.add({
        //             targets: self.pointsText,
        //             y: -60,
        //             alpha: 0,
        //             duration: 2000
        //         });
                
        //         // Recreate star if collected
        //         if (self.stars.countActive(true) === 0) {
        //             self.stars.children.iterate(function (child) {
        //                 child.enableBody(true, Phaser.Math.Between(0, 600), 0, true, true);
        //                 child.setVelocity(Phaser.Math.Between(-200, 400), 20);
        //             });
        //         }
        //     }
        // }
        
        
        //MR SPARKLE-----------------------------------------
        // this.sparkle = this.physics.add.group();

        //  const createsparkle = (player, sparkles) => {
        //     const sparkleSpawnX = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        //     var sparkle = sparkles.create(sparkleSpawnX, 16, 'sparkle');
        //     sparkle.setBounce(1);
        //     sparkle.setScale(.5)    this.spawnCar = (carSprite) => { 
        //         console.log("Spawning Car")
        //         var car = carSprite.create(Phaser.Math.Between(0,this.gameWidth), this.gameHeight, 'car');
        //         car.setBounce(1);
        //         car.setScale(.5)
        //         car.setCollideWorldBounds(true);
        //         car.setVelocity(0, Phaser.Math.Between(-200, 200));
        //         this.carLight = this.lights.addLight(this.car.x, this.car.y, 300);
        //         this.tweens.add({
        //             targets: [this.car],
        //             intensity: {
        //                 value: 1.0,
        //                 duration: 500,
        //                 ease: "Elastic.easeInOut",
        //                 repeat: -1,
        //                 yoyo: true
        //             }
        //             });
        //     };
        //     sparkle.setCollideWorldBounds(true);
        //     sparkle.setVelocity(Phaser.Math.Between(-200, 200), 20);
        // }

        // this.anims.create({
        //     key: 'sparkle',
        //     frames: this.anims.generateFrameNumbers('sparkle', { start: 0, end: 1 }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        
        //player death
        const playerHit = () => {
            this.player.setTint(0xff0000);
            this.player.anims.play('idle');
            this.player.setVelocityX(0);
            this.gameOver = true;
            gameOver();
        }

        //sparkle death
        const enemyHit = (laser,sparkle) => {
            console.log(laser)
            laser.disableBody(true,true)
            sparkle.disableBody(true,true)
            // this.stars = this.physics.add.group({
            //     key: 'star',
            //     repeat: 10,
            //     setXY: { x: Phaser.Math.Between(0, this.gameWidth), y: 0, stepX: 10 }
            // });
        }

        //gameover text and replay button
        const gameOver = () => {
            this.gameOverText = this.add.bitmapText(this.gameWidth * .5, this.gameHeight * .5 ,'carrier_command',`GAME OVER!`).setTint(0xff0000).setOrigin(.5);
            this.playAgainButton = this.add.bitmapText(this.gameWidth * .5, this.gameHeight * .6, 'carrier_command',`Click to play again`).setTint(0xff0000).setOrigin(.5);
            this.tweens.add({
                targets:[this.gameOverText],
                x:10,
                duration: 1000,
                repeat: -1,
                repeatDelay: 1000,
                ease: 'back.in'
            })
            this.playAgainButton.setInteractive().on('pointerdown', ()=> {
                this.scene.start('GameSceneKey');
            })
            this.starsAmount = 0
        }

        //collision-----------------------------------------
        // this.physics.add.collider(this.player, this.platforms);
        // this.physics.add.collider(this.stars, this.platforms,null,null,this);
        // this.physics.add.collider(this.sparkle, this.platforms,);
 
        //this.physics.add.collider(this.laser, this.platforms,);
        

        //player star collision
        //this.physics.add.overlap(this.player, this.stars, collectStar, null, this);
        
        //player hit
        //this.physics.add.overlap(this.player, this.sparkle, playerHit)

        //enemy hit
        if(this.laser)
        {
        this.physics.add.overlap(this.laser, this.sparkle, enemyHit)
        }


    }

    update() 
    {   

        this.playerLight.x = this.player.x;
        this.playerLight.y = this.player.y;
        this.carLight.x = this.car.x;
        this.carLight.y = this.car.y;

        //remove controls if game over
        if (this.gameOver == true)
        {
            this.scoreText.setText('Score: ' + this.score);
            return;
        }

        //player movement-----------------------------------------
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(Config.PLAYER_SPEED * -1);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(Config.PLAYER_SPEED);
        }
  
        else if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(Config.PLAYER_SPEED * -1);
        }

        //laser controls-----------------------------------------
        else if (this.cursors.down.isDown) 
        {   
            this.player.setVelocityY(Config.PLAYER_SPEED )
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        }

        //sparkle animation-----------------------------------------
        // this.sparkle.children.iterate(function(child){
        //     child.anims.play('sparkle',true)
        // })
        this.spawnCloud
        this.background.tilePositionY -= 3.9;
    }
}


export default GameScene;
