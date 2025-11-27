#  **AI Crop Disease Detector**

The AI-Powered Crop Disease Detector is a tool that helps farmers quickly identify diseases on their crops just by taking a picture. Once a farmer uploads a photo, the system analyzes it and gives a clear diagnosis, shows how serious the disease is, and suggests practical solutions they can use. It also helps farmers find nearby agro-dealers or experts and keeps a record of all previous scans. The goal is to make it easier for farmers to protect their crops, reduce losses, and improve their harvests using easy, accessible technology.
 


##  Demo Video
**Watch here:**  https://www.youtube.com/watch?v=pu_mLWLz-ZQ

##  **Project Structure**
```
 crop-disease-detector/
├──  backend/
│   ├── api/ (models, views, serializers)
│   ├── cropdetector/ (settings, urls, ai_model.py)
│   ├── media/
│   └── manage.py
│
└──  frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── components/ (Navbar, Footer, etc.)
    │   ├── pages/ (Dashboard, Upload, Admin)
    │   ├── App.jsx / main.jsx
    └── package.json

```

##  **Setup Instructions**

### 1️1 Clone the Repository
```bash
git clone https://github.com/justineneema/crop-disease-detector.git
cd crop-disease-detector
cd frontend
cd backend
```

### 2️2 Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

### 3️3 Run the Application
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
for window
venv\script\activate
pip manage.py migrate
python manage.py runserver
```

---

##  **Overview**
- The **AI Crop Disease Detector** uses advanced machine learning to diagnose plant diseases through image uploads.  
- It provides instant results, treatment guidance, appointment booking, and expert validation — all in one easy-to-use web app.  


##  **Key Features**
 **AI Disease Detection** — Upload crop photos and get real-time diagnosis.  
 **Role-Based Access** — Farmers, Experts, Agro-dealers, and Admins.  
 **Smart Treatment Advice** — Step-by-step recovery instructions.  
 **Admin Dashboard** — Manage users, monitor reports, and update models.    
 **phone call** — Connect with agro-dealers or field experts.  
 **Expert Validation** — Professionals can verify or adjust AI predictions.  


##  **Tech Stack**

###  Frontend
-  **React 18** — UI framework  
-  **Vite** — Fast bundler & dev server  
-  **Tailwind CSS** — Modern responsive design  
-  **Axios** — API communication  
-  **Framer Motion** — Beautiful animations  

###  Backend
-  **Django 5.2** + **Django REST Framework** - API logic  
-  **TensorFlow** - AI model integration  
- **Pillow** - Image processing  
-  **JWT Auth** - Secure login system  
- **PostgreSQL** - Database layer  

---

### 4 Requirements
Functional

 - Image upload and AI detection
 - Treatment recommendation
 - Role-based access control
 - Appointment scheduling on call
 - Historical records & reporting
 - admin management

## **Non-Functional**

 - JWT-based security
 - Fast AI processing (<10s perimage)
 - Mobile-friendly, bilingual UI
- Scalable architecture 95% uptime  - reliability


Done by **Justine Neema**

##  **License**
This project is licensed under the MIT License.  
