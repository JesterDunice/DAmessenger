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

import Firebase from 'firebase';
import TopBar from '../components/topBar';
import Button from '../components/button';
import ListMessage from '../components/ListMessage';


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDXC-et6TPoJf9PK-3cJQKqoj3m_X7RhDw",
  authDomain: "damessenger-315bf.firebaseapp.com",
  databaseURL: "https://damessenger-315bf.firebaseio.com",
  storageBucket: "",
};

//const firebaseApp = firebase.initializeApp(firebaseConfig);

//var GiftedMessenger = require('react-native-gifted-messenger');

if (Platform.OS == 'ios') {
  var STATUS_BAR_HEIGHT = 0;
  var CONTAINER_MARGIN = 20;
  var UserName = 'ios';
  var AvatarUrl = 'https://source.unsplash.com/sseiVD2XsOk/100x100';
} else {
  var STATUS_BAR_HEIGHT = 27;
  var CONTAINER_MARGIN = 0;
  var UserName = 'android';
  var AvatarUrl = 'https://source.unsplash.com/2Ts5HnA67k8/100x100';
}

export default class MessengerContainer extends Component {

  constructor(props) {
    super(props);

    this._messagesRef = new Firebase("https://damessenger-315bf.firebaseio.com/messages");//.limitToLast(20);
    this._messages = [];

    this.state = {
      buttonDisabled: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      //this.itemsRef = this.getRef().child('items')
      messages: this._messages,
      typingMessage: ''
    };
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var messages = [];
      snap.forEach((child) => {
        messages.push({
          text: child.val().text,
          name: child.val().name,
          image: {uri: child.val().avatarUrl || 'https://facebook.github.io/react/img/logo_og.png'},
          position: child.val().name == UserName && 'right' || 'left',
          date: new Date(child.val().date),
          uniqueId: child.key()
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(messages)
      });

    });
  }

  componentDidMount() {
    this.listenForItems(this._messagesRef);
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
      name: UserName,
      avatarUrl: AvatarUrl,
      date: new Date().getTime()
    });
    this.setState({typingMessage: '', buttonDisabled: true})
  }

  handleReceive(message = {}) {
    this.setMessages(this._messages.concat(message));
  }

  _onBackPress(){
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
      backgroundColor: this.state.buttonDisabled ? '#ababab' :'#66aa33',
      alignSelf: 'flex-end',
      //underlayColor: '#448833',
      borderColor: this.state.buttonDisabled ? '#ababab' :'#66aa33',
      height: 40,
      width: 60,
      marginBottom: 5,
      marginHorizontal: 5

      //disabledColor: '#ababab',
      //textColor: '#ffffff'
    }
  }

  _buttonDisabled(text){
    if (text.length == 0){
      this.setState({typingMessage: text, buttonDisabled: true})
    } else {
      this.setState({typingMessage: text, buttonDisabled: false})
    }
  }

  render() {
    return (
      // <View style={{marginTop: CONTAINER_MARGIN}}>
      // <GiftedMessenger
      //     styles={{
      //       bubbleRight: {
      //         marginLeft: 70,
      //         backgroundColor: '#007aff',
      //       },
      //     }}
      //     messages={this.state.messages}
      //     handleSend={this.handleSend.bind(this)}
      //     maxHeight={Dimensions.get('window').height - STATUS_BAR_HEIGHT - CONTAINER_MARGIN}
      //   />
      // </View>
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <View style={{height: 60}}>
        <TopBar
          onBackPress={this._onBackPress.bind(this)}
          title={'Venue'}
        />
        </View>

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

        <View style={styles.inputContainer}>

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
    //console.log('--->', message.val().text)

    const onPress = () => {
      Alert.alert(
         'Complete',
        null,
        [
          {text: 'Complete', onPress: (text) => this._messagesRef.child(message).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    };

    return (
      <ListMessage msg={message}
                   onPress={onPress} />
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
  listview:{
    //transform: [{ scaleY: -1 }]

  },
  inputContainer: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#f7f7f7'
  },
  inputText:{
    flex: 1,
    alignSelf: 'stretch',
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingLeft: 10
  }
});

