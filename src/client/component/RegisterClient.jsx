import '../style/login.scss';

import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import ReCAPTCHA from 'react-google-recaptcha';
import DropzoneComponent from 'react-dropzone-component';
import request from 'superagent';

import injectTapEventPlugin from 'react-tap-event-plugin';

class RegisterClient extends React.Component {


  constructor() {
    super();
    this.state = {
      captchaCorrect: false,
      file: false,
      name_error: null,
      contact_error: null,
      redirectURI_error: null,
      description_error: null,
      activeRender: this.formRender.bind(this),
      responseBody:{
        clientID: 'null',
        clientSecret: 'null'
      }
    };
    this.email_reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    const maxImageWidth = 256,
      maxImageHeight = 256;

    this.djsConfig = {
      addRemoveLinks: true,
      maxFiles: 1,
      acceptedFiles: "image/jpeg,image/png",
      autoProcessQueue: false,
      init: function () {
        // Register for the thumbnail callback.
        // When the thumbnail is created the image dimensions are set.
        this.on("thumbnail", function (file) {
          // Do the dimension checks you want to do
          if (file.width > maxImageWidth || file.height > maxImageHeight) {
            file.rejectDimensions();
          }
          else {
            file.acceptDimensions();
          }
        });
      },

      // Instead of directly accepting / rejecting the file, setup two
      // functions on the file that can be called later to accept / reject
      // the file.
      accept: function (file, done) {
        file.acceptDimensions = done;
        file.rejectDimensions = function () {
          done("Image too big.");
        };
        // Of course you could also just put the `done` function in the file
        // and call it either with or without error in the `thumbnail` event
        // callback, but I think that this is cleaner.
      }.bind(this)
    };

    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png'],
      showFiletypeIcon: true,
      postUrl: 'no-url'
    };

  }

  createClient(e) {
    e.preventDefault();
    if (this.state.captchaCorrect) {
      this.resetErrors();
      let errors = 0;
      //TODO: check for image
      if ($('#name').val().length < 1) {
        this.setState({name_error: "Please provide a name"});
        errors++;
      }
      if ($('#contact').val().length < 1) {
        this.setState({contact_error: "Please provide a contact email"});
        errors++;
      } else {
        if (!this.email_reg.test($('#contact').val())) {
          this.setState({contact_error: "Please provide a valid contact email"});
          errors++;
        }
      }
      if ($('#redirectURI').val().length < 1) {
        this.setState({redirectURI_error: "Please provide a redirectURI"});
        errors++;
      }
      if ($('#description').val().length < 1) {
        this.setState({description_error: "Please provide a description"});
        errors++;
      }
      if (errors === 0) {
        const form = new FormData();
        form.append('clientPhoto', this.state.file);
        form.append('name', $('#name').val());
        form.append('contact', $('#contact').val());
        form.append('redirectURI', $('#redirectURI').val());
        form.append('description', $('#description').val());


        request.post('/oauth/createClient')
          .send(form)
          .end((function (err, resp) {
            if (err) {
              console.error(err);
            }
            if (resp.statusCode === 200) {
              this.setState({
                activeRender: this.successRender.bind(this),
                responseBody: resp.body
              });
            }
            return resp;
          }).bind(this));
      }
    }
  }

  resetErrors() {
    this.setState({
      name_error: null,
      contact_error: null,
      redirectURI_error: null,
      description_error: null
    })
  }

  handleFileAdded(file) {
    this.setState({file: file});
  }

  captchaCallback() {
    this.setState({captchaCorrect: true});
  };


  formRender() {
    const fullwidth = {
      width: '100%',
    };

    const config = this.componentConfig;
    const djsConfig = this.djsConfig;

    // For a list of all possible events (there are many), see README.md!
    const eventHandlers = {
      addedfile: this.handleFileAdded.bind(this),
    };

    return (
      <form id="form" method="post">
        <div className="group">
          <TextField id="name" name="name" floatingLabelText="Application Name" hintText="TestApp" style={fullwidth}
                     errorText={this.state.name_error}/>
        </div>
        <div className="group">
          <TextField type="email" id="contact" name="contact" floatingLabelText="Contact Email"
                     hintText="admin@yourhostingprovider.de" style={fullwidth} errorText={this.state.contact_error}/>
        </div>
        <div className="group">
          <TextField id="redirectURI" name="redirectURI" floatingLabelText="Redirect uri"
                     hintText="http://test.de/ or tb:///" style={fullwidth} errorText={this.state.redirectURI_error}/>
        </div>
        <div className="group">
          <TextField
            id="description"
            hintText="This Application does things"
            floatingLabelText="Description"
            name="description"
            style={fullwidth}
            multiLine={true}
            rows={3}
            errorText={this.state.description_error}
          />
        </div>
        <div className="group">
          <p>Upload application Image</p>
          <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig}/>
        </div>
        <div className="group">
          <ReCAPTCHA
            ref="recaptcha"
            sitekey="6LfwyAgUAAAAAFctYGpJNVr4G0IhyutLp1amzv5N"
            onChange={this.captchaCallback.bind(this)}
          />
        </div>
        <FlatButton label="Register" onClick={this.createClient.bind(this)} backgroundColor="#4a89dc"
                    hoverColor="#357bd8" labelStyle={{color: '#fff'}} style={fullwidth}/>

      </form>
    );
  }

  successRender() {
    return (
      <form id="form" method="post">
        <p>We received your request to create a OAuth Client. <br/>
          You can now use our OAuth Server with following credentials:<br/>
          clientID: {this.state.responseBody.clientID}<br/>
          clientSecret: {this.state.responseBody.clientSecret}</p>
      </form>
    )
  }

  render() {
    return (
      <div>
        <hgroup>
          <h1>Nerdakademie - Register Client</h1>
          <h3>by nerdakademie</h3>
        </hgroup>
        {this.state.activeRender()}
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
