import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  StyleSheet,
  AppState,
  Platform
} from 'react-native';

import MessengerContainer from './pages/MessengerContainer';

// import Login from './pages/login';
// import OpenChannel from './pages/openChannel';
// import CreateChannel from './pages/createChannel';
// import Chat from './pages/chat';
// import Participants from './pages/participants';
// import BlockList from './pages/blockList';
// import GroupChannel from './pages/groupChannel';
// import InviteUser from './pages/inviteUser';
// import Members from './pages/members';
// import SwitchLogin from './pages/switchLogin';
// import SignUp from './pages/signUp'

//import {APP_ID} from './consts'
//import SendBird from 'sendbird'
//var sb = null;



var ROUTES = {
  // login: Login,
  // openChannel: OpenChannel,
  // createChannel: CreateChannel,
  // chat: Chat,
  // participants: Participants,
  // blockList: BlockList,
  // groupChannel: GroupChannel,
  // inviteUser: InviteUser,
  // members: Members,
  // switchlogin: SwitchLogin,
  // signup: SignUp,
  mesContainer: MessengerContainer
};

export default class Main extends Component {

  render() {
    return (
      <Navigator
        initialRoute={{name: 'mesContainer'}}
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
