import { GZ_Object } from "./GZ_Object";
import { CST } from "../CST";
import { Player } from "../Characters/Player";

class PickableWeapon extends Phaser.GameObjects.Image
{
    public rarity: string = CST.GAME.WEAPONS.RARITY.COMMON;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number)
    {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
    }
}

export class MysteryBox extends GZ_Object
{
    protected isGeneratingWeapon: boolean = false;
    protected isCooldown: boolean = false;
    protected cooldown: number = 2; // in seconds
    protected pickableWeapon: PickableWeapon;
    protected generatedWeaponLifeTime: number = 3; // in seconds
    protected hintTextGenerateWeapon: string = "Press E";

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number)
    {
        super(scene, x, y, texture, frame);
        this.interactOnCollision = false;
    }

    protected postInialized(): void
    {
        super.postInialized();
        this.setHint(this.hintTextGenerateWeapon);
        this.pickableWeapon = new PickableWeapon(this.scene, this.x, this.y - 25, "").setVisible(false);
    }
    
    public interact(player: Player) : void
    {
        super.interact(player);

        if (this.isCooldown|| this.isGeneratingWeapon || !player)
        {
            return;
        }
        else if (this.pickableWeapon.visible)
        {
            this.equipWeaponTo(player);
        }
        else
        {
            this.startGeneratingWeapon();
        }
    }

    protected equipWeaponTo(player: Player): void
    {
        player.equipWeapon(this.pickableWeapon.rarity);
        this.pickableWeapon.setVisible(false);
        
        this.startCooldown();
    }

    protected startGeneratingWeapon(): void
    {
        this.isGeneratingWeapon = true;
        this.setTexture("mysteryBoxOpened");
        this.setHint("");

        this.pickableWeapon.setVisible(true);
        this.animatePickableWeapon();
    }

    protected endGeneratingWeapon(): void
    {
        this.scene.time.delayedCall(this.generatedWeaponLifeTime * 1000, () => {
            if (this.pickableWeapon.visible)
            {
                this.pickableWeapon.setVisible(false);
                this.startCooldown();
            } 
        }, null, this);

        this.isGeneratingWeapon = false;
    }

    protected animatePickableWeapon(i: number = 0): void
    {
        const rarity = Object.keys(CST.GAME.WEAPONS.RARITY)[Phaser.Math.Between(0, Object.keys(CST.GAME.WEAPONS.RARITY).length - 1)];
        this.pickableWeapon.setTexture("weapons", "starting_pistol_" + rarity + ".png");

        if (i < 10)
        {
            this.scene.time.delayedCall(250, () => { this.animatePickableWeapon(i + 1); }, null, this);
        }
        else
        {
            this.pickableWeapon.rarity = rarity;
            this.endGeneratingWeapon();   
        }
    }

    protected startCooldown(): void
    {
        if (!this.isCooldown)
        {
            this.isCooldown = true;
            this.setTexture("mysteryBoxCooldown");
            this.setHint("");
            this.scene.time.delayedCall(this.cooldown * 1000, this.endCooldown, null, this);
        }
    }

    protected endCooldown(): void
    {
        if (this.isCooldown)
        {
            this.isCooldown = false;
            this.setTexture("mysteryBoxClosed");
            this.setHint(this.hintTextGenerateWeapon);
        }
    }
}