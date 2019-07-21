import React from 'react';
import { Button } from './Button';

// tslint:disable-next-line: no-use-before-declare
interface IComponentProps {
    title: string;
    autoFocus: boolean;
    playerCount: number;
    mapWidth: number;
    mapHeight: number;
    className?: string;
    onChange: (data: Partial<IState>) => void;
    onSubmit: () => void;
    onCancel?: () => void;
}

function SettingsModalComponent(props: IComponentProps) {

    const { title, autoFocus, playerCount, mapWidth, mapHeight, className, onChange, onSubmit, onCancel } = props;

    return (
        <div className={`modal-message prompt${className ? ` ${className}` : ''}`}>
            <div className="overlay" onClick={onCancel} />

            <div className="container">
                <div className="title">{title}</div>
                <form>
                    <div>
                        <input
                            value={playerCount}
                            autoFocus={autoFocus}
                            required
                            onChange={e => onChange({ playerCount: parseInt(e.target.value, 10) })}
                        />
                    </div>
                    <div>
                        <Select
                            selected={mapWidth}
                            options={range(5, 10)}
                            onChange={mapWidth => onChange({ mapWidth })}
                        />
                        <Select
                            selected={mapHeight}
                            options={range(5, 10)}
                            onChange={mapHeight => onChange({ mapHeight })}
                        />
                    </div>
                    <div>
                        <Button
                            type="submit"
                            text="OK"
                            className="button"
                            onClick={e => {
                                e.preventDefault();
                                onSubmit();
                            }}
                        />
                        {
                            onCancel
                                ? <span className="btn cancel" onClick={onCancel}>Отмена</span>
                                : null
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}

interface IProps {
    visible: boolean;
    onSubmit: (playerCount: number, mapWidth: number, mapHeight: number) => void;
    onCancel?: () => void;
}

interface IState {
    playerCount: number;
    mapWidth: number;
    mapHeight: number;
}

export class SettingsModal extends React.PureComponent<IProps> {

    state: IState = { playerCount: 2, mapWidth: 5, mapHeight: 5 };

    onChange = (data: Partial<IState>) => {
        if (!data.playerCount || data.playerCount <= 1) {
            return;
        }
        this.setState(data);
    }

    render() {

        const { visible, onSubmit, onCancel } = this.props;
        const { playerCount, mapWidth, mapHeight } = this.state;

        return (
            <SettingsModalComponent
                title="Введите кол-во игроков:"
                autoFocus={true}
                playerCount={playerCount}
                mapWidth={mapWidth}
                mapHeight={mapHeight}
                className={visible ? '' : 'hidden'}
                onChange={this.onChange}
                onSubmit={() => {
                    onCancel && onCancel();
                    onSubmit(playerCount, mapWidth, mapHeight);
                }}
                onCancel={onCancel}
            />
        );
    }
}
