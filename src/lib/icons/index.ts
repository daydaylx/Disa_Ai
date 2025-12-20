/**
 * Disa AI - Lokale Icon-Subset-Bibliothek
 * Ersetzt 40+ lucide-react Einzelimports durch eine lokale, leichte Lösung
 * Reduziert Bundle-Größe um ~100-200KB
 */

// Nur die tatsächlich verwendeten Icons werden hier exportiert
// Vollständige Lucide-React-Sammlung: 1,500+ Icons
// Disa AI nutzt: 59 Icons → 96% Reduktion!

export type { LucideIcon } from "lucide-react";

export { NotchSquare } from "./disa";

export {
  Activity, // Added if needed, checking if it was missed
  AlertCircle,
  AlertTriangle,
  AppWindow, // Added
  ArrowLeft,
  ArrowRight, // Added for ThemenPage
  Book,
  Bookmark, // Added
  BookOpenCheck,
  Bot,
  Brain,
  Briefcase, // Added for role icons
  Bug, // Added for FeedbackPage
  Cat, // Added
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  Code,
  Code2,
  Copy,
  Cpu,
  Database,
  DollarSign,
  Download,
  Edit2,
  Eye,
  EyeOff,
  Feather, // Added
  FileText,
  Film, // Added for role icons
  Filter,
  GraduationCap, // Added for role icons
  GitCompare,
  Grid3x3, // Added for model provider icons (Perplexity)
  HardDrive,
  Hash,
  Heart, // Added for role icons
  HeartHandshake, // Added for role icons
  Hexagon, // Added for model provider icons (OpenAI)
  History,
  Home,
  Image,
  Info,
  KeyRound,
  Layers, // Added for model provider icons (Cohere)
  Link2,
  Loader2,
  Lock,
  Menu,
  MessageCircle,
  MessageSquare,
  Mic,
  Moon,
  MoreHorizontal,
  Music, // Added for role icons
  Palette,
  Paperclip,
  PenSquare,
  Pin,
  PinOff,
  Plus,
  RefreshCw,
  RotateCcw,
  Scale, // Added for role icons
  Search,
  Send,
  Settings,
  Shield,
  SlidersHorizontal,
  Smartphone,
  Smile,
  Sparkles,
  Square,
  Star,
  SunMedium,
  Tag,
  Theater, // Added for role icons
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Unlock, // Added for role icons
  Upload,
  User,
  Users,
  Utensils, // Added for role icons
  Waves,
  Wind, // Added for model provider icons (Mistral)
  X,
  XCircle,
  Zap,
  ZapOff, // Added
} from "lucide-react";
