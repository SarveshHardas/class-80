import React, {Component} from 'react';
import {View, Text, Alert, StyleSheet, FlatList, Image, ImageBackground, SafeAreaView, Platform, StatusBar} from 'react-native';
import axios from 'axios';


export default class Meteor extends Component {
  constructor(){
    super()
    this.state={
      meteors:{}
    }
  }

  getMeteors = async () =>{
    axios.get("https://api.nasa.gov/planetary/apod?api_key=EfRiBvf65yv7U882aY2qigxngIHm8rlD5YXed046")
    .then(response=>{this.setState({
      meteors:response.data.near_earth_objects
    })
    .catch(error=>{
      Alert.alert(error.message)
    })
  }
    )

  }

  componentDidMount(){
    this.getMeteors()
  }

  renderItem=({item})=>{
    var meteor = item
    var bg_img,speed,size
    
    if(meteor.threat_score<=30)
    {
      bg_img = require("../assets/meteor_bg1.png") ;
      speed= require("../assets/meteor_speed3.gif");
      size=100
    }else if(meteor.threat_score<=75)
    {
      bg_img = require("../assets/meteor_bg2.png") ;
      speed= require("../assets/meteor_speed3.gif");
      size=150
    }else{
      bg_img = require("../assets/meteor_bg3.png") ;
      speed= require("../assets/meteor_speed3.gif");
      size=200
    }
    return(
      <ImageBackground
          source={bg_img}
          style={styles.background}>
            <View style={styles.gifContainer}>
              <Image source={speed} 
              style={{width:size, height:size, alignSelf:"center"}} />
              <View>
                <Text style={[styles.cardTitle,{marginTop:400,marginLeft:50}]}> {item.name} </Text>
                <Text style={[styles.cardText,{marginTop:20,marginLeft:50}]}> Closest To Earth :- { item.close_approach_data[0].close_approach_date_full} </Text>
                <Text style={[styles.cardText,{marginTop:5,marginLeft:50}]}> Minimum Diameter (Km) :- { item.estimated_diameter.kilometers.estimated_diameter_min} </Text>
                <Text style={[styles.cardText,{marginTop:5,marginLeft:50}]}> Maximum Diameter (Km) :- { item.estimated_diameter.kilometers.estimated_diameter_max} </Text>
                <Text style={[styles.cardText,{marginTop:5,marginLeft:50}]}> Velocity (Km/hr) :- { item.close_approach_data[0].relative_velocity.kilometers_per_hour} </Text>
                <Text style={[styles.cardText,{marginTop:5,marginLeft:50}]}> Missing Earth By (Km) :- { item.close_approach_data[0].miss_distance.kilometers} </Text>
              </View>
            </View>
            </ImageBackground>
    )

  }

  render(){
    if(Object.keys(this.state.location).length===0)
   {
     return(
         <View style={{flex:1,
         justifyContent:"center",
         alignItems:"center"}}>
             <Text>Loading...</Text>
         </View>
     )
   }else{
    var meteor_arr = Object.keys(this.state.meteors).map(meteor_date=>{
      return this.state.meteors[meteor_date]
    })
    var meteors = [].concat.apply([], meteor_arr)
    meteors.forEach(function(element){
      var diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max)/2
      var threat = (diameter/element.close_approach_data[0].miss_distance.kilometers)*1000000000
      element.threat_score = threat
    })
    meteors.sort(function(a,b){
      return b.threat_score-a.threat_score
    })
    meteors = meteors.slice(0,5);

    

    return(
      <View style={styles.container}>
        <SafeAreaView 
        style={styles.androidSafeArea} />
        <FlatList data={meteors}
        renderItem={this.renderItem}
        keyExtractor={(item,index)=>{index.toString()}}
        horizontal={true} />
      </View>
    )
   }
  }
}

const styles = StyleSheet.create({
  background: {
    resizedMode: 'cover',
    flex: 1,
  },
  cardTitle:{
  fontSize:20,
  fontFamily:'Time new',
  color:'white',
  fontWeight:"bold",
  marginBottom:10,
  },
  container: {
    flex: 1,
  },
  androidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  gifContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  cardText:{
    color:'black',
  },

})