import { Asteroid } from "../objects/asteroid";
import { Ship } from "../objects/ship";
import { CONST } from "../const/const"

export class GameScene extends Phaser.Scene {
    private player!: Ship;
    private asteroids!: Asteroid[];
    private numberOfAsteroids!: number;
    private score!: number;
    private bitmapTexts!: Phaser.GameObjects.BitmapText[];
    private gotHit!: boolean;

    constructor () {
        super(`GameScene`)
    }

    private spawnAsteroids(
        aAmount: number,
        aSize: number,
        aX?: number,
        aY?: number
    ) {
        if (aSize > 0) {
            for (let i = 0; i < aAmount; i++) {
                this.asteroids.push(
                    new Asteroid({
                        scene: this,
                        x:
                            aX === undefined
                            ? this.getRandomSpawnPosition(this.sys.canvas.width)
                            : aX,
                        y:
                            aY === undefined
                            ? this.getRandomSpawnPosition(this.sys.canvas.height)
                            : aY,
                        size: aSize
                    })
                );
            }
        }
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

        CONST.SCORE = this.score;
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
        const moon = this.add.image(-200, this.sys.canvas.height/2, 'moon')

        this.tweens.add({
            targets: moon,
            x: this.sys.canvas.width+200,
            duration: 4000,
            ease: 'Expo.inOut',
            repeat: -1
        })

        this.player = new Ship({ scene: this, opt: {} });
        this.asteroids = [];
        this.numberOfAsteroids = CONST.ASTEROID_COUNT;
        this.spawnAsteroids(this.numberOfAsteroids, 3);
        this.score = CONST.SCORE;
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

        // check collision between asteroids and bullets
        for (let i = 0; i < this.asteroids.length; i++) {
            for (let bullet of this.player.getBullets()) {
                const bulletBody = bullet.getBody() as Phaser.Physics.Arcade.Body
                const asteroidBody = this.asteroids[i].getBody() as Phaser.Physics.Arcade.Body
                if (
                    Phaser.Geom.Intersects.RectangleToRectangle(
                        bulletBody.customBoundsRectangle,
                        asteroidBody.customBoundsRectangle
                    )
                ) {
                    bullet.setActive(false);
                    this.asteroids[i].setActive(false);
                    this.updateScore(this.asteroids[i].getSize());
                }
            }
            this.asteroids[i].update();

            if (!this.asteroids[i].active) {
                this.spawnAsteroids(
                3,
                this.asteroids[i].getSize() - 1,
                this.asteroids[i].x,
                this.asteroids[i].y
                );
                this.asteroids[i].destroy();
                this.asteroids.splice(i, 1);
            }
        }

        // check collision between asteroids and ship
        for (let i = 0; i < this.asteroids.length; i++) {
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                this.asteroids[i].getBody(),
                this.player.getBody()
                )
            ) {
                this.player.setActive(false);
                this.gotHit = true;
            }
        }

        // if player got hit
        if (this.gotHit) {
            CONST.LIVES--;

            if (CONST.LIVES > 0) {
                this.scene.start("GameScene");
            } else {
                this.scene.start("MainMenuScene");
            }
        }

        if (this.asteroids.length === 0) {
            this.scene.start("MainMenuScene");
        }
    }
}