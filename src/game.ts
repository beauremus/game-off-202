import '../node_modules/phaser/dist/phaser.js';

const gameSpace = {
    width: 800,
    height: 600
}

export default class Demo extends Phaser.Scene
{
    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.image('moon', 'assets/moon.png')
        // this.load.image('logo', 'assets/phaser3-logo.png');
        // this.load.image('libs', 'assets/libs.png');
        // this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        // this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create ()
    {
        const moon = this.add.image(-200, gameSpace.height/2, 'moon')

        this.tweens.add({
            targets: moon,
            x: gameSpace.width+200,
            duration: 4000,
            ease: 'Expo.inOut',
            repeat: -1
        })

        // this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

        // this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);

        // this.add.image(400, 300, 'libs');

        // const logo = this.add.image(400, 70, 'logo');

        // this.tweens.add({
        //     targets: logo,
        //     y: 350,
        //     duration: 1500,
        //     ease: 'Sine.inOut',
        //     yoyo: true,
        //     repeat: -1
        // })
    }
}

const config = {
    type: Phaser.AUTO,
    width: gameSpace.width,
    height: gameSpace.height,
    scene: Demo
};

const game = new Phaser.Game(config);