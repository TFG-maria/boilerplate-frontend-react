# React + Tailwind Boilerplate

Este es un proyecto base con **React** + **Vite** + **Tailwind CSS** que incluye:

- 🌐 Landing page
- 🔐 Página de login
- 🧱 Estructura modular para escalar fácilmente



## 🚀 Cómo iniciar el proyecto

### 1. Clona este repositorio o descarga el código:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

### 2.  Instala dependencias:

```bash
npm install
```

### 3. Ejecuta en modo desarrollo:

```bash
npm run dev
```

### 4. Abre tu navegador en http://localhost:5173

## 📁 Estructura del proyecto

```
src/
├── pages/
│   ├── Landing.jsx
│   └── Login.jsx
├── components/
│   └── Navbar.jsx
├── App.jsx
├── main.jsx
└── index.css
```

- **pages/:** contiene las vistas principales (Landing, Login, etc.)

- **components/:** componentes reutilizables (Navbar, Footer, etc.)

- **App.jsx:** define las rutas de la app

- **index.css:** estilos base con Tailwind

- **main.jsx:** punto de entrada principal


## ➕ Cómo agregar nuevas páginas

### Crea un archivo JSX en src/pages, por ejemplo About.jsx:

```jsx
export default function About() {
  return <div className="p-8">Acerca de nosotros</div>;
}
```

### Importa y añade una ruta en App.jsx:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
```

## 🧩 Cómo agregar nuevos componentes

### Crea un nuevo archivo en src/components, por ejemplo Button.jsx:

```jsx
export default function Button({ children }) {
  return <button className="bg-blue-500 text-white px-4 py-2 rounded">{children}</button>;
}
```

### Usa el componente donde lo necesites:

```html
import Button from '../components/Button';

<Button>Haz clic</Button>
```

## 🛠 Build para producción

```bash
npm run build
```

Esto generará una carpeta dist/ con todos los archivos listos para ser desplegados.

## 📦 Tecnologías usadas

- React

- Vite

- Tailwind CSS

- React Router DOM