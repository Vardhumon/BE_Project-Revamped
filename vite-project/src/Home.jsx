import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const navigate = useNavigate();
  const timelineRef = useRef(null);
  const featuresRef = useRef([]);
  const featuresSectionRef = useRef(null);
  const titleRef = useRef(null);
  const cursorRef = useRef(null);
  const particlesRef = useRef([]);
  const containerRef = useRef(null);
  
  // For cursor tracking
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Initialize featuresRef array
  const addToFeaturesRef = (el) => {
    if (el && !featuresRef.current.includes(el)) {
      featuresRef.current.push(el);
    }
  };

  // Initialize particles array
  const addToParticlesRef = (el) => {
    if (el && !particlesRef.current.includes(el)) {
      particlesRef.current.push(el);
    }
  };

  // Custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Cursor animation
  useEffect(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        x: mousePosition.x,
        y: mousePosition.y,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [mousePosition]);

  useEffect(() => {
    // Reset refs on each render
    featuresRef.current = [];
    particlesRef.current = [];

    // Initial title animation
    gsap.fromTo(titleRef.current,
      { 
        y: -100,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out"
      }
    );

    // Infinite floating particle animations
    particlesRef.current.forEach((particle, index) => {
      // Random starting positions and animation parameters
      const xStart = Math.random() * window.innerWidth;
      const yStart = Math.random() * window.innerHeight;
      const duration = 15 + Math.random() * 20;
      const delay = index * 0.2;
      const size = 3 + Math.random() * 10;
      
      gsap.set(particle, {
        x: xStart,
        y: yStart,
        width: size,
        height: size,
        opacity: 0.1 + Math.random() * 0.3,
      });
      
      // Create infinite floating animation
      gsap.to(particle, {
        x: '+=' + (Math.random() * 100 - 50),
        y: '-=' + (Math.random() * 200 + 100),
        opacity: 0,
        duration: duration,
        delay: delay,
        ease: "power1.inOut",
        repeat: -1,
        repeatRefresh: true, // Use different random values on each repeat
        onRepeat: () => {
          // Reset position when animation repeats
          gsap.set(particle, {
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 10,
            opacity: 0.1 + Math.random() * 0.3,
          });
        }
      });
    });

    // Wait for next frame to ensure DOM elements are properly measured
    setTimeout(() => {
      // Find the last feature element to set it as the end point
      const lastFeature = document.querySelector('.feature-item:last-child');
      
      if (lastFeature && timelineRef.current) {
        // Calculate the height needed to reach the bottom of the last feature
        const featuresContainer = featuresSectionRef.current;
        const containerTop = featuresContainer.getBoundingClientRect().top + window.scrollY;
        const lastFeatureBottom = lastFeature.getBoundingClientRect().bottom + window.scrollY;
        const timelineHeight = lastFeatureBottom - containerTop;
        
        // Timeline animation with precise end point
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".timeline-section",
            start: "top center",
            end: `bottom-=${featuresContainer.offsetHeight - timelineHeight} bottom`,
            scrub: 1,
            markers: false
          }
        });

        tl.fromTo(timelineRef.current,
          { height: "0%" },
          { height: `${timelineHeight}px`, duration: 1 }
        );
      }

      // Features animation
      featuresRef.current.forEach((feature, index) => {
        gsap.fromTo(feature,
          {
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: feature,
              start: "top center+=200",
              end: "top center",
              toggleActions: "play none none reverse",
              markers: false
            }
          }
        );
      });

      // Create glowing background effect
      gsap.to(".glow-circle", {
        scale: 1.2,
        opacity: 0.6,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.5
      });
    }, 100);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Custom cursor */}
      <div 
        ref={cursorRef} 
        className="fixed w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-70 pointer-events-none z-50 mix-blend-screen"
        style={{ 
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          filter: "blur(4px)"
        }}
      />
      
      {/* Particle background - 30 particles */}
      {[...Array(30)].map((_, i) => (
        <div 
          key={i}
          ref={addToParticlesRef}
          className="absolute rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0"
          style={{ filter: "blur(3px)" }}
        />
      ))}
      
      {/* Background glow effects */}
      <div className="glow-circle absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500 opacity-10 filter blur-3xl" />
      <div className="glow-circle absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500 opacity-10 filter blur-3xl" />
      <div className="glow-circle absolute top-3/4 right-1/3 w-64 h-64 rounded-full bg-indigo-500 opacity-10 filter blur-3xl" />
      
      {/* Hero Section with improved visibility */}
      <div className="h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-blue-900/20 to-black">
        <div ref={titleRef} className="text-center">
          <h1 className="text-7xl md:text-9xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            CodeWorked
          </h1>
          <h1 className="text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            Park
          </h1>
        </div>
        <p className="mt-8 text-xl md:text-2xl text-gray-300 max-w-2xl text-center px-4">
          Your AI-powered coding hub! Get project suggestions, join communities, and enhance your skills.
        </p>
        <div className="mt-12 flex flex-col md:flex-row gap-6 px-4">
          <button
            onClick={() => navigate("/choices")}
            className="px-8 py-4 text-lg font-bold bg-blue-600 rounded-lg hover:bg-blue-700 transition-all hover:scale-105 overflow-hidden relative group"
          >
            <span className="relative z-10">Create Project</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl" />
          </button>
          <button
            onClick={() => navigate("/community")}
            className="px-8 py-4 text-lg font-bold bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-all hover:scale-105 overflow-hidden relative group"
          >
            <span className="relative z-10">Join Community</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
          </button>
        </div>
      </div>

      {/* Timeline and Features */}
      <div ref={featuresSectionRef} className="timeline-section relative py-20">
        {/* Center Timeline */}
        <div 
          ref={timelineRef}
          className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-purple-500 h-0"
          style={{ minHeight: "10px" }}
        />

        {/* Features with alternating sides */}
        <div className="max-w-6xl mx-auto px-4">
          {/* Feature 1 - Left Side */}
          <div 
            ref={addToFeaturesRef}
            className="feature-item mb-32 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            <div className="p-6 bg-gradient-to-r from-blue-900/30 to-transparent rounded-lg backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <h3 className="text-3xl font-bold mb-4 text-blue-400">Resume-Building Projects</h3>
              <p className="text-gray-300 text-lg">
                Create impressive projects that showcase your skills to potential employers. 
                Our platform suggests projects that are relevant to current industry needs,
                helping you build a portfolio that stands out in the job market.
              </p>
            </div>
            <div></div> {/* Empty div for right side */}
          </div>

          {/* Feature 2 - Right Side */}
          <div 
            ref={addToFeaturesRef}
            className="feature-item mb-32 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            <div></div> {/* Empty div for left side */}
            <div className="p-6 bg-gradient-to-r from-purple-900/30 to-transparent rounded-lg backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <h3 className="text-3xl font-bold mb-4 text-purple-400">Join Developer Communities</h3>
              <p className="text-gray-300 text-lg">
                Connect with like-minded developers who share your interests and goals.
                Participate in discussions, share resources, and grow together in specialized
                communities focused on different technologies and skill levels.
              </p>
            </div>
          </div>

          {/* Feature 3 - Left Side */}
          <div 
            ref={addToFeaturesRef}
            className="feature-item mb-32 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            <div className="p-6 bg-gradient-to-r from-blue-900/30 to-transparent rounded-lg backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <h3 className="text-3xl font-bold mb-4 text-blue-400">Skill Enhancement Tracking</h3>
              <p className="text-gray-300 text-lg">
                Monitor your progress as you complete projects and learn new technologies.
                Our platform tracks your skills development and suggests new challenges
                to help you grow as a developer and expand your knowledge.
              </p>
            </div>
            <div></div> {/* Empty div for right side */}
          </div>
        </div>
      </div>

      {/* Footer with animated gradient */}
      <footer className="relative py-12 overflow-hidden">
        <div className="footer-gradient absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20 opacity-30" />
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4 text-blue-400">About Us</h4>
              <p className="text-gray-400">Empowering developers to create, learn, and grow together.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 text-purple-400">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Projects</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Communities</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 text-blue-400">Connect</h4>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-gray-500">
            © {new Date().getFullYear()} CodeWorked Park. All rights reserved.
          </div>
        </div>

        {/* Animated footer gradient */}
        <script dangerouslySetInnerHTML={{
          __html: `
            gsap.to('.footer-gradient', {
              backgroundPosition: '-100% 0',
              duration: 15,
              repeat: -1,
              ease: 'none'
            });
          `
        }} />
      </footer>
    </div>
  );
}