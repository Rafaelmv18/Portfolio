import "./index.css";

import Header from "./components/Header.tsx";
import Hero from "./components/Hero.tsx";
import Experience from "./components/Experience.tsx";
import Projects from "./components/Projects.tsx";
import Skills from "./components/Skills.tsx";
import About from "./components/About.tsx";
import Contact from "./components/Contact.tsx";
import Footer from "./components/Footer.tsx";

function App() {
  return (
    <>
      <Header />
      <main className="portfolio-container">
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
