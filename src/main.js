import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  StyleSheet,
  AppState,
  Platform
} from 'react-native';

import * as firebase from 'firebase';

import MessengerContainer from './pages/MessengerContainer';
import Login from './pages/login';
// import OpenChannel from './pages/openChannel';
// import CreateChannel from './pages/createChannel';
// import Chat from './pages/chat';
// import Participants from './pages/participants';
// import BlockList from './pages/blockList';
// import GroupChannel from './pages/groupChannel';
// import InviteUser from './pages/inviteUser';
// import Members from './pages/members';
// import SwitchLogin from './pages/switchLogin';
 import SignUp from './pages/signUp';
import SetAvatar from './pages/setAvatar';


// Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyDXC-et6TPoJf9PK-3cJQKqoj3m_X7RhDw",
//   authDomain: "damessenger-315bf.firebaseapp.com",
//   databaseURL: "https://damessenger-315bf.firebaseio.com",
//   storageBucket: "",
// };
//
// firebase.initializeApp(firebaseConfig);





var ROUTES = {
   login: Login,
  // openChannel: OpenChannel,
  // createChannel: CreateChannel,
  // chat: Chat,
  // participants: Participants,
  // blockList: BlockList,
  // groupChannel: GroupChannel,
  // inviteUser: InviteUser,
  // members: Members,
  // switchlogin: SwitchLogin,
  signup: SignUp,
  mesContainer: MessengerContainer,
  setAvatar: SetAvatar,
};

export default class Main extends Component {

  // constructor(props) {
  //   super(props);
  //
  //   //Firebase.initialise();
  //
  //
  //   this.getInitialView();
  //
  //   this.state = {
  //     userLoaded: false,
  //     initialView: null
  //   };
  //
  //   this.getInitialView = this.getInitialView.bind(this);
  //
  // }


  getInitialView() {

    firebase.auth().onAuthStateChanged((user) => {

      let initialView = user ? "mesContainer" : "login";

      this.setState({
        userLoaded: true,
        initialView: initialView
      })
    });


  }

  render() {
    return (
      <Navigator
        initialRoute={{name: 'signup'}}
        renderScene={this._renderScene}
        configureScene={() => {return Navigator.SceneConfigs.FloatFromRight;}}
        style={styles.container}
      />
    )
  }

  _renderScene(route, navigator) {
    var Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
