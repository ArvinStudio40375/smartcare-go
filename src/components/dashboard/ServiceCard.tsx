import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  gradient?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  gradient = false 
}) => {
  return (
    <Card className={`card-surface hover:shadow-lg transition-all duration-300 ${gradient ? 'card-gradient text-white' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg ${gradient ? 'bg-white/20' : 'bg-primary/10'}`}>
            <Icon className={`h-6 w-6 ${gradient ? 'text-white' : 'text-primary'}`} />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${gradient ? 'text-white' : 'text-foreground'}`}>
              {title}
            </h3>
            <p className={`text-sm mb-3 ${gradient ? 'text-white/80' : 'text-muted-foreground'}`}>
              {description}
            </p>
            <Button
              onClick={onClick}
              variant={gradient ? "secondary" : "default"}
              size="sm"
              className={gradient ? "bg-white/20 text-white border-white/30 hover:bg-white/30" : ""}
            >
              Pilih Layanan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;