import React, {Component} from 'react';
import Song from './Song.jsx';
import Player from './Player.jsx';


class CurrentPlaying extends Component {
  render() {
    return (
      <div>
        <h1>Currently Playing</h1>
        <Song like={this.props.like} skip={this.props.skip} song={this.props.currentSong} />
        <Player />
        <h2>Up Next</h2>
        {this.props.queue.map((song) => {
          return (
            <div>
              <Song like={this.props.like} skip={this.props.skip} song={song} />
              <hr/>
            </div>)
        })}
      </div>
    );
  }

}
export default CurrentPlaying;
