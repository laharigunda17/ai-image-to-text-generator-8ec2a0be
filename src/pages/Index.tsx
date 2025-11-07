import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { ResultDisplay } from "@/components/ResultDisplay";
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="gradient-primary p-3 rounded-xl shadow-glow">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          AI Image-to-Text Generator
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload any image and let AI extract text or generate detailed descriptions instantly
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <section>
            <ImageUpload 
              onImageSelect={setImageData} 
              disabled={isLoading}
            />
          </section>

          {/* Generate Button */}
          {imageData && !generatedText && (
            <div className="flex justify-center">
              <Button
                onClick={handleGenerateText}
                disabled={isLoading}
                size="lg"
                className="gradient-primary shadow-glow hover:scale-105 transition-transform text-lg px-8 py-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Text
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Results Section */}
          {generatedText && (
            <section className="animate-in fade-in duration-500">
              <ResultDisplay text={generatedText} />
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => {
                    setImageData(null);
                    setGeneratedText("");
                  }}
                  variant="outline"
                >
                  Analyze Another Image
                </Button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
