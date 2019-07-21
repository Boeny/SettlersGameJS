import React from 'react';
import { observer, inject } from 'mobx-react';
import { IGameStore, ICell, CellType } from 'stores/GameStore';

interface IProps {
    cell: ICell;
    gameStore?: IGameStore;
}

inject();
@observer
export class Cell extends React.Component<IProps> {

    getProbabiltyClass(probability: number): string {
        return '';
    }

    getColorClass(cellType: CellType): string {
        return '';
    }

    render() {

        const { cell, gameStore } = this.props;
        const classes = ['num', this.getColorClass(cell.type)];
        const dice = gameStore!.isResourceCell(cell) ? cell.dice : null;

        if (dice) {
            classes.push(this.getProbabiltyClass(dice.probability));
        }

        return (
            <td className="cell">
                <div className={classes.join(' ')}>
                    {dice ? dice.digit : null}
                </div>
            </td>
        );
    }
}
