import { CST } from "../CST";
import { SceneGame } from "./SceneGame";
import { SceneMainMenu_UI } from "./SceneMainMenu_UI";

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
        this.loadWeapons();
        this.loadUIAssets();

        this.load.setPath("./assets/");
    }

    private loadMap() : void
    {
        this.load.setPath("./assets/maps");

        this.load.image("floor", "floor.png");
        this.load.image("ammoBox", "ammoBox.png");
        this.load.image("mysteryBox", "mysteryBox.png");
        this.load.json("gameSettings", "gameSettings.json");
    }

    private loadCharacters() : void
    {
        this.load.setPath("./assets/Characters");
        this.load.atlas("player", "Player/player.png", "Player/player.json");
        this.load.atlas("zombie", "Enemies/Zombie/zombie.png", "Enemies/Zombie/zombie.json");
    }

    private loadWeapons() : void
    {
        this.load.setPath("./assets/Weapons");
        this.load.atlas("bullets", "bullets.png", "bullets.json");
        this.load.json("weaponSettings", "weaponSettings.json");
        this.load.image("starting_pistol", "starting_pistol.png")
    }

    private loadUIAssets() : void
    {
        this.load.setPath("./assets/UI");
        this.load.image("playerPointingLeft", "playerPointingLeft.png");
    }

    // Create
    ////////////////////////////////////////////////////////////////////////
  
    public create() : void
    {
        this.createSceneGame();
    }

    private createSceneGame(): void
    {
        this.scene.add(CST.SCENES.MAIN_MENU, SceneMainMenu_UI, true, null);
        this.scene.remove(CST.SCENES.PRELOAD_ASSETS);
    }
}