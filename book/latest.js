import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Button,
  Text,
  View,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Header } from "../book/common/header";
import Constants from "expo-constants";
import * as Constant from "./common/constants";
import Error from "../assets/error.svg";
import axios from "axios";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import AnimatedLoader from "react-native-animated-loader";
class Latest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latestBooks: [],
      dealsBooks: [],
      visible: false,
    };
  }

  componentDidMount() {
    this.getLatestBooks();
  }

  getLatestBooks() {
    this.setState({
      visible: true,
    });
    axios
      .get(Constant.latestBooksApi)
      .then((response) => {
        this.setState({
          visible: false,
        });
        let BooksData = response.data.latest;
        let dealsBooks = response.data.deals;
        console.log("latest books", response.data);
        this.setState({
          latestBooks: BooksData,
          dealsBooks: dealsBooks
        });
        //   }
        // }
      })
      .catch((e) => {
        console.log("err", e);
        this.setState({
          visible: false,
        });
      });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            padding: 10,
            marginTop: 10,
            alignItems: "flex-start",
            backgroundColor: "#e5e5e5",
          }}
        >
          <Text style={{fontSize: 16, fontWeight: "bold", color:"#000"}}>Latest</Text>
        </View>
        {this.state.visible ? (
          <ActivityIndicator
            size="small"
            animating={this.state.visible}
            style={{ marginVertical: 10 }}
            color="#e91e63"
          />
        ) : null}
        {this.state.latestBooks.length > 0 ? (
          <FlatList
            data={this.state.latestBooks}
            nestedScrollEnabled={true}
            horizontal
            contentContainerStyle={{
              alignItems: "center",
            }}
            renderItem={({ item }) => (
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
                    marginTop: 10,
                    alignSelf: "center",
                    width: responsiveWidth(80),
                    flexDirection: "row",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#e5e5e5",
                    padding: 10,
                    marginHorizontal: 10,
                    backgroundColor: "#fff",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    style={[styles.tinyLogo, { resizeMode: "contain" }]}
                    source={{
                      uri: item.book_cover_url,
                    }}
                  />
                  <View
                    style={{
                      width: responsiveWidth(35),
                      padding: 5,
                      backgroundColor: "#e91e63",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      margin: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      {item.book_name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={this.renderSeparator}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: responsiveHeight(70),
              width: responsiveWidth(100),
            }}
          >
            <Error height={50} width={50} />
            <Text style={{ fontSize: 16, marginTop: 10 }}>
              No Books Available Currently
            </Text>
          </View>
        )}
        <View
          style={{
            padding: 10,
            marginTop: 10,
            alignItems: "flex-start",
            backgroundColor: "#e5e5e5",
          }}
        >
          <Text style={{fontSize: 16, fontWeight: "bold", color:"#000"}}>Deals</Text>
        </View>
        {this.state.dealsBooks.length > 0 ? (
          <FlatList
            data={this.state.dealsBooks}
            nestedScrollEnabled={true}
            horizontal
            contentContainerStyle={{
              paddingBottom: 30,
              alignItems: "center",
            }}
            renderItem={({ item }) => (
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
                    marginTop: 10,
                    alignSelf: "center",
                    width: responsiveWidth(80),
                    flexDirection: "row",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#e5e5e5",
                    padding: 10,
                    marginHorizontal: 10,
                    backgroundColor: "#fff",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    style={[styles.tinyLogo, { resizeMode: "contain" }]}
                    source={{
                      uri: item.book_cover_url,
                    }}
                  />
                  <View
                    style={{
                      width: responsiveWidth(35),
                      padding: 5,
                      backgroundColor: "#e91e63",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      margin: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      {item.book_name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={this.renderSeparator}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: responsiveHeight(70),
              width: responsiveWidth(100),
            }}
          >
            <Error height={50} width={50} />
            <Text style={{ fontSize: 16, marginTop: 10 }}>
              No Books Available Currently
            </Text>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tinyLogo: {
    width: responsiveWidth(30),
    height: responsiveHeight(20),
    borderRadius: 5,
  },
});

export default Latest;
