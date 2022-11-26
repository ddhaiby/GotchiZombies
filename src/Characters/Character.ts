import { CST } from "../CST";
import { GZ_Bar } from "../Gui/GZ_Bar";

export declare type AttributeData = {
    walkSpeed: number,
    maxHealth: number,
    damage: number
} 

export class Character extends Phaser.Physics.Arcade.Sprite
{
    // Attributes
    /** Walk speed */
    protected walkSpeed: number = 200;

    /** Max hp of this character */
    protected maxHealth: number = 100;

    /** Current hp of this character */
    protected health: number = 100;

    /** Current damage of this character */
    public damage: number = 25;

    // Gui
    /** Health bar of this cahracter */
    protected healthBar: GZ_Bar;

    // State - Walking
    /** Whether the character is walking */
    protected isWalking: boolean = false;

    /** Whether the character is looking up */
    public isLookingUp: boolean = false;

    /** Whether the character is looking on right direction */
    public isLookingRight: boolean = false;

    constructor(scene: Phaser.Scene, x?: number, y?: number)
    {
        super(scene, x, y, "");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setMaxSpeed(CST.PHYSIC.CHARACTER_MAX_SPEED);
        body.allowGravity = false;

        this.setCollideWorldBounds(true);

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) {
            this.emit("animationcomplete_" + anim.key, anim, frame);
        }, this);

        this.on(Phaser.Animations.Events.ANIMATION_START, function (anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) {
            this.emit("animationstart_" + anim.key, anim, frame);
        }, this);
    }

    public destroy(fromScene?: boolean): void
    {
        if (this.healthBar)
        {
            this.healthBar.destroy(true);
            this.healthBar = null;
        }
        super.destroy(fromScene);
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    public init(texture?: string, attributeData?: AttributeData): void
    {
        this.initAttributes(attributeData);
        this.initAbilities();
        this.initStates();
        this.initHealthBar();
        
        if (texture)
        {
            this.initAnimations(texture);
        }

        this.body.setSize(this.width, this.height);
        // this.body.immovable = true;
    }

    protected initAttributes(attributeData?: AttributeData): void
    {
        if (attributeData)
        {
            this.walkSpeed = attributeData.walkSpeed;
        }
    }

    protected initAbilities(): void
    {

    }

    protected initStates(): void
    {
        this.isWalking = false;
    }

    protected initAnimations(texture: string): void
    {
        this.setTexture(texture);
    }

    protected initHealthBar(): void
    {
        const healthBarWidth = this.width;
        const healthBarHeight = 4;

        this.healthBar = new GZ_Bar(this.scene, {
            width: healthBarWidth,
            height: healthBarHeight,
            radius: 2,
            value: this.getHealth() / this.getMaxHealth(),
            color: 0xFF0000
        });
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    public update(): void
    {
        super.update();

        this.updateAnimations();
        this.updateControls();
    }

    /** Update the anims of this Character */
    protected updateAnimations(): void
    {
    }

    /** Define the way to control this Character */
    protected updateControls(): void
    { 
    }

    public postUpdate(): void
    {
        this.healthBar.setX(this.x - this.healthBar.width * 0.5);
        this.healthBar.setY(this.y - this.height * 0.5 - this.healthBar.height - 6);
    }

    // Attributes
    ////////////////////////////////////////////////////////////////////////

    public canMove(): boolean
    {
        return this.isAlive();
    }

    public isAlive(): boolean
    {
        return this.health > 0;
    }

    public getHealth(): number
    {
        return this.health;
    }

    public setHealth(health: number): void
    {
        this.health = Math.max(0, health);
        this.healthBar.setValue(health / this.getMaxHealth());

        if (health <= 0)
        {
            this.die();
        }
    }

    public getMaxHealth(): number
    {
        return this.maxHealth;
    }

    protected die(): void
    {
        this.health = 0;
        this.stopWalking();
        this.disableBody(true, false);
        this.healthBar.setVisible(false);
        this.emit("DIE");
    }

    public onDie(fn: Function, context?: any): void
    {
        this.on("DIE", fn, context);
    }

    public hit(targetCharacter: Character, damage: number)
    {
        targetCharacter.setHealth(targetCharacter.health - damage);
    }


    // Walk
    ////////////////////////////////////////////////////////////////////////

    protected startWalking(): void
    {
        this.isWalking = true;
    }

    public stopWalking(): void
    {
        if (this.isWalking)
        {
            this.setVelocity(0);
            this.isWalking = false;
        }
    }

    public stopWalkingX(): void
    {
        if ((this.body as Phaser.Physics.Arcade.Body).velocity.x != 0)
        {
            this.setVelocityX(0);
            this.isWalking = ((this.body as Phaser.Physics.Arcade.Body).velocity.y != 0);
        }
    }

    public stopWalkingY(): void
    {
        if ((this.body as Phaser.Physics.Arcade.Body).velocity.y != 0)
        {
            this.setVelocityY(0);
            this.isWalking = ((this.body as Phaser.Physics.Arcade.Body).velocity.x != 0);
        }
    }

    public walkUp(): void
    {
        this.lookUp();

        const currentWalkSpeedX = (this.body as Phaser.Physics.Arcade.Body).velocity.x;
        this.walk(currentWalkSpeedX, -this.walkSpeed);
    }

    public walkDown(): void
    {
        this.lookDown();

        const currentWalkSpeedX = (this.body as Phaser.Physics.Arcade.Body).velocity.x;
        this.walk(currentWalkSpeedX, this.walkSpeed);
    }

    public walkOnLeft(): void
    {
        this.lookOnLeft();

        const currentWalkSpeedY = (this.body as Phaser.Physics.Arcade.Body).velocity.y;
        this.walk(-this.walkSpeed, currentWalkSpeedY);
    }

    public walkOnRight(): void
    {
        this.lookOnRight();

        const currentWalkSpeedY = (this.body as Phaser.Physics.Arcade.Body).velocity.y;
        this.walk(this.walkSpeed, currentWalkSpeedY);
    }

    public walk(x: number, y: number): void
    {
        if (this.canMove())
        {
            if (!this.isWalking)
            {
                this.startWalking();
            }

            this.setVelocity(x,y);
        }
    }

    // Look direction
    ////////////////////////////////////////////////////////////////////////

    public lookUp(): void
    {
        this.isLookingUp = true;
    }

    public lookDown(): void
    {
        this.isLookingUp = false;
    }
    
    public lookOnRight(): void
    {
        this.isLookingRight = true;
    }

    public lookOnLeft(): void
    {
        this.isLookingRight = false;
    }
}