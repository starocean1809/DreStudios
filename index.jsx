import { createClient } from '@base44/sdk';

import { appParams } from '@/lib/app-params';



const { appId, serverUrl, token, functionsVersion } = appParams;



//Create a client with authentication required

export const base44 = createClient({

  appId,

  serverUrl,

  token,

  functionsVersion,

  requiresAuth: false

});

import { base44 } from './base44Client';





export const Query = base44.entities.Query;







// auth sdk:

export const User = base44.auth;

import { base44 } from './base44Client';









export const Core = base44.integrations.Core;



export const InvokeLLM = base44.integrations.Core.InvokeLLM;



export const SendEmail = base44.integrations.Core.SendEmail;



export const SendSMS = base44.integrations.Core.SendSMS;



export const UploadFile = base44.integrations.Core.UploadFile;



export const GenerateImage = base44.integrations.Core.GenerateImage;



export const ExtractDataFromUploadedFile = base44.integrations.Core.ExtractDataFromUploadedFile;















import React from 'react';

import { motion } from 'framer-motion';



export default function EmptyState({ category }) {

  return (

    <motion.div

      initial={{ opacity: 0, y: 16 }}

      animate={{ opacity: 1, y: 0 }}

      className="flex flex-col items-center justify-center py-24 gap-6"

    >

      <div className="w-48 h-48 rounded-3xl overflow-hidden glass flex items-center justify-center">

        <img

          src="https://media.giphy.com/media/3oKIPseendMIBE2mxy/giphy.gif"

          alt="3D Printer in action"

          className="w-full h-full object-cover"

        />

      </div>

      <div className="text-center">

        <p className="font-semibold text-foreground text-lg">Printing soon…</p>

        <p className="text-muted-foreground text-sm mt-1">

          {category !== 'All Products' ? `No ${category} products yet.` : 'No products found.'} Check back later!

        </p>

      </div>

    </motion.div>

  );

}

import React from 'react';

import { MessageCircle, Instagram } from 'lucide-react';



export default function Footer() {

  return (

    <footer className="mt-12 glass border-t border-white/50">

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16">

        {/* About */}

        <div className="flex-1 text-center md:text-left">

          <h3 className="font-bold text-foreground text-base mb-2">About Dre Studios</h3>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">

            Dre Studios crafts premium 3D-printed products — from art and home décor to functional tools and fashion accessories. Every piece is printed with care and precision.

          </p>

        </div>



        {/* Social */}

        <div className="flex flex-col items-center md:items-start gap-3">

          <h3 className="font-bold text-foreground text-base">Connect</h3>

          <a

            href="https://wa.me/"

            target="_blank"

            rel="noopener noreferrer"

            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-green-500 transition-colors group"

          >

            <span className="w-8 h-8 rounded-xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">

              <MessageCircle size={16} className="text-green-500" />

            </span>

            WhatsApp

          </a>

          <a

            href="https://instagram.com/"

            target="_blank"

            rel="noopener noreferrer"

            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-pink-500 transition-colors group"

          >

            <span className="w-8 h-8 rounded-xl bg-pink-50 group-hover:bg-pink-100 flex items-center justify-center transition-colors">

              <Instagram size={16} className="text-pink-500" />

            </span>

            Instagram

          </a>

        </div>

      </div>



      <div className="border-t border-white/40 py-4 text-center text-xs text-muted-foreground">

        © {new Date().getFullYear()} Dre Studios · Crafted with precision

      </div>

    </footer>

  );

}

import React from 'react';

import { Search, LayoutGrid, List, ChevronDown } from 'lucide-react';

import {

  DropdownMenu,

  DropdownMenuContent,

  DropdownMenuItem,

  DropdownMenuTrigger,

} from '@/components/ui/dropdown-menu';



const sortOptions = [

  { value: 'newest', label: 'Newest First' },

  { value: 'oldest', label: 'Oldest First' },

  { value: 'price_asc', label: 'Price: Low → High' },

  { value: 'price_desc', label: 'Price: High → Low' },

  { value: 'name_asc', label: 'Name A → Z' },

];



export default function Header({ search, onSearch, viewMode, onViewMode, sortBy, onSort }) {

  const currentSort = sortOptions.find(s => s.value === sortBy) || sortOptions[0];



  return (

    <header className="sticky top-0 z-10 px-6 py-3 glass border-b border-white/50 flex items-center gap-4">

      {/* Search */}

      <div className="flex-1 max-w-xl mx-auto relative">

        <Search

          size={16}

          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"

        />

        <input

          type="text"

          placeholder="Search products…"

          value={search}

          onChange={e => onSearch(e.target.value)}

          className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm bg-white/60 backdrop-blur-sm border border-white/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 placeholder:text-muted-foreground/60 transition-all"

        />

      </div>



      {/* Controls */}

      <div className="flex items-center gap-2 flex-shrink-0">

        {/* View toggle */}

        <div className="flex items-center bg-white/50 border border-white/60 rounded-lg p-0.5">

          <button

            onClick={() => onViewMode('grid')}

            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}

            title="Grid View"

          >

            <LayoutGrid size={15} />

          </button>

          <button

            onClick={() => onViewMode('list')}

            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}

            title="List View"

          >

            <List size={15} />

          </button>

        </div>



        {/* Sort */}

        <DropdownMenu>

          <DropdownMenuTrigger asChild>

            <button className="flex items-center gap-1.5 px-3 py-2 text-sm bg-white/50 border border-white/60 rounded-lg hover:bg-white/70 transition-all text-foreground/80">

              <span className="hidden sm:inline">{currentSort.label}</span>

              <span className="sm:hidden">Sort</span>

              <ChevronDown size={13} />

            </button>

          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="glass-strong border-white/60 shadow-lg min-w-[170px]">

            {sortOptions.map(opt => (

              <DropdownMenuItem

                key={opt.value}

                onClick={() => onSort(opt.value)}

                className={`text-sm cursor-pointer ${sortBy === opt.value ? 'text-primary font-medium' : ''}`}

              >

                {opt.label}

              </DropdownMenuItem>

            ))}

          </DropdownMenuContent>

        </DropdownMenu>

      </div>

    </header>

  );

}

import React, { useState, useRef } from 'react';

import { motion } from 'framer-motion';



const placeholderImages = [

  'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=600&q=80',

  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80',

  'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=600&q=80',

];



export default function ProductCard({ product, onClick, listMode }) {

  const [hoveredSegment, setHoveredSegment] = useState(null);

  const imageRef = useRef(null);



  const images = (product.images && product.images.length > 0)

    ? product.images

    : placeholderImages.slice(0, 1);



  const activeImage = hoveredSegment !== null ? images[hoveredSegment] : images[0];



  const handleMouseMove = (e) => {

    if (!imageRef.current || images.length <= 1) return;

    const rect = imageRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const segmentWidth = rect.width / images.length;

    const seg = Math.min(Math.floor(x / segmentWidth), images.length - 1);

    setHoveredSegment(seg);

  };



  const handleMouseLeave = () => setHoveredSegment(null);



  if (listMode) {

    return (

      <motion.div

        layout

        initial={{ opacity: 0, y: 10 }}

        animate={{ opacity: 1, y: 0 }}

        exit={{ opacity: 0, y: -10 }}

        onClick={() => onClick(product)}

        className="glass rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group flex gap-4 p-3"

      >

        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-lavender/30">

          <img

            src={images[0]}

            alt={product.title}

            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"

            onError={e => { e.target.src = placeholderImages[0]; }}

          />

        </div>

        <div className="flex flex-col justify-center flex-1 min-w-0">

          <p className="font-semibold text-foreground text-sm truncate">{product.title}</p>

          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{product.category}</p>

          {product.description && (

            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>

          )}

        </div>

        <div className="flex-shrink-0 flex flex-col items-end justify-center gap-2">

          <span className="font-bold text-primary text-base">${product.price?.toFixed(2)}</span>

          <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-medium">Buy</span>

        </div>

      </motion.div>

    );

  }



  return (

    <motion.div

      layout

      initial={{ opacity: 0, scale: 0.96 }}

      animate={{ opacity: 1, scale: 1 }}

      exit={{ opacity: 0, scale: 0.96 }}

      transition={{ duration: 0.25 }}

      onClick={() => onClick(product)}

      className="glass rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"

    >

      {/* Image area */}

      <div

        ref={imageRef}

        className="relative overflow-hidden bg-lavender/20"

        style={{ aspectRatio: '4/3' }}

        onMouseMove={handleMouseMove}

        onMouseLeave={handleMouseLeave}

      >

        <img

          src={activeImage}

          alt={product.title}

          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"

          onError={e => { e.target.src = placeholderImages[0]; }}

        />



        {/* Segment indicators */}

        {images.length > 1 && (

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">

            {images.map((_, i) => (

              <div

                key={i}

                className={`h-1 rounded-full transition-all duration-200 ${(hoveredSegment ?? 0) === i ? 'w-4 bg-white' : 'w-1.5 bg-white/60'

                  }`}

              />

            ))}

          </div>

        )}



        {/* Price badge */}

        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">

          <span className="text-xs font-bold px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full text-primary shadow-sm">

            ${product.price?.toFixed(2)}

          </span>

        </div>

      </div>



      {/* Card body */}

      <div className="p-3.5">

        <p className="font-semibold text-foreground text-sm leading-tight">{product.title}</p>

        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{product.category}</p>

      </div>

    </motion.div>

  );

}

