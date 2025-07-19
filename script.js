




document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("studentForm");
    const nameInput = document.getElementById("name");

    // ✅ Function to load previous data
    function loadPreviousData() {
        const name = nameInput.value.trim();
        if (!name) return;

        const storedData = JSON.parse(sessionStorage.getItem("assessment_" + name));
        if (storedData) {
            document.getElementById("grades").value = storedData.grades;
            document.getElementById("homeworkCompleted").value = storedData.homeworkCompleted;
            document.getElementById("timeSpent").value = storedData.timeSpent;
            document.getElementById("participation").value = storedData.participation;
        }
    }

    // ✅ Load data when name input loses focus or on change
    nameInput.addEventListener("blur", loadPreviousData);
    nameInput.addEventListener("change", loadPreviousData);

    // ✅ Also load previous data if the page is reloaded
    window.addEventListener("load", loadPreviousData);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get form values
        const name = nameInput.value.trim();
        const grades = parseFloat(document.getElementById("grades").value);
        const homeworkCompleted = parseFloat(document.getElementById("homeworkCompleted").value);
        const timeSpent = parseFloat(document.getElementById("timeSpent").value);
        const participation = parseFloat(document.getElementById("participation").value);

        // Validation
        if (!name || isNaN(grades) || isNaN(homeworkCompleted) || isNaN(timeSpent) || isNaN(participation)) {
            alert("Please enter valid values for all fields.");
            return;
        }

        if (grades < 0 || grades > 100 || homeworkCompleted < 0 || homeworkCompleted > 100 ||
            timeSpent < 0 || participation < 1 || participation > 10) {
            alert("Please enter values within the valid range.");
            return;
        }

        // **Performance Assessment Logic**
        let performanceCategory;
        let feedback = [];
        let showWeakSubjects = false;  // Flag to show weak subject input

        // **🏆 Excellent Performance**
        if (grades >= 78 && homeworkCompleted >= 75 && participation >= 8) {
            performanceCategory = "Excellent";
            feedback.push("Keep up the great work! You're performing exceptionally well.");
        }
        // **📈 Average Performance**
        else if (grades >= 60 && homeworkCompleted >= 50 && participation >= 5) {
            performanceCategory = "Average";
            feedback.push("Good effort! Keep improving and focus on weaker areas.");
        }
        // **🐢 Identifying Slow Learners**
        else if (grades < 50 && homeworkCompleted >= 75 && participation >= 7) {
            performanceCategory = "Slow Learner";
            feedback.push("You're working hard, but struggling. Consider extra study time and using more resources.");
            feedback.push("Seek faculty guidance and check out additional study materials.");
            showWeakSubjects = true;  // Enable weak subject input
        }
        // **⚠️ Needs Improvement (Struggling but Attending)**
        else if (grades < 50 && (homeworkCompleted >= 40 || participation >= 4)) {
            performanceCategory = "Needs Improvement";
            feedback.push("You're trying, but need to focus on weak subjects and study regularly.");
            feedback.push("Consider additional study sessions and ask for help when needed.");
        }
        // **🚨 Unengaged Students (Not Attending, Not Participating)**
        else if (grades < 50 && homeworkCompleted < 40 && participation < 4) {
            performanceCategory = "Unengaged";
            feedback.push("You need to take your studies seriously. Attend classes, complete homework, and participate.");
        }
        // **📞 Faculty Contact for Weak Students**
        if (performanceCategory === "Needs Improvement" || performanceCategory === "Slow Learner" || performanceCategory === "Unengaged") {
            feedback.push("Take faculty guidance");
        }

        // **Store Weak Subjects Option for Slow Learners**
        sessionStorage.setItem("showWeakSubjects", JSON.stringify(showWeakSubjects));

        // ✅ Store data for the specific student
        const assessmentData = {
            name,
            grades,
            homeworkCompleted,
            timeSpent,
            participation,
            performanceCategory,
            feedback
        };
        sessionStorage.setItem("assessment_" + name, JSON.stringify(assessmentData));

        // ✅ Store result separately for the result page
        sessionStorage.setItem("assessmentResult", JSON.stringify(assessmentData));

        // Redirect to the results page
        window.location.href = "result.html";
    });
});


