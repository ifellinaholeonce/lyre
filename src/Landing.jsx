import React, {Component} from 'react';

class Landing extends Component {
  constructor (props) {
    super(props)
    this.state = {
      joinForm: false,
      hostForm: false
    }
  }
  //ONCLICK from JOIN should display form
  showJoinForm = () => {
    this.setState({
      joinForm: true
    })
  }

  joinRoom = (e) => {
    e.preventDefault();
    let room_id = e.target.room_id.value;
    this.props.join(room_id)
  }

  render() {
    return (
      <div className="landing">
        <div className="first-tier">
        {!(this.state.joinForm) && !(this.state.hostForm) &&
          [<h1 className="title" key='title'>Lyre</h1>,
          <p className="subtitle" key="subtitle">Democratize Your Party's Playlist</p>,
          <button className="btn btn-success" key='joinButton' onClick={this.showJoinForm}>Join The Party</button>,
          <button className="btn btn-secondary" key='hostButton' onClick={this.props.host}>Host</button>]
        }
        {(this.state.joinForm) &&
          <form onSubmit={this.joinRoom}>
            <label>Room:</label>
            <textarea name='room_id'></textarea>
            <input type='submit' value='Join' />
          </form>
        }
        </div>
        <div className="second-tier">
          <div className="col" id="col1"></div>
          <div className="col" id="col2"></div>
          <div className="col" id="col3"></div>
        </div>
      </div>
    );
  }

}
export default Landing;
