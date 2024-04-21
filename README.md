# Project Setup

This project is structured to include both a Node.js-based frontend and a Python-based backend utilizing Streamlit. To streamline the setup process, we have included a `postinstall` script in the `package.json` file that automatically prepares the Python environment and installs the necessary Python dependencies after running `npm install`.

### Prerequisites

Before proceeding with the setup, please ensure you have the following installed on your system:

- Node.js (and npm)
- Python 3
- pip (Python package installer)

These tools are essential for the setup process and the execution of the application.

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

   This command does several things:

   - Installs the Node.js dependencies listed in `package.json`.
   - Automatically triggers the `postinstall` script, which sets up the Python virtual environment (`venv`) within the `backend/` directory and installs the Python dependencies specified in `backend/requirements.txt`.

   **Note:** The `postinstall` script specifically does the following:

   - Creates a Python virtual environment in `backend/venv`.
   - Activates the virtual environment.
   - Uses `pip` to install the Python packages listed in `backend/requirements.txt`.

### Running the Application

After the installation is complete, you're ready to run the application.

- **To start the Node.js frontend**, use:

  ```bash
  npm start
  ```

  (Refer to the `scripts` section in `package.json` for the exact command used to start the frontend.)

- **To launch the Streamlit application**, use:

  ```bash
    npm start-streamlit
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
- IndexedDB

## Setup

### Installation

1. Install Node.js and npm.
2. Clone this repository.
3. Navigate to the project directory and install dependencies:
   ```bash
   npm install
   ```
