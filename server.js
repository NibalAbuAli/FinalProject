
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();
const mysql = require('mysql2');
const { connect } = require('http2');

const app = express();
const port = 3004;



app.use(session({
    secret: process.env.SESSION_SECRET || 'fallbacksecret',
    resave: true,
    saveUninitialized: true
}));




const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'hcaha2',
    insecureAuth: true ,
  });

  connection.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL:', error);
      return;
    }
    console.log('Connected to MySQL');
  });
  
  // Middleware to parse incoming request bodies
  app.use(bodyParser.urlencoded({ extended: true }));
  



app.use(express.static ("public"));

app.get('/index.html', (req, res) => {
    // write code here to send the response back to the client
    res.status(200).send({message:"Welcome to our API"})

    });
    app.get('/about',(req,res)=>{
        
    })
app.get('/register',(req,res)=>{
    
});

app.get('/adminpage',(req,res)=>{


});

app.get('/loan-request',(req,res)=>{


});

app.get('/Adminlogin.html',(req,res)=>{


});
app.get('/Managerlogin.html',(req,res)=>{


});

app.get('/Memberslogin.html',(req,res)=>{


});

app.get('/Donorslogin.html',(req,res)=>{


});

app.get('/thanks.html',(req,res)=>{

});
// Handle manager login 
app.post('/sign-in-manager', (req, res) => {
  const { username, password  } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password_ = ?';
  connection.query(query, [username, password], (err, results) => {
      if (err) {
          console.error('MySQL query error:', err);
          res.status(500).send('Internal Server Error');
          return;
      }

      if (results.length > 0) {   
          const user = results[0];
          res.redirect('/manager.html');
      } else {
          // Incorrect   or password
          res.status(401).send('Invalid credentials');
      }
  });
});


// Handle admin login 
app.post('/sign-in-admin', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password_ = ?';
  connection.query(query, [username, password], (err, results) => {
      if (err) {
          console.error('MySQL query error:', err);
          res.status(500).send('Internal Server Error');
          return;
      }

      if (results.length > 0) {
          const user = results[0];
          res.redirect('/adminpage.html');
      } else {
          // Incorrect username or password
          res.status(401).send('Invalid credentials :Incorrect username or password');
      }
  });
});




 // Handle Members registration form submission
app.post('/submit-form', (req, res) => {
  const { username, email, password,userType } = req.body;

  // Insert data into the 'new_users' table
  const insertQuery = 'INSERT  INTO users (username, email, password_,role) VALUES (?, ?, ?,?)';
  connection.query(insertQuery, [username, email, password,userType], (err, results) => {
      if (err) {
          console.error('MySQL query error:', err);
          res.status(500).send('Internal Server Error:username or email have been used');
          return;
      }

      // Registration successful
      console.log('Registration successful');
      res.redirect('/thanks.html');
      
  });
});  

// Handle member login form submission
app.post('/sign-in', (req, res) => {
  const { username, password } = req.body;

  // Check credentials in the 'members' table
  const query = 'SELECT * FROM users WHERE username = ? AND password_ = ?';
  connection.query(query, [username, password], (err, results) => {
      if (err) {
          console.error('MySQL query error:', err);
          res.status(500).send('Internal Server Error');
          return;
      }


      if (results.length > 0) {
        const user = results[0];
        if (user.role === 'Admin') {
            // Redirect to admin page
            res.redirect('/adminpage.html');
        } else if (user.role === 'Member') {
            // Redirect to member page
            res.redirect('/views/member.html');
        } else if (user.role === 'Manager') {
          // Redirect to member page
          res.redirect('/manager.html');
      } else if (user.role === 'Donor') {
        // Redirect to member page
        res.redirect('/donors.html');
    } 
        
        
        
        else {
            // Handle other roles if needed
            res.status(403).send('Forbidden');
        }
    } else {
        // Incorrect username or password
        res.status(401).send('Invalid credentials');
    }
}); 
});
 // Handle Donors registration form submission
 app.post('/submit-form-donor', (req, res) => {
  const { username, email, password,userType }= req.body;

  // Insert data into the 'new_users' table
  const insertQuery = 'INSERT INTO users (username, email, password_,role) VALUES (?, ?, ?,?)';
  connection.query(insertQuery, [username, email, password,userType], (err, results) => {
      if (err) {
          console.error('MySQL query error:', err);
          res.status(500).send('Internal Server Error');
          return;
      }

      // Registration successful
      res.send('Registration successful');
  });
});  
// Handle member login form submission
app.post('/sign-in-donor', (req, res) => {
  const { username, password } = req.body;

  // Check credentials in the 'members' table
  const query = 'SELECT * FROM users WHERE username = ? AND password_ = ?';
  connection.query(query, [username, password], (err, results) => {
      if (err) {
          console.error('MySQL query error:', err);
          res.status(500).send('Internal Server Error');
          return;
      }

      if (results.length > 0) {
          const user = results[0];
          res.redirect('/donor.html');
      } else {
          // Incorrect username or password
          res.status(401).send('Invalid credentials');
      }
  });
});







