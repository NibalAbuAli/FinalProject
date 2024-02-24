
const express = require('express');
const { check, validationResult } = require('express-validator');
const flash = require("express-flash");
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { connect } = require('http2');

const app = express();
const port = 3001;



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
app.set('view engine', 'ejs');
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: false }));

app.post('/reset-password', async (req, res) => {
  const email = req.body.email;
  const newPassword = req.body.new_password;
  const confirmPassword = req.body.confirm_password;

  // Check if new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.status(400).send('New password and confirm password do not match');
  }

  // Hash the new password
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(newPassword, saltRounds, (err, hash) => {
      if (err) {
        return reject(err);
      }
      resolve(hash);
    });
  });

  app.get('/error', (req, res) => {
    const errors = req.query.errors; // يتم استخدام هذا الطريقة للحصول على البيانات المرسلة بواسطة العميل في عنوان الرابط
    
    res.render('error_view', { errors });
  });
  

  // Update the user's password in the database
  // Replace the following line with your own database query
  // For example, you might use a library like Sequelize or Mongoose
  const sql = 'UPDATE users SET password = ? WHERE email = ?';
  connection.query(sql, [hashedPassword, email], (err, result) => {
    if (err) {
      console.error('Error updating password:', err);
      return res.status(500).send('Error updating password');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    res.send('Password reset successful');
  });
});

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

app.get('/loan_invoice',(req,res)=>{


});

app.get('/Adminlogin.html',(req,res)=>{


});
app.get('/Managerlogin.html',(req,res)=>{


});

app.get('/public/adminpage.html',(req,res)=>{


});


app.get('/Memberslogin.html',(req,res)=>{


});
app.get('/donors.html',(req,res)=>{


});
app.get('/member.html',(req,res)=>{

});

app.get('/manager.html',(req,res)=>{


});

app.get('/Donorslogin.html',(req,res)=>{


});

app.get('/thanks.html',(req,res)=>{

});

app.get('/studentForm1',(req,res)=>{

});

app.get('/membershiprequest.ejs',(req,res)=>{

});
app.get('/loan_request_form.ejs',(req,res)=>{

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
            res.redirect('/adminpage.html');
        } else if (user.role === 'Member') {
           res.redirect('/member.html');
        } else if (user.role === 'Manager') {
          res.redirect('/manager.html');
      } else if (user.role === 'Donor') {
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
            res.redirect('/adminpage.html');
        } else if (user.role === 'Member') {
           res.redirect('/member.html');
        } else if (user.role === 'Manager') {
          res.redirect('/manager.html');
      } else if (user.role === 'Donor') {
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



app.post('/submit-loan-repayment', (req, res) => {
  const { payment_date, amount, currency, payment_method, description, notes } = req.body;

  const sql = 'INSERT INTO payments (payment_date, amount, currency, payment_method, description, notes) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [payment_date, amount, currency, payment_method, description, notes];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error inserting data');
      return;
    }

    res.status(200).send('Data inserted successfully');
  });
});




