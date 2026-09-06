// ==========================================
// PORTFOLIO WEBSITE JAVASCRIPT
// ==========================================


// ==========================================
// 1. MOBILE NAVIGATION
// ==========================================

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


// Close mobile menu when a navigation link is clicked

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});


// ==========================================
// 2. HEADER SCROLL EFFECT
// ==========================================

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


// ==========================================
// 3. ACTIVE NAVIGATION LINK
// ==========================================

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach((section) => {

        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }

    });

    navItems.forEach((link) => {

        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }

    });

});


// ==========================================
// 4. UPDATE COPYRIGHT YEAR
// ==========================================

const year = document.querySelector(".footer p");

if (year) {

    const currentYear = new Date().getFullYear();

    year.textContent =
        `© ${currentYear} Mohit Saini. All rights reserved.`;

}


// ==========================================
// 5. PAGE LOAD MESSAGE
// ==========================================

console.log("Mohit Saini's portfolio loaded successfully!");

/* =================================
   AI ASSISTANT UI
================================= */
/* =================================
   AI ASSISTANT
================================= */

const aiButton = document.getElementById("aiButton");
const aiChat = document.getElementById("aiChat");
const aiClose = document.getElementById("aiClose");

const aiInput = document.getElementById("aiInput");
const aiSend = document.getElementById("aiSend");

const aiMessages = document.getElementById("aiMessages");

const suggestions = document.querySelectorAll(".suggestion");


// =================================
// OPEN CHAT
// =================================

aiButton.addEventListener("click", () => {

    aiChat.classList.add("active");

    aiInput.focus();

});


// =================================
// CLOSE CHAT
// =================================

aiClose.addEventListener("click", () => {

    aiChat.classList.remove("active");

});


// =================================
// ADD MESSAGE
// =================================

function addMessage(message, sender) {

    const messageWrapper = document.createElement("div");

    messageWrapper.classList.add(
        "ai-message"
    );


    if (sender === "user") {

        messageWrapper.classList.add(
            "user-message"
        );

        messageWrapper.innerHTML = `

            <div class="user-message-content">
                <p>${escapeHTML(message)}</p>
            </div>

        `;

    } else {

        messageWrapper.classList.add(
            "bot-message"
        );

        messageWrapper.innerHTML = `

            <div class="message-avatar">
                ✦
            </div>

            <div class="message-content">

                <p>${formatAIResponse(message)}</p>

            </div>

        `;

    }


    aiMessages.appendChild(messageWrapper);

    aiMessages.scrollTop =
        aiMessages.scrollHeight;

}


// =================================
// SEND MESSAGE
// =================================

async function sendMessage() {

    const message =
        aiInput.value.trim();


    if (!message) {
        return;
    }


    // Show user's message

    addMessage(message, "user");


    // Clear input

    aiInput.value = "";


    // Disable button

    aiSend.disabled = true;

    aiSend.textContent = "⋯";


    // Show thinking message

    const thinkingMessage =
        document.createElement("div");

    thinkingMessage.classList.add(
        "ai-message",
        "bot-message"
    );

    thinkingMessage.innerHTML = `

        <div class="message-avatar">
            ✦
        </div>

        <div class="message-content">

            <p class="thinking">
                Thinking...
            </p>

        </div>

    `;

    aiMessages.appendChild(
        thinkingMessage
    );


    aiMessages.scrollTop =
        aiMessages.scrollHeight;


    try {

        const response = await fetch(
            // "https://mohit-portfolio-7g57.onrender.com/api/chat"
            "http://localhost:5000/api/chat",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    message: message
                })

            }
        );


        const data = await response.json();


        // Remove thinking message

        thinkingMessage.remove();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Something went wrong."
            );

        }


        // Show AI response

        addMessage(
            data.reply,
            "bot"
        );


    } catch (error) {

        console.error(error);


        thinkingMessage.remove();


        addMessage(
            "Sorry, I'm unable to respond right now. Please try again later.",
            "bot"
        );

    }


    // Enable button

    aiSend.disabled = false;

    aiSend.textContent = "→";

    aiInput.focus();

}


// =================================
// SEND BUTTON
// =================================

aiSend.addEventListener(
    "click",
    sendMessage
);


// =================================
// ENTER KEY
// =================================

aiInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            sendMessage();

        }

    }
);


// =================================
// SUGGESTED QUESTIONS
// =================================

suggestions.forEach(
    (suggestion) => {

        suggestion.addEventListener(
            "click",
            () => {

                aiInput.value =
                    suggestion.textContent;

                sendMessage();

            }
        );

    }
);


// =================================
// SECURITY
// =================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// =================================
// FORMAT AI RESPONSE
// =================================

function formatAIResponse(text) {

    return escapeHTML(text)
        .replace(/\n/g, "<br>");

}