import { Asteroid } from "../objects/asteroid";
import { Moon } from "../objects/moon";
import { Ship } from "../objects/ship";
import { vars, consts } from "../state/state"

export class GameScene extends Phaser.Scene {
    private player!: Ship;
    // private asteroids!: Asteroid[];
    private moon!: Moon;
    private asteroid!: Asteroid;
    private numberOfAsteroids!: number;
    private score!: number;
    private bitmapTexts!: Phaser.GameObjects.BitmapText[];
    private gotHit!: boolean;

    constructor () {
        super(`GameScene`)
    }

    // private spawnAsteroids(
    //     aAmount: number,
    //     aSize: number,
    //     aX?: number,
    //     aY?: number
    // ) {
    //     if (aSize > 0) {
    //         for (let i = 0; i < aAmount; i++) {
    //             this.asteroids.push(
    //                 new Asteroid({
    //                     scene: this,
    //                     x:
    //                         aX === undefined
    //                         ? this.getRandomSpawnPosition(this.sys.canvas.width)
    //                         : aX,
    //                     y:
    //                         aY === undefined
    //                         ? this.getRandomSpawnPosition(this.sys.canvas.height)
    //                         : aY,
    //                     size: aSize
    //                 })
    //             );
    //         }
    //     }
    // }

    private spawnMoon(
        aSize: number,
        aX?: number,
        aY?: number
    ): Moon | null {
        if (aSize <= 0) return null

        const { width: canvasWidth, height: canvasHeight } = this.sys.canvas;
        console.log({ canvasWidth, canvasHeight, aX, aY })

        this.moon = new Moon({
            scene: this,
            x: aX || this.getRandomSpawnPosition(this.sys.canvas.width),
            y: aY || this.getRandomSpawnPosition(this.sys.canvas.height),
            size: aSize
        })

        return this.moon
    }

    private spawnAsteroid(
        aSize: number,
        aX?: number,
        aY?: number
    ): Asteroid | null {
        if (aSize <= 0) return null

        const { width: canvasWidth, height: canvasHeight } = this.sys.canvas;
        console.log({ canvasWidth, canvasHeight, aX, aY })

        this.asteroid = new Asteroid({
            scene: this,
            x: aX || this.getRandomSpawnPosition(this.sys.canvas.width),
            y: aY || this.getRandomSpawnPosition(this.sys.canvas.height),
            size: aSize
        })

        return this.asteroid
    }

    private updateScore(aSizeOfAsteroid: number) {
        switch (aSizeOfAsteroid) {
            case 3:
                this.score += 20;
                break;
            case 2:
                this.score += 50;
                break;
            case 1:
                this.score += 100;
                break;
        }

        vars.score = this.score;
        this.bitmapTexts[0].text = "" + this.score;
    }

    private getRandomSpawnPosition(aScreenSize: number): number {
        let rndPos = Phaser.Math.RND.between(0, aScreenSize);
    
        while (rndPos > aScreenSize / 3 && rndPos < aScreenSize * 2 / 3) {
            rndPos = Phaser.Math.RND.between(0, aScreenSize);
        }

        return rndPos;
    }

    preload(): void {
        this.load.image('earth', 'assets/earth.png')
        this.load.image('moon', 'assets/moon.png')
        this.load.bitmapFont(
            `asteroidFont`,
            `../assets/font/asteroidFont.png`,
            `../assets/font/asteroidFont.fnt`
        )
    }

