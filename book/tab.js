import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Button,
  Text,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

export const Tab =(props)=>{
    return (
        <TouchableWithoutFeedback onPress={()=>props.callActiveTab(props.type)} >
            <View style={[styles.tochabilityBar , {width:responsiveWidth(parseInt(props['customWidth']))}]}>
                <View style={props['activeTab']=== props.type ? styles.activeBar : styles.navBar}>
                   <Text style={props['activeTab']=== props.type ? styles.activeNavText : styles.navText}>{props.label}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    innerContainer:{
      flexDirection:'row',
      padding:0,
      
    },
    none:{
      display:'none'
    },
    block:{
      display:'flex'
    },
    libraryWidth:{
      width:responsiveWidth(34),
    },
    collectionWidth:{
      width:responsiveWidth(50),
    },
    tochabilityBar:{
      height:responsiveHeight(8),
      backgroundColor : '#e91e63',
    },
    navBar:{
         padding:30,
         paddingTop:10,
         backgroundColor : '#e91e63',
         height:responsiveHeight(5),
     },
     activeBar:{
         padding:30,
         paddingTop:10,
         backgroundColor : '#e91e63',
         borderBottomWidth:3,
         textAlign: "center",
         borderBottomColor:'#fff',
         height:responsiveHeight(5),
     },
     navText:{
      fontSize: 17,
      textAlign: "center",
      color: '#f9d0d0',
      fontWeight:'bold',
      justifyContent:'center',
      alignItems : 'center'
    },
    activeNavText :{
      fontSize: 17,
      textAlign: "center",
      color:'#fff',
      fontWeight:'bold',
      justifyContent:'center',
      alignItems : 'center'
    },
    activeBorderLine:{
      borderBottomWidth:2,
      borderBottomColor:'#fff',
      borderStyle:'solid',
    },
    tabContent:{
      backgroundColor: '#fff',
      flex:1,
      flexDirection:'row',
      borderRadius:5,
      marginTop:0,
      borderWidth:1,
      borderColor:'#DBDBDB',
      height:responsiveHeight(50),
      borderStyle:'solid',
    }, 
    activeTabPane:{
      padding:10,
      marginTop:10,
      marginLeft:10
    },
    tabContentText:{
 
    },
});
