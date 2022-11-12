import { AttributeData } from "../Character";
import { NpcBase } from "./NpcBase";

export class NpcSpawner extends Phaser.GameObjects.Zone
{
    /** The type of npc to spawn */
    protected npcClass: typeof NpcBase;

    // Spawn attributes
    /** The current number of spawned npcs in the game */
    protected spawnedNpcAliveCount: number = 0;

    /** The max number of npcs that can be in the game together */
    protected maxSpawnableNpcInGameCount: number = 1;

    /** The number of spawned npcs since the beginning of the game */
    protected spawnedNpcCount: number = 0;

    /** The max number of npcs that can be spawned with this spawner */
    protected maxSpawnableNpcCount: number = 2;

    /** Cooldown (in second) to spawn a new npc */
    protected spawnCooldown: number = 1;

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

            ++this.spawnedNpcAliveCount;
            ++this.spawnedNpcCount;
        }
    }

    /** Whether the spawner can spawn a npc */
    public canSpawnNpc(): boolean
    {
        return (this.spawnedNpcCount < this.maxSpawnableNpcCount) && (this.spawnedNpcAliveCount < this.maxSpawnableNpcInGameCount);
    }

    public init(): void
    {
        this.scene.time.delayedCall(this.spawnCooldown * 1000, this.spawnNpc, null, this);
    }

    protected onNpcDie(npc: NpcBase): void
    {
        --this.spawnedNpcAliveCount;
        this.scene.time.delayedCall(this.spawnCooldown * 1000, this.spawnNpc, null, this);
    }

    private setTexture() {}
    private setFlip() {}
}