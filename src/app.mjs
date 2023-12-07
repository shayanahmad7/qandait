import './config.mjs'
import mongoose from 'mongoose'
import express from 'express'
import Question from './db.mjs'
import url from 'url'
import path from 'path'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const app = express()

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.json());

// POST route for adding a new question
app.post('/questions/', async (req, res) => {
  try {
    const newQuestion = new Question({
      question: req.body.question,
      answers: [] // Initially empty
    });
    const savedQuestion = await newQuestion.save();
    res.json(savedQuestion);
  } catch (e) {
    res.status(500).json({ error: 'Failed to add question' });
  }
})
// POST route for adding a new answer to a question
app.post('/questions/:id/answers/', async (req, res) => {
  try {
    const questionId = req.params.id;
    const answer = req.body.answer;
    const result = await Question.findByIdAndUpdate(questionId, {
      $push: { answers: answer }
    }, { new: true });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: 'Failed to add answer' });
  }
});
// GET route for fetching all questions
app.get('/questions/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

const port = process.env.PORT || 3000
app.listen(port, () => {console.log(`Server is listening on ${port}`)})

