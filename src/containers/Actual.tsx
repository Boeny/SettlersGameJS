import React from 'react';
import { inject, observer } from 'mobx-react';

interface IComponentProps {

}

class Component extends React.PureComponent<IComponentProps> {

    render() {

        return (
            <div className="actual" />
        );
    }
}

@inject()
@observer
export class Actual extends React.PureComponent<{ context?: IGameStore }> {

    render() {

        const { gameStore } = this.props.context!;

        return (
            <Component data={gameStore.map.data} />
        );
    }
}
