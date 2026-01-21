import "./styles/global.css";

import Header from "./components/header.tsx";
import Hero from "./components/Hero.js";
import About from "./components/About.tsx";
import Skills from "./components/Skills.tsx";
import Projects from "./components/Projects.tsx";
import Contact from "./components/Contanct.tsx";
import Footer from "./components/Footer.tsx";

function App() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}

export default App;
