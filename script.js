// App State
let isEditMode = false;
let isSetupOpen = false;
let isAIOpen = false; 
let setupRot = 0; 
let reportDirectoryHandle = null; 
let jsonDirectoryHandle = null;

let reviewQueue = [];
let funnyInterval;
const funnyMessages = [
    "Go ahead and grab a ☕...",
    "Actually go eat lunch 🥪...",
    "Stare out the window for a minute 🪟...",
    "Contemplate the meaning of a 'B+' 🤔...",
    "Take a deep breath... you're doing great 🧘‍♂️...",
    "Stretch those grading muscles 🏋️...",
    "Dream about summer break 🏖️..."
];

// YOUR GOOGLE APPS SCRIPT WEB APP URL
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzp9F_goegloh-FxMFXpGw3FLmkA6kD_nYbNnQs5uBZCr54DLO1euaT2S19hzvARCa_/exec";

let currentRubric = {
    title: "Generic Engineering Project",
    aiPrompt: "Evaluate the student's work strictly based on the rubric criteria. Provide brief, actionable feedback.",
    learnedRules: [], 
    criteria: [
        {
            name: "Title",
            levels: [
                { points: 5, title: "Jedi Master", desc: "Title is clear, professional, and includes all required student information." },
                { points: 4, title: "Jedi Knight", desc: "Title is present but missing minor details." },
                { points: 3.5, title: "Padwan", desc: "Title is present but lacks professional formatting or several details." },
                { points: 3, title: "Youngling", desc: "Title is incomplete or poorly formatted." },
                { points: 1.5, title: "Sith Apprentice", desc: "Title is barely present or missing most required information." },
                { points: 0, title: "Sith Lord", desc: "Missing entirely." }
            ]
        },
        {
            name: "Abstract",
            levels: [
                { points: 10, title: "Jedi Master", desc: "Excellent summary of the project, clearly stating the problem, solution, and results." },
                { points: 8.5, title: "Jedi Knight", desc: "Good summary, but lacks a bit of clarity or omits minor details." },
                { points: 7.5, title: "Padwan", desc: "Basic summary provided, but missing key elements like results or clear problem statement." },
                { points: 6, title: "Youngling", desc: "Abstract is vague, poorly written, or too brief." },
                { points: 3, title: "Sith Apprentice", desc: "Abstract does not accurately reflect the project." },
                { points: 0, title: "Sith Lord", desc: "Missing entirely." }
            ]
        },
        {
            name: "Design Brief",
            levels: [
                { points: 5, title: "Jedi Master", desc: "Thorough and clearly defined problem statement, constraints, and deliverables." },
                { points: 4, title: "Jedi Knight", desc: "Clear problem statement and constraints, but missing minor details." },
                { points: 3.5, title: "Padwan", desc: "Adequate brief, but constraints or deliverables are vague." },
                { points: 3, title: "Youngling", desc: "Incomplete brief lacking clear direction." },
                { points: 1.5, title: "Sith Apprentice", desc: "Brief is very poor or mostly incorrect." },
                { points: 0, title: "Sith Lord", desc: "Missing entirely." }
            ]
        },
        {
            name: "Research",
            levels: [
                { points: 5, title: "Jedi Master", desc: "Comprehensive research covering multiple relevant sources and deeply informing the design." },
                { points: 4, title: "Jedi Knight", desc: "Good research from appropriate sources, but lacks some depth." },
                { points: 3.5, title: "Padwan", desc: "Basic research completed, but sources are limited or loosely applied to the design." },
                { points: 3, title: "Youngling", desc: "Minimal research with few sources." },
                { points: 1.5, title: "Sith Apprentice", desc: "Research is almost non-existent or completely irrelevant." },
                { points: 0, title: "Sith Lord", desc: "Missing entirely." }
            ]
        },
        {
            name: "Brainstorming List/Sketches",
            levels: [
                { points: 10, title: "Jedi Master", desc: "Extensive list of diverse ideas with accompanying rough sketches. Shows deep creative thinking." },
                { points: 8.5, title: "Jedi Knight", desc: "Good variety of ideas and sketches, but could be pushed further." },
                { points: 7.5, title: "Padwan", desc: "Adequate brainstorming, but ideas lack variety or sketches are too vague." },
                { points: 6, title: "Youngling", desc: "Few ideas generated; sketches are lacking." },
                { points: 3, title: "Sith Apprentice", desc: "Barely any brainstorming evident." },
                { points: 0, title: "Sith Lord", desc: "Missing entirely." }
            ]
        },
        {
            name: "Annotated Sketches",
            levels: [
                { points: 10, title: "Jedi Master", desc: "High-quality, detailed sketches with clear, informative annotations explaining features." },
                { points: 8.5, title: "Jedi Knight", desc: "Good sketches and annotations, but missing some clarity or detail." },
                { points: 7.5, title: "Padwan", desc: "Sketches are acceptable; annotations are sparse or state the obvious." },
                { points: 6, title: "Youngling", desc: "Poor sketch quality or missing most annotations." },
                { points: 3, title: "Sith Apprentice", desc: "Sketches are unintelligible or completely lack annotations." },
                { points: 0, title: "Sith Lord", desc: "Missing entirely." }
            ]
        },
        {
            name: "Decision Matrix",
            levels: [
                { points: 5, title: "Jedi Master", desc: "Matrix is fully completed with appropriate criteria, weighting, and logical conclusion." },
                { points: 4, title: "Jedi Knight", desc: "Matrix is complete, but criteria or weighting could be more refined." },
                { points: 3.5, title: "Padwan", desc: "Matrix used, but logic is flawed or some sections are incomplete." },
                { points: 3, title: "Youngling", desc: "Matrix is poorly constructed or does not align with the final choice." },
                { points: 1.5, title: "Sith Apprentice", desc: "Matrix is barely attempted." },
                { points: 0, title: "Sith Lord", desc: "Missing entirely." }
            ]
        },
        {
            name: "Final Sketch",
            levels: [
                { points: 10, title: "Jedi Master", desc: "Exceptional final sketch showing correct proportions, shading, and all critical details." },
                { points: 8.5, title: "Jedi Knight", desc: "Strong final sketch but has minor proportion or detailing issues." },
                { points: 7.5, title: "Padwan", desc: "Acceptable final sketch but lacks polish or clarity in design." },
                { points: 6, title: "Youngling", desc: "Final sketch is rough and difficult to interpret." },
                { points: 3, title: "Sith Apprentice", desc: "Final sketch shows very little effort." },
                { points: 0, title: "Sith Lord", desc: "Missing entirely." }
            ]
        },
        {
            name: "CAD Model/Drawings",
            levels: [
                { points: 10, title: "Jedi Master", desc: "Complex, fully constrained CAD model with accurate, fully dimensioned working drawings." },
                { points: 8.5, title: "Jedi Knight", desc: "Good CAD model and drawings, missing minor dimensions or constraints." },
                { points: 7.5, title: "Padwan", desc: "Model is complete but drawings are missing significant dimensions or views." },
                { points: 6, title: "Youngling", desc: "Model is incomplete or drawings are very poorly executed." },
                { points: 3, title: "Sith Apprentice", desc: "CAD work is barely attempted." },
                { points: 0, title: "Sith Lord", desc: "Missing entirely." }
            ]
        },
        {
            name: "Prototype",
            levels: [
                { points: 10, title: "Jedi Master", desc: "High-quality, functional prototype that accurately represents the final design." },
                { points: 8.5, title: "Jedi Knight", desc: "Good prototype but has minor functional or aesthetic flaws." },
                { points: 7.5, title: "Padwan", desc: "Prototype is completed but is fragile or only partially represents the design." },
                { points: 6, title: "Youngling", desc: "Prototype is poorly constructed and barely holds together." },
                { points: 3, title: "Sith Apprentice", desc: "Prototype shows almost no effort." },
                { points: 0, title: "Sith Lord", desc: "Missing entirely." }
            ]
        },
        {
            name: "Evaluation",
            levels: [
                { points: 10, title: "Jedi Master", desc: "Deep, thoughtful reflection on testing results, design flaws, and specific improvements." },
                { points: 8.5, title: "Jedi Knight", desc: "Good evaluation but lacks depth in discussing improvements or testing details." },
                { points: 7.5, title: "Padwan", desc: "Basic evaluation; mostly states what happened without critical analysis." },
                { points: 6, title: "Youngling", desc: "Evaluation is very brief and lacks insight." },
                { points: 3, title: "Sith Apprentice", desc: "Evaluation is barely attempted or completely misses the point." },
                { points: 0, title: "Sith Lord", desc: "Missing entirely." }
            ]
        },
        {
            name: "Presentation",
            levels: [
                { points: 10, title: "Jedi Master", desc: "Professional, engaging presentation. Speakers are confident, clear, and well-prepared." },
                { points: 8.5, title: "Jedi Knight", desc: "Good presentation but occasionally lacks confidence or flow." },
                { points: 7.5, title: "Padwan", desc: "Acceptable presentation, but speakers rely too heavily on reading slides or lack preparation." },
                { points: 6, title: "Youngling", desc: "Presentation is disorganized, hard to follow, or too short." },
                { points: 3, title: "Sith Apprentice", desc: "Presentation is barely attempted." },
                { points: 0, title: "Sith Lord", desc: "Missing entirely." }
            ]
        }
    ]
};

