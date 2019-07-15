import React from 'react';

interface IComponentProps {

}

class Component extends React.PureComponent<IComponentProps> {

    render() {

        return (
            <div className="description">
                <div className="receipt disabled">
                    {objects.map(o =>
                        <React.Fragment>
                            {o.resources.map(res => <div className="resource">{res}</div>)}
                            <div>{o.name}</div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        );
    }
}

@inject()
@observer
export class Description extends React.PureComponent<{ context?: IGameContext }> {

    render() {

        const { gameStore } = this.props.context!;

        return (
            <Component data={gameStore.map.data} />
        );
    }
}
