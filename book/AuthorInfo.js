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
  TouchableOpacity,
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
            <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("BookInfo", {
                        item: item,
                        bookId: item.id,
                      })
                    }
                  >
                    <View
                      style={{
                        alignItems: "center",
                        marginBottom: 20,
                        width: responsiveWidth(30),
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          width: responsiveWidth(25),
                          aspectRatio: 1,
                          margin: 10,
                          borderRadius: 200,
                          borderWidth: 4,
                          marginBottom: 10,
                          borderColor: "#c9ad",
                        }}
                      >
                        <View style={{ padding: 10 }}>
                          <Image
                            style={{
                              zIndex: -1,
                              width: responsiveWidth(20),
                              borderRadius: 200,
                              aspectRatio: 1,
                              resizeMode: "contain",
                            }}
                            source={{
                              uri:
                                item.book_cover_url != ""
                                  ? item.book_cover_url
                                  : "#https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=",
                            }}
                          />
                        </View>
                      </View>
                      <Text
                        style={{ color: "#000", fontWeight: "bold", textAlign: 'center' }}
                      >
                        {item.book_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
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