let scores = {};
let comments = {};
let isGraded = {}; 
let overallComment = "";

// --- FAQ HELP MODAL LOGIC ---
function openHelpModal() { document.getElementById('helpModal').style.display = 'flex'; }
function closeHelpModal() { document.getElementById('helpModal').style.display = 'none'; }

// --- UI TOGGLE LOGIC ---
function setEditMode(state) {
    isEditMode = state;
    const addContainer = document.getElementById('addCriterionContainer');
    const overallContainer = document.getElementById('overallCommentsContainer');
    
    if (isEditMode) {
        if (addContainer) addContainer.style.display = 'block';
        if (overallContainer) overallContainer.style.display = 'none';
        document.querySelectorAll('.edit-only').forEach(el => { el.style.display = el.tagName === 'DIV' ? 'flex' : 'inline-flex'; });
        document.querySelectorAll('.grade-only').forEach(el => { el.style.display = 'none'; });
    } else {
        if (addContainer) addContainer.style.display = 'none';
        if (overallContainer) overallContainer.style.display = 'block';
        document.querySelectorAll('.edit-only').forEach(el => { el.style.display = 'none'; });
        document.querySelectorAll('.grade-only').forEach(el => { el.style.display = el.tagName === 'DIV' ? 'flex' : 'inline-flex'; });
        updateMaxScore();
    }
    
    renderRubric();
}

function toggleSetup() {
    isSetupOpen = !isSetupOpen;
    
    const wrapper = document.getElementById('setupWrapper');
    const icon = document.getElementById('gearIcon');
    const btn = document.getElementById('btnSetup');

    if (icon) {
        setupRot += 180;
        icon.style.transform = `rotate(${setupRot}deg)`;
    }

    if (isSetupOpen) {
        if(wrapper) { wrapper.classList.remove('collapsed'); wrapper.classList.add('open'); }
        if(btn) btn.classList.add('active');
        if (isAIOpen) toggleAI(); 
        setEditMode(true); 
    } else {
        if(wrapper) { wrapper.classList.add('collapsed'); wrapper.classList.remove('open'); }
        if(btn) btn.classList.remove('active');
        setEditMode(false); 
    }
    
    handleScrollForFloatBtn();
}

function toggleAI() {
    isAIOpen = !isAIOpen;
    
    const wrapper = document.getElementById('aiWrapper');
    const icon = document.getElementById('robotIcon');
    const btn = document.getElementById('btnAI');

    if (isAIOpen) {
        if(wrapper) { wrapper.classList.remove('collapsed'); wrapper.classList.add('open'); }
        if(btn) btn.classList.add('active');
        if(icon) icon.classList.add('pulsing'); 
        if (isSetupOpen) toggleSetup(); 
    } else {
        if(wrapper) { wrapper.classList.add('collapsed'); wrapper.classList.remove('open'); }
        if(btn) btn.classList.remove('active');
        if(icon) icon.classList.remove('pulsing');
    }
}

function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme'); localStorage.setItem('theme', 'light');
        if(icon) icon.innerText = 'dark_mode'; 
    } else {
        body.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark');
        if(icon) icon.innerText = 'light_mode'; 
    }
}

function checkExportReady() {
    const btn = document.getElementById('exportMainBtn');
    if (!btn) return;
    
    let allGraded = true;
    if (!currentRubric || !currentRubric.criteria || currentRubric.criteria.length === 0) {
        allGraded = false;
    } else {
        currentRubric.criteria.forEach((crit, idx) => {
            if (!isGraded[idx]) allGraded = false;
        });
    }
    
    const studentName = document.getElementById('studentName').value.trim();
    
    if (allGraded && studentName !== "" && !isEditMode && reviewQueue.length === 0) {
        btn.classList.add('export-ready');
    } else {
        btn.classList.remove('export-ready');
    }
}

// --- TEACH AI MODAL LOGIC ---
let teachDocFile = null;
let teachJsonFile = null;
let teachQueue = [];

