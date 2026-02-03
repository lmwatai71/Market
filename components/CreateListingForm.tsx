import React, { useState, useRef } from 'react';
import { Camera, X, Check, MapPin, DollarSign, Tag, Info, ChevronLeft, Upload } from 'lucide-react';
import { CATEGORIES, APPROVED_LOCATIONS, getIslandFromLocation } from '../constants';
import { Listing } from '../types';

interface CreateListingFormProps {
  onCancel: () => void;
  onSubmit: (listing: Listing) => void;
}

const CreateListingForm: React.FC<CreateListingFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    location: '',
    condition: 'Good',
    negotiable: false
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.description) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const detectedIsland = getIslandFromLocation(formData.location);

    const newListing: Listing = {
      id: Date.now().toString(),
      title: formData.title,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      location: formData.location,
      condition: formData.condition,
      photos: photoPreview ? [photoPreview] : ['https://picsum.photos/400/300'], // Fallback if no photo
      sellerId: 'current-user', // Will be overwritten by App.tsx
      sellerName: 'You',
      sellerRating: 5.0,
      sellerReviewCount: 0,
      createdAt: new Date().toISOString(),
      island: detectedIsland,
      negotiable: formData.negotiable
    };

    onSubmit(newListing);
  };

  return (
    <div className="bg-white min-h-screen pb-24 animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-mist px-4 py-3 flex items-center justify-between">
         <button onClick={onCancel} className="p-2 -ml-2 text-lava/60 hover:bg-mist/20 rounded-full">
           <ChevronLeft size={24} />
         </button>
         <h2 className="font-serif font-bold text-lg text-koa">New Listing</h2>
         <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-6">
        
        {/* Photo Upload Section */}
        <div className="space-y-2">
           <label className="text-xs font-bold text-lava uppercase tracking-wide">Photo</label>
           <div 
             onClick={() => fileInputRef.current?.click()}
             className={`aspect-video w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden ${photoPreview ? 'border-transparent' : 'border-mist hover:border-kai/50 hover:bg-mist/10'}`}
           >
              {photoPreview ? (
                <>
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                     <div className="bg-white/90 p-2 rounded-full text-lava shadow-md">
                       <Camera size={24} />
                     </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                   <div className="bg-mist/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-lava/50">
                     <Upload size={24} />
                   </div>
                   <p className="text-sm font-medium text-lava">Tap to upload photo</p>
                   <p className="text-xs text-lava/50 mt-1">Good lighting helps sell faster!</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageSelect}
              />
           </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-lava uppercase tracking-wide">Title</label>
          <input 
            type="text" 
            placeholder="What are you selling?"
            className={`w-full p-4 rounded-xl border ${errors.title ? 'border-alaea' : 'border-mist'} focus:border-kai focus:ring-2 focus:ring-kai/10 outline-none transition`}
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
          {errors.title && <p className="text-xs text-alaea font-medium">{errors.title}</p>}
        </div>

        {/* Price */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-lava uppercase tracking-wide">Price</label>
          <div className="relative">
            <DollarSign size={18} className="absolute left-4 top-4 text-lava/40" />
            <input 
              type="number" 
              placeholder="0.00"
              className={`w-full pl-10 pr-4 py-4 rounded-xl border ${errors.price ? 'border-alaea' : 'border-mist'} focus:border-kai focus:ring-2 focus:ring-kai/10 outline-none transition font-mono text-lg`}
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <div className="flex items-center mt-2">
             <input 
               type="checkbox" 
               id="negotiable"
               checked={formData.negotiable}
               onChange={e => setFormData({...formData, negotiable: e.target.checked})}
               className="w-4 h-4 text-kai rounded focus:ring-kai"
             />
             <label htmlFor="negotiable" className="ml-2 text-sm text-lava/80">Open to offers (Negotiable)</label>
          </div>
          {errors.price && <p className="text-xs text-alaea font-medium">{errors.price}</p>}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
             <label className="text-xs font-bold text-lava uppercase tracking-wide">Category</label>
             <div className="relative">
               <Tag size={18} className="absolute left-4 top-4 text-lava/40 pointer-events-none" />
               <select 
                 className={`w-full pl-10 pr-4 py-4 rounded-xl border ${errors.category ? 'border-alaea' : 'border-mist'} bg-white appearance-none focus:border-kai focus:ring-2 focus:ring-kai/10 outline-none transition text-lava`}
                 value={formData.category}
                 onChange={e => setFormData({...formData, category: e.target.value})}
               >
                 <option value="" disabled>Select Category</option>
                 {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
             {errors.category && <p className="text-xs text-alaea font-medium">{errors.category}</p>}
          </div>

          <div className="space-y-1">
             <label className="text-xs font-bold text-lava uppercase tracking-wide">Condition</label>
             <select 
               className="w-full px-4 py-4 rounded-xl border border-mist bg-white appearance-none focus:border-kai focus:ring-2 focus:ring-kai/10 outline-none transition text-lava"
               value={formData.condition}
               onChange={e => setFormData({...formData, condition: e.target.value})}
             >
               <option value="New">New</option>
               <option value="Like New">Like New</option>
               <option value="Good">Good</option>
               <option value="Fair">Fair</option>
               <option value="Poor">Poor</option>
             </select>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1">
           <label className="text-xs font-bold text-lava uppercase tracking-wide">Location</label>
           <div className="relative">
             <MapPin size={18} className="absolute left-4 top-4 text-lava/40 pointer-events-none" />
             <select 
               className={`w-full pl-10 pr-4 py-4 rounded-xl border ${errors.location ? 'border-alaea' : 'border-mist'} bg-white appearance-none focus:border-kai focus:ring-2 focus:ring-kai/10 outline-none transition text-lava`}
               value={formData.location}
               onChange={e => setFormData({...formData, location: e.target.value})}
             >
               <option value="" disabled>Select Location</option>
               {APPROVED_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
             </select>
           </div>
           {errors.location && <p className="text-xs text-alaea font-medium">{errors.location}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-lava uppercase tracking-wide">Description</label>
          <div className="relative">
             <Info size={18} className="absolute left-4 top-4 text-lava/40" />
             <textarea 
               placeholder="Describe your item..."
               rows={4}
               className={`w-full pl-10 pr-4 py-4 rounded-xl border ${errors.description ? 'border-alaea' : 'border-mist'} focus:border-kai focus:ring-2 focus:ring-kai/10 outline-none transition`}
               value={formData.description}
               onChange={e => setFormData({...formData, description: e.target.value})}
             />
          </div>
          {errors.description && <p className="text-xs text-alaea font-medium">{errors.description}</p>}
        </div>

        {/* Submit Action */}
        <div className="pt-4">
           <button 
             type="submit"
             className="w-full bg-kai text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-kai/90 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2"
           >
             <Check size={24} /> Publish Listing
           </button>
        </div>

      </form>
    </div>
  );
};

export default CreateListingForm;