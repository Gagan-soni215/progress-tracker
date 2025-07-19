


document.addEventListener("DOMContentLoaded", function () {
    const resultContainer = document.getElementById("result");
    const weakSubjectInput = document.getElementById("weakSubjectInput");
    const addWeakSubjectBtn = document.getElementById("addWeakSubject");
    const weakSubjectsList = document.getElementById("weakSubjectsList");
    const facultyContacts = document.getElementById("facultyContacts");
    const questionContainer = document.getElementById("questionContainer");
    const backToAssessmentBtn = document.getElementById("backToAssessment"); // Added for Back button

    let assessmentData = JSON.parse(sessionStorage.getItem("assessmentResult")) || { 
        performanceCategory: "Average" 
    };
    
    let weakSubjects = JSON.parse(sessionStorage.getItem("weakSubjects")) || [];
    let facultyQuestionAsked = false;

    // Initialize UI
    function initUI() {
        if (assessmentData.name) {
            resultContainer.innerHTML = `
                <h2>Student: ${assessmentData.name}</h2>
                <div class="performance-tag">${assessmentData.performanceCategory} Performance</div>
                <ul class="feedback-list">
                    ${assessmentData.feedback ? assessmentData.feedback.map(item => `
                        <li>${item}</li>
                    `).join("") : ""}
                </ul>
            `;
        } else {
            resultContainer.innerHTML = "<p>Please complete the assessment first.</p>";
        }
    }

    // Weak Subjects Management
    function updateWeakSubjects() {
        weakSubjectsList.innerHTML = "";
        weakSubjects.forEach((subject, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span>${subject}</span>
                <div class="resource-links">
                    <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(subject + ' tutorial')}" 
                       target="_blank" 
                       class="youtube-link">YouTube</a>
                    <a href="https://www.google.com/search?q=${encodeURIComponent(subject + ' study resources')}" 
                       target="_blank" 
                       class="google-link">Search</a>
                    <a href="https://chat.openai.com/?q=${encodeURIComponent('Explain ' + subject)}" 
                       target="_blank" 
                       class="chatgpt-link">AI Help</a>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            `;
            weakSubjectsList.appendChild(listItem);
        });
        sessionStorage.setItem("weakSubjects", JSON.stringify(weakSubjects));
        if (weakSubjects.length > 0 && !facultyQuestionAsked) {
            facultyQuestionAsked = true;
            askFacultyHelpQuestion();
        }
    }

    // Faculty Help System
    function showFacultyContacts() {
        const contacts = new Set();
        weakSubjects.forEach(subject => {
            const normalizedSubject = subject.trim().toLowerCase();
            switch(normalizedSubject) {
                case 'dsa':
                    contacts.add('Akash Sir: 987-654-3210');
                    break;
                case 'dbms':
                    contacts.add('Palak Mam: 9424221696');
                    break;
                case 'pps':
                    contacts.add('Ruchi Mam: 9111007611');
                    break;
                default:
                    contacts.add('Suyash Sir: 98931 28420 (General Support)');
            }
        });
        facultyContacts.innerHTML = `
            <h3>📚 Recommended Faculty Contacts</h3>
            <ul class="contacts-list">
                ${Array.from(contacts).map(contact => `
                    <li>${contact}</li>
                `).join("")}
            </ul>
        `;
        facultyContacts.classList.remove("hidden");
    }

    // Interactive Question Flow
    function askWeakSubjectQuestion() {
        questionContainer.innerHTML = `
            <div class="question-box">
                <p>Do you have a weak subject?</p>
                <button id="yesBtn">Yes</button>
                <button id="noBtn">No</button>
            </div>
        `;
        questionContainer.classList.remove("hidden");
        document.getElementById("weakSubjectSection").classList.add("hidden");
        document.getElementById("facultyContacts").classList.add("hidden");

        document.getElementById("yesBtn").addEventListener("click", () => {
            document.getElementById("weakSubjectSection").classList.remove("hidden");
            questionContainer.classList.add("hidden");
        });
        document.getElementById("noBtn").addEventListener("click", () => {
            document.getElementById("weakSubjectSection").classList.add("hidden");
            questionContainer.classList.add("hidden");
        });
    }

    function askFacultyHelpQuestion() {
        const questionBox = document.createElement("div");
        questionBox.className = "question-box";
        questionBox.innerHTML = `
            <p>Would you like faculty assistance with these subjects?</p>
            <button id="facultyYes">Yes, Please</button>
            <button id="facultyNo">No, Thanks</button>
        `;
        questionContainer.appendChild(questionBox);
        questionBox.querySelector("#facultyYes").addEventListener("click", () => {
            showFacultyContacts();
            questionBox.remove();
        });
        questionBox.querySelector("#facultyNo").addEventListener("click", () => {
            questionBox.remove();
        });
    }

    // Event Handlers
    addWeakSubjectBtn.addEventListener("click", () => {
        const subject = weakSubjectInput.value.trim();
        if (subject) {
            weakSubjects.push(subject);
            weakSubjectInput.value = "";
            updateWeakSubjects();
            if (!facultyQuestionAsked) {
                facultyQuestionAsked = true;
                askFacultyHelpQuestion();
            }
        }
    });

    weakSubjectsList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            const index = e.target.dataset.index;
            weakSubjects.splice(index, 1);
            updateWeakSubjects();
        }
    });

    // Back to Assessment Button
    document.getElementById("backToAssessment").addEventListener("click", function () {
        window.location.href = "index.html";
    });

    // Initial Setup
    initUI();
    askWeakSubjectQuestion();
    updateWeakSubjects();
});
