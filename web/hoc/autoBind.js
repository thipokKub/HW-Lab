import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import rootActions from '../redux/actions/index';

export default function (ComposedComponent, option) {
    class binding extends Component {
        render() {
            return (
                <ComposedComponent {...this.props}>
                    {this.props.children}
                </ComposedComponent>
            );
        }
    };
    function mapStateToProps(state) {
        return { ...state };
    }
    function mapDispatchToProps(dispatch) {
        return bindActionCreators({ ...rootActions }, dispatch);
    }
    return connect(mapStateToProps, mapDispatchToProps)(binding);
}
