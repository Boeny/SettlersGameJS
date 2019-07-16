Views.Description = function(o) {
    $.extend(this, o);
    this.cached = {};
    this.Create(o);
};
Views.Description.prototype = {

    Create(o) {
        var obj, res;

        for (var i in o.types) {
            var object = '';
            obj = o.types[i];

            for (var j in obj.resources) {
                res = obj.resources[j];

                for (var k=0; k<res.count; k++) {
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
    },

    getElem(o) {
        _Error.ThrowTypeIf(!obj_length(this.cached), 'description cache is empty', 'views.description.getElem');
        if (!o) return this.cached;

        if (is_('object', o)) {
            o = is_array(o) ? o : Object.keys(o);
        }
        else
            return this.cached[o];

        var result = [];

        for (var i in o) {
            result.push(this.cached[o[i]]);
        }

        return result;
    },

    Toggle(types) {
        var objects = this.getElem();

        for (var type in objects) {
            this.parent.toggle(objects[type], types.includes(type));
        }
    },
    Filter(types) {
        var objects = this.getElem();

        for (var type in objects) {
            this.parent.toggleFilter(objects[type], types.includes(type));
        }
    }
};
