# Appointment Booking System

A system to encourage patients to book appointments with new doctors by offering first-time consultation discounts while ensuring proper tracking and financial accuracy.

## Key Features

- **User Authentication**: Secure user registration and login using JWT tokens, with token storage in cookies.
- **Doctor Availability**: Doctors can set their availability for appointments.
- **Discount Tracking**: Apply discounts for first-time consultations based on doctor-patient pairs.
- **Wallet Integration**: Deduct discounted amounts from patient wallets to ensure financial transactions are accurate.
- **Usage Monitoring**: Ensure discounts are applied only once per doctor-patient pair.
- **Financial Reporting**: Generate detailed reports on discount usage and transactions for both patients and doctors.

## Tech Stack

- **Backend**: Node.js with Express.js.
- **Frontend**: React
- **Database**: MongoDB

## Installation

Follow these steps to set up and run the project locally:

### Backend Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/Ranjit-Parmar/Appointment-Booking-System.git
    cd Appointment-Booking-System
    cd server
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Create a `.env` file** in the backend directory and set the required environment variables:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRATION=3600s
    PORT=3000
    ```

4. **Run the backend server**:

    ```bash
    npm run dev
    ```

    The server will now be running at `http://localhost:3000`.

### Frontend Setup

1. **Navigate to the frontend directory**:

    ```bash
    cd ./client
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the frontend development server**:

    ```bash
    npm run dev
    ```

    The frontend will now be running at `http://localhost:5173`.

## Usage

### User Authentication
- **Register**: Patients and doctors can register by providing their details.
- **Login**: Users log in with their credentials to receive a JWT token stored in a cookie.

### Booking an Appointment
- Doctors set their availability for appointments.
- Patients can browse available doctors and schedule appointments based on the doctor's availability.

### First-time Consultation Discount
- New patients can receive a first-time consultation discount when booking an appointment with a doctor.
- Discounts are applied only once per doctor-patient pair.

### Wallet Integration
- Patients can maintain a wallet balance.
- When an appointment is booked with a discount, the discounted amount is deducted from the patient's wallet.

### Financial Reporting
- Both patients and doctors can generate detailed reports to track transaction history and discount usage.

## Routes & API Endpoints

### Authentication Routes
- **POST `/api/v1/auth/register`**: Register a new user (doctor or patient).
- **POST `/api/v1/auth/login`**: Login to get a JWT token.

### Appointment Routes
- **POST `/api/v1/appointments/book-appointment`**: Book an appointment with a doctor.
- **GET `/api/v1/appointments/patient-appointments/:id`**: Get all appointments for a patient.
- **GET `/api/v1/appointments/doctor-appointments/:id`**: Get all appointments for a doctor.

### Wallet Routes

- **POST `/api/v1/wallet/add`**: Deposit money into the wallet.


### Reporting Routes
- **GET `/api/v1/transaction/doctorReport/:doctorId`**: Generate financial report for a doctor.
- **GET `/api/v1/transaction/patientreport/:patientId`**: Generate financial report for a patient.

## Testing

For testing the API endpoints, you can use **Postman** to send requests to your local backend.

Make sure to include the JWT token in the Cookies for protected routes:

