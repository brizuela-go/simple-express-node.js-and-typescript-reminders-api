import { Router, Request, Response } from "express";
import CreateReminderDTO from "../interfaces/CreateReminderDTO";
import Reminder from "../models/Reminder";

const router = Router();
const reminders = new Map<number, CreateReminderDTO>();
let nextId = 1;

const handleError = (res: Response, message: string) => {
  res.status(400).json({ message });
};

router.get("/", (req: Request, res: Response) => {
  res.json([...reminders.values()]);
});

router.post("/", (req: Request, res: Response) => {
  const { title } = req.body as CreateReminderDTO;
  if (!title || typeof title !== "string") {
    handleError(res, "Title is required and must be a string");
    return;
  }

  const reminder = new Reminder(nextId++, title);
  reminders.set(reminder.id, reminder);

  res.status(201).json(reminder);
});

router.get("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const reminder = reminders.get(id);

  if (!reminder) {
    handleError(res, "Reminder not found");
  } else {
    res.status(201).json(reminder);
  }
});

router.put("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const reminder = reminders.get(id);
  if (!reminder) {
    handleError(res, "Reminder not found");
    return;
  }

  const { title } = req.body as CreateReminderDTO;

  if (!title || typeof title !== "string") {
    handleError(res, "Title is required and must be a string");
    return;
  }

  reminder.title = title;
  res.status(201).json(reminder);
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (!reminders.delete(id)) {
    handleError(res, "Reminder not found");
    return;
  }

  res.status(204).send();
});

export default router;
