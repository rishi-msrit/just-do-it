/**
 * Just Do It - Global Javascript Library
 */

document.addEventListener('DOMContentLoaded', () => {
  initFavicon();
  initThemeToggle();
  initRefreshWarning();
  initHowToOverlay();
  initStruggleSelector();
  initDynamicListRowHandlers();
  initAutoSave();
  initCopyMarkdownButton();
  initClearButton();
});

/* 1. Dynamic Favicon System (Vector SVG Data URL) */
function initFavicon() {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    document.head.appendChild(link);
  }
  // Cool charcoal block with gold checkmark vector icon
  link.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23141618'/><path d='M30 52 l14 14 l28 -28' stroke='%23E2C092' stroke-width='10' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>";
}

/* 2. Theme Toggle System (Dynamically injected to header) */
function initThemeToggle() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  const toggleLi = document.createElement('li');
  toggleLi.className = 'theme-toggle-li';
  toggleLi.innerHTML = `
    <button id="theme-toggle" class="btn-icon" title="Toggle dark mode" style="margin-left: 0.5rem; display: inline-flex; align-items: center; justify-content: center; height: 100%;">
      <!-- Sun icon (for dark mode -> light) -->
      <svg id="sun-icon" viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; display: none;">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <!-- Moon icon (for light mode -> dark) -->
      <svg id="moon-icon" viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2;">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  `;
  navLinks.appendChild(toggleLi);

  const themeBtn = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  const currentTheme = localStorage.getItem('theme') || 'light';
  setTheme(currentTheme);

  themeBtn.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(theme);
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }
}

/* 3. Refresh Warning (Fires only on tool pages) */
function initRefreshWarning() {
  const isToolPage = window.location.pathname.includes('/tools/');
  if (isToolPage) {
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      e.returnValue = '';
    });
  }
}

/* 4. How-To Overlay System */
function initHowToOverlay() {
  const overlay = document.querySelector('.howto-overlay');
  const trigger = document.querySelector('.howto-trigger');
  const closeBtn = document.querySelector('.howto-close-btn');

  if (!overlay) return;

  // Always pop up guide on page load
  overlay.classList.add('show');

  if (trigger) {
    trigger.addEventListener('click', () => {
      overlay.classList.add('show');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('show');
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('show');
    }
  });
}

