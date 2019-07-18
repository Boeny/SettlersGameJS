import { randomElem, random, range, lastElement } from "./base";

type ResourceType = 'stone' | 'wood' | 'sheep' | 'wheat' | 'clay';

interface IResource {
    readonly type: ResourceType;
    readonly name: string;
}

interface IResourceForRecipe {
    readonly type: ResourceType;
    readonly count: number;
}

interface IRecipe {
    readonly type: 'village' | 'town' | 'road';
    readonly resources: IResourceForRecipe[];
}

type ObjectType = 'village' | 'town' | 'road';

interface IObject {
    readonly type: ObjectType;
    readonly name: string;
    readonly requires?: ObjectType;
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
    readonly DEFAULT_EXCHANGE = 4;

    public width = 10;
    public height = 10;
    public step = 0;

    public dices: IDice[] = [];

    private objects: IObject[] = [
        { type: 'village', name: 'поселение' },
        { type: 'town', name: 'город' },
        { type: 'road', name: 'дорога' }
    ];

    private resources: IResource[] = [
        { type: 'wheat', name: 'пшеница' },
        { type: 'wood', name: 'лес' },
        { type: 'sheep', name: 'овцы' },
        { type: 'clay', name: 'глина' },
        { type: 'stone', name: 'камень' }
    ];

    private readonly gameSteps: IStepRule[] = [
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

    recipes: IRecipe[] = [
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

    actions: ActionType[] = [
        { type: 'village', gathering: 1 },
        { type: 'town', gathering: 2 },
        { type: 'market', exchange: 2 },
        { type: 'market', exchange: 3 }
    ];

    constructor(width: number, height: number) {
        this.setSize(width, height);
    }

    isRes(resources: { [key: string]: { type: string } }, i: number, j: number) {
        return Object.keys(resources).includes(this.getData(resources, i, j).type);
    }
    // old map
    isRes(i, j) {
        i = this.getData(i, j);
        if (!i) return false;
        return Object.keys(this.rules.resources).includes(i.name);
    }

    getPlace(type) {
        return this.objects[type].place.slice();
    }

    getBonuses(type) {
        return this.actions[type];
    }

    getReceipt(type) {
        return this.recipes[type];
    }

    getCurrentRule(): IStepRule {
        return this.gameSteps[this.step];
    }
    // old
    getCurrentRule() {
        const rule = this.game.prepare[this.step];
        if (!rule.objects) return rule;

        for (const name in rule.objects) {
            const obj = rule.objects[name];
            const is_obj = true;

            rule.objects[name] = {
                count: is_obj ? obj.count : obj,
                need: is_obj && obj.place ? this.objects[name].place : null,
                type: this.objects[name].type
            };
        }

        return rule;
    }

    getRecipes() {
        const result = [];
        const recipes_names = Object.keys(this.recipes);

        for (const type in this.recipes) {
            const receipt = {
                type: type,
                title: this.objects[type].title,
                resources: []
            };

            const obj = this.recipes[type];

            for (const res in obj) {
                if (recipes_names.includes(res)) continue;

                receipt.resources.push({
                    type: res,
                    count: obj[res]
                });
            }

            result.push(receipt);
        }

        return result;
    }
    // old
    getRecipes() {
        const result = [];
        const recipes_names = Object.keys(this.recipes);

        for (const name in this.recipes) {
            const obj = this.recipes[name];
            const obj_info = this.objects[name];
            const receipt = [];

            for (const res in obj) {
                if (recipes_names.includes(res)) continue;

                receipt.push({
                    name: res,
                    object: name,
                    count: obj[res],
                    title: obj_info.title,
                    type: obj_info.type
                });
            }

            result.push(receipt);
        }

        return result;
    }

    setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    Init() {

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

    getRandomRes(i: number, j: number): string {
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
    getRandomRes(i, j) {
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

    getRandomDice() {
        const i = random(this.cellTypes.dices.length-1);
        const result = this.cellTypes.dices[i];
        this.cellTypes.dices.splice(i,1);
        return result;
    }

    getNextDigit(): number {
        return randomElem(this.dices).digit;
    }

    getDices(): IDice[] {

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
