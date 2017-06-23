const DEFAULT_FREQUENCY = 256;
const DEFAULT_TYPE = 'sine';
const MAX_VOLUME = 0.5;
const MIN_VOLUME = 0;

class Tone {
  constructor(props = {}) {
    this.audioContext = props.audioContext || new AudioContext();

    this.gain = this.audioContext.createGain();
    this.gain.connect(this.audioContext.destination);
    this.gain.gain.value = MIN_VOLUME;

    this.osc = this.audioContext.createOscillator();
    this.osc.frequency.value = DEFAULT_FREQUENCY;
    this.osc.type = DEFAULT_TYPE;
    this.osc.connect(this.gain);
    this.osc.start();
  }

  set frequency(val) {
    this.osc.frequency.value = val;
  }

  get frequency() {
    return this.osc.frequency.value;
  }

  set mute(val) {
    this.gain.gain.value = val ? MIN_VOLUME : MAX_VOLUME;
  }

  get mute() {
    return this.gain.gain.value === MIN_VOLUME;
  }
}

export default Tone;