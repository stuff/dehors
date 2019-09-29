import { h, Component } from 'preact';
import cx from 'classnames';
import localforage from 'localforage';

import css from './main.less';
import Rcss from './R.less';

import LocationBar from './LocationBar';
import AqiPieChart from './AqiPieChart';
import AqiTextBar from './AqiTextBar';
import OnlineStatus from './OnlineStatus';

import {
  getBackgroundFromAqi,
  getAdressFromCurrentPosition,
  getAqiSentence,
  getAirQualityFromCurrentPosition,
} from '../helpers';

const DATA_FETCH_DATE = 'data_fetch_date';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: null,
      aqi: 0,
      online: navigator.onLine,
      fetchDate: null,
    };

    localforage.getItem(DATA_FETCH_DATE).then(fetchDate => {
      this.setState({
        fetchDate,
      });
    });

    this.handleOnlineStatusChange = this.handleOnlineStatusChange.bind(this);
    this.handleFocusApp = this.handleFocusApp.bind(this);

    window.addEventListener('visibilitychange', this.handleFocusApp);

    // window.addEventListener('focus', this.handleFocusApp );
    window.addEventListener('offline', this.handleOnlineStatusChange);
    window.addEventListener('online', this.handleOnlineStatusChange);
  }

  handleFocusApp() {
    if (document.hidden) {
      return;
    }
    this.fetchData();
  }

  handleOnlineStatusChange(event) {
    const isOnline = event.type === 'online';

    this.setState({
      online: isOnline,
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    getAdressFromCurrentPosition().then(location => {
      this.setState({
        location,
      });
      this.updateDataFetchDate();
    });

    getAirQualityFromCurrentPosition().then(airQuality => {
      this.setState({
        aqi: airQuality.aqi,
      });
      this.updateDataFetchDate();
    });
  }

  updateDataFetchDate() {
    const now = Date.now();
    localforage.setItem(DATA_FETCH_DATE, now).then(() => {
      this.setState({
        fetchDate: now,
      });
    });
  }

  render() {
    const styles = {
      background: getBackgroundFromAqi(this.state.aqi),
    };
    const classNames = cx(
      'R',
      { 'R--hasAqi': this.state.aqi !== 0 },
      { 'R--isOnline': this.state.online }
    );

    return (
      <div className={classNames} style={styles}>
        <div className="R__onlineStatus">
          <OnlineStatus
            online={this.state.online}
            fetchDate={this.state.fetchDate}
          />
        </div>
        <div className="R__location">
          <LocationBar location={this.state.location} />
        </div>
        <div className="R__aqiChart">
          <AqiPieChart value={this.state.aqi} />
        </div>
        <div className="R__aqiText">
          <AqiTextBar
            text={this.state.aqi > 0 ? getAqiSentence(this.state.aqi) : null}
          />
        </div>
      </div>
    );
  }
}

export default App;
