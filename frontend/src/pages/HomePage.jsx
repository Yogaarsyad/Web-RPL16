import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiArrowRight, FiCheckCircle } from 'react-icons/fi'; 
import HeroBackground from '../assets/hero-background.jpg'; 
import UILogo from '../assets/universitas-indonesia.png'; // Pastikan file ini ada

function HomePage() {
  return (
    <div className="relative min-h-screen font-sans overflow-hidden">
      
      {/* 1. BACKGROUND IMAGE & GRADIENT OVERLAY */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{ backgroundImage: `url(${HeroBackground})` }}
        ></div>
        
        {/* Overlay Profesional: Gradasi Biru Gelap */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/90 via-blue-900/75 to-slate-900/95"></div>
      </div>

      {/* 2. CONTAINER UTAMA */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-screen flex flex-col">
        
        {/* --- NAVBAR --- */}
        <nav className="flex justify-between items-center py-8">
          <div className="flex items-center gap-3 text-white select-none">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg">
              <FiActivity className="text-2xl text-cyan-300" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">LifeMon</span>
          </div>

          <div className="flex items-center gap-4">
            {/* TOMBOL SIGN IN DIPERBAIKI: Transparan dengan efek glassmorphism */}
            <Link to="/login">
              <button className="px-6 py-2.5 rounded-full border border-white/30 text-white font-semibold hover:bg-white/15 hover:border-white/50 transition-all duration-300 text-sm md:text-base backdrop-blur-sm bg-white/5">
                Sign In
              </button>
            </Link>

            {/* Tombol Sign Up (Solid White) */}
            <Link to="/register">
              <button className="bg-white text-blue-900 font-bold py-2.5 px-6 rounded-full shadow-lg hover:bg-blue-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base">
                Sign Up
              </button>
            </Link>
          </div>
        </nav>

        {/* --- HERO CONTENT (CENTERED) --- */}
        <div className="flex-1 flex flex-col justify-center items-center text-center pb-12">
          
          {/* Badge Kecil */}
          <div className="mb-6 animate-fade-in-down">
            <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-cyan-200 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
              #1 Student Health Tracker
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl max-w-5xl">
            Achieve Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-300">
              Healthy Lifestyle
            </span>
          </h1>
          
          {/* Deskripsi */}
          <p className="text-lg md:text-2xl text-blue-100/80 mb-10 leading-relaxed max-w-3xl font-light">
            LifeMon helps you monitor nutrition, exercise, and rest for a better quality of life.
          </p>
          
          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-5 mb-16 w-full justify-center">
            <Link to="/register">
              <button className="w-full sm:w-auto group bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
                From now on 
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <Link to="/login">
              <button className="w-full sm:w-auto px-10 py-4 rounded-2xl border border-white/30 bg-white/5 text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm flex items-center justify-center gap-2">
                Learn More
              </button>
            </Link>
          </div>

          {/* --- BAGIAN DEDIKASI --- */}
          <div className="border-t border-white/10 pt-8 w-full max-w-4xl animate-fade-in">
            <p className="text-blue-200/60 text-xs font-bold uppercase tracking-widest mb-6">
              Proudly Dedicated For
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-white/90">
               
               {/* Item 1: Universitas Indonesia */}
               <div className="flex items-center gap-4 text-left group cursor-default transition-colors">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img 
                      src={UILogo} 
                      alt="Logo UI" 
                      className="w-full h-full object-contain drop-shadow-md" 
                    />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight text-white group-hover:text-yellow-300 transition-colors">University of Indonesia</p>
                    <p className="text-xs text-blue-200/70 mt-0.5">Civitas Academica</p>
                  </div>
               </div>

               {/* Item 2: Mahasiswa Indonesia */}
               <div className="flex items-center gap-4 text-left group cursor-default transition-colors">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30 text-emerald-300 shadow-lg">
                    <FiCheckCircle className="text-2xl" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight text-white group-hover:text-emerald-300 transition-colors">Indonesian students</p>
                    <p className="text-xs text-blue-200/70 mt-0.5">Healthy Generation</p>
                  </div>
               </div>

            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
}

export default HomePage;