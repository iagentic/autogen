import React, { memo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Fullscreen,
  Loader2,
  Maximize2,
  Minimize2,
  X,
  Search,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Tooltip } from "antd";
import remarkGfm from "remark-gfm";

export const LoadingIndicator = ({ size = 16 }: { size: number }) => (
  <div className="inline-flex items-center gap-2 text-accent   mr-2">
    <Loader2 size={size} className="animate-spin" />
  </div>
);

export const LoadingDots = ({ size = 8 }) => {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="bg-accent rounded-full animate-bounce"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: "0.6s",
        }}
      />
      <span
        className="bg-accent rounded-full animate-bounce"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: "0.6s",
          animationDelay: "0.2s",
        }}
      />
      <span
        className="bg-accent rounded-full animate-bounce"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: "0.6s",
          animationDelay: "0.4s",
        }}
      />
    </span>
  );
};

// import { memo, useState } from 'react';
// import ReactMarkdown from 'react-markdown';
// import { Minimize2, Maximize2, ArrowsMaximize, X } from 'lucide-react';
// import { Tooltip } from 'antd';

function safeJsonStringify(input: any): string {
  if (typeof input === "object" && input !== null) {
    return JSON.stringify(input);
  }
  return input;
}

export const TruncatableText = memo(
  ({
    content = "",
    isJson = false,
    className = "",
    jsonThreshold = 1000,
    textThreshold = 500,
    showFullscreen = true,
  }: {
    content: string;
    isJson?: boolean;
    className?: string;
    jsonThreshold?: number;
    textThreshold?: number;
    showFullscreen?: boolean;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const threshold = isJson ? jsonThreshold : textThreshold;
    content = safeJsonStringify(content) + "";
    const shouldTruncate = content.length > threshold;

    const toggleExpand = (e: React.MouseEvent) => {
      setIsExpanded(!isExpanded);
      e.stopPropagation();
    };

    const displayContent =
      shouldTruncate && !isExpanded
        ? content.slice(0, threshold) + "..."
        : content;
    const proseClassName =
      " dark:prose-invert prose-table:border-hidden prose-td:border-t prose-th:border-b prose-ul:list-disc prose-sm prose-ol:list-decimal ";
    return (
      <div className="relative">
        <div
          className={`
            transition-[max-height,opacity] overflow-auto scroll  duration-500 ease-in-out
            ${
              shouldTruncate && !isExpanded
                ? "max-h-[300px]"
                : "max-h-[10000px]"
            }
            ${className}
          `}
        >
          <ReactMarkdown
            className={
              isExpanded ? `mt-4 text-sm text-primary ${proseClassName}` : ""
            }
            remarkPlugins={[remarkGfm]}
          >
            {displayContent}
          </ReactMarkdown>
          {shouldTruncate && !isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-secondary to-transparent opacity-20" />
          )}
        </div>

        {shouldTruncate && (
          <div className="mt-2 flex items-center justify-end gap-2">
            <Tooltip title={isExpanded ? "Show less" : "Show more"}>
              <button
                type="button"
                onClick={toggleExpand}
                className="inline-flex items-center justify-center p-2 rounded bg-secondary text-primary hover:text-accent hover:scale-105 transition-all duration-300 z-10"
                aria-label={isExpanded ? "Show less" : "Show more"}
              >
                {isExpanded ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </Tooltip>

            {showFullscreen && (
              <Tooltip title="Fullscreen">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="inline-flex items-center justify-center p-2 rounded bg-secondary text-primary hover:text-accent hover:scale-105 transition-all duration-300 z-10"
                  aria-label="Toggle fullscreen"
                >
                  <Maximize2 size={18} />
                </button>
              </Tooltip>
            )}
          </div>
        )}

        {isFullscreen && (
          <div
            className="fixed inset-0 dark:bg-black/80 bg-black/10 z-50 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <div
              className="relative bg-primary scroll w-full h-full md:w-4/5 md:h-4/5 md:rounded-lg p-8 overflow-auto"
              style={{ opacity: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip title="Close">
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-primary transition-colors"
                  aria-label="Close fullscreen view"
                >
                  <X size={24} />
                </button>
              </Tooltip>
              <div className={`mt-8 text-base text-primary ${proseClassName}`}>
                {isJson ? (
                  <pre className="whitespace-pre-wrap">{content}</pre>
                ) : (
                  <ReactMarkdown
                    className="text-primary"
                    remarkPlugins={[remarkGfm]}
                  >
                    {content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

const FullScreenImage: React.FC<{
  src: string;
  alt: string;
  onClose: () => void;
}> = ({ src, alt, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
        aria-label="Close fullscreen image"
      >
        <X size={24} />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export const ClickableImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = "" }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className} cursor-pointer rounded hover:opacity-90 transition-opacity`}
        onClick={() => setIsFullScreen(true)}
      />
      {isFullScreen && (
        <FullScreenImage
          src={src}
          alt={alt}
          onClose={() => setIsFullScreen(false)}
        />
      )}
    </>
  );
};

// dateUtils.ts
export function getRelativeTimeString(date: string | number | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  } else {
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
  }
}

export const HelpTooltip: React.FC<{
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}> = ({ content, children, placement = 'right' }) => {
  return (
    <Tooltip
      title={
        <div className="max-w-xs p-2 text-sm">
          {content}
        </div>
      }
      placement={placement}
      color="var(--color-bg-secondary)"
    >
      {children}
    </Tooltip>
  );
};

export const ProgressiveDisclosure: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-secondary rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between bg-primary hover:bg-secondary transition-colors"
      >
        <span className="font-medium text-primary">{title}</span>
        <ChevronDown
          className={`h-5 w-5 text-secondary transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const ContentFilter: React.FC<{
  filters: Array<{ label: string; value: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
}> = ({ filters, selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-secondary rounded-lg">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => {
            const newSelected = selected.includes(filter.value)
              ? selected.filter((v) => v !== filter.value)
              : [...selected, filter.value];
            onChange(newSelected);
          }}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selected.includes(filter.value)
              ? 'bg-accent text-white'
              : 'bg-primary text-secondary hover:bg-tertiary'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export const GuidedTour: React.FC<{
  steps: Array<{
    target: string;
    content: string;
    title?: string;
    placement?: 'top' | 'right' | 'bottom' | 'left';
  }>;
  isOpen: boolean;
  onClose: () => void;
}> = ({ steps, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div
        className="absolute bg-primary p-4 rounded-lg shadow-lg"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '400px',
        }}
      >
        {currentStepData.title && (
          <h3 className="text-lg font-semibold mb-2 text-primary">
            {currentStepData.title}
          </h3>
        )}
        <p className="text-secondary mb-4">{currentStepData.content}</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-accent' : 'bg-secondary'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1 text-sm text-secondary hover:text-accent"
            >
              Previous
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-3 py-1 text-sm bg-accent text-white rounded"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-3 py-1 text-sm bg-accent text-white rounded"
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SearchBar: React.FC<{
  onSearch: (query: string) => void;
  placeholder?: string;
}> = ({ onSearch, placeholder = 'Search...' }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 bg-primary border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-primary"
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary"
      />
    </div>
  );
};
