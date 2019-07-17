
export class ViewsMapHoverLine {

    cached = {};
    added = {};

    constructor(o) {
        $.extend(this, o);
    }

    create(direction, pos, enabled) {
        const cell_elem = this.getCell(pos);

        for (const i in direction)
        {
            const dir = direction[i];
            const coo = [pos[0],pos[1]];

            if (dir === 'bottom') coo[0]++;
            if (dir === 'right') coo[1]++;

            if (this.get(coo, dir)) continue;

            coo = this.getCooStr(coo);
            const hover_elem = $(this.html.div({
                'class': (enabled?'':'disabled ')+'line line-'+dir,
                'data-coo': coo,
                'data-dir': dir,
                'data-type': this.type
            }));
            this.set({element: hover_elem, coo: coo, direction: dir});
            cell_elem.append(hover_elem);
        }
    }

    getNearest() {
        const result = [];

        const objects = this.parent.getAddedObjects('village');
        const elem, coo, cell_pos, direction, line_dir;

        for (const pos in objects) {
            direction = objects[pos].data('dir');
            pos = this.parent.getCooArray(pos);
            coo = [pos, [pos[0]-1,pos[1]], [pos[0],pos[1]-1]];

            for (const i in coo) {
                cell_pos = [pos[0],pos[1]];

                switch (+i) {
                    case 0:
                        line_dir = ['top','left'];
                        break;
                    case 1:
                        cell_pos[0]--;
                        line_dir = ['left'];
                        break;
                    case 2:
                        cell_pos[1]--
                        line_dir = ['top'];
                        break;
                }

                if (!this.parent.getRes(cell_pos)) {
                    if (!this.parent.getRes(cell_pos[0],cell_pos[1]-1)) {
                        line_dir = line_dir.filter(x => x !== 'left');
                    }
                    if (!this.parent.getRes(cell_pos[0]-1,cell_pos[1])) {
                        line_dir = line_dir.filter(x => x !== 'top');
                    }
                }

                if (!line_dir.length) continue;

                elem = this.get(coo[i], line_dir, true);// returns array

                if (!elem.length) {
                    this.create(line_dir, cell_pos);
                    elem = this.get(coo[i], line_dir, true);// returns array
                    if (!elem || !elem.length) _Error.ThrowType('line elements coo='+this.getCooStr(coo[i])+' in cell coo='+this.getCooStr(cell_pos)+' not found');
                }

                for (const j in elem) {
                    if (!this.parent.ObjectIsSet(elem[j])) result.push(elem[j]);
                }
            }
        }

        return result;
    }

    get(o, dir, as_array) {
        if (as_array)
        {
            const result = [];
            const elem;

            for (const i in dir) {
                elem = this.get(o, dir[i]);
                if (elem) result.push(elem);
            }

            return result;
        }

        return this.getElem(o.added)[this.getCooStr(o)];
    }

    set(o) {
        this.getElem(o.added)[this.getCooStr(o)] = o.element;
    }

    getElem(added) {
        return this[added ? 'added' : 'cached'];
    }

    getCooStr(o: object | number[]): string {
        o.coo = this.parent.getCooStr(o.coo);
        if (o.direction) o.coo = this.parent.getCooStr(o.coo, o.direction);
        return o.coo;
    }
}
