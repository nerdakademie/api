import '../style/dialog.scss';

import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';

import injectTapEventPlugin from 'react-tap-event-plugin';

class AccessDialog extends React.Component {

  constructor() {
    super();
  }

  render() {
    const style = {
      width: '40%',
      margin: '5%'
    };
    return (
      <div>
        <hgroup>
          <h1>Nerdakademie - Access Dialog</h1>
          <h3>by nerdakademie</h3>
        </hgroup>
        <form id="form" method="post" action="/oauth/dialog/authorize/decision">
          <input name="transaction_id" type="hidden" value={data.transactionID}/>
            <center>
              <p>Hi <b>{data.user.username}</b>,<br/>
                The application <b>{data.client.name}</b> is requesting access to your account.
                Do you approve?
              </p>
            </center>
            <FlatButton name="accept" type="submit" id="allow" label="Allow" backgroundColor="#4a89dc" hoverColor="#357bd8" labelStyle={{color: '#fff'}} style={style}/>
            <FlatButton name="cancel" type="submit" id="deny" label="Deny" backgroundColor="#ff3333" hoverColor="#e60000" labelStyle={{color: '#fff'}} style={style}/>
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

render(<MuiThemeProvider><AccessDialog /></MuiThemeProvider>, root);
