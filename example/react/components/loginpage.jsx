import React from 'react';
import { connect } from 'react-redux';
import auth from '../state/auth';
import { Form } from 'formsy-react';
import { Input } from 'formsy-react-components';

// note - this is not at all good react-code, just something easy to show redux-ish.

@connect(st => ({ auth: st.auth }), {
  onLogin: auth.login,
  onLogout: auth.logout
})
export default class LoginPage extends React.Component {
  renderLoadingPage() {
    return <div>Logging in...</div>;
  }

  renderUserPage(user) {
    return <div>
      <div>You've logged in as <strong>{user.username}</strong>!</div>
      <button className="btn btn-primary" onClick={this.props.onLogout}>Log out</button>
    </div>;
  }
    
  renderFormPage() {
    let error = this.props.auth.error;
    let errorMessage = error && <div className="alert alert-danger">{error}</div>;
    return (
        <Form onSubmit={this.props.onLogin}>
          <div className="well">
            Write the same username and password to log in. (test / test, for example)
          </div>
          <Input name="username" value="" label="Username" layout="vertical" />
          <Input name="password" value="" label="Password" layout="vertical" type="password" />
          <input className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Log in" />
          {errorMessage}        
        </Form>
    );  
  }
  
  render() {
    let inner = null;
    if (this.props.auth.loading) inner = this.renderLoadingPage();
    else if (this.props.auth.user) inner = this.renderUserPage(this.props.auth.user);
    else inner = this.renderFormPage();
    return <div className="container">
      <div className="col-sm-6 col-sm-push-3">
        {inner}
      </div>
    </div>;
  }
}
