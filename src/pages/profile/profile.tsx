// import { ProfileUI } from '@ui-pages';
// import { FC, SyntheticEvent, useEffect, useState } from 'react';

// export const Profile: FC = () => {
//   /** TODO: взять переменную из стора */
//   const user = {
//     name: '',
//     email: ''
//   };

//   const [formValue, setFormValue] = useState({
//     name: user.name,
//     email: user.email,
//     password: ''
//   });

//   useEffect(() => {
//     setFormValue((prevState) => ({
//       ...prevState,
//       name: user?.name || '',
//       email: user?.email || ''
//     }));
//   }, [user]);

//   const isFormChanged =
//     formValue.name !== user?.name ||
//     formValue.email !== user?.email ||
//     !!formValue.password;

//   const handleSubmit = (e: SyntheticEvent) => {
//     e.preventDefault();
//   };

//   const handleCancel = (e: SyntheticEvent) => {
//     e.preventDefault();
//     setFormValue({
//       name: user.name,
//       email: user.email,
//       password: ''
//     });
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormValue((prevState) => ({
//       ...prevState,
//       [e.target.name]: e.target.value
//     }));
//   };

//   return (
//     <ProfileUI
//       formValue={formValue}
//       isFormChanged={isFormChanged}
//       handleCancel={handleCancel}
//       handleSubmit={handleSubmit}
//       handleInputChange={handleInputChange}
//     />
//   );

//   return null;
// };

import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { ProfileUI } from '@ui-pages';
import { getUserApi, updateUserApi } from '../../utils/burger-api';

export const Profile: FC = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(true);

  // Загрузка пользователя при монтировании
  useEffect(() => {
    getUserApi()
      .then((res) => {
        setUser(res.user);
        setFormValue({
          name: res.user.name,
          email: res.user.email,
          password: ''
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки пользователя:', err);
        setLoading(false);
      });
  }, []);

  const isFormChanged =
    formValue.name !== user.name ||
    formValue.email !== user.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserApi({
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password ? { password: formValue.password } : {})
      });
      setUser(updatedUser.user);
      setFormValue({
        name: updatedUser.user.name,
        email: updatedUser.user.email,
        password: ''
      });
    } catch (err) {
      console.error('Ошибка обновления:', err);
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <p>Загрузка профиля...</p>;

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
