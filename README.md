#  **AI Crop Disease Detector**

An intelligent web platform powered by **Artificial Intelligence** to detect crop diseases from images and recommend treatments — built for farmers, experts, and agro-dealers to make agriculture smarter and healthier.  

---

##  Demo Video
**Watch here:**  https://www.youtube.com/watch?v=pu_mLWLz-ZQ

##  **Overview**
- The **AI Crop Disease Detector** uses advanced machine learning to diagnose plant diseases through image uploads.  
- It provides instant results, treatment guidance, appointment booking, and expert validation — all in one easy-to-use web app.  

---

##  **Key Features**
 **AI Disease Detection** — Upload crop photos and get real-time diagnosis.  
 **Role-Based Access** — Farmers, Experts, Agro-dealers, and Admins.  
 **Smart Treatment Advice** — Step-by-step recovery instructions.  
 **Admin Dashboard** — Manage users, monitor reports, and update models.    
 **phone call** — Connect with agro-dealers or field experts.  
 **Expert Validation** — Professionals can verify or adjust AI predictions.  

---

##  **Tech Stack**

###  Frontend
-  **React 18** — UI framework  
-  **Vite** — Fast bundler & dev server  
-  **Tailwind CSS** — Modern responsive design  
-  **Axios** — API communication  
-  **Framer Motion** — Beautiful animations  

###  Backend
-  **Django 5.2** + **Django REST Framework** — API logic  
-  **TensorFlow** — AI model integration  
- **Pillow** — Image processing  
-  **JWT Auth** — Secure login system  
- **PostgreSQL** — Database layer  

---

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




##  **License**
This project is licensed under the MIT License.  
