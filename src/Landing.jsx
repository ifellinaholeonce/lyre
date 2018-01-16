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
        {!(this.state.joinForm) && !(this.state.hostForm) &&
          [<h1 key='title'>Welcome</h1>,
          <button key='joinButton' onClick={this.showJoinForm}>Join The Party</button>,
          <button key='hostButton' onClick={this.props.host}>Host</button>]
        }
        {(this.state.joinForm) &&
          <form onSubmit={this.joinRoom}>
            <label>Room:</label>
            <textarea name='room_id'></textarea>
            <input type='submit' value='Join' />
          </form>
        }
      </div>
    );
  }

}
export default Landing;
