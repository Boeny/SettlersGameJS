import React from 'react';
import { inject } from 'mobx-react';
import { Button } from 'components/Button';
import { IGameStore } from 'stores/GameStore';
import { Toggle } from 'components/Toggle';
import { SettingsModal } from 'containers/SettingsModal';

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
export class Header extends React.PureComponent<{ gameStore?: IGameStore }> {

    render() {

        const { gameStore } = this.props!;

        return (
            <Toggle
                button={p =>
                    <Component
                        onNewGame={p.onClick}
                        onStep={() => gameStore!.onStep()}
                    />
                }
                popup={p =>
                    <SettingsModal
                        visible={p.visible}
                        onCancel={p.onClose}
                    />
                }
            />
        );
    }
}