/* 5. Struggle Selector Quiz on Homepage */
function initStruggleSelector() {
  const strugglesGrid = document.querySelector('.struggles-grid');
  if (!strugglesGrid) return;

  const tiles = strugglesGrid.querySelectorAll('.struggle-tile');
  const panel = document.querySelector('.suggestions-panel');
  const gridContainer = document.querySelector('.suggestions-grid');
  const queryHeading = document.getElementById('selected-struggle-heading');

  const pathPrefix = window.location.pathname.includes('/tools/') ? '../' : '';

  const toolsDb = {
    'swot': { name: 'SWOT Analysis', desc: 'Map your Strengths, Weaknesses, Opportunities, and Threats.', tag: 'career', file: 'tools/swot.html' },
    'ikigai': { name: 'Ikigai', desc: 'Find intersection of love, skill, needs, and pay.', tag: 'career', file: 'tools/ikigai.html' },
    'personal-inventory': { name: 'Personal Inventory', desc: 'Map your skills, values, interests, resources, and limits.', tag: 'goals', file: 'tools/personal-inventory.html' },
    'johari-window': { name: 'Johari Window', desc: 'Explore what you know about yourself vs what others see.', tag: 'problem', file: 'tools/johari-window.html' },
    'eisenhower': { name: 'Eisenhower Matrix', desc: 'Prioritize tasks by urgency and importance.', tag: 'prioritization', file: 'tools/eisenhower.html' },
    'impact-effort': { name: 'Impact vs Effort Matrix', desc: 'Plot quick wins, big bets, fill-ins, and thankless work.', tag: 'prioritization', file: 'tools/impact-effort.html' },
    'moscow': { name: 'MoSCoW Prioritization', desc: 'Categorize tasks into Must, Should, Could, and Won\'t.', tag: 'prioritization', file: 'tools/moscow.html' },
    'pareto': { name: '80/20 Rule (Pareto)', desc: 'Identify the 20% of effort producing 80% of results.', tag: 'prioritization', file: 'tools/pareto.html' },
    'rice': { name: 'RICE Scoring', desc: 'Score features or ideas by Reach, Impact, Confidence, and Effort.', tag: 'prioritization', file: 'tools/rice.html' },
    'decision-matrix': { name: 'Decision Matrix', desc: 'Systematically compare multiple choices using weighted criteria.', tag: 'decisions', file: 'tools/decision-matrix.html' },
    'pros-cons': { name: 'Pros & Cons', desc: 'List and weigh arguments for and against a specific choice.', tag: 'decisions', file: 'tools/pros-cons.html' },
    'pre-mortem': { name: 'Pre-Mortem Analysis', desc: 'Assume project failed and work backwards to prevent reasons.', tag: 'decisions', file: 'tools/pre-mortem.html' },
    'regret-minimization': { name: 'Regret Minimization', desc: 'Project yourself to age 80 to minimize long-term regret.', tag: 'decisions', file: 'tools/regret-minimization.html' },
    'five-whys': { name: '5 Whys Root Cause', desc: 'Iteratively query why a failure occurred to locate root cause.', tag: 'problem', file: 'tools/five-whys.html' },
    'first-principles': { name: 'First Principles', desc: 'Deconstruct complex claims into fundamental truths.', tag: 'problem', file: 'tools/first-principles.html' },
    'fishbone': { name: 'Fishbone Diagram', desc: 'Map potential causes of a problem to its root origins.', tag: 'problem', file: 'tools/fishbone.html' },
    'smart-goals': { name: 'SMART Goals', desc: 'Create Specific, Measurable, Achievable, Relevant, and Time-bound goals.', tag: 'goals', file: 'tools/smart-goals.html' },
    'woop': { name: 'WOOP Goal Setter', desc: 'Combine Wish, Outcome, and Obstacle with an If-Then Plan.', tag: 'goals', file: 'tools/woop.html' }
  };

  const struggleSuggestions = {
    'struggle-direction': {
      title: 'Choosing a direction',
      tools: ['ikigai', 'swot', 'decision-matrix', 'regret-minimization']
    },
    'struggle-tasks': {
      title: 'Too many tasks, don\'t know where to start',
      tools: ['eisenhower', 'impact-effort', 'pareto', 'moscow']
    },
    'struggle-decision': {
      title: 'Stuck on a decision',
      tools: ['pros-cons', 'decision-matrix', 'pre-mortem', 'regret-minimization']
    },
    'struggle-problem': {
      title: 'Trying to understand a problem',
      tools: ['five-whys', 'first-principles', 'fishbone', 'pre-mortem']
    },
    'struggle-goals': {
      title: 'Setting goals that actually stick',
      tools: ['smart-goals', 'woop', 'pareto', 'personal-inventory']
    },
    'struggle-self': {
      title: 'Understanding myself better',
      tools: ['johari-window', 'swot', 'ikigai', 'personal-inventory']
    }
  };

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const struggleId = tile.getAttribute('data-struggle');
      const data = struggleSuggestions[struggleId];

      if (!data) return;

      tiles.forEach(t => t.classList.remove('active'));
      tile.classList.add('active');

      gridContainer.innerHTML = '';
      queryHeading.textContent = `Suggested for: ${data.title}`;

      data.tools.forEach(key => {
        const tool = toolsDb[key];
        if (!tool) return;

        const card = document.createElement('div');
        card.className = 'suggestion-card';
        card.innerHTML = `
          <div>
            <span class="tag tag-${tool.tag}">${tool.tag}</span>
            <h4 style="margin-top: 0.5rem;">${tool.name}</h4>
            <p>${tool.desc}</p>
          </div>
          <a href="${pathPrefix}${tool.file}" class="suggestion-link">
            Open Tool
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        `;
        gridContainer.appendChild(card);
      });

      panel.style.display = 'block';
      setTimeout(() => {
        panel.classList.add('show');
        
        panel.classList.remove('highlight-flash');
        void panel.offsetWidth; // Trigger reflow
        panel.classList.add('highlight-flash');

        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    });
  });
}

