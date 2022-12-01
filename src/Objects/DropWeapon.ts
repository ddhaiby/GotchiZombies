import { GZ_Object } from "./GZ_Object";
import { CST } from "../CST";
import { Player } from "../Characters/Player";

export class DropWeapon extends GZ_Object
{
    protected rarity: string = CST.GAME.WEAPONS.RARITY.COMMON;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number)
    {
        super(scene, x, y, texture, frame);
        this.interactOnCollision = false;
    }

    protected postInialized(): void
    {
        super.postInialized();

        const rarityIndex = Phaser.Math.Between(0, Object.keys(CST.GAME.WEAPONS.RARITY).length - 1);
        this.rarity = Object.keys(CST.GAME.WEAPONS.RARITY)[rarityIndex];
        this.hintTextObject.setText(this.rarity);
    }

    public interact(player?: Player) : void
    {
        super.interact(player);

        player.equipWeapon(this.rarity);
        this.destroy();
    }
}