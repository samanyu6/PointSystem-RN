import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  ImageBackground,
  View,
  AsyncStorage,
  Button,
  Share
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from 'react-native-chart-kit';

class app extends Component{

  state = {
    users: [],
    response: null,
    date: 0,
    appOpenStreak: 0,
    points: {
      appOpen: 0,                     //Points based on frequency of opening app
      sharePoints: 0,                 //Points based on user sharing the app
      donationPoints: 0,              //Points based on Donations
      feedbackPoints: 0,             //Points based on feedback         --->IMPLEMENT BACKEND FOR FEEDBACK CHECKING
      distancePoints:0               //Points based on distance/locations between the donor and the receiver. -->Based on the output of the google-distance-api call 
    }
}

componentDidMount() {
    //this._registerUsers();
  this._setInitialState();           //Load stored data from AsyncStorage to check user stats and points
  this._fetchUserResults();         //Request from db for stored data
  this._parseDate();                //Parsing the date so we can check for app opens
  this._appOpens();                 //check app opens and award points for it 
  this._donationPointsUpdate();           //Update donation points
  this._feedbackPoints();             //Set feedback points based on necessary action
  this._distancePoints();            //
  console.log(this.state);
}
  
//Check api call return output for distance and calculate points accordingly
_distancePoints() {
  distance = 3;      //<---- DISTANCE TO BE EXTRACTED FROM THE JSON
  for (i = 0; i < distance; i=i+5)
  {
    this.state.points.distancePoints = this.state.points.distancePoints + 5;
    this.forceUpdate();
    }
}
  
//Points based on user feedback  ---->One time only
_feedbackPoints() {
    if (true) {
      this.state.points.feedbackPoints = 25;
      this.forceUpdate();
    }
 }
    
//Assign points based on number of donations
_donationPointsUpdate()
{
    donations = 1    //Get values from database for number of donations
    for (i = 1; i <= donations; i++)      //for each donation -> add 50 points
    {
      this.state.points.donationPoints = this.state.points.donationPoints + 50;
      this.forceUpdate();
      }
 } 
  
//Set stored data into state data.
_setInitialState()
{
    //Retrieving points data from the storage into current state
    AsyncStorage.getItem("appOpenPoints").then((value) => {
        if (value != null || value != 0)
        {
          this.state.points.appOpen = value;
          this.forceUpdate();
        }
    });

    //Retrieving date from the storage into current state
    // AsyncStorage.getItem("date").then((value) => {
    //     if (value != null || value != 0)
    //         this.setState({
    //             date: value
    //         });
    // });

    //Retrieving opening streak data from the storage into current state
    AsyncStorage.getItem("appOpenStreak").then((value) => {
        if (value != null || value != 0)
        {
          this.state.appOpenStreak = value;
          this.forceUpdate();
        }
    });
  
   //Retrieving sharePoints data from the storage into current state
  AsyncStorage.getItem("sharePoints").then((value) => {
    if (value != null || value != 0)
            this.setState({
              points: {
                   sharePoints: parseInt(value)
                 }
            });
  })
}

//Setting points based on open streaks
_appOpens()
{
    if (this.state.appOpenStreak == 4)
    {
      this.state.points.appOpen = 1;
      this.forceUpdate();
    }
    else if (this.state.appOpenStreak == 7)
    {
      this.state.points.appOpen = 2;
      this.forceUpdate();
    }
    else if (this.state.appOpenStreak == 15)
    {
      this.state.points.appOpen = 5;
      this.forceUpdate();
    }
    else if (this.state.appOpenStreak == 30)
    {
      this.state.points.appOpen = 10;
      this.forceUpdate();
    }
    AsyncStorage.setItem( 'appOpenPoints', JSON.stringify(this.state.points.appOpen) );
}

//Setting date values to see number of app Opens
_parseDate() 
{
  //new Date().getFullYear()*10000+new Date().getUTCMonth()*100+new Date().getUTCDate()--->output--->2019*10000+ 03*100+ 24-->20190224
    months = new Date().getUTCMonth();
    days = new Date().getUTCDate();
    years = new Date().getFullYear();
    d = parseInt(years) * 10000 + parseInt(months) * 100 + parseInt(days);
    db = 20190223; //value of date from database 
    if(db+1>=d)
    {
        this.state.date = d;
        this.state.appOpenStreak = this.state.appOpenStreak + 1;
        this.forceUpdate();
    }
    else if (db + 200 < d)
    {
        this.setState({
            appOpenStreak:0
        })
    }
    AsyncStorage.setItem( 'appOpenStreak' , JSON.stringify(this.state.appOpenStreak) );

}
  
  //Sharing app and add points for successful sharing
  _Share= async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
        title: 'hello',
        url: 'https://www.google.com'
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          this.state.sharePoints = this.state.sharePoints + 2;
          this.forceUpdate();
          AsyncStorage.setItem('sharePoints', JSON.stringify(this.state.sharePoints));
        } 
      }

      //iOS only code - might not work for android. 
      else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed.')
      }
    } catch (error) {
      alert(error.message);
    }
}

  //API call to database for registering users , CHECK THE SCHEMA OF DB TO STORE VALUES.
_registerUsers= async() =>{
    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: this.state.date
      }),
    });
    alert('Registered');
  };

  //API call to db for getting user info - USE THE DATA FOR PARSING REQUIRED OBJECTS FOR SPECIFIC POINTS -> I have left comments on plces where you will need db values
_fetchUserResults = async () => {
    return fetch('http://localhost:5000/api/show')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          response: responseJson,
        }, function () {
            const len = (this.state.response).length;
            for (i = 0; i < len; i++){
                this.state.users[i] = this.state.response[i];
              this.forceUpdate();
            }
          });
        
      })
      .catch((error) =>{
        console.error(error);
      });
}
  
  
  render(){
    return (
      <View style={{flex:1}}>
      <ImageBackground source= {require('./assets/bg-dash.png')} style={{width:'100%', height:'100%'}}>        
  <LineChart
    data={{
      labels: ['Distance','Opens   ', 'References    ', 'Donations', 'Feedback'],
      datasets: [{
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        ]
      }]
    }}
    width={Dimensions.get('window').width} // from react-native
    height={220}
    chartConfig={{
      backgroundGradientFrom: '#bb0a1e',
      backgroundGradientTo: '#1f1c18',
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 100) => `rgba(255, 255, 51, ${opacity})`,
      style: {
        borderRadius: 16
      }
    }}
    bezier
          style={{
            backgroundColor: '#bb0a1e',
      marginTop: 50,
      marginVertical: 8,
      borderRadius: 16
    }}
          />
          <Button 
            onPress= {()=>this._Share()}
            title = "Share!"
          />
        </ImageBackground>   
        </View>
    );
  }
}


export default app;


// AsyncStorage stored values: {
//     appOpenPoints: The points assigned to user based on frequency of opening app
//     date: date when the user last opened the app
//     appOpenStreak: number of days app was opened consecutively
//     sharePoints: keeping track of every shared item
// }
//^
//| Above are the values stored permanently in the client phone memory - we can store it in db too as little tweaking has to be done for setting phone storage.
// this is done so that the points and dates given can be stored permanently for proper points calculation
//Preferable to make a database schema including all these values for optimal storage rather than storing in the phone using AsyncStorage