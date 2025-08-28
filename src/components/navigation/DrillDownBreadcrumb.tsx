import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
  segment?: string; // For portfolio segment context
}

interface DrillDownBreadcrumbProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
}

export function DrillDownBreadcrumb({ items, showBackButton = true }: DrillDownBreadcrumbProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center gap-4 py-3 px-6 border-b border-border bg-card/50">
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}
      
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.href && index < items.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href} className="cursor-pointer">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}