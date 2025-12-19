function animateTyping() {
    const messages = ["CREATE YOUR WEBSITE IN EASY WAY", "FAST. SIMPLE. EFFICIENT.", "BRING YOUR IDEAS TO LIFE."];
    const textElement = document.getElementById('welcome-text');
    if (!textElement) return;

    let messageIndex = 0;
    let charIndex = 0;
    let direction = 1; // 1 = typing forward, -1 = deleting backward
    const typingSpeed = 50;
    const deletingSpeed = 50;
    const pauseAfterFull = 1000;
    const pauseAfterEmpty = 400;

    function step() {
        const message = messages[messageIndex];

        if (direction === 1) { // type forward
            if (charIndex < message.length) {
                charIndex++;
                textElement.textContent = message.slice(0, charIndex);
                setTimeout(step, typingSpeed);
            } else {
                // full message shown -> wait, then switch to deleting
                setTimeout(() => {
                    direction = -1;
                    setTimeout(step, deletingSpeed);
                }, pauseAfterFull);
            }
        } else { // delete backward
            if (charIndex > 0) {
                charIndex--;
                textElement.textContent = message.slice(0, charIndex);
                setTimeout(step, deletingSpeed);
            } else {
                // fully deleted -> move to next message and start typing
                messageIndex = (messageIndex + 1) % messages.length;
                direction = 1;
                setTimeout(step, pauseAfterEmpty);
            }
        }
    }
    textElement.textContent = '';
    step();
}

window.addEventListener('load', animateTyping);