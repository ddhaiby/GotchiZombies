import { NpcBase } from "../Characters/NPCs/NpcBase";
import { NpcSpawner } from "../Characters/NPCs/NpcSpawner";

export class WaveManager extends Phaser.GameObjects.GameObject
{
    protected spawners: NpcSpawner[] = [];

    /** The current wave players are facing */
    protected _currentWave: number = 0;

    /** Total number of waves - Set value to 0 or lower for infinite waves */
    protected _waveCount: number = -1;

    /** Number of spawnable npcs for one wave */
    protected npcCount: number = 4;

    /** The current number of spawned npcs in the game */
    protected aliveSpawnedNpcCount: number = 0;

    /** The number of spawned npcs since the beginning of the game */
    protected spawnedNpcCount: number = 0;

    constructor(scene: Phaser.Scene, spawners: NpcSpawner[], currentLevel: number)
    {
        super(scene, "WaveManager");
        this.addSpawners(spawners);

        const waveSettings = this.scene.cache.json.get("waveSettings");
        this._waveCount = waveSettings[Math.min(currentLevel - 1, waveSettings.length)].waveCount;
    }

    public addSpawners(newSpawners: NpcSpawner[])
    {
        for (const spawner of newSpawners)
        {
            this.spawners.push(spawner);
            spawner.on("NPC_DIED", (npc: NpcBase) => { this.onNpcDie(spawner, npc); }, this);
        }
    }

    public get currentWave(): number
    {
        return this._currentWave;
    }

    public startNewWave(): void
    {
        ++this._currentWave;
        this.aliveSpawnedNpcCount = 0;
        this.spawnedNpcCount = 0;

        for (const spawner of this.spawners)
        {
            this.spawnNpc(spawner);
        }
    }

    protected onNpcDie(spawner: NpcSpawner, npc: NpcBase): void
    {
        --this.aliveSpawnedNpcCount;

        if (this.canSpawnNpc())
        {
            this.spawnNpc(spawner);
        }
        else if (this.isWaveCompleted())
        {
            this.onWaveCompleted();
        }
    }

    protected canSpawnNpc(): boolean
    {
        return this.spawnedNpcCount < this.npcCount;
    }

    protected isWaveCompleted(): boolean
    {
        return !this.canSpawnNpc() && this.aliveSpawnedNpcCount <= 0;
    }

    protected spawnNpc(spawner: NpcSpawner): void
    {
        ++this.aliveSpawnedNpcCount;
        ++this.spawnedNpcCount;

        const spawnCooldown = Math.random() * 1900 + 100;
        this.scene.time.delayedCall(spawnCooldown, spawner.spawnNpc, null, spawner);
    }

    protected onWaveCompleted(): void
    {
        const allWavesCompleted = (this._waveCount > 0) && (this._currentWave >= this._waveCount);
        this.emit("WAVE_COMPLETED", allWavesCompleted);
    }
}