/* 6. Client-Side PDF Exporter (Overriding print to export as PDF directly via html2pdf) */
function exportPDF() {
  const printArea = document.querySelector('.print-area');
  if (!printArea) return;

  // Add load spinner state or disable button
  const printBtn = document.querySelector('button[onclick="exportPDF()"]');
  const origText = printBtn ? printBtn.innerHTML : '';
  if (printBtn) {
    printBtn.disabled = true;
    printBtn.textContent = 'Generating PDF...';
  }

  // Load html2pdf dynamically if it is not present
  if (window.html2pdf) {
    triggerPdfDownload();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      triggerPdfDownload();
    };
    script.onerror = () => {
      alert('Could not load PDF library. Falling back to default print window.');
      window.print();
      if (printBtn) {
        printBtn.disabled = false;
        printBtn.innerHTML = origText;
      }
    };
    document.head.appendChild(script);
  }

  function triggerPdfDownload() {
    // Temporarily force light theme for clean print backgrounds
    const currentTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'light');

    // Setup print wrapper styling parameters
    const filename = `${document.querySelector('.tool-header-title h1')?.textContent || 'reflection'}.pdf`;
    const opt = {
      margin:      [0.5, 0.5, 0.5, 0.5],
      filename:    filename,
      image:       { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#ffffff'
      },
      jsPDF:       { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(printArea).save().then(() => {
      // Restore theme state
      if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }

      if (printBtn) {
        printBtn.disabled = false;
        printBtn.innerHTML = origText;
      }
    }).catch(err => {
      console.error(err);
      if (currentTheme) document.documentElement.setAttribute('data-theme', currentTheme);
      if (printBtn) {
        printBtn.disabled = false;
        printBtn.innerHTML = origText;
      }
    });
  }
}

// Bind to window context so inline onclick works
window.exportPDF = exportPDF;

/* 7. Dynamic list row handler (adding + and - bullet slots dynamically) */
function initDynamicListRowHandlers() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-add-row')) {
      const btn = e.target.closest('.btn-add-row');
      const containerId = btn.getAttribute('data-container');
      const container = document.getElementById(containerId);
      const placeholderText = btn.getAttribute('data-placeholder') || 'Enter item...';

      if (!container) return;

      const rowCount = container.children.length;
      if (rowCount >= 8) {
        alert('You have reached the maximum number of items (8) for clean layout and PDF rendering.');
        return;
      }

      const row = document.createElement('div');
      row.className = 'dynamic-list-row';
      let checkboxHtml = '';
      if (containerId === 'assumptions-container') {
        checkboxHtml = `
          <label style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; margin-left: 0.5rem; white-space: nowrap;">
            <input type="checkbox" class="challenge-checkbox"> Challenged
          </label>
        `;
      }
      row.innerHTML = `
        <input type="text" placeholder="${placeholderText}" class="dynamic-input-field">
        ${checkboxHtml}
        <button type="button" class="btn-icon btn-remove-row" title="Remove Item">
          <svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>
        </button>
      `;
      container.appendChild(row);
      
      const form = container.closest('form');
      if (form) form.dispatchEvent(new Event('input'));
    }

    if (e.target.closest('.btn-remove-row')) {
      const btn = e.target.closest('.btn-remove-row');
      const row = btn.closest('.dynamic-list-row');
      const container = row.parentNode;
      const form = container.closest('form');

      if (container.children.length > 1) {
        row.remove();
      } else {
        row.querySelector('input').value = '';
      }

      if (form) form.dispatchEvent(new Event('input'));
    }
  });
}

function getDynamicListValues(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return [];

  const inputs = container.querySelectorAll('.dynamic-input-field');
  const values = [];
  inputs.forEach(input => {
    const val = input.value.trim();
    if (val) values.push(val);
  });
  return values;
}

