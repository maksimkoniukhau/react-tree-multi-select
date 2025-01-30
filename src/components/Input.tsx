import React, {FC, memo} from 'react';
import {InputProps} from '../types';

export interface InputOwnProps {
  placeholder: string;
  value: string;
}

export const Input: FC<InputProps> = memo((props) => {

  return (
    <input {...props.componentAttributes}/>
  );
});
