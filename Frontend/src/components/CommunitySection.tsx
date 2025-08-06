import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from './Button';

gsap.registerPlugin(ScrollTrigger);

const CommunitySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const chat = chatRef.current;
    const content = contentRef.current;

    if (!section || !title || !chat || !content) return;

    // Title animation with wavy effect
    const titleText = "Creators. Fans. Nothing in between.";
    title.innerHTML = titleText.split('').map((char, index) => 
      char === ' ' ? ' ' : `<span class="inline-block wavy-char" data-index="${index}">${char}</span>`
    ).join('');

    const wavyChars = title.querySelectorAll('.wavy-char');

    gsap.fromTo(wavyChars,
      { y: 100, opacity: 0, rotationX: -90 },
      { 
        y: 0, 
        opacity: 1, 
        rotationX: 0,
        duration: 1.2, 
        stagger: 0.02,
        ease: "elastic.out(1, 0.8)",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Chat interface animation
    gsap.fromTo(chat,
      { x: 100, opacity: 0, scale: 0.9 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: chat,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Content animation
    gsap.fromTo(content.children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: content,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Chat messages stagger animation
    const chatMessages = chat.querySelectorAll('.chat-message');
    gsap.fromTo(chatMessages,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: chat,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Title */}
          <div>
            <h2 
              ref={titleRef}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {/* Text will be populated by JavaScript */}
            </h2>
            
            <div ref={contentRef} className="space-y-6">
              <p className="text-xl text-blue-100 leading-relaxed">
                Patreon gives you a direct line of access to your fan community, with no ads or gatekeepers in the way.
              </p>
              
              <p className="text-lg text-blue-200 leading-relaxed">
                Through real-time group chats, comments, DMs, and even directly over email, you can connect more deeply and directly with your community here than anywhere else.
              </p>
              
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-4"
              >
                Build real community
              </Button>
            </div>
          </div>

          {/* Right Chat Interface */}
          <div ref={chatRef} className="relative">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md ml-auto">
              {/* Chat Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-gray-600">←</button>
                    <div>
                      <h3 className="font-semibold text-gray-900">Chelsea Devantez's chat</h3>
                      <p className="text-sm text-gray-500">Chelsea Devantez • View Details</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                      alt="Chelsea"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 space-y-4 h-80 overflow-y-auto">
                <div className="chat-message flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                      alt="Maya"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">Maya Joseph</span>
                      <span className="text-xs text-gray-500">3m</span>
                    </div>
                    <div className="text-sm">🎉✨</div>
                  </div>
                </div>

                <div className="chat-message">
                  <div className="bg-green-500 text-white rounded-2xl px-4 py-2 inline-block max-w-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img 
                          src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                          alt="Chelsea"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium">Chelsea Devantez CREATOR</span>
                      <span className="text-xs opacity-75">3m</span>
                    </div>
                    <p className="text-sm">so glad everyone is here 😊</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs">❤️ 💯</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 rounded-full bg-blue-400"></div>
                      <div className="w-5 h-5 rounded-full bg-green-400"></div>
                      <div className="w-5 h-5 rounded-full bg-purple-400"></div>
                    </div>
                    <span className="text-xs text-gray-500">6 replies • 2 New</span>
                  </div>
                </div>

                <div className="chat-message flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                      alt="Kai"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">Kai Nady</span>
                      <span className="text-xs text-gray-500">2m</span>
                    </div>
                    <p className="text-sm text-gray-700">ok, who's seen a movie thats better than the book?</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                        <div className="w-4 h-4 rounded-full bg-red-400"></div>
                      </div>
                      <span className="text-xs text-gray-500">2 replies • 1 New</span>
                    </div>
                  </div>
                </div>

                <div className="chat-message flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                      alt="Susie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">Susie Kennedy</span>
                      <span className="text-xs text-gray-500">3m</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">after your last review i HAD to read this!</p>
                    <div className="bg-gray-100 rounded-xl p-3">
                      <img 
                        src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop"
                        alt="Book"
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;