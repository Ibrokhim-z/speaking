export interface SpeakingQuestion {
    id: number;
    level: string;
    question: string;
    promptHint: string;
}

export const speakingQuestions: Record<string, SpeakingQuestion[]> = {
    'A1': [
        { id: 1, level: 'A1', question: 'Tell me about yourself. What is your name? Where are you from?', promptHint: 'Basic self-introduction, name, nationality' },
        { id: 2, level: 'A1', question: 'What do you do every day?', promptHint: 'Simple daily routine using present simple' },
        { id: 3, level: 'A1', question: 'Tell me about your family. How many people are in your family?', promptHint: 'Family vocabulary, numbers, basic descriptions' },
        { id: 4, level: 'A1', question: 'What food do you like?', promptHint: 'Food vocabulary, like/don\'t like' },
        { id: 5, level: 'A1', question: 'Describe your home. How many rooms do you have?', promptHint: 'Home vocabulary, there is/there are, rooms' },
        { id: 6, level: 'A1', question: 'What is your favourite colour? Why?', promptHint: 'Colours, expressing simple preferences' },
        { id: 7, level: 'A1', question: 'Do you have any pets? Tell me about them.', promptHint: 'Animals, have/don\'t have, simple adjectives' },
        { id: 8, level: 'A1', question: 'What time do you wake up in the morning?', promptHint: 'Telling time, morning routine' },
        { id: 9, level: 'A1', question: 'What day of the week do you like? Why?', promptHint: 'Days of the week, reasons' },
        { id: 10, level: 'A1', question: 'What is in your bag right now?', promptHint: 'Objects, there is/are, a/an' },
    ],
    'A2': [
        { id: 1, level: 'A2', question: 'Tell me about yourself and your daily routine.', promptHint: 'Self-introduction with daily activities, present simple and continuous' },
        { id: 2, level: 'A2', question: 'What did you do last weekend?', promptHint: 'Past simple narration of weekend activities' },
        { id: 3, level: 'A2', question: 'Tell me about your best friend. What does he or she look like?', promptHint: 'Describing people, appearance, personality adjectives' },
        { id: 4, level: 'A2', question: 'What are your plans for the future?', promptHint: 'Going to / will for future plans' },
        { id: 5, level: 'A2', question: 'Can you compare your city with another city you know?', promptHint: 'Comparatives and superlatives, city vocabulary' },
        { id: 6, level: 'A2', question: 'Tell me about your favourite holiday or celebration.', promptHint: 'Past tense, descriptive language, traditions' },
        { id: 7, level: 'A2', question: 'What do you usually do in your free time?', promptHint: 'Hobbies and leisure, frequency adverbs' },
        { id: 8, level: 'A2', question: 'Describe your favourite room in your house.', promptHint: 'Prepositions of place, furniture vocabulary' },
        { id: 9, level: 'A2', question: 'How do you get to school or work? Describe your journey.', promptHint: 'Transport vocabulary, directions, prepositions' },
        { id: 10, level: 'A2', question: 'What did you have for breakfast today? Do you eat healthy food?', promptHint: 'Food and drink, past simple, healthy lifestyle' },
    ],
    'A2+': [
        { id: 1, level: 'A2+', question: 'Tell me about yourself, your background and your interests.', promptHint: 'Extended self-introduction with hobbies and interests' },
        { id: 2, level: 'A2+', question: 'Have you ever traveled to another country? Tell me about it.', promptHint: 'Present perfect for experiences, past simple for details' },
        { id: 3, level: 'A2+', question: 'What were you doing this time yesterday?', promptHint: 'Past continuous usage, describing interrupted actions' },
        { id: 4, level: 'A2+', question: 'What should a person do to stay healthy?', promptHint: 'Modal verbs (should, must, have to), health vocabulary' },
        { id: 5, level: 'A2+', question: 'Tell me about a film or book you enjoyed recently.', promptHint: 'Past tense narration, expressing opinions, descriptive language' },
        { id: 6, level: 'A2+', question: 'If it is sunny tomorrow, what will you do?', promptHint: 'First conditional, weather vocabulary, future plans' },
        { id: 7, level: 'A2+', question: 'Describe someone in your family. What are they like?', promptHint: 'Personality adjectives, present simple for habits' },
        { id: 8, level: 'A2+', question: 'What is the most interesting place you have visited?', promptHint: 'Superlatives, present perfect, descriptive language' },
        { id: 9, level: 'A2+', question: 'Tell me about your typical Saturday. What do you usually do?', promptHint: 'Adverbs of frequency, present simple routines' },
        { id: 10, level: 'A2+', question: 'What kind of music do you like? Why?', promptHint: 'Music vocabulary, giving reasons, expressing preferences' },
    ],
    'B1': [
        { id: 1, level: 'B1', question: 'Tell me about yourself — your background, education, and goals in life.', promptHint: 'Extended self-introduction with life goals, present perfect and future forms' },
        { id: 2, level: 'B1', question: 'If you could live in any country, where would you live and why?', promptHint: 'Second conditional, expressing preferences with reasons' },
        { id: 3, level: 'B1', question: 'Describe a difficult situation you faced and how you solved it.', promptHint: 'Past narrative, problem-solving vocabulary, sequencing' },
        { id: 4, level: 'B1', question: 'What are the advantages and disadvantages of social media?', promptHint: 'Expressing opinions, balanced arguments, linking words' },
        { id: 5, level: 'B1', question: 'Tell me about a person who has influenced your life.', promptHint: 'Present perfect/past simple, describing character, expressing impact' },
        { id: 6, level: 'B1', question: 'What changes would you make to your city if you could? Why?', promptHint: 'Second conditional, civic vocabulary, suggestions' },
        { id: 7, level: 'B1', question: 'Do you think children should learn a foreign language at school? Why or why not?', promptHint: 'Expressing opinions, should/shouldn\'t, education vocabulary' },
        { id: 8, level: 'B1', question: 'Describe a memorable event from your childhood.', promptHint: 'Past tenses, narrative skills, emotional vocabulary' },
        { id: 9, level: 'B1', question: 'How has technology changed the way people communicate?', promptHint: 'Present perfect for changes, comparing past and present' },
        { id: 10, level: 'B1', question: 'Tell me about a skill you would like to learn and explain why.', promptHint: 'Would like to, expressing ambitions, giving reasons' },
    ],
    'B1+': [
        { id: 1, level: 'B1+', question: 'Introduce yourself and talk about your professional experience and ambitions.', promptHint: 'Professional self-introduction, career vocabulary, complex tenses' },
        { id: 2, level: 'B1+', question: 'If you had the chance to change one thing about your past, what would it be?', promptHint: 'Third conditional, reflection, hypothetical reasoning' },
        { id: 3, level: 'B1+', question: 'Some people say technology makes us less social. Do you agree?', promptHint: 'Discussion skills, agreeing/disagreeing, supporting arguments' },
        { id: 4, level: 'B1+', question: 'Describe a memorable journey you have taken.', promptHint: 'Narrative tenses, descriptive language, travel vocabulary' },
        { id: 5, level: 'B1+', question: 'What changes do you think will happen in education in the next ten years?', promptHint: 'Future predictions, modals of speculation, education vocabulary' },
        { id: 6, level: 'B1+', question: 'Tell me about a time when you had to make a difficult decision.', promptHint: 'Past tenses, had to, decision-making vocabulary' },
        { id: 7, level: 'B1+', question: 'What role does sport play in modern society?', promptHint: 'Abstract discussion, generalizing, sport vocabulary' },
        { id: 8, level: 'B1+', question: 'Describe a news story that surprised you recently.', promptHint: 'Reported speech, passive voice, news vocabulary' },
        { id: 9, level: 'B1+', question: 'How important is it to learn about other cultures? Give examples.', promptHint: 'Cultural awareness, giving examples, expressing importance' },
        { id: 10, level: 'B1+', question: 'If you could have dinner with any person from history, who would it be and why?', promptHint: 'Second conditional, historical knowledge, justification' },
    ],
    'B2': [
        { id: 1, level: 'B2', question: 'Tell me about yourself, what drives you, and what you are passionate about.', promptHint: 'Sophisticated self-introduction, abstract concepts, complex grammar' },
        { id: 2, level: 'B2', question: 'Should governments invest more in space exploration or solving problems on Earth? Discuss.', promptHint: 'Academic discussion, balanced argument, formal register' },
        { id: 3, level: 'B2', question: 'Describe a time when you had to adapt to a completely new environment.', promptHint: 'Extended narrative, emotional vocabulary, complex sentence structures' },
        { id: 4, level: 'B2', question: 'How has globalization affected your country\'s culture?', promptHint: 'Abstract discussion, cause and effect, cultural vocabulary' },
        { id: 5, level: 'B2', question: 'If you were in charge of your city, what three changes would you make and why?', promptHint: 'Hypothetical reasoning, justification, civic vocabulary' },
        { id: 6, level: 'B2', question: 'Is it better to work for a large company or start your own business? Compare.', promptHint: 'Comparing and contrasting, business vocabulary, conditional structures' },
        { id: 7, level: 'B2', question: 'How do you think climate change will affect future generations?', promptHint: 'Environmental vocabulary, future forms, speculation' },
        { id: 8, level: 'B2', question: 'Describe a book or film that changed your perspective on something.', promptHint: 'Past tenses, abstract thinking, expressing impact' },
        { id: 9, level: 'B2', question: 'To what extent should parents control what their children do online?', promptHint: 'Degree of opinion, modals, digital literacy vocabulary' },
        { id: 10, level: 'B2', question: 'Tell me about a cultural tradition in your country that is changing. Why is it changing?', promptHint: 'Present continuous for changes, cultural vocabulary, cause and effect' },
    ],
    'C1': [
        { id: 1, level: 'C1', question: 'Give a detailed introduction about your personal and professional life, including your values.', promptHint: 'Nuanced self-introduction, abstract thinking, sophisticated vocabulary' },
        { id: 2, level: 'C1', question: 'To what extent do you think artificial intelligence will reshape the job market?', promptHint: 'Complex analysis, hedging language, speculative reasoning' },
        { id: 3, level: 'C1', question: 'Discuss the ethical implications of genetic engineering in humans.', promptHint: 'Ethical reasoning, formal register, academic vocabulary' },
        { id: 4, level: 'C1', question: 'Compare the education systems of two countries you\'re familiar with.', promptHint: 'Analytical comparison, education-specific vocabulary, formal structures' },
        { id: 5, level: 'C1', question: 'Some argue that freedom of speech should have no limits. What is your perspective?', promptHint: 'Philosophical argument, nuanced opinion, rhetorical devices' },
        { id: 6, level: 'C1', question: 'How do economic inequalities shape political stability in different regions?', promptHint: 'Socio-political analysis, complex cause-effect, formal register' },
        { id: 7, level: 'C1', question: 'Evaluate the role of art and literature in shaping societal values.', promptHint: 'Cultural analysis, abstract concepts, evaluative language' },
        { id: 8, level: 'C1', question: 'Should scientific research always be driven by potential commercial applications? Discuss.', promptHint: 'Academic debate, concession, scientific vocabulary' },
        { id: 9, level: 'C1', question: 'Describe a dilemma where two ethical principles conflicted. How would you resolve it?', promptHint: 'Ethical reasoning, hypothetical structures, nuanced argument' },
        { id: 10, level: 'C1', question: 'To what extent does the media influence public opinion? Give specific examples.', promptHint: 'Media literacy, exemplification, hedging and qualifying' },
    ],
};

export function getSpeakingQuestionsForLevel(level: string): SpeakingQuestion[] {
    return speakingQuestions[level] || speakingQuestions['A1'];
}
