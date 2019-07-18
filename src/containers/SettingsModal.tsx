import React from 'react';
import { inject } from 'mobx-react';
import { SettingsModal as Component } from 'components/SettingsModal';

@inject()
export class SettingsModal extends React.PureComponent<{ context?: IGameStore }> {

    render() {

        const { gameStore } = this.props.context!;

        return (
            <Component
                title="Введите кол-во игроков:"
                autoFocus={true}
                onSubmit={gameStore.create}
            />
        );
    }
}
