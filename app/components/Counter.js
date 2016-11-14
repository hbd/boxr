// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom'
import { Link } from 'react-router';
import styles from './Counter.css';

/* BLE */
import BleUart from './ble-uart';
import keypress from 'keypress';

/* Charts */

/* Intensity */
import Thermometer from 'react-thermometer';

var uart = {
    serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txUUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
    rxUUID: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
}

// Use Nordic UART service
var bleSerial = new BleUart('foo', uart);

var combo_detect = 0;
var time_mark = 0;

class Counter extends Component {

    constructor (props) {
    super(props)
      this.state = {
	intensity: 0,
	leftIntensity: 0,
	rightIntensity: 0,

	leftHookCount: 0,
	leftUppercutCount: 0,
	leftJabCount: 0,

	rightJabCount: 0,
	rightHookCount: 0,
	rightUppercutCount: 0,

	comboMove: ''
      }
  }

  static propTypes = {
    intensity: PropTypes.number.isRequired,
    leftIntensity: PropTypes.number.isRequired,
    rightIntensity: PropTypes.number.isRequired,

    leftJabCount: PropTypes.number.isRequired,
    rightJabCount: PropTypes.number.isRequired,
    leftHookCount: PropTypes.number.isRequired,
    rightHookCount: PropTypes.number.isRequired,
    leftUppercutCount: PropTypes.number.isRequired,
    rightUppercutCount: PropTypes.number.isRequired,

    counter: PropTypes.number.isRequired,
    reset: PropTypes.func.isRequired,

    comboMove: PropTypes.string.isRequired
  };

  componentDidMount() {
    var that = this;

    setInterval(function () {
      if ((new Date().getTime() - time_mark) > 500) {
	  if (combo_detect > 1) {
	      console.log("Combo: " + combo_detect);
	      that.state.comboMove = 'COMBO ' + combo_detect + '!';
	  }
	  else {
	    that.state.comboMove = '';
	  }
	  combo_detect = 0
	}
    }, 500);

    setInterval(function () {
      ReactDOM.findDOMNode(that.refs.leftJab).style.color = 'white';
      ReactDOM.findDOMNode(that.refs.leftHook).style.color = 'white';
      ReactDOM.findDOMNode(that.refs.leftUppercut).style.color = 'white';

      ReactDOM.findDOMNode(that.refs.rightJab).style.color = 'white';
      ReactDOM.findDOMNode(that.refs.rightHook).style.color = 'white';
      ReactDOM.findDOMNode(that.refs.rightUppercut).style.color = 'white';

    }, 1500);

    setInterval(function() {
      if (that.state.rightIntensity >= 0)
	that.state.rightIntensity -= 1;
      that.forceUpdate();
    }, 100)

    setInterval(function() {
      if (that.state.leftIntensity >= 0)
	that.state.leftIntensity -= 1;
      that.forceUpdate();
    }, 100)

    // This function is called when data is present
    bleSerial.on('data', function(data) {
      var punches = String(data).split(" ");

      console.log('PUNCH!')
      console.log(punches);

      switch (punches[0]) {
	case 'P':
	  that.incrementPunchCount();
	  that.checkCombo(punches);
	  switch (punches[1]){
	      // left and right hand punches
	    case 'L':
	      console.log('LEFT')
	      switch (punches[2]) {
		case 'H':
		  console.log('HOOK')
		  // Display HOOK
		  that.state.leftHookCount++;
		  that.updateLeftIntensity(punches[3]);
		  if (punches[4] == 1) {
		    ReactDOM.findDOMNode(that.refs.leftHook).style.color = 'red';
		  } else if (punches[4] == 2) {
		    ReactDOM.findDOMNode(that.refs.leftHook).style.color = 'orange';
		  } else if (punches[4] == 3) {
		    ReactDOM.findDOMNode(that.refs.leftHook).style.color = 'green';
		  }
		  break;
		case 'U':
		  console.log('UPPERCUT')
		  that.state.leftUppercutCount++;
		  that.updateLeftIntensity(punches[3]);
		  if (punches[4] == 1) {
		    ReactDOM.findDOMNode(that.refs.leftUppercut).style.color = 'red';
		  } else if (punches[4] == 2) {
		    ReactDOM.findDOMNode(that.refs.leftUppercut).style.color = 'orange';
		  } else if (punches[4] == 3) {
		    ReactDOM.findDOMNode(that.refs.leftUppercut).style.color = 'green';
		  }
		  break;
		case 'S':
		  console.log('STRAIGHT')
		  that.state.leftJabCount++;
		  that.updateLeftIntensity(punches[3]);
		  if (punches[4] == 1) {
		    ReactDOM.findDOMNode(that.refs.leftJab).style.color = 'red';
		  } else if (punches[4] == 2) {
		    ReactDOM.findDOMNode(that.refs.leftJab).style.color = 'orange';
		  } else if (punches[4] == 3) {
		    ReactDOM.findDOMNode(that.refs.leftJab).style.color = 'green';
		  }
		  break;
		default:
		  break;
	      }
	      break;
	    case 'R':
	      console.log('RIGHT')
	      switch (punches[2]) {
		case 'H':
		  console.log('HOOK')
		  that.state.rightHookCount++;
		  that.updateRightIntensity(punches[3]);
		  if (punches[4] == 1) {
		    ReactDOM.findDOMNode(that.refs.rightHook).style.color = 'red';
		  } else if (punches[4] == 2) {
		    ReactDOM.findDOMNode(that.refs.rightHook).style.color = 'orange';
		  } else if (punches[4] == 3) {
		    ReactDOM.findDOMNode(that.refs.rightHook).style.color = 'green';
		  }
		  break;
		case 'U':
		  console.log('UPPERCUT')
		  that.state.rightUppercutCount++;
		  that.updateRightIntensity(punches[3]);
		  if (punches[4] == 1) {
		    ReactDOM.findDOMNode(that.refs.rightUppercut).style.color = 'red';
		  } else if (punches[4] == 2) {
		    ReactDOM.findDOMNode(that.refs.rightUppercut).style.color = 'orange';
		  } else if (punches[4] == 3) {
		    ReactDOM.findDOMNode(that.refs.rightUppercut).style.color = 'green';
		  }
		  break;
		case 'S':
		  console.log('STRAIGHT')
		  that.state.rightJabCount++;
		  that.updateRightIntensity(punches[3]);
		  if (punches[4] == 1) {
		    ReactDOM.findDOMNode(that.refs.rightJab).style.color = 'red';
		  } else if (punches[4] == 2) {
		    ReactDOM.findDOMNode(that.refs.rightJab).style.color = 'orange';
		  } else if (punches[4] == 3) {
		    ReactDOM.findDOMNode(that.refs.rightJab).style.color = 'green';
		  }
		  break;
		default:
		  break;
	      }
	      break;
	    default:
	      break;
	  }
      }
    })
  }

