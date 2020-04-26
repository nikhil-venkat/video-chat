import React, { useState, useEffect} from 'react';
import OktaSignIn from '@okta/okta-signin-widget';

const Login = ({
  handleLogin,
  handleLogout
}) => {
  var OKTA_SETTINGS = {
    "baseUrl": `${process.env.REACT_APP_OKTA_ORG_URL}`,
    "clientId": `${process.env.REACT_APP_OKTA_CLIENT_ID}`,
    "issuer": `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
  };

  var okta = new OktaSignIn({
    baseUrl: OKTA_SETTINGS.baseUrl,
    clientId: OKTA_SETTINGS.clientId,
    authParams: {
      issuer: OKTA_SETTINGS.issuer,
      responseType: ["token", "id_token"],
      display: "page"
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    login: '',
    mobilePhone: '',
    secondEmail: ''
  });

  const showLogin = () => {
    okta.remove();
    okta.renderEl({ "el" : "#okta-login-container" }, 
    function(res) {
      console.log(res);
    }, 
    function(err) {
      console.log(err);
    });
  };

  useEffect(() => {
    if (okta.hasTokensInUrl()) {
      okta.authClient.token.parseFromUrl()
      .then( (data) => {
        okta.authClient.tokenManager.add('accessToken', data[0]);
        okta.authClient.tokenManager.add('idToken', data[1]);
      })
    }
    okta.authClient.session.get().then((res) => {
      if (res.status === 'ACTIVE') {
        setIsAuthenticated(true);
        res.user().then((userData) => {
          setUser(userData.profile);
          handleLogin(userData.profile.email);
        });
      } else {
        showLogin();
      }
    });
  }, [isAuthenticated]);

  const logout = () => {
    handleLogout();
    okta.authClient.session.close();
    setIsAuthenticated(false);
    showLogin();
  }


  if (isAuthenticated) {
    return (
      <div className="App">
        <div>Hello {user.firstName} </div>
        <button onClick={logout}> logout</button>
      </div>
    );
  } else {
    return (
      <div className="App" id="okta-login-container">
      </div>
    );
  }
};

export default Login;
