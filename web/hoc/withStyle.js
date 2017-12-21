import React, { Component } from 'react';
import Head from 'next/head';
import _ from 'lodash';

export default function (ComposedComponent, stylesheets) {
    return class withStyle extends Component {
        render() {
            if (stylesheets !== null && typeof stylesheets !== "undefined" && stylesheets.constructor === Array) {
                let isValidate = stylesheets.reduce((bool, txt) => {
                    if (bool) return bool && typeof txt === "string";
                    return bool;
                }, true);
                if (isValidate) {
                    return (
                        <div>
                            <Head>
                                {
                                    stylesheets.map((txt, index) => {
                                        return (<style key={index} dangerouslySetInnerHTML={{ __html: txt }} />);
                                    })
                                }
                            </Head>
                            <ComposedComponent {...this.props}>
                                {this.props.children}
                            </ComposedComponent>
                        </div>
                    );
                }
            }

            return (
                <ComposedComponent {...this.props}>
                    {this.props.children}
                </ComposedComponent>
            );
        }
    };
}
