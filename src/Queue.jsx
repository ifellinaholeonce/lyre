import React, {Component} from 'react';
import Song from './Song.jsx';
import Player from './Player.jsx';


class Queue extends Component {
  render() {
    return (
      <div className="queue">
        <h2>Up Next</h2>
        {this.props.queue.map((song) => {
          return (
            <div key={song.id}>
              <Song like={this.props.like} skip={this.props.skip} song={song} />
              <hr/>
            </div>)
        })}
      </div>
    );
  }

}
export default Queue;