    create(): void {
        const earth = this.add.image(this.sys.canvas.width/2, this.sys.canvas.height/2, 'earth')
        const moonImg = this.add.image(-200, this.sys.canvas.height/2, 'moon')
        console.log(this.sys.canvas.height/2)

        this.tweens.add({
            targets: moonImg,
            x: this.sys.canvas.width+200,
            duration: 4000,
            ease: 'Expo.inOut',
            repeat: -1
        })

        this.player = new Ship({ scene: this, opt: {} });
        // this.asteroids = [];
        this.numberOfAsteroids = consts.ASTEROID_COUNT;
        // this.spawnAsteroids(this.numberOfAsteroids, 3);
        const moonSize = 3;
        const { width: canvasWidth, height: canvasHeight } = this.sys.canvas;
        console.log({ canvasWidth, canvasHeight })
        this.spawnMoon(moonSize);
        this.spawnAsteroid(3);
        // this.spawnMoon(moonSize, 0, 300);

        this.score = vars.score;
        this.bitmapTexts = [];
        this.bitmapTexts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2,
                40,
                "asteroidFont",
                "" + this.score,
                80
            )
        );
        this.gotHit = false;
    }

    update(): void {
        this.player.update();

        // // check collision between asteroids and bullets
        // for (let i = 0; i < this.asteroids.length; i++) {
        //     for (let bullet of this.player.getBullets()) {
        //         const bulletBody = bullet.getBody() as Phaser.Physics.Arcade.Body
        //         const asteroidBody = this.asteroids[i].getBody() as Phaser.Physics.Arcade.Body
        //         if (
        //             Phaser.Geom.Intersects.RectangleToRectangle(
        //                 bulletBody.customBoundsRectangle,
        //                 asteroidBody.customBoundsRectangle
        //             )
        //         ) {
        //             bullet.setActive(false);
        //             this.asteroids[i].setActive(false);
        //             this.updateScore(this.asteroids[i].getSize());
        //         }
        //     }
        //     this.asteroids[i].update();

        //     if (!this.asteroids[i].active) {
        //         this.spawnAsteroids(
        //             3,
        //             this.asteroids[i].getSize() - 1,
        //             this.asteroids[i].x,
        //             this.asteroids[i].y
        //         );
        //         this.asteroids[i].destroy();
        //         this.asteroids.splice(i, 1);
        //     }
        // }

        for (let bullet of this.player.getBullets()) {
            const bulletBody = bullet.getBody() as Phaser.Physics.Arcade.Body
            const moonBody = this.moon.getBody() as Phaser.Physics.Arcade.Body
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    bulletBody.customBoundsRectangle,
                    moonBody.customBoundsRectangle
                )
            ) {
                bullet.setActive(false);
                this.moon.setActive(false);
                this.updateScore(this.moon.getSize());
            }
        }
        this.moon.update();
        this.asteroid.update();

        if (!this.moon.active) {
            this.spawnMoon(
                this.moon.getSize() - 1,
                this.moon.x,
                this.moon.y
            );
            this.moon.destroy();
        }

        if (!this.asteroid.active) {
            this.spawnAsteroid(
                this.asteroid.getSize() - 1,
                this.asteroid.x,
                this.asteroid.y
            );
            this.asteroid.destroy();
        }

        // // check collision between asteroids and ship
        // for (let i = 0; i < this.asteroids.length; i++) {
        //     if (
        //         Phaser.Geom.Intersects.RectangleToRectangle(
        //         this.asteroids[i].getBody(),
        //         this.player.getBody()
        //         )
        //     ) {
        //         this.player.setActive(false);
        //         this.gotHit = true;
        //     }
        // }

        if (
            Phaser.Geom.Intersects.RectangleToRectangle(
            this.moon.getBody(),
            this.player.getBody()
            )
        ) {
            this.player.setActive(false);
            this.gotHit = true;
        }

        if (
            Phaser.Geom.Intersects.RectangleToRectangle(
            this.asteroid.getBody(),
            this.player.getBody()
            )
        ) {
            this.player.setActive(false);
            this.gotHit = true;
        }

        // if player got hit
        if (this.gotHit) {
            vars.lives--;

            if (vars.lives > 0) {
                this.scene.start("GameScene");
            } else {
                // this.scene.start("MainMenuScene");
                this.scene.start("GameScene");
            }
        }

        if (this.gotHit) {
            // this.scene.start("MainMenuScene");
            this.scene.start("GameScene");
        }
    }
}