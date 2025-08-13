import Head from "next/head";
import Layout from "../components/Layout";
import { Users, ShoppingBag, Shield, Globe, Award, Heart } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { icon: Users, value: "10K+", label: "Happy Customers" },
    { icon: ShoppingBag, value: "50K+", label: "Products Listed" },
    { icon: Shield, value: "100%", label: "Secure Shopping" },
    { icon: Globe, value: "24/7", label: "Customer Support" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Trusted & Secure",
      description: "Shop with confidence knowing your transactions are protected by industry-leading security measures."
    },
    {
      icon: Globe,
      title: "Global Marketplace",
      description: "Access products from sellers worldwide, all in one convenient platform."
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Every seller is verified and every product meets our quality standards."
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Your satisfaction is our priority with 30-day returns and dedicated support."
    }
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Passionate about creating seamless shopping experiences and connecting buyers with trusted sellers.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Sarah Chen",
      role: "Head of Product",
      bio: "Expert in user experience design and marketplace optimization strategies.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Mike Rodriguez",
      role: "CTO",
      bio: "Technology leader focused on building scalable, secure, and innovative e-commerce solutions.",
      image: "/api/placeholder/150/150"
    }
  ];

  return (
    <Layout>
      <Head>
        <title>About Us - MarketPlace</title>
        <meta name="description" content="Learn about MarketPlace and our mission to connect buyers with trusted sellers" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About MarketPlace
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              We're building the future of online shopping by creating a trusted, 
              secure, and seamless marketplace experience for everyone.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                At MarketPlace, we believe that everyone deserves access to quality products 
                from trusted sellers. Our mission is to create a seamless, secure, and 
                enjoyable shopping experience that connects buyers with the best products 
                and sellers in the world.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We're committed to building a platform that not only serves our customers 
                but also empowers sellers to grow their businesses and reach new audiences. 
                Through innovation, trust, and community, we're shaping the future of 
                e-commerce.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose MarketPlace?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="bg-gray-200 w-24 h-24 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust</h3>
                <p className="text-gray-600">
                  We build trust through transparency, verification, and consistent 
                  quality across our platform.
                </p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We continuously innovate to provide the best possible shopping 
                  experience for our users.
                </p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
                <p className="text-gray-600">
                  We foster a strong community of buyers and sellers, supporting 
                  each other's success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers and start shopping today
            </p>
            <div className="space-x-4">
              <a
                href="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Start Shopping
              </a>
              <a
                href="/seller/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
              >
                Become a Seller
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
