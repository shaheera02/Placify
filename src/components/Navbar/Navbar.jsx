import React from "react";
import Logo from "../../assets/Logo.png";
import { motion } from "framer-motion";

const NavLinks = [
  {
    id: 1,
    title: "Homie",
    link: "/",
  },{
    id: 2,
    title: "Job Trends",
    link: "job",
  },
  {
    id: 2,
    title: "Resume Analyzer",
    link: "resume",
  },
  {
    id: 3,
    title: "Chatbot",
    link: "chatbot",
  },
  {
    id: 4,
    title: "About",
    link: "/about",
  },
];
const Navbar = () => {
  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="container py-6 flex justify-between items-center"
      >
        {/* Logo section */}
        <div className="flex items-center gap-3">
          <img src={Logo} alt="logo" className="w-10" />
          <span className="text-2xl font-bold">Placify</span>
        </div>
        {/* Link section */}
        <div className="hidden md:block !space-x-12">
          {NavLinks.map((link) => {
            return (
              <a
                href={link.link}
                className="inline-block mx-4 text-lg font-semibold"
              >
                {link.title}
              </a>
            );
          })}
        </div>
        {/* Button section */}
        <div>
          <button className="primary-btn">Login</button>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
