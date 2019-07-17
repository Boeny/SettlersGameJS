import { randomElem } from "./base";

interface IResource {
    readonly type: 'stone' | 'wood' | 'sheep' | 'wheat' | 'clay';
    readonly count: number;
}

interface IRecipe {
    readonly type: 'village' | 'town' | 'road';
    readonly resources: IResource[];
}

type ObjectToPlaceType = 'village' | 'town' | 'road';

/**
 * @param type village, town, road
 * @param canBePlacedAnywhere if true, the object can be placed at any position of the map
 * @param count if defined, the object can be placed only <count> times
 */
interface IObjectToPlace {
    readonly type: ObjectToPlaceType;
    readonly canBePlacedAnywhere?: boolean;
    readonly count?: number;
    readonly requires?:
}

interface IStep {
    readonly order: 1 | -1;
    readonly objectsToPlace: IObjectToPlace[];
}

/**
 * @param preparingSteps only this count of steps allowed
 * @param mainSteps
 */
interface IGameSteps {
    readonly preparingSteps: IStep[];
    readonly mainSteps: IStep[];
}

interface IBuildingBonus {
    readonly type: 'village' | 'town';
    readonly gathering: number;
}

interface IMarketBonus {
    readonly type: 'market';
    readonly exchange: number;
}

type BonusType = IBuildingBonus | IMarketBonus;

export class Rules {

    width = 10;
    height = 10;
    step = 0;

    readonly DEFAULT_EXCHANGE = 4;

    private readonly gameSteps: IGameSteps = {
        preparingSteps: [
            {
                order: 1,
                objectsToPlace: [
                    { type: 'village', canBePlacedAnywhere: true, count: 1 },
                    { type: 'road', count: 1, requires: 'village' }
                ]
            },
            {
                order: -1,
                objectsToPlace: [
                    { type: 'village', canBePlacedAnywhere: true, count: 1 },
                    { type: 'road', count: 1 }
                ]
            }
        ],
        mainSteps: [
            {
                order: 1,
                objectsToPlace: [
                    { type: 'village' },
                    { type: 'town', requires: 'village' },
                    { type: 'road' }
                ]
            }
        ]
    };

    cellTypes = {
        resources: {},
        res_by_count: [],
        cells: {}
    };

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

    bonuses: BonusType[] = [
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

    getPlace(type) {
        return this.objects[type].place.slice();
    }

    getBonuses(type) {
        return this.bonuses[type];
    }

    getReceipt(type) {
        return this.recipes[type];
    }

    getPrepareStep(): IStep | null {
        return this.gameSteps.preparingSteps[this.step] || null;
    }

    getCurrentRule() {
        return this.getPrepareStep() || this.gameSteps.mainSteps[this.step];
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
        this.dices = [];
        this.cellTypes.dices = this.setDices(this.cellTypes.res_by_count.length);
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

    getRandomDice() {
        const i = random(this.cellTypes.dices.length-1);
        const result = this.cellTypes.dices[i];
        this.cellTypes.dices.splice(i,1);
        return result;
    }

    getNextDice() {
        return randomElem(this.dices);
    }

    setDices(res_count) {

        const counterDictionary = range(0, 1000).reduce<{ [digit: string]: number }>(
            (result, i) => {
                let num = random(1,6) + random(1,6);
                if (num === 7) {
                    return;
                }

                let key = String(num);
                if (result[key] === undefined) {
                    result[key] = 1;
                    return;
                }
                result[key] += 1;

                return result;
            },
            {}
        );

        const digitsWithCount = Object.keys(counterDictionary).map((count, i) => ({
            digit: i,
            count: counterDictionary[count]
        }))
            .sort((a, b) => a.count - b.count);

        const minCount = digitsWithCount[0].count;
        const third = (maxCount - minCount)/3;

        return {
            min: digitsWithCount.filter(x => x.count - minCount <= third).map(x => x.digit),
            average: digitsWithCount.filter(x => x.count - minCount >= 2 * third).map(x => x.digit),
            max: digitsWithCount.filter(x => third < x.count - minCount && x.count - minCount < 2 * third).map(x => x.digit)
        };
    }
};