// Handle form submission
app.post('/dataForm1',(req, res) => {
    const formData = req.body;
    const currentYear = new Date().getFullYear();
    
    let errors = {};
    const {
      member_name,
      member_Birthdate,
      member_Birthaddress,
      member_address,
      member_CollegeName,
      member_CollegeYear,
      member_Specialization,
      member_Nationality,
      member_MemberID,
      PhoneNumber,
      CurrentCareer,
      CareerAddress,
      MembershipDate,
      is_active
    } = req.body;
    

    // فحص حقل الاسم الكامل
if (!member_name) {
  errors.member_name = 'الرجاء إدخال الاسم الكامل';
} else if (!member_name.match(/^[\u0600-\u06FF\s]+$/)) {
  errors.member_name = 'يجب أن يحتوي الاسم الكامل على نص عربي فقط';
}

// فحص حقل تاريخ الميلاد
if (!member_Birthdate) {
  errors.member_Birthdate = 'الرجاء إدخال تاريخ الولادة ';
} else if (new Date(member_Birthdate) > new Date()) {
  errors.member_Birthdate = 'تاريخ الولادة الميلاد يجب ألا يكون في المستقبل';
}



// فحص حقل مكان الميلاد
if (!member_Birthaddress) {
  errors.member_Birthaddress = 'الرجاء إدخال مكان الميلاد';
} else if (!member_Birthaddress.match(/^[\u0600-\u06FF\s]+$/)) {
  errors.member_Birthaddress = 'يجب أن يحتوي مكان الميلاد على نص عربي فقط';
}

// فحص حقل العنوان
if (!member_address) {
  errors.member_address = 'الرجاء إدخال العنوان';
} else if (!member_address.match(/^[\u0600-\u06FF\s]+$/)) {
  errors.member_address = 'يجب أن يحتوي العنوان على نص عربي فقط';
}

// فحص حقل اسم المعهد/الجامعة
if (!member_CollegeName) {
  errors.member_CollegeName = 'الرجاء إدخال اسم المعهد/الجامعة';
} else if (!member_CollegeName.match(/^[\u0600-\u06FF\s]+$/)) {
  errors.member_CollegeName = 'يجب أن يحتوي اسم المعهد/الجامعة على نص عربي فقط';
}

// فحص حقل سنة التخرج
if (!member_CollegeYear) {
  errors.member_CollegeYear = 'الرجاء إدخال سنة التخرج';
} else if (member_CollegeYear < 1900 || member_CollegeYear > currentYear
  || !Number.isInteger(parseInt(member_CollegeYear))) {
  errors.member_CollegeYear = 'يجب أن تكون سنة التخرج بين عام 1900 والسنة الحالية';
}

// فحص حقل التخصص
if (!member_Specialization) {
  errors.member_Specialization = 'الرجاء إدخال التخصص';
} else if (!member_Specialization.match(/^[\u0600-\u06FF\s]+$/)) {
  errors.member_Specialization = 'يجب أن يحتوي التخصص على نص عربي فقط';
}

// فحص حقل الجنسية
if (!member_Nationality) {
  errors.member_Nationality = 'الرجاء إدخال الجنسية';
} else if (!member_Nationality.match(/^[\u0600-\u06FF\s]+$/)) {
  errors.member_Nationality = 'يجب أن تحتوي الجنسية على نص عربي فقط';
}

// فحص حقل الجنسية
if (!member_Nationality) {
  errors.member_Nationality = 'الرجاء إدخال الجنسية';
} else if (!member_Nationality.match(/^[\u0600-\u06FF\s]+$/)) {
  errors.member_Nationality = 'يجب أن تحتوي الجنسية على نص عربي فقط';
}

// فحص حقل الهاتف
if (!PhoneNumber) {
  errors.PhoneNumber = 'الرجاء إدخال رقم الهاتف';
} else if (!PhoneNumber.match(/^\d{10}$/)) {
  errors.PhoneNumber = 'يجب أن يحتوي رقم الهاتف على 10 أرقام';
}

// فحص حقل الهاتف
if (!member_MemberID) {
  errors.member_MemberID = 'الرجاء إدخال رقم الهوية';
} else if (!member_MemberID.match(/^\d{9}$/)) {
  errors.member_MemberID = 'يجب أن يحتوي رقم الهوية على 9 أرقام';
}

// فحص حقل المهنة
if (!CurrentCareer) {
  errors.CurrentCareer = 'الرجاء إدخال المهنة';
} else if (!CurrentCareer.match(/^[\u0600-\u06FF\s]+$/)) {
  errors.CurrentCareer = 'يجب أن تحتوي المهنة على نص عربي فقط';
}

// فحص حقل مكان العمل
if (!CareerAddress) {
  errors.CareerAddress = 'الرجاء إدخال مكان العمل';
} else if (!CareerAddress.match(/^[\u0600-\u06FF\s]+$/)) {
  errors.CareerAddress = 'يجب أن يحتوي مكان العمل على نص عربي فقط';
}

// فحص حقل تاريخ الانضمام للعضوية
if (!MembershipDate) {
  errors.MembershipDate = 'الرجاء إدخال تاريخ الانضمام للعضوية';
} else if (new Date(MembershipDate) > new Date()) {
  errors.MembershipDate = 'تاريخ الانضمام للعضوية يجب ألا يكون في المستقبل';
}

// فحص حقل النشاط
if (is_active !== '1') {
  errors.is_active = 'الرجاء تحديد حالة النشاط';
}


// إرجاع الأخطاء إذا كانت موجودة، وإلا فإنه يمكن المضي قدمًا في معالجة البيانات
if (Object.keys(errors).length !== 0) {
  return res.render('/membershiprequest', { errors });
} else {
  
  const sql = `
    INSERT INTO members ( FullName, Birthdate, BirthAddress, address, Qualification, 
      CollegeName, CollegeYear, Specialization, Nationality, MemberID, MaterialStatus, Gender, 
      PhoneNumber, CurrentCareer, CareerAddress, join_date, is_active) 
    VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
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
    formData.PhoneNumber,
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
  
    res.redirect('/accept-requests.html');
  
  });}
} );




app.get('/search', (req, res) => {
  // استخراج قيمة اسم العضو من الطلب القادم
  const memberName = req.query.member_name;

  // استعلام SQL للبحث عن العضو بناءً على الاسم المدخل
  const sql = `SELECT * FROM members WHERE FullName = ?`;

  // تنفيذ الاستعلام والتعامل مع النتائج
  connection.query(sql, [memberName], (err, results) => {
    if (err) {
      console.error('خطأ في تنفيذ الاستعلام: ' + err.stack);
      return res.status(500).send('حدث خطأ في البحث عن العضو.');
    }

    // تحقق مما إذا كانت هناك نتائج
    if (results.length === 0) {
      return res.status(404).send('لا يوجد سجلات لهذا العضو.');
    }

    // تنسيق البيانات لعرضها في جدول HTML
    let htmlTable = '<table><tr><th>رقم العضوية</th><th>الاسم الكامل</th><th>تاريخ الميلاد</th><th>مكان الولادة</th><th>العنوان</th><th>المؤهل العلمي</th><th>اسم الكلية/الجامعة</th><th>سنة التخرج</th><th>التخصص</th><th>الجنسية</th><th>رقم الهوية</th><th>الحالة الإجتماعية</th><th>الجنس</th><th>رقم الهاتف</th><th>المهنة الحالية</th><th>مكان العمل</th><th>تاريخ الإنضمام</th><th>نشط</th><th>الاشتراك</th><th> حالة العضو</th></tr>';
    results.forEach(result => {
      htmlTable += `<tr><td>${result.membership_id}</td><td>${result.FullName}</td><td>${result.Birthdate}</td><td>${result.BirthAddress}</td><td>${result.address}</td><td>${result.Qualification}</td><td>${result.CollegeName}</td><td>${result.CollegeYear}</td><td>${result.Specialization}</td><td>${result.Nationality}</td><td>${result.MemberID}</td><td>${result.MaterialStatus}</td><td>${result.Gender}</td><td>${result.PhoneNumber}</td><td>${result.CurrentCareer}</td><td>${result.CareerAddress}</td><td>${result.join_date}</td><td>${result.is_active}</td><td>${result.shares}</td><td>${result.status}</td></tr>`;
    });
    htmlTable += '</table>';

    // إرسال النتائج كجدول HTML
    res.send(htmlTable);
  });
});


app.get('/searchallmembers', (req, res) => {
 

  // استعلام SQL للبحث عن العضو بناءً على الاسم المدخل
  const sql = `SELECT * FROM members `;

  // تنفيذ الاستعلام والتعامل مع النتائج
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('خطأ في تنفيذ الاستعلام: ' + err.stack);
      return res.status(500).send('حدث خطأ في البحث عن العضو.');
    }

    // تحقق مما إذا كانت هناك نتائج
    if (results.length === 0) {
      return res.status(404).send('لا يوجد سجلات  للأعضاء');
    }

    // تنسيق البيانات لعرضها في جدول HTML
    let htmlTable = '<table><tr><th>رقم العضوية</th><th>الاسم الكامل</th><th>تاريخ الميلاد</th><th>مكان الولادة</th><th>العنوان</th><th>المؤهل العلمي</th><th>اسم الكلية/الجامعة</th><th>سنة التخرج</th><th>التخصص</th><th>الجنسية</th><th>رقم الهوية</th><th>الحالة الإجتماعية</th><th>الجنس</th><th>رقم الهاتف</th><th>المهنة الحالية</th><th>مكان العمل</th><th>تاريخ الإنضمام</th><th>نشط</th><th>الاشتراك</th> <th>الأسهم</th><th> حالة العضو</th></tr>';
    results.forEach(result => {
      htmlTable += `<tr><td>${result.membership_id}</td><td>${result.FullName}</td><td>${result.Birthdate}</td><td>${result.BirthAddress}</td><td>${result.address}</td><td>${result.Qualification}</td><td>${result.CollegeName}</td><td>${result.CollegeYear}</td><td>${result.Specialization}</td><td>${result.Nationality}</td><td>${result.MemberID}</td><td>${result.MaterialStatus}</td><td>${result.Gender}</td><td>${result.PhoneNumber}</td><td>${result.CurrentCareer}</td><td>${result.CareerAddress}</td><td>${result.join_date}</td><td>${result.is_active}</td><td>${result.shares}</td><td>${result.has_stocks}</td><td>${result.status}</td></tr>`;
    });
    htmlTable += '</table>';

    // إرسال النتائج كجدول HTML
    res.send(htmlTable);
  });
});


app.get('/searchstudent', (req, res) => {
  // استخراج قيمة اسم العضو من الطلب القادم
  const studentName = req.query.student_name;

  // استعلام SQL للبحث عن العضو بناءً على الاسم المدخل
  const sql = `SELECT * FROM students WHERE FullName = ?`;

  // تنفيذ الاستعلام والتعامل مع النتائج
  connection.query(sql, [studentName], (err, results) => {
    if (err) {
      console.error('خطأ في تنفيذ الاستعلام: ' + err.stack);
      return res.status(500).send('حدث خطأ في البحث عن الطالب.');
    }

    // تحقق مما إذا كانت هناك نتائج
    if (results.length === 0) {
      return res.status(404).send('لا يوجد سجلات لهذا الطالب');
    }

    // تنسيق البيانات لعرضها في جدول HTML
    let htmlTable = '<table><tr><th> رقم الطالب</th><th>اسم الطالب </th><th>رقم العضو </th><th>اسم العضو الكفيل </th><th>رقم الهاتف</th><th> الجامعة</th><th>التخصص</th><th>المعدل التراكمي</th><th>المستوى الجامعي</th><th> القسط الفصلي</th><th>ملاحظات</th></tr>';
    results.forEach(result => {
      htmlTable += `<tr><td>${result.student_id}</td><td>${result.FullName}</td><td>${result.membership_id}</td><td>${result.member_name}</td><td>${result.PhoneNumber}</td><td>${result.CollegeName}</td><td>${result.Specialization}</td><td>${result.CumulativeAverage}</td><td>${result.AcademicLevel}</td><td>${result.UniversityTuition}</td><td>${result.note}</td></tr>`;
    });
    htmlTable += '</table>';

    // إرسال النتائج كجدول HTML
    res.send(htmlTable);
  });
});

app.get('/searchallstudents', (req, res) => {

  // استعلام SQL للبحث عن العضو بناءً على الاسم المدخل
  const sql = `SELECT * FROM students`;

  // تنفيذ الاستعلام والتعامل مع النتائج
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('خطأ في تنفيذ الاستعلام: ' + err.stack);
      return res.status(500).send('حدث خطأ في البحث عن الطالب.');
    }

    // تحقق مما إذا كانت هناك نتائج
    if (results.length === 0) {
      return res.status(404).send('لا يوجد سجلات للطلاب');
    }

    // تنسيق البيانات لعرضها في جدول HTML
    let htmlTable = '<table><tr><th> رقم الطالب</th><th>اسم الطالب </th><th>رقم العضو </th><th>اسم العضو الكفيل </th><th>رقم الهاتف</th><th> الجامعة</th><th>التخصص</th><th>المعدل التراكمي</th><th>المستوى الجامعي</th><th> القسط الفصلي</th><th>ملاحظات</th></tr>';
    results.forEach(result => {
      htmlTable += `<tr><td>${result.student_id}</td><td>${result.FullName}</td><td>${result.membership_id}</td><td>${result.member_name}</td><td>${result.PhoneNumber}</td><td>${result.CollegeName}</td><td>${result.Specialization}</td><td>${result.CumulativeAverage}</td><td>${result.AcademicLevel}</td><td>${result.UniversityTuition}</td><td>${result.note}</td></tr>`;
    });
    htmlTable += '</table>';

    // إرسال النتائج كجدول HTML
    res.send(htmlTable);
  });
}); 

app.get('/cancelMember', (req, res) => {
  const member_name = req.query.member_name;

  connection.query('SELECT * FROM members WHERE FullName = ?', [member_name], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
          const member = results[0];

          if (member.shares === 1 && member.status==='مقبول') {
              connection.query('UPDATE members SET is_active = 0 WHERE MemberID = ?', [member.member_id], (err, result) => {
                  if (err) throw err;
                  res.send('تم إلغاء العضوية بنجاح');
              });
          } else {
              res.send('حالة العضو غير نشطة');
          }
      } else {
          res.send('لم يتم العثور على عضو موجود');
      }
  });
});

app.get('/viewMember', (req, res) => {
  const member_id = req.query.member_id;

  connection.query('SELECT * FROM members WHERE MemberID = ?', [member_id], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
          const member = results[0];
          res.send(` 
              رقم العضوية: ${member.membership_id}<br>
              اسم العضو: ${member.FullName}<br>
              رقم الهوية: ${member.MemberID}<br>
             رقم الهاتف: ${member.PhoneNumber}<br> 
              حالة العضو: ${member.status}<br> 
              اشتراك العضو: ${member.shares}<br> 
              حالة نشاط العضو: ${member.is_active == 1 ? 'نشط' : 'غير نشط'}
            
          `);
      } else {
          res.send('لم يتم العثور على عضو موجود');
      }
  });
});

app.get('/viewStudents', (req, res) => {
  const student_id = req.query.student_id;
  const member_name = req.query.member_name;



  connection.query('SELECT * FROM students  WHERE FullName = ? AND member_name = ?', [student_id, member_name], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
          const student = results[0];
          res.send(`
          رقم الطالب: ${member.student_id}<br>
          اسم الطالب: ${member.FullName}<br>
          اسم العضو: ${member.member_name}<br>
         رقم الهاتف: ${member.PhoneNumber}<br> 
          `);
      } else {
          res.send('لم يتم العثور على طالب أو معلم موجودين');
      }
  });
});
// حفظ الطالب في قاعدة البيانات
app.post('/studentForm1', (req, res) => {
  const { student_name, member_name, PhoneNumber, student_univ, student_speci, CumulativeAverage, AcademicLevel, UniversityTuition, note } = req.body;

  // تحقق من وجود العضو الكفيل وحالته
  const checkMemberQuery = 'SELECT * FROM members WHERE FullName = ? AND status = _utf8mb4\'مقبول\'';
  connection.query(checkMemberQuery,[member_name], (err, results) => {
    if (err) {
      console.error('Error checking member: ', err);
      return res.status(500).send('Error checking member status');
    }

    // التحقق مما إذا كان العضو موجود ومقبول
    if (results.length === 0) {
      // إذا كان العضو غير موجود أو غير مقبول
      return res.status(400).send('Member does not exist or is not accepted');
    }

    // جلب رقم العضو المناسب
    const membership_id = results[0].membership_id;
    
    // إذا كان العضو موجود ومقبول، يمكنك الاستمرار بإدخال بيانات الطالب
    const insertStudentQuery = `INSERT INTO students (FullName, member_name, PhoneNumber, CollegeName, Specialization, CumulativeAverage, AcademicLevel, UniversityTuition, note ,membership_id) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(insertStudentQuery, [student_name, member_name, PhoneNumber, student_univ, student_speci, CumulativeAverage, AcademicLevel, UniversityTuition, note ,membership_id], (err, result) => {
      if (err) {
        console.error('Error inserting student data: ', err);
        return res.status(500).send('Error inserting student data');
      }
      console.log('Student data inserted successfully');
      res.send('Student data inserted successfully');
    });
  }); 
});