// Handle form submission
app.post('/dataForm1', (req, res) => {
  const formData = req.body;

  // Insert form data into the database
  const sql = `
    INSERT INTO members (membership_id, FullName, Birthdate, BirthAddress, address, Qualification, 
      CollegeName, CollegeYear, Specialization, Nationality, MemberID, MaterialStatus, Gender, 
      PhoneNumber, CurrentCareer, CareerAddress, join_date, is_active) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    formData.membership_id,
    formData.member_name,
    formData.member_Birthdate,
    formData.member_Birthaddress,
    formData.member_address,
    formData.member_Qualification,
    formData.member_CollegeName,
    formData.member_CollegeYear,
    formData.member_Specialization,
    formData.member_Nationality,
    formData.member_MemberID,
    formData.MaterialStatus,
    formData.Gender,
    formData.member_phone,
    formData.CurrentCareer,
    formData.CareerAddress,
    formData.MembershipDate,
    formData.is_active ? 1 : 0,
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data: ' + err.message);
      res.status(500).send('Internal Server Error:Duplicate entry or Insert Wrong values');
      return;
    }

    console.log('Data inserted successfully');
  
    res.redirect('/accept-requests.html')
  });
});


 // Define a route for form submission
app.post('/process_aid', (req, res) => {
  const { student_id, member_id, type, quantity, date } = req.body;

  // Insert data into the database
  const sql = 'INSERT INTO aid(student_id, member_id, type, quantity, date) VALUES (?, ?, ?, ?, ?)';
  const values = [student_id, member_id, type, quantity, date];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Data inserted successfully:', result);
      res.send('Aid request submitted successfully');
    }
  });
});


// Handle form submissions
app.post('/submit_loan_request', (req, res) => {

    const {
      member_id,
      full_name,
      mobile,
      provider_name,
      provider_occupation,
      provider_phone,
      family_size,
      family_employees,
      monthly_income,
      loan_amount,
      services_history,
      received_services
    } = req.body;
  
    const sql = `INSERT INTO educational_loan_requests(member_id, full_name, mobile, provider_name, provider_occupation, provider_phone, family_size,family_employees, monthly_income, loan_amount,services_history, received_services)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
  
    connection.query(
      sql,
      [
        member_id,
      full_name,
      mobile,
      provider_name,
      provider_occupation,
      provider_phone,
      family_size,
      family_employees,
      monthly_income,
      loan_amount,
      services_history,
      received_services
      ],
      (err, results) => {
        if (err) {
          console.error('Error inserting data:', err);
          res.status(500).send('Error submitting loan request');
        } else {
          console.log('Data inserted successfully'); 
          res.redirect('/accept-requests.html')
        }
      }
    );
  });
  



  app.post('/submit_loan_request', (req, res) => {
    const { student_name_1, university_1, major_1, gpa_1,academic_level_1,semester_fee_1,notes_1,
      student_name_2, university_2, major_2, gpa_2,academic_level_2,semester_fee_2,notes_2,
      student_name_3, university_3, major_3, gpa_3,academic_level_3,semester_fee_3,notes_3
    } = req.body;
  
    const sql = `INSERT INTO StudentData (student_name,university,major,gpa,academic_level,semester_fee,notes,
        id, student_name,university,major,gpa,academic_level,semester_fee,notes,
        id, student_name,university,major,gpa,academic_level,semester_fee,notes)
      VALUES (?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?
        ?,?,?,?,?,?,?,?)`;
  
   
        connection.query(
          sql,
          [
            student_name_1, university_1, major_1, gpa_1,academic_level_1,semester_fee_1,notes_1,
            student_name_2, university_2, major_2, gpa_2,academic_level_2,semester_fee_2,notes_2,
            student_name_3, university_3, major_3, gpa_3,academic_level_3,semester_fee_3,notes_3
          ],
          (err, results) => {
            if (err) {
              console.error('Error inserting data:', err);
              res.status(500).send('Error submitting loan request');
            } else {
              console.log('Data inserted successfully'); 
              res.send('Loan request submitted');
            }
          }
        );
      });
      

