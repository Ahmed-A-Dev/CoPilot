const FORTUNES = [
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Your future is created by what you do today, not tomorrow.",
    "Code is like humor. When you have to explain it, it's bad.",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "First, solve the problem. Then, write the code.",
    "Experience is the name everyone gives to their mistakes.",
    "The best error message is the one that never shows up.",
    "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
    "Talk is cheap. Show me the code. - Linus Torvalds",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "The most disastrous thing that you can ever learn is your first programming language.",
    "Programs must be written for people to read, and only incidentally for machines to execute.",
    "The best way to get a project done faster is to start sooner.",
    "Debugging is twice as hard as writing the code in the first place.",
    "It's not a bug – it's an undocumented feature.",
    "Before software can be reusable it first has to be usable.",
    "The computer was born to solve problems that did not exist before.",
    "Make it work, make it right, make it fast.",
    "Good code is its own best documentation.",
    "The journey of a thousand apps begins with a single click.",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "Technology is best when it brings people together.",
    "The future belongs to those who learn more skills and combine them in creative ways.",
    "Don't let yesterday take up too much of today.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts."
];

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FORTUNES;
} else {
    window.FORTUNES = FORTUNES;
}
