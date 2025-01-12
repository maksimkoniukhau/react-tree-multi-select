import React, {FC, HTMLProps, memo} from 'react';
import {ComponentProps} from './models';

export interface InputProps {
  placeholder: string;
  value: string;
}

export const Input: FC<ComponentProps<InputProps>> = memo((props) => {

  return (
    <input {...props.rootAttributes as HTMLProps<HTMLInputElement>}/>
  );
});
