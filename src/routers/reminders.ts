import { Router, Request, Response, NextFunction } from "express";
import Reminder from "../models/Reminder.js";
import IReminder from "../interfaces/IReminder.js";
import mongoose from "mongoose";

const router = Router();

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
async function getReminder(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res
        .status(404)
        .json({ message: "Reminder ID must be at least 24 characters long" });
      return;
    }
    const reminder = await Reminder.findById(id);
    if (!reminder) {
      res.status(404).json({ message: "Reminder not found" });
    } else {
      res.locals.reminder = reminder;
      next();
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
}

// Check if valid api key
router.use((req: Request, res: Response, next: NextFunction) => {
  const { api_key } = req.query;
  if (api_key !== process.env.API_KEY) {
    res.status(401).json({ message: "Unauthorized. Invalid API key" });
    return;
  }
  next();
});

// Get all reminders
router.get("/", async (req: Request, res: Response) => {
  try {
    const reminders: IReminder[] = await Reminder.find();
    res.json(reminders);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
});

// Get reminder by id
router.get("/:id", getReminder, (req: Request, res: Response) => {
  res.json(res.locals.reminder);
});

// Create reminder
router.post("/", async (req: Request, res: Response) => {
  const { title } = req.body as IReminder;

  if (!title || typeof title !== "string") {
    res.status(400).json({ message: "Title is required and must be a string" });
    return;
  }

  try {
    const reminder = new Reminder({ title });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
});

// Update reminder title
router.put("/:id", getReminder, async (req: Request, res: Response) => {
  const { title } = req.body as IReminder;
  if (!title || typeof title !== "string") {
    res.status(400).json({ message: "Title is required and must be a string" });
    return;
  }

  try {
    const reminder = res.locals.reminder as IReminder;
    reminder.title = title;
    await reminder.save();
    res.json(reminder);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
});

// Remove reminder
router.delete("/:id", getReminder, async (req: Request, res: Response) => {
  try {
    const reminder = res.locals.reminder as IReminder;
    await reminder.remove();
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
});

// Mark as completed or not
router.patch("/:id", getReminder, async (req: Request, res: Response) => {
  try {
    const reminder = res.locals.reminder as IReminder;
    reminder.isCompleted = !reminder.isCompleted;
    await reminder.save();
    res.json(reminder);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
});

export default router;
