import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Image as ImageIcon, MapPin, X, Camera } from 'lucide-react';
import { ChatMessage, ListingDraft, SearchFilters, MessageDraft, Listing } from '../types';
import { sendMessageToGemini, extractJsonFromResponse } from '../services/geminiService';
import CameraCapture from './CameraCapture';

interface ChatInterfaceProps {
  onSearchAction: (filters: SearchFilters['data']) => void;
  onCreateAction: (listing: Listing) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSearchAction, onCreateAction }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Aloha! 🌺 Welcome to Piko Market, Hawaiʻi Island's local marketplace. I can help you find items, create a listing in your district, or draft a message. Note: We are currently exclusive to the Big Island.",
      timestamp: new Date()
    }
  ]);

  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extract raw base64 data (remove "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      
      setSelectedImage({
        data: base64Data,
        mimeType: file.type,
        preview: base64String
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (dataUrl: string) => {
    const base64Data = dataUrl.split(',')[1];
    setSelectedImage({
      data: base64Data,
      mimeType: 'image/jpeg',
      preview: dataUrl
    });
    setIsCameraOpen(false);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage?.preview,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    
    // Capture values for API call
    const currentInput = input;
    const currentImage = selectedImage;

    // Reset Input UI immediately
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setIsLoading(true);

    const rawResponse = await sendMessageToGemini(
      currentInput, 
      currentImage ? { data: currentImage.data, mimeType: currentImage.mimeType } : undefined
    );
    
    const jsonAction = extractJsonFromResponse(rawResponse);
    
    // Remove the JSON block from the text for display purposes to keep it clean
    const displayText = rawResponse.replace(/```json[\s\S]*?```/, '').trim();

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: displayText || "Here is what I found.",
      timestamp: new Date()
    };

    if (jsonAction) {
       // Determine action type based on keys
       if (jsonAction.title && jsonAction.price) {
         // If user uploaded an image and it's a draft listing, let's try to inject the user's photo 
         // if the AI didn't provide one or provided a placeholder.
         const draftData = jsonAction;
         if (currentImage && (!draftData.photos || draftData.photos.length === 0)) {
            draftData.photos = [currentImage.preview];
         }
         aiMsg.actionData = { type: 'DRAFT_LISTING', data: draftData } as ListingDraft;
       } else if (jsonAction.searchQuery || jsonAction.filters) {
         aiMsg.actionData = { type: 'SEARCH', data: jsonAction } as SearchFilters;
       } else if (jsonAction.messageToSeller) {
         aiMsg.actionData = { type: 'MESSAGE_SELLER', data: jsonAction } as MessageDraft;
       }
    }

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleActionClick = (msg: ChatMessage) => {
    if (!msg.actionData) return;

    if (msg.actionData.type === 'SEARCH') {
       onSearchAction(msg.actionData.data as SearchFilters['data']);
    } else if (msg.actionData.type === 'DRAFT_LISTING') {
       const draft = msg.actionData.data as ListingDraft['data'];
       const newListing: Listing = {
          id: Date.now().toString(),
          title: draft.title,
          price: typeof draft.price === 'string' ? parseFloat(draft.price.replace(/[^0-9.]/g, '')) : draft.price,
          category: draft.category || 'Other',
          description: draft.description,
          location: draft.location,
          condition: draft.condition,
          photos: draft.photos.length ? draft.photos : ['https://picsum.photos/400/300'],
          sellerId: 'current-user',
          sellerName: 'You',
          sellerRating: 5.0,
          createdAt: new Date().toISOString(),
          island: 'hawaii' // Enforce island
       };
       onCreateAction(newListing);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-cloud relative">
      {isCameraOpen && (
        <CameraCapture 
          onCapture={handleCameraCapture} 
          onClose={() => setIsCameraOpen(false)} 
        />
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-[18px] p-4 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-kai text-white rounded-br-none' 
                  : 'bg-white border border-mist text-lava rounded-bl-none'
              }`}
            >
              {msg.image && (
                <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                  <img src={msg.image} alt="Upload" className="w-full h-auto max-h-60 object-cover" />
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* ACTION PREVIEWS */}
              {msg.actionData && (
                <div className="mt-3 bg-mist/20 rounded-xl p-3 border border-mist/50">
                  
                  {msg.actionData.type === 'DRAFT_LISTING' && (
                    <div className="flex flex-col gap-2">
                       <p className="font-semibold text-koa text-xs uppercase tracking-wide">Listing Draft</p>
                       <div className="bg-white p-2 rounded-lg border border-mist flex gap-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-md shrink-0 overflow-hidden">
                             {/* Use draft photo if available */}
                             {(msg.actionData as ListingDraft).data.photos.length > 0 ? (
                               <img src={(msg.actionData as ListingDraft).data.photos[0]} className="w-full h-full object-cover" alt="Draft" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
                             )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-medium truncate text-lava">{(msg.actionData as ListingDraft).data.title}</p>
                            <p className="text-kai font-bold">${(msg.actionData as ListingDraft).data.price}</p>
                            <p className="text-[10px] text-lava/60">{(msg.actionData as ListingDraft).data.location} (Hawaiʻi Island)</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => handleActionClick(msg)}
                         className="mt-1 w-full bg-lau text-white py-2 rounded-lg text-xs font-medium hover:bg-opacity-90 transition"
                       >
                         Confirm & Post Listing
                       </button>
                    </div>
                  )}

                  {msg.actionData.type === 'SEARCH' && (
                    <div className="flex flex-col gap-2">
                       <p className="font-semibold text-koa text-xs uppercase tracking-wide">Search Request</p>
                       <p className="text-xs text-lava/80 italic">
                         Searching for "{(msg.actionData as SearchFilters).data.searchQuery}" 
                         {(msg.actionData as SearchFilters).data.filters.category ? ` in ${(msg.actionData as SearchFilters).data.filters.category}` : ''}
                       </p>
                       <button 
                         onClick={() => handleActionClick(msg)}
                         className="mt-1 w-full bg-kai text-white py-2 rounded-lg text-xs font-medium hover:bg-opacity-90 transition"
                       >
                         View Results
                       </button>
                    </div>
                  )}

                  {msg.actionData.type === 'MESSAGE_SELLER' && (
                    <div className="flex flex-col gap-2">
                       <p className="font-semibold text-koa text-xs uppercase tracking-wide">Message Draft</p>
                       <div className="bg-white p-3 rounded-lg border border-mist text-xs text-lava/90 italic">
                         "{(msg.actionData as MessageDraft).data.messageToSeller}"
                       </div>
                       <button className="mt-1 w-full bg-kai text-white py-2 rounded-lg text-xs font-medium hover:bg-opacity-90 transition">
                         Send Message
                       </button>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-white border border-mist rounded-[18px] rounded-bl-none p-4 shadow-sm flex items-center gap-2">
               <div className="w-2 h-2 bg-kai/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <div className="w-2 h-2 bg-kai/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
               <div className="w-2 h-2 bg-kai/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-mist">
        {/* Image Preview Area */}
        {selectedImage && (
          <div className="mb-3 flex items-start gap-2 animate-fade-in">
             <div className="relative group">
                <img 
                  src={selectedImage.preview} 
                  alt="Selected" 
                  className="h-20 w-20 object-cover rounded-xl border border-mist shadow-sm"
                />
                <button 
                  onClick={() => {
                    setSelectedImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute -top-2 -right-2 bg-alaea text-white rounded-full p-1 shadow-md hover:bg-alaea/90 transition"
                >
                  <X size={12} />
                </button>
             </div>
          </div>
        )}

        <div className="relative flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageSelect}
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-mist/20 hover:bg-mist/40 text-lava/60 hover:text-kai rounded-full transition"
            title="Upload from Gallery"
          >
            <ImageIcon size={20} />
          </button>

          <button 
            onClick={() => setIsCameraOpen(true)}
            className="p-3 bg-mist/20 hover:bg-mist/40 text-lava/60 hover:text-kai rounded-full transition"
            title="Take Photo"
          >
            <Camera size={20} />
          </button>

          <div className="relative flex-1">
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={selectedImage ? "Add a caption..." : "Ask to list item..."}
                className="w-full pl-4 pr-12 py-3 bg-mist/20 rounded-full border-none focus:ring-2 focus:ring-kai/20 focus:outline-none text-lava placeholder-lava/40 transition"
             />
          </div>
          
          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="p-3 bg-kai text-white rounded-full hover:bg-kai/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
          >
            {isLoading ? <Sparkles size={20} className="animate-pulse" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;