/* eslint-disable jsx-a11y/anchor-is-valid */
import axios, { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast, ToastMessage } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useUserDispatch } from '../hooks/useUserDispatch';
import { IUser } from '../interfaces/user/IUser';
import { createUser, loginUser } from '../services/api';
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  const { dispatchLoginUser } = useUserDispatch();

  const toastRef = useRef<Toast>(null);

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

  const showToast = (toast: ToastMessage) => {
    if (toastRef?.current) {
      toastRef.current.show(toast);
    }
  };

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

  const changeForm = (event?: React.MouseEvent<HTMLAnchorElement>) => {
    if (event) {
      event.preventDefault();
    }
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

  const handleLogin = async (): Promise<IUser | null> => {
    const response = await loginUser(username, password);

    if (axios.isAxiosError(response)) {
      const axiosError = response as AxiosError<any>;
      showToast({
        severity: 'error',
        summary: 'Invalid credentials.',
        detail: axiosError?.response?.data?.error,
        life: 5000,
      });
    } else if (response?.status === 200) {
      showToast({
        severity: 'success',
        summary: 'Login successful.',
        detail: 'You have successfully logged in.',
      });

      return response?.data?.user as IUser;
    }

    return null;
  };

  const handleRegister = async (): Promise<boolean> => {
    const response = await createUser(username, email, password);

    if (axios.isAxiosError(response)) {
      const axiosError = response as AxiosError<any>;
      showToast({
        severity: 'error',
        summary: 'User registration error',
        detail: axiosError?.response?.data?.error,
        life: 5000,
      });
    } else if (response?.status === 201) {
      showToast({
        severity: 'success',
        summary: 'User registration successful',
        detail: 'You have successfully registered.',
      });

      setTimeout(() => {
        showToast({
          severity: 'info',
          summary: 'Login access',
          detail: 'To access the website, please log in with your credentials.',
        });
      }, 3500);

      return true;
    }

    return false;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // TODO: Implement debounce + useCallback
    event.preventDefault();
    setIsFormSubmitting(true);

    if (isFormValid()) {
      clearErrors();

      if (isLoginForm) {
        const user = await handleLogin();
        if (user) {
          dispatchLoginUser(user);
        }
      } else {
        const success = await handleRegister();
        if (success) {
          changeForm();
        }
      }
    }

    setIsFormSubmitting(false);
  };

  return (
    <div className="authentication-page">
      <Toast ref={toastRef} />
      {isFormSubmitting && <ProgressSpinner />}
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
