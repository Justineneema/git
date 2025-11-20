import React from 'react'

export default function About() {
  return (
    <div className="space-y-6">
      <section className="card">
        <h2 className="text-2xl font-semibold text-forest">About the Project</h2>
        <p className="mt-2 text-gray-700">I am building a comprehensive and locally tailored crop-health assistant designed specifically for Rwandan farmers. This product uses advanced AI technology to help farmers quickly identify crop diseases by simply capturing a photo of an affected leaf or fruit. After analyzing the image, it provides an accurate diagnosis, practical treatment recommendations, and direct access to local agricultural resources, including nearby agro-dealers and extension services.</p>
      </section>
      <section className="card">
        <h3 className="text-lg font-semibold text-forest">Problem Statement</h3>
        <p className="mt-2 text-gray-700">The farmers and mostly the smallholders in Rwanda do not have access to extension officers or agricultural experts. Some of the common crop diseases are banana bacterial wilt, maize leaf blight, and potato late blight, which are difficult to recognize without technical skills. </p>
      </section>
      <section className="card">
        <h3 className="text-lg font-semibold text-forest">Solution</h3>
        <p>
          Through our platform farmers can post pictures of infected crops where AI-based detection takes place. The recommended matches can then be reviewed by the user and validated by people enhancing the accuracy of the validation. After the disease has been confirmed, the system offers specific treatment suggestions such as organic, chemical, and cultural treatment and links farmers to local agro-dealers and extension services.
        </p>
      </section>
      <section className="card">
        <h3 className="text-lg font-semibold text-forest">Mission</h3>
        <p className="mt-2 text-gray-700">Empowering the Rwandan farmers and communities by providing effective technology-based access to timely, accurate, and accessible crop-health information. 
        </p>
      </section>
    </div>
  )
}