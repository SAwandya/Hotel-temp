import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const TestimonialSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Maya Johnson",
      location: "New York, USA",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      experience: "Desert Safari Adventure",
      text: "Our desert safari was absolutely magical! From dune bashing to the traditional dinner under the stars, every moment was perfectly planned. The guide was knowledgeable and made us feel safe throughout the adventure.",
      rating: 5,
    },
    {
      id: 2,
      name: "David Chen",
      location: "Singapore",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      experience: "Traditional Cooking Class",
      text: "Learning to cook authentic local dishes was a highlight of our trip. The chef was patient and shared so many cultural insights along with cooking techniques. We've already made the recipes at home twice!",
      rating: 5,
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      location: "Barcelona, Spain",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
      experience: "Central Park Bike Tour",
      text: "Biking through Central Park gave us a unique perspective of New York City. Our guide knew all the hidden spots and shared fascinating stories about the park's history. Perfect activity for our family!",
      rating: 4,
    },
  ];

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative bg-white rounded-2xl shadow-md p-6 md:p-8">
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary h-12 w-12 rounded-full flex items-center justify-center">
        <img
          src={assets.starIconFilled}
          alt="Quote"
          className="w-6 h-6 invert"
        />
      </div>

      <div className="mt-6 relative">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`transition-opacity duration-500 ${
              activeIndex === index
                ? "opacity-100"
                : "opacity-0 absolute top-0 left-0"
            }`}
            style={{ zIndex: activeIndex === index ? 1 : 0 }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={assets.starIconFilled}
                    alt="star"
                    className={`w-5 h-5 ${
                      i < testimonial.rating ? "opacity-100" : "opacity-30"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-600 italic mb-6 max-w-3xl">
                "{testimonial.text}"
              </p>

              <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center">
                <h4 className="font-medium text-lg">{testimonial.name}</h4>
                <p className="text-gray-500 text-sm">{testimonial.location}</p>
                <p className="text-primary text-sm mt-1">
                  {testimonial.experience}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full mx-1 transition-all ${
              activeIndex === index
                ? "bg-primary w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
