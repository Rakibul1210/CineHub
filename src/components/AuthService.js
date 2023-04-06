const AuthService = {
    getToken: () => {
      return localStorage.getItem('token');
    },
  
    setToken: (token) => {
      localStorage.setItem('token', token);
    },
  
    clearToken: () => {
      localStorage.removeItem('token');
      return true;
    }
  };
  
  export default AuthService;