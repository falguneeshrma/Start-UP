import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  X, 
  Star, 
  Clock, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight, 
  SlidersHorizontal, 
  Sparkles,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Code,
  Pill,
  Briefcase,
  FileText,
  Palette,
  Server,
  ExternalLink
} from 'lucide-react';
import { formatINR } from '../../utils/gst';
import { NavTab } from '../../components/common/Header';
import { useToast } from '../../components/common/Toast';
import { getProjects } from '../../api/client';
import { useHistoryModal } from '../../utils/useHistoryModal';
import { useCustomProjectForm } from '../../utils/customProject';
import { AnimatedHeading } from '../../components/common/AnimatedText';

interface BrowseProjectsProps {
  onNavigate: (tab: NavTab) => void;
  initialSearch?: string;
  onSelectProject?: (project: ProjectItem) => void;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  subsection?: string;
  tier: string;
  budget: number;
  rating: number;
  deliveryTime: string;
  image: string;
  description: string;
  tags: string[];
  features: string[];
  deliverables: string[];
}

export interface CategoryDefinition {
  id: string;
  name: string;
  icon: React.ElementType;
  subsections?: string[];
}

export const CATEGORIES_CONFIG: CategoryDefinition[] = [
  {
    id: 'engineering',
    name: 'Engineering projects',
    icon: Code,
    subsections: [
      'Web development',
      'AIML',
      'Cloud and devops',
      'IOT projects',
      'Data analytics projects'
    ]
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy thesis & projects',
    icon: Pill
  },
  {
    id: 'business',
    name: 'Business related project',
    icon: Briefcase
  },
  {
    id: 'research',
    name: 'Research paper publish',
    icon: FileText
  },
  {
    id: 'ui_ux',
    name: 'UI designing',
    icon: Palette
  },
  {
    id: 'deployment',
    name: 'Deployment Services',
    icon: Server
  }
];


const ALL_TECH_STACKS = [
  'React',
  'Python',
  'Node.js',
  'AWS',
  'Tailwind',
  'Docker',
  'PostgreSQL',
  'TypeScript',
  'Kubernetes',
  'PyTorch'
];

