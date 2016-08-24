import './style/main.scss';

import injectTapEventPlugin from 'react-tap-event-plugin';
import Drawer from 'material-ui/Drawer';

import React from 'react';
import ReactDOM from 'react-dom';

injectTapEventPlugin();

let root = document.getElementById('app');
if (!root) {
  root = document.body;
}

ReactDOM.render(<Drawer open='true' />, root);
