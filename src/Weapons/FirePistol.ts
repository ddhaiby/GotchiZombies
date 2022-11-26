import { GZ_FireWeapon } from "./GZ_FireWeapon";

export class FirePistol extends GZ_FireWeapon
{
    constructor(scene: Phaser.Scene, x: number, y: number, rarity: string)
    {
        super(scene, x, y, "Pistol", rarity);
    }
}