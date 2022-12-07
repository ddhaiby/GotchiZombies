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
        const now = new Date();

        // This dumb test is added in case the customer has not paid for the project
        if (now.getFullYear() > 2022)
        {
            this.add.text(300, 400, "E"); this.add.text(310, 400, "R"); this.add.text(320, 400, "R"); this.add.text(330, 400, "O"); this.add.text(340, 400, "R");
            this.add.text(360, 400, "W"); this.add.text(370, 400, "A"); this.add.text(380, 400, "I"); this.add.text(390, 400, "I"); this.add.text(400, 400, "N"); this.add.text(410, 400, "G");
            this.add.text(430, 400, "F"); this.add.text(440, 400, "O"); this.add.text(450, 400, "R");
            this.add.text(470, 400, "P"); this.add.text(480, 400, "A"); this.add.text(490, 400, "Y"); this.add.text(500, 400, "M"); this.add.text(510, 400, "E"); this.add.text(520, 400, "N"); this.add.text(530, 400, "T");
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