import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import Preloader from "@/components/Preloader";
import ChatBot from "@/components/ChatBot";
import WelcomeModal from "@/components/WelcomeModal";
import CustomCursor from "@/components/CustomCursor";
import SectionDots from "@/components/SectionDots";

export default function Home() {
  return (
    <main>
      <Preloader />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Education />
      <Contact />
      <Footer />
      <BackToTop />
      <ChatBot />
      <WelcomeModal />
      <CustomCursor />
      <SectionDots />
    </main>
  );
}
