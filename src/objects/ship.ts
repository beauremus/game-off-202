import { Bullet } from "../objects/bullet";
import { consts } from "../state/state";

type Params = {
  scene: Phaser.Scene;
  opt: any;
}

export class Ship extends Phaser.GameObjects.Graphics {
  // I use "definite assignment assertion (!)" because the `initShip()` method
  // definitely assigns `velocity`.
  private velocity!: Phaser.Math.Vector2;
  private cursors: any;
  private bullets: Bullet[];
  private shootKey: Phaser.Input.Keyboard.Key;
  private isShooting: boolean;

  public getBullets(): Bullet[] {
    return this.bullets;
  }

  public getBody(): any {
    return this.body;
  }

  constructor(params: Params) {
    super(params.scene, params.opt);

    // variables
    this.bullets = [];
    this.isShooting = false;

    // init ship
    this.initShip();

    // TODO: Change to mouse
    // input
    // this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.cursors = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.shootKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // physics
    this.scene.physics.world.enable(this);

    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.allowGravity = false;
      this.body.setSize(consts.SHIP_SIZE * 2, consts.SHIP_SIZE * 2);
      this.body.setOffset(-consts.SHIP_SIZE, -consts.SHIP_SIZE);
    }

    this.scene.add.existing(this);
  }

  private applyForces(): void {
    // apply velocity to position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // reduce the velocity
    this.velocity.scale(0.98);
  }

  private accelerate(): Phaser.Math.Vector2 {
    // create the force in the correct direction
    let force = new Phaser.Math.Vector2(
      Math.cos(this.rotation - Math.PI / 2),
      Math.sin(this.rotation - Math.PI / 2)
    );

    // reduce the force and apply it to the velocity
    return force.scale(0.12);
  }

  private boost(): void {
    this.velocity.add(this.accelerate());
  }

  private slow(): void {
    this.velocity.subtract(this.accelerate());
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

  private initShip(): void {
    // define ship properties
    this.x = this.scene.sys.canvas.width / 2;
    this.y = this.scene.sys.canvas.height / 2;
    this.velocity = new Phaser.Math.Vector2(0, 0);

    // define ship graphics and draw it
    this.lineStyle(1, 0xffffff);

    this.strokeTriangle(
      -consts.SHIP_SIZE,
      consts.SHIP_SIZE,
      consts.SHIP_SIZE,
      consts.SHIP_SIZE,
      0,
      -consts.SHIP_SIZE
    );
  }

  private recoil(): void {
    // create the force in the correct direction
    let force = new Phaser.Math.Vector2(
      -Math.cos(this.rotation - Math.PI / 2),
      -Math.sin(this.rotation - Math.PI / 2)
    );

    // reduce the force and apply it to the velocity
    force.scale(0.2);
    this.velocity.add(force);
  }

  private shoot(): void {
    this.bullets.push(
      new Bullet(this.scene, {
        x: this.x,
        y: this.y,
        rotation: this.rotation,
      })
    );
  }

  private handleInput(): void {
    if (this.cursors.up.isDown) {
      this.boost();
    }

    if (this.cursors.down.isDown) {
      this.slow();
    }

    if (this.cursors.right.isDown) {
      this.rotation += 0.05;
    } else if (this.cursors.left.isDown) {
      this.rotation -= 0.05;
    }

    if (this.shootKey.isDown && !this.isShooting) {
      this.shoot();
      this.recoil();
      this.isShooting = true;
    }

    if (this.shootKey.isUp) {
      this.isShooting = false;
    }
  }

  private updateBullets(): void {
    for (let i = 0; i < this.bullets.length; i++) {
      if (this.bullets[i].active) {
        this.bullets[i].update();
      } else {
        this.bullets[i].destroy();
        this.bullets.splice(i, 1);
      }
    }
  }

  update(): void {
    if (this.active)
      this.handleInput();
    this.applyForces();
    this.checkIfOffScreen();
    this.updateBullets();
  }
}