import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { X, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';



const placeholderImages = [

  'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=900&q=85',

  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=900&q=85',

];



export default function ProductModal({ product, onClose }) {

  const [currentImg, setCurrentImg] = useState(0);

  const images = (product?.images && product.images.length > 0) ? product.images : placeholderImages;



  useEffect(() => {

    setCurrentImg(0);

    const handleKey = (e) => {

      if (e.key === 'Escape') onClose();

      if (e.key === 'ArrowLeft') prev();

      if (e.key === 'ArrowRight') next();

    };

    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);

  }, [product]);



  const prev = () => setCurrentImg(i => (i - 1 + images.length) % images.length);

  const next = () => setCurrentImg(i => (i + 1) % images.length);



  if (!product) return null;



  return (

    <AnimatePresence>

      <motion.div

        initial={{ opacity: 0 }}

        animate={{ opacity: 1 }}

        exit={{ opacity: 0 }}

        className="fixed inset-0 z-50 flex items-center justify-center p-4"

        onClick={onClose}

        style={{ background: 'rgba(180, 170, 220, 0.25)', backdropFilter: 'blur(8px)' }}

      >

        <motion.div

          initial={{ opacity: 0, scale: 0.94, y: 16 }}

          animate={{ opacity: 1, scale: 1, y: 0 }}

          exit={{ opacity: 0, scale: 0.94, y: 16 }}

          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}

          onClick={e => e.stopPropagation()}

          className="glass-strong rounded-3xl overflow-hidden shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col md:flex-row"

        >

          {/* Left: Image carousel (60%) */}

          <div className="md:w-[60%] relative bg-lavender/20 flex-shrink-0" style={{ minHeight: '300px' }}>

            <img

              key={currentImg}

              src={images[currentImg]}

              alt={product.title}

              className="w-full h-full object-cover"

              style={{ minHeight: '300px', maxHeight: '500px' }}

              onError={e => { e.target.src = placeholderImages[0]; }}

            />



            {/* Nav arrows */}

            {images.length > 1 && (

              <>

                <button

                  onClick={prev}

                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white/90 transition-all"

                >

                  <ChevronLeft size={16} />

                </button>

                <button

                  onClick={next}

                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white/90 transition-all"

                >

                  <ChevronRight size={16} />

                </button>

              </>

            )}



            {/* Dots */}

            {images.length > 1 && (

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">

                {images.map((_, i) => (

                  <button

                    key={i}

                    onClick={() => setCurrentImg(i)}

                    className={`rounded-full transition-all duration-200 ${i === currentImg ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'

                      }`}

                  />

                ))}

              </div>

            )}



            {/* Thumbnail strip */}

            {images.length > 1 && (

              <div className="absolute bottom-0 left-0 right-0 flex gap-1.5 p-3 pt-6 bg-gradient-to-t from-black/20 to-transparent overflow-x-auto">

                {images.map((img, i) => (

                  <button

                    key={i}

                    onClick={() => setCurrentImg(i)}

                    className={`flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === currentImg ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'

                      }`}

                  >

                    <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = placeholderImages[0]; }} />

                  </button>

                ))}

              </div>

            )}

          </div>



          {/* Right: Details (40%) */}

          <div className="md:w-[40%] p-6 flex flex-col justify-between overflow-y-auto">

            <div>

              {/* Close */}

              <button

                onClick={onClose}

                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-all shadow-sm"

              >

                <X size={15} />

              </button>



              <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full capitalize">

                {product.category}

              </span>

              <h2 className="font-bold text-xl text-foreground mt-3 leading-tight">{product.title}</h2>



              <div className="mt-3 flex items-baseline gap-1">

                <span className="text-3xl font-bold text-primary">${product.price?.toFixed(2)}</span>

                <span className="text-sm text-muted-foreground">USD</span>

              </div>



              {product.description && (

                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

              )}

            </div>



            {/* Buy button */}

            <button

              className="mt-6 w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-95"

              style={{

                background: 'linear-gradient(135deg, hsl(250,60%,65%), hsl(200,70%,60%))',

                boxShadow: '0 4px 20px rgba(160, 130, 220, 0.35)'

              }}

            >

              <ShoppingBag size={18} />

              Buy Now

            </button>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>

  );

}

import React from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import {

  LayoutGrid, Palette, GraduationCap, Shirt, Wrench,

  Flower2, Hammer, Home, ChevronLeft, ChevronRight, Package

} from 'lucide-react';



const categories = [

  { id: 'All Products', label: 'All Products', icon: LayoutGrid },

  { id: 'Art', label: 'Art', icon: Palette },

  { id: 'Education', label: 'Education', icon: GraduationCap },

  { id: 'Fashion', label: 'Fashion', icon: Shirt },

  { id: 'Mechanical', label: 'Mechanical', icon: Wrench },

  { id: 'Decoration', label: 'Decoration', icon: Flower2 },

  { id: 'Tools', label: 'Tools', icon: Hammer },

  { id: 'Household', label: 'Household', icon: Home },

];



export default function Sidebar({ collapsed, onToggle, activeCategory, onCategoryChange }) {

  return (

    <aside

      className="transition-sidebar flex flex-col h-full glass-strong border-r border-white/60 relative z-20"

      style={{ width: collapsed ? '68px' : '220px', minWidth: collapsed ? '68px' : '220px' }}

    >

      {/* Logo */}

      <div className={`flex items-center gap-3 p-4 border-b border-white/40 ${collapsed ? 'justify-center' : ''}`}>

        <div

          className="rounded-xl overflow-hidden flex-shrink-0 shadow-md"

          style={{

            width: 40,

            height: 40,

            background: 'linear-gradient(135deg, hsl(250,55%,88%), hsl(200,70%,88%))',

            display: 'flex', alignItems: 'center', justifyContent: 'center'

          }}

        >

          <Package size={20} className="text-primary" />

        </div>

        <AnimatePresence>

          {!collapsed && (

            <motion.div

              initial={{ opacity: 0, x: -8 }}

              animate={{ opacity: 1, x: 0 }}

              exit={{ opacity: 0, x: -8 }}

              transition={{ duration: 0.2 }}

              className="overflow-hidden"

            >

              <p className="font-semibold text-sm text-foreground leading-tight">Dre Studios</p>

              <p className="text-xs text-muted-foreground">3D Prints</p>

            </motion.div>

          )}

        </AnimatePresence>

      </div>



      {/* Nav */}

      <nav className="flex-1 py-4 overflow-hidden">

        {categories.map((cat) => {

          const Icon = cat.icon;

          const isActive = activeCategory === cat.id;

          return (

            <button

              key={cat.id}

              onClick={() => onCategoryChange(cat.id)}

              title={collapsed ? cat.label : undefined}

              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-none relative group

                ${isActive

                  ? 'text-primary bg-primary/10'

                  : 'text-muted-foreground hover:text-foreground hover:bg-white/40'

                }

                ${collapsed ? 'justify-center px-0' : ''}

              `}

            >

              {isActive && (

                <motion.div

                  layoutId="activeBar"

                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full"

                />

              )}

              <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />

              <AnimatePresence>

                {!collapsed && (

                  <motion.span

                    initial={{ opacity: 0, x: -6 }}

                    animate={{ opacity: 1, x: 0 }}

                    exit={{ opacity: 0, x: -6 }}

                    transition={{ duration: 0.15 }}

                    className="whitespace-nowrap overflow-hidden"

                  >

                    {cat.label}

                  </motion.span>

                )}

              </AnimatePresence>

            </button>

          );

        })}

      </nav>



      {/* Toggle button */}

      <div className="p-3 border-t border-white/40">

        <button

          onClick={onToggle}

          className="w-full flex items-center justify-center h-8 rounded-lg hover:bg-white/50 transition-colors text-muted-foreground hover:text-foreground"

        >

          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}

        </button>

      </div>

    </aside>

  );

}

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}>
      {children}
      <ChevronDown
        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}>
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref} />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props} />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props} />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props} />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
    {...props} />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}

import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props} />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props} />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }

"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props} />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props} />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef(
  ({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />
)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props} />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props} />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    (<Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props} />)
  );
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props} />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
    {...props}>
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    (<DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props} />)
  );
}
Calendar.displayName = "Calendar"

export { Calendar }

import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
    {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const CarouselContext = React.createContext(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef((
  {
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
  },
  ref
) => {
  const [carouselRef, api] = useEmblaCarousel({
    ...opts,
    axis: orientation === "horizontal" ? "x" : "y",
  }, plugins)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api) => {
    if (!api) {
      return
    }

    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback((event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      scrollNext()
    }
  }, [scrollPrev, scrollNext])

  React.useEffect(() => {
    if (!api || !setApi) {
      return
    }

    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) {
      return
    }

    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
    };
  }, [api, onSelect])

  return (
    (<CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}>
      <div
        ref={ref}
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}>
        {children}
      </div>
    </CarouselContext.Provider>)
  );
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    (<div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props} />
    </div>)
  );
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    (<div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props} />)
  );
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    (<Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("absolute  h-8 w-8 rounded-full", orientation === "horizontal"
        ? "-left-12 top-1/2 -translate-y-1/2"
        : "-top-12 left-1/2 -translate-x-1/2 rotate-90", className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}>
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>)
  );
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    (<Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("absolute h-8 w-8 rounded-full", orientation === "horizontal"
        ? "-right-12 top-1/2 -translate-y-1/2"
        : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}>
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>)
  );
})
CarouselNext.displayName = "CarouselNext"

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };

"use client";
import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = {
  light: "",
  dark: ".dark"
}

const ChartContext = React.createContext(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    (<ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}>
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>)
  );
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({
  id,
  config
}) => {
  const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    (<style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
              .map(([key, itemConfig]) => {
                const color =
                  itemConfig.theme?.[theme] ||
                  itemConfig.color
                return color ? `  --color-${key}: ${color};` : null
              })
              .join("\n")}
}
`)
          .join("\n"),
      }} />)
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef((
  {
    active,
    payload,
    className,
    indicator = "dot",
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
  },
  ref
) => {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey || item.dataKey || item.name || "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? config[label]?.label || label
        : itemConfig?.label

    if (labelFormatter) {
      return (
        (<div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>)
      );
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    (<div
      ref={ref}
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}>
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor = color || item.payload.fill || item.color

          return (
            (<div
              key={item.dataKey}
              className={cn(
                "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                indicator === "dot" && "items-center"
              )}>
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
                          "h-2.5 w-2.5": indicator === "dot",
                          "w-1": indicator === "line",
                          "w-0 border-[1.5px] border-dashed bg-transparent":
                            indicator === "dashed",
                          "my-0.5": nestLabel && indicator === "dashed",
                        })}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor
                          }
                        } />
                    )
                  )}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center"
                    )}>
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value && (
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>)
          );
        })}
      </div>
    </div>)
  );
})
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef((
  { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
  ref
) => {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    (<div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}>
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          (<div
            key={item.value}
            className={cn(
              "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            )}>
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }} />
            )}
            {itemConfig?.label}
          </div>)
        );
      })}
    </div>)
  );
})
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config,
  payload,
  key
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
      typeof payload.payload === "object" &&
      payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey = key

  if (
    key in payload &&
    typeof payload[key] === "string"
  ) {
    configLabelKey = payload[key]
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key] === "string"
  ) {
    configLabelKey = payloadPayload[key]
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}>
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props} />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({
  children,
  ...props
}) => {
  return (
    (<Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>)
  );
}

const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props} />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props} />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props} />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props} />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}) => {
  return (
    (<span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props} />)
  );
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}>
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props} />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props} />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props} />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-4 w-4 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && "pl-8",
      className
    )}
    {...props} />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props} />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({
  className,
  ...props
}) => {
  return (
    (<span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props} />)
  );
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}

