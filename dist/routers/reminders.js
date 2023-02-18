"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Reminder_js_1 = __importDefault(require("../models/Reminder.js"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
//////////////////////////////////////////////
// WITHOUT DATABASE
// const handleError = (res: Response, message: string) => {
//   res.status(400).json({ message });
// };
// router.get("/", (req: Request, res: Response) => {
//   res.json([...reminders.values()]);
// });
// router.post("/", (req: Request, res: Response) => {
//   const { title } = req.body as CreateReminderDTO;
//   if (!title || typeof title !== "string") {
//     handleError(res, "Title is required and must be a string");
//     return;
//   }
//   const reminder = new Reminder(title, false);
//   reminders.set(reminder.id, reminder);
//   res.status(201).json(reminder);
// });
// router.get("/:id", (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   const reminder = reminders.get(id);
//   if (!reminder) {
//     handleError(res, "Reminder not found");
//   } else {
//     res.status(201).json(reminder);
//   }
// });
// router.put("/:id", (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   const reminder = reminders.get(id);
//   if (!reminder) {
//     handleError(res, "Reminder not found");
//     return;
//   }
//   const { title } = req.body as CreateReminderDTO;
//   if (!title || typeof title !== "string") {
//     handleError(res, "Title is required and must be a string");
//     return;
//   }
//   reminder.title = title;
//   res.status(201).json(reminder);
// });
// router.delete("/:id", (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   if (!reminders.delete(id)) {
//     handleError(res, "Reminder not found");
//     return;
//   }
//   res.status(204).send();
// });
//////////////////////////////////////////////
// WITH DATABASE (MONGODB) using Mongoose 🍃
// Middleware to get a reminder by ID
async function getReminder(req, res, next) {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res
                .status(404)
                .json({ message: "Reminder ID must be at least 24 characters long" });
            return;
        }
        const reminder = await Reminder_js_1.default.findById(id);
        if (!reminder) {
            res.status(404).json({ message: "Reminder not found" });
        }
        else {
            res.locals.reminder = reminder;
            next();
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
}
// Check if valid api key
router.use((req, res, next) => {
    const { api_key } = req.query;
    if (api_key !== process.env.API_KEY) {
        res.status(401).json({ message: "Unauthorized. Invalid API key" });
        return;
    }
    next();
});
// Get all reminders
router.get("/", async (req, res) => {
    try {
        const reminders = await Reminder_js_1.default.find();
        res.json(reminders);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
});
// Get reminder by id
router.get("/:id", getReminder, (req, res) => {
    res.json(res.locals.reminder);
});
// Create reminder
router.post("/", async (req, res) => {
    const { title } = req.body;
    if (!title || typeof title !== "string") {
        res.status(400).json({ message: "Title is required and must be a string" });
        return;
    }
    try {
        const reminder = new Reminder_js_1.default({ title });
        await reminder.save();
        res.status(201).json(reminder);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
});
// Update reminder title
router.put("/:id", getReminder, async (req, res) => {
    const { title } = req.body;
    if (!title || typeof title !== "string") {
        res.status(400).json({ message: "Title is required and must be a string" });
        return;
    }
    try {
        const reminder = res.locals.reminder;
        reminder.title = title;
        await reminder.save();
        res.json(reminder);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
});
// Remove reminder
router.delete("/:id", getReminder, async (req, res) => {
    try {
        const reminder = res.locals.reminder;
        await reminder.remove();
        res.status(204).send();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
});
// Mark as completed or not
router.patch("/:id", getReminder, async (req, res) => {
    try {
        const reminder = res.locals.reminder;
        reminder.isCompleted = !reminder.isCompleted;
        await reminder.save();
        res.json(reminder);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
});
exports.default = router;
