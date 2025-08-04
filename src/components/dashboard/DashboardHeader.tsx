import { Building2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const companies = [
  { id: "bbca", name: "Bank Central Asia Tbk (BBCA)" },
  { id: "bbri", name: "Bank Rakyat Indonesia Tbk (BBRI)" },
  { id: "bmri", name: "Bank Mandiri Tbk (BMRI)" },
  { id: "tlkm", name: "Telkom Indonesia Tbk (TLKM)" },
  { id: "unvr", name: "Unilever Indonesia Tbk (UNVR)" },
];

interface DashboardHeaderProps {
  selectedCompany: string;
  onCompanyChange: (value: string) => void;
}

export default function DashboardHeader({ selectedCompany, onCompanyChange }: DashboardHeaderProps) {
  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">IndonesiaFinance</h1>
        </div>
        
        <div className="h-6 w-px bg-border ml-2" />
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Company:</span>
          <Select value={selectedCompany} onValueChange={onCompanyChange}>
            <SelectTrigger className="w-72 bg-secondary/50 border-border hover:bg-secondary transition-colors">
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {companies.map((company) => (
                <SelectItem 
                  key={company.id} 
                  value={company.id}
                  className="hover:bg-muted focus:bg-muted"
                >
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select defaultValue="2024">
          <SelectTrigger className="w-24 bg-secondary/50 border-border hover:bg-secondary transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="sm" className="text-muted-foreground border-border hover:bg-secondary hover:text-foreground">
          Export
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </header>
  );
}