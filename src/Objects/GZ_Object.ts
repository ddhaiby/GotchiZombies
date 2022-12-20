import { Player } from "../Characters/Player";

export class GZ_Object extends Phaser.Physics.Arcade.Image
{
    public interactOnCollision: boolean = true;

    protected hintTextObject: Phaser.GameObjects.Text;
    protected hintOffset: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number, hintText: string = "Press E to interact")
    {
        super(scene, x, y, texture, frame);

        this.scene.physics.add.existing(this);

        this.scene.time.delayedCall(1, () => {
            this.hintTextObject = scene.add.text(this.x + this.hintOffset.x, this.y - this.displayHeight + this.hintOffset.y, hintText);
            this.hintTextObject.setOrigin(0.5);
            this.hintTextObject.setVisible(false);
            this.postInialized();
        }, null, this);
    }

    protected postInialized(): void
    {

    }

    public destroy(fromScene?: boolean): void
    {
        this.hintTextObject.destroy();
        super.destroy(fromScene);
    }

    public interact(player?: Player) : void
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

    public setHint(hint: string): void
    {
        this.hintTextObject.setText(hint);
        this.hintTextObject.setX(this.x + this.hintOffset.x);
    }
}