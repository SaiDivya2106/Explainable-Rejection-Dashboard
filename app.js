// global references to animated charts
let radarChartInstance = null;
let barChartInstance = null;
let gaugeChartInstance = null;

// DOM Elements
const openModalBtn = document.getElementById('openDataInputBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('dataInputModal');
const runAnalysisBtn = document.getElementById('runAnalysisBtn');
const analysisLoading = document.getElementById('analysisLoading');
const resultsDashboard = document.getElementById('resultsDashboard');

// KPI Elements
const kpiOverallScore = document.getElementById('kpiOverallScore');
const kpiOverallConf = document.getElementById('kpiOverallConf');
const kpiRejectionProb = document.getElementById('kpiRejectionProb');
const kpiRejectionConf = document.getElementById('kpiRejectionConf');
const kpiStrongest = document.getElementById('kpiStrongest');
const kpiStrongestConf = document.getElementById('kpiStrongestConf');
const kpiWeakest = document.getElementById('kpiWeakest');
const kpiWeakestConf = document.getElementById('kpiWeakestConf');

// Rejection Reason
const structuredReason = document.getElementById('structuredReason');
const rejectionReasonConf = document.getElementById('rejectionReasonConf');
const evidenceSnippet = document.getElementById('evidenceSnippet');

// Event Listeners for Modal
openModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('hidden');
    // slight delay to trigger CSS transition
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
});

closeModalBtn.addEventListener('click', () => closeModal());

function closeModal() {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
        modalOverlay.classList.add('hidden');
    }, 300);
}

