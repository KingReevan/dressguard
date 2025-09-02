import React from "react";

export default function ModelPanel({ currentModel, onModelChange }) {
    const models = [
        {
            id: "best",
            name: "Best Model",
            available: true,
            description: "Primary clothing detection model"
        },
        {
            id: "yolov8n", 
            name: "YOLOv8 Nano",
            available: true,
            description: "Lightweight clothing detection"
        },
        {
            id: "final",
            name: "Final Model",
            available: true,
            description: "detects everything"
        },
        {
            id: "yolov12",
            name: "YOLOv12",
            available: false,
            description: "Coming soon"
        }
    ];

    const handleModelClick = (modelId) => {
        if (models.find(m => m.id === modelId)?.available) {
            // Scroll to top first
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Then trigger the model change
            onModelChange(modelId);
        }
    };

    return (
        <div className="col-span-3 bg-green-950 border border-green-500 p-6 rounded-xl flex flex-col gap-5 shadow-lg">
            <h3 className="text-center font-bold text-green-300 mb-6 text-lg tracking-wide drop-shadow">AI Model Selection</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {models.map((model) => (
                    <button
                        key={model.id}
                        className={`relative flex flex-col items-center justify-center border py-3 px-2 rounded-lg transition-all duration-200 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 group
                            ${currentModel === model.id 
                                ? 'border-green-400 bg-green-900 ring-2 ring-green-400 scale-105' 
                                : model.available 
                                    ? 'border-green-600 bg-black hover:bg-green-900 hover:scale-105 hover:shadow-md' 
                                    : 'border-gray-600 text-gray-500 bg-black cursor-not-allowed opacity-60'}
                        `}
                        onClick={() => handleModelClick(model.id)}
                        disabled={!model.available}
                        title={model.description}
                    >
                        <span className="mb-1 text-green-200 text-sm">{model.name}</span>
                        <span className="text-[10px] text-gray-400 font-normal">{model.description}</span>
                        {!model.available && (
                            <span className="absolute -top-2 -right-2 bg-gray-700 text-gray-300 text-[8px] px-1 rounded shadow">Soon</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}