/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var Button = require('react-native-button');
var React = require('react-native');
var {
  ListView,
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  NavigatorIOS,
  View,
  Image,
  WebView,
  ActivityIndicatorIOS
} = React;

var RepoPage = React.createClass({
  render: function() {
    return ( <WebView
        automaticallyAdjustContentInsets={false}
        style={styles.webView}
        url={this.props.url}
        javaScriptEnabledAndroid={true}
        startInLoadingState={true}
      />
    )
  }
});

var ProfileDetails = React.createClass({

  getInitialState: function() {
    var profile = this.props.profile;
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var arr = Object.keys(profile).map((k) => { return { title: k, value: profile[k] } } );
    return {
      dataSource:  ds.cloneWithRows(arr),
    };
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Image style={[styles.avatar, {marginTop: 90, borderRadius: 100 }]} source={{uri: this.props.profile.avatar_url}} />
        <ListView dataSource={this.state.dataSource} renderRow={(row) =>
            <View style={styles.row}>
              <Text >{row.title} --- {row.value}</Text>
            </View>
          } />
      </View>
    )
  }

});

var Repositories = React.createClass({

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      ds: ds,
      dataSource:  ds.cloneWithRows([]),
    };
  },

  componentDidMount: function() {
    fetch(this.props.url)
    .then((response) => response.json())
    .then((repos) => this.setState({dataSource: this.state.ds.cloneWithRows(repos)}))
    .done()
  },

  openWebView: function(repo) {
    this.props.navigator.push({ title: 'Repo', component: RepoPage, passProps: {url: repo.html_url }});
  },

  render: function() {
    return (
      <View style={styles.container}>
        <ListView dataSource={this.state.dataSource} renderRow={(row) =>
            <View style={styles.row}>
              <Button style={styles.button} onPress={()=>this.openWebView(row)}>{row.name}</Button>
            </View>
          } />
      </View>
    )
  }

});

var ProfilePage = React.createClass({

  getInitialState: function(){
    return { profile: null };
  },

  render: function() {

    return (
      <View style={styles.container}>

        {this.state.profile ?
          <View style={styles.container}>

            <View style={styles.dhh}>
              <Image style={styles.avatar} source={{uri: this.state.profile.avatar_url}} />
              <Text>{this.state.profile.login}</Text>
            </View>

            <View style={styles.bottom}>
              <Button  style={[styles.button, {marginBottom: 30}]} onPress={this.handleProfile}>Profile</Button>
              <Button  style={styles.button} onPress={this.handleRepositories}>Repositories</Button>
            </View>

          </View>
          : <ActivityIndicatorIOS animating={this.state.animating} style={styles.loading} size="large" />}
      </View>

    );
  },

  handleProfile: function () {
    this.props.navigator.push({ title: 'Profile details', component: ProfileDetails, passProps: {profile: this.state.profile} });
  },

  handleRepositories: function() {
    this.props.navigator.push({ title: 'Repositories', component: Repositories, passProps: {url: this.state.profile.repos_url} });
  },

  componentDidMount: function() {
    fetch(`https://api.github.com/users/${this.props.name}`)
    .then((response) => response.json())
    .then((profile) => this.setState({profile: profile}))
    .done()
  }

});

var SearchPage = React.createClass({

  getInitialState: function() {
    return {input: "dhh"}
  },

  render: function() {
    return (
      <View style={styles.container}>
        <TextInput value={this.state.input} onChangeText={(text) => this.setState({input: text})} style={styles.searchInput} />
        <Button onPress={this.handleSearchPress} style={styles.button}> Search </Button>
      </View>
    );
  },

  handleSearchPress: function(event) {
    this.props.navigator.push({ title: 'Profile', component: ProfilePage, passProps: {name: this.state.input} });
  }

});

var AwesomeProject = React.createClass({

  render: function() {
    return <NavigatorIOS style={styles.navigator} initialRoute={{ component: SearchPage, title: 'Search Profile' }} />;
  },

});

var styles = StyleSheet.create({

  navigator: {
    flex: 1
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  button: {
    color: 'green',
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },

  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 100,
    marginRight: 100,
    borderRadius: 5,
  },

  avatar: {
    width: 200,
    height: 200
  },

  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },

  dhh: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottom: {
    flex: 1,
    margin: 30,
    justifyContent: 'flex-end'
  },

  row: {
    padding: 10,
    borderBottomWidth: 1
  },

  webView: {
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
