const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Create a new movie
router.post('/', async (req, res) => {
    try {
      const movie = new Movie(req.body);
      await movie.save();
      res.status(201).send(movie);
    } catch (error) {
      res.status(400).send(error);
    }
  });


// Read all movies
router.get('/', async (req, res) => {
    try {
      const movies = await Movie.find();
      res.status(200).send(movies);
    } catch (error) {
      res.status(500).send(error);
    }
  });

//   / Read a single movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    res.status(200).send(movie);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a movie by ID
router.patch('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    res.status(200).send(movie);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a movie by ID
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    res.status(200).send('Movie deleted');
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;