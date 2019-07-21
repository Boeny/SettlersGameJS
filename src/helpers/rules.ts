import { randomElem, random, range, lastElement } from "../../old/base";

type ResourceType = 'stone' | 'wood' | 'sheep' | 'wheat' | 'clay';
type ObjectType = 'village' | 'town' | 'road';

interface IResource {
    readonly type: ResourceType;
    readonly name: string;
}

interface IResourceForRecipe {
    readonly type: ResourceType;
    readonly count: number;
}

interface IRecipe {
    readonly type: ObjectType;
    readonly resources: IResourceForRecipe[];
}

/**
 * @param type village, town, road
 * @param canBePlacedAnywhere if true, the object can be placed at any position of the map
 * @param count if defined, the object can be placed only <count> times
 */
interface IObjectForStep {
    readonly type: ObjectType;
    readonly canBePlacedAnywhere?: boolean;
    readonly count?: number;
}

interface IStepRule {
    readonly type: 'prepare' | 'main';
    readonly order: 1 | -1;
    readonly objectsToPlace: IObjectForStep[];
}

interface IBuildingAction {
    readonly type: 'village' | 'town';
    readonly gathering: number;
}

interface IMarketAction {
    readonly type: 'market';
    readonly exchange: number;
}

type ActionType = IBuildingAction | IMarketAction;

export interface IDice {
    digit: number;
    probability: number;
}

export class Rules {

    /*game = {
        prepare: [
            {
                objects: {
                    village: 1,
                    road: { count: 1, place: true }
                }
            },
            {
                order: -1,
                objects: {
                    village: 1,
                    road: { count: 1, place: true }
                }
            }
        ]
    };

    resources = {
        stone: { count: 10 },
        wood: { count: 13 },
        sheep: { count: 13 },
        wheat: { count: 13 },
        clay: { count: 13 }
    };

    tmp = {
        stone: { count: 10 },
        wood: { count: 13 },
        sheep: { count: 13 },
        wheat: { count: 13 },
        clay: { count: 13 }
    };

    cells = {
        // market: { freq: 'resources' },
        // resources: { freq: 'count' },
        sea: {
            freq: {
                0: '*',
                height: '*',
                '*': [0, -1]
            }
        }
    };

    recipes = {
        road: { stone: 1, clay: 1 },
        village: { wheat: 1, wood: 1, sheep: 1, clay: 1 }
        // town: { village: 1, stone: 3, wheat: 2 }
    };

    objects = {
        road: { type: 'line', title: 'дорога', place: ['road', 'village'] },
        village: { type: 'corner', title: 'поселение', place: 'road' }
        // town: { type: 'corner', title: 'город (требуется поселение)', replaces:'village' }
    };

    bonuses = {
        village: { resources: 1 }
        // town: { resources: 2 },
        // market: { exchange: [2, 3] },
    };

    market = { resources: 1 };
    */
    private static readonly DEFAULT_EXCHANGE = 4;

    public static step = 0;

    public static dices: IDice[] = [];

    private static readonly resources: IResource[] = [
        { type: 'wheat', name: 'пшеница' },
        { type: 'wood', name: 'лес' },
        { type: 'sheep', name: 'овцы' },
        { type: 'clay', name: 'глина' },
        { type: 'stone', name: 'камень' }
    ];

    private static readonly gameSteps: IStepRule[] = [
        {
            type: 'prepare',
            order: 1,
            objectsToPlace: [
                { type: 'village', canBePlacedAnywhere: true, count: 1 },
                { type: 'road', count: 1 }
            ]
        },
        {
            type: 'prepare',
            order: -1,
            objectsToPlace: [
                { type: 'village', canBePlacedAnywhere: true, count: 1 },
                { type: 'road', count: 1 }
            ]
        },
        {
            type: 'main',
            order: 1,
            objectsToPlace: [
                { type: 'village' },
                { type: 'town' },
                { type: 'road' }
            ]
        }
    ];