"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props} />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}>
      {children}
      <DialogPrimitive.Close
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props} />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className
      )}
      {...props}>
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props} />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}>
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props} />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props} />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props} />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props} />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props} />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}) => {
  return (
    (<span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props} />)
  );
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}

"use client";
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Controller, FormProvider, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

const FormFieldContext = React.createContext({})

const FormField = (
  {
    ...props
  }
) => {
  return (
    (<FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>)
  );
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

const FormItemContext = React.createContext({})

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    (<FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>)
  );
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    (<Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props} />)
  );
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    (<Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props} />)
  );
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    (<p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props} />)
  );
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    (<p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}>
      {body}
    </p>)
  );
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}

"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props} />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props} />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    (<div
      ref={ref}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      )}
      {...props}>
      {char}
      {hasFakeCaret && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>)
  );
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function MenubarMenu({
  ...props
}) {
  return <MenubarPrimitive.Menu {...props} />;
}

function MenubarGroup({
  ...props
}) {
  return <MenubarPrimitive.Group {...props} />;
}

function MenubarPortal({
  ...props
}) {
  return <MenubarPrimitive.Portal {...props} />;
}

function MenubarRadioGroup({
  ...props
}) {
  return <MenubarPrimitive.RadioGroup {...props} />;
}

function MenubarSub({
  ...props
}) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

const Menubar = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
      className
    )}
    {...props} />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props} />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}>
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props} />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef((
  { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
  ref
) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props} />
  </MenubarPrimitive.Portal>
))
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props} />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-4 w-4 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props} />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props} />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}) => {
  return (
    (<span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props} />)
  );
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}

import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}>
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props} />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
)

const NavigationMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}>
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true" />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    )}
    {...props} />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props} />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}>
    <div
      className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button";

const Pagination = ({
  className,
  ...props
}) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props} />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props} />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(buttonVariants({
      variant: isActive ? "outline" : "ghost",
      size,
    }), className)}
    {...props} />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props} />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }

"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}>
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (<RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />);
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}>
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-3.5 w-3.5 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>)
  );
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }

"use client"

import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props} />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}>
    {withHandle && (
      <div
        className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
      "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
      "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}>
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }

"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}>
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}>
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}>
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn("p-1", position === "popper" &&
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]")}>
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props} />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}>
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef((
  { className, orientation = "horizontal", decorative = true, ...props },
  ref
) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props} />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

"use client";
import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva } from "class-variance-authority";
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref} />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      <SheetPrimitive.Close
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props} />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef((
  {
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
  },
  ref
) => {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback((value) => {
    const openState = typeof value === "function" ? value(open) : value
    if (setOpenProp) {
      setOpenProp(openState)
    } else {
      _setOpen(openState)
    }

    // This sets the cookie to keep the sidebar state.
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }, [setOpenProp, open])

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile
      ? setOpenMobile((open) => !open)
      : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo(() => ({
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar,
  }), [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar])

  return (
    (<SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style
            }
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
            className
          )}
          ref={ref}
          {...props}>
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>)
  );
})
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef((
  {
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...props
  },
  ref
) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      (<div
        className={cn(
          "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
          className
        )}
        ref={ref}
        {...props}>
        {children}
      </div>)
    );
  }

  if (isMobile) {
    return (
      (<Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE
            }
          }
          side={side}>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>)
    );
  }

  return (
    (<div
      ref={ref}
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}>
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          "relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
        )} />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...props}>
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow">
          {children}
        </div>
      </div>
    </div>)
  );
})
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef(({ className, onClick, asChild = false, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    (<Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      asChild={asChild}
      {...props}>
      {asChild ? (
        <PanelLeft />
      ) : (
        <>
          <PanelLeft />
          <span className="sr-only">Toggle Sidebar</span>
        </>
      )}
    </Button>)
  );
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    (<button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props} />)
  );
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props} />)
  );
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props} />)
  );
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props} />)
  );
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props} />)
  );
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props} />)
  );
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props} />)
  );
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props} />)
  );
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    (<Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props} />)
  );
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    (<Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props} />)
  );
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props} />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props} />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef((
  {
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...props
  },
  ref
) => {
  const Comp = asChild ? Slot : "button"
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props} />
  )

  if (!tooltip) {
    return button
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    (<Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip} />
    </Tooltip>)
  );
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    (<Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
        "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props} />)
  );
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props} />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, [])

  return (
    (<div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}>
      {showIcon && (
        <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
      )}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width
          }
        } />
    </div>)
  );
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props} />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef(
  ({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"

    return (
      (<Comp
        ref={ref}
        data-sidebar="menu-sub-button"
        data-size={size}
        data-active={isActive}
        className={cn(
          "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          "group-data-[collapsible=icon]:hidden",
          className
        )}
        {...props} />)
    );
  }
)
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props} />)
  );
}

export { Skeleton }

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}>
    <SliderPrimitive.Track
      className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

"use client";
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    (<Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props} />)
  );
}

export { Toaster }

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}>
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )} />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props} />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props} />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
    {...props} />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props} />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props} />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props} />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props} />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props} />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    {...props} />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }

import * as React from "react";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = React.forwardRef(({ ...props }, ref) => (
  <div
    ref={ref}
    className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
    {...props}
  />
));
ToastProvider.displayName = "ToastProvider";

const ToastViewport = React.forwardRef(({ ...props }, ref) => (
  <div
    ref={ref}
    className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = "Toast";

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
import { useToast } from "@/components/ui/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
"use client";
import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}>
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    (<ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(toggleVariants({
        variant: context.variant || variant,
        size: context.size || size,
      }), className)}
      {...props}>
      {children}
    </ToggleGroupPrimitive.Item>)
  );
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props} />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }

"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props} />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

// Inspired by react-hot-toast library
import { useState, useEffect } from "react";

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1000000;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastTimeouts = new Map();

const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

const _clearFromRemoveQueue = (toastId) => {
  const timeout = toastTimeouts.get(toastId);
  if (timeout) {
    clearTimeout(timeout);
    toastTimeouts.delete(toastId);
  }
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
              ...t,
              open: false,
            }
            : t
        ),
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners = [];

let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function toast({ ...props }) {
  const id = genId();

  const update = (props) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

export { useToast, toast };
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

export default function ProtectedRoute({ fallback = <DefaultFallback />, unauthenticatedElement }) {
  const { isAuthenticated, isLoadingAuth, authChecked, authError, checkUserAuth } = useAuth();

  useEffect(() => {
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    return unauthenticatedElement;
  }

  if (!isAuthenticated) {
    return unauthenticatedElement;
  }

  return <Outlet />;
}

import React from 'react';

const UserNotRegisteredError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-orange-100">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Access Restricted</h1>
          <p className="text-slate-600 mb-8">
            You are not registered to use this application. Please contact the app administrator to request access.
          </p>
          <div className="p-4 bg-slate-50 rounded-md text-sm text-slate-600">
            <p>If you believe this is an error, you can:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Verify you are logged in with the correct account</li>
              <li>Contact the app administrator for access</li>
              <li>Try logging out and back in again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;

{
  "name": "Product",
    "type": "object",
      "properties": {
    "title": {
      "type": "string",
        "description": "Product name"
    },
    "category": {
      "type": "string",
        "enum": ["Art", "Education", "Fashion", "Mechanical", "Decoration", "Tools", "Household"],
          "description": "Product category"
    },
    "price": {
      "type": "number",
        "description": "Product price in USD"
    },
    "description": {
      "type": "string",
        "description": "Detailed product description"
    },
    "images": {
      "type": "array",
        "items": { "type": "string" },
      "description": "Array of image URLs"
    },
    "featured": {
      "type": "boolean",
        "default": false,
          "description": "Whether the product is featured"
    }
  },
  "required": ["title", "category", "price"]
}
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange);
  }, [])

  return !!isMobile
}

const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;

const toSnakeCase = (str) => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
  if (isNode) {
    return defaultValue;
  }
  const storageKey = `base44_${toSnakeCase(paramName)}`;
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);
  if (removeFromUrl) {
    urlParams.delete(paramName);
    const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""
      }${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
  }
  if (searchParam) {
    storage.setItem(storageKey, searchParam);
    return searchParam;
  }
  if (defaultValue) {
    storage.setItem(storageKey, defaultValue);
    return defaultValue;
  }
  const storedValue = storage.getItem(storageKey);
  if (storedValue) {
    return storedValue;
  }
  return null;
}

const getAppParams = () => {
  if (getAppParamValue("clear_access_token") === 'true') {
    storage.removeItem('base44_access_token');
    storage.removeItem('token');
  }
  return {
    appId: getAppParamValue("app_id", { defaultValue: import.meta.env.VITE_BASE44_APP_ID }),
    serverUrl: getAppParamValue("server_url", { defaultValue: import.meta.env.VITE_BASE44_BACKEND_URL }),
    token: getAppParamValue("access_token", { removeFromUrl: true }),
    fromUrl: getAppParamValue("from_url", { defaultValue: window.location.href }),
    functionsVersion: getAppParamValue("functions_version"),
  }
}


export const appParams = {
  ...getAppParams()
}

