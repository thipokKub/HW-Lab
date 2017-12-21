import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper'
import initStore from '../redux/store';
import rootActions from '../redux/actions/index';

import Router from 'next/router'
import NProgress from 'nprogress'
import Head from 'next/head';
import _ from 'lodash';

import { time_pageDelay,
    enableNProgress,
    enableRandomPageDelay,
    randomPageDelayRatio
} from '../constraint/variables';

import { randomRatio } from '../function/general';

Router.onRouteChangeStart = (url) => {
    if (enableNProgress) NProgress.start()
}
Router.onRouteChangeComplete = () => {
    if (enableNProgress) {
        setTimeout(() => {
            NProgress.done()
        }, enableRandomPageDelay ? randomRatio(time_pageDelay, randomPageDelayRatio) : time_pageDelay);
    }
}
Router.onRouteChangeError = () => {
    if (enableNProgress) {
        setTimeout(() => {
            NProgress.done()
        }, enableRandomPageDelay ? randomRatio(time_pageDelay, randomPageDelayRatio) : time_pageDelay);
    }
}

export default function (ComposedComponent, options) {
    class connecting extends Component {
        render() {
            const stylesheets = _.get(options, 'stylesheets', []);
            const title = _.get(options, 'title');
            const childrens = _.get(options, 'childrens')
            const icon = _.get(options, 'icon');
            let innerJsx = [];

            if (title) innerJsx.push(<title key={-1}>{title}</title>)
            if(icon && typeof icon === "string") innerJsx.push(<link key={-2} rel="icon" href={icon} />)
            if(childrens && childrens.constructor === Array && childrens.length > 0) innerJsx.concat(childrens);

            if (stylesheets !== null && typeof stylesheets !== "undefined" && stylesheets.constructor === Array) {
                let isValidate = stylesheets.reduce((bool, txt) => {
                    if (bool) return bool && typeof txt === "string";
                    return bool;
                }, true);
                if (isValidate) {
                    innerJsx = innerJsx.concat(stylesheets.map((txt, index) => {
                        return (<style key={`style_${index}`} dangerouslySetInnerHTML={{ __html: txt }} />);
                    }));
                }
            }

            if(innerJsx.length > 0) {
                return (
                    <div>
                        <Head>
                            {innerJsx}
                        </Head>
                        <ComposedComponent {...this.props}>
                            {this.props.children}
                        </ComposedComponent>
                    </div>
                );
            }
            
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
    return withRedux(initStore, mapStateToProps, mapDispatchToProps)(connecting);
}
