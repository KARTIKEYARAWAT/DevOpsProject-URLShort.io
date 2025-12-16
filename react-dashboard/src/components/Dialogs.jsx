import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MagicButton from "./MagicButton";

export function DownloadConfirmDialog({ open, onOpenChange, fileName, onConfirm, showPreview, onPreview }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1b26] text-white border-gray-700 rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold mb-4">Download Resource</DialogTitle>
                    <DialogDescription className="text-gray-300 text-lg">
                        You are about to download <strong className="text-white">{fileName}</strong>. Do you want to proceed?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-8 gap-4 sm:gap-4 flex flex-col sm:flex-row">
                    {showPreview ? (
                        <MagicButton
                            title="Preview"
                            handleClick={() => { onPreview(); onOpenChange(false); }}
                            otherClasses="w-full sm:flex-1 h-12 bg-white/10"
                        />
                    ) : (
                        <MagicButton
                            title="Cancel"
                            handleClick={() => onOpenChange(false)}
                            otherClasses="w-full sm:flex-1 h-12"
                        />
                    )}
                    <MagicButton
                        title="Download"
                        handleClick={() => { onConfirm(); onOpenChange(false); }}
                        otherClasses="w-full sm:flex-1 h-12"
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}



export function FilePreviewDialog({ open, onOpenChange, fileUrl, fileName }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl w-[95vw] h-[90vh] bg-[#1a1b26] text-white border-gray-700 rounded-3xl flex flex-col p-6">
                <DialogHeader className="flex-shrink-0 mb-4">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        Preview: <span className="text-blue-400">{fileName}</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 w-full bg-white rounded-xl overflow-hidden">
                    <iframe
                        src={fileUrl}
                        className="w-full h-full border-0"
                        title="File Preview"
                    />
                </div>
                <DialogFooter className="mt-4 flex-shrink-0">
                    <MagicButton
                        title="Close"
                        handleClick={() => onOpenChange(false)}
                        otherClasses="w-full sm:w-auto h-12"
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
