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
} from 'react-native';


const LoginView = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View,
})();


import ImagePicker from 'react-native-image-picker';
import TopBar from '../components/topBar';
import Button from '../components/button';
import * as firebase from 'firebase';


var options = {
  title: 'Select Image File To Send',
  mediaType: 'photo',
  noData: false
};

// Initialize Firebase
//firebase.initializeApp(firebaseConfig);

export default class SetAvatar extends Component {
  constructor(props) {
    super(props);

    this._storageRef = firebase.storage().ref();

    this.state = {
      registerLabel: 'Register',
      defaultAvatar: 'https://firebasestorage.googleapis.com/v0/b/damessenger-315bf.appspot.com/o…%2Favatar-default.png?alt=media&token=81e5cf5c-dc3b-487f-8235-ad1e91dc60ff',
      avatarSource: 'https://firebasestorage.googleapis.com/v0/b/damessenger-315bf.appspot.com/o…%2Favatar-default.png?alt=media&token=81e5cf5c-dc3b-487f-8235-ad1e91dc60ff',
    };

  }

  componentDidMount(){
    this._storageRef.child('avatars/default/avatar-default.png').getDownloadURL().then((res)=>{
      this.setState({defaultAvatar: res});
      console.log('----->', this.state.defaultAvatar);
    });
  }

  _AddImage(){

    // Open Image Library:
    ImagePicker.launchImageLibrary(options, (response)  => {
      // Same code as in above section!
    });


  }

  _setPhoto(){
    let user = firebase.auth().currentUser;

    user.updateProfile({
      photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(function() {
      // Update successful.
    }, function(error) {
      // An error happened.
    });


  }

  _onPhoto() {
    var _SELF = this;

    if (Platform.OS === 'android'){

    }
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
      }
    });
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
      <View style={styles.container} >

        <View style={styles.topbar}>
          <TopBar
            onBackPress={this._onBackPress.bind(this)}
            title={'Set Avatar'}
          />
        </View>



        <View style={styles.imageContainer}>

          <Image style = {{height: 200, width: 200, borderRadius: 100, alignSelf: 'center'}}
                 source = {{uri: this.state.defaultAvatar}}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            text={'Add image'}
            style={this._buttonStyle()}
            onPress={this._onPhoto.bind(this)}
          />

          <Button
            text={'Skip'}
            style={this._buttonStyle()}
            onPress={this._onBackPress.bind(this)}
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
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  topbar: {
    height: 60,
    flexDirection: 'row'
  },
});

