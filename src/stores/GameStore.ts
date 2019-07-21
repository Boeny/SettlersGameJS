import { reaction, observable, action } from "mobx";
import { Rules } from "helpers/rules";
import { range } from "../../old/base";

type ResourceType = 'stone' | 'wood' | 'sheep' | 'wheat' | 'clay';
type ObjectType = 'village' | 'town' | 'road';

interface IPlayer {
    gatherResource(resourceType: ResourceType, count: number): void;
}

class PlayerStore implements IPlayer {

    public static create(count: number): IPlayer[] {

        return range(count).map(() => new PlayerStore());
    }

    public resources: IResource[] = [];

    @action
    gatherResource(resourceType: ResourceType, count: number) {
        this.resources.find += count;
    }
}

interface IObject {
    readonly type: ObjectType;
    readonly name: string;
    readonly owner: IPlayer;
    readonly gatheringPower?: number;
    readonly requires?: ObjectType;
}

interface IDice {
    digit: number;
    probability: number;
}

// --------------------------------------

interface IResourceCell {
    type: ResourceType;
    dice: IDice;
    objects: IObject[];
}

interface ISeaCell {
    type: 'sea';
}

export type ICell = IResourceCell | ISeaCell;

class ResourceCell implements IResourceCell {

    objects: IObject[] = [];

    constructor(
        public readonly type: ResourceType,
        public readonly dice: IDice
    ) {}
}

class SeaCell implements ISeaCell {

    type = 'sea' as 'sea';
}

export type CellType = ICell['type'];

interface IMap {
    data: ICell[][];
}

class EmptyMap implements IMap {
    data: ICell[][] = [];
}

class MapStore implements IMap {

    data: ICell[][] = [];

    constructor(width: number, height: number) {
        this.data = range(height).map(() => range(width).map(() => new SeaCell()));
    }
}

export interface IGameStore {
    map: IMap;
    digit: number;
    newGame(mapWidth: number, mapHeight: number, playerCount: number): void;
    onStep(): void;
    isResourceCell(cell: ICell): cell is IResourceCell;
}

export class GameStore implements IGameStore {

    map: IMap = new EmptyMap();
    players: IPlayer[] = [];
    private step = -1;

    @observable
    public digit = 0;

    constructor() {

        reaction(() => this.digit, action(() => {

            this.map.data.forEach(row => row.forEach(cell => {
                if (this.isResourceCell(cell) && cell.dice.digit === this.digit) {
                    this.updateCell(cell);
                }
            }));
        }));
    }

    private updateCell(cell: IResourceCell) {

        cell.objects.forEach(object => {
            if (object.gatheringPower) {
                object.owner.gatherResource(cell.type, object.gatheringPower);
            }
        });
    }

    public isResourceCell(cell: ICell): cell is IResourceCell {
        return cell.type !== 'sea';
    }

    public newGame = (mapWidth: number, mapHeight: number, playerCount: number) => {

        this.map = new MapStore(mapWidth, mapHeight);
        this.players = PlayerStore.create(playerCount);
        this.onStep();
    }

    @action
    public onStep() {
        this.step += 1;
        const rule = Rules.gameSteps[this.step];

        this.currentPlayerIndex = rule.order < 0 ? this.players.length - 1 : 0;
        const player = this.players[this.currentPlayerIndex];

        if (rule.type === 'prepare') {
            return;
        }

        this.digit = Rules.getNextDigit();
    }
}
