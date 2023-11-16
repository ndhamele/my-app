import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './styles.css';
// import { ErrorCallback } from 'typescript';

interface RegistrationProps {
  onRegister: () => void;
}

function Registration({ onRegister = () => {}}: RegistrationProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('Student');
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
      const response = await fetch('http://172.20.6.239:3000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, firstName, lastName, role, password })
      });
      // const data = await response.json();
      if (response.ok) {
        onRegister();
        navigate('/login');
      } else if(response.status === 409) {
        setError('User already exists. Try logging in.');
      }
      else {
        setError('Registration failed: ' + response.statusText);
      }
    } catch (error) {
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        // we'll proceed, but let's report it
        setError(message)
      }
  };
  const handleLoginRedirect = () => {
    navigate('/login');
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
          First Name:
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="Registration-input"/>
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="Registration-input"/>
        </label>
        <br />
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)} className="Registration-input">
            <option value="Student">Student</option>
            <option value="TA">TA</option>
            <option value="Professor">Professor</option>
          </select>
        </label>
        <br />
        <label>
          Email:
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="Registration-input"/>
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
        <button className="Registration-button" onClick={handleLoginRedirect} >
            Login here
        </button>
        {/* <a href="/login" className="Registration-button">Login here</a> */}
      </form>
    </div>
  );
}

export default Registration;