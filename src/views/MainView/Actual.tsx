import React from 'react';

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
export class Actual extends React.PureComponent<{ context?: IGameContext }> {

    render() {

        const { gameStore } = this.props.context!;

        return (
            <Component data={gameStore.map.data} />
        );
    }
}
