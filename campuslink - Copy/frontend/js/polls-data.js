// Shared polls data management
const POLLS_STORAGE_KEY = 'campuslink_polls';
const USER_VOTES_KEY = 'campuslink_user_votes';

// Initialize default polls data
function initializePollsData() {
    const existingPolls = localStorage.getItem(POLLS_STORAGE_KEY);
    if (!existingPolls) {
        const defaultPolls = [
            {
                id: 1,
                question: "Should the university extend library hours during exam periods?",
                category: "facilities",
                options: ["Yes, extend to 2 AM", "Yes, extend to midnight", "Current hours are fine", "Reduce hours to save costs"],
                votes: [85, 45, 32, 8],
                totalVotes: 170,
                isActive: true,
                createdAt: "2025-01-20",
                expiresAt: "2025-01-27",
                createdBy: "Admin"
            },
            {
                id: 2,
                question: "Which programming language should be added to the CS curriculum?",
                category: "academics",
                options: ["TypeScript", "Rust", "Go", "Kotlin", "Swift"],
                votes: [41, 34, 28, 22, 15],
                totalVotes: 140,
                isActive: true,
                createdAt: "2025-01-18",
                expiresAt: "2025-01-25",
                createdBy: "CS Department"
            },
            {
                id: 3,
                question: "What new food options would you like in the cafeteria?",
                category: "facilities",
                options: ["International cuisine", "Late-night options", "More vegetarian options", "Healthy snacks", "Local food vendors"],
                votes: [89, 78, 67, 45, 34],
                totalVotes: 313,
                isActive: true,
                createdAt: "2025-01-12",
                expiresAt: "2025-01-19",
                createdBy: "Dining Services",
                allowMultiple: true
            }
        ];
        localStorage.setItem(POLLS_STORAGE_KEY, JSON.stringify(defaultPolls));
    }
}

// Get all polls
function getPolls() {
    const polls = localStorage.getItem(POLLS_STORAGE_KEY);
    return polls ? JSON.parse(polls) : [];
}

// Save polls
function savePolls(polls) {
    localStorage.setItem(POLLS_STORAGE_KEY, JSON.stringify(polls));
}

// Create new poll
function createPoll(pollData) {
    const polls = getPolls();
    const newPoll = {
        id: Date.now(),
        question: pollData.question,
        category: pollData.category,
        options: pollData.options,
        votes: new Array(pollData.options.length).fill(0),
        totalVotes: 0,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        expiresAt: pollData.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdBy: pollData.createdBy || "Admin",
        allowMultiple: pollData.allowMultiple || false
    };
    polls.unshift(newPoll);
    savePolls(polls);
    return newPoll;
}

// Vote on poll
function voteOnPoll(pollId, optionIndex, userId) {
    const polls = getPolls();
    const poll = polls.find(p => p.id === pollId);
    if (!poll || !poll.isActive) return false;

    const userVotes = getUserVotes();
    const userVoteKey = `${userId}_${pollId}`;
    
    if (userVotes[userVoteKey] && !poll.allowMultiple) {
        return false; // Already voted
    }

    poll.votes[optionIndex]++;
    poll.totalVotes++;
    
    // Record user vote
    if (poll.allowMultiple) {
        if (!userVotes[userVoteKey]) userVotes[userVoteKey] = [];
        if (!userVotes[userVoteKey].includes(optionIndex)) {
            userVotes[userVoteKey].push(optionIndex);
        }
    } else {
        userVotes[userVoteKey] = optionIndex;
    }
    
    savePolls(polls);
    saveUserVotes(userVotes);
    return true;
}

// Get user votes
function getUserVotes() {
    const votes = localStorage.getItem(USER_VOTES_KEY);
    return votes ? JSON.parse(votes) : {};
}

// Save user votes
function saveUserVotes(votes) {
    localStorage.setItem(USER_VOTES_KEY, JSON.stringify(votes));
}

// Check if user has voted on poll
function hasUserVoted(pollId, userId) {
    const userVotes = getUserVotes();
    return userVotes[`${userId}_${pollId}`] !== undefined;
}

// Get user's vote for a poll
function getUserVote(pollId, userId) {
    const userVotes = getUserVotes();
    return userVotes[`${userId}_${pollId}`];
}

// Toggle poll status
function togglePollStatus(pollId) {
    const polls = getPolls();
    const poll = polls.find(p => p.id === pollId);
    if (poll) {
        poll.isActive = !poll.isActive;
        savePolls(polls);
        return poll;
    }
    return null;
}

// Delete poll
function deletePoll(pollId) {
    const polls = getPolls();
    const index = polls.findIndex(p => p.id === pollId);
    if (index !== -1) {
        polls.splice(index, 1);
        savePolls(polls);
        return true;
    }
    return false;
}

// Initialize data when script loads
initializePollsData();