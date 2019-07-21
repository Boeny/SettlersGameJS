import React from 'react';

interface IProps extends React.HTMLProps<HTMLButtonElement> {
    onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
    type?: 'button' | 'submit' | 'reset';
    text?: string;
    children?: JSX.Element;
}

export class Button extends React.PureComponent<IProps> {

    render() {

        const { children, text, ...rest } = this.props;

        return (
            <button {...rest}>
                {text || children}
            </button>
        );
    }
}
