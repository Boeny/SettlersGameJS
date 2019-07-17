
export class ViewsMap {

    hover = {};

    constructor(o) {
        $.extend(this, o);

        const show_hover = this.hover;
        const type;
        this.hover = {};

        for (const i in this.object_types) {
            type = this.object_types[i];

            this.hover[type] = new this.Hover({
                parent: this,
                type: type,
                html: this.html
            });
        }

        if (show_hover) this.createHovers(show_hover);

        this.create();
    }

    getDice(i,j) {
        return this.dices[this.getCooStr(i,j)];
    }

    showDice(digit) {
        const dice = this.DOM.find('.num[data-digit="'+digit+'"]');
        _Error.ThrowTypeIf(!dice.length, 'dice='+digit+' has not found');
        dice.addClass('big');
        setTimeout(function() {dice.removeClass('big')}, 400);
    }

    create() {
        const content = '';
        const coo, num, dice;

        for (const i=0; i<this.height; i++) {
            const row = '';

            for (const j=0; j<this.width; j++)
            {
                coo = this.getCooStr(i,j);
                dice = this.getDice(i,j);
                num = this.getRes(i,j) ? this.html.div(dice.digit, {'class': 'num '+dice.prob, 'data-digit': dice.digit}) : '';
                row += this.html.td(num, {'class': 'cell', 'data-type': this.data[coo].type, 'data-coo': coo});
            }
            content += this.html.tr(row);
        }

        this.DOM.html(this.html.table(content));
    }

    createHovers(type) {
        this.hover[type].createAll(this.getRes());
    }

    ToggleHover(type: boolean, show) {
        for (const t in this.hover) {
            this.hover[t].Toggle(type);
        }
    }

    ToggleHover (type: string, show) {
        this.hover[type].Toggle(show);
    }

    setObject(elem) {
        elem = $(elem);
        const coo = this.getCoo(elem, true);

        this.setHover({
            added: true,
            element: elem,
            type: this.parent.getType(elem),
            coo: coo,
            direction: this.getDir(elem)
        });

        return coo;
    }

    ObjectIsSet(elem) {
        return $(elem).is('.added');
    }

    isObjectType(type) {
        return this.object_types.includes(type);
    }

    // Coordinates
    getCoo(elem, as_str) {
        const coo = $(elem).data('coo');
        return as_str ? coo : this.getCooArray(coo);
    }

    getCooArray(str) {
        str = str.split('-');
        return [+str[0],+str[1]];
    }

    getCooStr(i, j) {
        return `${i}-${j}`;
    }

    getDir(elem) {
        return elem.data('dir');
    }

    getHover(o, coo, dir) {
        const type = o.type;

        o = {
            coo: coo,
            direction: dir
        };

        delete o.type;

        return this.hover[type].get(o);
    }

    setHover(o) {
        this.hover[o.type].set(o);
    }

    createNearest(type) {
        const nearest = this.getHover(type);

        for (const i in nearest) {
            this.parent.disable(nearest[i]);
        }

        nearest = this.getNearest(type);
        if (!nearest.length) return;

        for (const i in nearest) {
            this.parent.enable(nearest[i]);
        }
    }

    getNearest(type) {
        return this.hover[type].getNearest();
    }
};
