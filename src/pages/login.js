/**
 * Created by dunice on 20.03.17.
 */
import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableHighlight,
  Image
} from 'react-native'

const LoginView = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View,
})();

import TopBar from '../components/topBar';
import Button from '../components/button';
import * as firebase from 'firebase';


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDXC-et6TPoJf9PK-3cJQKqoj3m_X7RhDw",
  authDomain: "damessenger-315bf.firebaseapp.com",
  databaseURL: "https://damessenger-315bf.firebaseio.com",
  storageBucket: "",
};

//firebase.initializeApp(firebaseConfig);
//import SendBird from 'sendbird'
//var sb = null;

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectLabel: 'CONNECT',
      userEmail: '',
      password: '',
      response: '',
      buttonDisabled: false,
    };
    this._onPressConnect = this._onPressConnect.bind(this);
    this._notRegistered = this._notRegistered.bind(this);
  }

  async login() {

    Keyboard.dismiss();

    //DismissKeyboard();

    try {
      await firebase.auth().signInWithEmailAndPassword('W@w.ww', '123456');//this.state.userEmail, this.state.password); //'t@t.tt','123456');

      this.setState({
        response: "Logged In!"
      });

      setTimeout(() => {
        this.props.navigator.push({
          name: "mesContainer"
        })
      }, 1500);

    } catch (error) {
      this.setState({
        response: error.toString()
      })
    }

  }

  componentDidMount(){
    //sb = SendBird.getInstance();
    //console.log('before--->',sb.getConnectionState());
      //sb.disconnect();
      var _SELF = this;
      _SELF.setState({
        buttonDisabled: false,
        connectLabel: 'CONNECT',
      });
    //console.log('after--->',sb.getConnectionState());
  }

  _onPressConnect() {
    Keyboard.dismiss();

    if (this.state.userEmail.trim().length == 0 || this.state.password.trim().length == 0) {
      this.setState({
        userEmail: '',
        password: '',
        errorMessage: 'Value is required and can\'t be empty'
      });
      return;
    }

    let regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
    if (regExp.test(this.state.userEmail) || regExp.test(this.state.password)) {
      this.setState({
        buttonDisabled: false,
        userEmail: '',
        password: '',
        errorMessage: 'Please use only alphanumeric characters.'
      });
      return;
    }

    this.setState({
      errorMessage: '',
      buttonDisabled: true,
      connectLabel: 'CONNECTING...'
    });

    sb = SendBird.getInstance();
    var _SELF = this;
    sb.connect(_SELF.state.userEmail, function (user, error) {
      if (error) {
        _SELF.setState({
          buttonDisabled: false,
          userEmail: '',
          password: '',
          errorMessage: 'Login Error'
        });
        console.log(error);
        return;
      }

      if (Platform.OS === 'ios') {
        if (sb.getPendingAPNSToken()){
          sb.registerAPNSPushTokenForCurrentUser(sb.getPendingAPNSToken(), function(result, error){
            console.log("APNS TOKEN REGISTER AFTER LOGIN");
            console.log(result);
          });
        }
      } else {
        if (sb.getPendingGCMToken()){
          sb.registerGCMPushTokenForCurrentUser(sb.getPendingGCMToken(), function(result, error){
            console.log("GCM TOKEN REGISTER AFTER LOGIN");
            console.log(result);
          });
        }
      }

      sb.OpenChannel.getChannel('DASBchannel_1', function (channel, error) {
        if (error) {
          console.error(error);
          return;
        }

        channel.enter(function(response, error){
          if (error) {
            console.error(error);
            return;
          }
          _SELF.props.navigator.push({name: 'chat', channel: channel});
        });
      });

    });
  }

  _onBackPress() {
    this.props.navigator.pop();
  }

  _notRegistered(){
    this.props.navigator.pop();
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

  render() {
    return (
      <LoginView behavior='padding' style={styles.container} >
        <View style={styles.topbar}>
          <TopBar
            onBackPress={this._onBackPress.bind(this)}
            title={'Login'}
          />
        </View>

        <View style={styles.loginContainer}>
          <TextInput
            style={styles.input}
            value={this.state.userEmail}
            onChangeText={(text) => this.setState({userEmail: text})}
            onSubmitEditing={Keyboard.dismiss}
            placeholder={'Enter User Email'}
            maxLength={20}
            multiline={false}
          />

          <TextInput
            style={[styles.input, {marginTop: 10}]}
            value={this.state.password}
            onChangeText={(text) => this.setState({password: text})}
            onSubmitEditing={Keyboard.dismiss}
            placeholder={'Enter User Password'}
            maxLength={12}
            multiline={false}
          />

          <Button
            text={this.state.connectLabel}
            disabled={this.state.buttonDisabled}
            style={this._buttonStyle()}
            onPress={this.login.bind(this)} //_onPressConnect}
          />

          <Text style={styles.errorLabel}>{this.state.response}</Text>

          <TouchableHighlight
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={this._notRegistered}
            underlayColor={'#fff'}
          >
            <Text style={styles.registeredLabel}>Not registered?</Text>
          </TouchableHighlight>



        </View>
      </LoginView>
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
  },
  input: {
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    borderColor: '#66aa33',
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  errorLabel: {
    color: '#ff0200',
    fontSize: 13,
    marginTop: 10,
    width: 250
  },
  registeredLabel:{
    color: '#000',
    fontSize: 15,
    marginTop: 80,
    width: 250,
    alignSelf: 'center',
    textAlign: 'center',
  }
});

