import { Field, Form } from 'react-final-form';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { InputAdapter, ChipsAdapter, Chip } from '@indriver/kaycee';
import { useMutation } from 'react-query';
import axios from 'axios';
import { Button, Divider, Heading } from '@indriver/nova';
import { Logo } from './logo';

const required = (value: unknown) => (value ? undefined : 'Input must be filled');
const requiredChips = (value: unknown) => (Array.isArray(value) && value.length ? undefined : 'Chip must be selected');

export const MyForm = () => {
    const mutation = useMutation(async (body: unknown) => {
        return axios.post('/api/hello', JSON.stringify(body), {
            headers: { 'Content-Type': 'text/plain' },
        });
    });

    function urlify(text: string) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part) => {
            if (part.match(urlRegex)) {
                if (part.includes('browse')) return <a href={part}>Ссылка на задачу</a>;
                if (part.includes('wiki')) return <a href={part}>Ссылка на документацию</a>;
            }
            return part;
        });
    }

    const onSubmit = async (values: Record<string, string>) => {
        const githubLink = values.github_pr.split('/');
        const user = githubLink[3];
        const repo = githubLink[4];
        const pullId = githubLink[6];
        const githubPRBody = { user, repo, pullId };

        mutation.mutate({ ...githubPRBody, forWhom: values.chips[0] });
    };

    return (
        <div style={{ maxWidth: '768px', margin: '0 auto', paddingBottom: '4rem' }}>
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ margin: '0 auto' }}>
                                <Logo />
                            </div>
                            <Field
                                name='github_pr'
                                label='Enter Github PR link'
                                required
                                validate={required}
                                component={InputAdapter}
                            />
                            <Field
                                name='chips'
                                label='For whom?'
                                component={ChipsAdapter}
                                chipsMultiple={false}
                                validate={requiredChips}
                                formField={{ label: 'Страна', hint: 'Выберите страну проживания' }}>
                                <Chip id='users'>Users</Chip>
                                <Chip id='business'>Business</Chip>
                                <Chip id='qa'>QA</Chip>
                            </Field>
                            <Button
                                type='submit'
                                loading={mutation.isLoading}
                                design='primary'
                                style={{
                                    width: '200px',
                                    // background: 'var(--extensions-background-inverseprimary)',
                                    // border: '1px solid var(--extensions-background-inverseprimary)',
                                    // color: '#ffffff',
                                    alignSelf: 'flex-end',
                                }}>
                                RRA!
                            </Button>
                        </div>
                    </form>
                )}
            />
            {mutation.data?.data.length > 0 ? (
                <>
                    <Heading type='h2' style={{ marginTop: '1rem' }}>
                        Release notes
                    </Heading>
                    <div
                        style={{
                            background: 'var(--background-secondary)',
                            borderRadius: '16px',
                            padding: '2em',
                            margin: '1rem 0',
                        }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0 }}>
                            {mutation.data?.data.map((item: unknown, index: number) => {
                                console.log(item);
                                return (
                                    <>
                                        <div key={index} style={{ lineHeight: 1.25 }} className='dont-break-out'>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{item}</ReactMarkdown>
                                        </div>
                                        {index !== mutation.data?.data.length - 1 ? <Divider /> : null}
                                    </>
                                );
                            })}
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};
