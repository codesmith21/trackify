let AuthFactory = function ($http, $auth, $q) {

    let auth = {user: null};

    let isAuthenticated = () => $auth.isAuthenticated();

    let getLoggedInUser = () => auth;

    let getUser = () => {
        // Resolving with auth if user detail is already fetched
        if (auth.user) return $q.resolve(auth.user);

        console.log('Fetching user\'s auth data');

        return $http.get('/api/users/me')
            .then(({data}) => auth.user = data)
            // .catch(({data}) => console.log('FAILED: ', data.message));
    };

    let login = (credentials) => {
        return $auth.login(credentials)
            .then(getUser)
            .catch(({data}) => $q.reject(data.message) );
    };    

    let unlink = (provider) => {
      return $auth.unlink(provider)
        .then()
        .catch(({data}) => data.message );
    };
    
    let link = (provider) => {
      return $auth.link(provider)
        .then()
        .catch(({data}) => data.message );
    };

    let signup = (credentials) => {
        return $auth.signup(credentials)
            .then(res => {
                $auth.setToken(res);
                getUser();
            })
            .catch(({data}) => data.message );
    };

    let authenticate = (provider) => {
        return $auth.authenticate(provider)
            .then(getUser)
            .catch(({data}) => data.message );
    };

    let logout = () => {
        if (!$auth.isAuthenticated()) return;
        return $auth.logout()
            .then(() => auth.user = null)
            .catch(({data}) => data.message );
    };

    return { signup, login, logout, link, unlink, getLoggedInUser, getUser, isAuthenticated, authenticate, auth};
};

AuthFactory.$inject = ['$http', '$auth', '$q'];

export default AuthFactory;