import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type RegulatoryAgency = 'FDA' | 'EMA' | 'PMDA' | 'NMPA' | 'MFDS' | 'HSA' | 'TGA';
export type ApprovalStatus = 'approved' | 'pending' | 'not_approved' | 'withdrawn';

interface RegulatoryBadgeProps {
  agency: RegulatoryAgency;
  status: ApprovalStatus;
  brandName?: string;
  approvalDate?: string;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const agencyConfig: Record<RegulatoryAgency, { 
  color: string; 
  bgColor: string; 
  borderColor: string;
  flag: string; 
  fullName: string;
  region: string;
}> = {
  FDA: { 
    color: 'text-blue-700 dark:text-blue-300', 
    bgColor: 'bg-blue-100 dark:bg-blue-900/40', 
    borderColor: 'border-blue-300 dark:border-blue-700',
    flag: '🇺🇸', 
    fullName: 'FDA', 
    region: 'USA' 
  },
  EMA: { 
    color: 'text-green-700 dark:text-green-300', 
    bgColor: 'bg-green-100 dark:bg-green-900/40', 
    borderColor: 'border-green-300 dark:border-green-700',
    flag: '🇪🇺', 
    fullName: 'EMA', 
    region: 'EU' 
  },
  PMDA: { 
    color: 'text-red-700 dark:text-red-300', 
    bgColor: 'bg-red-100 dark:bg-red-900/40', 
    borderColor: 'border-red-300 dark:border-red-700',
    flag: '🇯🇵', 
    fullName: 'PMDA', 
    region: 'Japan' 
  },
  NMPA: { 
    color: 'text-yellow-700 dark:text-yellow-300', 
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/40', 
    borderColor: 'border-yellow-300 dark:border-yellow-700',
    flag: '🇨🇳', 
    fullName: 'NMPA', 
    region: 'China' 
  },
  MFDS: { 
    color: 'text-purple-700 dark:text-purple-300', 
    bgColor: 'bg-purple-100 dark:bg-purple-900/40', 
    borderColor: 'border-purple-300 dark:border-purple-700',
    flag: '🇰🇷', 
    fullName: 'MFDS', 
    region: 'Korea' 
  },
  HSA: { 
    color: 'text-pink-700 dark:text-pink-300', 
    bgColor: 'bg-pink-100 dark:bg-pink-900/40', 
    borderColor: 'border-pink-300 dark:border-pink-700',
    flag: '🇸🇬', 
    fullName: 'HSA', 
    region: 'Singapore' 
  },
  TGA: { 
    color: 'text-teal-700 dark:text-teal-300', 
    bgColor: 'bg-teal-100 dark:bg-teal-900/40', 
    borderColor: 'border-teal-300 dark:border-teal-700',
    flag: '🇦🇺', 
    fullName: 'TGA', 
    region: 'Australia' 
  },
};

const statusConfig: Record<ApprovalStatus, { 
  icon: typeof CheckCircle; 
  label: string;
  statusColor: string;
}> = {
  approved: { 
    icon: CheckCircle, 
    label: 'Approved',
    statusColor: 'text-green-600 dark:text-green-400'
  },
  pending: { 
    icon: Clock, 
    label: 'Pending',
    statusColor: 'text-yellow-600 dark:text-yellow-400'
  },
  not_approved: { 
    icon: XCircle, 
    label: 'Not Approved',
    statusColor: 'text-gray-500 dark:text-gray-400'
  },
  withdrawn: { 
    icon: AlertTriangle, 
    label: 'Withdrawn',
    statusColor: 'text-red-600 dark:text-red-400'
  },
};

export function RegulatoryBadge({ 
  agency, 
  status, 
  brandName,
  approvalDate,
  showDetails = false,
  size = 'md',
  className 
}: RegulatoryBadgeProps) {
  const config = agencyConfig[agency];
  if (!config) {
    return null;
  }
  
  const statusInfo = statusConfig[status] || statusConfig['approved'];
  const StatusIcon = statusInfo.icon;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 min-h-[24px]',
    md: 'text-sm px-2 py-1 min-h-[32px]',
    lg: 'text-base px-3 py-1.5 min-h-[44px]',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  if (status === 'not_approved' && !showDetails) {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 opacity-60',
          sizeClasses[size],
          className
        )}
        data-testid={`badge-regulatory-${agency.toLowerCase()}-not-approved`}
      >
        <span className="mr-1">{config.flag}</span>
        <span className="line-through">{agency}</span>
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className={cn(
        config.bgColor, 
        config.color, 
        config.borderColor,
        sizeClasses[size],
        'flex items-center gap-1.5 font-medium',
        className
      )}
      data-testid={`badge-regulatory-${agency.toLowerCase()}-${status}`}
    >
      <span className="text-base leading-none">{config.flag}</span>
      <span className="font-semibold">{agency}</span>
      <StatusIcon className={cn(iconSizes[size], statusInfo.statusColor)} />
      {showDetails && brandName && (
        <span className="text-xs opacity-80">({brandName})</span>
      )}
    </Badge>
  );
}

