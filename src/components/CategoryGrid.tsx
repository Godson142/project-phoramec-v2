import { Phone, MessageSquare, PlusCircle, Sparkles } from 'lucide-react';
import { CATEGORIES_METADATA, OFFICE_CONTACT } from '../data';
import { CategoryType } from '../types';
import { speakText } from '../utils/speech';

interface CategoryGridProps {
  onSelectCategory: (category: CategoryType) => void;
  onOpenCustomRequest: () => void;
  onCallDirect: () => void;
}

export default function CategoryGrid({
  onSelectCategory,
  onOpenCustomRequest,
  onCallDirect,
}: CategoryGridProps) {
  
  const handleCategoryHover = (title: string, desc: string) => {
    speakText(`Category ${title}. ${desc}. Tap to browse items.`);
  };

  const handleHeroHover = () => {
    speakText(
      "PHORAMEC IMPORTS: Browse our stock by category, send us a photo of what you want us to buy for you, or tap to call us directly."
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 1. Instant Hero Intent Section */}
      <section 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-500 to-orange-500 p-8 text-black shadow-xl shrink-0"
        onMouseEnter={handleHeroHover}
        onFocus={handleHeroHover}
        tabIndex={0}
        id="hero-section"
      >
        <div className="opacity-20 absolute -right-10 top-0">
          <div className="w-64 h-64 border-[20px] border-black rounded-full"></div>
        </div>
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-black/10 px-2.5 py-1 text-xs font-black text-black uppercase tracking-widest backdrop-blur-xs">
              <Sparkles className="mr-1 h-3.5 w-3.5 text-black" /> 100% Secure Custom Imports
            </span>
          </div>
          
          <h2 className="font-display text-3xl font-black leading-none uppercase text-black sm:text-4xl">
            PREMIUM IMPORTS<br/>STRAIGHT TO GHANA
          </h2>
          
          <p className="text-sm font-medium text-black/80 leading-relaxed max-w-xl">
            Browse local stock, send us a photo of what you need, or tap to call us directly for custom orders.
          </p>

          {/* Direct Tap Action Buttons (Thumb Reachable) */}
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              onClick={onCallDirect}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-black text-white px-6 py-3 font-bold text-sm shadow-xl hover:bg-neutral-900 transition-all active:scale-95"
              onMouseEnter={() => speakText("Tap to call Phoramec Imports Avenue office directly.")}
              id="hero-call-btn"
            >
              <Phone className="h-4 w-4" />
              Call Office: {OFFICE_CONTACT}
            </button>

            <button
              onClick={onOpenCustomRequest}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-white/20 text-black px-6 py-3 font-bold text-sm backdrop-blur-sm hover:bg-white/30 transition-all active:scale-95"
              onMouseEnter={() => speakText("Tap to open custom WhatsApp Import Request form.")}
              id="hero-request-btn"
            >
              <PlusCircle className="h-4 w-4" />
              Request Custom Buy
            </button>

            <a
              href={`https://wa.me/233551525354?text=Hello%20Phoramec%20Imports%20Avenue,%20I'm%20interested%20in%20your%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-black/40 text-white px-6 py-3 font-bold text-sm border border-black/10 hover:bg-black/50 transition-all active:scale-95"
              onMouseEnter={() => speakText("Tap to chat with us on WhatsApp.")}
              id="hero-whatsapp-link"
            >
              <MessageSquare className="h-4 w-4 text-green-400" />
              WhatsApp Live Chat
            </a>
          </div>
        </div>
      </section>

      {/* 2. Jumia-Style Category Grid */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-xl flex items-center gap-2">
            <span className="w-2 h-6 bg-yellow-500 rounded-full"></span>
            Browse Stock by Category
          </h3>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Ghana Best Deals
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES_METADATA.map((cat) => {
            const catName = cat.title as CategoryType;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(catName);
                  speakText(`Entering ${cat.title} category. Please wait.`);
                }}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#1a1a1a] text-left transition-all hover:scale-[1.02] active:scale-95 border border-neutral-200 dark:border-white/5 hover:border-yellow-500/50 shadow-md dark:shadow-none"
                onMouseEnter={() => handleCategoryHover(cat.title, cat.description)}
                onFocus={() => handleCategoryHover(cat.title, cat.description)}
                id={`cat-card-${cat.id}`}
                aria-label={`Browse ${cat.title} category`}
              >
                {/* Visual Category Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-neutral-950">
                  <img
                    src={cat.imageUrl}
                    alt={cat.title}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <h4 className="font-display text-sm font-black tracking-tight sm:text-base text-white group-hover:text-yellow-500 transition-colors">
                    {cat.title}
                  </h4>
                  <p className="mt-0.5 line-clamp-1 text-[10px] text-gray-400 font-semibold">
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
