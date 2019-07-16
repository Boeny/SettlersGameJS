
export class Map {

    getData(i,j) {
        return i === undefined ? this.data : this.data[i+'-'+j];
    }

    Generate(rules) {
        this.rules = rules;
        this.data = {};
        this.res_data = {};

        for (const i = 0; i < this.rules.height; i++) {
            for (const j = 0; j < this.rules.width; j++) {

                this.data[i+'-'+j] = this.rules.getRandomRes(i,j);
            }
        }
        return this.data;
    }

    isRes(i,j) {
        i = this.getData(i,j);
        if (!i) return false;
        return Object.keys(this.rules.resources).includes(i.name);
    }
}
