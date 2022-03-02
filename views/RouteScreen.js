import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import {ListItem} from 'react-native-elements';

import {getRoutes} from '../api/apiService';
import {Colors} from '../components/Colors';
import MainScreen from '../layout/MainScreen';
import uuid from 'react-native-uuid';
const win = Dimensions.get('window');

export default function RouteScreen({navigation, route}) {
  const [list, setList] = useState();
  const [loader, setLoader] = useState(false);
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState();

  useEffect(() => {
    let unAmounted = false;

    if (!unAmounted) {
      let selectedVehicleNo = route?.params?.vehicleNo;
      AsyncStorage.setItem('selectedVehicleNo', selectedVehicleNo.toString());
      AsyncStorage.setItem('refreshLoad', 'Dashboard');
      setSelectedVehicleNumber(selectedVehicleNo);
      getListRoutes();
    }

    //Hook Clean Up
    return () => {
      unAmounted = true;
    };
  }, [route.params.vehicleNo]);

  function getListRoutes() {
    setLoader(true);
    getRoutes().then(res => {
      setList(res);
      setLoader(false);
    });
  }

  function redirectRoute(selectedRouteId) {
    AsyncStorage.setItem('selectedRoute', selectedRouteId.toString());
    navigation.push('loads', {
      selectedVehicle: selectedVehicleNumber,
      selectedRoute: selectedRouteId,
    });
  }

  return (
    <MainScreen style={styles.container}>
      <ScrollView>
        <View>
          {loader == true ? (
            <View>
              <ActivityIndicator color={Colors.primary} size="large" />
            </View>
          ) : (
            <View />
          )}

          {list != undefined ? (
            list.map((l, i) => (
              <TouchableHighlight
                key={uuid.v4()}
                onPress={() => redirectRoute(l.id)}>
                <ListItem key={uuid.v4()} bottomDivider>
                  <Image
                    source={require('../assets/images/map.png')}
                    style={styles.Avatar}
                  />
                  <ListItem.Content>
                    <ListItem.Title allowFontScaling={false}>
                      {l.routno}
                    </ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              </TouchableHighlight>
            ))
          ) : (
            <View />
          )}
        </View>
      </ScrollView>
    </MainScreen>
  );
}

const styles = StyleSheet.create({
  Avatar: {width: 50, height: 50, resizeMode: 'contain'},
});