// Generate dynamic data based on input
function analyzeInput(transcriptText, audioFile, notesFile) {
    let textToAnalyze = transcriptText ? transcriptText.toLowerCase() : "";

    // Simple heuristic-based simulation
    const keywords = {
        technical: ['api', 'database', 'design', 'architecture', 'scale', 'sql', 'react', 'node', 'code', 'system', 'optimize', 'cache', 'frontend', 'backend', 'fullstack'],
        communication: ['explain', 'clear', 'understand', 'team', 'communicate', 'articulate', 'speak', 'talk', 'listen', 'agile', 'scrum', 'present'],
        problemSolving: ['solve', 'bug', 'issue', 'algorithm', 'complexity', 'debug', 'solution', 'approach', 'logic', 'fix', 'error'],
        culturalFit: ['culture', 'value', 'learn', 'grow', 'collaborate', 'help', 'mentor', 'passion', 'drive', 'motivation', 'teamwork', 'leadership']
    };

    let counts = {
        technical: 0,
        communication: 0,
        problemSolving: 0,
        culturalFit: 0
    };

    // Count keywords
    for (const [category, words] of Object.entries(keywords)) {
        words.forEach(word => {
            const regex = new RegExp('\\b' + word + '\\b', 'g');
            const matches = textToAnalyze.match(regex);
            if (matches) {
                counts[category] += matches.length;
            }
        });
    }

    // Baseline scores depending on text length and matches
    let scores = {
        technical: textToAnalyze.length > 10 ? Math.min(40 + counts.technical * 15, 95) : 50,
        communication: textToAnalyze.length > 10 ? Math.min(50 + counts.communication * 15, 98) : 60,
        problemSolving: textToAnalyze.length > 10 ? Math.min(45 + counts.problemSolving * 15, 95) : 55,
        culturalFit: textToAnalyze.length > 10 ? Math.min(60 + counts.culturalFit * 12, 98) : 70
    };

    // If audio or notes are provided, simulate more detailed extraction that boosts performance randomly
    if (audioFile) {
        let sizeMod = audioFile.size % 20;
        scores.communication = Math.min(scores.communication + sizeMod, 98);
        scores.culturalFit = Math.min(scores.culturalFit + sizeMod, 95);
    }
    if (notesFile) {
        let sizeMod = notesFile.size % 20;
        scores.technical = Math.min(scores.technical + sizeMod, 95);
        scores.problemSolving = Math.min(scores.problemSolving + sizeMod, 95);
    }

    // Default basic randomizer if text is completely empty but files were uploaded
    if (!transcriptText && (audioFile || notesFile)) {
        const seed = ((audioFile ? audioFile.size : 0) + (notesFile ? notesFile.size : 0)) || 12345;
        scores.technical = 40 + (seed % 50);
        scores.communication = 50 + ((seed * 2) % 45);
        scores.problemSolving = 45 + ((seed * 3) % 50);
        scores.culturalFit = 60 + ((seed * 4) % 35);
    }

    const overallScore = Math.floor((scores.technical + scores.communication + scores.problemSolving + scores.culturalFit) / 4);

    // Logic: rejection goes up if score is low
    let rejectionProb = Math.max(0, 100 - overallScore + Math.floor(Math.random() * 10 - 5));
    if (rejectionProb > 99) rejectionProb = 99;

    const comps = [
        { name: 'Technical Skills', key: 'technical', score: scores.technical },
        { name: 'Communication', key: 'communication', score: scores.communication },
        { name: 'Problem Solving', key: 'problemSolving', score: scores.problemSolving },
        { name: 'Cultural Fit', key: 'culturalFit', score: scores.culturalFit }
    ];

    comps.sort((a, b) => b.score - a.score);
    const strongest = comps[0];
    const weakest = comps[comps.length - 1];

    let structuredReason = "";
    let evidenceSnippet = "";

    // Generate reason based on weakest competency dynamically mapped
    if (weakest.key === 'technical') {
        structuredReason = "Insufficient Technical Depth";
        evidenceSnippet = `Based on the provided ${transcriptText ? 'transcript' : 'files'}, the candidate lacked detailed understanding of core technologies and system design concepts mentioned.`;
    } else if (weakest.key === 'communication') {
        structuredReason = "Poor Communication Clarity";
        evidenceSnippet = `The ${transcriptText ? 'transcript analysis' : 'provided audio/notes'} indicates the candidate struggled to clearly articulate their thought process comprehensively.`;
    } else if (weakest.key === 'problemSolving') {
        structuredReason = "Weak Problem Solving Approach";
        evidenceSnippet = `Algorithms and logical capabilities highlighted throughout the ${transcriptText ? 'transcript' : 'files'} suggest difficulty with edge cases and optimal solutions.`;
    } else {
        structuredReason = "Misaligned with Company Values";
        evidenceSnippet = `Responses and tone extracted from the data did not sufficiently align with our core principles of seamless collaboration.`;
    }

    if (transcriptText && textToAnalyze.length < 50) {
        evidenceSnippet += " Note: The transcript provided was very short, limiting confidence.";
    }

    // Dynamic AI Explanations and Tips per competency based on score thresholds
    const getExplanation = (type, score) => {
        if (type === 'technical') {
            if (score >= 80) return { exp: "Demonstrated strong grasp of core engineering principles and modern architectural patterns.", tip: "Explore advanced topics like distributed consensus algorithms." };
            if (score >= 60) return { exp: "Solid foundational knowledge, but struggled with deep-dives into scalability and complex system design.", tip: "Review system design fundamentals and caching mechanisms." };
            return { exp: "Significant gaps in required technical knowledge. Answers lacked depth and practical application.", tip: "Revisit core programming concepts and database normalization." };
        }
        if (type === 'communication') {
            if (score >= 80) return { exp: "Articulated thoughts exceptionally well using structured frameworks like STAR.", tip: "Consider mentoring others to further refine leadership communication." };
            if (score >= 60) return { exp: "Generally clear communication, but occasionally lost focus during complex technical explanations.", tip: "Practice structuring technical answers more concisely." };
            return { exp: "Struggled to convey ideas clearly. Responses were often disjointed or difficult to follow.", tip: "Focus on the STAR method to structure your responses during interviews." };
        }
        if (type === 'problemSolving') {
            if (score >= 80) return { exp: "Excellent analytical skills. Consistently identified edge cases and optimal solutions quickly.", tip: "Challenge yourself with competitive programming to stay sharp." };
            if (score >= 60) return { exp: "Good initial approaches, but required hints to reach optimal time complexity constraints.", tip: "Practice optimizing algorithm time constraints and identifying bottlenecks." };
            return { exp: "Had difficulty breaking down complex problems. Often resorted to brute-force without optimization.", tip: "Focus on algorithmic patterns (e.g., sliding window, two pointers)." };
        }
        if (type === 'culturalFit') {
            if (score >= 80) return { exp: "Showcased high enthusiasm for collaboration and strong alignment with our core engineering values.", tip: "Keep exhibiting your natural leadership qualities." };
            if (score >= 60) return { exp: "Showed adequate teamwork skills, but lacked specific examples of cross-functional collaboration.", tip: "Reflect on past experiences where you successfully navigated team conflicts." };
            return { exp: "Responses indicated a preference for isolated work and lacked alignment with our collaborative culture.", tip: "Highlight instances of teamwork, mentorship, and collective ownership." };
        }
    };

    const compData = {
        technical: getExplanation('technical', scores.technical),
        communication: getExplanation('communication', scores.communication),
        problemSolving: getExplanation('problemSolving', scores.problemSolving),
        culturalFit: getExplanation('culturalFit', scores.culturalFit)
    };

    // Personalized Roadmap Generation based on Weakest Link
    let roadmap = [];
    if (weakest.key === 'technical') {
        roadmap = [
            { icon: 'fa-database', title: 'Technical Practice Plan', p: 'Deepen knowledge in System Design. Focus on Database Sharding and Caching Mechanisms (Redis, Memcached).' },
            { icon: 'fa-code', title: 'Framework Deep Dive', p: 'Build a full-stack project from scratch focusing on robust API design and state management.' },
            { icon: 'fa-users', title: 'Mock Interview Suggestion', p: 'Schedule a mock interview specifically focused on Architecture & Scalability concepts.' }
        ];
    } else if (weakest.key === 'communication') {
        roadmap = [
            { icon: 'fa-comments', title: 'Communication Enhancement', p: 'Practice the STAR (Situation, Task, Action, Result) method to structure your behavioral responses.' },
            { icon: 'fa-pen-to-square', title: 'Whiteboarding Practice', p: 'Practice speaking aloud while writing code on a whiteboard to improve thought articulation.' },
            { icon: 'fa-users', title: 'Mock Interview Suggestion', p: 'Do behavioral mock interviews and record yourself to analyze your pacing and clarity.' }
        ];
    } else if (weakest.key === 'problemSolving') {
        roadmap = [
            { icon: 'fa-clock', title: 'Algorithm Optimization', p: 'Practice identifying bottlenecks in O(N^2) algorithms and refining them to O(N log N) without prompts.' },
            { icon: 'fa-puzzle-piece', title: 'Pattern Recognition', p: 'Focus your LeetCode practice on specific patterns rather than random questions.' },
            { icon: 'fa-users', title: 'Mock Interview Suggestion', p: 'Schedule a technical mock interview focused purely on dynamic programming and graphs.' }
        ];
    } else {
        roadmap = [
            { icon: 'fa-handshake', title: 'Cultural Alignment', p: 'Review the company values and prepare specific anecdotes that highlight your alignment with them.' },
            { icon: 'fa-people-group', title: 'Teamwork Focus', p: 'Reflect on projects where you successfully collaborated, mentored, or resolved conflicts.' },
            { icon: 'fa-users', title: 'Mock Interview Suggestion', p: 'Schedule a behavioral interview specifically targeting conflict resolution and leadership.' }
        ];
    }

    return {
        overallScore,
        overallConf: 85 + Math.floor(Math.random() * 10),
        rejectionProb,
        rejectionConf: 80 + Math.floor(Math.random() * 15),
        strongest: strongest.name,
        strongestConf: 85 + Math.floor(Math.random() * 10),
        weakest: weakest.name,
        weakestConf: 80 + Math.floor(Math.random() * 15),
        structuredReason,
        evidenceSnippet,
        scores,
        compData,
        roadmap
    };
}

