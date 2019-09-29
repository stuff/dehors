import { h, Component } from 'preact';

import css from './AqiPieChart.less';

import TWEEN from 'tween.js';
import Arc from '../Arc';
import AQI from '../../aqiConstants';
import AqiValue from '../AqiValue';

const MORE = 33;

class AqiPieChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animatedNeedleAqi: this.props.value,
      animatedNumberAqi: this.props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    const startValue = this.props.value;
    const endValue = nextProps.value;

    if (startValue === endValue) {
      return;
    }

    this.startNeedleTween(startValue, endValue);
    this.startAqiNumTween(startValue, endValue);
  }

  startNeedleTween(startValue, endValue) {
    const self = this;
    const tween = new TWEEN.Tween({ value: startValue });

    tween
      .to({ value: endValue }, 2000)
      .easing(TWEEN.Easing.Elastic.Out)
      .onUpdate(function() {
        self.setState({ animatedNeedleAqi: this.value });
      })
      .start();
  }

  startAqiNumTween(startValue, endValue) {
    const self = this;
    const tween = new TWEEN.Tween({ value: startValue });

    tween
      .to({ value: endValue }, 800)
      .onUpdate(function() {
        self.setState({ animatedNumberAqi: this.value });
      })
      .start();
  }

  renderChartBack(stroke, transform = '') {
    return (
      <Arc
        x={50}
        y={50}
        radius={40}
        startAngle={-90 - MORE - 4}
        endAngle={90 + MORE + 4}
        fill="none"
        style={{ strokeWidth: 20 }}
        stroke={stroke}
        transform={transform}
      />
    );
  }

  renderNeedle(color, animatedAqi, max, transform = '') {
    const rotation = animatedAqi / (max / (180 + MORE * 2));
    return (
      <g transform={transform}>
        <g transform={'rotate(-123 50 50)'}>
          <polygon
            points="0.5,0 2.5,0 3,60 0,60"
            fill={color}
            transform={`rotate(${rotation} 50 50) translate(48.5,1)`}
          />
        </g>
      </g>
    );
  }

  render() {
    const AQIdata = [...AQI].reverse();
    let max = null;

    return (
      <div className="aqiPieChart">
        <svg viewBox="0 0 100 100">
          {this.renderChartBack('rgba(0, 0, 0, 0.2)', 'translate(0, 4)')}
          {this.renderChartBack('rgb(255, 255, 255)')}
          <g transform="rotate(-90 50 50)">
            {AQIdata.map(aqi => {
              if (!max) {
                max = aqi.max;
              }

              const val = aqi.max / (max / (180 + MORE * 2));

              return (
                <Arc
                  key={aqi.title}
                  stroke={aqi.color}
                  fill="none"
                  style={{ strokeWidth: 15 }}
                  x={50}
                  y={50}
                  radius={40}
                  startAngle={-MORE}
                  endAngle={val - MORE}
                />
              );
            })}
          </g>

          {this.renderNeedle(
            'rgba(0, 0, 0, 0.3)',
            this.state.animatedNeedleAqi,
            max,
            'translate(0, 1)'
          )}
          {this.renderNeedle('black', this.state.animatedNeedleAqi, max)}

          <circle cx="50" cy="50" r="4" />
        </svg>
        <div className="aqiPieChart__text">
          <AqiValue value={this.state.animatedNumberAqi.toFixed(0)} />
        </div>
      </div>
    );
  }
}

export default AqiPieChart;
