
type Direction = ('top' | 'bottom' | 'left' | 'right')[];

export class ViewsMapHoverCorner {

    filled = false;
    cached = {};
    added = {};

    constructor(private type: string) {}

    create(direction: Direction, pos, enabled) {
        if (
            !direction.includes('left') && !direction.includes('right') ||
            !direction.includes('top') && !direction.includes('bottom')
        ) {
            return;
        }

        const cell_elem = this.getCell(pos);
        const vert = [], hor = [], dir;

        for (const i in direction) {
            dir = direction[i];

            if (dir === 'top' || dir === 'bottom')
                vert.push(dir)
            else
                hor.push(dir);
        }

        for (const i in vert) {
            for (const j in hor) {
                const coo = [pos[0],pos[1]];

                if (vert[i] === 'bottom') coo[0]++;
                if (hor[j] === 'right') coo[1]++;

                coo = this.getCooStr(coo);
                if (this.get(coo)) continue;

                dir = this.getCooStr(vert[i], hor[j]);
                const hover_elem = $(this.html.div({
                    'class': (enabled?'':'disabled ')+'corner '+dir,
                    'data-coo': coo,
                    'data-dir': dir,
                    'data-type': this.type
                }));
                this.set({element: hover_elem, coo: coo});
                cell_elem.append(hover_elem);
            }
        }
    }

    getNearest() {
        const result = [];
        const objects = this.parent.getAddedObjects('road');
        const elem, coo, cell_pos, direction, corner_dir;

        for (const pos in objects) {
            direction = objects[pos].data('dir');
            pos = this.parent.getCooArray(pos);
            coo = [pos];
            cell_pos = [pos[0],pos[1]];
            corner_dir = ['top','left'];

            switch (direction) {
                case 'top':
                case 'bottom':
                    coo.push([pos[0],pos[1]+1]);
                    if (direction === 'bottom') cell_pos[0]--;
                    corner_dir[0] = direction;
                    break;

                case 'left':
                case 'right':
                    coo.push([pos[0]+1,pos[1]]);
                    if (direction === 'right') cell_pos[1]--;
                    corner_dir[1] = direction;
                    break;
            }

            for (const i in coo) {
                elem = this.get(coo[i]);

                if (!elem) {
                    this.create(i === 0 ? ['top','left'] : corner_dir, cell_pos);
                    elem = this.get(coo[i]);
                    if (!elem) _Error.ThrowType('corner element coo='+this.getCooStr(coo[i])+' in cell coo='+this.getCooStr(cell_pos)+' not found');
                }

                if (!this.parent.ObjectIsSet(elem)) result.push(elem);
            }
        }

        return result;
    },

    get(o) {
        return this.getElem(o.added)[this.getCooStr(o.coo)];
    }

    set(o) {
        this.getElem(o.added)[this.getCooStr(o.coo)] = o.element;
    }

    getElem(added) {
        return this[added ? 'added' : 'cached'];
    }

    getCooStr(i,j) {
        return this.parent.getCooStr(i,j);
    }
}