let currentAnalysis = null;

// Run AI Analysis Simulation
runAnalysisBtn.addEventListener('click', () => {

    // basic validation
    const transcriptText = document.getElementById('transcriptText').value;
    const audioFile = document.getElementById('audioFile').files[0];
    const notesFile = document.getElementById('notesFile').files[0];

    if (!transcriptText && !audioFile && !notesFile) {
        alert('Please provide at least one source of input (Transcript Text, Audio File, or Notes Document).');
        return;
    }

    // Hide run button, show loading
    runAnalysisBtn.classList.add('hidden');
    analysisLoading.classList.remove('hidden');

    // Generate dynamic results based on input
    currentAnalysis = analyzeInput(transcriptText, audioFile, notesFile);

    // Simulate API delay
    setTimeout(() => {
        closeModal();
        // Reset modal buttons
        runAnalysisBtn.classList.remove('hidden');
        analysisLoading.classList.add('hidden');

        // Show dashbaord content
        resultsDashboard.classList.add('active');

        // Update UI with dynamic data
        updateDashboardUI(currentAnalysis);

        // Trigger animations
        animateKPIs(currentAnalysis);
        animateProgressBars();
        renderCharts(currentAnalysis.scores);

        // Scroll to dashboard
        resultsDashboard.scrollIntoView({ behavior: 'smooth' });

    }, 2500); // 2.5 second simulation
});

