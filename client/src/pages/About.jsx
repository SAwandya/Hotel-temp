import React from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { Link } from "react-router-dom";

const About = () => {
  // Team members data
  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2787&auto=format&fit=crop",
      bio: "With over 15 years in hospitality, Sarah founded WanderNest to bring authentic travel experiences to everyone.",
    },
    {
      name: "Michael Chen",
      role: "Chief Experience Officer",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2787&auto=format&fit=crop",
      bio: "Michael oversees our curated experiences, ensuring each one meets our high standards of quality and authenticity.",
    },
    {
      name: "Aisha Patel",
      role: "Head of Partnerships",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2961&auto=format&fit=crop",
      bio: "Aisha builds relationships with hotels and experience providers worldwide to bring you exclusive offers.",
    },
    {
      name: "James Wilson",
      role: "Customer Experience Director",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2940&auto=format&fit=crop",
      bio: "James ensures every guest enjoys seamless service from booking to check-out and beyond.",
    },
  ];

  // Company values
  const values = [
    {
      title: "Authenticity",
      description:
        "We believe in genuine experiences that connect travelers with local cultures and communities.",
      icon: assets.badgeIcon,
    },
    {
      title: "Sustainability",
      description:
        "We're committed to responsible travel practices that respect our planet and local populations.",
      icon: assets.locationFilledIcon,
    },
    {
      title: "Excellence",
      description:
        "We maintain the highest standards in every aspect of our service, from hotel selection to customer support.",
      icon: assets.starIconFilled,
    },
    {
      title: "Innovation",
      description:
        "We continuously evolve our platform to enhance the travel experience through technology.",
      icon: assets.homeIcon,
    },
  ];

  return (
    <div className="py-28 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-6">
              Our Story
            </h1>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Founded in 2018, WanderNest was born from a passion for travel and
              a desire to make exceptional accommodations accessible to
              everyone. What began as a small startup has grown into a global
              platform connecting travelers with unforgettable stays and
              experiences.
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Our mission is simple: to transform ordinary trips into
              extraordinary memories by curating the finest accommodations and
              authentic local experiences around the world.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/rooms"
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all"
              >
                Explore Hotels
              </Link>
              <Link
                to="/experience"
                className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition-all"
              >
                Discover Experiences
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
              alt="Hotel lobby"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 my-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">
            Our Global Reach
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            From bustling city centers to remote hideaways, we connect travelers
            with exceptional accommodations around the world.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              500+
            </div>
            <p className="text-gray-600">Cities Worldwide</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              10,000+
            </div>
            <p className="text-gray-600">Curated Properties</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              2.5M+
            </div>
            <p className="text-gray-600">Happy Guests</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              1,000+
            </div>
            <p className="text-gray-600">Unique Experiences</p>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="my-16">
        <Title
          title="Our Core Values"
          subTitle="The principles that guide us in creating exceptional travel experiences"
          align="center"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <img src={value.icon} alt={value.title} className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="my-20 bg-white">
        <Title
          title="Our Journey"
          subTitle="The key milestones that have shaped our growth"
          align="center"
        />

        <div className="relative mt-16">
          {/* Timeline line */}
          <div className="absolute top-0 left-1/2 w-1 h-full bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>

          {/* Timeline items */}
          <div className="space-y-12 relative">
            <div className="md:flex items-center">
              <div className="md:w-1/2 md:text-right md:pr-8 mb-4 md:mb-0">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium text-primary">2018</h3>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    Foundation
                  </h4>
                  <p className="text-gray-600">
                    WanderNest was founded with a vision to transform travel
                    accommodations.
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center z-10">
                <div className="bg-primary h-6 w-6 rounded-full"></div>
              </div>
              <div className="md:w-1/2 md:pl-8"></div>
            </div>

            <div className="md:flex items-center">
              <div className="md:w-1/2 md:pr-8"></div>
              <div className="hidden md:flex items-center justify-center z-10">
                <div className="bg-primary h-6 w-6 rounded-full"></div>
              </div>
              <div className="md:w-1/2 md:pl-8 mb-4 md:mb-0">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium text-primary">2019</h3>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    Expansion
                  </h4>
                  <p className="text-gray-600">
                    Expanded to 50+ cities and launched our mobile application.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:flex items-center">
              <div className="md:w-1/2 md:text-right md:pr-8 mb-4 md:mb-0">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium text-primary">
                    2020-2021
                  </h3>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    Adaptation
                  </h4>
                  <p className="text-gray-600">
                    Navigated pandemic challenges by introducing flexible
                    bookings and health safety measures.
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center z-10">
                <div className="bg-primary h-6 w-6 rounded-full"></div>
              </div>
              <div className="md:w-1/2 md:pl-8"></div>
            </div>

            <div className="md:flex items-center">
              <div className="md:w-1/2 md:pr-8"></div>
              <div className="hidden md:flex items-center justify-center z-10">
                <div className="bg-primary h-6 w-6 rounded-full"></div>
              </div>
              <div className="md:w-1/2 md:pl-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium text-primary">Present</h3>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    Global Presence
                  </h4>
                  <p className="text-gray-600">
                    Now operating in 500+ cities with a mission to make travel
                    more meaningful and accessible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="my-20">
        <Title
          title="Meet Our Team"
          subTitle="The passionate people behind WanderNest"
          align="center"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium">{member.name}</h3>
                <p className="text-primary text-sm mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="my-20 bg-blue-50 rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">
          Join Our Community
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Sign up today and begin your journey with WanderNest. Discover
          extraordinary destinations, book your perfect accommodation, and
          create memories that last a lifetime.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/rooms"
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all"
          >
            Start Exploring
          </Link>
          <a
            href="#contact"
            className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition-all"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="my-16">
        <Title
          title="Get In Touch"
          subTitle="Have questions or feedback? We'd love to hear from you."
          align="center"
        />

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2.5 rounded-md hover:bg-primary/90 transition-all"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                  <img
                    src={assets.locationIcon}
                    alt="location"
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Address</h4>
                  <p className="text-gray-600">
                    123 Travel Avenue, Suite 500
                    <br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                  <img src={assets.mailIcon} alt="email" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-gray-600">
                    hello@wandernest.com
                    <br />
                    support@wandernest.com
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                  <img src={assets.phoneIcon} alt="phone" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <p className="text-gray-600">
                    +1 (555) 123-4567
                    <br />
                    +1 (800) WANDER
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mt-8 mb-4">
              Office Hours
            </h3>
            <div className="space-y-2 mb-8">
              <div className="flex justify-between">
                <span className="text-gray-600">Monday - Friday</span>
                <span className="font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturday</span>
                <span className="font-medium">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sunday</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Follow Us
              </h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="bg-gray-200 p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.378 4.486A13.95 13.95 0 011.67 3.15a4.89 4.89 0 001.524 6.574 4.91 4.91 0 01-2.23-.616v.061a4.917 4.917 0 003.95 4.828 4.94 4.94 0 01-2.224.084 4.92 4.92 0 004.6 3.415 9.863 9.863 0 01-6.115 2.107c-.398 0-.79-.023-1.175-.068a13.896 13.896 0 007.548 2.212c9.057 0 14.01-7.502 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-200 p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.98 0a6.9 6.9 0 01.702.031c.31.013.62.029.92.055.302.033.602.078.902.148.304.074.596.165.88.273.303.132.588.264.853.423.265.158.512.343.733.55.22.205.406.454.561.719.155.264.287.552.392.855.104.33.188.63.25.947.061.31.112.63.152.955.041.325.072.655.09.98.02.333.031.666.031 1v9.945c0 .334-.012.666-.031 1a15.91 15.91 0 01-.09.98c-.04.325-.09.65-.152.955-.062.31-.146.63-.25.947-.105.303-.237.59-.392.856-.155.264-.34.514-.561.72a4.69 4.69 0 01-.733.55c-.265.16-.55.29-.853.423-.284.108-.576.199-.88.273-.302.07-.602.115-.901.148a17.4 17.4 0 01-.922.055 17.9 17.9 0 01-.702.031H7.02a6.9 6.9 0 01-.702-.031 17.4 17.4 0 01-.922-.055c-.299-.033-.6-.079-.9-.148a6.4 6.4 0 01-.88-.273 8.02 8.02 0 01-.853-.423 4.69 4.69 0 01-.733-.55A3.63 3.63 0 01.97 19.13a6.77 6.77 0 01-.392-.855c-.104-.317-.188-.637-.25-.947-.061-.325-.112-.63-.152-.955a15.91 15.91 0 01-.09-.98c-.02-.333-.03-.666-.03-1V7.02c0-.334.01-.667.03-1 .018-.326.049-.656.09-.98.04-.325.09-.65.152-.955.062-.31.146-.63.25-.947.105-.303.237-.591.392-.855.155-.265.34-.514.561-.72a4.69 4.69 0 01.733-.55c.265-.159.55-.29.853-.423.284-.108.576-.2.88-.273.301-.07.601-.115.901-.148.31-.026.62-.42.921-.055A6.9 6.9 0 017.02 0h9.96zm.12 2.67H7.02c-.227 0-.452.01-.674.027-.22.018-.438.045-.652.08-.205.031-.401.07-.59.12-.183.048-.36.105-.528.171a3.5 3.5 0 00-.469.224 2.81 2.81 0 00-.425.29 2.1 2.1 0 00-.34.392c-.092.136-.171.278-.234.427a3.1 3.1 0 00-.151.49 5.04 5.04 0 00-.09.548 8.8 8.8 0 00-.051.59c-.01.225-.014.448-.014.67v9.945c0 .222.004.445.014.67.007.211.026.412.051.59.026.186.057.368.09.548.037.17.09.334.151.49.063.15.142.29.234.428.092.137.203.258.34.39.136.134.277.246.425.292.146.085.302.16.469.224.167.065.345.122.528.17.189.05.385.09.59.12.214.036.433.063.652.08.222.018.447.027.674.027h9.96c.227 0 .452-.01.674-.027.22-.017.438-.044.652-.08.205-.03.401-.07.59-.12.183-.048.36-.105.528-.17a3.5 3.5 0 00.469-.224 2.81 2.81 0 00.425-.292c.137-.132.248-.253.34-.39.092-.137.171-.278.234-.427a3.1 3.1 0 00.151-.49 5.04 5.04 0 00.09-.549c.025-.177.044-.378.051-.59.01-.224.014-.447.014-.67V7.02c0-.222-.004-.445-.014-.67a8.8 8.8 0 00-.051-.589 5.04 5.04 0 00-.09-.548 3.1 3.1 0 00-.151-.49c-.063-.15-.142-.292-.234-.428a2.1 2.1 0 00-.34-.39 2.81 2.81 0 00-.425-.292 3.5 3.5 0 00-.469-.224c-.167-.066-.345-.123-.528-.17a4.84 4.84 0 00-.59-.12 9.76 9.76 0 00-.652-.08c-.222-.017-.447-.027-.674-.027zm-4.98 5.78a3.57 3.57 0 11-.18 7.14 3.57 3.57 0 01.18-7.14zm0 1.333a2.24 2.24 0 100 4.474 2.24 2.24 0 000-4.474zm4.44-2.902a.83.83 0 11-1.666 0 .83.83 0 011.666 0z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-200 p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
