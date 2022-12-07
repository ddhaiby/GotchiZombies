import { NpcBase } from "../Characters/NPCs/NpcBase";
import { NpcSpawner } from "../Characters/NPCs/NpcSpawner";

export class WaveManager extends Phaser.GameObjects.GameObject
{
    protected _spawners: NpcSpawner[] = [];

    /** The current wave players are facing */
    protected _currentWave: number = 0;

    /** Total number of waves - Set value to 0 or lower for infinite waves */
    protected _waveCount: number = -1;

    /** Number of spawnable npcs for one wave */
    protected _npcCount: number = 4;

    /** The current number of spawned npcs in the game */
    protected _aliveSpawnedNpcCount: number = 0;

    /** The number of spawned npcs since the beginning of the game */
    protected _spawnedNpcCount: number = 0;

    /** Base cooldown to spawn a npx */
    protected _spawnCooldown: number = 4000;

    protected _currentWaveSettings: any;

    constructor(scene: Phaser.Scene, spawners: NpcSpawner[], currentLevel: number)
    {
        super(scene, "WaveManager");
        this.addSpawners(spawners);

        const gameSettings = this.scene.cache.json.get("gameSettings");
        this._currentWaveSettings = gameSettings[Math.min(currentLevel - 1, gameSettings.length)];

        this._waveCount = this._currentWaveSettings.waveCount;
        this._npcCount = this._currentWaveSettings.ennemyCountBase + this._currentWaveSettings.ennemyCountIncreasePerWaveBase * this._currentWave;
    }

    public addSpawners(newSpawners: NpcSpawner[])
    {
        for (const spawner of newSpawners)
        {
            this._spawners.push(spawner);
            spawner.on("NPC_DIED", (npc: NpcBase) => { this.onNpcDie(spawner, npc); }, this);
        }
    }

    public get currentWave(): number
    {
        return this._currentWave;
    }

    public startNewWave(currentLevel: number): void
    {
        ++this._currentWave;

        this._aliveSpawnedNpcCount = 0;
        this._spawnedNpcCount = 0;

        const gameSettings = this.scene.cache.json.get("gameSettings");
        this._currentWaveSettings = gameSettings[Math.min(currentLevel - 1, gameSettings.length)];
        this._npcCount = this._currentWaveSettings.ennemyCountBase + this._currentWaveSettings.ennemyCountIncreasePerWaveBase * (this._currentWave - 1);
        this._spawnCooldown = Math.max(this._currentWaveSettings.ennemySpawnCooldownMin, (this._currentWaveSettings.ennemySpawnCooldownBase + this._currentWaveSettings.ennemySpawnCooldownIncreasePerWave * (this._currentWave - 1))) * 1000;

        for (const spawner of this._spawners)
        {
            this.waitAndSpawnNpc(spawner);
        }
    }

    protected onNpcDie(spawner: NpcSpawner, npc: NpcBase): void
    {
        --this._aliveSpawnedNpcCount;

        if (this.isWaveCompleted())
        {
            this.onWaveCompleted();
        }
    }

    protected canSpawnNpc(): boolean
    {
        return this._spawnedNpcCount < this._npcCount;
    }

    protected isWaveCompleted(): boolean
    {
        return !this.canSpawnNpc() && this._aliveSpawnedNpcCount <= 0;
    }

    protected waitAndSpawnNpc(spawner: NpcSpawner): void
    {
        ++this._aliveSpawnedNpcCount;
        ++this._spawnedNpcCount;

        this.scene.time.delayedCall(this._spawnCooldown + Math.random() * 400, this.spawnNpc, [spawner, this._currentWave - 1], this);
    }

    protected spawnNpc(spawner: NpcSpawner, npcLevel: number = 0): void
    {
        spawner.spawnNpc(npcLevel);

        if (this.canSpawnNpc())
        {
            this.waitAndSpawnNpc(spawner);
        }
    }

    protected onWaveCompleted(): void
    {
        const allWavesCompleted = (this._waveCount > 0) && (this._currentWave >= this._waveCount);
        this.emit("WAVE_COMPLETED", allWavesCompleted);
    }
}