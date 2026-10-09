const defaultLegacyArticleContent = {
  excerpt: 'A practical look at the AI tools making the biggest impact in everyday work and creative workflows.',
  paragraphs: [
    'The most helpful AI tools do not just automate a single task. They save time, make decisions easier and improve the quality of work across several stages of a workflow.',
    'When choosing a tool, the best question is not “What is the most advanced model?” but “Which one solves a real bottleneck for my work?” For creators, that might be idea generation or editing. For students, it might be research summaries or note organization. For business users, it might be meeting support, content drafting and task automation.',
    'The best stack often blends a general assistant with one or two specialized tools. Microsoft and Google are increasingly integrated across workspaces, while independent tools remain strong in design, video and specialized research tasks.',
  ],
  faqs: [
    { question: 'Should I try more than one AI tool?', answer: 'Yes. Many people use a general assistant plus one specialized tool depending on the task.' },
    { question: 'How do I keep AI output useful?', answer: 'Start with clear prompts, verify facts and review outputs before publishing or shipping work.' },
  ],
  sources: ['Gartner AI adoption reports', 'Industry tool documentation', 'Author review of workflow patterns'],
};

export const legacyArticleContent = {
  'best-ai-tools-to-try-in-2026': defaultLegacyArticleContent,
};

export function getLegacyArticleContent(slug) {
  return legacyArticleContent[slug] || defaultLegacyArticleContent;
}

export function legacyArticleContentToMarkdown(content) {
  return [
    ...content.paragraphs,
    '## Frequently asked questions',
    ...content.faqs.flatMap(({ question, answer }) => [`### ${question}`, answer]),
    '## Sources',
    ...content.sources.map((source) => `- ${source}`),
  ].join('\n\n');
}
