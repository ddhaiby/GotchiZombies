import { CST } from "../CST";
import { Character } from "./Character";
import { Weapon, consts, Bullet, ObjectWithTransform } from "phaser3-weapon-plugin";
import { GZ_Bullet } from "../Weapons/GZ_Bullet";

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
    protected _currentWeapon: Weapon;

    constructor(scene: Phaser.Scene, x?: number, y?: number)
    {
        super(scene, x, y);
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
            up: "w",
            down: "S",
            left: "Q",
            right: "D"
        }, false) as PlayerKeys;
    }

    protected initAbilities(): void
    {
        super.initAbilities();

        this._currentWeapon = new Weapon(this.scene, -1, "bullet");
        this._currentWeapon.trackSprite(this);
        this._currentWeapon.bulletClass = GZ_Bullet;
        this._currentWeapon.bulletSpeed = 700;
        this._currentWeapon.fireRate = 150;
    }

    protected initAnimations(texture: string): void
    {
        super.initAnimations(texture);
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    /** Update the anims of this Character */
    protected updateAnimations(): void
    {
    }

    /** Define the way to control this Character */
    protected updateControls(): void
    {
        if (this.keys.up.isDown)
        {
            this.lookUp();
            this.walkUp();
        }
        else if (this.keys.down.isDown)
        {
            this.lookDown();
            this.walkDown();
        }
        else
        {
            this.stopWalkingY()
        }

        if (this.keys.right.isDown)
        {
            this.lookOnRight();
            this.walkOnRight();
        }
        else if (this.keys.left.isDown)
        {
            this.lookOnLeft();
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

    public get currentWeapon(): Weapon
    {
        return this._currentWeapon;
    }

    public fireAtPointer(pointer: Phaser.Input.Pointer): void
    {
        if (this.canFire())
        {
            const bullet = this._currentWeapon.fireAtPointer(pointer);
            if (bullet)
            {
                (bullet as GZ_Bullet).owner = this;
                (bullet as GZ_Bullet).damage = this.damage;
            }
        }
    }

    public canFire(): boolean
    {
        return this.isAlive();
    }

    protected die(): void
    {
        super.die();

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1500
        });
    }
}