const timetable = document.getElementById("timetable");

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let schedule = {};

// Initialize calendar cards
days.forEach(day => {
  schedule[day] = [];
  const card = document.createElement("div");
  card.className = "day-card";
  card.id = `card-${day}`;
  card.innerHTML = `
    <h3>${day}</h3>
    <div class="day-content" id="content-${day}"></div>
    <div class="nav-arrows" id="nav-${day}" style="display: none;">
      <button class="nav-btn prev-btn" onclick="prevPage('${day}')">←</button>
      <button class="nav-btn next-btn" onclick="nextPage('${day}')">→</button>
    </div>
    <div class="page-indicator" id="indicator-${day}" style="display: none;"></div>
    <button class="add-notes-btn" onclick="showNotesForm('${day}')">+ Add</button>
  `;
  timetable.appendChild(card);
});

// Track current page for each day
let currentPage = {};
days.forEach(day => {
  currentPage[day] = 0;
});

// Load profile on initialization
loadProfile();

// Show notes form
function showNotesForm(day, editIndex = null) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.onclick = closeNotesForm;
  
  const isEdit = editIndex !== null;
  const entry = isEdit ? schedule[day][editIndex] : {};
  
  const notesForm = document.createElement('div');
  notesForm.className = 'notes-form';
  notesForm.innerHTML = `
    <h3>${isEdit ? '✏️ Edit' : '📝 Add'} Schedule for ${day}</h3>
    
    <div class="form-group">
      <label for="noteSubject">Subject/Title *</label>
      <input type="text" id="noteSubject" placeholder="e.g., Mathematics, Meeting, Study Session" value="${entry.subject || ''}" required />
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="noteTime">Start Time *</label>
        <input type="time" id="noteTime" value="${entry.time || ''}" required />
      </div>
      <div class="form-group">
        <label for="noteEndTime">End Time</label>
        <input type="time" id="noteEndTime" value="${entry.endTime || ''}" />
      </div>
    </div>
    
    <div class="form-group">
      <label for="noteLocation">Location</label>
      <input type="text" id="noteLocation" placeholder="e.g., Room 101, Online, Library" value="${entry.location || ''}" />
    </div>
    
    <div class="form-group">
      <label for="notePriority">Priority</label>
      <select id="notePriority">
        <option value="low" ${entry.priority === 'low' ? 'selected' : ''}>🟢 Low</option>
        <option value="medium" ${!entry.priority || entry.priority === 'medium' ? 'selected' : ''}>🟡 Medium</option>
        <option value="high" ${entry.priority === 'high' ? 'selected' : ''}>🔴 High</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="noteText">Notes & Description</label>
      <textarea id="noteText" placeholder="Additional details, reminders, or important information...">${entry.notes || ''}</textarea>
    </div>
    
    <div class="button-group">
      <button class="save-btn" onclick="saveNote('${day}', ${editIndex === null ? 'null' : editIndex})">${isEdit ? 'Update' : 'Save'} Event</button>
      <button class="cancel-btn" onclick="closeNotesForm()">Cancel</button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  document.body.appendChild(notesForm);
}

// Save note
function saveNote(day, editIndex = null) {
  // Convert string 'null' back to actual null
  if (editIndex === 'null') editIndex = null;
  
  const subject = document.getElementById('noteSubject').value.trim();
  const time = document.getElementById('noteTime').value;
  const endTime = document.getElementById('noteEndTime').value;
  const location = document.getElementById('noteLocation').value.trim();
  const priority = document.getElementById('notePriority').value;
  const notes = document.getElementById('noteText').value.trim();
  
  if (subject && time) {
    const entry = { 
      subject, 
      time, 
      endTime: endTime || null,
      location: location || null,
      priority,
      notes: notes || null
    };
    
    if (editIndex !== null && editIndex !== undefined) {
      schedule[day][editIndex] = entry;
    } else {
      schedule[day].push(entry);
    }
    
    updateDayColumn(day);
    closeNotesForm();
  }
}

// Edit entry
function editEntry(day, index) {
  showNotesForm(day, index);
}

// Close notes form
function closeNotesForm() {
  document.querySelector('.overlay')?.remove();
  document.querySelector('.notes-form')?.remove();
}

// Update day column with pagination
function updateDayColumn(day) {
  const container = document.getElementById(`content-${day}`);
  const navArrows = document.getElementById(`nav-${day}`);
  const indicator = document.getElementById(`indicator-${day}`);
  
  container.innerHTML = "";
  
  const entries = schedule[day];
  const itemsPerPage = 2;
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  
  if (totalPages <= 1) {
    navArrows.style.display = 'none';
    indicator.style.display = 'none';
    currentPage[day] = 0;
  } else {
    navArrows.style.display = 'flex';
    indicator.style.display = 'block';
    indicator.textContent = `${currentPage[day] + 1}/${totalPages}`;
  }
  
  // Create pages
  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    const page = document.createElement('div');
    page.className = `page ${pageIndex === currentPage[day] ? 'active' : ''}`;
    page.id = `page-${day}-${pageIndex}`;
    
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, entries.length);
    
    for (let i = startIndex; i < endIndex; i++) {
      const entry = entries[i];
      const div = document.createElement("div");
      div.className = "class-box";
      
      const priorityIcon = entry.priority === 'high' ? '🔴' : entry.priority === 'medium' ? '🟡' : '🟢';
      const timeDisplay = entry.endTime ? `${entry.time} - ${entry.endTime}` : entry.time;
      const locationHtml = entry.location ? `<div class="class-location">📍 ${entry.location}</div>` : '';
      const notesHtml = entry.notes ? `<div class="class-notes">${entry.notes}</div>` : '';
      
      div.innerHTML = `
        <div class="class-header">
          <strong>${priorityIcon} ${entry.subject}</strong>
        </div>
        <small class="class-time">🕕 ${timeDisplay}</small>
        ${locationHtml}
        ${notesHtml}
        <button class="edit-btn" onclick="editEntry('${day}', ${i})">✏️</button>
        <button class="delete-btn" onclick="deleteEntry('${day}', ${i})">🗑</button>
      `;
      page.appendChild(div);
    }
    
    container.appendChild(page);
  }
  
  // Update navigation buttons
  updateNavButtons(day, totalPages);
}

// Update navigation button states
function updateNavButtons(day, totalPages) {
  const navArrows = document.getElementById(`nav-${day}`);
  if (!navArrows) return;
  
  const prevBtn = navArrows.querySelector('.prev-btn');
  const nextBtn = navArrows.querySelector('.next-btn');
  
  prevBtn.disabled = currentPage[day] === 0;
  nextBtn.disabled = currentPage[day] === totalPages - 1;
}

// Navigate to previous page
function prevPage(day) {
  if (currentPage[day] > 0) {
    flipPage(day, currentPage[day] - 1);
  }
}

// Navigate to next page
function nextPage(day) {
  const totalPages = Math.ceil(schedule[day].length / 2);
  if (currentPage[day] < totalPages - 1) {
    flipPage(day, currentPage[day] + 1);
  }
}

// Flip page with calendar animation
function flipPage(day, newPageIndex) {
  const currentPageEl = document.getElementById(`page-${day}-${currentPage[day]}`);
  const newPageEl = document.getElementById(`page-${day}-${newPageIndex}`);
  const indicator = document.getElementById(`indicator-${day}`);
  
  if (currentPageEl) {
    currentPageEl.style.animation = 'flipOut 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    currentPageEl.classList.remove('active');
  }
  
  setTimeout(() => {
    currentPage[day] = newPageIndex;
    
    if (currentPageEl) {
      currentPageEl.style.animation = '';
      currentPageEl.classList.add('flip-out');
    }
    
    if (newPageEl) {
      newPageEl.classList.remove('flip-out');
      newPageEl.style.animation = 'flipIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
      newPageEl.classList.add('active');
    }
    
    const totalPages = Math.ceil(schedule[day].length / 2);
    indicator.textContent = `${currentPage[day] + 1}/${totalPages}`;
    updateNavButtons(day, totalPages);
  }, 400);
}

// Delete entry
function deleteEntry(day, index) {
  schedule[day].splice(index, 1);
  updateDayColumn(day);
}

// Profile functionality handled by global profile manager


