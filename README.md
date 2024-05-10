### Prerequisites

Before proceeding with the setup, please ensure you have the following installed on your system:

- Node.js (and npm)
- Python 3
- pip (Python package installer)

### Installation

1. **Clone the Repository**

   First, clone this repository to your local machine using Git:

   ```bash
   git clone [<repository-url>](https://github.com/PennyWiseApp/PennyWise.git)
   cd PennyWise
   ```

2. **Run npm Install**

   Within the root directory of the project, run the following command:

   ```bash
   npm install
   ```

   **Note:** The `postinstall` script specifically does the following:

   - Uses `pip` to install the Python packages listed in `backend/requirements.txt`.

### Running the Application

After the installation is complete, you're ready to run the application.

- **To start the Node.js frontend**, use:

  ```bash
  npm start
  ```

### Additional Notes

- The project setup and execution instructions assume a Unix-like environment (Linux/macOS). For Windows, the activation command for the virtual environment is slightly different (`venv\Scripts\activate`).
- Always ensure that your Python and Node.js environments are correctly set up and that the versions meet the project's requirements.

# PennyWise

Group Members:
Omer Ibrahim UP2123828
Ruben Tanner UP2109969
Mufaro Mudiwa UP2081619
George Hill UP2107551
Shreya Jagannatha UP2105326

## Technology Stack

- Node.js
- Express
- HTML/CSS/JavaScript
- Bcrypt
- Cors
- jsonwebtoken
- sequelize
- sqlite3
