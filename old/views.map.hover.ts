Views.Map.prototype.Hover = function(o) {
    $.extend(this, o);
    this.CreateByType(this.type);
};
Views.Map.prototype.Hover.prototype = {

    CreateByType: function(type) {
        var params = {
            parent: this,
            type: type,
            html: this.html
        };

        switch (type) {
            case 'road':
                this.elements = new this.LineHover(params);
                break;
            case 'village':
            case 'town':
                this.elements = new this.CornerHover(params);
                break;
        }
    },
    CreateAll: function(cells_info) {
        _Error.ThrowTypeIf(!cells_info || !obj_length(cells_info), 'need resources');
        if (this.elements.filled) return;

        for (var coo in cells_info) {
            coo = this.parent.getCooArray(coo);
            var dir = {top:1,bottom:1,left:1,right:1};

            if (coo[0] === 0) delete dir.top;
            if (coo[1] === 0) delete dir.left;
            if (coo[0] === this.parent.height-1 || this.parent.getRes(coo[0]+1, coo[1])) delete dir.bottom;
            if (coo[1] === this.parent.width-1 || this.parent.getRes(coo[0], coo[1]+1)) delete dir.right;

            this.elements.Create(Object.keys(dir), coo, true);// enabled
        }

        this.elements.filled = true;
    },

    getCooArray: function(str) {
        return this.parent.getCooArray(str);
    },
    getRes: function(i,j) {
        return this.parent.getRes(i,j);
    },
    getCell: function(pos) {
        return this.parent.getCell(pos);
    },
    getCooStr: function(i,j) {
        return this.parent.getCooStr(i,j);
    },

    get: function(o) {
        return o.coo ? this.elements.get(o) : this.elements.getElem(o.added);
    },
    set: function(o) {
        o.element.addClass('added');
        this.elements.set(o);
    },
    ObjectIsSet: function(elem) {
        return $(elem).is('.added');
    },

    getNearest: function() {
        return this.elements.getNearest();
    },
    getAddedObjects: function(type) {
        return this.parent.getHover({type: type, added: true});
    },

    Hide: function() {
        this.parent.removeType();
    },
    Show: function() {
        this.parent.setType(this.type);
    },
    Toggle: function(show) {
        return this[(show ? 'Show' : 'Hide')]();
    }
};
