import React, { FC } from 'react';
import { Body } from './app.styles';

export const App: FC = ({ children }) => {
    return <Body>{children}</Body>;
};