export const BrowseProjects: React.FC<BrowseProjectsProps> = ({ 
  onNavigate, 
  initialSearch = '',
  onSelectProject
}) => {
  const { showToast } = useToast();

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubsections, setSelectedSubsections] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [minBudget, setMinBudget] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const { openCustomProject } = useCustomProjectForm();

  const handleCloseProjectModal = useHistoryModal(
    !!selectedProject,
    () => setSelectedProject(null),
    'browse-project-quickview'
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['engineering']);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Project catalog — fetched from the backend (no hardcoded/dummy listings)
  const [projectCatalog, setProjectCatalog] = useState<ProjectItem[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState<boolean>(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsCatalogLoading(true);
    getProjects()
      .then((data) => {
        if (isMounted) setProjectCatalog((data as ProjectItem[]) || []);
      })
      .catch((err) => {
        if (isMounted) setCatalogError(err instanceof Error ? err.message : 'Failed to load projects');
      })
      .finally(() => {
        if (isMounted) setIsCatalogLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (initialSearch) {
      // Check if search matches a category name
      const matchedCat = CATEGORIES_CONFIG.find(
        c => c.name.toLowerCase() === initialSearch.toLowerCase()
      );
      if (matchedCat) {
        setSelectedCategories([matchedCat.name]);
      } else {
        setSearchQuery(initialSearch);
      }
    }
  }, [initialSearch]);

  // Toggle Bookmark
  const toggleBookmark = (id: string, title: string) => {
    setBookmarks(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast(`Removed "${title}" from bookmarks`, 'info');
        return prev.filter(item => item !== id);
      } else {
        showToast(`Saved "${title}" to bookmarks`, 'success');
        return [...prev, id];
      }
    });
  };

  // Toggle Category Accordion
  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  // Toggle Main Category Filter
  const toggleCategory = (catName: string) => {
    setSelectedCategories(prev => {
      const isSelected = prev.includes(catName);
      if (isSelected) {
        // If unchecking, also clear any subsections under this category if applicable
        const catDef = CATEGORIES_CONFIG.find(c => c.name === catName);
        if (catDef?.subsections) {
          setSelectedSubsections(sPrev => sPrev.filter(s => !catDef.subsections?.includes(s)));
        }
        return prev.filter(c => c !== catName);
      } else {
        return [...prev, catName];
      }
    });
  };

  // Toggle Subsection Filter
  const toggleSubsection = (subName: string, parentCatName: string) => {
    setSelectedSubsections(prev => {
      const isSelected = prev.includes(subName);
      if (isSelected) {
        return prev.filter(s => s !== subName);
      } else {
        // If selecting a subsection, also ensure the parent category is active or keep context
        if (!selectedCategories.includes(parentCatName)) {
          setSelectedCategories(cPrev => [...cPrev, parentCatName]);
        }
        return [...prev, subName];
      }
    });
  };

  // Toggle Tech Stack
  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubsections([]);
    setSelectedTechs([]);
    setMinBudget('');
    setMaxBudget('');
    setSearchQuery('');
    showToast('Filters reset', 'info');
  };

  // Remove single active filter tag
  const removeCategoryTag = (cat: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== cat));
    const catDef = CATEGORIES_CONFIG.find(c => c.name === cat);
    if (catDef?.subsections) {
      setSelectedSubsections(prev => prev.filter(s => !catDef.subsections?.includes(s)));
    }
  };

  const removeSubsectionTag = (sub: string) => {
    setSelectedSubsections(prev => prev.filter(s => s !== sub));
  };

  const removeTechTag = (tech: string) => {
    setSelectedTechs(prev => prev.filter(t => t !== tech));
  };

  // Filtering Logic
  const filteredProjects = useMemo(() => {
    return projectCatalog.filter(project => {
      // 1. Category and Subsection matching
      if (selectedCategories.length > 0) {
        const matchesCategory = selectedCategories.includes(project.category);
        if (!matchesCategory) {
          return false;
        }

        // If subsections are also selected, check if this project matches selected subsections
        if (selectedSubsections.length > 0) {
          // If the project has a subsection, it must be in selectedSubsections
          if (project.subsection && !selectedSubsections.includes(project.subsection)) {
            return false;
          }
        }
      }

      // 2. Tech stack filter
      if (selectedTechs.length > 0 && !selectedTechs.some(t => project.tags.includes(t))) {
        return false;
      }

      // 3. Budget Min filter
      if (minBudget && project.budget < Number(minBudget)) {
        return false;
      }

      // 4. Budget Max filter
      if (maxBudget && project.budget > Number(maxBudget)) {
        return false;
      }

      // 5. Search Query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesDesc = project.description.toLowerCase().includes(query);
        const matchesCategory = project.category.toLowerCase().includes(query);
        const matchesSubsection = project.subsection?.toLowerCase().includes(query) || false;
        const matchesTags = project.tags.some(t => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesSubsection && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [projectCatalog, selectedCategories, selectedSubsections, selectedTechs, minBudget, maxBudget, searchQuery]);

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubsections.length > 0 || selectedTechs.length > 0 || minBudget !== '' || maxBudget !== '' || searchQuery !== '';

  const handleOrderTemplate = (project: ProjectItem) => {
    if (onSelectProject) {
      onSelectProject(project);
    }
    showToast(`Template "${project.title}" loaded for custom requirement`, 'success');
    setSelectedProject(null);
    onNavigate('submit');
  };

  return (
    <div className="w-full bg-transparent min-h-[calc(100vh-80px)] pb-16">
      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Mobile Filter Bar & Quick Toggles */}
        <div className="md:hidden mb-4 flex items-center justify-between gap-2 bg-white dark:bg-[#080d1a] p-3 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl text-xs font-bold transition-all ${
              isMobileFilterOpen || hasActiveFilters
                ? 'border-zinc-800 dark:border-zinc-200 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                : 'border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 bg-gray-50 dark:bg-zinc-800 active:bg-gray-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>
              {isMobileFilterOpen ? 'Hide Filters' : hasActiveFilters ? `Filters (${selectedCategories.length + selectedSubsections.length + selectedTechs.length})` : 'Filter Projects'}
            </span>
          </button>
          
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 font-semibold px-2 py-1 hover:underline"
              >
                Reset
              </button>
            )}
            <span className="text-xs text-zinc-700 dark:text-zinc-300 font-mono font-bold">
              {filteredProjects.length} found
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          
          {/* Sidebar Filters (Desktop & Collapsible Mobile) */}
          <aside className={`${isMobileFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0 bg-white dark:bg-[#080d1a] border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 md:sticky md:top-28 shadow-sm`}>
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white font-headline">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-semibold transition-colors"
                >
                  Reset All
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Project Categories with Engineering Subsections */}
              <div>
                <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                  Categories & Subsections
                </h3>
                <div className="space-y-3">
                  {CATEGORIES_CONFIG.map(cat => {
                    const isChecked = selectedCategories.includes(cat.name);
                    const isExpanded = expandedCategories.includes(cat.id);
                    const hasSubsections = Boolean(cat.subsections && cat.subsections.length > 0);

                    return (
                      <div key={cat.id} className="border border-gray-100 dark:border-white/10 rounded-xl p-2.5 bg-gray-50/50 dark:bg-zinc-900/30 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <label className="flex items-center space-x-2.5 cursor-pointer select-none flex-grow">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleCategory(cat.name)}
                              className="h-4 w-4 rounded border-gray-300 dark:border-zinc-600 text-black dark:text-white focus:ring-black accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                            />
                            <span className={`text-xs sm:text-sm transition-colors ${isChecked ? 'font-bold text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300 font-medium'}`}>
                              {cat.name}
                            </span>
                          </label>

                          {hasSubsections && (
                            <button
                              type="button"
                              onClick={() => toggleCategoryExpand(cat.id)}
                              className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded"
                              title="Toggle Subsections"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Subsections rendering (indented) */}
                        {hasSubsections && isExpanded && (
                          <div className="mt-2.5 pl-6 pt-2 border-t border-gray-200/60 dark:border-zinc-700/60 space-y-2">
                            <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 dark:text-zinc-500 block mb-1">
                              Subsections:
                            </span>
                            {cat.subsections?.map(sub => {
                              const isSubChecked = selectedSubsections.includes(sub);
                              return (
                                <label 
                                  key={sub} 
                                  className="flex items-center space-x-2 cursor-pointer select-none group"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSubChecked}
                                    onChange={() => toggleSubsection(sub, cat.name)}
                                    className="h-3.5 w-3.5 rounded border-gray-300 dark:border-zinc-600 text-black focus:ring-black accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                                  />
                                  <span className={`text-xs transition-colors ${isSubChecked ? 'font-bold text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white'}`}>
                                    {sub}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Budget Range */}
              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                  Budget Range (INR)
                </h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    placeholder="Min"
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400 focus:ring-1 focus:ring-zinc-900 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                  <span className="text-zinc-400 font-bold">-</span>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="Max"
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400 focus:ring-1 focus:ring-zinc-900 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                  Tech Stack & Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_TECH_STACKS.map(tech => {
                    const isSelected = selectedTechs.includes(tech);
                    return (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`w-full mt-6 h-11 rounded-xl text-xs font-bold tracking-wide transition-all ${
                hasActiveFilters
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 cursor-pointer'
                  : 'bg-zinc-50 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
              }`}
            >
              Clear Filters
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow flex flex-col w-full">
            
            {/* Search & Active Filters Header */}
            <div className="mb-6 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 mb-1">
                <AnimatedHeading 
                  text="Explore & Get Projects" 
                  highlightWords={["Projects"]}
                  as="h1" 
                  className="!justify-start text-xl sm:text-2xl font-headline font-black text-zinc-900 dark:text-white" 
                />
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 shadow-2xs">
                  <span className="text-cyan-600 dark:text-cyan-400 font-black">{filteredProjects.length}</span>
                  <span>Projects Available</span>
                </div>
              </div>

              <div className="relative w-full">
                <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, subsections (AIML, Web, Cloud, IoT, Pharmacy, Research)..."
                  className="w-full h-14 pl-12 pr-10 rounded-xl border border-gray-200 dark:border-white/10 focus:border-zinc-900 dark:focus:border-white/30 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 shadow-sm text-base text-zinc-900 dark:text-zinc-100 bg-white dark:bg-[#080d1a] placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1 z-10 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Active Filter Chips */}
              {(selectedCategories.length > 0 || selectedSubsections.length > 0 || selectedTechs.length > 0 || minBudget || maxBudget) && (
                <div className="flex items-center justify-center gap-2 flex-wrap pt-1 text-center max-w-3xl mx-auto">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-1">Active:</span>
                  
                  {selectedCategories.map(cat => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold border border-zinc-900 dark:border-zinc-100"
                    >
                      {cat}
                      <button
                        onClick={() => removeCategoryTag(cat)}
                        className="text-zinc-300 dark:text-zinc-600 hover:text-white dark:hover:text-zinc-900 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}

                  {selectedSubsections.map(sub => (
                    <span
                      key={sub}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold border border-zinc-200 dark:border-zinc-700"
                    >
                      Sub: {sub}
                      <button
                        onClick={() => removeSubsectionTag(sub)}
                        className="text-zinc-500 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}

                  {selectedTechs.map(tech => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-semibold border border-zinc-200 dark:border-zinc-700"
                    >
                      {tech}
                      <button
                        onClick={() => removeTechTag(tech)}
                        className="text-zinc-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}

                  {(minBudget || maxBudget) && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-semibold border border-zinc-200 dark:border-zinc-700">
                      ₹{minBudget || '0'} - ₹{maxBudget || '∞'}
                      <button
                        onClick={() => { setMinBudget(''); setMaxBudget(''); }}
                        className="text-zinc-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold ml-2 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Loading / Error / Empty States */}
            {isCatalogLoading ? (
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-12 text-center my-8 animate-scale-in">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading project templates…</p>
              </div>
            ) : catalogError ? (
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-12 text-center my-8 animate-scale-in">
                <p className="text-sm text-red-500">{catalogError}</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-12 text-center my-8 animate-scale-in">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400 animate-float">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">No project templates found</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
                  Try adjusting your search criteria, category filters, or subsection filters.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold rounded-lg transition-colors active:scale-95 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                  <button
                    onClick={openCustomProject}
                    aria-label="Request Custom Project (opens Google Form in a new tab)"
                    className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-black dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-lg transition-colors active:scale-95 shadow-md cursor-pointer inline-flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-zinc-800 dark:focus:ring-cyan-400"
                  >
                    <span>Request Custom Project</span>
                    <ExternalLink className="w-3 h-3 opacity-70 shrink-0" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : (
              /* Projects Grid (Bento/Card Style) */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProjects.map((project, idx) => (
                  <article
                    key={project.id}
                    style={{ animationDelay: `${(idx % 6) * 60}ms` }}
                    className="bg-white dark:bg-zinc-950/35 dark:backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-black/40 hover:shadow-[0_16px_36px_rgba(0,0,0,0.18)] transition-all duration-300 flex flex-col group hover:-translate-y-1.5 border-hover glass-shine animate-fade-in-up"
                  >
                    {/* Thumbnail Image with Rating Badge & Bookmark */}
                    <div className="h-48 w-full relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="object-cover w-full h-full group-hover:scale-108 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <button
                          onClick={() => toggleBookmark(project.id, project.title)}
                          className="bg-white/95 dark:bg-zinc-900/40 dark:backdrop-blur-md p-1.5 rounded-md text-zinc-900 dark:text-zinc-100 shadow-sm hover:bg-white dark:hover:bg-zinc-800 transition-all active:scale-90 cursor-pointer"
                          title="Bookmark"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${
                            bookmarks.includes(project.id) ? 'fill-zinc-900 dark:fill-white text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'
                          }`} />
                        </button>
                        <div className="bg-white/95 dark:bg-zinc-900/40 dark:backdrop-blur-md text-zinc-900 dark:text-zinc-100 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1 border border-gray-200 dark:border-white/10 font-mono">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{project.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between items-center text-center">
                      <div className="w-full flex flex-col items-center">
                        <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-2 gap-2 text-center">
                          <div className="flex flex-col items-center sm:items-start">
                            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                              {project.category}
                            </span>
                            {project.subsection && (
                              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 dark:bg-zinc-300 animate-radar-ping"></span>
                                {project.subsection}
                              </span>
                            )}
                          </div>
                          <span className="text-lg font-bold text-zinc-900 dark:text-white font-headline">
                            {formatINR(project.budget)}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 line-clamp-1 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors font-headline text-center">
                          {project.title}
                        </h3>

                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed text-center">
                          {project.description}
                        </p>

                        {/* Tech stack tags */}
                        <div className="flex flex-wrap gap-1.5 mb-6 justify-center">
                          {project.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 rounded-md text-[11px] font-semibold font-mono hover:bg-zinc-200 dark:hover:bg-white/15 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="w-full bg-white dark:bg-white/10 text-zinc-900 dark:text-zinc-100 border border-zinc-900 dark:border-white/15 font-semibold text-sm rounded-xl py-2.5 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center gap-1.5 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:border-zinc-900 dark:group-hover:border-white group-hover:text-white dark:group-hover:text-zinc-900 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in"
          onClick={handleCloseProjectModal}
        >
          <div 
            className="bg-white dark:bg-[#080d1a] rounded-2xl sm:rounded-3xl w-[calc(100vw-2rem)] max-w-2xl max-h-[90dvh] overflow-y-auto smooth-touch-scroll shadow-2xl border border-zinc-200 dark:border-white/15 p-4 sm:p-8 relative text-zinc-900 dark:text-zinc-100 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseProjectModal}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-90 cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Header / Category / Price */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2">
              <span>{selectedProject.category}</span>
              {selectedProject.subsection && (
                <>
                  <span>•</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{selectedProject.subsection}</span>
                </>
              )}
              <span>•</span>
              <span className="text-zinc-700 dark:text-zinc-300">{selectedProject.tier}</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-headline mb-3">
              {selectedProject.title}
            </h2>

            <div className="flex items-center gap-3 sm:gap-4 mb-6 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-headline">
                {formatINR(selectedProject.budget)}
              </span>
              <span className="flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-300 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 sm:px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-zinc-500" /> Delivery: {selectedProject.deliveryTime}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 px-2.5 py-1 rounded-full font-mono">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {selectedProject.rating.toFixed(1)}
              </span>
            </div>

            {/* Image Preview */}
            <div className="h-44 sm:h-56 rounded-2xl overflow-hidden mb-6 border border-zinc-200 dark:border-zinc-700">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description */}
            <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6">
              {selectedProject.description}
            </p>

            {/* Tech Stack */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Tech Stack & Tools
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {selectedProject.tags.map(t => (
                  <span key={t} className="px-2.5 sm:px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-mono font-semibold hover:border-zinc-400 transition-colors">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Included Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedProject.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="mb-6 sm:mb-8 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2 text-zinc-900 dark:text-white font-bold text-xs">
                <Layers className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <span>Deliverables & Quality Assurance Guarantee</span>
              </div>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc list-inside">
                {selectedProject.deliverables.map((del, idx) => (
                  <li key={idx}>{del}</li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => handleOrderTemplate(selectedProject)}
                className="flex-1 py-3 sm:py-3.5 bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300 dark:text-amber-600" />
                <span>Order This Project Template</span>
              </button>
              <button
                onClick={handleCloseProjectModal}
                className="px-5 sm:px-6 py-3 sm:py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-xl font-semibold text-xs sm:text-sm transition-colors active:scale-95 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
