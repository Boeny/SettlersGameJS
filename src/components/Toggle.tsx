import React from "react";

interface IProps {
    button: (p: { onClose: () => void, onClick: () => void }) => JSX.Element;
    popup: (p: { onClose: () => void, visible: boolean }) => JSX.Element;
}

interface IState {
    visible: boolean;
}

export class Toggle extends React.PureComponent<IProps, IState> {

    state: IState = { visible: false };

    toggle = (visible: boolean) => this.setState({ visible });

    public render() {

        return (
            <React.Fragment>
                <this.props.button
                    onClick={() => this.toggle(true)}
                    onClose={() => this.toggle(false)}
                />
                <this.props.popup
                    visible={this.state.visible}
                    onClose={() => this.toggle(false)}
                />
            </React.Fragment>
        );
    }
}
