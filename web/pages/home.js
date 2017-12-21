import React, { Component } from 'react';
import pageConnect from '../hoc/pageConnect';
import Link from 'next/link';
import StyledPage from '../component/PageComponent'
import Button from '../component/Button';
import MachineConsole from '../component/MachineConsole';
import { firebaseGet, firebaseSet, firebaseGetUID, firebasePush } from '../function/general';
import { geolocated } from 'react-geolocated';
import _ from 'lodash';

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false,
            machineIDs: [],
            location: {
                latitude: -1,
                longitude: -1
            },
            intervalSet: null
        }
    }

    componentWillMount() {
        firebaseGet(`users/${firebaseGetUID()}/private/machines`, (data) => {
            this.setState({
                isLoad: true,
                machineIDs: Object.keys(data),
                location: {
                    latitude: _.get(this.props, 'coords.latitude', -1),
                    longitude: _.get(this.props, 'coords.longitude', -1)
                },
                intervalSet: setInterval(() => {
                    firebasePush(`users/${firebaseGetUID()}/private/history/`, {
                        latitude: _.get(this.props, 'coords.latitude', -1),
                        longitude: _.get(this.props, 'coords.longitude', -1),
                        timestamp: new Date().toISOString()
                    });

                    firebaseSet(`users/${firebaseGetUID()}/private/location`, {
                        latitude: _.get(this.props, 'coords.latitude', -1),
                        longitude: _.get(this.props, 'coords.longitude', -1)
                    });

                    this.setState({
                        location: {
                            latitude: _.get(this.props, 'coords.latitude', -1),
                            longitude: _.get(this.props, 'coords.longitude', -1)
                        }
                    })
                }, 1000)
            })
        })

        this.geoLocated = setInterval(() => {
            navigator.geolocation.getCurrentPosition((pos) => {

                if (this.state.location.latitude !== _.get(pos, 'coords.latitude', -1) ||
                    this.state.location.longitude !== _.get(pos, 'coords.longitude', -1)
                ) {
                    firebasePush(`users/${firebaseGetUID()}/private/history/`, {
                        latitude: _.get(pos, 'coords.latitude', -1),
                        longitude: _.get(pos, 'coords.longitude', -1),
                        timestamp: new Date().toISOString()
                    });

                    firebaseSet(`users/${firebaseGetUID()}/private/location`, {
                        latitude: _.get(pos, 'coords.latitude', -1),
                        longitude: _.get(pos, 'coords.longitude', -1)
                    });

                    this.setState({
                        location: {
                            latitude: _.get(pos, 'coords.latitude', -1),
                            longitude: _.get(pos, 'coords.longitude', -1)
                        }
                    })
                }
            }, (e) => {}, options);
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalSet);
        clearInterval(this.geoLocated);
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(() => {
                console.log("Success")
            }, () => {
                console.log("Error")
            });
        } else {
            st.onNotSupportedBrowser();
        }
    }

    render() {
        const { isLoad, machineIDs } = this.state;

        return (
            <StyledPage>
                <nav className="head">
                    <i className="fa fa-home mar-r-5" /> Home
                </nav>
                <div className="body">
                    <MachineConsole isLoad={isLoad} machineIDs={machineIDs} />
                    <Link href="/index">
                        <Button color="rgba(255,0,0,0.8)">
                            Logout
                    </Button>
                    </Link>
                </div>
            </StyledPage>
        );
    }
} 

export default pageConnect(geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
})(Home), {
    title: 'Home'
});