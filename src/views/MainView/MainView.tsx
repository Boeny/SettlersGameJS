import React from 'react';
import { Header } from './Header';
import { Map } from './Map';
import { Actual } from './Actual';
import { Description } from './Description';

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
        </React.Fragment>
    );
}
