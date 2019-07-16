import { Game } from './game';
import { Rules } from './rules';

export class GameMap {

    parent: Game;
    rules: Rules;

    constructor(o) {
        this.parent = o.parent;
        this.rules = o.rules;
        this.types = this.rules.getTypes();
        this.dices = {};
    }

    getTypes() {
        return this.types;
    }

    getData(i, j) {
        return i === undefined ? this.data : this.data[i+'-'+j];
    }

    getDices() {
        return this.dices;
    }

    getRes(i, j) {
        return i === undefined ? this.res_data : this.res_data[i+'-'+j];
    }

    isRes(i,j) {
        i = this.getData(i,j);
        return Object.keys(this.rules.resources).includes(i.type));
    }

    Generate() {
        this.data = {};
        this.res_data = {};

        this.rules.Init();

        for (const i = 0; i < this.rules.height; i++) {
            for (const j = 0; j < this.rules.width; j++) {

                const res = this.parent.Validate(this.rules.getRandomRes(i,j), 'random_res');
                this.data[i+'-'+j] = res;

                if (this.isRes(res)) {
                    this.res_data[i+'-'+j] = res;
                    this.dices[i+'-'+j] = this.rules.getRandomDice();
                }
            }
        }

        return this.data;
    }

    getCellsByDice(digit) {
        const result = {};

        for (const coo in this.dices) {
            if (this.dices[coo].digit === digit)
                result[coo] = this.data[coo];
        }

        return result;
    }
}
