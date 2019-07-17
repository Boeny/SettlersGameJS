
export class GameMap {

    dices = {};

    constructor(o) {
        this.rules = o.rules;
    }

    getData<T>(data: { [key: string]: T }, i: number, j: number): T {
        return data[`${i}-${j}`];
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
}
