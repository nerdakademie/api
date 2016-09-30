import React from 'react';
import $ from 'jquery';
import {Card, CardHeader} from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';

class UserList extends React.Component {

  constructor() {
    super();
    this.state = {users: []};
  }

  loadUsers() {
    $.getJSON('api/users/', (users) => {
      this.setState({
        users
      });
    });
  }

  componentDidMount() {
    this.loadUsers();
  }

  createCard(user) {
    return (
      <Card key={user._id}>
        <CardHeader
          title={user.name}
          subtitle={user.subtitle}
        />
      </Card>
    );
  }

  render() {
    return (
      <div>
        <AppBar
          title="Title"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        {this.state.users.map(this.createCard)}
      </div>
    );
  }
}

export default UserList;