    public static readonly recipes: IRecipe[] = [
        {
            type: 'village',
            resources: [
                { type: 'wheat', count: 1 },
                { type: 'wood', count: 1 },
                { type: 'sheep', count: 1 },
                { type: 'clay', count: 1 }
            ]
        },
        {
            type: 'town',
            resources: [
                { type: 'stone', count: 3 },
                { type: 'wheat', count: 2 }
            ]
        },
        {
            type: 'road',
            resources: [
                { type: 'stone', count: 1 },
                { type: 'clay', count: 1 }
            ]
        }
    ];

    public static actions: ActionType[] = [
        { type: 'village', gathering: 1 },
        { type: 'town', gathering: 2 },
        { type: 'market', exchange: 2 },
        { type: 'market', exchange: 3 }
    ];

    public static getCurrentRule(): IStepRule {
        return this.gameSteps[this.step];
    }

    public static Init() {

        this.cellTypes = {
            resources: {},
            res_by_count: [],
            cells: {}
        };

        const count = (this.width - 2) * (this.height - 2);
        const actual_count = 0;

        for (const i in this.resources) {
            this.cellTypes.resources[i] = this.resources[i].count || this.resources[i];
            actual_count += this.cellTypes.resources[i];
        }

        const koef = count / actual_count;

        for (const i in this.resources) {
            this.cellTypes.resources[i] = parseInt(this.cellTypes.resources[i] * koef);

            for (const j=0; j<this.cellTypes.resources[i]; j++) {
                this.cellTypes.res_by_count.push(i);
            }
        }

        for (const i in this.cells) {
            this.cellTypes.cells[i] = this.cells[i].count;
        }

        this.step = 0;
        this.dices = this.getDices();
    }

    public static getRandomRes(i: number, j: number): string {
        const cellType = this.getCellType(i, j);
        const all_res = this.cellTypes[cellType] || this.cellTypes.cells;
        const names = cellType === 'resources' ? this.cellTypes.res_by_count : Object.keys(all_res);

        if (!names.length) {
            cellType = 'cells';
            names = Object.keys(this.cells);
        }

        const res = randomElem(names);

        if (cellType === 'resources') {
            names.splice(names.indexOf(res), 1);
        }

        return {type: res};
    }
    // old
    public static getRandomRes(i, j) {
        const type = this.getCellType(i, j);
        const all_res = this.tmp[type] || this.cells;
        const keys = Object.keys(all_res);

        if (!keys.length) {
            type = 'cells';
            all_res = this[type];
            keys = Object.keys(all_res);
        }

        const res;

        if (this.cells[type]) {
            res = type;
            type = 'cells';
        }
        else {
            res = randomElem(keys);
        }

        if (type === 'resources') {
            all_res[res]--;
            if (!all_res[res]) delete all_res[res];
        }

        return $.extend({}, this[type][res], { name: res });
    }

    public static getRandomDice() {
        const i = random(this.cellTypes.dices.length-1);
        const result = this.cellTypes.dices[i];
        this.cellTypes.dices.splice(i,1);
        return result;
    }

    public static getNextDigit(): number {
        return randomElem(this.dices).digit;
    }

    public static getDices(): IDice[] {

        const counterDictionary = range(0, 1000).reduce<{ [digit: string]: number }>(
            result => {
                const num = random(1, 6) + random(1, 6);

                if (num === 7) {
                    return;
                }

                const key = String(num);

                if (result[key] === undefined) {
                    result[key] = 1;
                    return;
                }
                result[key] += 1;

                return result;
            },
            {}
        );

        const result = Object.keys(counterDictionary).map((count, i) => ({
            digit: i,
            count: counterDictionary[count]
        }))
            .sort((a, b) => a.count - b.count);

        const min = result[0].count;
        const max = lastElement(result).count;

        return result.map(item => ({
            digit: item.digit,
            probability: (item.count - min) / max
        }));
    }
};
