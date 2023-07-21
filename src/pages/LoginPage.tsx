/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import React, { useState } from 'react';
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const errorMessages = {
    usernameError: 'Please enter a username.',
    emailError: 'Please enter a valid email address.',
    passwordError: 'Please enter a password.',
  };
  const formTitle = isLoginForm ? 'Sign In' : 'Register';
  const changeFormMessage = isLoginForm
    ? 'Do not have an account? '
    : 'Already have an account? ';
  const changeFormAnchorMessage = isLoginForm ? 'Sign up' : 'Log in';

  const clearFields = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const clearErrors = () => {
    setUsernameError(false);
    setEmailError(false);
    setPasswordError(false);
  };

  const isEmailValid = (value: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const changeForm = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (username || email || password) {
      clearFields();
    }
    if (usernameError || emailError || passwordError) {
      clearErrors();
    }
    setIsLoginForm(!isLoginForm);
  };

  const isFormValid = (): boolean => {
    const usernameValid = !!username;
    const passwordValid = !!password;
    let emailValid = true;
    if (!isLoginForm) {
      emailValid = isEmailValid(email);
    }

    if (!usernameValid || !passwordValid || !emailValid) {
      setUsernameError(!usernameValid);
      setPasswordError(!passwordValid);
      setEmailError(!emailValid);

      return false;
    }

    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // TODO: Implement debounce + useCallback
    event.preventDefault();
    setIsFormSubmitting(true);

    if (isFormValid()) {
      clearErrors();

      if (isLoginForm) {
        console.log(`Login --- User: ${username} Password: ${password}`);
      } else {
        console.log(
          `Register --- User: ${username} Email: ${email} Password: ${password}`,
        );
      }
    }

    setTimeout(() => {
      setIsFormSubmitting(false);
    }, 1000);
  };

  return (
    <div className="authentication-page">
      <div className="authentication-container">
        <div className="form-title">{formTitle}</div>

        <form onSubmit={handleSubmit}>
          <InputText
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            className={usernameError ? 'p-invalid' : ''}
          />
          {usernameError && (
            <span className="error-message">{errorMessages.usernameError}</span>
          )}
          {!isLoginForm && (
            <>
              <InputText
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className={emailError ? 'p-invalid' : ''}
              />
              {emailError && (
                <span className="error-message">
                  {errorMessages.emailError}
                </span>
              )}
            </>
          )}
          <Password
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            toggleMask
            feedback={!isLoginForm}
            className={passwordError ? 'p-invalid' : ''}
          />
          {passwordError && (
            <span className="error-message">{errorMessages.passwordError}</span>
          )}
          <Button type="submit" label={formTitle} disabled={isFormSubmitting} />
        </form>

        <span className="change-form">
          {changeFormMessage}
          <a href="" onClick={(e) => changeForm(e)}>
            {changeFormAnchorMessage}
          </a>
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
