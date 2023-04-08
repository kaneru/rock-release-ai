/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { htmlToText } from 'html-to-text';

export const config = {
    api: {
        externalResolver: true,
    },
};

type Data = {
    prompts?: unknown[];
    error?: string;
};

type GithubPullRequestBody = {
    user: string;
    repo: string;
    pullId: string;
    forWhom: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { body, method } = req;

    if (method === 'POST') {
        console.log(req.body);
        const githubPullRequest = JSON.parse(body) as GithubPullRequestBody;
        const githubResponse = await fetch(
            `https://api.github.com/repos/${githubPullRequest.user}/${githubPullRequest.repo}/pulls/${githubPullRequest.pullId}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${process.env.GITHUB_KEY}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            },
        );
        const githubData = await githubResponse.json();
        const jiraIssuesFromPullRequest = (githubData.body as string).split('\r\n');
        console.log(jiraIssuesFromPullRequest);
        const confluenceLinksFromJiraIssues = await Promise.all(
            jiraIssuesFromPullRequest.map(async (issue) => {
                const jiraIssueResponse = await fetch(
                    `https://rockrelease.atlassian.net/rest/api/latest/issue/${issue}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Basic ${process.env.JIRA_KEY}`,
                        },
                    },
                );
                const jiraIssueData = await jiraIssueResponse.json();

                return jiraIssueData?.fields?.customfield_10034;
            }),
        );

        console.log(confluenceLinksFromJiraIssues);

        const docsTextFromConfluenceLinks = await Promise.all(
            confluenceLinksFromJiraIssues.map(async (link) => {
                const pageId = link.split('/').at(-1);
                console.log(pageId);
                const confluencePageResponse = await fetch(
                    `https://rockrelease.atlassian.net/wiki/rest/api/content/${pageId}?expand=body.storage`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Basic ${process.env.JIRA_KEY}`,
                        },
                    },
                );
                const confluencePageHtml = await confluencePageResponse.json();

                return confluencePageHtml?.body?.storage?.value;
            }),
        );

        const convertedHtmlToText = docsTextFromConfluenceLinks.map((docText) => htmlToText(docText));

        const prompts = await Promise.all(
            convertedHtmlToText.map(async (text, index) => {
                const jiraLink = `https://rockrelease.atlassian.net/browse/${jiraIssuesFromPullRequest[index]}`;
                const confluenceLink = confluenceLinksFromJiraIssues[index];
                const messageForUsers = `Есть документация на фичу для мобильного приложения. Напиши одно короткое предложение в стиле release notes по этой фиче, используя данные из документа ниже:
                ${text}`;
                const messageForBusiness = `Есть документация на фичу для мобильного приложения. Напиши одно короткое предложение по этой фиче и ее влияние на метрики приложения, используя данные из документа ниже:
                ${text}`;
                const messageForQA = `Есть документация на фичу для мобильного приложения. Напиши одно короткое предложение в стиле release notes по этой фиче для QA-инженера, используя данные из документа ниже. Также, нужно в конце оставить ссылки в отдельных строках на Jira и Confluence, вот они — ${jiraLink} и ${confluenceLink}. А вот текст самой документации:

                ${text}`;
                const mapper = {
                    users: messageForUsers,
                    business: messageForBusiness,
                    qa: messageForQA,
                };
                const chatGPTResponse = await fetch(`https://api.openai.com/v1/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'user',
                                content: mapper[githubPullRequest.forWhom],
                            },
                        ],
                    }),
                });
                const promptData = await chatGPTResponse.json();

                return promptData?.choices[0]?.message?.content;
            }),
        );

        console.log(prompts);

        return res.status(200).json(prompts);
    }

    return res.status(400).json({ error: 'Wrong method' });
}
