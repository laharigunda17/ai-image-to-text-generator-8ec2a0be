import { useState } from "react";
import { Sparkles, Loader2, Zap, Eye, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { ResultDisplay } from "@/components/ResultDisplay";
import { FloatingParticles } from "@/components/FloatingParticles";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateText = async () => {
    if (!imageData) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedText("");

    try {
      const { data, error } = await supabase.functions.invoke('analyze-image', {
        body: { imageData }
      });

      if (error) {
        console.error('Function error:', error);
        
        if (error.message.includes('429')) {
          toast({
            title: "Rate limit exceeded",
            description: "Please wait a moment before trying again",
            variant: "destructive",
          });
        } else if (error.message.includes('402')) {
          toast({
            title: "Usage limit reached",
            description: "Please add credits to continue using AI features",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error analyzing image",
            description: "Please try again",
            variant: "destructive",
          });
        }
        return;
      }

      if (data?.text) {
        setGeneratedText(data.text);
        toast({
          title: "Success!",
          description: "Image analyzed successfully",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingParticles />
      
      {/* Hero Section */}
      <header className="container relative z-10 mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-8 animate-slide-up">
          <div className="gradient-animated p-4 rounded-2xl shadow-glow">
            <Sparkles className="w-10 h-10" />
          </div>
        </div>
        
        <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            AI Vision
          </span>
          <br />
          <span className="text-foreground">
            Unleashed
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Transform any image into detailed text descriptions with cutting-edge AI technology
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Lightning Fast</span>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-secondary/50 transition-colors">
            <Eye className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">Highly Accurate</span>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-colors">
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">AI Powered</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative z-10 mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Upload Section */}
          <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <ImageUpload 
              onImageSelect={setImageData} 
              disabled={isLoading}
            />
          </section>

          {/* Generate Button */}
          {imageData && !generatedText && (
            <div className="flex justify-center animate-fade-in">
              <Button
                onClick={handleGenerateText}
                disabled={isLoading}
                size="lg"
                className="gradient-animated shadow-glow hover:scale-105 transition-all text-lg px-10 py-7 rounded-xl font-semibold group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                      Analyze with AI
                    </>
                  )}
                </span>
              </Button>
            </div>
          )}

          {/* Results Section */}
          {generatedText && (
            <section className="animate-fade-in">
              <ResultDisplay text={generatedText} />
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => {
                    setImageData(null);
                    setGeneratedText("");
                  }}
                  variant="outline"
                  size="lg"
                  className="rounded-xl hover:border-primary/50 transition-all"
                >
                  Analyze Another Image
                </Button>
              </div>
            </section>
          )}

          {/* Empty State Features */}
          {!imageData && !generatedText && (
            <section className="grid md:grid-cols-3 gap-6 mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-glow group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">Visual Recognition</h3>
                <p className="text-sm text-muted-foreground">Advanced AI identifies objects, scenes, and context in your images</p>
              </div>

              <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-secondary/50 transition-all hover:shadow-glow group">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">Instant Results</h3>
                <p className="text-sm text-muted-foreground">Get detailed descriptions in seconds with our optimized AI models</p>
              </div>

              <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all hover:shadow-glow group">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">Smart Analysis</h3>
                <p className="text-sm text-muted-foreground">Extract text, identify elements, and understand image composition</p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
