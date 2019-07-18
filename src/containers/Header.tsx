import React from 'react';
import { inject } from 'mobx-react';

interface IComponentProps {
    onNewGame(): void;
    onStep(): void;
}

function Component(props: IComponentProps) {
    return (
        <div className="header">
            <Button
                text="Новая игра"
                className="start_btn btn"
                onClick={props.onNewGame}
            />
            <Button
                text="Завершить ход"
                className="step_btn btn disabled"
                onClick={props.onStep}
            />
        </div>
    );
}

@inject()
export class Header extends React.PureComponent<{ context?: IGameStore }> {

    render() {

        const { gameStore } = this.props.context!;

        return (
            <Component
                onNewGame={gameStore.onNewGame}
                onStep={gameStore.onStep}
            />
        );
    }
}
