import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'


import TopBar from '../components/topBar';
import Button from '../components/button'



export default class SwitchLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginLabel: 'Sign Up / Login',
      facebookLabel: 'Facebook Login'
    };
    this._onPressLogin = this._onPressLogin.bind(this);
    this._onPressFbLogin = this._onPressFbLogin.bind(this);
  }

  _onPressLogin() {
    this.props.navigator.push({name: 'signup'});
  }

  _onPressFbLogin() {
    this.props.navigator.push({name: 'fblogin'});
  }


  _buttonStyle() {
    return {
      backgroundColor: '#66aa33',
      underlayColor: '#448833',
      borderColor: '#66aa33',
      disabledColor: '#ababab',
      textColor: '#ffffff'
    }
  }


  _onBackPress() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.topbar}>
        <TopBar
          onBackPress={this._onBackPress.bind(this)}
          title={''}
        />
        </View>

        <View style={styles.loginContainer}>

          <Button
            text={this.state.loginLabel}
            style={this._buttonStyle()}
            onPress={this._onPressLogin}
          />

          <Button
            text={this.state.facebookLabel}
            style={this._buttonStyle()}
            onPress={this._onPressFbLogin}
          />

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  topbar: {
    height: 60,
    flexDirection: 'row'
  }
});
