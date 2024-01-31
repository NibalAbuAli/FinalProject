document.addEventListener('DOMContentLoaded', function () {
    // Add an event listener to the logout button
    document.getElementById('logoutButton').addEventListener('click', function () {
        // Call the logout function
        logout();
    });
});

// Function to handle logout
function logout() {
    // Perform any logout logic here (e.g., clearing session, redirecting to login page, etc.)
    console.log('User logged out');

    // Redirect to the login page (replace 'login.html' with your actual login page)
    window.location.href = 'loginpage.html';
}



document.getElementById('MaterialStatus').addEventListener('change', function () {
    // Get the selected value
    var selectedValue = this.value;

    // You can do something with the selected value here
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

  const closeButtons = document.querySelectorAll('.close');

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('section');
      if (section) {
        section.style.display = section.style.display === 'none' ? '' : 'none';
      }
    });
  });