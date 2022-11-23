import { Character } from "../Characters/Character";

export class GZ_Weapon extends Phaser.GameObjects.Sprite
{
    /** The damage per attack */
    public damage: number = 0;

    public damageBonus: number = 0;

    /** The character that owns this weapon */
    protected owner: Character = null;

    constructor(scene: Phaser.Scene, x: number, y: number, texture?: string | Phaser.Textures.Texture, frame?: string | number)
    {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
    }

    public setOwner(owner: Character): void
    {
        this.owner = owner;
    }

    public getCurrentDamage(): number
    {
        return this.damage + this.damageBonus;
    }
}