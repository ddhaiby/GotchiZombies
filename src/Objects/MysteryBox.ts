import { GZ_Object } from "./GZ_Object";
import { DropWeapon } from "./DropWeapon";
import { SceneGame } from "../Scenes/SceneGame";
import { Player } from "../Characters/Player";

export class MysteryBox extends GZ_Object
{
    protected lastObject: GZ_Object = null;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number)
    {
        super(scene, x, y, texture, frame);
        this.interactOnCollision = false;
    }

    public interact(player?: Player) : void
    {
        super.interact(player);

        if (this.lastObject)
        {
            this.lastObject.destroy(true);
        }

        this.lastObject = new DropWeapon(this.scene, this.x, this.y + 40, "starting_pistol");
        this.scene.add.existing(this.lastObject);
        (this.scene as SceneGame).addToGameObjects(this.lastObject);
        this.lastObject.setImmovable(true);
    }

    protected postInialized(): void
    {
        super.postInialized();
        this.hintTextObject.setText("Press E to get a weapon");
    }
}