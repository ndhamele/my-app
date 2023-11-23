import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('http://172.20.6.239:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        authContext?.login(data.token, data.role);
        navigate('/dashboard');
      } //else if (email === 'test@gmail.com' && password === 'test') {
      //   authContext?.login('test');
      //   navigate('/dashboard');
      // } 
      else {
        setError('Login failed: ' + response.statusText);
      }
    } catch (error: any) {
      console.log(error);
      setError('Network error: ' + error.message);
    }
  };

  return (
    <div className="Login">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h1>Canvas Login</h1>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="Registration-input"
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="Registration-input"
            />
          </label>
          <br />
          <button type="submit" className="Registration-button">Login</button>
          {error && <div>{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;