function openTeachModal() {
    document.getElementById('teachModal').style.display = 'flex';
    teachQueue = []; resetTeachDropZones(); renderTeachQueue();
}

function closeTeachModal() { document.getElementById('teachModal').style.display = 'none'; }

function resetTeachDropZones() {
    teachDocFile = null; teachJsonFile = null;
    const dzDoc = document.getElementById('dropZoneDoc');
    const dzJson = document.getElementById('dropZoneJson');
    dzDoc.innerHTML = '<span class="material-symbols-outlined">description</span> 1. Drop Document';
    dzDoc.classList.remove('has-file');
    dzJson.innerHTML = '<span class="material-symbols-outlined">data_object</span> 2. Drop JSON';
    dzJson.classList.remove('has-file');
}

function setupDropZone(zoneId, inputId, expectedType) {
    const zone = document.getElementById(zoneId); const input = document.getElementById(inputId);
    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => { zone.classList.remove('dragover'); });
    zone.addEventListener('drop', (e) => {
        e.preventDefault(); zone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) handleTeachFile(e.dataTransfer.files[0], zone, expectedType);
    });
    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleTeachFile(e.target.files[0], zone, expectedType);
        input.value = ""; 
    });
}

function handleTeachFile(file, zone, type) {
    if (type === 'doc') {
        if (!file.name.match(/\.(pdf|png|jpg|jpeg)$/i)) { alert("Please upload a PDF or Image."); return; }
        teachDocFile = file;
        zone.innerHTML = "<span class='material-symbols-outlined'>check_circle</span> " + file.name.substring(0, 20) + "...";
    } else {
        if (!file.name.endsWith('.json')) { alert("Please upload a JSON file."); return; }
        teachJsonFile = file;
        zone.innerHTML = "<span class='material-symbols-outlined'>check_circle</span> " + file.name.substring(0, 20) + "...";
    }
    zone.classList.add('has-file');
    if (teachDocFile && teachJsonFile) {
        teachQueue.push({ doc: teachDocFile, json: teachJsonFile });
        resetTeachDropZones(); renderTeachQueue();
    }
}

function renderTeachQueue() {
    const container = document.getElementById('teachQueueContainer');
    const btn = document.getElementById('startTeachBtn');
    if (teachQueue.length > 0) {
        container.style.display = 'block';
        container.innerHTML = teachQueue.map((pair, i) => 
            `<div class="queue-item"><strong>Pair ${i+1}:</strong> ${pair.doc.name} ➕ ${pair.json.name}</div>`
        ).join('');
        btn.disabled = false; btn.innerHTML = `<span class="material-symbols-outlined">school</span> Start Learning (${teachQueue.length} Pairs)`;
    } else {
        container.style.display = 'none'; btn.disabled = true; btn.innerHTML = `<span class="material-symbols-outlined">school</span> Start Learning (0 Pairs)`;
    }
}

async function executeTeachAI() {
    closeTeachModal();
    document.getElementById('loadingOverlay').style.display = 'flex';
    let msgIdx = 0; document.getElementById('loadingSubtext').innerText = funnyMessages[msgIdx];
    funnyInterval = setInterval(() => {
        msgIdx = (msgIdx + 1) % funnyMessages.length; document.getElementById('loadingSubtext').innerText = funnyMessages[msgIdx];
    }, 3500);

    let newRulesCount = 0;
    for (let i = 0; i < teachQueue.length; i++) {
        let pair = teachQueue[i];
        document.getElementById('loadingText').innerText = `AI is studying Pair ${i+1} of ${teachQueue.length}...\nExtracting rules from ${pair.json.name}`;
        try {
            const jsonText = await new Promise(resolve => { const r = new FileReader(); r.onload = e => resolve(e.target.result); r.readAsText(pair.json); });
            const gradedData = JSON.parse(jsonText);
            const docDataUrl = await new Promise(resolve => { const r = new FileReader(); r.onload = e => resolve(e.target.result); r.readAsDataURL(pair.doc); });
            const base64Data = docDataUrl.split(',')[1];

            const response = await fetch(WEB_APP_URL, {
                method: 'POST', body: JSON.stringify({ action: "teach", apiKey: localStorage.getItem('userApiKey'), fileBase64: base64Data, mimeType: pair.doc.type, rubric: currentRubric, gradedData: { scores: gradedData.scores, comments: gradedData.comments } })
            });

            const rawResponse = await response.text();
            let cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(cleanJson);

            if (result.error) throw new Error(result.error);
            if (result.learnedRules && result.learnedRules.length > 0) {
                if (!currentRubric.learnedRules) currentRubric.learnedRules = [];
                currentRubric.learnedRules.push(...result.learnedRules);
                newRulesCount += result.learnedRules.length;
            }
        } catch (err) { console.error(err); alert(`Teach GrAIder Failed on pair ${i+1} (${pair.json.name})!\n\n` + err.message); }
    }

    clearInterval(funnyInterval); document.getElementById('loadingOverlay').style.display = 'none';
    document.getElementById('loadingSubtext').innerText = "This usually takes 5-15 seconds.";
    renderRubric(); 
    if (newRulesCount > 0) {
        alert(`Success! The AI extracted ${newRulesCount} new rules from the batch.\n\nTotal rules stored: ${currentRubric.learnedRules.length}\n\nDon't forget to click 'Save Template' in Setup to save this knowledge!`);
    } else {
        alert("Batch complete, but the AI couldn't extract any new definitive rules from these examples.");
    }
}

