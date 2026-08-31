/* --------------------------------------------------
   Points Counter — Professional Neutral Version
   Clean, stable, fully formatted logic
-------------------------------------------------- */

(() => {

    /* --------------------------------------------------
       DOM References
    -------------------------------------------------- */
    const workspace = document.getElementById("workspace");
    const spawnArea = document.getElementById("spawnArea");

    const modeToggle = document.getElementById("modeToggle");
    const resetBtn = document.getElementById("resetBtn");
    const settingsBtn = document.getElementById("settingsBtn");
    const settingsMenu = document.getElementById("settingsMenu");

    const themeToggle = document.getElementById("themeToggle");
    const saveBtn = document.getElementById("saveBtn");
    const loadBtn = document.getElementById("loadBtn");
    const exportBtn = document.getElementById("exportBtn");

    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popupTitle");
    const popupCode = document.getElementById("popupCode");
    const popupCopy = document.getElementById("popupCopy");
    const popupClose = document.getElementById("popupClose");

    const sizeSlider = document.getElementById("sizeSlider");

    /* --------------------------------------------------
       State
    -------------------------------------------------- */
    let students = [];
    let mode = "drag"; // drag | point | names
    let darkMode = false;

    /* --------------------------------------------------
       Utility
    -------------------------------------------------- */
    function createStudent(x, y) {
        const box = document.createElement("div");
        box.className = "student";
        box.style.left = x + "px";
        box.style.top = y + "px";

        const name = document.createElement("div");
        name.className = "student-name";
        name.textContent = "Name";

        const score = document.createElement("div");
        score.className = "student-score";
        score.textContent = "0";

        const input = document.createElement("input");
        input.className = "nameInput";
        input.placeholder = "Enter name";

        box.appendChild(name);
        box.appendChild(score);
        box.appendChild(input);

        workspace.appendChild(box);

        const student = {
            el: box,
            nameEl: name,
            scoreEl: score,
            inputEl: input,
            score: 0,
            dragging: false,
            offsetX: 0,
            offsetY: 0
        };

        setupStudentEvents(student);
        students.push(student);
    }

    /* --------------------------------------------------
       Student Events
    -------------------------------------------------- */
    function setupStudentEvents(s) {

        s.el.addEventListener("mousedown", e => {
            if (mode === "drag") {
                s.dragging = true;
                s.offsetX = e.clientX - s.el.offsetLeft;
                s.offsetY = e.clientY - s.el.offsetTop;
            }
        });

        document.addEventListener("mousemove", e => {
            if (s.dragging) {
                s.el.style.left = (e.clientX - s.offsetX) + "px";
                s.el.style.top = (e.clientY - s.offsetY) + "px";
            }
        });

        document.addEventListener("mouseup", () => {
            s.dragging = false;
        });

        s.el.addEventListener("click", () => {
            if (mode === "point") {
                s.score++;
                s.scoreEl.textContent = s.score;
            }
            if (mode === "names") {
                s.nameEl.style.display = "none";
                s.inputEl.style.display = "block";
                s.inputEl.value = s.nameEl.textContent;
                s.inputEl.focus();
            }
        });

        s.inputEl.addEventListener("blur", () => {
            s.nameEl.textContent = s.inputEl.value || "Name";
            s.inputEl.style.display = "none";
            s.nameEl.style.display = "block";
        });
    }

    /* --------------------------------------------------
       Spawn Area
    -------------------------------------------------- */
    spawnArea.addEventListener("click", () => {
        const rect = spawnArea.getBoundingClientRect();
        const x = rect.left - workspace.offsetLeft + 10;
        const y = rect.top - workspace.offsetTop + 10;
        createStudent(x, y);
    });

    /* --------------------------------------------------
       Mode Toggle
    -------------------------------------------------- */
    modeToggle.addEventListener("click", () => {
        if (mode === "drag") {
            mode = "point";
            modeToggle.textContent = "POINT";
        } else if (mode === "point") {
            mode = "names";
            modeToggle.textContent = "NAMES";
        } else {
            mode = "drag";
            modeToggle.textContent = "DRAG";
        }
    });

    /* --------------------------------------------------
       Reset
    -------------------------------------------------- */
    resetBtn.addEventListener("click", () => {
        students.forEach(s => s.el.remove());
        students = [];
    });

    /* --------------------------------------------------
       Settings Menu
    -------------------------------------------------- */
    settingsBtn.addEventListener("click", () => {
        settingsMenu.style.display =
            settingsMenu.style.display === "flex" ? "none" : "flex";
    });

    /* --------------------------------------------------
       Theme Toggle
    -------------------------------------------------- */
    themeToggle.addEventListener("click", () => {
        darkMode = !darkMode;
        document.body.classList.toggle("dark", darkMode);
    });

    /* --------------------------------------------------
       Save
    -------------------------------------------------- */
    saveBtn.addEventListener("click", () => {
        const data = students.map(s => ({
            name: s.nameEl.textContent,
            score: s.score,
            x: s.el.offsetLeft,
            y: s.el.offsetTop
        }));
        localStorage.setItem("pointsData", JSON.stringify(data));
    });

    /* --------------------------------------------------
       Load
    -------------------------------------------------- */
    loadBtn.addEventListener("click", () => {
        const raw = localStorage.getItem("pointsData");
        if (!raw) return;

        students.forEach(s => s.el.remove());
        students = [];

        const data = JSON.parse(raw);
        data.forEach(d => {
            createStudent(d.x, d.y);
            const s = students[students.length - 1];
            s.nameEl.textContent = d.name;
            s.score = d.score;
            s.scoreEl.textContent = d.score;
        });
    });

    /* --------------------------------------------------
       Export CSV
    -------------------------------------------------- */
    exportBtn.addEventListener("click", () => {
        let csv = "Name,Score\n";
        students.forEach(s => {
            csv += `${s.nameEl.textContent},${s.score}\n`;
        });

        popupTitle.textContent = "Export CSV";
        popupCode.value = csv;
        popup.style.display = "flex";
    });

    /* --------------------------------------------------
       Popup
    -------------------------------------------------- */
    popupCopy.addEventListener("click", () => {
        popupCode.select();
        document.execCommand("copy");
    });

    popupClose.addEventListener("click", () => {
        popup.style.display = "none";
    });

    /* --------------------------------------------------
       Size Slider
    -------------------------------------------------- */
    sizeSlider.addEventListener("input", () => {
        const size = sizeSlider.value + "px";
        students.forEach(s => {
            s.el.style.width = size;
            s.el.style.height = size;
        });
    });

})();
