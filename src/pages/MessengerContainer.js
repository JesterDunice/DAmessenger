'use strict';

import React, {
  Component,
} from 'react';
import {
  Linking,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text,
  Navigator,
  StyleSheet,
  ListView,
  TextInput,
  TouchableHighlight,
  Alert
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import * as firebase from 'firebase';
import TopBar from '../components/topBar';
import Button from '../components/button';
import ListMessage from '../components/ListMessage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDXC-et6TPoJf9PK-3cJQKqoj3m_X7RhDw",
  authDomain: "damessenger-315bf.firebaseapp.com",
  databaseURL: "https://damessenger-315bf.firebaseio.com",
  storageBucket: "gs://damessenger-315bf.appspot.com",
};

firebase.initializeApp(firebaseConfig);

//var GiftedMessenger = require('react-native-gifted-messenger');

//const user = firebase.auth().currentUser;
//console.log(user);

//if (Platform.OS == 'ios') {
// if (user != null) {
//   var STATUS_BAR_HEIGHT = 0;
//   var CONTAINER_MARGIN = 20;
//   var this.state.userName = 'ios';
//   var AvatarUrl = 'https://source.unsplash.com/sseiVD2XsOk/100x100';
// } else {
//   var STATUS_BAR_HEIGHT = 27;
//   var CONTAINER_MARGIN = 0;
//   var this.state.userName = 'android';
//   var AvatarUrl = 'https://source.unsplash.com/2Ts5HnA67k8/100x100';
// }


export default class MessengerContainer extends Component {

  constructor(props) {
    super(props);
    this._messagesRef = firebase.database().ref("messages2");
    this._storageRef = firebase.storage().ref();


    this._messages = [];
    this.user = firebase.auth().currentUser;

    this.state = {
      user: this.user,
      userName: 'vasya', //this.user.displayName,
      avatar: '',//this.user.photoURL,
      buttonDisabled: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      typingMessage: '',
      defaultAvatar: '',
    };

  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      let messages = [];
      snap.forEach((child) => {
        messages.push({
          text: child.val().text,
          name: child.val().name,
          image: {uri: child.val().avatarUrl || this.state.defaultAvatar},
          position: child.val().name == this.state.userName && 'right' || 'left',
          date: new Date(child.val().date),
          uniqueId: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(messages),
      });

    });
  }


