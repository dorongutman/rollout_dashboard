import React from 'react'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import moment from 'moment';
import Chip from 'material-ui/Chip';
import PercentageSelect from '../Inputs/PercentageSelect';
import './CreateDialog.scss';



class CreateDialog extends React.Component {

  constructor (props) {
      super(props);
      this.state = {
          users: [],
          errors: {}
      };
      this.removeUser = this.removeUser.bind(this);
      this.addUser = this.addUser.bind(this);
      this.updateInput = this.updateInput.bind(this);
  }

    removeUser(userID) {
        const users  = this.state.users.filter(user => user !== userID );
        this.setState({users: users});
    }

    addUser(userID) {
        const users  = this.state.users;
        if(users.filter(user => user == userID ).length) { return; }
        users.push(userID);
        this.setState({users})
    }

    updateInput(inputName, inputValue) {
        const state = {};
        state[inputName] = inputValue;
        this.setState(state);
    }

    validate() {
        const errors = {};

        if(!this.state.author) {
            errors['author'] = 'This field is required';
        }

        if(!this.state.description) {
            errors['description'] = 'This field is required';
        }

        let authorMail = this.state.author_mail;

        if(!authorMail) {
            errors['author_mail'] = 'This field is required';
        } else if (!authorMail.match(/[a-zA-Z0-9._]{3,}@[a-zA-Z0-9._]{3,}\.[a-zA-Z]+/i)) {
            errors['author_mail'] = 'Nice try. Please enter a valid email address.';
        }

        let featureName = this.state.name;
        if(!featureName) {
            errors['name'] = 'This field is required';
        } else if(!featureName.match(new RegExp(`[a-z_]{${featureName.length}}`))){
            errors['name'] = 'This name must follow this pattern "[a-z_]{value.length}"';
        }

        this.setState({errors});
        return !Object.keys(errors).length;
    }

  render() {

      const {
          onApproval,
          onClose
      } = this .props;


      const actions = [

          <FlatButton
              label="Cancel"
              primary={true}
              style={{color: 'red'}}
              onTouchTap={onClose}
          />,
          <FlatButton
              label="Confirm"
              primary={true}
              style={{color: 'green'}}
              onTouchTap={() => {
                const isValid = this.validate();
                if(!isValid) {return; }
                onApproval(this.state)}
              }
          />,
      ];

      return (<Dialog className="dialog-create"
                      actions={actions}
                      modal={false}
                      open={true}
                      onRequestClose={onClose}
                      autoScrollBodyContent={true}

      >
          <p> Creating a new feature </p>

          <div className="left box">
              <TextField
                  className="field"
                  value={this.state.name}
                  name="name"
                  floatingLabelText="Feature Name:"
                  errorText={this.state.errors['name']}
                  floatingLabelFixed={true}
                  onChange={ (_,value) => {
                      this.updateInput('name', value)
                  }}

              />
              <TextField
                  className="field"
                  name="author"
                  value={this.state.author}
                  floatingLabelText="Author:"
                  errorText={this.state.errors['author']}
                  floatingLabelFixed={true}
                  onChange={ (_,value) => {
                      this.updateInput('author', value)
                  }}
              />
              <TextField
                  className="field"
                  value={this.state.author_mail}
                  name="author_mail"
                  floatingLabelText="Author Mail:"
                  errorText={this.state.errors['author_mail']}
                  floatingLabelFixed={true}
                  onChange={ (_,value) => {
                      this.updateInput('author_mail', value)
                  }}
              />
              <TextField
                  className="field"
                  value={moment().format('YYYY-MM-DD')}
                  floatingLabelText="Created At:"
                  floatingLabelFixed={true}
                  disabled={true}
              />
          </div>
          <div className="right box">
              <TextField
                  className="field"
                  defaultValue={this.state.description}
                  floatingLabelText="Description:"
                  errorText={this.state.errors['description']}
                  floatingLabelFixed={true}
                  multiLine={true}
                  rows={2}
                  onChange={ (_,value) => {
                      this.updateInput('description', value)
                  }}
              />

              <PercentageSelect currentValue={this.state.percentage}  onChange={ (_, value) => {
                  this.updateInput('percentage', value)
              }} />

          </div>

          <div className="chips-container">
              <h1> Users: </h1>
              <TextField
                  className="add-users"
                  hintText="Enter userID and press enter"
                  floatingLabelText="UserID:"
                  floatingLabelFixed={true}
                  onKeyDown={(event) => {
                      if(event.keyCode !== 13) { return; }
                      this.addUser(event.target.value);
                  }}
              />
              {this.state.users.map((user)=> {
                  return (
                      <Chip
                          className="user"
                          key={user}
                          onRequestDelete={() => {
                              this.removeUser(user)
                          }}
                      >
                          {user}
                      </Chip>
                  )
              })}
          </div>

      </Dialog>)
  }


}

export default CreateDialog;