import React from 'react';

// tslint:disable-next-line: no-use-before-declare
interface IComponentProps {
    title: string;
    autoFocus: boolean;
    playerCount: number;
    mapWidth: number;
    mapHeight: number;
    className?: string;
    onChange: (data: Partial<IState>) => void;
    onSubmit: (e: Event) => void;
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
                            onClick={onSubmit}
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
    title: string;
    autoFocus: boolean;
    onSubmit: (playerCount: number, mapWidth: number, mapHeight: number) => void;
    showCancelBtn?: boolean;
    onCancel?: () => void;
}

interface IState {
    playerCount: number;
    mapWidth: number;
    mapHeight: number;
    visible: boolean;
}

export class SettingsModal extends React.PureComponent<IProps> {

    state: IState = { playerCount: 2, mapWidth: 5, mapHeight: 5, visible: true };

    onChange = (data: Partial<IState>) => {
        if (!data.playerCount || data.playerCount <= 1) {
            return;
        }
        this.setState(data);
    }

    close = () => {
        this.onChange({ visible: false });
    }

    render() {

        const { onSubmit, showCancelBtn } = this.props;
        const { playerCount, mapWidth, mapHeight, visible } = this.state;

        return (
            <SettingsModalComponent
                {...this.props}
                playerCount={playerCount}
                mapWidth={mapWidth}
                mapHeight={mapHeight}
                className={visible ? '' : 'hidden'}
                onChange={this.onChange}
                onSubmit={e => {
                    e.preventDefault();
                    this.close();
                    onSubmit(playerCount, mapWidth, mapHeight);
                }}
                onCancel={showCancelBtn ? this.close : undefined}
            />
        );
    }
}