function init() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    if (localStorage.getItem('theme') === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if(icon) icon.innerText = 'light_mode'; 
    } else {
        if(icon) icon.innerText = 'dark_mode'; 
    }

    // --- API KEY STORAGE LOGIC ---
    const keyInput = document.getElementById('geminiApiKey');
    if (keyInput) {
        keyInput.value = localStorage.getItem('userApiKey') || '';
        keyInput.addEventListener('input', (e) => localStorage.setItem('userApiKey', e.target.value.trim()));
    }

    const studentNameInput = document.getElementById('studentName');
    if(studentNameInput) studentNameInput.addEventListener('input', checkExportReady);

    updateMaxScore(); clearGrades(); updateExportButtonUI();
    window.addEventListener('scroll', handleScrollForFloatBtn);
    
    setupDropZone('dropZoneDoc', 'teachDocInput', 'doc'); setupDropZone('dropZoneJson', 'teachJsonInput', 'json');

    // Loaders
    document.getElementById('uploadRubric').addEventListener('change', function(e) {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try { 
                currentRubric = JSON.parse(e.target.result); 
                if (isSetupOpen) { toggleSetup(); } else { setEditMode(false); }
                clearGrades(); updateMaxScore(); 
            } catch (err) { alert('Error parsing Rubric JSON file.'); }
        }; reader.readAsText(file); e.target.value = ""; 
    });

    document.getElementById('loadStudentFile').addEventListener('change', function(e) {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.type === "StudentGradeRecord") {
                    currentRubric = data.rubric; scores = data.scores || {}; comments = data.comments || {}; isGraded = data.isGraded || {};
                    document.getElementById('studentName').value = data.studentName || ""; overallComment = data.overallComment || "";
                    const ocInput = document.getElementById('overallCommentsInput');
                    if (ocInput) { ocInput.value = overallComment; ocInput.style.height = 'auto'; ocInput.style.height = ocInput.scrollHeight + 'px'; }
                    updateMaxScore(); renderRubric(); checkExportReady();
                } else { alert('Invalid student data file.'); }
            } catch (err) { alert('Error parsing Student JSON file.'); }
        }; reader.readAsText(file); e.target.value = ""; 
    });

    // AI Tools
    document.getElementById('autoBuildFile').addEventListener('change', async function(e) {
        const file = e.target.files[0]; if (!file) return;
        document.getElementById('loadingText').innerText = "AI is writing your rubric..."; document.getElementById('loadingOverlay').style.display = 'flex';
        const reader = new FileReader();
        reader.onload = async function(event) {
            const dataUrl = event.target.result;
            try {
                const response = await fetch(WEB_APP_URL, { method: 'POST', body: JSON.stringify({ action: "build", apiKey: localStorage.getItem('userApiKey'), fileBase64: dataUrl.split(',')[1], mimeType: file.type }) });
                const rawResponse = await response.text();
                let cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                const newRubric = JSON.parse(cleanJson);
                if (newRubric && newRubric.error) throw new Error("Google Script says: " + newRubric.error);
                if (newRubric && newRubric.criteria) { currentRubric = newRubric; clearGrades(); updateMaxScore(); renderRubric(); alert("Rubric successfully generated!"); } 
                else throw new Error("AI missed the format.");
            } catch (err) { console.error(err); alert("Auto-Build Failed!\n\n" + err.message); } 
            finally { document.getElementById('loadingOverlay').style.display = 'none'; e.target.value = ''; }
        }; reader.readAsDataURL(file);
    });

    document.getElementById('autoGradeFile').addEventListener('change', function(e) {
        if(e.target.files.length === 0) return;
        reviewQueue = Array.from(e.target.files); e.target.value = ''; processNextReview();
    });

    document.getElementById('batchGradeFile').addEventListener('change', async function(e) {
        const files = Array.from(e.target.files); if(files.length === 0) return; e.target.value = ''; 
        if (!reportDirectoryHandle) { alert("Please select a master folder in Setup first."); if(isAIOpen) toggleAI(); if(!isSetupOpen) toggleSetup(); return; }
        document.getElementById('loadingOverlay').style.display = 'flex';
        let msgIdx = 0; document.getElementById('loadingSubtext').innerText = funnyMessages[msgIdx];
        funnyInterval = setInterval(() => { msgIdx = (msgIdx + 1) % funnyMessages.length; document.getElementById('loadingSubtext').innerText = funnyMessages[msgIdx]; }, 3500);
        for (let i = 0; i < files.length; i++) {
            document.getElementById('loadingText').innerText = `Batch Grading: ${i + 1} of ${files.length}\n(${files[i].name})`;
            await processSingleBatchFile(files[i]);
        }
        clearInterval(funnyInterval); document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('loadingSubtext').innerText = "This usually takes 5-15 seconds."; document.getElementById('loadingText').innerText = "AI is processing...";
        alert(`Batch Complete! ${files.length} reports saved to your folder.`);
    });
}

async function processNextReview() {
    if (reviewQueue.length === 0) { updateExportButtonUI(); return; }
    const file = reviewQueue.shift(); updateExportButtonUI();
    document.getElementById('loadingText').innerText = `AI is grading: ${file.name}`; document.getElementById('loadingOverlay').style.display = 'flex';
    const reader = new FileReader();
    reader.onload = async function(event) {
        const dataUrl = event.target.result;
        try {
            const response = await fetch(WEB_APP_URL, { method: 'POST', body: JSON.stringify({ action: "grade", apiKey: localStorage.getItem('userApiKey'), fileBase64: dataUrl.split(',')[1], mimeType: file.type, rubric: currentRubric, customPrompt: currentRubric.aiPrompt || "" }) });
            const rawResponse = await response.text();
            let cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(cleanJson);
            if (result && result.error) throw new Error("Google Script says: " + result.error);
            if (result && result.grades) {
                clearGrades(); 
                let bestName = result.studentName || "";
                if (bestName.trim() === "" || bestName === "Unknown Student") { bestName = file.name.replace(/\.[^/.]+$/, ""); }
                document.getElementById('studentName').value = bestName;
                result.grades.forEach(g => {
                    let matchedLevelIdx = currentRubric.criteria[g.criterionIndex].levels.findIndex(l => l.points === g.points);
                    if(matchedLevelIdx !== -1) { selectScore(g.criterionIndex, matchedLevelIdx, g.points); } else { manualScoreUpdate(g.criterionIndex, g.points); }
                    updateRowComment(g.criterionIndex, { value: g.comment });
                });
                renderRubric(); 
                checkExportReady();
            } else throw new Error("AI missed the grading format.");
        } catch (err) { console.error(err); alert(`Grading failed for ${file.name}!\n\n` + err.message); } 
        finally { document.getElementById('loadingOverlay').style.display = 'none'; }
    }; reader.readAsDataURL(file);
}

async function cleanupOldReports(dirHandle, safeStudent, safeProject, currentFilename) {
    if (!dirHandle) return;
    try {
        const prefix = `${safeStudent} - ${safeProject}`;
        for await (const [name, handle] of dirHandle.entries()) {
            if (name.startsWith(prefix) && name.endsWith('.html') && name !== currentFilename) { await dirHandle.removeEntry(name); }
        }
    } catch(e) { console.warn("Cleanup error", e); }
}

