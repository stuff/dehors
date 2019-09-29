import { h } from 'preact';

import css from './LocationBar.less';

const LocationBar = ({ location }) => {
  if (location) {
    return (
      <div className="locationBar">
        <i className="fa fa-map-marker  locationBar__icon" /> {location}
      </div>
    );
  } else {
    return (
      <div className="locationBar locationBar--searching">
        <i className="fa fa-map-marker  locationBar__icon  animated infinite tada" />
      </div>
    );
  }
};

export default LocationBar;
