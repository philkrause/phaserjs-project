import 'phaser';

class PreloadScene extends Phaser.Scene {
    constructor() {
        super({key: 'PreloadSceneKey'})
    }

    preload(){
        console.log("Preload Created")

        this.load.image('sky', '../assets/images/sky.png');
        this.load.image('ground', '../assets/images/platform.png');
        this.load.image('star', '../assets/images/star.png');
        this.load.image('bombs', '../assets/images/bomb.png');
        this.load.spritesheet('dude','../assets/images/dude.png', { frameWidth: 32, frameHeight: 48 });  

    }

    create(){   
        this.scene.start('StartSceneKey')
    } 
    
}

export default PreloadScene