
export class ViewsMapHover {

    constructor(private type: string) {

        switch (type) {
            case 'road':
                this.elements = new ViewsMapHoverLine(type);
                break;
            case 'village':
            case 'town':
                this.elements = new ViewsMapHoverCorner(type);
                break;
        }
    }

    createAll(cells_info) {
        if (this.elements.filled) return;

        for (const coo in cells_info) {
            coo = this.parent.getCooArray(coo);
            const dir = {top:1,bottom:1,left:1,right:1};

            if (coo[0] === 0) delete dir.top;
            if (coo[1] === 0) delete dir.left;
            if (coo[0] === this.parent.height-1 || this.parent.getRes(coo[0]+1, coo[1])) delete dir.bottom;
            if (coo[1] === this.parent.width-1 || this.parent.getRes(coo[0], coo[1]+1)) delete dir.right;

            this.elements.create(Object.keys(dir), coo, true);// enabled
        }

        this.elements.filled = true;
    },

    get(o) {
        return o.coo ? this.elements.get(o) : this.elements.getElem(o.added);
    },
    set(o) {
        o.element.addClass('added');
        this.elements.set(o);
    },
    ObjectIsSet(elem) {
        return $(elem).is('.added');
    },

    getNearest() {
        return this.elements.getNearest();
    },
    getAddedObjects(type) {
        return this.parent.getHover({type: type, added: true});
    },

    Hide() {
        this.parent.removeType();
    },
    Show() {
        this.parent.setType(this.type);
    },
    Toggle(show) {
        return this[(show ? 'Show' : 'Hide')]();
    }
};