  _onPhoto() {
    var _SELF = this;

    if (Platform.OS === 'android'){
      sb.disableStateChange();
    }
    ImagePicker.showImagePicker(ipOptions, (response) => {
      if (Platform.OS === 'android'){
        sb.enableStateChange();
      }
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
        let source = {uri:response.uri};

        if (response.name){
          source['name'] = response.fileName
        } else{
          paths = response.uri.split("/")
          source['name'] = paths[paths.length-1];
        }

        if (response.type){
          source['type'] = response.type;
        }

        _SELF.state.channel.sendFileMessage(source, function(message, error){
          if (error) {
            console.log(error);
            return;
          }

          var _messages = [];
          _messages.push(message);
          if (_SELF.state.lastMessage && message.createdAt - _SELF.state.lastMessage.createdAt  > (1000 * 60 * 60)) {
            _messages.push({isDate: true, createdAt: message.createdAt});
          }

          var _newMessageList = _messages.concat(_SELF.state.messages);
          _SELF.setState({
            messages: _newMessageList,
            dataSource: _SELF.state.dataSource.cloneWithRows(_newMessageList)
          });
          _SELF.state.lastMessage = message;
          _SELF.state.channel.lastMessage = message;
        });
      };

    });
  }


  componentDidMount() {


    this._storageRef.child('avatars/default/avatar-default.png').getDownloadURL().then((res)=>{
      console.log('123123',res);
      this.setState({defaultAvatar: res});
      console.log('----->', this.state.defaultAvatar);
    });

    this.listenForItems(this._messagesRef);
   // console.log('------>>>>', this._avatarDefault);
      // .child('avatars/default/avatar-default.png'))
    //
    // this._avatarDefault.getDownloadUrl().then((err,res)=>{
    //   console.log('errrr---->>>',err,res)
    // });
    //

    // let user = firebase.auth().currentUser;
    // if (user != null) {
    //    console.log("User UID: "+this.user.uid);
    //    console.log("User Name: "+this.user.displayName);
    //    console.log("User pURL: "+this.user.photoURL);}
    //   user.providerData.forEach(function (profile) {
    //     console.log("Sign-in provider: "+profile.providerId);
    //     console.log("  Provider-specific UID: "+profile.uid);
    //     console.log("  Name: "+profile.displayName);
    //     console.log("  Email: "+profile.email);
    //     console.log("  Photo URL: "+profile.photoURL);
    //   });
    // }
  }

  setMessages(messages) {
    this._messages = messages;

    this.setState({
      messages: messages,
    });
  }

  handleSend() {
    this._messagesRef.push({
      text: this.state.typingMessage,
      name: this.state.userName,
      avatarUrl: this.state.avatar || this.state.defaultAvatar,
      date: new Date().getTime()
    });
    this.setState({typingMessage: '', buttonDisabled: true});

  }

  handleReceive(message = {}) {
    this.setMessages(this._messages.concat(message));
  }

  _onBackPress() {
    this.props.navigator.pop();
  }

  _buttonStyle() {
    return {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 20,
      padding: 10,
      marginTop: 10,
      backgroundColor: this.state.buttonDisabled ? '#ababab' : '#66aa33',
      alignSelf: 'flex-end',
      //underlayColor: '#448833',
      borderColor: this.state.buttonDisabled ? '#ababab' : '#66aa33',
      height: 40,
      width: 60,
      marginBottom: 5,
      marginHorizontal: 5

      //disabledColor: '#ababab',
      //textColor: '#ffffff'
    }
  }

  _buttonDisabled(text) {
    if (text.length == 0) {
      this.setState({typingMessage: text, buttonDisabled: true})
    } else {
      this.setState({typingMessage: text, buttonDisabled: false})
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <View style={{height: 60}}>
          <TopBar
            onBackPress={this._onBackPress.bind(this)}
            title={'Venue'}
          />
        </View>
        <View style={styles.listviewContainer}>
          <ListView

            ref={ref => this.scrollView = ref}
            onContentSizeChange={(contentWidth, contentHeight)=>{this.scrollView.scrollToEnd({animated: true});}}

            //ref={ref => this.listView = ref}
            //onLayout={event => {this.listViewHeight = event.nativeEvent.layout.height}}
            //onContentSizeChange={() => {   this.listView.scrollTo({y: this.listView.getMetrics().contentLength - this.listViewHeight}) }}

            dataSource={this.state.dataSource}
            renderRow={this._renderItem.bind(this)}
            enableEmptySections={true}
            style={styles.listview}/>
        </View>

        <View style={styles.inputContainer}>

          <TouchableHighlight
            disabled={false}
            style={this._buttonStyle()}
            underlayColor={'#448833'}
            onPress={this._onPhoto.bind(this)}
          >
            <Text style={styles.mesText}>+</Text>
          </TouchableHighlight>

          <TextInput
            style={styles.inputText}
            placeholder="Start typing"
            onChangeText={(text) => {this._buttonDisabled(text)}}
            value={this.state.typingMessage}
            autoFocus={true}
          />

          <TouchableHighlight
            disabled={this.state.buttonDisabled}
            style={this._buttonStyle()}
            underlayColor={'#448833'}
            onPress={this.handleSend.bind(this)}
          >
            <Text style={styles.mesText}>SEND</Text>
          </TouchableHighlight>

        </View>
      </View>
    );
  }

  _renderItem(message) {
    //console.log(message.date);

    // if (prevDate > 0){
    //   if ((message.date - prevDate) > (1000 * 60 * 5)){
    //     prevDate = message.date;
    //     dateRender = true;
    //   } else dateRender = false;
    // } else prevDate = message.date;


    // const onPress = () => {
    // Alert.alert(
    // 'Delete message?',
    // null,
    // [
    // {text: 'Delete', onPress: (text) => this._messagesRef.child(message.uniqueId).remove()},
    // {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
    // ]
    // );
    // };

    return (
      <ListMessage msg = {message}
                   userName = {this.state.userName}
        // onPress={onPress}
      />
    );
  }

}

const styles = StyleSheet.create({
  mesText: {
    color: '#fefefe',
    fontSize: 15,
    textAlign: 'center',
    width: 50,
  },

  listviewContainer: {
    flex: 1,
    //transform: [{ scaleY: -1 }]

  },
  inputContainer: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#f7f7f7'
  },
  inputText: {
    flex: 1,
    alignSelf: 'stretch',
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingLeft: 10
  }
});

