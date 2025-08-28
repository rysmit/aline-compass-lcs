import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Users, MapPin } from "lucide-react";

const sampleCommunities = [
  {
    id: "sunrise-manor",
    name: "Sunrise Manor",
    region: "northeast",
    highRiskCount: 4,
    totalResidents: 187,
    address: "123 Sunrise Ave, Boston, MA"
  },
  {
    id: "golden-valley",
    name: "Golden Valley",
    region: "southeast", 
    highRiskCount: 6,
    totalResidents: 164,
    address: "456 Valley Dr, Atlanta, GA"
  },
  {
    id: "maple-ridge",
    name: "Maple Ridge",
    region: "midwest",
    highRiskCount: 3,
    totalResidents: 142,
    address: "789 Maple St, Chicago, IL"
  }
];

const sampleResidents = [
  { id: 1, name: "Robert Thompson", community: "Sunrise Manor", riskScore: 85 },
  { id: 2, name: "Maria Garcia", community: "Golden Valley", riskScore: 72 },
  { id: 3, name: "James Wilson", community: "Maple Ridge", riskScore: 91 },
  { id: 4, name: "Linda Davis", community: "Sunrise Manor", riskScore: 68 }
];

export function ResidentNavigationHub() {
  const navigate = useNavigate();

  const handleCommunityClick = (community: typeof sampleCommunities[0]) => {
    navigate(`/region/${community.region}/community/${community.id}`);
  };

  const handleResidentClick = (resident: typeof sampleResidents[0]) => {
    const community = sampleCommunities.find(c => c.name === resident.community);
    if (community) {
      navigate(`/region/${community.region}/community/${community.id}/resident/${resident.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Resident Navigation</h2>
        <p className="text-muted-foreground">Access resident data with record stitching across systems</p>
      </div>


      {/* Direct Navigation Buttons */}
      <div className="flex gap-4 flex-wrap">
        <Button 
          onClick={() => navigate("/metric/high-risk-residents")}
          variant="outline"
        >
          View All High-Risk Residents
        </Button>
        <Button 
          onClick={() => navigate("/region/northeast/community/sunrise-manor")}
          variant="outline"
        >
          Sunrise Manor Dashboard
        </Button>
        <Button 
          onClick={() => navigate("/region/northeast/community/sunrise-manor/resident/1")}
        >
          View Sample Resident (Robert Thompson)
        </Button>
      </div>
    </div>
  );
}