// Handle form submission
app.post('/process_invoice', (req, res) => {
  const { member_id, amount, date, due_date, status } = req.body;

  // Perform database query here (INSERT into your invoice table)
  const sql = `INSERT INTO subscription_invoice (member_id, amount, issue_date, due_date, status) VALUES (?, ?, ?, ?, ?)`;
  const values = [member_id, amount, date, due_date, status];

  connection.query(sql, values, (err, result) => {
    if (err) throw err;
    console.log('Invoice created successfully');
    res.send('Invoice created successfully');
  });
}); 

// GET all invoices
app.get('/get_invoices', (req, res) => {
  connection.query('SELECT * FROM subscription_invoice', (err, results) => {
    if (err) {
      console.error('Error retrieving data: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
}); 

app.post('/newInvoiceForm', (req, res) => {
  const { invoice_name, amount, date, note, status } = req.body;

  // Perform database query here (INSERT into your invoice table)
  const sql = `INSERT INTO expenses (category, amount,date, description,status) VALUES (?, ?, ?, ?, ?)`;
  const values = [invoice_name, amount, date, note, status];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data: ' + err.message);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Data inserted successfully');
 res.redirect('accept-requests.html')
  });
});
 

app.get('/get_ newinvoices', (req, res) => {
  connection.query('SELECT * FROM expenses', (err, results) => {
    if (err) {
      console.error('Error retrieving data: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
}); 



app.post('/empolyeeForm', (req, res) => {
  const { manager_name, job_title, email} = req.body;

  // Perform database query here (INSERT into your invoice table)
  const sql = `INSERT INTO employees (name, email,position) VALUES (?, ?, ?)`;
  const values = [manager_name, job_title, email];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data: ' + err.message);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Data inserted successfully');
 res.redirect('adminpage.html');
  });
});


app.get('/get_empolyeeForm', (req, res) => {
 // Query the database for the data
 connection.query('SELECT * FROM employees', (err, rows) => {
  if (err) throw err;

  // Send the data as a JSON response
  res.json(rows);
});
}); 


// Save manager data
app.post('/save-manager', async (req, res) => {
  try {
    const manager = new Manager(req.body);
    await manager.save();
    res.json(manager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete manager
app.delete('/delete-manager/:id', async (req, res) => {
  try {
    await Manager.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update manager
app.put('/update-manager/:id', async (req, res) => {
  try {
    const manager = await Manager.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(manager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


  app.get('/financial-boxes', (req, res) => {
    connection.query('SELECT * FROM financial_boxes', (err, results) => {
      if (err) {
        throw err;
      }
      res.json(results);
    });
  });
  
  app.get('/payments', (req, res) => {
    connection.query('SELECT * FROM payments', (err, results) => {
      if (err) {
        throw err;
      }
      res.json(results);
    });
  });
  

  app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
  
