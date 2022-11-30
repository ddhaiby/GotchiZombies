import { GZ_Object } from "./GZ_Object";
import { Character } from "../Characters/Character";

export class MysteryBox extends GZ_Object
{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number)
    {
       super(scene, x, y, texture, frame);
       this.interactOnCollision = false;
    }

    public interact(character?: Character) : void
    {
        super.interact(character);

        console.log("MysteryBox");
    }
}