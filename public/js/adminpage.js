

document.addEventListener('DOMContentLoaded', function () {
    // Add an event listener to the logout button
    document.getElementById('logoutButton').addEventListener('click', function () {
        // Call the logout function
        logout();
    });
});

// Function to handle logout
function logout() {
    console.log('Admin logged out');
res.send('Admin logged out');
    window.location.href = 'loginpage.html';
    
}



document.getElementById('MaterialStatus').addEventListener('change', function () {
  
    var selectedValue = this.value;
    console.log('Selected Material Status:', selectedValue);
  });

  function toggleSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section.style.display === "none") {
      section.style.display = "block";
      document.getElementById('section-id').scrollIntoView({ behavior: 'smooth' });
    } else {
      section.style.display = "none";
    }



  }

  const form = document.getElementById('dataForm1');

  // Add an event listener to the form
  form.addEventListener('submit', function (event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get the selected gender value
    const genderRadios = document.getElementsByName('Gender');
    let option = null;

    for (const radio of genderRadios) {
      if (radio.checked) {
        option = radio.value;
        break;
      }
    }

    // Check if a gender is selected
    if (selectedGender !== null) {
      // Now you can use the selectedGender value as needed
      console.log('Selected Gender:', selectedGender);
      // Continue with form submission or other actions
      // ...

    } else {
      // No gender selected, you might want to display an error message
      console.log('Please select a gender.');
      // Display an error message or take appropriate action
    }
  });

  // استيراد مكتبة axios
import axios from "axios";

// إنشاء دالة لاستدعاء API
const getInvoices = async () => {
  // إرسال طلب GET إلى API
  const response = await axios.get(`/get_invoices`);

  // معالجة استجابة API
  if (response.status === 200) {
    // عرض البيانات في الجدول
    const invoices = response.data;
    const tableBody = document.querySelector("#table-body");
    invoices.forEach((invoice) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${invoice.name}</td>
        <td>${invoice.amount}</td>
        <td>${invoice.date}</td>
        <td>${invoice.status}</td>
        <td>${invoice.notes}</td>
        <td><button>التعديل</button></td>
      `;
      tableBody.appendChild(row);
    });
  } else {
    // عرض رسالة خطأ
    const errorElement = document.querySelector("#error");
    errorElement.innerHTML = response.statusText;
  }
};

// تشغيل الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", getInvoices);


 


  const managerForm = document.getElementById('managerForm');
  const managerTable = document.getElementById('managerTable');

  

  // Save manager data
  managerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const managerName = document.getElementById('manager_name').value;
    const jobTitle = document.getElementById('job_title').value;
    const email = document.getElementById('email').value;

    // Send a request to the server to save the manager data
    fetch('/save-manager', {
      method: 'POST',
      body: JSON.stringify({ managerName, jobTitle, email }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the new manager to the table
        const row = managerTable.insertRow();
        row.insertCell().textContent = data.managerName;
        row.insertCell().textContent = data.jobTitle;
        row.insertCell().textContent = data.email;
        row.insertCell().innerHTML = `
          <button class="delete-button" onclick="deleteManager(${data.id})">حذف</button>
          <button class="update-button" onclick="updateManager(${data.id})">تعديل</button>
        `;

        // Clear the form
        managerForm.reset();
      });

      
  });

    function loadData() {
        // Send GET request to the server to retrieve the data
        $.get("/get_empolyeeForm", function(data) {
          console.log(data)
          // Clear the table body
          $("#managerTable tbody").empty();
      
          // Loop through the data and add each row to the table
          data.forEach(function(rowData) {
            $("#managerTable tbody").append("<tr><td>" + rowData.manager_name + "</td><td>" + rowData.job_title + "</td><td>" + rowData.email + "</td><td><button class='delete-button' onclick='deleteRow(\"" + rowData.manager_name + "\")'>Delete</button></td></tr>");
          });
        });
      }
$(document).ready(function() {
    // Call the loadData function when the page loads
    loadData();
  });

$(document).ready(function() {
    // Call the loadData function when the page loads
    
    deleteManager(id);
    updateManager(id);
    // Add the submitForm function here
    function submitForm() {
      // Prevent default form submission
      event.preventDefault();
  
      // Get form data
      var formData = {
        manager_name: $("#manager_name").val(),
        job_title: $("#job_title").val(),
        email: $("#email").val()
      };
  
      // Send form data to the server
      $.ajax({
        type: "POST",
        url: "/empolyeeForm",
        data: formData,
        success: function(data) {
          // Add new row to the table
          $("#managerTable tbody").append("<tr><td>" + formData.manager_name + "</td><td>" + formData.job_title + "</td><td>" + formData.email + "</td><td><button class='delete-button' onclick='deleteRow(\"" + formData.manager_name + "\")'>Delete</button></td></tr>");
  
          // Clear form fields
          $("#managerForm")[0].reset();
        }
      });
    }
  });

  // Delete manager
  function deleteManager(id) {
    // Send a request to the server to delete the manager
    fetch(`/delete-manager/${id}`, { method: 'DELETE' })
      .then(() => {
        // Remove the manager row from the table
        const row = document.querySelector(`tr[data-manager-id="${id}"]`);
        row.remove();
      });
  }

  // Update manager
  function updateManager(id) {
    // Get the updated manager data from the user
    const managerName = prompt('Enter the updated manager name');
    const jobTitle = prompt('Enter the updated job title');
    const email = prompt('Enter the updated email');

    // Send a request to the server to update the manager data
    fetch(`/update-manager/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ managerName, jobTitle, email }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the manager row in the table
        const row = document.querySelector(`tr[data-manager-id="${id}"]`);
        row.cells[0].textContent = data.managerName;
        row.cells[1].textContent = data.jobTitle;
        row.cells[2].textContent = data.email;
      });
  }


  document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('#section1').style.display = 'none';
  });
  
  document.querySelector('#managerForm').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const formDataObject = Object.fromEntries(formData.entries());
  
    document.querySelector('#preview').innerHTML = `
      <p><strong>اسم المدير:</strong> ${formDataObject.manager_name}</p>
      <p><strong>الوظيفة:</strong> ${formDataObject.job_title}</p>
      <p><strong>البريد الإلكتروني:</strong> ${formDataObject.email}</p>
    `;
  
    // Submit the form data to the server using AJAX or Fetch API
  });
