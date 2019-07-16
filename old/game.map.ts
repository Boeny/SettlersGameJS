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

    getData(i,j) {
        if (is_array(i)) {
            j = i[1];
            i = i[0];
        }
        return i === undefined ? this.data : this.data[i+'-'+j];
    }

    getDices() {
        return this.dices;
    }

    getRes(i,j) {
        if (is_array(i)) {
            j = i[1];
            i = i[0];
        }
        return i === undefined ? this.res_data : this.res_data[i+'-'+j];
    }

    isRes(i,j) {
        if (!is_object(i)) i = this.getData(i,j);
        return Object.keys(this.rules.resources).includes(i.type));
    }

    Generate() {
        this.data = {};
        this.res_data = {};

        this.rules.Init();

        for (var i = 0; i < this.rules.height; i++) {
            for (var j = 0; j < this.rules.width; j++) {

                var res = this.parent.Validate(this.rules.getRandomRes(i,j), 'random_res');
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
        var result = {};

        for (var coo in this.dices) {
            if (this.dices[coo].digit === digit)
                result[coo] = this.data[coo];
        }

        return result;
    }
}
