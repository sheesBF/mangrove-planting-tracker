import React from 'react';
import { Leaf } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F2C30] text-white/80 py-12 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Leaf className="h-6 w-6 text-white" />
            <span className="text-xl font-semibold text-white">Mangrove</span>
          </div>
          <div className="flex space-x-6">
            {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map(social => (
              <a 
                key={social}
                href="#" 
                className="hover:text-white transition-colors duration-300"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
        
        <div className="h-px w-full bg-white/10 mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {[
            {
              title: "About",
              links: ["Our Mission", "Team", "Partners", "Careers"]
            },
            {
              title: "Explore",
              links: ["Gallery", "Species", "Ecosystems", "Research"]
            },
            {
              title: "Get Involved",
              links: ["Donate", "Volunteer", "Events", "Corporate Support"]
            },
            {
              title: "Resources",
              links: ["Articles", "Publications", "Press", "Contact Us"]
            }
          ].map((section, index) => (
            <div key={index}>
              <h4 className="text-white font-medium mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-white/60 hover:text-white transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="h-px w-full bg-white/10 mb-8"></div>
        
        <div className="text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Mangrove Conservation Project. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-white transition-colors duration-300 mr-4">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;