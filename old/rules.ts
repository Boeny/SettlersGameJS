
export class Rules  {

    width = 10;
    height = 10;
    round = 0;

    game = {
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

    receipts = {
        road: { stone:1, clay:1 },
        village: { wheat: 1, wood: 1, sheep: 1, clay: 1 }
        // town: { village: 1, stone: 3, wheat: 2 }
    };

    objects = {
        road: { type: 'line', title:'дорога', place: ['road', 'village'] },
        village: { type: 'corner', title: 'поселение', place:'road' }
        // town: { type: 'corner', title: 'город (требуется поселение)', replaces:'village' }
    };

    bonuses = {
        village: { resources: 1 }
        // town: { resources: 2 },
        // market: { exchange: [2, 3] },
    };

    market = { resources: 1 };

    setNextRound() {
        this.round += 1;
    }

    getCurrentRule() {
        const rule = this.game.prepare[this.round];
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

    getReceipts() {
        const result = [];
        const receipts_names = Object.keys(this.receipts);

        for (const name in this.receipts) {
            const obj = this.receipts[name];
            const obj_info = this.objects[name];
            const receipt = [];

            for (const res in obj) {
                if (receipts_names.includes(res)) continue;

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

    getCellType(i,j) {
        const c = {}; //  conditions[cell]

        for (const key in this.cells) {
            c[key] = [];
            const freq = this.cells[key].freq;

            for (const h in freq) {
                const delta = freq[h];

                switch (h) {
                    case 'height':
                        if (i === this.height && delta === '*') c[key].push(true);
                        break;
                    case '*':
                        if (delta.includes(j)) {
                            c[key].push(true);
                        }
                        break;
                    default:
                        if (i === +h && delta === '*') c[key].push(true);
                }
            }
        }

        const max_key = {max: 0, key: ''};

        for (const key in c) {
            if (c[key].length > max_key.max) {
                max_key = {
                    key: key,
                    max: c[key].length
                }
            }
        }

        return max_key.max ? max_key.key : 'resources';
    }

    getRandomRes(i,j) {
        const type = this.getCellType(i,j);
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
}
