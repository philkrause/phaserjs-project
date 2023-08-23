import { Scene } from 'phaser';
import * as Constants from '../configs/constants';

class TitleScene extends Scene {
    constructor() {
        super({ key: 'TitleSceneKey' });

        this.gameWidth = Constants.GAME_WIDTH;
        this.gameHeight = Constants.GAME_HEIGHT;
        this.startGameButton;
        this.cursors;
        this.buttonArray = [];
        this.selectedButtonIndex = 0;
        this.buttonSelect;
        this.handCursor;
        this.titleH = 800;
        this.titleW = 600;
        this.titleImage;
        this.titleD = 0;
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    preload() {
        console.log("Preload Created");
        this.load.image('title', '../assets/images/titlePixel.png');
        this.load.image('panel', '../assets/images/glassPanel.png');
        this.load.image('cursor', '../assets/images/cursor_hand.png');
    }

    create() 
    {   
        const width = this.scale.width;
        const height = this.scale.height;

        //create cursor client for key input
        this.cursors = this.input.keyboard.createCursorKeys();

        //title image
        this.titleImage = this.add.image(this.gameWidth * .5,this.gameHeight * .5,'title')
            .setDisplaySize(this.titleW,this.titleH)
                 
        //this.rotateTitle()

        //cursor image
		this.handCursor = this.add.image(0, 0, 'cursor')

        // Play button
        const playButton = this.add.image(width * 0.5, height * 0.6, 'panel').setDisplaySize(150, 50);
        this.add.text(playButton.x, playButton.y, 'Play').setOrigin(0.5)

	    // Settings button
	    const aboutButton = this.add.image(playButton.x, playButton.y + playButton.displayHeight + 10, 'panel').setDisplaySize(150, 50);
        this.add.text(playButton.x, playButton.y + playButton.displayHeight + 10, 'About').setOrigin(0.5);

        //add buttons the buttonArray
        this.buttonArray.push(playButton);
        this.buttonArray.push(aboutButton);


        // Initialize the selected button index
        this.selectButtonIndex = 0
        this.selectButton(this.selectButtonIndex)

        //event listeners for selecting 
        playButton.on('selected', () => {
            console.log('play')
            this.scene.start('GameSceneKey')
        })
    

        aboutButton.on('selected', () => {
            console.log('about')
        })

        //clean up events
        this.events.once('shutdown', () => {
            playButton.off('pointerdown');
            aboutButton.off('pointerdown');
        });

    }
    
    rotateTitle ()
    {
        console.log("Calling rotateTitle()");
        console.log("this.titleImage:", this.titleImage);

    }

    //tinting the button
	selectButton(index)
	{   

        console.log(`Highlighted Index from SelectButton: ${index}`)
        const currentButton = this.buttonArray[this.selectedButtonIndex]

        // set the current selected button to a white tint
        currentButton.setTint(0xffffff)
    
        const button = this.buttonArray[index]
    
        // set the newly selected button to a green tint
        button.setTint(0x66ff7f)
    
        // move the hand cursor to the right edge
        this.handCursor.x = button.x + button.displayWidth * 0.7
        this.handCursor.y = button.y + 10
    
        // store the new selected index
        this.selectedButtonIndex = index
	}

    //wrap the button index
    selectNextButton(change = 1)
    {
        let index = this.selectedButtonIndex + change
        if (index >= this.buttonArray.length){index = 0}
        else if (index < 0) { index = this.buttonArray.length - 1 }

        this.selectButton(index)
    }

    //create an event listener on the button called selected
	confirmSelection()
	{
		const button = this.buttonArray[this.selectedButtonIndex]
        button.emit('selected')

	}

    update() {

        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
		const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down)
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)

 
        if (this.titleW > this.gameWidth) {this.titleW = this.gameWidth}
        if (this.titleH > this.gameHeight) {this.titleH = this.gameHeight}

    
        if (upJustPressed)
		{
			this.selectNextButton(-1)
		}
		else if (downJustPressed)
		{
			this.selectNextButton(1)
		}
        else if (spaceJustPressed)
		{
			this.confirmSelection()
		}
    }
}

export default TitleScene;