//////////////////////close sections///////////////// by nibal
  const closeButtons = document.querySelectorAll('.close');

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('section');
      if (section) {
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
        if (section.style.display === 'none') {
          localStorage.setItem(section.id, "closed");
        } else {
          localStorage.setItem(section.id, "open");
        }
      }
    });
  });
  
  // Load the state of each section when the page loads
  window.onload = function() {
    var sectionIds = ['section1', 'section2', 'section3', 'section4', 'section6', 'section7', 'section8', 'section9', 'section10', 'section11', 'section12', 'section14', 'section15', 'section16', 'section17', 'section18', 'section19', 'section20', 'section21'];
    sectionIds.forEach(function(sectionId) {
      var section = document.getElementById(sectionId);
      if (localStorage.getItem(sectionId) === "closed") {
        section.style.display = "none";
      } else {
        section.style.display = "block";
      }
    });
  };
//////////////////////membership request///////////////// by nibal


  document.getElementById('dataForm1').addEventListener('submit', function(event) {
    // احصل على الحقول التي تحتاج إلى التحقق من صحة البيانات فيها
    var nameField = document.getElementById('member_name');
    var birthdateField = document.getElementById('member_Birthdate');
    var birthaddressField = document.getElementById('member_Birthaddress');
    var addressField = document.getElementById('member_address');
    var collegeNameField = document.getElementById('member_CollegeName');
    var collegeYearField = document.getElementById('member_CollegeYear');
    var specializationField = document.getElementById('member_Specialization');
    var nationalityField = document.getElementById('member_Nationality');
    var memberIDField = document.getElementById('member_MemberID');
    var phoneNumberField = document.getElementById('PhoneNumber');
    var currentCareerField = document.getElementById('CurrentCareer');
    var careerAddressField = document.getElementById('CareerAddress');
    var membershipDateField = document.getElementById('MembershipDate');

    // قم بالتحقق من صحة البيانات المدخلة في الحقول
    if (!nameField.checkValidity()) {
      nameField.setCustomValidity('يرجى إدخال اسم صحيح.');
    } else {
      nameField.setCustomValidity('');
    }

    if (!birthdateField.checkValidity()) {
      birthdateField.setCustomValidity('يرجى إدخال تاريخ ولادة صحيح.');
    } else {
      birthdateField.setCustomValidity('');
    }

    if (!birthaddressField.checkValidity()) {
      birthaddressField.setCustomValidity('يرجى إدخال مكان الميلاد صحيح.');
    } else {
      birthaddressField.setCustomValidity('');
    }

    if (!addressField.checkValidity()) {
      addressField.setCustomValidity('يرجى إدخال عنوان صحيح.');
    } else {
      addressField.setCustomValidity('');
    }

    if (!collegeNameField.checkValidity()) {
      collegeNameField.setCustomValidity('يرجى إدخال اسم الجامعة أو المعهد صحيح.');
    } else {
      collegeNameField.setCustomValidity('');
    }

    if (!collegeYearField.checkValidity()) {
      collegeYearField.setCustomValidity('يرجى إدخال سنة التخرج صحيحة.');
    } else {
      collegeYearField.setCustomValidity('');
    }

    if (!specializationField.checkValidity()) {
      specializationField.setCustomValidity('يرجى إدخال التخصص صحيح.');
    } else {
      specializationField.setCustomValidity('');
    }

    if (!nationalityField.checkValidity()) {
      nationalityField.setCustomValidity('يرجى إدخال الجنسية صحيحة.');
    } else {
      nationalityField.setCustomValidity('');
    }

    if (!memberIDField.checkValidity()) {
      memberIDField.setCustomValidity('يرجى إدخال رقم الهوية صحيح.');
    } else {
      memberIDField.setCustomValidity('');
    }

    if (!phoneNumberField.checkValidity()) {
      phoneNumberField.setCustomValidity('يرجى إدخال رقم الهاتف صحيح.');
    } else {
      phoneNumberField.setCustomValidity('');
    }

    if (!currentCareerField.checkValidity()) {
      currentCareerField.setCustomValidity('يرجى إدخال المهنة صحيحة.');
    } else {
      currentCareerField.setCustomValidity('');
    }

    if (!careerAddressField.checkValidity()) {
      careerAddressField.setCustomValidity('يرجى إدخال مكان العمل صحيح.');
    } else {
      careerAddressField.setCustomValidity('');
    }

    if (!membershipDateField.checkValidity()) {
      membershipDateField.setCustomValidity('يرجى إدخال تاريخ الانضمام للعضوية صحيح.');
    } else {
      membershipDateField.setCustomValidity('');
    }
  });



  // Get the form group element containing the radio buttons