interface RegulatoryBadgeGroupProps {
  approvals?: Array<{
    agency: RegulatoryAgency;
    status: ApprovalStatus;
    brandName?: string;
    approvalDate?: string;
  }>;
  selectedRegion?: string;
  size?: 'sm' | 'md' | 'lg';
  showAll?: boolean;
  maxDisplay?: number;
  className?: string;
}

export function RegulatoryBadgeGroup({ 
  approvals = [],
  selectedRegion,
  size = 'sm',
  showAll = false,
  maxDisplay = 4,
  className 
}: RegulatoryBadgeGroupProps) {
  if (!approvals || approvals.length === 0) {
    return (
      <span className="text-xs text-gray-400 italic">No regulatory data</span>
    );
  }

  // Sanitize approvals: filter out any without valid agency or status
  const validApprovals = approvals.filter(a => 
    a && a.agency && agencyConfig[a.agency] && (a.status || a.status === 'approved')
  ).map(a => ({
    ...a,
    status: a.status || 'approved' as ApprovalStatus
  }));

  const filteredApprovals = selectedRegion && selectedRegion !== 'all'
    ? validApprovals.filter(a => {
        if (selectedRegion === 'FDA') return a.agency === 'FDA';
        if (selectedRegion === 'EMA') return a.agency === 'EMA';
        if (selectedRegion === 'Asia') return ['PMDA', 'NMPA', 'MFDS'].includes(a.agency);
        if (selectedRegion === 'PMDA' || selectedRegion === 'NMPA' || selectedRegion === 'MFDS') {
          return a.agency === selectedRegion;
        }
        return true;
      })
    : validApprovals;

  const displayApprovals = showAll 
    ? filteredApprovals 
    : filteredApprovals.slice(0, maxDisplay);

  const remainingCount = filteredApprovals.length - displayApprovals.length;

  return (
    <div className={cn('flex flex-wrap gap-1.5 items-center', className)} data-testid="regulatory-badge-group">
      {displayApprovals.map((approval) => (
        <RegulatoryBadge
          key={approval.agency}
          agency={approval.agency}
          status={approval.status}
          brandName={approval.brandName}
          size={size}
        />
      ))}
      {remainingCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}

export function NotApprovedWarning({ 
  agency, 
  region 
}: { 
  agency: RegulatoryAgency; 
  region: string;
}) {
  const config = agencyConfig[agency];
  if (!config) {
    return null;
  }
  
  return (
    <div 
      className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-sm"
      data-testid={`warning-not-approved-${region.toLowerCase()}`}
    >
      <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
      <div>
        <span className="font-medium text-orange-700 dark:text-orange-300">
          Not approved in {config.region}
        </span>
        <p className="text-orange-600 dark:text-orange-400 text-xs mt-0.5">
          This medication has not received {agency} approval. Consult local regulations.
        </p>
      </div>
    </div>
  );
}
