import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from './Login';
import App from './App';

test('renders login form', () => {
  const onLogin = jest.fn();
  render(<Login onLogin={onLogin} />);
  const usernameInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /login/i });
  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});