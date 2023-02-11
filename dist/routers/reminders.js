"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Reminder_js_1 = __importDefault(require("../models/Reminder.js"));
const router = (0, express_1.Router)();
const reminders = new Map();
let nextId = 1;
const handleError = (res, message) => {
    res.status(400).json({ message });
};
router.get("/", (req, res) => {
    res.json([...reminders.values()]);
});
router.post("/", (req, res) => {
    const { title } = req.body;
    if (!title || typeof title !== "string") {
        handleError(res, "Title is required and must be a string");
        return;
    }
    const reminder = new Reminder_js_1.default(nextId++, title);
    reminders.set(reminder.id, reminder);
    res.status(201).json(reminder);
});
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const reminder = reminders.get(id);
    if (!reminder) {
        handleError(res, "Reminder not found");
    }
    else {
        res.status(201).json(reminder);
    }
});
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const reminder = reminders.get(id);
    if (!reminder) {
        handleError(res, "Reminder not found");
        return;
    }
    const { title } = req.body;
    if (!title || typeof title !== "string") {
        handleError(res, "Title is required and must be a string");
        return;
    }
    reminder.title = title;
    res.status(201).json(reminder);
});
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (!reminders.delete(id)) {
        handleError(res, "Reminder not found");
        return;
    }
    res.status(204).send();
});
exports.default = router;
