import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Image as ImageIcon, MapPin, X, Camera, AlertTriangle, ExternalLink } from 'lucide-react';
import { ChatMessage, ListingDraft, SearchFilters, MessageDraft, Listing } from '../types';
import { sendMessageToGemini, extractJsonFromResponse } from '../services/geminiService';
import CameraCapture from './CameraCapture';

interface ChatInterfaceProps {
  onSearchAction: (filters: SearchFilters['data']) => void;
  onCreateAction: (listing: Listing) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onSearchAction, 
  onCreateAction,
  messages,
  setMessages
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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
                             { (msg.actionData.data as ListingDraft['data']).photos?.[0] ? (
                               <img src={(msg.actionData.data as ListingDraft['data']).photos[0]} className="w-full h-full object-cover" />
                             ) : <div className="w-full h-full flex items-center justify-center text-xs">No Img</div>}
                          </div>
                          <div>
                            <p className="font-bold text-lava line-clamp-1">{(msg.actionData.data as ListingDraft['data']).title}</p>
                            <p className="text-kai font-bold">${(msg.actionData.data as ListingDraft['data']).price}</p>
                            <p className="text-xs text-lava/60">{(msg.actionData.data as ListingDraft['data']).location}</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => handleActionClick(msg)}
                         className="bg-kai text-white text-sm font-bold py-2 rounded-lg hover:bg-kai/90 transition flex items-center justify-center gap-2 shadow-sm"
                       >
                         <Send size={16} /> Post Listing
                       </button>
                    </div>
                  )}

                  {msg.actionData.type === 'SEARCH' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-kai font-medium">
                        <Sparkles size={16} />
                        <span>Search Filter Found</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-mist text-xs text-lava space-y-1">
                         {(msg.actionData.data as SearchFilters['data']).searchQuery && <p>Query: "{(msg.actionData.data as SearchFilters['data']).searchQuery}"</p>}
                         {(msg.actionData.data as SearchFilters['data']).filters?.category && <p>Category: {(msg.actionData.data as SearchFilters['data']).filters.category}</p>}
                         {(msg.actionData.data as SearchFilters['data']).filters?.location && <p>Location: {(msg.actionData.data as SearchFilters['data']).filters.location}</p>}
                      </div>
                      <button 
                         onClick={() => handleActionClick(msg)}
                         className="bg-white border border-kai text-kai text-sm font-bold py-2 rounded-lg hover:bg-kai/5 transition flex items-center justify-center gap-2"
                       >
                         <ExternalLink size={16} /> View Results
                       </button>
                    </div>
                  )}

                  {msg.actionData.type === 'MESSAGE_SELLER' && (
                     <div className="flex flex-col gap-2">
                       {/* Safety Warning */}
                       <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex gap-3 items-start">
                          <AlertTriangle size={18} className="text-orange-600 shrink-0 mt-0.5" />
                          <div>
                             <p className="text-xs font-bold text-orange-800 mb-1">Safety First</p>
                             <p className="text-[10px] text-orange-700 leading-tight">
                               Always meet in a public place (like a police station or coffee shop). Never share verification codes or transfer money before seeing the item.
                             </p>
                          </div>
                       </div>

                       <p className="font-semibold text-koa text-xs uppercase tracking-wide mt-1">Message Preview</p>
                       <div className="bg-white p-3 rounded-lg border border-mist italic text-lava/80 text-sm">
                         "{(msg.actionData.data as MessageDraft['data']).messageToSeller}"
                       </div>
                       <button 
                         className="bg-kai text-white text-sm font-bold py-2 rounded-lg hover:bg-kai/90 transition flex items-center justify-center gap-2 shadow-sm"
                         onClick={() => alert("Message sent to seller! (Demo)")}
                       >
                         <Send size={16} /> Send Message
                       </button>
                     </div>
                  )}

                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-mist rounded-[18px] rounded-bl-none p-4 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-kai/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-kai/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-kai/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-mist/50">
        <div className="relative flex items-center gap-2 bg-mist/20 p-2 pr-2 rounded-2xl border border-mist focus-within:border-kai/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-kai/20 transition-all">
          <button 
             onClick={() => setIsCameraOpen(true)}
             className="p-2 text-lava/60 hover:text-kai hover:bg-mist/30 rounded-xl transition"
             title="Take Photo"
          >
            <Camera size={20} />
          </button>
          
          <button 
             onClick={() => fileInputRef.current?.click()}
             className="p-2 text-lava/60 hover:text-kai hover:bg-mist/30 rounded-xl transition relative"
             title="Upload Image"
          >
            <ImageIcon size={20} />
            {selectedImage && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-kai rounded-full border border-white"></span>
            )}
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleImageSelect}
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={selectedImage ? "Describe this image..." : "Ask me anything..."}
            className="flex-1 bg-transparent border-none outline-none text-lava placeholder:text-lava/40 text-base py-1"
          />
          
          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className={`p-2 rounded-xl transition-all shadow-sm ${
              (!input.trim() && !selectedImage) || isLoading
                ? 'bg-mist text-white cursor-not-allowed' 
                : 'bg-kai text-white hover:bg-kai/90 active:scale-95'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        {selectedImage && (
           <div className="mt-2 flex items-center gap-2 bg-white border border-mist rounded-lg p-2 w-fit shadow-sm animate-in slide-in-from-bottom-2">
              <img src={selectedImage.preview} className="w-8 h-8 rounded object-cover border border-mist" />
              <span className="text-xs text-lava/70 max-w-[150px] truncate">Image selected</span>
              <button onClick={() => { setSelectedImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="p-1 hover:bg-mist/50 rounded-full">
                <X size={14} className="text-lava/60" />
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;