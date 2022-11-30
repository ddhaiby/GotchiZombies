import { Character } from "../Characters/Character";

export class GZ_Object extends Phaser.Physics.Arcade.Image
{
    public interactOnCollision: boolean = true;

    protected hintTextObject: Phaser.GameObjects.Text;
    protected hintOffset: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number, hintText: string = "Press E to interact")
    {
        super(scene, x, y, texture, frame);

        this.scene.time.delayedCall(1, () => {
            this.hintTextObject = scene.add.text(this.x - this.displayWidth + this.hintOffset.x, this.y - this.displayHeight + this.hintOffset.y, hintText);
            this.hintTextObject.setVisible(false);
        }, null, this);
    }

    public interact(character?: Character) : void
    {   
    }

    public showHint(): void
    {
        this.hintTextObject.setVisible(true);
    }

    public hideHint(): void
    {
        this.hintTextObject.setVisible(false);
    }
}