import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, Zap, Clock, DollarSign, Cpu, BarChart3, Star, Bookmark, GitCompare } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { cn } from "../lib/utils";
import { loadModelCatalog, type ModelEntry } from "../config/models";
import { getModelFallback } from "../api/openrouter";

interface ModelFilters {
  provider: string;
  safety: string;
  pricing: string;
  contextLength: string;
  search: string;
}

interface ModelCardProps {
  model: ModelEntry;
  isSelected: boolean;
  onSelect: (model: ModelEntry) => void;
  onCompare: (model: ModelEntry) => void;
  onBookmark: (model: ModelEntry) => void;
  isBookmarked: boolean;
}

function ModelCard({
  model,
  isSelected,
  onSelect,
  onCompare,
  onBookmark,
  isBookmarked
}: ModelCardProps) {
  const formatPrice = (price?: number) => {
    if (!price) return "Free";
    if (price < 0.001) return `$${(price * 1000000).toFixed(2)}/1M`;
    if (price < 0.1) return `$${(price * 1000).toFixed(2)}/1K`;
    return `$${price.toFixed(3)}/1K`;
  };

  const formatContextLength = (ctx?: number) => {
    if (!ctx) return "Unknown";
    if (ctx >= 1000000) return `${(ctx / 1000000).toFixed(1)}M tokens`;
    if (ctx >= 1000) return `${(ctx / 1000).toFixed(0)}K tokens`;
    return `${ctx} tokens`;
  };

  const getSafetyBadgeVariant = (safety: string) => {
    switch (safety) {
      case "free": return "secondary";
      case "moderate": return "outline";
      case "strict": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <Card className={cn(
      "relative transition-all duration-200 hover:shadow-md cursor-pointer",
      isSelected && "ring-2 ring-accent-500 shadow-lg"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-medium mb-1">
              {model.label || model.id}
            </CardTitle>
            <CardDescription className="text-sm text-neutral-500">
              {model.provider && (
                <span className="font-mono text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                  {model.provider}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(model);
              }}
            >
              <Bookmark className={cn(
                "h-4 w-4",
                isBookmarked && "fill-current text-accent-500"
              )} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onCompare(model);
              }}
            >
              <GitCompare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className="pt-0 cursor-pointer"
        onClick={() => onSelect(model)}
      >
        {/* Model Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-neutral-500" />
            <div className="text-sm">
              <div className="font-medium">Input: {formatPrice(model.pricing?.in)}</div>
              <div className="text-neutral-500">Output: {formatPrice(model.pricing?.out)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-neutral-500" />
            <div className="text-sm">
              <div className="font-medium">Context</div>
              <div className="text-neutral-500">{formatContextLength(model.ctx)}</div>
            </div>
          </div>
        </div>

        {/* Tags and Safety */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant={getSafetyBadgeVariant(model.safety)}>
            {model.safety}
          </Badge>
          {model.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {model.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{model.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Performance Indicators (Mock data for now) */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>~2.3s</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            <span>Quality: 4.2/5</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span>Popular</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ModelsPage() {
  const [models, setModels] = useState<ModelEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>(getModelFallback() || "meta-llama/llama-3.3-70b-instruct:free");
  const [compareModels, setCompareModels] = useState<ModelEntry[]>([]);
  const [bookmarkedModels, setBookmarkedModels] = useState<Set<string>>(new Set());
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const toasts = useToasts();

  const [filters, setFilters] = useState<ModelFilters>({
    provider: "all",
    safety: "all",
    pricing: "all",
    contextLength: "all",
    search: ""
  });

  useEffect(() => {
    loadModels();
    loadBookmarks();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const catalog = await loadModelCatalog();
      setModels(catalog);
    } catch (error) {
      toasts.push({
        kind: "error",
        title: "Failed to load models",
        message: "Could not fetch model catalog. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = () => {
    try {
      const saved = localStorage.getItem("bookmarked-models");
      if (saved) {
        setBookmarkedModels(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.warn("Failed to load bookmarks:", error);
    }
  };

  const saveBookmarks = (bookmarks: Set<string>) => {
    try {
      localStorage.setItem("bookmarked-models", JSON.stringify(Array.from(bookmarks)));
    } catch (error) {
      console.warn("Failed to save bookmarks:", error);
    }
  };

  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          model.id.toLowerCase().includes(searchLower) ||
          (model.label?.toLowerCase() || "").includes(searchLower) ||
          (model.provider?.toLowerCase() || "").includes(searchLower) ||
          model.tags.some(tag => tag.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      // Provider filter
      if (filters.provider !== "all" && model.provider !== filters.provider) {
        return false;
      }

      // Safety filter
      if (filters.safety !== "all" && model.safety !== filters.safety) {
        return false;
      }

      // Pricing filter
      if (filters.pricing !== "all") {
        const isFree = model.safety === "free" || (!model.pricing?.in && !model.pricing?.out);
        if (filters.pricing === "free" && !isFree) return false;
        if (filters.pricing === "paid" && isFree) return false;
      }

      // Context length filter
      if (filters.contextLength !== "all") {
        const ctx = model.ctx || 0;
        switch (filters.contextLength) {
          case "small": return ctx < 8000;
          case "medium": return ctx >= 8000 && ctx < 32000;
          case "large": return ctx >= 32000 && ctx < 128000;
          case "xlarge": return ctx >= 128000;
          default: return true;
        }
      }

      return true;
    });
  }, [models, filters]);

  const providers = useMemo(() => {
    const providerSet = new Set(
      models
        .map(m => m.provider)
        .filter((provider): provider is string => Boolean(provider))
    );
    return Array.from(providerSet).sort();
  }, [models]);

  const handleSelectModel = (model: ModelEntry) => {
    setSelectedModel(model.id);
    localStorage.setItem("disa_model", model.id);
    toasts.push({
      kind: "success",
      title: "Model Selected",
      message: `Now using ${model.label || model.id}`,
    });
  };

  const handleCompareModel = (model: ModelEntry) => {
    if (compareModels.find(m => m.id === model.id)) {
      setCompareModels(prev => prev.filter(m => m.id !== model.id));
    } else if (compareModels.length < 3) {
      setCompareModels(prev => [...prev, model]);
    } else {
      toasts.push({
        kind: "warning",
        title: "Comparison Limit",
        message: "You can compare up to 3 models at once.",
      });
    }
  };

  const handleBookmarkModel = (model: ModelEntry) => {
    const newBookmarks = new Set(bookmarkedModels);
    if (newBookmarks.has(model.id)) {
      newBookmarks.delete(model.id);
    } else {
      newBookmarks.add(model.id);
    }
    setBookmarkedModels(newBookmarks);
    saveBookmarks(newBookmarks);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Models</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Discover and compare AI models for your conversations
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search models, providers, or capabilities..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <Select
            value={filters.provider}
            onValueChange={(value) => setFilters(prev => ({ ...prev, provider: value }))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Providers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map(provider => (
                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.safety}
            onValueChange={(value) => setFilters(prev => ({ ...prev, safety: value }))}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Safety" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Safety</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="strict">Strict</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.pricing}
            onValueChange={(value) => setFilters(prev => ({ ...prev, pricing: value }))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Pricing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.contextLength}
            onValueChange={(value) => setFilters(prev => ({ ...prev, contextLength: value }))}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Context Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="small">Small (&lt;8K)</SelectItem>
              <SelectItem value="medium">Medium (8K-32K)</SelectItem>
              <SelectItem value="large">Large (32K-128K)</SelectItem>
              <SelectItem value="xlarge">XLarge (128K+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Compare Panel */}
      {compareModels.length > 0 && (
        <div className="mb-6 p-4 bg-accent-50 dark:bg-accent-950 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-accent-600" />
              <span className="font-medium">
                Comparing {compareModels.length} model{compareModels.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompareDialog(true)}
                disabled={compareModels.length < 2}
              >
                Compare Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCompareModels([])}
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {compareModels.map(model => (
              <Badge key={model.id} variant="secondary" className="flex items-center gap-1">
                {model.label || model.id}
                <button
                  onClick={() => handleCompareModel(model)}
                  className="ml-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} found
        </span>
        {bookmarkedModels.size > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const hasBookmarkFilter = filters.search === "bookmarked";
              setFilters(prev => ({
                ...prev,
                search: hasBookmarkFilter ? "" : "bookmarked"
              }));
            }}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Bookmarked ({bookmarkedModels.size})
          </Button>
        )}
      </div>

      {/* Model Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels
          .filter(model =>
            filters.search !== "bookmarked" || bookmarkedModels.has(model.id)
          )
          .map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            isSelected={selectedModel === model.id}
            onSelect={handleSelectModel}
            onCompare={handleCompareModel}
            onBookmark={handleBookmarkModel}
            isBookmarked={bookmarkedModels.has(model.id)}
          />
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-2">
            No models found
          </h3>
          <p className="text-neutral-500">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Compare Dialog */}
      <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Model Comparison</DialogTitle>
            <DialogDescription>
              Compare the selected models side by side
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compareModels.map(model => (
              <Card key={model.id}>
                <CardHeader>
                  <CardTitle className="text-base">{model.label || model.id}</CardTitle>
                  <CardDescription>{model.provider}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="font-medium text-sm">Pricing</div>
                    <div className="text-sm text-neutral-600">
                      Input: ${model.pricing?.in || 0}/1K<br/>
                      Output: ${model.pricing?.out || 0}/1K
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Context Length</div>
                    <div className="text-sm text-neutral-600">
                      {model.ctx ? `${model.ctx.toLocaleString()} tokens` : "Unknown"}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Safety Level</div>
                    <Badge variant="outline">{model.safety}</Badge>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Tags</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.tags.slice(0, 4).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}