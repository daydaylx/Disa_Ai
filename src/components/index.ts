// Export most commonly used UI components - optimized based on actual usage
export { Button } from "./ui/button";
export { Input } from "./ui/input";
export { Textarea } from "./ui/textarea";

// Re-export components that are imported via index in other files
export { Badge } from "./ui/badge";
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
