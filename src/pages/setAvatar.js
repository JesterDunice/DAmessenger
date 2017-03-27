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
import RNFetchBlob from 'react-native-fetch-blob'


const fs = RNFetchBlob.fs;
const Blob = RNFetchBlob.polyfill.Blob;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

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

    this._storageRef = firebase.storage().ref('avatars/');

    this.state = {
      registerLabel: 'Register',
      defaultAvatar: 'https://firebasestorage.googleapis.com/v0/b/damessenger-315bf.appspot.com/o/avatars%2Fdefault%2Favatar-default.png?alt=media&token=81e5cf5c-dc3b-487f-8235-ad1e91dc60ff',
      avatarSource: '',
      avatarType:'',
      avatarUrl: '',
    };

  }

  componentDidMount(){
    // this._storageRef.child('avatar-default.png').getDownloadURL().then((res)=>{
    //   this.setState({defaultAvatar: res});
    // });
  }

  // _uploadPhoto(){
  //   let file = this.state.avatarSource;
  //   console.log('+++++++=>>>', file);
  //   firebase.storage().ref().put(file).then(function(snapshot) {
  //     console.log('Uploaded a blob or file!');
  //   });
  //

  _onPhoto() {
    if (Platform.OS === 'android'){
    }
    ImagePicker.showImagePicker(options, (response) => {
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
        let source = {uri: response.uri};

        if (response.name){
          source['name'] = response.fileName
        } else{
          paths = response.uri.split("/");
          source['name'] = paths[paths.length-1];
        }

        if (response.type){
          source['type'] = response.type;
        }

        this.setState({
          avatarSource: response.uri,
          avatarType: response.type
        });

        this._uploadPhoto(this.state.avatarSource, this.state.avatarType);
      }
    });
  }

  _uploadPhoto(uri, mime) {
    let user = firebase.auth().currentUser;
    let userUID = user.uid;
    new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const sessionId = new Date().getTime();
      let uploadBlob = null;
      const imageRef = this._storageRef.child(`/${userUID}/` + `${sessionId}`);

      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, {type: `${mime};BASE64`})
        })
        .then((blob) => {
          uploadBlob = blob;
          return imageRef.put(blob, {contentType: mime})
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          reject(error);
        })
    }).then((res) => {
      this._setPhoto(res);
    });
  }

  _setPhoto(uri){
    let user = firebase.auth().currentUser;
    this.setState({defaultAvatar: uri});
    user.updateProfile({
      photoURL: uri
    }).then(() => {
      console.log('Update successful');
      console.log('pURL---->', uri);
      setTimeout(() => {
        this.props.navigator.push({
          name: "mesContainer"
        })
      }, 3000);
      // Update successful.
    }, function (error) {
      console.log('An error happened');
      // An error happened.
    });
  }

  _onBackPress() {
    this.props.navigator.pop();
  }

  _onSkipPress() {
    this.props.navigator.push({name: 'mesContainer'});
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
            onPress={this._onSkipPress.bind(this)}
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

