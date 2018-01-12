import React, {Component} from 'react';
import Song from './Song.jsx';
import Player from './Player.jsx';


class CurrentPlaying extends Component {
  render() {
    return (
      <div className="currentplaying">
        <h1>Currently Playing</h1>
        {this.props.host === 1 && //Only render the YouTube player for the host.
        <Player song={this.props.currentSong} nextSong={this.props.nextSong}/> }
        <Song like={this.props.like} skip={this.props.skip} song={this.props.currentSong} />
        <hr />
      </div>
    );
  }

}
export default CurrentPlaying;
