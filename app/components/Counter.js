// @flow
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './Counter.css';
import BleUart from './ble-uart';
import keypress from 'keypress';

var uart = {
    serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txUUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
    rxUUID: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
}

// Use Nordic UART service
var bleSerial = new BleUart('foo', uart);

class Counter extends Component {

  static propTypes = {
    increment: PropTypes.func.isRequired,
    incrementIfOdd: PropTypes.func.isRequired,
    incrementAsync: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired,
    counter: PropTypes.number.isRequired
  };

  componentDidMount() {
    const that = this;

    // This function is called when data is present
    bleSerial.on('data', function(data) {
      console.log('PUNCH!')
      that.incrementPunchCount()
    })
  }

  incrementPunchCount() {
    this.props.increment();
  }

  render() {
    const { increment, incrementIfOdd, incrementAsync, decrement, counter } = this.props;
    return (
      <div>
        <div className={styles.backButton}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`counter ${styles.counter}`}>
          {counter}
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={increment}>
            <i className="fa fa-plus" />
          </button>
          <button className={styles.btn} onClick={decrement}>
            <i className="fa fa-minus" />
          </button>
          <button className={styles.btn} onClick={incrementIfOdd}>odd</button>
          <button className={styles.btn} onClick={() => incrementAsync()}>async</button>
        </div>
      </div>
    );
  }
}

// Make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// This function is called when BLE establishes connection
bleSerial.on('connected', function(data) {
  console.log("Connected!");
});

// This function gets called if the radio successfully starts scanning
bleSerial.on('scanning', function(status) {
  console.log("radio status: " + status);
})

// Listen for keypress event
process.stdin.on('keypress', function (ch, key) {
  if (key && key.ctrl && key.name == 'c') {

    // Disconnect bluetooth
    bleSerial.disconnect();

    process.exit();
  }
});


export default Counter;
