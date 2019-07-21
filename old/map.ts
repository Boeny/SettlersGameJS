
export class Map {

    data: ICell[][] = [];

    constructor(width: number, height: number) {
        this.data = range(height).map(colIndex => range(width).map(rowIndex => new Cell(rowIndex, colIndex)));
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
