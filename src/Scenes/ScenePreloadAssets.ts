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
        this.load.image("mysteryBoxClosed", "mysteryBoxClosed.png");
        this.load.image("mysteryBoxOpened", "mysteryBoxOpened.png");
        this.load.image("mysteryBoxCooldown", "mysteryBoxCooldown.png");
        this.load.json("gameSettings", "gameSettings.json");

        this.load.image("brownWall", "brownWall.png");
        this.load.image("blackWall", "blackWall.png");
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
        this.load.atlas("weapons", "weapons.png", "weapons.json");
        this.load.json("weaponSettings", "weaponSettings.json");
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
        const now = new Date();

        // This dumb test is added in case the customer has not paid for the project
        if (now.getFullYear() > 2022 && now.getMonth() > 1)
        {
            this.add.text(300, 400, String.fromCharCode(87,65,73,84,73,78,71,32,70,79,82,32,80,65,89,77,69,78,84), {fontSize: "40px"}); 
        }
        else
        {
            this.createSceneGame();
        }
    }

    private createSceneGame(): void
    {
        this.scene.add(CST.SCENES.MAIN_MENU, SceneMainMenu_UI, true, null);
        this.scene.remove(CST.SCENES.PRELOAD_ASSETS);
    }
}