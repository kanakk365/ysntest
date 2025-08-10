// import CommingSoon from '@/Components/ComingSoon'
import MainLayout from '@/Layouts/MainLayout'
import React from 'react'
import { HeroSection } from "@/Components/galaxy-interactive-hero-section"
import Contact from '@/Components/Contact';
import Blog from '@/Components/Blog';


export default function AboutUsPage() {
  return (
    <MainLayout className="bg-black text-white px-[20px] md:px-0">
      <div className="relative w-full overflow-hidden font-sans bg-black text-white" style={{ fontFamily: "Inter" }}>
        {/* Purple honeycomb background */}
        <div className="absolute top-[50px] left-1/2 transform -translate-x-1/2 flex items-center justify-center w-max" >
          {/* <div className="absolute inset-0 z-0 bg-[#0D0837]" /> */}
         
        </div>
        {/* ABOUT US text image */}
        <div className="relative z-5 md:z-10 flex justify-center items-center h-[400px] pt-[170px] md:px-[10%]">
          <img
            src="/assets/aboutus.webp"
            alt="ABOUT US"
            className="object-contain w-full "
          />
        </div>

        {/* Mission and Vision Section */}
        <section className="relativez-10 md:z-20 text-center max-w-2xl md:mx-auto md:px-6 pb-5">
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-[16px] ring-offset-background focus-visible:outline-none font-bold focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-[50px] px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 mb-5">
            Our Mission & Vision
          </button>
          <p className="leading-relaxed text-white/50 text-[16px]">
            YSN provides a cost effective, and revenue generating solution for youth sports organizations to be able to stream live practices and games, view historic video, connect with your audience in with real time game chat, remote broadcasting of game, connected team store, mobile connect,</p>
          <p className=" mt-6 text-white/50 text-[16px]">
            YSN is part of the Sports vertical solutions from HubT.
          </p>
          <h3 className="text-[16px] mt-10  text-transparent bg-clip-text bg-gradient-to-r from-[#7940D7] to-[#2D09A3]">
            FEATURES
          </h3>
        </section>

        {/* Divider */}
        <div className="relative z-10 md:z-20 flex justify-center mt-2 mb-6">
          <img
            src="/assets/line.webp"
            alt="ABOUT US"
            className="object-contain w-full h-[150px] md:h-[250px] lg:h-[100px]"
          />
        </div>

        <section className="relative z-10 md:z-20 text-center max-w-3xl pt-10 mx-auto  pb-5">

          <p className="md:text-lg leading-relaxed text-white" style={{ fontSize: "28.13px", lineHeight: "1.6" }}>
            Enjoy a free, premium and immersive experience, for <br />live streamed events          </p>

        </section>

        {/* Features List */}

        <section className="relative mt-[50px] text-justify  z-10 md:z-20 max-w-7xl m-auto md:px-6  grid grid-cols-1 lg:grid-cols-2 gap-12 text-white text-[16px] h-full">
          <div>

            <p className='flex items-center text-white/50 pb-8 md:pb-10 lg:pb-20'>
              <img
                src="/assets/Icon.webp"
                alt="ABOUT US"
                className="object-contain me-8"
              />
              Add local and organization advertiser content to your organization and team pages for additional revenue            </p>
            <p className='flex items-center text-white/50 pb-8 md:pb-10 lg:pb-20'>
              <img
                src="/assets/Icon1.webp"
                alt="ABOUT US"
                className="object-contain me-8"
              />
              Showcase your merchandise during live streams to drive sales or get started with help from YSN’s vendor partners.            </p>
            <p className='flex items-center text-white/50'>
              <img
                src="/assets/Icon2.webp"
                alt="ABOUT US"
                className="object-contain me-8"
              />
              Create player profiles to boost recruitment. Scouts and coaches can view “Game Reels” and access profiles directly during live games.            </p>
          </div>
          <div>
            <p className='flex items-center text-white/50 pb-8 md:pb-10 lg:pb-20'>
              <img
                src="/assets/Icon3.webp"
                alt="ABOUT US"
                className="object-contain me-8"
              />
              Live stream home and away games
            </p>

            <p className='flex items-center text-white/50 pb-8 md:pb-10 lg:pb-20'>
              <img
                src="/assets/Icon4.webp"
                alt="ABOUT US"
                className="object-contain me-8"
              />
              Live chat option for more engaged experience
            </p>
            <p className='flex items-center text-white/50'>
              <img
                src="/assets/Icon5.webp"
                alt="ABOUT US"
                className="object-contain me-8"
              />
              Add excitement to your live streamed game by having one of the YSN broadcasters call your game            </p>
          </div>
        </section>
        {/* CTA and Team Background */}
        <section className="relative w-full h-[80vh] lg:h-full">
          <img
            src="/assets/aboutbg.webp"
            alt="team background"
            className="w-full h-auto object-cover"
          />

          <div className="absolute inset-0 flex flex-col justify-center items-center md:px-6 text-center text-white bg-gradient-to-b from-[#00000000] to-[#3527731f] ">
            <h3 className="text-[16px] md:text-lg font-semibold mb-6" style={{ fontSize: "28.13px", lineHeight: "1.8" }}>
              How it works once approved and connected to the <br /> YSN platform
            </h3>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto text-[16px] mt-[50px]">
              <div className="  text-justify" style={{width:"-webkit-fill-available"}}>
                <h4 className="font-semibold mb-1" style={{ fontSize: "20px" }}>Understanding</h4>
                <p className='text-white/50 mt-4 ' style={{ fontSize: "16px" }}>Connect your existing camera to the YSN platform.</p>
              </div>
              <div className=" text-justify" style={{width:"-webkit-fill-available"}}>
                <h4 className="font-semibold mb-1" style={{ fontSize: "20px" }}>Service</h4>
                <p className='text-white/50 mt-4 text-justify ' style={{ fontSize: "16px" }}>YSN premium service for organizations who have access to or own their own facilities. YSN will provide camera(s) at your facility depending on size and other variables FREE of charge.</p>
              </div>
              <div className="text-justify" style={{width:"-webkit-fill-available"}}>
                <h4 className="font-semibold mb-1" style={{ fontSize: "20px" }}>Solution</h4>
                <p className='text-white/50 mt-4 text-justify ' style={{ fontSize: "16px" }}>We also have a free mobile solution so you dont miss those away games!</p>
              </div>
            </div>

            <button className="flex items-center justify-center whitespace-nowrap rounded-full text-[16px] ring-offset-background focus-visible:outline-none font-bold focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-[50px] md:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 mt-10 w-[220px] lg:w-auto">
              Get Connected to YSN ➜
            </button>
          </div>
        </section>
      </div>
      <Blog />
      <Contact />
    </MainLayout>
  );
}