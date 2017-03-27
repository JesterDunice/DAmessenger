import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Image
} from 'react-native';

import moment from 'moment';

export default class ListMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: this.props.msg,
      // image: this.props.image,
      // name: this.props.name
    };
  }

  _containerStyle(){
    return {
      //flex: 1,
      //alignSelf: 'auto',
      flexDirection: 'row',
      justifyContent: this.state.message.name == this.props.userName ? 'flex-end' : 'flex-start',
      alignItems: 'center',
      //backgroundColor: this.state.message.name == this.props.userName ? '#13b8fa' : '#f2f2f2',
      //maxWidth: 250,
      //borderWidth: 20,
      //borderColor: this.state.message.name == this.props.userName ? '#13b8fa' : '#f2f2f2',
      //boxShadow: this.state.message.name == this.props.userName ? '#13b8fa' : '#f2f2f2'

    }
  }

  _messageContainerStyle(){
    return {
      flex: 1,
      flexDirection: 'row',
      justifyContent: this.state.message.name == this.props.userName ? 'flex-end' : 'flex-start',
  }
  }

  _messageStyle(){
    return {
      justifyContent: this.state.message.name == this.props.userName ? 'flex-end' : 'flex-start',
      backgroundColor: this.state.message.name == this.props.userName ? '#13b8fa' : '#f2f2f2',
      right: this.state.message.name == this.props.userName ? -25 : null,
      left: this.state.message.name == this.props.userName ? null : -25,
      maxWidth: 200,
      minWidth: 40,
      borderRadius: 20,
      borderWidth: 10,
      borderColor: this.state.message.name == this.props.userName ? '#13b8fa' : '#f2f2f2',
    }
  }

  _textStyle(){
    return {
      color: this.state.message.name == this.props.userName ? '#fff' : '#000',
      fontSize: 18,
      textAlign: 'center'
    }
  }

  _renderImageLeft(){
    if (this.state.message.name != this.props.userName){
    return(
      <Image style={{height: 30, width: 30, borderRadius: 15, marginLeft: 15, alignSelf: 'flex-end'}} source={this.state.message.avatar}/>
    );}
  }

  _renderImageRight(){
    if (this.state.message.name == this.props.userName){
      return(
        <Image style={{height: 30, width: 30, borderRadius: 15, marginRight: 15, alignSelf: 'flex-end'}} source={this.state.message.avatar}/>
      );}
  }

  _renderLeftArrow(){
    if (this.state.message.name != this.props.userName){
    return (
      <View style={styles.arrowLeft}/>
    );
    } else {
      return (
        <View style={this.dateContainer}>
          <Text style={styles.dateText}>{moment(this.state.message.date).format('LT')}</Text>
        </View>
      );
    }
  }

 _renderRightArrow(){
   if (this.state.message.name == this.props.userName){
     return (
       <View style={styles.arrowRight}/>
     );
   } else {
     return (
       <View style={this.dateContainer}>
         <Text style={styles.dateText}>{moment(this.state.message.date).format('LT')}</Text>
       </View>
     );
   }
 }

 _onPress(){
   const onPress = () => {
     Alert.alert(
       'Delete message?',
       null,
       [
         {text: 'Delete', onPress: (text) => this._messagesRef.child(message.uniqueId).remove()},
         {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
       ]
     );
   };
 }
 _imageStyle(){
   if (this.state.message.image === '') {
     this.setState({
       message: {
         image: require('../img/btn-add.png')
       }
     });
     return {
       height: 50,
       width: 50,
     }
   } else {
     return {
       height: 180,
       width: 180,
     }
   }
 }

  render() {
    return (
     // <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.messageContainer}>
            <View style={this._messageContainerStyle()}>
              {this._renderImageLeft()}
              <View style={this._containerStyle()}>
                {this._renderLeftArrow()}
              <View style={this._messageStyle()}>
                <Image  style={this._imageStyle()}
                        source={{uri: this.state.message.image}}
                />
                <Text style={this._textStyle()}>{this.state.message.text}</Text>
              </View>
              {this._renderRightArrow()}
            </View>
            {this._renderImageRight()}
          </View>
        </View>
      //</TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  messageContainer:{
    flex: 1,
    marginHorizontal: 20,
    marginTop: 10,
    //alignSelf: 'center'
    //transform: [{ scaleY: -1 }]
  },
  dateContainer:{
    flex: 1,
    //justifyContent: 'center',
    //alignSelf: 'center'

  },
  arrowRight: {
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderRightWidth: 0,
    borderRightColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    borderLeftWidth: 30,
    borderLeftColor: '#13b8fa',
    alignSelf: 'flex-end'
  },
  arrowLeft: {
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderRightWidth: 30,
    borderRightColor: '#f2f2f2',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
    alignSelf: 'flex-end'
  },
  dateText: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
  }

});

