import { Router } from "express";
import { getAllTodos, createTodos } from "./controller/todos.controller.js";


const router = Router();


router.get("/getTodos",getAllTodos)
router.post("/createTodos",createTodos)

export default router;