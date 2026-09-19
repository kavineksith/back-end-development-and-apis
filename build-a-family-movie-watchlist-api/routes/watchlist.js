import express from "express";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
    getWatchlist,
    addMovie,
    updateMovie,
    deleteMovie,
} from "../utils/db.js";

const router = express.Router();

router.use(authenticate);

router.get("/:userId", (req, res) => {
    const userId = Number(req.params.userId);
    const watchlist = getWatchlist(userId);

    if (watchlist === null) {
        return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(watchlist);
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
    const userId = Number(req.params.userId);
    const movie = addMovie(userId, req.body ?? {});

    if (!movie) {
        return res.status(404).json({ error: "User not found." });
    }

    res.status(201).json(movie);
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);
    const updated = updateMovie(userId, movieId, req.body ?? {});

    if (!updated) {
        return res.status(404).json({ error: "Movie not found." });
    }

    res.status(200).json(updated);
});

router.delete(
    "/:userId/movies/:movieId",
    authorizeModification,
    (req, res) => {
        const userId = Number(req.params.userId);
        const movieId = Number(req.params.movieId);
        const deleted = deleteMovie(userId, movieId);

        if (!deleted) {
            return res.status(404).json({ error: "Movie not found." });
        }

        res.status(200).json({ success: true });
    },
);

export default router;