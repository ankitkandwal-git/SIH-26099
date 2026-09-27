import Chart from "chart.js/auto";

const state = {
  currentScreen: "dashboard",
  repoSort: { key: "materialCode", direction: "asc" },
  suggestionIndex: -1,
  currentSuggestions: [],
  charts: {},
  analysisTimer: null,
  selectedStandardRecordId: null,
  uploadedFile: null,
  initialized: false,
};

const analysisData = [
  {
    id: "AI-2401",
    materialCode: "MAT-1001",
    originalName: "MS Hex Bolt M10 X 50",
    potentialMatch: "MS Hex Bolt M10",
    similarity: 96,
    confidence: "High",
    confidenceScore: 97,
    recommendation: "Merge as standardized fastener under MS Hex Bolt M10",
    original: {
      code: "MAT-1001",
      name: "MS Hex Bolt M10 X 50",
      description: "Mild steel hex bolt M10 x 50 mm, zinc coated",
      specification: "Grade 4.6 | IS 1363",
      category: "Fasteners",
      manufacturer: "ABC Industrial",
      unit: "Nos",
    },
    recommended: {
      name: "MS Hex Bolt M10",
      description: "Mild steel hex bolt, M10 size, zinc coated, IS 1363 compliant",
      category: "Fasteners",
      equivalent: "Mild Steel Hex Bolt M10",
      keywords: "hex bolt, ms bolt, m10, zinc coated",
    },
  },
  {
    id: "AI-2402",
    materialCode: "MAT-1002",
    originalName: "Hex Nut Stainless Steel 304 M10",
    potentialMatch: "Hex Nut SS304",
    similarity: 94,
    confidence: "High",
    confidenceScore: 95,
    recommendation: "Consolidate to standardized nut description",
    original: {
      code: "MAT-1002",
      name: "Hex Nut Stainless Steel 304 M10",
      description: "Stainless steel hex nut grade 304, metric size M10",
      specification: "SS304 | IS 1364",
      category: "Fasteners",
      manufacturer: "Unimet",
      unit: "Nos",
    },
    recommended: {
      name: "Hex Nut SS304",
      description: "Hex nut stainless steel SS304, M10, IS 1364",
      category: "Fasteners",
      equivalent: "SS304 Nut M10",
      keywords: "hex nut, ss304, m10, stainless",
    },
  },
  {
    id: "AI-2403",
    materialCode: "MAT-1003",
    originalName: "PVC Pipe 110 MM PN6",
    potentialMatch: "PVC Pipe 110mm",
    similarity: 93,
    confidence: "High",
    confidenceScore: 93,
    recommendation: "Standardize pipe size expression and pressure class",
    original: {
      code: "MAT-1003",
      name: "PVC Pipe 110 MM PN6",
      description: "PVC pressure pipe outer diameter 110 mm PN6",
      specification: "PVC-U | PN6",
      category: "Pipes",
      manufacturer: "Flowline",
      unit: "Meter",
    },
    recommended: {
      name: "PVC Pipe 110mm",
      description: "PVC pressure pipe, 110 mm OD, PN6 compliant",
      category: "Pipes",
      equivalent: "PVC-U Pipe 110 mm PN6",
      keywords: "pvc pipe, 110mm, pn6, pressure pipe",
    },
  },
  {
    id: "AI-2404",
    materialCode: "MAT-1004",
    originalName: "SKF 6205 Bearing",
    potentialMatch: "Bearing SKF6205",
    similarity: 97,
    confidence: "High",
    confidenceScore: 98,
    recommendation: "Map both records to OEM standard code",
    original: {
      code: "MAT-1004",
      name: "SKF 6205 Bearing",
      description: "Deep groove ball bearing SKF series 6205",
      specification: "25x52x15 mm",
      category: "Bearings",
      manufacturer: "SKF",
      unit: "Nos",
    },
    recommended: {
      name: "Bearing SKF6205",
      description: "Deep groove ball bearing SKF 6205, 25x52x15 mm",
      category: "Bearings",
      equivalent: "SKF Bearing 6205",
      keywords: "bearing, skf6205, deep groove",
    },
  },
  {
    id: "AI-2405",
    materialCode: "MAT-1005",
    originalName: "Copper Cable 16 sq.mm FRLS",
    potentialMatch: "Copper Cable 16 sqmm",
    similarity: 90,
    confidence: "Medium",
    confidenceScore: 86,
    recommendation: "Review insulation grade before merge",
    original: {
      code: "MAT-1005",
      name: "Copper Cable 16 sq.mm FRLS",
      description: "Copper single core cable 16 sq mm FRLS insulation",
      specification: "1.1 kV",
      category: "Electrical",
      manufacturer: "Powermax",
      unit: "Meter",
    },
    recommended: {
      name: "Copper Cable 16 sqmm",
      description: "Copper electrical cable, 16 sq mm conductor, FRLS grade",
      category: "Electrical",
      equivalent: "Cu Cable 16 sqmm",
      keywords: "copper cable, 16 sqmm, frls",
    },
  },
  {
    id: "AI-2406",
    materialCode: "MAT-1006",
    originalName: "Industrial Valve DN-50 Cast Iron",
    potentialMatch: "Industrial Valve DN50",
    similarity: 88,
    confidence: "Medium",
    confidenceScore: 82,
    recommendation: "Needs manual check on valve body grade",
    original: {
      code: "MAT-1006",
      name: "Industrial Valve DN-50 Cast Iron",
      description: "Industrial gate valve DN50 with cast iron body",
      specification: "PN16",
      category: "Valves",
      manufacturer: "IndValve",
      unit: "Nos",
    },
    recommended: {
      name: "Industrial Valve DN50",
      description: "Industrial valve DN50, PN16, cast iron body",
      category: "Valves",
      equivalent: "Gate Valve DN50",
      keywords: "industrial valve, dn50, pn16",
    },
  },
  {
    id: "AI-2407",
    materialCode: "MAT-1007",
    originalName: "GI Sheet 2.0 mm",
    potentialMatch: "GI Sheet 2mm",
    similarity: 86,
    confidence: "Medium",
    confidenceScore: 78,
    recommendation: "Standardize decimal precision for thickness",
    original: {
      code: "MAT-1007",
      name: "GI Sheet 2.0 mm",
      description: "Galvanized iron sheet 2.0 mm thickness",
      specification: "IS 277",
      category: "Sheets",
      manufacturer: "Steelcraft",
      unit: "Kg",
    },
    recommended: {
      name: "GI Sheet 2mm",
      description: "Galvanized iron sheet, 2 mm thickness, IS 277",
      category: "Sheets",
      equivalent: "Galvanized Sheet 2 mm",
      keywords: "gi sheet, galvanized, 2mm",
    },
  },
  {
    id: "AI-2408",
    materialCode: "MAT-1008",
    originalName: "Steel Channel ISMC-100",
    potentialMatch: "Steel Channel ISMC100",
    similarity: 92,
    confidence: "High",
    confidenceScore: 92,
    recommendation: "Normalize code format and retain section standard",
    original: {
      code: "MAT-1008",
      name: "Steel Channel ISMC-100",
      description: "Structural steel channel ISMC 100 section",
      specification: "IS 808",
      category: "Structural Steel",
      manufacturer: "Bharat Steel",
      unit: "Meter",
    },
    recommended: {
      name: "Steel Channel ISMC100",
      description: "Structural steel channel section ISMC100, IS 808",
      category: "Structural Steel",
      equivalent: "ISMC 100 Channel",
      keywords: "steel channel, ismc100, structural",
    },
  },
];

