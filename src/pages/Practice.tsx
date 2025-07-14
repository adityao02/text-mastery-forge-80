
import React, { useState, useEffect } from 'react';
import { TypingInterface } from '@/components/TypingInterface';
import { useApp } from '@/contexts/AppContext';
import { Textarea } from '@/components/ui/textarea';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Settings, Clock, Code, FileText, Type, Keyboard, Monitor } from 'lucide-react';
import { useIsMobileOrTablet } from '@/hooks/use-mobile';

export default function Practice() {
  const { state } = useApp();
  const [selectedMode, setSelectedMode] = useState('timed');
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [keyboardLayout, setKeyboardLayout] = useState('QWERTY');
  const [customText, setCustomText] = useState('');
  const [commandOpen, setCommandOpen] = useState(false);
  const isMobileOrTablet = useIsMobileOrTablet();

  const topics = ['general', 'science', 'literature', 'numbers'];
  const layouts = ['QWERTY', 'Colemak', 'Dvorak'];

  const isPro = state.user?.subscriptionTier === 'pro';

  // Keyboard shortcut for Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleCommandSelect = (value: string) => {
    const [type, option] = value.split(':');
    
    switch (type) {
      case 'mode':
        setSelectedMode(option);
        break;
      case 'topic':
        setSelectedTopic(option);
        if (option !== 'programming') {
          setSelectedMode('topics');
        }
        break;
      case 'layout':
        setKeyboardLayout(option);
        break;
    }
    
    setCommandOpen(false);
  };

  return (
    <>
      {/* Mobile/Tablet Restriction Dialog */}
      <AlertDialog open={isMobileOrTablet} onOpenChange={() => {}}>
        <AlertDialogContent className="sm:max-w-md border-white bg-black text-white font-mono">
          <AlertDialogHeader className="text-center space-y-6 p-6">
            <div className="flex justify-center">
              <div className="p-3 border border-white rounded-sm">
                <Monitor className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-4 text-center">
              <AlertDialogTitle className="text-xl font-bold tracking-wide text-white text-center">
                [ Desktop Recommended ]
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base leading-relaxed text-gray-300 text-center mx-auto max-w-xs">
                For the best typing experience, we recommend using a desktop with a full keyboard!
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <div className="bg-black border border-white/20 rounded-lg overflow-hidden font-mono">
          <CommandInput 
            placeholder="Search practice options..." 
            className="h-12 text-base bg-black text-white border-0 border-b border-white/20 placeholder:text-gray-400 focus:ring-0 font-mono"
          />
          <CommandList className="max-h-[400px] bg-black text-white">
            <CommandEmpty className="py-8 text-center text-gray-400">
              No results found.
            </CommandEmpty>
            
            <CommandGroup className="px-2 py-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Practice Modes
              </div>
              <CommandItem 
                onSelect={() => handleCommandSelect('mode:topics')}
                className="flex items-center px-3 py-3 cursor-pointer rounded-md text-white hover:bg-white/20 data-[selected='true']:bg-white/20"
              >
                <FileText className="mr-3 h-4 w-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="font-medium">Topics</span>
                  <span className="text-sm text-gray-400">Practice with different subjects</span>
                </div>
              </CommandItem>
              <CommandItem 
                onSelect={() => handleCommandSelect('mode:programming')}
                className="flex items-center px-3 py-3 cursor-pointer rounded-md text-white hover:bg-white/20 data-[selected='true']:bg-white/20"
              >
                <Code className="mr-3 h-4 w-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="font-medium">Programming</span>
                  <span className="text-sm text-gray-400">Practice with code snippets</span>
                </div>
              </CommandItem>
              <CommandItem 
                onSelect={() => handleCommandSelect('mode:timed')}
                className="flex items-center px-3 py-3 cursor-pointer rounded-md text-white hover:bg-white/20 data-[selected='true']:bg-white/20"
              >
                <Clock className="mr-3 h-4 w-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="font-medium">Timed</span>
                  <span className="text-sm text-gray-400">Practice for set duration</span>
                </div>
              </CommandItem>
              <CommandItem 
                onSelect={() => handleCommandSelect('mode:custom')}
                className="flex items-center px-3 py-3 cursor-pointer rounded-md text-white hover:bg-white/20 data-[selected='true']:bg-white/20"
              >
                <Type className="mr-3 h-4 w-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="font-medium">Custom Text</span>
                  <span className="text-sm text-gray-400">Practice with your own text</span>
                </div>
              </CommandItem>
            </CommandGroup>

            <CommandGroup className="px-2 py-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Topics
              </div>
              {topics.map(topic => (
                <CommandItem 
                  key={topic} 
                  onSelect={() => handleCommandSelect(`topic:${topic}`)}
                  className="flex items-center px-3 py-2 cursor-pointer rounded-md text-white hover:bg-white/20 data-[selected='true']:bg-white/20"
                >
                  <FileText className="mr-3 h-4 w-4 text-gray-400" />
                  <span className="font-medium capitalize">{topic}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup className="px-2 py-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Keyboard Layouts
              </div>
              {layouts.map(layout => (
                <CommandItem 
                  key={layout} 
                  onSelect={() => handleCommandSelect(`layout:${layout}`)}
                  className="flex items-center px-3 py-2 cursor-pointer rounded-md text-white hover:bg-white/20 data-[selected='true']:bg-white/20"
                >
                  <Keyboard className="mr-3 h-4 w-4 text-gray-400" />
                  <span className="font-medium">{layout}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </div>
      </CommandDialog>
      
      <div className="max-w-6xl mx-auto p-8 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Practice Typing</h1>
        <p className="opacity-70 mb-1">Mode: {selectedMode} | Layout: {keyboardLayout}</p>
        <p className="text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 text-xs bg-muted border rounded">Ctrl+K</kbd> to quick search options
        </p>
      </div>

      {/* Mode Selection */}
      <div className="space-y-6">
        <h2 className="text-xl">Select Practice Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedMode('topics')}
            className={`p-4 border border-current text-left hover:opacity-70 ${
              selectedMode === 'topics' ? 'bg-current text-black' : ''
            }`}
          >
            <div className="font-bold">[ Topics ]</div>
            <div className="text-sm opacity-70">Practice with different subjects</div>
          </button>
          
          <button
            onClick={() => setSelectedMode('programming')}
            className={`p-4 border border-current text-left hover:opacity-70 ${
              selectedMode === 'programming' ? 'bg-current text-black' : ''
            }`}
          >
            <div className="font-bold">[ Programming ]</div>
            <div className="text-sm opacity-70">Practice with code snippets</div>
          </button>
          
          <button
            onClick={() => setSelectedMode('timed')}
            className={`p-4 border border-current text-left hover:opacity-70 ${
              selectedMode === 'timed' ? 'bg-current text-black' : ''
            }`}
          >
            <div className="font-bold">[ Timed ]</div>
            <div className="text-sm opacity-70">Practice for set duration</div>
          </button>
          
          <button
            onClick={() => setSelectedMode('custom')}
            className={`p-4 border border-current text-left hover:opacity-70 ${
              selectedMode === 'custom' ? 'bg-current text-black' : ''
            }`}
          >
            <div className="font-bold">[ Custom Text ]</div>
            <div className="text-sm opacity-70">Practice with your own text</div>
          </button>
        </div>
      </div>

      {/* Topic Selection for Topics Mode */}
      {selectedMode === 'topics' && (
        <div className="space-y-4">
          <h3 className="text-lg">Select Topic</h3>
          <div className="flex flex-wrap gap-4">
            {topics.map(topic => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-4 py-2 border border-current hover:opacity-70 ${
                  selectedTopic === topic ? 'bg-current text-black' : ''
                }`}
              >
                [ {topic} ]
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Text Input for Custom Mode */}
      {selectedMode === 'custom' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Enter Your Custom Text</h3>
          <Textarea
            placeholder="Type or paste your custom text here..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="min-h-[120px] bg-black text-white border-border resize-none placeholder:text-muted-foreground font-mono"
          />
          {customText.length === 0 && (
            <p className="text-sm text-muted-foreground">Please enter some text to practice with.</p>
          )}
        </div>
      )}

      {/* Keyboard Layout Selection */}
      <div className="space-y-4">
        <h3 className="text-lg">Keyboard Layout</h3>
        <div className="flex gap-4">
          {layouts.map(layout => (
            <button
              key={layout}
              onClick={() => setKeyboardLayout(layout)}
              className={`px-4 py-2 border border-current hover:opacity-70 ${
                keyboardLayout === layout ? 'bg-current text-black' : ''
              }`}
            >
              [ {layout} ]
            </button>
          ))}
        </div>
      </div>

      {/* Typing Interface */}
      <div className="mt-12">
        <TypingInterface 
          key={`${selectedMode}-${selectedTopic}-${customText}`}
          mode={selectedMode} 
          topic={selectedMode === 'programming' ? 'programming' : selectedTopic}
          customText={selectedMode === 'custom' ? customText : undefined}
        />
      </div>
      </div>
    </>
  );
}

