const mongoose = require("mongoose");
const Session = require("../models/Session");
const Question = require("../models/Question");

exports.createSession = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, description, questions } = req.body;
        const userId = req.user._id;

        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description,
        });

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer,
                });
                return question._id;
            })
        );

        session.questions = questionDocs;
        await session.save();

        res.status(201).json({ success: true, session });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error "});
    }
};

/*exports.getMySessions = async ( req, res) => {
    try {
        const sessions = await Session.find({ user: req.user.id })
         .sort({ createdAt: -1 })
         .populate("questions");
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error "});
    }
};*/

/*exports.getMySessions = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized - No user info" });
    }

    console.log("getMySessions - user ID:", req.user.id);

    const sessions = await Session.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("questions");

    res.status(200).json(sessions);
  } catch (error) {
    console.error("getMySessions error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};*/

exports.getMySessions = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      console.log("req.user missing in getMySessions");
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Authenticated user ID:", req.user._id);

    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("questions");

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error in getMySessions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



/*exports.getSessionById = async (req, res) => {
    try {
       const session = await Session.findById(req.params.id)
        .populate({
            path: "questions",
            options: { sort: { isPinned: -1, createdAt: 1 } },
        })
        .exec();
        
    if(!session){
        return res
         .status(404)
         .json({ success: false, message: "Session not found" });
    }

    res.status(200).json({ success: true, session });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error "});
    }
};*/

/*exports.getSessionById = async (req, res) => {
  try {
    console.log("Fetching session by ID:", req.params.id);

    const session = await Session.findById(req.params.id).populate({
      path: "questions",
      options: { sort: { isPinned: -1, createdAt: 1 } },
    });

    if (!session) {
      console.log("Session not found");
      return res.status(404).json({ message: "Session not found" });
    }

    console.log("Session found:", session._id);
    res.status(200).json({ session });

  } catch (error) {
    console.error("Error in getSessionById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};*/

exports.getSessionById = async (req, res) => {
  try {
    const sessionId = req.params.id;
    console.log("Fetching session by ID:", sessionId);

    // Validate session ID
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      console.log("Invalid session ID format");
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const session = await Session.findById(sessionId).populate({
      path: "questions",
      options: { sort: { isPinned: -1, createdAt: 1 } },
    });

    if (!session) {
      console.log("Session not found");
      return res.status(404).json({ message: "Session not found" });
    }

    console.log("Session found:", session._id);
    res.status(200).json({ session });

  } catch (error) {
    console.error("Error in getSessionById:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
};

exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if(!session){
            return res.status(404).json({ message: "Session not found" });
        }
        if(session.user.toString() !== req.user.id){
            return res
             .status(401)
             .json({ message: "Not authorized to delete this session" });
        }

        await Question.deleteMany({ session: session._id });
        await session.deleteOne();
        res.status(200).json({ message: "Session deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error "});
    }
};