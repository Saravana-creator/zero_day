document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("complaintForm");
  const studentTable = document.getElementById("myComplaintTable").querySelector("tbody");
  const managementTable = document.getElementById("complaintTable").querySelector("tbody");
  const historyTable = document.getElementById("historyTable").querySelector("tbody");

  let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

  // Render initial complaints
  renderTables();

  // Submit complaint
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const complaint = {
      id: Date.now(),
      name: document.getElementById("name").value,
      room: document.getElementById("room").value,
      email: document.getElementById("email").value,
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      status: "Pending",
      dateResolved: null
    };

    complaints.push(complaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    alert("✅ Complaint submitted successfully!");

    form.reset();
    renderTables();
  });

  function renderTables() {
    // Clear existing tables
    studentTable.innerHTML = "";
    managementTable.innerHTML = "";
    historyTable.innerHTML = "";

    complaints.forEach((comp, index) => {
      // Student view (shows all complaints for now)
      const studentRow = document.createElement("tr");
      studentRow.innerHTML = `
        <td>${comp.category}</td>
        <td>${comp.description}</td>
        <td>${comp.status}</td>
      `;
      studentTable.appendChild(studentRow);

      // Management view (shows all complaints)
      if (comp.status !== "Resolved") {
        const mgmtRow = document.createElement("tr");
        mgmtRow.innerHTML = `
          <td>${comp.name}</td>
          <td>${comp.room}</td>
          <td>${comp.email}</td>
          <td>${comp.category}</td>
          <td>${comp.description}</td>
          <td>${comp.status}</td>
          <td>
            <button onclick="resolveComplaint(${index})">Resolve</button>
          </td>
        `;
        managementTable.appendChild(mgmtRow);
      }

      // History view (resolved only)
      if (comp.status === "Resolved") {
        const histRow = document.createElement("tr");
        histRow.innerHTML = `
          <td>${comp.name}</td>
          <td>${comp.room}</td>
          <td>${comp.email}</td>
          <td>${comp.category}</td>
          <td>${comp.description}</td>
          <td>${comp.dateResolved}</td>
        `;
        historyTable.appendChild(histRow);
      }
    });
  }

  // Expose for inline onclick
  window.resolveComplaint = function (index) {
    const complaint = complaints[index];
    
    // Generate resolution message based on category
    let resolutionMessage = "";
    switch (complaint.category.toLowerCase()) {
      case "water":
        resolutionMessage = "Your complaint about water issues has been addressed. We've ensured proper plumbing or water supply.";
        break;
      case "electricity":
        resolutionMessage = "The electricity-related complaint has been resolved. Electrical lines or systems have been checked and fixed.";
        break;
      case "internet":
        resolutionMessage = "We've looked into your internet connectivity issue. The network is now stable and functional.";
        break;
      case "cleaning":
        resolutionMessage = "The cleaning request has been fulfilled. The concerned area has been cleaned.";
        break;
      case "food":
        resolutionMessage = "Your food-related concern has been communicated to the mess management and necessary changes were made.";
        break;
      default:
        resolutionMessage = "Your complaint has been resolved. Thank you for your patience.";
    }
    
    // Create mailto link
    const subject = encodeURIComponent(`Complaint Resolved: ${complaint.category}`);
    const body = encodeURIComponent(`Hello ${complaint.name},\n\n${resolutionMessage}\n\nComplaint Description:\n${complaint.description}\n\nThank you,\nHostel Management`);
    const mailtoLink = `mailto:${complaint.email}?subject=${subject}&body=${body}`;
    
    // Try multiple methods to open email
    try {
      // Method 1: Direct window.open
      const emailWindow = window.open(mailtoLink);
      
      // Method 2: If popup blocked, try location
      if (!emailWindow || emailWindow.closed) {
        window.location.href = mailtoLink;
      }
    } catch (error) {
      // Method 3: Fallback - copy email details to clipboard
      const emailText = `To: ${complaint.email}\nSubject: Complaint Resolved: ${complaint.category}\n\nHello ${complaint.name},\n\n${resolutionMessage}\n\nComplaint Description:\n${complaint.description}\n\nThank you,\nHostel Management`;
      
      navigator.clipboard.writeText(emailText).then(() => {
        alert('⚠️ Email client not available. Email details copied to clipboard. Please paste in your email app.');
      }).catch(() => {
        // Method 4: Show email details in alert
        alert(`⚠️ Please send this email manually:\n\nTo: ${complaint.email}\nSubject: Complaint Resolved: ${complaint.category}\n\nMessage:\nHello ${complaint.name},\n\n${resolutionMessage}\n\nComplaint Description:\n${complaint.description}\n\nThank you,\nHostel Management`);
      });
    }
    
    // Update complaint status
    complaints[index].status = "Resolved";
    complaints[index].dateResolved = new Date().toLocaleDateString();
    localStorage.setItem("complaints", JSON.stringify(complaints));
    renderTables();
    
    alert('✅ Complaint resolved! Check your email client or clipboard for email details.');
  };

  // View toggle buttons
  window.showView = function (view) {
    document.getElementById("studentView").style.display = view === "student" ? "block" : "none";
    document.getElementById("managementView").style.display = view === "management" ? "block" : "none";
    document.getElementById("historyView").style.display = view === "history" ? "block" : "none";
  };
});
