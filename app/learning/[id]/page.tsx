"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Play, CheckCircle, Lock, Menu, X, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const COURSE_CONTENT = [
  {
    id: 1,
    title: "Introduction",
    lessons: [
      { id: 101, title: "Course Overview", duration: "05:20", completed: true, locked: false },
      { id: 102, title: "Setting up the environment", duration: "12:15", completed: true, locked: false },
    ],
  },
  {
    id: 2,
    title: "Core Concepts",
    lessons: [
      { id: 201, title: "Understanding the Virtual DOM", duration: "15:30", completed: false, locked: false },
      { id: 202, title: "Components & Props", duration: "22:45", completed: false, locked: false },
      { id: 203, title: "State Management", duration: "18:20", completed: false, locked: true },
    ],
  },
  {
    id: 3,
    title: "Advanced Patterns",
    lessons: [
      { id: 301, title: "Hooks Deep Dive", duration: "25:35", completed: false, locked: true },
      { id: 302, title: "Higher Order Components", duration: "30:20", completed: false, locked: true },
      { id: 303, title: "Render Props & Custom Hooks", duration: "20:15", completed: false, locked: true },
    ],
  },
];

export default function LearningPage() {
  const { id } = useParams();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLesson, setActiveLesson] = useState(COURSE_CONTENT[1].lessons[0]);
  const [expandedSections, setExpandedSections] = useState<number[]>([1, 2]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(s => s !== sectionId) 
        : [...prev, sectionId]
    );
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden absolute top-4 left-4 z-50 p-2 bg-zinc-900 rounded-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar - Mobile drawer or desktop sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ 
          width: sidebarOpen ? "340px" : "0px",
          x: 0,
          opacity: 1
        }}
        className={`h-full border-r border-white/5 bg-zinc-950/30 backdrop-blur-3xl overflow-y-auto z-40 relative ${sidebarOpen ? 'block' : 'hidden md:block'}`}
      >
        <div className="p-6 w-[340px]">
          <Link href="/dashboard" className="flex items-center text-sm text-zinc-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h2 className="text-xl font-bold mb-6">Advanced React Patterns</h2>
          
          <div className="space-y-4">
            {COURSE_CONTENT.map((section) => (
              <div key={section.id} className="space-y-2">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 transition-colors border border-white/5"
                >
                  <span className="font-semibold text-sm">{section.title}</span>
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.includes(section.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-1 pl-2"
                    >
                      {section.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => !lesson.locked && setActiveLesson(lesson)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-all ${
                            activeLesson.id === lesson.id 
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                              : lesson.locked 
                                ? "opacity-50 cursor-not-allowed" 
                                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {lesson.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                            ) : lesson.locked ? (
                              <Lock className="h-4 w-4 text-zinc-400 shrink-0" />
                            ) : (
                              <Play className={`h-4 w-4 shrink-0 ${activeLesson.id === lesson.id ? 'text-purple-400' : 'text-zinc-600'}`} />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] text-zinc-600 shrink-0">{lesson.duration}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto flex flex-col relative z-0">
        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
           {/* Video Area */}
           <motion.div 
             layoutId="video-player"
             className="aspect-video w-full rounded-2xl bg-zinc-900 relative overflow-hidden group shadow-2xl border border-white/5"
           >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center cursor-pointer shadow-purple-500/20 shadow-xl"
                 >
                    <Play className="h-10 w-10 text-white fill-white ml-2" />
                 </motion.div>
              </div>
              
              {/* Fake Controls */}
              <div className="absolute bottom-0 inset-x-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 to-transparent">
                 <div className="h-1.5 w-full bg-white/20 rounded-full mb-4 overflow-hidden relative">
                    <div className="absolute left-0 inset-y-0 w-1/3 bg-purple-500" />
                    <div className="absolute left-1/3 w-3 h-3 bg-white rounded-full -translate-y-1/4 -translate-x-1/2" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                       <Play className="h-5 w-5 text-white fill-white" />
                       <span className="text-xs font-medium">05:32 / {activeLesson.duration}</span>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Video Controls Below */}
           <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
              <div className="flex items-center space-x-4">
                 <button className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-white transition-colors group">
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                 </button>
                 <button className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 group">
                    <span>Next Lesson</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
              <div className="flex-1 max-w-md">
                 <div className="flex justify-between text-xs font-medium text-zinc-500 mb-2 uppercase tracking-widest">
                    <span>Current Progress</span>
                    <span>24:12 remaining</span>
                 </div>
                 <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full w-1/4 bg-purple-500" />
                 </div>
              </div>
           </div>

           {/* Lesson Info */}
           <div className="mt-8 space-y-6">
              <div>
                 <h2 className="text-3xl font-bold mb-4">{activeLesson.title}</h2>
                 <p className="text-zinc-400 leading-relaxed max-w-3xl">
                    In this lesson, we will explore the core concepts of {activeLesson.title.toLowerCase()}. 
                    We'll cover the architectural implications and best practices for implementing this in high-performance applications.
                 </p>
              </div>

              <div className="flex items-center space-x-6 py-6 border-y border-white/5">
                 <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">UZ</div>
                    <div>
                        <p className="text-sm font-medium">Uzef Zardoz</p>
                        <p className="text-xs text-zinc-500">Course Instructor</p>
                    </div>
                 </div>
                 <div className="h-8 w-px bg-white/5" />
                 <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#09090b] bg-zinc-800" />
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-[#09090b] bg-zinc-900 flex items-center justify-center text-[10px] text-zinc-500">+12k</div>
                 </div>
                 <div 
                   className="text-xs text-purple-400 underline cursor-pointer hover:text-purple-300 flex items-center"
                   onClick={() => {
                     // In a real app, this could send a specific prompt to the global state
                     document.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { lesson: activeLesson.title } }));
                   }}
                 >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Ask AI about this lesson
                 </div>
                 <p className="text-xs text-zinc-500 underline cursor-pointer hover:text-zinc-300">View resources & links</p>
              </div>

              {/* Course Progress */}
              <div className="bg-zinc-900/40 rounded-2xl p-6 border border-white/5">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">Course Progress</h3>
                    <span className="text-xs text-purple-400">Section 2 of 12</span>
                 </div>
                 <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-1/4 bg-gradient-to-r from-purple-500 to-blue-500" />
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
