
export class Map {

    dices = {};

    constructor(o) {
        this.rules = o.rules;
    }

    //old
    isRes(i, j) {
        i = this.getData(i, j);
        if (!i) return false;
        return Object.keys(this.rules.resources).includes(i.name);
    }

    getData<T>(data: { [key: string]: T }, i: number, j: number): T {
        return data[`${i}-${j}`];
    }
    // old
    getData(i, j) {
        return i === undefined ? this.data : this.data[i + '-' + j];
    }

    Generate() {
        this.data = {};
        this.res_data = {};

        this.rules.Init();

        for (const i = 0; i < this.rules.height; i++) {
            for (const j = 0; j < this.rules.width; j++) {

                const res = this.rules.getRandomRes(i,j);
                this.data[i+'-'+j] = res;

                if (this.isRes(res)) {
                    this.res_data[i+'-'+j] = res;
                    this.dices[i+'-'+j] = this.rules.getRandomDice();
                }
            }
        }
        return this.data;
    }
    // old
    Generate(rules) {
        this.rules = rules;
        this.data = {};
        this.res_data = {};

        for (const i = 0; i < this.rules.height; i++) {
            for (const j = 0; j < this.rules.width; j++) {

                this.data[i+'-'+j] = this.rules.getRandomRes(i, j);
            }
        }
        return this.data;
    }
}
