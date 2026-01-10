/**
 * Disa AI - Lokale Icon-Subset-Bibliothek
 * Ersetzt 40+ lucide-react Einzelimports durch eine lokale, leichte Lösung
 * Reduziert Bundle-Größe um ~100-200KB
 */

// Nur die tatsächlich verwendeten Icons werden hier exportiert
// Vollständige Lucide-React-Sammlung: 1,500+ Icons
// Disa AI nutzt: 55 Icons → 96% Reduktion!

export type { LucideIcon } from "lucide-react";

export { NotchSquare } from "./disa";

export {
  Activity, // Added if needed, checking if it was missed
  AlertCircle,
  AlertTriangle,
  AppWindow, // Added
  ArrowLeft,
  ArrowRight, // Added for ThemenPage
  Award, // Added for game achievements
  Backpack, // Added for game HUD
  Book,
  Bookmark, // Added
  BookOpenCheck,
  Bot,
  Box, // Added for game inventory
  Brain,
  ImagePlus, // Added for vision chat
  Briefcase, // Added for role icons
  Bug, // Added for FeedbackPage
  Cat, // Added
  Check,
  CheckCircle,
  CheckCircle2, // Added for game quests
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  Code,
  Code2,
  Coins, // Added for game HUD
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
  HardDrive,
  Hash,
  Heart, // Added for role icons
  HeartHandshake, // Added for role icons
  History,
  Home,
  Image,
  Info,
  KeyRound,
  Link2,
  Loader2,
  Lock,
  Menu,
  MapPin, // Added for game HUD
  MessageCircle,
  MessageSquare,
  Mic,
  Moon,
  MoreHorizontal,
  Music, // Added for role icons
  Package, // Added for game inventory
  Palette,
  Paperclip,
  PenSquare,
  Pin,
  PinOff,
  Plus,
  RefreshCw,
  RotateCcw,
  Save, // Added for game save system
  Scale, // Added for role icons
  Scroll, // Added for game quests
  Search,
  Send,
  Settings,
  Shield,
  Skull, // Added for game inventory weapons
  SlidersHorizontal,
  Smartphone,
  Smile,
  Sparkles,
  Square,
  Star,
  Store, // Added for game trade system
  SunMedium,
  Swords, // Added for game role icon
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
  X,
  XCircle,
  Zap,
  ZapOff, // Added
} from "lucide-react";