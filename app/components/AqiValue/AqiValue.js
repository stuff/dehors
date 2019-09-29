import { h, Component } from 'preact';

import css from './AqiValue.less';

class AqiValue extends Component {
  render() {
    const value = this.props.value;

    return (
      <div className="aqiValue">
        {value > 0 ? (
          <div className="aqiValue__value">{this.props.value}</div>
        ) : (
          <i className="fa fa-spinner fa-pulse fa-2x fa-fw  aqiValue__spinner" />
        )}
        <div className="aqiValue__text">Air Quality Index</div>
      </div>
    );
  }
}

export default AqiValue;
