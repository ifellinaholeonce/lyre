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
              <label for="room_id">Room:</label>
              <textarea name='room_id'></textarea>
              <input className="btn btn-primary" type='submit' value='Join' />
            </form>
          }
        </div>
        <div className="second-tier fade-in three">
          <div className="col" id="col1">
            <div className="box half-box landing-description">
              <h1 className="landing-description-title">HOST</h1>
              <ul>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                <li>Proin vitae sapien sed sem finibus egestas.</li>
                <li>Morbi blandit nunc quis urna rutrum fermentum.</li>
                <li>Nullam non ipsum quis dui mattis luctus.</li>
                <li>Cras consectetur leo vitae turpis fringilla euismod eget a dolor.</li>
              </ul>
            </div>
          </div>
          <div className="col" id="col2">
            <div className="box half-box landing-description">
              <h1 className="landing-description-title">JOIN</h1>
              <ul>
                <li>Nam id nisl quis leo dignissim ultrices.</li>
                <li>Quisque et dui a eros cursus suscipit nec a justo.</li>
                <li>Nunc consectetur ligula non venenatis egestas.</li>
                <li>Vivamus vel nisi et ante faucibus consectetur.</li>
                <li>Sed sit amet eros id nisl mattis rutrum.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="third-tier">
          <p>
            Aliquam erat volutpat. Duis ex ligula, finibus sed sollicitudin quis, viverra non ligula. Vestibulum maximus metus vitae nisl hendrerit imperdiet. Mauris in gravida tortor. Morbi dictum nunc nibh, eget vehicula sem maximus non. Duis elementum mauris libero, non aliquam sapien mattis non. In hac habitasse platea dictumst.
          </p>
        </div>
      </div>
    );
  }

}
export default Landing;
