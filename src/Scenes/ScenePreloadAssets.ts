import { CST } from "../CST";
import { SceneGame } from "./SceneGame";

export class ScenePreloadAssets extends Phaser.Scene
{
    constructor()
    {
        super({key: CST.SCENES.PRELOAD_ASSETS});
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    public init() : void
    {
    }

    // Preload
    ////////////////////////////////////////////////////////////////////////

    public preload() : void
    {
        this.loadMap();
        this.loadCharacters();

        this.load.setPath("./assets/");
        this.load.image("bullet", "bullet.png");
    }

    private loadMap() : void
    {
        this.load.setPath("./assets/");

        this.load.image("floor", "floor.png");
    }

    private loadCharacters() : void
    {
        this.load.setPath("./assets/Characters");
        this.load.atlas("player", "Player/player.png", "Player/player.json");
        this.load.atlas("zombie", "Enemies/Zombie/zombie.png", "Enemies/Zombie/zombie.json");
    }

    // Create
    ////////////////////////////////////////////////////////////////////////
  
    public create() : void
    {
        this.createSceneGame();
    }

    private createSceneGame(): void
    {
        this.scene.add(CST.SCENES.GAME, SceneGame, true, null);
        this.scene.remove(CST.SCENES.PRELOAD_ASSETS);
    }
}