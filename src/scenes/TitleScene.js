import { Scene } from 'phaser';
import * as Config from '../config/config';

class TitleScene extends Scene {
    constructor() {
        super({ key: 'TitleSceneKey' });

        this.startGameButton;
        this.cursors;
        this.allButtons = [];
        this.selectedButtonIndex = 0;
        this.buttonSelect;
        this.handCursor;
        this.titleImage;
        this.titleD = 0;
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    preload() 
    {
        console.log("Preload Created");
        this.load.image('title', '../assets/images/sparkle_pixel.png');
        this.load.image('panel', '../assets/images/glassPanel.png');
        this.load.image('cursor', '../assets/images/cursor_hand.png');
    }

    create() 
    {   
        const width = this.scale.width;
        const height = this.scale.height;


        //title image
        this.titleImage = this.add.image(width*.5,height*.5,'title').setDisplaySize(width,height)

        //cursor image
		this.handCursor = this.add.image(0, 0, 'cursor')

        // Play button
        const playButton = this.add.image(width * 0.5, height * 0.8, 'panel').setDisplaySize(150, 50);
        const playText = this.add.text(playButton.x, playButton.y, 'Play', {fontSize: '32px' }).setOrigin(0.5)

	    // About button
	    const aboutButton = this.add.image(playButton.x, playButton.y + playButton.displayHeight + 10, 'panel').setDisplaySize(150, 50);
        const aboutText = this.add.text(playButton.x, playButton.y + playButton.displayHeight + 10, 'About', {fontSize: '32px' }).setOrigin(0.5);

        //add buttons the allButtons
        this.allButtons.push(playButton,aboutButton);

        //second camera for buttons 
        const UICam = this.cameras.add(0, 0, width, height);
        this.cameras.main.ignore([this.allButtons, this.handCursor,playText,aboutText]);
        UICam.ignore(this.titleImage);

        // Initialize the selected button index
        this.selectButtonIndex = 0
        this.selectButton(this.selectButtonIndex)

        //event listeners for selecting 
        playButton.on('selected', () => {
            console.log('play')
            this.allButtons = []
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

    //tinting the button
	selectButton(index)
	{   
        const currentButton = this.allButtons[this.selectedButtonIndex]

        // set the current selected button to a white tint
        currentButton.setTint(0xffffff)
    
        const button = this.allButtons[index]

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
        if (index >= this.allButtons.length){index = 0}
        else if (index < 0) { index = this.allButtons.length - 1 }

        this.selectButton(index)
    }

    //create an event listener on the button called selected
	confirmSelection()
	{
		const button = this.allButtons[this.selectedButtonIndex]
        button.emit('selected')

	}

    update() {

        //title Screen Camera
        this.cameras.main.rotation += 0.01;
        this.cameras.main.setZoom(Math.abs(Math.sin(this.cameras.main.rotation)) * 0.5 + 1);
        //key inputs
        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
		const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down)
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER))
    
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