const reviewData = [
  {
    id: "RV-501",
    material: "MS Hex Bolt M10",
    reviewer: "A. Kumar",
    confidence: "High",
    status: "Pending",
    updated: "27 Sep 2026, 10:22",
    auditTrail: [
      "Uploaded from CPSE-NTPC: 27 Sep 2026, 09:40",
      "AI tagged as duplicate candidate: 27 Sep 2026, 10:02",
      "Assigned to reviewer A. Kumar: 27 Sep 2026, 10:12",
    ],
  },
  {
    id: "RV-502",
    material: "Hex Nut SS304",
    reviewer: "S. Menon",
    confidence: "High",
    status: "Approved",
    updated: "27 Sep 2026, 09:56",
    auditTrail: [
      "AI recommendation generated with 95% confidence",
      "Reviewer S. Menon approved standard description",
      "Published to Unified Material Repository",
    ],
  },
  {
    id: "RV-503",
    material: "Industrial Valve DN50",
    reviewer: "R. Singh",
    confidence: "Medium",
    status: "Pending",
    updated: "27 Sep 2026, 10:31",
    auditTrail: [
      "Manufacturer data mismatch flagged",
      "Second-level review requested by reviewer R. Singh",
    ],
  },
  {
    id: "RV-504",
    material: "GI Sheet 2mm",
    reviewer: "P. Rao",
    confidence: "Medium",
    status: "Rejected",
    updated: "26 Sep 2026, 17:42",
    auditTrail: [
      "Description missing coating grade",
      "Rejected pending source data correction",
    ],
  },
  {
    id: "RV-505",
    material: "Copper Cable 16 sqmm",
    reviewer: "M. Iyer",
    confidence: "Medium",
    status: "Pending",
    updated: "27 Sep 2026, 10:44",
    auditTrail: [
      "AI suggested equivalent FRLS variant",
      "Awaiting insulation class confirmation",
    ],
  },
];

const repositoryData = [
  {
    materialCode: "UMR-0001",
    standardName: "MS Hex Bolt M10",
    category: "Fasteners",
    description: "Mild steel hex bolt, M10, zinc coated, IS 1363",
    equivalentMaterials: "MS Hex Bolt M10X50, Mild Steel Hex Bolt M10",
    status: "Active",
    confidence: 97,
    manufacturer: "ABC Industrial",
    unit: "Nos",
  },
  {
    materialCode: "UMR-0002",
    standardName: "Hex Nut SS304",
    category: "Fasteners",
    description: "Hex nut stainless steel SS304, M10, IS 1364",
    equivalentMaterials: "Hex Nut Stainless Steel 304 M10, SS304 Nut M10",
    status: "Active",
    confidence: 95,
    manufacturer: "Unimet",
    unit: "Nos",
  },
  {
    materialCode: "UMR-0003",
    standardName: "PVC Pipe 110mm",
    category: "Pipes",
    description: "PVC pressure pipe, 110 mm OD, PN6",
    equivalentMaterials: "PVC Pipe 110 MM PN6, PVC-U Pipe 110 mm PN6",
    status: "Active",
    confidence: 93,
    manufacturer: "Flowline",
    unit: "Meter",
  },
  {
    materialCode: "UMR-0004",
    standardName: "Bearing SKF6205",
    category: "Bearings",
    description: "Deep groove ball bearing SKF 6205, 25x52x15 mm",
    equivalentMaterials: "SKF 6205 Bearing, SKF Bearing 6205",
    status: "Active",
    confidence: 98,
    manufacturer: "SKF",
    unit: "Nos",
  },
  {
    materialCode: "UMR-0005",
    standardName: "Copper Cable 16 sqmm",
    category: "Electrical",
    description: "Copper electrical cable, 16 sq mm, FRLS grade",
    equivalentMaterials: "Copper Cable 16 sq.mm FRLS, Cu Cable 16 sqmm",
    status: "Under Review",
    confidence: 86,
    manufacturer: "Powermax",
    unit: "Meter",
  },
  {
    materialCode: "UMR-0006",
    standardName: "Industrial Valve DN50",
    category: "Valves",
    description: "Industrial valve DN50, PN16, cast iron body",
    equivalentMaterials: "Industrial Valve DN-50 Cast Iron, Gate Valve DN50",
    status: "Under Review",
    confidence: 82,
    manufacturer: "IndValve",
    unit: "Nos",
  },
  {
    materialCode: "UMR-0007",
    standardName: "GI Sheet 2mm",
    category: "Sheets",
    description: "Galvanized iron sheet, 2 mm thickness, IS 277",
    equivalentMaterials: "GI Sheet 2.0 mm, Galvanized Sheet 2 mm",
    status: "Active",
    confidence: 78,
    manufacturer: "Steelcraft",
    unit: "Kg",
  },
  {
    materialCode: "UMR-0008",
    standardName: "Steel Channel ISMC100",
    category: "Structural Steel",
    description: "Structural steel channel section ISMC100, IS 808",
    equivalentMaterials: "Steel Channel ISMC-100, ISMC 100 Channel",
    status: "Active",
    confidence: 92,
    manufacturer: "Bharat Steel",
    unit: "Meter",
  },
  {
    materialCode: "UMR-0009",
    standardName: "MS Hex Bolt M12",
    category: "Fasteners",
    description: "Mild steel hex bolt, M12, zinc coated",
    equivalentMaterials: "Mild Steel Bolt M12, Hex Bolt M12",
    status: "Active",
    confidence: 89,
    manufacturer: "ABC Industrial",
    unit: "Nos",
  },
  {
    materialCode: "UMR-0010",
    standardName: "PVC Pipe 90mm",
    category: "Pipes",
    description: "PVC pressure pipe, 90 mm OD, PN6",
    equivalentMaterials: "PVC Pipe 90 MM PN6",
    status: "Active",
    confidence: 87,
    manufacturer: "Flowline",
    unit: "Meter",
  },
  {
    materialCode: "UMR-0011",
    standardName: "Bearing 6204",
    category: "Bearings",
    description: "Deep groove ball bearing 6204",
    equivalentMaterials: "Ball Bearing 6204",
    status: "Active",
    confidence: 85,
    manufacturer: "SKF",
    unit: "Nos",
  },
  {
    materialCode: "UMR-0012",
    standardName: "Copper Cable 25 sqmm",
    category: "Electrical",
    description: "Copper cable 25 sq mm conductor, FRLS",
    equivalentMaterials: "Cu Cable 25 sqmm",
    status: "Under Review",
    confidence: 76,
    manufacturer: "Powermax",
    unit: "Meter",
  },
];

