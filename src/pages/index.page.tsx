/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable no-throw-literal */
import { FormField, Heading, Input, ThemeProvider, useTheme } from '@indriver/nova';
import { styled } from '@linaria/react';
import getConfig from 'next/config';
import React from 'react';
import { MyForm } from '../components/form';

interface IProps {
    heading: string;
}

const Wrapper = styled.div`
    padding: 64px;
    box-sizing: border-box;
    height: 100vh;
    &.theme-dark {
        background-color: var(--background-primary);
        color: #fff;
    }
`;
const Header = styled.div`
    margin: 32px 0;
`;

const ThemeButton = styled.button<{ isActive?: boolean }>`
    border: 0;
    background: ${({ isActive }) => (isActive ? '#ececec' : 'transparent')};
    padding: 8px;
    cursor: pointer;
    transition: all 0.17s ease-in-out;
    font-size: 32px;
`;

const { publicRuntimeConfig } = getConfig();
const Content = ({ heading }: IProps) => {
    const { theme, setTheme } = useTheme();
    const [value, setValue] = React.useState('');

    const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        setValue((e.target as HTMLInputElement).value);
    };

    return (
        <Wrapper className={theme}>
            {/* <ThemeButton isActive={theme === 'theme-dark'} onClick={() => setTheme('theme-dark')}>
                🌚
            </ThemeButton>
            <ThemeButton isActive={theme === 'theme-light'} onClick={() => setTheme('theme-light')}>
                🌝
            </ThemeButton>
            <Header>
                <Heading type='h1' size='xxl'>
                    {heading}
                </Heading>
                Test Env Variable: {process.env.NEXT_PUBLIC_ANALYTICS_ID}
            </Header>

            <FormField label='wow' hint='such input'>
                <Input name='title' value={value} onChange={handleInputChange} />
            </FormField>
            <code>
                <pre>{publicRuntimeConfig?.SENTRY_DSN}</pre>
            </code> */}
            <MyForm />
        </Wrapper>
    );
};

const Page = ({ heading }: IProps) => {
    return (
        <ThemeProvider>
            <Content heading={heading} />
        </ThemeProvider>
    );
};

Page.getInitialProps = async function () {
    return {
        heading: 'Привет! Это — Next.js стартер',
    };
};
export default Page;
