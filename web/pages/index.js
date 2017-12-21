import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router'
import Head from 'next/head';
import pageConnect from '../hoc/pageConnect';
import _ from 'lodash';
import { firebaseLogin, setCookie } from '../function/general';
import styled from 'styled-components';
import Button from '../component/Button';

const StyledIndex = styled.div`
background: linear-gradient(to bottom right, #DD9FBF, #6100DB);
width: 100%;
height: 100vh;
display: flex;
flex-direction: column;

nav.head {
    background-color: #8024C4;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
}

.body {
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
}

img.logo {
    max-width: 30vw;
    min-width: 350px;
    margin-bottom: 35px;
}

.fa.fa-facebook {
    font-size: 1.5em;
    margin-left: 10px;
}
`;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geolocationState: -1
        }
    }

    onLogin() {
        firebaseLogin((result) => {
            Router.push({
                pathname: '/home'
            });
        });
    }

    forceLogin() {
        setCookie({
            name: 'uid',
            value: 'p2AmrMWJNjTjTBQnAWQqc7ndcaf2',
            day: 1
        });
        Router.push({
            pathname: '/home'
        });
    }

    render() {
        return (
            <StyledIndex>
                <div className="body">
                    <img className="logo" src="/static/resources/LogoHW.png" />
                    <Button
                        outline
                        onClick={this.onLogin}
                    >
                        Login with Facebook
                        <i className="fa fa-facebook" />
                    </Button>
                    <Button
                        outline
                        onClick={this.forceLogin}
                    >
                        Demo test
                    </Button>
                </div>
            </StyledIndex>
        );
    }
}

export default pageConnect(Index, {
    title: 'Login'
})