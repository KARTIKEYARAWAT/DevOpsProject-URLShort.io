
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import MagicButton from "./MagicButton";
import { Sparkles, Link2, FileText, Settings, ArrowRight, Check } from 'lucide-react';

const tourSteps = [
    {
        title: "Welcome to URLShort.io",
        description: "Experience the power of a distributed URL shortener system. Let's take a quick tour of what you can do.",
        icon: <Sparkles className="w-16 h-16 text-yellow-400" />,
    },
    {
        title: "Create Short Links",
        description: "Paste any long URL, optionally give it a custom alias (e.g., 'mysite'), and hit SHORTEN. We'll handle the consistent hashing and replication.",
        icon: <Link2 className="w-16 h-16 text-blue-400" />,
    },
    {
        title: "Manage & Share",
        description: "Instantly copy your new link or remove it to start fresh. The system replicates your link across available nodes for high availability.",
        icon: <Settings className="w-16 h-16 text-purple-400" />,
    },
    {
        title: "Explore Resources",
        description: "Open the sidebar to download Project Insights, Architecture Diagrams, and even the raw WAR/JAR files to run your own nodes.",
        icon: <FileText className="w-16 h-16 text-pink-400" />,
    }
];

export function WelcomeTour({ open, onOpenChange }) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (open) {
            setCurrentStep(0);
        }
    }, [open]);

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = () => {
        localStorage.setItem('hasSeenWelcomeTour', 'true');
        onOpenChange(false);
    };

    const step = tourSteps[currentStep];

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) handleFinish();
            onOpenChange(val);
        }}>
            <DialogContent className="sm:max-w-[500px] bg-[#1a1b26] text-white border-gray-700 p-8 rounded-3xl">
                <DialogHeader className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-white/5 rounded-full mb-2 animate-bounce-slow">
                        {step.icon}
                    </div>
                    <DialogTitle className="text-3xl font-bold tracking-tight">
                        {step.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-300 text-lg leading-relaxed">
                        {step.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center gap-2 my-6">
                    {tourSteps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-blue-500' : 'w-2 bg-gray-600'}`}
                        />
                    ))}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-3">
                    <MagicButton
                        title={currentStep === tourSteps.length - 1 ? "Get Started" : "Next Step"}
                        icon={currentStep === tourSteps.length - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
                        position="right"
                        handleClick={handleNext}
                        otherClasses="w-full h-12"
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
