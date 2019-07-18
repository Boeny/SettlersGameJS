import React from 'react';
import { inject, observer } from 'mobx-react';

interface IComponentProps {
    data: IRecipe[];
}

class Component extends React.PureComponent<IComponentProps> {

    render() {

        return (
            <div className="description">
                <div className="receipt disabled">
                    {this.props.data.map(recipe =>
                        <React.Fragment>
                            {recipe.resources.map(resource => <div className="resource">{resource.name}</div>)}
                            <div>{recipe.name}</div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        );
    }
}

@inject()
@observer
export class Description extends React.PureComponent<{ context?: IGameStore }> {

    render() {

        const { gameStore } = this.props.context!;

        return (
            <Component data={gameStore.map.data} />
        );
    }
}
