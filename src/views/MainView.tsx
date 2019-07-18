import React from 'react';
import { Header } from '../containers/Header';
import { Map } from '../containers/Map';
import { Actual } from '../containers/Actual';
import { Description } from '../containers/Description';
import { SettingsModal } from 'containers/SettingsModal';

export function MainView() {

    return (
        <React.Fragment>
            <Header />
            <div className="game_field">
                <div className="map_container">
                    <Map />
                </div>
                <Actual />
            </div>
            <div className="bottom">
                <Description />
            </div>
            <SettingsModal />
        </React.Fragment>
    );
}
