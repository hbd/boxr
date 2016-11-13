// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import intensity from './intensity';
import rightIntensity from './rightIntensity';
import leftIntensity from './leftIntensity';

import leftHookCount from './leftHookCount';
import leftUppercutCount from './leftUppercutCount';
import leftJabCount from './leftJabCount';

import rightHookCount from './rightHookCount';
import rightUppercutCount from './rightUppercutCount';
import rightJabCount from './rightJabCount';

import comboMove from './comboMove';

const rootReducer = combineReducers({
  intensity,

  leftIntensity,
  rightIntensity,

  leftHookCount,
  leftUppercutCount,
  leftJabCount,

  rightJabCount,
  rightHookCount,
  rightUppercutCount,

  comboMove,

  counter,
  routing
});

export default rootReducer;
