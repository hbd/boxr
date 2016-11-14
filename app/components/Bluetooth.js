
// @flow
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';


class Bluetooth extends Component {
  static propTypes = {
    increment: PropTypes.func.isRequired,
    counter: PropTypes.number.isRequired
  };


  render() {
    const { increment, counter } = this.props;
    return (
      <div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={increment}>
            <i className="fa fa-plus" />
          </button>
        </div>
      </div>
    );
  }

}

export default Bluetooth;

