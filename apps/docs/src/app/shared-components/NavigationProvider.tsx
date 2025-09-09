'use client'

import {FC, ReactNode} from 'react';
import {useNavigation} from '@/hooks/useNavigation';

export interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: FC<NavigationProviderProps> = ({children}) => {
  useNavigation();

  return (
    <>{children}</>
  );
};
