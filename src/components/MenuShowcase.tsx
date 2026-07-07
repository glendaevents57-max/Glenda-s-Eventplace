"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Apple, Flame, IceCream } from "lucide-react";

interface MenuItem {
  name: string;
  description: string;
  image: string;
}

interface MenuCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

const MENU_DATA: MenuCategory[] = [
  {
    id: "platters",
    name: "Platters & Boards",
    icon: <Apple className="w-4 h-4" />,
    items: [
      {
        name: "Fresh Fruit Platter",
        description: "A colorful assortment of sliced mangoes, kiwis, strawberries, green grapes, and blueberries.",
        image: "/images/food/fresh_fruit_platter.png",
      },
      {
        name: "Artisan Cheese Board",
        description: "Various cheeses paired with crackers, grapes, nuts, and a small bowl of honey or fruit preserve.",
        image: "/images/food/artisan_cheese_board.png",
      },
    ],
  },
  {
    id: "savory",
    name: "Savory Appetizers & Bites",
    icon: <Flame className="w-4 h-4" />,
    items: [
      {
        name: "Charcuterie Selection",
        description: "Slices of assorted cured meats, green olives, and breadsticks.",
        image: "/images/food/charcuterie_selection.png",
      },
      {
        name: "Caprese Skewers",
        description: "Cherry tomatoes and fresh mozzarella balls drizzled with a balsamic glaze and garnished with basil.",
        image: "/images/food/caprese_skewers.png",
      },
      {
        name: "Bruschetta Bites",
        description: "Toasted baguette slices generously topped with a mixture of diced tomatoes and fresh herbs.",
        image: "/images/food/bruschetta_bites.png",
      },
      {
        name: "Veggie Cups with Dip",
        description: "Individual clear cups holding carrot, celery, and cucumber sticks with cherry tomatoes over a creamy dip.",
        image: "/images/food/veggie_cups.png",
      },
      {
        name: "Mini Sliders",
        description: "Bite-sized burgers assembled with small buns, patties, cheese, and lettuce.",
        image: "/images/food/mini_sliders.png",
      },
      {
        name: "Savory Tarts / Quiches",
        description: "Mini baked pastry crusts filled with a savory egg and herb mixture.",
        image: "/images/food/savory_tarts.png",
      },
      {
        name: "Smoked Salmon Bites",
        description: "Smoked salmon rolled with cream cheese and fresh dill, seated on cucumber slices.",
        image: "/images/food/smoked_salmon_bites.png",
      },
      {
        name: "Antipasto Cups",
        description: "Clear cups containing skewers of olives, cheese cubes, cherry tomatoes, and folded cured meats.",
        image: "/images/food/antipasto_cups.png",
      },
      {
        name: "Filipino Lumpia",
        description: "Golden, crispy fried spring rolls served with a small bowl of sweet chili dipping sauce.",
        image: "/images/food/filipino_lumpia.png",
      },
      {
        name: "Chicken / Beef Skewers",
        description: "Marinated and grilled meat skewers garnished with fresh parsley.",
        image: "/images/food/meat_skewers.png",
      },
    ],
  },
  {
    id: "desserts",
    name: "Sweet Desserts",
    icon: <IceCream className="w-4 h-4" />,
    items: [
      {
        name: "Mini Dessert Cups",
        description: "Individual layered parfaits featuring a crumb base, cream filling, and various toppings.",
        image: "/images/food/mini_dessert_cups.png",
      },
      {
        name: "Macarons",
        description: "A neatly arranged selection of colorful French macaron sandwich cookies.",
        image: "/images/food/macarons.png",
      },
      {
        name: "Chocolate Truffles",
        description: "An assortment of round chocolate confections, some dusted with cocoa and others drizzled with chocolate.",
        image: "/images/food/chocolate_truffles.png",
      },
      {
        name: "Mini Cupcakes",
        description: "Bite-sized cupcakes topped with swirls of frosting, fresh berries, and chocolate pieces.",
        image: "/images/food/mini_cupcakes.png",
      },
      {
        name: "Fruit Tartlets",
        description: "Mini pastry shells filled with a creamy custard and topped with fresh berries and kiwi slices.",
        image: "/images/food/fruit_tartlets.png",
      },
    ],
  },
];

export default function MenuShowcase() {
  const [activeTab, setActiveTab] = useState("platters");

  const activeCategory = MENU_DATA.find((cat) => cat.id === activeTab) || MENU_DATA[0];

  return (
    <div className="w-full space-y-10">
      {/* Tab Navigation buttons */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-2xl mx-auto">
        {MENU_DATA.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 border ${
              activeTab === category.id
                ? "bg-amber-400 border-amber-500 text-zinc-950 shadow-md shadow-amber-400/10 scale-[1.02]"
                : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50 hover:border-zinc-300"
            }`}
          >
            {category.icon}
            {category.name}
          </button>
        ))}
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {activeCategory.items.map((item) => (
          <div
            key={item.name}
            className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-xl hover:border-amber-400/40 transition-all duration-500 flex flex-col h-[22rem] text-left"
          >
            {/* Background Image Container */}
            <div className="relative w-full h-48 overflow-hidden bg-zinc-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
            </div>

            {/* Content Details */}
            <div className="p-5 flex-grow flex flex-col justify-between bg-white relative z-10 -mt-6 rounded-t-3xl border-t border-zinc-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-400/20 bg-amber-400/5 text-amber-600 text-[10px] font-bold tracking-wider uppercase mb-2">
                  <Sparkles className="w-2.5 h-2.5" /> {activeCategory.name}
                </div>
                <h3 className="text-base font-serif font-bold text-zinc-900 group-hover:text-amber-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
              
              <div className="text-[9px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1 group-hover:gap-1.5 transition-all mt-4">
                Selected as inclusions <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
