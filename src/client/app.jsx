import './style/main.scss';

import injectTapEventPlugin from 'react-tap-event-plugin';
import Drawer from 'material-ui/Drawer';


import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
injectTapEventPlugin();

let root = document.getElementById('app');
if (!root) {
  root = document.body;
}

render(<MuiThemeProvider open='true' />, root);
