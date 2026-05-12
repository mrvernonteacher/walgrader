<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Graider</title>
    <link rel="icon" type="image/png" href="graiderfavicon.png">
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />

    <link rel="stylesheet" href="style.css">
</head>
<body>

<div id="loadingOverlay">
    <img src="WalEngSpin.gif" alt="Loading..." style="width: 240px; margin-bottom: 20px;">
    <h2 id="loadingText" style="margin:0; white-space: pre-line;">AI is processing...</h2>
    <p id="loadingSubtext" style="margin-top:5px; color:var(--text-light); font-size:1.1em; font-weight:bold;">This usually takes 5-15 seconds.</p>
</div>

<div id="teachModal" class="modal-overlay">
    <div class="modal-content">
        <h3><span class="material-symbols-outlined">psychology</span> Teach GrAIder: The Training Cart</h3>
        <p style="font-size: 0.9em; color: var(--text-light); margin-bottom: 20px;">Provide a student's document and their graded JSON. The app will pair them automatically. Build up a batch, then click Start Learning!</p>
        
        <div class="drop-zone-container" style="display: flex; gap: 10px; margin-bottom: 15px;">
            <div id="dropZoneDoc" class="drop-zone" style="flex: 1;"><span class="material-symbols-outlined">description</span> 1. Drop Document</div>
            <input type="file" id="teachDocInput" accept=".pdf, .png, .jpg, .jpeg">

            <div id="dropZoneJson" class="drop-zone" style="flex: 1;"><span class="material-symbols-outlined">data_object</span> 2. Drop JSON</div>
            <input type="file" id="teachJsonInput" accept=".json">
        </div>

        <div id="teachQueueContainer" class="queue-container"></div>

        <div style="display: flex; justify-content: space-between; gap: 10px;">
            <button class="btn-danger" style="width:100%" onclick="closeTeachModal()"><span class="material-symbols-outlined">close</span> Cancel</button>
            <button id="startTeachBtn" class="btn-success" style="width:100%" disabled onclick="executeTeachAI()"><span class="material-symbols-outlined">school</span> Start Learning (0 Pairs)</button>
        </div>
    </div>
</div>

