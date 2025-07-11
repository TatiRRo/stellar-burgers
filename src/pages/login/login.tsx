import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '../../utils/burger-api';
import { setCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state?.from?.pathname as string) || '/profile';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const res = await loginUserApi({ email, password });
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorText(err.message || 'Ошибка входа');
    }
  };

  return (
    <LoginUI
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      errorText={errorText}
      handleSubmit={handleSubmit}
    />
  );
};