/* 8. Real-Time Auto-Save Mechanism */
function getFormStorageKey() {
  const pathParts = window.location.pathname.split('/');
  const fileName = pathParts[pathParts.length - 1] || 'index.html';
  return `justdoit_autosave_${fileName.replace('.html', '')}`;
}

function initAutoSave() {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('input', () => {
    saveFormData(form);
  });

  restoreFormData(form);
}

function saveFormData(form) {
  const key = getFormStorageKey();
  const data = {};

  form.querySelectorAll('input, select, textarea').forEach((field, index) => {
    if (field.type === 'submit' || field.type === 'button') return;
    const name = field.id || `field-${index}`;
    if (field.type === 'checkbox' || field.type === 'radio') {
      data[name] = field.checked;
    } else {
      data[name] = field.value;
    }
  });

  const dynamicContainers = form.querySelectorAll('[id$="-container"]');
  const dynamicCounts = {};
  dynamicContainers.forEach(container => {
    dynamicCounts[container.id] = container.children.length;
  });

  data['_dynamicCounts'] = dynamicCounts;
  localStorage.setItem(key, JSON.stringify(data));
}

function restoreFormData(form) {
  const key = getFormStorageKey();
  const raw = localStorage.getItem(key);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);

    if (data._dynamicCounts) {
      for (const [containerId, count] of Object.entries(data._dynamicCounts)) {
        const container = document.getElementById(containerId);
        if (container) {
          while (container.children.length < count) {
            const addBtn = document.querySelector(`[data-container="${containerId}"]`);
            if (addBtn) {
              addBtn.click();
            } else {
              break;
            }
          }
        }
      }
    }

    form.querySelectorAll('input, select, textarea').forEach((field, index) => {
      if (field.type === 'submit' || field.type === 'button') return;
      const name = field.id || `field-${index}`;
      if (data[name] !== undefined) {
        if (field.type === 'checkbox' || field.type === 'radio') {
          field.checked = data[name];
        } else {
          field.value = data[name];
          field.dispatchEvent(new Event('input'));
        }
      }
    });
  } catch (err) {
    console.error('Error restoring form data:', err);
  }
}

/* 9. Copy results as Markdown */
function initCopyMarkdownButton() {
  const printBtns = document.querySelectorAll('button[onclick="exportPDF()"]');
  printBtns.forEach(printBtn => {
    const parent = printBtn.parentNode;
    if (!parent) return;

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn';
    copyBtn.style.marginRight = '0.5rem';
    copyBtn.innerHTML = `
      <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; vertical-align: middle; margin-right: 4px;">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      Copy as Markdown
    `;

    copyBtn.addEventListener('click', () => {
      const markdown = compileResultToMarkdown();
      navigator.clipboard.writeText(markdown).then(() => {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.borderColor = '#78856F';
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          copyBtn.style.borderColor = '';
        }, 1500);
      });
    });

    parent.insertBefore(copyBtn, printBtn);
  });
}

