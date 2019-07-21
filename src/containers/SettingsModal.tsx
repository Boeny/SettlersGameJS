import React from 'react';
import { inject } from 'mobx-react';
import { SettingsModal as Component } from 'components/SettingsModal';
import { IGameStore } from 'stores/GameStore';

interface IProps {
    visible: boolean;
    onCancel?: () => void;
    gameStore?: IGameStore;
}

@inject()
export class SettingsModal extends React.PureComponent<IProps> {

    render() {

        const { gameStore, visible, onCancel } = this.props;

        return (
            <Component
                visible={visible}
                onSubmit={gameStore!.newGame}
                onCancel={onCancel}
            />
        );
    }
}
