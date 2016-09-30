import '../style/login.scss';

import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import injectTapEventPlugin from 'react-tap-event-plugin';

class LoginForm extends React.Component {

  constructor() {
    super();
  }


  render() {
    const style = {
      width: '100%',
    };
    return (
      <div>
        <hgroup>
          <h1>Nerdakademie - Login</h1>
          <h3>by nerdakademie</h3>
        </hgroup>
        <form id="form" method="post" action="/auth/loginCorrect">
          <center>
            <div className="group">
              <TextField id="user" name="username" floatingLabelText="NAK Benutzername" style={style}/>
            </div>
            <div className="group">
              <TextField id="pass" name="password" floatingLabelText="NAK Passwort" type="password" style={style}/>
            </div>
          </center>
          <FlatButton label="Login" type="submit" backgroundColor="#4a89dc" hoverColor="#357bd8" labelStyle={{color: '#fff'}} style={style}/>

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

render(<MuiThemeProvider><LoginForm /></MuiThemeProvider>, root);