function updateDashboardUI(data) {
    // Modify colors for KPI components individually

    // Overall Score
    kpiOverallScore.parentElement.classList.remove('strength-card', 'weakness-card', 'risk-card');
    kpiOverallScore.classList.remove('text-blue', 'text-green', 'text-yellow', 'text-red');
    if (data.overallScore >= 80) kpiOverallScore.classList.add('text-green');
    else if (data.overallScore >= 60) kpiOverallScore.classList.add('text-blue');
    else kpiOverallScore.classList.add('text-red');

    // Rejection Probability
    kpiRejectionProb.classList.remove('text-blue', 'text-green', 'text-yellow', 'text-red');
    if (data.rejectionProb >= 70) {
        kpiRejectionProb.classList.add('text-red');
        kpiRejectionProb.parentElement.classList.add('risk-card');
    } else if (data.rejectionProb >= 40) {
        kpiRejectionProb.classList.add('text-yellow');
        kpiRejectionProb.parentElement.classList.remove('risk-card');
    } else {
        kpiRejectionProb.classList.add('text-green');
        kpiRejectionProb.parentElement.classList.remove('risk-card');
    }

    // Update Competency lists dynamically
    const comps = document.querySelectorAll('.competency-item');
    const compMap = {
        'Technical Skills': 'technical',
        'Communication': 'communication',
        'Problem Solving': 'problemSolving',
        'Cultural Fit': 'culturalFit'
    };

    comps.forEach(comp => {
        const title = comp.querySelector('h3').textContent;
        const key = compMap[title];
        const score = data.scores[key];
        const compInfo = data.compData[key];

        const scoreSpan = comp.querySelector('.comp-score');
        const progressBar = comp.querySelector('.progress-bar');

        // Update score text for immediate presentation before animation
        scoreSpan.textContent = score + "%";

        // Remove old color classes
        scoreSpan.classList.remove('text-green', 'text-yellow', 'text-red');
        progressBar.classList.remove('bg-green', 'bg-yellow', 'bg-red');

        // Add new color classes
        if (score >= 80) {
            scoreSpan.classList.add('text-green');
            progressBar.classList.add('bg-green');
        } else if (score >= 60) {
            scoreSpan.classList.add('text-yellow');
            progressBar.classList.add('bg-yellow');
        } else {
            scoreSpan.classList.add('text-red');
            progressBar.classList.add('bg-red');
        }

        // Set target width inline (used for animation in animateProgressBars)
        progressBar.style.width = score + "%";

        // Update confidence mock
        comp.querySelector('.comp-meta strong').textContent = (80 + Math.floor(Math.random() * 15)) + "%";

        // Inject Dynamic Explanations and Tips
        const explanationDiv = comp.querySelector('.comp-explanation');
        explanationDiv.innerHTML = `<strong>AI Explanation:</strong> ${compInfo.exp}`;

        let tipDiv = comp.querySelector('.comp-tips');
        if (!tipDiv) {
            tipDiv = document.createElement('div');
            tipDiv.className = 'comp-tips';
            comp.querySelector('.comp-details').appendChild(tipDiv);
        }
        tipDiv.innerHTML = `<i class="fa-regular fa-lightbulb"></i> <strong>Tip:</strong> ${compInfo.tip}`;
    });

    // Update Roadmap Dynamically
    const roadmapList = document.querySelector('.roadmap-list');
    roadmapList.innerHTML = ''; // clear static content

    data.roadmap.forEach(item => {
        roadmapList.innerHTML += `
             <li class="roadmap-item">
                 <div class="roadmap-icon"><i class="fa-solid ${item.icon}"></i></div>
                 <div class="roadmap-content">
                     <h4>${item.title}</h4>
                     <p>${item.p}</p>
                 </div>
             </li>
         `;
    });
}

