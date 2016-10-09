import '../style/login.scss';

import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Recaptcha from 'react-recaptcha';

import injectTapEventPlugin from 'react-tap-event-plugin';

class RegisterClient extends React.Component {

  constructor() {
    super();
  }

  createClient(e){
    e.preventDefault();
    alert('Test');

  }

  checkLogin(e) {
    e.preventDefault();
    $.post("api/user/login", {username: $('#user').val(), password: $('#pass').val()}, function(data) {
      if(data.success) {
        location.reload();
      } else {
        $('#user').addClass('error');
        $('#pass').addClass('error');
        $('#pass').val('');
      }
    });
  }

  // specifying your onload callback function
  callback(){
  console.log('Done!!!!');
};

// specifying verify callback function
  verifyCallback(response) {
  console.log(response);
};

  render() {
    const fullwidth = {
      width: '100%',
    };

    return (
      <div>
        <hgroup>
          <h1>Nerdakademie - Register Client</h1>
          <h3>by nerdakademie</h3>
        </hgroup>
        <form id="form" method="post">
            <div className="group">
              <TextField id="name" name="name" floatingLabelText="Application Name" hintText="TestApp" style={fullwidth}/>
            </div>
            <div className="group">
              <TextField id="contact" name="contact" floatingLabelText="Contact Email" hintText="admin@yourhostingprovider.de" style={fullwidth}/>
            </div>
            <div className="group">
              <TextField id="contact" name="redirect_uri" floatingLabelText="Redirect uri" hintText="http://test.de/ or tb:///" style={fullwidth}/>
            </div>
            <div className="group">
              <TextField
                hintText="This Application does things"
                floatingLabelText="Description"
                name="description"
                style={fullwidth}
                multiLine={true}
                rows={3}
              />
            </div>
          <div className="group">
            <FlatButton label="Upload application icon" backgroundColor="#4a89dc" hoverColor="#357bd8" labelStyle={{color: '#fff'}} />
          </div>
          <div className="group">
            <Recaptcha
              sitekey="6LfwyAgUAAAAAFctYGpJNVr4G0IhyutLp1amzv5N"
              render="explicit"
              verifyCallback={this.verifyCallback}
              onloadCallback={this.callback}
            />
          </div>
          <FlatButton label="Register" onClick={this.createClient} backgroundColor="#4a89dc" hoverColor="#357bd8" labelStyle={{color: '#fff'}} style={fullwidth}/>

        </form>
      </div>
    );
  }
}

injectTapEventPlugin();

let root = document.getElementById('app');
if (!root) {
  root = document.body;
}

render(<MuiThemeProvider><RegisterClient /></MuiThemeProvider>, root);