const dom = {};

function initDomReferences() {
  dom.loginScreen = document.getElementById("login-screen");
  dom.platformShell = document.getElementById("platform-shell");
  dom.loginForm = document.getElementById("loginForm");
  dom.ssoLoginBtn = document.getElementById("ssoLoginBtn");
  dom.logoutBtn = document.getElementById("logoutBtn");
  dom.screenTitle = document.getElementById("screenTitle");
  dom.screenSubtitle = document.getElementById("screenSubtitle");
  dom.navButtons = Array.from(document.querySelectorAll(".nav-item"));
  dom.uploadCta = document.querySelector(".upload-cta");
  dom.screenSections = Array.from(document.querySelectorAll(".module-screen"));
  dom.flowSteps = Array.from(document.querySelectorAll(".flow-step"));
  dom.quickActions = Array.from(document.querySelectorAll(".quick-action"));

  dom.dropzone = document.getElementById("dropzone");
  dom.uploadFileInput = document.getElementById("uploadFileInput");
  dom.chooseFileBtn = document.getElementById("chooseFileBtn");
  dom.useDummyFileBtn = document.getElementById("useDummyFileBtn");
  dom.selectedFileName = document.getElementById("selectedFileName");
  dom.validateFileBtn = document.getElementById("validateFileBtn");
  dom.startAnalysisBtn = document.getElementById("startAnalysisBtn");
  dom.uploadRows = document.getElementById("uploadRows");
  dom.uploadColumns = document.getElementById("uploadColumns");
  dom.uploadFields = document.getElementById("uploadFields");
  dom.uploadValidationLabel = document.getElementById("uploadValidationLabel");
  dom.uploadValidationProgress = document.getElementById("uploadValidationProgress");

  dom.runAnalysisBtn = document.getElementById("runAnalysisBtn");
  dom.analysisProgressBar = document.getElementById("analysisProgressBar");
  dom.analysisProgressPercent = document.getElementById("analysisProgressPercent");
  dom.processingRing = document.getElementById("processingRing");
  dom.metricProcessed = document.getElementById("metricProcessed");
  dom.metricDuplicate = document.getElementById("metricDuplicate");
  dom.metricNearDuplicate = document.getElementById("metricNearDuplicate");
  dom.metricEquivalent = document.getElementById("metricEquivalent");
  dom.analysisTableBody = document.getElementById("analysisTableBody");

  dom.standardRecordTitle = document.getElementById("standardRecordTitle");
  dom.standardRecordSub = document.getElementById("standardRecordSub");
  dom.differenceSummary = document.getElementById("differenceSummary");
  dom.approveStandardBtn = document.getElementById("approveStandardBtn");
  dom.modifyStandardBtn = document.getElementById("modifyStandardBtn");
  dom.rejectStandardBtn = document.getElementById("rejectStandardBtn");
  dom.saveStandardBtn = document.getElementById("saveStandardBtn");

  dom.reviewSearchInput = document.getElementById("reviewSearchInput");
  dom.reviewStatusFilter = document.getElementById("reviewStatusFilter");
  dom.reviewConfidenceFilter = document.getElementById("reviewConfidenceFilter");
  dom.reviewTableBody = document.getElementById("reviewTableBody");
  dom.pendingCount = document.getElementById("pendingCount");
  dom.approvedCount = document.getElementById("approvedCount");
  dom.rejectedCount = document.getElementById("rejectedCount");
  dom.auditTrailList = document.getElementById("auditTrailList");

  dom.repoSearch = document.getElementById("repoSearch");
  dom.searchSuggestions = document.getElementById("searchSuggestions");
  dom.toggleAdvancedFilters = document.getElementById("toggleAdvancedFilters");
  dom.advancedFilterPanel = document.getElementById("advancedFilterPanel");
  dom.repoCategoryFilter = document.getElementById("repoCategoryFilter");
  dom.repoStatusFilter = document.getElementById("repoStatusFilter");
  dom.repoConfidenceFilter = document.getElementById("repoConfidenceFilter");
  dom.repositoryTableBody = document.getElementById("repositoryTableBody");
  dom.repositoryHeaders = Array.from(document.querySelectorAll("#repositoryTable .sortable"));
  dom.exportRepositoryBtn = document.getElementById("exportRepositoryBtn");

  dom.overlayBackdrop = document.getElementById("overlayBackdrop");
  dom.materialProfileDrawer = document.getElementById("materialProfileDrawer");
  dom.drawerContent = document.getElementById("drawerContent");
  dom.closeDrawerBtn = document.getElementById("closeDrawerBtn");
}

