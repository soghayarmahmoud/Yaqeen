import Image from "next/image";
// import {Header} from "@/components/Header";
// import {Footer} from "@/components/Footer";
import Header from './components/Header'; 
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header activeTab="الرئيسية" />

      <main className="flex-grow bg-white">
      </main>

      <Footer />
    </div>
  );
}
