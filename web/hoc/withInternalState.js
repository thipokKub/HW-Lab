import React, { Component } from 'react';

export default function (ComposedComponent, initialState) {
    
    return class withInternalState extends Component {
        constructor(props) {
            super(props);
            this.state = {
                ...((initialState) ? initialState : {})
            }
            this.onSetState = this.onSetState.bind(this);
        }

        componentDidMount() {
            this._isMounted = true;
        }

        componentWillUnmount() {
            this._isMounted = false;
        }

        onSetState(name, value) {
            if(this._isMounted) {
                this.setState((prevState) => {
                    let new_state = { ...prevState };
                    new_state[name] = value;
                    return {
                        ...new_state
                    }
                })
            }
        }

        render() {
            return (
                <ComposedComponent
                    {...this.props}
                    onSetState={this.onSetState}
                    state={this.state}
                >
                    {this.props.children}
                </ComposedComponent>
            );
        }
    }

    return withInternalState;
}