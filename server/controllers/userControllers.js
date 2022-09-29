const mysql = require("mysql");

//Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100000,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: "",
  database: process.env.MYSQL_DBNAME,
});

exports.getActivity = function (req, res) {
  if (req.params.id) {
    //ambil data by Id
    const id = req.params.id;
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("connected as ID " + connection.threadId);
      //User Connection
      connection.query(
        `SELECT * FROM activities WHERE id = ?`,
        [id],
        (err, rows) => {
          //When Done with the connection, release it
          connection.release();
          console.log("connection");

          if (!err) {
            res.send({
              status: "Success",
              message: "Success",
              data: rows,
            }); // rows, removedUser
          } else {
            console.log(err);
            res.send({
              status: "Not Found",
              message: `Activity with ID ${id} Not Found`,
              data: {},
            });
          }
          console.log("The data from user table: \n", rows);
        }
      );
    });
  } else {
    //ambil semua data
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("connected as ID " + connection.threadId);
      //User Connection
      connection.query(
        `SELECT * FROM activities WHERE deleted_at IS NULL`,
        (err, rows) => {
          //When Done with the connection, release it
          connection.release();

          if (!err) {
            res.send({
              status: "Success",
              message: "Success",
              data: rows,
            }); // rows, removedUser
          } else {
            console.log(err);
          }
          console.log("The data from user table: \n", rows);
        }
      );
    });
  }
};
exports.createActivity = function (req, res) {
  const { email, title } = req.body;
  const d = new Date();
  let created_at = d.toISOString();
  let id = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as ID " + connection.threadId);
    //User Connection
    connection.query(
      `INSERT INTO activities SET email =?, title = ?, created_at = ?,updated_at = ?`,
      [email, title, created_at, created_at],
      (err, rows1) => {
        //When Done with the connection, release it
        connection.release();

        if (!err) {
          connection.query(
            `SELECT * FROM activities WHERE email = ?,title = ?,deleted_at IS NULL`,
            [email, title],
            (err, rows) => {
              //When Done with the connection, release it
              connection.release();

              if (!err) {
                res.send({
                  status: "Success",
                  message: "Success",
                  data: rows,
                }); // rows, removedUser
              } else {
              }
            }
          );
        } else {
          console.log(err);
          res.send({
            status: "Bad Request",
            message: "title cannot be null",
            data: {},
          });
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};
exports.deleteActivity = function (req, res) {
  const d = new Date();
  let deleted_at = d.toISOString();
  let id = req.params.id;
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as ID " + connection.threadId);
    //User Connection
    connection.query(
      `UPDATE activities SET deleted_at = ? WHERE id = ? `,
      [deleted_at, req.params.id],
      (err, rows) => {
        //When Done with the connection, release it
        connection.release();

        if (!err) {
          res.send({
            status: "Success",
            message: "Success",
            data: {},
          });
        } else {
          res.send({
            status: "Not Found",
            message: `Activity with ID ${id} Not Found`,
            data: {},
          });
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};
exports.updateActivity = function (req, res) {
  const { title } = req.body;
  const d = new Date();
  let updated_at = d.toISOString();
  let id = req.params.id;
  if (id) {
    if (title) {
      // Connect to DB
      pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("connected as ID " + connection.threadId);
        //User Connection
        connection.query(
          `UPDATE activities SET title = ?, updated_at = ? WHERE id = ? `,
          [title, updated_at, req.params.id],
          (err, rows) => {
            //When Done with the connection, release it
            connection.release();

            if (!err) {
              res.send({
                status: "Success",
                message: "Success",
                data: rows,
              });
            } else {
              res.send({
                status: "Not Found",
                message: `Activity with ID ${id} Not Found`,
                data: {},
              });
              console.log(err);
            }
            console.log("The data from user table: \n", rows);
          }
        );
      });
    } else {
      res.send({
        status: "Bad Request",
        message: "title cannot be null",
        data: {},
      });
    }
  } else {
    res.send({
      status: "Not Found",
      message: `Activity with ID ${id} Not Found`,
      data: {},
    });
  }
};

exports.getTodoItems = function (req, res) {
  if (req.query.id) {
    //ambil data by Id
    const id = req.query.id;
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("connected as ID " + connection.threadId);
      //User Connection
      connection.query(`SELECT * FROM todos WHERE id = ${id}`, (err, rows) => {
        //When Done with the connection, release it
        connection.release();

        if (!err) {
          res.send({
            status: "Success",
            message: "Success",
            data: rows,
          });
        } else {
          console.log(err);
          res.send({
            status: "Not Found",
            message: `Activity with ID ${id} Not Found`,
            data: {},
          });
        }
        console.log("The data from GETbyID user table: \n", rows);
      });
    });
  } else {
    //ambil semua data
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("connected as ID " + connection.threadId);
      //User Connection
      connection.query(
        `SELECT * FROM todos WHERE deleted_at IS NULL`,
        (err, rows) => {
          //When Done with the connection, release it
          connection.release();

          if (!err) {
            res.send({
              status: "Success",
              message: "Success",
              data: rows,
            }); // rows, removedUser
          } else {
            console.log(err);
          }
          console.log("The data from GETAll user table: \n", rows);
        }
      );
    });
  }
};
exports.createTodoItems = function (req, res) {
  const { activity_group_id, title, is_active, priority } = req.body;
  const d = new Date();
  let created_at = d.toISOString();
  let id = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as ID " + connection.threadId);
    //User Connection
    connection.query(
      `INSERT INTO todos SET activity_group_id =?, title = ?, is_active = ?, priority = ?, created_at = ?,updated_at = ?`,
      [
        activity_group_id,
        title,
        is_active,
        priority,
        created_at,
        created_at,
        is_active,
        priority,
      ],
      (err, rows1) => {
        //When Done with the connection, release it
        connection.release();

        if (!err) {
          connection.query(
            `SELECT * FROM todos WHERE activity_group_id = ?,title = ?,is_active = ?, priority = ?,deleted_at IS NULL`,
            [activity_group_id, title, , is_active, priority],
            (err, rows) => {
              //When Done with the connection, release it
              connection.release();

              if (!err) {
                res.send({
                  status: "Success",
                  message: "Success",
                  data: rows,
                }); // rows, removedUser
              } else {
              }
              console.log("The data from CREATED user table: \n", rows);
            }
          );
        } else {
          console.log(err);
          res.send({
            status: "Bad Request",
            message: "title cannot be null",
            data: {},
          });
        }
      }
    );
  });
};
exports.deleteTodoItems = function (req, res) {
  const d = new Date();
  let deleted_at = d.toISOString();
  let id = req.params.id;
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as ID " + connection.threadId);
    //User Connection
    connection.query(
      `UPDATE todos SET deleted_at = ? WHERE id = ? `,
      [deleted_at, req.params.id],
      (err, rows) => {
        //When Done with the connection, release it
        connection.release();

        if (!err) {
          res.send({
            status: "Success",
            message: "Success",
            data: {},
          });
        } else {
          res.send({
            status: "Not Found",
            message: `Activity with ID ${id} Not Found`,
            data: {},
          });
          console.log(err);
        }
        console.log("The data from DELETED user table: \n", rows);
      }
    );
  });
};
exports.updateTodoItems = function (req, res) {
  const { title } = req.body;
  const d = new Date();
  let updated_at = d.toISOString();
  let id = req.params.id;
  if (id) {
    if (title) {
      // Connect to DB
      pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("connected as ID " + connection.threadId);
        //User Connection
        connection.query(
          `UPDATE todos SET title = ?, updated_at = ? WHERE id = ? `,
          [title, updated_at, req.params.id],
          (err, rows) => {
            //When Done with the connection, release it
            connection.release();

            if (!err) {
              res.send({
                status: "Success",
                message: "Success",
                data: rows,
              });
            } else {
              res.send({
                status: "Not Found",
                message: `Activity with ID ${id} Not Found`,
                data: {},
              });
              console.log(err);
            }
            console.log("The data from user table: \n", rows);
          }
        );
      });
    } else {
      res.send({
        status: "Bad Request",
        message: "title cannot be null",
        data: {},
      });
    }
  } else {
    res.send({
      status: "Not Found",
      message: `Activity with ID ${id} Not Found`,
      data: {},
    });
  }
};