function compileResultToMarkdown() {
  const title = document.querySelector('.tool-header-title h1')?.textContent || 'Just Do It Tool';
  const date = new Date().toLocaleDateString();
  let md = `# ${title}\n*Generated on ${date} via Just Do It*\n\n`;

  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('swot')) {
    md += `## SWOT Analysis\n\n`;
    md += `### Strengths\n${getMarkdownList('res-strengths')}\n`;
    md += `### Weaknesses\n${getMarkdownList('res-weaknesses')}\n`;
    md += `### Opportunities\n${getMarkdownList('res-opportunities')}\n`;
    md += `### Threats\n${getMarkdownList('res-threats')}\n`;
  } 
  else if (lowerTitle.includes('ikigai')) {
    md += `## Ikigai Mapping\n\n`;
    md += `* **What you Love:** ${document.getElementById('res-love')?.textContent}\n`;
    md += `* **What you are Good At:** ${document.getElementById('res-good')?.textContent}\n`;
    md += `* **What the World Needs:** ${document.getElementById('res-needs')?.textContent}\n`;
    md += `* **What you can be Paid For:** ${document.getElementById('res-paid')?.textContent}\n`;
  }
  else if (lowerTitle.includes('eisenhower')) {
    md += `## Eisenhower Matrix\n\n`;
    md += `### Q1: Do First (Urgent & Important)\n${getMarkdownList('res-q1')}\n`;
    md += `### Q2: Schedule (Important, Not Urgent)\n${getMarkdownList('res-q2')}\n`;
    md += `### Q3: Delegate (Urgent, Not Important)\n${getMarkdownList('res-q3')}\n`;
    md += `### Q4: Eliminate (Not Urgent & Not Important)\n${getMarkdownList('res-q4')}\n`;
  }
  else if (lowerTitle.includes('impact vs effort')) {
    md += `## Impact vs Effort Matrix\n\n`;
    md += `### Quick Wins (High Impact, Low Effort)\n${getMarkdownList('res-wins')}\n`;
    md += `### Big Bets (High Impact, High Effort)\n${getMarkdownList('res-bets')}\n`;
    md += `### Fill-ins (Low Impact, Low Effort)\n${getMarkdownList('res-fillins')}\n`;
    md += `### Thankless Tasks (Low Impact, High Effort)\n${getMarkdownList('res-thankless')}\n`;
  }
  else if (lowerTitle.includes('decision matrix')) {
    md += `## Decision Matrix\n\n`;
    const table = document.getElementById('res-matrix-table');
    if (table) md += parseHTMLTableToMarkdown(table);
    md += `\n**Conclusion:** ${document.getElementById('res-matrix-winner')?.textContent}\n`;
  }
  else if (lowerTitle.includes('moscow')) {
    md += `## MoSCoW Prioritization\n\n`;
    md += `### Must Have\n${getMarkdownList('res-must')}\n`;
    md += `### Should Have\n${getMarkdownList('res-should')}\n`;
    md += `### Could Have\n${getMarkdownList('res-could')}\n`;
    md += `### Won't Have\n${getMarkdownList('res-wont')}\n`;
  }
  else if (lowerTitle.includes('80/20') || lowerTitle.includes('pareto')) {
    md += `## 80/20 Leverage Audit\n\n`;
    const cards = document.querySelectorAll('.pareto-chart-card');
    cards.forEach(card => {
      const name = card.querySelector('h4')?.textContent;
      const badge = card.querySelector('.tag')?.textContent;
      const labelText = card.querySelectorAll('.pareto-bar-row span');
      if (name && labelText.length >= 4) {
        md += `### ${name} [${badge}]\n`;
        md += `* ${labelText[0].textContent}: ${labelText[1].textContent}\n`;
        md += `* ${labelText[2].textContent}: ${labelText[3].textContent}\n\n`;
      }
    });
    md += `**Leverage Insight:** ${document.getElementById('pareto-summary-card')?.textContent.trim()}\n`;
  }
  else if (lowerTitle.includes('rice')) {
    md += `## RICE Scoring Matrix\n\n`;
    const table = document.querySelector('.rice-table');
    if (table) md += parseHTMLTableToMarkdown(table);
    md += `\n**Scoring Result:** ${document.getElementById('rice-winner-card')?.textContent}\n`;
  }
  else if (lowerTitle.includes('pros & cons')) {
    md += `## Pros & Cons: ${document.getElementById('res-decision-statement')?.textContent}\n\n`;
    md += `### Pros\n`;
    const proItems = document.querySelectorAll('#res-pros-list .pros-cons-item');
    proItems.forEach(item => {
      md += `* ${item.textContent.trim()}\n`;
    });
    md += `\n### Cons\n`;
    const conItems = document.querySelectorAll('#res-cons-list .pros-cons-item');
    conItems.forEach(item => {
      md += `* ${item.textContent.trim()}\n`;
    });
    md += `\n**Verdict:** ${document.getElementById('res-comparison-winner')?.textContent}\n`;
  }
  else if (lowerTitle.includes('pre-mortem')) {
    md += `## Pre-Mortem: ${document.getElementById('res-project-statement')?.textContent}\n\n`;
    const table = document.querySelector('.premortem-table');
    if (table) md += parseHTMLTableToMarkdown(table);
  }
  else if (lowerTitle.includes('regret')) {
    md += `## Regret Minimization Framework: ${document.getElementById('res-decision')?.textContent}\n\n`;
    md += `* **If choose YES and works:** ${document.getElementById('res-q1')?.textContent}\n`;
    md += `* **If choose YES and fails:** ${document.getElementById('res-q2')?.textContent}\n`;
    md += `* **If choose NO:** ${document.getElementById('res-q3')?.textContent}\n`;
    md += `\n**Core Conclusion:** ${document.getElementById('res-reflection')?.textContent}\n`;
  }
  else if (lowerTitle.includes('personal inventory')) {
    md += `## Personal Inventory\n\n`;
    md += `### Skills\n${getMarkdownList('res-skills')}\n`;
    md += `### Interests\n${getMarkdownList('res-interests')}\n`;
    md += `### Values\n${getMarkdownList('res-values')}\n`;
    md += `### Resources\n${getMarkdownList('res-resources')}\n`;
    md += `### Constraints\n${getMarkdownList('res-constraints')}\n`;
    const note = document.getElementById('res-reflection-note')?.value;
    if (note) {
      md += `\n### Reflection Notes\n${note}\n`;
    }
  }
  else if (lowerTitle.includes('johari')) {
    md += `## Johari Window\n\n`;
    md += `* **Open Arena:** ${document.getElementById('res-open')?.textContent}\n`;
    md += `* **Blind Spot:** ${document.getElementById('res-blind')?.textContent}\n`;
    md += `* **Hidden/Facade:** ${document.getElementById('res-hidden')?.textContent}\n`;
    md += `* **Unknown:** ${document.getElementById('res-unknown')?.textContent}\n`;
  }
  else if (lowerTitle.includes('5 whys')) {
    md += `## 5 Whys Root Cause Chain\n\n`;
    md += `1. **Symptom / Problem:** ${document.getElementById('res-problem')?.textContent}\n`;
    md += `2. **Why?** ${document.getElementById('res-why1')?.textContent}\n`;
    md += `3. **Why?** ${document.getElementById('res-why2')?.textContent}\n`;
    md += `4. **Why?** ${document.getElementById('res-why3')?.textContent}\n`;
    md += `5. **Why?** ${document.getElementById('res-why4')?.textContent}\n`;
    md += `6. **Root Cause (Why 5):** ${document.getElementById('res-why5')?.textContent}\n`;
  }
  else if (lowerTitle.includes('principles')) {
    md += `## First Principles Analysis\n\n`;
    md += `**Problem or Goal:** ${document.getElementById('res-goal')?.textContent}\n\n`;
    md += `### Assumptions & Status Quo\n${getMarkdownList('res-assumptions')}\n`;
    md += `### Fundamental Truths\n${getMarkdownList('res-truths')}\n`;
    md += `### Rebuilt Solution\n${document.getElementById('res-rebuild')?.textContent}\n`;
  }
  else if (lowerTitle.includes('fishbone')) {
    md += `## Fishbone Cause-and-Effect: ${document.getElementById('res-head-effect')?.textContent}\n\n`;
    const cats = ['cat1', 'cat2', 'cat3', 'cat4', 'cat5', 'cat6'];
    cats.forEach(c => {
      const label = document.getElementById(`res-${c}-label`)?.textContent || 'Category';
      md += `### ${label}\n${getMarkdownList(`res-${c}-list`)}\n`;
    });
  }
  else if (lowerTitle.includes('smart')) {
    md += `## SMART Goal Summary\n\n`;
    md += `> ${document.querySelector('.smart-card-summary')?.textContent.trim()}\n\n`;
    md += `### Breakdown\n`;
    md += `* **Specific:** ${document.getElementById('res-specific')?.textContent}\n`;
    md += `* **Measurable:** ${document.getElementById('res-measurable')?.textContent}\n`;
    md += `* **Achievable:** ${document.getElementById('res-achievable')?.textContent}\n`;
    md += `* **Relevant:** ${document.getElementById('res-relevant')?.textContent}\n`;
    md += `* **Time-bound:** ${document.getElementById('res-time')?.textContent}\n`;
  }
  else if (lowerTitle.includes('woop')) {
    md += `## WOOP Goal Blueprint\n\n`;
    md += `* **Wish:** ${document.getElementById('res-wish')?.textContent}\n`;
    md += `* **Outcome:** ${document.getElementById('res-outcome')?.textContent}\n`;
    md += `* **Obstacle:** ${document.getElementById('res-obstacle')?.textContent}\n`;
    md += `\n**If-Then Plan:**\n`;
    md += `> If ${document.getElementById('res-plan-trigger')?.textContent}, then I will ${document.getElementById('res-plan-action')?.textContent}.\n`;
  }

  return md;
}

