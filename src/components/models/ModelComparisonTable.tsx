import type { EnhancedModel } from "../../types/enhanced-interfaces";
import { formatPricePerK } from "../../utils/pricing";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface ModelComparisonTableProps {
  models: EnhancedModel[];
}

export function ModelComparisonTable({ models }: ModelComparisonTableProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Eigenschaft</TableHead>
            {models.map((model) => (
              <TableHead key={model.id} className="text-center">
                {model.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Anbieter</TableCell>
            {models.map((model) => (
              <TableCell key={model.id} className="text-center">
                {model.provider}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Preis pro 1K Tokens</TableCell>
            {models.map((model) => (
              <TableCell key={model.id} className="text-center">
                {formatPricePerK(model.pricing.inputPrice)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Qualität</TableCell>
            {models.map((model) => (
              <TableCell key={model.id} className="text-center">
                {model.performance.quality}/10
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Geschwindigkeit</TableCell>
            {models.map((model) => (
              <TableCell key={model.id} className="text-center">
                {model.performance.speed}/10
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Kosten</TableCell>
            {models.map((model) => (
              <TableCell key={model.id} className="text-center">
                {model.performance.efficiency}/10
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Verfügbarkeit</TableCell>
            {models.map((model) => (
              <TableCell key={model.id} className="text-center">
                {model.performance.reliability}/10
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Tags</TableCell>
            {models.map((model) => (
              <TableCell key={model.id} className="text-center">
                <div className="flex flex-wrap gap-1 justify-center">
                  {(model.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-surface-subtle text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
