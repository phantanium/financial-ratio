// src/components/dashboard/DashboardHeader.tsx
import { useState } from "react";
import { Search, Bell, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Company, CompanyRatios } from "@/lib/apiService";

interface DashboardHeaderProps {
  selectedCompany: string;
  onCompanyChange: (company: string) => void;
  companies?: Company[];
  companyData?: CompanyRatios | null;
}

export default function DashboardHeader({ 
  selectedCompany, 
  onCompanyChange, 
  companies = [],
  companyData 
}: DashboardHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const selectedCompanyData = companies.find(c => c.ticker === selectedCompany);
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a 
            href="/" 
            className="text-xl font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
            title="Back to Home"
          >
            📊 Indonesian Finance
          </a>
          
          {/* Company Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[300px] justify-between">
                <div className="flex flex-col items-start">
                  <span className="font-medium">
                    {selectedCompanyData?.ticker || selectedCompany}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {selectedCompanyData?.name || 'Select Company'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[400px] p-2">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <DropdownMenuItem
                      key={company.ticker}
                      onClick={() => onCompanyChange(company.ticker)}
                      className="flex flex-col items-start p-3 cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{company.ticker}</span>
                        <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                          {company.sector}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {company.name}
                      </span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    {companies.length === 0 ? 'Loading companies...' : 'No companies found'}
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Company Info Badge */}
          {companyData && (
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-muted rounded-md">
                {companyData.sector}
              </span>
              <span>•</span>
              <span>Period: {companyData.latest_period}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}