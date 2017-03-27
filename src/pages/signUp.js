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
  TouchableHighlight
} from 'react-native'

const LoginView = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View,
})();

import TopBar from '../components/topBar';
import Button from '../components/button';
import * as firebase from 'firebase';
//import SendBird from 'sendbird'
//var sb = null;

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDXC-et6TPoJf9PK-3cJQKqoj3m_X7RhDw",
  authDomain: "damessenger-315bf.firebaseapp.com",
  databaseURL: "https://damessenger-315bf.firebaseio.com",
  storageBucket: "",
};

//firebase.initializeApp(firebaseConfig);

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this._storageRef = firebase.storage().ref();

    this.state = {
      userNickname: '',
      userEmail: '',
      password: '',
      passwordConfirm: '',
      registerLabel: 'Register',
      response: '',
      defaultAvatar: '',
    };

    this._onPressRegister = this._onPressRegister.bind(this);
    this._alreadySignUp = this._alreadySignUp.bind(this);
  }

  componentDidMount(){
    this._storageRef.child('avatars/default/avatar-default.png').getDownloadURL().then((res)=>{
      this.setState({defaultAvatar: res});
    });
  }

  _onPressRegister() {

    Keyboard.dismiss();

    if (this.state.userNickname.trim().length == 0 || this.state.userEmail.trim().length == 0 || this.state.password.trim().length == 0 || this.state.passwordConfirm.trim().length == 0) {
      this.setState({
        userNickname: '',
        userEmail: '',
        password: '',
        passwordConfirm: '',
        response: 'Value is required and can\'t be empty'
      });
      return;
    }

    if (!(this.state.password === this.state.passwordConfirm)) {
      this.setState({
        userNickname: '',
        userEmail: '',
        password: '',
        passwordConfirm: '',
        response: 'Passwords don\'t match'
      });
      return;
    }

    let regExp = /[\s\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
    if (regExp.test(this.state.userNickname) || regExp.test(this.state.password) || regExp.test(this.state.passwordConfirm)) {
      this.setState({
        userNickname: '',
        userEmail: '',
        password: '',
        passwordConfirm: '',
        response: 'Please use only alphanumeric characters without spaces.'
      });
      return;
    }

    let regExpMail = /[\s\{\}\[\]\/?,;:|\)*~`!^\+<>\#$%&\\\=\(\'\"]/gi
    if (regExpMail.test(this.state.userEmail)) {
      this.setState({
        userNickname: '',
        userEmail: '',
        password: '',
        passwordConfirm: '',
        response: 'Please use only alphanumeric characters without spaces.'
      });
      return;
    }

    this.signup();
  }

  async signup() {
    try {
      await firebase.auth().createUserWithEmailAndPassword(this.state.userEmail, this.state.password);

      this.setState({
        response: "account created"
      });

      let user = firebase.auth().currentUser;
      let userId = user.uid;
      let imageUrl = user.photoURL;



      firebase.database().ref('users/' + userId).set({
        name: this.state.userNickname,
        uid: userId,
        profile_picture: this.state.defaultAvatar,
      });

      user.updateProfile({
        displayName: this.state.userNickname,
      });

      setTimeout(() => {
        this.props.navigator.push({
          name: "setAvatar"
        })
      }, 1500);

    } catch (error) {
      this.setState({
        response: error.toString()
      })
    }
  }

  _alreadySignUp(){
    this.props.navigator.push({name: 'login'})
  }

  _onBackPress() {
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
            title={'Sign up'}
          />
        </View>

        <View style={styles.loginContainer}>
          <TextInput
            style={styles.input}
            value={this.state.userNickname}
            onChangeText={(text) => this.setState({userNickname: text})}
            onSubmitEditing={Keyboard.dismiss}
            placeholder={'Enter User Nickname'}
            maxLength={12}
            multiline={false}
          />
          <TextInput
            style={[styles.input, {marginTop: 10}]}
            value={this.state.userEmail}
            onChangeText={(text) => this.setState({userEmail: text})}
            onSubmitEditing={Keyboard.dismiss}
            placeholder={'Enter User Email'}
            maxLength={30}
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
          <TextInput
            style={[styles.input, {marginTop: 10}]}
            value={this.state.passwordConfirm}
            onChangeText={(text) => this.setState({passwordConfirm: text})}
            onSubmitEditing={Keyboard.dismiss}
            placeholder={'Confirm User Password'}
            maxLength={12}
            multiline={false}
          />

          <Button
            text={this.state.registerLabel}
            style={this._buttonStyle()}
            onPress={this._onPressRegister}
          />

          <Text style={styles.errorLabel}>{this.state.response}</Text>

          <TouchableHighlight
                              style={{justifyContent: 'center', alignItems: 'center'}}
                              onPress={this._alreadySignUp}
                              underlayColor={'#fff'}
          >
            <Text style={styles.registeredLabel}>Already signed up?</Text>
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