export function initPrototype() {
  if (state.initialized) {
    return cleanupPrototype;
  }

  initDomReferences();
  if (!dom.loginForm || !dom.platformShell) {
    return undefined;
  }

  bindAuthentication();
  bindNavigation();
  bindUploadWorkflow();
  bindAnalysisWorkflow();
  bindStandardizationWorkflow();
  bindReviewWorkflow();
  bindRepositoryWorkflow();
  bindDrawerControls();

  renderAnalysisTable();
  populateRepositoryCategoryFilter();
  renderReviewTable();
  updateReviewSummary();
  renderRepositoryTable();

  state.initialized = true;
  return cleanupPrototype;
}

function cleanupPrototype() {
  if (state.analysisTimer) {
    window.clearInterval(state.analysisTimer);
    state.analysisTimer = null;
  }

  Object.values(state.charts).forEach((chart) => {
    if (chart && typeof chart.destroy === "function") {
      chart.destroy();
    }
  });

  state.charts = {};
  state.initialized = false;
}

function bindAuthentication() {
  dom.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    enterPlatform();
  });

  dom.ssoLoginBtn.addEventListener("click", () => {
    enterPlatform();
  });

  dom.logoutBtn.addEventListener("click", () => {
    exitPlatform();
  });
}

function enterPlatform() {
  dom.loginScreen.classList.add("hidden");
  dom.platformShell.classList.remove("hidden");
  showScreen("dashboard");
}

function exitPlatform() {
  dom.platformShell.classList.add("hidden");
  dom.loginScreen.classList.remove("hidden");
}

function bindNavigation() {
  [...dom.navButtons, dom.uploadCta].forEach((button) => {
    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      const screen = button.dataset.screen;
      if (screen) {
        showScreen(screen);
      }
    });
  });

  dom.quickActions.forEach((button) => {
    button.addEventListener("click", () => {
      const screen = button.dataset.go;
      if (screen) {
        showScreen(screen);
      }
    });
  });
}

function showScreen(screenId) {
  const target = document.getElementById(screenId);
  if (!target) {
    return;
  }

  state.currentScreen = screenId;

  dom.screenSections.forEach((section) => {
    section.classList.toggle("active", section.id === screenId);
  });

  dom.navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === screenId);
  });

  if (dom.uploadCta) {
    dom.uploadCta.classList.toggle("active", screenId === "upload-data");
  }

  if (target.dataset.title) {
    dom.screenTitle.textContent = target.dataset.title;
  }

  if (target.dataset.subtitle) {
    dom.screenSubtitle.textContent = target.dataset.subtitle;
  }

  updateWorkflowSteps(screenId);
  animateStaggerItems(target);
  animateCountersIn(target);

  if (screenId === "dashboard") {
    initDashboardCharts();
  }

  if (screenId === "analytics") {
    initAnalyticsCharts();
  }

  if (screenId === "standardization" && !state.selectedStandardRecordId) {
    loadStandardizationRecord(analysisData[0]);
  }
}

function updateWorkflowSteps(screenId) {
  const stepMap = {
    "upload-data": 2,
    "ai-analysis": 5,
    "review-queue": 6,
    standardization: 7,
    "material-repository": 8,
    analytics: 9,
  };

  const current = stepMap[screenId] || 0;

  dom.flowSteps.forEach((step, index) => {
    step.classList.remove("active", "completed");
    if (current === 0) {
      return;
    }

    const position = index + 1;
    if (position < current) {
      step.classList.add("completed");
    } else if (position === current) {
      step.classList.add("active");
    }
  });
}

function animateStaggerItems(screen) {
  const items = Array.from(screen.querySelectorAll(".stagger-item"));
  items.forEach((item) => item.classList.remove("visible"));

  items.forEach((item, index) => {
    window.setTimeout(() => {
      item.classList.add("visible");
    }, 60 * (index + 1));
  });
}

function animateCountersIn(screen) {
  const counters = Array.from(screen.querySelectorAll("[data-counter-target]"));
  counters.forEach((counter) => {
    const target = Number(counter.dataset.counterTarget);
    const format = counter.dataset.counterFormat || "number";
    animateCounterElement(counter, target, format, 860);
  });
}

function animateCounterElement(element, target, format, duration) {
  const start = 0;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = start + (target - start) * eased;
    element.textContent = formatCounter(value, format);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = formatCounter(target, format);
    }
  }

  requestAnimationFrame(tick);
}

function formatCounter(value, format) {
  if (format === "percent") {
    return `${value.toFixed(1)}%`;
  }

  return Math.round(value).toLocaleString("en-IN");
}

function bindUploadWorkflow() {
  dom.chooseFileBtn.addEventListener("click", () => {
    dom.uploadFileInput.click();
  });

  if (dom.useDummyFileBtn) {
    dom.useDummyFileBtn.addEventListener("click", () => {
      const dummyCsvContent = [
        "Material Code,Name,Description,Specification,Category,Manufacturer,Unit",
        "MAT-1001,MS Hex Bolt M10,Mild steel hex bolt M10 x 50 mm zinc coated,Grade 4.6 | IS 1363,Fasteners,ABC Industrial,Nos",
        "MAT-1002,Hex Nut SS304,Stainless steel hex nut grade SS304 M10,SS304 | IS 1364,Fasteners,Unimet,Nos",
        "MAT-1003,PVC Pipe 110mm,PVC pressure pipe 110 mm outer diameter,PVC-U | PN6,Pipes,Flowline,Meter",
        "MAT-1004,Bearing SKF6205,Deep groove ball bearing SKF 6205,25x52x15 mm,Bearings,SKF,Nos",
      ].join("\n");

      const dummyFile = new File([dummyCsvContent], "dummy-material-upload.csv", {
        type: "text/csv",
      });

      applySelectedFile(dummyFile);
      dom.uploadValidationLabel.textContent = "Dummy file ready for validation";
    });
  }

  dom.uploadFileInput.addEventListener("change", () => {
    const file = dom.uploadFileInput.files[0];
    if (file) {
      applySelectedFile(file);
    }
  });

  dom.dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dom.dropzone.classList.add("active");
  });

  dom.dropzone.addEventListener("dragleave", () => {
    dom.dropzone.classList.remove("active");
  });

  dom.dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dom.dropzone.classList.remove("active");
    const file = event.dataTransfer.files[0];
    if (file) {
      applySelectedFile(file);
    }
  });

  dom.validateFileBtn.addEventListener("click", () => {
    if (!state.uploadedFile) {
      dom.uploadValidationLabel.textContent = "Select file first";
      return;
    }

    validateUploadedFile();
  });

  dom.startAnalysisBtn.addEventListener("click", () => {
    showScreen("ai-analysis");
    runAnalysisSimulation();
  });
}

