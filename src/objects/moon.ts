import { consts } from "../state/state";

interface Params extends Phaser.Types.GameObjects.Graphics.Options {
  scene: Phaser.Scene;
  size: number;
}

export class Moon extends Phaser.GameObjects.Graphics {
  private velocity: Phaser.Math.Vector2 = this.getRandomVelocity(
    consts.ASTEROID.LARGE.MINSPEED,
    consts.ASTEROID.LARGE.MAXSPEED
  );
  private radius!: number;
  private moonRadius: number;
  private sizeOfMoon: number;

  public getRadius(): number {
    return this.radius;
  }
  public getBody(): any {
    return this.body;
  }

  constructor(params: Params) {
    super(params.scene, params);

    const { width: canvasWidth, height: canvasHeight } = this.scene.sys.canvas;
    const { x: velocityX, y: velocityY } = this.velocity;
    console.log({ canvasWidth, canvasHeight, velocity: { velocityX, velocityY } })

    // variables
    this.moonRadius = 0;
    this.sizeOfMoon = params.size;

    // init ship
    this.initMoon(params.x || 0, params.y || 0, this.sizeOfMoon);

    // physics
    this.scene.physics.world.enable(this);

    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.allowGravity = false;
      this.body.setCircle(this.moonRadius);
      this.body.setOffset(-this.moonRadius, -this.moonRadius);
    }

    this.scene.add.existing(this);
  }

  private initMoon(aX: number, aY: number, aSizeOfAsteroid: number): void {
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

    if (this.radius > this.moonRadius) {
      this.moonRadius = this.radius;
    }

    // this.lineStyle(3, 0xaa0000);
    // this.beginPath();
    // this.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    // this.strokePath();

    const points: Phaser.Math.Vector2[] = [
      new Phaser.Math.Vector2(51, 0),
      new Phaser.Math.Vector2(74.47818472546173, 42.99999999999999),
      new Phaser.Math.Vector2(34.50000000000001, 59.75575286112626),
      new Phaser.Math.Vector2(4.592425496802574e-15, 75),
      new Phaser.Math.Vector2(-38.999999999999986, 67.54998149518622),
      new Phaser.Math.Vector2(-84.870489570875, 48.99999999999999),
      new Phaser.Math.Vector2(-67, 8.205133554287266e-15),
      new Phaser.Math.Vector2(-78.80831174438393, -45.49999999999997),
      new Phaser.Math.Vector2(-45.50000000000004, -78.8083117443839),
      new Phaser.Math.Vector2(-1.4695761589768237e-14, -80),
      new Phaser.Math.Vector2(29.500000000000007, -51.09549882328188),
      new Phaser.Math.Vector2(58.889727457341806, -34.00000000000003)
    ]

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
    // console.log({
    //   x: this.x,
    //   y: this.y
    // })
    this.checkIfOffScreen();
  }

  private applyForces(): void {
    // apply velocity to position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // rotate
    this.rotation += 0.005;
  }

  public getSize(): number {
    return this.sizeOfMoon;
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
