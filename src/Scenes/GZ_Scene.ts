import { GZ_TextButton } from "src/HUD/GZ_TextButton";

export declare type SceneData = {
    level: number;
    isTutorial?: boolean
}

/** Any object you may want to center with CenterItem, CenterVItem or CenterHItem. They must have a height and a width. */
declare type CenterableObject = Phaser.GameObjects.Text | Phaser.GameObjects.Image | GZ_TextButton;

export class GZ_Scene extends Phaser.Scene
{

    constructor(config: string | Phaser.Types.Scenes.SettingsConfig)
    {
        super(config);
    }

    public centerItem(item: CenterableObject, offsetX: number = 0, offsetY: number = 0) : CenterableObject
    {
        const sceneWidth: number = this.scale.displaySize.width;
        const sceneHeight: number = this.scale.displaySize.height;

        item.setX((sceneWidth - item.width) / 2 + offsetX);
        item.setY((sceneHeight - item.height) / 2 + offsetY);

        return item;
    }

    public centerVItem(item: CenterableObject, offsetY: number = 0) : CenterableObject
    {
        let sceneHeight = this.scale.displaySize.height;
        item.setY((sceneHeight - item.height) / 2 + offsetY);

        return item;
    }

    public centerHItem(item: CenterableObject, offsetX: number = 0) : CenterableObject
    {
        let sceneWidth = this.scale.displaySize.width;
        item.setX((sceneWidth - item.width) / 2 + offsetX);

        return item;
    }
}