function applySelectedFile(file) {
  state.uploadedFile = file;
  dom.selectedFileName.textContent = `Selected: ${file.name}`;
  dom.uploadValidationLabel.textContent = "Ready for validation";
  dom.uploadValidationProgress.style.width = "0%";
  dom.startAnalysisBtn.disabled = true;

  const baseRows = 1300 + Math.floor(Math.random() * 1800);
  const baseColumns = 10 + Math.floor(Math.random() * 5);
  const detectedFields = 8 + Math.floor(Math.random() * 5);

  dom.uploadRows.textContent = baseRows.toLocaleString("en-IN");
  dom.uploadColumns.textContent = String(baseColumns);
  dom.uploadFields.textContent = String(detectedFields);
}

function validateUploadedFile() {
  dom.validateFileBtn.disabled = true;
  dom.uploadValidationLabel.textContent = "Validation in progress";
  let progress = 0;

  const timer = window.setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 8;
    if (progress > 100) {
      progress = 100;
    }

    dom.uploadValidationProgress.style.width = `${progress}%`;

    if (progress === 100) {
      window.clearInterval(timer);
      dom.uploadValidationLabel.textContent = "Validated: 0 critical errors";
      dom.startAnalysisBtn.disabled = false;
      dom.validateFileBtn.disabled = false;
    }
  }, 120);
}

function bindAnalysisWorkflow() {
  dom.runAnalysisBtn.addEventListener("click", () => {
    runAnalysisSimulation();
  });

  dom.analysisTableBody.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-ai-action]");
    if (!trigger) {
      return;
    }

    const action = trigger.dataset.aiAction;
    const id = trigger.dataset.id;
    const record = analysisData.find((item) => item.id === id);
    if (!record) {
      return;
    }

    if (action === "view") {
      loadStandardizationRecord(record);
      showScreen("standardization");
      return;
    }

    if (action === "review") {
      showScreen("review-queue");
      return;
    }

    if (action === "accept") {
      record.recommendation = "Accepted for standardization";
      record.confidence = "High";
      renderAnalysisTable();
      return;
    }

    if (action === "reject") {
      record.recommendation = "Rejected; requires manual material profiling";
      record.confidence = "Low";
      renderAnalysisTable();
    }
  });
}

function runAnalysisSimulation() {
  if (state.analysisTimer) {
    window.clearInterval(state.analysisTimer);
  }

  dom.runAnalysisBtn.disabled = true;
  dom.runAnalysisBtn.textContent = "Processing";

  let progress = 0;
  setAnalysisProgress(progress);
  setAnalysisMetricValues(0);

  state.analysisTimer = window.setInterval(() => {
    progress += Math.floor(Math.random() * 7) + 3;
    if (progress > 100) {
      progress = 100;
    }

    setAnalysisProgress(progress);
    setAnalysisMetricValues(progress);

    if (progress === 100) {
      window.clearInterval(state.analysisTimer);
      state.analysisTimer = null;
      dom.runAnalysisBtn.disabled = false;
      dom.runAnalysisBtn.textContent = "Run AI Analysis";
    }
  }, 140);
}

function setAnalysisProgress(percent) {
  dom.analysisProgressBar.style.width = `${percent}%`;
  dom.analysisProgressPercent.textContent = `${percent}%`;
  dom.processingRing.style.setProperty("--progress", `${percent * 3.6}deg`);
}

function setAnalysisMetricValues(percent) {
  const fraction = percent / 100;
  dom.metricProcessed.textContent = Math.round(2400 * fraction).toLocaleString("en-IN");
  dom.metricDuplicate.textContent = Math.round(182 * fraction).toLocaleString("en-IN");
  dom.metricNearDuplicate.textContent = Math.round(139 * fraction).toLocaleString("en-IN");
  dom.metricEquivalent.textContent = Math.round(74 * fraction).toLocaleString("en-IN");
}

function renderAnalysisTable() {
  const rows = analysisData
    .map((record) => {
      return `
        <tr>
          <td>${record.id}</td>
          <td><strong>${record.originalName}</strong><br><span class="small-muted">${record.materialCode}</span></td>
          <td>${record.potentialMatch}</td>
          <td>
            <div class="score-wrap">
              <strong>${record.similarity}%</strong>
              <div class="score-bar"><span style="width:${record.similarity}%"></span></div>
            </div>
          </td>
          <td><span class="badge ${confidenceBadgeClass(record.confidence)}">${record.confidence}</span></td>
          <td>${record.recommendation}</td>
          <td>
            <div class="table-action-group">
              <button class="link-button" data-ai-action="view" data-id="${record.id}">View Comparison</button>
              <button class="link-button" data-ai-action="review" data-id="${record.id}">Review</button>
              <button class="link-button" data-ai-action="accept" data-id="${record.id}">Accept</button>
              <button class="link-button" data-ai-action="reject" data-id="${record.id}">Reject</button>
            </div>
          </td>
        </tr>`;
    })
    .join("");

  dom.analysisTableBody.innerHTML = rows;
}

function confidenceBadgeClass(confidence) {
  if (confidence === "High") {
    return "badge-high";
  }

  if (confidence === "Medium") {
    return "badge-medium";
  }

  return "badge-low";
}

function bindStandardizationWorkflow() {
  dom.approveStandardBtn.addEventListener("click", () => {
    dom.differenceSummary.textContent = "Recommendation approved. Final validation can now be saved into the unified repository.";
  });

  dom.modifyStandardBtn.addEventListener("click", () => {
    dom.differenceSummary.textContent = "Review mode enabled. Adjust description or category before final save.";
  });

  dom.rejectStandardBtn.addEventListener("click", () => {
    dom.differenceSummary.textContent = "Recommendation rejected. Record moved to manual material profiling queue.";
  });

  dom.saveStandardBtn.addEventListener("click", () => {
    dom.differenceSummary.textContent = "Standard material saved successfully into Unified Material Repository.";
    showScreen("material-repository");
  });
}

