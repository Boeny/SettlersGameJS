import React from 'react';
import { SettingsModal } from 'components/SettingsModal';
import { MainView } from 'views/MainView';

export const App: React.FC = () => {
    return (
        <div className="App">
            <SettingsModal
                title="Введите кол-во игроков:"
                autoFocus={true}
                onSubmit={gameStore.Create}
            />
            <MainView />
        </div>
    );
};