  checkCombo(punches) {
    var that = this;
    var snd = new Audio('./finish-him.mp3');

    if (punches[0] == 'P')
      {
        //Jab, start of combo
        if ((punches[1] == 'L') && (punches[2] == 'S')) {
            if (combo_detect == 0) {
                time_mark = new Date().getTime();
                combo_detect = 1;
              }
            else {
                combo_detect = 0;
              }
          }
        // If current combo is 1
        else if (combo_detect == 1)
          {
            if ((punches[1] == 'R') && (punches[2] == 'S')) {
                time_mark = new Date().getTime();
                combo_detect = 2;
              }
            else {
                combo_detect = 0;
              }
          }
        else if (combo_detect == 2) {
            if ((punches[1] == 'L') && (punches[2] == 'H')) {
                time_mark = new Date().getTime();
                combo_detect = 3;
              }
            else {
                console.log("Combo 2");
                combo_detect = 0;
              }
          }
        else if (combo_detect == 3) {
            if ((punches[1] == 'R') && (punches[2] == 'U')) {
                console.log("Combo 4");
		that.state.comboMove = 'Combo 4!!!!'
		snd.play();
                combo_detect = 0;
              }
            else {
                console.log("Combo 3");
                combo_detect = 0;
              }
          }
      }
  }

  incrementPunchCount() {
    this.props.increment();
  }

  updateLeftIntensity(newIntensity) {
    if (Math.ceil(parseInt(newIntensity)) > this.state.leftIntensity) {
      this.setState({
	leftIntensity: Math.ceil(parseInt(newIntensity))
      })
    }
  }

  updateRightIntensity(newIntensity) {
    if (Math.ceil(parseInt(newIntensity)) > this.state.rightIntensity) {
      this.setState({
	rightIntensity: Math.ceil(parseInt(newIntensity))
      })
    }
  }

  render() {
    const { reset, counter, intensity } = this.props;

    var statStyle = {
      color: 'white'
    }

    return (
      <div>
        <div className={styles.boxrTitle}>
          <h1>boxr</h1>
        </div>


      <div className={styles.backButton}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`counter ${styles.counter}`}>
          {counter}
      </div>

      <div className={styles.leftPunchStatsJab} ref='leftJab' style={statStyle}>
      <h2>JAB: {this.state.leftJabCount}</h2>
      </div>
      <div className={styles.leftPunchStatsHook} ref='leftHook' style={statStyle}>
      <h2>HOOK: {this.state.leftHookCount}</h2>
      </div>
      <div className={styles.leftPunchStatsUppercut} ref='leftUppercut' style={statStyle}>
      <h2>UPPERCUT: {this.state.leftUppercutCount}</h2>
      </div>

      <div className={styles.rightPunchStatsJab} ref='rightJab' style={statStyle}>
      <h2>CROSS: {this.state.rightJabCount}</h2>
      </div>
      <div className={styles.rightPunchStatsHook} ref='rightHook' style={statStyle}>
      <h2>HOOK: {this.state.rightHookCount}</h2>
      </div>
      <div className={styles.rightPunchStatsUppercut} ref='rightUppercut' style={statStyle}>
      <h2>UPPERCUT: {this.state.rightUppercutCount}</h2>
      </div>

      <div className={styles.comboMove}>
      <h1>{this.state.comboMove}</h1>
      </div>


      <div className={styles.leftTitle}>
          <h1>Left</h1>
        </div>
        <div className={styles.rightTitle}>
          <h1>Right</h1>
        </div>
        <div className={styles.leftIntensityBarChartTitle}>
          <h2>Intensity</h2>
        </div>
        <div className={styles.rightIntensityBarChartTitle}>
          <h2>Intensity</h2>
        </div>
        <div className={styles.leftIntensityBarChart}>
          <Thermometer
            min={0}
            max={100}
            width={50}
            height={750}
            backgroundColor={'white'}
            fillColor={'red'}
            current={(this.state.leftIntensity > 0) ? this.state.leftIntensity : 0}
          />
       </div>
        <div className={styles.rightIntensityBarChart}>
          <Thermometer
            min={0}
            max={100}
            width={50}
            height={750}
            backgroundColor={'white'}
            fillColor={'red'}
            current={(this.state.rightIntensity > 0) ? this.state.rightIntensity : 0}
          />
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

