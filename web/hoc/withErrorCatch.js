import React, { Component } from 'react';
import _ from 'lodash';

export default function (ComposedComponent, params) {

    return class withErrorCatch extends Component {

        constructor(props) {
            super(props);
            this.state = {
                hasError: false
            }
        }

        componentDidMount() {
            this._isMounted = true;
        }

        componentWillUnmount() {
            this._isMounted = false;
        }

        componentDidCatch(error, info) {
            if(this._isMounted) {
                this.setState((prevState) => {
                    return ({
                        ...prevState,
                        hasError: true
                    });
                });
            }

            if(params && typeof params.onError === "function") params.onError(error, info);
        }

        render() {
            const alternative = _.get(params, 'onErrorJSX', () => <span>{`Sorry, something went wrong :-(`}</span>)(this.props);
            if(this.state.hasError) {
                return alternative;
            }

            return (
                <ComposedComponent
                    {...this.props}
                >
                    {this.props.children}
                </ComposedComponent>
            );
        }
    }

    return withErrorCatch;
}