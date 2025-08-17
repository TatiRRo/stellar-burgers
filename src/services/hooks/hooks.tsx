import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { useState, ChangeEvent, Dispatch, SetStateAction } from 'react';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useForm = <T extends Record<string, string>>(
  initialValues: T
): {
  values: T;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setValues: Dispatch<SetStateAction<T>>;
} => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return { values, handleChange, setValues };
};
