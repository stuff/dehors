import { h } from 'preact';
import cx from 'classnames';

import css from './AqiTextBar.less';

const AqiTextBar = ({ text }) => {
  const classNames = cx('aqiTextBar', { 'aqiTextBar--isVisible': text });
  return (
    <div className={classNames}>
      <i className="fa fa-angle-double-right" /> {text || ''}
    </div>
  );
};

export default AqiTextBar;
