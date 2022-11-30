import { Player } from "./Player";

export class InteractionComponent extends Phaser.GameObjects.Zone
{
    protected _owner: Player;

    constructor(scene: Phaser.Scene, owner: Player, x: number, y: number, width?: number, height?: number)
    {
        super(scene, x, y, width, height);

        this._owner = owner;
    }

    public get owner(): Player
    {
        return this._owner;
    }
}