import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Contains only { id, public_settings }

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      // First, check app public settings (with token if available)
      // This will tell us if auth is required, user not registered, etc.
      const appClient = createAxiosClient({
        baseURL: `${appParams.serverUrl}/api/apps/public`,
        headers: {
          'X-App-Id': appParams.appId
        },
        token: appParams.token, // Include token if available
        interceptResponses: true
      });

      try {
        const publicSettings = await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
        setAppPublicSettings(publicSettings);

        // If we got the app public settings successfully, check if user is authenticated
        if (appParams.token) {
          await checkUserAuth();
        } else {
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
        }
        setIsLoadingPublicSettings(false);
      } catch (appError) {
        console.error('App state check failed:', appError);

        // Handle app-level errors
        if (appError.status === 403 && appError.data?.extra_data?.reason) {
          const reason = appError.data.extra_data.reason;
          if (reason === 'auth_required') {
            setAuthError({
              type: 'auth_required',
              message: 'Authentication required'
            });
          } else if (reason === 'user_not_registered') {
            setAuthError({
              type: 'user_not_registered',
              message: 'User not registered for this app'
            });
          } else {
            setAuthError({
              type: reason,
              message: appError.message
            });
          }
        } else {
          setAuthError({
            type: 'unknown',
            message: appError.message || 'Failed to load app'
          });
        }
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      // Now check if the user is authenticated
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);

      // If user auth fails, it might be an expired token
      if (error.status === 401 || error.status === 403) {
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required'
        });
      }
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);

    if (shouldRedirect) {
      // Use the SDK's logout method which handles token cleanup and redirect
      base44.auth.logout(window.location.href);
    } else {
      // Just remove the token without redirect
      base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    // Use the SDK's redirectToLogin method
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { base44 } from '@/api/base44Client';
import { pagesConfig } from '@/pages.config';

export default function NavigationTracker() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { Pages, mainPage } = pagesConfig;
  const mainPageKey = mainPage ?? Object.keys(Pages)[0];

  // Post navigation changes to parent window
  useEffect(() => {
    window.parent?.postMessage({
      type: "app_changed_url",
      url: window.location.href
    }, '*');
  }, [location]);

  // Log user activity when navigating to a page
  useEffect(() => {
    // Extract page name from pathname
    const pathname = location.pathname;
    let pageName;

    if (pathname === '/' || pathname === '') {
      pageName = mainPageKey;
    } else {
      // Remove leading slash and get the first segment
      const pathSegment = pathname.replace(/^\//, '').split('/')[0];

      // Try case-insensitive lookup in Pages config
      const pageKeys = Object.keys(Pages);
      const matchedKey = pageKeys.find(
        key => key.toLowerCase() === pathSegment.toLowerCase()
      );

      pageName = matchedKey || null;
    }

    if (isAuthenticated && pageName) {
      base44.appLogs.logUserInApp(pageName).catch(() => {
        // Silently fail - logging shouldn't break the app
      });
    }
  }, [location, isAuthenticated, Pages, mainPageKey]);

  return null;
}
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';


export default function PageNotFound({ }) {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  const { data: authData, isFetched } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        return { user, isAuthenticated: true };
      } catch (error) {
        return { user: null, isAuthenticated: false };
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          {/* 404 Error Code */}
          <div className="space-y-2">
            <h1 className="text-7xl font-light text-slate-300">404</h1>
            <div className="h-0.5 w-16 bg-slate-200 mx-auto"></div>
          </div>

          {/* Main Message */}
          <div className="space-y-3">
            <h2 className="text-2xl font-medium text-slate-800">
              Page Not Found
            </h2>
            <p className="text-slate-600 leading-relaxed">
              The page <span className="font-medium text-slate-700">"{pageName}"</span> could not be found in this application.
            </p>
          </div>

          {/* Admin Note */}
          {isFetched && authData.isAuthenticated && authData.user?.role === 'admin' && (
            <div className="mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                </div>
                <div className="text-left space-y-1">
                  <p className="text-sm font-medium text-slate-700">Admin Note</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    This could mean that the AI hasn't implemented this page yet. Ask it to implement it in the chat.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-6">
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
import { QueryClient } from '@tanstack/react-query';


export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


export const isIframe = window.self !== window.top;

import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge'

export default function VisualEditAgent() {
  // this functions job is to receive first a message from the parent window, to set or unset visual edits mode. 
  // once in visual edits mode, every hover over an elelmnt that has linenumbers should show an overlay, when clicked - it should stick the overlay and send a message to the parent window with the selected element
  // then, the parent window will have an editor, allow for changes to the tailwind css classes of the selected element, and send the updated css classes back to the iframe. 
  // the iframe will then update the css classes of the selected element.

  // State and refs
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);
  const isVisualEditModeRef = useRef(false);
  const [isPopoverDragging, setIsPopoverDragging] = useState(false);
  const isPopoverDraggingRef = useRef(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isDropdownOpenRef = useRef(false);
  const hoverOverlaysRef = useRef([]); // Multiple overlays for hover
  const selectedOverlaysRef = useRef([]); // Multiple overlays for selection
  const currentHighlightedElementsRef = useRef([]); // Multiple elements for hover
  const selectedElementIdRef = useRef(null); // Store the visual selector ID

  // Create overlay element
  const createOverlay = (isSelected = false) => {
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.pointerEvents = 'none';
    overlay.style.transition = 'all 0.1s ease-in-out';
    overlay.style.zIndex = '9999';

    // Use different styles for hover vs selected
    if (isSelected) {
      overlay.style.border = '2px solid #2563EB';
    } else {
      overlay.style.border = '2px solid #95a5fc';
      overlay.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
    }

    return overlay;
  };

  // Position overlay relative to element
  const positionOverlay = (overlay, element, isSelected = false) => {
    if (!element || !isVisualEditModeRef.current) return;

    // Force layout recalculation
    void element.offsetWidth;

    const rect = element.getBoundingClientRect();
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`; // weird bug with the offset
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;

    // Check if label already exists in overlay
    let label = overlay.querySelector('div');

    if (!label) {
      // Create new label if it doesn't exist
      label = document.createElement('div');
      label.textContent = element.tagName.toLowerCase();
      label.style.position = 'absolute';
      label.style.top = '-27px';
      label.style.left = '-2px';
      label.style.padding = '2px 8px';
      label.style.fontSize = '11px';
      label.style.fontWeight = isSelected ? '500' : '400';
      label.style.color = isSelected ? '#ffffff' : '#526cff';
      label.style.backgroundColor = isSelected ? '#526cff' : '#DBEAFE';
      label.style.borderRadius = '3px';
      label.style.boxShadow = isSelected ? 'none' : 'none';
      label.style.minWidth = '24px';
      label.style.textAlign = 'center';
      overlay.appendChild(label);
    }
    // If label exists, we preserve its existing styling (don't recreate or modify)
  };

  // Find elements by ID - first try data-source-location, fallback to data-visual-selector-id
  const findElementsById = (id) => {
    if (!id) return [];
    const sourceElements = [...document.querySelectorAll(`[data-source-location="${id}"]`)];
    if (sourceElements.length > 0) {
      return sourceElements;
    }
    return [...document.querySelectorAll(`[data-visual-selector-id="${id}"]`)];
  };

  // Clear hover overlays
  const clearHoverOverlays = () => {
    hoverOverlaysRef.current.forEach(overlay => {
      if (overlay && overlay.parentNode) {
        overlay.remove();
      }
    });
    hoverOverlaysRef.current = [];
    currentHighlightedElementsRef.current = [];
  };

  // Handle mouse over event
  const handleMouseOver = (e) => {
    if (!isVisualEditModeRef.current || isPopoverDraggingRef.current) return;

    // Prevent hover effects when a dropdown is open
    if (isDropdownOpenRef.current) {
      clearHoverOverlays();
      return;
    }

    // Prevent hover effects on SVG path elements
    if (e.target.tagName.toLowerCase() === 'path') {
      clearHoverOverlays();
      return;
    }

    // Support both data-source-location and data-visual-selector-id
    const element = e.target.closest('[data-source-location], [data-visual-selector-id]');
    if (!element) {
      clearHoverOverlays();
      return;
    }

    // Prefer data-source-location, fallback to data-visual-selector-id  
    const selectorId = element.dataset.sourceLocation || element.dataset.visualSelectorId;
    const useSourceLocation = !!element.dataset.sourceLocation;

    // Skip if this element is already selected
    if (selectedElementIdRef.current === selectorId) {
      clearHoverOverlays();
      return;
    }

    // Find all elements with the same ID
    const elements = findElementsById(selectorId, useSourceLocation);

    // Clear previous hover overlays
    clearHoverOverlays();

    // Create overlays for all matching elements
    elements.forEach(el => {
      const overlay = createOverlay(false);
      document.body.appendChild(overlay);
      hoverOverlaysRef.current.push(overlay);
      positionOverlay(overlay, el);
    });

    currentHighlightedElementsRef.current = elements;
  };

  // Handle mouse out event
  const handleMouseOut = () => {
    if (isPopoverDraggingRef.current) return;
    clearHoverOverlays();
  };

  // Handle element click
  const handleElementClick = (e) => {
    if (!isVisualEditModeRef.current) return;

    // Close dropdowns when clicking anywhere in iframe if a dropdown is open
    if (isDropdownOpenRef.current) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Send message to parent to close all dropdowns
      window.parent.postMessage({
        type: 'close-dropdowns'
      }, '*');
      return;
    }

    // Prevent clicking on SVG path elements
    if (e.target.tagName.toLowerCase() === 'path') {
      return;
    }

    // Prevent default behavior immediately when in visual edit mode
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // Support both data-source-location and data-visual-selector-id
    const element = e.target.closest('[data-source-location], [data-visual-selector-id]');
    if (!element) {
      return;
    }

    // Prefer data-source-location, fallback to data-visual-selector-id
    const visualSelectorId = element.dataset.sourceLocation || element.dataset.visualSelectorId;
    const useSourceLocation = !!element.dataset.sourceLocation;

    // Clear any existing selected overlays
    selectedOverlaysRef.current.forEach(overlay => {
      if (overlay && overlay.parentNode) {
        overlay.remove();
      }
    });
    selectedOverlaysRef.current = [];

    // Find all elements with the same ID
    const elements = findElementsById(visualSelectorId, useSourceLocation);

    // Create selected overlays for all matching elements
    elements.forEach(el => {
      const overlay = createOverlay(true);
      document.body.appendChild(overlay);
      selectedOverlaysRef.current.push(overlay);
      positionOverlay(overlay, el, true);
    });

    selectedElementIdRef.current = visualSelectorId;

    // Clear hover overlays
    clearHoverOverlays();

    // Calculate element position for popover positioning
    const rect = element.getBoundingClientRect();
    const elementPosition = {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2
    };

    // Send message to parent window with element info including position
    const elementData = {
      type: 'element-selected',
      tagName: element.tagName,
      classes: element.className?.baseVal || element.className || '',
      visualSelectorId: visualSelectorId,
      content: element.innerText,
      dataSourceLocation: element.dataset.sourceLocation,
      isDynamicContent: element.dataset.dynamicContent === 'true',
      linenumber: element.dataset.linenumber, // Keep for backward compatibility
      filename: element.dataset.filename, // Keep for backward compatibility
      position: elementPosition // Add position data for popover
    };
    window.parent.postMessage(elementData, '*');
  };

  // Unselect the current element
  const unselectElement = () => {
    // Clear selected overlays
    selectedOverlaysRef.current.forEach(overlay => {
      if (overlay && overlay.parentNode) {
        overlay.remove();
      }
    });
    selectedOverlaysRef.current = [];

    selectedElementIdRef.current = null;
  };

  // Update element classes by visual selector ID
  const updateElementClasses = (visualSelectorId, classes, replace = false) => {
    // Find all elements with the same visual selector ID
    const elements = findElementsById(visualSelectorId);

    if (elements.length === 0) {
      return;
    }

    // Update classes for all matching elements
    elements.forEach(element => {
      if (replace) {
        // For reverts, replace classes completely
        element.className = classes;
      } else {
        // For normal updates, merge with existing classes
        const currentClasses = element.className?.baseVal || element.className || '';
        element.className = twMerge(currentClasses, classes);
      }
    });

    // Use a small delay to allow the browser to recalculate layout before repositioning
    setTimeout(() => {
      // Reposition selected overlays
      if (selectedElementIdRef.current === visualSelectorId) {
        selectedOverlaysRef.current.forEach((overlay, index) => {
          if (index < elements.length) {
            positionOverlay(overlay, elements[index]);
          }
        });
      }

      // Reposition hover overlays if needed
      if (currentHighlightedElementsRef.current.length > 0) {
        const hoveredId = currentHighlightedElementsRef.current[0]?.dataset?.visualSelectorId;
        if (hoveredId === visualSelectorId) {
          hoverOverlaysRef.current.forEach((overlay, index) => {
            if (index < currentHighlightedElementsRef.current.length) {
              positionOverlay(overlay, currentHighlightedElementsRef.current[index]);
            }
          });
        }
      }
    }, 50); // Small delay to ensure the browser has time to recalculate layout
  };

  // Update element content by visual selector ID
  const updateElementContent = (visualSelectorId, content) => {
    // Find all elements with the same visual selector ID
    const elements = findElementsById(visualSelectorId);

    if (elements.length === 0) {
      return;
    }

    // Update content for all matching elements
    elements.forEach((element) => {
      element.innerText = content;
    });

    // Use a small delay to allow the browser to recalculate layout before repositioning
    setTimeout(() => {
      // Reposition selected overlays
      if (selectedElementIdRef.current === visualSelectorId) {
        selectedOverlaysRef.current.forEach((overlay, index) => {
          if (index < elements.length) {
            positionOverlay(overlay, elements[index]);
          }
        });
      }
    }, 50); // Small delay to ensure the browser has time to recalculate layout
  };

  // Toggle visual edit mode
  const toggleVisualEditMode = (isEnabled) => {
    setIsVisualEditMode(isEnabled);
    isVisualEditModeRef.current = isEnabled;

    if (!isEnabled) {
      // Clear hover overlays
      clearHoverOverlays();

      // Clear selected overlays
      selectedOverlaysRef.current.forEach(overlay => {
        if (overlay && overlay.parentNode) {
          overlay.remove();
        }
      });
      selectedOverlaysRef.current = [];

      currentHighlightedElementsRef.current = [];
      selectedElementIdRef.current = null;
      document.body.style.cursor = 'default';

      // Remove event listeners
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleElementClick, true);
    } else {
      // Set cursor and add event listeners
      document.body.style.cursor = 'crosshair';
      document.addEventListener('mouseover', handleMouseOver);
      document.addEventListener('mouseout', handleMouseOut);
      document.addEventListener('click', handleElementClick, true); // Use capture mode
    }
  };

  // Listen for messages from parent window
  useEffect(() => {
    // Add IDs to elements that don't have them but have linenumbers
    const elementsWithLineNumber = document.querySelectorAll('[data-linenumber]:not([data-visual-selector-id])');
    elementsWithLineNumber.forEach((el, index) => {
      const id = `visual-id-${el.dataset.filename}-${el.dataset.linenumber}-${index}`;
      el.dataset.visualSelectorId = id;
    });

    // Handle scroll events to update popover position
    const handleScroll = () => {
      if (selectedElementIdRef.current) {
        // Find the element using the stored ID
        const elements = findElementsById(selectedElementIdRef.current);
        if (elements.length > 0) {
          const element = elements[0];
          const rect = element.getBoundingClientRect();

          // Check if element is in viewport
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;
          const isInViewport = (
            rect.top < viewportHeight &&
            rect.bottom > 0 &&
            rect.left < viewportWidth &&
            rect.right > 0
          );

          const elementPosition = {
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2
          };

          window.parent.postMessage({
            type: 'element-position-update',
            position: elementPosition,
            isInViewport: isInViewport,
            visualSelectorId: selectedElementIdRef.current
          }, '*');
        }
      }
    };

    const handleMessage = (event) => {
      // Check origin if desired
      //if (event.origin !== 'parent-origin') return;

      const message = event.data;

      switch (message.type) {
        case 'toggle-visual-edit-mode':
          toggleVisualEditMode(message.data.enabled);
          break;

        case 'update-classes':
          if (message.data && message.data.classes !== undefined) {
            // Update with the visual selector ID
            // Pass replace flag if provided (used for reverts)
            updateElementClasses(
              message.data.visualSelectorId,
              message.data.classes,
              message.data.replace || false
            );
          } else {
            console.warn('[Agent] Invalid update-classes message:', message);
          }
          break;

        case 'unselect-element':
          unselectElement();
          break;

        case 'refresh-page':
          window.location.reload();
          break;

        case 'update-content':
          if (message.data && message.data.content !== undefined) {
            updateElementContent(
              message.data.visualSelectorId,
              message.data.content
            );
          } else {
            console.warn('[Agent] Invalid update-content message:', message);
          }
          break;

        case 'request-element-position':
          // Send current position of selected element for popover repositioning
          if (selectedElementIdRef.current) {
            // Find the element using the stored ID
            const elements = findElementsById(selectedElementIdRef.current);
            if (elements.length > 0) {
              const element = elements[0];
              const rect = element.getBoundingClientRect();

              // Check if element is in viewport
              const viewportHeight = window.innerHeight;
              const viewportWidth = window.innerWidth;
              const isInViewport = (
                rect.top < viewportHeight &&
                rect.bottom > 0 &&
                rect.left < viewportWidth &&
                rect.right > 0
              );

              const elementPosition = {
                top: rect.top,
                left: rect.left,
                right: rect.right,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height,
                centerX: rect.left + rect.width / 2,
                centerY: rect.top + rect.height / 2
              };

              window.parent.postMessage({
                type: 'element-position-update',
                position: elementPosition,
                isInViewport: isInViewport,
                visualSelectorId: selectedElementIdRef.current
              }, '*');
            }
          }
          break;

        case 'popover-drag-state':
          // Handle popover drag state to prevent mouseover conflicts
          if (message.data && message.data.isDragging !== undefined) {
            setIsPopoverDragging(message.data.isDragging);
            isPopoverDraggingRef.current = message.data.isDragging;

            // Clear hover overlays when dragging starts
            if (message.data.isDragging) {
              clearHoverOverlays();
            }
          }
          break;

        case 'dropdown-state':
          // Handle dropdown open/close state
          if (message.data && message.data.isOpen !== undefined) {
            setIsDropdownOpen(message.data.isOpen);
            isDropdownOpenRef.current = message.data.isOpen;

            // Clear hover overlays when dropdown opens
            if (message.data.isOpen) {
              clearHoverOverlays();
            }
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('scroll', handleScroll, true); // Use capture to catch all scroll events
    document.addEventListener('scroll', handleScroll, true); // Also listen on document

    // Send ready message to parent
    window.parent.postMessage({ type: 'visual-edit-agent-ready' }, '*');

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleElementClick, true);

      // Clean up all overlays
      clearHoverOverlays();

      selectedOverlaysRef.current.forEach(overlay => {
        if (overlay && overlay.parentNode) {
          overlay.remove();
        }
      });
    };
  }, []);

  // Keep the refs in sync with state changes
  useEffect(() => {
    isVisualEditModeRef.current = isVisualEditMode;
  }, [isVisualEditMode]);

  useEffect(() => {
    isPopoverDraggingRef.current = isPopoverDragging;
  }, [isPopoverDragging]);

  useEffect(() => {
    isDropdownOpenRef.current = isDropdownOpen;
  }, [isDropdownOpen]);

  // Handle window resize and scroll to reposition overlays
  useEffect(() => {
    const handleResize = () => {
      // Reposition selected overlays
      if (selectedElementIdRef.current) {
        const elements = findElementsById(selectedElementIdRef.current);
        selectedOverlaysRef.current.forEach((overlay, index) => {
          if (index < elements.length) {
            positionOverlay(overlay, elements[index]);
          }
        });
      }

      // Reposition hover overlays
      if (currentHighlightedElementsRef.current.length > 0) {
        hoverOverlaysRef.current.forEach((overlay, index) => {
          if (index < currentHighlightedElementsRef.current.length) {
            positionOverlay(overlay, currentHighlightedElementsRef.current[index]);
          }
        });
      }
    };

    // Create a mutation observer to detect changes in the DOM
    const mutationObserver = new MutationObserver((mutations) => {
      // Check if mutations affect relevant elements
      const needsUpdate = mutations.some(mutation => {
        // Check if the target or its children have data-visual-selector-id
        const hasVisualId = (node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.dataset && node.dataset.visualSelectorId) {
              return true;
            }
            // Check children
            for (let i = 0; i < node.children.length; i++) {
              if (hasVisualId(node.children[i])) {
                return true;
              }
            }
          }
          return false;
        };

        // Check if this is a style or attribute mutation that might affect layout
        const isLayoutChange = mutation.type === 'attributes' &&
          (mutation.attributeName === 'style' ||
            mutation.attributeName === 'class' ||
            mutation.attributeName === 'width' ||
            mutation.attributeName === 'height');

        // Check if target is or contains an element with visual selector ID
        return isLayoutChange && hasVisualId(mutation.target);
      });

      if (needsUpdate) {
        // Use timeout to let browser calculate layout
        setTimeout(handleResize, 50);
      }
    });

    // Start observing
    mutationObserver.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['style', 'class', 'width', 'height']
    });

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
      mutationObserver.disconnect();
    };
  }, []);

  // No visible UI - all functionality is handled through event listeners and message passing
  return null;
}

import React from 'react';

export default function Champions() {
  const openSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100');
  };

  const closeSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    overlay.classList.remove('opacity-100');
  };

  React.useEffect(() => {
    // Animate counters
    function animateCount(element, target) {
      let current = 0;
      const increment = Math.ceil(target / 60);
      const duration = 2000;
      const stepTime = duration / (target / increment);
      function step() {
        current += increment;
        if (current > target) current = target;
        element.textContent = current;
        if (current < target) {
          requestAnimationFrame(step);
        }
      }
      step();
    }

    function runOnceOnVisible(el, callback) {
      let fired = false;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !fired) {
            fired = true;
            callback();
            observer.disconnect();
          }
        });
      }, { threshold: 0.5 });
      observer.observe(el);
    }

    const champEl = document.getElementById('count-champions');
    const freeEl = document.getElementById('count-free');

    if (champEl && freeEl) {
      runOnceOnVisible(champEl.parentElement.parentElement, () => {
        animateCount(champEl, 163);
        animateCount(freeEl, 12);
      });
    }

    // Setup sidebar overlay click handler
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
      overlay.addEventListener('click', closeSidebar);
    }

    return () => {
      if (overlay) {
        overlay.removeEventListener('click', closeSidebar);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }
        
        @keyframes float-glow {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        }
        
        @keyframes float-delayed-glow {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-15px) translateX(-10px); opacity: 0.7; }
        }
        
        @keyframes float-slow-glow {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
          50% { transform: translateY(-25px) translateX(5px); opacity: 0.6; }
        }
        
        @keyframes drift {
          0% { transform: translateX(0px); }
          100% { transform: translateX(20px); }
        }
        
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(30px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
        }
        
        @keyframes breathing {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.1); }
        }
        
        @keyframes breathing-delayed {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInDown {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes stagger-in {
          0% { opacity: 0; transform: translateY(30px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.2); }
          50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.4), 0 0 30px rgba(255, 255, 255, 0.2); }
        }
        
        @keyframes pulse-stagger {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        
        @keyframes shimmer-bar {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        
        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-float-glow { animation: float-glow 4s ease-in-out infinite; }
        .animate-float-delayed-glow { animation: float-delayed-glow 5s ease-in-out infinite; }
        .animate-float-slow-glow { animation: float-slow-glow 6s ease-in-out infinite; }
        .animate-drift { animation: drift 8s ease-in-out infinite alternate; }
        .animate-orbit { animation: orbit 15s linear infinite; }
        .animate-breathing { animation: breathing 4s ease-in-out infinite; }
        .animate-breathing-delayed { animation: breathing-delayed 4s ease-in-out infinite 2s; }
        .animate-rotate-slow { animation: rotate-slow 20s linear infinite; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slideInDown { animation: slideInDown 0.8s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.8s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-stagger-in { animation: stagger-in 0.6s ease-out forwards; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-pulse-stagger { animation: pulse-stagger 1.5s ease-in-out infinite; }
        .animate-shimmer-bar { animation: shimmer-bar 2s ease-in-out infinite; }
        .animate-bounce-soft { animation: bounce-soft 2s ease-in-out infinite; }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-white-20::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .hover-scrollbar-thumb-white-40:hover::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.4);
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
      `}</style>

      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Background */}
        <div className="fixed top-0 w-full h-screen bg-cover bg-center -z-10"
          style={{ backgroundImage: "url('https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/cce953ba-bb14-489b-b395-4f22267673e1_3840w.jpg')" }}>
        </div>

        {/* Immersive Background */}
        <div className="fixed inset-0">
          {/* Dynamic gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950"></div>
          <div className="absolute inset-0 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/8d0c8cab-aafd-4759-951d-82f748461c75_3840w.jpg)] bg-cover"></div>

          {/* Floating particles with enhanced animations */}
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400/40 rounded-full animate-float-glow blur-sm"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/50 rounded-full animate-float-delayed-glow blur-sm"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-float-slow-glow blur-sm"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-400/40 rounded-full animate-drift blur-sm"></div>
          <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-indigo-400/30 rounded-full animate-orbit blur-sm"></div>

          {/* Ambient orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-blue-500/15 to-transparent rounded-full blur-3xl animate-breathing"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl animate-breathing-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-pink-500/10 to-transparent rounded-full blur-3xl animate-rotate-slow"></div>
        </div>

        {/* visionOS Left Navigation Dock */}
        <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50 opacity-0 animate-slideInLeft"
          style={{ animationDelay: '400ms' }}>
          <div className="flex flex-col gap-3 hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-white/10 border-white/20 border rounded-3xl pt-6 pr-4 pb-6 pl-4 shadow-2xl backdrop-blur-3xl items-center justify-center">
            <button className="p-4 rounded-2xl hover:bg-white/20 transition-all duration-300 group relative overflow-hidden hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300">
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
            </button>
            <button className="p-4 rounded-2xl bg-white/15 transition-all duration-300 group relative overflow-hidden border border-white/30 hover:scale-110 animate-pulse-glow">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 relative z-10 text-white group-hover:rotate-180 transition-transform duration-500">
                <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                <rect width="7" height="7" x="3" y="14" rx="1"></rect>
              </svg>
            </button>
            <button className="p-4 rounded-2xl hover:bg-white/20 transition-all duration-300 group relative overflow-hidden hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 relative z-10 group-hover:scale-125 transition-transform duration-300">
                <path d="m21 21-4.34-4.34"></path>
                <circle cx="11" cy="11" r="8"></circle>
              </svg>
            </button>
            <button className="p-4 rounded-2xl hover:bg-white/20 transition-all duration-300 group relative overflow-hidden hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="m22 21-3-3m-8-4 3-3"></path>
                <circle cx="16" cy="11" r="3"></circle>
              </svg>
            </button>
            <div className="w-8 h-px bg-white/20 my-2"></div>
            <button className="p-2 rounded-xl hover:bg-white/20 transition-all duration-300 group hover:scale-110">
              <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/8c334c60-c1c2-4306-8861-5b115655eb00_320w.jpg" className="w-10 h-10 rounded-xl object-cover border border-white/30 group-hover:rotate-6 transition-transform duration-300" alt="Profile" />
            </button>
          </div>
        </div>

        {/* Main Container */}
        <div className="relative z-10 h-screen flex opacity-0 animate-scaleIn ml-32" style={{ animationDelay: '200ms' }}>
          {/* Floating Sidebar Panel */}
          <div id="sidebar" className="fixed lg:absolute left-4 top-4 bottom-4 w-80 transform -translate-x-full lg:translate-x-0 transition-all duration-500 lg:block z-40">
            <div className="h-full bg-white/8 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden opacity-0 animate-slideInLeft hover:border-white/30 transition-all duration-500"
              style={{ animationDelay: '600ms' }}>
              {/* Header */}
              <div className="p-8 border-b border-white/10">
                <div className="flex items-center gap-4 mb-6 group">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-semibold text-xl">RL</span>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-2xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <h1 className="font-semibold text-lg tracking-tight text-white group-hover:text-blue-200 transition-colors duration-300">RIOT GAMES</h1>
                    <p className="text-sm text-white/60 -mt-0.5">Champions</p>
                  </div>
                </div>

                {/* Search */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors duration-300"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 group-hover:border-white/40 transition-all duration-300">
                    <div className="flex items-center px-4 py-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/50 mr-3 group-hover:text-white/70 group-hover:scale-110 transition-all duration-300">
                        <path d="m21 21-4.34-4.34"></path>
                        <circle cx="11" cy="11" r="8"></circle>
                      </svg>
                      <input type="text" placeholder="Search champions..." className="flex-1 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 group cursor-pointer">
                    <div className="text-2xl font-semibold text-white mb-1 group-hover:scale-110 transition-transform duration-300" id="count-champions">163</div>
                    <div className="text-xs text-white/60">Champions</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-4 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 hover:scale-105 group cursor-pointer">
                    <div className="text-2xl font-semibold text-green-300 mb-1 group-hover:scale-110 transition-transform duration-300" id="count-free">12</div>
                    <div className="text-xs text-white/60">Free</div>
                  </div>
                </div>

                {/* Filters */}
                <div className="space-y-6">
                  {/* Difficulty */}
                  <div className="group">
                    <div className="flex mb-4 items-center justify-between">
                      <span className="font-medium text-white/90 text-sm group-hover:text-white transition-colors duration-300">Difficulty</span>
                      <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-lg group-hover:bg-white/20 transition-colors duration-300">7/10</span>
                    </div>
                    <div className="relative">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-xl">
                        <div className="h-full w-[70%] bg-gradient-to-r from-blue-400 to-purple-500 rounded-full relative animate-shimmer-bar">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-purple-400 shadow-lg hover:scale-125 transition-transform duration-300 cursor-pointer"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Position Filter */}
                  <div>
                    <h3 className="font-medium text-white/90 text-sm mb-4">Position</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'All Positions', count: 163, active: true },
                        { name: 'Top Lane', count: 45 },
                        { name: 'Jungle', count: 38 },
                        { name: 'Bot Lane', count: 42 },
                        { name: 'Support', count: 28 }
                      ].map((position, index) => (
                        <label key={position.name} className="flex items-center p-3 rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-pointer group hover:scale-105">
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${position.active
                              ? 'border-blue-400 bg-blue-400/20'
                              : 'border-white/30 group-hover:border-white/60'
                            }`}>
                            {position.active && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-glow"></div>
                            )}
                          </div>
                          <span className={`text-sm flex-1 transition-colors duration-300 ${position.active
                              ? 'text-white/80 group-hover:text-white'
                              : 'text-white/60 group-hover:text-white/80'
                            }`}>{position.name}</span>
                          <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors duration-300">{position.count}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Overlay */}
          <div id="sidebar-overlay" className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden opacity-0 pointer-events-none transition-opacity duration-300"></div>

          {/* Main Content Area */}
          <div className="flex-1 lg:ml-96 flex flex-col h-screen">
            {/* Floating Header */}
            <div className="m-4 mb-0 shrink-0">
              <div className="bg-white/8 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl p-6 opacity-0 animate-slideInDown hover:border-white/30 transition-all duration-500"
                style={{ animationDelay: '800ms' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="lg:hidden p-3 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-110" onClick={openSidebar}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 hover:rotate-180 transition-transform duration-500">
                        <path d="M4 12h16"></path>
                        <path d="M4 18h16"></path>
                        <path d="M4 6h16"></path>
                      </svg>
                    </button>
                    <div className="group">
                      <h1 className="text-2xl font-semibold tracking-tight text-white group-hover:text-blue-200 transition-colors duration-300">Champions</h1>
                      <p className="text-sm text-white/60 -mt-1 group-hover:text-white/80 transition-colors duration-300">Discover your next main</p>
                    </div>
                  </div>
                  <div className="flex-1 pr-6 pl-6">
                    <div className="relative group max-w-md mx-auto">
                      <div className="absolute inset-0 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors duration-300 pointer-events-none"></div>
                      <input type="text" placeholder="Search champions..." className="w-full placeholder-white/50 focus:outline-none text-sm font-medium text-white bg-transparent border-neutral-50/10 border rounded-2xl pt-2 pr-4 pb-2 pl-10" />
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none drop-shadow-[0_0_2px_rgba(255,255,255,0.4)] transition-colors duration-300">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-3 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/30 hover:scale-110 group">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300">
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <path d="M3 9h18"></path>
                        <path d="M3 15h18"></path>
                        <path d="M9 3v18"></path>
                        <path d="M15 3v18"></path>
                      </svg>
                    </button>
                    <button className="p-3 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/30 hover:scale-110 group">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-125 transition-transform duration-300">
                        <path d="M3 12h.01"></path>
                        <path d="M3 18h.01"></path>
                        <path d="M3 6h.01"></path>
                        <path d="M8 12h13"></path>
                        <path d="M8 18h13"></path>
                        <path d="M8 6h13"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Champions Grid */}
            <div className="flex-1 m-4 mt-4 mb-8 min-h-0">
              <div className="bg-white/8 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl h-full overflow-hidden opacity-0 animate-fadeInUp hover:border-white/30 transition-all duration-500"
                style={{ animationDelay: '1000ms' }}>
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white-20 scrollbar-track-transparent hover-scrollbar-thumb-white-40 pt-8 pr-8 pb-8 pl-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 mb-8">
                    {/* Champion Cards - Row 1 */}
                    {[
                      { name: 'Ahri', title: 'The Nine-Tailed Fox', difficulty: 3, position: 'Mid', image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg', color: 'purple' },
                      { name: 'Yasuo', title: 'The Unforgiven', difficulty: 5, position: 'Mid', image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg', color: 'red', free: true },
                      { name: 'Jinx', title: 'The Loose Cannon', difficulty: 2, position: 'ADC', image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg', color: 'yellow' },
                      { name: 'Thresh', title: 'The Chain Warden', difficulty: 4, position: 'Support', image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_0.jpg', color: 'cyan', free: true },
                      { name: 'Lee Sin', title: 'The Blind Monk', difficulty: 5, position: 'Jungle', image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/LeeSin_0.jpg', color: 'orange' },
                      { name: 'Lux', title: 'The Lady of Luminosity', difficulty: 2, position: 'Mid', image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg', color: 'yellow', free: true },
                      { name: 'Darius', title: 'The Hand of Noxus', difficulty: 2, position: 'Top', image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Darius_0.jpg', color: 'red' },
                      { name: 'Ezreal', title: 'The Prodigal Explorer', difficulty: 3, position: 'ADC', image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ezreal_0.jpg', color: 'blue', free: true },
                    ].map((champion, index) => (
                      <div key={`${champion.name}-1-${index}`} className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-stagger-in"
                        style={{ animationDelay: `${1200 + index * 100}ms` }}>
                        <div className="bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl hover:border-white/40 transition-all duration-500 hover:bg-white/15">
                          <div className="aspect-square relative overflow-hidden">
                            <img src={champion.image} alt={champion.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            {champion.free && (
                              <div className="absolute top-3 left-3 px-3 py-1 bg-green-500/80 backdrop-blur-xl rounded-full text-xs text-white font-medium border border-green-400/30 animate-bounce-soft">FREE</div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className={`font-semibold text-white mb-1 group-hover:text-${champion.color}-200 transition-colors duration-300`}>{champion.name}</h3>
                              <p className="text-xs text-white/70 mb-3 group-hover:text-white/90 transition-colors duration-300">{champion.title}</p>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full animate-pulse-stagger ${i < champion.difficulty ? `bg-${champion.color}-400` : 'bg-white/20'
                                      }`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                                  ))}
                                </div>
                                <span className="text-xs text-white/60 bg-white/20 backdrop-blur-xl px-2 py-1 rounded-lg group-hover:bg-white/30 transition-colors duration-300">{champion.position}</span>
                              </div>
                              <button className="w-full bg-transparent text-white text-sm font-medium py-2.5 px-4 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-xl">
                                Play Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 mb-8">
                    {/* Champion Cards - Row 2 */}
                    {[
                      { name: 'Ahri', title: 'The Nine-Tailed Fox', difficulty: 3, position: 'Mid', image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/585253c8-a642-4441-8b48-a7129af38e4a_800w.jpg', color: 'purple' },
                      { name: 'Yasuo', title: 'The Unforgiven', difficulty: 5, position: 'Mid', image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4d58d888-b70d-4447-bffb-e8a323df8d16_800w.jpg', color: 'red', free: true },
                      { name: 'Jinx', title: 'The Loose Cannon', difficulty: 2, position: 'ADC', image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/8aa4c77b-ff68-4e40-a3e1-517139da29de_800w.jpg', color: 'yellow' },
                      { name: 'Thresh', title: 'The Chain Warden', difficulty: 4, position: 'Support', image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/cd6496a9-fd9e-428e-b2b3-1b35908d9d25_800w.jpg', color: 'cyan', free: true },
                      { name: 'Lee Sin', title: 'The Blind Monk', difficulty: 5, position: 'Jungle', image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/85cb6a1c-4a80-40ce-93f6-2973adb241d4_800w.jpg', color: 'orange' },
                      { name: 'Lux', title: 'The Lady of Luminosity', difficulty: 2, position: 'Mid', image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/071f0f74-e190-4f94-93fb-223ca6938511_800w.jpg', color: 'yellow', free: true },
                      { name: 'Darius', title: 'The Hand of Noxus', difficulty: 2, position: 'Top', image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/05e3e53f-e4cc-4941-8fa1-f22b5b9379f1_800w.jpg', color: 'red' },
                      { name: 'Ezreal', title: 'The Prodigal Explorer', difficulty: 3, position: 'ADC', image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/256db67a-9160-4421-b6ad-10cd2d386754_800w.jpg', color: 'blue', free: true },
                    ].map((champion, index) => (
                      <div key={`${champion.name}-2-${index}`} className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-stagger-in"
                        style={{ animationDelay: `${1200 + index * 100}ms` }}>
                        <div className="bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl hover:border-white/40 transition-all duration-500 hover:bg-white/15">
                          <div className="aspect-square relative overflow-hidden">
                            <img src={champion.image} alt={champion.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            {champion.free && (
                              <div className="absolute top-3 left-3 px-3 py-1 bg-green-500/80 backdrop-blur-xl rounded-full text-xs text-white font-medium border border-green-400/30 animate-bounce-soft">FREE</div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className={`font-semibold text-white mb-1 group-hover:text-${champion.color}-200 transition-colors duration-300`}>{champion.name}</h3>
                              <p className="text-xs text-white/70 mb-3 group-hover:text-white/90 transition-colors duration-300">{champion.title}</p>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full animate-pulse-stagger ${i < champion.difficulty ? `bg-${champion.color}-400` : 'bg-white/20'
                                      }`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                                  ))}
                                </div>
                                <span className="text-xs text-white/60 bg-white/20 backdrop-blur-xl px-2 py-1 rounded-lg group-hover:bg-white/30 transition-colors duration-300">{champion.position}</span>
                              </div>
                              <button className="w-full bg-transparent text-white text-sm font-medium py-2.5 px-4 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-xl">
                                Play Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex mt-8 justify-center">
                    <button className="hover:from-blue-400 hover:to-purple-500 transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:border-white/40 text-sm font-medium text-white tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 border-white/20 border rounded-2xl pt-2.5 pr-4 pb-2.5 pl-4 backdrop-blur-xl w-full max-w-xs">
                      Load More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Placeholder file, this should be overridden by the generated code


export default function Home() {

  return (
    <div>
    </div>
  );
}
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '@/components/dre/Sidebar';
import Header from '@/components/dre/Header';
import ProductCard from '@/components/dre/ProductCard';
import ProductModal from '@/components/dre/ProductModal';
import EmptyState from '@/components/dre/EmptyState';
import Footer from '@/components/dre/Footer';

export default function Store() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-created_date', 100),
    initialData: [],
  });

  const filtered = useMemo(() => {
    let list = [...products];

    // Category filter
    if (activeCategory !== 'All Products') {
      list = list.filter(p => p.category === activeCategory);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'oldest':
        list.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
        break;
      case 'price_asc':
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_desc':
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name_asc':
        list.sort((a, b) => a.title?.localeCompare(b.title));
        break;
      default:
        list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }

    return list;
  }, [products, activeCategory, search, sortBy]);

  return (
    <div className="flex h-screen overflow-hidden pei-grid-bg font-inter">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          search={search}
          onSearch={setSearch}
          viewMode={viewMode}
          onViewMode={setViewMode}
          sortBy={sortBy}
          onSort={setSortBy}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            {/* Category title */}
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-5 flex items-baseline gap-3"
            >
              <h1 className="text-xl font-bold text-foreground">{activeCategory}</h1>
              {!isLoading && (
                <span className="text-sm text-muted-foreground">
                  {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </motion.div>

            {/* Loading state */}
            {isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-lavender/30" />
                    <div className="p-3.5 space-y-2">
                      <div className="h-3 bg-muted rounded-full w-3/4" />
                      <div className="h-2.5 bg-muted rounded-full w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && filtered.length === 0 && (
              <EmptyState category={activeCategory} />
            )}

            {/* Product grid */}
            {!isLoading && filtered.length > 0 && (
              <AnimatePresence mode="popLayout">
                {viewMode === 'grid' ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                  >
                    {filtered.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={setSelectedProduct}
                        listMode={false}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-3 max-w-2xl"
                  >
                    {filtered.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={setSelectedProduct}
                        listMode={true}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          <Footer />
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
import './App.css'
// Add page imports here
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <VisualEditAgent />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 40 % 97 %;
    --foreground: 220 20 % 20 %;
    --card: 0 0 % 100 %;
    --card - foreground: 220 20 % 20 %;
    --popover: 0 0 % 100 %;
    --popover - foreground: 220 20 % 20 %;
    --primary: 250 60 % 65 %;
    --primary - foreground: 0 0 % 100 %;
    --secondary: 160 40 % 88 %;
    --secondary - foreground: 160 30 % 25 %;
    --muted: 210 30 % 94 %;
    --muted - foreground: 220 15 % 50 %;
    --accent: 200 60 % 88 %;
    --accent - foreground: 200 40 % 25 %;
    --destructive: 0 84.2 % 60.2 %;
    --destructive - foreground: 0 0 % 98 %;
    --border: 220 20 % 88 %;
    --input: 220 20 % 88 %;
    --ring: 250 60 % 65 %;
    --radius: 1rem;

    --mint: 160 55 % 85 %;
    --lavender: 250 55 % 88 %;
    --skyblue: 200 70 % 88 %;

    --glass - bg: rgba(255, 255, 255, 0.55);
    --glass - border: rgba(255, 255, 255, 0.75);
    --glass - shadow: 0 8px 32px rgba(160, 140, 220, 0.12);

    --sidebar - background: 0 0 % 98 %;
    --sidebar - foreground: 220 20 % 20 %;
    --sidebar - primary: 250 60 % 65 %;
    --sidebar - primary - foreground: 0 0 % 100 %;
    --sidebar - accent: 250 40 % 95 %;
    --sidebar - accent - foreground: 250 40 % 30 %;
    --sidebar - border: 220 20 % 88 %;
    --sidebar - ring: 250 60 % 65 %;
  }
}

@layer base {
  * {
    @apply border - border outline - ring / 50;
}
  body {
  @apply bg - background text - foreground font - inter;
  font - family: 'Inter', sans - serif;
}
}

/* PEI Build Plate grid background */
.pei - grid - bg {
  background - color: hsl(210, 40 %, 97 %);
  background - image:
  linear - gradient(rgba(190, 210, 240, 0.35) 1px, transparent 1px),
    linear - gradient(90deg, rgba(190, 210, 240, 0.35) 1px, transparent 1px),
    linear - gradient(rgba(200, 185, 240, 0.18) 1px, transparent 1px),
    linear - gradient(90deg, rgba(200, 185, 240, 0.18) 1px, transparent 1px);
  background - size: 40px 40px, 40px 40px, 8px 8px, 8px 8px;
  background - position: -1px - 1px, -1px - 1px, -1px - 1px, -1px - 1px;
}

/* Glassmorphism */
.glass {
  background: var(--glass - bg);
  backdrop - filter: blur(16px);
  -webkit - backdrop - filter: blur(16px);
  border: 1px solid var(--glass - border);
  box - shadow: var(--glass - shadow);
}

.glass - strong {
  background: rgba(255, 255, 255, 0.72);
  backdrop - filter: blur(24px);
  -webkit - backdrop - filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box - shadow: 0 12px 48px rgba(160, 140, 220, 0.18);
}

/* Smooth scrollbar */
:: -webkit - scrollbar {
  width: 5px;
  height: 5px;
}
:: -webkit - scrollbar - track {
  background: transparent;
}
:: -webkit - scrollbar - thumb {
  background: hsl(250, 40 %, 80 %);
  border - radius: 99px;
}

/* Transitions */
.transition - sidebar {
  transition: width 0.3s cubic - bezier(0.4, 0, 0.2, 1);
}
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>,
)

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:beforeUpdate' }, '*');
  });
  import.meta.hot.on('vite:afterUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:afterUpdate' }, '*');
  });
}




import Store from './pages/Store';

export const PAGES = {
  "Store": Store,
};

export const pagesConfig = {
  mainPage: "Store",
  Pages: PAGES,
};
#env
  .env
  .env.*

# Logs
logs
  *.log
npm - debug.log *
  yarn - debug.log *
  yarn - error.log *
  pnpm - debug.log *
  lerna - debug.log *

  node_modules
dist
dist - ssr
  *.local

# Editor directories and files
  .vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

.env
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginUnusedImports from "eslint-plugin-unused-imports";

export default [
  {
    files: [
      "src/components/**/*.{ js, mjs, cjs, jsx } ",
"src/pages/**/*.{js,mjs,cjs,jsx}",
  "src/Layout.jsx",
    ],
ignores: ["src/lib/**/*", "src/components/ui/**/*"],
    ...pluginJs.configs.recommended,
    ...pluginReact.configs.flat.recommended,
  languageOptions: {
  globals: globals.browser,
    parserOptions: {
    ecmaVersion: 2022,
      sourceType: "module",
        ecmaFeatures: {
      jsx: true,
        },
  },
},
settings: {
  react: {
    version: "detect",
      },
},
plugins: {
  react: pluginReact,
    "react-hooks": pluginReactHooks,
      "unused-imports": pluginUnusedImports,
    },
rules: {
  "no-unused-vars": "off",
    "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
        "unused-imports/no-unused-imports": "error",
          "unused-imports/no-unused-vars": [
            "warn",
            {
              vars: "all",
              varsIgnorePattern: "^_",
              args: "after-used",
              argsIgnorePattern: "^_",
            },
          ],
            "react/prop-types": "off",
              "react/react-in-jsx-scope": "off",
                "react/no-unknown-property": [
                  "error",
                  { ignore: ["cmdk-input-wrapper", "toast-close"] },
                ],
                  "react-hooks/rules-of-hooks": "error",
    },
  },
];

< !doctype html >
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="https://base44.com/logo_v2.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="manifest" href="/manifest.json" />
      <title>Base44 APP</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.jsx"></script>
    </body>
  </html>

{
  "compilerOptions": {
    "baseUrl": ".",
      "paths": {
      "@/*": ["./src/*"]
    },
    "jsx": "react-jsx",
      "module": "esnext",
        "moduleResolution": "bundler",
          "lib": ["esnext", "dom"],
            "target": "esnext",
              "checkJs": true,
                "skipLibCheck": true,
                  "allowSyntheticDefaultImports": true,
                    "esModuleInterop": true,
                      "resolveJsonModule": true,
                        "types": []
  },
  "include": ["src/components/**/*.js", "src/pages/**/*.jsx", "src/Layout.jsx"],
    "exclude": ["node_modules", "dist", "src/vite-plugins", "src/components/ui", "src/api", "src/lib"]
}
{
  "name": "base44-app",
    "private": true,
      "version": "0.0.0",
        "type": "module",
          "scripts": {
    "dev": "vite",
      "build": "vite build",
        "lint": "eslint . --quiet",
          "lint:fix": "eslint . --fix",
            "typecheck": "tsc -p ./jsconfig.json",
              "preview": "vite preview"
  },
  "dependencies": {
    "@base44/sdk": "^0.8.26",
      "@base44/vite-plugin": "^1.0.10",
        "@hello-pangea/dnd": "^17.0.0",
          "@hookform/resolvers": "^4.1.2",
            "@radix-ui/react-accordion": "^1.2.3",
              "@radix-ui/react-alert-dialog": "^1.1.6",
                "@radix-ui/react-aspect-ratio": "^1.1.2",
                  "@radix-ui/react-avatar": "^1.1.3",
                    "@radix-ui/react-checkbox": "^1.1.4",
                      "@radix-ui/react-collapsible": "^1.1.3",
                        "@radix-ui/react-context-menu": "^2.2.6",
                          "@radix-ui/react-dialog": "^1.1.6",
                            "@radix-ui/react-dropdown-menu": "^2.1.6",
                              "@radix-ui/react-hover-card": "^1.1.6",
                                "@radix-ui/react-label": "^2.1.2",
                                  "@radix-ui/react-menubar": "^1.1.6",
                                    "@radix-ui/react-navigation-menu": "^1.2.5",
                                      "@radix-ui/react-popover": "^1.1.6",
                                        "@radix-ui/react-progress": "^1.1.2",
                                          "@radix-ui/react-radio-group": "^1.2.3",
                                            "@radix-ui/react-scroll-area": "^1.2.3",
                                              "@radix-ui/react-select": "^2.1.6",
                                                "@radix-ui/react-separator": "^1.1.2",
                                                  "@radix-ui/react-slider": "^1.2.3",
                                                    "@radix-ui/react-slot": "^1.1.2",
                                                      "@radix-ui/react-switch": "^1.1.3",
                                                        "@radix-ui/react-tabs": "^1.1.3",
                                                          "@radix-ui/react-toast": "^1.2.2",
                                                            "@radix-ui/react-toggle": "^1.1.2",
                                                              "@radix-ui/react-toggle-group": "^1.1.2",
                                                                "@radix-ui/react-tooltip": "^1.1.8",
                                                                  "@stripe/react-stripe-js": "^3.0.0",
                                                                    "@stripe/stripe-js": "^5.2.0",
                                                                      "@tanstack/react-query": "^5.84.1",
                                                                        "canvas-confetti": "^1.9.4",
                                                                          "class-variance-authority": "^0.7.1",
                                                                            "clsx": "^2.1.1",
                                                                              "cmdk": "^1.0.0",
                                                                                "date-fns": "^3.6.0",
                                                                                  "embla-carousel-react": "^8.5.2",
                                                                                    "framer-motion": "^11.16.4",
                                                                                      "html2canvas": "^1.4.1",
                                                                                        "input-otp": "^1.4.2",
                                                                                          "jspdf": "^2.5.2",
                                                                                            "lodash": "^4.17.21",
                                                                                              "lucide-react": "^0.475.0",
                                                                                                "moment": "^2.30.1",
                                                                                                  "next-themes": "^0.4.4",
                                                                                                    "react": "^18.2.0",
                                                                                                      "react-day-picker": "^8.10.1",
                                                                                                        "react-dom": "^18.2.0",
                                                                                                          "react-hook-form": "^7.54.2",
                                                                                                            "react-hot-toast": "^2.6.0",
                                                                                                              "react-leaflet": "^4.2.1",
                                                                                                                "react-markdown": "^9.0.1",
                                                                                                                  "react-quill": "^2.0.0",
                                                                                                                    "react-resizable-panels": "^2.1.7",
                                                                                                                      "react-router-dom": "^6.26.0",
                                                                                                                        "recharts": "^2.15.4",
                                                                                                                          "sonner": "^2.0.1",
                                                                                                                            "tailwind-merge": "^3.0.2",
                                                                                                                              "tailwindcss-animate": "^1.0.7",
                                                                                                                                "three": "^0.171.0",
                                                                                                                                  "vaul": "^1.1.2",
                                                                                                                                    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.19.0",
      "@types/node": "^22.13.5",
        "@types/react": "^18.2.66",
          "@types/react-dom": "^18.2.22",
            "@vitejs/plugin-react": "^4.3.4",
              "autoprefixer": "^10.4.20",
                "baseline-browser-mapping": "^2.8.32",
                  "eslint": "^9.19.0",
                    "eslint-plugin-react": "^7.37.4",
                      "eslint-plugin-react-hooks": "^5.0.0",
                        "eslint-plugin-react-refresh": "^0.4.18",
                          "eslint-plugin-unused-imports": "^4.3.0",
                            "globals": "^15.14.0",
                              "postcss": "^8.5.3",
                                "tailwindcss": "^3.4.17",
                                  "typescript": "^5.8.2",
                                    "vite": "^6.1.0"
  }
}

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

# Base44 App

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        mint: 'hsl(var(--mint))',
        lavender: 'hsl(var(--lavender))',
        skyblue: 'hsl(var(--skyblue))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.25s ease-out'
      }
    }
  },
  safelist: [
    'col-span-1', 'col-span-2', 'col-span-3',
    'bg-mint', 'bg-lavender', 'bg-skyblue'
  ],
  plugins: [require("tailwindcss-animate")],
}

import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [
    base44({
      // Support for legacy code that imports the base44 SDK with @/integrations, @/entities, etc.
      // can be removed if the code has been updated to use the new SDK imports from @base44/sdk
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true'
    }),
    react(),
  ]
});