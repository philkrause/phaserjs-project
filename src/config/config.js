import { GAME_HEIGHT, GAME_WIDTH, DEBUG_MODE, GRAVITY } from "./constants";
import TitleScene from '../scenes/TitleScene';
import GameScene from '../scenes/GameScene';

var startSceneConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scene: [TitleScene,GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GRAVITY },
            debug: DEBUG_MODE
        }
    }
};


export default startSceneConfig