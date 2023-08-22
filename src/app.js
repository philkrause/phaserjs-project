// src/app.js
import 'phaser'; 

import config from './configs/phaserConfig';

const game = new Phaser.Game(config);
game.scene.start('PreloadSceneKey');