function getMarkdownList(id) {
  const container = document.getElementById(id);
  if (!container) return '';
  const items = container.querySelectorAll('li, .inventory-chip, .scatter-chip');
  if (items.length === 0) {
    const txt = container.textContent.trim();
    if (txt === 'None listed' || txt === 'None' || txt === 'No tasks' || txt === '') return '* None\n';
    return `* ${txt}\n`;
  }
  let str = '';
  items.forEach(item => {
    str += `* ${item.textContent.trim()}\n`;
  });
  return str;
}

function parseHTMLTableToMarkdown(table) {
  let markdown = '';
  const rows = table.querySelectorAll('tr');

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('th, td');
    let rowStr = '| ';
    cells.forEach(cell => {
      rowStr += cell.textContent.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ') + ' | ';
    });
    markdown += rowStr + '\n';

    if (rowIndex === 0) {
      let dividerStr = '|';
      cells.forEach(() => {
        dividerStr += ' --- |';
      });
      markdown += dividerStr + '\n';
    }
  });
  return markdown;
}

/* 10. Clear All Form Button — injected globally into every tool page */
function initClearButton() {
  const form = document.querySelector('form');
  if (!form) return;

  const submitBtn = form.querySelector('[type="submit"]');
  if (!submitBtn) return;

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'btn btn-clear';
  clearBtn.innerHTML = `
    <svg viewBox="0 0 24 24" style="width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2.2;vertical-align:middle;margin-right:5px;">
      <polyline points="1 4 1 10 7 10"></polyline>
      <path d="M3.51 15a9 9 0 1 0 .49-4.98"></path>
    </svg>
    Clear All
  `;

  clearBtn.addEventListener('click', () => {
    if (!confirm('Clear all inputs and start fresh?\nThis cannot be undone.')) return;

    // Wipe autosave
    localStorage.removeItem(getFormStorageKey());

    // Reset all text / number / textarea / select fields
    form.querySelectorAll('input[type="text"], input[type="number"], textarea, select').forEach(f => {
      f.value = '';
    });

    // Uncheck all checkboxes & radio buttons
    form.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(cb => {
      cb.checked = false;
    });

    // Dynamic list containers: keep one empty row, remove extras
    form.querySelectorAll('[id$="-container"]').forEach(container => {
      const rows = Array.from(container.querySelectorAll('.dynamic-list-row'));
      rows.forEach((row, idx) => {
        if (idx === 0) {
          row.querySelectorAll('input[type="text"], textarea').forEach(f => (f.value = ''));
          row.querySelectorAll('input[type="checkbox"]').forEach(cb => (cb.checked = false));
        } else {
          row.remove();
        }
      });
    });

    // Hide result section if it is currently shown
    document.querySelectorAll('.result-section.show').forEach(s => s.classList.remove('show'));

    // Reset 5-Whys sequential inputs (hide Why 2-5 again)
    ['why2-group', 'why3-group', 'why4-group', 'why5-group'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.display = 'none'; el.style.opacity = '0'; }
    });

    // Clear prompt boxes (5-Whys context hints)
    ['prompt-why2', 'prompt-why3', 'prompt-why4', 'prompt-why5'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.style.display = 'none'; }
    });

    // Scroll back to top of form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Insert immediately after the submit button
  submitBtn.insertAdjacentElement('afterend', clearBtn);
}
