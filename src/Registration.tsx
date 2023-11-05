import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './styles.css';
// import { ErrorCallback } from 'typescript';

interface RegistrationProps {
  onRegister: () => void;
}

function Registration({ onRegister = () => {}}: RegistrationProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      // const data = await response.json();
      if (response.ok) {
        onRegister();
        setRedirectToLogin(true);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        // we'll proceed, but let's report it
        setError(message)
      }
  };

  const navigate = useNavigate();
  useEffect(() => {
  if (redirectToLogin) {
    console.log("Redirecting to login");
    try{
      return navigate('/login');
    }
    catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      console.log("Error: " + error);
      }
  }
}, [redirectToLogin, navigate]);

  return (
    <div className="Registration">
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="Registration-input"/>
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="Registration-input" />
        </label>
        <br />
        <label>
          Confirm Password:
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="Registration-input" />
        </label>
        <br />
        <button type="submit" className="Registration-button"> Register</button>
        {error && <p className="Registration-error">{error}</p>}
        <p>Already have a account?</p>
        <button className="Registration-button" onClick={() => setRedirectToLogin(true)} >
            Login here
        </button>
        {/* <a href="/login" className="Registration-button">Login here</a> */}
      </form>
    </div>
  );
}

export default Registration;