import { FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Document {
  name: string;
  expiryDate: Date;
  daysLeft: number;
}

const DocumentCard = () => {
  const documents: Document[] = [
    { name: "Insurance", expiryDate: new Date("2025-03-15"), daysLeft: 125 },
    { name: "Registration", expiryDate: new Date("2025-01-20"), daysLeft: 71 },
    { name: "Inspection", expiryDate: new Date("2024-12-10"), daysLeft: 30 },
  ];

  const nextExpiring = documents.reduce((prev, curr) => 
    curr.daysLeft < prev.daysLeft ? curr : prev
  );

  const getStatusColor = (daysLeft: number) => {
    if (daysLeft <= 30) return "destructive";
    if (daysLeft <= 60) return "default";
    return "outline";
  };

  const getStatusIcon = (daysLeft: number) => {
    if (daysLeft <= 30) return AlertCircle;
    return CheckCircle;
  };

  const StatusIcon = getStatusIcon(nextExpiring.daysLeft);

  return (
    <Card className="p-5 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-card-foreground">Document Expiry</h2>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <StatusIcon className={`w-5 h-5 ${nextExpiring.daysLeft <= 30 ? 'text-destructive' : 'text-success'}`} />
            <div>
              <p className="font-semibold text-card-foreground">{nextExpiring.name}</p>
              <p className="text-sm text-muted-foreground">Next to expire</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-card-foreground">{nextExpiring.daysLeft}</p>
            <p className="text-xs text-muted-foreground">days left</p>
          </div>
        </div>

        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.name} className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded-md transition-colors">
              <span className="text-sm text-card-foreground">{doc.name}</span>
              <Badge variant={getStatusColor(doc.daysLeft)} className="text-xs">
                {doc.daysLeft}d
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default DocumentCard;
