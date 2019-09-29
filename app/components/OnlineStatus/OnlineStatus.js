import { h, Component } from 'preact';
import javascript_time_ago from 'javascript-time-ago';

import css from './onlineStatus.less';

require('javascript-time-ago/intl-messageformat-global');
require('intl-messageformat/dist/locale-data/en');

javascript_time_ago.locale(require('javascript-time-ago/locales/en'));
const time_ago_english = new javascript_time_ago('en-US');

class OnlineStatus extends Component {
  constructor(props) {
    super(props);

    this.setIntervalId = null;

    this.state = {
      date: null,
      dateString: '',
    };
  }

  componentDidMount() {
    const date = this.props.fetchDate;
    this.setDate(date);
  }

  componentWillReceiveProps(nextProps) {
    const date = nextProps.fetchDate;
    this.setDate(date);

    clearInterval(this.setIntervalId);

    this.setIntervalId = setInterval(() => {
      this.setDate(date);
    }, 1000 * 60);
  }

  componentDidUnmount() {
    clearInterval(this.setIntervalId);
  }

  setDate(date) {
    this.setState({
      date,
      dateString: this.getRelativeTimeString(date),
    });
  }

  getRelativeTimeString(date) {
    return time_ago_english.format(new Date(date));
  }

  render() {
    return (
      <div className="onlineStatus">
        <i className="fa fa-exclamation-triangle" /> You're currently offline •
        updated {this.state.dateString}
      </div>
    );
  }
}

export default OnlineStatus;
