import { GZ_Object } from "./GZ_Object";
import { CST } from "../CST";
import { Player } from "../Characters/Player";

export class DropWeapon extends GZ_Object
{
    protected rarity: string = CST.GAME.WEAPONS.RARITY.COMMON;

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        const rarity = Object.keys(CST.GAME.WEAPONS.RARITY)[Phaser.Math.Between(0, Object.keys(CST.GAME.WEAPONS.RARITY).length - 1)];

        super(scene, x, y, "weapons", "starting_pistol_" + rarity + ".png");

        this.rarity = rarity;
        this.interactOnCollision = false;
    }

    protected postInialized(): void
    {
        super.postInialized();
        this.hintTextObject.setText(this.rarity);
    }

    public interact(player?: Player) : void
    {
        super.interact(player);

        player.equipWeapon(this.rarity);
        this.destroy();
    }
}