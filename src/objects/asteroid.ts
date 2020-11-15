import { consts } from "../state/state";

interface Params extends Phaser.Types.GameObjects.Graphics.Options {
  scene: Phaser.Scene;
  size: number;
}

export class Asteroid extends Phaser.GameObjects.Graphics {
  private velocity: Phaser.Math.Vector2 = this.getRandomVelocity(
    consts.ASTEROID.LARGE.MINSPEED,
    consts.ASTEROID.LARGE.MAXSPEED
  );
  private radius: number = Phaser.Math.RND.between(
    consts.ASTEROID.LARGE.MAXSIZE,
    consts.ASTEROID.LARGE.MINSIZE
  );
  private asteroidRadius: number;
  private sizeOfAsteroid: number;
  private numberOfSides: number;

  public getRadius(): number {
    return this.radius;
  }
  public getBody(): any {
    return this.body;
  }

  constructor(params: Params) {
    super(params.scene, params);

    // variables
    this.numberOfSides = 12;
    this.asteroidRadius = 0;
    this.sizeOfAsteroid = params.size;

    // init ship
    this.initAsteroid(params.x || 0, params.y || 0, this.sizeOfAsteroid);

    // physics
    this.scene.physics.world.enable(this);

    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.allowGravity = false;
      this.body.setCircle(this.asteroidRadius);
      this.body.setOffset(-this.asteroidRadius, -this.asteroidRadius);
    }

    this.scene.add.existing(this);
  }

  private initAsteroid(aX: number, aY: number, aSizeOfAsteroid: number): void {
    let points: Phaser.Math.Vector2[] = [];

    for (let i = 0; i < this.numberOfSides; i++) {
      switch (aSizeOfAsteroid) {
        case 3: {
          this.radius = Phaser.Math.RND.between(
            consts.ASTEROID.LARGE.MAXSIZE,
            consts.ASTEROID.LARGE.MINSIZE
          );
          this.velocity = this.getRandomVelocity(
            consts.ASTEROID.LARGE.MINSPEED,
            consts.ASTEROID.LARGE.MAXSPEED
          );
          break;
        }

        case 2: {
          this.radius = Phaser.Math.RND.between(
            consts.ASTEROID.MEDIUM.MAXSIZE,
            consts.ASTEROID.MEDIUM.MINSIZE
          );
          this.velocity = this.getRandomVelocity(
            consts.ASTEROID.MEDIUM.MINSPEED,
            consts.ASTEROID.MEDIUM.MAXSPEED
          );
          break;
        }

        case 1: {
          this.radius = Phaser.Math.RND.between(
            consts.ASTEROID.SMALL.MAXSIZE,
            consts.ASTEROID.SMALL.MINSIZE
          );
          this.velocity = this.getRandomVelocity(
            consts.ASTEROID.SMALL.MINSPEED,
            consts.ASTEROID.SMALL.MAXSPEED
          );
          break;
        }
      }
      if (this.radius > this.asteroidRadius) {
        this.asteroidRadius = this.radius;
      }
      let x = this.radius * Math.cos((2 * Math.PI * i) / this.numberOfSides);
      let y = this.radius * Math.sin((2 * Math.PI * i) / this.numberOfSides);

      points.push(new Phaser.Math.Vector2(x, y));
    }

    this.lineStyle(1, 0xffffff);
    for (let p = 0; p < points.length; p++) {
      this.beginPath();
      this.moveTo(points[p].x, points[p].y);
      if (p + 1 < points.length) {
        this.lineTo(points[p + 1].x, points[p + 1].y);
      } else {
        this.lineTo(points[0].x, points[0].y);
      }
      this.strokePath();
    }

    this.x = aX;
    this.y = aY;
  }

  update(): void {
    this.applyForces();
    this.checkIfOffScreen();
  }

  private applyForces(): void {
    // apple velocity to position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // rotate
    this.rotation += 0.005;
  }

  public getSize(): number {
    return this.sizeOfAsteroid;
  }

  private checkIfOffScreen(): void {
    // horizontal check
    if (this.x > this.scene.sys.canvas.width + consts.SHIP_SIZE) {
      this.x = -consts.SHIP_SIZE;
    } else if (this.x < -consts.SHIP_SIZE) {
      this.x = this.scene.sys.canvas.width + consts.SHIP_SIZE;
    }

    // vertical check
    if (this.y > this.scene.sys.canvas.height + consts.SHIP_SIZE) {
      this.y = -consts.SHIP_SIZE;
    } else if (this.y < -consts.SHIP_SIZE) {
      this.y = this.scene.sys.canvas.height + consts.SHIP_SIZE;
    }
  }

  private getRandomVelocity(aMin: number, aMax: number): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      Phaser.Math.RND.between(
        this.getRndNumber(aMin, aMax),
        this.getRndNumber(aMin, aMax)
      ),
      Phaser.Math.RND.between(
        this.getRndNumber(aMin, aMax),
        this.getRndNumber(aMin, aMax)
      )
    );
  }

  private getRndNumber(aMin: number, aMax: number): number {
    let num = Math.floor(Math.random() * aMax) + aMin;
    num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    return num;
  }
}