async function processSingleBatchFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async function(event) {
            const dataUrl = event.target.result;
            try {
                const response = await fetch(WEB_APP_URL, { method: 'POST', body: JSON.stringify({ action: "grade", apiKey: localStorage.getItem('userApiKey'), fileBase64: dataUrl.split(',')[1], mimeType: file.type, rubric: currentRubric, customPrompt: currentRubric.aiPrompt || "" }) });
                const rawResponse = await response.text();
                let cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                const result = JSON.parse(cleanJson);
                if (result && result.grades && !result.error) {
                    let batchScores = {}; let batchComments = {}; let batchGraded = {};
                    currentRubric.criteria.forEach((_, idx) => { batchScores[idx] = 0; batchComments[idx] = ''; batchGraded[idx] = false; });
                    let bestName = result.studentName || "";
                    if (bestName.trim() === "" || bestName === "Unknown Student") { bestName = file.name.replace(/\.[^/.]+$/, ""); }
                    result.grades.forEach(g => { batchScores[g.criterionIndex] = g.points; batchGraded[g.criterionIndex] = true; batchComments[g.criterionIndex] = g.comment; });
                    let totalScore = 0; for (let key in batchScores) { totalScore += batchScores[key]; }

                    let safeStudent = bestName.replace(/[^a-z0-9\s]/gi, '_').trim(); let safeProject = (currentRubric.title || "Project").replace(/[^a-z0-9\s]/gi, '_').trim();
                    let jsonFilename = `${safeStudent} Feedback - ${safeProject}.json`; 
                    let reportFilename = `${safeStudent} Feedback - ${safeProject} - ${totalScore}.html`;

                    const exportData = { type: "StudentGradeRecord", studentName: bestName, projectTitle: currentRubric.title, rubric: currentRubric, scores: batchScores, comments: batchComments, overallComment: "", isGraded: batchGraded };
                    const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                    let tempScores = scores; let tempComments = comments; let tempGraded = isGraded;
                    scores = batchScores; comments = batchComments; isGraded = batchGraded;
                    const htmlReportString = generateStandaloneReport(bestName, currentRubric.title, totalScore);
                    scores = tempScores; comments = tempComments; isGraded = tempGraded;
                    const reportBlob = new Blob([htmlReportString], { type: 'text/html' });

                    if (reportDirectoryHandle && jsonDirectoryHandle) {
                        await cleanupOldReports(reportDirectoryHandle, safeStudent, safeProject, reportFilename);
                        await silentWriteFile(jsonDirectoryHandle, jsonFilename, jsonBlob);
                        await silentWriteFile(reportDirectoryHandle, reportFilename, reportBlob);
                    }
                }
            } catch (err) { console.error(`Batch failed for ${file.name}`, err); }
            resolve(); 
        }; reader.readAsDataURL(file);
    });
}

function updateExportButtonUI() {
    const btn = document.getElementById('exportMainBtn');
    if (reviewQueue.length > 0) {
        btn.innerHTML = `<span class="material-symbols-outlined">save</span> Save & Next (${reviewQueue.length})`;
        btn.classList.remove('btn-success'); btn.classList.add('btn-purple');
        btn.classList.remove('export-ready');
    } else {
        btn.innerHTML = `<span class="material-symbols-outlined">sim_card_download</span> Export`;
        btn.classList.remove('btn-purple'); btn.classList.add('btn-success');
        checkExportReady();
    }
}

function updateLearnedRules(val) { currentRubric.learnedRules = val.split('\n').filter(r => r.trim() !== ''); }

function handleScrollForFloatBtn() {
    const btn = document.getElementById('smartFillBtn');
    if (!btn) return;
    if (window.scrollY > 150 && !isSetupOpen) { btn.classList.add('visible'); } else { btn.classList.remove('visible'); }
}

function autoFillMaxPoints() {
    let lastGradedIndex = -1;
    for (let i = currentRubric.criteria.length - 1; i >= 0; i--) { if (isGraded[i]) { lastGradedIndex = i; break; } }
    let limit = lastGradedIndex !== -1 ? lastGradedIndex : currentRubric.criteria.length;
    if (lastGradedIndex === -1) { if (!confirm("You haven't selected any grades yet. Do you want to automatically fill MAX POINTS for the ENTIRE rubric?")) return; }
    for (let i = 0; i < limit; i++) {
        if (!isGraded[i]) {
            let maxPts = -Infinity; let maxIdx = -1;
            currentRubric.criteria[i].levels.forEach((l, lIdx) => { if (l.points > maxPts) { maxPts = l.points; maxIdx = lIdx; } });
            if (maxIdx !== -1) selectScore(i, maxIdx, maxPts);
        }
    }
    checkExportReady();
}

function updateMaxScore() {
    let max = currentRubric.criteria.reduce((total, crit) => {
        if (!crit.levels || crit.levels.length === 0) return total; return total + Math.max(...crit.levels.map(l => l.points));
    }, 0);
    document.getElementById('maxScore').innerText = max;
}

