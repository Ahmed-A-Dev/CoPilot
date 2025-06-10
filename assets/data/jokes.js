const PROGRAMMING_JOKES = [
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
    "Why don't programmers like nature? It has too many bugs.",
    "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?'",
    "Why do Java developers wear glasses? Because they can't C#!",
    "There are only 10 types of people in the world: those who understand binary and those who don't.",
    "Why did the programmer quit his job? He didn't get arrays!",
    "What's the object-oriented way to become wealthy? Inheritance.",
    "Why do programmers always mix up Christmas and Halloween? Because Oct 31 == Dec 25!",
    "A byte walks into a bar, the bartender asks: 'Are you null?' The byte replies: 'No, I'm positive!'",
    "Why did the developer go broke? Because he used up all his cache!",
    "What do you call a programmer from Finland? Nerdic!",
    "Why don't programmers like to go outside? The sunlight causes too many reflections!",
    "How do you comfort a JavaScript bug? You console it!",
    "Why did the programmer break up with the internet? There was no connection.",
    "What's a programmer's favorite hangout place? Foo Bar!",
    "Why do programmers hate nature? It has too many trees and not enough logs!",
    "What did the Java code say to the C code? You've got no class!",
    "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings!",
    "How did the developer die? He didn't get enough REST!"
];

const TECH_JOKES = [
    "Why was the computer cold? It left its Windows open!",
    "What do you call a computer superhero? A screensaver!",
    "Why don't robots ever panic? They have nerves of steel!",
    "What do you get when you cross a computer and a lifeguard? A screensaver!",
    "Why did the computer go to the doctor? Because it had a virus!",
    "What do you call a computer that sings? A-dell!",
    "Why don't computers take their hats off? Because they have CAPS LOCK on!",
    "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
    "Why did the smartphone go to therapy? It had too many hang-ups!",
    "What do you call a sleeping bull at a computer store? A bulldozer!"
];

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PROGRAMMING_JOKES, TECH_JOKES };
} else {
    window.PROGRAMMING_JOKES = PROGRAMMING_JOKES;
    window.TECH_JOKES = TECH_JOKES;
}
