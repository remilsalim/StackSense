# StackSense™ - Intelligent Tech Stack Recommender

**StackSense** is an advanced, algorithm-driven recommendation engine designed to help developers, founders, and students choose the perfect technology stack for their next big idea.

Unlike generic comparison sites, StackSense analyzes your specific project context including project type, domain, expected scale, team size, budget, and over 12 detailed technical priorities to suggest the optimal **Frontend, Backend, Database, and DevOps** solutions.

## 🚀 Key Features

- **🧠 Context-Aware Engine:** The backend logic (built with Python) understands nuances like *"Static Website vs. Microservices"* or *"Fintech vs. E-commerce"* and adapts scoring weights dynamically.
- **🔍 Smart Search:** Instantly search through **50+ Project Types and Domains** using our high-performance autocomplete fields.
- **⚡ Multi-Factor Priorities:** Select from 12+ critical factors like *Scalability*, *Security*, *Time-to-Market*, and *Power Efficiency*. The engine knows that "High Performance" means C++/Rust, while "Rapid Dev" means Python/Firebase.
- **🚀 Deployment Strategies:** Automatically suggests the best hosting and infrastructure path (e.g., *Vercel for Static Sites*, *Kubernetes for Enterprise*, *Greengrass for IoT*) based on your architecture.
- **🆚 Interactive Comparisons:** Hover over "Close Alternatives" to reveal **"Why Not?" tooltips**, explaining exactly why other technologies were ranked lower (e.g., *"Good performance but steeper learning curve"*).
- **🎨 Premium UI:** A stunning interface built with **React + Tailwind CSS v4**, featuring glassmorphism, mesh gradients, fluid animations, and a responsive layout.

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS v4** (PostCSS)
- **CSS Modules** & Custom Animations

### Backend
- **FastAPI** (High-performance Python web framework)
- **Pydantic** (Data validation & settings management)
- **Uvicorn** (ASGI Server)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### 1. Clone the Repository
```bash
git clone https://github.com/remilsalim/StackSense.git
cd StackSense
```

### 2. Backend Setup
Navigate to the backend directory and start the server:
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install fastapi uvicorn pydantic
# Or if requirements.txt exists: pip install -r requirements.txt

python -m uvicorn main:app --reload
```
*The backend API will respond at `http://localhost:8000`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
*The application will launch at `http://localhost:5173`*

## 📝 Usage

1.  **Describe Your Vision:** Select your Project Type (e.g., *SaaS Platform*) and Domain (e.g., *Healthcare*).
2.  **Set Constraints:** Define your scale, team size, and budget.
3.  **Define Priorities:** Check key drivers like *Security & Privacy* or *Offline Capability*.
4.  **Get Results:** Hit "Generate Recommendation" to see your tailored stack, Pro Advantages, and Deployment Strategy.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

© 2026 **StackSense™**.
Crafted with ♥ by **Remil Salim**.

