
export class ViewsDescription {

    constructor(o) {
        $.extend(this, o);
        this.cached = {};
        this.Create(o);
    }

    Create(o) {
        const obj, res;

        for (const i in o.types) {
            const object = '';
            obj = o.types[i];

            for (const j in obj.resources) {
                res = obj.resources[j];

                for (const k=0; k<res.count; k++) {
                    object += this.html.div(res.type, {'class': 'resource pull-left', 'data-type': res.type});
                }
            }

            this.cached[obj.type] = $(this.html.div({
                'data-type': obj.type,
                'class': 'receipt disabled',
                content: object + this.html.div(obj.title, {'class': 'pull-right'}),
            }));

            this.DOM.append(this.cached[obj.type]);
        }
    }

    getElem(o) {
        if (!o) return this.cached;
        return this.cached[o];
    }

    Toggle(types) {
        const objects = this.getElem();

        for (const type in objects) {
            this.parent.toggle(objects[type], types.includes(type));
        }
    }

    Filter(types) {
        const objects = this.getElem();

        for (const type in objects) {
            this.parent.toggleFilter(objects[type], types.includes(type));
        }
    }
}
