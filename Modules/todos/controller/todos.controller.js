import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllTodos = async (req, res) => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving todos" });
  }
};

export const createTodos = async (req, res) => {
  try {
    const { todos } = req.body;

    const createdTodos = await Promise.all(
      todos.map(async (todo) => {
        try {
          const createdTodo = await prisma.todo.create({
            data: {
              title: todo.title,
              user: {
                connect: {
                  id: todo.userId, // Use the appropriate property (id, userName, or email) to uniquely identify the user
                },
              },
            },
          });
          return createdTodo;
        } catch (error) {
          console.error(error);
          throw error; // Rethrow the error to be caught by the outer catch block
        }
      })
    );

    res.json(createdTodos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating todos' });
  }
};