var formGroup = document.getElementsByClassName('form-group')[0];



const form2 = document.getElementById('dataForm2');

form2.addEventListener('submit', (event) => {
  event.preventDefault();

  const membershipId = document.getElementById('membership_id').value;

  // Send a GET request to the server to retrieve the member data
  fetch(`/members/${membershipId}`).then((response) => response.json())
    .then((data) => {  
      // Display the member data on the page
      document.getElementById('member_name').value = data.name;
      document.getElementById('member_Birthdate').value = data.birthdate;
      document.getElementById('member_Birthaddress').value = data.birthaddress;
      document.getElementById('member_address').value = data.address;
      document.getElementById('member_Qualification').value = data.qualification;
      document.getElementById('member_CollegeName').value = data.collegename;
      document.getElementById('member_CollegeYear').value = data.collegeyear;
      document.getElementById('member_Specialization').value = data.specialization;
      document.getElementById('member_Nationality').value = data.nationality;
      document.getElementById('member_MemberID').value = data.memberid;
      document.getElementById('MaterialStatus').value = data.materialstatus;
      document.getElementById('Gender').value = data.gender;
      document.getElementById('member_phone').value = data.phone;
      document.getElementById('CurrentCareer').value = data.currentcareer;
      document.getElementById('CareerAddress').value = data.careeraddress;
      document.getElementById('MembershipDate').value = data.membershipdate;
      document.getElementById('memberis_active').checked = data.is_active;
    })
    .catch((error) => {
      console.error('Error retrieving member data:', error);
    });
});


function validatePhoneNumber(phone) {
  var phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
}

var phoneNumber = document.getElementById("member_phone").value;
if (!validatePhoneNumber(phoneNumber)) {
  alert("رقم الهاتف غير صحيح");
  return false;
}

function validateBirthdate(birthdate) {
  var today = new Date();
  var birthdateValue = new Date(birthdate);
  var age = today.getFullYear() - birthdateValue.getFullYear();
  var m = today.getMonth() - birthdateValue.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdateValue.getDate())) {
    age--;
  }
  if (age < 18) {
    return false;
  }
  return true;
}