function renderRubric() {
    const titleContainer = document.getElementById('projectTitleContainer');
    if (isEditMode) { titleContainer.innerHTML = `<input type="text" class="edit-input" style="font-size: 2em; font-weight: bold; text-align: left; color: var(--primary);" value="${escapeHTML(currentRubric.title || 'Untitled Project')}" onchange="currentRubric.title = this.value">`; } 
    else { titleContainer.innerHTML = `<h1>${escapeHTML(currentRubric.title || 'Untitled Project')}</h1>`; }
    
    document.getElementById('aiPromptInput').value = currentRubric.aiPrompt || "";
    const rulesInput = document.getElementById('learnedRulesInput');
    if (rulesInput) { rulesInput.value = (currentRubric.learnedRules || []).join('\n'); }

    const table = document.getElementById('rubricTable'); table.innerHTML = '';
    let maxCols = 0;
    if (currentRubric.criteria.length > 0) { maxCols = Math.max(...currentRubric.criteria.map(c => c.levels.length)); }

    currentRubric.criteria.forEach((crit, critIndex) => {
        if (scores[critIndex] === undefined) scores[critIndex] = 0;
        if (comments[critIndex] === undefined) comments[critIndex] = '';
        if (isGraded[critIndex] === undefined) isGraded[critIndex] = false;

        const tr = document.createElement('tr');
        const titleTd = document.createElement('td'); titleTd.className = 'criterion-title';
        
        if (isEditMode) {
            let addLevelBtn = '';
            if (crit.levels.length === 0) { addLevelBtn = `<button class="btn-info btn-small" onclick="insertLevel(${critIndex}, 0)" style="width:100%; margin-top:5px;"><span class="material-symbols-outlined">add</span> Add Level</button>`; }
            titleTd.innerHTML = `
                <input type="text" class="edit-input" style="font-weight:bold;" value="${escapeHTML(crit.name)}" onchange="currentRubric.criteria[${critIndex}].name = this.value">
                <div class="move-controls">
                    <button class="btn btn-icon" onclick="moveCriterion(${critIndex}, -1)" ${critIndex === 0 ? 'disabled' : ''}><span class="material-symbols-outlined">arrow_upward</span></button>
                    <button class="btn btn-icon" onclick="moveCriterion(${critIndex}, 1)" ${critIndex === currentRubric.criteria.length - 1 ? 'disabled' : ''}><span class="material-symbols-outlined">arrow_downward</span></button>
                </div>
                <button class="btn-danger btn-small" onclick="removeCriterion(${critIndex})" style="width:100%; margin-top:5px; justify-content:center;"><span class="material-symbols-outlined">delete</span> Delete Row</button>
                ${addLevelBtn}
            `;
        } else { titleTd.innerText = crit.name; }
        tr.appendChild(titleTd);

        crit.levels.forEach((level, levelIndex) => {
            const td = document.createElement('td');
            td.className = 'level-cell' + (isEditMode ? ' edit-mode' : ''); td.id = `cell-${critIndex}-${levelIndex}`;
            
            if (isEditMode) {
                td.innerHTML = `
                    <div class="edit-flex">
                        <input type="number" step="0.1" class="edit-input edit-pts" value="${level.points}" onchange="currentRubric.criteria[${critIndex}].levels[${levelIndex}].points = parseFloat(this.value) || 0"> <span>pts</span>
                    </div>
                    <input type="text" class="edit-input level-title" value="${escapeHTML(level.title)}" onchange="currentRubric.criteria[${critIndex}].levels[${levelIndex}].title = this.value">
                    <textarea class="edit-textarea" onchange="currentRubric.criteria[${critIndex}].levels[${levelIndex}].desc = this.value">${escapeHTML(level.desc)}</textarea>
                    
                    <div style="display: flex; justify-content: space-between; gap: 5px; margin-top: 8px;">
                        <button class="btn-info btn-small btn-icon" onclick="insertLevel(${critIndex}, ${levelIndex})" title="Add level before"><span class="material-symbols-outlined">add</span></button>
                        <button class="btn-danger btn-small" onclick="removeLevel(${critIndex}, ${levelIndex})" style="flex-grow: 1; justify-content:center;"><span class="material-symbols-outlined">close</span> Remove</button>
                        <button class="btn-info btn-small btn-icon" onclick="insertLevel(${critIndex}, ${levelIndex + 1})" title="Add level after"><span class="material-symbols-outlined">add</span></button>
                    </div>
                `;
            } else {
                td.innerHTML = `
                    <span class="level-pts">${level.points} pts</span>
                    <span class="level-title">${escapeHTML(level.title)}</span>
                    <div class="level-desc">${escapeHTML(level.desc)}</div>
                `;
                td.onclick = () => selectScore(critIndex, levelIndex, level.points);
                if (isGraded[critIndex] && scores[critIndex] === level.points) { td.classList.add('selected'); }
            }
            tr.appendChild(td);
        });

        let emptyCellsRequired = maxCols - crit.levels.length;
        for (let i = 0; i < emptyCellsRequired; i++) { const emptyTd = document.createElement('td'); tr.appendChild(emptyTd); }

        if (isEditMode) {
            const emptyEndTd = document.createElement('td'); emptyEndTd.className = 'score-cell'; 
            emptyEndTd.innerHTML = `<div style="color: var(--accent); font-size: 0.8em; margin-top: 20px;">Use <span class="material-symbols-outlined" style="font-size:1em;">add</span> buttons to add columns</div>`;
            tr.appendChild(emptyEndTd);
        } else {
            const scoreTd = document.createElement('td'); scoreTd.className = 'score-cell';
            scoreTd.innerHTML = `<div style="color: var(--primary);">Score</div><input type="number" class="score-input" id="score-input-${critIndex}" step="0.5" value="${scores[critIndex]}" oninput="manualScoreUpdate(${critIndex}, this.value)">`;
            tr.appendChild(scoreTd);
        }
        table.appendChild(tr);

        if (!isEditMode) {
            const commentTr = document.createElement('tr'); commentTr.className = 'comments-row';
            const commentTd = document.createElement('td'); commentTd.colSpan = maxCols + 2; 
            commentTd.innerHTML = `<textarea class="comments-input" id="comment-input-${critIndex}" placeholder="Comments for ${escapeHTML(crit.name)}..." oninput="updateRowComment(${critIndex}, this)">${escapeHTML(comments[critIndex])}</textarea>`;
            commentTr.appendChild(commentTd); table.appendChild(commentTr);
        }
    });

    if (!isEditMode) {
        updateTotalDisplay();
        document.querySelectorAll('.comments-input').forEach(ta => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; });
        checkExportReady();
    }
}

function moveCriterion(index, direction) {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === currentRubric.criteria.length - 1) return;
    const newIndex = index + direction;
    const tempCrit = currentRubric.criteria[index]; currentRubric.criteria[index] = currentRubric.criteria[newIndex]; currentRubric.criteria[newIndex] = tempCrit;
    const tempScore = scores[index]; scores[index] = scores[newIndex]; scores[newIndex] = tempScore;
    const tempComment = comments[index]; comments[index] = comments[newIndex]; comments[newIndex] = tempComment;
    const tempGraded = isGraded[index]; isGraded[index] = isGraded[newIndex]; isGraded[newIndex] = tempGraded;
    renderRubric();
}

function insertLevel(critIndex, insertIndex) { currentRubric.criteria[critIndex].levels.splice(insertIndex, 0, { points: 0, title: "New Level", desc: "" }); renderRubric(); }
function removeLevel(critIndex, levelIndex) { currentRubric.criteria[critIndex].levels.splice(levelIndex, 1); renderRubric(); }
function addCriterion() { currentRubric.criteria.push({ name: "New Criteria", levels: [ { points: 5, title: "Excellent", desc: "" } ] }); renderRubric(); }

function removeCriterion(critIndex) {
    if(confirm("Are you sure you want to delete this entire row?")) {
        currentRubric.criteria.splice(critIndex, 1);
        delete scores[critIndex]; delete comments[critIndex]; delete isGraded[critIndex];
        let newScores = {}; let newComments = {}; let newGraded = {};
        currentRubric.criteria.forEach((_, i) => {
            newScores[i] = scores[i >= critIndex ? i + 1 : i] || 0;
            newComments[i] = comments[i >= critIndex ? i + 1 : i] || '';
            newGraded[i] = isGraded[i >= critIndex ? i + 1 : i] || false;
        });
        scores = newScores; comments = newComments; isGraded = newGraded;
        renderRubric();
    }
}

