const express = require("express");
const routes = express();
const userControllers = require("../controllers//userControllers");

routes.get("/", (req, res) => {
  res.send("Hai, ini API NodeJS dari Faiz Muttaqin");
});

routes.get("/activity-groups", userControllers.getActivity);
routes.get("/activity-groups/:id", userControllers.getActivity);
routes.post("/activity-groups/", userControllers.createActivity);
routes.delete("/activity-groups/:id", userControllers.deleteActivity);
routes.patch("/activity-groups/:id", userControllers.updateActivity);

routes.get("/todo-items", userControllers.getTodoItems);
routes.get("/todo-items/:id", userControllers.getTodoItems);
routes.post("/todo-items/", userControllers.createTodoItems);
routes.delete("/todo-items/:id", userControllers.deleteTodoItems);
routes.patch("/todo-items/:id", userControllers.updateTodoItems);

module.exports = routes;
