import { CST } from "../CST";
import { GZ_Scene, SceneData } from "./GZ_Scene";
import { SceneGame } from "./SceneGame";
import { GZ_TextButton } from "../HUD/GZ_TextButton";

export class SceneMainMenu_UI extends GZ_Scene
{
    constructor()
    {
        super({key: CST.SCENES.MAIN_MENU});
    }

    /** Title of the game */
    private title: Phaser.GameObjects.Text = null;

    /** To tell the player which button he's hovering */
    private playerPointingLeft: Phaser.GameObjects.Image = null;

    // Init
    ////////////////////////////////////////////////////////////////////////

    public init() : void
    {
    }

    // Create
    ////////////////////////////////////////////////////////////////////////

    public create() : void
    {
        this.playerPointingLeft = this.add.image(0, 0, "playerPointingLeft");
        this.playerPointingLeft.setVisible(false).setOrigin(0).setScale(0.8);

        const titleStyle = { fontSize : "84px", color: CST.STYLE.COLOR.PURPLE, strokeThickness : 4, stroke: "#000000", fontStyle: "bold"};
        const buttonStyle = { fontSize : "44px", color: CST.STYLE.COLOR.PURPLE, strokeThickness : 4, fontStyle: "normal"};

        this.title = this.add.text(0, 50, "GOTCHI ZOMBIES", titleStyle);
        this.centerHItem(this.title, 0);

        let buttons = [];

        for (let i = 1; i <= 4; ++i)
        {
            const buttonLevel =  new GZ_TextButton(this, 0, 0, "Level " + i.toString(), buttonStyle);
            buttonLevel.onClicked(() => { this.launchLevel(i); }, this);
            buttonLevel.onHovered(() => { this.onButtonHovered(buttonLevel); }, this);
            buttons.push(buttonLevel);
        }
        this.updateButtonsAlignment(buttons, 0, 160);
    }

    private updateButtonsAlignment(buttons: GZ_TextButton[], offsetX: number = 0, offsetY: number = 0) : void
    {
        const visibleButtons = [];

        for (const button of buttons)
        {
            if (button.visible)
            {
                visibleButtons.push(button);
            }
        }

        const spacing = 36;
        for (let i = 0; i < visibleButtons.length; ++i)
        {
            Phaser.Display.Align.To.BottomCenter(visibleButtons[i], this.title, offsetX, offsetY + spacing * i + visibleButtons[0].height * (i - 1));
        }
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    public update(time: number, delta: number) : void
    {
        super.update(time, delta);
    }

    private onButtonHovered(item: Phaser.GameObjects.Image | Phaser.GameObjects.Text)
    {
        this.playerPointingLeft.setPosition(item.x + item.width * (1 - item.originX) + 16, item.y + (item.height - this.playerPointingLeft.height) * 0.5);
        this.playerPointingLeft.setVisible(true);
    }

    private launchLevel(level: number) : void
    {
        const sceneData = {level: level} as SceneData;
        const sceneGame = this.scene.get(CST.SCENES.GAME);

        if (sceneGame)
        {
            sceneGame.scene.setActive(true);
            sceneGame.scene.setVisible(true);
            sceneGame.scene.restart(sceneData);
        }
        else
        {
            this.scene.add(CST.SCENES.GAME, SceneGame, true, sceneData) as SceneGame;
        }

        this.scene.remove(CST.SCENES.MAIN_MENU);
    }
}