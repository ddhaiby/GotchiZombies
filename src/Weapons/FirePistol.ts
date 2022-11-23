import { GZ_FireWeapon } from "./GZ_FireWeapon";

export class FirePistol extends GZ_FireWeapon
{
    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, null, null, "bullets", "bulletPistol");
    }
}