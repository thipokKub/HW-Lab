import React, { Component } from 'react';
import PropTypes from 'prop-types';

const defaultStyle = {
    display: 'inline-block'
}

class OutsideClick extends Component {
    constructor(props) {
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        document.addEventListener('ontouchstart', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('ontouchstart', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if(this._node && !this._node.contains(event.target)) {
            this.props.onClickOutside(event);
        }
    }

    render() {
        const style = (this.props.style) ? this.props.style : defaultStyle;

        return (
            <div
                ref={(node) => {
                    this._node = node;
                    if (this.props.wrappedRef) this.props.wrappedRef(node);
                }}
                style={style}
                className={this.props.className ? this.props.className : ''}
            >
                {this.props.children}
            </div>
        );
    }
}

OutsideClick.PropTypes = {
    onClickOutside: PropTypes.func.isRequired,
    style: PropTypes.objectOf(PropTypes.string),
    className: PropTypes.string,
    wrappedRef: PropTypes.func
}

export default OutsideClick;