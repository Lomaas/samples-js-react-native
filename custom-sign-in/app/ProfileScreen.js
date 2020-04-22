﻿/*
 * Copyright (c) 2019, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button
} from 'react-native';
import { getAccessToken, getUser, clearTokens } from '@okta/okta-react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Error from './components/Error';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: null,
      user: null,
      progress: true,
      error: ''
    };

    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => <Button onPress={this.logout} title="Logout" />,
    });

    Promise.all([getUser(), getAccessToken()])
      .then(([user, token]) => {
        this.setState({
          progress: false,
          user,
          accessToken: token.access_token
        });
      })
      .catch(e => {
        console.log(e.code, e.message);
        this.setState({ progress: false, error: e.message });
      });
  }

  logout() {
    clearTokens()
      .then(() => {
        this.props.navigation.navigate('Login');
      })
      .catch(e => {
        this.setState({ error: e.message })
      });
  }

  render() {
    const { user, accessToken, error, progress } = this.state;

    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Spinner
            visible={progress}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <Error error={error} />
          { user && 
            <Text style={styles.titleHello}>
              Hello {user.name}
            </Text> 
          }
          { accessToken &&
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenTitle}>Access Token:</Text>
              <Text style={{ marginTop: 20 }}>{accessToken}</Text>
            </View>
          }
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
  button: {
    borderRadius: 40,
    width: 200,
    height: 40,
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  titleHello: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
    paddingTop: 40,
    textAlign: 'center',
  },
  titleDetails: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingTop: 15,
    textAlign: 'center',
  },
  tokenContainer: {
    marginTop: 60, 
    marginLeft: 20, 
    marginRight: 20, 
    height: 140
  },
  tokenTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});
