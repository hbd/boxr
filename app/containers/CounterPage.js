// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter';
import * as IntensityActions from '../actions/intensity';

function mapStateToProps(state) {
  return {
    counter: state.counter,

    intensity: state.intensity,
    leftIntensity: state.rightIntensity,
    rightIntensity: state.rightIntensity,

    leftHookCount: state.leftHookCount,
    leftUppercutCount: state.leftUppercutCount,
    leftJabCount: state.leftJabCount,

    rightJabCount: state.rightJabCount,
    rightHookCount: state.rightHookCount,
    rightUppercutCount: state.rightUppercutCount,

    comboMove: state.comboMove,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...CounterActions, ...IntensityActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