<div class="container">
    <div class="watermark-layer"></div>

    <div class="sticky-top">
        
        <div class="top-nav">
            <div id="projectTitleContainer"></div>
            <div class="nav-buttons">
                <button class="btn-nav-danger" onclick="clearGrades()" title="Clear all scores">
                    <span class="material-symbols-outlined">clear_all</span> <span class="hide-mobile">Clear Scores</span>
                </button>
                <button id="btnSetup" class="btn-nav" onclick="toggleSetup()" title="Toggle Setup & Edit Mode">
                    <span id="gearIcon" class="material-symbols-outlined anim-icon">settings</span> <span class="hide-mobile">Setup</span>
                </button>
                <button id="btnAI" class="btn-nav" onclick="toggleAI()" title="Toggle GrAIder Tools">
                    <span id="robotIcon" class="material-symbols-outlined anim-icon">smart_toy</span> <span class="hide-mobile">GrAIder</span>
                </button>
                <button class="btn-nav icon-only" onclick="toggleTheme()" title="Toggle Dark/Light Mode">
                    <span id="themeIcon" class="material-symbols-outlined">dark_mode</span>
                </button>
            </div>
        </div>

        <div id="setupWrapper" class="collapsible-panel collapsed">
            <div class="panel-inner">
                <div class="panel-content">
                    <div class="controls-row-split">
                        <div class="left-controls">
                            <button class="btn btn-info" onclick="selectSaveDirectory()" title="Set Master Folder for auto-saving"><span class="material-symbols-outlined">create_new_folder</span> Set Save Folder</button>
                            <span id="saveStatus" class="save-status"><span class="material-symbols-outlined" style="font-size: 1.1em;">folder_off</span> No folder</span>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                            <label class="btn btn-warning" for="autoBuildFile" title="Auto-Build Rubric (PDF/Image)"><span class="material-symbols-outlined">auto_fix_high</span> Auto-Build</label>
                            <input type="file" id="autoBuildFile" accept=".pdf, .png, .jpg, .jpeg">

                            <label class="btn btn-info" for="uploadRubric" title="Load an existing Rubric Template"><span class="material-symbols-outlined">upload_file</span> Load Template</label>
                            <input type="file" id="uploadRubric" accept=".json">
                            
                            <button class="btn-info" onclick="exportCleanRubric()" title="Export a clean HTML rubric for students"><span class="material-symbols-outlined">description</span> Student Rubric</button>

                            <button class="btn-success" onclick="exportRubricTemplate()" title="Export current Rubric as Template"><span class="material-symbols-outlined">save</span> Save Template</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="aiWrapper" class="collapsible-panel collapsed">
            <div class="panel-inner">
                <div class="panel-content">
                    
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px; border-bottom: 1px solid var(--border); padding-bottom: 15px;">
                        <span class="material-symbols-outlined" style="color: var(--primary);">key</span>
                        <input type="password" id="geminiApiKey" placeholder="Paste Gemini API Key Here..." 
                               style="flex-grow: 1; border: 1px solid var(--border); padding: 8px; border-radius: 4px; background: var(--input-bg); color: var(--text-dark);">
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" class="btn-nav" style="font-size: 0.8em; text-decoration: none;">Get Free Key</a>
                    </div>

                    <div class="controls-row-split">
                        <div class="left-controls">
                            <label class="btn btn-info" for="autoGradeFile" title="Have AI Grade Student PDFs (Review One-by-One)"><span class="material-symbols-outlined">robot_2</span> Review GrAIder</label>
                            <input type="file" id="autoGradeFile" accept=".pdf, .png, .jpg, .jpeg" multiple>

                            <label class="btn btn-purple" for="batchGradeFile" title="Silent Batch Auto-Grade directly to Folder"><span class="material-symbols-outlined">rocket_launch</span> Batch GrAIder</label>
                            <input type="file" id="batchGradeFile" accept=".pdf, .png, .jpg, .jpeg" multiple>
                        </div>
                        
                        <button class="btn btn-danger" onclick="openTeachModal()" title="Teach GrAIder by batching PDF and JSON pairs"><span class="material-symbols-outlined">psychology</span> Teach GrAIder</button>
                    </div>
                    
                    <div style="display: flex; gap: 15px; width: 100%; flex-wrap: wrap; margin-top: 5px;">
                        
                        <div class="ai-instruction-box" style="flex: 1; min-width: 250px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                <label for="aiPromptInput"><span class="material-symbols-outlined">chat</span> Manual Instructions (Saves w/ Template):</label>
                            </div>
                            <textarea id="aiPromptInput" class="blue-scheme-box" placeholder="e.g., Don't grade the video presentation section. Be strict on citations." oninput="currentRubric.aiPrompt = this.value"></textarea>
                        </div>

                        <div class="ai-instruction-box" style="flex: 1; min-width: 250px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                <label for="learnedRulesInput"><span class="material-symbols-outlined">rule</span> Extracted Rules (Saves w/ Template):</label>
                            </div>
                            <textarea id="learnedRulesInput" class="red-scheme-box" placeholder="Rules extracted from the Teach GrAIder tool will appear here..." oninput="updateLearnedRules(this.value)"></textarea>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div class="main-grading-header">
            <div class="student-info" style="width: 100%;">
                <label for="studentName">Student/Group:</label>
                <div style="display:flex; gap:10px; width: 100%; align-items: center;">
                    <input type="text" id="studentName" placeholder="Enter name(s) here..." style="max-width: 400px; flex-grow: 1;">
                    <label class="btn btn-info" for="loadStudentFile" title="Import a previously saved student JSON" style="margin: 0; white-space: nowrap;"><span class="material-symbols-outlined">upload</span> Import</label>
                    <input type="file" id="loadStudentFile" accept=".json">
                </div>
            </div>
            
            <div class="header-right">
                <div class="score-display">
                    Total: <span id="totalScore">0</span> / <span id="maxScore">100</span>
                </div>
                <button id="exportMainBtn" class="btn-success grade-only" onclick="exportStudentDataAndReport()" title="Export Student (HTML Report & Data)" style="margin: 0; white-space: nowrap;"><span class="material-symbols-outlined">sim_card_download</span> Export</button>
            </div>
        </div>
    </div>

    <table class="rubric-table" id="rubricTable"></table>
    
    <div id="addCriterionContainer" style="display: none; margin-bottom: 20px; text-align: center;">
        <button class="btn-success" onclick="addCriterion()"><span class="material-symbols-outlined">add</span> Add New Criteria Row</button>
    </div>

    <div id="overallCommentsContainer">
        <h3>Overall Comments</h3>
        <textarea id="overallCommentsInput" class="comments-input" placeholder="Type overall project feedback here..." oninput="updateOverallComment(this)"></textarea>
    </div>
