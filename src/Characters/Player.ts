import { CST } from "../CST";
import { Character } from "./Character";
import { GZ_FireWeapon } from "../Weapons/GZ_FireWeapon"
import { GZ_Bullet } from "../Weapons/GZ_Bullet";
import { FirePistol } from "../Weapons/FirePistol";

declare type PlayerKeys = 
{
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
}

export class Player extends Character
{
    /** Keys to control the player */
    protected keys: PlayerKeys;

    /** The weapon to fire */
    protected _currentWeapon: GZ_FireWeapon;

    protected _isFiring: boolean = false;

    protected timerFiringState: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene, x?: number, y?: number)
    {
        super(scene, x, y);

        this.timerFiringState = scene.time.addEvent({}); // Create an empty timer to avoid null error
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    public init(texture?: string): void
    {
        super.init(texture);

        this.initKeys();
        this.healthBar.width = 50;
        this.healthBar.height = 6;
    }

    protected initKeys(): void
    {
        this.keys = this.scene.input.keyboard.addKeys({
            up: "W",
            down: "S",
            left: "A",
            right: "D"
        }, false) as PlayerKeys;
    }

    protected initAbilities(): void
    {
        super.initAbilities();

        this._currentWeapon = new FirePistol(this.scene, 0, 0);
        this._currentWeapon.setOwner(this);
        this._currentWeapon.trackSprite(this);
        this._currentWeapon.bulletClass = GZ_Bullet;
        this._currentWeapon.bulletSpeed = 700;
        this._currentWeapon.fireRate = 150;
    }

    protected initAnimations(texture: string): void
    {
        super.initAnimations(texture);

        const sides = ["Down", "Up", "Right", "Left"];

        for (const side of sides)
        {
            this.anims.create({
                key: "Idle" + side,
                frames: this.anims.generateFrameNames(this.texture.key, { prefix: "player" + side + "_", suffix: ".png", start: 1, end: 1, zeroPad: 3 }),
                frameRate: 1,
                repeat: -1
            });

            this.anims.create({
                key: "Walk" + side,
                frames: this.anims.generateFrameNames(this.texture.key, { prefix: "player" + side + "_", suffix: ".png", start: 1, end: 1, zeroPad: 3 }),
                frameRate: 1,
                repeat: -1
            });

            this.anims.create({
                key: "Death",
                frames: this.anims.generateFrameNames(this.texture.key, { prefix: "playerDeath" + "_", suffix: ".png", start: 1, end: 1, zeroPad: 3 }),
                frameRate: 1,
                repeat: -1
            });

            this.anims.create({
                key: "Victory",
                frames: this.anims.generateFrameNames(this.texture.key, { prefix: "playerVictory" + "_", suffix: ".png", start: 1, end: 2, zeroPad: 3 }),
                frameRate: 1,
                repeat: -1
            });
        }

        this.anims.play("IdleDown");
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    /** Update the anims of this Character */
    protected updateAnimations(): void
    {
        const mouseX = this.scene.input.mousePointer.worldX;
        const mouseY = this.scene.input.mousePointer.worldY;
        const rotation = Math.atan2(this.y - mouseY, this.x - mouseX);
        const baseAnim = this.isWalking ? "Walk" : "Idle";

        if (this._isFiring || !this.isWalking)
        {
            if (Math.abs(rotation) < Math.PI * 0.25)
            {
                this.anims.play(baseAnim + "Left", true);
            }
            else if (Math.abs(rotation) > Math.PI * 0.75)
            {
                this.anims.play(baseAnim + "Right", true);
            }
            else if (rotation > 0)
            {
                this.anims.play(baseAnim + "Up", true);
            }
            else
            {
                this.anims.play(baseAnim + "Down", true);
            }
        }
    }

    /** Define the way to control this Character */
    protected updateControls(): void
    {
        if (!this.isAlive())
        {
            return;
        }

        if (this.scene.input.mousePointer.leftButtonDown())
        {
            this.fireAtPointer(this.scene.input.mousePointer);
        }

        if (this.keys.up.isDown)
        {
            this.walkUp();
        }
        else if (this.keys.down.isDown)
        {
            this.walkDown();
        }
        else
        {
            this.stopWalkingY()
        }

        if (this.keys.right.isDown)
        {
            this.walkOnRight();
        }
        else if (this.keys.left.isDown)
        {
            this.walkOnLeft();
        }
        else
        {
            this.stopWalkingX()
        }
    }

    public postUpdate(): void
    {
        super.postUpdate();
    }

    public get currentWeapon(): GZ_FireWeapon
    {
        return this._currentWeapon;
    }

    public fireAtPointer(pointer: Phaser.Input.Pointer): void
    {
        if (this.canFire())
        {
            this._currentWeapon.fire(null, pointer.worldX, pointer.worldY);
            this._isFiring = true;
            this.timerFiringState.remove();
            this.timerFiringState = this.scene.time.delayedCall(600, () => { this._isFiring = false; }, null, this);
        }
    }

    public canFire(): boolean
    {
        return this.isAlive();
    }

    protected die(): void
    {
        super.die();

        this.anims.play("Death", false);

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 2000
        });
    }

    public walkUp(): void
    {
        super.walkUp();

        if (!this._isFiring)
        {
            this.anims.play("WalkUp", true);
        }
    }

    public walkDown(): void
    {
        super.walkDown();

        if (!this._isFiring)
        {
            this.anims.play("WalkDown", true);
        }
    }

    public walkOnLeft(): void
    {
        super.walkOnLeft();

        if (!this._isFiring)
        {
            this.anims.play("WalkLeft", true);
        }
    }

    public walkOnRight(): void
    {
        super.walkOnRight();

        if (!this._isFiring)
        {
            this.anims.play("WalkRight", true);
        }
    }
}