function selectScore(critIndex, levelIndex, points) {
    if(isEditMode) return;
    isGraded[critIndex] = true;
    currentRubric.criteria[critIndex].levels.forEach((_, i) => {
        const cell = document.getElementById(`cell-${critIndex}-${i}`);
        if(cell) cell.classList.remove('selected');
    });
    const activeCell = document.getElementById(`cell-${critIndex}-${levelIndex}`);
    if(activeCell) activeCell.classList.add('selected');
    document.getElementById(`score-input-${critIndex}`).value = points;
    scores[critIndex] = parseFloat(points);
    updateTotalDisplay();
    checkExportReady();
    
    // Auto-focus the corresponding comment box
    const commentBox = document.getElementById(`comment-input-${critIndex}`);
    if (commentBox) {
        commentBox.focus();
    }
}

function manualScoreUpdate(critIndex, value) {
    let val = parseFloat(value); if (isNaN(val)) val = 0;
    scores[critIndex] = val; isGraded[critIndex] = true;
    currentRubric.criteria[critIndex].levels.forEach((_, i) => {
        const cell = document.getElementById(`cell-${critIndex}-${i}`);
        if(cell) cell.classList.remove('selected');
    });
    updateTotalDisplay();
    checkExportReady();
}

function updateRowComment(critIndex, element) { comments[critIndex] = element.value; if(element.style) { element.style.height = 'auto'; element.style.height = element.scrollHeight + 'px'; } }
function updateOverallComment(element) { overallComment = element.value; element.style.height = 'auto'; element.style.height = element.scrollHeight + 'px'; }
function updateTotalDisplay() { let total = 0; for (let key in scores) { total += scores[key]; } document.getElementById('totalScore').innerText = total; }

function clearGrades() {
    document.getElementById('studentName').value = '';
    currentRubric.criteria.forEach((crit, idx) => { scores[idx] = 0; comments[idx] = ''; isGraded[idx] = false; });
    overallComment = "";
    const ocInput = document.getElementById('overallCommentsInput');
    if (ocInput) { ocInput.value = ""; ocInput.style.height = 'auto'; }
    renderRubric(); window.scrollTo(0, 0); 
    checkExportReady();
}

async function selectSaveDirectory() {
    try {
        reportDirectoryHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
        jsonDirectoryHandle = await reportDirectoryHandle.getDirectoryHandle('backups', { create: true });
        const statusEl = document.getElementById('saveStatus');
        statusEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.1em;">folder_open</span> Saving to: ${reportDirectoryHandle.name}`;
        statusEl.classList.add('active');
    } catch (error) {
        if (error.name !== 'AbortError') { console.error('Directory selection failed', error); alert("Could not access the folder. Please try again."); }
    }
}

async function silentWriteFile(handle, filename, blobData) {
    if (!handle) return false;
    try {
        try { await handle.removeEntry(filename); } catch(e) {} 
        const fileHandle = await handle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blobData);
        await writable.close();
        return true;
    } catch (error) { console.error(`Failed to write ${filename}`, error); return false; }
}

function fallbackDownload(filename, blob) {
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
}

