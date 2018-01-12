import React, {Component} from 'react';

class Bar extends Component {
  render() {
    return (
      <footer className="requestbar">
        <form  onSubmit={this.props.makeRequest}>
          <label htmlFor="title">Title:</label>
          <input className="requestbar-title" name="title" type="text" placeholder="Title" />
          <label htmlFor="artist">Artist:</label>
          <input className="requestbar-artist" name="artist" type="text" placeholder="Artist" />
          <input type="submit" value="Request"/>
        </form>
      </footer>
    );
  }

}
export default Bar;