function loadStandardizationRecord(record) {
  state.selectedStandardRecordId = record.id;
  dom.standardRecordTitle.textContent = `Standardization Workspace | ${record.id}`;
  dom.standardRecordSub.textContent = `Comparing source material ${record.materialCode} with AI recommendation`;

  setFieldValue("origCode", record.original.code);
  setFieldValue("origName", record.original.name);
  setFieldValue("origDescription", record.original.description);
  setFieldValue("origSpec", record.original.specification);
  setFieldValue("origCategory", record.original.category);
  setFieldValue("origManufacturer", record.original.manufacturer);
  setFieldValue("origUnit", record.original.unit);

  setFieldValue("recName", record.recommended.name);
  setFieldValue("recDescription", record.recommended.description);
  setFieldValue("recCategory", record.recommended.category);
  setFieldValue("recEquivalent", record.recommended.equivalent);
  setFieldValue("recKeywords", record.recommended.keywords);
  setFieldValue("recConfidence", `${record.confidence} (${record.confidenceScore}%)`);

  const diffHighlights = [
    `Name normalized from "${record.original.name}" to "${record.recommended.name}"`,
    `Description enriched with standard attributes and compliance markers`,
    `Equivalent material terms mapped for semantic search and duplicate detection`,
  ];

  dom.differenceSummary.textContent = diffHighlights.join(" | ");
}

function setFieldValue(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}

function bindReviewWorkflow() {
  const refreshReviewView = () => {
    renderReviewTable();
    updateReviewSummary();
  };

  dom.reviewSearchInput.addEventListener("input", refreshReviewView);
  dom.reviewStatusFilter.addEventListener("change", refreshReviewView);
  dom.reviewConfidenceFilter.addEventListener("change", refreshReviewView);

  dom.reviewTableBody.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-review-action]");
    if (!trigger) {
      return;
    }

    const action = trigger.dataset.reviewAction;
    const id = trigger.dataset.id;
    const item = reviewData.find((entry) => entry.id === id);
    if (!item) {
      return;
    }

    if (action === "approve") {
      item.status = "Approved";
      item.updated = "27 Sep 2026, 11:04";
      item.auditTrail.push("Record approved and queued for repository publish");
      refreshReviewView();
      renderAuditTrail(item);
      return;
    }

    if (action === "reject") {
      item.status = "Rejected";
      item.updated = "27 Sep 2026, 11:05";
      item.auditTrail.push("Record rejected due to unresolved specification mismatch");
      refreshReviewView();
      renderAuditTrail(item);
      return;
    }

    if (action === "details") {
      renderAuditTrail(item);
    }
  });
}

function getFilteredReviewData() {
  const query = dom.reviewSearchInput.value.trim().toLowerCase();
  const status = dom.reviewStatusFilter.value;
  const confidence = dom.reviewConfidenceFilter.value;

  return reviewData.filter((item) => {
    const matchQuery =
      query.length === 0 ||
      item.material.toLowerCase().includes(query) ||
      item.reviewer.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query);

    const matchStatus = status === "all" || item.status === status;
    const matchConfidence = confidence === "all" || item.confidence === confidence;

    return matchQuery && matchStatus && matchConfidence;
  });
}

function renderReviewTable() {
  const data = getFilteredReviewData();

  if (data.length === 0) {
    dom.reviewTableBody.innerHTML = `<tr><td colspan="6">No records match current filters.</td></tr>`;
    return;
  }

  dom.reviewTableBody.innerHTML = data
    .map((item) => {
      return `
      <tr>
        <td><strong>${item.material}</strong><br><span class="small-muted">${item.id}</span></td>
        <td>${item.reviewer}</td>
        <td><span class="badge ${confidenceBadgeClass(item.confidence)}">${item.confidence}</span></td>
        <td>${statusBadge(item.status)}</td>
        <td>${item.updated}</td>
        <td>
          <div class="table-action-group">
            <button class="link-button" data-review-action="approve" data-id="${item.id}">Approve</button>
            <button class="link-button" data-review-action="reject" data-id="${item.id}">Reject</button>
            <button class="link-button" data-review-action="details" data-id="${item.id}">Open Details</button>
          </div>
        </td>
      </tr>`;
    })
    .join("");
}

function updateReviewSummary() {
  const pending = reviewData.filter((item) => item.status === "Pending").length;
  const approved = reviewData.filter((item) => item.status === "Approved").length;
  const rejected = reviewData.filter((item) => item.status === "Rejected").length;

  dom.pendingCount.textContent = pending.toLocaleString("en-IN");
  dom.approvedCount.textContent = approved.toLocaleString("en-IN");
  dom.rejectedCount.textContent = rejected.toLocaleString("en-IN");
}

function renderAuditTrail(item) {
  dom.auditTrailList.innerHTML = item.auditTrail.map((entry) => `<li>${entry}</li>`).join("");
}

function statusBadge(status) {
  if (status === "Active") {
    return `<span class="badge badge-success">Active</span>`;
  }

  if (status === "Under Review") {
    return `<span class="badge badge-warning">Under Review</span>`;
  }

  if (status === "Approved") {
    return `<span class="badge badge-success">Approved</span>`;
  }

  if (status === "Rejected") {
    return `<span class="badge badge-danger">Rejected</span>`;
  }

  return `<span class="badge badge-warning">Pending</span>`;
}

