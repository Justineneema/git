import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Bigfarm from '../assets/Farm.jpeg';
import farmer from '../assets/Farmer.jpeg';

export default function LandingPage() {
  return (
    <div className="space-y-12">
      {/* Hero with large farm image and description side-by-side */}
      <motion.section id="hero" className="card bg-white" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.6}}>
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <img className="w-full h-80 md:h-[420px] object-cover rounded-lg" src= {Bigfarm} alt="Rwandan farmer with healthy crops" />
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-forest leading-tight">AI-Powered Crop Disease Detector</h1>
            <p className="mt-3 text-gray-700">Empowering farmers with accurate, fast, and practical crop health insights. Take a picture of a leaf or fruit to get instant diagnosis, treatment advice, and local expert support.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/upload" className="btn-primary">Start Detection</Link>
              <Link to="/about" className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">Learn More</Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Mission */}
      <motion.section id="mission" className="card" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}}>
        <h2 className="text-xl font-bold text-forest">Our Mission</h2>
        <p className="mt-3 text-gray-700">
          Empowering Rwandan farmers and communities with timely, accurate, and accessible crop health information through technology.
        </p>
      </motion.section>

      {/* Problem & Solution */}
      <motion.section id="problem-solution" className="grid gap-6 md:grid-cols-2" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{staggerChildren:0.2}}>
        <div className="card">
          <h3 className="text-lg font-semibold text-forest">Problem</h3>
          <p className="mt-2 text-gray-700">
            Smallholder farmers lack access to extension officers and tools to identify diseases like banana wilt, maize leaf blight, and potato late blight early enough to prevent losses.
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-forest">Solution</h3>
          <ul className="mt-2 space-y-2 text-gray-700 list-disc list-inside">
            <li>AI-based detection from a simple photo</li>
            <li>User-assisted validation for credibility</li>
            <li>Treatment recommendations (organic, chemical, cultural)</li>
            <li>Local experts and agro-dealer info</li>
          </ul>
        </div>
      </motion.section>

      {/* Featured Images - include farmer with phone capturing crop */}
      <motion.section id="images" className="card" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}}>
        <h3 className="text-lg font-semibold text-forest">Healthy Crops</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <img className="rounded-lg object-cover w-full h-56" src="https://gardendesign.com/pictures/images/900x705Max/site_3/kentucky-blue-green-bean-burpee_15979.jpg" alt="Beans" />
          <img className="rounded-lg object-cover w-full h-56" src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop" alt="Leaf closeup" />
          <img className="rounded-lg object-cover w-full h-56" src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop" alt="Farm" />
        </div>
      </motion.section>

      <motion.section id="capture" className="card" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}}>
        <h3 className="text-lg font-semibold text-forest">Capture and Diagnose</h3>
        <div className="mt-3 grid gap-6 md:grid-cols-2 items-center">
          <img className="rounded-lg object-cover w-full h-72" src= {farmer} alt="Farmer capturing crop with phone" />
          <p className="text-gray-700">Open the Upload page, point your camera at the affected leaf or fruit, and capture with good lighting. Our system verifies the image and returns a clear diagnosis with treatment advice and care tips.</p>
        </div>
      </motion.section>

      {/* Services */}
      <section className="card">
        <h3 className="text-lg font-semibold text-forest">Services</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          {[
            {title:'AI Disease Detection',desc:'Instant analysis from photo.'},
            {title:'Treatment Guidance',desc:'Organic, chemical, cultural.'},
            {title:'Local Expert Access',desc:'Nearby agronomists & dealers.'},
            {title:'History & Reports',desc:'Track detections over time.'},
          ].map(s => (
            <div key={s.title} className="rounded-lg border border-gray-200 p-4 bg-white">
              <div className="font-medium text-forest">{s.title}</div>
              <div className="text-sm text-gray-700 mt-1">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="card">
        <h3 className="text-lg font-semibold text-forest">How it works</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          {[
            { title: 'Take a Picture', desc: 'Capture a clear leaf/fruit image.' },
            { title: 'Get Diagnosis', desc: 'AI suggests likely diseases.' },
            { title: 'See Treatment', desc: 'Best-practice recommendations.' },
            { title: 'Find Support', desc: 'Nearby experts and shops.' },
          ].map((s) => (
            <div key={s.title} className="rounded-lg border border-green-200 bg-white p-4">
              <div className="font-medium text-forest">{s.title}</div>
              <div className="text-sm text-gray-700 mt-1">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card text-center">
        <h3 className="text-lg font-semibold text-forest">Ready to boost your harvest?</h3>
        <p className="text-gray-700 mt-1">It takes less than a minute to try your first detection.</p>
        <div className="mt-4 flex gap-3 justify-center">
          <Link to="/upload" className="btn-primary">Upload an Image</Link>
          <Link to="/dashboard" className="px-4 py-2 rounded-md border border-green-600 text-green-700 hover:bg-green-50">View History</Link>
        </div>
      </section>
    </div>
  )
}


