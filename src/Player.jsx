import React, {Component} from 'react';

class Player extends Component {
  render() {
    return (
      <form  onSubmit={this.props.makeRequest}>
        <label htmlFor="title">Title:</label>
        <input name="title" type="text" placeholder="Title" />
        <label htmlFor="artist">Artist:</label>
        <input name="artist" type="text" placeholder="Artist" />
        <input type="submit" value="Request"/>
      </form>
    );
  }

}
export default Player;
