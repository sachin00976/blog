import React from 'react';
import { Helmet } from 'react-helmet-async'

function About() {
  return (
    <>
      <Helmet>
        <title>{`About - ${import.meta.env.VITE_APP_NAME}`}</title>
      </Helmet>
      <div className="bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 text-white min-h-screen flex flex-col items-center py-10">
        {/* About Us Section */}
        <div className="max-w-4xl text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">About Us</h2>
          <p className="text-lg leading-relaxed">
            Welcome to <span className="font-semibold">Your Blog Name</span>, your go-to destination for insightful stories, expert tips, and fresh perspectives on topics like "travel, technology, lifestyle, and beyond."
          </p>
          <p className="text-lg leading-relaxed mt-4">
            At <span className="font-semibold">Your Blog Name</span>, we believe that every idea has the power to inspire, every story deserves to be heard, and every reader deserves content that enriches their life. Whether you're looking to stay informed, spark creativity, or connect with a like-minded community, you've come to the right place.
          </p>
        </div>

        {/* Our Mission Section */}
        <div className="max-w-4xl text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            Our mission is simple: to create meaningful content that resonates with our audience. We strive to:
          </p>
          <ul className="list-disc list-inside mt-4 text-lg text-left">
            <li>
              <span className="font-semibold">Inspire:</span> Share thought-provoking ideas and experiences.
            </li>
            <li>
              <span className="font-semibold">Educate:</span> Offer practical advice and in-depth guides.
            </li>
            <li>
              <span className="font-semibold">Engage:</span> Foster a community where readers feel connected and heard.
            </li>
          </ul>
        </div>

        {/* Join the Conversation Section */}
        <div className="max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Join the Conversation</h2>
          <p className="text-lg leading-relaxed">
            We’re more than just a blog—we’re a community. Dive into our content, leave your thoughts in the comments, and connect with us on [insert social media links]. Let’s learn, grow, and share together.
          </p>
          <p className="text-lg leading-relaxed mt-4">
            Thank you for being part of our journey. Whether you’re a loyal reader or a first-time visitor, we’re glad you’re here.
          </p>
          <p className="text-lg leading-relaxed mt-4 font-semibold">Stay curious, stay inspired,</p>
        </div>
      </div>
    </>
  );
}

export default About;
