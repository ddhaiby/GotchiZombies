import { CST } from "../CST";
import { AttributeData, Character } from "./Character";
import { GZ_FireWeapon } from "../Weapons/GZ_FireWeapon"
import { GZ_Bullet } from "../Weapons/GZ_Bullet";
import { FirePistol } from "../Weapons/FirePistol";
import { SceneGame } from "../Scenes/SceneGame";
import { GZ_Object } from "../Objects/GZ_Object";
import { InteractionComponent } from "./InteractionComponent";

declare type PlayerKeys = 
{
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    interact: Phaser.Input.Keyboard.Key;
}

export class Player extends Character
{
    /** Keys to control the player */
    protected keys: PlayerKeys;

    /** The weapon to fire */
    protected _currentWeapon: GZ_FireWeapon;

    protected _isFiring: boolean = false;

    protected timerFiringState: Phaser.Time.TimerEvent;

    protected interactableObjects: Phaser.Structs.Map<string, GZ_Object> = new Phaser.Structs.Map<string, GZ_Object>([]);

    protected _interactableComp: InteractionComponent;

    protected focusedObject: GZ_Object;
    protected oldFocusedObject: GZ_Object;
    protected oldOldFocusedObject: GZ_Object;

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

        this._interactableComp = new InteractionComponent(this.scene, this, this.x, this.y, this.width + 20, this.height + 20).setOrigin(0.5, 0.5);
        this.scene.physics.add.existing(this._interactableComp);

        this.setDepth(1);
    }

    protected initAttributes(attributeData?: AttributeData): void
    {
        super.initAttributes(attributeData);

        const sceneGame = this.scene as SceneGame;
        const gameSettings = this.scene.cache.json.get("gameSettings");
        this.maxHealth = gameSettings[Math.min(sceneGame.currentLevel - 1, gameSettings.length)].playerHealth;
        this.health = this.maxHealth;
    }

    protected initKeys(): void
    {
        this.keys = this.scene.input.keyboard.addKeys({
            up: "W",
            down: "S",
            left: "A",
            right: "D",
            interact: "E"
        }, false) as PlayerKeys;

        this.keys.interact.on("down", this.interact, this);
    }

    protected initAbilities(): void
    {
        super.initAbilities();

        this._currentWeapon = new FirePistol(this.scene, 0, 0, CST.GAME.WEAPONS.RARITY.COMMON);
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

    public setDepth(value: number): this
    {
        this.healthBar.setDepth(value);
        return super.setDepth(value);
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    public update(): void
    {
        super.update();

        this._interactableComp.setPosition(this.x, this.y);
    }

    /** Update the anims of this Character */
    protected updateAnimations(): void
    {
        if (!this.isAlive())
        {
            return;
        }

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

        this.body.setSize(40, this.displayHeight);
        this.body.setOffset((this.width - 40) * 0.5, (this.height - this.displayHeight));
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

        let newFocuseObject = null;// = this.interactableObjects > 0 ? this.interactableObjects[0] : null;
        let distNewFocuseObject = 999999;//newFocuseObject ? this.distFromPlayer(newFocuseObject) : 999999;

        let newInteractableObjects = new Phaser.Structs.Map<string, GZ_Object>([]);

        for (const object of this.interactableObjects.getArray())
        {
            if (object.body.embedded)
            {
                newInteractableObjects.set(object.name, object);

                const distObject = this.distFromPlayer(object);

                if (distObject < distNewFocuseObject)
                {
                    newFocuseObject = object;
                    distNewFocuseObject = distObject;
                }
            }
        }

        if (newFocuseObject)
        {
            newFocuseObject.showHint();

            if (this.focusedObject && (this.focusedObject != newFocuseObject))
            {
                this.focusedObject.hideHint();
            }

            this.focusedObject = newFocuseObject;
        }
        else if (this.focusedObject)
        {
            this.focusedObject.hideHint();
            this.focusedObject = null;
        }

        this.interactableObjects = newInteractableObjects;
    }

    private distFromPlayer(object: GZ_Object): number
    {
        return Math.abs(this.x - object.x) + Math.abs(this.y - object.y);
    }

    public get currentWeapon(): GZ_FireWeapon
    {
        return this._currentWeapon;
    }

    public get interactableComp(): Phaser.GameObjects.Zone
    {
        return this._interactableComp;
    }

    public interact(): void
    {
        if (this.focusedObject)
        {
            this.focusedObject.interact(this);
        }
        else if (this.oldFocusedObject)
        {
            this.oldFocusedObject.interact(this);
        }
        else if (this.oldOldFocusedObject)
        {
            this.oldOldFocusedObject.interact(this);
        }
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

    public onObjectOverlap(object: GZ_Object): void
    {
        this.interactableObjects.set(object.name, object);
    }
}