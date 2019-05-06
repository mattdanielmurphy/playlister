"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _howler = require("howler");

var _Controls = _interopRequireDefault(require("../components/Controls"));

var _PlayerSongs = _interopRequireDefault(require("./PlayerSongs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Player extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      repeat: false,
      currentTime: 0,
      timeRemaining: '-:--',
      songSources: [],
      canPlayThrough: false,
      songLoading: true,
      playing: false
    });

    _defineProperty(this, "startTimeInterval", () => this.timeInterval = setInterval(() => this.handleTimeUpdate(), 1000));

    _defineProperty(this, "stopTimeInterval", () => clearInterval(this.timeInterval));

    _defineProperty(this, "toggleRepeat", () => this._isMounted ? this.setState({
      repeat: !this.state.repeat
    }) : null);

    _defineProperty(this, "togglePlayPause", () => this.state.playing ? this.pause() : this.play());

    _defineProperty(this, "handleOnPlay", () => {
      if (this._isMounted) this.setState({
        playing: true,
        continuePlaying: true
      });
    });

    _defineProperty(this, "handleOnStop", () => {
      this.stopTimeInterval();
      if (this._isMounted) this.setState({
        playing: false
      });
    });

    _defineProperty(this, "handleSeek", e => this.state.currentSong.sound.seek(e.target.value));

    _defineProperty(this, "handleKeyDown", e => {
      if (!this.keyHeld) {
        this.keyHeld = true;
        if (e.key === ' ') this.state.playing ? this.pause() : this.play();else if (e.key === 'ArrowRight') this.skip('next');else if (e.key === 'ArrowLeft') this.skip('prev');
      }
    });

    _defineProperty(this, "handleKeyUp", e => this.keyHeld = false);

    _defineProperty(this, "componentDidMount", () => {
      this._isMounted = true;
      this.loadAudio();
      this.handleKeyboardControls();
    });

    _defineProperty(this, "render", () => _react.default.createElement("main", {
      id: "playlist"
    }, _react.default.createElement(_PlayerSongs.default, {
      changeSong: i => this.changeSong(i),
      songs: this.props.songs,
      currentSongIndex: this.props.currentSongIndex,
      playing: this.state.playing,
      songLoading: this.state.songLoading
    }), _react.default.createElement(_Controls.default, {
      songLoading: this.state.songLoading,
      playing: this.state.playing,
      canPlayThrough: this.state.canPlayThrough,
      timeRemaining: this.state.timeRemaining,
      repeat: this.state.repeat,
      togglePlayPause: () => this.togglePlayPause(),
      skip: direction => this.skip(direction),
      handleSeek: e => this.handleSeek(e),
      setVolume: volume => this.setVolume(volume),
      toggleRepeat: repeat => this.toggleRepeat(repeat)
    })));
  }

  loadAudio(currentSongIndex = this.props.currentSongIndex) {
    const songs = this.props.songs;
    const currentSong = songs[currentSongIndex];
    currentSong.sound = new _howler.Howl({
      src: currentSong.source,
      format: 'mp3',
      preload: true,
      onload: () => this.handleOnLoad(),
      onend: () => this.skip('next'),
      onplay: () => this.handleOnPlay(),
      onstop: () => this.handleOnStop()
    });
    this.props.setPlaylistState({
      songs
    });
    if (this._isMounted) this.setState({
      currentSong
    });
  }

  skip(direction) {
    let index = direction === 'prev' ? this.props.currentSongIndex - 1 : this.props.currentSongIndex + 1;
    if (index < 0) index = this.props.songs.length - 1;else if (index > this.props.songs.length - 1) index = 0;
    this.changeSong(index);
  }

  changeSong(currentSongIndex) {
    this.state.currentSong.sound.stop();
    if (this._isMounted) this.setState({
      songLoading: true,
      timeRemaining: '-:--'
    });
    this.props.setPlaylistState({
      currentSongIndex
    });
    this.loadAudio(currentSongIndex);
    const seek = document.getElementById('seek');
    seek.value = 0;
    if (!this.state.playWhenReady) this.setState({
      playWhenReady: true
    });
  }

  playSong(currentSongIndex) {
    this.state.currentSong.sound.stop();
    this.props.setPlaylistState({
      currentSongIndex
    });
    this.state.currentSong.sound.play();
  }

  play() {
    if (this.state.loading) {
      if (this._isMounted) this.setState({
        playWhenReady: true
      });
    } else {
      this.state.currentSong.sound.play();
      if (this._isMounted) this.setState({
        continuePlaying: true
      });
      if (this.state.playWhenReady) this.setState({
        playWhenReady: false
      });
    }
  }

  pause() {
    if (this._isMounted) this.setState({
      playing: false
    });
    this.state.currentSong.sound.pause();
  }

  getTimeRemaining({
    duration = this.state.currentSongDuration,
    currentTime = this.state.currentTime
  }) {
    const totalSecs = Math.floor(duration - currentTime);
    const secsRemaining = totalSecs % 60;
    const minsRemaining = totalSecs < 60 ? 0 : (totalSecs - secsRemaining) / 60;

    const leadingZero = n => n < 10 ? `0${n}` : n;

    return `${minsRemaining}:${leadingZero(secsRemaining)}`;
  } //
  // HANDLERS
  //


  handleOnLoad() {
    const duration = this.state.currentSong.sound.duration();
    const seek = document.getElementById('seek');
    if (!seek) return null;
    seek.max = duration;
    const currentTime = 0;
    this.startTimeInterval();
    if (this._isMounted) this.setState({
      songLoading: false,
      currentSongDuration: duration,
      timeRemaining: this.getTimeRemaining({
        duration,
        currentTime
      }),
      canPlayThrough: true
    });
    if (this.state.playWhenReady && !this.state.currentSong.sound.playing()) this.play();else if (this.state.continuePlaying) this.play();else this.pause();
  }

  handleTimeUpdate() {
    if (this._isMounted) this.setState({
      currentTime: this.state.currentSong.sound.seek()
    });
    const seek = document.getElementById('seek');
    if (!seek) return null;
    seek.value = this.state.currentSong.sound.seek();
    if (this._isMounted) this.setState({
      timeRemaining: this.getTimeRemaining({
        currentTime: this.state.currentSong.sound.seek()
      })
    });
  } // KEYBOARD HANDLERS


  handleKeyboardControls() {
    window.addEventListener('keydown', e => this.handleKeyDown(e));
    window.addEventListener('keyup', e => this.handleKeyUp(e));
  } //
  // Lifecycle Methods
  //


  componentWillUnmount() {
    this._isMounted = false;
    this.state.currentSong.sound.off();
    this.state.currentSong.sound.unload();
    this.stopTimeInterval();
    window.removeEventListener('keydown', e => this.handleKeyDown(e));
    window.removeEventListener('keyup', e => this.handleKeyUp(e));
  }

  setVolume(volume) {
    this.state.currentSong.sound.volume(volume);
  }

}

var _default = Player;
exports.default = _default;