// This game borrows heavily from https://github.com/digitsensitive/phaser3-typescript/tree/master/src/games/asteroid
import 'phaser';
import { GameScene } from './scenes/gameScene';

const config: Phaser.Types.Core.GameConfig = {
    title: `Moonshot!`,
    version: `0.1.0`,
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    scene: [GameScene],
    input: {
        gamepad: false,
        keyboard: true,
        mouse: false,
        touch: false,
    },
    physics: {
        default: `arcade`,
        arcade: {
            debug: false
        }
    },
    backgroundColor: `#000000`,
    render: {
        pixelArt: false,
        antialias: true
    }
}

new Phaser.Game(config)
