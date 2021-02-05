import Color from 'color-js';
import localforage from 'localforage';

import AQI from './aqiConstants';

const WAQI_TOKEN = __CONFIG__.waqi_token;

export function getBackgroundFromAqi(aqi) {
  const color = Color(getAqiColor(aqi)).darkenByRatio(0.5);
  const darker = color.darkenByRatio(0.5);
  const lighter = color.lightenByRatio(0.5);

  return `radial-gradient(ellipse at 50% 50%, ${lighter} 0%,${darker} 100%)`;
}

export function getAqiSentence(value) {
  const val = AQI.filter((aqiConf) => {
    return value >= aqiConf.min && value <= aqiConf.max;
  });

  return val[0].title;
}

export function getAqiColor(value) {
  const val = AQI.filter((aqiConf) => {
    return value >= aqiConf.min && value <= aqiConf.max;
  });

  return val[0].color;
}

export function getAdressFromCurrentPosition() {
  return getPosition().then((coords) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=AIzaSyAoppe4QSTNKCYa6tKQYtyo9apODIlg4is`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const result = data.results[0];
        const countryComponent = result.address_components.filter(
          (address_component) => address_component.types.includes('country')
        );
        const localityComponent = result.address_components.filter(
          (address_component) => address_component.types.includes('locality')
        );

        return (
          localityComponent[0].long_name + ', ' + countryComponent[0].long_name
        );
      });
  });
}

export function getAirQualityFromCurrentPosition() {
  return getPosition().then((coords) => {
    const query = `https://api.waqi.info/feed/geo:${coords.latitude};${coords.longitude}/?token=${WAQI_TOKEN}`;
    return fetch(query)
      .then((response) => response.json())
      .then((json) => json.data);
  });
}

export function getPosition() {
  const STORAGE_KEY = 'last_position';

  return new Promise((resolve) => {
    if (!navigator.onLine) {
      localforage
        .getItem(STORAGE_KEY)
        .then((coords) => {
          resolve(coords);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          localforage.setItem(STORAGE_KEY, coords).then(() => {
            resolve(coords);
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  });
}
