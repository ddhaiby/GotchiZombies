import { Character } from "../Characters/Character";
import { Player } from "../Characters/Player";
import { NpcBase } from "../Characters/NPCs/NpcBase";
import { NpcSpawner } from "../Characters/NPCs/NpcSpawner";
import { CST } from "../CST";
import { GZ_Bullet } from "../Weapons/GZ_Bullet";
import { SceneData } from "./GZ_Scene";
import { SceneMainMenu_UI } from "./SceneMainMenu_UI";
import { Bullet } from "phaser3-weapon-plugin";

export class SceneGame extends Phaser.Scene
{
    // Characters
    private player: Player;
    private npcs: Phaser.Physics.Arcade.Group;

    // Map
    private currentMap: Phaser.Tilemaps.Tilemap;
    private ground: Phaser.Tilemaps.TilemapLayer;

    private mouseArea: Phaser.GameObjects.Graphics;

    // Level data
    private _currentLevel: number;

    constructor()
    {
        super({key: CST.SCENES.GAME});
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    public init(data?: SceneData): void
    {
        this._currentLevel = data && data.level ? data.level : 1;
    }

    // Preload
    ////////////////////////////////////////////////////////////////////////

    public preload(): void
    {
        this.loadMap();
    }

    private loadMap(): void
    {
        this.load.setPath("./assets/maps");
        this.load.image("cyber_plateforms_atlas", "./cyber_plateforms_atlas.png");

        const levelName = "Level" + this._currentLevel.toString();
        this.load.tilemapTiledJSON(levelName, "./levels" + "/" + levelName + ".json");
    }

    // Create
    ////////////////////////////////////////////////////////////////////////

    public create(): void
    {
        this.events.on("postupdate", this.postUpdate, this);

        this.createKeyboardMap();
        this.createLevel();
    }

    private createKeyboardMap(): this
    {
        
        const keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyESC.on("down", function () {
            this.time.clearPendingEvents();

            if (this.npcs)
            {
                this.npcs.clear(true, true);
                this.npcs = null;
            }

            if (this.player)
            {
                this.player.destroy(true);
                this.player = null;
            }

            this.scene.add(CST.SCENES.MAIN_MENU, SceneMainMenu_UI, true, null);
            this.scene.setVisible(false);
            this.scene.setActive(false);
        }, this);
        return this;
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
        const floor1 = this.add.image(0, 0, "floor").setOrigin(0).setScrollFactor(0);
        const floor2 = this.add.image(floor1.width - 11, 0, "floor").setOrigin(0).setScrollFactor(0);
        this.add.image(floor2.x + floor2.width - 11, 0, "floor").setOrigin(0).setScrollFactor(0);

        this.add.image(0, 604, "floor").setOrigin(0).setScrollFactor(0);
        this.add.image(floor1.width - 11, 604, "floor").setOrigin(0).setScrollFactor(0);
        this.add.image(floor2.x + floor2.width - 11, 604, "floor").setOrigin(0).setScrollFactor(0);

        if (this.currentMap)
        {
            this.currentMap.destroy();
            this.currentMap = null;
        }

        this.currentMap = this.add.tilemap("Level" + this._currentLevel.toString());

        const groundTilesetImage = this.currentMap.addTilesetImage("cyber_plateforms_atlas", "cyber_plateforms_atlas");
        this.ground = this.currentMap.createLayer("Ground", [groundTilesetImage], 0, 0);
        const groundBounds = this.ground.getBounds();
        this.physics.world.setBounds(0, 0, groundBounds.width, groundBounds.height);
    }

    private createPlayer(): void
    {
        // @ts-ignore - Problem with Phaser’s types. classType supports classes
        const playerSpawns = this.currentMap.createFromObjects("Characters", {name: "Player", classType: Player});
        this.player = playerSpawns[0] as Player;
        this.player.setDepth(1);
        this.player.init("player");
    }

    private createNpcs(): void
    {       
        this.npcs = this.physics.add.group();

        // @ts-ignore - Problem with Phaser’s types. classType supports classes
        const spawners = this.currentMap.createFromObjects("Characters", {name: "NpcSpawner", classType: NpcSpawner});

        spawners.map((spawner: NpcSpawner) => {
            spawner.on("NPC_SPAWNED", (npc: NpcBase) => {
                this.npcs.add(npc);
                npc.init("zombie");
                npc.startFollowingTarget(this.player);
            }, this);

            spawner.init();
        });
    }

    private createCameras(): void
    {
        this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
        this.cameras.main.zoomTo(CST.GAME.ZOOM, 0.0);
        this.cameras.main.startFollow(this.player);
    }

    private createInteractions(): void
    {
        this.mouseArea = this.add.graphics();
        // this.mouseArea.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.seas.getBounds().width, this.seas.getBounds().height), Phaser.Geom.Rectangle.Contains);
        this.mouseArea.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height), Phaser.Geom.Rectangle.Contains);

        this.mouseArea.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.player.fireAtPointer(pointer);
        });

        this.ground.setCollisionByProperty({collides: true});

        // @ts-ignore
        this.physics.add.collider(this.player, this.ground);
        // @ts-ignore
        this.physics.add.collider(this.player.currentWeapon.bullets, this.ground, this.onBulletHitGround, null, this);

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
        npc.die();
        npc.destroy(true);
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

    private onBulletHitGround(bullet: Bullet, platform: Phaser.Tilemaps.TilemapLayer | Phaser.GameObjects.Image): void
    {
        bullet.kill();
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    public update(time: number, delta: number): void
    {
        super.update(time, delta);
        
        if (this.player)
        {
            this.player.update();
        }
        
        if (this.npcs)
        {
            this.npcs.getChildren().forEach((npc: NpcBase) => { npc.update(); }, this);
        }
    }

    private postUpdate(): void 
    {
        if (this.player)
        {
            this.player.postUpdate();
        }
    
        if (this.npcs)
        {
            this.npcs.getChildren().forEach((npc: NpcBase) => { npc.postUpdate(); }, this);
        }
    }
}