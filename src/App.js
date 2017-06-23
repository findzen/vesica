import React, { Component } from 'react';
import Knob from 'react-canvas-knob';

import Tone from './Tone';
import './App.css';

const DEFAULTS = {
  beatRange: 'theta',
  carrier: 80,
  mute: true
};

const BEATS = {
  delta: {
    min: 0.5,
    max: 3
  },
  theta: {
    min: 3,
    max: 8
  },
  alpha: {
    min: 8,
    max: 12
  },
  beta: {
    min: 12,
    max: 38
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    this.left = this.createTone(-1);
    this.right = this.createTone(1);

    this.state = {
      beat: null,
      beatRange: DEFAULTS.beatRange,
      carrier: DEFAULTS.carrier,
      mute: DEFAULTS.mute
    }

    this.update(this.state.carrier, this.state.beatRange);

    // iOS audio hack
    window.addEventListener('touchstart', () => {
      // create empty buffer
      let buffer = this.audioContext.createBuffer(1, 1, 22050);
      let source = this.audioContext.createBufferSource();

      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start();
    }, false);
  }

  createTone(pan) {
    let tone = new Tone({ audioContext: this.audioContext, pan: pan });

    return tone;
  }

  calcBeat(carrier, beatRange) {
    let beat = carrier;

    while (beat > BEATS[beatRange].max) {
      beat = beat / 2;
    }

    return beat;
  }

  update(carrier, beatRange) {
    let beat = this.calcBeat(carrier, beatRange);
    let diff = beat / 2;

    this.left.frequency = carrier - diff;
    this.right.frequency = carrier + diff;

    return { beat: beat, beatRange: beatRange, carrier: carrier }
  }

  onBeatClick = (val) => {
    this.setState(() => this.update(this.state.carrier, val));
  };

  onCarrierChange = (val) => {
    this.setState(() => this.update(val, this.state.beatRange));
  };

  onMuteClick = () => {
    this.setState((prevState, props) => {
      this.state.mute = this.left.mute = this.right.mute = !prevState.mute;

      return { mute: !prevState.mute };
    });
  };

  render() {
    return (
      <main>
        {this.left.frequency}
        <button
          onClick={this.onMuteClick}
        >
          {this.state.mute ? 'Unmute' : 'Mute'}
        </button>
        {this.right.frequency}
        <div className="container">
          <Knob
            min={33}
            max={111}
            value={this.state.carrier}
            onChange={this.onCarrierChange}
            onChangeEnd={this.onCarrierChange}
          />
        </div>

        <div className="beat">
          <button
            className={`${this.state.beatRange === 'delta' ? 'selected' : ''}`}
            onClick={() => this.onBeatClick('delta')}
          >
            δ
          </button>
          <button
            className={`${this.state.beatRange === 'theta' ? 'selected' : ''}`}
            onClick={() => this.onBeatClick('theta')}
          >
            θ
          </button>
          <button
            className={`${this.state.beatRange === 'alpha' ? 'selected' : ''}`}
            onClick={() => this.onBeatClick('alpha')}
          >
            α
          </button>
          <button
            className={`${this.state.beatRange === 'beta' ? 'selected' : ''}`}
            onClick={() => this.onBeatClick('beta')}
          >
            β
          </button>
        </div>
        {this.state.beat}
      </main>
    );
  }
}

export default App;
