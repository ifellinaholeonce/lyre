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
          [<h1 className="title fade-in one" key='title'>lyre .</h1>,
          <p className="subtitle fade-in two" key="subtitle">Democratize Your Party's Playlist</p>,
          <button className="btn btn-primary fade-in three" key='hostButton' onClick={this.props.host}>HOST THE PARTY</button>,
          <button className="btn btn-alternate fade-in three" key='joinButton' onClick={this.showJoinForm}>JOIN THE PARTY</button>]
        }
        {(this.state.joinForm) &&
          <form onSubmit={this.joinRoom}>
            <label>Room:</label>
            <textarea name='room_id'></textarea>
            <input className="btn btn-primary" type='submit' value='Join' />
          </form>
        }
        </div>
        <div className="second-tier">
          <div className="col" id="col1">
            <div className="box half-box">HOST</div>
          </div>
          <div className="col" id="col2">
            <div className="box half-box">JOIN</div>
          </div>
        </div>
      </div>
    );
  }

}
export default Landing;
