import React from 'react';
import { observer } from 'mobx-react';

@observer
export class Cell extends React.Component<{ context?: IGameStore }> {

    render() {

        return (
            <td className="cell">
                {
                    cell.resource
                        ? <div className={`num ${this.getProbabiltyClass(cell.dice)}`}>{cell.dice.digit}</div>
                        : null
                }
            </td>
        );
    }
}
