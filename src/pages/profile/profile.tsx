import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { getUser, updateUser } from '../../services/reducers/userSlice';
import { ProfileUI } from '../../components/ui/pages/profile/profile';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  // Храним изначальные значения
  const [initialFormValue, setInitialFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Храним текущие значения
  const [formValue, setFormValue] = useState(initialFormValue);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [updateUserError, setUpdateUserError] = useState('');

  // Загружаем пользователя при монтировании
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Когда пользователь загружен — сохраняем начальное значение
  useEffect(() => {
    if (user) {
      setInitialFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  // Обновление текущих значений и проверка изменений
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...formValue, [name]: value };
    setFormValue(updatedForm);

    // Сравниваем с изначальным состоянием
    const hasChanges = Object.keys(updatedForm).some(
      (key) =>
        updatedForm[key as keyof typeof updatedForm] !==
        initialFormValue[key as keyof typeof initialFormValue]
    );
    setIsFormChanged(hasChanges);
  };

  // Сохранение изменений
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateUser(formValue)).unwrap();
      setInitialFormValue(formValue);
      setIsFormChanged(false);
    } catch (err: any) {
      setUpdateUserError(err.message || 'Ошибка обновления профиля');
    }
  };

  // Отмена изменений
  const handleCancel = () => {
    setFormValue(initialFormValue);
    setIsFormChanged(false);
    setUpdateUserError('');
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
    />
  );
};
