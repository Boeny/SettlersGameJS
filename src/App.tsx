import React from 'react';
import { Provider } from 'mobx-react';
import { MainView } from 'views/MainView';

export function App() {

    return (
        <div className="App">
            <Provider context={new GameStore()}>
                <MainView />
            </Provider>
        </div>
    );
}
