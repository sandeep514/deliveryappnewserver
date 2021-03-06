import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {ListItem} from 'react-native-elements';
import {getVehicleLoads, updateDriverForsale} from '../api/apiService';
import MainScreen from '../layout/MainScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../components/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const win = Dimensions.get('window');
let loadedNumbers = [];
export default function LoadsScreen({navigation, route}) {
  const [ActiveIndicatorLoader, setActiveIndicatorLoader] = useState(true);
  const [ActiveIndicatorValue, setActiveIndicatorValue] = useState(false);
  const [selectedLoadedNumber, setSelectedLoadNumber] = useState();
  const [selectedLoads, setSelectedLoads] = useState();

  const showToast = message => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      0,
      20,
    );
  };

  useEffect(() => {
    getVehicleLoads().then(
      res => {
        setActiveIndicatorLoader(false);
        setSelectedLoadNumber(res);
      },
      err => {
        setActiveIndicatorLoader(false);
        showToast(err);
      },
    );

    // updateDriverForsale
    AsyncStorage.getItem('selectedVehicleNo').then(vehicheId => {
      AsyncStorage.getItem('user_id').then(driverId => {
        AsyncStorage.getItem('selectedRoute').then(route => {
          updateDriverForsale({
            routeId: route,
            driverId: driverId,
            vehicleId: vehicheId,
          });
        });
      });
    });
  }, []);

  function addLoadsToArray(LoadMumber) {
    setActiveIndicatorValue(true);
    setTimeout(() => {
      var index = loadedNumbers.indexOf(LoadMumber);
      if (index > -1) {
        loadedNumbers.splice(index, 1);
      } else {
        loadedNumbers.push(LoadMumber);
      }
      setSelectedLoads(loadedNumbers);
      AsyncStorage.setItem(
        'selectedLoadsNumbers',
        JSON.stringify(loadedNumbers),
      );
      setActiveIndicatorValue(false);
    }, 2000);
  }

  return (
    <MainScreen style={styles.container}>
      {ActiveIndicatorLoader == false ? (
        <View />
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#6c33a1" />
        </View>
      )}

      {ActiveIndicatorValue == false ? (
        <View />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 9999,
            backgroundColor: '#ededed',
            width: '100%',
            height: '100%',
            opacity: 0.5,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              zIndex: 9999,
              alignItems: 'center',
            }}>
            <ActivityIndicator
              size="large"
              color="red"
              style={{
                position: 'absolute',
                zIndex: 9999,
                justifyContent: 'center',
              }}
            />
          </View>
        </View>
      )}

      <ScrollView>
        <View>
          {selectedLoadedNumber != undefined ? (
            selectedLoadedNumber.map((l, i) => (
              <TouchableHighlight
                key={i}
                onPress={() => {
                  addLoadsToArray(l.dnum);
                }}>
                {/* (loadedNumbers.includes(l.dnum))  */}
                <ListItem
                  key={i}
                  bottomDivider
                  containerStyle={
                    loadedNumbers.includes(l.dnum)
                      ? styles.added
                      : styles.removed
                  }>
                  <ListItem.Content>
                    <ListItem.Title allowFontScaling={false}>
                      <Text
                        style={
                          loadedNumbers.includes(l.dnum)
                            ? styles.white
                            : styles.removedWhite
                        }>
                        {l.dnum}
                      </Text>
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              </TouchableHighlight>
            ))
          ) : (
            <Text />
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          width: 70,
          position: 'absolute',
          bottom: 10,
          right: 10,
          height: 70,
          backgroundColor: Colors.primary,
          borderRadius: 100,
        }}
        onPress={() => {
          // let currentLoadRoute = 'Dashboard';
          // AsyncStorage.getItem('refreshLoad').then((res) => {
          // currentLoadRoute = res;
          // AsyncStorage.removeItem('refreshLoad');
          // ( currentLoadRoute == 'Dashboard' ) ? navigation.navigate('Dashboard') : navigation.navigate('Items')
          // });
          AsyncStorage.getItem('selectedLoadsNumbers').then(res => {
            if(JSON.parse(res) != null && JSON.parse(res) != undefined) {
              if (JSON.parse(res).length > 0) {
                navigation.push('Dashboard', {params: 'here'});
              } else {
                alert('Please select any load.');
              }
            }else {
              alert('Please select any load.');
            }
          });
        }}>
        <Icon name="arrow-right" style={{color: 'white'}} size={24} />
      </TouchableOpacity>
    </MainScreen>
  );
}
const styles = StyleSheet.create({
  Avatar: {width: 50, height: 50, resizeMode: 'contain'},
  added: {
    backgroundColor: Colors.primary,
    color: 'white',
  },
  white: {
    color: 'white',
  },
  removedWhite: {
    color: '#000',
  },
});
