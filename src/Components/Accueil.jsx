import React from 'react';
import User from './User';
import Footer from './Footer';
import logo from "./../Images/logo.jpeg";
import { motion } from "framer-motion";
import '../App.css';

function Accueil() {
  return (
    <div style={styles.container}>
      {/* Header */}
      <motion.header 
        style={styles.header}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div style={styles.headerContent}>
          <motion.img 
            src={logo} 
            alt="Logo" 
            style={styles.logo} 
            whileHover={{ scale: 1.1 }}
          />
          <h1 style={styles.title}>
            Ensemble, passons chaque examen.
          </h1>
        </div>
      </motion.header>

      {/* Présentation */}
      <motion.section 
        style={styles.presentation}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div style={styles.presentationContent}>
          <p>
            Bienvenue sur <span style={styles.highlight}>GoodExam</span>, la plateforme innovante qui révolutionne la manière de passer et de gérer vos examens. <br />
            Que vous soyez étudiant ou enseignant, notre outil est conçu pour vous accompagner à chaque étape de votre parcours d'évaluation. <br />
            Avec des fonctionnalités intuitives, des ressources adaptées et un suivi personnalisé, <span style={styles.highlight}>GoodExam</span> vous offre tout ce dont vous avez besoin pour réussir en toute confiance.
          </p>
          <p style={styles.subtext}>Prêt à transformer vos efforts en résultats ? Découvrez dès maintenant une nouvelle façon de tester et d'exceller.</p>
        </div>
      </motion.section>


      {/* Options */}
      <section style={styles.optionSection}>
        <div style={styles.optionContainer}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User choix="etudiant" description="Progresser à ton rythme et décrocher la réussite que tu mérites." />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User choix="enseignant" description="Gérez vos examens en toute simplicité, tout en offrant à vos étudiants un suivi personnalisé." />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Accueil;

// Styles
const styles = {
  container: {
    fontFamily: "sans-serif",
  },
  header: {
    background: "linear-gradient(to right, #3b82f6, #6366f1)",
    color: "white",
    padding: "40px 0",
    textAlign: "center",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  headerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    width: "80px",
    borderRadius: "50%",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  presentation: {
    backgroundColor: "#f3f4f6",
    padding: "50px 20px",
    textAlign: "center",
  },
  presentationContent: {
    maxWidth: "800px",
    margin: "0 auto",
    fontSize: "18px",
    lineHeight: "1.6",
  },
  highlight: {
    color: "#007bff",
    fontWeight: "bold",
  },
  subtext: {
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "500",
  },
  optionSection: {
    backgroundColor: "#ffffff",
    padding: "60px 20px",
  },
  optionContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "40px",
  },
};
