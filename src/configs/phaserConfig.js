import { GAME_HEIGHT, GAME_WIDTH } from "./constants";
import PreloadScene from '../scenes/PreloadScene';
import StartScene from '../scenes/StartScene';

var startSceneConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scene: [PreloadScene,StartScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    }
};


export default startSceneConfig