function bindRepositoryWorkflow() {
  dom.repoSearch.addEventListener("input", () => {
    renderRepositoryTable();
    renderSearchSuggestions();
  });

  dom.repoSearch.addEventListener("keydown", (event) => {
    const maxIndex = state.currentSuggestions.length - 1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      state.suggestionIndex = Math.min(maxIndex, state.suggestionIndex + 1);
      highlightSuggestion();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      state.suggestionIndex = Math.max(-1, state.suggestionIndex - 1);
      highlightSuggestion();
      return;
    }

    if (event.key === "Enter" && state.suggestionIndex >= 0) {
      event.preventDefault();
      dom.repoSearch.value = state.currentSuggestions[state.suggestionIndex];
      hideSuggestions();
      renderRepositoryTable();
    }
  });

  dom.repoSearch.addEventListener("blur", () => {
    window.setTimeout(() => hideSuggestions(), 120);
  });

  [dom.repoCategoryFilter, dom.repoStatusFilter, dom.repoConfidenceFilter].forEach((select) => {
    select.addEventListener("change", () => {
      renderRepositoryTable();
    });
  });

  dom.repositoryHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const key = header.dataset.sortKey;
      if (!key) {
        return;
      }

      if (state.repoSort.key === key) {
        state.repoSort.direction = state.repoSort.direction === "asc" ? "desc" : "asc";
      } else {
        state.repoSort.key = key;
        state.repoSort.direction = "asc";
      }

      updateSortHeaderStyles();
      renderRepositoryTable();
    });
  });

  dom.repositoryTableBody.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-profile-code]");
    if (!trigger) {
      return;
    }

    const code = trigger.dataset.profileCode;
    const record = repositoryData.find((item) => item.materialCode === code);
    if (record) {
      openMaterialProfile(record);
    }
  });

  dom.toggleAdvancedFilters.addEventListener("click", () => {
    dom.advancedFilterPanel.classList.toggle("hidden");
  });

  dom.exportRepositoryBtn.addEventListener("click", () => {
    exportRepositoryCsv();
  });

  updateSortHeaderStyles();
}

function populateRepositoryCategoryFilter() {
  const categories = Array.from(new Set(repositoryData.map((item) => item.category))).sort((a, b) => a.localeCompare(b));
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    dom.repoCategoryFilter.appendChild(option);
  });
}

function getRepositoryViewData() {
  const query = dom.repoSearch.value.trim().toLowerCase();
  const category = dom.repoCategoryFilter.value;
  const status = dom.repoStatusFilter.value;
  const confidenceLimit = dom.repoConfidenceFilter.value;

  let rows = repositoryData.filter((item) => {
    const matchQuery =
      query.length === 0 ||
      item.materialCode.toLowerCase().includes(query) ||
      item.standardName.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    const matchCategory = category === "all" || item.category === category;
    const matchStatus = status === "all" || item.status === status;
    const matchConfidence = confidenceLimit === "all" || item.confidence >= Number(confidenceLimit);

    return matchQuery && matchCategory && matchStatus && matchConfidence;
  });

  rows = rows.sort((a, b) => {
    const key = state.repoSort.key;
    const dir = state.repoSort.direction === "asc" ? 1 : -1;

    const valueA = a[key];
    const valueB = b[key];

    if (typeof valueA === "number" && typeof valueB === "number") {
      return (valueA - valueB) * dir;
    }

    return String(valueA).localeCompare(String(valueB)) * dir;
  });

  return rows;
}

function renderRepositoryTable() {
  const rows = getRepositoryViewData();

  if (rows.length === 0) {
    dom.repositoryTableBody.innerHTML = `<tr><td colspan="7">No materials found for selected criteria.</td></tr>`;
    return;
  }

  dom.repositoryTableBody.innerHTML = rows
    .map((item) => {
      return `
      <tr>
        <td>${item.materialCode}</td>
        <td><strong>${item.standardName}</strong></td>
        <td>${item.category}</td>
        <td>${item.description}</td>
        <td>${item.equivalentMaterials}</td>
        <td>${statusBadge(item.status)}</td>
        <td><button class="link-button" data-profile-code="${item.materialCode}">View Details</button></td>
      </tr>`;
    })
    .join("");
}

function updateSortHeaderStyles() {
  dom.repositoryHeaders.forEach((header) => {
    header.classList.remove("sorted-asc", "sorted-desc");
    if (header.dataset.sortKey === state.repoSort.key) {
      header.classList.add(state.repoSort.direction === "asc" ? "sorted-asc" : "sorted-desc");
    }
  });
}

function renderSearchSuggestions() {
  const query = dom.repoSearch.value.trim().toLowerCase();
  if (!query) {
    hideSuggestions();
    return;
  }

  const suggestionPool = repositoryData.flatMap((item) => [item.standardName, item.materialCode]);
  const unique = Array.from(new Set(suggestionPool));

  state.currentSuggestions = unique
    .filter((value) => value.toLowerCase().includes(query))
    .slice(0, 6);

  if (state.currentSuggestions.length === 0) {
    hideSuggestions();
    return;
  }

  state.suggestionIndex = -1;
  dom.searchSuggestions.innerHTML = state.currentSuggestions
    .map((value) => `<div class="suggestion-item" data-suggestion-value="${value}">${value}</div>`)
    .join("");

  dom.searchSuggestions.classList.remove("hidden");

  dom.searchSuggestions.querySelectorAll(".suggestion-item").forEach((item) => {
    item.addEventListener("mousedown", () => {
      dom.repoSearch.value = item.dataset.suggestionValue;
      hideSuggestions();
      renderRepositoryTable();
    });
  });
}

function highlightSuggestion() {
  const suggestionElements = Array.from(dom.searchSuggestions.querySelectorAll(".suggestion-item"));
  suggestionElements.forEach((item, index) => {
    item.classList.toggle("active", index === state.suggestionIndex);
  });
}

function hideSuggestions() {
  state.currentSuggestions = [];
  state.suggestionIndex = -1;
  dom.searchSuggestions.classList.add("hidden");
  dom.searchSuggestions.innerHTML = "";
}

