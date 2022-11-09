import { Bullet } from "phaser3-weapon-plugin";
import { Character } from "src/Characters/Character";

export class GZ_Bullet extends Bullet
{
    /** Damage of the bullet when it hits an enemy */
    public damage: number = 0;

    /** THe character who fired this bullet */
    public owner: Character = null;

    constructor(scene: Phaser.Scene, x: number, y: number, key: string, frame: string | number)
    {
        super(scene, x, y, key, frame);
    }
}