app.get('/acceptMember', (req, res) => {
  const memberName = req.query.member_name;

  // Check if member exists
  const checkSql = 'SELECT * FROM members WHERE FullName = ?';
  connection.query(checkSql, [memberName], (err, results) => {
    if (err) {
      console.error('Error checking member existence:', err);
      return res.status(500).send('Error checking member existence');
    }

    if (results.length === 0) {
      console.log(`Member ${memberName} not found`);
      return res.status(404).send(`Member ${memberName} not found`);
    }

    // Update member status
    const sql = 'UPDATE members SET status = _utf8mb4\'مقبول\' WHERE FullName = ?';
    connection.query(sql, [memberName], (err, result) => {
      if (err) {
        console.error('Error updating member status:', err);
        return res.status(500).send('Error updating member status');
      }

      console.log(`Member ${memberName} status updated to 'accepted'`);
      res.send(`Member ${memberName} status updated to 'accepted'`); // Redirect to the members list page after updating the member status
    });
  });
});




app.get('/acceptprocess_aid', (req, res) => {
  const { member_name } = req.query;

  // Get member status
  const sql = 'SELECT status FROM members WHERE FullName = ?';
  connection.query(sql, [member_name], (err, result) => {
    if (err) {
      console.error('Error getting member status:', err);
      return res.status(500).send('Error getting member status');
    }

    // Check if member is approved
    if (result[0].status !== 'مقبول') {
      return res.status(403).send('Member is not approved');
    }

    // Get member membership value
    const sql = 'SELECT shares FROM members WHERE FullName = ?';
    connection.query(sql, [member_name], (err, result) => {
      if (err) {
        console.error('Error getting member membership value:', err);
        return res.status(500).send('Error getting member membership value');
      }

      // Check if member has a membership value of 1
      if (result[0].shares !== 1) {
        return res.status(403).send('العضو غير مشترك ');
      }

      // Update aid status
      const sql = 'UPDATE aid SET status = _utf8mb4\'مقبول\' WHERE member_name = ?';
      connection.query(sql, [member_name], (err, result) => {
        if (err) {
          console.error('Error updating aid status:', err);
          return res.status(500).send('Error updating aid status');
        }

        console.log(`${result.changedRows} aid(s) status updated to 'accepted'`);
        res.send(`${result.changedRows} aid(s) status updated to 'accepted'`); // Redirect to the loans list page after updating the loan status
      });
    });
  });
});
app.get('/searchallaids', (req, res) => {


  // استعلام SQL للبحث عن العضو بناءً على الاسم المدخل
  const sql = `SELECT * FROM aid`;

  // تنفيذ الاستعلام والتعامل مع النتائج
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('خطأ في تنفيذ الاستعلام: ' + err.stack);
      return res.status(500).send('حدث خطأ في البحث عن الطالب.');
    }

    // تحقق مما إذا كانت هناك نتائج
    if (results.length === 0) {
      return res.status(404).send('لا يوجد سجلات للمساعدات');
    }

    // تنسيق البيانات لعرضها في جدول HTML
    let htmlTable = '<table><tr><th> رقم الطلب</th><th>رقم العضو</th><th> اسم العضو</th><th> رقم الطالب</th><th>اسم الطالب</th><th>نوع المساعدة </th><th>المبلغ</th><th>التاريخ</th><th>حالة الطلب</th></tr>';
    results.forEach(result => {
      htmlTable += `<tr><td>${result.aid_id}</td><td>${result.membership_id}</td><td>${result.member_name}</td><td>${result.student_id}</td><td>${result.student_name}</td><td>${result.type}</td><td>${result.quantity}</td><td>${result.date}</td><td>${result.status}</td></tr>`;
    });
    htmlTable += '</table>';

    // إرسال النتائج كجدول HTML
    res.send(htmlTable);
  });
}); 