function exportRepositoryCsv() {
  const rows = getRepositoryViewData();
  const headers = [
    "Material Code",
    "Standard Name",
    "Category",
    "Description",
    "Equivalent Materials",
    "Status",
    "Confidence",
  ];

  const csvBody = rows.map((row) => {
    return [
      row.materialCode,
      row.standardName,
      row.category,
      row.description,
      row.equivalentMaterials,
      row.status,
      `${row.confidence}%`,
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(",");
  });

  const csv = [headers.join(","), ...csvBody].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "bharat-material-repository.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function bindDrawerControls() {
  dom.closeDrawerBtn.addEventListener("click", closeMaterialProfile);
  dom.overlayBackdrop.addEventListener("click", closeMaterialProfile);
}

function openMaterialProfile(record) {
  dom.drawerContent.innerHTML = `
    <div class="field-row"><span>Material Code</span><strong>${record.materialCode}</strong></div>
    <div class="field-row"><span>Standard Name</span><strong>${record.standardName}</strong></div>
    <div class="field-row"><span>Category</span><strong>${record.category}</strong></div>
    <div class="field-row"><span>Description</span><strong>${record.description}</strong></div>
    <div class="field-row"><span>Equivalent Materials</span><strong>${record.equivalentMaterials}</strong></div>
    <div class="field-row"><span>Manufacturer</span><strong>${record.manufacturer}</strong></div>
    <div class="field-row"><span>Unit</span><strong>${record.unit}</strong></div>
    <div class="field-row"><span>Status</span><strong>${record.status}</strong></div>
    <div class="field-row"><span>AI Confidence</span><strong>${record.confidence}%</strong></div>
  `;

  dom.overlayBackdrop.classList.remove("hidden");
  dom.materialProfileDrawer.classList.remove("hidden");
}

function closeMaterialProfile() {
  dom.overlayBackdrop.classList.add("hidden");
  dom.materialProfileDrawer.classList.add("hidden");
}

function initDashboardCharts() {
  if (state.charts.dashboardReady || typeof Chart === "undefined") {
    return;
  }

  state.charts.categories = new Chart(document.getElementById("categoriesChart"), {
    type: "doughnut",
    data: {
      labels: ["Fasteners", "Pipes", "Electrical", "Bearings", "Structural"],
      datasets: [
        {
          data: [32, 18, 17, 14, 19],
          backgroundColor: ["#2f82e9", "#4d96ea", "#79b1ef", "#18a57f", "#1457a6"],
          borderWidth: 0,
        },
      ],
    },
    options: chartOptions({ legendPosition: "bottom" }),
  });

  state.charts.duplicateTrend = new Chart(document.getElementById("duplicateTrendChart"), {
    type: "line",
    data: {
      labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      datasets: [
        {
          label: "Duplicate Candidates",
          data: [410, 380, 350, 322, 276, 244],
          borderColor: "#2f82e9",
          backgroundColor: "rgba(47, 130, 233, 0.16)",
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        },
      ],
    },
    options: chartOptions(),
  });

  state.charts.processingStatus = new Chart(document.getElementById("processingStatusChart"), {
    type: "bar",
    data: {
      labels: ["Validated", "In Analysis", "Pending Review", "Standardized"],
      datasets: [
        {
          data: [68, 21, 34, 57],
          backgroundColor: ["#1457a6", "#2f82e9", "#8fbef5", "#18a57f"],
          borderRadius: 8,
        },
      ],
    },
    options: chartOptions({
      legend: false,
      yBeginAtZero: true,
    }),
  });

  state.charts.dashboardReady = true;
}

function initAnalyticsCharts() {
  if (state.charts.analyticsReady || typeof Chart === "undefined") {
    return;
  }

  state.charts.duplicateReduction = new Chart(document.getElementById("duplicateReductionChart"), {
    type: "line",
    data: {
      labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      datasets: [
        {
          label: "Duplicates Removed",
          data: [3200, 3650, 4020, 4610, 4970, 5390],
          borderColor: "#18886a",
          backgroundColor: "rgba(24, 136, 106, 0.2)",
          fill: true,
          tension: 0.35,
        },
      ],
    },
    options: chartOptions(),
  });

  state.charts.categoryDistribution = new Chart(document.getElementById("categoryDistributionChart"), {
    type: "pie",
    data: {
      labels: ["Fasteners", "Electrical", "Pipes", "Valves", "Structural"],
      datasets: [
        {
          data: [36, 18, 16, 12, 18],
          backgroundColor: ["#2f82e9", "#5c9eee", "#86b9f2", "#1d6fd2", "#18a57f"],
          borderWidth: 0,
        },
      ],
    },
    options: chartOptions({ legendPosition: "bottom" }),
  });

  state.charts.monthlyProcessing = new Chart(document.getElementById("monthlyProcessingChart"), {
    type: "bar",
    data: {
      labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      datasets: [
        {
          label: "Materials Processed",
          data: [21100, 22800, 24100, 29200, 31100, 38400],
          backgroundColor: "#2f82e9",
          borderRadius: 8,
        },
      ],
    },
    options: chartOptions({ yBeginAtZero: true }),
  });

  state.charts.accuracy = new Chart(document.getElementById("accuracyChart"), {
    type: "line",
    data: {
      labels: ["Model v1", "Model v2", "Model v3", "Current"],
      datasets: [
        {
          label: "AI Accuracy",
          data: [86.2, 89.7, 92.8, 94.7],
          borderColor: "#1457a6",
          backgroundColor: "rgba(20, 87, 166, 0.2)",
          fill: true,
          tension: 0.35,
        },
      ],
    },
    options: chartOptions(),
  });

  state.charts.growth = new Chart(document.getElementById("growthChart"), {
    type: "line",
    data: {
      labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      datasets: [
        {
          label: "Repository Size",
          data: [62000, 70100, 78900, 86200, 94800, 102938],
          borderColor: "#18a57f",
          backgroundColor: "rgba(24, 136, 106, 0.16)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: chartOptions({
      yBeginAtZero: false,
    }),
  });

  state.charts.analyticsReady = true;
}

function chartOptions(config = {}) {
  const legendEnabled = config.legend !== false;

  return {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: legendEnabled,
        position: config.legendPosition || "top",
        labels: {
          boxWidth: 12,
          color: "#35506f",
          font: {
            family: "IBM Plex Sans",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(20, 46, 81, 0.95)",
      },
    },
    scales:
      config.legendPosition === "bottom" || config.type === "doughnut"
        ? undefined
        : {
            x: {
              grid: {
                color: "rgba(184, 201, 220, 0.25)",
              },
              ticks: {
                color: "#4f6b88",
              },
            },
            y: {
              beginAtZero: config.yBeginAtZero !== false,
              grid: {
                color: "rgba(184, 201, 220, 0.25)",
              },
              ticks: {
                color: "#4f6b88",
              },
            },
          },
  };
}