function generateStandaloneReport(studentName, projectTitle, totalScore) {
    let maxCols = 0;
    if (currentRubric.criteria.length > 0) { maxCols = Math.max(...currentRubric.criteria.map(c => c.levels.length)); }

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHTML(studentName)} - ${escapeHTML(projectTitle)}</title>
<style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.5; color: #333; max-width: 1100px; margin: 0 auto; padding: 40px; background: #ffffff; position: relative; }
    body::before { content: ""; position: absolute; top: 0; right: 0; width: 450px; height: 450px; background-image: url('WalEngNoBG.png'); background-size: contain; background-repeat: no-repeat; background-position: top right; opacity: 0.1; pointer-events: none; z-index: -1; }
    .header { text-align: left; border-bottom: 3px solid #002f6c; padding-bottom: 20px; margin-bottom: 30px; position: relative; z-index: 1; }
    h1 { color: #002f6c; margin: 0 0 10px 0; font-size: 2.2em; font-weight: bold; }
    h2 { color: #555; margin: 0; font-size: 1.4em; font-weight: normal; }
    .total-score { font-size: 1.8em; font-weight: bold; color: #c8102e; margin-top: 15px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; table-layout: fixed; position: relative; z-index: 1; }
    th, td { border: 1px solid #bdc3c7; padding: 12px; vertical-align: top; font-size: 0.9em; word-wrap: break-word; }
    .crit-title { font-weight: bold; width: 15%; background-color: #eef2f7; color: #002f6c; border-right: none; }
    .level-cell { position: relative; }
    .selected { background-color: #e6f0fa; border: 2px solid #002f6c; border-left: 1px solid #002f6c; }
    .selected::before { content: '✓'; position: absolute; top: 5px; right: 8px; color: #002f6c; font-weight: bold; font-size: 1.2em; }
    .level-pts { color: #c8102e; font-weight: bold; display: block; margin-bottom: 5px; background: #f9f9fb; border: 1px solid #bdc3c7; padding: 2px 6px; border-radius: 4px; display: inline-block; }
    .level-title { font-weight: bold; color: #002f6c; display: block; margin-bottom: 5px; }
    .score-col { font-weight: bold; text-align: center; width: 80px; background-color: #eef2f7; color: #002f6c; font-size: 1.1em; vertical-align: middle; border-left: none; }
    .comment-row td { background-color: white; padding: 15px; border-top: none; }
    .comment-box { border-left: 4px solid #2c529c; padding-left: 15px; margin: 0; white-space: pre-wrap; font-style: italic; background: #f9f9fb; padding: 10px 15px; border-radius: 0 4px 4px 0; }
    .overall-comments { margin-top: 30px; background: #f9f9fb; padding: 20px; border-radius: 6px; border-left: 5px solid #002f6c; border: 1px solid #bdc3c7; border-left-width: 5px; position: relative; z-index: 1; }
    .overall-comments h3 { color: #002f6c; margin-top: 0; margin-bottom: 15px; }
    .overall-comments div { white-space: pre-wrap; }
    @media print {
        body { padding: 0; max-width: 100%; }
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        .selected { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .crit-title, .score-col, .level-pts, .comment-box, .overall-comments { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
</style>
</head>
<body>
<div class="header">
    <h1>${escapeHTML(projectTitle)}</h1>
    <h2>Student: <strong>${escapeHTML(studentName)}</strong></h2>
    <div class="total-score">Total Score: ${totalScore} / ${document.getElementById('maxScore').innerText}</div>
</div>
<table>`;

    currentRubric.criteria.forEach((crit, i) => {
        html += `<tr><td class="crit-title">${escapeHTML(crit.name)}</td>`;
        crit.levels.forEach((level) => {
            let isSelected = (isGraded[i] && scores[i] === level.points) ? 'selected' : '';
            html += `<td class="level-cell ${isSelected}"><span class="level-pts">${level.points} pts</span><span class="level-title">${escapeHTML(level.title)}</span><span>${escapeHTML(level.desc)}</span></td>`;
        });
        let emptyCellsRequired = maxCols - crit.levels.length;
        for (let j = 0; j < emptyCellsRequired; j++) { html += `<td></td>`; }
        html += `<td class="score-col">${scores[i]}</td></tr>`;
        if (comments[i] && comments[i].trim() !== '') {
            html += `<tr class="comment-row"><td colspan="${maxCols + 2}"><div class="comment-box"><strong>Feedback:</strong><br>${escapeHTML(comments[i])}</div></td></tr>`;
        }
    });
    html += `</table>`;
    if (overallComment && overallComment.trim() !== '') {
        html += `<div class="overall-comments"><h3>Overall Project Feedback</h3><div>${escapeHTML(overallComment)}</div></div>`;
    }
    html += `</body></html>`;
    return html;
}

// NEW STUDENT RUBRIC EXPORT
function exportCleanRubric() {
    let maxCols = 0;
    if (currentRubric.criteria.length > 0) { maxCols = Math.max(...currentRubric.criteria.map(c => c.levels.length)); }

    let projectTitle = currentRubric.title || "Untitled Project";
    let safeProject = projectTitle.replace(/[^a-z0-9\s]/gi, '_').trim();
    let filename = `${safeProject} - Rubric.html`;

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHTML(projectTitle)} - Rubric</title>
<style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.5; color: #333; max-width: 1100px; margin: 0 auto; padding: 40px; background: #ffffff; }
    .header { text-align: left; border-bottom: 3px solid #002f6c; padding-bottom: 20px; margin-bottom: 30px; }
    h1 { color: #002f6c; margin: 0 0 10px 0; font-size: 2.2em; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; table-layout: fixed; }
    th, td { border: 1px solid #bdc3c7; padding: 12px; vertical-align: top; font-size: 0.9em; word-wrap: break-word; }
    .crit-title { font-weight: bold; width: 15%; background-color: #eef2f7; color: #002f6c; }
    .level-pts { color: #c8102e; font-weight: bold; display: block; margin-bottom: 5px; background: #f9f9fb; border: 1px solid #bdc3c7; padding: 2px 6px; border-radius: 4px; display: inline-block; }
    .level-title { font-weight: bold; color: #002f6c; display: block; margin-bottom: 5px; }
</style>
</head>
<body>
<div class="header">
    <h1>${escapeHTML(projectTitle)} - Grading Rubric</h1>
    <p>Review the criteria below to understand how this assignment will be evaluated.</p>
</div>
<table>`;

    currentRubric.criteria.forEach((crit) => {
        html += `<tr><td class="crit-title">${escapeHTML(crit.name)}</td>`;
        crit.levels.forEach((level) => {
            html += `<td><span class="level-pts">${level.points} pts</span><span class="level-title">${escapeHTML(level.title)}</span><span>${escapeHTML(level.desc)}</span></td>`;
        });
        let emptyCellsRequired = maxCols - crit.levels.length;
        for (let j = 0; j < emptyCellsRequired; j++) { html += `<td></td>`; }
        html += `</tr>`;
    });
    html += `</table></body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    fallbackDownload(filename, blob);
}

async function exportStudentDataAndReport() {
    if (!reportDirectoryHandle) {
        try { await selectSaveDirectory(); } catch(e) { return; }
        if (!reportDirectoryHandle) return; 
    }

    let studentName = document.getElementById('studentName').value.trim();
    let missingGrades = [];
    currentRubric.criteria.forEach((crit, idx) => { if (!isGraded[idx]) { missingGrades.push(crit.name); } });

    if (!studentName || missingGrades.length > 0) {
        let warningMsg = "Hold on! You have missing information:\n\n";
        if (!studentName) warningMsg += "• Student/Group Name is blank\n";
        if (missingGrades.length > 0) { warningMsg += "• Unscored Categories:\n   - " + missingGrades.join("\n   - ") + "\n"; }
        warningMsg += "\nDo you want to export the incomplete grade anyway?";
        if (!confirm(warningMsg)) { return; }
    }

    if(isSetupOpen) toggleSetup();

    let safeStudent = studentName ? studentName.replace(/[^a-z0-9\s]/gi, '_').trim() : "Unnamed";
    let projectTitle = currentRubric.title || "Untitled Project";
    let safeProject = projectTitle.replace(/[^a-z0-9\s]/gi, '_').trim();
    let totalScore = document.getElementById('totalScore').innerText;

    let jsonFilename = `${safeStudent} Feedback - ${safeProject}.json`;
    let reportFilename = `${safeStudent} Feedback - ${safeProject} - ${totalScore}.html`;

    const exportData = { type: "StudentGradeRecord", studentName: studentName, projectTitle: projectTitle, rubric: currentRubric, scores: scores, comments: comments, overallComment: overallComment, isGraded: isGraded };
    const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const htmlReportString = generateStandaloneReport(studentName, projectTitle, totalScore);
    const reportBlob = new Blob([htmlReportString], { type: 'text/html' });

    try {
        await cleanupOldReports(reportDirectoryHandle, safeStudent, safeProject, reportFilename);
        await silentWriteFile(jsonDirectoryHandle, jsonFilename, jsonBlob);
        await silentWriteFile(reportDirectoryHandle, reportFilename, reportBlob);
        
        if (reviewQueue.length > 0) { processNextReview(); } 
        else { clearGrades(); updateExportButtonUI(); }
        
    } catch (error) { console.error("Export Error", error); alert("An error occurred while saving the files."); }
}

async function exportRubricTemplate() {
    const dataStr = JSON.stringify(currentRubric, null, 2);
    const defaultName = (currentRubric.title || "Rubric").replace(/[^a-z0-9\s]/gi, '_').trim() + "_Template.json";
    
    try {
        if (window.showSaveFilePicker) {
            const handle = await window.showSaveFilePicker({
                suggestedName: defaultName,
                types: [{ description: 'JSON File', accept: {'application/json': ['.json']} }]
            });
            const writable = await handle.createWritable();
            await writable.write(dataStr);
            await writable.close();
        } else {
            const blob = new Blob([dataStr], { type: 'application/json' });
            fallbackDownload(defaultName, blob);
        }
    } catch (err) {
        if (err.name !== 'AbortError') { console.error('Save failed', err); const blob = new Blob([dataStr], { type: 'application/json' }); fallbackDownload(defaultName, blob); }
    }
}

function escapeHTML(str) {
    if(!str) return '';
    return str.toString().replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

window.onload = init;
