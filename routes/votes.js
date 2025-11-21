const express = require('express');
const Vote = require('../models/Vote');
const router = express.Router();

router.post('/vote', async (req, res) => {
  try {
    const { userName, votes } = req.body;

    if (!userName || !votes) {
      return res.status(400).json({ 
        error: 'Username and votes are required' 
      });
    }

    if (typeof userName !== 'string' || userName.trim() === '') {
      return res.status(400).json({ 
        error: 'Valid username is required' 
      });
    }

    if (typeof votes !== 'object' || Object.keys(votes).length === 0) {
      return res.status(400).json({ 
        error: 'Valid votes object is required' 
      });
    }

    const existingVote = await Vote.findOne({ userName: userName.trim() });
    if (existingVote) {
      return res.status(400).json({ 
        error: 'User has already submitted a vote' 
      });
    }
    
    const newVote = new Vote({
      userName: userName.trim(),
      votes: votes
    });

    const savedVote = await newVote.save();

    res.status(201).json({ 
      message: 'Vote submitted successfully',
      voteId: savedVote._id
    });

  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

// GET /api/votes - Get all votes (for admin panel)
router.get('/votes', async (req, res) => {
  try {
    const votes = await Vote.find({})
      .select('-__v') // Exclude version key
      .sort({ submittedAt: -1 }); // Most recent first

    res.json({
      count: votes.length,
      votes: votes
    });

  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// GET /api/winners - Get winner analysis with monthly and overall winners
router.get('/winners', async (req, res) => {
  try {
    const votes = await Vote.find({});
    
    const categories = ["Employee of the Year", "Team Spirit & Collaboration", "Innovation & Initiative"];
    const months = ['Sept', 'Oct', 'Nov'];
    
    const winnerReport = {};
    
    categories.forEach(category => {
      winnerReport[category] = {
        monthly: {},
        overall: { nominee: '', votes: 0 }
      };
      
      // Initialize monthly vote counts
      months.forEach(month => {
        winnerReport[category].monthly[month] = {};
      });
      
      let overallCounts = {};
      
      // Count votes
      votes.forEach(vote => {
        if (vote.votes[category]) {
          Object.keys(vote.votes[category]).forEach(month => {
            const nominee = vote.votes[category][month];
            if (nominee) {
              // Monthly count
              if (!winnerReport[category].monthly[month][nominee]) {
                winnerReport[category].monthly[month][nominee] = 0;
              }
              winnerReport[category].monthly[month][nominee]++;
              
              // Overall count
              if (!overallCounts[nominee]) {
                overallCounts[nominee] = 0;
              }
              overallCounts[nominee]++;
            }
          });
        }
      });
      
      // Find monthly winners
      months.forEach(month => {
        let monthWinner = { nominee: '', votes: 0 };
        Object.entries(winnerReport[category].monthly[month]).forEach(([nominee, voteCount]) => {
          if (voteCount > monthWinner.votes) {
            monthWinner = { nominee, votes: voteCount };
          }
        });
        winnerReport[category].monthly[month] = monthWinner;
      });
      
      // Find overall winner
      let overallWinner = { nominee: '', votes: 0 };
      Object.entries(overallCounts).forEach(([nominee, voteCount]) => {
        if (voteCount > overallWinner.votes) {
          overallWinner = { nominee, votes: voteCount };
        }
      });
      winnerReport[category].overall = overallWinner;
    });
    
    res.json(winnerReport);
    
  } catch (error) {
    console.error('Error generating winner report:', error);
    res.status(500).json({ error: 'Failed to generate winner report' });
  }
});

// GET /api/admin-summary - Get simplified summary for admin panel (aggregated across months)
router.get('/admin-summary', async (req, res) => {
  try {
    const votes = await Vote.find({});
    
    const summary = {};
    const categories = ["Employee of the Year", "Team Spirit & Collaboration", "Innovation & Initiative"];
    
    // Initialize categories
    categories.forEach(category => {
      summary[category] = {};
    });

    // Count votes aggregated across all months
    votes.forEach(vote => {
      Object.keys(vote.votes).forEach(category => {
        if (summary[category]) {
          Object.keys(vote.votes[category]).forEach(month => {
            const nominee = vote.votes[category][month];
            if (nominee) {
              summary[category][nominee] = (summary[category][nominee] || 0) + 1;
            }
          });
        }
      });
    });

    res.json(summary);

  } catch (error) {
    console.error('Error generating admin summary:', error);
    res.status(500).json({ error: 'Failed to generate admin summary' });
  }
});

// GET /api/votes/summary - Get voting summary/statistics
router.get('/votes/summary', async (req, res) => {
  try {
    const votes = await Vote.find({});
    
    const summary = {
      totalVotes: votes.length,
      categories: {},
      months: ['Sept', 'Oct', 'Nov'],
      colleagues: [
        "Ebeh", "Samuel", "Elvis", "Cecilia", "Eugene", 
        "Steph", "Favour", "Gael", "Partemus", "Marinette", "Love"
      ]
    };

    // Count votes for each category and month
    const categories = ["Employee of the Year", "Team Spirit & Collaboration", "Innovation & Initiative"];
    
    categories.forEach(category => {
      summary.categories[category] = {};
      summary.months.forEach(month => {
        summary.categories[category][month] = {};
        summary.colleagues.forEach(colleague => {
          summary.categories[category][month][colleague] = 0;
        });
      });
    });

    // Count the votes
    votes.forEach(vote => {
      Object.keys(vote.votes).forEach(category => {
        if (summary.categories[category]) {
          Object.keys(vote.votes[category]).forEach(month => {
            const nominee = vote.votes[category][month];
            if (summary.categories[category][month] && summary.categories[category][month][nominee] !== undefined) {
              summary.categories[category][month][nominee]++;
            }
          });
        }
      });
    });

    res.json(summary);

  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// GET /api/votes/:id - Get a specific vote by ID
router.get('/votes/:id', async (req, res) => {
  try {
    const vote = await Vote.findById(req.params.id).select('-__v');
    
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    res.json(vote);

  } catch (error) {
    console.error('Error fetching vote:', error);
    res.status(500).json({ error: 'Failed to fetch vote' });
  }
});

// DELETE /api/votes/:id - Delete a specific vote (admin only)
router.delete('/votes/:id', async (req, res) => {
  try {
    const vote = await Vote.findByIdAndDelete(req.params.id);
    
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    res.json({ message: 'Vote deleted successfully' });

  } catch (error) {
    console.error('Error deleting vote:', error);
    res.status(500).json({ error: 'Failed to delete vote' });
  }
});

module.exports = router;