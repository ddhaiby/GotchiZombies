import { CST } from "../../CST";
import { Character } from "../Character";

export class NpcBase extends Character
{
    /** The tager to attack - usually one of the player */
    target: Character = null;

    /** Threshold distance when following the target. So an AI doesn't need to be at the exact same pixel as the player. */
    thresholdFollowTarget: number = 2;

    constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string)
    {
        super(scene, x, y);
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    protected initAnimations(texture: string): void
    {
        super.initAnimations(texture);
    }

     // Update
    ////////////////////////////////////////////////////////////////////////

    /** Update the anims of this Character */
    protected updateAnimations(): void
    {
    }

    protected updateControls(): void
    {
        super.updateControls();

        if (this.target && this.target.isAlive())
        {
            if (this.x > this.target.x + this.thresholdFollowTarget)
            {
                this.walkOnLeft();
            }
            else if (this.x < this.target.x - this.thresholdFollowTarget)
            {
                this.walkOnRight();
            }
            else
            {
                this.stopWalkingX();
            }

            if (this.y > this.target.y + this.thresholdFollowTarget)
            {
                this.walkUp();
            }
            else if (this.y < this.target.y - this.thresholdFollowTarget)
            {
                this.walkDown();
            }
            else
            {
                this.stopWalkingY();
            }
        }
        else
        {
            this.stopWalking();
        }
    }

    public startFollowingTarget(target: Character): void
    {
        this.target = target;
    }

    public stopFollowingTarget(target: Character): void
    {
        this.target = null;
    }

    public die(): void
    {
        super.die();
        this.target = null;

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1500,
            onComplete: this.destroy,
            onCompleteScope: this
        });
    }
}