function animateKPIs(data) {
    // Current animated strings
    animateValue(kpiOverallScore, 0, data.overallScore, 1000, '%');
    animateValue(kpiOverallConf, 0, data.overallConf, 1000, '%');
    animateValue(kpiRejectionProb, 0, data.rejectionProb, 1000, '%');
    animateValue(kpiRejectionConf, 0, data.rejectionConf, 1000, '%');

    // Text reveals
    setTimeout(() => {
        kpiStrongest.textContent = data.strongest;
        kpiWeakest.textContent = data.weakest;
        kpiStrongestConf.textContent = data.strongestConf + '%';
        kpiWeakestConf.textContent = data.weakestConf + '%';

        structuredReason.textContent = data.structuredReason;
        rejectionReasonConf.textContent = data.rejectionConf + "%";
        evidenceSnippet.textContent = data.evidenceSnippet;

    }, 500);
}

function animateValue(obj, start, end, duration, suffix = "") {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function animateProgressBars() {
    const bars = document.querySelectorAll('.progress-bar');
    bars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 100);
    });
}

// Chart.js Implementations
function renderCharts(scores) {
    // Colors
    const primaryBlue = '#2563eb';
    const primaryBlueOp = 'rgba(37, 99, 235, 0.2)';
    const colorRed = '#ef4444';
    const colorYellow = '#f59e0b';
    const colorGreen = '#10b981';

    // 1. Radar Chart (Skill Profile Overview)
    const ctxRadar = document.getElementById('radarChart').getContext('2d');
    if (radarChartInstance) radarChartInstance.destroy();

    radarChartInstance = new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: ['Algorithms', 'System Design', 'Communication', 'Cultural Fit', 'Adaptability', 'Debugging'],
            datasets: [{
                label: 'Candidate Profile',
                data: [
                    Math.max(scores.problemSolving - (Math.floor(Math.random() * 15)), 20),
                    Math.max(scores.technical - (Math.floor(Math.random() * 15)), 20),
                    scores.communication,
                    scores.culturalFit,
                    Math.floor((scores.problemSolving + scores.culturalFit) / 2),
                    Math.max(scores.technical - 5, 20)
                ],
                backgroundColor: primaryBlueOp,
                borderColor: primaryBlue,
                pointBackgroundColor: primaryBlue,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: primaryBlue,
                borderWidth: 2
            },
            {
                label: 'Expected Baseline',
                data: [70, 70, 70, 70, 70, 70],
                backgroundColor: 'rgba(100, 116, 139, 0.1)',
                borderColor: '#64748b',
                pointBackgroundColor: '#64748b',
                borderWidth: 1,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(0,0,0,0.1)' },
                    grid: { color: 'rgba(0,0,0,0.1)' },
                    pointLabels: {
                        font: { family: 'Inter', size: 11, weight: '500' }
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 2. Bar Chart (Competency Comparison)
    const ctxBar = document.getElementById('barChart').getContext('2d');
    if (barChartInstance) barChartInstance.destroy();

    const barData = [scores.technical, scores.communication, scores.problemSolving, scores.culturalFit];
    const barColors = barData.map(s => s >= 80 ? colorGreen : (s >= 60 ? colorYellow : colorRed));

    barChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Technical', 'Communication', 'Problem Solving', 'Cultural Fit'],
            datasets: [{
                label: 'Score %',
                data: barData,
                backgroundColor: barColors,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // 3. Gauge Chart Custom Implementation for Bias Risk (Using Doughnut)
    const ctxGauge = document.getElementById('gaugeChart').getContext('2d');
    if (gaugeChartInstance) gaugeChartInstance.destroy();

    const biasRisk = Math.floor(Math.random() * 20) + 5; // 5 to 25% bias risk
    const biasColor = biasRisk > 15 ? colorYellow : colorGreen;

    // update text before rendering chart
    const biasTextEl = document.getElementById('biasRiskLevel');
    if (biasTextEl) {
        biasTextEl.textContent = biasRisk > 15 ? 'Moderate' : 'Low';
        biasTextEl.style.color = biasColor;
    }

    gaugeChartInstance = new Chart(ctxGauge, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [biasRisk, 100 - biasRisk],
                backgroundColor: [biasColor, '#e2e8f0'],
                borderWidth: 0,
                cutout: '80%',
                circumference: 270,
                rotation: 225
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: { enabled: false },
                legend: { display: false }
            }
        }
    });
}