import { NpcBase } from "./NpcBase";

export class NpcSpawner
{
    /** The scene to create the NPCs */
    protected scene: Phaser.Scene;

    /** The type of npc to spawn */
    protected npcClass: typeof NpcBase;

    /** The position to spawn the npcs */
    protected spawnPosition: Phaser.Math.Vector2;

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        this.scene = scene;
        this.spawnPosition = new Phaser.Math.Vector2(x, y);
    }

    public spawnNpc(): NpcBase
    {
        const npc = new NpcBase(this.scene, this.spawnPosition.x, this.spawnPosition.y);
        npc.init("zombie");
        return npc;
    }
}