app.post('/submit_loan_request', (req, res) => {
  const errors = {};

  if (!req.body.full_name || req.body.full_name.length > 50) {
    errors.full_name = 'الإسم الكامل مطلوب ولا يجب أن يتجاوز 50 حرفاً';
  }


  if (!req.body.provider_name || req.body.provider_name.length > 50) {
    errors.provider_name = 'المورّث مطلوب ولا يجب أن يتجاوز 50 حرفاً';
  }

  if (!req.body.provider_occupation || req.body.provider_occupation.length > 50) {
    errors.provider_occupation = 'المهنة المنتسبة مطلوبة ولا يجب أن تتجاوز 50 حرفاً';
  }

  if (!req.body.student_name || req.body.student_name.length > 50) {
    errors.student_name = 'اسم الطالب مطلوب ولا يجب أن يتجاوز 50 حرفاً';
  }

  if (!req.body.university || req.body.university.length > 50) {
    errors.university = 'الجامعة مطلوبة ولا يجب أن تتجاوز 50 حرفاً';
  }

  if (!req.body.major || req.body.major.length > 50) {
    errors.major = 'التخصص مطلوب ولا يجب أن يتجاوز 50 حرفاً';
  }

  if (req.body.gpa && isNaN(req.body.gpa)) {
    errors.gpa = 'المعدل يجب أن يكون رقماً';
  }

  if (!req.body.academic_level || !['دبلوم', 'ليس لدي', 'بكالوريوس', 'ماجستير', 'دكتوراه'].includes(req.body.academic_level)) {
    errors.academic_level = 'المستوى الأكاديمي مطلوب ويجب أن يكون من القيم المسموح بها';
  }

  if (!req.body.semester_fee || isNaN(req.body.semester_fee)) {
    errors.semester_fee = 'الرسوم الجزئية مطلوبة ويجب أن تكون رقماً';
  }

  if (req.body.notes && req.body.notes.length > 500) {
    errors.notes = 'ملاحظاتك لا يجب أن تتجاوز 500 حرفاً';
  }

  if (!req.body.family_size || !Number.isInteger(parseInt(req.body.family_size)) || parseInt(req.body.family_size) <= 0) {
    errors.family_size = 'عدد أفراد الأسرة مطلوب ويجب أن يكون عدداً صحيحاً وأكبر من صفر';
  }

  if (!req.body.family_employees || !Number.isInteger(parseInt(req.body.family_employees))) {
    errors.family_employees = 'عدد الأفراد الموظفين في الأسرة مطلوب ويجب أن يكون عدداً صحيحاً';
  }

  if (!req.body.monthly_income || isNaN(req.body.monthly_income)) {
    errors.monthly_income = 'الدخل الشهري مطلوب ويجب أن يكون رقماً';
  }

  if (!req.body.loan_amount || isNaN(req.body.loan_amount)) {
    errors.loan_amount = 'المبلغ المطلوب مطلوب ويجب أن يكون رقماً';
  } else if (req.body.loan_amount > 500) {
    errors.loan_amount = 'المبلغ المطلوب لا يجب أن يتجاوز 500 دينار';
  }

  if (Object.keys(errors).length !== 0) {
    return res.render('loan_request_form.ejs', { errors });
  } else {
  
    const {
      // استقبال البيانات من الطلب
      full_name,
      mobile,
      provider_name,
      provider_occupation,
      provider_phone,
      student_id,
      student_name,
      university,
      major,
      gpa,
      academic_level,
      semester_fee,
      notes,
      family_size,
      family_employees,
      monthly_income,
      loan_amount,
      services_history,
      received_services
    } = req.body;
    
    // استعلام SQL للتحقق من وجود العضو ومقبوليته
    const checkMemberQuery = 'SELECT membership_id FROM members WHERE FullName = ? AND status = ?';
    connection.query(checkMemberQuery, [full_name, 'مقبول'], (err, results) => {
      if (err) {
        console.error('Error checking member: ', err);
        return res.status(500).send('Error checking member status');
      }
    
      // التحقق مما إذا كان العضو موجود ومقبول
      if (results.length === 0) {
        // إذا كان العضو غير موجود أو غير مقبول
        return res.status(400).send('Member does not exist or is not accepted');
      }
    
      // الحصول على القيمة المستردة لـ member_id
      const member_id = results[0].membership_id;
    
      // إذا كان العضو موجود ومقبول، يمكنك الاستمرار بإدخال بيانات طلب القرض
      const insertLoanRequestQuery = `INSERT INTO educational_loan_requests(
        member_id, full_name, mobile, provider_name, provider_occupation, provider_phone, student_id,
        student_name, university, major, gpa, academic_level, semester_fee,
        notes, family_size, family_employees, monthly_income, loan_amount,
        services_history, received_services
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
      connection.query(
        insertLoanRequestQuery,
        [
          member_id, full_name, mobile, provider_name, provider_occupation, provider_phone, student_id,
          student_name, university, major, gpa, academic_level, semester_fee,
          notes, family_size, family_employees, monthly_income, loan_amount,
          services_history, received_services
        ],
        (err, results) => {
          if (err) {
            console.error('Error inserting loan request: ', err);
            return res.status(500).send('Error submitting loan request');
          }
          console.log('Data inserted successfully');
          res.redirect('/accept-requests.html');
        }
      );
    });
    
  }
});

app.get('/acceptLoans', (req, res) => {
  const { member_name } = req.query;

  // التحقق من وجود العضو وحالته مقبولة
  const memberSql = 'SELECT * FROM members WHERE FullName = ? AND status = _utf8mb4\'مقبول\'';
  connection.query(memberSql, [member_name], (err, memberResults) => {
    if (err) {
      console.error('خطأ في جلب العضو:', err);
      return res.status(500).send('خطأ في جلب العضو');
    }

    // التحقق من وجود العضو وأن حالته مقبولة
    if (memberResults.length === 0) {
      console.log(`لا يوجد عضو بالاسم ${member_name} وبحالة 'مقبول'`);
      return res.status(404).send('لا يوجد عضو بالاسم المعطى وبالحالة المحددة');
    }

    // التحقق من وجود العضو في جدول طلبات القروض
    const loanSql = 'SELECT * FROM educational_loan_requests WHERE full_name = ?';
    connection.query(loanSql, [member_name], (err, loanResults) => {
      if (err) {
        console.error('خطأ في جلب بيانات طلب القرض:', err);
        return res.status(500).send('خطأ في جلب بيانات طلب القرض');
      }

      // التحقق من وجود طلب قرض للعضو
      if (loanResults.length === 0) {
        console.log(`لا يوجد طلب قرض للعضو بالاسم ${member_name}`);
        return res.status(404).send('لا يوجد طلب قرض للعضو بالاسم المعطى');
      }

      // تحديث حالة القرض إلى 'مقبول'
      const updateSql = 'UPDATE educational_loan_requests SET status = _utf8mb4\'مقبول\' WHERE full_name = ?';
      connection.query(updateSql, [member_name], (err, result) => {
        if (err) {
          console.error('خطأ في تحديث حالة القرض:', err);
          return res.status(500).send('خطأ في تحديث حالة القرض');
        }

        console.log(`تم تحديث حالة القرض إلى 'مقبول'`);
        res.send(`تم تحديث حالة القرض إلى 'مقبول'`);
      });
    });
  });
});


app.post('/loan_invoice', (req, res) => {
  const { member_id, student_id, amount, start_date, end_date, status } = req.body;

  // التحقق مما إذا كان العضو موجود وحالته مقبولة
  const checkMemberQuery = 'SELECT * FROM members WHERE membership_id = ? AND status = ?';
  connection.query(checkMemberQuery, [member_id, 'مقبول'], (err, memberResults) => {
    if (err) {
      console.error('خطأ في التحقق من العضو:', err);
      return res.status(500).send('خطأ في التحقق من حالة العضو');
    }

    if (memberResults.length === 0) {
      return res.status(400).send('العضو غير موجود أو حالته غير مقبولة');
    }

    // التحقق مما إذا كان للعضو طلب قرض بحالة مقبولة
    const checkLoanRequestQuery = 'SELECT * FROM educational_loan_requests WHERE member_id = ? AND status = ?';
    connection.query(checkLoanRequestQuery, [member_id, 'مقبول'], (err, loanResults) => {
      if (err) {
        console.error('خطأ في التحقق من طلب القرض:', err);
        return res.status(500).send('خطأ في التحقق من حالة طلب القرض');
      }

      if (loanResults.length === 0) {
        return res.status(400).send('العضو ليس لديه طلب قرض مقبول');
      }

      // التحقق مما إذا كان الطالب مرتبط بالعضو
      const checkStudentAssociationQuery = 'SELECT * FROM students WHERE student_id = ? AND membership_id = ?';
      connection.query(checkStudentAssociationQuery, [student_id, member_id], (err, associationResults) => {
        if (err) {
          console.error('خطأ في التحقق من ارتباط الطالب:', err);
          return res.status(500).send('خطأ في التحقق من ارتباط الطالب');
        }

        if (associationResults.length === 0) {
          return res.status(400).send('الطالب غير مرتبط بالعضو');
        }

        // إدخال البيانات في قاعدة البيانات
        const sql = 'INSERT INTO loans (member_id, student_id, amount, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(sql, [member_id, student_id, amount, start_date, end_date, status], (err, result) => {
          if (err) {
            console.error('خطأ في إنشاء الفاتورة:', err);
            res.status(500).send('خطأ في إنشاء الفاتورة');
          } else {
            console.log('تم إنشاء الفاتورة بنجاح');
            res.status(200).send('تم إنشاء الفاتورة بنجاح');
          }
        });
      });
    });
  });
});

app.get('/searchloan-inv', (req, res) => {
  // استعلام SQL لاسترجاع بيانات القروض مع معلومات الأعضاء والطلاب
  const sql = `
    SELECT loans.*, members.membership_id AS member_name, students.FullName AS student_name 
    FROM loans
    INNER JOIN members ON loans.member_id = members.membership_id 
    INNER JOIN students ON loans.student_id = students.student_id
  `;

  // تنفيذ الاستعلام والتعامل مع النتائج
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('خطأ في تنفيذ الاستعلام: ' + err.stack);
      return res.status(500).send('حدث خطأ في البحث عن بيانات القرض.');
    }

    // تحقق من وجود نتائج
    if (results.length === 0) {
      return res.status(404).send('لا يوجد سجلات للقروض');
    }

    // تنسيق البيانات لعرضها في بطاقات
    let htmlCards = '<div class="row">';
    results.forEach(result => {
      htmlCards += `<div class="col-md-4">
                      <div class="card">
                        <div class="card-body">
                          <h5 class="card-title">رقم القرض: ${result.loan_id}</h5>
                          <p class="card-text">رقم العضو: ${result.member_id}</p>
                          <p class="card-text">اسم العضو: ${result.member_name}</p>
                          <p class="card-text">رقم الطالب: ${result.student_id}</p>
                          <p class="card-text">اسم الطالب: ${result.student_name}</p>
                          <p class="card-text">حالة القرض: ${result.status}</p>
                          <p class="card-text">المبلغ المطلوب: ${result.amount}</p>
                          <p class="card-text">تاريخ البدء: ${result.start_date}</p>
                          <p class="card-text">تاريخ الانتهاء: ${result.end_date}</p>
                        
                        </div>
                      </div>
                    </div>`;
    });
    htmlCards += '</div>';

    // إرسال النتائج كبطاقات HTML
    res.send(htmlCards);
  });
});




app.get('/searchallloans', (req, res) => {


  // استعلام SQL للبحث عن العضو بناءً على الاسم المدخل
  const sql = `SELECT * FROM educational_loan_requests`;

  // تنفيذ الاستعلام والتعامل مع النتائج
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('خطأ في تنفيذ الاستعلام: ' + err.stack);
      return res.status(500).send('حدث خطأ في البحث عن بيانات القرض.');
    }

    // تحقق مما إذا كانت هناك نتائج
    if (results.length === 0) {
      return res.status(404).send('لا يوجد سجلات للقروض');
    }

    // تنسيق البيانات لعرضها في جدول HTML
    let htmlTable = '<table><tr><th>رقم القرض</th><th>رقم العضو</th><th>اسم العضو</th><th>رقم الطالب</th><th>اسم الطالب</th><th>حالة القرض</th></tr>';
    results.forEach(result => {
      htmlTable += `<tr><td>${result.id}</td><td>${result.member_id}</td><td>${result.full_name}</td><td>${result.student_id}</td><td>${result.student_name}</td><td>${result.status}</td></tr>`;
    });
    htmlTable += '</table>';

    // إرسال النتائج كجدول HTML
    res.send(htmlTable);
  });
}); 





// Handle form submission
app.post('/submit_stock', (req, res) => {
  const { membership_id, asset_amount, shares_owned, purchase_date } = req.body;

  // Check if the required fields are provided
  if (!membership_id || !asset_amount || !shares_owned || !purchase_date) {
    return res.status(400).send('All fields are required.');
  }

  // Check if the asset amount and shares owned are positive numbers
  if (asset_amount <= 0 || shares_owned <= 0) {
    return res.status(400).send('Asset amount and shares owned must be positive numbers.');
  }

  // Check if the membership ID is not negative
  if (membership_id < 0) {
    return res.status(400).send('Membership ID must not be negative.');
  }

  // Check if the purchase date is a valid date
  if (!moment(purchase_date, 'YYYY-MM-DD', true).isValid()) {
    return res.status(400).send('Invalid purchase date. Please use the format YYYY-MM-DD.');
  }

  // Check if the member exists and is active
  const sql = `SELECT * FROM members WHERE membership_id = ? AND status = 'مقبول'`;
  connection.query(sql, [membership_id], (err, results) => {
    if (err) {
      console.error('Error checking member status:', err);
      return res.status(500).send('Error checking member status');
    }

    // If no member found or member is not active, return an error
    if (results.length === 0) {
      return res.status(400).send('Member not found or not active.');
    }

    // Perform database query here (INSERT into your stocks table)
    const insertSql = `INSERT INTO stocks (membership_id, initial_contribution, shares_owned, purchase_date) VALUES (?, ?, ?, ?)`;
    const values = [membership_id, asset_amount, shares_owned, purchase_date];

    connection.query(insertSql, values, (err, result) => {
      if (err) {
        console.error('Error adding stock:', err);
        return res.status(500).send('Error adding stock');
      }
      console.log('Stock added successfully');
      res.send('Stock added successfully');
    });
  });
});

app.get('/searchinvoice', (req, res) => {
  // SQL query to search for invoices based on the entered name
  const sql = `SELECT subscription_invoice.*, members.FullName 
               FROM subscription_invoice 
               INNER JOIN members ON subscription_invoice.member_id = members.membership_id`;

  // Execute the query and handle the results
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing the query: ' + err.stack);
      return res.status(500).send('Error searching for invoices.');
    }

    // Check if there are any results
    if (results.length === 0) {
      return res.status(404).send('No subscription invoice records found.');
    }

    // Format the data for display in an HTML table
    let htmlTable = '<table><tr><th>Member ID</th><th>Member Name</th><th>Amount</th><th>Issue Date</th><th>Due Date</th><th>Status</th></tr>';
    results.forEach(result => {
      htmlTable += `<tr><td>${result.member_id}</td><td>${result.FullName}</td><td>${result.amount}</td><td>${result.issue_date}</td><td>${result.due_date}</td><td>${result.status}</td></tr>`;
    });
    htmlTable += '</table>';

    res.send(htmlTable);
  });
});

app.post('/newInvoiceForm', (req, res) => {
  const { invoice_name, amount, date, note, status } = req.body;

  // Check if the required fields are provided
  if (!invoice_name || !amount || !date || !note || !status) {
    return res.status(400).send('All fields are required.');
  }

  // Check if the amount is a positive number
  if (amount <= 0) {
    return res.status(400).send('Amount must be a positive number.');
  }

  // Check if the date is in the correct format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).send('Date must be in the format YYYY-MM-DD.');
  }

  // Check if the status is valid
  const validStatuses = [ 'paid', 'overdue'];
  if (!validStatuses.includes(status)) {
    return res.status(400).send('Invalid status.');
  }

  // Check if the date is not in the future
  const currentDate = new Date();
  const inputDate = new Date(date);
  if (inputDate > currentDate) {
    return res.status(400).send('Date must not be in the future.');
  }

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
 

app.get('/searchexpenses', (req, res) => {


  // SQL query to search for invoices based on the entered name
  const sql = `SELECT * FROM expenses`;

  // Execute the query and handle the results
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing the query: ' + err.stack);
      return res.status(500).send('Error searching for expenses .');
    }

    // Check if there are any results
    if (results.length === 0) {
      return res.status(404).send('لا يوجد سجلات لفواتير المصروفات');
     
    }
    

    let htmlTable = '<table><tr><th>category</th><th>amount</th><th>date</th><th>description</th><th>status</th></tr>';
    results.forEach(result => {
      htmlTable += `<tr><td>${result.category}</td><td>${result.amount}</td><td>${result.date}</td><td>${result.description}</td><td>${result.status}</td></tr>`;
    });
    htmlTable += '</table>';

    res.send(htmlTable);
  });
});
const moment = require('moment');

// تعريف مسار POST لمعالجة طلبات الفواتير الثابتة
app.post('/submit_fixed_asset_invoice', (req, res) => {
  const { asset_type, asset_amount, creation_date, due_date, asset_status, asset_details, notes } = req.body;
// Validate data



const errors = validationResult(req);  
if (!errors.isEmpty()) {
  // إعادة عرض النموذج مع البيانات التي أدخلها المستخدم ورسائل الخطأ
  return res.render('fixed_asset_invoice.ejs', {
    formData: req.body,
    errors: errors.array()
  });}
// Insert record
const sql = 'INSERT INTO assets (asset_type, asset_amount, creation_date, due_date, asset_status, asset_details, notes) VALUES (?, ?, ?, ?, ?, ?, ?)';
connection.query(sql, [asset_type, asset_amount, creation_date, due_date, asset_status, asset_details, notes], (err, result) => {
  if (err) {
    console.error('Error inserting invoice:', err);
    res.status(500).send('Error submitting invoice');
    return;
  }
  console.log('Invoice inserted successfully');
  res.send('Invoice inserted successfully'); // You can redirect the user to another page after successful invoice submission
});
});


app.get('/searchasset', (req, res) => {


  // SQL query to search for invoices based on the entered name
  const sql = `SELECT * FROM assets`;

  // Execute the query and handle the results
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing the query: ' + err.stack);
      return res.status(500).send('Error searching for expenses .');
    }

    // Check if there are any results
    if (results.length === 0) {
      return res.status(404).send('لا يوجد سجلات لفواتير أصول ثابتة');
     
    }
    

    let htmlTable = '<table><tr><th>نوع الأصل</th><th>القيمة</th><th>تاريخ الإنشاء</th><th>تاريخ الإستحقاق</th><th>الحالة</th><th>تفاصيل الأصل</th><th>ملاحظات</th></tr>';
    results.forEach(result => {
      htmlTable += `<tr><td>${result.asset_type}</td><td>${result.asset_amount}</td><td>${result.creation_date}</td><td>${result.due_date}</td><td>${result.asset_status}</td><td>${result.asset_details}</td><td>${result.notes}</td></tr>`;
    });
    htmlTable += '</table>';

    res.send(htmlTable);
  });
});





app.post('/submit_stock', (req, res) => {
  const { membership_id, asset_amount, shares_owned, purchase_date } = req.body;

  // Validate data
  const errors = {};
  if (!Number.isInteger(Number(membership_id)) || membership_id <= 0) {
    errors.membership_id = 'Invalid membership ID';
  }

  if (!Number.isFinite(asset_amount) || asset_amount <= 0) {
    errors.asset_amount = 'Invalid initial contribution';
  }

  if (!Number.isInteger(Number(shares_owned)) || shares_owned <= 0) {
    errors.shares_owned = 'Invalid shares owned';
  }

  if (!moment(purchase_date, 'YYYY-MM-DD', true).isValid()) {
    errors.purchase_date = 'Invalid purchase date';
  }

  // Check if membership ID exists and is acceptable
  const sql = 'SELECT * FROM members WHERE membership_id = ? AND status = ?';
  connection.query(sql, [membership_id, 'مقبول'], (err, result) => {
    if (err) {
      console.error('Error checking membership:', err);
      return res.send('العضو ليس ضمن السجلات'); // Redirect to an error page
    }

    if (result.length === 0) {
      return res.send('العضو غير مقبول'); // Redirect to an error page
    }

    // Insert record if no errors
    if (Object.keys(errors).length === 0) {
      const insertSql = 'INSERT INTO stocks (membership_id, initial_contribution, shares_owned, purchase_date) VALUES (?, ?, ?, ?)';
      connection.query(insertSql, [membership_id, asset_amount, shares_owned, purchase_date], (err, result) => {
        if (err) {
          console.error('Error adding stock:', err);
          return res.send('خطأ في الإدخال في قاعدة البيانات'); // Redirect to an error page
        }
        console.log('Stock added successfully');
        res.send('تمت عملية إضافة الأسهم بنجاح'); // Redirect to a success page
      });
    } else {
      res.send('تأكد من المدخلات بأن تكون صحيحة'); // Redirect to an error page
    }
  });
});

 // Define a route for form submission
 app.post('/process_aid', (req, res) => {
  const { student_name, member_name, type, quantity, date } = req.body;

  // Insert data into the database
  const sql = 'INSERT INTO aid(student_name, member_name, type, quantity, date) VALUES (?, ?, ?, ?, ?)';
  const values = [student_name, member_name, type, quantity, date];

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

app.post('/process_invoice', (req, res) => {
  const { member_id, amount, date, due_date, status } = req.body;

  // Check if member exists and is active
  const checkSql = 'SELECT * FROM members WHERE membership_id = ? AND status = _utf8mb4\'مقبول\'';
  connection.query(checkSql, [member_id], (err, rows) => {
    if (err) {
      console.error('Error checking member:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (rows.length === 0) {
      console.log(`Member with ID ${member_id} not found or not active`);
      return res.status(404).send('Member not found or not active');
    }

    // Insert invoice
    const sql = 'INSERT INTO subscription_invoice (member_id,amount, issue_date, due_date, status) VALUES(?, ?, ?, ?,?)';
    const values = [member_id, amount, date, due_date, status ];
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting ', err);
        return res.status(500).send('Internal Server Error');
      }

      console.log('Data inserted successfully:', result);
      res.send('Invoice created! ');
    });
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

  app.post('/add-payment', [
    check('payment_date')
      .isDate({ format: 'YYYY-MM-DD' })
      .withMessage('Payment date must be a valid date in the format YYYY-MM-DD.'),
    check('amount')
      .isNumeric()
      .withMessage('Amount must be a number.')
      .isLength({ max: 10 })
      .withMessage('Amount must not exceed 10 digits.')
      .isDecimal({ decimal_digits: '2' })
      .withMessage('Amount must have at most 2 decimal places.'),
    check('currency')
      .isLength({ max: 3 })
      .withMessage('Currency code must not exceed 3 characters.'),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
   
  
   // Retrieve the list of valid money box IDs from the database
  const sql = 'SELECT box_id FROM financial_boxes';
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error retrieving list of money boxes.');
    }

    // Check if the submitted money box ID is valid
    const submittedMoneyBoxId = req.body.money_box_id;
    const validMoneyBoxIds = results.map(row => row.box_id);
    if (!validMoneyBoxIds.includes(submittedMoneyBoxId)) {
      return res.status(400).json({
        errors: [
          {
            value: submittedMoneyBoxId,
            msg: 'Money box ID is not valid.',
            param: 'money_box_id',
            location: 'body',
          },
        ],
      });
    }

    // Insert form data into the database
    const formData = req.body;
    const sql = `
      INSERT INTO payments ( payment_date, amount, currency, description, payment_method, notes, money_box_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      formData.payment_date,
      formData.amount,
      formData.currency,
      formData.description,
      formData.payment_method,
      formData.notes,
      formData.money_box_id,
    ];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error adding payment to database.');
      }

      res.send('Inserteing payments data succsesfully');
    });
  }); 
});
  



