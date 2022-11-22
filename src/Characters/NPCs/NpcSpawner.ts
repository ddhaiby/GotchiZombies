import { AttributeData } from "../Character";
import { NpcBase } from "./NpcBase";

export class NpcSpawner extends Phaser.GameObjects.Zone
{
    /** The type of npc to spawn */
    protected npcClass: typeof NpcBase;

    // Spawn attributes
    /** The current number of spawned npcs in the game */
    protected _aliveSpawnedNpcCount: number = 0;

    /** The number of spawned npcs since the beginning of the game */
    protected _spawnedNpcCount: number = 0;

    // Npc attributes
    /** Walk speed of the npc */
    protected walkSpeed: number = 200;

    /** Max hp of the npc  */
    protected maxHealth: number = 100;

    /** Current damage of the npc  */
    protected damage: number = 25;

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y);
    }

    /** Whether the spawner can spawn a npc */
    public canSpawnNpc(): boolean
    {
        return true;
    }

    /** Spawn a new npc if possible */
    public spawnNpc(): void
    {
        if (this.canSpawnNpc())
        {
            const npc = new NpcBase(this.scene, this.x, this.y);
            npc.init("zombie", { maxHealth: this.maxHealth, damage: this.damage, walkSpeed: this.walkSpeed } as AttributeData);
            npc.onDie(() => {
                this.onNpcDie(npc);
            }, this);

            this.emit("NPC_SPAWNED", npc);

            ++this._aliveSpawnedNpcCount;
            ++this._spawnedNpcCount;
        }
    }

    public get aliveSpawnedNpcCount(): number
    {
        return this._aliveSpawnedNpcCount;
    }

    /** Triggered function when an npc dies */
    protected onNpcDie(npc: NpcBase): void
    {
        --this._aliveSpawnedNpcCount;
        this.emit("NPC_DIED", npc);
    }

    private setTexture() {}
    private setFlip() {}
}