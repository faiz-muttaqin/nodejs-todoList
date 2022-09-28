const mysql = require("mysql");

//Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DBNAME,
});

exports.getActivity = function (req, res) {
  if (req.query.id) {
    //ambil data by Id
    const id = req.query.id;
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("connected as ID " + connection.threadId);
      //User Connection
      connection.query(
        `SELECT * FROM activity WHERE id = ${id}`,
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
        `SELECT * FROM activity WHERE deleted_at = null`,
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
  const { email, title, createdAt } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as ID " + connection.threadId);
    //User Connection
    connection.query(
      `INSERT INTO activity SET email =?, title = ?, created_at = ?,updated_at = ?`,
      [email, title, createdAt, createdAt],
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
      `UPDATE activity SET deleted_at = ? WHERE id = ? `,
      [deleted_at, req.params.id],
      (err, rows) => {
        //When Done with the connection, release it
        connection.release();

        if (!err) {
          res.send({ alert: "user sucesfully removed" });
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
          `UPDATE activity SET title = ?, updated_at = ? WHERE id = ? `,
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
      connection.query(`SELECT * FROM todo WHERE id = ${id}`, (err, rows) => {
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
        console.log("The data from user table: \n", rows);
      });
    });
  } else {
    //ambil semua data
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("connected as ID " + connection.threadId);
      //User Connection
      connection.query(
        `SELECT * FROM todo WHERE deleted_at = null`,
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
exports.createTodoItems = function (req, res) {};
exports.deleteTodoItems = function (req, res) {};
exports.updateTodoItems = function (req, res) {};