</div>

<button id="smartFillBtn" onclick="autoFillMaxPoints()" title="Fills max points for all blank rows above your furthest graded row"><span class="material-symbols-outlined">check_circle</span> Fill Max Down To Here</button>

<button id="askGraiderBtn" onclick="openHelpModal()" title="Ask GrAIder">
    <span class="material-symbols-outlined">support_agent</span>
</button>

<div id="helpModal" class="modal-overlay">
    <div class="modal-content" style="max-height: 80vh; overflow-y: auto;">
        <h3><span class="material-symbols-outlined">support_agent</span> Ask GrAIder FAQ</h3>
        <p style="font-size: 0.9em; color: var(--text-light); margin-bottom: 20px;">Click on any question below to learn how to master the GrAIder app.</p>
        
        <div class="faq-container">
            <details class="faq-item">
                <summary>How do I connect my Master Save Folder?</summary>
                <div class="faq-answer">Click the <strong>Setup</strong> button at the top, then click <strong>Set Save Folder</strong>. Select a folder on your computer where you want all JSON data and HTML reports to be automatically saved. You must do this before running a Batch Grade.</div>
            </details>

            <details class="faq-item">
                <summary>What is the difference between Review GrAIder and Batch GrAIder?</summary>
                <div class="faq-answer"><strong>Review GrAIder</strong> lets you upload a batch of PDFs but holds them in a queue so you can review and manually adjust the scores one-by-one before saving. <br><br><strong>Batch GrAIder</strong> processes the entire stack of PDFs completely silently in the background and drops the final graded HTML reports directly into your Master Save Folder.</div>
            </details>

            <details class="faq-item">
                <summary>How do I edit the Rubric?</summary>
                <div class="faq-answer">Click the <strong>Setup</strong> button at the top. This will automatically force the table into Edit Mode where you can add rows, change points, and edit descriptions. Close the Setup menu to lock the rubric back into grading mode.</div>
            </details>

            <details class="faq-item">
                <summary>What does the "Teach GrAIder" button do?</summary>
                <div class="faq-answer">If the AI is missing nuances in your grading, you can upload a previous student's PDF alongside their graded JSON file. The app will study the pair to learn exactly *why* you gave the grades you did, and extract permanent rules to apply to future grading!</div>
            </details>
            
            <details class="faq-item">
                <summary>How do I save my rubric for next year?</summary>
                <div class="faq-answer">Open the <strong>Setup</strong> menu and click <strong>Save Template</strong>. This will download a JSON file containing all your criteria, manual AI instructions, and extracted rules. Next year, just click <strong>Load Template</strong> to bring it all back!</div>
            </details>
        </div>

        <div style="margin-top: 20px; text-align: right;">
            <button class="btn-info" onclick="closeHelpModal()"><span class="material-symbols-outlined">close</span> Close Help</button>
        </div>
    </div>
</div>

<script src="script.js?v=5"></script>
</body>
</html>
