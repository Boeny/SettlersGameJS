import React from 'react';
import { inject, observer } from 'mobx-react';

interface IComponentProps {
    data: ICell[][];
}

class Component extends React.PureComponent<IComponentProps> {

    getProbabilityClass(dice: IDice): string {

        if (dice.probability > 0.75) {
            return 'max';
        }
        if (dice.probability > 0.25) {
            return 'avg';
        }
        return 'min';
    }

    render() {

        return (
            <div className="map">
                <table>
                    {data.map(row =>
                        <tr>
                            {row.map(cell =>
                                <td className="cell">
                                    {
                                        cell.resource
                                        ? <div className={`num ${this.getProbabiltyClass(cell.dice)}`}>{cell.dice.digit}</div>
                                        : null
                                    }
                                </td>
                            )}
                        </tr>
                    )}
                </table>
            </div>
        );
    }
}

@inject()
@observer
export class Map extends React.PureComponent<{ context?: IGameStore }> {

    render() {

        return (
            <Component data={this.props.context!.gameStore.map.data} />
        );
    }
}