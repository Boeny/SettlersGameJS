
export class GamePlayer {

    constructor(o) {
        this.index = o.index;
        this.ai = o.ai;
        this.parent = o.parent

        this.rule = {};
        this.resources = {};
        this.objects = {};
        this.enabled = [];
        this.filtered = [];
    }

    Create(parent, count) {
        const pc_index = random(0, count-1);
        const players = [];

        for (const i=0; i<count; i++)
        {
            players.push(new parent.Player({
                index: i,
                ai: i !== pc_index,
                parent: parent
            }));
        }

        return players;
    }

    getRoundMessage() {
        return this.ai ? 'Ходит игрок №'+(this.index+1) : 'Ваш ход';
    }

    getMessageTimeout() {
        return 300;
    }

    AddObject(type, count) {
        this.objects[type] = (this.objects[type] || 0) + (count || 1);

        if (this.rule.objects[type].count !== undefined) {
            this.rule.objects[type].count--;

            if (this.rule.objects[type].count <= 0) {
                delete this.rule.objects[type];
            }
        }
        else{
            if (this.rule.objects[type].receipt) {
                for (const i in this.rule.objects[type].receipt) {
                    this.DelRes(i, this.rule.objects[type].receipt[i]);
                }
            }

            this.CheckExchange();
        }
    }

    hasObject(type) {
        if (!type) return false;
        return Object.keys(this.objects).includes(type);
    }

    hasRuleObjects() {
        return Object.keys(this.rule.objects).length > 0;
    }

    CheckObjects() {
        this.enabled = [];
        this.filtered = [];

        for (const type in this.rule.objects) {
            const obj = this.rule.objects[type];

            if (obj.need || obj.receipt) {
                if (this.hasObject(obj.need)) {
                    if (!obj.receipt || this.hasRes(obj.receipt)) {
                        this.enabled.push(type);
                    }
                }
                this.filtered.push(type);
            }
            else{
                this.enabled.push(type);
            }
        }
    }

    DelRes(type, count) {
        if (this.resources[type]) {
            this.resources[type] -= count || 1;
            if (this.resources[type] <= 0) delete this.resources[type];
        }
    }

    AddRes(type, count) {
        this.resources[type] = (this.resources[type] || 0) + (count || 1);
    }

    getRes() {
        return this.resources;
    }

    hasRes(receipt) {
        for (const type in receipt) {
            if (!this.resources[type] || this.resources[type] < receipt[type])
                return false;
        }
        return true;
    }

    CheckExchange() {
        //for (const type in)
        //this.rule.exchange;
    }

    getExchange() {
        return this.rule.exchange;
    }

    Exchange(type1, type2) {
        this.DelRes(type1, this.rule.exchange[type1].count);
        this.AddRes(type2);
    }

    getFiltered() {
        return this.filtered;
    }

    getEnabled() {
        return this.enabled;
    }

    setEnabled(arr) {
        this.enabled = arr;
    }

    setRule(r) {
        this.rule = r || this.rule;
    }

    Step(r) {
        this.setRule(r);

        if (this.ai) {

        }
        else{

        }

        return {
            filtered: this.filtered,
            enabled: this.ai ? [] : this.enabled
        };
    }
}