var birthdate = document.getElementById("member_Birthdate").value;
if (!validateBirthdate(birthdate)) {
  alert("العميل لا يقل عمره عن 18 عاما");
  return false;
}

function validateMemberID(id) {
  var idLength = id.length;
  if (idLength > 10) {
    return false;
  }
  return true;
}

// Wait for the DOM content to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get reference to the radio buttons
  var maleRadio = document.getElementById('Male');
  var femaleRadio = document.getElementById('Female');
  
  // Add event listener for male radio button
  maleRadio.addEventListener('change', function() {
      if (maleRadio.checked) {
          // Male radio button is checked
          console.log('Male selected');
          // You can add more code here to perform additional actions
      }
  });
  
  // Add event listener for female radio button
  femaleRadio.addEventListener('change', function() {
      if (femaleRadio.checked) {
          // Female radio button is checked
          console.log('Female selected');
          // You can add more code here to perform additional actions
      }
  });
});




//////////////////////membership request-acceptmanager///////////////// by nibal





//////////////////////student data///////////////// by nibal
$(document).ready(function() {
  // Call the loadData function when the page loads
  saveStudent();
});

function saveStudent(event) {
  event.preventDefault(); // Prevent form submission
 
  // Get form values
  var studentId = document.getElementById("student_id").value;
  var studentName = document.getElementById("student_name").value;
  var student_univ = document.getElementById("student_univ").value;
  var student_speci = document.getElementById("student_speci").value;
  var CumulativeAverage = document.getElementById("CumulativeAverage").value;
  var AcademicLevel = document.getElementById("AcademicLevel").value;
  var UniversityTuition = document.getElementById("UniversityTuition").value;
  var note = document.getElementById("note").value;

  // Create a new table row
  var table = document.getElementById("studentTable").getElementsByTagName('tbody')[0];
  var newRow = table.insertRow(table.rows.length);

  // Insert data into the new row
  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  var cell3 = newRow.insertCell(2);
  var cell4 = newRow.insertCell(3); 
  var cell5 = newRow.insertCell(4); 
  var cell6 = newRow.insertCell(5);
  var cell7 = newRow.insertCell(6);
  var cell8 = newRow.insertCell(7);


    cell1.innerHTML = item.student_id;
    cell2.innerHTML = item.student_name;
    cell3.innerHTML = item.student_univ;
    cell4.innerHTML = item.student_univ;
    cell5.innerHTML = item.student_speci;
    cell6.innerHTML = item.CumulativeAverage;
    cell7.innerHTML = item.AcademicLevel;
    cell8.innerHTML = item.UniversityTuition;
    cell9.innerHTML=item.note;
  cell10.innerHTML = '<button onclick="deleteStudent(this)">حذف</button>';

  // Clear the form fields
  document.getElementById("student_id").value = "";
  document.getElementById("student_name").value = "";
  document.getElementById("student_univ").value = "";
  document.getElementById("student_speci").value = ""; 
  document.getElementById("CumulativeAverage").value = "";
  document.getElementById("AcademicLevel").value = ""; 
  document.getElementById("UniversityTuition").value = "";
  document.getElementById("note").value = "";
}

// Function to delete a student row
function deleteStudent(button) {
  var row = button.closest('tr');
  row.parentNode.removeChild(row);
}

// Get the select element
const academicLevelSelect = document.getElementById('AcademicLevel');

// Add event listener to prevent manual input
academicLevelSelect.addEventListener('keydown', function(event) {
  event.preventDefault();
});

// Add event listener to validate the selection
academicLevelSelect.addEventListener('change', function() {
  if (this.value === "") {
    alert("يرجى اختيار المستوى الجامعي.");
    this.focus();
  }
});

// Get the phone number input element
const phoneNumberInput = document.getElementById('PhoneNumber');

// Add event listener for input validation
phoneNumberInput.addEventListener('input', function(event) {
  const phoneNumber = event.target.value;

  // Remove any non-numeric characters from the input
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

  // Update the input field with the cleaned phone number
  event.target.value = cleanedPhoneNumber;

  // Check if the cleaned phone number has 10 digits
  if (cleanedPhoneNumber.length !== 10) {
    event.target.setCustomValidity('رقم الهاتف يجب أن يكون مكونًا من 10 أرقام.');
  } else {
    event.target.setCustomValidity('');
  }
});