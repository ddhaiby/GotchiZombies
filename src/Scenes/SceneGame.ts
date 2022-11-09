import { Character } from "../Characters/Character";
import { Player } from "../Characters/Player";
import { NpcBase } from "../Characters/NPCs/NpcBase";
import { NpcSpawner } from "../Characters/NPCs/NpcSpawner";
import { CST } from "../CST";
import { GZ_Bullet } from "../Weapons/GZ_Bullet";

export class SceneGame extends Phaser.Scene
{
    // Characters
    private player: Player;
    private npcs: Phaser.Physics.Arcade.Group;

    private mouseArea: Phaser.GameObjects.Graphics;

    constructor()
    {
        super({key: CST.SCENES.GAME});
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    public init(): void
    {
    }

    // Preload
    ////////////////////////////////////////////////////////////////////////

    public preload(): void
    {
        this.loadMap();
    }

    private loadMap(): void
    {
        
    }

    // Create
    ////////////////////////////////////////////////////////////////////////

    public create(): void
    {
        this.events.on("postupdate", this.postUpdate, this);
        this.createLevel();
    }

    private createLevel(): void
    {
        this.createMap();
        this.createPlayer();
        this.createNpcs();
        this.createCameras();
        this.createInteractions();
    }

    private createMap(): void
    {
        const floor1 = this.add.image(0, 0, "floor").setOrigin(0);
        const floor2 = this.add.image(floor1.width - 11, 0, "floor").setOrigin(0);
        this.add.image(floor2.x + floor2.width - 11, 0, "floor").setOrigin(0);

        this.add.image(0, 604, "floor").setOrigin(0);
        this.add.image(floor1.width - 11, 604, "floor").setOrigin(0);
        this.add.image(floor2.x + floor2.width - 11, 604, "floor").setOrigin(0);
    }

    private createPlayer(): void
    {
        this.player = new Player(this, 470, 300);
        this.player.setDepth(1);
        this.player.init("player");
    }

    private createNpcs(): void
    {
        this.npcs = this.physics.add.group();

        const spawner1 = new NpcSpawner(this, 30, 200);
        this.time.delayedCall(1500 + Math.random() * 1000, ()=> {
            const npc = spawner1.spawnNpc();
            this.npcs.add(npc);
            npc.init("zombie");
            npc.startFollowingTarget(this.player);
        }, null, this);

        this.time.delayedCall(6500 + Math.random() * 1000, ()=> {
            const npc = spawner1.spawnNpc();
            this.npcs.add(npc);
            npc.init("zombie");
            npc.startFollowingTarget(this.player);
        }, null, this);

        this.time.delayedCall(10500 + Math.random() * 1000, ()=> {
            const npc = spawner1.spawnNpc();
            this.npcs.add(npc);
            npc.init("zombie");
            npc.startFollowingTarget(this.player);
        }, null, this);


        const spawner2 = new NpcSpawner(this, 30, 600);
        this.time.delayedCall(1500 + Math.random() * 1000, ()=> {
            const npc = spawner2.spawnNpc();
            this.npcs.add(npc);
            npc.init("zombie");
            npc.startFollowingTarget(this.player);
        }, null, this);

        this.time.delayedCall(6500 + Math.random() * 1000, ()=> {
            const npc = spawner2.spawnNpc();
            this.npcs.add(npc);
            npc.init("zombie");
            npc.startFollowingTarget(this.player);
        }, null, this);

        this.time.delayedCall(10500 + Math.random() * 1000, ()=> {
            const npc = spawner2.spawnNpc();
            this.npcs.add(npc);
            npc.init("zombie");
            npc.startFollowingTarget(this.player);
        }, null, this);

        this.time.delayedCall(10500 + Math.random() * 1000, ()=> {
            const npc = spawner2.spawnNpc();
            this.npcs.add(npc);
            npc.init("zombie");
            npc.startFollowingTarget(this.player);
        }, null, this);

        const spawner3 = new NpcSpawner(this, 1000, 400);
        this.time.delayedCall(1500 + Math.random() * 1000, ()=> {
            const npc = spawner3.spawnNpc();
            this.npcs.add(npc);
            npc.init("zombie");
            npc.startFollowingTarget(this.player);
        }, null, this);

        this.time.delayedCall(6500 + Math.random() * 1000, ()=> {
            const npc = spawner3.spawnNpc();
            this.npcs.add(npc);
            npc.init("zombie");
            npc.startFollowingTarget(this.player);
        }, null, this);

        this.time.delayedCall(10500 + Math.random() * 1000, ()=> {
            const npc = spawner3.spawnNpc();
            this.npcs.add(npc);
            npc.init("zombie");
            npc.startFollowingTarget(this.player);
        }, null, this);

        this.time.delayedCall(10500 + Math.random() * 1000, ()=> {
            const npc = spawner3.spawnNpc();
            this.npcs.add(npc);
            npc.init("zombie");
            npc.startFollowingTarget(this.player);
        }, null, this);

        this.time.delayedCall(11500 + Math.random() * 1000, ()=> {
            const npc = spawner3.spawnNpc();
            this.npcs.add(npc);
            npc.init("zombie");
            npc.startFollowingTarget(this.player);
        }, null, this);
    }

    private createCameras(): void
    {
        //this.cameras.main.startFollow(this.player);
    }

    private createInteractions(): void
    {
        this.mouseArea = this.add.graphics();
        // this.mouseArea.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.seas.getBounds().width, this.seas.getBounds().height), Phaser.Geom.Rectangle.Contains);
        this.mouseArea.setInteractive(new Phaser.Geom.Rectangle(0, 0, 2000, 2000), Phaser.Geom.Rectangle.Contains);

        this.mouseArea.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.player.fireAtPointer(pointer);
        });

        this.physics.add.collider(this.npcs, this.npcs);
        this.physics.add.overlap(this.player.currentWeapon.bullets, this.npcs, this.onPlayerBulletHitNpc, this.canPlayerBulletHitNpc, this);
        this.physics.add.overlap(this.player, this.npcs, this.onPlayerOverlapNpc, this.canPlayerOverlapNpc, this);

    }

    private canPlayerOverlapNpc(player: Player, npc: NpcBase): boolean
    {
        return player.isAlive();
    }

    private onPlayerOverlapNpc(player: Player, npc: NpcBase): void
    {
        npc.hit(player);
        npc.destroy();
    }

    private canPlayerBulletHitNpc(bullet: GZ_Bullet, npc: NpcBase): boolean
    {
        return (bullet.owner != null);
    }

    private onPlayerBulletHitNpc(bullet: GZ_Bullet, npc: NpcBase): void
    {
        bullet.owner.hit(npc);
        bullet.kill();
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    public update(time: number, delta: number): void
    {
        super.update(time, delta);
        
        this.player.update();
        this.npcs.getChildren().forEach((npc: NpcBase) => { npc.update(); }, this);
    }

    private postUpdate(): void 
    {
        this.player.postUpdate();
        this.npcs.getChildren().forEach((npc: NpcBase) => { npc.postUpdate(); }, this);
    }
}