app.get('/searchpayment', (req, res) => {


  // استعلام SQL للبحث عن العضو بناءً على الاسم المدخل
  const sql = `SELECT * FROM payments`;

  // تنفيذ الاستعلام والتعامل مع النتائج
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('خطأ في تنفيذ الاستعلام: ' + err.stack);
      return res.status(500).send('حدث خطأ في البحث عن فواتير المقبوضات.');
    }

    // تحقق مما إذا كانت هناك نتائج
    if (results.length === 0) {
      return res.status(404).send('لا يوجد سجلات لفواتير المقبوضات');
    }

    // تنسيق البيانات لعرضها في جدول HTML
    let htmlTable = '<table><tr><th>Payment ID</th><th>Date</th><th>Amount</th><th>Currency</th><th>Description</th><th>Payment Method</th><th>Notes</th><th>Money Box ID</th></tr>';
   results.forEach(result => { 
    htmlTable += `<tr><td>${result.payment_id}</td><td>${result.payment_date}</td><td>${result.amount}</td><td>${result.currency}</td><td>${result.description}</td><td>${result.payment_method}</td><td>${result.notes}</td><td>${result.money_box_id}</td></tr>`;
  });
    htmlTable += '</table>';
  
  res.send(htmlTable); 
}); 
});
       
  app.post('/submitDonation', (req, res) => {
    const data = req.body;
    // Insert data into the database
    const sql = 'INSERT INTO donations (donor_name, donor_email, donation_amount, donation_date, donation_type, donation_description) VALUES (?, ?, ?, ?, ?, ?)';
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting donation into the database: ' + err.message);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // Display success message or perform any other action
      res.send('Donation submitted successfully!');
    });
  });


  

  // Handle POST request for submitting donation
app.post('/saveToDatabase', (req, res) => {

  // Handle preview logic if needed
  const data = req.body;
  
  // Log the received data (replace this with your actual preview logic)
  console.log('Received data for preview:', data);

  // For demonstration, sending a simple success response
  res.json({ success: true });

});

  app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});

