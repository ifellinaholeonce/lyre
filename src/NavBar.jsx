import React, {Component} from 'react';

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar">
        <a href="/" className="navbar-brand">lyre</a>
        {this.props.room_id !== "" && <span className="navbar-brand">{this.props.room_id}</span>}
      </nav>
    );
  }

}
export default NavBar;
