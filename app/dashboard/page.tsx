"use client";

import { motion } from "framer-motion";
import { Search, Play, BookOpen, Clock, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SUBJECTS = [
  { id: 1, title: "Modern JavaScript", description: "Master ES6+ and functional programming", progress: 65, color: "from-blue-500/20 to-cyan-500/20" },
  { id: 2, title: "Advanced React", description: "Hooks, patterns and performance optimization", progress: 42, color: "from-purple-500/20 to-pink-500/20" },
  { id: 3, title: "UI/UX Design", description: "Design systems and accessibility", progress: 85, color: "from-orange-500/20 to-red-500/20" },
  { id: 4, title: "Full Stack Development", description: "Build scalable web applications", progress: 20, color: "from-green-500/20 to-emerald-500/20" },
  { id: 5, title: "Data Science with Python", description: "Learn machine learning and Pandas", progress: 10, color: "from-indigo-500/20 to-blue-500/20" },
  { id: 6, title: "System Design", description: "Architecting large scale systems", progress: 0, color: "from-rose-500/20 to-orange-500/20" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              LMS.CORE
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">Courses</Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">My Learning</Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">Resources</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-zinc-900/50 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all w-64"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Continue Learning */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Continue Learning</h2>
            <Link href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card group bg-zinc-900/40 p-0 overflow-hidden flex flex-col md:flex-row h-auto md:h-64"
          >
            <div className="w-full md:w-2/5 relative overflow-hidden">
               {/* Placeholder image */}
               <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 animate-pulse" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 cursor-pointer"
                  >
                    <Play className="h-8 w-8 text-white fill-white ml-1" />
                  </motion.div>
               </div>
            </div>
            <div className="p-8 flex flex-col justify-center flex-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">Module 4: React Context API</span>
              <h3 className="text-3xl font-bold mb-4">Advanced React Patterns</h3>
              <p className="text-zinc-400 mb-6 max-w-lg">Learn how to build reusable, accessible UI components using React Context and compound components.</p>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "45%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500" 
                  />
                </div>
                <span className="text-sm font-medium">45% Complete</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Subjects Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Explore Subjects</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-800 text-white hover:bg-zinc-700 transition-colors">All</button>
              <button className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">Design</button>
              <button className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">Code</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUBJECTS.map((subject, i) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="premium-card group cursor-pointer"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${subject.color} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors border border-white/5">
                       <BookOpen className="h-6 w-6 text-purple-400" />
                    </div>
                    {subject.progress > 0 && (
                      <div className="flex items-center text-xs font-medium text-zinc-400 bg-zinc-800/50 py-1 px-3 rounded-full">
                        <Clock className="h-3 w-3 mr-1" />
                        {subject.progress}%
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{subject.title}</h3>
                  <p className="text-zinc-400 text-sm mb-6 line-clamp-2">{subject.description}</p>
                  
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500" 
                    />
                  </div>
                </div>
                <Link href={`/learning/${subject.id}`} className="absolute inset-0" />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
