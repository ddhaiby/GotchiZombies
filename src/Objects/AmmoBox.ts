import { GZ_Object } from "./GZ_Object";
import { Player } from "../Characters/Player";

export class AmmoBox extends GZ_Object
{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number)
    {
        super(scene, x, y, texture, frame);
        this.interactOnCollision = true;
    }

    public interact(player?: Player) : void
    {
        super.interact(player);

        this.disableBody(true, true);

        console.log("AmmoBox");
    }
}