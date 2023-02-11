"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reminders_js_1 = __importDefault(require("./routers/reminders.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/reminders", reminders_js_1.default);
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.listen(8000, () => console.log("Server is running on port 8000. http://localhost:8000"));
