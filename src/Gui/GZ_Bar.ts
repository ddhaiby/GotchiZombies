export class GZ_Bar extends Phaser.GameObjects.Graphics
{
    /** Range value from 0 to 1 */
    protected value: number;

    /** The fill color */
    protected color: number;

    /** The width of the bar */
    protected _width: number;

    /** The height of the bar */
    protected _height: number;

    /** The radius of the bar */
    public radius: number;

    constructor(scene: Phaser.Scene, options?: Phaser.Types.GameObjects.Graphics.Options & {width?: number, height?: number, radius?: number, value?: number, color?: number})
    {
        super(scene, options);
        this.width = (options && options.width) ? options.width : 0;
        this.height = (options && options.height) ? options.height : 0;
        this.radius = (options && options.radius) ? options.radius : 0;
        this.value = (options && options.value != undefined) ? options.value : 1;
        this.color = (options && options.color != undefined) ? options.color : 0x000000;
        this.redraw();
        scene.add.existing(this);
    }

    setValue(value: number): void
    {
        this.value = Math.max(0, Math.min(1, value));
        this.redraw();
    }

    getValue(): number
    {
        return this.value;
    }

    redraw(): void
    {
        this.clear();
        this.fillStyle(this.color);
        this.fillRoundedRect(0, 0, this.value * this.width, this.height, this.radius);
    }

    public get width(): number
    {
        return this._width;
    }

    public set width(width: number)
    {
        this._width = width;
        this.redraw();
    }

    public get height(): number
    {
        return this._height;
    }

    public set height(height: number)
    {
        this._height = height;
        this.redraw();
    }
}