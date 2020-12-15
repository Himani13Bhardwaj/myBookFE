import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Button,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Like from '../assets/like.svg';
import LikeFilled from '../assets/like_filled.svg';
import Dislike from '../assets/dislike.svg';
import DislikeFilled from '../assets/dislike_filled.svg';
import {Header} from '../book/common/header';
import {Rating} from 'react-native-ratings';
import axios from 'axios';
import * as Constant from './common/constants';
import Constants from 'expo-constants';
import AnimatedLoader from 'react-native-animated-loader';

class AuthorInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
      disliked: false,
      ranking: 0,
      visible: false,
    };
  }

  getAuthorInfo() {
    this.setState({
      visible: true,
    });
    console.log(this.props.route.params.item);
    const data = {
      author: this.props.route.params.item.id,
    };

    axios.post(Constant.getAuthorInfoApi, data).then((response) => {
      console.log('response', response.data);
      this.setState({
        visible: false,
        books: response.data.books,
        profilePic: response.data.profilepicture,
        authorName: response.data.author_name,
      });
    });
  }

  componentDidMount() {
    // this.getAuthorInfo();
    this.setState({
      visible: false,
      books: this.props.route.params.item.books,
      profilePic: this.props.route.params.item.profilepicture,
      authorName: this.props.route.params.item.author_name,
      hobbies: this.props.route.params.item.hobbies,
    });

    console.log(this.props.route.params.item)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          headerTitle="Author Info"
          backBtnVisible={true}
          onBackBtnPress={() => this.props.navigation.goBack()}
        />
        <AnimatedLoader
          visible={this.state.visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../assets/loader.json')}
          animationStyle={{width: 300, height: 300}}
          speed={1}
        />
        <Image
          style={{
            width: responsiveWidth(100),
            height: responsiveHeight(30),
            resizeMode: 'contain',
          }}
          source={{uri: this.state.profilePic}}
        />
        <View
          style={{
            marginTop: 10,
            width: responsiveWidth(90),
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#e91e63',
            }}>
            {this.state.authorName}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 13,
            fontWeight: 'bold',
            color: '#000',
            marginTop: 20,
            marginLeft: 20,
          }}>
          Hobbies
        </Text>
        <Text
          style={{
            fontSize: 16,
            width: responsiveWidth(90),
            color: '#e91e63',
            marginTop: 10,
            marginLeft: 20,
          }}>
          {this.state.hobbies}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: 'bold',
            color: '#000',
            marginTop: 20,
            marginLeft: 20,
          }}>
          Books
        </Text>

        <FlatList
          data={this.state.books}
          horizontal
              ItemSeparatorComponent={this.renderSeparator}
              keyExtractor={(item, index) => index.toString()}
          style={{
            marginLeft: 20,
          }}
          renderItem={({item}) => (
            <TouchableWithoutFeedback
              onPress={() =>
                this.props.navigation.navigate('BookInfo', {item: item})
              }>
              <View
                style={{
                  height: 100,
                  width: 100,
                  marginTop: 10,
                  marginRight: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    resizeMode: 'contain',
                  }}
                  source={{uri: item.book_cover_url}}
                />
                <Text style={{textAlign: 'center', fontWeight: "bold", color: "#e91e63"}}>{item.book_name}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
  },
});

export default AuthorInfo;
