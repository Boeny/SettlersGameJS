
export class GameRules {

    width = 10
    height = 10

    game = {
        prepare: [
            {objects: {village: 1, road: {count: 1, place: true}}},
            {order: -1, objects: {village: 1, road: {count: 1, place: true}}}
        ],
        main: {objects: {village: {place: true}, road: {place: true}}}
    }

    resources = {
        stone: 3,
        wood: 2,
        sheep: 2,
        wheat: 1,
        clay: 1
    }

    cells = {
        //market2: {freq: 'resources'},
        //market3: {freq: 'resources'},
        //resources: {freq: 'count'},
        sea: {freq:{0: '*', '*': [0,-1], height: '*'}}
    }

    receipts = {
        road: {stone:1,clay:1},
        village: {wheat:1,wood:1,sheep:1,clay:1},
        //town: {village:1,stone:3,wheat:2}
    }

    objects = {
        road: {title:'дорога',place:['road','village']},
        village: {title:'поселение',place:'road'},
        //town: {title:'город (требуется поселение)',replace:'village'}
    }

    bonuses = {
        village: {resources: 1},
        //town: {resources: 2},
        //market2: {exchange: 2},
        //market3: {exchange: 3}
    }

    exchange = {
        resources: 4
    }

    constructor(width: number, height: number) {
        this.setSize(width, height);
    }

    getTypes() {
        return Object.keys(this.objects);
    }

    getPlace(type) {
        return this.objects[type].place.slice();
    }

    getBonuses(type) {
        return this.bonuses[type];
    }

    getReceipt(type) {
        return this.receipts[type];
    }

    getExchange() {
        var result = {};
        var res, type;

        for (var extype in this.exchange) {
            res = Object.keys(this[extype]);

            for (var i in res) {
                type = res[i];

                result[type] = {
                    count: this.exchange[extype],
                    res: res.filter(x => x !== type)
                };
            }
        }

        return result;
    }

    setNextRound() {
        this.round++;
    }

    getPrepareStep() {
        return this.game.prepare[this.round] || false;
    }

    getCurrentRule() {
        var objects = {};
        var rule = this.getPrepareStep();
        var is_main = !rule;
        if (is_main) rule = this.game.main;

        for (var type in rule.objects) {
            var obj = rule.objects[type];
            var is_obj = is_object(obj);

            objects[type] = {
                count: is_obj ? obj.count : obj,
                need: is_obj && obj.place ? this.getPlace(type) : null,
                receipt: is_main ? this.getReceipt(type) : null,
                type: type
            };
        }

        return {
            order: rule.order || 1,
            exchange: this.getExchange(),
            objects: objects
        };
    }

    getReceipts() {
        var result = [];
        var receipts_names = Object.keys(this.receipts);

        for (var type in this.receipts) {
            var receipt = {
                type: type,
                title: this.objects[type].title,
                resources: []
            };

            var obj = this.receipts[type];

            for (var res in obj) {
                if (receipts_names.includes(res)) continue;

                receipt.resources.push({
                    type: res,
                    count: obj[res]
                });
            }

            result.push(receipt);
        }

        return result;
    }

    setSize(w,h) {
        this.width = +w || this.width;
        this.height = +h || this.height;
    }

    Init() {

        this.tmp = {
            resources: {},
            res_by_count: [],
            cells: {}
        };

        var count = (this.width - 2) * (this.height - 2);
        var actual_count = 0;

        for (var i in this.resources) {
            this.tmp.resources[i] = this.resources[i].count || this.resources[i];
            actual_count += this.tmp.resources[i];
        }

        var koef = count / actual_count;

        for (var i in this.resources) {
            this.tmp.resources[i] = parseInt(this.tmp.resources[i] * koef);

            for (var j=0; j<this.tmp.resources[i]; j++) {
                this.tmp.res_by_count.push(i);
            }
        }

        for (var i in this.cells) {
            this.tmp.cells[i] = this.cells[i].count;
        }

        this.round = 0;
        this.dices = [];
        this.tmp.dices = this.setDices(this.tmp.res_by_count.length);
    }

    getCellType(i,j) {
        if (i === 0 || i === this.height-1 || j === 0 || j === this.width-1) return obj_first(this.cells);
        return 'resources';
    }

    getRandomRes(i,j) {
        var type = this.getCellType(i,j);
        var all_res = this.tmp[type] || this.tmp.cells;
        var names = type === 'resources' ? this.tmp.res_by_count : Object.keys(all_res);

        if (!names.length) {
            type = 'cells';
            names = Object.keys(this.cells);
        }

        var res = randomElem(names);

        if (type === 'resources')
        {
            names.splice(names.indexOf(res), 1);
        }

        return {type: res};
    }

    getRandomDice() {
        var i = random(this.tmp.dices.length-1);
        var result = this.tmp.dices[i];
        this.tmp.dices.splice(i,1);
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
