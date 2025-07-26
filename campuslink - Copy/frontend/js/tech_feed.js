document.addEventListener('DOMContentLoaded', function() {
    const feedContainer = document.getElementById('feedContainer');
    const addBtn = document.getElementById('addBtn');
    const modal = document.getElementById('addModal');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('opportunityForm');
    const tabBtns = document.querySelectorAll('.tab-btn');

    let currentFilter = 'all';
    let opportunities = JSON.parse(localStorage.getItem('techOpportunities')) || [];

    // Initialize with sample data if empty
    if (opportunities.length === 0) {
        opportunities = [
            {
                id: 1,
                type: 'hackathons',
                title: 'Smart India Hackathon 2024',
                company: 'Government of India',
                description: 'National level hackathon for innovative solutions to real-world problems.',
                link: 'https://sih.gov.in',
                deadline: '2024-02-15',
                dateAdded: new Date().toISOString()
            },
            {
                id: 2,
                type: 'internships',
                title: 'Software Engineering Intern',
                company: 'Google',
                description: 'Summer internship program for computer science students.',
                link: 'https://careers.google.com',
                deadline: '2024-03-01',
                dateAdded: new Date().toISOString()
            },
            {
                id: 3,
                type: 'news',
                title: 'AI Revolution in Education',
                company: 'TechCrunch',
                description: 'How artificial intelligence is transforming the education sector.',
                link: 'https://techcrunch.com',
                deadline: null,
                dateAdded: new Date().toISOString()
            }
        ];
        saveOpportunities();
    }

    // Event listeners
    addBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    form.addEventListener('submit', handleSubmit);
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderFeed();
        });
    });

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    function handleSubmit(e) {
        e.preventDefault();
        
        const newOpportunity = {
            id: Date.now(),
            type: document.getElementById('type').value,
            title: document.getElementById('title').value,
            company: document.getElementById('company').value,
            description: document.getElementById('description').value,
            link: document.getElementById('link').value,
            deadline: document.getElementById('deadline').value || null,
            dateAdded: new Date().toISOString()
        };

        opportunities.unshift(newOpportunity);
        saveOpportunities();
        renderFeed();
        form.reset();
        modal.classList.add('hidden');
    }

    function saveOpportunities() {
        localStorage.setItem('techOpportunities', JSON.stringify(opportunities));
    }

    function deleteOpportunity(id) {
        if (confirm('Are you sure you want to delete this opportunity?')) {
            opportunities = opportunities.filter(opp => opp.id !== id);
            saveOpportunities();
            renderFeed();
        }
    }

    function renderFeed() {
        const filteredOpportunities = currentFilter === 'all' 
            ? opportunities 
            : opportunities.filter(opp => opp.type === currentFilter);

        if (filteredOpportunities.length === 0) {
            feedContainer.innerHTML = '<div style="text-align: center; color: #666; font-size: 1.2em; padding: 40px;">No opportunities found. Add some!</div>';
            return;
        }

        feedContainer.innerHTML = filteredOpportunities.map(opp => {
            const deadlineText = opp.deadline 
                ? `Deadline: ${new Date(opp.deadline).toLocaleDateString()}`
                : '';
            
            const isExpired = opp.deadline && new Date(opp.deadline) < new Date();
            const deadlineClass = isExpired ? 'style="color: #999; text-decoration: line-through;"' : '';

            return `
                <div class="feed-item ${opp.type}">
                    <button class="delete-btn" onclick="deleteOpportunity(${opp.id})">×</button>
                    <div class="item-header">
                        <span class="item-type ${opp.type}">${getTypeIcon(opp.type)} ${opp.type}</span>
                    </div>
                    <div class="item-title">${opp.title}</div>
                    ${opp.company ? `<div class="item-company">${opp.company}</div>` : ''}
                    <div class="item-description">${opp.description}</div>
                    <div class="item-footer">
                        ${opp.deadline ? `<div class="item-deadline" ${deadlineClass}>${deadlineText}</div>` : '<div></div>'}
                        ${opp.link ? `<a href="${opp.link}" target="_blank" class="item-link">Learn More</a>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    function getTypeIcon(type) {
        switch(type) {
            case 'hackathons': return '🏆';
            case 'internships': return '💼';
            case 'news': return '📰';
            default: return '📌';
        }
    }

    // Make deleteOpportunity available globally
    window.deleteOpportunity = deleteOpportunity;

    // Initial render
    renderFeed();
});