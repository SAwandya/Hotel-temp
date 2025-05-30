import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ExperienceCard from "../components/ExperienceCard";
import TestimonialSlider from "../components/TestimonialSlider";
import { Link } from "react-router-dom";

const Experience = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample experience categories
  const categories = [
    { id: "all", name: "All Experiences" },
    { id: "adventure", name: "Adventure" },
    { id: "culture", name: "Cultural" },
    { id: "food", name: "Food & Dining" },
    { id: "wellness", name: "Wellness" },
    { id: "family", name: "Family Friendly" },
  ];

  // Sample experiences data - in a real app, this would come from an API
  const experiencesData = [
    {
      id: 1,
      title: "Desert Safari Adventure",
      location: "Dubai",
      category: "adventure",
      duration: "6 hours",
      rating: 4.8,
      reviews: 126,
      price: 89,
      image:
        "https://images.unsplash.com/photo-1504233529578-6d46baba6d34?q=80&w=1974&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Traditional Cooking Class",
      location: "Singapore",
      category: "food",
      duration: "3 hours",
      rating: 4.9,
      reviews: 87,
      price: 65,
      image:
        "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?q=80&w=1974&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Central Park Bike Tour",
      location: "New York",
      category: "adventure",
      duration: "2 hours",
      rating: 4.7,
      reviews: 214,
      price: 45,
      image:
        "https://images.unsplash.com/photo-1517736996303-4eec4a66bb17?q=80&w=1974&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Historic City Walking Tour",
      location: "London",
      category: "culture",
      duration: "4 hours",
      rating: 4.6,
      reviews: 173,
      price: 35,
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1970&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "Sunset Yoga Retreat",
      location: "Sri Lanka",
      category: "wellness",
      duration: "2 hours",
      rating: 4.9,
      reviews: 92,
      price: 40,
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 6,
      title: "Wildlife Safari Tour",
      location: "Sri Lanka",
      category: "family",
      duration: "5 hours",
      rating: 4.8,
      reviews: 146,
      price: 75,
      image:
        "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop",
    },
    {
      id: 7,
      title: "Local Market Food Tour",
      location: "Singapore",
      category: "food",
      duration: "3.5 hours",
      rating: 4.7,
      reviews: 112,
      price: 55,
      image:
        "https://images.unsplash.com/photo-1540648639573-8c848de23f0a?q=80&w=1974&auto=format&fit=crop",
    },
    {
      id: 8,
      title: "Museum & Art Gallery Tour",
      location: "New York",
      category: "culture",
      duration: "3 hours",
      rating: 4.5,
      reviews: 89,
      price: 30,
      image:
        "https://images.unsplash.com/photo-1565060169861-3d5e83a676c8?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  // Simulating data fetching
  useEffect(() => {
    setLoading(true);

    // Simulate API fetch
    setTimeout(() => {
      setExperiences(experiencesData);
      setLoading(false);
    }, 800);
  }, []);

  // Filter experiences based on active category
  const filteredExperiences =
    activeCategory === "all"
      ? experiences
      : experiences.filter((exp) => exp.category === activeCategory);

  return (
    <div className="py-28 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl mb-16 h-[400px] md:h-[500px]">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
          alt="Travel experiences"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex flex-col justify-center px-8 md:px-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white max-w-2xl">
            Extraordinary Experiences Await
          </h1>
          <p className="text-white/80 max-w-xl mt-4 md:text-lg">
            Discover unique activities and unforgettable adventures to enhance
            your stay. From cultural immersions to adrenaline-pumping
            excursions.
          </p>
          <div className="mt-8">
            <button className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-primary/90 transition-all">
              Explore All Experiences
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Title
        title="Curated Experiences"
        subTitle="Handpicked activities that transform ordinary trips into extraordinary adventures. From local cultural immersions to thrilling outdoor pursuits."
        align="center"
      />

      {/* Categories Filter */}
      <div className="flex flex-wrap justify-center gap-2 mt-10 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-5 py-2 rounded-full text-sm transition-all ${
              activeCategory === category.id
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Experience Cards */}
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExperiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}

        {!loading && filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No experiences found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Featured Section */}
      <div className="mt-20 bg-blue-50 rounded-xl p-8 md:p-12">
        <div className="md:flex items-center">
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-800">
              Explore Our Top-Rated Experiences
            </h2>
            <p className="mt-4 text-gray-600">
              Our most popular activities, loved by travelers from around the
              world. Book early to secure your spot on these unforgettable
              adventures.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <img
                    src={assets.starIconFilled}
                    alt="Quality"
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Expert-Led Activities</h3>
                  <p className="text-sm text-gray-500">
                    Guided by local experts with intimate knowledge
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <img
                    src={assets.homeIcon}
                    alt="Comfort"
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Small Groups</h3>
                  <p className="text-sm text-gray-500">
                    Intimate experiences with personalized attention
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <img
                    src={assets.badgeIcon}
                    alt="Quality"
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Verified Quality</h3>
                  <p className="text-sm text-gray-500">
                    All experiences meet our high standards
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/rooms"
              className="inline-block mt-8 text-primary font-medium flex items-center"
            >
              Pair with a perfect stay
              <img
                src={assets.arrowIcon}
                alt="arrow"
                className="w-4 h-4 ml-1"
              />
            </Link>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 md:pl-8">
            <img
              src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop"
              alt="Featured experience"
              className="rounded-lg shadow-lg w-full h-80 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-20">
        <Title
          title="What Travelers Say"
          subTitle="Real stories from guests who have enjoyed our curated experiences"
          align="center"
        />
        <div className="mt-10">
          <TestimonialSlider />
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-playfair font-bold">
          Ready to Create Memories?
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Start planning your next adventure today. From cultural immersions to
          adrenaline-pumping activities, we have something for everyone.
        </p>
        <div className="mt-8">
          <Link
            to="/rooms"
            className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-primary/90 transition-all inline-block"
          >
            Browse Accommodations
          </Link>
          <button className="ml-4 border border-primary text-primary px-6 py-3 rounded-lg text-lg font-medium hover:bg-primary/5 transition-all">
            Contact Our Experience Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default Experience;
