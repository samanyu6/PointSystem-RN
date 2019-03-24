import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  ImageBackground,
  View,
  AsyncStorage  ,Button
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
        appOpen: 0
    }
}

componentDidMount() {
    //this._registerUsers();
    // this._setInitialState();            //Load stored data from AsyncStorage to check user stats and points
    this._fetchUserResults();
    this._parseDate();
    this._appOpens();
}

//Set stored data into state data.
_setInitialState() {
    //Retrieving points data from the storage into current state
    AsyncStorage.getItem("appOpenPoints").then((value) => {
        if (value != null || value != 0)
            this.setState({
                points: { appOpen: value }
            });
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
            this.setState({
                 appOpenStreak: value
            });
    });
}

//Setting points based on open streaks
_appOpens() {
    if (this.state.appOpenStreak == 4)
        this.setState({
            points: {
                appOpen: 1
            }
        });
    else if (this.state.appOpenStreak == 7)
    this.setState({
        points: {
            appOpen: 2
        }
    });
    else if (this.state.appOpenStreak == 15)
    this.setState({
        points: {
            appOpen: 5
        }
    });
    else if (this.state.appOpenStreak == 30)
    this.setState({
        points: {
            appOpen: 10
        }
    });
    AsyncStorage.setItem( 'appOpenPoints', JSON.stringify(this.state.points.appOpen) );
}

//Setting date values to see number of app Opens
_parseDate() {
    months = new Date().getMonth();
    days = new Date().getUTCDate();
    years = new Date().getFullYear();
    d = parseInt(years) * 10000 + parseInt(days) * 100 + parseInt(months);
    db = 20192303; //value of date from database 
    if(db+100>=d)
    {
        this.setState({
            date: d,
        });

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
  
  //Sharing app
  _Share() {
    console.log('pressy');
}

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
                console.log(this.state.users[1]);
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

// Async stored values: {
//     appOpenPoints: The points assigned to user based on frequency of opening app
//     date: date when the user last opened the app
//     appOpenStreak: number of days app was opened consecutively
// }