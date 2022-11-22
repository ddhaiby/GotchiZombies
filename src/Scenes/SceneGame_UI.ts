import { GZ_Graphics } from "../HUD/GZ_Graphics";
import {CST} from "../CST";
import { GZ_Scene } from "./GZ_Scene";
import { SceneGame } from "./SceneGame";

export class SceneGame_UI extends GZ_Scene
{
    private sceneGame: SceneGame = null;

    private elapsedTime: number = 0;

    // UI Items
    private background: GZ_Graphics;

    // private chronoText: Phaser.GameObjects.Text;

    /** Text to display the current wave */
    private waveText: Phaser.GameObjects.Text;

    /** Text to display when a wave is completed */
    private waveCompletedText: Phaser.GameObjects.Text;
    
    /** The text to display the counter before the next wave */
    private chronoNextWaveText: Phaser.GameObjects.Text;
    private durationNextWave: number = 3;

    constructor()
    {
        super({key: CST.SCENES.GAME_UI});
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    public init(sceneGame: SceneGame): void
    {
        this.sceneGame = sceneGame;
    }

    // Create
    ////////////////////////////////////////////////////////////////////////

    public create(): void
    {
        this.background = new GZ_Graphics(this);
        this.background.width = CST.GAME.WIDTH;
        this.background.height = CST.GAME.HEIGHT;
        this.background.fillStyle(parseInt(CST.STYLE.COLOR.GAME_BACKGROUND), 0.85);
        this.background.fillRect(0, 0, this.background.width, this.background.height);
        this.centerItem(this.background);
        this.background.setVisible(false);

        this.waveCompletedText = this.add.text(0, 0, "WAVE COMPLETED", { fontSize: "40px", fontStyle: "bold", color: CST.STYLE.COLOR.PURPLE, stroke: CST.STYLE.COLOR.BLACK, strokeThickness: 4 });
        this.centerItem(this.waveCompletedText, 0, 0);
        this.waveCompletedText.setVisible(false);

        this.chronoNextWaveText = this.add.text(0, 0, "0", { fontSize: "34px", fontStyle: "bold", color: CST.STYLE.COLOR.PURPLE, stroke: CST.STYLE.COLOR.BLACK, strokeThickness: 4 });
        this.centerItem(this.chronoNextWaveText, 0, 40);
        this.chronoNextWaveText.setVisible(false);

        this.waveText = this.add.text(0, 0, "WAVE 0", { fontSize: "48px", fontStyle: "bold", color: CST.STYLE.COLOR.PURPLE, stroke: CST.STYLE.COLOR.BLACK, strokeThickness: 4 });
        this.centerItem(this.waveText, 0, -140);
        this.waveText.setVisible(false);
    }

    // private createChrono(): Phaser.GameObjects.Text
    // {
    //     const sceneWidth = this.scale.displaySize.width;
    //     return this.add.text(sceneWidth - 100, 16, "00:00:00", {font: '24px Gemunu Libre', color: CST.STYLE.COLOR.ORANGE, stroke: CST.STYLE.COLOR.BLACK, strokeThickness: 3});
    // }

    private startGame(): void
    {
        this.elapsedTime = 0;
        this.sceneGame.scene.resume();
    }

    public onStartNewWave(currentWave: number): void
    {
        this.waveText.setText("WAVE " + currentWave.toString());
        this.waveText.setVisible(true);

        this.time.delayedCall(3000, () => {
            this.waveText.setVisible(false);
        }, null, this);
    }

    public onWaveCompleted(): void
    {
        // this.background.setVisible(true);
        this.waveCompletedText.setVisible(true);
        this.time.delayedCall(1500, () => {
            this.chronoNextWaveText.setVisible(true);
            this.updateChronoNextWave(this.durationNextWave);
        }, null, this);
    }

    private updateChronoNextWave(remainTime: number): void
    {
        this.chronoNextWaveText.setText(remainTime.toString());

        --remainTime;
        if (remainTime >= 0)
        {
            this.time.delayedCall(1000, () => { this.updateChronoNextWave(remainTime); }, null, this);
        }
        else
        {
            this.chronoNextWaveText.setVisible(false);
            this.waveCompletedText.setVisible(false);
            this.background.setVisible(false);
            this.sceneGame.startNextWave();
        }
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    public update(time: number, delta: number): void
    {
        super.update(time, delta);

        if (!this.scene.isPaused(this.sceneGame))
        {
            this.elapsedTime += delta;
            // this.chronoText.text = GZ_Scene.formatTime(this.elapsedTime);
        }
    }

}