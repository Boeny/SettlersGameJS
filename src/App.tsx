import React from 'react';
import { SettingsModal } from 'components/SettingsModal';

export const App: React.FC = () => {
    return (
        <div className="App">
            <SettingsModal
                title="Введите кол-во игроков:"
                autoFocus={true}
                playerCount={2}
                mapWidth={5}
                mapHeight={5}
                onSubmit={Create}
            />
        </div>
    );
};
